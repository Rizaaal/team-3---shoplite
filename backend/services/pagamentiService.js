const db = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { getOrdineById, getDettagliOrdineByIdOrdine } = require('./ordiniService');

const metodiConsentitiDb = ['carta', 'paypal', 'bonifico', 'contrassegno'];

const createPaymentIntentForOrdine = async ({ idOrdine, metodo }) => {
  if (!metodo || !metodiConsentitiDb.includes(metodo)) {
    const error = new Error('Metodo di pagamento non valido');
    error.statusCode = 400;
    throw error;
  }

  if (metodo !== 'carta') {
    const error = new Error('Solo il metodo carta è supportato da Stripe payment intent');
    error.statusCode = 400;
    throw error;
  }

  const ordine = await getOrdineById(idOrdine);

  if (!ordine) {
    const error = new Error('Ordine non trovato');
    error.statusCode = 404;
    throw error;
  }

  if (!ordine.totale || Number(ordine.totale) <= 0) {
    const error = new Error('Totale ordine non valido');
    error.statusCode = 400;
    throw error;
  }

  const amount = Math.round(Number(ordine.totale) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'eur',
    payment_method_types: ['card'],
    metadata: {
      idOrdine: String(ordine.id),
      metodo,
    },
  });

  return {
    message: 'Pagamento in corso...',
    idOrdine: ordine.id,
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    stripeStatus: paymentIntent.status,
    totale: ordine.totale,
  };
};

const confirmPagamentoOrdine = async ({ idOrdine, paymentIntentId, metodo }) => {
  if (!paymentIntentId) {
    const error = new Error('paymentIntentId obbligatorio');
    error.statusCode = 400;
    throw error;
  }

  if (!metodo || !metodiConsentitiDb.includes(metodo)) {
    const error = new Error('Metodo di pagamento non valido');
    error.statusCode = 400;
    throw error;
  }

  const ordine = await getOrdineById(idOrdine);

  if (!ordine) {
    const error = new Error('Ordine non trovato');
    error.statusCode = 404;
    throw error;
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (!paymentIntent) {
    const error = new Error('PaymentIntent non trovato');
    error.statusCode = 404;
    throw error;
  }

  if (String(paymentIntent.metadata.idOrdine) !== String(idOrdine)) {
    const error = new Error('Il payment intent non appartiene a questo ordine');
    error.statusCode = 400;
    throw error;
  }

  if (paymentIntent.status !== 'succeeded') {
    const error = new Error(`Pagamento non completato. Stato Stripe: ${paymentIntent.status}`);
    error.statusCode = 400;
    throw error;
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Evita doppia conferma pagamento sullo stesso ordine
    const [existingRows] = await connection.query(
      `
      SELECT id_dettaglio_pagamento
      FROM dettaglio_pagamento
      WHERE id_ordine = ?
      LIMIT 1
      `,
      [idOrdine],
    );

    if (existingRows.length > 0) {
      await connection.commit();

      return {
        message: 'Pagamento già confermato per questo ordine',
        idOrdine,
        paymentIntentId,
      };
    }

    // Recupera righe ordine per verificare stock prima della sottrazione
    const dettagliOrdine = await getDettagliOrdineByIdOrdine(idOrdine);

    for (const dettaglio of dettagliOrdine) {
      const [prodottoRows] = await connection.query(
        `
        SELECT
          id_prodotto,
          nome,
          stock
        FROM prodotti
        WHERE id_prodotto = ?
        LIMIT 1
        `,
        [dettaglio.idProdotto],
      );

      if (prodottoRows.length === 0) {
        const error = new Error(`Prodotto con id ${dettaglio.idProdotto} non trovato`);
        error.statusCode = 404;
        throw error;
      }

      const prodotto = prodottoRows[0];

      if (Number(prodotto.stock) < Number(dettaglio.quantita)) {
        const error = new Error(`Stock insufficiente per il prodotto ${prodotto.nome}`);
        error.statusCode = 400;
        throw error;
      }
    }

    // Scala stock solo dopo conferma pagamento
    for (const dettaglio of dettagliOrdine) {
      await connection.query(
        `
        UPDATE prodotti
        SET stock = stock - ?
        WHERE id_prodotto = ?
        `,
        [dettaglio.quantita, dettaglio.idProdotto],
      );
    }

    // Registra il pagamento
    const [pagamentoResult] = await connection.query(
      `
      INSERT INTO pagamenti (
        metodo,
        importo,
        stato
      )
      VALUES (?, ?, 'completato')
      `,
      [metodo, ordine.totale],
    );

    const idPagamento = pagamentoResult.insertId;

    // Collega ordine e pagamento
    await connection.query(
      `
      INSERT INTO dettaglio_pagamento (
        id_ordine,
        id_pagamento,
        riferimento_transazione
      )
      VALUES (?, ?, ?)
      `,
      [idOrdine, idPagamento, paymentIntentId],
    );

    // Aggiorna stato ordine
    await connection.query(
      `
      UPDATE ordini
      SET stato = 'pagato'
      WHERE id_ordine = ?
      `,
      [idOrdine],
    );

    await connection.commit();

    return {
      message: 'Pagamento confermato con successo',
      ordine: {
        ...ordine,
        stato: 'pagato',
      },
      pagamento: {
        idPagamento,
        riferimentoTransazione: paymentIntentId,
        metodo,
        importo: ordine.totale,
        stato: 'completato',
      },
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createPaymentIntentForOrdine,
  confirmPagamentoOrdine,
};
