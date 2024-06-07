-- MySQL dump 10.13  Distrib 5.7.42, for Linux (x86_64)
--
-- Host: localhost    Database: erp_db
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
-- Table structure for table `activities`
--

DROP TABLE IF EXISTS `activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `activity` varchar(50) DEFAULT NULL,
  `update` text,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,NULL,'NewVendor','New Vendor \'Lokesh Reddy\' is added','2023-06-22 15:26:09','lokesh',1,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ar_calls_histories`
--

DROP TABLE IF EXISTS `ar_calls_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ar_calls_histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `comments` text,
  `isTdsAr` int(11) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  CONSTRAINT `ar_calls_histories_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ar_calls_histories`
--

LOCK TABLES `ar_calls_histories` WRITE;
/*!40000 ALTER TABLE `ar_calls_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `ar_calls_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_item_assignments`
--

DROP TABLE IF EXISTS `asset_item_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asset_item_assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assetItemId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `cabinId` int(11) DEFAULT NULL,
  `deskId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `assignedBy` varchar(30) DEFAULT NULL,
  `assignedOn` datetime DEFAULT NULL,
  `deassignedBy` varchar(50) DEFAULT NULL,
  `deassignedOn` datetime DEFAULT NULL,
  `assetMovementId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assetItemId` (`assetItemId`),
  KEY `buildingId` (`buildingId`),
  KEY `officeId` (`officeId`),
  KEY `cabinId` (`cabinId`),
  KEY `deskId` (`deskId`),
  KEY `assetMovementId` (`assetMovementId`),
  CONSTRAINT `asset_item_assignments_ibfk_10` FOREIGN KEY (`cabinId`) REFERENCES `cabins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_item_assignments_ibfk_11` FOREIGN KEY (`deskId`) REFERENCES `desks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_item_assignments_ibfk_12` FOREIGN KEY (`assetMovementId`) REFERENCES `asset_item_movements` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_item_assignments_ibfk_7` FOREIGN KEY (`assetItemId`) REFERENCES `asset_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_item_assignments_ibfk_8` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_item_assignments_ibfk_9` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_item_assignments`
--

LOCK TABLES `asset_item_assignments` WRITE;
/*!40000 ALTER TABLE `asset_item_assignments` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_item_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_item_movements`
--

DROP TABLE IF EXISTS `asset_item_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asset_item_movements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assetItemId` int(11) DEFAULT NULL,
  `purpose` varchar(20) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `storeId` int(11) DEFAULT NULL,
  `assetServiceProviderId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `pdfId` int(11) DEFAULT NULL,
  `approvedBy` varchar(50) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assetItemId` (`assetItemId`),
  KEY `buildingId` (`buildingId`),
  KEY `storeId` (`storeId`),
  KEY `assetServiceProviderId` (`assetServiceProviderId`),
  KEY `pdfId` (`pdfId`),
  CONSTRAINT `asset_item_movements_ibfk_10` FOREIGN KEY (`pdfId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_item_movements_ibfk_6` FOREIGN KEY (`assetItemId`) REFERENCES `asset_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_item_movements_ibfk_7` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_item_movements_ibfk_8` FOREIGN KEY (`storeId`) REFERENCES `asset_stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_item_movements_ibfk_9` FOREIGN KEY (`assetServiceProviderId`) REFERENCES `asset_service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_item_movements`
--

LOCK TABLES `asset_item_movements` WRITE;
/*!40000 ALTER TABLE `asset_item_movements` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_item_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_items`
--

DROP TABLE IF EXISTS `asset_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asset_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assetId` int(11) DEFAULT NULL,
  `currentBuildingId` int(11) DEFAULT NULL,
  `tagNo` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `warrentyNo` varchar(100) DEFAULT NULL,
  `warrentyFile` varchar(100) DEFAULT NULL,
  `taggedBy` varchar(100) DEFAULT NULL,
  `taggedOn` datetime DEFAULT NULL,
  `verified` int(11) DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assetId` (`assetId`),
  CONSTRAINT `asset_items_ibfk_1` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_items`
--

LOCK TABLES `asset_items` WRITE;
/*!40000 ALTER TABLE `asset_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_service_providers`
--

DROP TABLE IF EXISTS `asset_service_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asset_service_providers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `landline` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  CONSTRAINT `asset_service_providers_ibfk_1` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_service_providers`
--

LOCK TABLES `asset_service_providers` WRITE;
/*!40000 ALTER TABLE `asset_service_providers` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_service_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_stores`
--

DROP TABLE IF EXISTS `asset_stores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asset_stores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `locationId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `managerId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `locationId` (`locationId`),
  KEY `managerId` (`managerId`),
  CONSTRAINT `asset_stores_ibfk_3` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_stores_ibfk_4` FOREIGN KEY (`managerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_stores`
--

LOCK TABLES `asset_stores` WRITE;
/*!40000 ALTER TABLE `asset_stores` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_stores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asset_warrenties`
--

DROP TABLE IF EXISTS `asset_warrenties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asset_warrenties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `assetId` int(11) DEFAULT NULL,
  `purchasedDate` datetime DEFAULT NULL,
  `warrentyPeriod` int(11) DEFAULT NULL,
  `expiryDate` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assetId` (`assetId`),
  CONSTRAINT `asset_warrenties_ibfk_1` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset_warrenties`
--

LOCK TABLES `asset_warrenties` WRITE;
/*!40000 ALTER TABLE `asset_warrenties` DISABLE KEYS */;
/*!40000 ALTER TABLE `asset_warrenties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assets`
--

DROP TABLE IF EXISTS `assets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) DEFAULT NULL,
  `purchaseOrderId` int(11) DEFAULT NULL,
  `purchaseItemId` int(11) DEFAULT NULL,
  `purchaseItemDeliveryId` int(11) DEFAULT NULL,
  `skuCatId` int(11) DEFAULT NULL,
  `skuId` int(11) DEFAULT NULL,
  `vendorId` int(11) DEFAULT NULL,
  `assetServiceProviderId` int(11) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `price` double(11,2) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` datetime DEFAULT NULL,
  `manufacturer` varchar(100) DEFAULT '',
  `modelName` varchar(50) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `purchaseItemId` (`purchaseItemId`),
  KEY `purchaseItemDeliveryId` (`purchaseItemDeliveryId`),
  KEY `skuCatId` (`skuCatId`),
  KEY `skuId` (`skuId`),
  KEY `vendorId` (`vendorId`),
  KEY `assetServiceProviderId` (`assetServiceProviderId`),
  CONSTRAINT `assets_ibfk_10` FOREIGN KEY (`purchaseOrderId`) REFERENCES `vendor_purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `assets_ibfk_11` FOREIGN KEY (`purchaseItemId`) REFERENCES `vendor_purchase_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `assets_ibfk_12` FOREIGN KEY (`purchaseItemDeliveryId`) REFERENCES `vendor_purchase_item_deliveries` (`id`),
  CONSTRAINT `assets_ibfk_13` FOREIGN KEY (`skuCatId`) REFERENCES `sku_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `assets_ibfk_14` FOREIGN KEY (`skuId`) REFERENCES `skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `assets_ibfk_15` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `assets_ibfk_16` FOREIGN KEY (`assetServiceProviderId`) REFERENCES `asset_service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `assets_ibfk_9` FOREIGN KEY (`projectId`) REFERENCES `vendor_projects` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assets`
--

LOCK TABLES `assets` WRITE;
/*!40000 ALTER TABLE `assets` DISABLE KEYS */;
/*!40000 ALTER TABLE `assets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill_queue_gsts`
--

DROP TABLE IF EXISTS `bill_queue_gsts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bill_queue_gsts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `billId` int(11) DEFAULT NULL,
  `slab` int(11) NOT NULL,
  `gst` double(11,2) DEFAULT NULL,
  `tds` double(11,2) DEFAULT NULL,
  `igst` double(11,2) DEFAULT NULL,
  `cgst` double(11,2) DEFAULT NULL,
  `sgst` double(11,2) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `billId` (`billId`),
  CONSTRAINT `bill_queue_gsts_ibfk_1` FOREIGN KEY (`billId`) REFERENCES `bills_queue` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill_queue_gsts`
--

LOCK TABLES `bill_queue_gsts` WRITE;
/*!40000 ALTER TABLE `bill_queue_gsts` DISABLE KEYS */;
/*!40000 ALTER TABLE `bill_queue_gsts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills_queue`
--

DROP TABLE IF EXISTS `bills_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bills_queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opexTypeId` int(11) DEFAULT NULL,
  `vendorId` int(11) DEFAULT NULL,
  `gstFileId` int(11) DEFAULT NULL,
  `projectId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `serviceProviderId` int(11) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `billDate` date DEFAULT NULL,
  `dateFrom` date DEFAULT NULL,
  `dateTo` date DEFAULT NULL,
  `billDueDate` date DEFAULT NULL,
  `serviceProviderText` varchar(100) DEFAULT NULL,
  `billType` varchar(20) DEFAULT NULL,
  `paymentType` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `addedBy` varchar(50) DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT NULL,
  `notes` text,
  `noVendor` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `prepaid` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills_queue`
--

LOCK TABLES `bills_queue` WRITE;
/*!40000 ALTER TABLE `bills_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `bills_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills_queues`
--

DROP TABLE IF EXISTS `bills_queues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bills_queues` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opexTypeId` int(11) DEFAULT NULL,
  `vendorId` int(11) DEFAULT NULL,
  `gstFileId` int(11) DEFAULT NULL,
  `projectId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `serviceProviderId` int(11) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `billDate` date DEFAULT NULL,
  `dateFrom` date DEFAULT NULL,
  `dateTo` date DEFAULT NULL,
  `billDueDate` date DEFAULT NULL,
  `serviceProviderText` varchar(100) DEFAULT NULL,
  `billType` varchar(20) DEFAULT NULL,
  `paymentType` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `addedBy` varchar(50) DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT NULL,
  `notes` text,
  `noVendor` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `prepaid` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `vendorId` (`vendorId`),
  KEY `gstFileId` (`gstFileId`),
  KEY `projectId` (`projectId`),
  KEY `buildingId` (`buildingId`),
  KEY `officeId` (`officeId`),
  KEY `serviceProviderId` (`serviceProviderId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `bills_queues_ibfk_10` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_queues_ibfk_11` FOREIGN KEY (`gstFileId`) REFERENCES `bill_queue_gsts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_queues_ibfk_12` FOREIGN KEY (`projectId`) REFERENCES `vendor_projects` (`id`),
  CONSTRAINT `bills_queues_ibfk_13` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_queues_ibfk_14` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_queues_ibfk_15` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_queues_ibfk_16` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bills_queues_ibfk_9` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills_queues`
--

LOCK TABLES `bills_queues` WRITE;
/*!40000 ALTER TABLE `bills_queues` DISABLE KEYS */;
/*!40000 ALTER TABLE `bills_queues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booked_desks`
--

DROP TABLE IF EXISTS `booked_desks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booked_desks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `facilitySetId` int(11) DEFAULT NULL,
  `deskId` int(11) DEFAULT NULL,
  `contractId` int(11) DEFAULT NULL,
  `area` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `started` date DEFAULT NULL,
  `ended` date DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `facilitySetId` (`facilitySetId`),
  KEY `deskId` (`deskId`),
  KEY `contractId` (`contractId`),
  CONSTRAINT `booked_desks_ibfk_5` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `booked_desks_ibfk_6` FOREIGN KEY (`facilitySetId`) REFERENCES `facility_sets` (`id`),
  CONSTRAINT `booked_desks_ibfk_7` FOREIGN KEY (`deskId`) REFERENCES `desks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `booked_desks_ibfk_8` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booked_desks`
--

LOCK TABLES `booked_desks` WRITE;
/*!40000 ALTER TABLE `booked_desks` DISABLE KEYS */;
/*!40000 ALTER TABLE `booked_desks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_mails`
--

DROP TABLE IF EXISTS `booking_mails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `booking_mails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `mailId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_mails_mailId_bookingId_unique` (`bookingId`,`mailId`),
  KEY `mailId` (`mailId`),
  CONSTRAINT `booking_mails_ibfk_3` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `booking_mails_ibfk_4` FOREIGN KEY (`mailId`) REFERENCES `mails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_mails`
--

LOCK TABLES `booking_mails` WRITE;
/*!40000 ALTER TABLE `booking_mails` DISABLE KEYS */;
/*!40000 ALTER TABLE `booking_mails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) DEFAULT NULL,
  `locationId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `exitRequestId` int(11) DEFAULT NULL,
  `offices` varchar(200) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `refNo` varchar(20) DEFAULT NULL,
  `reserved` datetime DEFAULT NULL,
  `started` datetime DEFAULT NULL,
  `ended` datetime DEFAULT NULL,
  `sqftArea` int(11) DEFAULT NULL,
  `desks` int(11) DEFAULT NULL,
  `cabins` int(11) DEFAULT NULL,
  `itLedgerAdded` int(11) DEFAULT NULL,
  `itLedgerSettled` int(11) DEFAULT NULL,
  `contractId` int(11) DEFAULT NULL,
  `invoiced` double(12,2) DEFAULT NULL,
  `paid` double(12,2) DEFAULT NULL,
  `due` double(12,2) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `locationId` (`locationId`),
  KEY `officeId` (`officeId`),
  KEY `companyId` (`companyId`),
  KEY `exitRequestId` (`exitRequestId`),
  KEY `contractId` (`contractId`),
  CONSTRAINT `bookings_ibfk_10` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_11` FOREIGN KEY (`exitRequestId`) REFERENCES `exit_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_12` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_7` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bookings_ibfk_8` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`),
  CONSTRAINT `bookings_ibfk_9` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_amc_items`
--

DROP TABLE IF EXISTS `building_amc_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_amc_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `updatedBy` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_amc_items`
--

LOCK TABLES `building_amc_items` WRITE;
/*!40000 ALTER TABLE `building_amc_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_amc_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_amcs`
--

DROP TABLE IF EXISTS `building_amcs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_amcs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amcItemId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `notes` text,
  `responsibility` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `updatedBy` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `amcItemId` (`amcItemId`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `building_amcs_ibfk_3` FOREIGN KEY (`amcItemId`) REFERENCES `building_amc_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `building_amcs_ibfk_4` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_amcs`
--

LOCK TABLES `building_amcs` WRITE;
/*!40000 ALTER TABLE `building_amcs` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_amcs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_contacts`
--

DROP TABLE IF EXISTS `building_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buildingId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `purposes` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `updatedBy` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `addedBy` varchar(50) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `building_contacts_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_contacts`
--

LOCK TABLES `building_contacts` WRITE;
/*!40000 ALTER TABLE `building_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_contract_terms`
--

DROP TABLE IF EXISTS `building_contract_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_contract_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buildingId` int(11) DEFAULT NULL,
  `term` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `info` text,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `building_contract_terms_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_contract_terms`
--

LOCK TABLES `building_contract_terms` WRITE;
/*!40000 ALTER TABLE `building_contract_terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_contract_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_images`
--

DROP TABLE IF EXISTS `building_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buildingId` int(11) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `building_images_imageId_buildingId_unique` (`buildingId`,`imageId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `building_images_ibfk_3` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `building_images_ibfk_4` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_images`
--

LOCK TABLES `building_images` WRITE;
/*!40000 ALTER TABLE `building_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_properties`
--

DROP TABLE IF EXISTS `building_properties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_properties` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `size` varchar(100) DEFAULT NULL,
  `floors` int(11) DEFAULT NULL,
  `locationId` int(11) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `landmark` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `quarter` varchar(20) DEFAULT NULL,
  `priority` varchar(20) DEFAULT NULL,
  `sqftAreaImage` varchar(100) DEFAULT NULL,
  `buildupArea` int(11) DEFAULT NULL,
  `carpetArea` int(11) DEFAULT NULL,
  `shortlisted` int(11) DEFAULT NULL,
  `expectedLive` datetime DEFAULT NULL,
  `handover` datetime DEFAULT NULL,
  `sqftPrice` double(8,2) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `locationId` (`locationId`),
  CONSTRAINT `building_properties_ibfk_1` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_properties`
--

LOCK TABLES `building_properties` WRITE;
/*!40000 ALTER TABLE `building_properties` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_properties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_property_contacts`
--

DROP TABLE IF EXISTS `building_property_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_property_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `propertyId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `purposes` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `updatedBy` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `addedBy` varchar(50) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `propertyId` (`propertyId`),
  CONSTRAINT `building_property_contacts_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `building_properties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_property_contacts`
--

LOCK TABLES `building_property_contacts` WRITE;
/*!40000 ALTER TABLE `building_property_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_property_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_property_contract_negotiations`
--

DROP TABLE IF EXISTS `building_property_contract_negotiations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_property_contract_negotiations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `propertyId` int(11) DEFAULT NULL,
  `propertyContractId` int(11) DEFAULT NULL,
  `carpetAreaPricing` int(11) DEFAULT NULL,
  `expectedSqftPrice` double(5,2) DEFAULT NULL,
  `expectedMaintenancePrice` double(9,2) DEFAULT NULL,
  `expectedRent` double(9,2) DEFAULT NULL,
  `expectedDeposit` double(9,2) DEFAULT NULL,
  `expectedHandover` datetime DEFAULT NULL,
  `expectedRentFree` int(11) DEFAULT NULL,
  `negotiatedSqftPrice` double(5,2) DEFAULT NULL,
  `negotiatedRent` double(9,2) DEFAULT NULL,
  `negotiatedDeposit` double(9,2) DEFAULT NULL,
  `negotiatedMaintenancePrice` double(9,2) DEFAULT NULL,
  `negotiatedHandover` datetime DEFAULT NULL,
  `negotiatedRentFree` int(11) DEFAULT NULL,
  `targetedSqftPrice` double(5,2) DEFAULT NULL,
  `targetedRent` double(9,2) DEFAULT NULL,
  `targetedDeposit` double(9,2) DEFAULT NULL,
  `targetedHandover` datetime DEFAULT NULL,
  `targetedRentFree` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `comments` text,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `propertyId` (`propertyId`),
  KEY `propertyContractId` (`propertyContractId`),
  CONSTRAINT `building_property_contract_negotiations_ibfk_3` FOREIGN KEY (`propertyId`) REFERENCES `building_properties` (`id`),
  CONSTRAINT `building_property_contract_negotiations_ibfk_4` FOREIGN KEY (`propertyContractId`) REFERENCES `building_property_contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_property_contract_negotiations`
--

LOCK TABLES `building_property_contract_negotiations` WRITE;
/*!40000 ALTER TABLE `building_property_contract_negotiations` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_property_contract_negotiations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_property_contracts`
--

DROP TABLE IF EXISTS `building_property_contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_property_contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `propertyId` int(11) DEFAULT NULL,
  `expectedSqftPrice` int(11) DEFAULT NULL,
  `expectedRent` int(11) DEFAULT NULL,
  `expectedDeposit` int(11) DEFAULT NULL,
  `expectedMaintenancePrice` int(11) DEFAULT NULL,
  `expectedHandover` datetime DEFAULT NULL,
  `negotiableSqftPrice` int(11) DEFAULT NULL,
  `negotiableRent` int(11) DEFAULT NULL,
  `negotiableDeposit` int(11) DEFAULT NULL,
  `negotiableHandover` datetime DEFAULT NULL,
  `negotiableMaintenancePrice` int(11) DEFAULT NULL,
  `finalSqftPrice` int(11) DEFAULT NULL,
  `finalRent` int(11) DEFAULT NULL,
  `finalDeposit` int(11) DEFAULT NULL,
  `finalMaintenancePrice` int(11) DEFAULT NULL,
  `finalHandover` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `initiatedBy` varchar(50) DEFAULT NULL,
  `closedBy` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `propertyId` (`propertyId`),
  CONSTRAINT `building_property_contracts_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `building_properties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_property_contracts`
--

LOCK TABLES `building_property_contracts` WRITE;
/*!40000 ALTER TABLE `building_property_contracts` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_property_contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_property_images`
--

DROP TABLE IF EXISTS `building_property_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_property_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `propertyId` int(11) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `building_property_images_imageId_propertyId_unique` (`propertyId`,`imageId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `building_property_images_ibfk_3` FOREIGN KEY (`propertyId`) REFERENCES `building_properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `building_property_images_ibfk_4` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_property_images`
--

LOCK TABLES `building_property_images` WRITE;
/*!40000 ALTER TABLE `building_property_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_property_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_service_assignees`
--

DROP TABLE IF EXISTS `building_service_assignees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_service_assignees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buildingServiceId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buildingServiceId` (`buildingServiceId`),
  KEY `userId` (`userId`),
  CONSTRAINT `building_service_assignees_ibfk_3` FOREIGN KEY (`buildingServiceId`) REFERENCES `building_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `building_service_assignees_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_service_assignees`
--

LOCK TABLES `building_service_assignees` WRITE;
/*!40000 ALTER TABLE `building_service_assignees` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_service_assignees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `building_services`
--

DROP TABLE IF EXISTS `building_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `building_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buildingId` int(11) DEFAULT NULL,
  `serviceCode` varchar(10) DEFAULT NULL,
  `serviceNotes` text,
  `clientNotes` text,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `building_services_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `building_services`
--

LOCK TABLES `building_services` WRITE;
/*!40000 ALTER TABLE `building_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `building_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buildings`
--

DROP TABLE IF EXISTS `buildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buildings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `size` varchar(100) DEFAULT NULL,
  `floors` int(11) DEFAULT NULL,
  `locationId` int(11) DEFAULT NULL,
  `street` varchar(100) DEFAULT NULL,
  `landmark` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `image` varchar(200) DEFAULT NULL,
  `webUrl` varchar(200) DEFAULT NULL,
  `description` text,
  `active` int(11) DEFAULT '0',
  `isServiceable` int(11) DEFAULT '0',
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `avgDeskPrice` double(7,2) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `allowedDeskSizes` varchar(200) DEFAULT NULL,
  `buildupArea` int(11) DEFAULT NULL,
  `carpetArea` int(11) DEFAULT NULL,
  `sba` int(11) DEFAULT NULL,
  `chargeableArea` int(11) DEFAULT NULL,
  `rentFreeDays` int(11) DEFAULT NULL,
  `expectedLive` datetime DEFAULT NULL,
  `handover` datetime DEFAULT NULL,
  `lastDate` datetime DEFAULT NULL,
  `sqftPrice` double(8,2) DEFAULT NULL,
  `agreementId` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `locationId` (`locationId`),
  KEY `agreementId` (`agreementId`),
  CONSTRAINT `buildings_ibfk_3` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `buildings_ibfk_4` FOREIGN KEY (`agreementId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildings`
--

LOCK TABLES `buildings` WRITE;
/*!40000 ALTER TABLE `buildings` DISABLE KEYS */;
INSERT INTO `buildings` VALUES (1,'Tech Park','undefinedxundefined',NULL,1,'HSR','Block 4','Block 4',NULL,NULL,'Block 4',0,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,'Tech Park','undefinedxundefined',NULL,1,'HSR','Block 4','Block 4',NULL,NULL,'INFO',1,0,1.000000,1.000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,'Tech Park','undefinedxundefined',NULL,1,'HSR','Block 4','Block 4',NULL,NULL,NULL,1,0,1.000000,1.000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(4,'Tech Park','undefinedxundefined',NULL,NULL,'HSR','Block 4','Block 4',NULL,NULL,NULL,1,0,1.000000,1.000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(5,'Hyderabad','undefinedxundefined',NULL,NULL,'HSR','Block 4','Block 4',NULL,NULL,NULL,1,0,1.000000,2.000000,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `buildings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_terms`
--

DROP TABLE IF EXISTS `business_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `business_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section` varchar(50) DEFAULT NULL,
  `acronym` varchar(50) DEFAULT NULL,
  `term` varchar(200) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_terms`
--

LOCK TABLES `business_terms` WRITE;
/*!40000 ALTER TABLE `business_terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `business_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cabins`
--

DROP TABLE IF EXISTS `cabins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cabins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `officeId` int(11) DEFAULT NULL,
  `floorId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `deskType` varchar(100) DEFAULT NULL,
  `deskSize` varchar(100) DEFAULT NULL,
  `totalArea` int(11) DEFAULT NULL,
  `usedArea` int(11) DEFAULT NULL,
  `deskc` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `officeId` (`officeId`),
  KEY `floorId` (`floorId`),
  CONSTRAINT `cabins_ibfk_3` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `cabins_ibfk_4` FOREIGN KEY (`floorId`) REFERENCES `floors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabins`
--

LOCK TABLES `cabins` WRITE;
/*!40000 ALTER TABLE `cabins` DISABLE KEYS */;
INSERT INTO `cabins` VALUES (1,1,NULL,'Tech Park','FixedDesk','Luxury',1,NULL,NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `cabins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calls`
--

DROP TABLE IF EXISTS `calls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `leadId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `ticketId` int(11) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `from` varchar(20) DEFAULT NULL,
  `to` varchar(20) DEFAULT NULL,
  `started` datetime DEFAULT NULL,
  `ended` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `bookingId` (`bookingId`),
  KEY `ticketId` (`ticketId`),
  CONSTRAINT `calls_ibfk_4` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `calls_ibfk_5` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`),
  CONSTRAINT `calls_ibfk_6` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calls`
--

LOCK TABLES `calls` WRITE;
/*!40000 ALTER TABLE `calls` DISABLE KEYS */;
/*!40000 ALTER TABLE `calls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `countryId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `locationc` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `countryId` (`countryId`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`countryId`) REFERENCES `countries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,1,'Bangalore',1,NULL,'2023-06-22 11:30:37','2023-06-22 11:30:37'),(2,1,'Hyderabad',1,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,1,'Mumbai',1,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client_employees`
--

DROP TABLE IF EXISTS `client_employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client_employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `contactPurposes` varchar(200) DEFAULT NULL,
  `department` varchar(20) DEFAULT NULL,
  `designation` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `hasAccess` int(11) DEFAULT NULL,
  `verified` int(11) DEFAULT NULL,
  `password` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `client_employees_ibfk_3` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `client_employees_ibfk_4` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_employees`
--

LOCK TABLES `client_employees` WRITE;
/*!40000 ALTER TABLE `client_employees` DISABLE KEYS */;
/*!40000 ALTER TABLE `client_employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `leadId` int(11) DEFAULT NULL,
  `title` varchar(5) DEFAULT NULL,
  `company` varchar(200) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  `companyRegistrationId` int(11) DEFAULT NULL,
  `gstRegistrationId` int(11) DEFAULT NULL,
  `gstNo` varchar(50) DEFAULT NULL,
  `panNo` varchar(50) DEFAULT NULL,
  `stateCode` int(11) DEFAULT NULL,
  `panCardId` int(11) DEFAULT NULL,
  `benificiaryName` varchar(100) DEFAULT NULL,
  `accountNumber` varchar(50) DEFAULT NULL,
  `ifscCode` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updateBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `companyRegistrationId` (`companyRegistrationId`),
  KEY `gstRegistrationId` (`gstRegistrationId`),
  KEY `panCardId` (`panCardId`),
  CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`companyRegistrationId`) REFERENCES `docs` (`id`),
  CONSTRAINT `clients_ibfk_2` FOREIGN KEY (`gstRegistrationId`) REFERENCES `docs` (`id`),
  CONSTRAINT `clients_ibfk_3` FOREIGN KEY (`panCardId`) REFERENCES `docs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `tradeName` varchar(200) DEFAULT NULL,
  `shortName` varchar(5) DEFAULT NULL,
  `address` text,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `erpDomain` varchar(100) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `logo` varchar(200) DEFAULT NULL,
  `squareLogo` varchar(200) DEFAULT NULL,
  `gstNo` varchar(50) DEFAULT NULL,
  `panNo` varchar(50) DEFAULT NULL,
  `cin` varchar(50) DEFAULT NULL,
  `stateCode` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `bankName` varchar(100) DEFAULT NULL,
  `branchName` varchar(100) DEFAULT NULL,
  `ifscCode` varchar(20) DEFAULT NULL,
  `accountNumber` varchar(30) DEFAULT NULL,
  `accountName` varchar(100) DEFAULT NULL,
  `supportPhone` varchar(100) DEFAULT NULL,
  `supportEmail` varchar(100) DEFAULT NULL,
  `primaryColor` varchar(10) DEFAULT NULL,
  `accentColor` varchar(10) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `modules` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `tradeName` varchar(200) DEFAULT NULL,
  `shortName` varchar(5) DEFAULT NULL,
  `address` text,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `erpDomain` varchar(100) DEFAULT NULL,
  `website` varchar(100) DEFAULT NULL,
  `logo` varchar(200) DEFAULT NULL,
  `squareLogo` varchar(200) DEFAULT NULL,
  `gstNo` varchar(50) DEFAULT NULL,
  `panNo` varchar(50) DEFAULT NULL,
  `cin` varchar(50) DEFAULT NULL,
  `stateCode` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `bankName` varchar(100) DEFAULT NULL,
  `branchName` varchar(100) DEFAULT NULL,
  `ifscCode` varchar(20) DEFAULT NULL,
  `accountNumber` varchar(30) DEFAULT NULL,
  `accountName` varchar(100) DEFAULT NULL,
  `supportPhone` varchar(100) DEFAULT NULL,
  `supportEmail` varchar(100) DEFAULT NULL,
  `primaryColor` varchar(10) DEFAULT NULL,
  `accentColor` varchar(10) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `modules` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'ABC','ABC','ABC','ABC',NULL,NULL,NULL,'ABC@gmail.com','ABC.com','ABC.com',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-06-22 11:08:59','2023-06-22 11:08:59',NULL,NULL,'2023-06-22 11:08:59','2023-06-22 11:08:59');
/*!40000 ALTER TABLE `company` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_contacts`
--

DROP TABLE IF EXISTS `company_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `company_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companyId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `contactPurposes` text,
  `status` varchar(10) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `company_contacts_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_contacts`
--

LOCK TABLES `company_contacts` WRITE;
/*!40000 ALTER TABLE `company_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `company_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract_additional_invoices`
--

DROP TABLE IF EXISTS `contract_additional_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contract_additional_invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contractId` int(11) DEFAULT NULL,
  `invoiceServiceId` int(11) DEFAULT NULL,
  `item` text,
  `amount` double DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `contractId` (`contractId`),
  KEY `invoiceServiceId` (`invoiceServiceId`),
  CONSTRAINT `contract_additional_invoices_ibfk_3` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `contract_additional_invoices_ibfk_4` FOREIGN KEY (`invoiceServiceId`) REFERENCES `invoice_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_additional_invoices`
--

LOCK TABLES `contract_additional_invoices` WRITE;
/*!40000 ALTER TABLE `contract_additional_invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `contract_additional_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract_terms`
--

DROP TABLE IF EXISTS `contract_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contract_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contractId` int(11) DEFAULT NULL,
  `term` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `info` text,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `contractId` (`contractId`),
  CONSTRAINT `contract_terms_ibfk_1` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract_terms`
--

LOCK TABLES `contract_terms` WRITE;
/*!40000 ALTER TABLE `contract_terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `contract_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contracts`
--

DROP TABLE IF EXISTS `contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `deskType` varchar(50) DEFAULT NULL,
  `frequency` varchar(50) DEFAULT NULL,
  `officeType` varchar(50) DEFAULT NULL,
  `invoiceServiceType` varchar(50) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `term` varchar(20) DEFAULT NULL,
  `kind` varchar(20) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `effectiveDate` datetime DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `rent` int(11) DEFAULT NULL,
  `deskPrice` int(11) DEFAULT NULL,
  `additionalRent` int(11) DEFAULT NULL,
  `additionalDesks` int(11) DEFAULT NULL,
  `desks` int(11) DEFAULT NULL,
  `isSqftRent` int(11) DEFAULT NULL,
  `sqFt` int(11) DEFAULT NULL,
  `sqFtPrice` int(11) DEFAULT NULL,
  `security` int(11) DEFAULT NULL,
  `token` int(11) DEFAULT NULL,
  `contractPeriod` int(11) DEFAULT NULL,
  `lockIn` int(11) DEFAULT NULL,
  `lockInPenaltyType` varchar(20) DEFAULT NULL,
  `lockInPenalty` int(11) DEFAULT NULL,
  `noticePeriod` int(11) DEFAULT NULL,
  `noticePeriodViolationType` varchar(20) DEFAULT NULL,
  `noticePeriodViolation` int(11) DEFAULT NULL,
  `freeCredits` int(11) DEFAULT NULL,
  `agreementAccepted` int(11) DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `approvedBy` varchar(20) DEFAULT NULL,
  `confirmedOn` datetime DEFAULT NULL,
  `confirmedBy` varchar(20) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `agreementId` int(11) DEFAULT NULL,
  `signedAgreementId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `tokenSD` int(11) DEFAULT NULL,
  `rentFreePeriod` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `agreementId` (`agreementId`),
  KEY `signedAgreementId` (`signedAgreementId`),
  KEY `bookingId` (`bookingId`),
  CONSTRAINT `contracts_ibfk_4` FOREIGN KEY (`agreementId`) REFERENCES `docs` (`id`),
  CONSTRAINT `contracts_ibfk_5` FOREIGN KEY (`signedAgreementId`) REFERENCES `docs` (`id`),
  CONSTRAINT `contracts_ibfk_6` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `citiec` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'India',NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,'UAE',NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,'CA',NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credits_entries`
--

DROP TABLE IF EXISTS `credits_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `credits_entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `invoiceId` int(11) DEFAULT NULL,
  `credits` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `addedBy` varchar(100) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `invoiceId` (`invoiceId`),
  CONSTRAINT `credits_entries_ibfk_3` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `credits_entries_ibfk_4` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credits_entries`
--

LOCK TABLES `credits_entries` WRITE;
/*!40000 ALTER TABLE `credits_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `credits_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credits_useds`
--

DROP TABLE IF EXISTS `credits_useds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `credits_useds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `resourceBookingId` int(11) DEFAULT NULL,
  `credits` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `usedOn` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `resourceBookingId` (`resourceBookingId`),
  CONSTRAINT `credits_useds_ibfk_3` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `credits_useds_ibfk_4` FOREIGN KEY (`resourceBookingId`) REFERENCES `resource_bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credits_useds`
--

LOCK TABLES `credits_useds` WRITE;
/*!40000 ALTER TABLE `credits_useds` DISABLE KEYS */;
/*!40000 ALTER TABLE `credits_useds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `debit_card_account_users`
--

DROP TABLE IF EXISTS `debit_card_account_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `debit_card_account_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `addedBy` varchar(15) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `updatedBy` varchar(15) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `debitCardAccountId` (`debitCardAccountId`),
  KEY `userId` (`userId`),
  CONSTRAINT `debit_card_account_users_ibfk_3` FOREIGN KEY (`debitCardAccountId`) REFERENCES `debit_card_accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `debit_card_account_users_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debit_card_account_users`
--

LOCK TABLES `debit_card_account_users` WRITE;
/*!40000 ALTER TABLE `debit_card_account_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `debit_card_account_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `debit_card_accounts`
--

DROP TABLE IF EXISTS `debit_card_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `debit_card_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceProviderId` int(11) DEFAULT NULL,
  `cardId` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `addedBy` varchar(15) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `updatedBy` varchar(15) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  CONSTRAINT `debit_card_accounts_ibfk_1` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debit_card_accounts`
--

LOCK TABLES `debit_card_accounts` WRITE;
/*!40000 ALTER TABLE `debit_card_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `debit_card_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `desks`
--

DROP TABLE IF EXISTS `desks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `desks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cabinId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cabinId` (`cabinId`),
  CONSTRAINT `desks_ibfk_1` FOREIGN KEY (`cabinId`) REFERENCES `cabins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desks`
--

LOCK TABLES `desks` WRITE;
/*!40000 ALTER TABLE `desks` DISABLE KEYS */;
INSERT INTO `desks` VALUES (1,1,'Tech Park_1',1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,1,'Tech Park_2',1,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,1,'Tech Park_3',1,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `desks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `docs`
--

DROP TABLE IF EXISTS `docs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `docs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `file` varchar(20) DEFAULT NULL,
  `type` varchar(5) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docs`
--

LOCK TABLES `docs` WRITE;
/*!40000 ALTER TABLE `docs` DISABLE KEYS */;
/*!40000 ALTER TABLE `docs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exit_acrs`
--

DROP TABLE IF EXISTS `exit_acrs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exit_acrs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exitRequestId` int(11) DEFAULT NULL,
  `damage` text,
  `charge` int(11) DEFAULT NULL,
  `image` varchar(100) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exitRequestId` (`exitRequestId`),
  CONSTRAINT `exit_acrs_ibfk_1` FOREIGN KEY (`exitRequestId`) REFERENCES `exit_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exit_acrs`
--

LOCK TABLES `exit_acrs` WRITE;
/*!40000 ALTER TABLE `exit_acrs` DISABLE KEYS */;
/*!40000 ALTER TABLE `exit_acrs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exit_comments`
--

DROP TABLE IF EXISTS `exit_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exit_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exitRequestId` int(11) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `comment` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exitRequestId` (`exitRequestId`),
  CONSTRAINT `exit_comments_ibfk_1` FOREIGN KEY (`exitRequestId`) REFERENCES `exit_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exit_comments`
--

LOCK TABLES `exit_comments` WRITE;
/*!40000 ALTER TABLE `exit_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `exit_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exit_deductions`
--

DROP TABLE IF EXISTS `exit_deductions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exit_deductions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exitRequestId` int(11) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `description` text,
  `charge` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `exitRequestId` (`exitRequestId`),
  CONSTRAINT `exit_deductions_ibfk_1` FOREIGN KEY (`exitRequestId`) REFERENCES `exit_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exit_deductions`
--

LOCK TABLES `exit_deductions` WRITE;
/*!40000 ALTER TABLE `exit_deductions` DISABLE KEYS */;
/*!40000 ALTER TABLE `exit_deductions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exit_requests`
--

DROP TABLE IF EXISTS `exit_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `exit_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `requestedDate` datetime DEFAULT NULL,
  `exitDate` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `fcpStatus` varchar(20) DEFAULT NULL,
  `rejectedMessage` text,
  `lastFcpSent` datetime DEFAULT NULL,
  `fcpDeclinedOn` datetime DEFAULT NULL,
  `refund` int(11) DEFAULT NULL,
  `refundDate` datetime DEFAULT NULL,
  `utr` varchar(100) DEFAULT NULL,
  `tdsRefund` int(11) DEFAULT NULL,
  `tdsRefundDate` datetime DEFAULT NULL,
  `tdsRefundUtr` varchar(100) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `exitCharge` double DEFAULT NULL,
  `earlyExitCharge` double DEFAULT NULL,
  `noticePeriodPenalty` double DEFAULT NULL,
  `assetDamages` double DEFAULT NULL,
  `otherDeductions` double DEFAULT NULL,
  `tdsLiability` double DEFAULT NULL,
  `deregistrationLiability` double DEFAULT NULL,
  `tdsPenalty` double DEFAULT NULL,
  `monthlyInvoices` double DEFAULT NULL,
  `security` double DEFAULT NULL,
  `otherPayments` double DEFAULT NULL,
  `totalPaid` double DEFAULT NULL,
  `due` double DEFAULT NULL,
  `expectedAmount` double DEFAULT NULL,
  `finalStatementId` int(11) DEFAULT NULL,
  `exitFormId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `finalStatementId` (`finalStatementId`),
  KEY `exitFormId` (`exitFormId`),
  CONSTRAINT `exit_requests_ibfk_4` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `exit_requests_ibfk_5` FOREIGN KEY (`finalStatementId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `exit_requests_ibfk_6` FOREIGN KEY (`exitFormId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exit_requests`
--

LOCK TABLES `exit_requests` WRITE;
/*!40000 ALTER TABLE `exit_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `exit_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `external_systems`
--

DROP TABLE IF EXISTS `external_systems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `external_systems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `service` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `config` text,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_systems`
--

LOCK TABLES `external_systems` WRITE;
/*!40000 ALTER TABLE `external_systems` DISABLE KEYS */;
INSERT INTO `external_systems` VALUES (1,'SMS','SMSGateway',NULL,1,'{}','2023-06-27 18:15:55','system',NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `external_systems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facilities`
--

DROP TABLE IF EXISTS `facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
INSERT INTO `facilities` VALUES (1,'wi-fi',1,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facility_set_facilities`
--

DROP TABLE IF EXISTS `facility_set_facilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facility_set_facilities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `facilityId` int(11) DEFAULT NULL,
  `setId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `facility_set_facilities_facilityId_setId_unique` (`facilityId`,`setId`),
  KEY `setId` (`setId`),
  CONSTRAINT `facility_set_facilities_ibfk_3` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `facility_set_facilities_ibfk_4` FOREIGN KEY (`setId`) REFERENCES `facility_sets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facility_set_facilities`
--

LOCK TABLES `facility_set_facilities` WRITE;
/*!40000 ALTER TABLE `facility_set_facilities` DISABLE KEYS */;
/*!40000 ALTER TABLE `facility_set_facilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facility_sets`
--

DROP TABLE IF EXISTS `facility_sets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `facility_sets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facility_sets`
--

LOCK TABLES `facility_sets` WRITE;
/*!40000 ALTER TABLE `facility_sets` DISABLE KEYS */;
INSERT INTO `facility_sets` VALUES (1,'wi-fi',1,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `facility_sets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `floors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `cabinc` int(11) DEFAULT NULL,
  `desks` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `officeId` (`officeId`),
  CONSTRAINT `floors_ibfk_1` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `help_notes`
--

DROP TABLE IF EXISTS `help_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `help_notes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section` varchar(50) DEFAULT NULL,
  `context` varchar(100) DEFAULT NULL,
  `content` text,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `file` varchar(30) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `help_notes`
--

LOCK TABLES `help_notes` WRITE;
/*!40000 ALTER TABLE `help_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `help_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `histories`
--

DROP TABLE IF EXISTS `histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `action` varchar(20) DEFAULT NULL,
  `api` varchar(100) DEFAULT NULL,
  `postData` text,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `histories`
--

LOCK TABLES `histories` WRITE;
/*!40000 ALTER TABLE `histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoice_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoiceId` int(11) DEFAULT NULL,
  `invoiceServiceId` int(11) DEFAULT NULL,
  `item` text,
  `qty` int(11) DEFAULT NULL,
  `price` double(9,2) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `tds` double(9,2) NOT NULL DEFAULT '0.00',
  `cgst` double(9,2) DEFAULT NULL,
  `sgst` double(9,2) DEFAULT NULL,
  `igst` double(9,2) DEFAULT NULL,
  `total` double(9,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `invoiceId` (`invoiceId`),
  KEY `invoiceServiceId` (`invoiceServiceId`),
  CONSTRAINT `invoice_items_ibfk_3` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `invoice_items_ibfk_4` FOREIGN KEY (`invoiceServiceId`) REFERENCES `invoice_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_services`
--

DROP TABLE IF EXISTS `invoice_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoice_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `sacCode` varchar(100) DEFAULT NULL,
  `hasGst` int(11) DEFAULT NULL,
  `inclusive` int(11) DEFAULT NULL,
  `isLiability` int(11) DEFAULT NULL,
  `tds` double DEFAULT NULL,
  `igst` double DEFAULT NULL,
  `sgst` double DEFAULT NULL,
  `cgst` double DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_services`
--

LOCK TABLES `invoice_services` WRITE;
/*!40000 ALTER TABLE `invoice_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `invoiceServiceId` int(11) DEFAULT NULL,
  `paymentId` int(11) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `refNo` varchar(100) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `isCancelled` int(11) DEFAULT NULL,
  `penalty` int(11) DEFAULT NULL,
  `taxableAmount` int(11) DEFAULT NULL,
  `gst` int(11) DEFAULT NULL,
  `tds` int(11) NOT NULL DEFAULT '0',
  `paid` int(11) NOT NULL DEFAULT '0',
  `due` int(11) NOT NULL DEFAULT '0',
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `cancelledReason` text,
  `proformaId` int(11) DEFAULT NULL,
  `pdfId` int(11) DEFAULT NULL,
  `isLiability` int(11) DEFAULT NULL,
  `isLiabilityCleared` int(11) DEFAULT NULL,
  `isTdsCleared` int(11) DEFAULT NULL,
  `tdsPaid` int(11) NOT NULL DEFAULT '0',
  `tdsForm` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `invoiceServiceId` (`invoiceServiceId`),
  KEY `paymentId` (`paymentId`),
  KEY `proformaId` (`proformaId`),
  KEY `pdfId` (`pdfId`),
  KEY `tdsForm` (`tdsForm`),
  CONSTRAINT `invoices_ibfk_10` FOREIGN KEY (`proformaId`) REFERENCES `docs` (`id`),
  CONSTRAINT `invoices_ibfk_11` FOREIGN KEY (`pdfId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `invoices_ibfk_12` FOREIGN KEY (`tdsForm`) REFERENCES `docs` (`id`),
  CONSTRAINT `invoices_ibfk_7` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `invoices_ibfk_8` FOREIGN KEY (`invoiceServiceId`) REFERENCES `invoice_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `invoices_ibfk_9` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_comments`
--

DROP TABLE IF EXISTS `lead_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lead_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `leadId` int(11) DEFAULT NULL,
  `leadPropositionId` int(11) DEFAULT NULL,
  `visitId` int(11) DEFAULT NULL,
  `callId` int(11) DEFAULT NULL,
  `comment` text,
  `date` datetime DEFAULT NULL,
  `by` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `leadPropositionId` (`leadPropositionId`),
  KEY `visitId` (`visitId`),
  KEY `callId` (`callId`),
  CONSTRAINT `lead_comments_ibfk_5` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_comments_ibfk_6` FOREIGN KEY (`leadPropositionId`) REFERENCES `lead_propositions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_comments_ibfk_7` FOREIGN KEY (`visitId`) REFERENCES `visits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_comments_ibfk_8` FOREIGN KEY (`callId`) REFERENCES `calls` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_comments`
--

LOCK TABLES `lead_comments` WRITE;
/*!40000 ALTER TABLE `lead_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `lead_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_mails`
--

DROP TABLE IF EXISTS `lead_mails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lead_mails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `leadId` int(11) DEFAULT NULL,
  `mailId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lead_mails_mailId_leadId_unique` (`leadId`,`mailId`),
  KEY `mailId` (`mailId`),
  CONSTRAINT `lead_mails_ibfk_3` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lead_mails_ibfk_4` FOREIGN KEY (`mailId`) REFERENCES `mails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_mails`
--

LOCK TABLES `lead_mails` WRITE;
/*!40000 ALTER TABLE `lead_mails` DISABLE KEYS */;
/*!40000 ALTER TABLE `lead_mails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lead_propositions`
--

DROP TABLE IF EXISTS `lead_propositions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lead_propositions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `leadId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `desksAvailable` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `distance` double(9,6) DEFAULT NULL,
  `price` double(9,2) DEFAULT NULL,
  `visitId` int(11) DEFAULT NULL,
  `contractId` int(11) DEFAULT NULL,
  `isInterested` text,
  `by` varchar(20) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `officeId` (`officeId`),
  KEY `visitId` (`visitId`),
  KEY `contractId` (`contractId`),
  CONSTRAINT `lead_propositions_ibfk_5` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_propositions_ibfk_6` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_propositions_ibfk_7` FOREIGN KEY (`visitId`) REFERENCES `visits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_propositions_ibfk_8` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lead_propositions`
--

LOCK TABLES `lead_propositions` WRITE;
/*!40000 ALTER TABLE `lead_propositions` DISABLE KEYS */;
/*!40000 ALTER TABLE `lead_propositions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `companyName` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `deskType` varchar(20) DEFAULT NULL,
  `desks` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `info` varchar(50) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `assignedTo` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `source` varchar(10) DEFAULT NULL,
  `attribute` varchar(10) DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `nextCall` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assignedTo` (`assignedTo`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `leads_ibfk_3` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leads_ibfk_4` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `locations`
--

DROP TABLE IF EXISTS `locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL,
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cityId` (`cityId`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'HSR',1,1,NULL,NULL,'2023-06-22 11:32:17','2023-06-22 11:32:17'),(2,'White Field',1,1,1.000000,2.000000,'2023-06-22 19:13:03','2023-06-22 19:13:03'),(3,'Tech Park2',1,1,1.000000,2.000000,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(4,'G',1,2,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `locations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mails`
--

DROP TABLE IF EXISTS `mails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` text,
  `body` text,
  `receivers` text,
  `status` varchar(10) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `by` varchar(20) DEFAULT NULL,
  `from` varchar(100) DEFAULT NULL,
  `tags` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mails`
--

LOCK TABLES `mails` WRITE;
/*!40000 ALTER TABLE `mails` DISABLE KEYS */;
/*!40000 ALTER TABLE `mails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mi_data`
--

DROP TABLE IF EXISTS `mi_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mi_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `competitor` varchar(100) DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `address` text,
  `hotDeskPrice` int(11) DEFAULT NULL,
  `fixedDeskPrice` int(11) DEFAULT NULL,
  `privateOfficePrice` int(11) DEFAULT NULL,
  `sqFtSpace` int(11) DEFAULT NULL,
  `sqFtPrice` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cityId` (`cityId`),
  CONSTRAINT `mi_data_ibfk_1` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mi_data`
--

LOCK TABLES `mi_data` WRITE;
/*!40000 ALTER TABLE `mi_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `mi_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_receivers`
--

DROP TABLE IF EXISTS `notification_receivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification_receivers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notificationId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `sentOn` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notificationId` (`notificationId`),
  CONSTRAINT `notification_receivers_ibfk_1` FOREIGN KEY (`notificationId`) REFERENCES `notifications` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_receivers`
--

LOCK TABLES `notification_receivers` WRITE;
/*!40000 ALTER TABLE `notification_receivers` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification_receivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` varchar(200) DEFAULT NULL,
  `body` text,
  `type` varchar(20) DEFAULT NULL,
  `receivers` text,
  `status` varchar(10) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `by` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `office_pricings`
--

DROP TABLE IF EXISTS `office_pricings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `office_pricings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `officeId` int(11) DEFAULT NULL,
  `facilitySetId` int(11) DEFAULT NULL,
  `deskType` varchar(20) DEFAULT NULL,
  `minPerson` int(11) DEFAULT NULL,
  `maxPerson` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `officeId` (`officeId`),
  KEY `facilitySetId` (`facilitySetId`),
  CONSTRAINT `office_pricings_ibfk_3` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `office_pricings_ibfk_4` FOREIGN KEY (`facilitySetId`) REFERENCES `facility_sets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office_pricings`
--

LOCK TABLES `office_pricings` WRITE;
/*!40000 ALTER TABLE `office_pricings` DISABLE KEYS */;
/*!40000 ALTER TABLE `office_pricings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offices`
--

DROP TABLE IF EXISTS `offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `floor` varchar(100) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `deskTypes` varchar(255) DEFAULT NULL,
  `desks` int(11) DEFAULT '0',
  `cabinc` int(11) DEFAULT '0',
  `floorc` int(11) DEFAULT '0',
  `active` int(11) DEFAULT NULL,
  `bestPrice` double(9,2) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `allowedDeskSizes` varchar(200) DEFAULT NULL,
  `carpetArea` int(11) DEFAULT NULL,
  `chargeableArea` int(11) DEFAULT NULL,
  `expectedLive` datetime DEFAULT NULL,
  `rentStarted` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `offices_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES (1,'Tech Park',NULL,1,'FixedDesk,PrivateOffice,EnterpriseOffice,FlexiDesk',0,0,0,1,NULL,'Live','Minimal,Luxury,Standard,VeryMinimal,Custom,SuperLuxury',1,1,'2023-06-07 00:00:00','2023-06-13 00:00:00',NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opex_bills`
--

DROP TABLE IF EXISTS `opex_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opex_bills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opexTypeId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `opexPaymentId` int(11) DEFAULT NULL,
  `serviceProviderId` int(11) DEFAULT NULL,
  `payoutPaymentId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `billDate` date DEFAULT NULL,
  `dateFrom` date DEFAULT NULL,
  `dateTo` date DEFAULT NULL,
  `billDueDate` date DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT NULL,
  `serviceProviderText` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `indexNo` varchar(30) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `approvalRequired` int(11) DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) DEFAULT NULL,
  `utr` varchar(100) DEFAULT NULL,
  `notes` text,
  `isPrepaid` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `buildingId` (`buildingId`),
  KEY `officeId` (`officeId`),
  KEY `opexPaymentId` (`opexPaymentId`),
  KEY `serviceProviderId` (`serviceProviderId`),
  KEY `payoutPaymentId` (`payoutPaymentId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `opex_bills_ibfk_10` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_bills_ibfk_11` FOREIGN KEY (`opexPaymentId`) REFERENCES `opex_recurring_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_bills_ibfk_12` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_bills_ibfk_13` FOREIGN KEY (`payoutPaymentId`) REFERENCES `payout_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_bills_ibfk_14` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_bills_ibfk_8` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_bills_ibfk_9` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opex_bills`
--

LOCK TABLES `opex_bills` WRITE;
/*!40000 ALTER TABLE `opex_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `opex_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opex_categories`
--

DROP TABLE IF EXISTS `opex_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opex_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `default` int(11) DEFAULT NULL,
  `recurring` int(11) DEFAULT NULL,
  `office` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(200) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opex_categories`
--

LOCK TABLES `opex_categories` WRITE;
/*!40000 ALTER TABLE `opex_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `opex_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opex_recurring_payments`
--

DROP TABLE IF EXISTS `opex_recurring_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opex_recurring_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceProviderId` int(11) DEFAULT NULL,
  `opexTypeId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `benificiaryId` int(11) DEFAULT NULL,
  `minCharge` double(9,2) DEFAULT NULL,
  `maxCharge` double(9,2) DEFAULT NULL,
  `effectiveFrom` date DEFAULT NULL,
  `effectiveTo` date DEFAULT NULL,
  `autoPay` int(11) DEFAULT NULL,
  `isStopped` int(11) DEFAULT NULL,
  `isAdvancePayment` int(11) DEFAULT NULL,
  `invoiceStartDay` int(11) DEFAULT NULL,
  `invoiceDay` int(11) DEFAULT NULL,
  `invoiceDueDay` int(11) DEFAULT NULL,
  `invoiceFrequency` int(11) DEFAULT NULL,
  `remindBeforeDays` int(11) DEFAULT NULL,
  `amountType` varchar(10) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `gst` int(11) DEFAULT NULL,
  `tds` int(11) DEFAULT NULL,
  `refNo` varchar(50) DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT NULL,
  `bankAccountNumber` varchar(50) DEFAULT NULL,
  `bankIfscCode` varchar(50) DEFAULT NULL,
  `bankAccountName` varchar(100) DEFAULT NULL,
  `bankName` varchar(100) DEFAULT NULL,
  `bankBranch` varchar(100) DEFAULT NULL,
  `portalUrl` varchar(200) DEFAULT NULL,
  `portalAccountId` varchar(100) DEFAULT NULL,
  `portalUserName` varchar(100) DEFAULT NULL,
  `portalPassword` varchar(100) DEFAULT NULL,
  `additionalPaymentInfo` varchar(100) DEFAULT NULL,
  `contactName` varchar(100) DEFAULT NULL,
  `contactPhone` varchar(15) DEFAULT NULL,
  `contactEmail` varchar(100) DEFAULT NULL,
  `approvedBy` varchar(50) DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `by` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `vendorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `buildingId` (`buildingId`),
  KEY `officeId` (`officeId`),
  KEY `benificiaryId` (`benificiaryId`),
  KEY `vendorId` (`vendorId`),
  CONSTRAINT `opex_recurring_payments_ibfk_10` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_recurring_payments_ibfk_11` FOREIGN KEY (`benificiaryId`) REFERENCES `payout_benificiaries` (`id`),
  CONSTRAINT `opex_recurring_payments_ibfk_12` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_recurring_payments_ibfk_7` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_recurring_payments_ibfk_8` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_recurring_payments_ibfk_9` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opex_recurring_payments`
--

LOCK TABLES `opex_recurring_payments` WRITE;
/*!40000 ALTER TABLE `opex_recurring_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `opex_recurring_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opex_types`
--

DROP TABLE IF EXISTS `opex_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opex_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `catId` int(11) DEFAULT NULL,
  `typeId` int(11) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `default` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(200) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `catId` (`catId`),
  KEY `typeId` (`typeId`),
  CONSTRAINT `opex_types_ibfk_3` FOREIGN KEY (`catId`) REFERENCES `opex_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_types_ibfk_4` FOREIGN KEY (`typeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opex_types`
--

LOCK TABLES `opex_types` WRITE;
/*!40000 ALTER TABLE `opex_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `opex_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_passwords`
--

DROP TABLE IF EXISTS `otp_passwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `otp_passwords` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `context` varchar(20) DEFAULT NULL,
  `hash` text,
  `isUsed` int(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `validTill` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_passwords`
--

LOCK TABLES `otp_passwords` WRITE;
/*!40000 ALTER TABLE `otp_passwords` DISABLE KEYS */;
INSERT INTO `otp_passwords` VALUES (1,'Login','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdHAiOjQxOTk5NiwicGhvbmUiOiI5MDAwMDIxOTA5IiwiaWF0IjoxNjg3ODY2NDU2fQ.ZUgtz9x9ZhHhOysN3lbwg93XiAa_wNTGm9JAyyxFhNU',0,'','9000021909','2023-06-27 17:17:36','2023-06-27 17:32:36',NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,'Login','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdHAiOjE3OTc0MywicGhvbmUiOiI5MDAwMDIxOTA5IiwiaWF0IjoxNjg3ODY2NTc3fQ.7k6vonr3Htc3RC2gav5Bqem1JYaljCuWU3DLzhmGp8o',0,'','9000021909','2023-06-27 17:19:37','2023-06-27 17:34:37',NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00'),(3,'Login','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvdHAiOjY5ODMyNiwicGhvbmUiOiI5MDAwMDIxOTA5IiwiaWF0IjoxNjg3ODY2NzM3fQ.9b19BFwwoakqpJOMk5lsrmtvmov4HUYjMCOMq-hDJv4',0,'','9000021909','2023-06-27 17:22:17','2023-06-27 17:37:17',NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `otp_passwords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payin_entries`
--

DROP TABLE IF EXISTS `payin_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payin_entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bankAccountId` int(11) DEFAULT NULL,
  `linkedId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `invoiceServiceId` int(11) DEFAULT NULL,
  `amount` double(11,2) DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT '',
  `utr` varchar(100) DEFAULT NULL,
  `narration` text,
  `status` varchar(20) DEFAULT NULL,
  `chequeNo` varchar(50) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `addedBy` varchar(50) DEFAULT '',
  `pgOrderId` varchar(50) DEFAULT '',
  `pgSettlementId` varchar(50) DEFAULT '',
  `receivedDate` datetime DEFAULT NULL,
  `creditedDate` datetime DEFAULT NULL,
  `nonRevenue` int(11) DEFAULT NULL,
  `linked` int(11) DEFAULT NULL,
  `attributed` int(11) DEFAULT NULL,
  `suspense` int(11) DEFAULT NULL,
  `transactionAmount` double(9,2) DEFAULT NULL,
  `dueAmount` double(9,2) DEFAULT NULL,
  `settledAmount` double(9,2) DEFAULT NULL,
  `pgCharges` double(9,2) DEFAULT NULL,
  `pgTaxes` double(9,2) DEFAULT NULL,
  `additionalRevenue` double(9,2) DEFAULT NULL,
  `writeOff` double(9,2) DEFAULT NULL,
  `noInvoice` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT '',
  `linkedOn` datetime DEFAULT NULL,
  `linkedBy` varchar(50) DEFAULT '',
  `attributedOn` datetime DEFAULT NULL,
  `attributedBy` varchar(50) DEFAULT '',
  `reason` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `linkedId` (`linkedId`),
  KEY `bookingId` (`bookingId`),
  KEY `invoiceServiceId` (`invoiceServiceId`),
  CONSTRAINT `payin_entries_ibfk_4` FOREIGN KEY (`linkedId`) REFERENCES `payin_entries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payin_entries_ibfk_5` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payin_entries_ibfk_6` FOREIGN KEY (`invoiceServiceId`) REFERENCES `invoice_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payin_entries`
--

LOCK TABLES `payin_entries` WRITE;
/*!40000 ALTER TABLE `payin_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `payin_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `utr` varchar(100) DEFAULT NULL,
  `paidBy` varchar(20) DEFAULT NULL,
  `cancelled` int(11) DEFAULT NULL,
  `cancelledBy` varchar(20) DEFAULT NULL,
  `cancelledReason` varchar(20) DEFAULT NULL,
  `cancelledDate` datetime DEFAULT NULL,
  `comments` text,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
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
  `clientId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `payout_benificiaries_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
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
-- Table structure for table `payout_entries`
--

DROP TABLE IF EXISTS `payout_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payout_entries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `linkedId` int(11) DEFAULT NULL,
  `opexTypeId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `narration` text,
  `info` text,
  `paidBy` varchar(50) DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `addedBy` varchar(50) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `utr` varchar(50) DEFAULT NULL,
  `payoutPaymentId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `toPayoutGateway` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `issuedOn` datetime DEFAULT NULL,
  `chequeNo` varchar(30) DEFAULT NULL,
  `nonExpense` int(11) DEFAULT NULL,
  `salary` int(11) DEFAULT NULL,
  `linked` int(11) DEFAULT NULL,
  `attributed` int(11) DEFAULT NULL,
  `suspense` int(11) DEFAULT NULL,
  `noBill` int(11) DEFAULT NULL,
  `reason` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `linkedId` (`linkedId`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `buildingId` (`buildingId`),
  KEY `payoutPaymentId` (`payoutPaymentId`),
  KEY `pettyCashAccountId` (`pettyCashAccountId`),
  KEY `debitCardAccountId` (`debitCardAccountId`),
  CONSTRAINT `payout_entries_ibfk_10` FOREIGN KEY (`payoutPaymentId`) REFERENCES `payout_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_entries_ibfk_11` FOREIGN KEY (`pettyCashAccountId`) REFERENCES `petty_cash_accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_entries_ibfk_12` FOREIGN KEY (`debitCardAccountId`) REFERENCES `debit_card_accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_entries_ibfk_7` FOREIGN KEY (`linkedId`) REFERENCES `payout_entries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_entries_ibfk_8` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_entries_ibfk_9` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payout_entries`
--

LOCK TABLES `payout_entries` WRITE;
/*!40000 ALTER TABLE `payout_entries` DISABLE KEYS */;
/*!40000 ALTER TABLE `payout_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payout_payments`
--

DROP TABLE IF EXISTS `payout_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payout_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payoutBenificiaryId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
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
  `exitRequestId` int(11) DEFAULT NULL,
  `purchaseOrderId` int(11) DEFAULT NULL,
  `providerBillId` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `linked` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `issuedOn` datetime DEFAULT NULL,
  `chequeNo` varchar(30) DEFAULT NULL,
  `futurePayoutDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payoutBenificiaryId` (`payoutBenificiaryId`),
  KEY `exitRequestId` (`exitRequestId`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `providerBillId` (`providerBillId`),
  CONSTRAINT `payout_payments_ibfk_5` FOREIGN KEY (`payoutBenificiaryId`) REFERENCES `payout_benificiaries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_payments_ibfk_6` FOREIGN KEY (`exitRequestId`) REFERENCES `exit_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_payments_ibfk_7` FOREIGN KEY (`purchaseOrderId`) REFERENCES `vendor_purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_payments_ibfk_8` FOREIGN KEY (`providerBillId`) REFERENCES `service_provider_bills` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payout_payments`
--

LOCK TABLES `payout_payments` WRITE;
/*!40000 ALTER TABLE `payout_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payout_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `petty_cash_account_users`
--

DROP TABLE IF EXISTS `petty_cash_account_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `petty_cash_account_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `addedBy` varchar(15) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `updatedBy` varchar(15) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pettyCashAccountId` (`pettyCashAccountId`),
  KEY `userId` (`userId`),
  CONSTRAINT `petty_cash_account_users_ibfk_3` FOREIGN KEY (`pettyCashAccountId`) REFERENCES `petty_cash_accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `petty_cash_account_users_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `petty_cash_account_users`
--

LOCK TABLES `petty_cash_account_users` WRITE;
/*!40000 ALTER TABLE `petty_cash_account_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `petty_cash_account_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `petty_cash_accounts`
--

DROP TABLE IF EXISTS `petty_cash_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `petty_cash_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `addedBy` varchar(15) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `updatedBy` varchar(15) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `petty_cash_accounts`
--

LOCK TABLES `petty_cash_accounts` WRITE;
/*!40000 ALTER TABLE `petty_cash_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `petty_cash_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pg_transaction_requests`
--

DROP TABLE IF EXISTS `pg_transaction_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pg_transaction_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pgTransactionId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `header` text,
  `postData` text,
  `status` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pgTransactionId` (`pgTransactionId`),
  CONSTRAINT `pg_transaction_requests_ibfk_1` FOREIGN KEY (`pgTransactionId`) REFERENCES `pg_transactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pg_transaction_requests`
--

LOCK TABLES `pg_transaction_requests` WRITE;
/*!40000 ALTER TABLE `pg_transaction_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `pg_transaction_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pg_transaction_responses`
--

DROP TABLE IF EXISTS `pg_transaction_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pg_transaction_responses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pgTransactionId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `response` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `pgTransactionId` (`pgTransactionId`),
  CONSTRAINT `pg_transaction_responses_ibfk_1` FOREIGN KEY (`pgTransactionId`) REFERENCES `pg_transactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pg_transaction_responses`
--

LOCK TABLES `pg_transaction_responses` WRITE;
/*!40000 ALTER TABLE `pg_transaction_responses` DISABLE KEYS */;
/*!40000 ALTER TABLE `pg_transaction_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pg_transactions`
--

DROP TABLE IF EXISTS `pg_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pg_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paymentId` int(11) DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `pgOrderId` varchar(50) DEFAULT NULL,
  `pgSystemId` int(11) DEFAULT NULL,
  `pgProvider` varchar(50) DEFAULT NULL,
  `pgCharge` double DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `transactionData` text,
  `payinEntryId` int(11) DEFAULT NULL,
  `taxes` double DEFAULT NULL,
  `pgChargeAmount` double DEFAULT NULL,
  `bookingAmount` double DEFAULT NULL,
  `settledAmount` double DEFAULT NULL,
  `additionalRevenue` double DEFAULT NULL,
  `writeOff` double DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `paymentId` (`paymentId`),
  KEY `payinEntryId` (`payinEntryId`),
  CONSTRAINT `pg_transactions_ibfk_3` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pg_transactions_ibfk_4` FOREIGN KEY (`payinEntryId`) REFERENCES `payin_entries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pg_transactions`
--

LOCK TABLES `pg_transactions` WRITE;
/*!40000 ALTER TABLE `pg_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `pg_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_contracts`
--

DROP TABLE IF EXISTS `price_contracts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `price_contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `priceId` int(11) DEFAULT NULL,
  `contractId` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `mailId` int(11) DEFAULT NULL,
  `mailSent` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `price_contracts_contractId_priceId_unique` (`priceId`,`contractId`),
  KEY `contractId` (`contractId`),
  CONSTRAINT `price_contracts_ibfk_3` FOREIGN KEY (`priceId`) REFERENCES `price_quotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `price_contracts_ibfk_4` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_contracts`
--

LOCK TABLES `price_contracts` WRITE;
/*!40000 ALTER TABLE `price_contracts` DISABLE KEYS */;
/*!40000 ALTER TABLE `price_contracts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `price_quotes`
--

DROP TABLE IF EXISTS `price_quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `price_quotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quoteId` int(11) DEFAULT NULL,
  `facilitySetId` int(11) DEFAULT NULL,
  `facilities` text,
  `deskType` varchar(20) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `min` int(11) DEFAULT NULL,
  `max` int(11) DEFAULT NULL,
  `lockIn` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quoteId` (`quoteId`),
  KEY `facilitySetId` (`facilitySetId`),
  CONSTRAINT `price_quotes_ibfk_3` FOREIGN KEY (`quoteId`) REFERENCES `proposition_quotes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `price_quotes_ibfk_4` FOREIGN KEY (`facilitySetId`) REFERENCES `facility_sets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `price_quotes`
--

LOCK TABLES `price_quotes` WRITE;
/*!40000 ALTER TABLE `price_quotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `price_quotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proposition_quotes`
--

DROP TABLE IF EXISTS `proposition_quotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `proposition_quotes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `propositionId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `mailId` int(11) DEFAULT NULL,
  `mailSent` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `propositionId` (`propositionId`),
  KEY `officeId` (`officeId`),
  CONSTRAINT `proposition_quotes_ibfk_3` FOREIGN KEY (`propositionId`) REFERENCES `lead_propositions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `proposition_quotes_ibfk_4` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proposition_quotes`
--

LOCK TABLES `proposition_quotes` WRITE;
/*!40000 ALTER TABLE `proposition_quotes` DISABLE KEYS */;
/*!40000 ALTER TABLE `proposition_quotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ref_sequences`
--

DROP TABLE IF EXISTS `ref_sequences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ref_sequences` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `context` varchar(20) DEFAULT NULL,
  `sequence` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_sequences`
--

LOCK TABLES `ref_sequences` WRITE;
/*!40000 ALTER TABLE `ref_sequences` DISABLE KEYS */;
/*!40000 ALTER TABLE `ref_sequences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_bookings`
--

DROP TABLE IF EXISTS `resource_bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resource_bookings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `refNo` varchar(20) DEFAULT NULL,
  `resourceId` int(11) DEFAULT NULL,
  `parentBookingId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `clientId` int(11) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `from` datetime DEFAULT NULL,
  `to` datetime DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `resourceId` (`resourceId`),
  KEY `parentBookingId` (`parentBookingId`),
  KEY `bookingId` (`bookingId`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `resource_bookings_ibfk_5` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `resource_bookings_ibfk_6` FOREIGN KEY (`parentBookingId`) REFERENCES `bookings` (`id`),
  CONSTRAINT `resource_bookings_ibfk_7` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `resource_bookings_ibfk_8` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_bookings`
--

LOCK TABLES `resource_bookings` WRITE;
/*!40000 ALTER TABLE `resource_bookings` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_images`
--

DROP TABLE IF EXISTS `resource_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resource_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `resourceId` int(11) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_images_imageId_resourceId_unique` (`resourceId`,`imageId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `resource_images_ibfk_3` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resource_images_ibfk_4` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_images`
--

LOCK TABLES `resource_images` WRITE;
/*!40000 ALTER TABLE `resource_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `officeId` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `subUnits` int(11) DEFAULT NULL,
  `style` text,
  `subUnitType` text,
  `facilities` text,
  `description` text,
  `price` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `userGuideId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `officeId` (`officeId`),
  KEY `userGuideId` (`userGuideId`),
  CONSTRAINT `resources_ibfk_3` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `resources_ibfk_4` FOREIGN KEY (`userGuideId`) REFERENCES `docs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (1,1,'MeetingRoom','Tech Park',9,'Formal','RestBack','52InchTV','9',10000,1,NULL,'2023-06-27 18:12:58','system','0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `enum` varchar(20) DEFAULT NULL,
  `json` text,
  `isGeoSpecific` int(11) DEFAULT NULL,
  `isSupport` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin',NULL,'{\"admin\":{\"enable\":true},\"dashboards\":{\"enable\":true},\"workbenches\":{\"enable\":true},\"bookings\":{\"enable\":true,\"list\":true,\"newBooking\":true,\"cancelBooking\":true,\"editClient\":true,\"confirmContract\":true,\"addPayment\":true,\"cancelContract\":true,\"editContract\":true,\"cancelFutureContract\":true,\"raiseInvoice\":true,\"viewContractHistory\":true,\"sendInvoiceNotification\":true,\"onboardingExits\":true,\"cancelApprovedFutureContract\":true,\"relocation\":true,\"contractTerms\":true,\"editInvoices\":true,\"editEmployees\":true,\"raiseInvoices\":true,\"uploadAgreement\":true,\"expansion\":true,\"cancelConfirmedFutureContract\":true,\"approveContract\":true,\"contraction\":true,\"cancelInvoice\":true,\"refundLiability\":true},\"leads\":{\"enable\":true},\"accounts\":{\"enable\":true},\"purchases\":{\"enable\":true},\"support\":{\"enable\":true},\"assets\":{\"enable\":true}}',1,1,1,1,'2023-07-17 18:37:40','lokesh','0000-00-00 00:00:00','0000-00-00 00:00:00'),(2,'Bookings',NULL,'{\"admin\":{},\"dashboards\":{},\"workbenches\":{},\"bookings\":{\"enable\":true},\"leads\":{},\"accounts\":{},\"purchases\":{},\"support\":{},\"assets\":{}}',NULL,NULL,1,1,'2023-06-27 17:45:47','sam','0000-00-00 00:00:00','0000-00-00 00:00:00'),(4,'Support',NULL,'{\"admin\":{},\"dashboards\":{},\"workbenches\":{},\"bookings\":{},\"leads\":{},\"accounts\":{},\"purchases\":{},\"support\":{\"enable\":true},\"assets\":{}}',NULL,NULL,1,1,'2023-06-27 17:50:36','sam','0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `assignedTo` int(11) DEFAULT NULL,
  `from` datetime DEFAULT NULL,
  `to` datetime DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `assignedTo` (`assignedTo`),
  CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `schedules_ibfk_4` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `selfcare_links`
--

DROP TABLE IF EXISTS `selfcare_links`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `selfcare_links` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `linkId` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  `context` varchar(20) DEFAULT NULL,
  `data` text,
  `created` datetime DEFAULT NULL,
  `expiry` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selfcare_links`
--

LOCK TABLES `selfcare_links` WRITE;
/*!40000 ALTER TABLE `selfcare_links` DISABLE KEYS */;
INSERT INTO `selfcare_links` VALUES (1,'96ab4d88-493c-433a-891f-4029115825b0','http://selfcare.coworkops.in/#/selfcare/vendor-verification/96ab4d88-493c-433a-891f-4029115825b0','VendorVerification','{\"vendorId\":1}','2023-06-22 15:26:09',NULL,1,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `selfcare_links` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_provider_bank_accounts`
--

DROP TABLE IF EXISTS `service_provider_bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_provider_bank_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceProviderId` int(11) DEFAULT NULL,
  `payoutBenificiaryId` int(11) DEFAULT NULL,
  `accountNumber` varchar(20) DEFAULT NULL,
  `ifscCode` varchar(20) DEFAULT NULL,
  `accountHolderName` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  CONSTRAINT `service_provider_bank_accounts_ibfk_1` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_provider_bank_accounts`
--

LOCK TABLES `service_provider_bank_accounts` WRITE;
/*!40000 ALTER TABLE `service_provider_bank_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_provider_bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_provider_bills`
--

DROP TABLE IF EXISTS `service_provider_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_provider_bills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `servicePaymentId` int(11) DEFAULT NULL,
  `payoutPaymentId` int(11) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `billDate` date DEFAULT NULL,
  `dateFrom` date DEFAULT NULL,
  `dateTo` date DEFAULT NULL,
  `billDueDate` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `invoiceId` int(11) DEFAULT NULL,
  `approvalRequired` int(11) DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) DEFAULT NULL,
  `utr` varchar(100) DEFAULT NULL,
  `notes` text,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `servicePaymentId` (`servicePaymentId`),
  KEY `payoutPaymentId` (`payoutPaymentId`),
  CONSTRAINT `service_provider_bills_ibfk_3` FOREIGN KEY (`servicePaymentId`) REFERENCES `service_provider_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_provider_bills_ibfk_4` FOREIGN KEY (`payoutPaymentId`) REFERENCES `payout_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_provider_bills`
--

LOCK TABLES `service_provider_bills` WRITE;
/*!40000 ALTER TABLE `service_provider_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_provider_bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_provider_contacts`
--

DROP TABLE IF EXISTS `service_provider_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_provider_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceProviderId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  CONSTRAINT `service_provider_contacts_ibfk_1` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_provider_contacts`
--

LOCK TABLES `service_provider_contacts` WRITE;
/*!40000 ALTER TABLE `service_provider_contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_provider_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_provider_payments`
--

DROP TABLE IF EXISTS `service_provider_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_provider_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceProviderId` int(11) DEFAULT NULL,
  `serviceId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `benificiaryId` int(11) DEFAULT NULL,
  `minCharge` double(9,2) DEFAULT NULL,
  `maxCharge` double(9,2) DEFAULT NULL,
  `effectiveFrom` date DEFAULT NULL,
  `effectiveTo` date DEFAULT NULL,
  `autoPay` int(11) DEFAULT NULL,
  `isStopped` int(11) DEFAULT NULL,
  `isAdvancePayment` int(11) DEFAULT NULL,
  `invoiceStartDay` int(11) DEFAULT NULL,
  `invoiceDay` int(11) DEFAULT NULL,
  `invoiceDueDay` int(11) DEFAULT NULL,
  `invoiceFrequency` int(11) DEFAULT NULL,
  `remindBeforeDays` int(11) DEFAULT NULL,
  `amountType` varchar(10) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `gst` int(11) DEFAULT NULL,
  `tds` int(11) DEFAULT NULL,
  `refNo` varchar(50) DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT NULL,
  `bankAccountNumber` varchar(50) DEFAULT NULL,
  `bankIfscCode` varchar(50) DEFAULT NULL,
  `bankAccountName` varchar(100) DEFAULT NULL,
  `bankName` varchar(100) DEFAULT NULL,
  `bankBranch` varchar(100) DEFAULT NULL,
  `portalUrl` varchar(200) DEFAULT NULL,
  `portalUserName` varchar(100) DEFAULT NULL,
  `portalPassword` varchar(100) DEFAULT NULL,
  `contactName` varchar(100) DEFAULT NULL,
  `contactPhone` varchar(15) DEFAULT NULL,
  `contactEmail` varchar(100) DEFAULT NULL,
  `approvedBy` varchar(50) DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `by` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `opexTypeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  KEY `serviceId` (`serviceId`),
  KEY `buildingId` (`buildingId`),
  KEY `officeId` (`officeId`),
  KEY `benificiaryId` (`benificiaryId`),
  KEY `opexTypeId` (`opexTypeId`),
  CONSTRAINT `service_provider_payments_ibfk_10` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_provider_payments_ibfk_11` FOREIGN KEY (`benificiaryId`) REFERENCES `payout_benificiaries` (`id`),
  CONSTRAINT `service_provider_payments_ibfk_12` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_provider_payments_ibfk_7` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_provider_payments_ibfk_8` FOREIGN KEY (`serviceId`) REFERENCES `service_provider_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_provider_payments_ibfk_9` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_provider_payments`
--

LOCK TABLES `service_provider_payments` WRITE;
/*!40000 ALTER TABLE `service_provider_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_provider_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_provider_portals`
--

DROP TABLE IF EXISTS `service_provider_portals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_provider_portals` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `serviceProviderId` int(11) DEFAULT NULL,
  `webUrl` varchar(100) DEFAULT NULL,
  `accountId` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `info` text,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  CONSTRAINT `service_provider_portals_ibfk_1` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_provider_portals`
--

LOCK TABLES `service_provider_portals` WRITE;
/*!40000 ALTER TABLE `service_provider_portals` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_provider_portals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_provider_services`
--

DROP TABLE IF EXISTS `service_provider_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_provider_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_provider_services`
--

LOCK TABLES `service_provider_services` WRITE;
/*!40000 ALTER TABLE `service_provider_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_provider_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_providers`
--

DROP TABLE IF EXISTS `service_providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_providers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opexTypeId` int(11) DEFAULT NULL,
  `serviceId` int(11) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address` text,
  `description` text,
  `paymentMode` varchar(20) DEFAULT NULL,
  `pan` varchar(50) DEFAULT NULL,
  `panId` int(11) DEFAULT NULL,
  `gst` varchar(50) DEFAULT NULL,
  `gstId` int(11) DEFAULT NULL,
  `cin` varchar(50) DEFAULT NULL,
  `cinId` int(11) DEFAULT NULL,
  `addressProofId` int(11) DEFAULT NULL,
  `hasContact` int(11) DEFAULT NULL,
  `hasGst` int(11) DEFAULT NULL,
  `hasTds` int(11) DEFAULT NULL,
  `isPaymentHolded` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `additionalPaymentInfo` text,
  `companyId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `itLedgerAdded` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `serviceId` (`serviceId`),
  CONSTRAINT `service_providers_ibfk_3` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_providers_ibfk_4` FOREIGN KEY (`serviceId`) REFERENCES `service_provider_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_providers`
--

LOCK TABLES `service_providers` WRITE;
/*!40000 ALTER TABLE `service_providers` DISABLE KEYS */;
/*!40000 ALTER TABLE `service_providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sku_categories`
--

DROP TABLE IF EXISTS `sku_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sku_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sku_categories`
--

LOCK TABLES `sku_categories` WRITE;
/*!40000 ALTER TABLE `sku_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `sku_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sku_types`
--

DROP TABLE IF EXISTS `sku_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sku_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `catId` int(11) DEFAULT NULL,
  `name` varchar(200) DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `catId` (`catId`),
  CONSTRAINT `sku_types_ibfk_1` FOREIGN KEY (`catId`) REFERENCES `sku_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sku_types`
--

LOCK TABLES `sku_types` WRITE;
/*!40000 ALTER TABLE `sku_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `sku_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sku_units`
--

DROP TABLE IF EXISTS `sku_units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sku_units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `symbol` varchar(20) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sku_units`
--

LOCK TABLES `sku_units` WRITE;
/*!40000 ALTER TABLE `sku_units` DISABLE KEYS */;
/*!40000 ALTER TABLE `sku_units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skus`
--

DROP TABLE IF EXISTS `skus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `skus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `catId` int(11) DEFAULT NULL,
  `typeId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `symbol` varchar(20) DEFAULT NULL,
  `description` text,
  `gst` double(4,2) DEFAULT NULL,
  `tds` double(4,2) DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `isService` int(11) DEFAULT NULL,
  `isAsset` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `catId` (`catId`),
  KEY `typeId` (`typeId`),
  CONSTRAINT `skus_ibfk_1` FOREIGN KEY (`catId`) REFERENCES `sku_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `skus_ibfk_2` FOREIGN KEY (`typeId`) REFERENCES `sku_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skus`
--

LOCK TABLES `skus` WRITE;
/*!40000 ALTER TABLE `skus` DISABLE KEYS */;
/*!40000 ALTER TABLE `skus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smses`
--

DROP TABLE IF EXISTS `smses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smses` (
  `id` int(11) NOT NULL,
  `sms` text,
  `receivers` text,
  `status` varchar(20) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smses`
--

LOCK TABLES `smses` WRITE;
/*!40000 ALTER TABLE `smses` DISABLE KEYS */;
/*!40000 ALTER TABLE `smses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systems`
--

DROP TABLE IF EXISTS `systems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `systems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `system` varchar(10) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `apiKey` varchar(100) DEFAULT NULL,
  `secret` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `systems`
--

LOCK TABLES `systems` WRITE;
/*!40000 ALTER TABLE `systems` DISABLE KEYS */;
/*!40000 ALTER TABLE `systems` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_assignment_histories`
--

DROP TABLE IF EXISTS `ticket_assignment_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_assignment_histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketId` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ticketId` (`ticketId`),
  KEY `userId` (`userId`),
  CONSTRAINT `ticket_assignment_histories_ibfk_3` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_assignment_histories_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_assignment_histories`
--

LOCK TABLES `ticket_assignment_histories` WRITE;
/*!40000 ALTER TABLE `ticket_assignment_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_assignment_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_attachments`
--

DROP TABLE IF EXISTS `ticket_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_attachments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketId` int(11) DEFAULT NULL,
  `docId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_attachments_docId_ticketId_unique` (`ticketId`,`docId`),
  KEY `docId` (`docId`),
  CONSTRAINT `ticket_attachments_ibfk_3` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_attachments_ibfk_4` FOREIGN KEY (`docId`) REFERENCES `docs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_attachments`
--

LOCK TABLES `ticket_attachments` WRITE;
/*!40000 ALTER TABLE `ticket_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_categories`
--

DROP TABLE IF EXISTS `ticket_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `active` varchar(20) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_categories`
--

LOCK TABLES `ticket_categories` WRITE;
/*!40000 ALTER TABLE `ticket_categories` DISABLE KEYS */;
INSERT INTO `ticket_categories` VALUES (1,'Tech Park','1','2023-06-26 00:36:33','lokesh','0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `ticket_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_contexts`
--

DROP TABLE IF EXISTS `ticket_contexts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_contexts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subCategoryId` int(11) DEFAULT NULL,
  `priorityId` int(11) DEFAULT NULL,
  `context` varchar(200) DEFAULT NULL,
  `supportLevel` varchar(20) DEFAULT NULL,
  `assigneeType` varchar(20) DEFAULT NULL,
  `active` varchar(20) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subCategoryId` (`subCategoryId`),
  KEY `priorityId` (`priorityId`),
  CONSTRAINT `ticket_contexts_ibfk_3` FOREIGN KEY (`subCategoryId`) REFERENCES `ticket_sub_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_contexts_ibfk_4` FOREIGN KEY (`priorityId`) REFERENCES `ticket_priorities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_contexts`
--

LOCK TABLES `ticket_contexts` WRITE;
/*!40000 ALTER TABLE `ticket_contexts` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_contexts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_expenses`
--

DROP TABLE IF EXISTS `ticket_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_expenses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketId` int(11) DEFAULT NULL,
  `messageId` int(11) DEFAULT NULL,
  `department` varchar(20) DEFAULT NULL,
  `notes` text,
  `budget` double(9,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `approvedBudget` double(9,2) DEFAULT NULL,
  `declinedMessage` text,
  `date` datetime DEFAULT NULL,
  `by` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ticketId` (`ticketId`),
  KEY `messageId` (`messageId`),
  CONSTRAINT `ticket_expenses_ibfk_3` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_expenses_ibfk_4` FOREIGN KEY (`messageId`) REFERENCES `ticket_messages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_expenses`
--

LOCK TABLES `ticket_expenses` WRITE;
/*!40000 ALTER TABLE `ticket_expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_mails`
--

DROP TABLE IF EXISTS `ticket_mails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_mails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketId` int(11) DEFAULT NULL,
  `mailId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_mails_mailId_ticketId_unique` (`ticketId`,`mailId`),
  KEY `mailId` (`mailId`),
  CONSTRAINT `ticket_mails_ibfk_3` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_mails_ibfk_4` FOREIGN KEY (`mailId`) REFERENCES `mails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_mails`
--

LOCK TABLES `ticket_mails` WRITE;
/*!40000 ALTER TABLE `ticket_mails` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_mails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_messages`
--

DROP TABLE IF EXISTS `ticket_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketId` int(11) DEFAULT NULL,
  `docId` int(11) DEFAULT NULL,
  `reply` text,
  `date` datetime DEFAULT NULL,
  `to` varchar(20) DEFAULT NULL,
  `from` varchar(20) DEFAULT NULL,
  `by` varchar(100) DEFAULT NULL,
  `read` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `fromUserId` int(11) DEFAULT NULL,
  `user` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ticketId` (`ticketId`),
  KEY `docId` (`docId`),
  KEY `userId` (`userId`),
  KEY `fromUserId` (`fromUserId`),
  CONSTRAINT `ticket_messages_ibfk_5` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_messages_ibfk_6` FOREIGN KEY (`docId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_messages_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `ticket_messages_ibfk_8` FOREIGN KEY (`fromUserId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_messages`
--

LOCK TABLES `ticket_messages` WRITE;
/*!40000 ALTER TABLE `ticket_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_priorities`
--

DROP TABLE IF EXISTS `ticket_priorities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_priorities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `attendIn` int(11) DEFAULT NULL,
  `attendInType` varchar(10) DEFAULT NULL,
  `resolveIn` int(11) DEFAULT NULL,
  `resolveInType` varchar(10) DEFAULT NULL,
  `closeIn` int(11) DEFAULT NULL,
  `closeInType` varchar(10) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_priorities`
--

LOCK TABLES `ticket_priorities` WRITE;
/*!40000 ALTER TABLE `ticket_priorities` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_priorities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_status_histories`
--

DROP TABLE IF EXISTS `ticket_status_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_status_histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticketId` int(11) DEFAULT NULL,
  `user` varchar(50) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ticketId` (`ticketId`),
  CONSTRAINT `ticket_status_histories_ibfk_1` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_status_histories`
--

LOCK TABLES `ticket_status_histories` WRITE;
/*!40000 ALTER TABLE `ticket_status_histories` DISABLE KEYS */;
/*!40000 ALTER TABLE `ticket_status_histories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_sub_categories`
--

DROP TABLE IF EXISTS `ticket_sub_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_sub_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categoryId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `active` varchar(20) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `ticket_sub_categories_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `ticket_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_sub_categories`
--

LOCK TABLES `ticket_sub_categories` WRITE;
/*!40000 ALTER TABLE `ticket_sub_categories` DISABLE KEYS */;
INSERT INTO `ticket_sub_categories` VALUES (1,1,'Sub Tech Park','1','2023-06-26 00:36:57','lokesh','0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `ticket_sub_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tickets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientEmployeeId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `cabinId` int(11) DEFAULT NULL,
  `category` varchar(20) DEFAULT NULL,
  `subCategory` varchar(20) DEFAULT NULL,
  `context` varchar(100) DEFAULT NULL,
  `refNo` varchar(20) DEFAULT NULL,
  `issue` text,
  `description` text,
  `date` datetime DEFAULT NULL,
  `attended` datetime DEFAULT NULL,
  `expectedAttended` datetime DEFAULT NULL,
  `resolved` datetime DEFAULT NULL,
  `expectedResolved` datetime DEFAULT NULL,
  `closed` datetime DEFAULT NULL,
  `expectedClosed` datetime DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `assignedTo` int(11) DEFAULT NULL,
  `contextId` int(11) DEFAULT NULL,
  `priorityId` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `lastMsgId` int(11) DEFAULT NULL,
  `setAside` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientEmployeeId` (`clientEmployeeId`),
  KEY `bookingId` (`bookingId`),
  KEY `cabinId` (`cabinId`),
  KEY `assignedTo` (`assignedTo`),
  KEY `contextId` (`contextId`),
  KEY `priorityId` (`priorityId`),
  KEY `companyId` (`companyId`),
  KEY `lastMsgId` (`lastMsgId`),
  CONSTRAINT `tickets_ibfk_10` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_11` FOREIGN KEY (`cabinId`) REFERENCES `cabins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_12` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_13` FOREIGN KEY (`contextId`) REFERENCES `ticket_contexts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_14` FOREIGN KEY (`priorityId`) REFERENCES `ticket_priorities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_15` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_16` FOREIGN KEY (`lastMsgId`) REFERENCES `ticket_messages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `tickets_ibfk_9` FOREIGN KEY (`clientEmployeeId`) REFERENCES `client_employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `urn_payments`
--

DROP TABLE IF EXISTS `urn_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `urn_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `urn` varchar(100) DEFAULT NULL,
  `submitedDate` date DEFAULT NULL,
  `verifiedDate` date DEFAULT NULL,
  `verifiedBy` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `urn_payments`
--

LOCK TABLES `urn_payments` WRITE;
/*!40000 ALTER TABLE `urn_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `urn_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_messages`
--

DROP TABLE IF EXISTS `user_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `toUser` int(11) DEFAULT NULL,
  `module` varchar(20) DEFAULT NULL,
  `ticketId` int(11) DEFAULT NULL,
  `messageId` int(11) DEFAULT NULL,
  `message` text,
  `from` varchar(50) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `read` int(11) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `toUser` (`toUser`),
  KEY `ticketId` (`ticketId`),
  KEY `messageId` (`messageId`),
  CONSTRAINT `user_messages_ibfk_4` FOREIGN KEY (`toUser`) REFERENCES `users` (`id`),
  CONSTRAINT `user_messages_ibfk_5` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_messages_ibfk_6` FOREIGN KEY (`messageId`) REFERENCES `ticket_messages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_messages`
--

LOCK TABLES `user_messages` WRITE;
/*!40000 ALTER TABLE `user_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_notifications`
--

DROP TABLE IF EXISTS `user_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `link` varchar(200) DEFAULT NULL,
  `message` text,
  `webPushId` varchar(32) DEFAULT NULL,
  `mobilePushId` varchar(32) DEFAULT NULL,
  `whatsappNo` varchar(20) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_notifications`
--

LOCK TABLES `user_notifications` WRITE;
/*!40000 ALTER TABLE `user_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  `cityIds` varchar(100) DEFAULT NULL,
  `locationIds` varchar(100) DEFAULT NULL,
  `buildingIds` varchar(100) DEFAULT NULL,
  `supportLevel` varchar(20) DEFAULT NULL,
  `assigneeTypes` varchar(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_roleId_userId_unique` (`userId`,`roleId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `user_roles_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_4` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `roles` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) DEFAULT NULL,
  `webPushId` varchar(32) DEFAULT NULL,
  `mobilePushId` varchar(32) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_ibfk_1` (`companyId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Lokeswar Reddy','lokesh','Loki@Hub','loki@hustlehub.xyz','9000021909','',1,'2023-06-22 11:03:00','2023-07-29 11:48:51','lokesh',NULL,NULL,1,'2023-06-22 11:03:00','2023-06-22 11:03:00'),(4,'Loki','lokesh.2','Lokesh@erp12','loki2@hustlehub.xyz','9000021901','Support',1,'2023-06-22 14:53:16','2023-07-17 12:55:46','sam',NULL,NULL,1,NULL,NULL),(5,'Testing','tech.p','Lokesh@erp12','loki3@erp.com','9000021902','Support',1,'2023-06-22 22:28:25','2023-07-17 12:56:41','sam',NULL,NULL,1,NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_bank_accounts`
--

DROP TABLE IF EXISTS `vendor_bank_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_bank_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorId` int(11) DEFAULT NULL,
  `benificiaryName` varchar(100) DEFAULT NULL,
  `bankName` varchar(100) DEFAULT NULL,
  `accountNumber` varchar(50) DEFAULT NULL,
  `ifscCode` varchar(50) DEFAULT NULL,
  `bankBranch` varchar(100) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `verified` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  CONSTRAINT `vendor_bank_accounts_ibfk_1` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_bank_accounts`
--

LOCK TABLES `vendor_bank_accounts` WRITE;
/*!40000 ALTER TABLE `vendor_bank_accounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_bank_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_contacts`
--

DROP TABLE IF EXISTS `vendor_contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorId` int(11) DEFAULT NULL,
  `title` varchar(5) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `designation` varchar(30) DEFAULT NULL,
  `isMainContact` int(11) DEFAULT NULL,
  `idProofId` int(11) DEFAULT NULL,
  `addressProofId` int(11) DEFAULT NULL,
  `relationshipManagement` int(11) DEFAULT NULL,
  `salesManagement` int(11) DEFAULT NULL,
  `projectManager` int(11) DEFAULT NULL,
  `siteManager` int(11) DEFAULT NULL,
  `siteExecutive` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `verified` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  KEY `idProofId` (`idProofId`),
  KEY `addressProofId` (`addressProofId`),
  CONSTRAINT `vendor_contacts_ibfk_4` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_contacts_ibfk_5` FOREIGN KEY (`idProofId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_contacts_ibfk_6` FOREIGN KEY (`addressProofId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_contacts`
--

LOCK TABLES `vendor_contacts` WRITE;
/*!40000 ALTER TABLE `vendor_contacts` DISABLE KEYS */;
INSERT INTO `vendor_contacts` VALUES (1,1,'Mr','Lokesh','9000021909','lokesh@gmail.com',NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `vendor_contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_gst_compliance_terms`
--

DROP TABLE IF EXISTS `vendor_gst_compliance_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_gst_compliance_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `term` varchar(200) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `dateFrom` datetime DEFAULT NULL,
  `dateTo` datetime DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `archieved` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_gst_compliance_terms`
--

LOCK TABLES `vendor_gst_compliance_terms` WRITE;
/*!40000 ALTER TABLE `vendor_gst_compliance_terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_gst_compliance_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_payment_terms`
--

DROP TABLE IF EXISTS `vendor_payment_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_payment_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorId` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `tagName` varchar(100) DEFAULT NULL,
  `onAdvance` int(11) DEFAULT NULL,
  `onDelivery` int(11) DEFAULT NULL,
  `inProgress` int(11) DEFAULT NULL,
  `inProgressStages` text,
  `onFinish` int(11) DEFAULT NULL,
  `afterFinish` int(11) DEFAULT NULL,
  `afterFinishStages` text,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  CONSTRAINT `vendor_payment_terms_ibfk_1` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_payment_terms`
--

LOCK TABLES `vendor_payment_terms` WRITE;
/*!40000 ALTER TABLE `vendor_payment_terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_payment_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_projects`
--

DROP TABLE IF EXISTS `vendor_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `buildingId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `refNo` varchar(20) DEFAULT NULL,
  `purpose` varchar(20) DEFAULT NULL,
  `subPurpose` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `notes` text,
  `estimatedBudget` double(9,2) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `proposedBy` varchar(50) DEFAULT NULL,
  `proposedUserId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `budgetAmount` double(15,2) DEFAULT NULL,
  `paidAmount` double(15,2) DEFAULT NULL,
  `approvedAmount` double(15,2) DEFAULT NULL,
  `releasedAmount` double(15,2) DEFAULT NULL,
  `draftAmount` double(15,2) DEFAULT NULL,
  `dueAmount` double(15,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  KEY `officeId` (`officeId`),
  KEY `bookingId` (`bookingId`),
  KEY `proposedUserId` (`proposedUserId`),
  CONSTRAINT `vendor_projects_ibfk_5` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_projects_ibfk_6` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_projects_ibfk_7` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_projects_ibfk_8` FOREIGN KEY (`proposedUserId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_projects`
--

LOCK TABLES `vendor_projects` WRITE;
/*!40000 ALTER TABLE `vendor_projects` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_purchase_item_deliveries`
--

DROP TABLE IF EXISTS `vendor_purchase_item_deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_purchase_item_deliveries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaseItemId` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `receivedBy` varchar(50) DEFAULT NULL,
  `deliveredOn` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `purchaseItemId` (`purchaseItemId`),
  CONSTRAINT `vendor_purchase_item_deliveries_ibfk_1` FOREIGN KEY (`purchaseItemId`) REFERENCES `vendor_purchase_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_purchase_item_deliveries`
--

LOCK TABLES `vendor_purchase_item_deliveries` WRITE;
/*!40000 ALTER TABLE `vendor_purchase_item_deliveries` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_purchase_item_deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_purchase_item_status_images`
--

DROP TABLE IF EXISTS `vendor_purchase_item_status_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_purchase_item_status_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorPurchaseItemStatusId` int(11) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendorPurchaseItemStatusId` (`vendorPurchaseItemStatusId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `vendor_purchase_item_status_images_ibfk_3` FOREIGN KEY (`vendorPurchaseItemStatusId`) REFERENCES `vendor_purchase_item_statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_item_status_images_ibfk_4` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_purchase_item_status_images`
--

LOCK TABLES `vendor_purchase_item_status_images` WRITE;
/*!40000 ALTER TABLE `vendor_purchase_item_status_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_purchase_item_status_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_purchase_item_statuses`
--

DROP TABLE IF EXISTS `vendor_purchase_item_statuses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_purchase_item_statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaseItemId` int(11) DEFAULT NULL,
  `mileStoneId` int(11) DEFAULT NULL,
  `description` text,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `purchaseItemId` (`purchaseItemId`),
  KEY `mileStoneId` (`mileStoneId`),
  CONSTRAINT `vendor_purchase_item_statuses_ibfk_3` FOREIGN KEY (`purchaseItemId`) REFERENCES `vendor_purchase_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_item_statuses_ibfk_4` FOREIGN KEY (`mileStoneId`) REFERENCES `vendor_purchase_order_milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_purchase_item_statuses`
--

LOCK TABLES `vendor_purchase_item_statuses` WRITE;
/*!40000 ALTER TABLE `vendor_purchase_item_statuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_purchase_item_statuses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_purchase_items`
--

DROP TABLE IF EXISTS `vendor_purchase_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_purchase_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaseOrderId` int(11) DEFAULT NULL,
  `opexTypeId` int(11) DEFAULT NULL,
  `skuId` int(11) DEFAULT NULL,
  `paymentTermId` int(11) DEFAULT NULL,
  `units` int(11) DEFAULT NULL,
  `delivered` int(11) DEFAULT NULL,
  `isPrepaid` int(11) DEFAULT NULL,
  `dateFrom` date DEFAULT NULL,
  `dateTo` date DEFAULT NULL,
  `unitPrice` double(9,2) DEFAULT NULL,
  `taxableAmount` double(9,2) DEFAULT NULL,
  `gst` double(9,2) DEFAULT NULL,
  `tds` double(9,2) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `additionalChargesNote` text,
  `additionalCharges` double(9,2) DEFAULT NULL,
  `deliveryCharges` double(9,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `itemType` varchar(10) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `skuId` (`skuId`),
  KEY `paymentTermId` (`paymentTermId`),
  CONSTRAINT `vendor_purchase_items_ibfk_5` FOREIGN KEY (`purchaseOrderId`) REFERENCES `vendor_purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_items_ibfk_6` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_items_ibfk_7` FOREIGN KEY (`skuId`) REFERENCES `skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_items_ibfk_8` FOREIGN KEY (`paymentTermId`) REFERENCES `vendor_payment_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_purchase_items`
--

LOCK TABLES `vendor_purchase_items` WRITE;
/*!40000 ALTER TABLE `vendor_purchase_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_purchase_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_purchase_order_invoice_gsts`
--

DROP TABLE IF EXISTS `vendor_purchase_order_invoice_gsts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_purchase_order_invoice_gsts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaseOrderInvoiceId` int(11) DEFAULT NULL,
  `slab` int(11) DEFAULT NULL,
  `isVerification` int(11) DEFAULT NULL,
  `gst` double(11,2) DEFAULT NULL,
  `tds` double(11,2) DEFAULT NULL,
  `igst` double(11,2) DEFAULT NULL,
  `cgst` double(11,2) DEFAULT NULL,
  `sgst` double(11,2) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `purchaseOrderInvoiceId` (`purchaseOrderInvoiceId`),
  CONSTRAINT `vendor_purchase_order_invoice_gsts_ibfk_1` FOREIGN KEY (`purchaseOrderInvoiceId`) REFERENCES `vendor_purchase_order_invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_purchase_order_invoice_gsts`
--

LOCK TABLES `vendor_purchase_order_invoice_gsts` WRITE;
/*!40000 ALTER TABLE `vendor_purchase_order_invoice_gsts` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_purchase_order_invoice_gsts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_purchase_order_invoices`
--

DROP TABLE IF EXISTS `vendor_purchase_order_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_purchase_order_invoices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `purchaseOrderId` int(11) DEFAULT NULL,
  `gstFileId` int(11) DEFAULT NULL,
  `docId` int(11) DEFAULT NULL,
  `amount` double(11,2) DEFAULT NULL,
  `invoiceDate` datetime DEFAULT NULL,
  `invoiceDueDate` datetime DEFAULT NULL,
  `billNo` varchar(20) DEFAULT NULL,
  `invoiceNo` varchar(50) DEFAULT NULL,
  `taxableAmount` double(11,2) DEFAULT NULL,
  `gst` double(11,2) DEFAULT NULL,
  `tds` double(11,2) DEFAULT NULL,
  `igst` double(11,2) DEFAULT NULL,
  `cgst` double(11,2) DEFAULT NULL,
  `sgst` double(11,2) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `gstVerificationStatus` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `gstFileId` (`gstFileId`),
  KEY `docId` (`docId`),
  CONSTRAINT `vendor_purchase_order_invoices_ibfk_4` FOREIGN KEY (`purchaseOrderId`) REFERENCES `vendor_purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_invoices_ibfk_5` FOREIGN KEY (`gstFileId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_invoices_ibfk_6` FOREIGN KEY (`docId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_purchase_order_invoices`
--

LOCK TABLES `vendor_purchase_order_invoices` WRITE;
/*!40000 ALTER TABLE `vendor_purchase_order_invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_purchase_order_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_purchase_order_milestones`
--

DROP TABLE IF EXISTS `vendor_purchase_order_milestones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_purchase_order_milestones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parentMilestoneId` int(11) DEFAULT NULL,
  `purchaseOrderId` int(11) DEFAULT NULL,
  `purchaseItemId` int(11) DEFAULT NULL,
  `tds` double(9,2) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `paymentMode` varchar(10) DEFAULT NULL,
  `payoutId` int(11) DEFAULT NULL,
  `name` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `utr` varchar(100) DEFAULT NULL,
  `chequeNumber` varchar(100) DEFAULT NULL,
  `chequeIssueTo` varchar(100) DEFAULT NULL,
  `chequeIssuedDate` datetime DEFAULT NULL,
  `releasedBy` varchar(30) DEFAULT NULL,
  `releasedOn` datetime DEFAULT NULL,
  `approvedBy` varchar(30) DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `paidBy` varchar(30) DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `expectedDate` datetime DEFAULT NULL,
  `actualDate` datetime DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `isPrepaid` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parentMilestoneId` (`parentMilestoneId`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `purchaseItemId` (`purchaseItemId`),
  KEY `payoutId` (`payoutId`),
  CONSTRAINT `vendor_purchase_order_milestones_ibfk_5` FOREIGN KEY (`parentMilestoneId`) REFERENCES `vendor_purchase_order_milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_milestones_ibfk_6` FOREIGN KEY (`purchaseOrderId`) REFERENCES `vendor_purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_milestones_ibfk_7` FOREIGN KEY (`purchaseItemId`) REFERENCES `vendor_purchase_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_milestones_ibfk_8` FOREIGN KEY (`payoutId`) REFERENCES `payout_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_purchase_order_milestones`
--

LOCK TABLES `vendor_purchase_order_milestones` WRITE;
/*!40000 ALTER TABLE `vendor_purchase_order_milestones` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_purchase_order_milestones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_purchase_orders`
--

DROP TABLE IF EXISTS `vendor_purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_purchase_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) DEFAULT NULL,
  `vendorId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `deliveryStoreId` int(11) DEFAULT NULL,
  `workOrderId` int(11) DEFAULT NULL,
  `vendorBankAccountId` int(11) DEFAULT NULL,
  `opexPaymentId` int(11) DEFAULT NULL,
  `executive` int(11) DEFAULT NULL,
  `manager` int(11) DEFAULT NULL,
  `amount` double(11,2) DEFAULT NULL,
  `paidAmount` double(11,2) DEFAULT NULL,
  `approvedAmount` double(11,2) DEFAULT NULL,
  `releasedAmount` double(11,2) DEFAULT NULL,
  `draftAmount` double(11,2) DEFAULT NULL,
  `dueAmount` double(11,2) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `pdfId` int(11) DEFAULT NULL,
  `proformaInvoiceId` int(11) DEFAULT NULL,
  `taxInvoiceId` int(11) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `refNo` varchar(30) DEFAULT NULL,
  `approvedBy` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `startedOn` datetime DEFAULT NULL,
  `startedBy` varchar(30) DEFAULT NULL,
  `closedOn` datetime DEFAULT NULL,
  `closedBy` varchar(30) DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `editHistory` text,
  `additionalChargesNote` text,
  `deletedReason` text,
  `additionalCharges` double(9,2) DEFAULT NULL,
  `deliveryCharges` double(9,2) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `isOpex` int(11) DEFAULT NULL,
  `isBill` int(11) DEFAULT NULL,
  `hasAdvancePayment` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `officeId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `vendorId` (`vendorId`),
  KEY `buildingId` (`buildingId`),
  KEY `deliveryStoreId` (`deliveryStoreId`),
  KEY `workOrderId` (`workOrderId`),
  KEY `vendorBankAccountId` (`vendorBankAccountId`),
  KEY `opexPaymentId` (`opexPaymentId`),
  KEY `executive` (`executive`),
  KEY `manager` (`manager`),
  KEY `pdfId` (`pdfId`),
  KEY `taxInvoiceId` (`taxInvoiceId`),
  KEY `officeId` (`officeId`),
  CONSTRAINT `vendor_purchase_orders_ibfk_13` FOREIGN KEY (`projectId`) REFERENCES `vendor_projects` (`id`),
  CONSTRAINT `vendor_purchase_orders_ibfk_14` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_orders_ibfk_15` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_orders_ibfk_16` FOREIGN KEY (`deliveryStoreId`) REFERENCES `asset_stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_orders_ibfk_17` FOREIGN KEY (`workOrderId`) REFERENCES `vendor_work_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_orders_ibfk_18` FOREIGN KEY (`vendorBankAccountId`) REFERENCES `vendor_bank_accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_orders_ibfk_19` FOREIGN KEY (`opexPaymentId`) REFERENCES `opex_recurring_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_orders_ibfk_20` FOREIGN KEY (`executive`) REFERENCES `users` (`id`),
  CONSTRAINT `vendor_purchase_orders_ibfk_21` FOREIGN KEY (`manager`) REFERENCES `users` (`id`),
  CONSTRAINT `vendor_purchase_orders_ibfk_22` FOREIGN KEY (`pdfId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_orders_ibfk_23` FOREIGN KEY (`taxInvoiceId`) REFERENCES `vendor_purchase_order_invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_orders_ibfk_24` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_purchase_orders`
--

LOCK TABLES `vendor_purchase_orders` WRITE;
/*!40000 ALTER TABLE `vendor_purchase_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_sku_pricings`
--

DROP TABLE IF EXISTS `vendor_sku_pricings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_sku_pricings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorSkuId` int(11) DEFAULT NULL,
  `paymentTermId` int(11) DEFAULT NULL,
  `minQty` int(11) DEFAULT NULL,
  `maxQty` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `price` double(9,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendorSkuId` (`vendorSkuId`),
  KEY `paymentTermId` (`paymentTermId`),
  CONSTRAINT `vendor_sku_pricings_ibfk_3` FOREIGN KEY (`vendorSkuId`) REFERENCES `vendor_skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_sku_pricings_ibfk_4` FOREIGN KEY (`paymentTermId`) REFERENCES `vendor_payment_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_sku_pricings`
--

LOCK TABLES `vendor_sku_pricings` WRITE;
/*!40000 ALTER TABLE `vendor_sku_pricings` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_sku_pricings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_skus`
--

DROP TABLE IF EXISTS `vendor_skus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_skus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorId` int(11) DEFAULT NULL,
  `opexTypeId` int(11) DEFAULT NULL,
  `skuId` int(11) DEFAULT NULL,
  `minPrice` double DEFAULT NULL,
  `maxPrice` double DEFAULT NULL,
  `imgId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `rejectedMessage` text,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `skuId` (`skuId`),
  CONSTRAINT `vendor_skus_ibfk_4` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_skus_ibfk_5` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_skus_ibfk_6` FOREIGN KEY (`skuId`) REFERENCES `skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_skus`
--

LOCK TABLES `vendor_skus` WRITE;
/*!40000 ALTER TABLE `vendor_skus` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_skus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_tds_compliance_terms`
--

DROP TABLE IF EXISTS `vendor_tds_compliance_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_tds_compliance_terms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `term` varchar(200) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `dateFrom` datetime DEFAULT NULL,
  `dateTo` datetime DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `archieved` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_tds_compliance_terms`
--

LOCK TABLES `vendor_tds_compliance_terms` WRITE;
/*!40000 ALTER TABLE `vendor_tds_compliance_terms` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_tds_compliance_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_tds_deductions`
--

DROP TABLE IF EXISTS `vendor_tds_deductions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_tds_deductions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorId` int(11) DEFAULT NULL,
  `milestoneId` int(11) DEFAULT NULL,
  `tdsDeducted` double(9,2) DEFAULT NULL,
  `tdsPercent` double(9,2) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `year` varchar(10) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  KEY `milestoneId` (`milestoneId`),
  CONSTRAINT `vendor_tds_deductions_ibfk_3` FOREIGN KEY (`vendorId`) REFERENCES `vendor_skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_tds_deductions_ibfk_4` FOREIGN KEY (`milestoneId`) REFERENCES `vendor_purchase_order_milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_tds_deductions`
--

LOCK TABLES `vendor_tds_deductions` WRITE;
/*!40000 ALTER TABLE `vendor_tds_deductions` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_tds_deductions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_tds_payments`
--

DROP TABLE IF EXISTS `vendor_tds_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_tds_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vendorId` int(11) DEFAULT NULL,
  `complianceTermId` int(11) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `tdsFileId` int(11) DEFAULT NULL,
  `updatedBy` varchar(50) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  KEY `complianceTermId` (`complianceTermId`),
  KEY `tdsFileId` (`tdsFileId`),
  CONSTRAINT `vendor_tds_payments_ibfk_4` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_tds_payments_ibfk_5` FOREIGN KEY (`complianceTermId`) REFERENCES `vendor_tds_compliance_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_tds_payments_ibfk_6` FOREIGN KEY (`tdsFileId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_tds_payments`
--

LOCK TABLES `vendor_tds_payments` WRITE;
/*!40000 ALTER TABLE `vendor_tds_payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_tds_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_work_items`
--

DROP TABLE IF EXISTS `vendor_work_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_work_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `workOrderId` int(11) DEFAULT NULL,
  `skuId` int(11) DEFAULT NULL,
  `paymentTermId` int(11) DEFAULT NULL,
  `description` text,
  `units` int(11) DEFAULT NULL,
  `unitPrice` double(9,2) DEFAULT NULL,
  `cost` double(9,2) DEFAULT NULL,
  `gst` double(9,2) DEFAULT NULL,
  `totalAmount` double(9,2) DEFAULT NULL,
  `totalDiscount` double(9,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `declinedComments` text,
  `vendorAcceptanceStatus` varchar(20) DEFAULT NULL,
  `vendorRejectedReason` varchar(30) DEFAULT NULL,
  `vendorRejectedComments` text,
  `updatedBy` varchar(30) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `workOrderId` (`workOrderId`),
  KEY `skuId` (`skuId`),
  KEY `paymentTermId` (`paymentTermId`),
  CONSTRAINT `vendor_work_items_ibfk_4` FOREIGN KEY (`workOrderId`) REFERENCES `vendor_work_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_work_items_ibfk_5` FOREIGN KEY (`skuId`) REFERENCES `skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_work_items_ibfk_6` FOREIGN KEY (`paymentTermId`) REFERENCES `vendor_payment_terms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_work_items`
--

LOCK TABLES `vendor_work_items` WRITE;
/*!40000 ALTER TABLE `vendor_work_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_work_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_work_orders`
--

DROP TABLE IF EXISTS `vendor_work_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendor_work_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `projectId` int(11) DEFAULT NULL,
  `vendorId` int(11) DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `deliveryStoreId` int(11) DEFAULT NULL,
  `paymentTermId` int(11) DEFAULT NULL,
  `refNo` varchar(20) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `proposedBy` varchar(30) DEFAULT NULL,
  `proposedOn` datetime DEFAULT NULL,
  `approvedBy` varchar(30) DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `vendorAcceptedOn` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `budget` double(9,2) DEFAULT NULL,
  `manager` varchar(30) DEFAULT NULL,
  `executive` varchar(30) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) DEFAULT NULL,
  `isOpex` int(11) DEFAULT NULL,
  `additionalChargesNote` text,
  `expectedDates` text,
  `additionalCharges` double(9,2) DEFAULT NULL,
  `deliveryCharges` double(9,2) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projectId` (`projectId`),
  KEY `vendorId` (`vendorId`),
  KEY `buildingId` (`buildingId`),
  KEY `deliveryStoreId` (`deliveryStoreId`),
  KEY `paymentTermId` (`paymentTermId`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `vendor_work_orders_ibfk_10` FOREIGN KEY (`deliveryStoreId`) REFERENCES `asset_stores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_work_orders_ibfk_11` FOREIGN KEY (`paymentTermId`) REFERENCES `vendor_payment_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_work_orders_ibfk_12` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_work_orders_ibfk_7` FOREIGN KEY (`projectId`) REFERENCES `vendor_projects` (`id`),
  CONSTRAINT `vendor_work_orders_ibfk_8` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_work_orders_ibfk_9` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_work_orders`
--

LOCK TABLES `vendor_work_orders` WRITE;
/*!40000 ALTER TABLE `vendor_work_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_work_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendors`
--

DROP TABLE IF EXISTS `vendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vendors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `companyId` int(11) DEFAULT NULL,
  `vendorType` varchar(20) DEFAULT NULL,
  `refNo` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(250) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `hasGst` int(11) DEFAULT NULL,
  `pan` varchar(50) DEFAULT NULL,
  `gst` varchar(50) DEFAULT NULL,
  `cin` varchar(50) DEFAULT NULL,
  `msme` varchar(50) DEFAULT NULL,
  `panId` int(11) DEFAULT NULL,
  `gstId` int(11) DEFAULT NULL,
  `cinId` int(11) DEFAULT NULL,
  `msmeId` int(11) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL,
  `verified` int(11) DEFAULT NULL,
  `verifiedBy` varchar(20) DEFAULT NULL,
  `verifiedOn` datetime DEFAULT NULL,
  `referredBy` varchar(20) DEFAULT NULL,
  `referredOn` datetime DEFAULT NULL,
  `paymentMode` varchar(20) DEFAULT NULL,
  `isServiceVendor` int(11) DEFAULT NULL,
  `itLedgerAdded` int(11) DEFAULT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cityId` (`cityId`),
  CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
INSERT INTO `vendors` VALUES (1,1,'Proprietorship','VEN-ABC-100001','Lokesh Reddy','Hyderabad','2023-06-22 15:26:09',NULL,'1234',NULL,NULL,'1234',NULL,NULL,NULL,NULL,'New',1,NULL,NULL,NULL,NULL,'lokesh','2023-06-22 15:26:09','BankTransfer',NULL,NULL,'info','0000-00-00 00:00:00','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `vendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visits`
--

DROP TABLE IF EXISTS `visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `leadId` int(11) DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `assignedTo` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `officeId` (`officeId`),
  KEY `assignedTo` (`assignedTo`),
  CONSTRAINT `visits_ibfk_4` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `visits_ibfk_5` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `visits_ibfk_6` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visits`
--

LOCK TABLES `visits` WRITE;
/*!40000 ALTER TABLE `visits` DISABLE KEYS */;
/*!40000 ALTER TABLE `visits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vm_subscriptions`
--

DROP TABLE IF EXISTS `vm_subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vm_subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clientId` int(11) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `desktopSubscription` text,
  `androidSubscription` text,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `vm_subscriptions_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vm_subscriptions`
--

LOCK TABLES `vm_subscriptions` WRITE;
/*!40000 ALTER TABLE `vm_subscriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `vm_subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vm_visitors`
--

DROP TABLE IF EXISTS `vm_visitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vm_visitors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `comingFrom` varchar(100) DEFAULT NULL,
  `registeredOn` datetime DEFAULT NULL,
  `lastVisit` datetime DEFAULT NULL,
  `status` varchar(15) DEFAULT NULL,
  `clientId` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `vm_visitors_ibfk_1` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vm_visitors`
--

LOCK TABLES `vm_visitors` WRITE;
/*!40000 ALTER TABLE `vm_visitors` DISABLE KEYS */;
/*!40000 ALTER TABLE `vm_visitors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vm_visits`
--

DROP TABLE IF EXISTS `vm_visits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vm_visits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visitorId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `purpose` text,
  `message` text,
  `visiteeName` varchar(200) DEFAULT NULL,
  `visiteePhone` varchar(20) DEFAULT NULL,
  `visiteeDesignation` varchar(50) DEFAULT NULL,
  `visiteeCompany` varchar(100) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `subscriptionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `visitorId` (`visitorId`),
  KEY `subscriptionId` (`subscriptionId`),
  CONSTRAINT `vm_visits_ibfk_3` FOREIGN KEY (`visitorId`) REFERENCES `vm_visitors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vm_visits_ibfk_4` FOREIGN KEY (`subscriptionId`) REFERENCES `vm_subscriptions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vm_visits`
--

LOCK TABLES `vm_visits` WRITE;
/*!40000 ALTER TABLE `vm_visits` DISABLE KEYS */;
/*!40000 ALTER TABLE `vm_visits` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-16 19:50:35
