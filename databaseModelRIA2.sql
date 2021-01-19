-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.11-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for labels
CREATE DATABASE IF NOT EXISTS `labels` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `labels`;

-- Dumping structure for table labels.files
CREATE TABLE IF NOT EXISTS `files` (
  `fileId` int(11) NOT NULL AUTO_INCREMENT,
  `fileName` varchar(256) NOT NULL,
  `lastAnalysisDate` datetime NOT NULL DEFAULT '2000-01-01 00:00:00',
  PRIMARY KEY (`fileId`),
  UNIQUE KEY `fileName` (`fileName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table labels.files: ~1 rows (approximately)
DELETE FROM `files`;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` (`fileId`, `fileName`, `lastAnalysisDate`) VALUES
	(1, 'gandhi.jpg', '2021-01-07 13:00:49');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;

-- Dumping structure for table labels.labelresults
CREATE TABLE IF NOT EXISTS `labelresults` (
  `labelResultId` int(11) NOT NULL AUTO_INCREMENT,
  `labelDescription` varchar(150) NOT NULL,
  `labelValue` varchar(150) NOT NULL,
  `confidenceRate` double NOT NULL,
  `fileId` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`labelResultId`),
  KEY `fileId` (`fileId`),
  CONSTRAINT `fileId` FOREIGN KEY (`fileId`) REFERENCES `files` (`fileId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table labels.labelresults: ~2 rows (approximately)
DELETE FROM `labelresults`;
/*!40000 ALTER TABLE `labelresults` DISABLE KEYS */;
INSERT INTO `labelresults` (`labelResultId`, `labelDescription`, `labelValue`, `confidenceRate`, `fileId`) VALUES
	????
/*!40000 ALTER TABLE `labelresults` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
