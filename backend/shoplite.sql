-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Mar 19, 2026 alle 17:07
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shoplite`
--
CREATE DATABASE IF NOT EXISTS `shoplite` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `shoplite`;

-- --------------------------------------------------------

--
-- Struttura della tabella `clienti`
--




CREATE TABLE IF NOT EXISTS `clienti` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cognome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `indirizzo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- Aggiunta account admin
--

INSERT IGNORE INTO `clienti` (`id_cliente`, `nome`, `cognome`, `email`, `indirizzo`, `created_at`, `role`, `password`) VALUES
(1, 'Giulio', 'Verdi', 'verdi@mail.com', 'via gabribaldi, 56', '2026-03-17 15:57:57', 'admin', '$2b$10$quiK/KyMGzwzve13u6R4juQB7qYNt0QNGTBScaJOv8I3GHxO/6guG');

--
-- Struttura della tabella `dettaglio_ordine`
--

CREATE TABLE IF NOT EXISTS `dettaglio_ordine` (
  `id_dettaglio` int(11) NOT NULL AUTO_INCREMENT,
  `id_ordine` int(11) NOT NULL,
  `id_prodotto` int(11) NOT NULL,
  `quantita` int(11) NOT NULL,
  `prezzo_unitario` decimal(10,2) NOT NULL,
  `subtotale` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_dettaglio`),
  KEY `fk_ordine` (`id_ordine`),
  KEY `fk_prodotto` (`id_prodotto`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------

--
-- Struttura della tabella `dettaglio_pagamento`
--

CREATE TABLE IF NOT EXISTS `dettaglio_pagamento` (
  `id_dettaglio_pagamento` int(11) NOT NULL AUTO_INCREMENT,
  `id_ordine` int(11) NOT NULL,
  `id_pagamento` int(11) NOT NULL,
  `riferimento_transazione` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_dettaglio_pagamento`),
  KEY `fk_ordine_pagamento` (`id_ordine`),
  KEY `fk_pagamento` (`id_pagamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `ordini`
--

CREATE TABLE IF NOT EXISTS `ordini` (
  `id_ordine` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11),
  `data_ordine` datetime DEFAULT current_timestamp(),
  `stato` enum('in_attesa','pagato','spedito','annullato') DEFAULT 'in_attesa',
  `totale` decimal(10,2) DEFAULT 0.00,
  `indirizzo_spedizione` varchar(255) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `city` varchar(100) NOT NULL,
  `email_cliente` varchar(255) NOT NULL,
  `nome_cliente` varchar(100) DEFAULT NULL,
  `cognome_cliente` varchar(100) DEFAULT NULL,
  `guest_token` varchar(100) DEFAULT NULL,
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL,
  `payment_status` varchar(50) NOT NULL DEFAULT 'requires_payment',
  PRIMARY KEY (`id_ordine`),
  KEY `fk_cliente_ordine` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `pagamenti`
--

CREATE TABLE IF NOT EXISTS `pagamenti` (
  `id_pagamento` int(11) NOT NULL AUTO_INCREMENT,
  `metodo` enum('carta','paypal','bonifico','contrassegno') NOT NULL,
  `importo` decimal(10,2) NOT NULL,
  `stato` enum('in_attesa','completato','fallito','rimborsato') DEFAULT 'in_attesa',
  `data_pagamento` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_pagamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotti`
--

CREATE TABLE IF NOT EXISTS `prodotti` (
  `id_prodotto` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(150) NOT NULL,
  `descrizione` text DEFAULT NULL,
  `prezzo` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `categoria` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `image` varchar(255) NOT NULL,
  PRIMARY KEY (`id_prodotto`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
