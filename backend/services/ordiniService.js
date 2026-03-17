const db = require('../config/db');

const mapOrdineRow = (row) => {
  return {
    id: row.id_ordine,
    idCliente: row.id_cliente,
    dataOrdine: row.data_ordine,
    stato: row.stato,
    totale: Number(row.totale),
    indirizzoSpedizione: row.indirizzo_spedizione,
    postalCode: row.postal_code,
    city: row.city,
  };
};

const getOrdineById = async (idOrdine) => {
  const [rows] = await db.query(
    `
    SELECT
      id_ordine,
      id_cliente,
      data_ordine,
      stato,
      totale,
      indirizzo_spedizione,
      postal_code,
      city
    FROM ordini
    WHERE id_ordine = ?
    LIMIT 1
    `,
    [idOrdine],
  );

  if (rows.length === 0) {
    return null;
  }

  return mapOrdineRow(rows[0]);
};

const getDettagliOrdineByIdOrdine = async (idOrdine) => {
  const [rows] = await db.query(
    `
    SELECT
      do.id_dettaglio,
      do.id_ordine,
      do.id_prodotto,
      p.nome AS nome_prodotto,
      do.quantita,
      do.prezzo_unitario,
      do.subtotale
    FROM dettaglio_ordine do
    INNER JOIN prodotti p ON p.id_prodotto = do.id_prodotto
    WHERE do.id_ordine = ?
    ORDER BY do.id_dettaglio ASC
    `,
    [idOrdine],
  );

  return rows.map((row) => ({
    idDettaglio: row.id_dettaglio,
    idOrdine: row.id_ordine,
    idProdotto: row.id_prodotto,
    nomeProdotto: row.nome_prodotto,
    quantita: row.quantita,
    prezzoUnitario: Number(row.prezzo_unitario),
    subtotale: Number(row.subtotale),
  }));
};

const getOrdineCompletoById = async (idOrdine) => {
  const ordine = await getOrdineById(idOrdine);

  if (!ordine) {
    return null;
  }

  const dettagli = await getDettagliOrdineByIdOrdine(idOrdine);

  return {
    ...ordine,
    dettagli,
  };
};

const createOrdine = async ({ idCliente, prodotti, indirizzoSpedizione, postalCode, city }) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Verifica che il cliente esista
    const [clienteRows] = await connection.query(
      `
      SELECT id_cliente
      FROM clienti
      WHERE id_cliente = ?
      LIMIT 1
      `,
      [idCliente],
    );

    if (clienteRows.length === 0) {
      const error = new Error('Cliente non trovato');
      error.statusCode = 404;
      throw error;
    }

    // L'ordine deve contenere almeno un prodotto
    if (!Array.isArray(prodotti) || prodotti.length === 0) {
      const error = new Error("L'ordine deve contenere almeno un prodotto");
      error.statusCode = 400;
      throw error;
    }

    let totaleOrdine = 0;
    const righeOrdine = [];

    for (const item of prodotti) {
      const idProdotto = Number(item.idProdotto);
      const quantita = Number(item.quantita);

      if (!idProdotto || !quantita || quantita <= 0) {
        const error = new Error('Prodotti ordine non validi');
        error.statusCode = 400;
        throw error;
      }

      // Verifica esistenza prodotto e disponibilità stock
      // Qui NON sottraiamo ancora lo stock
      const [prodottoRows] = await connection.query(
        `
        SELECT
          id_prodotto,
          nome,
          prezzo,
          stock
        FROM prodotti
        WHERE id_prodotto = ?
        LIMIT 1
        `,
        [idProdotto],
      );

      if (prodottoRows.length === 0) {
        const error = new Error(`Prodotto con id ${idProdotto} non trovato`);
        error.statusCode = 404;
        throw error;
      }

      const prodotto = prodottoRows[0];

      if (Number(prodotto.stock) < quantita) {
        const error = new Error(`Stock insufficiente per il prodotto ${prodotto.nome}`);
        error.statusCode = 400;
        throw error;
      }

      const prezzoUnitario = Number(prodotto.prezzo);
      const subtotale = prezzoUnitario * quantita;

      totaleOrdine += subtotale;

      righeOrdine.push({
        idProdotto,
        quantita,
        prezzoUnitario,
        subtotale,
      });
    }

    // Creazione testata ordine
    const [ordineResult] = await connection.query(
      `
      INSERT INTO ordini (
        id_cliente,
        stato,
        totale,
        indirizzo_spedizione,
        postal_code,
        city
      )
      VALUES (?, 'in_attesa', ?, ?, ?, ?)
      `,
      [idCliente, totaleOrdine, indirizzoSpedizione, postalCode, city],
    );

    const idOrdine = ordineResult.insertId;

    // Creazione righe ordine
    for (const riga of righeOrdine) {
      await connection.query(
        `
        INSERT INTO dettaglio_ordine (
          id_ordine,
          id_prodotto,
          quantita,
          prezzo_unitario,
          subtotale
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [idOrdine, riga.idProdotto, riga.quantita, riga.prezzoUnitario, riga.subtotale],
      );
    }

    await connection.commit();

    return getOrdineCompletoById(idOrdine);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getOrdineById,
  getDettagliOrdineByIdOrdine,
  getOrdineCompletoById,
  createOrdine,
};
