-- MySQL dump 10.13  Distrib 5.7.42, for Linux (x86_64)
--
-- Host: localhost    Database: verifast
-- ------------------------------------------------------
-- Server version	5.7.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `agents`
--

DROP TABLE IF EXISTS `agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agents` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cityId` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `address` text,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `active` int(1) DEFAULT '1',
  `added` datetime DEFAULT NULL,
  `addedBy` int(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agents`
--

LOCK TABLES `agents` WRITE;
/*!40000 ALTER TABLE `agents` DISABLE KEYS */;
/*!40000 ALTER TABLE `agents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `areas`
--

DROP TABLE IF EXISTS `areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `areas` (
  `zip` int(7) unsigned NOT NULL AUTO_INCREMENT,
  `clusterId` int(9) DEFAULT NULL,
  `cityId` int(9) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `zip1` int(7) DEFAULT NULL,
  `zip2` int(7) DEFAULT NULL,
  `zip3` int(7) DEFAULT NULL,
  PRIMARY KEY (`zip`)
) ENGINE=InnoDB AUTO_INCREMENT=500099 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `areas`
--

LOCK TABLES `areas` WRITE;
/*!40000 ALTER TABLE `areas` DISABLE KEYS */;
INSERT INTO `areas` VALUES (500001,1,1,'Nampally',1,NULL,NULL,NULL),(500002,6,1,'Charminar',1,NULL,NULL,NULL),(500003,1,1,'Secunderabad',1,NULL,NULL,NULL),(500004,1,1,'Khairatabad',1,NULL,NULL,NULL),(500005,2,1,'Bandlaguda',1,NULL,NULL,NULL),(500006,1,1,'Asifnagar',1,NULL,NULL,NULL),(500007,1,1,'Secunderabad',1,NULL,NULL,NULL),(500008,2,1,'Golconda',1,NULL,NULL,NULL),(500009,5,1,'Tirumalagiri',1,NULL,NULL,NULL),(500010,5,1,'Alwal',1,NULL,NULL,NULL),(500011,5,1,'Bowenpally',1,NULL,NULL,NULL),(500012,6,1,'Begumbazar',1,NULL,NULL,NULL),(500013,1,1,'Amberpet',1,NULL,NULL,NULL),(500014,5,1,'Hakimpet',1,NULL,NULL,NULL),(500015,5,1,'Tirumalagiri',1,NULL,NULL,NULL),(500016,1,1,'Begumpet',1,NULL,NULL,NULL),(500017,5,1,'Lallaguda',1,NULL,NULL,NULL),(500018,5,1,'Moosapet',1,NULL,NULL,NULL),(500019,3,1,'Lingampally',1,NULL,NULL,NULL),(500020,6,1,'Musheerabad',1,NULL,NULL,NULL),(500022,1,1,'Khairatabad',1,NULL,NULL,NULL),(500023,6,1,'Yakutpura',1,NULL,NULL,NULL),(500024,6,1,'Saidabad',1,NULL,NULL,NULL),(500025,1,1,'Padmaraonagar',1,NULL,NULL,NULL),(500026,1,1,'West Marredpally',1,NULL,NULL,NULL),(500027,1,1,'Nampally',1,NULL,NULL,NULL),(500028,1,1,'Asifnagar',1,NULL,NULL,NULL),(500029,6,1,'Himayathnagar',1,NULL,NULL,NULL),(500030,2,1,'Rajendranagar',1,NULL,NULL,NULL),(500031,2,1,'Golconda',1,NULL,NULL,NULL),(500032,3,1,'Gachibowli',1,NULL,NULL,NULL),(500033,2,1,'Shaikpet',1,NULL,NULL,NULL),(500034,1,1,'Khairatabad',1,NULL,NULL,NULL),(500035,4,1,'Saroornagar',1,NULL,NULL,NULL),(500036,6,1,'Saidabad',1,NULL,NULL,NULL),(500037,5,1,'Balanagar',1,NULL,NULL,NULL),(500038,1,1,'Ameerpet',1,NULL,NULL,NULL),(500039,1,1,'Hyderabad',1,NULL,NULL,NULL),(500040,5,1,'Moulali',1,NULL,NULL,NULL),(500041,1,1,'Khairatabad',1,NULL,NULL,NULL),(500042,5,1,'Balanagar',1,NULL,NULL,NULL),(500043,3,1,'Bahadurpalli',1,NULL,NULL,NULL),(500044,6,1,'Musheerabad',1,NULL,NULL,NULL),(500045,1,1,'Khairatabad',1,NULL,NULL,NULL),(500046,3,1,'Serilingampally',1,NULL,NULL,NULL),(500047,5,1,'Malkajgiri',1,NULL,NULL,NULL),(500048,2,1,'Rajendranagar',1,NULL,NULL,NULL),(500049,3,1,'Miyapur',1,NULL,NULL,NULL),(500050,3,1,'Chandanagar',1,NULL,NULL,NULL),(500051,4,1,'Uppal',1,NULL,NULL,NULL),(500052,2,1,'Rajendranagar',1,NULL,NULL,NULL),(500053,6,1,'Charminar',1,NULL,NULL,NULL),(500054,5,1,'Quthbullapur',1,NULL,NULL,NULL),(500055,5,1,'Quthbullapur',1,NULL,NULL,NULL),(500056,5,1,'Neredmet',1,NULL,NULL,NULL),(500057,2,1,'Asifnagar',1,NULL,NULL,NULL),(500058,2,1,'Bandlaguda',1,NULL,NULL,NULL),(500059,6,1,'Saidabad',1,NULL,NULL,NULL),(500060,4,1,'Saroornagar',1,NULL,NULL,NULL),(500061,1,1,'Secunderabad',1,NULL,NULL,NULL),(500062,1,1,'Secunderabad',1,NULL,NULL,NULL),(500063,6,1,'Himayathnagar',1,NULL,NULL,NULL),(500064,6,1,'Bahadurpura',1,NULL,NULL,NULL),(500065,6,1,'Charminar',1,NULL,NULL,NULL),(500066,6,1,'Charminar',1,NULL,NULL,NULL),(500067,3,1,'Suchitra Junction',1,NULL,NULL,NULL),(500068,4,1,'Hayathnagar',1,NULL,NULL,NULL),(500069,2,1,'Bandlaguda',1,NULL,NULL,NULL),(500070,4,1,'Vanasathalipuram',1,NULL,NULL,NULL),(500072,3,1,'Kukatpally',1,NULL,NULL,NULL),(500073,1,1,'Khairatabad',1,NULL,NULL,NULL),(500074,4,1,'L B Nagar',1,NULL,NULL,NULL),(500075,2,1,'Kokapet',1,NULL,NULL,NULL),(500076,4,1,'Uppal',1,NULL,NULL,NULL),(500077,2,1,'Rajendranagar',1,NULL,NULL,NULL),(500078,5,1,'Shamirpet',1,NULL,NULL,NULL),(500079,4,1,'Saroornagar',1,NULL,NULL,NULL),(500080,1,1,'Secunderabad',1,NULL,NULL,NULL),(500081,2,1,'HiTech City',1,NULL,NULL,NULL),(500082,1,1,'Somajiguda',1,NULL,NULL,NULL),(500083,5,1,'Nagaram',1,NULL,NULL,NULL),(500084,3,1,'Kondapur',1,NULL,NULL,NULL),(500085,3,1,'Jntu Kukatpally',1,NULL,NULL,NULL),(500086,2,1,'Rajendranagar',1,NULL,NULL,NULL),(500087,5,1,'JJ Nagar Colony',1,NULL,NULL,NULL),(500088,5,1,'Katchavanisingaram',1,NULL,NULL,NULL),(500089,2,1,'Manikonda',1,NULL,NULL,NULL),(500090,5,1,'Qutubullapur',1,NULL,NULL,NULL),(500091,2,1,'Golconda',1,NULL,NULL,NULL),(500092,4,1,'Boduppal',1,NULL,NULL,NULL),(500093,2,1,'Vikasnagar',1,NULL,NULL,NULL),(500094,5,1,'Sainikpuri',1,NULL,NULL,NULL),(500095,6,1,'Sultan Bazar',1,NULL,NULL,NULL),(500096,2,1,'Shaikpet',1,NULL,NULL,NULL),(500097,4,1,'saroornagar',1,NULL,NULL,NULL),(500098,5,1,'Ghatkesar',1,NULL,NULL,NULL);
/*!40000 ALTER TABLE `areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cities` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `stateId` int(9) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `areas` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,1,'Hyderabad',1,NULL);
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` text,
  `phone` varchar(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `active` int(1) DEFAULT '1',
  `added` datetime DEFAULT NULL,
  `excelId` int(9) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` int(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Omega India Bangalore I',NULL,NULL,NULL,1,'2023-07-23 01:11:04',4,NULL,NULL),(2,'Omega India Chennai I',NULL,NULL,NULL,1,'2023-07-23 01:12:28',6,NULL,NULL),(3,'Omega India Hyderabad II',NULL,NULL,NULL,1,'2023-07-23 01:12:29',6,NULL,NULL),(4,'Omega India Bangalore II',NULL,NULL,NULL,1,'2023-07-23 01:12:46',6,NULL,NULL),(5,'REVENTICS INDIA Hyderabad I',NULL,NULL,NULL,1,'2023-07-23 01:12:56',6,NULL,NULL),(6,'Omega India Trichy I',NULL,NULL,NULL,1,'2023-07-23 01:13:50',6,NULL,NULL),(7,'TGSPL INDIA Chennai II',NULL,NULL,NULL,1,'2023-07-23 01:14:03',6,NULL,NULL),(8,'TGSPL INDIA Chennai I',NULL,NULL,NULL,1,'2023-07-23 01:14:19',6,NULL,NULL),(9,'Omega India Chennai II',NULL,NULL,NULL,1,'2023-07-23 01:14:26',6,NULL,NULL),(10,'Marlabs',NULL,NULL,NULL,1,'2023-07-23 01:14:38',6,NULL,NULL);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clusters`
--

DROP TABLE IF EXISTS `clusters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clusters` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cityId` int(9) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clusters`
--

LOCK TABLES `clusters` WRITE;
/*!40000 ALTER TABLE `clusters` DISABLE KEYS */;
INSERT INTO `clusters` VALUES (1,1,'Zone1 - Central',1),(2,1,'Zone2 - South West',1),(3,1,'Zone3 - North West',1),(4,1,'Zone4 - South East',1),(5,1,'Zone5 - North East',1),(6,1,'Zone6 - Old City',1);
/*!40000 ALTER TABLE `clusters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `excels`
--

DROP TABLE IF EXISTS `excels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `excels` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `path` varchar(100) DEFAULT NULL,
  `uploaded` datetime DEFAULT NULL,
  `uploadedBy` int(9) DEFAULT NULL,
  `processed` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `excels`
--

LOCK TABLES `excels` WRITE;
/*!40000 ALTER TABLE `excels` DISABLE KEYS */;
INSERT INTO `excels` VALUES (1,NULL,'DailyExcels2x.lsx','/uploads/230723013418_DailyExcels2.xlsx','2023-07-23 01:34:18',NULL,NULL),(2,NULL,'DailyExcels3.xlsx','/uploads/230723013626_DailyExcels3.xlsx','2023-07-23 01:36:26',NULL,NULL),(3,NULL,'DailyExcels3.xlsx','/uploads/230723013733_DailyExcels3.xlsx','2023-07-23 01:37:33',NULL,NULL),(4,NULL,'DailyExcels3.xlsx','/uploads/230723014025_DailyExcels3.xlsx','2023-07-23 01:40:25',NULL,NULL),(5,NULL,'DailyExcels3.xlsx','/uploads/230723014247_DailyExcels3.xlsx','2023-07-23 01:42:47',NULL,NULL),(6,NULL,'DailyExcels3.xlsx','/uploads/230723023528_DailyExcels3.xlsx','2023-07-23 02:35:28',NULL,NULL),(7,NULL,'DailyExcels3.xlsx','/uploads/230723023634_DailyExcels3.xlsx','2023-07-23 02:36:34',NULL,NULL);
/*!40000 ALTER TABLE `excels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `files` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `excelId` int(9) DEFAULT NULL,
  `vendorId` int(9) DEFAULT '1',
  `clientId` int(9) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'job' COMMENT 'banking,job,it',
  `cityId` int(6) DEFAULT NULL,
  `zip` int(7) DEFAULT NULL,
  `fileId` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `parent` varchar(100) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `landmark` varchar(100) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `phone1` varchar(30) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `assigned` datetime DEFAULT NULL,
  `assignedTo` int(9) DEFAULT NULL,
  `accepted` datetime DEFAULT NULL,
  `started` datetime DEFAULT NULL,
  `location` point DEFAULT NULL,
  `mapLink` varchar(200) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `done` datetime DEFAULT NULL,
  `approvedBy` int(9) DEFAULT NULL,
  `submitted` datetime DEFAULT NULL,
  `userRemarks` text,
  `submissionRemarks` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (1,7,1,NULL,'job',1,500019,NULL,'GUKANTI HARIKA','GUKANTI SUDHAKAR','HOUSE NO - 10-55, GOPI NAGAR COLONY, SERILINGAMPALLY',NULL,'7013058259',NULL,'2023-07-23 02:36:34',NULL,1,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL),(2,7,1,NULL,'job',1,500070,NULL,'BAYYA SUNIL','SARANGAPANI','PLOT NO.-105, PHENT HOUSE, ROAD NO-5, NAGARJUNA COLONY, HASTINAPURAM, HYDERABAD',NULL,'7981645730',NULL,'2023-07-23 02:36:35',NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL),(3,7,1,NULL,'job',1,500090,NULL,'VANNE KARUNA MONIKA','VANNE JAYANAND','PLOT NO 10, FLAT NO 14, LANE 7, SHIVALAYAM ROAD , LINGAMPALLY   HYDERABAD',NULL,'917329930922, 9573897494',NULL,'2023-07-23 02:36:36',NULL,1,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(9) DEFAULT NULL,
  `fileId` int(9) DEFAULT NULL,
  `amount` int(4) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `isPaid` tinyint(1) DEFAULT NULL,
  `paid` datetime DEFAULT NULL,
  `payoutId` int(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payout_benificiaries`
--

DROP TABLE IF EXISTS `payout_benificiaries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payout_benificiaries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountNumber` varchar(30) DEFAULT NULL,
  `ifscCode` varchar(30) DEFAULT NULL,
  `benificiaryId` varchar(30) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payout_benificiaries`
--

LOCK TABLES `payout_benificiaries` WRITE;
/*!40000 ALTER TABLE `payout_benificiaries` DISABLE KEYS */;
/*!40000 ALTER TABLE `payout_benificiaries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payouts`
--

DROP TABLE IF EXISTS `payouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payouts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payoutBenificiaryId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `info` text,
  `approvedBy` varchar(50) DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `rejectedMessage` text,
  `paymentStatus` varchar(20) DEFAULT NULL,
  `response` varchar(100) DEFAULT NULL,
  `transferId` varchar(50) DEFAULT NULL,
  `paymentRefId` varchar(50) DEFAULT NULL,
  `utr` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payoutBenificiaryId` (`payoutBenificiaryId`),
  KEY `fileId` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payouts`
--

LOCK TABLES `payouts` WRITE;
/*!40000 ALTER TABLE `payouts` DISABLE KEYS */;
/*!40000 ALTER TABLE `payouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `photos` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `fileId` int(9) DEFAULT NULL,
  `photo` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `states` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `cities` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,'Telangana',1,NULL);
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_areas`
--

DROP TABLE IF EXISTS `user_areas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_areas` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(9) DEFAULT NULL,
  `zip` int(7) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_areas`
--

LOCK TABLES `user_areas` WRITE;
/*!40000 ALTER TABLE `user_areas` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_areas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_file_history`
--

DROP TABLE IF EXISTS `user_file_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_file_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(9) DEFAULT NULL,
  `fileId` int(9) DEFAULT NULL,
  `assigned` datetime DEFAULT NULL,
  `accepted` datetime DEFAULT NULL,
  `rejected` datetime DEFAULT NULL,
  `reason` varchar(200) DEFAULT NULL,
  `failed` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_file_history`
--

LOCK TABLES `user_file_history` WRITE;
/*!40000 ALTER TABLE `user_file_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_file_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_leaves`
--

DROP TABLE IF EXISTS `user_leaves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_leaves` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(9) DEFAULT NULL,
  `start` date DEFAULT NULL,
  `end` date DEFAULT NULL,
  `reason` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_leaves`
--

LOCK TABLES `user_leaves` WRITE;
/*!40000 ALTER TABLE `user_leaves` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_leaves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_settings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(9) DEFAULT NULL,
  `location` point DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `area` int(9) DEFAULT NULL,
  `area1` int(9) DEFAULT NULL,
  `area2` int(9) DEFAULT NULL,
  `area3` int(9) DEFAULT NULL,
  `onLeave` tinyint(1) DEFAULT NULL COMMENT 'a',
  `onLeaveTill` datetime DEFAULT NULL,
  `referredBy` int(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_settings`
--

LOCK TABLES `user_settings` WRITE;
/*!40000 ALTER TABLE `user_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(9) unsigned NOT NULL AUTO_INCREMENT,
  `agentId` int(9) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `pic` varchar(100) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `canAssign` tinyint(1) DEFAULT NULL,
  `userType` int(2) DEFAULT '0' COMMENT '0-user(fe),3-executivemanager,5-filesmanager,9-admin',
  `lastLogin` datetime DEFAULT NULL,
  `clusterId` int(9) DEFAULT NULL,
  `cityId` int(9) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  `location` point DEFAULT NULL,
  `addedBy` int(9) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `updatedBy` int(9) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `amountPaid` int(8) DEFAULT NULL,
  `assigned` int(6) DEFAULT NULL,
  `accepted` int(6) DEFAULT NULL,
  `rejected` int(6) DEFAULT NULL,
  `failed` int(6) DEFAULT NULL,
  `rating` double(3,2) DEFAULT NULL,
  `fcm` text,
  `available` tinyint(1) DEFAULT NULL,
  `referredBy` int(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,'sam','sam@verifast.solutions','8971795818',NULL,'sam',1,NULL,9,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_contacts`
--

DROP TABLE IF EXISTS `vendor_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_contacts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `vendorId` int(9) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `phone` varchar(12) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `addedBy` int(9) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` int(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_contacts`
--

LOCK TABLES `vendor_contacts` WRITE;
/*!40000 ALTER TABLE `vendor_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendors` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` text,
  `phone` varchar(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `active` int(1) DEFAULT '1',
  `added` datetime DEFAULT NULL,
  `addedBy` int(9) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` int(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-16 19:53:00
