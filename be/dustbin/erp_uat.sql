-- MySQL dump 10.13  Distrib 5.7.42, for Linux (x86_64)
--
-- Host: localhost    Database: erp_uat
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
  `activity` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update` text COLLATE utf8mb4_unicode_ci,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activities`
--

LOCK TABLES `activities` WRITE;
/*!40000 ALTER TABLE `activities` DISABLE KEYS */;
INSERT INTO `activities` VALUES (1,NULL,'NewBooking','New Booking for Thirdai India Private Limited is created for Fourth Floor for rent of 120750, moving on May 20, 2022','2023-09-04 23:55:29',NULL,1,'2023-09-04 23:55:29','2023-09-04 23:55:29'),(2,NULL,'NewBooking','New Booking for Test -1 is created for Ground Floor  for rent of 100, moving on May 13, 2022','2023-09-05 23:57:20',NULL,1,'2023-09-05 23:57:20','2023-09-05 23:57:20'),(3,NULL,'NewBooking','New Booking for xyz is created for First Floor for rent of 10000, moving on Sep 01, 2023','2023-09-06 15:00:05',NULL,1,'2023-09-06 15:00:05','2023-09-06 15:00:05'),(4,NULL,'NewBooking','New Booking for hhhb is created for Second Floor for rent of 89, moving on Sep 07, 2023','2023-09-06 15:35:10',NULL,1,'2023-09-06 15:35:10','2023-09-06 15:35:10');
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
  `comments` text COLLATE utf8mb4_unicode_ci,
  `isTdsAr` int(11) DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  CONSTRAINT `ar_calls_histories_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `assignedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignedOn` datetime DEFAULT NULL,
  `deassignedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deassignedOn` datetime DEFAULT NULL,
  `assetMovementId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `purpose` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `storeId` int(11) DEFAULT NULL,
  `assetServiceProviderId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `pdfId` int(11) DEFAULT NULL,
  `approvedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `tagNo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warrentyNo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `warrentyFile` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taggedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taggedOn` datetime DEFAULT NULL,
  `verified` int(11) DEFAULT NULL,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `assetId` (`assetId`),
  CONSTRAINT `asset_items_ibfk_1` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `landline` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  CONSTRAINT `asset_service_providers_ibfk_1` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `managerId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `locationId` (`locationId`),
  KEY `managerId` (`managerId`),
  CONSTRAINT `asset_stores_ibfk_3` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `asset_stores_ibfk_4` FOREIGN KEY (`managerId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `assetId` (`assetId`),
  CONSTRAINT `asset_warrenties_ibfk_1` FOREIGN KEY (`assetId`) REFERENCES `assets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double(11,2) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` datetime DEFAULT NULL,
  `manufacturer` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `modelName` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `billId` (`billId`),
  CONSTRAINT `bill_queue_gsts_ibfk_1` FOREIGN KEY (`billId`) REFERENCES `bills_queue` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `serviceProviderText` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `addedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `noVendor` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `prepaid` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `serviceProviderText` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `addedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `noVendor` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `prepaid` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `started` date DEFAULT NULL,
  `ended` date DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `facilitySetId` (`facilitySetId`),
  KEY `deskId` (`deskId`),
  KEY `contractId` (`contractId`),
  CONSTRAINT `booked_desks_ibfk_5` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `booked_desks_ibfk_6` FOREIGN KEY (`facilitySetId`) REFERENCES `facility_sets` (`id`),
  CONSTRAINT `booked_desks_ibfk_7` FOREIGN KEY (`deskId`) REFERENCES `desks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `booked_desks_ibfk_8` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booked_desks`
--

LOCK TABLES `booked_desks` WRITE;
/*!40000 ALTER TABLE `booked_desks` DISABLE KEYS */;
INSERT INTO `booked_desks` VALUES (1,1,NULL,323,1,100,NULL,'InUse','2022-05-20',NULL,'2023-09-04 23:55:29','system','2023-09-04 23:55:29','2023-09-04 23:55:29'),(2,2,NULL,1,2,NULL,NULL,'Reserved','2022-05-13',NULL,'2023-09-05 23:57:20','system','2023-09-05 23:57:20','2023-09-05 23:57:20'),(3,2,NULL,2,2,NULL,NULL,'Reserved','2022-05-13',NULL,'2023-09-05 23:57:21','system','2023-09-05 23:57:21','2023-09-05 23:57:21'),(4,2,NULL,3,2,NULL,NULL,'Reserved','2022-05-13',NULL,'2023-09-05 23:57:21','system','2023-09-05 23:57:21','2023-09-05 23:57:21'),(5,2,NULL,4,2,NULL,NULL,'Reserved','2022-05-13',NULL,'2023-09-05 23:57:21','system','2023-09-05 23:57:21','2023-09-05 23:57:21'),(6,2,NULL,5,2,NULL,NULL,'Reserved','2022-05-13',NULL,'2023-09-05 23:57:21','system','2023-09-05 23:57:21','2023-09-05 23:57:21'),(7,2,NULL,6,2,NULL,NULL,'Reserved','2022-05-13',NULL,'2023-09-05 23:57:21','system','2023-09-05 23:57:21','2023-09-05 23:57:21'),(8,3,NULL,54,3,NULL,NULL,'InUse','2023-09-01',NULL,'2023-09-06 15:00:05','system','2023-09-06 15:00:05','2023-09-06 15:00:05'),(9,3,NULL,55,3,NULL,NULL,'InUse','2023-09-01',NULL,'2023-09-06 15:00:05','system','2023-09-06 15:00:05','2023-09-06 15:00:05'),(10,3,NULL,56,3,NULL,NULL,'InUse','2023-09-01',NULL,'2023-09-06 15:00:05','system','2023-09-06 15:00:05','2023-09-06 15:00:05'),(11,3,NULL,57,3,NULL,NULL,'InUse','2023-09-01',NULL,'2023-09-06 15:00:05','system','2023-09-06 15:00:05','2023-09-06 15:00:05'),(12,3,NULL,58,3,NULL,NULL,'InUse','2023-09-01',NULL,'2023-09-06 15:00:05','system','2023-09-06 15:00:05','2023-09-06 15:00:05'),(13,3,NULL,59,3,NULL,NULL,'InUse','2023-09-01',NULL,'2023-09-06 15:00:05','system','2023-09-06 15:00:05','2023-09-06 15:00:05'),(14,4,NULL,127,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(15,4,NULL,128,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(16,4,NULL,129,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(17,4,NULL,130,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(18,4,NULL,131,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(19,4,NULL,132,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(20,4,NULL,133,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(21,4,NULL,134,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(22,4,NULL,135,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(23,4,NULL,136,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(24,4,NULL,137,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(25,4,NULL,138,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(26,4,NULL,139,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(27,4,NULL,140,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(28,4,NULL,141,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(29,4,NULL,142,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(30,4,NULL,143,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(31,4,NULL,144,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(32,4,NULL,145,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(33,4,NULL,146,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(34,4,NULL,147,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(35,4,NULL,148,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(36,4,NULL,149,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(37,4,NULL,150,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(38,4,NULL,151,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(39,4,NULL,152,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(40,4,NULL,153,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(41,4,NULL,154,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(42,4,NULL,155,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(43,4,NULL,156,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(44,4,NULL,157,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(45,4,NULL,158,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(46,4,NULL,159,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(47,4,NULL,160,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(48,4,NULL,161,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(49,4,NULL,162,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(50,4,NULL,163,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(51,4,NULL,164,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(52,4,NULL,165,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(53,4,NULL,166,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(54,4,NULL,167,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(55,4,NULL,168,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(56,4,NULL,169,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(57,4,NULL,170,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(58,4,NULL,171,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(59,4,NULL,172,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(60,4,NULL,173,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10'),(61,4,NULL,174,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(62,4,NULL,175,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(63,4,NULL,176,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(64,4,NULL,177,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(65,4,NULL,178,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(66,4,NULL,179,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(67,4,NULL,180,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(68,4,NULL,181,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(69,4,NULL,182,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(70,4,NULL,183,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(71,4,NULL,184,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(72,4,NULL,185,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(73,4,NULL,186,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(74,4,NULL,187,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(75,4,NULL,188,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(76,4,NULL,189,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(77,4,NULL,190,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(78,4,NULL,191,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(79,4,NULL,192,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(80,4,NULL,193,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(81,4,NULL,194,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(82,4,NULL,195,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(83,4,NULL,196,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(84,4,NULL,197,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(85,4,NULL,198,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(86,4,NULL,199,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(87,4,NULL,200,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(88,4,NULL,201,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(89,4,NULL,202,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11'),(90,4,NULL,203,4,NULL,NULL,'Reserved','2023-09-07',NULL,'2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11');
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_mails_mailId_bookingId_unique` (`bookingId`,`mailId`),
  KEY `mailId` (`mailId`),
  CONSTRAINT `booking_mails_ibfk_3` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `booking_mails_ibfk_4` FOREIGN KEY (`mailId`) REFERENCES `mails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_mails`
--

LOCK TABLES `booking_mails` WRITE;
/*!40000 ALTER TABLE `booking_mails` DISABLE KEYS */;
INSERT INTO `booking_mails` VALUES (1,1,1,'2023-09-05 21:39:59','2023-09-05 21:39:59'),(2,1,2,'2023-09-05 21:40:04','2023-09-05 21:40:04'),(3,2,3,'2023-09-05 23:58:13','2023-09-05 23:58:13'),(4,2,4,'2023-09-05 23:58:17','2023-09-05 23:58:17'),(5,3,5,'2023-09-06 15:03:19','2023-09-06 15:03:19'),(6,3,6,'2023-09-06 15:03:24','2023-09-06 15:03:24');
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
  `offices` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refNo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,1,1,5,1,NULL,'Fourth Floor','Active','HHBK23-1','2023-09-04 23:55:29','2022-05-20 05:30:00',NULL,NULL,1,1,NULL,NULL,1,475410.00,0.00,475410.00,'2023-09-05 21:49:45','lokesh','2023-09-04 23:55:29','2023-09-04 23:55:29'),(2,2,1,1,1,NULL,'Ground Floor ','New','HHBK23-2','2023-09-05 23:57:20','2022-05-13 05:30:00',NULL,NULL,6,1,NULL,NULL,2,356.00,0.00,356.00,'2023-09-05 23:57:20','system','2023-09-05 23:57:20','2023-09-05 23:57:20'),(3,3,1,2,1,NULL,'First Floor','Active','HHBK23-3','2023-09-06 15:00:05','2023-09-01 05:30:00',NULL,NULL,6,1,NULL,NULL,3,31800.00,0.00,31800.00,'2023-09-06 15:06:36','loki3','2023-09-06 15:00:05','2023-09-06 15:00:05'),(4,4,1,3,1,NULL,'Second Floor','New','HHBK23-4','2023-09-06 15:35:10','2023-09-07 05:30:00',NULL,NULL,77,1,NULL,NULL,4,NULL,NULL,NULL,'2023-09-06 15:35:10','system','2023-09-06 15:35:10','2023-09-06 15:35:10');
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `notes` text COLLATE utf8mb4_unicode_ci,
  `responsibility` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `amcItemId` (`amcItemId`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `building_amcs_ibfk_3` FOREIGN KEY (`amcItemId`) REFERENCES `building_amc_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `building_amcs_ibfk_4` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purposes` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `addedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `building_contacts_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `term` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `info` text COLLATE utf8mb4_unicode_ci,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `building_contract_terms_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `building_images_imageId_buildingId_unique` (`buildingId`,`imageId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `building_images_ibfk_3` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `building_images_ibfk_4` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floors` int(11) DEFAULT NULL,
  `locationId` int(11) DEFAULT NULL,
  `street` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `landmark` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quarter` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sqftAreaImage` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buildupArea` int(11) DEFAULT NULL,
  `carpetArea` int(11) DEFAULT NULL,
  `shortlisted` int(11) DEFAULT NULL,
  `expectedLive` datetime DEFAULT NULL,
  `handover` datetime DEFAULT NULL,
  `sqftPrice` double(8,2) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `locationId` (`locationId`),
  CONSTRAINT `building_properties_ibfk_1` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purposes` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT '0',
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `addedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `propertyId` (`propertyId`),
  CONSTRAINT `building_property_contacts_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `building_properties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `propertyId` (`propertyId`),
  KEY `propertyContractId` (`propertyContractId`),
  CONSTRAINT `building_property_contract_negotiations_ibfk_3` FOREIGN KEY (`propertyId`) REFERENCES `building_properties` (`id`),
  CONSTRAINT `building_property_contract_negotiations_ibfk_4` FOREIGN KEY (`propertyContractId`) REFERENCES `building_property_contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `initiatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `propertyId` (`propertyId`),
  CONSTRAINT `building_property_contracts_ibfk_1` FOREIGN KEY (`propertyId`) REFERENCES `building_properties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `building_property_images_imageId_propertyId_unique` (`propertyId`,`imageId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `building_property_images_ibfk_3` FOREIGN KEY (`propertyId`) REFERENCES `building_properties` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `building_property_images_ibfk_4` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buildingServiceId` (`buildingServiceId`),
  KEY `userId` (`userId`),
  CONSTRAINT `building_service_assignees_ibfk_3` FOREIGN KEY (`buildingServiceId`) REFERENCES `building_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `building_service_assignees_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `serviceCode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serviceNotes` text COLLATE utf8mb4_unicode_ci,
  `clientNotes` text COLLATE utf8mb4_unicode_ci,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `building_services_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `size` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floors` int(11) DEFAULT NULL,
  `locationId` int(11) DEFAULT NULL,
  `street` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `landmark` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `webUrl` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `active` int(11) DEFAULT '0',
  `isServiceable` int(11) DEFAULT '0',
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `avgDeskPrice` double(7,2) DEFAULT NULL,
  `status` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allowedDeskSizes` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `locationId` (`locationId`),
  KEY `agreementId` (`agreementId`),
  CONSTRAINT `buildings_ibfk_3` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `buildings_ibfk_4` FOREIGN KEY (`agreementId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buildings`
--

LOCK TABLES `buildings` WRITE;
/*!40000 ALTER TABLE `buildings` DISABLE KEYS */;
INSERT INTO `buildings` VALUES (1,'H203','undefinedxundefined',NULL,1,'24th main HSR Layout','Bindu Bar and Restaurant opp ','#522, 24th Main Rd, Parangi Palaya, Sector 2, HSR Layout, Bengaluru, Karnataka 560102',NULL,NULL,NULL,1,0,NULL,NULL,NULL,'Live','Standard,Luxury,Minimal,Custom,SuperLuxury,VeryMinimal',NULL,0,NULL,0,NULL,'2022-09-01 00:00:00',NULL,NULL,NULL,NULL,1,'2023-09-01 14:55:18','2023-09-01 14:55:18'),(2,'H1701','undefinedxundefined',NULL,1,'17th Cross','Opp To BDA Complex',' 7, 17th Cross, 7th Sector, HSR Layout, Bengaluru, 560034, Sector 6, HSR Layout, Bengaluru, Karnataka 560102',NULL,NULL,'H1701',1,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,'2023-09-06 14:46:07','2023-09-06 14:46:07');
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
  `section` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `acronym` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `term` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deskType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deskSize` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalArea` int(11) DEFAULT NULL,
  `usedArea` int(11) DEFAULT NULL,
  `deskc` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `officeId` (`officeId`),
  KEY `floorId` (`floorId`),
  CONSTRAINT `cabins_ibfk_3` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `cabins_ibfk_4` FOREIGN KEY (`floorId`) REFERENCES `floors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabins`
--

LOCK TABLES `cabins` WRITE;
/*!40000 ALTER TABLE `cabins` DISABLE KEYS */;
INSERT INTO `cabins` VALUES (1,1,NULL,'C1','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 15:40:19','2023-09-01 15:40:19'),(2,1,NULL,'C2','EnterpriseOffice','Standard',1000,NULL,NULL,NULL,'2023-09-01 15:40:50','2023-09-01 15:40:50'),(3,1,NULL,'C3','EnterpriseOffice','Standard',150,NULL,NULL,NULL,'2023-09-01 15:41:12','2023-09-01 15:41:12'),(4,2,NULL,'C1','EnterpriseOffice','Standard',120,NULL,NULL,1,'2023-09-01 19:40:53','2023-09-01 19:40:53'),(5,2,NULL,'C2','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 19:41:27','2023-09-01 19:41:27'),(6,2,NULL,'C3','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 19:41:43','2023-09-01 19:41:43'),(7,2,NULL,'C4','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 19:42:04','2023-09-01 19:42:04'),(8,2,NULL,'C5','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 19:42:18','2023-09-01 19:42:18'),(9,2,NULL,'C6','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 19:42:32','2023-09-01 19:42:32'),(10,2,NULL,'C7','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 19:42:51','2023-09-01 19:42:51'),(11,2,NULL,'C8','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 19:43:05','2023-09-01 19:43:05'),(12,2,NULL,'C9','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 19:43:39','2023-09-01 19:43:39'),(13,3,NULL,'C1','EnterpriseOffice','Standard',500,NULL,NULL,1,'2023-09-01 19:45:31','2023-09-01 19:45:31'),(14,4,NULL,'C1','EnterpriseOffice','Standard',60,NULL,NULL,1,'2023-09-01 20:04:20','2023-09-01 20:04:20'),(15,4,NULL,'C2','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 20:04:33','2023-09-01 20:04:33'),(16,4,NULL,'C3','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 20:04:46','2023-09-01 20:04:46'),(17,4,NULL,'C4','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 20:04:59','2023-09-01 20:04:59'),(18,4,NULL,'C5','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 20:05:13','2023-09-01 20:05:13'),(19,4,NULL,'C6','PrivateOffice','Standard',1000,NULL,NULL,1,'2023-09-01 20:05:36','2023-09-01 20:05:36'),(20,5,NULL,'C1','EnterpriseOffice','Standard',10,NULL,NULL,1,'2023-09-01 20:08:50','2023-09-01 20:08:50'),(21,5,NULL,'C2','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 20:09:05','2023-09-01 20:09:05'),(22,5,NULL,'C3','EnterpriseOffice','Standard',100,100,NULL,1,'2023-09-01 20:09:20','2023-09-01 20:09:20'),(23,6,NULL,'C1','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 20:14:08','2023-09-01 20:14:08'),(24,6,NULL,'C2','EnterpriseOffice','Standard',100,NULL,NULL,1,'2023-09-01 20:14:27','2023-09-01 20:14:27');
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
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `started` datetime DEFAULT NULL,
  `ended` datetime DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `bookingId` (`bookingId`),
  KEY `ticketId` (`ticketId`),
  CONSTRAINT `calls_ibfk_4` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `calls_ibfk_5` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`),
  CONSTRAINT `calls_ibfk_6` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `locationc` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `countryId` (`countryId`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`countryId`) REFERENCES `countries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,1,'Bengaluru',1,NULL,'2023-09-01 14:53:11','2023-09-01 14:53:11');
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPurposes` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `hasAccess` int(11) DEFAULT NULL,
  `verified` int(11) DEFAULT NULL,
  `password` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  KEY `client_employees_ibfk_4_idx` (`companyId`),
  CONSTRAINT `client_employees_ibfk_3` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `client_employees_ibfk_4` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `title` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyRegistrationId` int(11) DEFAULT NULL,
  `gstRegistrationId` int(11) DEFAULT NULL,
  `gstNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `panNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stateCode` int(11) DEFAULT NULL,
  `panCardId` int(11) DEFAULT NULL,
  `benificiaryName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ifscCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updateBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `companyId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `companyRegistrationId` (`companyRegistrationId`),
  KEY `gstRegistrationId` (`gstRegistrationId`),
  KEY `panCardId` (`panCardId`),
  CONSTRAINT `clients_ibfk_1` FOREIGN KEY (`companyRegistrationId`) REFERENCES `docs` (`id`),
  CONSTRAINT `clients_ibfk_2` FOREIGN KEY (`gstRegistrationId`) REFERENCES `docs` (`id`),
  CONSTRAINT `clients_ibfk_3` FOREIGN KEY (`panCardId`) REFERENCES `docs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,NULL,NULL,'Thirdai India Private Limited','xyz','pratibha@hustlehub.xyz','9108624982','No. 52, 1st Floor, 100 Feet Road, 2nd Block, Koramangala, Bangalore, 560034','https://www.thirdai.com/',NULL,NULL,'29AAJCT2938E1Z3',NULL,NULL,NULL,NULL,NULL,NULL,'2023-09-04 23:55:29',NULL,'2023-09-04 23:55:29','2023-09-04 23:55:29',NULL),(2,NULL,NULL,'Test -1','Loki','lokeshreddy.art@gmail.com','9000021909','bengaluru',NULL,NULL,NULL,'KUG8757','JFHF77646',NULL,NULL,NULL,NULL,NULL,'2023-09-05 23:57:20',NULL,'2023-09-05 23:57:20','2023-09-05 23:57:20',NULL),(3,NULL,NULL,'xyz','9108624982','bjjks@gmail.com','9108624982','HSR','hjgjhgjgk',NULL,NULL,'jghjg','mbb',NULL,NULL,NULL,NULL,NULL,'2023-09-06 15:00:05',NULL,'2023-09-06 15:00:05','2023-09-06 15:00:05',NULL),(4,NULL,NULL,'hhhb','787686t8','samhitha@hustlehub.xyz','8861399452','hnhsb',NULL,NULL,NULL,'8su80','iu78y89qa',NULL,NULL,NULL,NULL,NULL,'2023-09-06 15:35:10',NULL,'2023-09-06 15:35:10','2023-09-06 15:35:10',NULL);
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tradeName` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shortName` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `erpDomain` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `squareLogo` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gstNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `panNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stateCode` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `bankName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branchName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ifscCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountNumber` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supportPhone` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supportEmail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primaryColor` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accentColor` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modules` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tradeName` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shortName` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `erpDomain` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `logo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `squareLogo` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gstNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `panNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stateCode` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `bankName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `branchName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ifscCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountNumber` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supportPhone` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supportEmail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primaryColor` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accentColor` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modules` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company`
--

LOCK TABLES `company` WRITE;
/*!40000 ALTER TABLE `company` DISABLE KEYS */;
INSERT INTO `company` VALUES (1,'CLOMOSO TECHNOLOGIES PRIVATE LIMITED','CLOMOSO TECHNOLOGIES PRIVATE LIMITED','HH','Ground Floor, No.36/5, Hustle Hub Tech Park, 27th Main Road, Sector 2 HSR Layout, Bengaluru, Bengaluru Urban, Karnataka, 560102','Bengaluru','Karnataka ','9494514228','accounts1@hustlehub.xyz','hustlehub.xyz','hustlehub.xyz','https://gcdnb.pbrd.co/images/6uWdp93hyCNQ.png','https://gcdnb.pbrd.co/images/6uWdp93hyCNQ.png','29AAGCC4583M3ZZ','AAGCC4583M','U72900KA2016PTC092787',29,1,'Kotak Mahindra','Jakkasandra Branch, Bengaluru ','KKBK0000430','9611778643','CLOMOSO TECHNOLOGIES PRIVATE LIMITED','8047489999','info@hustlehub.xyz','','','2023-06-22 11:08:59','2023-08-29 12:04:39',NULL,NULL,'2023-06-22 11:08:59','2023-06-22 11:08:59'),(2,'TechHub','TechHub','TH','Dummy Address','Bengalore','Karnataka','9000021909','loki@TechHub.com','TechHub.com','TechHub.com','https://i.ibb.co/q5xN2gD/TH-logo.png','https://i.ibb.co/q5xN2gD/TH-logo.png','900','900','900',13,1,'ASD','ASD','900','123456789','ASD','9000000001','info@techhub.com',NULL,NULL,'2023-06-22 11:08:59','2023-06-22 11:08:59',NULL,NULL,'2023-06-22 11:08:59','2023-06-22 11:08:59'),(3,'Alpha LLP',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2023-08-01 19:00:51',NULL,NULL,'2023-08-01 19:00:51','2023-08-01 19:00:51');
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPurposes` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `company_contacts_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `item` text COLLATE utf8mb4_unicode_ci,
  `amount` double DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contractId` (`contractId`),
  KEY `invoiceServiceId` (`invoiceServiceId`),
  CONSTRAINT `contract_additional_invoices_ibfk_3` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `contract_additional_invoices_ibfk_4` FOREIGN KEY (`invoiceServiceId`) REFERENCES `invoice_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `term` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `info` text COLLATE utf8mb4_unicode_ci,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `contractId` (`contractId`),
  CONSTRAINT `contract_terms_ibfk_1` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `deskType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `frequency` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `officeType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceServiceType` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `term` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kind` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `effectiveDate` datetime DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `lockInPenaltyType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lockInPenalty` int(11) DEFAULT NULL,
  `noticePeriod` int(11) DEFAULT NULL,
  `noticePeriodViolationType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `noticePeriodViolation` int(11) DEFAULT NULL,
  `freeCredits` int(11) DEFAULT NULL,
  `agreementAccepted` int(11) DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `approvedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `confirmedOn` datetime DEFAULT NULL,
  `confirmedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `agreementId` int(11) DEFAULT NULL,
  `signedAgreementId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `tokenSD` int(11) DEFAULT NULL,
  `rentFreePeriod` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `agreementId` (`agreementId`),
  KEY `signedAgreementId` (`signedAgreementId`),
  KEY `bookingId` (`bookingId`),
  CONSTRAINT `contracts_ibfk_4` FOREIGN KEY (`agreementId`) REFERENCES `docs` (`id`),
  CONSTRAINT `contracts_ibfk_5` FOREIGN KEY (`signedAgreementId`) REFERENCES `docs` (`id`),
  CONSTRAINT `contracts_ibfk_6` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contracts`
--

LOCK TABLES `contracts` WRITE;
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
INSERT INTO `contracts` VALUES (1,'EnterpriseOffice','Monthly','FurnishedFullyManaged','OfficeRent','EnterpriseOffice','LongTerm','NewBooking','2023-09-04 23:55:29','2022-05-20 12:30:00','Confirmed',0,120750,NULL,NULL,NULL,0,0,100,1208,345000,0,11,0,'MonthRent',1,1,'MonthRent',1,NULL,NULL,'2023-09-04 23:56:43',NULL,'2023-09-05 21:40:04',NULL,'2023-09-06 15:27:04','system',NULL,19,1,0,NULL,'2023-09-04 23:55:29','2023-09-04 23:55:29'),(2,'EnterpriseOffice','Monthly','FurnishedFullyManaged','OfficeRent','EnterpriseOffice','LongTerm','NewBooking','2023-09-05 23:57:20','2022-05-13 12:30:00','Confirmed',0,100,NULL,NULL,NULL,0,1,100,1,120,0,11,1,'MonthRent',1,1,'MonthRent',1,NULL,NULL,'2023-09-05 23:58:00',NULL,'2023-09-05 23:58:18',NULL,'2023-09-05 23:58:08','system',NULL,NULL,2,0,NULL,'2023-09-05 23:57:20','2023-09-05 23:57:20'),(3,'EnterpriseOffice','Monthly','FurnishedFullyManaged','OfficeRent','EnterpriseOffice','LongTerm','NewBooking','2023-09-06 15:00:05','2023-09-01 12:30:00','Confirmed',0,10000,NULL,NULL,NULL,0,0,120,83,20000,0,11,0,'MonthRent',1,1,'MonthRent',1,4,NULL,'2023-09-06 15:01:34',NULL,'2023-09-06 15:03:24',NULL,'2023-09-06 15:03:13','system',NULL,NULL,3,0,NULL,'2023-09-06 15:00:05','2023-09-06 15:00:05'),(4,'EnterpriseOffice','Monthly','FurnishedFullyManaged',NULL,'EnterpriseOffice','LongTerm','NewBooking','2023-09-06 15:35:10','2023-09-07 12:30:00','Draft',0,89,NULL,NULL,NULL,0,1,500,0,90000,0,11,1,'MonthRent',1,1,'MonthRent',676,NULL,NULL,NULL,NULL,NULL,NULL,'2023-09-06 15:35:10','system',NULL,NULL,4,NULL,NULL,'2023-09-06 15:35:10','2023-09-06 15:35:10');
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `citiec` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `countries`
--

LOCK TABLES `countries` WRITE;
/*!40000 ALTER TABLE `countries` DISABLE KEYS */;
INSERT INTO `countries` VALUES (1,'india',NULL,1,'2023-09-01 14:52:16','2023-09-01 14:52:16');
/*!40000 ALTER TABLE `countries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credits_entry`
--

DROP TABLE IF EXISTS `credits_entry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `credits_entry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `invoiceId` int(11) DEFAULT NULL,
  `credits` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `type` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `invoiceId` (`invoiceId`),
  CONSTRAINT `credits_entry_ibfk_3` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `credits_entry_ibfk_4` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credits_entry`
--

LOCK TABLES `credits_entry` WRITE;
/*!40000 ALTER TABLE `credits_entry` DISABLE KEYS */;
INSERT INTO `credits_entry` VALUES (1,3,NULL,4,70,'Free','Valid','system','2023-09-06 15:06:36','2023-09-06 15:06:36','2023-09-06 15:06:36');
/*!40000 ALTER TABLE `credits_entry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credits_used`
--

DROP TABLE IF EXISTS `credits_used`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `credits_used` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookingId` int(11) DEFAULT NULL,
  `resourceBookingId` int(11) DEFAULT NULL,
  `credits` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  `usedOn` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `resourceBookingId` (`resourceBookingId`),
  CONSTRAINT `credits_used_ibfk_3` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `credits_used_ibfk_4` FOREIGN KEY (`resourceBookingId`) REFERENCES `resource_bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credits_used`
--

LOCK TABLES `credits_used` WRITE;
/*!40000 ALTER TABLE `credits_used` DISABLE KEYS */;
/*!40000 ALTER TABLE `credits_used` ENABLE KEYS */;
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
  `addedBy` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `updatedBy` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `debitCardAccountId` (`debitCardAccountId`),
  KEY `userId` (`userId`),
  CONSTRAINT `debit_card_account_users_ibfk_3` FOREIGN KEY (`debitCardAccountId`) REFERENCES `debit_card_accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `debit_card_account_users_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `cardId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `addedBy` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `updatedBy` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  CONSTRAINT `debit_card_accounts_ibfk_1` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cabinId` (`cabinId`),
  CONSTRAINT `desks_ibfk_1` FOREIGN KEY (`cabinId`) REFERENCES `cabins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=324 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `desks`
--

LOCK TABLES `desks` WRITE;
/*!40000 ALTER TABLE `desks` DISABLE KEYS */;
INSERT INTO `desks` VALUES (1,1,'Desk_1',1,'2023-09-01 19:18:24','2023-09-01 19:18:24'),(2,1,'Desk_2',1,'2023-09-01 19:18:24','2023-09-01 19:18:24'),(3,1,'Desk_3',1,'2023-09-01 19:18:24','2023-09-01 19:18:24'),(4,1,'Desk_4',1,'2023-09-01 19:18:24','2023-09-01 19:18:24'),(5,1,'Desk_5',1,'2023-09-01 19:18:24','2023-09-01 19:18:24'),(6,1,'Desk_6',1,'2023-09-01 19:18:24','2023-09-01 19:18:24'),(7,2,'Desk_1',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(8,2,'Desk_2',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(9,2,'Desk_3',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(10,2,'Desk_4',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(11,2,'Desk_5',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(12,2,'Desk_6',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(13,2,'Desk_7',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(14,2,'Desk_8',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(15,2,'Desk_9',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(16,2,'Desk_10',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(17,2,'Desk_11',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(18,2,'Desk_12',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(19,2,'Desk_13',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(20,2,'Desk_14',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(21,2,'Desk_15',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(22,2,'Desk_16',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(23,2,'Desk_17',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(24,2,'Desk_18',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(25,2,'Desk_19',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(26,2,'Desk_20',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(27,2,'Desk_21',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(28,2,'Desk_22',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(29,2,'Desk_23',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(30,2,'Desk_24',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(31,2,'Desk_25',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(32,2,'Desk_26',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(33,2,'Desk_27',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(34,2,'Desk_28',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(35,2,'Desk_29',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(36,2,'Desk_30',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(37,2,'Desk_31',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(38,2,'Desk_32',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(39,2,'Desk_33',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(40,2,'Desk_34',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(41,2,'Desk_35',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(42,2,'Desk_36',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(43,2,'Desk_37',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(44,2,'Desk_38',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(45,2,'Desk_39',1,'2023-09-01 19:18:36','2023-09-01 19:18:36'),(46,3,'Desk_1',1,'2023-09-01 19:18:46','2023-09-01 19:18:46'),(47,3,'Desk_2',1,'2023-09-01 19:18:46','2023-09-01 19:18:46'),(48,3,'Desk_3',1,'2023-09-01 19:18:46','2023-09-01 19:18:46'),(49,3,'Desk_4',1,'2023-09-01 19:18:46','2023-09-01 19:18:46'),(50,3,'Desk_5',1,'2023-09-01 19:18:46','2023-09-01 19:18:46'),(51,3,'Desk_6',1,'2023-09-01 19:18:46','2023-09-01 19:18:46'),(52,3,'Desk_7',1,'2023-09-01 19:18:46','2023-09-01 19:18:46'),(53,3,'Desk_8',1,'2023-09-01 19:18:46','2023-09-01 19:18:46'),(54,4,'C1_1',1,'2023-09-01 19:59:59','2023-09-01 19:59:59'),(55,4,'C1_2',1,'2023-09-01 19:59:59','2023-09-01 19:59:59'),(56,4,'C1_3',1,'2023-09-01 19:59:59','2023-09-01 19:59:59'),(57,4,'C1_4',1,'2023-09-01 19:59:59','2023-09-01 19:59:59'),(58,4,'C1_5',1,'2023-09-01 19:59:59','2023-09-01 19:59:59'),(59,4,'C1_6',1,'2023-09-01 19:59:59','2023-09-01 19:59:59'),(60,5,'Desk_1',1,'2023-09-01 20:00:32','2023-09-01 20:00:32'),(61,5,'Desk_2',1,'2023-09-01 20:00:32','2023-09-01 20:00:32'),(62,5,'Desk_3',1,'2023-09-01 20:00:32','2023-09-01 20:00:32'),(63,5,'Desk_4',1,'2023-09-01 20:00:32','2023-09-01 20:00:32'),(64,5,'Desk_5',1,'2023-09-01 20:00:32','2023-09-01 20:00:32'),(65,5,'Desk_6',1,'2023-09-01 20:00:32','2023-09-01 20:00:32'),(66,6,'Desk_1',1,'2023-09-01 20:00:53','2023-09-01 20:00:53'),(67,6,'Desk_2',1,'2023-09-01 20:00:53','2023-09-01 20:00:53'),(68,6,'Desk_3',1,'2023-09-01 20:00:53','2023-09-01 20:00:53'),(69,6,'Desk_4',1,'2023-09-01 20:00:53','2023-09-01 20:00:53'),(70,6,'Desk_5',1,'2023-09-01 20:00:53','2023-09-01 20:00:53'),(71,6,'Desk_6',1,'2023-09-01 20:00:53','2023-09-01 20:00:53'),(72,7,'Desk_1',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(73,7,'Desk_2',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(74,7,'Desk_3',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(75,7,'Desk_4',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(76,7,'Desk_5',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(77,7,'Desk_6',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(78,7,'Desk_7',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(79,7,'Desk_8',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(80,7,'Desk_9',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(81,7,'Desk_10',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(82,7,'Desk_11',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(83,7,'Desk_12',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(84,7,'Desk_13',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(85,7,'Desk_14',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(86,7,'Desk_15',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(87,7,'Desk_16',1,'2023-09-01 20:01:15','2023-09-01 20:01:15'),(88,8,'Desk_1',1,'2023-09-01 20:01:49','2023-09-01 20:01:49'),(89,8,'Desk_2',1,'2023-09-01 20:01:49','2023-09-01 20:01:49'),(90,8,'Desk_3',1,'2023-09-01 20:01:49','2023-09-01 20:01:49'),(91,8,'Desk_4',1,'2023-09-01 20:01:49','2023-09-01 20:01:49'),(92,8,'Desk_5',1,'2023-09-01 20:01:50','2023-09-01 20:01:50'),(93,8,'Desk_6',1,'2023-09-01 20:01:50','2023-09-01 20:01:50'),(94,8,'Desk_7',1,'2023-09-01 20:01:50','2023-09-01 20:01:50'),(95,8,'Desk_8',1,'2023-09-01 20:01:50','2023-09-01 20:01:50'),(96,9,'Desk_1',1,'2023-09-01 20:02:02','2023-09-01 20:02:02'),(97,9,'Desk_2',1,'2023-09-01 20:02:02','2023-09-01 20:02:02'),(98,9,'Desk_3',1,'2023-09-01 20:02:02','2023-09-01 20:02:02'),(99,9,'Desk_4',1,'2023-09-01 20:02:02','2023-09-01 20:02:02'),(100,9,'Desk_5',1,'2023-09-01 20:02:02','2023-09-01 20:02:02'),(101,9,'Desk_6',1,'2023-09-01 20:02:02','2023-09-01 20:02:02'),(102,9,'Desk_7',1,'2023-09-01 20:02:02','2023-09-01 20:02:02'),(103,9,'Desk_8',1,'2023-09-01 20:02:02','2023-09-01 20:02:02'),(104,10,'Desk_1',1,'2023-09-01 20:02:20','2023-09-01 20:02:20'),(105,10,'Desk_2',1,'2023-09-01 20:02:20','2023-09-01 20:02:20'),(106,10,'Desk_3',1,'2023-09-01 20:02:20','2023-09-01 20:02:20'),(107,10,'Desk_4',1,'2023-09-01 20:02:20','2023-09-01 20:02:20'),(108,10,'Desk_5',1,'2023-09-01 20:02:20','2023-09-01 20:02:20'),(109,10,'Desk_6',1,'2023-09-01 20:02:20','2023-09-01 20:02:20'),(110,10,'Desk_7',1,'2023-09-01 20:02:20','2023-09-01 20:02:20'),(111,10,'Desk_8',1,'2023-09-01 20:02:20','2023-09-01 20:02:20'),(112,11,'Desk_1',1,'2023-09-01 20:02:35','2023-09-01 20:02:35'),(113,11,'Desk_2',1,'2023-09-01 20:02:35','2023-09-01 20:02:35'),(114,11,'Desk_3',1,'2023-09-01 20:02:35','2023-09-01 20:02:35'),(115,11,'Desk_4',1,'2023-09-01 20:02:35','2023-09-01 20:02:35'),(116,11,'Desk_5',1,'2023-09-01 20:02:35','2023-09-01 20:02:35'),(117,11,'Desk_6',1,'2023-09-01 20:02:35','2023-09-01 20:02:35'),(118,11,'Desk_7',1,'2023-09-01 20:02:35','2023-09-01 20:02:35'),(119,11,'Desk_8',1,'2023-09-01 20:02:35','2023-09-01 20:02:35'),(120,12,'Desk_1',1,'2023-09-01 20:02:46','2023-09-01 20:02:46'),(121,12,'Desk_2',1,'2023-09-01 20:02:46','2023-09-01 20:02:46'),(122,12,'Desk_3',1,'2023-09-01 20:02:46','2023-09-01 20:02:46'),(123,12,'Desk_4',1,'2023-09-01 20:02:46','2023-09-01 20:02:46'),(124,12,'Desk_5',1,'2023-09-01 20:02:46','2023-09-01 20:02:46'),(125,12,'Desk_6',1,'2023-09-01 20:02:46','2023-09-01 20:02:46'),(126,12,'Desk_7',1,'2023-09-01 20:02:46','2023-09-01 20:02:46'),(127,13,'Desk_1',1,'2023-09-01 20:03:14','2023-09-01 20:03:14'),(128,13,'Desk_2',1,'2023-09-01 20:03:14','2023-09-01 20:03:14'),(129,13,'Desk_3',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(130,13,'Desk_4',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(131,13,'Desk_5',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(132,13,'Desk_6',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(133,13,'Desk_7',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(134,13,'Desk_8',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(135,13,'Desk_9',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(136,13,'Desk_10',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(137,13,'Desk_11',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(138,13,'Desk_12',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(139,13,'Desk_13',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(140,13,'Desk_14',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(141,13,'Desk_15',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(142,13,'Desk_16',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(143,13,'Desk_17',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(144,13,'Desk_18',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(145,13,'Desk_19',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(146,13,'Desk_20',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(147,13,'Desk_21',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(148,13,'Desk_22',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(149,13,'Desk_23',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(150,13,'Desk_24',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(151,13,'Desk_25',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(152,13,'Desk_26',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(153,13,'Desk_27',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(154,13,'Desk_28',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(155,13,'Desk_29',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(156,13,'Desk_30',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(157,13,'Desk_31',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(158,13,'Desk_32',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(159,13,'Desk_33',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(160,13,'Desk_34',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(161,13,'Desk_35',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(162,13,'Desk_36',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(163,13,'Desk_37',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(164,13,'Desk_38',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(165,13,'Desk_39',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(166,13,'Desk_40',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(167,13,'Desk_41',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(168,13,'Desk_42',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(169,13,'Desk_43',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(170,13,'Desk_44',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(171,13,'Desk_45',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(172,13,'Desk_46',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(173,13,'Desk_47',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(174,13,'Desk_48',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(175,13,'Desk_49',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(176,13,'Desk_50',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(177,13,'Desk_51',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(178,13,'Desk_52',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(179,13,'Desk_53',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(180,13,'Desk_54',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(181,13,'Desk_55',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(182,13,'Desk_56',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(183,13,'Desk_57',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(184,13,'Desk_58',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(185,13,'Desk_59',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(186,13,'Desk_60',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(187,13,'Desk_61',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(188,13,'Desk_62',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(189,13,'Desk_63',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(190,13,'Desk_64',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(191,13,'Desk_65',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(192,13,'Desk_66',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(193,13,'Desk_67',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(194,13,'Desk_68',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(195,13,'Desk_69',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(196,13,'Desk_70',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(197,13,'Desk_71',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(198,13,'Desk_72',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(199,13,'Desk_73',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(200,13,'Desk_74',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(201,13,'Desk_75',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(202,13,'Desk_76',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(203,13,'Desk_77',1,'2023-09-01 20:03:15','2023-09-01 20:03:15'),(204,14,'Desk_1',1,'2023-09-01 20:06:02','2023-09-01 20:06:02'),(205,14,'Desk_2',1,'2023-09-01 20:06:02','2023-09-01 20:06:02'),(206,14,'Desk_3',1,'2023-09-01 20:06:02','2023-09-01 20:06:02'),(207,15,'Desk_1',1,'2023-09-01 20:06:16','2023-09-01 20:06:16'),(208,15,'Desk_2',1,'2023-09-01 20:06:16','2023-09-01 20:06:16'),(209,15,'Desk_3',1,'2023-09-01 20:06:16','2023-09-01 20:06:16'),(210,15,'Desk_4',1,'2023-09-01 20:06:16','2023-09-01 20:06:16'),(211,16,'Desk_1',1,'2023-09-01 20:06:33','2023-09-01 20:06:33'),(212,16,'Desk_2',1,'2023-09-01 20:06:33','2023-09-01 20:06:33'),(213,16,'Desk_3',1,'2023-09-01 20:06:33','2023-09-01 20:06:33'),(214,16,'Desk_4',1,'2023-09-01 20:06:33','2023-09-01 20:06:33'),(215,17,'Desk_1',1,'2023-09-01 20:06:47','2023-09-01 20:06:47'),(216,17,'Desk_2',1,'2023-09-01 20:06:47','2023-09-01 20:06:47'),(217,17,'Desk_3',1,'2023-09-01 20:06:47','2023-09-01 20:06:47'),(218,17,'Desk_4',1,'2023-09-01 20:06:47','2023-09-01 20:06:47'),(219,18,'Desk_1',1,'2023-09-01 20:06:59','2023-09-01 20:06:59'),(220,18,'Desk_2',1,'2023-09-01 20:06:59','2023-09-01 20:06:59'),(221,18,'Desk_3',1,'2023-09-01 20:06:59','2023-09-01 20:06:59'),(222,18,'Desk_4',1,'2023-09-01 20:06:59','2023-09-01 20:06:59'),(223,19,'Desk_1',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(224,19,'Desk_2',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(225,19,'Desk_3',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(226,19,'Desk_4',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(227,19,'Desk_5',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(228,19,'Desk_6',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(229,19,'Desk_7',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(230,19,'Desk_8',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(231,19,'Desk_9',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(232,19,'Desk_10',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(233,19,'Desk_11',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(234,19,'Desk_12',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(235,19,'Desk_13',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(236,19,'Desk_14',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(237,19,'Desk_15',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(238,19,'Desk_16',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(239,19,'Desk_17',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(240,19,'Desk_18',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(241,19,'Desk_19',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(242,19,'Desk_20',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(243,19,'Desk_21',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(244,19,'Desk_22',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(245,19,'Desk_23',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(246,19,'Desk_24',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(247,19,'Desk_25',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(248,19,'Desk_26',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(249,19,'Desk_27',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(250,19,'Desk_28',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(251,19,'Desk_29',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(252,19,'Desk_30',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(253,19,'Desk_31',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(254,19,'Desk_32',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(255,19,'Desk_33',1,'2023-09-01 20:07:14','2023-09-01 20:07:14'),(256,20,'Desk_1',1,'2023-09-01 20:11:31','2023-09-01 20:11:31'),(257,20,'Desk_2',1,'2023-09-01 20:11:31','2023-09-01 20:11:31'),(258,20,'Desk_3',1,'2023-09-01 20:11:31','2023-09-01 20:11:31'),(259,20,'Desk_4',1,'2023-09-01 20:11:31','2023-09-01 20:11:31'),(260,20,'Desk_5',1,'2023-09-01 20:11:31','2023-09-01 20:11:31'),(261,20,'Desk_6',1,'2023-09-01 20:11:31','2023-09-01 20:11:31'),(262,20,'Desk_7',1,'2023-09-01 20:11:31','2023-09-01 20:11:31'),(263,20,'Desk_8',1,'2023-09-01 20:11:31','2023-09-01 20:11:31'),(264,21,'Desk_1',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(265,21,'Desk_2',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(266,21,'Desk_3',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(267,21,'Desk_4',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(268,21,'Desk_5',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(269,21,'Desk_6',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(270,21,'Desk_7',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(271,21,'Desk_8',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(272,21,'Desk_9',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(273,21,'Desk_10',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(274,21,'Desk_11',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(275,21,'Desk_12',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(276,21,'Desk_13',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(277,21,'Desk_14',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(278,21,'Desk_15',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(279,21,'Desk_16',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(280,21,'Desk_17',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(281,21,'Desk_18',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(282,21,'Desk_19',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(283,21,'Desk_20',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(284,21,'Desk_21',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(285,21,'Desk_22',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(286,21,'Desk_23',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(287,21,'Desk_24',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(288,21,'Desk_25',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(289,21,'Desk_26',1,'2023-09-01 20:11:50','2023-09-01 20:11:50'),(290,22,'Desk_1',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(291,22,'Desk_2',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(292,22,'Desk_3',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(293,22,'Desk_4',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(294,22,'Desk_5',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(295,22,'Desk_6',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(296,22,'Desk_7',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(297,22,'Desk_8',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(298,22,'Desk_9',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(299,22,'Desk_10',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(300,22,'Desk_11',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(301,22,'Desk_12',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(302,22,'Desk_13',1,'2023-09-01 20:12:19','2023-09-01 20:12:19'),(303,22,'Desk_14',1,'2023-09-01 20:12:20','2023-09-01 20:12:20'),(304,22,'Desk_15',1,'2023-09-01 20:12:20','2023-09-01 20:12:20'),(305,23,'Desk_1',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(306,23,'Desk_2',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(307,23,'Desk_3',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(308,23,'Desk_4',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(309,23,'Desk_5',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(310,23,'Desk_6',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(311,23,'Desk_7',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(312,23,'Desk_8',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(313,23,'Desk_9',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(314,23,'Desk_10',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(315,23,'Desk_11',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(316,23,'Desk_12',1,'2023-09-01 20:14:40','2023-09-01 20:14:40'),(317,24,'Desk_1',1,'2023-09-01 20:15:03','2023-09-01 20:15:03'),(318,24,'Desk_2',1,'2023-09-01 20:15:03','2023-09-01 20:15:03'),(319,24,'Desk_3',1,'2023-09-01 20:15:03','2023-09-01 20:15:03'),(320,24,'Desk_4',1,'2023-09-01 20:15:03','2023-09-01 20:15:03'),(321,24,'Desk_5',1,'2023-09-01 20:15:03','2023-09-01 20:15:03'),(322,24,'Desk_6',1,'2023-09-01 20:15:03','2023-09-01 20:15:03'),(323,22,'Default Desk',NULL,'2023-09-04 23:55:29','2023-09-04 23:55:29');
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
  `file` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `docs`
--

LOCK TABLES `docs` WRITE;
/*!40000 ALTER TABLE `docs` DISABLE KEYS */;
INSERT INTO `docs` VALUES (1,'http://95.217.59.234:9001/download/1_INV_1_May_2022.pdf','pdf','INV_1_May_2022.pdf','2023-09-04 23:56:54','2023-09-04 23:56:54','2023-09-04 23:56:54'),(2,'http://95.217.59.234:9001/download/2_INV_1_May_2022.pdf','pdf','INV_1_May_2022.pdf','2023-09-05 00:00:05','2023-09-05 00:00:05','2023-09-05 00:00:05'),(3,'http://95.217.59.234/resources/3_INV_1_May_2022.pdf','pdf','INV_1_May_2022.pdf','2023-09-05 21:07:19','2023-09-05 21:07:19','2023-09-05 21:07:19'),(4,'http://95.217.59.234/resources/4_INV_1_May_2022.pdf','pdf','INV_1_May_2022.pdf','2023-09-05 21:29:00','2023-09-05 21:29:00','2023-09-05 21:29:00'),(5,'http://95.217.59.234/resources/5_INV_1_May_2022.pdf','pdf','INV_1_May_2022.pdf','2023-09-05 21:30:48','2023-09-05 21:30:48','2023-09-05 21:30:48'),(6,'http://95.217.59.234/resources/6_INV_1_May_2022.pdf','pdf','INV_1_May_2022.pdf','2023-09-05 21:34:00','2023-09-05 21:34:00','2023-09-05 21:34:00'),(7,'http://95.217.59.234/resources/7_INV_1_May_2022.pdf','pdf','INV_1_May_2022.pdf','2023-09-05 21:36:53','2023-09-05 21:36:53','2023-09-05 21:36:53'),(8,'http://95.217.59.234:9001/download/8_INV_1_May_2022.pdf','pdf','INV_1_May_2022.pdf','2023-09-05 21:39:53','2023-09-05 21:39:53','2023-09-05 21:39:53'),(9,'http://95.217.59.234:9001/download/9_INV_1_Apr_2023.pdf','pdf','INV_1_Apr_2023.pdf','2023-09-05 21:40:00','2023-09-05 21:40:00','2023-09-05 21:40:00'),(10,'http://95.217.59.234:9001/download/10_INV_2_May_2022.pdf','pdf','INV_2_May_2022.pdf','2023-09-05 23:58:08','2023-09-05 23:58:08','2023-09-05 23:58:08'),(11,'http://95.217.59.234:9001/download/11_INV_2_Apr_2023.pdf','pdf','INV_2_Apr_2023.pdf','2023-09-05 23:58:13','2023-09-05 23:58:13','2023-09-05 23:58:13'),(12,'http://95.217.59.234:9001/download/12_INV_2_May_2023.pdf','pdf','INV_2_May_2023.pdf','2023-09-06 00:00:52','2023-09-06 00:00:52','2023-09-06 00:00:52'),(13,'http://95.217.59.234:9001/download/13_INV_2_Jun_2023.pdf','pdf','INV_2_Jun_2023.pdf','2023-09-06 00:01:17','2023-09-06 00:01:17','2023-09-06 00:01:17'),(14,'http://95.217.59.234:9001/download/14_INV_2_Jul_2023.pdf','pdf','INV_2_Jul_2023.pdf','2023-09-06 14:59:44','2023-09-06 14:59:44','2023-09-06 14:59:44'),(15,'http://95.217.59.234:9001/download/15_INV_2_Aug_2023.pdf','pdf','INV_2_Aug_2023.pdf','2023-09-06 15:00:24','2023-09-06 15:00:24','2023-09-06 15:00:24'),(16,'http://95.217.59.234:9001/download/16_INV_2_Sep_2023.pdf','pdf','INV_2_Sep_2023.pdf','2023-09-06 15:01:03','2023-09-06 15:01:03','2023-09-06 15:01:03'),(17,'http://95.217.59.234:9001/download/17_INV_3_Sep_2023.pdf','pdf','INV_3_Sep_2023.pdf','2023-09-06 15:03:14','2023-09-06 15:03:14','2023-09-06 15:03:14'),(18,'http://95.217.59.234:9001/download/18_INV_3_Sep_2023.pdf','pdf','INV_3_Sep_2023.pdf','2023-09-06 15:03:20','2023-09-06 15:03:20','2023-09-06 15:03:20'),(19,'http://95.217.59.234:9001/download/19_1693994220265.pdf','pdf','EC 210.pdf','2023-09-06 15:27:00','2023-09-06 15:27:00','2023-09-06 15:27:00');
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
  `damage` text COLLATE utf8mb4_unicode_ci,
  `charge` int(11) DEFAULT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `exitRequestId` (`exitRequestId`),
  CONSTRAINT `exit_acrs_ibfk_1` FOREIGN KEY (`exitRequestId`) REFERENCES `exit_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `exitRequestId` (`exitRequestId`),
  CONSTRAINT `exit_comments_ibfk_1` FOREIGN KEY (`exitRequestId`) REFERENCES `exit_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `charge` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `exitRequestId` (`exitRequestId`),
  CONSTRAINT `exit_deductions_ibfk_1` FOREIGN KEY (`exitRequestId`) REFERENCES `exit_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fcpStatus` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rejectedMessage` text COLLATE utf8mb4_unicode_ci,
  `lastFcpSent` datetime DEFAULT NULL,
  `fcpDeclinedOn` datetime DEFAULT NULL,
  `refund` int(11) DEFAULT NULL,
  `refundDate` datetime DEFAULT NULL,
  `utr` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tdsRefund` int(11) DEFAULT NULL,
  `tdsRefundDate` datetime DEFAULT NULL,
  `tdsRefundUtr` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `finalStatementId` (`finalStatementId`),
  KEY `exitFormId` (`exitFormId`),
  CONSTRAINT `exit_requests_ibfk_4` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `exit_requests_ibfk_5` FOREIGN KEY (`finalStatementId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `exit_requests_ibfk_6` FOREIGN KEY (`exitFormId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `config` text COLLATE utf8mb4_unicode_ci,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `external_systems`
--

LOCK TABLES `external_systems` WRITE;
/*!40000 ALTER TABLE `external_systems` DISABLE KEYS */;
INSERT INTO `external_systems` VALUES (1,'OutBound Mail','OutBoundMail',NULL,1,'{\"host\":\"smtp.gmail.com\",\"port\":\"465\",\"senderName\":\"Loki\",\"senderEmail\":\"lokeshreddy.arm@gmail.com\",\"password\":\"yruluzpkeswkcjag\",\"secure\":true}','2023-09-05 21:27:01','system',1,'2023-09-05 21:27:01','2023-09-05 21:27:01');
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facilities`
--

LOCK TABLES `facilities` WRITE;
/*!40000 ALTER TABLE `facilities` DISABLE KEYS */;
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `facility_set_facilities_facilityId_setId_unique` (`facilityId`,`setId`),
  KEY `setId` (`setId`),
  CONSTRAINT `facility_set_facilities_ibfk_3` FOREIGN KEY (`facilityId`) REFERENCES `facilities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `facility_set_facilities_ibfk_4` FOREIGN KEY (`setId`) REFERENCES `facility_sets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facility_sets`
--

LOCK TABLES `facility_sets` WRITE;
/*!40000 ALTER TABLE `facility_sets` DISABLE KEYS */;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `officeId` int(11) DEFAULT NULL,
  `cabinc` int(11) DEFAULT NULL,
  `desks` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `officeId` (`officeId`),
  CONSTRAINT `floors_ibfk_1` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `section` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `context` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postData` text COLLATE utf8mb4_unicode_ci,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `item` text COLLATE utf8mb4_unicode_ci,
  `qty` int(11) DEFAULT NULL,
  `price` double(9,2) DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `tds` double(9,2) NOT NULL DEFAULT '0.00',
  `cgst` double(9,2) DEFAULT NULL,
  `sgst` double(9,2) DEFAULT NULL,
  `igst` double(9,2) DEFAULT NULL,
  `total` double(9,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `invoiceId` (`invoiceId`),
  KEY `invoiceServiceId` (`invoiceServiceId`),
  CONSTRAINT `invoice_items_ibfk_3` FOREIGN KEY (`invoiceId`) REFERENCES `invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `invoice_items_ibfk_4` FOREIGN KEY (`invoiceServiceId`) REFERENCES `invoice_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
INSERT INTO `invoice_items` VALUES (1,NULL,29,'Security Deposit',1,345000.00,345000.00,0.00,0.00,0.00,0.00,345000.00,'2023-09-04 23:56:54','2023-09-04 23:56:54'),(2,NULL,29,'Security Deposit',1,345000.00,345000.00,0.00,0.00,0.00,0.00,345000.00,'2023-09-05 00:00:04','2023-09-05 00:00:04'),(3,NULL,29,'Security Deposit',1,345000.00,345000.00,0.00,0.00,0.00,0.00,345000.00,'2023-09-05 21:07:19','2023-09-05 21:07:19'),(4,NULL,29,'Security Deposit',1,345000.00,345000.00,0.00,0.00,0.00,0.00,345000.00,'2023-09-05 21:29:00','2023-09-05 21:29:00'),(5,NULL,29,'Security Deposit',1,345000.00,345000.00,0.00,0.00,0.00,0.00,345000.00,'2023-09-05 21:30:47','2023-09-05 21:30:47'),(6,NULL,29,'Security Deposit',1,345000.00,345000.00,0.00,0.00,0.00,0.00,345000.00,'2023-09-05 21:34:00','2023-09-05 21:34:00'),(7,NULL,29,'Security Deposit',1,345000.00,345000.00,0.00,0.00,0.00,0.00,345000.00,'2023-09-05 21:36:53','2023-09-05 21:36:53'),(8,8,29,'Security Deposit',1,345000.00,345000.00,0.00,0.00,0.00,0.00,345000.00,'2023-09-05 21:39:53','2023-09-05 21:39:53'),(9,9,1,'1 desks in Fourth Floor <br> for period of Apr 01, 2023 - Apr 30, 2023',1,120750.00,120750.00,12075.00,10868.00,10868.00,0.00,142485.00,'2023-09-05 21:39:59','2023-09-05 21:39:59'),(10,10,29,'Security Deposit',1,120.00,120.00,0.00,0.00,0.00,0.00,120.00,'2023-09-05 23:58:08','2023-09-05 23:58:08'),(11,11,1,'6 desks in Ground Floor  <br> for period of Apr 01, 2023 - Apr 30, 2023',6,16.67,100.00,0.00,9.00,9.00,0.00,118.00,'2023-09-05 23:58:13','2023-09-05 23:58:13'),(12,12,1,'Rent for 100 SqFt at price of Rs.1 per SqFt in Ground Floor  <br> for period of May 01, 2023 - May 31, 2023',100,1.00,100.00,0.00,9.00,9.00,0.00,118.00,'2023-09-06 00:00:52','2023-09-06 00:00:52'),(13,13,1,'Rent for 100 SqFt at price of Rs.1 per SqFt in Ground Floor  <br> for period of Jun 01, 2023 - Jun 30, 2023',100,1.00,100.00,0.00,9.00,9.00,0.00,118.00,'2023-09-06 00:01:17','2023-09-06 00:01:17'),(14,14,1,'Rent for 100 SqFt at price of Rs.1 per SqFt in Ground Floor  <br> for period of Jul 01, 2023 - Jul 31, 2023',100,1.00,100.00,0.00,9.00,9.00,0.00,118.00,'2023-09-06 14:59:44','2023-09-06 14:59:44'),(15,15,1,'Rent for 100 SqFt at price of Rs.1 per SqFt in Ground Floor  <br> for period of Aug 01, 2023 - Aug 31, 2023',100,1.00,100.00,0.00,9.00,9.00,0.00,118.00,'2023-09-06 15:00:23','2023-09-06 15:00:23'),(16,16,1,'Rent for 100 SqFt at price of Rs.1 per SqFt in Ground Floor  <br> for period of Sep 01, 2023 - Sep 30, 2023',100,1.00,100.00,0.00,9.00,9.00,0.00,118.00,'2023-09-06 15:01:03','2023-09-06 15:01:03'),(17,17,29,'Security Deposit',1,20000.00,20000.00,0.00,0.00,0.00,0.00,20000.00,'2023-09-06 15:03:13','2023-09-06 15:03:13'),(18,18,1,'6 desks in First Floor <br> for period of Sep 01, 2023 - Sep 30, 2023',6,1666.67,10000.00,0.00,900.00,900.00,0.00,11800.00,'2023-09-06 15:03:19','2023-09-06 15:03:19');
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tds` double DEFAULT NULL,
  `hasGst` int(11) DEFAULT NULL,
  `inclusive` int(11) DEFAULT NULL,
  `isLiability` int(11) DEFAULT NULL,
  `sacCode` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `igst` double DEFAULT NULL,
  `cgst` double DEFAULT NULL,
  `sgst` double DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_services`
--

LOCK TABLES `invoice_services` WRITE;
/*!40000 ALTER TABLE `invoice_services` DISABLE KEYS */;
INSERT INTO `invoice_services` VALUES (1,'Office Rent Monthly','OfficeRent','Monthly',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(2,'Office Rent Non Monthly','OfficeRent','NonMonthly',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(3,'Resource Meeting Rooms','ResourceRent','MeetingRooms',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(4,'Parking Charges 4 Wheeler','Parking','4Wheeler',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(5,'Parking Charges 2 Wheeler','Parking','2Wheeler',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 17:46:10','2023-07-29 17:46:10'),(6,'Asset damage Charge','Exits','AssetDamageCharges',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(7,'Exit Charge','Exits','ExitCharge',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(8,'Early Move Out Charge','Exits','EarlyMoveOutCharge',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(9,'Notice Period Penalty Charges','Exits','NoticePeriodPenaltyCharges',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(10,'Other Exit Deductions','Exits','OtherExitDeductions',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(11,'Eviction Charge','Exits','EvictionCharge',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(12,'Stamp Duty','Operations','StampDuty',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(13,'Cancelled Booking Token Amount','Operations','CancelledBookingTokenAmount',0,1,0,0,'NA',0,0,0,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(14,'Processing Fee','Operations','ProcessingFee',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(15,'Documentation Charges','Operations','DocumentationCharges',10,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(16,'Rent Payment Delay Charge','Penalty','RentPaymentDelayCharge',0,1,0,0,'998599',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:26','2023-07-29 16:34:26'),(17,'Cheque Bounce Charge','Finance','ChequeBounceCharge',0,1,0,0,'998599',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(18,'Cheque Handling Charge','Finance','ChequeHandlingCharge',0,1,0,0,'998599',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(19,'PG Charges','Finance','PGCharge',0,1,0,0,'998599',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:26','2023-07-29 16:34:26'),(20,'Keys Charge','Services','KeysCharge',2,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(21,'Support Charge','Services','SupportCharge',2,1,0,0,'997212',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(22,'House Keeping','Services','HouseKeeping',2,1,0,0,'9998',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(23,'Wash Room Charge','Services','WashRoomCharge',2,1,0,0,'9998',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(24,'Electricity','Utilities','Electricity',0,1,0,0,'',0,0,0,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(25,'Drinking Water','Utilities','DrinkingWater',0,1,0,0,'',0,0,0,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(26,'Non Drinking Water','Utilities','NonDrinkingWater',2,1,0,0,'998712',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(27,'Internet','Utilities','Internet',2,1,0,0,'998599',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(28,'DG Charges','Utilities','DGCharges',2,1,0,0,'998599',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27'),(29,'Security Deposit Charge','SecurityDeposit','DepositCharge',0,1,0,0,'998599',0,9,9,'Published','Loki',NULL,1,'2023-07-29 16:34:27','2023-07-29 16:34:27');
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
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refNo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `dueDate` date DEFAULT NULL,
  `isCancelled` int(11) DEFAULT '0',
  `penalty` int(11) DEFAULT NULL,
  `taxableAmount` int(11) DEFAULT NULL,
  `gst` int(11) DEFAULT NULL,
  `tds` int(11) NOT NULL DEFAULT '0',
  `paid` int(11) NOT NULL DEFAULT '0',
  `due` int(11) NOT NULL DEFAULT '0',
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelledReason` text COLLATE utf8mb4_unicode_ci,
  `proformaId` int(11) DEFAULT NULL,
  `pdfId` int(11) DEFAULT NULL,
  `isLiability` int(11) DEFAULT NULL,
  `isLiabilityCleared` int(11) DEFAULT '0',
  `isTdsCleared` int(11) DEFAULT NULL,
  `tdsPaid` int(11) NOT NULL DEFAULT '0',
  `tdsForm` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (8,1,29,NULL,'Liability','Security Deposit','HHSD1-0008',345000,'Due','2022-05-20','2022-05-20','2022-06-19','2022-05-20',0,NULL,345000,0,0,0,345000,'2023-09-05 21:39:53','system',NULL,NULL,8,1,0,NULL,0,NULL,'2023-09-05 21:39:53','2023-09-05 21:39:53'),(9,1,1,NULL,'OfficeRent','EnterpriseOffice Rent for first month','HHIN-23/Apr/001',130410,'Due','2023-04-01','2023-04-01','2023-04-30','2023-04-01',0,NULL,120750,21735,12075,0,130410,'2023-09-05 21:39:59','system',NULL,NULL,9,0,0,NULL,0,NULL,'2023-09-05 21:39:59','2023-09-05 21:39:59'),(10,2,29,NULL,'Liability','Security Deposit','HHSD2-0009',120,'Due','2022-05-13','2022-05-13','2022-06-12','2022-05-13',0,NULL,120,0,0,0,120,'2023-09-05 23:58:08','system',NULL,NULL,10,1,0,NULL,0,NULL,'2023-09-05 23:58:08','2023-09-05 23:58:08'),(11,2,1,NULL,'OfficeRent','EnterpriseOffice Rent for first month','HHIN-23/Apr/002',118,'Due','2023-04-01','2023-04-01','2023-04-30','2023-04-01',0,NULL,100,18,0,0,118,'2023-09-05 23:58:13','system',NULL,NULL,11,0,0,NULL,0,NULL,'2023-09-05 23:58:13','2023-09-05 23:58:13'),(12,2,1,NULL,'OfficeRent','OfficeRent Rent for May 2023','HHIN-23/May/001',118,'Due','2023-05-01','2023-05-01','2023-05-31','2023-05-05',0,NULL,100,18,0,0,118,'2023-09-06 00:00:52','system',NULL,NULL,12,0,0,NULL,0,NULL,'2023-09-06 00:00:52','2023-09-06 00:00:52'),(13,2,1,NULL,'OfficeRent','OfficeRent Rent for Jun 2023','HHIN-23/Jun/001',118,'Pending','2023-06-01','2023-06-01','2023-06-30','2023-06-05',0,NULL,100,18,0,0,118,'2023-09-06 00:01:17','system',NULL,NULL,13,0,0,NULL,0,NULL,'2023-09-06 00:01:17','2023-09-06 00:01:17'),(14,2,1,NULL,'OfficeRent','OfficeRent Rent for Jul 2023','HHIN-23/Jul/001',118,'Pending','2023-07-01','2023-07-01','2023-07-31','2023-07-05',0,NULL,100,18,0,0,118,'2023-09-06 14:59:44','system',NULL,NULL,14,0,0,NULL,0,NULL,'2023-09-06 14:59:44','2023-09-06 14:59:44'),(15,2,1,NULL,'OfficeRent','OfficeRent Rent for Aug 2023','HHIN-23/Aug/001',118,'Pending','2023-08-01','2023-08-01','2023-08-31','2023-08-05',0,NULL,100,18,0,0,118,'2023-09-06 15:00:23','system',NULL,NULL,15,0,0,NULL,0,NULL,'2023-09-06 15:00:23','2023-09-06 15:00:23'),(16,2,1,NULL,'OfficeRent','OfficeRent Rent for Sep 2023','HHIN-23/Sep/001',118,'Pending','2023-09-01','2023-09-01','2023-09-30','2023-09-05',0,NULL,100,18,0,0,118,'2023-09-06 15:01:03','system',NULL,NULL,16,0,0,NULL,0,NULL,'2023-09-06 15:01:03','2023-09-06 15:01:03'),(17,3,29,NULL,'Liability','Security Deposit','HHSD3-0001',20000,'Due','2023-09-01','2023-09-01','2023-09-30','2023-09-01',0,NULL,20000,0,0,0,20000,'2023-09-06 15:03:13','system',NULL,NULL,17,1,0,NULL,0,NULL,'2023-09-06 15:03:13','2023-09-06 15:03:13'),(18,3,1,NULL,'OfficeRent','EnterpriseOffice Rent for first month','HHIN-23/Sep/002',11800,'Due','2023-09-01','2023-09-01','2023-09-30','2023-09-01',0,NULL,10000,1800,0,0,11800,'2023-09-06 15:03:19','system',NULL,NULL,18,0,0,NULL,0,NULL,'2023-09-06 15:03:19','2023-09-06 15:03:19');
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
  `comment` text COLLATE utf8mb4_unicode_ci,
  `date` datetime DEFAULT NULL,
  `by` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `leadPropositionId` (`leadPropositionId`),
  KEY `visitId` (`visitId`),
  KEY `callId` (`callId`),
  CONSTRAINT `lead_comments_ibfk_5` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_comments_ibfk_6` FOREIGN KEY (`leadPropositionId`) REFERENCES `lead_propositions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_comments_ibfk_7` FOREIGN KEY (`visitId`) REFERENCES `visits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_comments_ibfk_8` FOREIGN KEY (`callId`) REFERENCES `calls` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lead_mails_mailId_leadId_unique` (`leadId`,`mailId`),
  KEY `mailId` (`mailId`),
  CONSTRAINT `lead_mails_ibfk_3` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lead_mails_ibfk_4` FOREIGN KEY (`mailId`) REFERENCES `mails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `distance` double(9,6) DEFAULT NULL,
  `price` double(9,2) DEFAULT NULL,
  `visitId` int(11) DEFAULT NULL,
  `contractId` int(11) DEFAULT NULL,
  `isInterested` text COLLATE utf8mb4_unicode_ci,
  `by` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `officeId` (`officeId`),
  KEY `visitId` (`visitId`),
  KEY `contractId` (`contractId`),
  CONSTRAINT `lead_propositions_ibfk_5` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_propositions_ibfk_6` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_propositions_ibfk_7` FOREIGN KEY (`visitId`) REFERENCES `visits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lead_propositions_ibfk_8` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deskType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desks` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `startDate` datetime DEFAULT NULL,
  `info` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignedTo` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `source` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attribute` varchar(25) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdOn` datetime DEFAULT NULL,
  `nextCall` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `assignedTo` (`assignedTo`),
  KEY `companyId` (`companyId`),
  CONSTRAINT `leads_ibfk_3` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `leads_ibfk_4` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL,
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cityId` (`cityId`),
  CONSTRAINT `locations_ibfk_1` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `locations`
--

LOCK TABLES `locations` WRITE;
/*!40000 ALTER TABLE `locations` DISABLE KEYS */;
INSERT INTO `locations` VALUES (1,'HSR Layout',1,1,NULL,NULL,'2023-09-01 14:54:24','2023-09-01 14:54:24');
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
  `subject` text COLLATE utf8mb4_unicode_ci,
  `body` text COLLATE utf8mb4_unicode_ci,
  `receivers` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `by` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tags` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mails`
--

LOCK TABLES `mails` WRITE;
/*!40000 ALTER TABLE `mails` DISABLE KEYS */;
INSERT INTO `mails` VALUES (1,'CLOMOSO TECHNOLOGIES PRIVATE LIMITED : SecurityDeposit Invoice Notification','<!DOCTYPE html>\n<html>\n\n<head>\n  <title></title>\n  <link href=\"https://fonts.googleapis.com/css?family=Nunito&display=swap\" rel=\"stylesheet\">\n  <style type=\"text/css\">\n  body {\n    font-family: Nunito, sans-serif;\n    letter-spacing: .3px;\n    line-height: 1.6;\n    font-size: .813rem;\n    font-weight: 400;\n    color: #47404f;\n  }\n\n  .h4,\n  h4 {\n    font-size: 1.21625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n    margin-top: 0;\n  }\n\n  .h5,\n  h5 {\n    font-size: 1.01625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n  }\n\n  .card {\n    border-radius: 10px;\n    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);\n    border: 0;\n  }\n\n  .card {\n    position: relative;\n    display: block;\n    flex-direction: column;\n    min-width: 0;\n    padding: 0;\n    word-wrap: break-word;\n    background-color: #fff;\n    background-clip: border-box;\n  }\n\n  .card-body {\n    flex: 1 1 auto;\n    padding: 1.25rem;\n  }\n\n  .row {\n    display: block;\n    flex-wrap: wrap;\n    margin-right: -15px;\n    margin-left: -15px;\n  }\n\n  .col-md-12 {\n    flex: 0 0 100%;\n    width: 100%;\n  }\n\n  .invoice-summary {\n    width: 220px;\n    text-align: right;\n  }\n\n  .float-right {\n    float: right !important;\n  }\n\n  .invoice-summary h5,\n  .invoice-summary p {\n    display: block;\n    justify-content: flex-end;\n  }\n\n  .account-summary p {\n    display: block;\n    justify-content: flex-start;\n  }\n\n  .invoice-summary h5 span,\n  .invoice-summary p span {\n    width: 120px;\n  }\n\n  .account-summary p span {\n    width: 120px;\n  }\n\n\n\n  dl,\n  ol,\n  p,\n  ul {\n    margin-top: 0;\n    margin-bottom: 0rem;\n  }\n\n  p {\n    margin-bottom: 0.3rem !important;\n  }\n\n  .mb-4 {\n    margin-bottom: 1.5rem !important;\n  }\n\n  .table {\n    width: 100%;\n    margin-bottom: 1rem;\n    background-color: transparent;\n  }\n\n  table {\n    border-collapse: collapse;\n  }\n\n  .table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #dee2e6;\n  }\n\n  .bg-gray-300 {\n    background-color: #dee2e6 !important;\n  }\n\n  .table td,\n  .table th {\n    padding: .3rem;\n    vertical-align: center;\n    text-align: left;\n    border-top: 1px solid #dee2e6;\n  }\n  </style>\n</head>\n\n<body>\n  <div class=\"card\">\n    <div class=\"card-body\">\n      <div class=\"row mb-4\">\n        <div class=\"col-12\">\n          Dear xyz,<br><br>\n          <p>Below is the invoice raised for your booking with reference number HHBK23-1 done with CLOMOSO TECHNOLOGIES PRIVATE LIMITED started on May 20, 2022 for month of May 2022. </p>\n          <br>\n          <p>Please pay before due date May 20, 2022 to avoid late fees here at this link.\n            <a href=\"http://selfcare.coworkops.in/#/selfcare/pending-payment/92782f92-13da-4951-9b97-fe7c92caa2b8\" target=\"_blank\"><strong>Pay Now</strong></a></p>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <table class=\"table table-hover mb-4\">\n            <thead class=\"bg-gray-300\">\n              <tr>\n                <th>ID</th>\n                <th>Item Description</th>\n                <th style=\"text-align:right\">Amount</th>\n                  <th style=\"text-align:right\"><small>CGST</small></th>\n                  <th style=\"text-align:right\"><small>SGST</small></th>\n                <th style=\"text-align:right\">Total</th>\n              </tr>\n            </thead>\n            <tbody>\n                <tr>\n                  <td>1</td>\n                  <td>Security Deposit</td>\n                  <td style=\"text-align:right\">Rs.345000</td>\n                    <td style=\"text-align:right\">Rs.0</td>\n                    <td style=\"text-align:right\">Rs.0</td>\n                  <td style=\"text-align:right\">Rs.345000</td>\n                </tr>\n            </tbody>\n          </table>\n        </div>\n        <div style=\"clear:both;\"></div>\n        <div class=\"col-md-12 mb-4\">\n          <div class=\"invoice-summary float-right\">\n            <h5 class=\"font-weight-bold\">Grand Total: <span> Rs.345000 </span></h5>\n          </div>\n        </div>\n        <div class=\"col-md-12\">\n          <div class=\"account-summary float-left\">\n            <strong>You can pay to below bank account details : </strong>\n            <p> <span>Account Name </span> : CLOMOSO TECHNOLOGIES PRIVATE LIMITED</p>\n            <p> <span>Bank Name </span> : Kotak Mahindra</p>\n            <p> <span>Bank Branch </span>: Jakkasandra Branch, Bengaluru </p>\n            <p> <span>Account Number </span>: 9611778643</p>\n            <p> <span>IFSC Code </span>: KKBK0000430</p>\n          </div>\n        </div>\n      </div>\n      <div style=\"clear:both;\" class=\"mb-4\"></div>\n      <p>\n        <center>You can reach us for any of your assistance on <strong>8047489999 </strong> and write us at <strong>info@hustlehub.xyz</strong>.</center>\n      </p>\n    </div>\n  </div>\n</body>\n\n</html>','\"xyz\" <pratibha@hustlehub.xyz>','Sent','2023-09-05 21:39:59','Outbox','system',NULL,NULL,'2023-09-05 21:39:59','2023-09-05 21:39:59'),(2,'CLOMOSO TECHNOLOGIES PRIVATE LIMITED : Apr 2023 Tax Invoice Notification','<!DOCTYPE html>\n<html>\n\n<head>\n  <title></title>\n  <link href=\"https://fonts.googleapis.com/css?family=Nunito&display=swap\" rel=\"stylesheet\">\n  <style type=\"text/css\">\n  body {\n    font-family: Nunito, sans-serif;\n    letter-spacing: .3px;\n    line-height: 1.6;\n    font-size: .813rem;\n    font-weight: 400;\n    color: #47404f;\n  }\n\n  .h4,\n  h4 {\n    font-size: 1.21625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n    margin-top: 0;\n  }\n\n  .h5,\n  h5 {\n    font-size: 1.01625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n  }\n\n  .card {\n    border-radius: 10px;\n    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);\n    border: 0;\n  }\n\n  .card {\n    position: relative;\n    display: block;\n    flex-direction: column;\n    min-width: 0;\n    padding: 0;\n    word-wrap: break-word;\n    background-color: #fff;\n    background-clip: border-box;\n  }\n\n  .card-body {\n    flex: 1 1 auto;\n    padding: 1.25rem;\n  }\n\n  .row {\n    display: block;\n    flex-wrap: wrap;\n    margin-right: -15px;\n    margin-left: -15px;\n  }\n\n  .col-md-12 {\n    flex: 0 0 100%;\n    width: 100%;\n  }\n\n  .invoice-summary {\n    width: 220px;\n    text-align: right;\n  }\n\n  .float-right {\n    float: right !important;\n  }\n\n  .invoice-summary h5,\n  .invoice-summary p {\n    display: block;\n    justify-content: flex-end;\n  }\n\n  .account-summary p {\n    display: block;\n    justify-content: flex-start;\n  }\n\n  .invoice-summary h5 span,\n  .invoice-summary p span {\n    width: 120px;\n  }\n\n  .account-summary p span {\n    width: 120px;\n  }\n\n\n\n  dl,\n  ol,\n  p,\n  ul {\n    margin-top: 0;\n    margin-bottom: 0rem;\n  }\n\n  p {\n    margin-bottom: 0.3rem !important;\n  }\n\n  .mb-4 {\n    margin-bottom: 1.5rem !important;\n  }\n\n  .table {\n    width: 100%;\n    margin-bottom: 1rem;\n    background-color: transparent;\n  }\n\n  table {\n    border-collapse: collapse;\n  }\n\n  .table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #dee2e6;\n  }\n\n  .bg-gray-300 {\n    background-color: #dee2e6 !important;\n  }\n\n  .table td,\n  .table th {\n    padding: .3rem;\n    vertical-align: center;\n    text-align: left;\n    border-top: 1px solid #dee2e6;\n  }\n  </style>\n</head>\n\n<body>\n  <div class=\"card\">\n    <div class=\"card-body\">\n      <div class=\"row mb-4\">\n        <div class=\"col-12\">\n          Dear xyz,<br><br>\n          <p>Below is the invoice raised for your booking with reference number HHBK23-1 done with CLOMOSO TECHNOLOGIES PRIVATE LIMITED started on May 20, 2022 for month of Apr 2023. </p>\n          <br>\n          <p>Please pay before due date Apr 01, 2023 to avoid late fees here at this link.\n            <a href=\"http://selfcare.coworkops.in/#/selfcare/pending-payment/a98bcfe7-9cb0-4a74-bc7f-e88e766f11aa\" target=\"_blank\"><strong>Pay Now</strong></a></p>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <table class=\"table table-hover mb-4\">\n            <thead class=\"bg-gray-300\">\n              <tr>\n                <th>ID</th>\n                <th>Item Description</th>\n                <th style=\"text-align:right\">Amount</th>\n                  <th style=\"text-align:right\"><small>CGST</small></th>\n                  <th style=\"text-align:right\"><small>SGST</small></th>\n                <th style=\"text-align:right\">Total</th>\n              </tr>\n            </thead>\n            <tbody>\n                <tr>\n                  <td>1</td>\n                  <td>1 desks in Fourth Floor <br> for period of Apr 01, 2023 - Apr 30, 2023</td>\n                  <td style=\"text-align:right\">Rs.120750</td>\n                    <td style=\"text-align:right\">Rs.10868</td>\n                    <td style=\"text-align:right\">Rs.10868</td>\n                  <td style=\"text-align:right\">Rs.142485</td>\n                </tr>\n            </tbody>\n          </table>\n        </div>\n        <div style=\"clear:both;\"></div>\n        <div class=\"col-md-12 mb-4\">\n          <div class=\"invoice-summary float-right\">\n            <h5 class=\"font-weight-bold\">Grand Total: <span> Rs.142485 </span></h5>\n          </div>\n        </div>\n        <div class=\"col-md-12\">\n          <div class=\"account-summary float-left\">\n            <strong>You can pay to below bank account details : </strong>\n            <p> <span>Account Name </span> : CLOMOSO TECHNOLOGIES PRIVATE LIMITED</p>\n            <p> <span>Bank Name </span> : Kotak Mahindra</p>\n            <p> <span>Bank Branch </span>: Jakkasandra Branch, Bengaluru </p>\n            <p> <span>Account Number </span>: 9611778643</p>\n            <p> <span>IFSC Code </span>: KKBK0000430</p>\n          </div>\n        </div>\n      </div>\n      <div style=\"clear:both;\" class=\"mb-4\"></div>\n      <p>\n        <center>You can reach us for any of your assistance on <strong>8047489999 </strong> and write us at <strong>info@hustlehub.xyz</strong>.</center>\n      </p>\n    </div>\n  </div>\n</body>\n\n</html>','\"xyz\" <pratibha@hustlehub.xyz>','Sent','2023-09-05 21:40:04','Outbox','system',NULL,NULL,'2023-09-05 21:40:04','2023-09-05 21:40:04'),(3,'CLOMOSO TECHNOLOGIES PRIVATE LIMITED : SecurityDeposit Invoice Notification','<!DOCTYPE html>\n<html>\n\n<head>\n  <title></title>\n  <link href=\"https://fonts.googleapis.com/css?family=Nunito&display=swap\" rel=\"stylesheet\">\n  <style type=\"text/css\">\n  body {\n    font-family: Nunito, sans-serif;\n    letter-spacing: .3px;\n    line-height: 1.6;\n    font-size: .813rem;\n    font-weight: 400;\n    color: #47404f;\n  }\n\n  .h4,\n  h4 {\n    font-size: 1.21625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n    margin-top: 0;\n  }\n\n  .h5,\n  h5 {\n    font-size: 1.01625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n  }\n\n  .card {\n    border-radius: 10px;\n    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);\n    border: 0;\n  }\n\n  .card {\n    position: relative;\n    display: block;\n    flex-direction: column;\n    min-width: 0;\n    padding: 0;\n    word-wrap: break-word;\n    background-color: #fff;\n    background-clip: border-box;\n  }\n\n  .card-body {\n    flex: 1 1 auto;\n    padding: 1.25rem;\n  }\n\n  .row {\n    display: block;\n    flex-wrap: wrap;\n    margin-right: -15px;\n    margin-left: -15px;\n  }\n\n  .col-md-12 {\n    flex: 0 0 100%;\n    width: 100%;\n  }\n\n  .invoice-summary {\n    width: 220px;\n    text-align: right;\n  }\n\n  .float-right {\n    float: right !important;\n  }\n\n  .invoice-summary h5,\n  .invoice-summary p {\n    display: block;\n    justify-content: flex-end;\n  }\n\n  .account-summary p {\n    display: block;\n    justify-content: flex-start;\n  }\n\n  .invoice-summary h5 span,\n  .invoice-summary p span {\n    width: 120px;\n  }\n\n  .account-summary p span {\n    width: 120px;\n  }\n\n\n\n  dl,\n  ol,\n  p,\n  ul {\n    margin-top: 0;\n    margin-bottom: 0rem;\n  }\n\n  p {\n    margin-bottom: 0.3rem !important;\n  }\n\n  .mb-4 {\n    margin-bottom: 1.5rem !important;\n  }\n\n  .table {\n    width: 100%;\n    margin-bottom: 1rem;\n    background-color: transparent;\n  }\n\n  table {\n    border-collapse: collapse;\n  }\n\n  .table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #dee2e6;\n  }\n\n  .bg-gray-300 {\n    background-color: #dee2e6 !important;\n  }\n\n  .table td,\n  .table th {\n    padding: .3rem;\n    vertical-align: center;\n    text-align: left;\n    border-top: 1px solid #dee2e6;\n  }\n  </style>\n</head>\n\n<body>\n  <div class=\"card\">\n    <div class=\"card-body\">\n      <div class=\"row mb-4\">\n        <div class=\"col-12\">\n          Dear Loki,<br><br>\n          <p>Below is the invoice raised for your booking with reference number HHBK23-2 done with CLOMOSO TECHNOLOGIES PRIVATE LIMITED started on May 13, 2022 for month of May 2022. </p>\n          <br>\n          <p>Please pay before due date May 13, 2022 to avoid late fees here at this link.\n            <a href=\"http://selfcare.coworkops.in/#/selfcare/pending-payment/c22383e7-c728-4478-a7d9-0e2bac93cfbc\" target=\"_blank\"><strong>Pay Now</strong></a></p>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <table class=\"table table-hover mb-4\">\n            <thead class=\"bg-gray-300\">\n              <tr>\n                <th>ID</th>\n                <th>Item Description</th>\n                <th style=\"text-align:right\">Amount</th>\n                  <th style=\"text-align:right\"><small>CGST</small></th>\n                  <th style=\"text-align:right\"><small>SGST</small></th>\n                <th style=\"text-align:right\">Total</th>\n              </tr>\n            </thead>\n            <tbody>\n                <tr>\n                  <td>1</td>\n                  <td>Security Deposit</td>\n                  <td style=\"text-align:right\">Rs.120</td>\n                    <td style=\"text-align:right\">Rs.0</td>\n                    <td style=\"text-align:right\">Rs.0</td>\n                  <td style=\"text-align:right\">Rs.120</td>\n                </tr>\n            </tbody>\n          </table>\n        </div>\n        <div style=\"clear:both;\"></div>\n        <div class=\"col-md-12 mb-4\">\n          <div class=\"invoice-summary float-right\">\n            <h5 class=\"font-weight-bold\">Grand Total: <span> Rs.120 </span></h5>\n          </div>\n        </div>\n        <div class=\"col-md-12\">\n          <div class=\"account-summary float-left\">\n            <strong>You can pay to below bank account details : </strong>\n            <p> <span>Account Name </span> : CLOMOSO TECHNOLOGIES PRIVATE LIMITED</p>\n            <p> <span>Bank Name </span> : Kotak Mahindra</p>\n            <p> <span>Bank Branch </span>: Jakkasandra Branch, Bengaluru </p>\n            <p> <span>Account Number </span>: 9611778643</p>\n            <p> <span>IFSC Code </span>: KKBK0000430</p>\n          </div>\n        </div>\n      </div>\n      <div style=\"clear:both;\" class=\"mb-4\"></div>\n      <p>\n        <center>You can reach us for any of your assistance on <strong>8047489999 </strong> and write us at <strong>info@hustlehub.xyz</strong>.</center>\n      </p>\n    </div>\n  </div>\n</body>\n\n</html>','\"Loki\" <lokeshreddy.art@gmail.com>','Sent','2023-09-05 23:58:13','Outbox','system',NULL,NULL,'2023-09-05 23:58:13','2023-09-05 23:58:13'),(4,'CLOMOSO TECHNOLOGIES PRIVATE LIMITED : Apr 2023 Tax Invoice Notification','<!DOCTYPE html>\n<html>\n\n<head>\n  <title></title>\n  <link href=\"https://fonts.googleapis.com/css?family=Nunito&display=swap\" rel=\"stylesheet\">\n  <style type=\"text/css\">\n  body {\n    font-family: Nunito, sans-serif;\n    letter-spacing: .3px;\n    line-height: 1.6;\n    font-size: .813rem;\n    font-weight: 400;\n    color: #47404f;\n  }\n\n  .h4,\n  h4 {\n    font-size: 1.21625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n    margin-top: 0;\n  }\n\n  .h5,\n  h5 {\n    font-size: 1.01625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n  }\n\n  .card {\n    border-radius: 10px;\n    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);\n    border: 0;\n  }\n\n  .card {\n    position: relative;\n    display: block;\n    flex-direction: column;\n    min-width: 0;\n    padding: 0;\n    word-wrap: break-word;\n    background-color: #fff;\n    background-clip: border-box;\n  }\n\n  .card-body {\n    flex: 1 1 auto;\n    padding: 1.25rem;\n  }\n\n  .row {\n    display: block;\n    flex-wrap: wrap;\n    margin-right: -15px;\n    margin-left: -15px;\n  }\n\n  .col-md-12 {\n    flex: 0 0 100%;\n    width: 100%;\n  }\n\n  .invoice-summary {\n    width: 220px;\n    text-align: right;\n  }\n\n  .float-right {\n    float: right !important;\n  }\n\n  .invoice-summary h5,\n  .invoice-summary p {\n    display: block;\n    justify-content: flex-end;\n  }\n\n  .account-summary p {\n    display: block;\n    justify-content: flex-start;\n  }\n\n  .invoice-summary h5 span,\n  .invoice-summary p span {\n    width: 120px;\n  }\n\n  .account-summary p span {\n    width: 120px;\n  }\n\n\n\n  dl,\n  ol,\n  p,\n  ul {\n    margin-top: 0;\n    margin-bottom: 0rem;\n  }\n\n  p {\n    margin-bottom: 0.3rem !important;\n  }\n\n  .mb-4 {\n    margin-bottom: 1.5rem !important;\n  }\n\n  .table {\n    width: 100%;\n    margin-bottom: 1rem;\n    background-color: transparent;\n  }\n\n  table {\n    border-collapse: collapse;\n  }\n\n  .table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #dee2e6;\n  }\n\n  .bg-gray-300 {\n    background-color: #dee2e6 !important;\n  }\n\n  .table td,\n  .table th {\n    padding: .3rem;\n    vertical-align: center;\n    text-align: left;\n    border-top: 1px solid #dee2e6;\n  }\n  </style>\n</head>\n\n<body>\n  <div class=\"card\">\n    <div class=\"card-body\">\n      <div class=\"row mb-4\">\n        <div class=\"col-12\">\n          Dear Loki,<br><br>\n          <p>Below is the invoice raised for your booking with reference number HHBK23-2 done with CLOMOSO TECHNOLOGIES PRIVATE LIMITED started on May 13, 2022 for month of Apr 2023. </p>\n          <br>\n          <p>Please pay before due date Apr 01, 2023 to avoid late fees here at this link.\n            <a href=\"http://selfcare.coworkops.in/#/selfcare/pending-payment/f3cffd3c-a05c-484f-b9b0-72e090e42cf9\" target=\"_blank\"><strong>Pay Now</strong></a></p>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <table class=\"table table-hover mb-4\">\n            <thead class=\"bg-gray-300\">\n              <tr>\n                <th>ID</th>\n                <th>Item Description</th>\n                <th style=\"text-align:right\">Amount</th>\n                  <th style=\"text-align:right\"><small>CGST</small></th>\n                  <th style=\"text-align:right\"><small>SGST</small></th>\n                <th style=\"text-align:right\">Total</th>\n              </tr>\n            </thead>\n            <tbody>\n                <tr>\n                  <td>1</td>\n                  <td>6 desks in Ground Floor  <br> for period of Apr 01, 2023 - Apr 30, 2023</td>\n                  <td style=\"text-align:right\">Rs.100</td>\n                    <td style=\"text-align:right\">Rs.9</td>\n                    <td style=\"text-align:right\">Rs.9</td>\n                  <td style=\"text-align:right\">Rs.118</td>\n                </tr>\n            </tbody>\n          </table>\n        </div>\n        <div style=\"clear:both;\"></div>\n        <div class=\"col-md-12 mb-4\">\n          <div class=\"invoice-summary float-right\">\n            <h5 class=\"font-weight-bold\">Grand Total: <span> Rs.118 </span></h5>\n          </div>\n        </div>\n        <div class=\"col-md-12\">\n          <div class=\"account-summary float-left\">\n            <strong>You can pay to below bank account details : </strong>\n            <p> <span>Account Name </span> : CLOMOSO TECHNOLOGIES PRIVATE LIMITED</p>\n            <p> <span>Bank Name </span> : Kotak Mahindra</p>\n            <p> <span>Bank Branch </span>: Jakkasandra Branch, Bengaluru </p>\n            <p> <span>Account Number </span>: 9611778643</p>\n            <p> <span>IFSC Code </span>: KKBK0000430</p>\n          </div>\n        </div>\n      </div>\n      <div style=\"clear:both;\" class=\"mb-4\"></div>\n      <p>\n        <center>You can reach us for any of your assistance on <strong>8047489999 </strong> and write us at <strong>info@hustlehub.xyz</strong>.</center>\n      </p>\n    </div>\n  </div>\n</body>\n\n</html>','\"Loki\" <lokeshreddy.art@gmail.com>','Sent','2023-09-05 23:58:17','Outbox','system',NULL,NULL,'2023-09-05 23:58:17','2023-09-05 23:58:17'),(5,'CLOMOSO TECHNOLOGIES PRIVATE LIMITED : SecurityDeposit Invoice Notification','<!DOCTYPE html>\n<html>\n\n<head>\n  <title></title>\n  <link href=\"https://fonts.googleapis.com/css?family=Nunito&display=swap\" rel=\"stylesheet\">\n  <style type=\"text/css\">\n  body {\n    font-family: Nunito, sans-serif;\n    letter-spacing: .3px;\n    line-height: 1.6;\n    font-size: .813rem;\n    font-weight: 400;\n    color: #47404f;\n  }\n\n  .h4,\n  h4 {\n    font-size: 1.21625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n    margin-top: 0;\n  }\n\n  .h5,\n  h5 {\n    font-size: 1.01625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n  }\n\n  .card {\n    border-radius: 10px;\n    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);\n    border: 0;\n  }\n\n  .card {\n    position: relative;\n    display: block;\n    flex-direction: column;\n    min-width: 0;\n    padding: 0;\n    word-wrap: break-word;\n    background-color: #fff;\n    background-clip: border-box;\n  }\n\n  .card-body {\n    flex: 1 1 auto;\n    padding: 1.25rem;\n  }\n\n  .row {\n    display: block;\n    flex-wrap: wrap;\n    margin-right: -15px;\n    margin-left: -15px;\n  }\n\n  .col-md-12 {\n    flex: 0 0 100%;\n    width: 100%;\n  }\n\n  .invoice-summary {\n    width: 220px;\n    text-align: right;\n  }\n\n  .float-right {\n    float: right !important;\n  }\n\n  .invoice-summary h5,\n  .invoice-summary p {\n    display: block;\n    justify-content: flex-end;\n  }\n\n  .account-summary p {\n    display: block;\n    justify-content: flex-start;\n  }\n\n  .invoice-summary h5 span,\n  .invoice-summary p span {\n    width: 120px;\n  }\n\n  .account-summary p span {\n    width: 120px;\n  }\n\n\n\n  dl,\n  ol,\n  p,\n  ul {\n    margin-top: 0;\n    margin-bottom: 0rem;\n  }\n\n  p {\n    margin-bottom: 0.3rem !important;\n  }\n\n  .mb-4 {\n    margin-bottom: 1.5rem !important;\n  }\n\n  .table {\n    width: 100%;\n    margin-bottom: 1rem;\n    background-color: transparent;\n  }\n\n  table {\n    border-collapse: collapse;\n  }\n\n  .table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #dee2e6;\n  }\n\n  .bg-gray-300 {\n    background-color: #dee2e6 !important;\n  }\n\n  .table td,\n  .table th {\n    padding: .3rem;\n    vertical-align: center;\n    text-align: left;\n    border-top: 1px solid #dee2e6;\n  }\n  </style>\n</head>\n\n<body>\n  <div class=\"card\">\n    <div class=\"card-body\">\n      <div class=\"row mb-4\">\n        <div class=\"col-12\">\n          Dear 9108624982,<br><br>\n          <p>Below is the invoice raised for your booking with reference number HHBK23-3 done with CLOMOSO TECHNOLOGIES PRIVATE LIMITED started on Sep 01, 2023 for month of Sep 2023. </p>\n          <br>\n          <p>Please pay before due date Sep 01, 2023 to avoid late fees here at this link.\n            <a href=\"http://selfcare.coworkops.in/#/selfcare/pending-payment/a1b6c839-45e0-44e0-9176-bb25634ad69d\" target=\"_blank\"><strong>Pay Now</strong></a></p>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <table class=\"table table-hover mb-4\">\n            <thead class=\"bg-gray-300\">\n              <tr>\n                <th>ID</th>\n                <th>Item Description</th>\n                <th style=\"text-align:right\">Amount</th>\n                  <th style=\"text-align:right\"><small>CGST</small></th>\n                  <th style=\"text-align:right\"><small>SGST</small></th>\n                <th style=\"text-align:right\">Total</th>\n              </tr>\n            </thead>\n            <tbody>\n                <tr>\n                  <td>1</td>\n                  <td>Security Deposit</td>\n                  <td style=\"text-align:right\">Rs.20000</td>\n                    <td style=\"text-align:right\">Rs.0</td>\n                    <td style=\"text-align:right\">Rs.0</td>\n                  <td style=\"text-align:right\">Rs.20000</td>\n                </tr>\n            </tbody>\n          </table>\n        </div>\n        <div style=\"clear:both;\"></div>\n        <div class=\"col-md-12 mb-4\">\n          <div class=\"invoice-summary float-right\">\n            <h5 class=\"font-weight-bold\">Grand Total: <span> Rs.20000 </span></h5>\n          </div>\n        </div>\n        <div class=\"col-md-12\">\n          <div class=\"account-summary float-left\">\n            <strong>You can pay to below bank account details : </strong>\n            <p> <span>Account Name </span> : CLOMOSO TECHNOLOGIES PRIVATE LIMITED</p>\n            <p> <span>Bank Name </span> : Kotak Mahindra</p>\n            <p> <span>Bank Branch </span>: Jakkasandra Branch, Bengaluru </p>\n            <p> <span>Account Number </span>: 9611778643</p>\n            <p> <span>IFSC Code </span>: KKBK0000430</p>\n          </div>\n        </div>\n      </div>\n      <div style=\"clear:both;\" class=\"mb-4\"></div>\n      <p>\n        <center>You can reach us for any of your assistance on <strong>8047489999 </strong> and write us at <strong>info@hustlehub.xyz</strong>.</center>\n      </p>\n    </div>\n  </div>\n</body>\n\n</html>','\"9108624982\" <bjjks@gmail.com>','Sent','2023-09-06 15:03:19','Outbox','system',NULL,NULL,'2023-09-06 15:03:19','2023-09-06 15:03:19'),(6,'CLOMOSO TECHNOLOGIES PRIVATE LIMITED : Sep 2023 Tax Invoice Notification','<!DOCTYPE html>\n<html>\n\n<head>\n  <title></title>\n  <link href=\"https://fonts.googleapis.com/css?family=Nunito&display=swap\" rel=\"stylesheet\">\n  <style type=\"text/css\">\n  body {\n    font-family: Nunito, sans-serif;\n    letter-spacing: .3px;\n    line-height: 1.6;\n    font-size: .813rem;\n    font-weight: 400;\n    color: #47404f;\n  }\n\n  .h4,\n  h4 {\n    font-size: 1.21625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n    margin-top: 0;\n  }\n\n  .h5,\n  h5 {\n    font-size: 1.01625rem;\n    margin-bottom: .5rem;\n    font-family: inherit;\n    font-weight: 500;\n    line-height: 1.2;\n  }\n\n  .card {\n    border-radius: 10px;\n    box-shadow: 0 4px 20px 1px rgba(0, 0, 0, .06), 0 1px 4px rgba(0, 0, 0, .08);\n    border: 0;\n  }\n\n  .card {\n    position: relative;\n    display: block;\n    flex-direction: column;\n    min-width: 0;\n    padding: 0;\n    word-wrap: break-word;\n    background-color: #fff;\n    background-clip: border-box;\n  }\n\n  .card-body {\n    flex: 1 1 auto;\n    padding: 1.25rem;\n  }\n\n  .row {\n    display: block;\n    flex-wrap: wrap;\n    margin-right: -15px;\n    margin-left: -15px;\n  }\n\n  .col-md-12 {\n    flex: 0 0 100%;\n    width: 100%;\n  }\n\n  .invoice-summary {\n    width: 220px;\n    text-align: right;\n  }\n\n  .float-right {\n    float: right !important;\n  }\n\n  .invoice-summary h5,\n  .invoice-summary p {\n    display: block;\n    justify-content: flex-end;\n  }\n\n  .account-summary p {\n    display: block;\n    justify-content: flex-start;\n  }\n\n  .invoice-summary h5 span,\n  .invoice-summary p span {\n    width: 120px;\n  }\n\n  .account-summary p span {\n    width: 120px;\n  }\n\n\n\n  dl,\n  ol,\n  p,\n  ul {\n    margin-top: 0;\n    margin-bottom: 0rem;\n  }\n\n  p {\n    margin-bottom: 0.3rem !important;\n  }\n\n  .mb-4 {\n    margin-bottom: 1.5rem !important;\n  }\n\n  .table {\n    width: 100%;\n    margin-bottom: 1rem;\n    background-color: transparent;\n  }\n\n  table {\n    border-collapse: collapse;\n  }\n\n  .table thead th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #dee2e6;\n  }\n\n  .bg-gray-300 {\n    background-color: #dee2e6 !important;\n  }\n\n  .table td,\n  .table th {\n    padding: .3rem;\n    vertical-align: center;\n    text-align: left;\n    border-top: 1px solid #dee2e6;\n  }\n  </style>\n</head>\n\n<body>\n  <div class=\"card\">\n    <div class=\"card-body\">\n      <div class=\"row mb-4\">\n        <div class=\"col-12\">\n          Dear 9108624982,<br><br>\n          <p>Below is the invoice raised for your booking with reference number HHBK23-3 done with CLOMOSO TECHNOLOGIES PRIVATE LIMITED started on Sep 01, 2023 for month of Sep 2023. </p>\n          <br>\n          <p>Please pay before due date Sep 01, 2023 to avoid late fees here at this link.\n            <a href=\"http://selfcare.coworkops.in/#/selfcare/pending-payment/53821917-cf66-449e-b7a0-48c03a18fc03\" target=\"_blank\"><strong>Pay Now</strong></a></p>\n        </div>\n      </div>\n      <div class=\"row\">\n        <div class=\"col-md-12\">\n          <table class=\"table table-hover mb-4\">\n            <thead class=\"bg-gray-300\">\n              <tr>\n                <th>ID</th>\n                <th>Item Description</th>\n                <th style=\"text-align:right\">Amount</th>\n                  <th style=\"text-align:right\"><small>CGST</small></th>\n                  <th style=\"text-align:right\"><small>SGST</small></th>\n                <th style=\"text-align:right\">Total</th>\n              </tr>\n            </thead>\n            <tbody>\n                <tr>\n                  <td>1</td>\n                  <td>6 desks in First Floor <br> for period of Sep 01, 2023 - Sep 30, 2023</td>\n                  <td style=\"text-align:right\">Rs.10000</td>\n                    <td style=\"text-align:right\">Rs.900</td>\n                    <td style=\"text-align:right\">Rs.900</td>\n                  <td style=\"text-align:right\">Rs.11800</td>\n                </tr>\n            </tbody>\n          </table>\n        </div>\n        <div style=\"clear:both;\"></div>\n        <div class=\"col-md-12 mb-4\">\n          <div class=\"invoice-summary float-right\">\n            <h5 class=\"font-weight-bold\">Grand Total: <span> Rs.11800 </span></h5>\n          </div>\n        </div>\n        <div class=\"col-md-12\">\n          <div class=\"account-summary float-left\">\n            <strong>You can pay to below bank account details : </strong>\n            <p> <span>Account Name </span> : CLOMOSO TECHNOLOGIES PRIVATE LIMITED</p>\n            <p> <span>Bank Name </span> : Kotak Mahindra</p>\n            <p> <span>Bank Branch </span>: Jakkasandra Branch, Bengaluru </p>\n            <p> <span>Account Number </span>: 9611778643</p>\n            <p> <span>IFSC Code </span>: KKBK0000430</p>\n          </div>\n        </div>\n      </div>\n      <div style=\"clear:both;\" class=\"mb-4\"></div>\n      <p>\n        <center>You can reach us for any of your assistance on <strong>8047489999 </strong> and write us at <strong>info@hustlehub.xyz</strong>.</center>\n      </p>\n    </div>\n  </div>\n</body>\n\n</html>','\"9108624982\" <bjjks@gmail.com>','Sent','2023-09-06 15:03:24','Outbox','system',NULL,NULL,'2023-09-06 15:03:24','2023-09-06 15:03:24');
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
  `competitor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` double(9,6) DEFAULT NULL,
  `lng` double(9,6) DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `hotDeskPrice` int(11) DEFAULT NULL,
  `fixedDeskPrice` int(11) DEFAULT NULL,
  `privateOfficePrice` int(11) DEFAULT NULL,
  `sqFtSpace` int(11) DEFAULT NULL,
  `sqFtPrice` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cityId` (`cityId`),
  CONSTRAINT `mi_data_ibfk_1` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sentOn` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `notificationId` (`notificationId`),
  CONSTRAINT `notification_receivers_ibfk_1` FOREIGN KEY (`notificationId`) REFERENCES `notifications` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receivers` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `by` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `deskType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minPerson` int(11) DEFAULT NULL,
  `maxPerson` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `officeId` (`officeId`),
  KEY `facilitySetId` (`facilitySetId`),
  CONSTRAINT `office_pricings_ibfk_3` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `office_pricings_ibfk_4` FOREIGN KEY (`facilitySetId`) REFERENCES `facility_sets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buildingId` int(11) DEFAULT NULL,
  `deskTypes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desks` int(11) DEFAULT '0',
  `cabinc` int(11) DEFAULT '0',
  `floorc` int(11) DEFAULT '0',
  `active` int(11) DEFAULT NULL,
  `bestPrice` double(9,2) DEFAULT NULL,
  `status` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allowedDeskSizes` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `carpetArea` int(11) DEFAULT NULL,
  `chargeableArea` int(11) DEFAULT NULL,
  `expectedLive` datetime DEFAULT NULL,
  `rentStarted` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  CONSTRAINT `offices_ibfk_1` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES (1,'Ground Floor ',NULL,1,'FlexiDesk,PrivateOffice,EnterpriseOffice,FixedDesk',0,0,0,1,NULL,'Live','Standard,Luxury,Minimal,Custom,SuperLuxury,VeryMinimal',NULL,NULL,'2023-09-01 00:00:00','2023-09-01 00:00:00',1,'2023-09-01 15:00:04','2023-09-01 15:00:04'),(2,'First Floor',NULL,1,'EnterpriseOffice',0,0,0,1,NULL,'Live','Standard,Custom,Luxury,SuperLuxury',NULL,NULL,'2022-09-01 00:00:00','2022-09-01 00:00:00',1,'2023-09-01 15:23:39','2023-09-01 15:23:39'),(3,'Second Floor',NULL,1,'EnterpriseOffice',0,0,0,1,NULL,'Live','Standard,Luxury,SuperLuxury,Custom',NULL,NULL,'2022-09-01 00:00:00','2022-09-01 00:00:00',1,'2023-09-01 15:24:35','2023-09-01 15:24:35'),(4,'Third Floor',NULL,1,'PrivateOffice,EnterpriseOffice',0,0,0,1,NULL,'Live','Standard,Luxury,SuperLuxury,Custom',NULL,NULL,NULL,NULL,1,'2023-09-01 15:26:01','2023-09-01 15:26:01'),(5,'Fourth Floor',NULL,1,'EnterpriseOffice',0,0,0,1,NULL,'Live','Standard,Luxury,SuperLuxury,Custom',NULL,NULL,NULL,NULL,1,'2023-09-01 15:26:22','2023-09-01 15:26:22'),(6,'Lower Terrace',NULL,1,'EnterpriseOffice',0,0,0,1,NULL,'Live','Standard,Luxury,SuperLuxury,Custom',NULL,NULL,NULL,NULL,1,'2023-09-01 15:26:34','2023-09-01 15:26:34');
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
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `serviceProviderText` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `indexNo` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `approvalRequired` int(11) DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utr` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `isPrepaid` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default` int(11) DEFAULT NULL,
  `recurring` int(11) DEFAULT NULL,
  `office` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `amountType` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `gst` int(11) DEFAULT NULL,
  `tds` int(11) DEFAULT NULL,
  `refNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankAccountNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankIfscCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankAccountName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankBranch` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portalUrl` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portalAccountId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portalUserName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portalPassword` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `additionalPaymentInfo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPhone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactEmail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `default` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `catId` (`catId`),
  KEY `typeId` (`typeId`),
  CONSTRAINT `opex_types_ibfk_3` FOREIGN KEY (`catId`) REFERENCES `opex_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `opex_types_ibfk_4` FOREIGN KEY (`typeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `context` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hash` text COLLATE utf8mb4_unicode_ci,
  `isUsed` int(11) DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `validTill` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_passwords`
--

LOCK TABLES `otp_passwords` WRITE;
/*!40000 ALTER TABLE `otp_passwords` DISABLE KEYS */;
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
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `utr` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `narration` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chequeNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `addedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `pgOrderId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `pgSettlementId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
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
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `linkedOn` datetime DEFAULT NULL,
  `linkedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `attributedOn` datetime DEFAULT NULL,
  `attributedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `reason` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `linkedId` (`linkedId`),
  KEY `bookingId` (`bookingId`),
  KEY `invoiceServiceId` (`invoiceServiceId`),
  CONSTRAINT `payin_entries_ibfk_4` FOREIGN KEY (`linkedId`) REFERENCES `payin_entries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payin_entries_ibfk_5` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payin_entries_ibfk_6` FOREIGN KEY (`invoiceServiceId`) REFERENCES `invoice_services` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `utr` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paidBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelled` int(11) DEFAULT '0',
  `cancelledBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelledReason` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelledDate` datetime DEFAULT NULL,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `accountNumber` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ifscCode` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `benificiaryId` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `clientId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `payout_benificiaries_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `amount` decimal(50,30) DEFAULT NULL,
  `narration` text COLLATE utf8mb4_unicode_ci,
  `info` text COLLATE utf8mb4_unicode_ci,
  `paidBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `addedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utr` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payoutPaymentId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `toPayoutGateway` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issuedOn` datetime DEFAULT NULL,
  `chequeNo` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nonExpense` int(11) DEFAULT NULL,
  `salary` int(11) DEFAULT NULL,
  `linked` int(11) DEFAULT NULL,
  `attributed` int(11) DEFAULT NULL,
  `suspense` int(11) DEFAULT NULL,
  `noBill` int(11) DEFAULT NULL,
  `reason` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `amount` double(13,2) DEFAULT NULL,
  `info` text COLLATE utf8mb4_unicode_ci,
  `approvedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rejectedMessage` text COLLATE utf8mb4_unicode_ci,
  `paymentStatus` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `response` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transferId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentRefId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utr` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `exitRequestId` int(11) DEFAULT NULL,
  `purchaseOrderId` int(11) DEFAULT NULL,
  `providerBillId` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `linked` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issuedOn` datetime DEFAULT NULL,
  `chequeNo` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `futurePayoutDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `payoutBenificiaryId` (`payoutBenificiaryId`),
  KEY `exitRequestId` (`exitRequestId`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `providerBillId` (`providerBillId`),
  CONSTRAINT `payout_payments_ibfk_5` FOREIGN KEY (`payoutBenificiaryId`) REFERENCES `payout_benificiaries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_payments_ibfk_6` FOREIGN KEY (`exitRequestId`) REFERENCES `exit_requests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_payments_ibfk_7` FOREIGN KEY (`purchaseOrderId`) REFERENCES `vendor_purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `payout_payments_ibfk_8` FOREIGN KEY (`providerBillId`) REFERENCES `service_provider_bills` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `addedBy` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `updatedBy` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pettyCashAccountId` (`pettyCashAccountId`),
  KEY `userId` (`userId`),
  CONSTRAINT `petty_cash_account_users_ibfk_3` FOREIGN KEY (`pettyCashAccountId`) REFERENCES `petty_cash_accounts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `petty_cash_account_users_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `addedBy` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedOn` datetime DEFAULT NULL,
  `updatedBy` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `url` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `header` text COLLATE utf8mb4_unicode_ci,
  `postData` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pgTransactionId` (`pgTransactionId`),
  CONSTRAINT `pg_transaction_requests_ibfk_1` FOREIGN KEY (`pgTransactionId`) REFERENCES `pg_transactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `response` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pgTransactionId` (`pgTransactionId`),
  CONSTRAINT `pg_transaction_responses_ibfk_1` FOREIGN KEY (`pgTransactionId`) REFERENCES `pg_transactions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pgOrderId` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pgSystemId` int(11) DEFAULT NULL,
  `pgProvider` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pgCharge` double DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `transactionData` text COLLATE utf8mb4_unicode_ci,
  `payinEntryId` int(11) DEFAULT NULL,
  `taxes` double DEFAULT NULL,
  `pgChargeAmount` double DEFAULT NULL,
  `bookingAmount` double DEFAULT NULL,
  `settledAmount` double DEFAULT NULL,
  `additionalRevenue` double DEFAULT NULL,
  `writeOff` double DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `paymentId` (`paymentId`),
  KEY `payinEntryId` (`payinEntryId`),
  CONSTRAINT `pg_transactions_ibfk_3` FOREIGN KEY (`paymentId`) REFERENCES `payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pg_transactions_ibfk_4` FOREIGN KEY (`payinEntryId`) REFERENCES `payin_entries` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mailId` int(11) DEFAULT NULL,
  `mailSent` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `price_contracts_contractId_priceId_unique` (`priceId`,`contractId`),
  KEY `contractId` (`contractId`),
  CONSTRAINT `price_contracts_ibfk_3` FOREIGN KEY (`priceId`) REFERENCES `price_quotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `price_contracts_ibfk_4` FOREIGN KEY (`contractId`) REFERENCES `contracts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `facilities` text COLLATE utf8mb4_unicode_ci,
  `deskType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `min` int(11) DEFAULT NULL,
  `max` int(11) DEFAULT NULL,
  `lockIn` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `quoteId` (`quoteId`),
  KEY `facilitySetId` (`facilitySetId`),
  CONSTRAINT `price_quotes_ibfk_3` FOREIGN KEY (`quoteId`) REFERENCES `proposition_quotes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `price_quotes_ibfk_4` FOREIGN KEY (`facilitySetId`) REFERENCES `facility_sets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mailId` int(11) DEFAULT NULL,
  `mailSent` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `propositionId` (`propositionId`),
  KEY `officeId` (`officeId`),
  CONSTRAINT `proposition_quotes_ibfk_3` FOREIGN KEY (`propositionId`) REFERENCES `lead_propositions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `proposition_quotes_ibfk_4` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `context` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sequence` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ref_sequences`
--

LOCK TABLES `ref_sequences` WRITE;
/*!40000 ALTER TABLE `ref_sequences` DISABLE KEYS */;
INSERT INTO `ref_sequences` VALUES (1,2022,4,'Liability',9,1,'2023-09-04 23:56:54','2023-09-04 23:56:54'),(2,2023,4,'MonthlyInvoice',2,1,'2023-09-05 21:39:59','2023-09-05 21:39:59'),(3,2023,5,'MonthlyInvoice',1,1,'2023-09-06 00:00:52','2023-09-06 00:00:52'),(4,2023,6,'MonthlyInvoice',1,1,'2023-09-06 00:01:17','2023-09-06 00:01:17'),(5,2023,7,'MonthlyInvoice',1,1,'2023-09-06 14:59:44','2023-09-06 14:59:44'),(6,2023,8,'MonthlyInvoice',1,1,'2023-09-06 15:00:23','2023-09-06 15:00:23'),(7,2023,9,'MonthlyInvoice',2,1,'2023-09-06 15:01:03','2023-09-06 15:01:03'),(8,2023,8,'Liability',1,1,'2023-09-06 15:03:13','2023-09-06 15:03:13');
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refNo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resourceId` int(11) DEFAULT NULL,
  `parentBookingId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `clientId` int(11) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from` datetime DEFAULT NULL,
  `to` datetime DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `resourceId` (`resourceId`),
  KEY `parentBookingId` (`parentBookingId`),
  KEY `bookingId` (`bookingId`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `resource_bookings_ibfk_5` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `resource_bookings_ibfk_6` FOREIGN KEY (`parentBookingId`) REFERENCES `bookings` (`id`),
  CONSTRAINT `resource_bookings_ibfk_7` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `resource_bookings_ibfk_8` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `resource_images_imageId_resourceId_unique` (`resourceId`,`imageId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `resource_images_ibfk_3` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `resource_images_ibfk_4` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subUnits` int(11) DEFAULT NULL,
  `style` text COLLATE utf8mb4_unicode_ci,
  `subUnitType` text COLLATE utf8mb4_unicode_ci,
  `facilities` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `userGuideId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `officeId` (`officeId`),
  KEY `userGuideId` (`userGuideId`),
  CONSTRAINT `resources_ibfk_3` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `resources_ibfk_4` FOREIGN KEY (`userGuideId`) REFERENCES `docs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `enum` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `json` text COLLATE utf8mb4_unicode_ci,
  `isGeoSpecific` int(11) DEFAULT NULL,
  `isSupport` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'CURRENT_TIMESTAMP',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin',NULL,'{\"admin\":{\"enable\":true},\"dashboards\":{\"enable\":true},\"workbenches\":{\"enable\":true},\"bookings\":{\"enable\":true,\"newBooking\":true,\"list\":true,\"editContract\":true,\"cancelFutureContract\":true,\"cancelContract\":true,\"cancelApprovedFutureContract\":true,\"cancelBooking\":true,\"approveContract\":true,\"cancelConfirmedFutureContract\":true,\"editClient\":true,\"confirmContract\":true,\"addPayment\":true,\"expansion\":true,\"relocation\":true,\"contractTerms\":true,\"raiseInvoice\":true,\"viewContractHistory\":true,\"sendInvoiceNotification\":true,\"onboardingExits\":true,\"editEmployees\":true,\"editInvoices\":true,\"raiseInvoices\":true,\"uploadAgreement\":true,\"contraction\":true,\"cancelInvoice\":true,\"refundLiability\":true,\"requestExit\":true,\"exitProcess\":true,\"approveExitStatement\":false,\"forceAcceptExitStatement\":false,\"uploadExitForm\":false,\"addExitComments\":false,\"assetDamageCharges\":true,\"otherDeductions\":true},\"leads\":{\"enable\":false},\"accounts\":{\"enable\":true,\"listPayouts\":false,\"rejectPayout\":false,\"listDebitEntries\":true,\"attributeDebitEntry\":true,\"importDebitEntries\":true,\"deattributeDebitEntry\":true,\"addDebitEntry\":true,\"editDebitEntry\":true,\"listCreditEntries\":true,\"attributeCreditEntry\":true,\"importCreditEntries\":true,\"deattributeCreditEntry\":true,\"addCreditEntry\":true,\"editCreditEntry\":true},\"purchases\":{\"enable\":true},\"support\":{\"enable\":true},\"assets\":{\"enable\":false}}',1,1,1,1,'2023-09-01 04:53:00','harish.k','2023-06-27 15:45:47','2023-09-01 04:53:00'),(2,'Bookings',NULL,'{\"admin\":{},\"dashboards\":{},\"workbenches\":{},\"bookings\":{\"enable\":true},\"leads\":{},\"accounts\":{},\"purchases\":{},\"support\":{},\"assets\":{}}',NULL,NULL,1,1,'2023-06-27 17:45:47','sam','2023-06-27 15:45:47','2023-06-27 17:45:47'),(4,'Support',NULL,'{\"admin\":{},\"dashboards\":{\"enable\":true},\"workbenches\":{},\"bookings\":{},\"leads\":{},\"accounts\":{},\"purchases\":{},\"support\":{\"enable\":true},\"assets\":{}}',NULL,1,1,1,'2023-07-19 17:11:01','sam','2023-06-27 15:45:47','2023-06-27 17:45:47'),(5,'Accounts',NULL,'\"{\\\"admin\\\":{},\\\"dashboards\\\":{\\\"enable\\\":true},\\\"workbenches\\\":{},\\\"bookings\\\":{},\\\"leads\\\":{},\\\"accounts\\\":{\\\"enable\\\":true},\\\"purchases\\\":{},\\\"support\\\":{},\\\"assets\\\":{}}\"',1,1,1,0,'2023-07-21 10:49:42','lokesh','2023-07-20 04:43:18','2023-07-20 12:13:18'),(6,'Accounts',NULL,'\"{\\\"admin\\\":{},\\\"dashboards\\\":{\\\"enable\\\":false},\\\"workbenches\\\":{},\\\"bookings\\\":{},\\\"leads\\\":{},\\\"accounts\\\":{\\\"enable\\\":true},\\\"purchases\\\":{},\\\"support\\\":{},\\\"assets\\\":{}}\"',1,1,1,0,'2023-07-20 12:13:49','lokesh','2023-07-20 04:43:18','2023-07-20 12:13:18'),(7,'Admin',NULL,'{\"admin\":{\"enable\":true},\"dashboards\":{\"enable\":true},\"workbenches\":{\"enable\":true},\"bookings\":{\"enable\":true},\"leads\":{\"enable\":true},\"accounts\":{\"enable\":true},\"purchases\":{\"enable\":true},\"support\":{\"enable\":true},\"assets\":{\"enable\":true}}',1,1,2,1,'2023-07-20 15:48:00','tech.p','2023-07-20 08:18:00','2023-07-20 15:48:00'),(8,'Accounts',NULL,'{\"admin\":{},\"dashboards\":{\"enable\":true},\"workbenches\":{},\"bookings\":{},\"leads\":{},\"accounts\":{\"enable\":true},\"purchases\":{\"enable\":false},\"support\":{\"enable\":false},\"assets\":{}}',1,1,1,1,'2023-07-25 18:37:39','lokesh','2023-07-21 03:20:01','2023-07-25 18:37:39'),(9,'SA',NULL,'{\"admin\":{\"enable\":true,\"company\":true,\"externalSystems\":true,\"users\":true,\"locations\":true,\"facilities\":true,\"offices\":true,\"properties\":true,\"helpNotes\":false,\"scheduler\":true,\"sms\":true,\"mails\":true},\"dashboards\":{\"enable\":true},\"workbenches\":{\"enable\":true,\"sales\":true,\"support\":true,\"accounts\":true,\"purchases\":true,\"businessops\":true,\"projects\":true,\"buildingops\":true,\"hmt\":true},\"bookings\":{\"enable\":true,\"cancelFutureContract\":false,\"list\":true,\"editContract\":true,\"viewContractHistory\":true,\"sendInvoiceNotification\":true,\"onboardingExits\":true,\"editEmployees\":true,\"editInvoices\":true,\"contractTerms\":true,\"relocation\":true,\"cancelApprovedFutureContract\":true,\"cancelContract\":true,\"newBooking\":true,\"cancelBooking\":true,\"approveContract\":true,\"cancelConfirmedFutureContract\":true,\"expansion\":true,\"uploadAgreement\":true,\"raiseInvoices\":true,\"refundLiability\":true,\"cancelInvoice\":true,\"contraction\":true,\"addPayment\":true,\"confirmContract\":true,\"editClient\":true,\"raiseInvoice\":true,\"notifications\":true,\"reports\":true,\"contractRenewals\":true,\"resourceBookings\":true,\"markResouceBooked\":true,\"newResourceBooking\":true,\"addCredits\":true,\"cancelResourceBooking\":true,\"uploadExitForm\":true,\"forceAcceptExitStatement\":true,\"approveExitStatement\":true,\"addExitComments\":true,\"assetDamageCharges\":true,\"exitProcess\":true,\"requestExit\":true,\"otherDeductions\":true},\"leads\":{\"enable\":true,\"reports\":true,\"visits\":true,\"list\":true},\"accounts\":{\"enable\":true,\"attributeCreditEntry\":true,\"listCreditEntries\":true,\"listDebitEntries\":true,\"attributeDebitEntry\":true,\"listBillsQueue\":true,\"mapBillQueue\":true,\"rejectPayout\":true,\"listPayouts\":true,\"listRevenueCodes\":true,\"paymentsList\":true,\"addTenantPayment\":true,\"addRevenueCode\":true,\"updatePayoutStatus\":true,\"processPayout\":true,\"addBillQueue\":true,\"deattributeDebitEntry\":true,\"importDebitEntries\":true,\"importCreditEntries\":true,\"deattributeCreditEntry\":true,\"addCreditEntry\":true,\"editCreditEntry\":true,\"addDebitEntry\":true,\"editDebitEntry\":true,\"editBillQueue\":true,\"archieveBillQueue\":true,\"approvePayout\":true,\"markAsFuturePayout\":true,\"submitPayoutDetails\":true,\"editRevenueCode\":true,\"archieveRevenueCode\":true,\"archieveTenantPayment\":true,\"addARComments\":true,\"submitTDSForm\":true,\"sendTDSNotifications\":true,\"manageExpenseCodes\":true,\"listBills\":true,\"raiseRecurreningBills\":true,\"manageRecurringBills\":true,\"cancelBill\":true,\"monthWiseBills\":true,\"listPOs\":true,\"editBill\":true,\"repeatopexPO\":true,\"approveBill\":true,\"expenseReports\":true,\"revenueReports\":true,\"accountingReports\":true},\"purchases\":{\"enable\":true,\"addSkus\":true,\"addVendors\":true,\"editVendorBankDetails\":true,\"viewWorkOrders\":true,\"forceAcceptWorkOrder\":true,\"viewProjects\":true,\"editProjectBill\":true,\"editSkus\":true,\"editVendors\":true,\"editVendorContactDetails\":true,\"modifyWorkOrders\":true,\"deleteWorkOrder\":true,\"modifyProjects\":true,\"addBillItems\":true,\"requestMilestoneRelease\":true,\"projectBillsList\":true,\"approveWorkItems\":true,\"modifyVendorSku\":true,\"vendors\":true,\"skus\":true,\"requestVendorBankDetails\":true,\"modifyVendorTerms\":true,\"requestVendorAcceptance\":true,\"addProjectBill\":true,\"confirmPaymentMileStone\":true,\"approvePaymentMileStone\":true,\"projectBillGstVerification\":true,\"posList\":true,\"releasePOMileStone\":true,\"buildingPayablesReport\":true,\"editMilestones\":true,\"setBillDueDates\":true,\"projectBillGstPostings\":true,\"requestPOMilestoneRelease\":true,\"deletePurchaseOrder\":true,\"editPurchaseOrder\":true,\"uploadTaxInvoice\":true,\"uploadProformaInvoice\":true,\"approvePOMileStone\":true,\"poGstVerification\":true,\"tdsCompliance\":true},\"support\":{\"enable\":true,\"list\":true,\"reply\":true,\"reassign\":true,\"attend\":true,\"resolve\":true,\"close\":true},\"assets\":{\"enable\":true,\"addStore\":true,\"reports\":true,\"movement\":true,\"assignment\":true,\"creation\":true,\"list\":true}}',1,1,1,1,'2023-07-25 12:21:31','lokesh','2023-07-25 04:51:31','2023-07-25 12:21:31'),(10,'Testing',NULL,'{\"admin\":{\"enable\":true},\"dashboards\":{\"enable\":true},\"workbenches\":{\"enable\":true},\"bookings\":{},\"leads\":{},\"accounts\":{\"enable\":false},\"purchases\":{},\"support\":{},\"assets\":{}}',1,1,1,1,'2023-07-25 18:39:55','lokesh','2023-07-25 11:09:21','2023-07-25 18:39:55');
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
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `bookingId` (`bookingId`),
  KEY `assignedTo` (`assignedTo`),
  CONSTRAINT `schedules_ibfk_3` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `schedules_ibfk_4` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,1,NULL,'2022-05-20 12:30:00','2022-05-20 13:30:00','Done','OnBoarding','2023-09-05 21:49:46','lokesh','2023-09-04 23:55:29','2023-09-04 23:55:29'),(2,2,NULL,'2022-05-13 12:30:00','2022-05-13 13:30:00','Scheduled','OnBoarding','2023-09-05 23:57:21','system','2023-09-05 23:57:21','2023-09-05 23:57:21'),(3,3,NULL,'2023-09-01 12:30:00','2023-09-01 13:30:00','Done','OnBoarding','2023-09-06 15:06:37','loki3','2023-09-06 15:00:05','2023-09-06 15:00:05'),(4,4,NULL,'2023-09-07 12:30:00','2023-09-07 13:30:00','Scheduled','OnBoarding','2023-09-06 15:35:11','system','2023-09-06 15:35:11','2023-09-06 15:35:11');
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
  `linkId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `context` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data` text COLLATE utf8mb4_unicode_ci,
  `created` datetime DEFAULT NULL,
  `expiry` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selfcare_links`
--

LOCK TABLES `selfcare_links` WRITE;
/*!40000 ALTER TABLE `selfcare_links` DISABLE KEYS */;
INSERT INTO `selfcare_links` VALUES (1,'911992c1-9d03-444b-bac5-afe6b575d51c','http://selfcare.coworkops.in/#/selfcare/pending-payment/911992c1-9d03-444b-bac5-afe6b575d51c','PendingPayment','{\"bookingId\":1}','2023-09-04 23:56:56',NULL,1,'2023-09-04 23:56:56','2023-09-04 23:56:56'),(2,'fbbdafcf-b37d-44a8-b73a-3ec5439d6fc1','http://selfcare.coworkops.in/#/selfcare/pending-payment/fbbdafcf-b37d-44a8-b73a-3ec5439d6fc1','PendingPayment','{\"bookingId\":1}','2023-09-05 00:00:07',NULL,1,'2023-09-05 00:00:07','2023-09-05 00:00:07'),(3,'581d878c-a39a-417a-8b25-4743f2a52776','http://selfcare.coworkops.in/#/selfcare/pending-payment/581d878c-a39a-417a-8b25-4743f2a52776','PendingPayment','{\"bookingId\":1}','2023-09-05 21:07:21',NULL,1,'2023-09-05 21:07:21','2023-09-05 21:07:21'),(4,'41cabc53-a031-4732-8d74-27848c22ee34','http://selfcare.coworkops.in/#/selfcare/pending-payment/41cabc53-a031-4732-8d74-27848c22ee34','PendingPayment','{\"bookingId\":1}','2023-09-05 21:29:02',NULL,1,'2023-09-05 21:29:02','2023-09-05 21:29:02'),(5,'13567a81-fae7-48f3-bbab-9128d221e8f4','http://selfcare.coworkops.in/#/selfcare/pending-payment/13567a81-fae7-48f3-bbab-9128d221e8f4','PendingPayment','{\"bookingId\":1}','2023-09-05 21:30:49',NULL,1,'2023-09-05 21:30:49','2023-09-05 21:30:49'),(6,'a4001b2b-f68e-47a5-b575-891b6ddabb2c','http://selfcare.coworkops.in/#/selfcare/pending-payment/a4001b2b-f68e-47a5-b575-891b6ddabb2c','PendingPayment','{\"bookingId\":1}','2023-09-05 21:34:02',NULL,1,'2023-09-05 21:34:02','2023-09-05 21:34:02'),(7,'2b853e39-8470-44b4-8a5b-025f97eb385f','http://selfcare.coworkops.in/#/selfcare/pending-payment/2b853e39-8470-44b4-8a5b-025f97eb385f','PendingPayment','{\"bookingId\":1}','2023-09-05 21:36:55',NULL,1,'2023-09-05 21:36:55','2023-09-05 21:36:55'),(8,'92782f92-13da-4951-9b97-fe7c92caa2b8','http://selfcare.coworkops.in/#/selfcare/pending-payment/92782f92-13da-4951-9b97-fe7c92caa2b8','PendingPayment','{\"bookingId\":1}','2023-09-05 21:39:55',NULL,1,'2023-09-05 21:39:55','2023-09-05 21:39:55'),(9,'a98bcfe7-9cb0-4a74-bc7f-e88e766f11aa','http://selfcare.coworkops.in/#/selfcare/pending-payment/a98bcfe7-9cb0-4a74-bc7f-e88e766f11aa','PendingPayment','{\"bookingId\":1}','2023-09-05 21:40:01',NULL,1,'2023-09-05 21:40:01','2023-09-05 21:40:01'),(10,'c22383e7-c728-4478-a7d9-0e2bac93cfbc','http://selfcare.coworkops.in/#/selfcare/pending-payment/c22383e7-c728-4478-a7d9-0e2bac93cfbc','PendingPayment','{\"bookingId\":2}','2023-09-05 23:58:10',NULL,1,'2023-09-05 23:58:10','2023-09-05 23:58:10'),(11,'f3cffd3c-a05c-484f-b9b0-72e090e42cf9','http://selfcare.coworkops.in/#/selfcare/pending-payment/f3cffd3c-a05c-484f-b9b0-72e090e42cf9','PendingPayment','{\"bookingId\":2}','2023-09-05 23:58:15',NULL,1,'2023-09-05 23:58:15','2023-09-05 23:58:15'),(12,'a1b6c839-45e0-44e0-9176-bb25634ad69d','http://selfcare.coworkops.in/#/selfcare/pending-payment/a1b6c839-45e0-44e0-9176-bb25634ad69d','PendingPayment','{\"bookingId\":3}','2023-09-06 15:03:15',NULL,1,'2023-09-06 15:03:15','2023-09-06 15:03:15'),(13,'53821917-cf66-449e-b7a0-48c03a18fc03','http://selfcare.coworkops.in/#/selfcare/pending-payment/53821917-cf66-449e-b7a0-48c03a18fc03','PendingPayment','{\"bookingId\":3}','2023-09-06 15:03:21',NULL,1,'2023-09-06 15:03:21','2023-09-06 15:03:21');
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
  `accountNumber` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ifscCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountHolderName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  CONSTRAINT `service_provider_bank_accounts_ibfk_1` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceId` int(11) DEFAULT NULL,
  `approvalRequired` int(11) DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `paidBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utr` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `companyId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `servicePaymentId` (`servicePaymentId`),
  KEY `payoutPaymentId` (`payoutPaymentId`),
  CONSTRAINT `service_provider_bills_ibfk_3` FOREIGN KEY (`servicePaymentId`) REFERENCES `service_provider_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_provider_bills_ibfk_4` FOREIGN KEY (`payoutPaymentId`) REFERENCES `payout_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  CONSTRAINT `service_provider_contacts_ibfk_1` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `amountType` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` double(9,2) DEFAULT NULL,
  `gst` int(11) DEFAULT NULL,
  `tds` int(11) DEFAULT NULL,
  `refNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankAccountNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankIfscCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankAccountName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankBranch` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portalUrl` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portalUserName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `portalPassword` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactPhone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contactEmail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `webUrl` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountId` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `info` text COLLATE utf8mb4_unicode_ci,
  `active` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `serviceProviderId` (`serviceProviderId`),
  CONSTRAINT `service_provider_portals_ibfk_1` FOREIGN KEY (`serviceProviderId`) REFERENCES `service_providers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `panId` int(11) DEFAULT NULL,
  `gst` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gstId` int(11) DEFAULT NULL,
  `cin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cinId` int(11) DEFAULT NULL,
  `addressProofId` int(11) DEFAULT NULL,
  `hasContact` int(11) DEFAULT NULL,
  `hasGst` int(11) DEFAULT NULL,
  `hasTds` int(11) DEFAULT NULL,
  `isPaymentHolded` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `additionalPaymentInfo` text COLLATE utf8mb4_unicode_ci,
  `companyId` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `itLedgerAdded` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `serviceId` (`serviceId`),
  CONSTRAINT `service_providers_ibfk_3` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `service_providers_ibfk_4` FOREIGN KEY (`serviceId`) REFERENCES `service_provider_services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `catId` (`catId`),
  CONSTRAINT `sku_types_ibfk_1` FOREIGN KEY (`catId`) REFERENCES `sku_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `symbol` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `symbol` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `gst` double(4,2) DEFAULT NULL,
  `tds` double(4,2) DEFAULT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `isService` int(11) DEFAULT NULL,
  `isAsset` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `catId` (`catId`),
  KEY `typeId` (`typeId`),
  CONSTRAINT `skus_ibfk_1` FOREIGN KEY (`catId`) REFERENCES `sku_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `skus_ibfk_2` FOREIGN KEY (`typeId`) REFERENCES `sku_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `sms` text COLLATE utf8mb4_unicode_ci,
  `receivers` text COLLATE utf8mb4_unicode_ci,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smses`
--

LOCK TABLES `smses` WRITE;
/*!40000 ALTER TABLE `smses` DISABLE KEYS */;
/*!40000 ALTER TABLE `smses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_date`
--

DROP TABLE IF EXISTS `sys_date`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_date` (
  `date_field` date NOT NULL,
  PRIMARY KEY (`date_field`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_date`
--

LOCK TABLES `sys_date` WRITE;
/*!40000 ALTER TABLE `sys_date` DISABLE KEYS */;
INSERT INTO `sys_date` VALUES ('2016-01-01'),('2016-01-02'),('2016-01-03'),('2016-01-04'),('2016-01-05'),('2016-01-06'),('2016-01-07'),('2016-01-08'),('2016-01-09'),('2016-01-10'),('2016-01-11'),('2016-01-12'),('2016-01-13'),('2016-01-14'),('2016-01-15'),('2016-01-16'),('2016-01-17'),('2016-01-18'),('2016-01-19'),('2016-01-20'),('2016-01-21'),('2016-01-22'),('2016-01-23'),('2016-01-24'),('2016-01-25'),('2016-01-26'),('2016-01-27'),('2016-01-28'),('2016-01-29'),('2016-01-30'),('2016-01-31'),('2016-02-01'),('2016-02-02'),('2016-02-03'),('2016-02-04'),('2016-02-05'),('2016-02-06'),('2016-02-07'),('2016-02-08'),('2016-02-09'),('2016-02-10'),('2016-02-11'),('2016-02-12'),('2016-02-13'),('2016-02-14'),('2016-02-15'),('2016-02-16'),('2016-02-17'),('2016-02-18'),('2016-02-19'),('2016-02-20'),('2016-02-21'),('2016-02-22'),('2016-02-23'),('2016-02-24'),('2016-02-25'),('2016-02-26'),('2016-02-27'),('2016-02-28'),('2016-02-29'),('2016-03-01'),('2016-03-02'),('2016-03-03'),('2016-03-04'),('2016-03-05'),('2016-03-06'),('2016-03-07'),('2016-03-08'),('2016-03-09'),('2016-03-10'),('2016-03-11'),('2016-03-12'),('2016-03-13'),('2016-03-14'),('2016-03-15'),('2016-03-16'),('2016-03-17'),('2016-03-18'),('2016-03-19'),('2016-03-20'),('2016-03-21'),('2016-03-22'),('2016-03-23'),('2016-03-24'),('2016-03-25'),('2016-03-26'),('2016-03-27'),('2016-03-28'),('2016-03-29'),('2016-03-30'),('2016-03-31'),('2016-04-01'),('2016-04-02'),('2016-04-03'),('2016-04-04'),('2016-04-05'),('2016-04-06'),('2016-04-07'),('2016-04-08'),('2016-04-09'),('2016-04-10'),('2016-04-11'),('2016-04-12'),('2016-04-13'),('2016-04-14'),('2016-04-15'),('2016-04-16'),('2016-04-17'),('2016-04-18'),('2016-04-19'),('2016-04-20'),('2016-04-21'),('2016-04-22'),('2016-04-23'),('2016-04-24'),('2016-04-25'),('2016-04-26'),('2016-04-27'),('2016-04-28'),('2016-04-29'),('2016-04-30'),('2016-05-01'),('2016-05-02'),('2016-05-03'),('2016-05-04'),('2016-05-05'),('2016-05-06'),('2016-05-07'),('2016-05-08'),('2016-05-09'),('2016-05-10'),('2016-05-11'),('2016-05-12'),('2016-05-13'),('2016-05-14'),('2016-05-15'),('2016-05-16'),('2016-05-17'),('2016-05-18'),('2016-05-19'),('2016-05-20'),('2016-05-21'),('2016-05-22'),('2016-05-23'),('2016-05-24'),('2016-05-25'),('2016-05-26'),('2016-05-27'),('2016-05-28'),('2016-05-29'),('2016-05-30'),('2016-05-31'),('2016-06-01'),('2016-06-02'),('2016-06-03'),('2016-06-04'),('2016-06-05'),('2016-06-06'),('2016-06-07'),('2016-06-08'),('2016-06-09'),('2016-06-10'),('2016-06-11'),('2016-06-12'),('2016-06-13'),('2016-06-14'),('2016-06-15'),('2016-06-16'),('2016-06-17'),('2016-06-18'),('2016-06-19'),('2016-06-20'),('2016-06-21'),('2016-06-22'),('2016-06-23'),('2016-06-24'),('2016-06-25'),('2016-06-26'),('2016-06-27'),('2016-06-28'),('2016-06-29'),('2016-06-30'),('2016-07-01'),('2016-07-02'),('2016-07-03'),('2016-07-04'),('2016-07-05'),('2016-07-06'),('2016-07-07'),('2016-07-08'),('2016-07-09'),('2016-07-10'),('2016-07-11'),('2016-07-12'),('2016-07-13'),('2016-07-14'),('2016-07-15'),('2016-07-16'),('2016-07-17'),('2016-07-18'),('2016-07-19'),('2016-07-20'),('2016-07-21'),('2016-07-22'),('2016-07-23'),('2016-07-24'),('2016-07-25'),('2016-07-26'),('2016-07-27'),('2016-07-28'),('2016-07-29'),('2016-07-30'),('2016-07-31'),('2016-08-01'),('2016-08-02'),('2016-08-03'),('2016-08-04'),('2016-08-05'),('2016-08-06'),('2016-08-07'),('2016-08-08'),('2016-08-09'),('2016-08-10'),('2016-08-11'),('2016-08-12'),('2016-08-13'),('2016-08-14'),('2016-08-15'),('2016-08-16'),('2016-08-17'),('2016-08-18'),('2016-08-19'),('2016-08-20'),('2016-08-21'),('2016-08-22'),('2016-08-23'),('2016-08-24'),('2016-08-25'),('2016-08-26'),('2016-08-27'),('2016-08-28'),('2016-08-29'),('2016-08-30'),('2016-08-31'),('2016-09-01'),('2016-09-02'),('2016-09-03'),('2016-09-04'),('2016-09-05'),('2016-09-06'),('2016-09-07'),('2016-09-08'),('2016-09-09'),('2016-09-10'),('2016-09-11'),('2016-09-12'),('2016-09-13'),('2016-09-14'),('2016-09-15'),('2016-09-16'),('2016-09-17'),('2016-09-18'),('2016-09-19'),('2016-09-20'),('2016-09-21'),('2016-09-22'),('2016-09-23'),('2016-09-24'),('2016-09-25'),('2016-09-26'),('2016-09-27'),('2016-09-28'),('2016-09-29'),('2016-09-30'),('2016-10-01'),('2016-10-02'),('2016-10-03'),('2016-10-04'),('2016-10-05'),('2016-10-06'),('2016-10-07'),('2016-10-08'),('2016-10-09'),('2016-10-10'),('2016-10-11'),('2016-10-12'),('2016-10-13'),('2016-10-14'),('2016-10-15'),('2016-10-16'),('2016-10-17'),('2016-10-18'),('2016-10-19'),('2016-10-20'),('2016-10-21'),('2016-10-22'),('2016-10-23'),('2016-10-24'),('2016-10-25'),('2016-10-26'),('2016-10-27'),('2016-10-28'),('2016-10-29'),('2016-10-30'),('2016-10-31'),('2016-11-01'),('2016-11-02'),('2016-11-03'),('2016-11-04'),('2016-11-05'),('2016-11-06'),('2016-11-07'),('2016-11-08'),('2016-11-09'),('2016-11-10'),('2016-11-11'),('2016-11-12'),('2016-11-13'),('2016-11-14'),('2016-11-15'),('2016-11-16'),('2016-11-17'),('2016-11-18'),('2016-11-19'),('2016-11-20'),('2016-11-21'),('2016-11-22'),('2016-11-23'),('2016-11-24'),('2016-11-25'),('2016-11-26'),('2016-11-27'),('2016-11-28'),('2016-11-29'),('2016-11-30'),('2016-12-01'),('2016-12-02'),('2016-12-03'),('2016-12-04'),('2016-12-05'),('2016-12-06'),('2016-12-07'),('2016-12-08'),('2016-12-09'),('2016-12-10'),('2016-12-11'),('2016-12-12'),('2016-12-13'),('2016-12-14'),('2016-12-15'),('2016-12-16'),('2016-12-17'),('2016-12-18'),('2016-12-19'),('2016-12-20'),('2016-12-21'),('2016-12-22'),('2016-12-23'),('2016-12-24'),('2016-12-25'),('2016-12-26'),('2016-12-27'),('2016-12-28'),('2016-12-29'),('2016-12-30'),('2016-12-31'),('2017-01-01'),('2017-01-02'),('2017-01-03'),('2017-01-04'),('2017-01-05'),('2017-01-06'),('2017-01-07'),('2017-01-08'),('2017-01-09'),('2017-01-10'),('2017-01-11'),('2017-01-12'),('2017-01-13'),('2017-01-14'),('2017-01-15'),('2017-01-16'),('2017-01-17'),('2017-01-18'),('2017-01-19'),('2017-01-20'),('2017-01-21'),('2017-01-22'),('2017-01-23'),('2017-01-24'),('2017-01-25'),('2017-01-26'),('2017-01-27'),('2017-01-28'),('2017-01-29'),('2017-01-30'),('2017-01-31'),('2017-02-01'),('2017-02-02'),('2017-02-03'),('2017-02-04'),('2017-02-05'),('2017-02-06'),('2017-02-07'),('2017-02-08'),('2017-02-09'),('2017-02-10'),('2017-02-11'),('2017-02-12'),('2017-02-13'),('2017-02-14'),('2017-02-15'),('2017-02-16'),('2017-02-17'),('2017-02-18'),('2017-02-19'),('2017-02-20'),('2017-02-21'),('2017-02-22'),('2017-02-23'),('2017-02-24'),('2017-02-25'),('2017-02-26'),('2017-02-27'),('2017-02-28'),('2017-03-01'),('2017-03-02'),('2017-03-03'),('2017-03-04'),('2017-03-05'),('2017-03-06'),('2017-03-07'),('2017-03-08'),('2017-03-09'),('2017-03-10'),('2017-03-11'),('2017-03-12'),('2017-03-13'),('2017-03-14'),('2017-03-15'),('2017-03-16'),('2017-03-17'),('2017-03-18'),('2017-03-19'),('2017-03-20'),('2017-03-21'),('2017-03-22'),('2017-03-23'),('2017-03-24'),('2017-03-25'),('2017-03-26'),('2017-03-27'),('2017-03-28'),('2017-03-29'),('2017-03-30'),('2017-03-31'),('2017-04-01'),('2017-04-02'),('2017-04-03'),('2017-04-04'),('2017-04-05'),('2017-04-06'),('2017-04-07'),('2017-04-08'),('2017-04-09'),('2017-04-10'),('2017-04-11'),('2017-04-12'),('2017-04-13'),('2017-04-14'),('2017-04-15'),('2017-04-16'),('2017-04-17'),('2017-04-18'),('2017-04-19'),('2017-04-20'),('2017-04-21'),('2017-04-22'),('2017-04-23'),('2017-04-24'),('2017-04-25'),('2017-04-26'),('2017-04-27'),('2017-04-28'),('2017-04-29'),('2017-04-30'),('2017-05-01'),('2017-05-02'),('2017-05-03'),('2017-05-04'),('2017-05-05'),('2017-05-06'),('2017-05-07'),('2017-05-08'),('2017-05-09'),('2017-05-10'),('2017-05-11'),('2017-05-12'),('2017-05-13'),('2017-05-14'),('2017-05-15'),('2017-05-16'),('2017-05-17'),('2017-05-18'),('2017-05-19'),('2017-05-20'),('2017-05-21'),('2017-05-22'),('2017-05-23'),('2017-05-24'),('2017-05-25'),('2017-05-26'),('2017-05-27'),('2017-05-28'),('2017-05-29'),('2017-05-30'),('2017-05-31'),('2017-06-01'),('2017-06-02'),('2017-06-03'),('2017-06-04'),('2017-06-05'),('2017-06-06'),('2017-06-07'),('2017-06-08'),('2017-06-09'),('2017-06-10'),('2017-06-11'),('2017-06-12'),('2017-06-13'),('2017-06-14'),('2017-06-15'),('2017-06-16'),('2017-06-17'),('2017-06-18'),('2017-06-19'),('2017-06-20'),('2017-06-21'),('2017-06-22'),('2017-06-23'),('2017-06-24'),('2017-06-25'),('2017-06-26'),('2017-06-27'),('2017-06-28'),('2017-06-29'),('2017-06-30'),('2017-07-01'),('2017-07-02'),('2017-07-03'),('2017-07-04'),('2017-07-05'),('2017-07-06'),('2017-07-07'),('2017-07-08'),('2017-07-09'),('2017-07-10'),('2017-07-11'),('2017-07-12'),('2017-07-13'),('2017-07-14'),('2017-07-15'),('2017-07-16'),('2017-07-17'),('2017-07-18'),('2017-07-19'),('2017-07-20'),('2017-07-21'),('2017-07-22'),('2017-07-23'),('2017-07-24'),('2017-07-25'),('2017-07-26'),('2017-07-27'),('2017-07-28'),('2017-07-29'),('2017-07-30'),('2017-07-31'),('2017-08-01'),('2017-08-02'),('2017-08-03'),('2017-08-04'),('2017-08-05'),('2017-08-06'),('2017-08-07'),('2017-08-08'),('2017-08-09'),('2017-08-10'),('2017-08-11'),('2017-08-12'),('2017-08-13'),('2017-08-14'),('2017-08-15'),('2017-08-16'),('2017-08-17'),('2017-08-18'),('2017-08-19'),('2017-08-20'),('2017-08-21'),('2017-08-22'),('2017-08-23'),('2017-08-24'),('2017-08-25'),('2017-08-26'),('2017-08-27'),('2017-08-28'),('2017-08-29'),('2017-08-30'),('2017-08-31'),('2017-09-01'),('2017-09-02'),('2017-09-03'),('2017-09-04'),('2017-09-05'),('2017-09-06'),('2017-09-07'),('2017-09-08'),('2017-09-09'),('2017-09-10'),('2017-09-11'),('2017-09-12'),('2017-09-13'),('2017-09-14'),('2017-09-15'),('2017-09-16'),('2017-09-17'),('2017-09-18'),('2017-09-19'),('2017-09-20'),('2017-09-21'),('2017-09-22'),('2017-09-23'),('2017-09-24'),('2017-09-25'),('2017-09-26'),('2017-09-27'),('2017-09-28'),('2017-09-29'),('2017-09-30'),('2017-10-01'),('2017-10-02'),('2017-10-03'),('2017-10-04'),('2017-10-05'),('2017-10-06'),('2017-10-07'),('2017-10-08'),('2017-10-09'),('2017-10-10'),('2017-10-11'),('2017-10-12'),('2017-10-13'),('2017-10-14'),('2017-10-15'),('2017-10-16'),('2017-10-17'),('2017-10-18'),('2017-10-19'),('2017-10-20'),('2017-10-21'),('2017-10-22'),('2017-10-23'),('2017-10-24'),('2017-10-25'),('2017-10-26'),('2017-10-27'),('2017-10-28'),('2017-10-29'),('2017-10-30'),('2017-10-31'),('2017-11-01'),('2017-11-02'),('2017-11-03'),('2017-11-04'),('2017-11-05'),('2017-11-06'),('2017-11-07'),('2017-11-08'),('2017-11-09'),('2017-11-10'),('2017-11-11'),('2017-11-12'),('2017-11-13'),('2017-11-14'),('2017-11-15'),('2017-11-16'),('2017-11-17'),('2017-11-18'),('2017-11-19'),('2017-11-20'),('2017-11-21'),('2017-11-22'),('2017-11-23'),('2017-11-24'),('2017-11-25'),('2017-11-26'),('2017-11-27'),('2017-11-28'),('2017-11-29'),('2017-11-30'),('2017-12-01'),('2017-12-02'),('2017-12-03'),('2017-12-04'),('2017-12-05'),('2017-12-06'),('2017-12-07'),('2017-12-08'),('2017-12-09'),('2017-12-10'),('2017-12-11'),('2017-12-12'),('2017-12-13'),('2017-12-14'),('2017-12-15'),('2017-12-16'),('2017-12-17'),('2017-12-18'),('2017-12-19'),('2017-12-20'),('2017-12-21'),('2017-12-22'),('2017-12-23'),('2017-12-24'),('2017-12-25'),('2017-12-26'),('2017-12-27'),('2017-12-28'),('2017-12-29'),('2017-12-30'),('2017-12-31'),('2018-01-01'),('2018-01-02'),('2018-01-03'),('2018-01-04'),('2018-01-05'),('2018-01-06'),('2018-01-07'),('2018-01-08'),('2018-01-09'),('2018-01-10'),('2018-01-11'),('2018-01-12'),('2018-01-13'),('2018-01-14'),('2018-01-15'),('2018-01-16'),('2018-01-17'),('2018-01-18'),('2018-01-19'),('2018-01-20'),('2018-01-21'),('2018-01-22'),('2018-01-23'),('2018-01-24'),('2018-01-25'),('2018-01-26'),('2018-01-27'),('2018-01-28'),('2018-01-29'),('2018-01-30'),('2018-01-31'),('2018-02-01'),('2018-02-02'),('2018-02-03'),('2018-02-04'),('2018-02-05'),('2018-02-06'),('2018-02-07'),('2018-02-08'),('2018-02-09'),('2018-02-10'),('2018-02-11'),('2018-02-12'),('2018-02-13'),('2018-02-14'),('2018-02-15'),('2018-02-16'),('2018-02-17'),('2018-02-18'),('2018-02-19'),('2018-02-20'),('2018-02-21'),('2018-02-22'),('2018-02-23'),('2018-02-24'),('2018-02-25'),('2018-02-26'),('2018-02-27'),('2018-02-28'),('2018-03-01'),('2018-03-02'),('2018-03-03'),('2018-03-04'),('2018-03-05'),('2018-03-06'),('2018-03-07'),('2018-03-08'),('2018-03-09'),('2018-03-10'),('2018-03-11'),('2018-03-12'),('2018-03-13'),('2018-03-14'),('2018-03-15'),('2018-03-16'),('2018-03-17'),('2018-03-18'),('2018-03-19'),('2018-03-20'),('2018-03-21'),('2018-03-22'),('2018-03-23'),('2018-03-24'),('2018-03-25'),('2018-03-26'),('2018-03-27'),('2018-03-28'),('2018-03-29'),('2018-03-30'),('2018-03-31'),('2018-04-01'),('2018-04-02'),('2018-04-03'),('2018-04-04'),('2018-04-05'),('2018-04-06'),('2018-04-07'),('2018-04-08'),('2018-04-09'),('2018-04-10'),('2018-04-11'),('2018-04-12'),('2018-04-13'),('2018-04-14'),('2018-04-15'),('2018-04-16'),('2018-04-17'),('2018-04-18'),('2018-04-19'),('2018-04-20'),('2018-04-21'),('2018-04-22'),('2018-04-23'),('2018-04-24'),('2018-04-25'),('2018-04-26'),('2018-04-27'),('2018-04-28'),('2018-04-29'),('2018-04-30'),('2018-05-01'),('2018-05-02'),('2018-05-03'),('2018-05-04'),('2018-05-05'),('2018-05-06'),('2018-05-07'),('2018-05-08'),('2018-05-09'),('2018-05-10'),('2018-05-11'),('2018-05-12'),('2018-05-13'),('2018-05-14'),('2018-05-15'),('2018-05-16'),('2018-05-17'),('2018-05-18'),('2018-05-19'),('2018-05-20'),('2018-05-21'),('2018-05-22'),('2018-05-23'),('2018-05-24'),('2018-05-25'),('2018-05-26'),('2018-05-27'),('2018-05-28'),('2018-05-29'),('2018-05-30'),('2018-05-31'),('2018-06-01'),('2018-06-02'),('2018-06-03'),('2018-06-04'),('2018-06-05'),('2018-06-06'),('2018-06-07'),('2018-06-08'),('2018-06-09'),('2018-06-10'),('2018-06-11'),('2018-06-12'),('2018-06-13'),('2018-06-14'),('2018-06-15'),('2018-06-16'),('2018-06-17'),('2018-06-18'),('2018-06-19'),('2018-06-20'),('2018-06-21'),('2018-06-22'),('2018-06-23'),('2018-06-24'),('2018-06-25'),('2018-06-26'),('2018-06-27'),('2018-06-28'),('2018-06-29'),('2018-06-30'),('2018-07-01'),('2018-07-02'),('2018-07-03'),('2018-07-04'),('2018-07-05'),('2018-07-06'),('2018-07-07'),('2018-07-08'),('2018-07-09'),('2018-07-10'),('2018-07-11'),('2018-07-12'),('2018-07-13'),('2018-07-14'),('2018-07-15'),('2018-07-16'),('2018-07-17'),('2018-07-18'),('2018-07-19'),('2018-07-20'),('2018-07-21'),('2018-07-22'),('2018-07-23'),('2018-07-24'),('2018-07-25'),('2018-07-26'),('2018-07-27'),('2018-07-28'),('2018-07-29'),('2018-07-30'),('2018-07-31'),('2018-08-01'),('2018-08-02'),('2018-08-03'),('2018-08-04'),('2018-08-05'),('2018-08-06'),('2018-08-07'),('2018-08-08'),('2018-08-09'),('2018-08-10'),('2018-08-11'),('2018-08-12'),('2018-08-13'),('2018-08-14'),('2018-08-15'),('2018-08-16'),('2018-08-17'),('2018-08-18'),('2018-08-19'),('2018-08-20'),('2018-08-21'),('2018-08-22'),('2018-08-23'),('2018-08-24'),('2018-08-25'),('2018-08-26'),('2018-08-27'),('2018-08-28'),('2018-08-29'),('2018-08-30'),('2018-08-31'),('2018-09-01'),('2018-09-02'),('2018-09-03'),('2018-09-04'),('2018-09-05'),('2018-09-06'),('2018-09-07'),('2018-09-08'),('2018-09-09'),('2018-09-10'),('2018-09-11'),('2018-09-12'),('2018-09-13'),('2018-09-14'),('2018-09-15'),('2018-09-16'),('2018-09-17'),('2018-09-18'),('2018-09-19'),('2018-09-20'),('2018-09-21'),('2018-09-22'),('2018-09-23'),('2018-09-24'),('2018-09-25'),('2018-09-26'),('2018-09-27'),('2018-09-28'),('2018-09-29'),('2018-09-30'),('2018-10-01'),('2018-10-02'),('2018-10-03'),('2018-10-04'),('2018-10-05'),('2018-10-06'),('2018-10-07'),('2018-10-08'),('2018-10-09'),('2018-10-10'),('2018-10-11'),('2018-10-12'),('2018-10-13'),('2018-10-14'),('2018-10-15'),('2018-10-16'),('2018-10-17'),('2018-10-18'),('2018-10-19'),('2018-10-20'),('2018-10-21'),('2018-10-22'),('2018-10-23'),('2018-10-24'),('2018-10-25'),('2018-10-26'),('2018-10-27'),('2018-10-28'),('2018-10-29'),('2018-10-30'),('2018-10-31'),('2018-11-01'),('2018-11-02'),('2018-11-03'),('2018-11-04'),('2018-11-05'),('2018-11-06'),('2018-11-07'),('2018-11-08'),('2018-11-09'),('2018-11-10'),('2018-11-11'),('2018-11-12'),('2018-11-13'),('2018-11-14'),('2018-11-15'),('2018-11-16'),('2018-11-17'),('2018-11-18'),('2018-11-19'),('2018-11-20'),('2018-11-21'),('2018-11-22'),('2018-11-23'),('2018-11-24'),('2018-11-25'),('2018-11-26'),('2018-11-27'),('2018-11-28'),('2018-11-29'),('2018-11-30'),('2018-12-01'),('2018-12-02'),('2018-12-03'),('2018-12-04'),('2018-12-05'),('2018-12-06'),('2018-12-07'),('2018-12-08'),('2018-12-09'),('2018-12-10'),('2018-12-11'),('2018-12-12'),('2018-12-13'),('2018-12-14'),('2018-12-15'),('2018-12-16'),('2018-12-17'),('2018-12-18'),('2018-12-19'),('2018-12-20'),('2018-12-21'),('2018-12-22'),('2018-12-23'),('2018-12-24'),('2018-12-25'),('2018-12-26'),('2018-12-27'),('2018-12-28'),('2018-12-29'),('2018-12-30'),('2018-12-31'),('2019-01-01'),('2019-01-02'),('2019-01-03'),('2019-01-04'),('2019-01-05'),('2019-01-06'),('2019-01-07'),('2019-01-08'),('2019-01-09'),('2019-01-10'),('2019-01-11'),('2019-01-12'),('2019-01-13'),('2019-01-14'),('2019-01-15'),('2019-01-16'),('2019-01-17'),('2019-01-18'),('2019-01-19'),('2019-01-20'),('2019-01-21'),('2019-01-22'),('2019-01-23'),('2019-01-24'),('2019-01-25'),('2019-01-26'),('2019-01-27'),('2019-01-28'),('2019-01-29'),('2019-01-30'),('2019-01-31'),('2019-02-01'),('2019-02-02'),('2019-02-03'),('2019-02-04'),('2019-02-05'),('2019-02-06'),('2019-02-07'),('2019-02-08'),('2019-02-09'),('2019-02-10'),('2019-02-11'),('2019-02-12'),('2019-02-13'),('2019-02-14'),('2019-02-15'),('2019-02-16'),('2019-02-17'),('2019-02-18'),('2019-02-19'),('2019-02-20'),('2019-02-21'),('2019-02-22'),('2019-02-23'),('2019-02-24'),('2019-02-25'),('2019-02-26'),('2019-02-27'),('2019-02-28'),('2019-03-01'),('2019-03-02'),('2019-03-03'),('2019-03-04'),('2019-03-05'),('2019-03-06'),('2019-03-07'),('2019-03-08'),('2019-03-09'),('2019-03-10'),('2019-03-11'),('2019-03-12'),('2019-03-13'),('2019-03-14'),('2019-03-15'),('2019-03-16'),('2019-03-17'),('2019-03-18'),('2019-03-19'),('2019-03-20'),('2019-03-21'),('2019-03-22'),('2019-03-23'),('2019-03-24'),('2019-03-25'),('2019-03-26'),('2019-03-27'),('2019-03-28'),('2019-03-29'),('2019-03-30'),('2019-03-31'),('2019-04-01'),('2019-04-02'),('2019-04-03'),('2019-04-04'),('2019-04-05'),('2019-04-06'),('2019-04-07'),('2019-04-08'),('2019-04-09'),('2019-04-10'),('2019-04-11'),('2019-04-12'),('2019-04-13'),('2019-04-14'),('2019-04-15'),('2019-04-16'),('2019-04-17'),('2019-04-18'),('2019-04-19'),('2019-04-20'),('2019-04-21'),('2019-04-22'),('2019-04-23'),('2019-04-24'),('2019-04-25'),('2019-04-26'),('2019-04-27'),('2019-04-28'),('2019-04-29'),('2019-04-30'),('2019-05-01'),('2019-05-02'),('2019-05-03'),('2019-05-04'),('2019-05-05'),('2019-05-06'),('2019-05-07'),('2019-05-08'),('2019-05-09'),('2019-05-10'),('2019-05-11'),('2019-05-12'),('2019-05-13'),('2019-05-14'),('2019-05-15'),('2019-05-16'),('2019-05-17'),('2019-05-18'),('2019-05-19'),('2019-05-20'),('2019-05-21'),('2019-05-22'),('2019-05-23'),('2019-05-24'),('2019-05-25'),('2019-05-26'),('2019-05-27'),('2019-05-28'),('2019-05-29'),('2019-05-30'),('2019-05-31'),('2019-06-01'),('2019-06-02'),('2019-06-03'),('2019-06-04'),('2019-06-05'),('2019-06-06'),('2019-06-07'),('2019-06-08'),('2019-06-09'),('2019-06-10'),('2019-06-11'),('2019-06-12'),('2019-06-13'),('2019-06-14'),('2019-06-15'),('2019-06-16'),('2019-06-17'),('2019-06-18'),('2019-06-19'),('2019-06-20'),('2019-06-21'),('2019-06-22'),('2019-06-23'),('2019-06-24'),('2019-06-25'),('2019-06-26'),('2019-06-27'),('2019-06-28'),('2019-06-29'),('2019-06-30'),('2019-07-01'),('2019-07-02'),('2019-07-03'),('2019-07-04'),('2019-07-05'),('2019-07-06'),('2019-07-07'),('2019-07-08'),('2019-07-09'),('2019-07-10'),('2019-07-11'),('2019-07-12'),('2019-07-13'),('2019-07-14'),('2019-07-15'),('2019-07-16'),('2019-07-17'),('2019-07-18'),('2019-07-19'),('2019-07-20'),('2019-07-21'),('2019-07-22'),('2019-07-23'),('2019-07-24'),('2019-07-25'),('2019-07-26'),('2019-07-27'),('2019-07-28'),('2019-07-29'),('2019-07-30'),('2019-07-31'),('2019-08-01'),('2019-08-02'),('2019-08-03'),('2019-08-04'),('2019-08-05'),('2019-08-06'),('2019-08-07'),('2019-08-08'),('2019-08-09'),('2019-08-10'),('2019-08-11'),('2019-08-12'),('2019-08-13'),('2019-08-14'),('2019-08-15'),('2019-08-16'),('2019-08-17'),('2019-08-18'),('2019-08-19'),('2019-08-20'),('2019-08-21'),('2019-08-22'),('2019-08-23'),('2019-08-24'),('2019-08-25'),('2019-08-26'),('2019-08-27'),('2019-08-28'),('2019-08-29'),('2019-08-30'),('2019-08-31'),('2019-09-01'),('2019-09-02'),('2019-09-03'),('2019-09-04'),('2019-09-05'),('2019-09-06'),('2019-09-07'),('2019-09-08'),('2019-09-09'),('2019-09-10'),('2019-09-11'),('2019-09-12'),('2019-09-13'),('2019-09-14'),('2019-09-15'),('2019-09-16'),('2019-09-17'),('2019-09-18'),('2019-09-19'),('2019-09-20'),('2019-09-21'),('2019-09-22'),('2019-09-23'),('2019-09-24'),('2019-09-25'),('2019-09-26'),('2019-09-27'),('2019-09-28'),('2019-09-29'),('2019-09-30'),('2019-10-01'),('2019-10-02'),('2019-10-03'),('2019-10-04'),('2019-10-05'),('2019-10-06'),('2019-10-07'),('2019-10-08'),('2019-10-09'),('2019-10-10'),('2019-10-11'),('2019-10-12'),('2019-10-13'),('2019-10-14'),('2019-10-15'),('2019-10-16'),('2019-10-17'),('2019-10-18'),('2019-10-19'),('2019-10-20'),('2019-10-21'),('2019-10-22'),('2019-10-23'),('2019-10-24'),('2019-10-25'),('2019-10-26'),('2019-10-27'),('2019-10-28'),('2019-10-29'),('2019-10-30'),('2019-10-31'),('2019-11-01'),('2019-11-02'),('2019-11-03'),('2019-11-04'),('2019-11-05'),('2019-11-06'),('2019-11-07'),('2019-11-08'),('2019-11-09'),('2019-11-10'),('2019-11-11'),('2019-11-12'),('2019-11-13'),('2019-11-14'),('2019-11-15'),('2019-11-16'),('2019-11-17'),('2019-11-18'),('2019-11-19'),('2019-11-20'),('2019-11-21'),('2019-11-22'),('2019-11-23'),('2019-11-24'),('2019-11-25'),('2019-11-26'),('2019-11-27'),('2019-11-28'),('2019-11-29'),('2019-11-30'),('2019-12-01'),('2019-12-02'),('2019-12-03'),('2019-12-04'),('2019-12-05'),('2019-12-06'),('2019-12-07'),('2019-12-08'),('2019-12-09'),('2019-12-10'),('2019-12-11'),('2019-12-12'),('2019-12-13'),('2019-12-14'),('2019-12-15'),('2019-12-16'),('2019-12-17'),('2019-12-18'),('2019-12-19'),('2019-12-20'),('2019-12-21'),('2019-12-22'),('2019-12-23'),('2019-12-24'),('2019-12-25'),('2019-12-26'),('2019-12-27'),('2019-12-28'),('2019-12-29'),('2019-12-30'),('2019-12-31'),('2020-01-01'),('2020-01-02'),('2020-01-03'),('2020-01-04'),('2020-01-05'),('2020-01-06'),('2020-01-07'),('2020-01-08'),('2020-01-09'),('2020-01-10'),('2020-01-11'),('2020-01-12'),('2020-01-13'),('2020-01-14'),('2020-01-15'),('2020-01-16'),('2020-01-17'),('2020-01-18'),('2020-01-19'),('2020-01-20'),('2020-01-21'),('2020-01-22'),('2020-01-23'),('2020-01-24'),('2020-01-25'),('2020-01-26'),('2020-01-27'),('2020-01-28'),('2020-01-29'),('2020-01-30'),('2020-01-31'),('2020-02-01'),('2020-02-02'),('2020-02-03'),('2020-02-04'),('2020-02-05'),('2020-02-06'),('2020-02-07'),('2020-02-08'),('2020-02-09'),('2020-02-10'),('2020-02-11'),('2020-02-12'),('2020-02-13'),('2020-02-14'),('2020-02-15'),('2020-02-16'),('2020-02-17'),('2020-02-18'),('2020-02-19'),('2020-02-20'),('2020-02-21'),('2020-02-22'),('2020-02-23'),('2020-02-24'),('2020-02-25'),('2020-02-26'),('2020-02-27'),('2020-02-28'),('2020-02-29'),('2020-03-01'),('2020-03-02'),('2020-03-03'),('2020-03-04'),('2020-03-05'),('2020-03-06'),('2020-03-07'),('2020-03-08'),('2020-03-09'),('2020-03-10'),('2020-03-11'),('2020-03-12'),('2020-03-13'),('2020-03-14'),('2020-03-15'),('2020-03-16'),('2020-03-17'),('2020-03-18'),('2020-03-19'),('2020-03-20'),('2020-03-21'),('2020-03-22'),('2020-03-23'),('2020-03-24'),('2020-03-25'),('2020-03-26'),('2020-03-27'),('2020-03-28'),('2020-03-29'),('2020-03-30'),('2020-03-31'),('2020-04-01'),('2020-04-02'),('2020-04-03'),('2020-04-04'),('2020-04-05'),('2020-04-06'),('2020-04-07'),('2020-04-08'),('2020-04-09'),('2020-04-10'),('2020-04-11'),('2020-04-12'),('2020-04-13'),('2020-04-14'),('2020-04-15'),('2020-04-16'),('2020-04-17'),('2020-04-18'),('2020-04-19'),('2020-04-20'),('2020-04-21'),('2020-04-22'),('2020-04-23'),('2020-04-24'),('2020-04-25'),('2020-04-26'),('2020-04-27'),('2020-04-28'),('2020-04-29'),('2020-04-30'),('2020-05-01'),('2020-05-02'),('2020-05-03'),('2020-05-04'),('2020-05-05'),('2020-05-06'),('2020-05-07'),('2020-05-08'),('2020-05-09'),('2020-05-10'),('2020-05-11'),('2020-05-12'),('2020-05-13'),('2020-05-14'),('2020-05-15'),('2020-05-16'),('2020-05-17'),('2020-05-18'),('2020-05-19'),('2020-05-20'),('2020-05-21'),('2020-05-22'),('2020-05-23'),('2020-05-24'),('2020-05-25'),('2020-05-26'),('2020-05-27'),('2020-05-28'),('2020-05-29'),('2020-05-30'),('2020-05-31'),('2020-06-01'),('2020-06-02'),('2020-06-03'),('2020-06-04'),('2020-06-05'),('2020-06-06'),('2020-06-07'),('2020-06-08'),('2020-06-09'),('2020-06-10'),('2020-06-11'),('2020-06-12'),('2020-06-13'),('2020-06-14'),('2020-06-15'),('2020-06-16'),('2020-06-17'),('2020-06-18'),('2020-06-19'),('2020-06-20'),('2020-06-21'),('2020-06-22'),('2020-06-23'),('2020-06-24'),('2020-06-25'),('2020-06-26'),('2020-06-27'),('2020-06-28'),('2020-06-29'),('2020-06-30'),('2020-07-01'),('2020-07-02'),('2020-07-03'),('2020-07-04'),('2020-07-05'),('2020-07-06'),('2020-07-07'),('2020-07-08'),('2020-07-09'),('2020-07-10'),('2020-07-11'),('2020-07-12'),('2020-07-13'),('2020-07-14'),('2020-07-15'),('2020-07-16'),('2020-07-17'),('2020-07-18'),('2020-07-19'),('2020-07-20'),('2020-07-21'),('2020-07-22'),('2020-07-23'),('2020-07-24'),('2020-07-25'),('2020-07-26'),('2020-07-27'),('2020-07-28'),('2020-07-29'),('2020-07-30'),('2020-07-31'),('2020-08-01'),('2020-08-02'),('2020-08-03'),('2020-08-04'),('2020-08-05'),('2020-08-06'),('2020-08-07'),('2020-08-08'),('2020-08-09'),('2020-08-10'),('2020-08-11'),('2020-08-12'),('2020-08-13'),('2020-08-14'),('2020-08-15'),('2020-08-16'),('2020-08-17'),('2020-08-18'),('2020-08-19'),('2020-08-20'),('2020-08-21'),('2020-08-22'),('2020-08-23'),('2020-08-24'),('2020-08-25'),('2020-08-26'),('2020-08-27'),('2020-08-28'),('2020-08-29'),('2020-08-30'),('2020-08-31'),('2020-09-01'),('2020-09-02'),('2020-09-03'),('2020-09-04'),('2020-09-05'),('2020-09-06'),('2020-09-07'),('2020-09-08'),('2020-09-09'),('2020-09-10'),('2020-09-11'),('2020-09-12'),('2020-09-13'),('2020-09-14'),('2020-09-15'),('2020-09-16'),('2020-09-17'),('2020-09-18'),('2020-09-19'),('2020-09-20'),('2020-09-21'),('2020-09-22'),('2020-09-23'),('2020-09-24'),('2020-09-25'),('2020-09-26'),('2020-09-27'),('2020-09-28'),('2020-09-29'),('2020-09-30'),('2020-10-01'),('2020-10-02'),('2020-10-03'),('2020-10-04'),('2020-10-05'),('2020-10-06'),('2020-10-07'),('2020-10-08'),('2020-10-09'),('2020-10-10'),('2020-10-11'),('2020-10-12'),('2020-10-13'),('2020-10-14'),('2020-10-15'),('2020-10-16'),('2020-10-17'),('2020-10-18'),('2020-10-19'),('2020-10-20'),('2020-10-21'),('2020-10-22'),('2020-10-23'),('2020-10-24'),('2020-10-25'),('2020-10-26'),('2020-10-27'),('2020-10-28'),('2020-10-29'),('2020-10-30'),('2020-10-31'),('2020-11-01'),('2020-11-02'),('2020-11-03'),('2020-11-04'),('2020-11-05'),('2020-11-06'),('2020-11-07'),('2020-11-08'),('2020-11-09'),('2020-11-10'),('2020-11-11'),('2020-11-12'),('2020-11-13'),('2020-11-14'),('2020-11-15'),('2020-11-16'),('2020-11-17'),('2020-11-18'),('2020-11-19'),('2020-11-20'),('2020-11-21'),('2020-11-22'),('2020-11-23'),('2020-11-24'),('2020-11-25'),('2020-11-26'),('2020-11-27'),('2020-11-28'),('2020-11-29'),('2020-11-30'),('2020-12-01'),('2020-12-02'),('2020-12-03'),('2020-12-04'),('2020-12-05'),('2020-12-06'),('2020-12-07'),('2020-12-08'),('2020-12-09'),('2020-12-10'),('2020-12-11'),('2020-12-12'),('2020-12-13'),('2020-12-14'),('2020-12-15'),('2020-12-16'),('2020-12-17'),('2020-12-18'),('2020-12-19'),('2020-12-20'),('2020-12-21'),('2020-12-22'),('2020-12-23'),('2020-12-24'),('2020-12-25'),('2020-12-26'),('2020-12-27'),('2020-12-28'),('2020-12-29'),('2020-12-30'),('2020-12-31'),('2021-01-01'),('2021-01-02'),('2021-01-03'),('2021-01-04'),('2021-01-05'),('2021-01-06'),('2021-01-07'),('2021-01-08'),('2021-01-09'),('2021-01-10'),('2021-01-11'),('2021-01-12'),('2021-01-13'),('2021-01-14'),('2021-01-15'),('2021-01-16'),('2021-01-17'),('2021-01-18'),('2021-01-19'),('2021-01-20'),('2021-01-21'),('2021-01-22'),('2021-01-23'),('2021-01-24'),('2021-01-25'),('2021-01-26'),('2021-01-27'),('2021-01-28'),('2021-01-29'),('2021-01-30'),('2021-01-31'),('2021-02-01'),('2021-02-02'),('2021-02-03'),('2021-02-04'),('2021-02-05'),('2021-02-06'),('2021-02-07'),('2021-02-08'),('2021-02-09'),('2021-02-10'),('2021-02-11'),('2021-02-12'),('2021-02-13'),('2021-02-14'),('2021-02-15'),('2021-02-16'),('2021-02-17'),('2021-02-18'),('2021-02-19'),('2021-02-20'),('2021-02-21'),('2021-02-22'),('2021-02-23'),('2021-02-24'),('2021-02-25'),('2021-02-26'),('2021-02-27'),('2021-02-28'),('2021-03-01'),('2021-03-02'),('2021-03-03'),('2021-03-04'),('2021-03-05'),('2021-03-06'),('2021-03-07'),('2021-03-08'),('2021-03-09'),('2021-03-10'),('2021-03-11'),('2021-03-12'),('2021-03-13'),('2021-03-14'),('2021-03-15'),('2021-03-16'),('2021-03-17'),('2021-03-18'),('2021-03-19'),('2021-03-20'),('2021-03-21'),('2021-03-22'),('2021-03-23'),('2021-03-24'),('2021-03-25'),('2021-03-26'),('2021-03-27'),('2021-03-28'),('2021-03-29'),('2021-03-30'),('2021-03-31'),('2021-04-01'),('2021-04-02'),('2021-04-03'),('2021-04-04'),('2021-04-05'),('2021-04-06'),('2021-04-07'),('2021-04-08'),('2021-04-09'),('2021-04-10'),('2021-04-11'),('2021-04-12'),('2021-04-13'),('2021-04-14'),('2021-04-15'),('2021-04-16'),('2021-04-17'),('2021-04-18'),('2021-04-19'),('2021-04-20'),('2021-04-21'),('2021-04-22'),('2021-04-23'),('2021-04-24'),('2021-04-25'),('2021-04-26'),('2021-04-27'),('2021-04-28'),('2021-04-29'),('2021-04-30'),('2021-05-01'),('2021-05-02'),('2021-05-03'),('2021-05-04'),('2021-05-05'),('2021-05-06'),('2021-05-07'),('2021-05-08'),('2021-05-09'),('2021-05-10'),('2021-05-11'),('2021-05-12'),('2021-05-13'),('2021-05-14'),('2021-05-15'),('2021-05-16'),('2021-05-17'),('2021-05-18'),('2021-05-19'),('2021-05-20'),('2021-05-21'),('2021-05-22'),('2021-05-23'),('2021-05-24'),('2021-05-25'),('2021-05-26'),('2021-05-27'),('2021-05-28'),('2021-05-29'),('2021-05-30'),('2021-05-31'),('2021-06-01'),('2021-06-02'),('2021-06-03'),('2021-06-04'),('2021-06-05'),('2021-06-06'),('2021-06-07'),('2021-06-08'),('2021-06-09'),('2021-06-10'),('2021-06-11'),('2021-06-12'),('2021-06-13'),('2021-06-14'),('2021-06-15'),('2021-06-16'),('2021-06-17'),('2021-06-18'),('2021-06-19'),('2021-06-20'),('2021-06-21'),('2021-06-22'),('2021-06-23'),('2021-06-24'),('2021-06-25'),('2021-06-26'),('2021-06-27'),('2021-06-28'),('2021-06-29'),('2021-06-30'),('2021-07-01'),('2021-07-02'),('2021-07-03'),('2021-07-04'),('2021-07-05'),('2021-07-06'),('2021-07-07'),('2021-07-08'),('2021-07-09'),('2021-07-10'),('2021-07-11'),('2021-07-12'),('2021-07-13'),('2021-07-14'),('2021-07-15'),('2021-07-16'),('2021-07-17'),('2021-07-18'),('2021-07-19'),('2021-07-20'),('2021-07-21'),('2021-07-22'),('2021-07-23'),('2021-07-24'),('2021-07-25'),('2021-07-26'),('2021-07-27'),('2021-07-28'),('2021-07-29'),('2021-07-30'),('2021-07-31'),('2021-08-01'),('2021-08-02'),('2021-08-03'),('2021-08-04'),('2021-08-05'),('2021-08-06'),('2021-08-07'),('2021-08-08'),('2021-08-09'),('2021-08-10'),('2021-08-11'),('2021-08-12'),('2021-08-13'),('2021-08-14'),('2021-08-15'),('2021-08-16'),('2021-08-17'),('2021-08-18'),('2021-08-19'),('2021-08-20'),('2021-08-21'),('2021-08-22'),('2021-08-23'),('2021-08-24'),('2021-08-25'),('2021-08-26'),('2021-08-27'),('2021-08-28'),('2021-08-29'),('2021-08-30'),('2021-08-31'),('2021-09-01'),('2021-09-02'),('2021-09-03'),('2021-09-04'),('2021-09-05'),('2021-09-06'),('2021-09-07'),('2021-09-08'),('2021-09-09'),('2021-09-10'),('2021-09-11'),('2021-09-12'),('2021-09-13'),('2021-09-14'),('2021-09-15'),('2021-09-16'),('2021-09-17'),('2021-09-18'),('2021-09-19'),('2021-09-20'),('2021-09-21'),('2021-09-22'),('2021-09-23'),('2021-09-24'),('2021-09-25'),('2021-09-26'),('2021-09-27'),('2021-09-28'),('2021-09-29'),('2021-09-30'),('2021-10-01'),('2021-10-02'),('2021-10-03'),('2021-10-04'),('2021-10-05'),('2021-10-06'),('2021-10-07'),('2021-10-08'),('2021-10-09'),('2021-10-10'),('2021-10-11'),('2021-10-12'),('2021-10-13'),('2021-10-14'),('2021-10-15'),('2021-10-16'),('2021-10-17'),('2021-10-18'),('2021-10-19'),('2021-10-20'),('2021-10-21'),('2021-10-22'),('2021-10-23'),('2021-10-24'),('2021-10-25'),('2021-10-26'),('2021-10-27'),('2021-10-28'),('2021-10-29'),('2021-10-30'),('2021-10-31'),('2021-11-01'),('2021-11-02'),('2021-11-03'),('2021-11-04'),('2021-11-05'),('2021-11-06'),('2021-11-07'),('2021-11-08'),('2021-11-09'),('2021-11-10'),('2021-11-11'),('2021-11-12'),('2021-11-13'),('2021-11-14'),('2021-11-15'),('2021-11-16'),('2021-11-17'),('2021-11-18'),('2021-11-19'),('2021-11-20'),('2021-11-21'),('2021-11-22'),('2021-11-23'),('2021-11-24'),('2021-11-25'),('2021-11-26'),('2021-11-27'),('2021-11-28'),('2021-11-29'),('2021-11-30'),('2021-12-01'),('2021-12-02'),('2021-12-03'),('2021-12-04'),('2021-12-05'),('2021-12-06'),('2021-12-07'),('2021-12-08'),('2021-12-09'),('2021-12-10'),('2021-12-11'),('2021-12-12'),('2021-12-13'),('2021-12-14'),('2021-12-15'),('2021-12-16'),('2021-12-17'),('2021-12-18'),('2021-12-19'),('2021-12-20'),('2021-12-21'),('2021-12-22'),('2021-12-23'),('2021-12-24'),('2021-12-25'),('2021-12-26'),('2021-12-27'),('2021-12-28'),('2021-12-29'),('2021-12-30'),('2021-12-31'),('2022-01-01'),('2022-01-02'),('2022-01-03'),('2022-01-04'),('2022-01-05'),('2022-01-06'),('2022-01-07'),('2022-01-08'),('2022-01-09'),('2022-01-10'),('2022-01-11'),('2022-01-12'),('2022-01-13'),('2022-01-14'),('2022-01-15'),('2022-01-16'),('2022-01-17'),('2022-01-18'),('2022-01-19'),('2022-01-20'),('2022-01-21'),('2022-01-22'),('2022-01-23'),('2022-01-24'),('2022-01-25'),('2022-01-26'),('2022-01-27'),('2022-01-28'),('2022-01-29'),('2022-01-30'),('2022-01-31'),('2022-02-01'),('2022-02-02'),('2022-02-03'),('2022-02-04'),('2022-02-05'),('2022-02-06'),('2022-02-07'),('2022-02-08'),('2022-02-09'),('2022-02-10'),('2022-02-11'),('2022-02-12'),('2022-02-13'),('2022-02-14'),('2022-02-15'),('2022-02-16'),('2022-02-17'),('2022-02-18'),('2022-02-19'),('2022-02-20'),('2022-02-21'),('2022-02-22'),('2022-02-23'),('2022-02-24'),('2022-02-25'),('2022-02-26'),('2022-02-27'),('2022-02-28'),('2022-03-01'),('2022-03-02'),('2022-03-03'),('2022-03-04'),('2022-03-05'),('2022-03-06'),('2022-03-07'),('2022-03-08'),('2022-03-09'),('2022-03-10'),('2022-03-11'),('2022-03-12'),('2022-03-13'),('2022-03-14'),('2022-03-15'),('2022-03-16'),('2022-03-17'),('2022-03-18'),('2022-03-19'),('2022-03-20'),('2022-03-21'),('2022-03-22'),('2022-03-23'),('2022-03-24'),('2022-03-25'),('2022-03-26'),('2022-03-27'),('2022-03-28'),('2022-03-29'),('2022-03-30'),('2022-03-31'),('2022-04-01'),('2022-04-02'),('2022-04-03'),('2022-04-04'),('2022-04-05'),('2022-04-06'),('2022-04-07'),('2022-04-08'),('2022-04-09'),('2022-04-10'),('2022-04-11'),('2022-04-12'),('2022-04-13'),('2022-04-14'),('2022-04-15'),('2022-04-16'),('2022-04-17'),('2022-04-18'),('2022-04-19'),('2022-04-20'),('2022-04-21'),('2022-04-22'),('2022-04-23'),('2022-04-24'),('2022-04-25'),('2022-04-26'),('2022-04-27'),('2022-04-28'),('2022-04-29'),('2022-04-30'),('2022-05-01'),('2022-05-02'),('2022-05-03'),('2022-05-04'),('2022-05-05'),('2022-05-06'),('2022-05-07'),('2022-05-08'),('2022-05-09'),('2022-05-10'),('2022-05-11'),('2022-05-12'),('2022-05-13'),('2022-05-14'),('2022-05-15'),('2022-05-16'),('2022-05-17'),('2022-05-18'),('2022-05-19'),('2022-05-20'),('2022-05-21'),('2022-05-22'),('2022-05-23'),('2022-05-24'),('2022-05-25'),('2022-05-26'),('2022-05-27'),('2022-05-28'),('2022-05-29'),('2022-05-30'),('2022-05-31'),('2022-06-01'),('2022-06-02'),('2022-06-03'),('2022-06-04'),('2022-06-05'),('2022-06-06'),('2022-06-07'),('2022-06-08'),('2022-06-09'),('2022-06-10'),('2022-06-11'),('2022-06-12'),('2022-06-13'),('2022-06-14'),('2022-06-15'),('2022-06-16'),('2022-06-17'),('2022-06-18'),('2022-06-19'),('2022-06-20'),('2022-06-21'),('2022-06-22'),('2022-06-23'),('2022-06-24'),('2022-06-25'),('2022-06-26'),('2022-06-27'),('2022-06-28'),('2022-06-29'),('2022-06-30'),('2022-07-01'),('2022-07-02'),('2022-07-03'),('2022-07-04'),('2022-07-05'),('2022-07-06'),('2022-07-07'),('2022-07-08'),('2022-07-09'),('2022-07-10'),('2022-07-11'),('2022-07-12'),('2022-07-13'),('2022-07-14'),('2022-07-15'),('2022-07-16'),('2022-07-17'),('2022-07-18'),('2022-07-19'),('2022-07-20'),('2022-07-21'),('2022-07-22'),('2022-07-23'),('2022-07-24'),('2022-07-25'),('2022-07-26'),('2022-07-27'),('2022-07-28'),('2022-07-29'),('2022-07-30'),('2022-07-31'),('2022-08-01'),('2022-08-02'),('2022-08-03'),('2022-08-04'),('2022-08-05'),('2022-08-06'),('2022-08-07'),('2022-08-08'),('2022-08-09'),('2022-08-10'),('2022-08-11'),('2022-08-12'),('2022-08-13'),('2022-08-14'),('2022-08-15'),('2022-08-16'),('2022-08-17'),('2022-08-18'),('2022-08-19'),('2022-08-20'),('2022-08-21'),('2022-08-22'),('2022-08-23'),('2022-08-24'),('2022-08-25'),('2022-08-26'),('2022-08-27'),('2022-08-28'),('2022-08-29'),('2022-08-30'),('2022-08-31'),('2022-09-01'),('2022-09-02'),('2022-09-03'),('2022-09-04'),('2022-09-05'),('2022-09-06'),('2022-09-07'),('2022-09-08'),('2022-09-09'),('2022-09-10'),('2022-09-11'),('2022-09-12'),('2022-09-13'),('2022-09-14'),('2022-09-15'),('2022-09-16'),('2022-09-17'),('2022-09-18'),('2022-09-19'),('2022-09-20'),('2022-09-21'),('2022-09-22'),('2022-09-23'),('2022-09-24'),('2022-09-25'),('2022-09-26'),('2022-09-27'),('2022-09-28'),('2022-09-29'),('2022-09-30'),('2022-10-01'),('2022-10-02'),('2022-10-03'),('2022-10-04'),('2022-10-05'),('2022-10-06'),('2022-10-07'),('2022-10-08'),('2022-10-09'),('2022-10-10'),('2022-10-11'),('2022-10-12'),('2022-10-13'),('2022-10-14'),('2022-10-15'),('2022-10-16'),('2022-10-17'),('2022-10-18'),('2022-10-19'),('2022-10-20'),('2022-10-21'),('2022-10-22'),('2022-10-23'),('2022-10-24'),('2022-10-25'),('2022-10-26'),('2022-10-27'),('2022-10-28'),('2022-10-29'),('2022-10-30'),('2022-10-31'),('2022-11-01'),('2022-11-02'),('2022-11-03'),('2022-11-04'),('2022-11-05'),('2022-11-06'),('2022-11-07'),('2022-11-08'),('2022-11-09'),('2022-11-10'),('2022-11-11'),('2022-11-12'),('2022-11-13'),('2022-11-14'),('2022-11-15'),('2022-11-16'),('2022-11-17'),('2022-11-18'),('2022-11-19'),('2022-11-20'),('2022-11-21'),('2022-11-22'),('2022-11-23'),('2022-11-24'),('2022-11-25'),('2022-11-26'),('2022-11-27'),('2022-11-28'),('2022-11-29'),('2022-11-30'),('2022-12-01'),('2022-12-02'),('2022-12-03'),('2022-12-04'),('2022-12-05'),('2022-12-06'),('2022-12-07'),('2022-12-08'),('2022-12-09'),('2022-12-10'),('2022-12-11'),('2022-12-12'),('2022-12-13'),('2022-12-14'),('2022-12-15'),('2022-12-16'),('2022-12-17'),('2022-12-18'),('2022-12-19'),('2022-12-20'),('2022-12-21'),('2022-12-22'),('2022-12-23'),('2022-12-24'),('2022-12-25'),('2022-12-26'),('2022-12-27'),('2022-12-28'),('2022-12-29'),('2022-12-30'),('2022-12-31'),('2023-01-01'),('2023-01-02'),('2023-01-03'),('2023-01-04'),('2023-01-05'),('2023-01-06'),('2023-01-07'),('2023-01-08'),('2023-01-09'),('2023-01-10'),('2023-01-11'),('2023-01-12'),('2023-01-13'),('2023-01-14'),('2023-01-15'),('2023-01-16'),('2023-01-17'),('2023-01-18'),('2023-01-19'),('2023-01-20'),('2023-01-21'),('2023-01-22'),('2023-01-23'),('2023-01-24'),('2023-01-25'),('2023-01-26'),('2023-01-27'),('2023-01-28'),('2023-01-29'),('2023-01-30'),('2023-01-31'),('2023-02-01'),('2023-02-02'),('2023-02-03'),('2023-02-04'),('2023-02-05'),('2023-02-06'),('2023-02-07'),('2023-02-08'),('2023-02-09'),('2023-02-10'),('2023-02-11'),('2023-02-12'),('2023-02-13'),('2023-02-14'),('2023-02-15'),('2023-02-16'),('2023-02-17'),('2023-02-18'),('2023-02-19'),('2023-02-20'),('2023-02-21'),('2023-02-22'),('2023-02-23'),('2023-02-24'),('2023-02-25'),('2023-02-26'),('2023-02-27'),('2023-02-28'),('2023-03-01'),('2023-03-02'),('2023-03-03'),('2023-03-04'),('2023-03-05'),('2023-03-06'),('2023-03-07'),('2023-03-08'),('2023-03-09'),('2023-03-10'),('2023-03-11'),('2023-03-12'),('2023-03-13'),('2023-03-14'),('2023-03-15'),('2023-03-16'),('2023-03-17'),('2023-03-18'),('2023-03-19'),('2023-03-20'),('2023-03-21'),('2023-03-22'),('2023-03-23'),('2023-03-24'),('2023-03-25'),('2023-03-26'),('2023-03-27'),('2023-03-28'),('2023-03-29'),('2023-03-30'),('2023-03-31'),('2023-04-01'),('2023-04-02'),('2023-04-03'),('2023-04-04'),('2023-04-05'),('2023-04-06'),('2023-04-07'),('2023-04-08'),('2023-04-09'),('2023-04-10'),('2023-04-11'),('2023-04-12'),('2023-04-13'),('2023-04-14'),('2023-04-15'),('2023-04-16'),('2023-04-17'),('2023-04-18'),('2023-04-19'),('2023-04-20'),('2023-04-21'),('2023-04-22'),('2023-04-23'),('2023-04-24'),('2023-04-25'),('2023-04-26'),('2023-04-27'),('2023-04-28'),('2023-04-29'),('2023-04-30'),('2023-05-01'),('2023-05-02'),('2023-05-03'),('2023-05-04'),('2023-05-05'),('2023-05-06'),('2023-05-07'),('2023-05-08'),('2023-05-09'),('2023-05-10'),('2023-05-11'),('2023-05-12'),('2023-05-13'),('2023-05-14'),('2023-05-15'),('2023-05-16'),('2023-05-17'),('2023-05-18'),('2023-05-19'),('2023-05-20'),('2023-05-21'),('2023-05-22'),('2023-05-23'),('2023-05-24'),('2023-05-25'),('2023-05-26'),('2023-05-27'),('2023-05-28'),('2023-05-29'),('2023-05-30'),('2023-05-31'),('2023-06-01'),('2023-06-02'),('2023-06-03'),('2023-06-04'),('2023-06-05'),('2023-06-06'),('2023-06-07'),('2023-06-08'),('2023-06-09'),('2023-06-10'),('2023-06-11'),('2023-06-12'),('2023-06-13'),('2023-06-14'),('2023-06-15'),('2023-06-16'),('2023-06-17'),('2023-06-18'),('2023-06-19'),('2023-06-20'),('2023-06-21'),('2023-06-22'),('2023-06-23'),('2023-06-24'),('2023-06-25'),('2023-06-26'),('2023-06-27'),('2023-06-28'),('2023-06-29'),('2023-06-30'),('2023-07-01'),('2023-07-02'),('2023-07-03'),('2023-07-04'),('2023-07-05'),('2023-07-06'),('2023-07-07'),('2023-07-08'),('2023-07-09'),('2023-07-10'),('2023-07-11'),('2023-07-12'),('2023-07-13'),('2023-07-14'),('2023-07-15'),('2023-07-16'),('2023-07-17'),('2023-07-18'),('2023-07-19'),('2023-07-20'),('2023-07-21'),('2023-07-22'),('2023-07-23'),('2023-07-24'),('2023-07-25'),('2023-07-26'),('2023-07-27'),('2023-07-28'),('2023-07-29'),('2023-07-30'),('2023-07-31'),('2023-08-01'),('2023-08-02'),('2023-08-03'),('2023-08-04'),('2023-08-05'),('2023-08-06'),('2023-08-07'),('2023-08-08'),('2023-08-09'),('2023-08-10'),('2023-08-11'),('2023-08-12'),('2023-08-13'),('2023-08-14'),('2023-08-15'),('2023-08-16'),('2023-08-17'),('2023-08-18'),('2023-08-19'),('2023-08-20'),('2023-08-21'),('2023-08-22'),('2023-08-23'),('2023-08-24'),('2023-08-25'),('2023-08-26'),('2023-08-27'),('2023-08-28'),('2023-08-29'),('2023-08-30'),('2023-08-31'),('2023-09-01'),('2023-09-02'),('2023-09-03'),('2023-09-04'),('2023-09-05'),('2023-09-06'),('2023-09-07'),('2023-09-08'),('2023-09-09'),('2023-09-10'),('2023-09-11'),('2023-09-12'),('2023-09-13'),('2023-09-14'),('2023-09-15'),('2023-09-16'),('2023-09-17'),('2023-09-18'),('2023-09-19'),('2023-09-20'),('2023-09-21'),('2023-09-22'),('2023-09-23'),('2023-09-24'),('2023-09-25'),('2023-09-26'),('2023-09-27'),('2023-09-28'),('2023-09-29'),('2023-09-30'),('2023-10-01'),('2023-10-02'),('2023-10-03'),('2023-10-04'),('2023-10-05'),('2023-10-06'),('2023-10-07'),('2023-10-08'),('2023-10-09'),('2023-10-10'),('2023-10-11'),('2023-10-12'),('2023-10-13'),('2023-10-14'),('2023-10-15'),('2023-10-16'),('2023-10-17'),('2023-10-18'),('2023-10-19'),('2023-10-20'),('2023-10-21'),('2023-10-22'),('2023-10-23'),('2023-10-24'),('2023-10-25'),('2023-10-26'),('2023-10-27'),('2023-10-28'),('2023-10-29'),('2023-10-30'),('2023-10-31'),('2023-11-01'),('2023-11-02'),('2023-11-03'),('2023-11-04'),('2023-11-05'),('2023-11-06'),('2023-11-07'),('2023-11-08'),('2023-11-09'),('2023-11-10'),('2023-11-11'),('2023-11-12'),('2023-11-13'),('2023-11-14'),('2023-11-15'),('2023-11-16'),('2023-11-17'),('2023-11-18'),('2023-11-19'),('2023-11-20'),('2023-11-21'),('2023-11-22'),('2023-11-23'),('2023-11-24'),('2023-11-25'),('2023-11-26'),('2023-11-27'),('2023-11-28'),('2023-11-29'),('2023-11-30'),('2023-12-01'),('2023-12-02'),('2023-12-03'),('2023-12-04'),('2023-12-05'),('2023-12-06'),('2023-12-07'),('2023-12-08'),('2023-12-09'),('2023-12-10'),('2023-12-11'),('2023-12-12'),('2023-12-13'),('2023-12-14'),('2023-12-15'),('2023-12-16'),('2023-12-17'),('2023-12-18'),('2023-12-19'),('2023-12-20'),('2023-12-21'),('2023-12-22'),('2023-12-23'),('2023-12-24'),('2023-12-25'),('2023-12-26'),('2023-12-27'),('2023-12-28'),('2023-12-29'),('2023-12-30'),('2023-12-31'),('2024-01-01'),('2024-01-02'),('2024-01-03'),('2024-01-04'),('2024-01-05'),('2024-01-06'),('2024-01-07'),('2024-01-08'),('2024-01-09'),('2024-01-10'),('2024-01-11'),('2024-01-12'),('2024-01-13'),('2024-01-14'),('2024-01-15'),('2024-01-16'),('2024-01-17'),('2024-01-18'),('2024-01-19'),('2024-01-20'),('2024-01-21'),('2024-01-22'),('2024-01-23'),('2024-01-24'),('2024-01-25'),('2024-01-26'),('2024-01-27'),('2024-01-28'),('2024-01-29'),('2024-01-30'),('2024-01-31'),('2024-02-01'),('2024-02-02'),('2024-02-03'),('2024-02-04'),('2024-02-05'),('2024-02-06'),('2024-02-07'),('2024-02-08'),('2024-02-09'),('2024-02-10'),('2024-02-11'),('2024-02-12'),('2024-02-13'),('2024-02-14'),('2024-02-15'),('2024-02-16'),('2024-02-17'),('2024-02-18'),('2024-02-19'),('2024-02-20'),('2024-02-21'),('2024-02-22'),('2024-02-23'),('2024-02-24'),('2024-02-25'),('2024-02-26'),('2024-02-27'),('2024-02-28'),('2024-02-29'),('2024-03-01'),('2024-03-02'),('2024-03-03'),('2024-03-04'),('2024-03-05'),('2024-03-06'),('2024-03-07'),('2024-03-08'),('2024-03-09'),('2024-03-10'),('2024-03-11'),('2024-03-12'),('2024-03-13'),('2024-03-14'),('2024-03-15'),('2024-03-16'),('2024-03-17'),('2024-03-18'),('2024-03-19'),('2024-03-20'),('2024-03-21'),('2024-03-22'),('2024-03-23'),('2024-03-24'),('2024-03-25'),('2024-03-26'),('2024-03-27'),('2024-03-28'),('2024-03-29'),('2024-03-30'),('2024-03-31'),('2024-04-01'),('2024-04-02'),('2024-04-03'),('2024-04-04'),('2024-04-05'),('2024-04-06'),('2024-04-07'),('2024-04-08'),('2024-04-09'),('2024-04-10'),('2024-04-11'),('2024-04-12'),('2024-04-13'),('2024-04-14'),('2024-04-15'),('2024-04-16'),('2024-04-17'),('2024-04-18'),('2024-04-19'),('2024-04-20'),('2024-04-21'),('2024-04-22'),('2024-04-23'),('2024-04-24'),('2024-04-25'),('2024-04-26'),('2024-04-27'),('2024-04-28'),('2024-04-29'),('2024-04-30'),('2024-05-01'),('2024-05-02'),('2024-05-03'),('2024-05-04'),('2024-05-05'),('2024-05-06'),('2024-05-07'),('2024-05-08'),('2024-05-09'),('2024-05-10'),('2024-05-11'),('2024-05-12'),('2024-05-13'),('2024-05-14'),('2024-05-15'),('2024-05-16'),('2024-05-17'),('2024-05-18'),('2024-05-19'),('2024-05-20'),('2024-05-21'),('2024-05-22'),('2024-05-23'),('2024-05-24'),('2024-05-25'),('2024-05-26'),('2024-05-27'),('2024-05-28'),('2024-05-29'),('2024-05-30'),('2024-05-31'),('2024-06-01'),('2024-06-02'),('2024-06-03'),('2024-06-04'),('2024-06-05'),('2024-06-06'),('2024-06-07'),('2024-06-08'),('2024-06-09'),('2024-06-10'),('2024-06-11'),('2024-06-12'),('2024-06-13'),('2024-06-14'),('2024-06-15'),('2024-06-16'),('2024-06-17'),('2024-06-18'),('2024-06-19'),('2024-06-20'),('2024-06-21'),('2024-06-22'),('2024-06-23'),('2024-06-24'),('2024-06-25'),('2024-06-26'),('2024-06-27'),('2024-06-28'),('2024-06-29'),('2024-06-30'),('2024-07-01'),('2024-07-02'),('2024-07-03'),('2024-07-04'),('2024-07-05'),('2024-07-06'),('2024-07-07'),('2024-07-08'),('2024-07-09'),('2024-07-10'),('2024-07-11'),('2024-07-12'),('2024-07-13'),('2024-07-14'),('2024-07-15'),('2024-07-16'),('2024-07-17'),('2024-07-18'),('2024-07-19'),('2024-07-20'),('2024-07-21'),('2024-07-22'),('2024-07-23'),('2024-07-24'),('2024-07-25'),('2024-07-26'),('2024-07-27'),('2024-07-28'),('2024-07-29'),('2024-07-30'),('2024-07-31'),('2024-08-01'),('2024-08-02'),('2024-08-03'),('2024-08-04'),('2024-08-05'),('2024-08-06'),('2024-08-07'),('2024-08-08'),('2024-08-09'),('2024-08-10'),('2024-08-11'),('2024-08-12'),('2024-08-13'),('2024-08-14'),('2024-08-15'),('2024-08-16'),('2024-08-17'),('2024-08-18'),('2024-08-19'),('2024-08-20'),('2024-08-21'),('2024-08-22'),('2024-08-23'),('2024-08-24'),('2024-08-25'),('2024-08-26'),('2024-08-27'),('2024-08-28'),('2024-08-29'),('2024-08-30'),('2024-08-31'),('2024-09-01'),('2024-09-02'),('2024-09-03'),('2024-09-04'),('2024-09-05'),('2024-09-06'),('2024-09-07'),('2024-09-08'),('2024-09-09'),('2024-09-10'),('2024-09-11'),('2024-09-12'),('2024-09-13'),('2024-09-14'),('2024-09-15'),('2024-09-16'),('2024-09-17'),('2024-09-18'),('2024-09-19'),('2024-09-20'),('2024-09-21'),('2024-09-22'),('2024-09-23'),('2024-09-24'),('2024-09-25'),('2024-09-26'),('2024-09-27'),('2024-09-28'),('2024-09-29'),('2024-09-30'),('2024-10-01'),('2024-10-02'),('2024-10-03'),('2024-10-04'),('2024-10-05'),('2024-10-06'),('2024-10-07'),('2024-10-08'),('2024-10-09'),('2024-10-10'),('2024-10-11'),('2024-10-12'),('2024-10-13'),('2024-10-14'),('2024-10-15'),('2024-10-16'),('2024-10-17'),('2024-10-18'),('2024-10-19'),('2024-10-20'),('2024-10-21'),('2024-10-22'),('2024-10-23'),('2024-10-24'),('2024-10-25'),('2024-10-26'),('2024-10-27'),('2024-10-28'),('2024-10-29'),('2024-10-30'),('2024-10-31'),('2024-11-01'),('2024-11-02'),('2024-11-03'),('2024-11-04'),('2024-11-05'),('2024-11-06'),('2024-11-07'),('2024-11-08'),('2024-11-09'),('2024-11-10'),('2024-11-11'),('2024-11-12'),('2024-11-13'),('2024-11-14'),('2024-11-15'),('2024-11-16'),('2024-11-17'),('2024-11-18'),('2024-11-19'),('2024-11-20'),('2024-11-21'),('2024-11-22'),('2024-11-23'),('2024-11-24'),('2024-11-25'),('2024-11-26'),('2024-11-27'),('2024-11-28'),('2024-11-29'),('2024-11-30'),('2024-12-01'),('2024-12-02'),('2024-12-03'),('2024-12-04'),('2024-12-05'),('2024-12-06'),('2024-12-07'),('2024-12-08'),('2024-12-09'),('2024-12-10'),('2024-12-11'),('2024-12-12'),('2024-12-13'),('2024-12-14'),('2024-12-15'),('2024-12-16'),('2024-12-17'),('2024-12-18'),('2024-12-19'),('2024-12-20'),('2024-12-21'),('2024-12-22'),('2024-12-23'),('2024-12-24'),('2024-12-25'),('2024-12-26'),('2024-12-27'),('2024-12-28'),('2024-12-29'),('2024-12-30'),('2024-12-31'),('2025-01-01'),('2025-01-02'),('2025-01-03'),('2025-01-04'),('2025-01-05'),('2025-01-06'),('2025-01-07'),('2025-01-08'),('2025-01-09'),('2025-01-10'),('2025-01-11'),('2025-01-12'),('2025-01-13'),('2025-01-14'),('2025-01-15'),('2025-01-16'),('2025-01-17'),('2025-01-18'),('2025-01-19'),('2025-01-20'),('2025-01-21'),('2025-01-22'),('2025-01-23'),('2025-01-24'),('2025-01-25'),('2025-01-26'),('2025-01-27'),('2025-01-28'),('2025-01-29'),('2025-01-30'),('2025-01-31'),('2025-02-01'),('2025-02-02'),('2025-02-03'),('2025-02-04'),('2025-02-05'),('2025-02-06'),('2025-02-07'),('2025-02-08'),('2025-02-09'),('2025-02-10'),('2025-02-11'),('2025-02-12'),('2025-02-13'),('2025-02-14'),('2025-02-15'),('2025-02-16'),('2025-02-17'),('2025-02-18'),('2025-02-19'),('2025-02-20'),('2025-02-21'),('2025-02-22'),('2025-02-23'),('2025-02-24'),('2025-02-25'),('2025-02-26'),('2025-02-27'),('2025-02-28'),('2025-03-01'),('2025-03-02'),('2025-03-03'),('2025-03-04'),('2025-03-05'),('2025-03-06'),('2025-03-07'),('2025-03-08'),('2025-03-09'),('2025-03-10'),('2025-03-11'),('2025-03-12'),('2025-03-13'),('2025-03-14'),('2025-03-15'),('2025-03-16'),('2025-03-17'),('2025-03-18'),('2025-03-19'),('2025-03-20'),('2025-03-21'),('2025-03-22'),('2025-03-23'),('2025-03-24'),('2025-03-25'),('2025-03-26'),('2025-03-27'),('2025-03-28'),('2025-03-29'),('2025-03-30'),('2025-03-31'),('2025-04-01'),('2025-04-02'),('2025-04-03'),('2025-04-04'),('2025-04-05'),('2025-04-06'),('2025-04-07'),('2025-04-08'),('2025-04-09'),('2025-04-10'),('2025-04-11'),('2025-04-12'),('2025-04-13'),('2025-04-14'),('2025-04-15'),('2025-04-16'),('2025-04-17'),('2025-04-18'),('2025-04-19'),('2025-04-20'),('2025-04-21'),('2025-04-22'),('2025-04-23'),('2025-04-24'),('2025-04-25'),('2025-04-26'),('2025-04-27'),('2025-04-28'),('2025-04-29'),('2025-04-30'),('2025-05-01'),('2025-05-02'),('2025-05-03'),('2025-05-04'),('2025-05-05'),('2025-05-06'),('2025-05-07'),('2025-05-08'),('2025-05-09'),('2025-05-10'),('2025-05-11'),('2025-05-12'),('2025-05-13'),('2025-05-14'),('2025-05-15'),('2025-05-16'),('2025-05-17'),('2025-05-18'),('2025-05-19'),('2025-05-20'),('2025-05-21'),('2025-05-22'),('2025-05-23'),('2025-05-24'),('2025-05-25'),('2025-05-26'),('2025-05-27'),('2025-05-28'),('2025-05-29'),('2025-05-30'),('2025-05-31'),('2025-06-01'),('2025-06-02'),('2025-06-03'),('2025-06-04'),('2025-06-05'),('2025-06-06'),('2025-06-07'),('2025-06-08'),('2025-06-09'),('2025-06-10'),('2025-06-11'),('2025-06-12'),('2025-06-13'),('2025-06-14'),('2025-06-15'),('2025-06-16'),('2025-06-17'),('2025-06-18'),('2025-06-19'),('2025-06-20'),('2025-06-21'),('2025-06-22'),('2025-06-23'),('2025-06-24'),('2025-06-25'),('2025-06-26'),('2025-06-27'),('2025-06-28'),('2025-06-29'),('2025-06-30'),('2025-07-01'),('2025-07-02'),('2025-07-03'),('2025-07-04'),('2025-07-05'),('2025-07-06'),('2025-07-07'),('2025-07-08'),('2025-07-09'),('2025-07-10'),('2025-07-11'),('2025-07-12'),('2025-07-13'),('2025-07-14'),('2025-07-15'),('2025-07-16'),('2025-07-17'),('2025-07-18'),('2025-07-19'),('2025-07-20'),('2025-07-21'),('2025-07-22'),('2025-07-23'),('2025-07-24'),('2025-07-25'),('2025-07-26'),('2025-07-27'),('2025-07-28'),('2025-07-29'),('2025-07-30'),('2025-07-31'),('2025-08-01'),('2025-08-02'),('2025-08-03'),('2025-08-04'),('2025-08-05'),('2025-08-06'),('2025-08-07'),('2025-08-08'),('2025-08-09'),('2025-08-10'),('2025-08-11'),('2025-08-12'),('2025-08-13'),('2025-08-14'),('2025-08-15'),('2025-08-16'),('2025-08-17'),('2025-08-18'),('2025-08-19'),('2025-08-20'),('2025-08-21'),('2025-08-22'),('2025-08-23'),('2025-08-24'),('2025-08-25'),('2025-08-26'),('2025-08-27'),('2025-08-28'),('2025-08-29'),('2025-08-30'),('2025-08-31'),('2025-09-01'),('2025-09-02'),('2025-09-03'),('2025-09-04'),('2025-09-05'),('2025-09-06'),('2025-09-07'),('2025-09-08'),('2025-09-09'),('2025-09-10'),('2025-09-11'),('2025-09-12'),('2025-09-13'),('2025-09-14'),('2025-09-15'),('2025-09-16'),('2025-09-17'),('2025-09-18'),('2025-09-19'),('2025-09-20'),('2025-09-21'),('2025-09-22'),('2025-09-23'),('2025-09-24'),('2025-09-25'),('2025-09-26'),('2025-09-27'),('2025-09-28'),('2025-09-29'),('2025-09-30'),('2025-10-01'),('2025-10-02'),('2025-10-03'),('2025-10-04'),('2025-10-05'),('2025-10-06'),('2025-10-07'),('2025-10-08'),('2025-10-09'),('2025-10-10'),('2025-10-11'),('2025-10-12'),('2025-10-13'),('2025-10-14'),('2025-10-15'),('2025-10-16'),('2025-10-17'),('2025-10-18'),('2025-10-19'),('2025-10-20'),('2025-10-21'),('2025-10-22'),('2025-10-23'),('2025-10-24'),('2025-10-25'),('2025-10-26'),('2025-10-27'),('2025-10-28'),('2025-10-29'),('2025-10-30'),('2025-10-31'),('2025-11-01'),('2025-11-02'),('2025-11-03'),('2025-11-04'),('2025-11-05'),('2025-11-06'),('2025-11-07'),('2025-11-08'),('2025-11-09'),('2025-11-10'),('2025-11-11'),('2025-11-12'),('2025-11-13'),('2025-11-14'),('2025-11-15'),('2025-11-16'),('2025-11-17'),('2025-11-18'),('2025-11-19'),('2025-11-20'),('2025-11-21'),('2025-11-22'),('2025-11-23'),('2025-11-24'),('2025-11-25'),('2025-11-26'),('2025-11-27'),('2025-11-28'),('2025-11-29'),('2025-11-30'),('2025-12-01'),('2025-12-02'),('2025-12-03'),('2025-12-04'),('2025-12-05'),('2025-12-06'),('2025-12-07'),('2025-12-08'),('2025-12-09'),('2025-12-10'),('2025-12-11'),('2025-12-12'),('2025-12-13'),('2025-12-14'),('2025-12-15'),('2025-12-16'),('2025-12-17'),('2025-12-18'),('2025-12-19'),('2025-12-20'),('2025-12-21'),('2025-12-22'),('2025-12-23'),('2025-12-24'),('2025-12-25'),('2025-12-26'),('2025-12-27'),('2025-12-28'),('2025-12-29'),('2025-12-30'),('2025-12-31'),('2026-01-01'),('2026-01-02'),('2026-01-03'),('2026-01-04'),('2026-01-05'),('2026-01-06'),('2026-01-07'),('2026-01-08'),('2026-01-09'),('2026-01-10'),('2026-01-11'),('2026-01-12'),('2026-01-13'),('2026-01-14'),('2026-01-15'),('2026-01-16'),('2026-01-17'),('2026-01-18'),('2026-01-19'),('2026-01-20'),('2026-01-21'),('2026-01-22'),('2026-01-23'),('2026-01-24'),('2026-01-25'),('2026-01-26'),('2026-01-27'),('2026-01-28'),('2026-01-29'),('2026-01-30'),('2026-01-31'),('2026-02-01'),('2026-02-02'),('2026-02-03'),('2026-02-04'),('2026-02-05'),('2026-02-06'),('2026-02-07'),('2026-02-08'),('2026-02-09'),('2026-02-10'),('2026-02-11'),('2026-02-12'),('2026-02-13'),('2026-02-14'),('2026-02-15'),('2026-02-16'),('2026-02-17'),('2026-02-18'),('2026-02-19'),('2026-02-20'),('2026-02-21'),('2026-02-22'),('2026-02-23'),('2026-02-24'),('2026-02-25'),('2026-02-26'),('2026-02-27'),('2026-02-28'),('2026-03-01'),('2026-03-02'),('2026-03-03'),('2026-03-04'),('2026-03-05'),('2026-03-06'),('2026-03-07'),('2026-03-08'),('2026-03-09'),('2026-03-10'),('2026-03-11'),('2026-03-12'),('2026-03-13'),('2026-03-14'),('2026-03-15'),('2026-03-16'),('2026-03-17'),('2026-03-18'),('2026-03-19'),('2026-03-20'),('2026-03-21'),('2026-03-22'),('2026-03-23'),('2026-03-24'),('2026-03-25'),('2026-03-26'),('2026-03-27'),('2026-03-28'),('2026-03-29'),('2026-03-30'),('2026-03-31'),('2026-04-01'),('2026-04-02'),('2026-04-03'),('2026-04-04'),('2026-04-05'),('2026-04-06'),('2026-04-07'),('2026-04-08'),('2026-04-09'),('2026-04-10'),('2026-04-11'),('2026-04-12'),('2026-04-13'),('2026-04-14'),('2026-04-15'),('2026-04-16'),('2026-04-17'),('2026-04-18'),('2026-04-19'),('2026-04-20'),('2026-04-21'),('2026-04-22'),('2026-04-23'),('2026-04-24'),('2026-04-25'),('2026-04-26'),('2026-04-27'),('2026-04-28'),('2026-04-29'),('2026-04-30'),('2026-05-01'),('2026-05-02'),('2026-05-03'),('2026-05-04'),('2026-05-05'),('2026-05-06'),('2026-05-07'),('2026-05-08'),('2026-05-09'),('2026-05-10'),('2026-05-11'),('2026-05-12'),('2026-05-13'),('2026-05-14'),('2026-05-15'),('2026-05-16'),('2026-05-17'),('2026-05-18'),('2026-05-19'),('2026-05-20'),('2026-05-21'),('2026-05-22'),('2026-05-23'),('2026-05-24'),('2026-05-25'),('2026-05-26'),('2026-05-27'),('2026-05-28'),('2026-05-29'),('2026-05-30'),('2026-05-31'),('2026-06-01'),('2026-06-02'),('2026-06-03'),('2026-06-04'),('2026-06-05'),('2026-06-06'),('2026-06-07'),('2026-06-08'),('2026-06-09'),('2026-06-10'),('2026-06-11'),('2026-06-12'),('2026-06-13'),('2026-06-14'),('2026-06-15'),('2026-06-16'),('2026-06-17'),('2026-06-18'),('2026-06-19'),('2026-06-20'),('2026-06-21'),('2026-06-22'),('2026-06-23'),('2026-06-24'),('2026-06-25'),('2026-06-26'),('2026-06-27'),('2026-06-28'),('2026-06-29'),('2026-06-30'),('2026-07-01'),('2026-07-02'),('2026-07-03'),('2026-07-04'),('2026-07-05'),('2026-07-06'),('2026-07-07'),('2026-07-08'),('2026-07-09'),('2026-07-10'),('2026-07-11'),('2026-07-12'),('2026-07-13'),('2026-07-14'),('2026-07-15'),('2026-07-16'),('2026-07-17'),('2026-07-18'),('2026-07-19'),('2026-07-20'),('2026-07-21'),('2026-07-22'),('2026-07-23'),('2026-07-24'),('2026-07-25'),('2026-07-26'),('2026-07-27'),('2026-07-28'),('2026-07-29'),('2026-07-30'),('2026-07-31'),('2026-08-01'),('2026-08-02'),('2026-08-03'),('2026-08-04'),('2026-08-05'),('2026-08-06'),('2026-08-07'),('2026-08-08'),('2026-08-09'),('2026-08-10'),('2026-08-11'),('2026-08-12'),('2026-08-13'),('2026-08-14'),('2026-08-15'),('2026-08-16'),('2026-08-17'),('2026-08-18'),('2026-08-19'),('2026-08-20'),('2026-08-21'),('2026-08-22'),('2026-08-23'),('2026-08-24'),('2026-08-25'),('2026-08-26'),('2026-08-27'),('2026-08-28'),('2026-08-29'),('2026-08-30'),('2026-08-31'),('2026-09-01'),('2026-09-02'),('2026-09-03'),('2026-09-04'),('2026-09-05'),('2026-09-06'),('2026-09-07'),('2026-09-08'),('2026-09-09'),('2026-09-10'),('2026-09-11'),('2026-09-12'),('2026-09-13'),('2026-09-14'),('2026-09-15'),('2026-09-16'),('2026-09-17'),('2026-09-18'),('2026-09-19'),('2026-09-20'),('2026-09-21'),('2026-09-22'),('2026-09-23'),('2026-09-24'),('2026-09-25'),('2026-09-26'),('2026-09-27'),('2026-09-28'),('2026-09-29'),('2026-09-30'),('2026-10-01'),('2026-10-02'),('2026-10-03'),('2026-10-04'),('2026-10-05'),('2026-10-06'),('2026-10-07'),('2026-10-08'),('2026-10-09'),('2026-10-10'),('2026-10-11'),('2026-10-12'),('2026-10-13'),('2026-10-14'),('2026-10-15'),('2026-10-16'),('2026-10-17'),('2026-10-18'),('2026-10-19'),('2026-10-20'),('2026-10-21'),('2026-10-22'),('2026-10-23'),('2026-10-24'),('2026-10-25'),('2026-10-26'),('2026-10-27'),('2026-10-28'),('2026-10-29'),('2026-10-30'),('2026-10-31'),('2026-11-01'),('2026-11-02'),('2026-11-03'),('2026-11-04'),('2026-11-05'),('2026-11-06'),('2026-11-07'),('2026-11-08'),('2026-11-09'),('2026-11-10'),('2026-11-11'),('2026-11-12'),('2026-11-13'),('2026-11-14'),('2026-11-15'),('2026-11-16'),('2026-11-17'),('2026-11-18'),('2026-11-19'),('2026-11-20'),('2026-11-21'),('2026-11-22'),('2026-11-23'),('2026-11-24'),('2026-11-25'),('2026-11-26'),('2026-11-27'),('2026-11-28'),('2026-11-29'),('2026-11-30'),('2026-12-01'),('2026-12-02'),('2026-12-03'),('2026-12-04'),('2026-12-05'),('2026-12-06'),('2026-12-07'),('2026-12-08'),('2026-12-09'),('2026-12-10'),('2026-12-11'),('2026-12-12'),('2026-12-13'),('2026-12-14'),('2026-12-15'),('2026-12-16'),('2026-12-17'),('2026-12-18'),('2026-12-19'),('2026-12-20'),('2026-12-21'),('2026-12-22'),('2026-12-23'),('2026-12-24'),('2026-12-25'),('2026-12-26'),('2026-12-27'),('2026-12-28'),('2026-12-29'),('2026-12-30'),('2026-12-31'),('2027-01-01'),('2027-01-02'),('2027-01-03'),('2027-01-04'),('2027-01-05'),('2027-01-06'),('2027-01-07'),('2027-01-08'),('2027-01-09'),('2027-01-10'),('2027-01-11'),('2027-01-12'),('2027-01-13'),('2027-01-14'),('2027-01-15'),('2027-01-16'),('2027-01-17'),('2027-01-18'),('2027-01-19'),('2027-01-20'),('2027-01-21'),('2027-01-22'),('2027-01-23'),('2027-01-24'),('2027-01-25'),('2027-01-26'),('2027-01-27'),('2027-01-28'),('2027-01-29'),('2027-01-30'),('2027-01-31'),('2027-02-01'),('2027-02-02'),('2027-02-03'),('2027-02-04'),('2027-02-05'),('2027-02-06'),('2027-02-07'),('2027-02-08'),('2027-02-09'),('2027-02-10'),('2027-02-11'),('2027-02-12'),('2027-02-13'),('2027-02-14'),('2027-02-15'),('2027-02-16'),('2027-02-17'),('2027-02-18'),('2027-02-19'),('2027-02-20'),('2027-02-21'),('2027-02-22'),('2027-02-23'),('2027-02-24'),('2027-02-25'),('2027-02-26'),('2027-02-27'),('2027-02-28'),('2027-03-01'),('2027-03-02'),('2027-03-03'),('2027-03-04'),('2027-03-05'),('2027-03-06'),('2027-03-07'),('2027-03-08'),('2027-03-09'),('2027-03-10'),('2027-03-11'),('2027-03-12'),('2027-03-13'),('2027-03-14'),('2027-03-15'),('2027-03-16'),('2027-03-17'),('2027-03-18'),('2027-03-19'),('2027-03-20'),('2027-03-21'),('2027-03-22'),('2027-03-23'),('2027-03-24'),('2027-03-25'),('2027-03-26'),('2027-03-27'),('2027-03-28'),('2027-03-29'),('2027-03-30'),('2027-03-31'),('2027-04-01'),('2027-04-02'),('2027-04-03'),('2027-04-04'),('2027-04-05'),('2027-04-06'),('2027-04-07'),('2027-04-08'),('2027-04-09'),('2027-04-10'),('2027-04-11'),('2027-04-12'),('2027-04-13'),('2027-04-14'),('2027-04-15'),('2027-04-16'),('2027-04-17'),('2027-04-18'),('2027-04-19'),('2027-04-20'),('2027-04-21'),('2027-04-22'),('2027-04-23'),('2027-04-24'),('2027-04-25'),('2027-04-26'),('2027-04-27'),('2027-04-28'),('2027-04-29'),('2027-04-30'),('2027-05-01'),('2027-05-02'),('2027-05-03'),('2027-05-04'),('2027-05-05'),('2027-05-06'),('2027-05-07'),('2027-05-08'),('2027-05-09'),('2027-05-10'),('2027-05-11'),('2027-05-12'),('2027-05-13'),('2027-05-14'),('2027-05-15'),('2027-05-16'),('2027-05-17'),('2027-05-18'),('2027-05-19'),('2027-05-20'),('2027-05-21'),('2027-05-22'),('2027-05-23'),('2027-05-24'),('2027-05-25'),('2027-05-26'),('2027-05-27'),('2027-05-28'),('2027-05-29'),('2027-05-30'),('2027-05-31'),('2027-06-01'),('2027-06-02'),('2027-06-03'),('2027-06-04'),('2027-06-05'),('2027-06-06'),('2027-06-07'),('2027-06-08'),('2027-06-09'),('2027-06-10'),('2027-06-11'),('2027-06-12'),('2027-06-13'),('2027-06-14'),('2027-06-15'),('2027-06-16'),('2027-06-17'),('2027-06-18'),('2027-06-19'),('2027-06-20'),('2027-06-21'),('2027-06-22'),('2027-06-23'),('2027-06-24'),('2027-06-25'),('2027-06-26'),('2027-06-27'),('2027-06-28'),('2027-06-29'),('2027-06-30'),('2027-07-01'),('2027-07-02'),('2027-07-03'),('2027-07-04'),('2027-07-05'),('2027-07-06'),('2027-07-07'),('2027-07-08'),('2027-07-09'),('2027-07-10'),('2027-07-11'),('2027-07-12'),('2027-07-13'),('2027-07-14'),('2027-07-15'),('2027-07-16'),('2027-07-17'),('2027-07-18'),('2027-07-19'),('2027-07-20'),('2027-07-21'),('2027-07-22'),('2027-07-23'),('2027-07-24'),('2027-07-25'),('2027-07-26'),('2027-07-27'),('2027-07-28'),('2027-07-29'),('2027-07-30'),('2027-07-31'),('2027-08-01'),('2027-08-02'),('2027-08-03'),('2027-08-04'),('2027-08-05'),('2027-08-06'),('2027-08-07'),('2027-08-08'),('2027-08-09'),('2027-08-10'),('2027-08-11'),('2027-08-12'),('2027-08-13'),('2027-08-14'),('2027-08-15'),('2027-08-16'),('2027-08-17'),('2027-08-18'),('2027-08-19'),('2027-08-20'),('2027-08-21'),('2027-08-22'),('2027-08-23'),('2027-08-24'),('2027-08-25'),('2027-08-26'),('2027-08-27'),('2027-08-28'),('2027-08-29'),('2027-08-30'),('2027-08-31'),('2027-09-01'),('2027-09-02'),('2027-09-03'),('2027-09-04'),('2027-09-05'),('2027-09-06'),('2027-09-07'),('2027-09-08'),('2027-09-09'),('2027-09-10'),('2027-09-11'),('2027-09-12'),('2027-09-13'),('2027-09-14'),('2027-09-15'),('2027-09-16'),('2027-09-17'),('2027-09-18'),('2027-09-19'),('2027-09-20'),('2027-09-21'),('2027-09-22'),('2027-09-23'),('2027-09-24'),('2027-09-25'),('2027-09-26'),('2027-09-27'),('2027-09-28'),('2027-09-29'),('2027-09-30'),('2027-10-01'),('2027-10-02'),('2027-10-03'),('2027-10-04'),('2027-10-05'),('2027-10-06'),('2027-10-07'),('2027-10-08'),('2027-10-09'),('2027-10-10'),('2027-10-11'),('2027-10-12'),('2027-10-13'),('2027-10-14'),('2027-10-15'),('2027-10-16'),('2027-10-17'),('2027-10-18'),('2027-10-19'),('2027-10-20'),('2027-10-21'),('2027-10-22'),('2027-10-23'),('2027-10-24'),('2027-10-25'),('2027-10-26'),('2027-10-27'),('2027-10-28'),('2027-10-29'),('2027-10-30'),('2027-10-31'),('2027-11-01'),('2027-11-02'),('2027-11-03'),('2027-11-04'),('2027-11-05'),('2027-11-06'),('2027-11-07'),('2027-11-08'),('2027-11-09'),('2027-11-10'),('2027-11-11'),('2027-11-12'),('2027-11-13'),('2027-11-14'),('2027-11-15'),('2027-11-16'),('2027-11-17'),('2027-11-18'),('2027-11-19'),('2027-11-20'),('2027-11-21'),('2027-11-22'),('2027-11-23'),('2027-11-24'),('2027-11-25'),('2027-11-26'),('2027-11-27'),('2027-11-28'),('2027-11-29'),('2027-11-30'),('2027-12-01'),('2027-12-02'),('2027-12-03'),('2027-12-04'),('2027-12-05'),('2027-12-06'),('2027-12-07'),('2027-12-08'),('2027-12-09'),('2027-12-10'),('2027-12-11'),('2027-12-12'),('2027-12-13'),('2027-12-14'),('2027-12-15'),('2027-12-16'),('2027-12-17'),('2027-12-18'),('2027-12-19'),('2027-12-20'),('2027-12-21'),('2027-12-22'),('2027-12-23'),('2027-12-24'),('2027-12-25'),('2027-12-26'),('2027-12-27'),('2027-12-28'),('2027-12-29'),('2027-12-30'),('2027-12-31'),('2028-01-01'),('2028-01-02'),('2028-01-03'),('2028-01-04'),('2028-01-05'),('2028-01-06'),('2028-01-07'),('2028-01-08'),('2028-01-09'),('2028-01-10'),('2028-01-11'),('2028-01-12'),('2028-01-13'),('2028-01-14'),('2028-01-15'),('2028-01-16'),('2028-01-17'),('2028-01-18'),('2028-01-19'),('2028-01-20'),('2028-01-21'),('2028-01-22'),('2028-01-23'),('2028-01-24'),('2028-01-25'),('2028-01-26'),('2028-01-27'),('2028-01-28'),('2028-01-29'),('2028-01-30'),('2028-01-31'),('2028-02-01'),('2028-02-02'),('2028-02-03'),('2028-02-04'),('2028-02-05'),('2028-02-06'),('2028-02-07'),('2028-02-08'),('2028-02-09'),('2028-02-10'),('2028-02-11'),('2028-02-12'),('2028-02-13'),('2028-02-14'),('2028-02-15'),('2028-02-16'),('2028-02-17'),('2028-02-18'),('2028-02-19'),('2028-02-20'),('2028-02-21'),('2028-02-22'),('2028-02-23'),('2028-02-24'),('2028-02-25'),('2028-02-26'),('2028-02-27'),('2028-02-28'),('2028-02-29'),('2028-03-01'),('2028-03-02'),('2028-03-03'),('2028-03-04'),('2028-03-05'),('2028-03-06'),('2028-03-07'),('2028-03-08'),('2028-03-09'),('2028-03-10'),('2028-03-11'),('2028-03-12'),('2028-03-13'),('2028-03-14'),('2028-03-15'),('2028-03-16'),('2028-03-17'),('2028-03-18'),('2028-03-19'),('2028-03-20'),('2028-03-21'),('2028-03-22'),('2028-03-23'),('2028-03-24'),('2028-03-25'),('2028-03-26'),('2028-03-27'),('2028-03-28'),('2028-03-29'),('2028-03-30'),('2028-03-31'),('2028-04-01'),('2028-04-02'),('2028-04-03'),('2028-04-04'),('2028-04-05'),('2028-04-06'),('2028-04-07'),('2028-04-08'),('2028-04-09'),('2028-04-10'),('2028-04-11'),('2028-04-12'),('2028-04-13'),('2028-04-14'),('2028-04-15'),('2028-04-16'),('2028-04-17'),('2028-04-18'),('2028-04-19'),('2028-04-20'),('2028-04-21'),('2028-04-22'),('2028-04-23'),('2028-04-24'),('2028-04-25'),('2028-04-26'),('2028-04-27'),('2028-04-28'),('2028-04-29'),('2028-04-30'),('2028-05-01'),('2028-05-02'),('2028-05-03'),('2028-05-04'),('2028-05-05'),('2028-05-06'),('2028-05-07'),('2028-05-08'),('2028-05-09'),('2028-05-10'),('2028-05-11'),('2028-05-12'),('2028-05-13'),('2028-05-14'),('2028-05-15'),('2028-05-16'),('2028-05-17'),('2028-05-18'),('2028-05-19'),('2028-05-20'),('2028-05-21'),('2028-05-22'),('2028-05-23'),('2028-05-24'),('2028-05-25'),('2028-05-26'),('2028-05-27'),('2028-05-28'),('2028-05-29'),('2028-05-30'),('2028-05-31'),('2028-06-01'),('2028-06-02'),('2028-06-03'),('2028-06-04'),('2028-06-05'),('2028-06-06'),('2028-06-07'),('2028-06-08'),('2028-06-09'),('2028-06-10'),('2028-06-11'),('2028-06-12'),('2028-06-13'),('2028-06-14'),('2028-06-15'),('2028-06-16'),('2028-06-17'),('2028-06-18'),('2028-06-19'),('2028-06-20'),('2028-06-21'),('2028-06-22'),('2028-06-23'),('2028-06-24'),('2028-06-25'),('2028-06-26'),('2028-06-27'),('2028-06-28'),('2028-06-29'),('2028-06-30'),('2028-07-01'),('2028-07-02'),('2028-07-03'),('2028-07-04'),('2028-07-05'),('2028-07-06'),('2028-07-07'),('2028-07-08'),('2028-07-09'),('2028-07-10'),('2028-07-11'),('2028-07-12'),('2028-07-13'),('2028-07-14'),('2028-07-15'),('2028-07-16'),('2028-07-17'),('2028-07-18'),('2028-07-19'),('2028-07-20'),('2028-07-21'),('2028-07-22'),('2028-07-23'),('2028-07-24'),('2028-07-25'),('2028-07-26'),('2028-07-27'),('2028-07-28'),('2028-07-29'),('2028-07-30'),('2028-07-31'),('2028-08-01'),('2028-08-02'),('2028-08-03'),('2028-08-04'),('2028-08-05'),('2028-08-06'),('2028-08-07'),('2028-08-08'),('2028-08-09'),('2028-08-10'),('2028-08-11'),('2028-08-12'),('2028-08-13'),('2028-08-14'),('2028-08-15'),('2028-08-16'),('2028-08-17'),('2028-08-18'),('2028-08-19'),('2028-08-20'),('2028-08-21'),('2028-08-22'),('2028-08-23'),('2028-08-24'),('2028-08-25'),('2028-08-26'),('2028-08-27'),('2028-08-28'),('2028-08-29'),('2028-08-30'),('2028-08-31'),('2028-09-01'),('2028-09-02'),('2028-09-03'),('2028-09-04'),('2028-09-05'),('2028-09-06'),('2028-09-07'),('2028-09-08'),('2028-09-09'),('2028-09-10'),('2028-09-11'),('2028-09-12'),('2028-09-13'),('2028-09-14'),('2028-09-15'),('2028-09-16'),('2028-09-17'),('2028-09-18'),('2028-09-19'),('2028-09-20'),('2028-09-21'),('2028-09-22'),('2028-09-23'),('2028-09-24'),('2028-09-25'),('2028-09-26'),('2028-09-27'),('2028-09-28'),('2028-09-29'),('2028-09-30'),('2028-10-01'),('2028-10-02'),('2028-10-03'),('2028-10-04'),('2028-10-05'),('2028-10-06'),('2028-10-07'),('2028-10-08'),('2028-10-09'),('2028-10-10'),('2028-10-11'),('2028-10-12'),('2028-10-13'),('2028-10-14'),('2028-10-15'),('2028-10-16'),('2028-10-17'),('2028-10-18'),('2028-10-19'),('2028-10-20'),('2028-10-21'),('2028-10-22'),('2028-10-23'),('2028-10-24'),('2028-10-25'),('2028-10-26'),('2028-10-27'),('2028-10-28'),('2028-10-29'),('2028-10-30'),('2028-10-31'),('2028-11-01'),('2028-11-02'),('2028-11-03'),('2028-11-04'),('2028-11-05'),('2028-11-06'),('2028-11-07'),('2028-11-08'),('2028-11-09'),('2028-11-10'),('2028-11-11'),('2028-11-12'),('2028-11-13'),('2028-11-14'),('2028-11-15'),('2028-11-16'),('2028-11-17'),('2028-11-18'),('2028-11-19'),('2028-11-20'),('2028-11-21'),('2028-11-22'),('2028-11-23'),('2028-11-24'),('2028-11-25'),('2028-11-26'),('2028-11-27'),('2028-11-28'),('2028-11-29'),('2028-11-30'),('2028-12-01'),('2028-12-02'),('2028-12-03'),('2028-12-04'),('2028-12-05'),('2028-12-06'),('2028-12-07'),('2028-12-08'),('2028-12-09'),('2028-12-10'),('2028-12-11'),('2028-12-12'),('2028-12-13'),('2028-12-14'),('2028-12-15'),('2028-12-16'),('2028-12-17'),('2028-12-18'),('2028-12-19'),('2028-12-20'),('2028-12-21'),('2028-12-22'),('2028-12-23'),('2028-12-24'),('2028-12-25'),('2028-12-26'),('2028-12-27'),('2028-12-28'),('2028-12-29'),('2028-12-30'),('2028-12-31'),('2029-01-01'),('2029-01-02'),('2029-01-03'),('2029-01-04'),('2029-01-05'),('2029-01-06'),('2029-01-07'),('2029-01-08'),('2029-01-09'),('2029-01-10'),('2029-01-11'),('2029-01-12'),('2029-01-13'),('2029-01-14'),('2029-01-15'),('2029-01-16'),('2029-01-17'),('2029-01-18'),('2029-01-19'),('2029-01-20'),('2029-01-21'),('2029-01-22'),('2029-01-23'),('2029-01-24'),('2029-01-25'),('2029-01-26'),('2029-01-27'),('2029-01-28'),('2029-01-29'),('2029-01-30'),('2029-01-31'),('2029-02-01'),('2029-02-02'),('2029-02-03'),('2029-02-04'),('2029-02-05'),('2029-02-06'),('2029-02-07'),('2029-02-08'),('2029-02-09'),('2029-02-10'),('2029-02-11'),('2029-02-12'),('2029-02-13'),('2029-02-14'),('2029-02-15'),('2029-02-16'),('2029-02-17'),('2029-02-18'),('2029-02-19'),('2029-02-20'),('2029-02-21'),('2029-02-22'),('2029-02-23'),('2029-02-24'),('2029-02-25'),('2029-02-26'),('2029-02-27'),('2029-02-28'),('2029-03-01'),('2029-03-02'),('2029-03-03'),('2029-03-04'),('2029-03-05'),('2029-03-06'),('2029-03-07'),('2029-03-08'),('2029-03-09'),('2029-03-10'),('2029-03-11'),('2029-03-12'),('2029-03-13'),('2029-03-14'),('2029-03-15'),('2029-03-16'),('2029-03-17'),('2029-03-18'),('2029-03-19'),('2029-03-20'),('2029-03-21'),('2029-03-22'),('2029-03-23'),('2029-03-24'),('2029-03-25'),('2029-03-26'),('2029-03-27'),('2029-03-28'),('2029-03-29'),('2029-03-30'),('2029-03-31'),('2029-04-01'),('2029-04-02'),('2029-04-03'),('2029-04-04'),('2029-04-05'),('2029-04-06'),('2029-04-07'),('2029-04-08'),('2029-04-09'),('2029-04-10'),('2029-04-11'),('2029-04-12'),('2029-04-13'),('2029-04-14'),('2029-04-15'),('2029-04-16'),('2029-04-17'),('2029-04-18'),('2029-04-19'),('2029-04-20'),('2029-04-21'),('2029-04-22'),('2029-04-23'),('2029-04-24'),('2029-04-25'),('2029-04-26'),('2029-04-27'),('2029-04-28'),('2029-04-29'),('2029-04-30'),('2029-05-01'),('2029-05-02'),('2029-05-03'),('2029-05-04'),('2029-05-05'),('2029-05-06'),('2029-05-07'),('2029-05-08'),('2029-05-09'),('2029-05-10'),('2029-05-11'),('2029-05-12'),('2029-05-13'),('2029-05-14'),('2029-05-15'),('2029-05-16'),('2029-05-17'),('2029-05-18'),('2029-05-19'),('2029-05-20'),('2029-05-21'),('2029-05-22'),('2029-05-23'),('2029-05-24'),('2029-05-25'),('2029-05-26'),('2029-05-27'),('2029-05-28'),('2029-05-29'),('2029-05-30'),('2029-05-31'),('2029-06-01'),('2029-06-02'),('2029-06-03'),('2029-06-04'),('2029-06-05'),('2029-06-06'),('2029-06-07'),('2029-06-08'),('2029-06-09'),('2029-06-10'),('2029-06-11'),('2029-06-12'),('2029-06-13'),('2029-06-14'),('2029-06-15'),('2029-06-16'),('2029-06-17'),('2029-06-18'),('2029-06-19'),('2029-06-20'),('2029-06-21'),('2029-06-22'),('2029-06-23'),('2029-06-24'),('2029-06-25'),('2029-06-26'),('2029-06-27'),('2029-06-28'),('2029-06-29'),('2029-06-30'),('2029-07-01'),('2029-07-02'),('2029-07-03'),('2029-07-04'),('2029-07-05'),('2029-07-06'),('2029-07-07'),('2029-07-08'),('2029-07-09'),('2029-07-10'),('2029-07-11'),('2029-07-12'),('2029-07-13'),('2029-07-14'),('2029-07-15'),('2029-07-16'),('2029-07-17'),('2029-07-18'),('2029-07-19'),('2029-07-20'),('2029-07-21'),('2029-07-22'),('2029-07-23'),('2029-07-24'),('2029-07-25'),('2029-07-26'),('2029-07-27'),('2029-07-28'),('2029-07-29'),('2029-07-30'),('2029-07-31'),('2029-08-01'),('2029-08-02'),('2029-08-03'),('2029-08-04'),('2029-08-05'),('2029-08-06'),('2029-08-07'),('2029-08-08'),('2029-08-09'),('2029-08-10'),('2029-08-11'),('2029-08-12'),('2029-08-13'),('2029-08-14'),('2029-08-15'),('2029-08-16'),('2029-08-17'),('2029-08-18'),('2029-08-19'),('2029-08-20'),('2029-08-21'),('2029-08-22'),('2029-08-23'),('2029-08-24'),('2029-08-25'),('2029-08-26'),('2029-08-27'),('2029-08-28'),('2029-08-29'),('2029-08-30'),('2029-08-31'),('2029-09-01'),('2029-09-02'),('2029-09-03'),('2029-09-04'),('2029-09-05'),('2029-09-06'),('2029-09-07'),('2029-09-08'),('2029-09-09'),('2029-09-10'),('2029-09-11'),('2029-09-12'),('2029-09-13'),('2029-09-14'),('2029-09-15'),('2029-09-16'),('2029-09-17'),('2029-09-18'),('2029-09-19'),('2029-09-20'),('2029-09-21'),('2029-09-22'),('2029-09-23'),('2029-09-24'),('2029-09-25'),('2029-09-26'),('2029-09-27'),('2029-09-28'),('2029-09-29'),('2029-09-30'),('2029-10-01'),('2029-10-02'),('2029-10-03'),('2029-10-04'),('2029-10-05'),('2029-10-06'),('2029-10-07'),('2029-10-08'),('2029-10-09'),('2029-10-10'),('2029-10-11'),('2029-10-12'),('2029-10-13'),('2029-10-14'),('2029-10-15'),('2029-10-16'),('2029-10-17'),('2029-10-18'),('2029-10-19'),('2029-10-20'),('2029-10-21'),('2029-10-22'),('2029-10-23'),('2029-10-24'),('2029-10-25'),('2029-10-26'),('2029-10-27'),('2029-10-28'),('2029-10-29'),('2029-10-30'),('2029-10-31'),('2029-11-01'),('2029-11-02'),('2029-11-03'),('2029-11-04'),('2029-11-05'),('2029-11-06'),('2029-11-07'),('2029-11-08'),('2029-11-09'),('2029-11-10'),('2029-11-11'),('2029-11-12'),('2029-11-13'),('2029-11-14'),('2029-11-15'),('2029-11-16'),('2029-11-17'),('2029-11-18'),('2029-11-19'),('2029-11-20'),('2029-11-21'),('2029-11-22'),('2029-11-23'),('2029-11-24'),('2029-11-25'),('2029-11-26'),('2029-11-27'),('2029-11-28'),('2029-11-29'),('2029-11-30'),('2029-12-01'),('2029-12-02'),('2029-12-03'),('2029-12-04'),('2029-12-05'),('2029-12-06'),('2029-12-07'),('2029-12-08'),('2029-12-09'),('2029-12-10'),('2029-12-11'),('2029-12-12'),('2029-12-13'),('2029-12-14'),('2029-12-15'),('2029-12-16'),('2029-12-17'),('2029-12-18'),('2029-12-19'),('2029-12-20'),('2029-12-21'),('2029-12-22'),('2029-12-23'),('2029-12-24'),('2029-12-25'),('2029-12-26'),('2029-12-27'),('2029-12-28'),('2029-12-29'),('2029-12-30'),('2029-12-31'),('2030-01-01'),('2030-01-02'),('2030-01-03'),('2030-01-04'),('2030-01-05'),('2030-01-06'),('2030-01-07'),('2030-01-08'),('2030-01-09'),('2030-01-10'),('2030-01-11'),('2030-01-12'),('2030-01-13'),('2030-01-14'),('2030-01-15'),('2030-01-16'),('2030-01-17'),('2030-01-18'),('2030-01-19'),('2030-01-20'),('2030-01-21'),('2030-01-22'),('2030-01-23'),('2030-01-24'),('2030-01-25'),('2030-01-26'),('2030-01-27'),('2030-01-28'),('2030-01-29'),('2030-01-30'),('2030-01-31'),('2030-02-01'),('2030-02-02'),('2030-02-03'),('2030-02-04'),('2030-02-05'),('2030-02-06'),('2030-02-07'),('2030-02-08'),('2030-02-09'),('2030-02-10'),('2030-02-11'),('2030-02-12'),('2030-02-13'),('2030-02-14'),('2030-02-15'),('2030-02-16'),('2030-02-17'),('2030-02-18'),('2030-02-19'),('2030-02-20'),('2030-02-21'),('2030-02-22'),('2030-02-23'),('2030-02-24'),('2030-02-25'),('2030-02-26'),('2030-02-27'),('2030-02-28'),('2030-03-01'),('2030-03-02'),('2030-03-03'),('2030-03-04'),('2030-03-05'),('2030-03-06'),('2030-03-07'),('2030-03-08'),('2030-03-09'),('2030-03-10'),('2030-03-11'),('2030-03-12'),('2030-03-13'),('2030-03-14'),('2030-03-15'),('2030-03-16'),('2030-03-17'),('2030-03-18'),('2030-03-19'),('2030-03-20'),('2030-03-21'),('2030-03-22'),('2030-03-23'),('2030-03-24'),('2030-03-25'),('2030-03-26'),('2030-03-27'),('2030-03-28'),('2030-03-29'),('2030-03-30'),('2030-03-31'),('2030-04-01'),('2030-04-02'),('2030-04-03'),('2030-04-04'),('2030-04-05'),('2030-04-06'),('2030-04-07'),('2030-04-08'),('2030-04-09'),('2030-04-10'),('2030-04-11'),('2030-04-12'),('2030-04-13'),('2030-04-14'),('2030-04-15'),('2030-04-16'),('2030-04-17'),('2030-04-18'),('2030-04-19'),('2030-04-20'),('2030-04-21'),('2030-04-22'),('2030-04-23'),('2030-04-24'),('2030-04-25'),('2030-04-26'),('2030-04-27'),('2030-04-28'),('2030-04-29'),('2030-04-30'),('2030-05-01'),('2030-05-02'),('2030-05-03'),('2030-05-04'),('2030-05-05'),('2030-05-06'),('2030-05-07'),('2030-05-08'),('2030-05-09'),('2030-05-10'),('2030-05-11'),('2030-05-12'),('2030-05-13'),('2030-05-14'),('2030-05-15'),('2030-05-16'),('2030-05-17'),('2030-05-18'),('2030-05-19'),('2030-05-20'),('2030-05-21'),('2030-05-22'),('2030-05-23'),('2030-05-24'),('2030-05-25'),('2030-05-26'),('2030-05-27'),('2030-05-28'),('2030-05-29'),('2030-05-30'),('2030-05-31'),('2030-06-01'),('2030-06-02'),('2030-06-03'),('2030-06-04'),('2030-06-05'),('2030-06-06'),('2030-06-07'),('2030-06-08'),('2030-06-09'),('2030-06-10'),('2030-06-11'),('2030-06-12'),('2030-06-13'),('2030-06-14'),('2030-06-15'),('2030-06-16'),('2030-06-17'),('2030-06-18'),('2030-06-19'),('2030-06-20'),('2030-06-21'),('2030-06-22'),('2030-06-23'),('2030-06-24'),('2030-06-25'),('2030-06-26'),('2030-06-27'),('2030-06-28'),('2030-06-29'),('2030-06-30'),('2030-07-01'),('2030-07-02'),('2030-07-03'),('2030-07-04'),('2030-07-05'),('2030-07-06'),('2030-07-07'),('2030-07-08'),('2030-07-09'),('2030-07-10'),('2030-07-11'),('2030-07-12'),('2030-07-13'),('2030-07-14'),('2030-07-15'),('2030-07-16'),('2030-07-17'),('2030-07-18'),('2030-07-19'),('2030-07-20'),('2030-07-21'),('2030-07-22'),('2030-07-23'),('2030-07-24'),('2030-07-25'),('2030-07-26'),('2030-07-27'),('2030-07-28'),('2030-07-29'),('2030-07-30'),('2030-07-31'),('2030-08-01'),('2030-08-02'),('2030-08-03'),('2030-08-04'),('2030-08-05'),('2030-08-06'),('2030-08-07'),('2030-08-08'),('2030-08-09'),('2030-08-10'),('2030-08-11'),('2030-08-12'),('2030-08-13'),('2030-08-14'),('2030-08-15'),('2030-08-16'),('2030-08-17'),('2030-08-18'),('2030-08-19'),('2030-08-20'),('2030-08-21'),('2030-08-22'),('2030-08-23'),('2030-08-24'),('2030-08-25'),('2030-08-26'),('2030-08-27'),('2030-08-28'),('2030-08-29'),('2030-08-30'),('2030-08-31'),('2030-09-01'),('2030-09-02'),('2030-09-03'),('2030-09-04'),('2030-09-05'),('2030-09-06'),('2030-09-07'),('2030-09-08'),('2030-09-09'),('2030-09-10'),('2030-09-11'),('2030-09-12'),('2030-09-13'),('2030-09-14'),('2030-09-15'),('2030-09-16'),('2030-09-17'),('2030-09-18'),('2030-09-19'),('2030-09-20'),('2030-09-21'),('2030-09-22'),('2030-09-23'),('2030-09-24'),('2030-09-25'),('2030-09-26'),('2030-09-27'),('2030-09-28'),('2030-09-29'),('2030-09-30'),('2030-10-01'),('2030-10-02'),('2030-10-03'),('2030-10-04'),('2030-10-05'),('2030-10-06'),('2030-10-07'),('2030-10-08'),('2030-10-09'),('2030-10-10'),('2030-10-11'),('2030-10-12'),('2030-10-13'),('2030-10-14'),('2030-10-15'),('2030-10-16'),('2030-10-17'),('2030-10-18'),('2030-10-19'),('2030-10-20'),('2030-10-21'),('2030-10-22'),('2030-10-23'),('2030-10-24'),('2030-10-25'),('2030-10-26'),('2030-10-27'),('2030-10-28'),('2030-10-29'),('2030-10-30'),('2030-10-31'),('2030-11-01'),('2030-11-02'),('2030-11-03'),('2030-11-04'),('2030-11-05'),('2030-11-06'),('2030-11-07'),('2030-11-08'),('2030-11-09'),('2030-11-10'),('2030-11-11'),('2030-11-12'),('2030-11-13'),('2030-11-14'),('2030-11-15'),('2030-11-16'),('2030-11-17'),('2030-11-18'),('2030-11-19'),('2030-11-20'),('2030-11-21'),('2030-11-22'),('2030-11-23'),('2030-11-24'),('2030-11-25'),('2030-11-26'),('2030-11-27'),('2030-11-28'),('2030-11-29'),('2030-11-30'),('2030-12-01'),('2030-12-02'),('2030-12-03'),('2030-12-04'),('2030-12-05'),('2030-12-06'),('2030-12-07'),('2030-12-08'),('2030-12-09'),('2030-12-10'),('2030-12-11'),('2030-12-12'),('2030-12-13'),('2030-12-14'),('2030-12-15'),('2030-12-16'),('2030-12-17'),('2030-12-18'),('2030-12-19'),('2030-12-20'),('2030-12-21'),('2030-12-22'),('2030-12-23'),('2030-12-24'),('2030-12-25'),('2030-12-26'),('2030-12-27'),('2030-12-28'),('2030-12-29'),('2030-12-30'),('2030-12-31'),('2031-01-01'),('2031-01-02'),('2031-01-03'),('2031-01-04'),('2031-01-05'),('2031-01-06'),('2031-01-07'),('2031-01-08'),('2031-01-09'),('2031-01-10'),('2031-01-11'),('2031-01-12'),('2031-01-13'),('2031-01-14'),('2031-01-15'),('2031-01-16'),('2031-01-17'),('2031-01-18'),('2031-01-19'),('2031-01-20'),('2031-01-21'),('2031-01-22'),('2031-01-23'),('2031-01-24'),('2031-01-25'),('2031-01-26'),('2031-01-27'),('2031-01-28'),('2031-01-29'),('2031-01-30'),('2031-01-31'),('2031-02-01'),('2031-02-02'),('2031-02-03'),('2031-02-04'),('2031-02-05'),('2031-02-06'),('2031-02-07'),('2031-02-08'),('2031-02-09'),('2031-02-10'),('2031-02-11'),('2031-02-12'),('2031-02-13'),('2031-02-14'),('2031-02-15'),('2031-02-16'),('2031-02-17'),('2031-02-18'),('2031-02-19'),('2031-02-20'),('2031-02-21'),('2031-02-22'),('2031-02-23'),('2031-02-24'),('2031-02-25'),('2031-02-26'),('2031-02-27'),('2031-02-28'),('2031-03-01'),('2031-03-02'),('2031-03-03'),('2031-03-04'),('2031-03-05'),('2031-03-06'),('2031-03-07'),('2031-03-08'),('2031-03-09'),('2031-03-10'),('2031-03-11'),('2031-03-12'),('2031-03-13'),('2031-03-14'),('2031-03-15'),('2031-03-16'),('2031-03-17'),('2031-03-18'),('2031-03-19'),('2031-03-20'),('2031-03-21'),('2031-03-22'),('2031-03-23'),('2031-03-24'),('2031-03-25'),('2031-03-26'),('2031-03-27'),('2031-03-28'),('2031-03-29'),('2031-03-30'),('2031-03-31'),('2031-04-01'),('2031-04-02'),('2031-04-03'),('2031-04-04'),('2031-04-05'),('2031-04-06'),('2031-04-07'),('2031-04-08'),('2031-04-09'),('2031-04-10'),('2031-04-11'),('2031-04-12'),('2031-04-13'),('2031-04-14'),('2031-04-15'),('2031-04-16'),('2031-04-17'),('2031-04-18'),('2031-04-19'),('2031-04-20'),('2031-04-21'),('2031-04-22'),('2031-04-23'),('2031-04-24'),('2031-04-25'),('2031-04-26'),('2031-04-27'),('2031-04-28'),('2031-04-29'),('2031-04-30'),('2031-05-01'),('2031-05-02'),('2031-05-03'),('2031-05-04'),('2031-05-05'),('2031-05-06'),('2031-05-07'),('2031-05-08'),('2031-05-09'),('2031-05-10'),('2031-05-11'),('2031-05-12'),('2031-05-13'),('2031-05-14'),('2031-05-15'),('2031-05-16'),('2031-05-17'),('2031-05-18'),('2031-05-19'),('2031-05-20'),('2031-05-21'),('2031-05-22'),('2031-05-23'),('2031-05-24'),('2031-05-25'),('2031-05-26'),('2031-05-27'),('2031-05-28'),('2031-05-29'),('2031-05-30'),('2031-05-31'),('2031-06-01'),('2031-06-02'),('2031-06-03'),('2031-06-04'),('2031-06-05'),('2031-06-06'),('2031-06-07'),('2031-06-08'),('2031-06-09'),('2031-06-10'),('2031-06-11'),('2031-06-12'),('2031-06-13'),('2031-06-14'),('2031-06-15'),('2031-06-16'),('2031-06-17'),('2031-06-18'),('2031-06-19'),('2031-06-20'),('2031-06-21'),('2031-06-22'),('2031-06-23'),('2031-06-24'),('2031-06-25'),('2031-06-26'),('2031-06-27'),('2031-06-28'),('2031-06-29'),('2031-06-30'),('2031-07-01'),('2031-07-02'),('2031-07-03'),('2031-07-04'),('2031-07-05'),('2031-07-06'),('2031-07-07'),('2031-07-08'),('2031-07-09'),('2031-07-10'),('2031-07-11'),('2031-07-12'),('2031-07-13'),('2031-07-14'),('2031-07-15'),('2031-07-16'),('2031-07-17'),('2031-07-18'),('2031-07-19'),('2031-07-20'),('2031-07-21'),('2031-07-22'),('2031-07-23'),('2031-07-24'),('2031-07-25'),('2031-07-26'),('2031-07-27'),('2031-07-28'),('2031-07-29'),('2031-07-30'),('2031-07-31'),('2031-08-01'),('2031-08-02'),('2031-08-03'),('2031-08-04'),('2031-08-05'),('2031-08-06'),('2031-08-07'),('2031-08-08'),('2031-08-09'),('2031-08-10'),('2031-08-11'),('2031-08-12'),('2031-08-13'),('2031-08-14'),('2031-08-15'),('2031-08-16'),('2031-08-17'),('2031-08-18'),('2031-08-19'),('2031-08-20'),('2031-08-21'),('2031-08-22'),('2031-08-23'),('2031-08-24'),('2031-08-25'),('2031-08-26'),('2031-08-27'),('2031-08-28'),('2031-08-29'),('2031-08-30'),('2031-08-31'),('2031-09-01'),('2031-09-02'),('2031-09-03'),('2031-09-04'),('2031-09-05'),('2031-09-06'),('2031-09-07'),('2031-09-08'),('2031-09-09'),('2031-09-10'),('2031-09-11'),('2031-09-12'),('2031-09-13'),('2031-09-14'),('2031-09-15'),('2031-09-16'),('2031-09-17'),('2031-09-18'),('2031-09-19'),('2031-09-20'),('2031-09-21'),('2031-09-22'),('2031-09-23'),('2031-09-24'),('2031-09-25'),('2031-09-26'),('2031-09-27'),('2031-09-28'),('2031-09-29'),('2031-09-30'),('2031-10-01'),('2031-10-02'),('2031-10-03'),('2031-10-04'),('2031-10-05'),('2031-10-06'),('2031-10-07'),('2031-10-08'),('2031-10-09'),('2031-10-10'),('2031-10-11'),('2031-10-12'),('2031-10-13'),('2031-10-14'),('2031-10-15'),('2031-10-16'),('2031-10-17'),('2031-10-18'),('2031-10-19'),('2031-10-20'),('2031-10-21'),('2031-10-22'),('2031-10-23'),('2031-10-24'),('2031-10-25'),('2031-10-26'),('2031-10-27'),('2031-10-28'),('2031-10-29'),('2031-10-30'),('2031-10-31'),('2031-11-01'),('2031-11-02'),('2031-11-03'),('2031-11-04'),('2031-11-05'),('2031-11-06'),('2031-11-07'),('2031-11-08'),('2031-11-09'),('2031-11-10'),('2031-11-11'),('2031-11-12'),('2031-11-13'),('2031-11-14'),('2031-11-15'),('2031-11-16'),('2031-11-17'),('2031-11-18'),('2031-11-19'),('2031-11-20'),('2031-11-21'),('2031-11-22'),('2031-11-23'),('2031-11-24'),('2031-11-25'),('2031-11-26'),('2031-11-27'),('2031-11-28'),('2031-11-29'),('2031-11-30'),('2031-12-01'),('2031-12-02'),('2031-12-03'),('2031-12-04'),('2031-12-05'),('2031-12-06'),('2031-12-07'),('2031-12-08'),('2031-12-09'),('2031-12-10'),('2031-12-11'),('2031-12-12'),('2031-12-13'),('2031-12-14'),('2031-12-15'),('2031-12-16'),('2031-12-17'),('2031-12-18'),('2031-12-19'),('2031-12-20'),('2031-12-21'),('2031-12-22'),('2031-12-23'),('2031-12-24'),('2031-12-25'),('2031-12-26'),('2031-12-27'),('2031-12-28'),('2031-12-29'),('2031-12-30'),('2031-12-31'),('2032-01-01'),('2032-01-02'),('2032-01-03'),('2032-01-04'),('2032-01-05'),('2032-01-06'),('2032-01-07'),('2032-01-08'),('2032-01-09'),('2032-01-10'),('2032-01-11'),('2032-01-12'),('2032-01-13'),('2032-01-14'),('2032-01-15'),('2032-01-16'),('2032-01-17'),('2032-01-18'),('2032-01-19'),('2032-01-20'),('2032-01-21'),('2032-01-22'),('2032-01-23'),('2032-01-24'),('2032-01-25'),('2032-01-26'),('2032-01-27'),('2032-01-28'),('2032-01-29'),('2032-01-30'),('2032-01-31'),('2032-02-01'),('2032-02-02'),('2032-02-03'),('2032-02-04'),('2032-02-05'),('2032-02-06'),('2032-02-07'),('2032-02-08'),('2032-02-09'),('2032-02-10'),('2032-02-11'),('2032-02-12'),('2032-02-13'),('2032-02-14'),('2032-02-15'),('2032-02-16'),('2032-02-17'),('2032-02-18'),('2032-02-19'),('2032-02-20'),('2032-02-21'),('2032-02-22'),('2032-02-23'),('2032-02-24'),('2032-02-25'),('2032-02-26'),('2032-02-27'),('2032-02-28'),('2032-02-29'),('2032-03-01'),('2032-03-02'),('2032-03-03'),('2032-03-04'),('2032-03-05'),('2032-03-06'),('2032-03-07'),('2032-03-08'),('2032-03-09'),('2032-03-10'),('2032-03-11'),('2032-03-12'),('2032-03-13'),('2032-03-14'),('2032-03-15'),('2032-03-16'),('2032-03-17'),('2032-03-18'),('2032-03-19'),('2032-03-20'),('2032-03-21'),('2032-03-22'),('2032-03-23'),('2032-03-24'),('2032-03-25'),('2032-03-26'),('2032-03-27'),('2032-03-28'),('2032-03-29'),('2032-03-30'),('2032-03-31'),('2032-04-01'),('2032-04-02'),('2032-04-03'),('2032-04-04'),('2032-04-05'),('2032-04-06'),('2032-04-07'),('2032-04-08'),('2032-04-09'),('2032-04-10'),('2032-04-11'),('2032-04-12'),('2032-04-13'),('2032-04-14'),('2032-04-15'),('2032-04-16'),('2032-04-17'),('2032-04-18'),('2032-04-19'),('2032-04-20'),('2032-04-21'),('2032-04-22'),('2032-04-23'),('2032-04-24'),('2032-04-25'),('2032-04-26'),('2032-04-27'),('2032-04-28'),('2032-04-29'),('2032-04-30'),('2032-05-01'),('2032-05-02'),('2032-05-03'),('2032-05-04'),('2032-05-05'),('2032-05-06'),('2032-05-07'),('2032-05-08'),('2032-05-09'),('2032-05-10'),('2032-05-11'),('2032-05-12'),('2032-05-13'),('2032-05-14'),('2032-05-15'),('2032-05-16'),('2032-05-17'),('2032-05-18'),('2032-05-19'),('2032-05-20'),('2032-05-21'),('2032-05-22'),('2032-05-23'),('2032-05-24'),('2032-05-25'),('2032-05-26'),('2032-05-27'),('2032-05-28'),('2032-05-29'),('2032-05-30'),('2032-05-31'),('2032-06-01'),('2032-06-02'),('2032-06-03'),('2032-06-04'),('2032-06-05'),('2032-06-06'),('2032-06-07'),('2032-06-08'),('2032-06-09'),('2032-06-10'),('2032-06-11'),('2032-06-12'),('2032-06-13'),('2032-06-14'),('2032-06-15'),('2032-06-16'),('2032-06-17'),('2032-06-18'),('2032-06-19'),('2032-06-20'),('2032-06-21'),('2032-06-22'),('2032-06-23'),('2032-06-24'),('2032-06-25'),('2032-06-26'),('2032-06-27'),('2032-06-28'),('2032-06-29'),('2032-06-30'),('2032-07-01'),('2032-07-02'),('2032-07-03'),('2032-07-04'),('2032-07-05'),('2032-07-06'),('2032-07-07'),('2032-07-08'),('2032-07-09'),('2032-07-10'),('2032-07-11'),('2032-07-12'),('2032-07-13'),('2032-07-14'),('2032-07-15'),('2032-07-16'),('2032-07-17'),('2032-07-18'),('2032-07-19'),('2032-07-20'),('2032-07-21'),('2032-07-22'),('2032-07-23'),('2032-07-24'),('2032-07-25'),('2032-07-26'),('2032-07-27'),('2032-07-28'),('2032-07-29'),('2032-07-30'),('2032-07-31'),('2032-08-01'),('2032-08-02'),('2032-08-03'),('2032-08-04'),('2032-08-05'),('2032-08-06'),('2032-08-07'),('2032-08-08'),('2032-08-09'),('2032-08-10'),('2032-08-11'),('2032-08-12'),('2032-08-13'),('2032-08-14'),('2032-08-15'),('2032-08-16'),('2032-08-17'),('2032-08-18'),('2032-08-19'),('2032-08-20'),('2032-08-21'),('2032-08-22'),('2032-08-23'),('2032-08-24'),('2032-08-25'),('2032-08-26'),('2032-08-27'),('2032-08-28'),('2032-08-29'),('2032-08-30'),('2032-08-31'),('2032-09-01'),('2032-09-02'),('2032-09-03'),('2032-09-04'),('2032-09-05'),('2032-09-06'),('2032-09-07'),('2032-09-08'),('2032-09-09'),('2032-09-10'),('2032-09-11'),('2032-09-12'),('2032-09-13'),('2032-09-14'),('2032-09-15'),('2032-09-16'),('2032-09-17'),('2032-09-18'),('2032-09-19'),('2032-09-20'),('2032-09-21'),('2032-09-22'),('2032-09-23'),('2032-09-24'),('2032-09-25'),('2032-09-26'),('2032-09-27'),('2032-09-28'),('2032-09-29'),('2032-09-30'),('2032-10-01'),('2032-10-02'),('2032-10-03'),('2032-10-04'),('2032-10-05'),('2032-10-06'),('2032-10-07'),('2032-10-08'),('2032-10-09'),('2032-10-10'),('2032-10-11'),('2032-10-12'),('2032-10-13'),('2032-10-14'),('2032-10-15'),('2032-10-16'),('2032-10-17'),('2032-10-18'),('2032-10-19'),('2032-10-20'),('2032-10-21'),('2032-10-22'),('2032-10-23'),('2032-10-24'),('2032-10-25'),('2032-10-26'),('2032-10-27'),('2032-10-28'),('2032-10-29'),('2032-10-30'),('2032-10-31'),('2032-11-01'),('2032-11-02'),('2032-11-03'),('2032-11-04'),('2032-11-05'),('2032-11-06'),('2032-11-07'),('2032-11-08'),('2032-11-09'),('2032-11-10'),('2032-11-11'),('2032-11-12'),('2032-11-13'),('2032-11-14'),('2032-11-15'),('2032-11-16'),('2032-11-17'),('2032-11-18'),('2032-11-19'),('2032-11-20'),('2032-11-21'),('2032-11-22'),('2032-11-23'),('2032-11-24'),('2032-11-25'),('2032-11-26'),('2032-11-27'),('2032-11-28'),('2032-11-29'),('2032-11-30'),('2032-12-01'),('2032-12-02'),('2032-12-03'),('2032-12-04'),('2032-12-05'),('2032-12-06'),('2032-12-07'),('2032-12-08'),('2032-12-09'),('2032-12-10'),('2032-12-11'),('2032-12-12'),('2032-12-13'),('2032-12-14'),('2032-12-15'),('2032-12-16'),('2032-12-17'),('2032-12-18'),('2032-12-19'),('2032-12-20'),('2032-12-21'),('2032-12-22'),('2032-12-23'),('2032-12-24'),('2032-12-25'),('2032-12-26'),('2032-12-27'),('2032-12-28'),('2032-12-29'),('2032-12-30'),('2032-12-31'),('2033-01-01'),('2033-01-02'),('2033-01-03'),('2033-01-04'),('2033-01-05'),('2033-01-06'),('2033-01-07'),('2033-01-08'),('2033-01-09'),('2033-01-10'),('2033-01-11'),('2033-01-12'),('2033-01-13'),('2033-01-14'),('2033-01-15'),('2033-01-16'),('2033-01-17'),('2033-01-18'),('2033-01-19'),('2033-01-20'),('2033-01-21'),('2033-01-22'),('2033-01-23'),('2033-01-24'),('2033-01-25'),('2033-01-26'),('2033-01-27'),('2033-01-28'),('2033-01-29'),('2033-01-30'),('2033-01-31'),('2033-02-01'),('2033-02-02'),('2033-02-03'),('2033-02-04'),('2033-02-05'),('2033-02-06'),('2033-02-07'),('2033-02-08'),('2033-02-09'),('2033-02-10'),('2033-02-11'),('2033-02-12'),('2033-02-13'),('2033-02-14'),('2033-02-15'),('2033-02-16'),('2033-02-17'),('2033-02-18'),('2033-02-19'),('2033-02-20'),('2033-02-21'),('2033-02-22'),('2033-02-23'),('2033-02-24'),('2033-02-25'),('2033-02-26'),('2033-02-27'),('2033-02-28'),('2033-03-01'),('2033-03-02'),('2033-03-03'),('2033-03-04'),('2033-03-05'),('2033-03-06'),('2033-03-07'),('2033-03-08'),('2033-03-09'),('2033-03-10'),('2033-03-11'),('2033-03-12'),('2033-03-13'),('2033-03-14'),('2033-03-15'),('2033-03-16'),('2033-03-17'),('2033-03-18'),('2033-03-19'),('2033-03-20'),('2033-03-21'),('2033-03-22'),('2033-03-23'),('2033-03-24'),('2033-03-25'),('2033-03-26'),('2033-03-27'),('2033-03-28'),('2033-03-29'),('2033-03-30'),('2033-03-31'),('2033-04-01'),('2033-04-02'),('2033-04-03'),('2033-04-04'),('2033-04-05'),('2033-04-06'),('2033-04-07'),('2033-04-08'),('2033-04-09'),('2033-04-10'),('2033-04-11'),('2033-04-12'),('2033-04-13'),('2033-04-14'),('2033-04-15'),('2033-04-16'),('2033-04-17'),('2033-04-18'),('2033-04-19'),('2033-04-20'),('2033-04-21'),('2033-04-22'),('2033-04-23'),('2033-04-24'),('2033-04-25'),('2033-04-26'),('2033-04-27'),('2033-04-28'),('2033-04-29'),('2033-04-30'),('2033-05-01'),('2033-05-02'),('2033-05-03'),('2033-05-04'),('2033-05-05'),('2033-05-06'),('2033-05-07'),('2033-05-08'),('2033-05-09'),('2033-05-10'),('2033-05-11'),('2033-05-12'),('2033-05-13'),('2033-05-14'),('2033-05-15'),('2033-05-16'),('2033-05-17'),('2033-05-18'),('2033-05-19'),('2033-05-20'),('2033-05-21'),('2033-05-22'),('2033-05-23'),('2033-05-24'),('2033-05-25'),('2033-05-26'),('2033-05-27'),('2033-05-28'),('2033-05-29'),('2033-05-30'),('2033-05-31'),('2033-06-01'),('2033-06-02'),('2033-06-03'),('2033-06-04'),('2033-06-05'),('2033-06-06'),('2033-06-07'),('2033-06-08'),('2033-06-09'),('2033-06-10'),('2033-06-11'),('2033-06-12'),('2033-06-13'),('2033-06-14'),('2033-06-15'),('2033-06-16'),('2033-06-17'),('2033-06-18'),('2033-06-19'),('2033-06-20'),('2033-06-21'),('2033-06-22'),('2033-06-23'),('2033-06-24'),('2033-06-25'),('2033-06-26'),('2033-06-27'),('2033-06-28'),('2033-06-29'),('2033-06-30'),('2033-07-01'),('2033-07-02'),('2033-07-03'),('2033-07-04'),('2033-07-05'),('2033-07-06'),('2033-07-07'),('2033-07-08'),('2033-07-09'),('2033-07-10'),('2033-07-11'),('2033-07-12'),('2033-07-13'),('2033-07-14'),('2033-07-15'),('2033-07-16'),('2033-07-17'),('2033-07-18'),('2033-07-19'),('2033-07-20'),('2033-07-21'),('2033-07-22'),('2033-07-23'),('2033-07-24'),('2033-07-25'),('2033-07-26'),('2033-07-27'),('2033-07-28'),('2033-07-29'),('2033-07-30'),('2033-07-31'),('2033-08-01'),('2033-08-02'),('2033-08-03'),('2033-08-04'),('2033-08-05'),('2033-08-06'),('2033-08-07'),('2033-08-08'),('2033-08-09'),('2033-08-10'),('2033-08-11'),('2033-08-12'),('2033-08-13'),('2033-08-14'),('2033-08-15'),('2033-08-16'),('2033-08-17'),('2033-08-18'),('2033-08-19'),('2033-08-20'),('2033-08-21'),('2033-08-22'),('2033-08-23'),('2033-08-24'),('2033-08-25'),('2033-08-26'),('2033-08-27'),('2033-08-28'),('2033-08-29'),('2033-08-30'),('2033-08-31'),('2033-09-01'),('2033-09-02'),('2033-09-03'),('2033-09-04'),('2033-09-05'),('2033-09-06'),('2033-09-07'),('2033-09-08'),('2033-09-09'),('2033-09-10'),('2033-09-11'),('2033-09-12'),('2033-09-13'),('2033-09-14'),('2033-09-15'),('2033-09-16'),('2033-09-17'),('2033-09-18'),('2033-09-19'),('2033-09-20'),('2033-09-21'),('2033-09-22'),('2033-09-23'),('2033-09-24'),('2033-09-25'),('2033-09-26'),('2033-09-27'),('2033-09-28'),('2033-09-29'),('2033-09-30'),('2033-10-01'),('2033-10-02'),('2033-10-03'),('2033-10-04'),('2033-10-05'),('2033-10-06'),('2033-10-07'),('2033-10-08'),('2033-10-09'),('2033-10-10'),('2033-10-11'),('2033-10-12'),('2033-10-13'),('2033-10-14'),('2033-10-15'),('2033-10-16'),('2033-10-17'),('2033-10-18'),('2033-10-19'),('2033-10-20'),('2033-10-21'),('2033-10-22'),('2033-10-23'),('2033-10-24'),('2033-10-25'),('2033-10-26'),('2033-10-27'),('2033-10-28'),('2033-10-29'),('2033-10-30'),('2033-10-31'),('2033-11-01'),('2033-11-02'),('2033-11-03'),('2033-11-04'),('2033-11-05'),('2033-11-06'),('2033-11-07'),('2033-11-08'),('2033-11-09'),('2033-11-10'),('2033-11-11'),('2033-11-12'),('2033-11-13'),('2033-11-14'),('2033-11-15'),('2033-11-16'),('2033-11-17'),('2033-11-18'),('2033-11-19'),('2033-11-20'),('2033-11-21'),('2033-11-22'),('2033-11-23'),('2033-11-24'),('2033-11-25'),('2033-11-26'),('2033-11-27'),('2033-11-28'),('2033-11-29'),('2033-11-30'),('2033-12-01'),('2033-12-02'),('2033-12-03'),('2033-12-04'),('2033-12-05'),('2033-12-06'),('2033-12-07'),('2033-12-08'),('2033-12-09'),('2033-12-10'),('2033-12-11'),('2033-12-12'),('2033-12-13'),('2033-12-14'),('2033-12-15'),('2033-12-16'),('2033-12-17'),('2033-12-18'),('2033-12-19'),('2033-12-20'),('2033-12-21'),('2033-12-22'),('2033-12-23'),('2033-12-24'),('2033-12-25'),('2033-12-26'),('2033-12-27'),('2033-12-28'),('2033-12-29'),('2033-12-30'),('2033-12-31'),('2034-01-01'),('2034-01-02'),('2034-01-03'),('2034-01-04'),('2034-01-05'),('2034-01-06'),('2034-01-07'),('2034-01-08'),('2034-01-09'),('2034-01-10'),('2034-01-11'),('2034-01-12'),('2034-01-13'),('2034-01-14'),('2034-01-15'),('2034-01-16'),('2034-01-17'),('2034-01-18'),('2034-01-19'),('2034-01-20'),('2034-01-21'),('2034-01-22'),('2034-01-23'),('2034-01-24'),('2034-01-25'),('2034-01-26'),('2034-01-27'),('2034-01-28'),('2034-01-29'),('2034-01-30'),('2034-01-31'),('2034-02-01'),('2034-02-02'),('2034-02-03'),('2034-02-04'),('2034-02-05'),('2034-02-06'),('2034-02-07'),('2034-02-08'),('2034-02-09'),('2034-02-10'),('2034-02-11'),('2034-02-12'),('2034-02-13'),('2034-02-14'),('2034-02-15'),('2034-02-16'),('2034-02-17'),('2034-02-18'),('2034-02-19'),('2034-02-20'),('2034-02-21'),('2034-02-22'),('2034-02-23'),('2034-02-24'),('2034-02-25'),('2034-02-26'),('2034-02-27'),('2034-02-28'),('2034-03-01'),('2034-03-02'),('2034-03-03'),('2034-03-04'),('2034-03-05'),('2034-03-06'),('2034-03-07'),('2034-03-08'),('2034-03-09'),('2034-03-10'),('2034-03-11'),('2034-03-12'),('2034-03-13'),('2034-03-14'),('2034-03-15'),('2034-03-16'),('2034-03-17'),('2034-03-18'),('2034-03-19'),('2034-03-20'),('2034-03-21'),('2034-03-22'),('2034-03-23'),('2034-03-24'),('2034-03-25'),('2034-03-26'),('2034-03-27'),('2034-03-28'),('2034-03-29'),('2034-03-30'),('2034-03-31'),('2034-04-01'),('2034-04-02'),('2034-04-03'),('2034-04-04'),('2034-04-05'),('2034-04-06'),('2034-04-07'),('2034-04-08'),('2034-04-09'),('2034-04-10'),('2034-04-11'),('2034-04-12'),('2034-04-13'),('2034-04-14'),('2034-04-15'),('2034-04-16'),('2034-04-17'),('2034-04-18'),('2034-04-19'),('2034-04-20'),('2034-04-21'),('2034-04-22'),('2034-04-23'),('2034-04-24'),('2034-04-25'),('2034-04-26'),('2034-04-27'),('2034-04-28'),('2034-04-29'),('2034-04-30'),('2034-05-01'),('2034-05-02'),('2034-05-03'),('2034-05-04'),('2034-05-05'),('2034-05-06'),('2034-05-07'),('2034-05-08'),('2034-05-09'),('2034-05-10'),('2034-05-11'),('2034-05-12'),('2034-05-13'),('2034-05-14'),('2034-05-15'),('2034-05-16'),('2034-05-17'),('2034-05-18'),('2034-05-19'),('2034-05-20'),('2034-05-21'),('2034-05-22'),('2034-05-23'),('2034-05-24'),('2034-05-25'),('2034-05-26'),('2034-05-27'),('2034-05-28'),('2034-05-29'),('2034-05-30'),('2034-05-31'),('2034-06-01'),('2034-06-02'),('2034-06-03'),('2034-06-04'),('2034-06-05'),('2034-06-06'),('2034-06-07'),('2034-06-08'),('2034-06-09'),('2034-06-10'),('2034-06-11'),('2034-06-12'),('2034-06-13'),('2034-06-14'),('2034-06-15'),('2034-06-16'),('2034-06-17'),('2034-06-18'),('2034-06-19'),('2034-06-20'),('2034-06-21'),('2034-06-22'),('2034-06-23'),('2034-06-24'),('2034-06-25'),('2034-06-26'),('2034-06-27'),('2034-06-28'),('2034-06-29'),('2034-06-30'),('2034-07-01'),('2034-07-02'),('2034-07-03'),('2034-07-04'),('2034-07-05'),('2034-07-06'),('2034-07-07'),('2034-07-08'),('2034-07-09'),('2034-07-10'),('2034-07-11'),('2034-07-12'),('2034-07-13'),('2034-07-14'),('2034-07-15'),('2034-07-16'),('2034-07-17'),('2034-07-18'),('2034-07-19'),('2034-07-20'),('2034-07-21'),('2034-07-22'),('2034-07-23'),('2034-07-24'),('2034-07-25'),('2034-07-26'),('2034-07-27'),('2034-07-28'),('2034-07-29'),('2034-07-30'),('2034-07-31'),('2034-08-01'),('2034-08-02'),('2034-08-03'),('2034-08-04'),('2034-08-05'),('2034-08-06'),('2034-08-07'),('2034-08-08'),('2034-08-09'),('2034-08-10'),('2034-08-11'),('2034-08-12'),('2034-08-13'),('2034-08-14'),('2034-08-15'),('2034-08-16'),('2034-08-17'),('2034-08-18'),('2034-08-19'),('2034-08-20'),('2034-08-21'),('2034-08-22'),('2034-08-23'),('2034-08-24'),('2034-08-25'),('2034-08-26'),('2034-08-27'),('2034-08-28'),('2034-08-29'),('2034-08-30'),('2034-08-31'),('2034-09-01'),('2034-09-02'),('2034-09-03'),('2034-09-04'),('2034-09-05'),('2034-09-06'),('2034-09-07'),('2034-09-08'),('2034-09-09'),('2034-09-10'),('2034-09-11'),('2034-09-12'),('2034-09-13'),('2034-09-14'),('2034-09-15'),('2034-09-16'),('2034-09-17'),('2034-09-18'),('2034-09-19'),('2034-09-20'),('2034-09-21'),('2034-09-22'),('2034-09-23'),('2034-09-24'),('2034-09-25'),('2034-09-26'),('2034-09-27'),('2034-09-28'),('2034-09-29'),('2034-09-30'),('2034-10-01'),('2034-10-02'),('2034-10-03'),('2034-10-04'),('2034-10-05'),('2034-10-06'),('2034-10-07'),('2034-10-08'),('2034-10-09'),('2034-10-10'),('2034-10-11'),('2034-10-12'),('2034-10-13'),('2034-10-14'),('2034-10-15'),('2034-10-16'),('2034-10-17'),('2034-10-18'),('2034-10-19'),('2034-10-20'),('2034-10-21'),('2034-10-22'),('2034-10-23'),('2034-10-24'),('2034-10-25'),('2034-10-26'),('2034-10-27'),('2034-10-28'),('2034-10-29'),('2034-10-30'),('2034-10-31'),('2034-11-01'),('2034-11-02'),('2034-11-03'),('2034-11-04'),('2034-11-05'),('2034-11-06'),('2034-11-07'),('2034-11-08'),('2034-11-09'),('2034-11-10'),('2034-11-11'),('2034-11-12'),('2034-11-13'),('2034-11-14'),('2034-11-15'),('2034-11-16'),('2034-11-17'),('2034-11-18'),('2034-11-19'),('2034-11-20'),('2034-11-21'),('2034-11-22'),('2034-11-23'),('2034-11-24'),('2034-11-25'),('2034-11-26'),('2034-11-27'),('2034-11-28'),('2034-11-29'),('2034-11-30'),('2034-12-01'),('2034-12-02'),('2034-12-03'),('2034-12-04'),('2034-12-05'),('2034-12-06'),('2034-12-07'),('2034-12-08'),('2034-12-09'),('2034-12-10'),('2034-12-11'),('2034-12-12'),('2034-12-13'),('2034-12-14'),('2034-12-15'),('2034-12-16'),('2034-12-17'),('2034-12-18'),('2034-12-19'),('2034-12-20'),('2034-12-21'),('2034-12-22'),('2034-12-23'),('2034-12-24'),('2034-12-25'),('2034-12-26'),('2034-12-27'),('2034-12-28'),('2034-12-29'),('2034-12-30'),('2034-12-31'),('2035-01-01'),('2035-01-02'),('2035-01-03'),('2035-01-04'),('2035-01-05'),('2035-01-06'),('2035-01-07'),('2035-01-08'),('2035-01-09'),('2035-01-10'),('2035-01-11'),('2035-01-12'),('2035-01-13'),('2035-01-14'),('2035-01-15'),('2035-01-16'),('2035-01-17'),('2035-01-18'),('2035-01-19'),('2035-01-20'),('2035-01-21'),('2035-01-22'),('2035-01-23'),('2035-01-24'),('2035-01-25'),('2035-01-26'),('2035-01-27'),('2035-01-28'),('2035-01-29'),('2035-01-30'),('2035-01-31'),('2035-02-01'),('2035-02-02'),('2035-02-03'),('2035-02-04'),('2035-02-05'),('2035-02-06'),('2035-02-07'),('2035-02-08'),('2035-02-09'),('2035-02-10'),('2035-02-11'),('2035-02-12'),('2035-02-13'),('2035-02-14'),('2035-02-15'),('2035-02-16'),('2035-02-17'),('2035-02-18'),('2035-02-19'),('2035-02-20'),('2035-02-21'),('2035-02-22'),('2035-02-23'),('2035-02-24'),('2035-02-25'),('2035-02-26'),('2035-02-27'),('2035-02-28'),('2035-03-01'),('2035-03-02'),('2035-03-03'),('2035-03-04'),('2035-03-05'),('2035-03-06'),('2035-03-07'),('2035-03-08'),('2035-03-09'),('2035-03-10'),('2035-03-11'),('2035-03-12'),('2035-03-13'),('2035-03-14'),('2035-03-15'),('2035-03-16'),('2035-03-17'),('2035-03-18'),('2035-03-19'),('2035-03-20'),('2035-03-21'),('2035-03-22'),('2035-03-23'),('2035-03-24'),('2035-03-25'),('2035-03-26'),('2035-03-27'),('2035-03-28'),('2035-03-29'),('2035-03-30'),('2035-03-31'),('2035-04-01'),('2035-04-02'),('2035-04-03'),('2035-04-04'),('2035-04-05'),('2035-04-06'),('2035-04-07'),('2035-04-08'),('2035-04-09'),('2035-04-10'),('2035-04-11'),('2035-04-12'),('2035-04-13'),('2035-04-14'),('2035-04-15'),('2035-04-16'),('2035-04-17'),('2035-04-18'),('2035-04-19'),('2035-04-20'),('2035-04-21'),('2035-04-22'),('2035-04-23'),('2035-04-24'),('2035-04-25'),('2035-04-26'),('2035-04-27'),('2035-04-28'),('2035-04-29'),('2035-04-30'),('2035-05-01'),('2035-05-02'),('2035-05-03'),('2035-05-04'),('2035-05-05'),('2035-05-06'),('2035-05-07'),('2035-05-08'),('2035-05-09'),('2035-05-10'),('2035-05-11'),('2035-05-12'),('2035-05-13'),('2035-05-14'),('2035-05-15'),('2035-05-16'),('2035-05-17'),('2035-05-18'),('2035-05-19'),('2035-05-20'),('2035-05-21'),('2035-05-22'),('2035-05-23'),('2035-05-24'),('2035-05-25'),('2035-05-26'),('2035-05-27'),('2035-05-28'),('2035-05-29'),('2035-05-30'),('2035-05-31'),('2035-06-01'),('2035-06-02'),('2035-06-03'),('2035-06-04'),('2035-06-05'),('2035-06-06'),('2035-06-07'),('2035-06-08'),('2035-06-09'),('2035-06-10'),('2035-06-11'),('2035-06-12'),('2035-06-13'),('2035-06-14'),('2035-06-15'),('2035-06-16'),('2035-06-17'),('2035-06-18'),('2035-06-19'),('2035-06-20'),('2035-06-21'),('2035-06-22'),('2035-06-23'),('2035-06-24'),('2035-06-25'),('2035-06-26'),('2035-06-27'),('2035-06-28'),('2035-06-29'),('2035-06-30'),('2035-07-01'),('2035-07-02'),('2035-07-03'),('2035-07-04'),('2035-07-05'),('2035-07-06'),('2035-07-07'),('2035-07-08'),('2035-07-09'),('2035-07-10'),('2035-07-11'),('2035-07-12'),('2035-07-13'),('2035-07-14'),('2035-07-15'),('2035-07-16'),('2035-07-17'),('2035-07-18'),('2035-07-19'),('2035-07-20'),('2035-07-21'),('2035-07-22'),('2035-07-23'),('2035-07-24'),('2035-07-25'),('2035-07-26'),('2035-07-27'),('2035-07-28'),('2035-07-29'),('2035-07-30'),('2035-07-31'),('2035-08-01'),('2035-08-02'),('2035-08-03'),('2035-08-04'),('2035-08-05'),('2035-08-06'),('2035-08-07'),('2035-08-08'),('2035-08-09'),('2035-08-10'),('2035-08-11'),('2035-08-12'),('2035-08-13'),('2035-08-14'),('2035-08-15'),('2035-08-16'),('2035-08-17'),('2035-08-18'),('2035-08-19'),('2035-08-20'),('2035-08-21'),('2035-08-22'),('2035-08-23'),('2035-08-24'),('2035-08-25'),('2035-08-26'),('2035-08-27'),('2035-08-28'),('2035-08-29'),('2035-08-30'),('2035-08-31'),('2035-09-01'),('2035-09-02'),('2035-09-03'),('2035-09-04'),('2035-09-05'),('2035-09-06'),('2035-09-07'),('2035-09-08'),('2035-09-09'),('2035-09-10'),('2035-09-11'),('2035-09-12'),('2035-09-13'),('2035-09-14'),('2035-09-15'),('2035-09-16'),('2035-09-17'),('2035-09-18'),('2035-09-19'),('2035-09-20'),('2035-09-21'),('2035-09-22'),('2035-09-23'),('2035-09-24'),('2035-09-25'),('2035-09-26'),('2035-09-27'),('2035-09-28'),('2035-09-29'),('2035-09-30'),('2035-10-01'),('2035-10-02'),('2035-10-03'),('2035-10-04'),('2035-10-05'),('2035-10-06'),('2035-10-07'),('2035-10-08'),('2035-10-09'),('2035-10-10'),('2035-10-11'),('2035-10-12'),('2035-10-13'),('2035-10-14'),('2035-10-15'),('2035-10-16'),('2035-10-17'),('2035-10-18'),('2035-10-19'),('2035-10-20'),('2035-10-21'),('2035-10-22'),('2035-10-23'),('2035-10-24'),('2035-10-25'),('2035-10-26'),('2035-10-27'),('2035-10-28'),('2035-10-29'),('2035-10-30'),('2035-10-31'),('2035-11-01'),('2035-11-02'),('2035-11-03'),('2035-11-04'),('2035-11-05'),('2035-11-06'),('2035-11-07'),('2035-11-08'),('2035-11-09'),('2035-11-10'),('2035-11-11'),('2035-11-12'),('2035-11-13'),('2035-11-14'),('2035-11-15'),('2035-11-16'),('2035-11-17'),('2035-11-18'),('2035-11-19'),('2035-11-20'),('2035-11-21'),('2035-11-22'),('2035-11-23'),('2035-11-24'),('2035-11-25'),('2035-11-26'),('2035-11-27'),('2035-11-28'),('2035-11-29'),('2035-11-30'),('2035-12-01'),('2035-12-02'),('2035-12-03'),('2035-12-04'),('2035-12-05'),('2035-12-06'),('2035-12-07'),('2035-12-08'),('2035-12-09'),('2035-12-10'),('2035-12-11'),('2035-12-12'),('2035-12-13'),('2035-12-14'),('2035-12-15'),('2035-12-16'),('2035-12-17'),('2035-12-18'),('2035-12-19'),('2035-12-20'),('2035-12-21'),('2035-12-22'),('2035-12-23'),('2035-12-24'),('2035-12-25'),('2035-12-26'),('2035-12-27'),('2035-12-28'),('2035-12-29'),('2035-12-30'),('2035-12-31'),('2036-01-01'),('2036-01-02'),('2036-01-03'),('2036-01-04'),('2036-01-05'),('2036-01-06'),('2036-01-07'),('2036-01-08'),('2036-01-09'),('2036-01-10'),('2036-01-11'),('2036-01-12'),('2036-01-13'),('2036-01-14'),('2036-01-15'),('2036-01-16'),('2036-01-17'),('2036-01-18'),('2036-01-19'),('2036-01-20'),('2036-01-21'),('2036-01-22'),('2036-01-23'),('2036-01-24'),('2036-01-25'),('2036-01-26'),('2036-01-27'),('2036-01-28'),('2036-01-29'),('2036-01-30'),('2036-01-31'),('2036-02-01'),('2036-02-02'),('2036-02-03'),('2036-02-04'),('2036-02-05'),('2036-02-06'),('2036-02-07'),('2036-02-08'),('2036-02-09'),('2036-02-10'),('2036-02-11'),('2036-02-12'),('2036-02-13'),('2036-02-14'),('2036-02-15'),('2036-02-16'),('2036-02-17'),('2036-02-18'),('2036-02-19'),('2036-02-20'),('2036-02-21'),('2036-02-22'),('2036-02-23'),('2036-02-24'),('2036-02-25'),('2036-02-26'),('2036-02-27'),('2036-02-28'),('2036-02-29'),('2036-03-01'),('2036-03-02'),('2036-03-03'),('2036-03-04'),('2036-03-05'),('2036-03-06'),('2036-03-07'),('2036-03-08'),('2036-03-09'),('2036-03-10'),('2036-03-11'),('2036-03-12'),('2036-03-13'),('2036-03-14'),('2036-03-15'),('2036-03-16'),('2036-03-17'),('2036-03-18'),('2036-03-19'),('2036-03-20'),('2036-03-21'),('2036-03-22'),('2036-03-23'),('2036-03-24'),('2036-03-25'),('2036-03-26'),('2036-03-27'),('2036-03-28'),('2036-03-29'),('2036-03-30'),('2036-03-31'),('2036-04-01'),('2036-04-02'),('2036-04-03'),('2036-04-04'),('2036-04-05'),('2036-04-06'),('2036-04-07'),('2036-04-08'),('2036-04-09'),('2036-04-10'),('2036-04-11'),('2036-04-12'),('2036-04-13'),('2036-04-14'),('2036-04-15'),('2036-04-16'),('2036-04-17'),('2036-04-18'),('2036-04-19'),('2036-04-20'),('2036-04-21'),('2036-04-22'),('2036-04-23'),('2036-04-24'),('2036-04-25'),('2036-04-26'),('2036-04-27'),('2036-04-28'),('2036-04-29'),('2036-04-30'),('2036-05-01'),('2036-05-02'),('2036-05-03'),('2036-05-04'),('2036-05-05'),('2036-05-06'),('2036-05-07'),('2036-05-08'),('2036-05-09'),('2036-05-10'),('2036-05-11'),('2036-05-12'),('2036-05-13'),('2036-05-14'),('2036-05-15'),('2036-05-16'),('2036-05-17'),('2036-05-18'),('2036-05-19'),('2036-05-20'),('2036-05-21'),('2036-05-22'),('2036-05-23'),('2036-05-24'),('2036-05-25'),('2036-05-26'),('2036-05-27'),('2036-05-28'),('2036-05-29'),('2036-05-30'),('2036-05-31'),('2036-06-01'),('2036-06-02'),('2036-06-03'),('2036-06-04'),('2036-06-05'),('2036-06-06'),('2036-06-07'),('2036-06-08'),('2036-06-09'),('2036-06-10'),('2036-06-11'),('2036-06-12'),('2036-06-13'),('2036-06-14'),('2036-06-15'),('2036-06-16'),('2036-06-17'),('2036-06-18'),('2036-06-19'),('2036-06-20'),('2036-06-21'),('2036-06-22'),('2036-06-23'),('2036-06-24'),('2036-06-25'),('2036-06-26'),('2036-06-27'),('2036-06-28'),('2036-06-29'),('2036-06-30'),('2036-07-01'),('2036-07-02'),('2036-07-03'),('2036-07-04'),('2036-07-05'),('2036-07-06'),('2036-07-07'),('2036-07-08'),('2036-07-09'),('2036-07-10'),('2036-07-11'),('2036-07-12'),('2036-07-13'),('2036-07-14'),('2036-07-15'),('2036-07-16'),('2036-07-17'),('2036-07-18'),('2036-07-19'),('2036-07-20'),('2036-07-21'),('2036-07-22'),('2036-07-23'),('2036-07-24'),('2036-07-25'),('2036-07-26'),('2036-07-27'),('2036-07-28'),('2036-07-29'),('2036-07-30'),('2036-07-31'),('2036-08-01'),('2036-08-02'),('2036-08-03'),('2036-08-04'),('2036-08-05'),('2036-08-06'),('2036-08-07'),('2036-08-08'),('2036-08-09'),('2036-08-10'),('2036-08-11'),('2036-08-12'),('2036-08-13'),('2036-08-14'),('2036-08-15'),('2036-08-16'),('2036-08-17'),('2036-08-18'),('2036-08-19'),('2036-08-20'),('2036-08-21'),('2036-08-22'),('2036-08-23'),('2036-08-24'),('2036-08-25'),('2036-08-26'),('2036-08-27'),('2036-08-28'),('2036-08-29'),('2036-08-30'),('2036-08-31'),('2036-09-01'),('2036-09-02'),('2036-09-03'),('2036-09-04'),('2036-09-05'),('2036-09-06'),('2036-09-07'),('2036-09-08'),('2036-09-09'),('2036-09-10'),('2036-09-11'),('2036-09-12'),('2036-09-13'),('2036-09-14'),('2036-09-15'),('2036-09-16'),('2036-09-17'),('2036-09-18'),('2036-09-19'),('2036-09-20'),('2036-09-21'),('2036-09-22'),('2036-09-23'),('2036-09-24'),('2036-09-25'),('2036-09-26'),('2036-09-27'),('2036-09-28'),('2036-09-29'),('2036-09-30'),('2036-10-01'),('2036-10-02'),('2036-10-03'),('2036-10-04'),('2036-10-05'),('2036-10-06'),('2036-10-07'),('2036-10-08'),('2036-10-09'),('2036-10-10'),('2036-10-11'),('2036-10-12'),('2036-10-13'),('2036-10-14'),('2036-10-15'),('2036-10-16'),('2036-10-17'),('2036-10-18'),('2036-10-19'),('2036-10-20'),('2036-10-21'),('2036-10-22'),('2036-10-23'),('2036-10-24'),('2036-10-25'),('2036-10-26'),('2036-10-27'),('2036-10-28'),('2036-10-29'),('2036-10-30'),('2036-10-31'),('2036-11-01'),('2036-11-02'),('2036-11-03'),('2036-11-04'),('2036-11-05'),('2036-11-06'),('2036-11-07'),('2036-11-08'),('2036-11-09'),('2036-11-10'),('2036-11-11'),('2036-11-12'),('2036-11-13'),('2036-11-14'),('2036-11-15'),('2036-11-16'),('2036-11-17'),('2036-11-18'),('2036-11-19'),('2036-11-20'),('2036-11-21'),('2036-11-22'),('2036-11-23'),('2036-11-24'),('2036-11-25'),('2036-11-26'),('2036-11-27'),('2036-11-28'),('2036-11-29'),('2036-11-30'),('2036-12-01'),('2036-12-02'),('2036-12-03'),('2036-12-04'),('2036-12-05'),('2036-12-06'),('2036-12-07'),('2036-12-08'),('2036-12-09'),('2036-12-10'),('2036-12-11'),('2036-12-12'),('2036-12-13'),('2036-12-14'),('2036-12-15'),('2036-12-16'),('2036-12-17'),('2036-12-18'),('2036-12-19'),('2036-12-20'),('2036-12-21'),('2036-12-22'),('2036-12-23'),('2036-12-24'),('2036-12-25'),('2036-12-26'),('2036-12-27'),('2036-12-28'),('2036-12-29'),('2036-12-30'),('2036-12-31'),('2037-01-01'),('2037-01-02'),('2037-01-03'),('2037-01-04'),('2037-01-05'),('2037-01-06'),('2037-01-07'),('2037-01-08'),('2037-01-09'),('2037-01-10'),('2037-01-11'),('2037-01-12'),('2037-01-13'),('2037-01-14'),('2037-01-15'),('2037-01-16'),('2037-01-17'),('2037-01-18'),('2037-01-19'),('2037-01-20'),('2037-01-21'),('2037-01-22'),('2037-01-23'),('2037-01-24'),('2037-01-25'),('2037-01-26'),('2037-01-27'),('2037-01-28'),('2037-01-29'),('2037-01-30'),('2037-01-31'),('2037-02-01'),('2037-02-02'),('2037-02-03'),('2037-02-04'),('2037-02-05'),('2037-02-06'),('2037-02-07'),('2037-02-08'),('2037-02-09'),('2037-02-10'),('2037-02-11'),('2037-02-12'),('2037-02-13'),('2037-02-14'),('2037-02-15'),('2037-02-16'),('2037-02-17'),('2037-02-18'),('2037-02-19'),('2037-02-20'),('2037-02-21'),('2037-02-22'),('2037-02-23'),('2037-02-24'),('2037-02-25'),('2037-02-26'),('2037-02-27'),('2037-02-28'),('2037-03-01'),('2037-03-02'),('2037-03-03'),('2037-03-04'),('2037-03-05'),('2037-03-06'),('2037-03-07'),('2037-03-08'),('2037-03-09'),('2037-03-10'),('2037-03-11'),('2037-03-12'),('2037-03-13'),('2037-03-14'),('2037-03-15'),('2037-03-16'),('2037-03-17'),('2037-03-18'),('2037-03-19'),('2037-03-20'),('2037-03-21'),('2037-03-22'),('2037-03-23'),('2037-03-24'),('2037-03-25'),('2037-03-26'),('2037-03-27'),('2037-03-28'),('2037-03-29'),('2037-03-30'),('2037-03-31'),('2037-04-01'),('2037-04-02'),('2037-04-03'),('2037-04-04'),('2037-04-05'),('2037-04-06'),('2037-04-07'),('2037-04-08'),('2037-04-09'),('2037-04-10'),('2037-04-11'),('2037-04-12'),('2037-04-13'),('2037-04-14'),('2037-04-15'),('2037-04-16'),('2037-04-17'),('2037-04-18'),('2037-04-19'),('2037-04-20'),('2037-04-21'),('2037-04-22'),('2037-04-23'),('2037-04-24'),('2037-04-25'),('2037-04-26'),('2037-04-27'),('2037-04-28'),('2037-04-29'),('2037-04-30'),('2037-05-01'),('2037-05-02'),('2037-05-03'),('2037-05-04'),('2037-05-05'),('2037-05-06'),('2037-05-07'),('2037-05-08'),('2037-05-09'),('2037-05-10'),('2037-05-11'),('2037-05-12'),('2037-05-13'),('2037-05-14'),('2037-05-15'),('2037-05-16'),('2037-05-17'),('2037-05-18'),('2037-05-19'),('2037-05-20'),('2037-05-21'),('2037-05-22'),('2037-05-23'),('2037-05-24'),('2037-05-25'),('2037-05-26'),('2037-05-27'),('2037-05-28'),('2037-05-29'),('2037-05-30'),('2037-05-31'),('2037-06-01'),('2037-06-02'),('2037-06-03'),('2037-06-04'),('2037-06-05'),('2037-06-06'),('2037-06-07'),('2037-06-08'),('2037-06-09'),('2037-06-10'),('2037-06-11'),('2037-06-12'),('2037-06-13'),('2037-06-14'),('2037-06-15'),('2037-06-16'),('2037-06-17'),('2037-06-18'),('2037-06-19'),('2037-06-20'),('2037-06-21'),('2037-06-22'),('2037-06-23'),('2037-06-24'),('2037-06-25'),('2037-06-26'),('2037-06-27'),('2037-06-28'),('2037-06-29'),('2037-06-30'),('2037-07-01'),('2037-07-02'),('2037-07-03'),('2037-07-04'),('2037-07-05'),('2037-07-06'),('2037-07-07'),('2037-07-08'),('2037-07-09'),('2037-07-10'),('2037-07-11'),('2037-07-12'),('2037-07-13'),('2037-07-14'),('2037-07-15'),('2037-07-16'),('2037-07-17'),('2037-07-18'),('2037-07-19'),('2037-07-20'),('2037-07-21'),('2037-07-22'),('2037-07-23'),('2037-07-24'),('2037-07-25'),('2037-07-26'),('2037-07-27'),('2037-07-28'),('2037-07-29'),('2037-07-30'),('2037-07-31'),('2037-08-01'),('2037-08-02'),('2037-08-03'),('2037-08-04'),('2037-08-05'),('2037-08-06'),('2037-08-07'),('2037-08-08'),('2037-08-09'),('2037-08-10'),('2037-08-11'),('2037-08-12'),('2037-08-13'),('2037-08-14'),('2037-08-15'),('2037-08-16'),('2037-08-17'),('2037-08-18'),('2037-08-19'),('2037-08-20'),('2037-08-21'),('2037-08-22'),('2037-08-23'),('2037-08-24'),('2037-08-25'),('2037-08-26'),('2037-08-27'),('2037-08-28'),('2037-08-29'),('2037-08-30'),('2037-08-31'),('2037-09-01'),('2037-09-02'),('2037-09-03'),('2037-09-04'),('2037-09-05'),('2037-09-06'),('2037-09-07'),('2037-09-08'),('2037-09-09'),('2037-09-10'),('2037-09-11'),('2037-09-12'),('2037-09-13'),('2037-09-14'),('2037-09-15'),('2037-09-16'),('2037-09-17'),('2037-09-18'),('2037-09-19'),('2037-09-20'),('2037-09-21'),('2037-09-22'),('2037-09-23'),('2037-09-24'),('2037-09-25'),('2037-09-26'),('2037-09-27'),('2037-09-28'),('2037-09-29'),('2037-09-30'),('2037-10-01'),('2037-10-02'),('2037-10-03'),('2037-10-04'),('2037-10-05'),('2037-10-06'),('2037-10-07'),('2037-10-08'),('2037-10-09'),('2037-10-10'),('2037-10-11'),('2037-10-12'),('2037-10-13'),('2037-10-14'),('2037-10-15'),('2037-10-16'),('2037-10-17'),('2037-10-18'),('2037-10-19'),('2037-10-20'),('2037-10-21'),('2037-10-22'),('2037-10-23'),('2037-10-24'),('2037-10-25'),('2037-10-26'),('2037-10-27'),('2037-10-28'),('2037-10-29'),('2037-10-30'),('2037-10-31'),('2037-11-01'),('2037-11-02'),('2037-11-03'),('2037-11-04'),('2037-11-05'),('2037-11-06'),('2037-11-07'),('2037-11-08'),('2037-11-09'),('2037-11-10'),('2037-11-11'),('2037-11-12'),('2037-11-13'),('2037-11-14'),('2037-11-15'),('2037-11-16'),('2037-11-17'),('2037-11-18'),('2037-11-19'),('2037-11-20'),('2037-11-21'),('2037-11-22'),('2037-11-23'),('2037-11-24'),('2037-11-25'),('2037-11-26'),('2037-11-27'),('2037-11-28'),('2037-11-29'),('2037-11-30'),('2037-12-01'),('2037-12-02'),('2037-12-03'),('2037-12-04'),('2037-12-05'),('2037-12-06'),('2037-12-07'),('2037-12-08'),('2037-12-09'),('2037-12-10'),('2037-12-11'),('2037-12-12'),('2037-12-13'),('2037-12-14'),('2037-12-15'),('2037-12-16'),('2037-12-17'),('2037-12-18'),('2037-12-19'),('2037-12-20'),('2037-12-21'),('2037-12-22'),('2037-12-23'),('2037-12-24'),('2037-12-25'),('2037-12-26'),('2037-12-27'),('2037-12-28'),('2037-12-29'),('2037-12-30'),('2037-12-31'),('2038-01-01'),('2038-01-02'),('2038-01-03'),('2038-01-04'),('2038-01-05'),('2038-01-06'),('2038-01-07'),('2038-01-08'),('2038-01-09'),('2038-01-10'),('2038-01-11'),('2038-01-12'),('2038-01-13'),('2038-01-14'),('2038-01-15'),('2038-01-16'),('2038-01-17'),('2038-01-18'),('2038-01-19'),('2038-01-20'),('2038-01-21'),('2038-01-22'),('2038-01-23'),('2038-01-24'),('2038-01-25'),('2038-01-26'),('2038-01-27'),('2038-01-28'),('2038-01-29'),('2038-01-30'),('2038-01-31'),('2038-02-01'),('2038-02-02'),('2038-02-03'),('2038-02-04'),('2038-02-05'),('2038-02-06'),('2038-02-07'),('2038-02-08'),('2038-02-09'),('2038-02-10'),('2038-02-11'),('2038-02-12'),('2038-02-13'),('2038-02-14'),('2038-02-15'),('2038-02-16'),('2038-02-17'),('2038-02-18'),('2038-02-19'),('2038-02-20'),('2038-02-21'),('2038-02-22'),('2038-02-23'),('2038-02-24'),('2038-02-25'),('2038-02-26'),('2038-02-27'),('2038-02-28'),('2038-03-01'),('2038-03-02'),('2038-03-03'),('2038-03-04'),('2038-03-05'),('2038-03-06'),('2038-03-07'),('2038-03-08'),('2038-03-09'),('2038-03-10'),('2038-03-11'),('2038-03-12'),('2038-03-13'),('2038-03-14'),('2038-03-15'),('2038-03-16'),('2038-03-17'),('2038-03-18'),('2038-03-19'),('2038-03-20'),('2038-03-21'),('2038-03-22'),('2038-03-23'),('2038-03-24'),('2038-03-25'),('2038-03-26'),('2038-03-27'),('2038-03-28'),('2038-03-29'),('2038-03-30'),('2038-03-31'),('2038-04-01'),('2038-04-02'),('2038-04-03'),('2038-04-04'),('2038-04-05'),('2038-04-06'),('2038-04-07'),('2038-04-08'),('2038-04-09'),('2038-04-10'),('2038-04-11'),('2038-04-12'),('2038-04-13'),('2038-04-14'),('2038-04-15'),('2038-04-16'),('2038-04-17'),('2038-04-18'),('2038-04-19'),('2038-04-20'),('2038-04-21'),('2038-04-22'),('2038-04-23'),('2038-04-24'),('2038-04-25'),('2038-04-26'),('2038-04-27'),('2038-04-28'),('2038-04-29'),('2038-04-30'),('2038-05-01'),('2038-05-02'),('2038-05-03'),('2038-05-04'),('2038-05-05'),('2038-05-06'),('2038-05-07'),('2038-05-08'),('2038-05-09'),('2038-05-10'),('2038-05-11'),('2038-05-12'),('2038-05-13'),('2038-05-14'),('2038-05-15'),('2038-05-16'),('2038-05-17'),('2038-05-18'),('2038-05-19'),('2038-05-20'),('2038-05-21'),('2038-05-22'),('2038-05-23'),('2038-05-24'),('2038-05-25'),('2038-05-26'),('2038-05-27'),('2038-05-28'),('2038-05-29'),('2038-05-30'),('2038-05-31'),('2038-06-01'),('2038-06-02'),('2038-06-03'),('2038-06-04'),('2038-06-05'),('2038-06-06'),('2038-06-07'),('2038-06-08'),('2038-06-09'),('2038-06-10'),('2038-06-11'),('2038-06-12'),('2038-06-13'),('2038-06-14'),('2038-06-15'),('2038-06-16'),('2038-06-17'),('2038-06-18'),('2038-06-19'),('2038-06-20'),('2038-06-21'),('2038-06-22'),('2038-06-23'),('2038-06-24'),('2038-06-25'),('2038-06-26'),('2038-06-27'),('2038-06-28'),('2038-06-29'),('2038-06-30'),('2038-07-01'),('2038-07-02'),('2038-07-03'),('2038-07-04'),('2038-07-05'),('2038-07-06'),('2038-07-07'),('2038-07-08'),('2038-07-09'),('2038-07-10'),('2038-07-11'),('2038-07-12'),('2038-07-13'),('2038-07-14'),('2038-07-15'),('2038-07-16'),('2038-07-17'),('2038-07-18'),('2038-07-19'),('2038-07-20'),('2038-07-21'),('2038-07-22'),('2038-07-23'),('2038-07-24'),('2038-07-25'),('2038-07-26'),('2038-07-27'),('2038-07-28'),('2038-07-29'),('2038-07-30'),('2038-07-31'),('2038-08-01'),('2038-08-02'),('2038-08-03'),('2038-08-04'),('2038-08-05'),('2038-08-06'),('2038-08-07'),('2038-08-08'),('2038-08-09'),('2038-08-10'),('2038-08-11'),('2038-08-12'),('2038-08-13'),('2038-08-14'),('2038-08-15'),('2038-08-16'),('2038-08-17'),('2038-08-18'),('2038-08-19'),('2038-08-20'),('2038-08-21'),('2038-08-22'),('2038-08-23'),('2038-08-24'),('2038-08-25'),('2038-08-26'),('2038-08-27'),('2038-08-28'),('2038-08-29'),('2038-08-30'),('2038-08-31'),('2038-09-01'),('2038-09-02'),('2038-09-03'),('2038-09-04'),('2038-09-05'),('2038-09-06'),('2038-09-07'),('2038-09-08'),('2038-09-09'),('2038-09-10'),('2038-09-11'),('2038-09-12'),('2038-09-13'),('2038-09-14'),('2038-09-15'),('2038-09-16'),('2038-09-17'),('2038-09-18'),('2038-09-19'),('2038-09-20'),('2038-09-21'),('2038-09-22'),('2038-09-23'),('2038-09-24'),('2038-09-25'),('2038-09-26'),('2038-09-27'),('2038-09-28'),('2038-09-29'),('2038-09-30'),('2038-10-01'),('2038-10-02'),('2038-10-03'),('2038-10-04'),('2038-10-05'),('2038-10-06'),('2038-10-07'),('2038-10-08'),('2038-10-09'),('2038-10-10'),('2038-10-11'),('2038-10-12'),('2038-10-13'),('2038-10-14'),('2038-10-15'),('2038-10-16'),('2038-10-17'),('2038-10-18'),('2038-10-19'),('2038-10-20'),('2038-10-21'),('2038-10-22'),('2038-10-23'),('2038-10-24'),('2038-10-25'),('2038-10-26'),('2038-10-27'),('2038-10-28'),('2038-10-29'),('2038-10-30'),('2038-10-31'),('2038-11-01'),('2038-11-02'),('2038-11-03'),('2038-11-04'),('2038-11-05'),('2038-11-06'),('2038-11-07'),('2038-11-08'),('2038-11-09'),('2038-11-10'),('2038-11-11'),('2038-11-12'),('2038-11-13'),('2038-11-14'),('2038-11-15'),('2038-11-16'),('2038-11-17'),('2038-11-18'),('2038-11-19'),('2038-11-20'),('2038-11-21'),('2038-11-22'),('2038-11-23'),('2038-11-24'),('2038-11-25'),('2038-11-26'),('2038-11-27'),('2038-11-28'),('2038-11-29'),('2038-11-30'),('2038-12-01'),('2038-12-02'),('2038-12-03'),('2038-12-04'),('2038-12-05'),('2038-12-06'),('2038-12-07'),('2038-12-08'),('2038-12-09'),('2038-12-10'),('2038-12-11'),('2038-12-12'),('2038-12-13'),('2038-12-14'),('2038-12-15'),('2038-12-16'),('2038-12-17'),('2038-12-18'),('2038-12-19'),('2038-12-20'),('2038-12-21'),('2038-12-22'),('2038-12-23'),('2038-12-24'),('2038-12-25'),('2038-12-26'),('2038-12-27'),('2038-12-28'),('2038-12-29'),('2038-12-30'),('2038-12-31'),('2039-01-01'),('2039-01-02'),('2039-01-03'),('2039-01-04'),('2039-01-05'),('2039-01-06'),('2039-01-07'),('2039-01-08'),('2039-01-09'),('2039-01-10'),('2039-01-11'),('2039-01-12'),('2039-01-13'),('2039-01-14'),('2039-01-15'),('2039-01-16'),('2039-01-17'),('2039-01-18'),('2039-01-19'),('2039-01-20'),('2039-01-21'),('2039-01-22'),('2039-01-23'),('2039-01-24'),('2039-01-25'),('2039-01-26'),('2039-01-27'),('2039-01-28'),('2039-01-29'),('2039-01-30'),('2039-01-31'),('2039-02-01'),('2039-02-02'),('2039-02-03'),('2039-02-04'),('2039-02-05'),('2039-02-06'),('2039-02-07'),('2039-02-08'),('2039-02-09'),('2039-02-10'),('2039-02-11'),('2039-02-12'),('2039-02-13'),('2039-02-14'),('2039-02-15'),('2039-02-16'),('2039-02-17'),('2039-02-18'),('2039-02-19'),('2039-02-20'),('2039-02-21'),('2039-02-22'),('2039-02-23'),('2039-02-24'),('2039-02-25'),('2039-02-26'),('2039-02-27'),('2039-02-28'),('2039-03-01'),('2039-03-02'),('2039-03-03'),('2039-03-04'),('2039-03-05'),('2039-03-06'),('2039-03-07'),('2039-03-08'),('2039-03-09'),('2039-03-10'),('2039-03-11'),('2039-03-12'),('2039-03-13'),('2039-03-14'),('2039-03-15'),('2039-03-16'),('2039-03-17'),('2039-03-18'),('2039-03-19'),('2039-03-20'),('2039-03-21'),('2039-03-22'),('2039-03-23'),('2039-03-24'),('2039-03-25'),('2039-03-26'),('2039-03-27'),('2039-03-28'),('2039-03-29'),('2039-03-30'),('2039-03-31'),('2039-04-01'),('2039-04-02'),('2039-04-03'),('2039-04-04'),('2039-04-05'),('2039-04-06'),('2039-04-07'),('2039-04-08'),('2039-04-09'),('2039-04-10'),('2039-04-11'),('2039-04-12'),('2039-04-13'),('2039-04-14'),('2039-04-15'),('2039-04-16'),('2039-04-17'),('2039-04-18'),('2039-04-19'),('2039-04-20'),('2039-04-21'),('2039-04-22'),('2039-04-23'),('2039-04-24'),('2039-04-25'),('2039-04-26'),('2039-04-27'),('2039-04-28'),('2039-04-29'),('2039-04-30'),('2039-05-01'),('2039-05-02'),('2039-05-03'),('2039-05-04'),('2039-05-05'),('2039-05-06'),('2039-05-07'),('2039-05-08'),('2039-05-09'),('2039-05-10'),('2039-05-11'),('2039-05-12'),('2039-05-13'),('2039-05-14'),('2039-05-15'),('2039-05-16'),('2039-05-17'),('2039-05-18'),('2039-05-19'),('2039-05-20'),('2039-05-21'),('2039-05-22'),('2039-05-23'),('2039-05-24'),('2039-05-25'),('2039-05-26'),('2039-05-27'),('2039-05-28'),('2039-05-29'),('2039-05-30'),('2039-05-31'),('2039-06-01'),('2039-06-02'),('2039-06-03'),('2039-06-04'),('2039-06-05'),('2039-06-06'),('2039-06-07'),('2039-06-08'),('2039-06-09'),('2039-06-10'),('2039-06-11'),('2039-06-12'),('2039-06-13'),('2039-06-14'),('2039-06-15'),('2039-06-16'),('2039-06-17'),('2039-06-18'),('2039-06-19'),('2039-06-20'),('2039-06-21'),('2039-06-22'),('2039-06-23'),('2039-06-24'),('2039-06-25'),('2039-06-26'),('2039-06-27'),('2039-06-28'),('2039-06-29'),('2039-06-30'),('2039-07-01'),('2039-07-02'),('2039-07-03'),('2039-07-04'),('2039-07-05'),('2039-07-06'),('2039-07-07'),('2039-07-08'),('2039-07-09'),('2039-07-10'),('2039-07-11'),('2039-07-12'),('2039-07-13'),('2039-07-14'),('2039-07-15'),('2039-07-16'),('2039-07-17'),('2039-07-18'),('2039-07-19'),('2039-07-20'),('2039-07-21'),('2039-07-22'),('2039-07-23'),('2039-07-24'),('2039-07-25'),('2039-07-26'),('2039-07-27'),('2039-07-28'),('2039-07-29'),('2039-07-30'),('2039-07-31'),('2039-08-01'),('2039-08-02'),('2039-08-03'),('2039-08-04'),('2039-08-05'),('2039-08-06'),('2039-08-07'),('2039-08-08'),('2039-08-09'),('2039-08-10'),('2039-08-11'),('2039-08-12'),('2039-08-13'),('2039-08-14'),('2039-08-15'),('2039-08-16'),('2039-08-17'),('2039-08-18'),('2039-08-19'),('2039-08-20'),('2039-08-21'),('2039-08-22'),('2039-08-23'),('2039-08-24'),('2039-08-25'),('2039-08-26'),('2039-08-27'),('2039-08-28'),('2039-08-29'),('2039-08-30'),('2039-08-31'),('2039-09-01'),('2039-09-02'),('2039-09-03'),('2039-09-04'),('2039-09-05'),('2039-09-06'),('2039-09-07'),('2039-09-08'),('2039-09-09'),('2039-09-10'),('2039-09-11'),('2039-09-12'),('2039-09-13'),('2039-09-14'),('2039-09-15'),('2039-09-16'),('2039-09-17'),('2039-09-18'),('2039-09-19'),('2039-09-20'),('2039-09-21'),('2039-09-22'),('2039-09-23'),('2039-09-24'),('2039-09-25'),('2039-09-26'),('2039-09-27'),('2039-09-28'),('2039-09-29'),('2039-09-30'),('2039-10-01'),('2039-10-02'),('2039-10-03'),('2039-10-04'),('2039-10-05'),('2039-10-06'),('2039-10-07'),('2039-10-08'),('2039-10-09'),('2039-10-10'),('2039-10-11'),('2039-10-12'),('2039-10-13'),('2039-10-14'),('2039-10-15'),('2039-10-16'),('2039-10-17'),('2039-10-18'),('2039-10-19'),('2039-10-20'),('2039-10-21'),('2039-10-22'),('2039-10-23'),('2039-10-24'),('2039-10-25'),('2039-10-26'),('2039-10-27'),('2039-10-28'),('2039-10-29'),('2039-10-30'),('2039-10-31'),('2039-11-01'),('2039-11-02'),('2039-11-03'),('2039-11-04'),('2039-11-05'),('2039-11-06'),('2039-11-07'),('2039-11-08'),('2039-11-09'),('2039-11-10'),('2039-11-11'),('2039-11-12'),('2039-11-13'),('2039-11-14'),('2039-11-15'),('2039-11-16'),('2039-11-17'),('2039-11-18'),('2039-11-19'),('2039-11-20'),('2039-11-21'),('2039-11-22'),('2039-11-23'),('2039-11-24'),('2039-11-25'),('2039-11-26'),('2039-11-27'),('2039-11-28'),('2039-11-29'),('2039-11-30'),('2039-12-01'),('2039-12-02'),('2039-12-03'),('2039-12-04'),('2039-12-05'),('2039-12-06'),('2039-12-07'),('2039-12-08'),('2039-12-09'),('2039-12-10'),('2039-12-11'),('2039-12-12'),('2039-12-13'),('2039-12-14'),('2039-12-15'),('2039-12-16'),('2039-12-17'),('2039-12-18'),('2039-12-19'),('2039-12-20'),('2039-12-21'),('2039-12-22'),('2039-12-23'),('2039-12-24'),('2039-12-25'),('2039-12-26'),('2039-12-27'),('2039-12-28'),('2039-12-29'),('2039-12-30'),('2039-12-31'),('2040-01-01'),('2040-01-02'),('2040-01-03'),('2040-01-04'),('2040-01-05'),('2040-01-06'),('2040-01-07'),('2040-01-08'),('2040-01-09'),('2040-01-10'),('2040-01-11'),('2040-01-12'),('2040-01-13'),('2040-01-14'),('2040-01-15'),('2040-01-16'),('2040-01-17'),('2040-01-18'),('2040-01-19'),('2040-01-20'),('2040-01-21'),('2040-01-22'),('2040-01-23'),('2040-01-24'),('2040-01-25'),('2040-01-26'),('2040-01-27'),('2040-01-28'),('2040-01-29'),('2040-01-30'),('2040-01-31'),('2040-02-01'),('2040-02-02'),('2040-02-03'),('2040-02-04'),('2040-02-05'),('2040-02-06'),('2040-02-07'),('2040-02-08'),('2040-02-09'),('2040-02-10'),('2040-02-11'),('2040-02-12'),('2040-02-13'),('2040-02-14'),('2040-02-15'),('2040-02-16'),('2040-02-17'),('2040-02-18'),('2040-02-19'),('2040-02-20'),('2040-02-21'),('2040-02-22'),('2040-02-23'),('2040-02-24'),('2040-02-25'),('2040-02-26'),('2040-02-27'),('2040-02-28'),('2040-02-29'),('2040-03-01'),('2040-03-02'),('2040-03-03'),('2040-03-04'),('2040-03-05'),('2040-03-06'),('2040-03-07'),('2040-03-08'),('2040-03-09'),('2040-03-10'),('2040-03-11'),('2040-03-12'),('2040-03-13'),('2040-03-14'),('2040-03-15'),('2040-03-16'),('2040-03-17'),('2040-03-18'),('2040-03-19'),('2040-03-20'),('2040-03-21'),('2040-03-22'),('2040-03-23'),('2040-03-24'),('2040-03-25'),('2040-03-26'),('2040-03-27'),('2040-03-28'),('2040-03-29'),('2040-03-30'),('2040-03-31'),('2040-04-01'),('2040-04-02'),('2040-04-03'),('2040-04-04'),('2040-04-05'),('2040-04-06'),('2040-04-07'),('2040-04-08'),('2040-04-09'),('2040-04-10'),('2040-04-11'),('2040-04-12'),('2040-04-13'),('2040-04-14'),('2040-04-15'),('2040-04-16'),('2040-04-17'),('2040-04-18'),('2040-04-19'),('2040-04-20'),('2040-04-21'),('2040-04-22'),('2040-04-23'),('2040-04-24'),('2040-04-25'),('2040-04-26'),('2040-04-27'),('2040-04-28'),('2040-04-29'),('2040-04-30'),('2040-05-01'),('2040-05-02'),('2040-05-03'),('2040-05-04'),('2040-05-05'),('2040-05-06'),('2040-05-07'),('2040-05-08'),('2040-05-09'),('2040-05-10'),('2040-05-11'),('2040-05-12'),('2040-05-13'),('2040-05-14'),('2040-05-15'),('2040-05-16'),('2040-05-17'),('2040-05-18'),('2040-05-19'),('2040-05-20'),('2040-05-21'),('2040-05-22'),('2040-05-23'),('2040-05-24'),('2040-05-25'),('2040-05-26'),('2040-05-27'),('2040-05-28'),('2040-05-29'),('2040-05-30'),('2040-05-31'),('2040-06-01'),('2040-06-02'),('2040-06-03'),('2040-06-04'),('2040-06-05'),('2040-06-06'),('2040-06-07'),('2040-06-08'),('2040-06-09'),('2040-06-10'),('2040-06-11'),('2040-06-12'),('2040-06-13'),('2040-06-14'),('2040-06-15'),('2040-06-16'),('2040-06-17'),('2040-06-18'),('2040-06-19'),('2040-06-20'),('2040-06-21'),('2040-06-22'),('2040-06-23'),('2040-06-24'),('2040-06-25'),('2040-06-26'),('2040-06-27'),('2040-06-28'),('2040-06-29'),('2040-06-30'),('2040-07-01'),('2040-07-02'),('2040-07-03'),('2040-07-04'),('2040-07-05'),('2040-07-06'),('2040-07-07'),('2040-07-08'),('2040-07-09'),('2040-07-10'),('2040-07-11'),('2040-07-12'),('2040-07-13'),('2040-07-14'),('2040-07-15'),('2040-07-16'),('2040-07-17'),('2040-07-18'),('2040-07-19'),('2040-07-20'),('2040-07-21'),('2040-07-22'),('2040-07-23'),('2040-07-24'),('2040-07-25'),('2040-07-26'),('2040-07-27'),('2040-07-28'),('2040-07-29'),('2040-07-30'),('2040-07-31'),('2040-08-01'),('2040-08-02'),('2040-08-03'),('2040-08-04'),('2040-08-05'),('2040-08-06'),('2040-08-07'),('2040-08-08'),('2040-08-09'),('2040-08-10'),('2040-08-11'),('2040-08-12'),('2040-08-13'),('2040-08-14'),('2040-08-15'),('2040-08-16'),('2040-08-17'),('2040-08-18'),('2040-08-19'),('2040-08-20'),('2040-08-21'),('2040-08-22'),('2040-08-23'),('2040-08-24'),('2040-08-25'),('2040-08-26'),('2040-08-27'),('2040-08-28'),('2040-08-29'),('2040-08-30'),('2040-08-31'),('2040-09-01'),('2040-09-02'),('2040-09-03'),('2040-09-04'),('2040-09-05'),('2040-09-06'),('2040-09-07'),('2040-09-08'),('2040-09-09'),('2040-09-10'),('2040-09-11'),('2040-09-12'),('2040-09-13'),('2040-09-14'),('2040-09-15'),('2040-09-16'),('2040-09-17'),('2040-09-18'),('2040-09-19'),('2040-09-20'),('2040-09-21'),('2040-09-22'),('2040-09-23'),('2040-09-24'),('2040-09-25'),('2040-09-26'),('2040-09-27'),('2040-09-28'),('2040-09-29'),('2040-09-30'),('2040-10-01'),('2040-10-02'),('2040-10-03'),('2040-10-04'),('2040-10-05'),('2040-10-06'),('2040-10-07'),('2040-10-08'),('2040-10-09'),('2040-10-10'),('2040-10-11'),('2040-10-12'),('2040-10-13'),('2040-10-14'),('2040-10-15'),('2040-10-16'),('2040-10-17'),('2040-10-18'),('2040-10-19'),('2040-10-20'),('2040-10-21'),('2040-10-22'),('2040-10-23'),('2040-10-24'),('2040-10-25'),('2040-10-26'),('2040-10-27'),('2040-10-28'),('2040-10-29'),('2040-10-30'),('2040-10-31'),('2040-11-01'),('2040-11-02'),('2040-11-03'),('2040-11-04'),('2040-11-05'),('2040-11-06'),('2040-11-07'),('2040-11-08'),('2040-11-09'),('2040-11-10'),('2040-11-11'),('2040-11-12'),('2040-11-13'),('2040-11-14'),('2040-11-15'),('2040-11-16'),('2040-11-17'),('2040-11-18'),('2040-11-19'),('2040-11-20'),('2040-11-21'),('2040-11-22'),('2040-11-23'),('2040-11-24'),('2040-11-25'),('2040-11-26'),('2040-11-27'),('2040-11-28'),('2040-11-29'),('2040-11-30'),('2040-12-01'),('2040-12-02'),('2040-12-03'),('2040-12-04'),('2040-12-05'),('2040-12-06'),('2040-12-07'),('2040-12-08'),('2040-12-09'),('2040-12-10'),('2040-12-11'),('2040-12-12'),('2040-12-13'),('2040-12-14'),('2040-12-15'),('2040-12-16'),('2040-12-17'),('2040-12-18'),('2040-12-19'),('2040-12-20'),('2040-12-21'),('2040-12-22'),('2040-12-23'),('2040-12-24'),('2040-12-25'),('2040-12-26'),('2040-12-27'),('2040-12-28'),('2040-12-29'),('2040-12-30'),('2040-12-31'),('2041-01-01'),('2041-01-02'),('2041-01-03'),('2041-01-04'),('2041-01-05'),('2041-01-06'),('2041-01-07'),('2041-01-08'),('2041-01-09'),('2041-01-10'),('2041-01-11'),('2041-01-12'),('2041-01-13'),('2041-01-14'),('2041-01-15'),('2041-01-16'),('2041-01-17'),('2041-01-18'),('2041-01-19'),('2041-01-20'),('2041-01-21'),('2041-01-22'),('2041-01-23'),('2041-01-24'),('2041-01-25'),('2041-01-26'),('2041-01-27'),('2041-01-28'),('2041-01-29'),('2041-01-30'),('2041-01-31'),('2041-02-01'),('2041-02-02'),('2041-02-03'),('2041-02-04'),('2041-02-05'),('2041-02-06'),('2041-02-07'),('2041-02-08'),('2041-02-09'),('2041-02-10'),('2041-02-11'),('2041-02-12'),('2041-02-13'),('2041-02-14'),('2041-02-15'),('2041-02-16'),('2041-02-17'),('2041-02-18'),('2041-02-19'),('2041-02-20'),('2041-02-21'),('2041-02-22'),('2041-02-23'),('2041-02-24'),('2041-02-25'),('2041-02-26'),('2041-02-27'),('2041-02-28'),('2041-03-01'),('2041-03-02'),('2041-03-03'),('2041-03-04'),('2041-03-05'),('2041-03-06'),('2041-03-07'),('2041-03-08'),('2041-03-09'),('2041-03-10'),('2041-03-11'),('2041-03-12'),('2041-03-13'),('2041-03-14'),('2041-03-15'),('2041-03-16'),('2041-03-17'),('2041-03-18'),('2041-03-19'),('2041-03-20'),('2041-03-21'),('2041-03-22'),('2041-03-23'),('2041-03-24'),('2041-03-25'),('2041-03-26'),('2041-03-27'),('2041-03-28'),('2041-03-29'),('2041-03-30'),('2041-03-31'),('2041-04-01'),('2041-04-02'),('2041-04-03'),('2041-04-04'),('2041-04-05'),('2041-04-06'),('2041-04-07'),('2041-04-08'),('2041-04-09'),('2041-04-10'),('2041-04-11'),('2041-04-12'),('2041-04-13'),('2041-04-14'),('2041-04-15'),('2041-04-16'),('2041-04-17'),('2041-04-18'),('2041-04-19'),('2041-04-20'),('2041-04-21'),('2041-04-22'),('2041-04-23'),('2041-04-24'),('2041-04-25'),('2041-04-26'),('2041-04-27'),('2041-04-28'),('2041-04-29'),('2041-04-30'),('2041-05-01'),('2041-05-02'),('2041-05-03'),('2041-05-04'),('2041-05-05'),('2041-05-06'),('2041-05-07'),('2041-05-08'),('2041-05-09'),('2041-05-10'),('2041-05-11'),('2041-05-12'),('2041-05-13'),('2041-05-14'),('2041-05-15'),('2041-05-16'),('2041-05-17'),('2041-05-18'),('2041-05-19'),('2041-05-20'),('2041-05-21'),('2041-05-22'),('2041-05-23'),('2041-05-24'),('2041-05-25'),('2041-05-26'),('2041-05-27'),('2041-05-28'),('2041-05-29'),('2041-05-30'),('2041-05-31'),('2041-06-01'),('2041-06-02'),('2041-06-03'),('2041-06-04'),('2041-06-05'),('2041-06-06'),('2041-06-07'),('2041-06-08'),('2041-06-09'),('2041-06-10'),('2041-06-11'),('2041-06-12'),('2041-06-13'),('2041-06-14'),('2041-06-15'),('2041-06-16'),('2041-06-17'),('2041-06-18'),('2041-06-19'),('2041-06-20'),('2041-06-21'),('2041-06-22'),('2041-06-23'),('2041-06-24'),('2041-06-25'),('2041-06-26'),('2041-06-27'),('2041-06-28'),('2041-06-29'),('2041-06-30'),('2041-07-01'),('2041-07-02'),('2041-07-03'),('2041-07-04'),('2041-07-05'),('2041-07-06'),('2041-07-07'),('2041-07-08'),('2041-07-09'),('2041-07-10'),('2041-07-11'),('2041-07-12'),('2041-07-13'),('2041-07-14'),('2041-07-15'),('2041-07-16'),('2041-07-17'),('2041-07-18'),('2041-07-19'),('2041-07-20'),('2041-07-21'),('2041-07-22'),('2041-07-23'),('2041-07-24'),('2041-07-25'),('2041-07-26'),('2041-07-27'),('2041-07-28'),('2041-07-29'),('2041-07-30'),('2041-07-31'),('2041-08-01'),('2041-08-02'),('2041-08-03'),('2041-08-04'),('2041-08-05'),('2041-08-06'),('2041-08-07'),('2041-08-08'),('2041-08-09'),('2041-08-10'),('2041-08-11'),('2041-08-12'),('2041-08-13'),('2041-08-14'),('2041-08-15'),('2041-08-16'),('2041-08-17'),('2041-08-18'),('2041-08-19'),('2041-08-20'),('2041-08-21'),('2041-08-22'),('2041-08-23'),('2041-08-24'),('2041-08-25'),('2041-08-26'),('2041-08-27'),('2041-08-28'),('2041-08-29'),('2041-08-30'),('2041-08-31'),('2041-09-01'),('2041-09-02'),('2041-09-03'),('2041-09-04'),('2041-09-05'),('2041-09-06'),('2041-09-07'),('2041-09-08'),('2041-09-09'),('2041-09-10'),('2041-09-11'),('2041-09-12'),('2041-09-13'),('2041-09-14'),('2041-09-15'),('2041-09-16'),('2041-09-17'),('2041-09-18'),('2041-09-19'),('2041-09-20'),('2041-09-21'),('2041-09-22'),('2041-09-23'),('2041-09-24'),('2041-09-25'),('2041-09-26'),('2041-09-27'),('2041-09-28'),('2041-09-29'),('2041-09-30'),('2041-10-01'),('2041-10-02'),('2041-10-03'),('2041-10-04'),('2041-10-05'),('2041-10-06'),('2041-10-07'),('2041-10-08'),('2041-10-09'),('2041-10-10'),('2041-10-11'),('2041-10-12'),('2041-10-13'),('2041-10-14'),('2041-10-15'),('2041-10-16'),('2041-10-17'),('2041-10-18'),('2041-10-19'),('2041-10-20'),('2041-10-21'),('2041-10-22'),('2041-10-23'),('2041-10-24'),('2041-10-25'),('2041-10-26'),('2041-10-27'),('2041-10-28'),('2041-10-29'),('2041-10-30'),('2041-10-31'),('2041-11-01'),('2041-11-02'),('2041-11-03'),('2041-11-04'),('2041-11-05'),('2041-11-06'),('2041-11-07'),('2041-11-08'),('2041-11-09'),('2041-11-10'),('2041-11-11'),('2041-11-12'),('2041-11-13'),('2041-11-14'),('2041-11-15'),('2041-11-16'),('2041-11-17'),('2041-11-18'),('2041-11-19'),('2041-11-20'),('2041-11-21'),('2041-11-22'),('2041-11-23'),('2041-11-24'),('2041-11-25'),('2041-11-26'),('2041-11-27'),('2041-11-28'),('2041-11-29'),('2041-11-30'),('2041-12-01'),('2041-12-02'),('2041-12-03'),('2041-12-04'),('2041-12-05'),('2041-12-06'),('2041-12-07'),('2041-12-08'),('2041-12-09'),('2041-12-10'),('2041-12-11'),('2041-12-12'),('2041-12-13'),('2041-12-14'),('2041-12-15'),('2041-12-16'),('2041-12-17'),('2041-12-18'),('2041-12-19'),('2041-12-20'),('2041-12-21'),('2041-12-22'),('2041-12-23'),('2041-12-24'),('2041-12-25'),('2041-12-26'),('2041-12-27'),('2041-12-28'),('2041-12-29'),('2041-12-30'),('2041-12-31'),('2042-01-01'),('2042-01-02'),('2042-01-03'),('2042-01-04'),('2042-01-05'),('2042-01-06'),('2042-01-07'),('2042-01-08'),('2042-01-09'),('2042-01-10'),('2042-01-11'),('2042-01-12'),('2042-01-13'),('2042-01-14'),('2042-01-15'),('2042-01-16'),('2042-01-17'),('2042-01-18'),('2042-01-19'),('2042-01-20'),('2042-01-21'),('2042-01-22'),('2042-01-23'),('2042-01-24'),('2042-01-25'),('2042-01-26'),('2042-01-27'),('2042-01-28'),('2042-01-29'),('2042-01-30'),('2042-01-31'),('2042-02-01'),('2042-02-02'),('2042-02-03'),('2042-02-04'),('2042-02-05'),('2042-02-06'),('2042-02-07'),('2042-02-08'),('2042-02-09'),('2042-02-10'),('2042-02-11'),('2042-02-12'),('2042-02-13'),('2042-02-14'),('2042-02-15'),('2042-02-16'),('2042-02-17'),('2042-02-18'),('2042-02-19'),('2042-02-20'),('2042-02-21'),('2042-02-22'),('2042-02-23'),('2042-02-24'),('2042-02-25'),('2042-02-26'),('2042-02-27'),('2042-02-28'),('2042-03-01'),('2042-03-02'),('2042-03-03'),('2042-03-04'),('2042-03-05'),('2042-03-06'),('2042-03-07'),('2042-03-08'),('2042-03-09'),('2042-03-10'),('2042-03-11'),('2042-03-12'),('2042-03-13'),('2042-03-14'),('2042-03-15'),('2042-03-16'),('2042-03-17'),('2042-03-18'),('2042-03-19'),('2042-03-20'),('2042-03-21'),('2042-03-22'),('2042-03-23'),('2042-03-24'),('2042-03-25'),('2042-03-26'),('2042-03-27'),('2042-03-28'),('2042-03-29'),('2042-03-30'),('2042-03-31'),('2042-04-01'),('2042-04-02'),('2042-04-03'),('2042-04-04'),('2042-04-05'),('2042-04-06'),('2042-04-07'),('2042-04-08'),('2042-04-09'),('2042-04-10'),('2042-04-11'),('2042-04-12'),('2042-04-13'),('2042-04-14'),('2042-04-15'),('2042-04-16'),('2042-04-17'),('2042-04-18'),('2042-04-19'),('2042-04-20'),('2042-04-21'),('2042-04-22'),('2042-04-23'),('2042-04-24'),('2042-04-25'),('2042-04-26'),('2042-04-27'),('2042-04-28'),('2042-04-29'),('2042-04-30'),('2042-05-01'),('2042-05-02'),('2042-05-03'),('2042-05-04'),('2042-05-05'),('2042-05-06'),('2042-05-07'),('2042-05-08'),('2042-05-09'),('2042-05-10'),('2042-05-11'),('2042-05-12'),('2042-05-13'),('2042-05-14'),('2042-05-15'),('2042-05-16'),('2042-05-17'),('2042-05-18'),('2042-05-19'),('2042-05-20'),('2042-05-21'),('2042-05-22'),('2042-05-23'),('2042-05-24'),('2042-05-25'),('2042-05-26'),('2042-05-27'),('2042-05-28'),('2042-05-29'),('2042-05-30'),('2042-05-31'),('2042-06-01'),('2042-06-02'),('2042-06-03'),('2042-06-04'),('2042-06-05'),('2042-06-06'),('2042-06-07'),('2042-06-08'),('2042-06-09'),('2042-06-10'),('2042-06-11'),('2042-06-12'),('2042-06-13'),('2042-06-14'),('2042-06-15'),('2042-06-16'),('2042-06-17'),('2042-06-18'),('2042-06-19'),('2042-06-20'),('2042-06-21'),('2042-06-22'),('2042-06-23'),('2042-06-24'),('2042-06-25'),('2042-06-26'),('2042-06-27'),('2042-06-28'),('2042-06-29'),('2042-06-30'),('2042-07-01'),('2042-07-02'),('2042-07-03'),('2042-07-04'),('2042-07-05'),('2042-07-06'),('2042-07-07'),('2042-07-08'),('2042-07-09'),('2042-07-10'),('2042-07-11'),('2042-07-12'),('2042-07-13'),('2042-07-14'),('2042-07-15'),('2042-07-16'),('2042-07-17'),('2042-07-18'),('2042-07-19'),('2042-07-20'),('2042-07-21'),('2042-07-22'),('2042-07-23'),('2042-07-24'),('2042-07-25'),('2042-07-26'),('2042-07-27'),('2042-07-28'),('2042-07-29'),('2042-07-30'),('2042-07-31'),('2042-08-01'),('2042-08-02'),('2042-08-03'),('2042-08-04'),('2042-08-05'),('2042-08-06'),('2042-08-07'),('2042-08-08'),('2042-08-09'),('2042-08-10'),('2042-08-11'),('2042-08-12'),('2042-08-13'),('2042-08-14'),('2042-08-15'),('2042-08-16'),('2042-08-17'),('2042-08-18'),('2042-08-19'),('2042-08-20'),('2042-08-21'),('2042-08-22'),('2042-08-23'),('2042-08-24'),('2042-08-25'),('2042-08-26'),('2042-08-27'),('2042-08-28'),('2042-08-29'),('2042-08-30'),('2042-08-31'),('2042-09-01'),('2042-09-02'),('2042-09-03'),('2042-09-04'),('2042-09-05'),('2042-09-06'),('2042-09-07'),('2042-09-08'),('2042-09-09'),('2042-09-10'),('2042-09-11'),('2042-09-12'),('2042-09-13'),('2042-09-14'),('2042-09-15'),('2042-09-16'),('2042-09-17'),('2042-09-18'),('2042-09-19'),('2042-09-20'),('2042-09-21'),('2042-09-22'),('2042-09-23'),('2042-09-24'),('2042-09-25'),('2042-09-26'),('2042-09-27'),('2042-09-28'),('2042-09-29'),('2042-09-30'),('2042-10-01'),('2042-10-02'),('2042-10-03'),('2042-10-04'),('2042-10-05'),('2042-10-06'),('2042-10-07'),('2042-10-08'),('2042-10-09'),('2042-10-10'),('2042-10-11'),('2042-10-12'),('2042-10-13'),('2042-10-14'),('2042-10-15'),('2042-10-16'),('2042-10-17'),('2042-10-18'),('2042-10-19'),('2042-10-20'),('2042-10-21'),('2042-10-22'),('2042-10-23'),('2042-10-24'),('2042-10-25'),('2042-10-26'),('2042-10-27'),('2042-10-28'),('2042-10-29'),('2042-10-30'),('2042-10-31'),('2042-11-01'),('2042-11-02'),('2042-11-03'),('2042-11-04'),('2042-11-05'),('2042-11-06'),('2042-11-07'),('2042-11-08'),('2042-11-09'),('2042-11-10'),('2042-11-11'),('2042-11-12'),('2042-11-13'),('2042-11-14'),('2042-11-15'),('2042-11-16'),('2042-11-17'),('2042-11-18'),('2042-11-19'),('2042-11-20'),('2042-11-21'),('2042-11-22'),('2042-11-23'),('2042-11-24'),('2042-11-25'),('2042-11-26'),('2042-11-27'),('2042-11-28'),('2042-11-29'),('2042-11-30'),('2042-12-01'),('2042-12-02'),('2042-12-03'),('2042-12-04'),('2042-12-05'),('2042-12-06'),('2042-12-07'),('2042-12-08'),('2042-12-09'),('2042-12-10'),('2042-12-11'),('2042-12-12'),('2042-12-13'),('2042-12-14'),('2042-12-15'),('2042-12-16'),('2042-12-17'),('2042-12-18'),('2042-12-19'),('2042-12-20'),('2042-12-21'),('2042-12-22'),('2042-12-23'),('2042-12-24'),('2042-12-25'),('2042-12-26'),('2042-12-27'),('2042-12-28'),('2042-12-29'),('2042-12-30'),('2042-12-31'),('2043-01-01'),('2043-01-02'),('2043-01-03'),('2043-01-04'),('2043-01-05'),('2043-01-06'),('2043-01-07'),('2043-01-08'),('2043-01-09'),('2043-01-10'),('2043-01-11'),('2043-01-12'),('2043-01-13'),('2043-01-14'),('2043-01-15'),('2043-01-16'),('2043-01-17'),('2043-01-18'),('2043-01-19'),('2043-01-20'),('2043-01-21'),('2043-01-22'),('2043-01-23'),('2043-01-24'),('2043-01-25'),('2043-01-26'),('2043-01-27'),('2043-01-28'),('2043-01-29'),('2043-01-30'),('2043-01-31'),('2043-02-01'),('2043-02-02'),('2043-02-03'),('2043-02-04'),('2043-02-05'),('2043-02-06'),('2043-02-07'),('2043-02-08'),('2043-02-09'),('2043-02-10'),('2043-02-11'),('2043-02-12'),('2043-02-13'),('2043-02-14'),('2043-02-15'),('2043-02-16'),('2043-02-17'),('2043-02-18'),('2043-02-19'),('2043-02-20'),('2043-02-21'),('2043-02-22'),('2043-02-23'),('2043-02-24'),('2043-02-25'),('2043-02-26'),('2043-02-27'),('2043-02-28'),('2043-03-01'),('2043-03-02'),('2043-03-03'),('2043-03-04'),('2043-03-05'),('2043-03-06'),('2043-03-07'),('2043-03-08'),('2043-03-09'),('2043-03-10'),('2043-03-11'),('2043-03-12'),('2043-03-13'),('2043-03-14'),('2043-03-15'),('2043-03-16'),('2043-03-17'),('2043-03-18'),('2043-03-19'),('2043-03-20'),('2043-03-21'),('2043-03-22'),('2043-03-23'),('2043-03-24'),('2043-03-25'),('2043-03-26'),('2043-03-27'),('2043-03-28'),('2043-03-29'),('2043-03-30'),('2043-03-31'),('2043-04-01'),('2043-04-02'),('2043-04-03'),('2043-04-04'),('2043-04-05'),('2043-04-06'),('2043-04-07'),('2043-04-08'),('2043-04-09'),('2043-04-10'),('2043-04-11'),('2043-04-12'),('2043-04-13'),('2043-04-14'),('2043-04-15'),('2043-04-16'),('2043-04-17'),('2043-04-18'),('2043-04-19'),('2043-04-20'),('2043-04-21'),('2043-04-22'),('2043-04-23'),('2043-04-24'),('2043-04-25'),('2043-04-26'),('2043-04-27'),('2043-04-28'),('2043-04-29'),('2043-04-30'),('2043-05-01'),('2043-05-02'),('2043-05-03'),('2043-05-04'),('2043-05-05'),('2043-05-06'),('2043-05-07'),('2043-05-08'),('2043-05-09'),('2043-05-10'),('2043-05-11'),('2043-05-12'),('2043-05-13'),('2043-05-14'),('2043-05-15'),('2043-05-16'),('2043-05-17'),('2043-05-18'),('2043-05-19'),('2043-05-20'),('2043-05-21'),('2043-05-22'),('2043-05-23'),('2043-05-24'),('2043-05-25'),('2043-05-26'),('2043-05-27'),('2043-05-28'),('2043-05-29'),('2043-05-30'),('2043-05-31'),('2043-06-01'),('2043-06-02'),('2043-06-03'),('2043-06-04'),('2043-06-05'),('2043-06-06'),('2043-06-07'),('2043-06-08'),('2043-06-09'),('2043-06-10'),('2043-06-11'),('2043-06-12'),('2043-06-13'),('2043-06-14'),('2043-06-15'),('2043-06-16'),('2043-06-17'),('2043-06-18'),('2043-06-19'),('2043-06-20'),('2043-06-21'),('2043-06-22'),('2043-06-23'),('2043-06-24'),('2043-06-25'),('2043-06-26'),('2043-06-27'),('2043-06-28'),('2043-06-29'),('2043-06-30'),('2043-07-01'),('2043-07-02'),('2043-07-03'),('2043-07-04'),('2043-07-05'),('2043-07-06'),('2043-07-07'),('2043-07-08'),('2043-07-09'),('2043-07-10'),('2043-07-11'),('2043-07-12'),('2043-07-13'),('2043-07-14'),('2043-07-15'),('2043-07-16'),('2043-07-17'),('2043-07-18'),('2043-07-19'),('2043-07-20'),('2043-07-21'),('2043-07-22'),('2043-07-23'),('2043-07-24'),('2043-07-25'),('2043-07-26'),('2043-07-27'),('2043-07-28'),('2043-07-29'),('2043-07-30'),('2043-07-31'),('2043-08-01'),('2043-08-02'),('2043-08-03'),('2043-08-04'),('2043-08-05'),('2043-08-06'),('2043-08-07'),('2043-08-08'),('2043-08-09'),('2043-08-10'),('2043-08-11'),('2043-08-12'),('2043-08-13'),('2043-08-14'),('2043-08-15'),('2043-08-16'),('2043-08-17'),('2043-08-18'),('2043-08-19'),('2043-08-20'),('2043-08-21'),('2043-08-22'),('2043-08-23'),('2043-08-24'),('2043-08-25'),('2043-08-26'),('2043-08-27'),('2043-08-28'),('2043-08-29'),('2043-08-30'),('2043-08-31'),('2043-09-01'),('2043-09-02'),('2043-09-03'),('2043-09-04'),('2043-09-05'),('2043-09-06'),('2043-09-07'),('2043-09-08'),('2043-09-09'),('2043-09-10'),('2043-09-11'),('2043-09-12'),('2043-09-13'),('2043-09-14'),('2043-09-15'),('2043-09-16'),('2043-09-17'),('2043-09-18'),('2043-09-19'),('2043-09-20'),('2043-09-21'),('2043-09-22'),('2043-09-23'),('2043-09-24'),('2043-09-25'),('2043-09-26'),('2043-09-27'),('2043-09-28'),('2043-09-29'),('2043-09-30'),('2043-10-01'),('2043-10-02'),('2043-10-03'),('2043-10-04'),('2043-10-05'),('2043-10-06'),('2043-10-07'),('2043-10-08'),('2043-10-09'),('2043-10-10'),('2043-10-11'),('2043-10-12'),('2043-10-13'),('2043-10-14'),('2043-10-15'),('2043-10-16'),('2043-10-17'),('2043-10-18'),('2043-10-19'),('2043-10-20'),('2043-10-21'),('2043-10-22'),('2043-10-23'),('2043-10-24'),('2043-10-25'),('2043-10-26'),('2043-10-27'),('2043-10-28'),('2043-10-29'),('2043-10-30'),('2043-10-31'),('2043-11-01'),('2043-11-02'),('2043-11-03'),('2043-11-04'),('2043-11-05'),('2043-11-06'),('2043-11-07'),('2043-11-08'),('2043-11-09'),('2043-11-10'),('2043-11-11'),('2043-11-12'),('2043-11-13'),('2043-11-14'),('2043-11-15'),('2043-11-16'),('2043-11-17'),('2043-11-18'),('2043-11-19'),('2043-11-20'),('2043-11-21'),('2043-11-22'),('2043-11-23'),('2043-11-24'),('2043-11-25'),('2043-11-26'),('2043-11-27'),('2043-11-28'),('2043-11-29'),('2043-11-30'),('2043-12-01'),('2043-12-02'),('2043-12-03'),('2043-12-04'),('2043-12-05'),('2043-12-06'),('2043-12-07'),('2043-12-08'),('2043-12-09'),('2043-12-10'),('2043-12-11'),('2043-12-12'),('2043-12-13'),('2043-12-14'),('2043-12-15'),('2043-12-16'),('2043-12-17'),('2043-12-18'),('2043-12-19'),('2043-12-20'),('2043-12-21'),('2043-12-22'),('2043-12-23'),('2043-12-24'),('2043-12-25'),('2043-12-26'),('2043-12-27'),('2043-12-28'),('2043-12-29'),('2043-12-30'),('2043-12-31'),('2044-01-01'),('2044-01-02'),('2044-01-03'),('2044-01-04'),('2044-01-05'),('2044-01-06'),('2044-01-07'),('2044-01-08'),('2044-01-09'),('2044-01-10'),('2044-01-11'),('2044-01-12'),('2044-01-13'),('2044-01-14'),('2044-01-15'),('2044-01-16'),('2044-01-17'),('2044-01-18'),('2044-01-19'),('2044-01-20'),('2044-01-21'),('2044-01-22'),('2044-01-23'),('2044-01-24'),('2044-01-25'),('2044-01-26'),('2044-01-27'),('2044-01-28'),('2044-01-29'),('2044-01-30'),('2044-01-31'),('2044-02-01'),('2044-02-02'),('2044-02-03'),('2044-02-04'),('2044-02-05'),('2044-02-06'),('2044-02-07'),('2044-02-08'),('2044-02-09'),('2044-02-10'),('2044-02-11'),('2044-02-12'),('2044-02-13'),('2044-02-14'),('2044-02-15'),('2044-02-16'),('2044-02-17'),('2044-02-18'),('2044-02-19'),('2044-02-20'),('2044-02-21'),('2044-02-22'),('2044-02-23'),('2044-02-24'),('2044-02-25'),('2044-02-26'),('2044-02-27'),('2044-02-28'),('2044-02-29'),('2044-03-01'),('2044-03-02'),('2044-03-03'),('2044-03-04'),('2044-03-05'),('2044-03-06'),('2044-03-07'),('2044-03-08'),('2044-03-09'),('2044-03-10'),('2044-03-11'),('2044-03-12'),('2044-03-13'),('2044-03-14'),('2044-03-15'),('2044-03-16'),('2044-03-17'),('2044-03-18'),('2044-03-19'),('2044-03-20'),('2044-03-21'),('2044-03-22'),('2044-03-23'),('2044-03-24'),('2044-03-25'),('2044-03-26'),('2044-03-27'),('2044-03-28'),('2044-03-29'),('2044-03-30'),('2044-03-31'),('2044-04-01'),('2044-04-02'),('2044-04-03'),('2044-04-04'),('2044-04-05'),('2044-04-06'),('2044-04-07'),('2044-04-08'),('2044-04-09'),('2044-04-10'),('2044-04-11'),('2044-04-12'),('2044-04-13'),('2044-04-14'),('2044-04-15'),('2044-04-16'),('2044-04-17'),('2044-04-18'),('2044-04-19'),('2044-04-20'),('2044-04-21'),('2044-04-22'),('2044-04-23'),('2044-04-24'),('2044-04-25'),('2044-04-26'),('2044-04-27'),('2044-04-28'),('2044-04-29'),('2044-04-30'),('2044-05-01'),('2044-05-02'),('2044-05-03'),('2044-05-04'),('2044-05-05'),('2044-05-06'),('2044-05-07'),('2044-05-08'),('2044-05-09'),('2044-05-10'),('2044-05-11'),('2044-05-12'),('2044-05-13'),('2044-05-14'),('2044-05-15'),('2044-05-16'),('2044-05-17'),('2044-05-18'),('2044-05-19'),('2044-05-20'),('2044-05-21'),('2044-05-22'),('2044-05-23'),('2044-05-24'),('2044-05-25'),('2044-05-26'),('2044-05-27'),('2044-05-28'),('2044-05-29'),('2044-05-30'),('2044-05-31'),('2044-06-01'),('2044-06-02'),('2044-06-03'),('2044-06-04'),('2044-06-05'),('2044-06-06'),('2044-06-07'),('2044-06-08'),('2044-06-09'),('2044-06-10'),('2044-06-11'),('2044-06-12'),('2044-06-13'),('2044-06-14'),('2044-06-15'),('2044-06-16'),('2044-06-17'),('2044-06-18'),('2044-06-19'),('2044-06-20'),('2044-06-21'),('2044-06-22'),('2044-06-23'),('2044-06-24'),('2044-06-25'),('2044-06-26'),('2044-06-27'),('2044-06-28'),('2044-06-29'),('2044-06-30'),('2044-07-01'),('2044-07-02'),('2044-07-03'),('2044-07-04'),('2044-07-05'),('2044-07-06'),('2044-07-07'),('2044-07-08'),('2044-07-09'),('2044-07-10'),('2044-07-11'),('2044-07-12'),('2044-07-13'),('2044-07-14'),('2044-07-15'),('2044-07-16'),('2044-07-17'),('2044-07-18'),('2044-07-19'),('2044-07-20'),('2044-07-21'),('2044-07-22'),('2044-07-23'),('2044-07-24'),('2044-07-25'),('2044-07-26'),('2044-07-27'),('2044-07-28'),('2044-07-29'),('2044-07-30'),('2044-07-31'),('2044-08-01'),('2044-08-02'),('2044-08-03'),('2044-08-04'),('2044-08-05'),('2044-08-06'),('2044-08-07'),('2044-08-08'),('2044-08-09'),('2044-08-10'),('2044-08-11'),('2044-08-12'),('2044-08-13'),('2044-08-14'),('2044-08-15'),('2044-08-16'),('2044-08-17'),('2044-08-18'),('2044-08-19'),('2044-08-20'),('2044-08-21'),('2044-08-22'),('2044-08-23'),('2044-08-24'),('2044-08-25'),('2044-08-26'),('2044-08-27'),('2044-08-28'),('2044-08-29'),('2044-08-30'),('2044-08-31'),('2044-09-01'),('2044-09-02'),('2044-09-03'),('2044-09-04'),('2044-09-05'),('2044-09-06'),('2044-09-07'),('2044-09-08'),('2044-09-09'),('2044-09-10'),('2044-09-11'),('2044-09-12'),('2044-09-13'),('2044-09-14'),('2044-09-15'),('2044-09-16'),('2044-09-17'),('2044-09-18'),('2044-09-19'),('2044-09-20'),('2044-09-21'),('2044-09-22'),('2044-09-23'),('2044-09-24'),('2044-09-25'),('2044-09-26'),('2044-09-27'),('2044-09-28'),('2044-09-29'),('2044-09-30'),('2044-10-01'),('2044-10-02'),('2044-10-03'),('2044-10-04'),('2044-10-05'),('2044-10-06'),('2044-10-07'),('2044-10-08'),('2044-10-09'),('2044-10-10'),('2044-10-11'),('2044-10-12'),('2044-10-13'),('2044-10-14'),('2044-10-15'),('2044-10-16'),('2044-10-17'),('2044-10-18'),('2044-10-19'),('2044-10-20'),('2044-10-21'),('2044-10-22'),('2044-10-23'),('2044-10-24'),('2044-10-25'),('2044-10-26'),('2044-10-27'),('2044-10-28'),('2044-10-29'),('2044-10-30'),('2044-10-31'),('2044-11-01'),('2044-11-02'),('2044-11-03'),('2044-11-04'),('2044-11-05'),('2044-11-06'),('2044-11-07'),('2044-11-08'),('2044-11-09'),('2044-11-10'),('2044-11-11'),('2044-11-12'),('2044-11-13'),('2044-11-14'),('2044-11-15'),('2044-11-16'),('2044-11-17'),('2044-11-18'),('2044-11-19'),('2044-11-20'),('2044-11-21'),('2044-11-22'),('2044-11-23'),('2044-11-24'),('2044-11-25'),('2044-11-26'),('2044-11-27'),('2044-11-28'),('2044-11-29'),('2044-11-30'),('2044-12-01'),('2044-12-02'),('2044-12-03'),('2044-12-04'),('2044-12-05'),('2044-12-06'),('2044-12-07'),('2044-12-08'),('2044-12-09'),('2044-12-10'),('2044-12-11'),('2044-12-12'),('2044-12-13'),('2044-12-14'),('2044-12-15'),('2044-12-16'),('2044-12-17'),('2044-12-18'),('2044-12-19'),('2044-12-20'),('2044-12-21'),('2044-12-22'),('2044-12-23'),('2044-12-24'),('2044-12-25'),('2044-12-26'),('2044-12-27'),('2044-12-28'),('2044-12-29'),('2044-12-30'),('2044-12-31'),('2045-01-01'),('2045-01-02'),('2045-01-03'),('2045-01-04'),('2045-01-05'),('2045-01-06'),('2045-01-07'),('2045-01-08'),('2045-01-09'),('2045-01-10'),('2045-01-11'),('2045-01-12'),('2045-01-13'),('2045-01-14'),('2045-01-15'),('2045-01-16'),('2045-01-17'),('2045-01-18'),('2045-01-19'),('2045-01-20'),('2045-01-21'),('2045-01-22'),('2045-01-23'),('2045-01-24'),('2045-01-25'),('2045-01-26'),('2045-01-27'),('2045-01-28'),('2045-01-29'),('2045-01-30'),('2045-01-31'),('2045-02-01'),('2045-02-02'),('2045-02-03'),('2045-02-04'),('2045-02-05'),('2045-02-06'),('2045-02-07'),('2045-02-08'),('2045-02-09'),('2045-02-10'),('2045-02-11'),('2045-02-12'),('2045-02-13'),('2045-02-14'),('2045-02-15'),('2045-02-16'),('2045-02-17'),('2045-02-18'),('2045-02-19'),('2045-02-20'),('2045-02-21'),('2045-02-22'),('2045-02-23'),('2045-02-24'),('2045-02-25'),('2045-02-26'),('2045-02-27'),('2045-02-28'),('2045-03-01'),('2045-03-02'),('2045-03-03'),('2045-03-04'),('2045-03-05'),('2045-03-06'),('2045-03-07'),('2045-03-08'),('2045-03-09'),('2045-03-10'),('2045-03-11'),('2045-03-12'),('2045-03-13'),('2045-03-14'),('2045-03-15'),('2045-03-16'),('2045-03-17'),('2045-03-18'),('2045-03-19'),('2045-03-20'),('2045-03-21'),('2045-03-22'),('2045-03-23'),('2045-03-24'),('2045-03-25'),('2045-03-26'),('2045-03-27'),('2045-03-28'),('2045-03-29'),('2045-03-30'),('2045-03-31'),('2045-04-01'),('2045-04-02'),('2045-04-03'),('2045-04-04'),('2045-04-05'),('2045-04-06'),('2045-04-07'),('2045-04-08'),('2045-04-09'),('2045-04-10'),('2045-04-11'),('2045-04-12'),('2045-04-13'),('2045-04-14'),('2045-04-15'),('2045-04-16'),('2045-04-17'),('2045-04-18'),('2045-04-19'),('2045-04-20'),('2045-04-21'),('2045-04-22'),('2045-04-23'),('2045-04-24'),('2045-04-25'),('2045-04-26'),('2045-04-27'),('2045-04-28'),('2045-04-29'),('2045-04-30'),('2045-05-01'),('2045-05-02'),('2045-05-03'),('2045-05-04'),('2045-05-05'),('2045-05-06'),('2045-05-07'),('2045-05-08'),('2045-05-09'),('2045-05-10'),('2045-05-11'),('2045-05-12'),('2045-05-13'),('2045-05-14'),('2045-05-15'),('2045-05-16'),('2045-05-17'),('2045-05-18'),('2045-05-19'),('2045-05-20'),('2045-05-21'),('2045-05-22'),('2045-05-23'),('2045-05-24'),('2045-05-25'),('2045-05-26'),('2045-05-27'),('2045-05-28'),('2045-05-29'),('2045-05-30'),('2045-05-31'),('2045-06-01'),('2045-06-02'),('2045-06-03'),('2045-06-04'),('2045-06-05'),('2045-06-06'),('2045-06-07'),('2045-06-08'),('2045-06-09'),('2045-06-10'),('2045-06-11'),('2045-06-12'),('2045-06-13'),('2045-06-14'),('2045-06-15'),('2045-06-16'),('2045-06-17'),('2045-06-18'),('2045-06-19'),('2045-06-20'),('2045-06-21'),('2045-06-22'),('2045-06-23'),('2045-06-24'),('2045-06-25'),('2045-06-26'),('2045-06-27'),('2045-06-28'),('2045-06-29'),('2045-06-30'),('2045-07-01'),('2045-07-02'),('2045-07-03'),('2045-07-04'),('2045-07-05'),('2045-07-06'),('2045-07-07'),('2045-07-08'),('2045-07-09'),('2045-07-10'),('2045-07-11'),('2045-07-12'),('2045-07-13'),('2045-07-14'),('2045-07-15'),('2045-07-16'),('2045-07-17'),('2045-07-18'),('2045-07-19'),('2045-07-20'),('2045-07-21'),('2045-07-22'),('2045-07-23'),('2045-07-24'),('2045-07-25'),('2045-07-26'),('2045-07-27'),('2045-07-28'),('2045-07-29'),('2045-07-30'),('2045-07-31'),('2045-08-01'),('2045-08-02'),('2045-08-03'),('2045-08-04'),('2045-08-05'),('2045-08-06'),('2045-08-07'),('2045-08-08'),('2045-08-09'),('2045-08-10'),('2045-08-11'),('2045-08-12'),('2045-08-13'),('2045-08-14'),('2045-08-15'),('2045-08-16'),('2045-08-17'),('2045-08-18'),('2045-08-19'),('2045-08-20'),('2045-08-21'),('2045-08-22'),('2045-08-23'),('2045-08-24'),('2045-08-25'),('2045-08-26'),('2045-08-27'),('2045-08-28'),('2045-08-29'),('2045-08-30'),('2045-08-31'),('2045-09-01'),('2045-09-02'),('2045-09-03'),('2045-09-04'),('2045-09-05'),('2045-09-06'),('2045-09-07'),('2045-09-08'),('2045-09-09'),('2045-09-10'),('2045-09-11'),('2045-09-12'),('2045-09-13'),('2045-09-14'),('2045-09-15'),('2045-09-16'),('2045-09-17'),('2045-09-18'),('2045-09-19'),('2045-09-20'),('2045-09-21'),('2045-09-22'),('2045-09-23'),('2045-09-24'),('2045-09-25'),('2045-09-26'),('2045-09-27'),('2045-09-28'),('2045-09-29'),('2045-09-30'),('2045-10-01'),('2045-10-02'),('2045-10-03'),('2045-10-04'),('2045-10-05'),('2045-10-06'),('2045-10-07'),('2045-10-08'),('2045-10-09'),('2045-10-10'),('2045-10-11'),('2045-10-12'),('2045-10-13'),('2045-10-14'),('2045-10-15'),('2045-10-16'),('2045-10-17'),('2045-10-18'),('2045-10-19'),('2045-10-20'),('2045-10-21'),('2045-10-22'),('2045-10-23'),('2045-10-24'),('2045-10-25'),('2045-10-26'),('2045-10-27'),('2045-10-28'),('2045-10-29'),('2045-10-30'),('2045-10-31'),('2045-11-01'),('2045-11-02'),('2045-11-03'),('2045-11-04'),('2045-11-05'),('2045-11-06'),('2045-11-07'),('2045-11-08'),('2045-11-09'),('2045-11-10'),('2045-11-11'),('2045-11-12'),('2045-11-13'),('2045-11-14'),('2045-11-15'),('2045-11-16'),('2045-11-17'),('2045-11-18'),('2045-11-19'),('2045-11-20'),('2045-11-21'),('2045-11-22'),('2045-11-23'),('2045-11-24'),('2045-11-25'),('2045-11-26'),('2045-11-27'),('2045-11-28'),('2045-11-29'),('2045-11-30'),('2045-12-01'),('2045-12-02'),('2045-12-03'),('2045-12-04'),('2045-12-05'),('2045-12-06'),('2045-12-07'),('2045-12-08'),('2045-12-09'),('2045-12-10'),('2045-12-11'),('2045-12-12'),('2045-12-13'),('2045-12-14'),('2045-12-15'),('2045-12-16'),('2045-12-17'),('2045-12-18'),('2045-12-19'),('2045-12-20'),('2045-12-21'),('2045-12-22'),('2045-12-23'),('2045-12-24'),('2045-12-25'),('2045-12-26'),('2045-12-27'),('2045-12-28'),('2045-12-29'),('2045-12-30'),('2045-12-31'),('2046-01-01'),('2046-01-02'),('2046-01-03'),('2046-01-04'),('2046-01-05'),('2046-01-06'),('2046-01-07'),('2046-01-08'),('2046-01-09'),('2046-01-10'),('2046-01-11'),('2046-01-12'),('2046-01-13'),('2046-01-14'),('2046-01-15'),('2046-01-16'),('2046-01-17'),('2046-01-18'),('2046-01-19'),('2046-01-20'),('2046-01-21'),('2046-01-22'),('2046-01-23'),('2046-01-24'),('2046-01-25'),('2046-01-26'),('2046-01-27'),('2046-01-28'),('2046-01-29'),('2046-01-30'),('2046-01-31'),('2046-02-01'),('2046-02-02'),('2046-02-03'),('2046-02-04'),('2046-02-05'),('2046-02-06'),('2046-02-07'),('2046-02-08'),('2046-02-09'),('2046-02-10'),('2046-02-11'),('2046-02-12'),('2046-02-13'),('2046-02-14'),('2046-02-15'),('2046-02-16'),('2046-02-17'),('2046-02-18'),('2046-02-19'),('2046-02-20'),('2046-02-21'),('2046-02-22'),('2046-02-23'),('2046-02-24'),('2046-02-25'),('2046-02-26'),('2046-02-27'),('2046-02-28'),('2046-03-01'),('2046-03-02'),('2046-03-03'),('2046-03-04'),('2046-03-05'),('2046-03-06'),('2046-03-07'),('2046-03-08'),('2046-03-09'),('2046-03-10'),('2046-03-11'),('2046-03-12'),('2046-03-13'),('2046-03-14'),('2046-03-15'),('2046-03-16'),('2046-03-17'),('2046-03-18'),('2046-03-19'),('2046-03-20'),('2046-03-21'),('2046-03-22'),('2046-03-23'),('2046-03-24'),('2046-03-25'),('2046-03-26'),('2046-03-27'),('2046-03-28'),('2046-03-29'),('2046-03-30'),('2046-03-31'),('2046-04-01'),('2046-04-02'),('2046-04-03'),('2046-04-04'),('2046-04-05'),('2046-04-06'),('2046-04-07'),('2046-04-08'),('2046-04-09'),('2046-04-10'),('2046-04-11'),('2046-04-12'),('2046-04-13'),('2046-04-14'),('2046-04-15'),('2046-04-16'),('2046-04-17'),('2046-04-18'),('2046-04-19'),('2046-04-20'),('2046-04-21'),('2046-04-22'),('2046-04-23'),('2046-04-24'),('2046-04-25'),('2046-04-26'),('2046-04-27'),('2046-04-28'),('2046-04-29'),('2046-04-30'),('2046-05-01'),('2046-05-02'),('2046-05-03'),('2046-05-04'),('2046-05-05'),('2046-05-06'),('2046-05-07'),('2046-05-08'),('2046-05-09'),('2046-05-10'),('2046-05-11'),('2046-05-12'),('2046-05-13'),('2046-05-14'),('2046-05-15'),('2046-05-16'),('2046-05-17'),('2046-05-18'),('2046-05-19'),('2046-05-20'),('2046-05-21'),('2046-05-22'),('2046-05-23'),('2046-05-24'),('2046-05-25'),('2046-05-26'),('2046-05-27'),('2046-05-28'),('2046-05-29'),('2046-05-30'),('2046-05-31'),('2046-06-01'),('2046-06-02'),('2046-06-03'),('2046-06-04'),('2046-06-05'),('2046-06-06'),('2046-06-07'),('2046-06-08'),('2046-06-09'),('2046-06-10'),('2046-06-11'),('2046-06-12'),('2046-06-13'),('2046-06-14'),('2046-06-15'),('2046-06-16'),('2046-06-17'),('2046-06-18'),('2046-06-19'),('2046-06-20'),('2046-06-21'),('2046-06-22'),('2046-06-23'),('2046-06-24'),('2046-06-25'),('2046-06-26'),('2046-06-27'),('2046-06-28'),('2046-06-29'),('2046-06-30'),('2046-07-01'),('2046-07-02'),('2046-07-03'),('2046-07-04'),('2046-07-05'),('2046-07-06'),('2046-07-07'),('2046-07-08'),('2046-07-09'),('2046-07-10'),('2046-07-11'),('2046-07-12'),('2046-07-13'),('2046-07-14'),('2046-07-15'),('2046-07-16'),('2046-07-17'),('2046-07-18'),('2046-07-19'),('2046-07-20'),('2046-07-21'),('2046-07-22'),('2046-07-23'),('2046-07-24'),('2046-07-25'),('2046-07-26'),('2046-07-27'),('2046-07-28'),('2046-07-29'),('2046-07-30'),('2046-07-31'),('2046-08-01'),('2046-08-02'),('2046-08-03'),('2046-08-04'),('2046-08-05'),('2046-08-06'),('2046-08-07'),('2046-08-08'),('2046-08-09'),('2046-08-10'),('2046-08-11'),('2046-08-12'),('2046-08-13'),('2046-08-14'),('2046-08-15'),('2046-08-16'),('2046-08-17'),('2046-08-18'),('2046-08-19'),('2046-08-20'),('2046-08-21'),('2046-08-22'),('2046-08-23'),('2046-08-24'),('2046-08-25'),('2046-08-26'),('2046-08-27'),('2046-08-28'),('2046-08-29'),('2046-08-30'),('2046-08-31'),('2046-09-01'),('2046-09-02'),('2046-09-03'),('2046-09-04'),('2046-09-05'),('2046-09-06'),('2046-09-07'),('2046-09-08'),('2046-09-09'),('2046-09-10'),('2046-09-11'),('2046-09-12'),('2046-09-13'),('2046-09-14'),('2046-09-15'),('2046-09-16'),('2046-09-17'),('2046-09-18'),('2046-09-19'),('2046-09-20'),('2046-09-21'),('2046-09-22'),('2046-09-23'),('2046-09-24'),('2046-09-25'),('2046-09-26'),('2046-09-27'),('2046-09-28'),('2046-09-29'),('2046-09-30'),('2046-10-01'),('2046-10-02'),('2046-10-03'),('2046-10-04'),('2046-10-05'),('2046-10-06'),('2046-10-07'),('2046-10-08'),('2046-10-09'),('2046-10-10'),('2046-10-11'),('2046-10-12'),('2046-10-13'),('2046-10-14'),('2046-10-15'),('2046-10-16'),('2046-10-17'),('2046-10-18'),('2046-10-19'),('2046-10-20'),('2046-10-21'),('2046-10-22'),('2046-10-23'),('2046-10-24'),('2046-10-25'),('2046-10-26'),('2046-10-27'),('2046-10-28'),('2046-10-29'),('2046-10-30'),('2046-10-31'),('2046-11-01'),('2046-11-02'),('2046-11-03'),('2046-11-04'),('2046-11-05'),('2046-11-06'),('2046-11-07'),('2046-11-08'),('2046-11-09'),('2046-11-10'),('2046-11-11'),('2046-11-12'),('2046-11-13'),('2046-11-14'),('2046-11-15'),('2046-11-16'),('2046-11-17'),('2046-11-18'),('2046-11-19'),('2046-11-20'),('2046-11-21'),('2046-11-22'),('2046-11-23'),('2046-11-24'),('2046-11-25'),('2046-11-26'),('2046-11-27'),('2046-11-28'),('2046-11-29'),('2046-11-30'),('2046-12-01'),('2046-12-02'),('2046-12-03'),('2046-12-04'),('2046-12-05'),('2046-12-06'),('2046-12-07'),('2046-12-08'),('2046-12-09'),('2046-12-10'),('2046-12-11'),('2046-12-12'),('2046-12-13'),('2046-12-14'),('2046-12-15'),('2046-12-16'),('2046-12-17'),('2046-12-18'),('2046-12-19'),('2046-12-20'),('2046-12-21'),('2046-12-22'),('2046-12-23'),('2046-12-24'),('2046-12-25'),('2046-12-26'),('2046-12-27'),('2046-12-28'),('2046-12-29'),('2046-12-30'),('2046-12-31'),('2047-01-01'),('2047-01-02'),('2047-01-03'),('2047-01-04'),('2047-01-05'),('2047-01-06'),('2047-01-07'),('2047-01-08'),('2047-01-09'),('2047-01-10'),('2047-01-11'),('2047-01-12'),('2047-01-13'),('2047-01-14'),('2047-01-15'),('2047-01-16'),('2047-01-17'),('2047-01-18'),('2047-01-19'),('2047-01-20'),('2047-01-21'),('2047-01-22'),('2047-01-23'),('2047-01-24'),('2047-01-25'),('2047-01-26'),('2047-01-27'),('2047-01-28'),('2047-01-29'),('2047-01-30'),('2047-01-31'),('2047-02-01'),('2047-02-02'),('2047-02-03'),('2047-02-04'),('2047-02-05'),('2047-02-06'),('2047-02-07'),('2047-02-08'),('2047-02-09'),('2047-02-10'),('2047-02-11'),('2047-02-12'),('2047-02-13'),('2047-02-14'),('2047-02-15'),('2047-02-16'),('2047-02-17'),('2047-02-18'),('2047-02-19'),('2047-02-20'),('2047-02-21'),('2047-02-22'),('2047-02-23'),('2047-02-24'),('2047-02-25'),('2047-02-26'),('2047-02-27'),('2047-02-28'),('2047-03-01'),('2047-03-02'),('2047-03-03'),('2047-03-04'),('2047-03-05'),('2047-03-06'),('2047-03-07'),('2047-03-08'),('2047-03-09'),('2047-03-10'),('2047-03-11'),('2047-03-12'),('2047-03-13'),('2047-03-14'),('2047-03-15'),('2047-03-16'),('2047-03-17'),('2047-03-18'),('2047-03-19'),('2047-03-20'),('2047-03-21'),('2047-03-22'),('2047-03-23'),('2047-03-24'),('2047-03-25'),('2047-03-26'),('2047-03-27'),('2047-03-28'),('2047-03-29'),('2047-03-30'),('2047-03-31'),('2047-04-01'),('2047-04-02'),('2047-04-03'),('2047-04-04'),('2047-04-05'),('2047-04-06'),('2047-04-07'),('2047-04-08'),('2047-04-09'),('2047-04-10'),('2047-04-11'),('2047-04-12'),('2047-04-13'),('2047-04-14'),('2047-04-15'),('2047-04-16'),('2047-04-17'),('2047-04-18'),('2047-04-19'),('2047-04-20'),('2047-04-21'),('2047-04-22'),('2047-04-23'),('2047-04-24'),('2047-04-25'),('2047-04-26'),('2047-04-27'),('2047-04-28'),('2047-04-29'),('2047-04-30'),('2047-05-01'),('2047-05-02'),('2047-05-03'),('2047-05-04'),('2047-05-05'),('2047-05-06'),('2047-05-07'),('2047-05-08'),('2047-05-09'),('2047-05-10'),('2047-05-11'),('2047-05-12'),('2047-05-13'),('2047-05-14'),('2047-05-15'),('2047-05-16'),('2047-05-17'),('2047-05-18'),('2047-05-19'),('2047-05-20'),('2047-05-21'),('2047-05-22'),('2047-05-23'),('2047-05-24'),('2047-05-25'),('2047-05-26'),('2047-05-27'),('2047-05-28'),('2047-05-29'),('2047-05-30'),('2047-05-31'),('2047-06-01'),('2047-06-02'),('2047-06-03'),('2047-06-04'),('2047-06-05'),('2047-06-06'),('2047-06-07'),('2047-06-08'),('2047-06-09'),('2047-06-10'),('2047-06-11'),('2047-06-12'),('2047-06-13'),('2047-06-14'),('2047-06-15'),('2047-06-16'),('2047-06-17'),('2047-06-18'),('2047-06-19'),('2047-06-20'),('2047-06-21'),('2047-06-22'),('2047-06-23'),('2047-06-24'),('2047-06-25'),('2047-06-26'),('2047-06-27'),('2047-06-28'),('2047-06-29'),('2047-06-30'),('2047-07-01'),('2047-07-02'),('2047-07-03'),('2047-07-04'),('2047-07-05'),('2047-07-06'),('2047-07-07'),('2047-07-08'),('2047-07-09'),('2047-07-10'),('2047-07-11'),('2047-07-12'),('2047-07-13'),('2047-07-14'),('2047-07-15'),('2047-07-16'),('2047-07-17'),('2047-07-18'),('2047-07-19'),('2047-07-20'),('2047-07-21'),('2047-07-22'),('2047-07-23'),('2047-07-24'),('2047-07-25'),('2047-07-26'),('2047-07-27'),('2047-07-28'),('2047-07-29'),('2047-07-30'),('2047-07-31'),('2047-08-01'),('2047-08-02'),('2047-08-03'),('2047-08-04'),('2047-08-05'),('2047-08-06'),('2047-08-07'),('2047-08-08'),('2047-08-09'),('2047-08-10'),('2047-08-11'),('2047-08-12'),('2047-08-13'),('2047-08-14'),('2047-08-15'),('2047-08-16'),('2047-08-17'),('2047-08-18'),('2047-08-19'),('2047-08-20'),('2047-08-21'),('2047-08-22'),('2047-08-23'),('2047-08-24'),('2047-08-25'),('2047-08-26'),('2047-08-27'),('2047-08-28'),('2047-08-29'),('2047-08-30'),('2047-08-31'),('2047-09-01'),('2047-09-02'),('2047-09-03'),('2047-09-04'),('2047-09-05'),('2047-09-06'),('2047-09-07'),('2047-09-08'),('2047-09-09'),('2047-09-10'),('2047-09-11'),('2047-09-12'),('2047-09-13'),('2047-09-14'),('2047-09-15'),('2047-09-16'),('2047-09-17'),('2047-09-18'),('2047-09-19'),('2047-09-20'),('2047-09-21'),('2047-09-22'),('2047-09-23'),('2047-09-24'),('2047-09-25'),('2047-09-26'),('2047-09-27'),('2047-09-28'),('2047-09-29'),('2047-09-30'),('2047-10-01'),('2047-10-02'),('2047-10-03'),('2047-10-04'),('2047-10-05'),('2047-10-06'),('2047-10-07'),('2047-10-08'),('2047-10-09'),('2047-10-10'),('2047-10-11'),('2047-10-12'),('2047-10-13'),('2047-10-14'),('2047-10-15'),('2047-10-16'),('2047-10-17'),('2047-10-18'),('2047-10-19'),('2047-10-20'),('2047-10-21'),('2047-10-22'),('2047-10-23'),('2047-10-24'),('2047-10-25'),('2047-10-26'),('2047-10-27'),('2047-10-28'),('2047-10-29'),('2047-10-30'),('2047-10-31'),('2047-11-01'),('2047-11-02'),('2047-11-03'),('2047-11-04'),('2047-11-05'),('2047-11-06'),('2047-11-07'),('2047-11-08'),('2047-11-09'),('2047-11-10'),('2047-11-11'),('2047-11-12'),('2047-11-13'),('2047-11-14'),('2047-11-15'),('2047-11-16'),('2047-11-17'),('2047-11-18'),('2047-11-19'),('2047-11-20'),('2047-11-21'),('2047-11-22'),('2047-11-23'),('2047-11-24'),('2047-11-25'),('2047-11-26'),('2047-11-27'),('2047-11-28'),('2047-11-29'),('2047-11-30'),('2047-12-01'),('2047-12-02'),('2047-12-03'),('2047-12-04'),('2047-12-05'),('2047-12-06'),('2047-12-07'),('2047-12-08'),('2047-12-09'),('2047-12-10'),('2047-12-11'),('2047-12-12'),('2047-12-13'),('2047-12-14'),('2047-12-15'),('2047-12-16'),('2047-12-17'),('2047-12-18'),('2047-12-19'),('2047-12-20'),('2047-12-21'),('2047-12-22'),('2047-12-23'),('2047-12-24'),('2047-12-25'),('2047-12-26'),('2047-12-27'),('2047-12-28'),('2047-12-29'),('2047-12-30'),('2047-12-31'),('2048-01-01'),('2048-01-02'),('2048-01-03'),('2048-01-04'),('2048-01-05'),('2048-01-06'),('2048-01-07'),('2048-01-08'),('2048-01-09'),('2048-01-10'),('2048-01-11'),('2048-01-12'),('2048-01-13'),('2048-01-14'),('2048-01-15'),('2048-01-16'),('2048-01-17'),('2048-01-18'),('2048-01-19'),('2048-01-20'),('2048-01-21'),('2048-01-22'),('2048-01-23'),('2048-01-24'),('2048-01-25'),('2048-01-26'),('2048-01-27'),('2048-01-28'),('2048-01-29'),('2048-01-30'),('2048-01-31'),('2048-02-01'),('2048-02-02'),('2048-02-03'),('2048-02-04'),('2048-02-05'),('2048-02-06'),('2048-02-07'),('2048-02-08'),('2048-02-09'),('2048-02-10'),('2048-02-11'),('2048-02-12'),('2048-02-13'),('2048-02-14'),('2048-02-15'),('2048-02-16'),('2048-02-17'),('2048-02-18'),('2048-02-19'),('2048-02-20'),('2048-02-21'),('2048-02-22'),('2048-02-23'),('2048-02-24'),('2048-02-25'),('2048-02-26'),('2048-02-27'),('2048-02-28'),('2048-02-29'),('2048-03-01'),('2048-03-02'),('2048-03-03'),('2048-03-04'),('2048-03-05'),('2048-03-06'),('2048-03-07'),('2048-03-08'),('2048-03-09'),('2048-03-10'),('2048-03-11'),('2048-03-12'),('2048-03-13'),('2048-03-14'),('2048-03-15'),('2048-03-16'),('2048-03-17'),('2048-03-18'),('2048-03-19'),('2048-03-20'),('2048-03-21'),('2048-03-22'),('2048-03-23'),('2048-03-24'),('2048-03-25'),('2048-03-26'),('2048-03-27'),('2048-03-28'),('2048-03-29'),('2048-03-30'),('2048-03-31'),('2048-04-01'),('2048-04-02'),('2048-04-03'),('2048-04-04'),('2048-04-05'),('2048-04-06'),('2048-04-07'),('2048-04-08'),('2048-04-09'),('2048-04-10'),('2048-04-11'),('2048-04-12'),('2048-04-13'),('2048-04-14'),('2048-04-15'),('2048-04-16'),('2048-04-17'),('2048-04-18'),('2048-04-19'),('2048-04-20'),('2048-04-21'),('2048-04-22'),('2048-04-23'),('2048-04-24'),('2048-04-25'),('2048-04-26'),('2048-04-27'),('2048-04-28'),('2048-04-29'),('2048-04-30'),('2048-05-01'),('2048-05-02'),('2048-05-03'),('2048-05-04'),('2048-05-05'),('2048-05-06'),('2048-05-07'),('2048-05-08'),('2048-05-09'),('2048-05-10'),('2048-05-11'),('2048-05-12'),('2048-05-13'),('2048-05-14'),('2048-05-15'),('2048-05-16'),('2048-05-17'),('2048-05-18'),('2048-05-19'),('2048-05-20'),('2048-05-21'),('2048-05-22'),('2048-05-23'),('2048-05-24'),('2048-05-25'),('2048-05-26'),('2048-05-27'),('2048-05-28'),('2048-05-29'),('2048-05-30'),('2048-05-31'),('2048-06-01'),('2048-06-02'),('2048-06-03'),('2048-06-04'),('2048-06-05'),('2048-06-06'),('2048-06-07'),('2048-06-08'),('2048-06-09'),('2048-06-10'),('2048-06-11'),('2048-06-12'),('2048-06-13'),('2048-06-14'),('2048-06-15'),('2048-06-16'),('2048-06-17'),('2048-06-18'),('2048-06-19'),('2048-06-20'),('2048-06-21'),('2048-06-22'),('2048-06-23'),('2048-06-24'),('2048-06-25'),('2048-06-26'),('2048-06-27'),('2048-06-28'),('2048-06-29'),('2048-06-30'),('2048-07-01'),('2048-07-02'),('2048-07-03'),('2048-07-04'),('2048-07-05'),('2048-07-06'),('2048-07-07'),('2048-07-08'),('2048-07-09'),('2048-07-10'),('2048-07-11'),('2048-07-12'),('2048-07-13'),('2048-07-14'),('2048-07-15'),('2048-07-16'),('2048-07-17'),('2048-07-18'),('2048-07-19'),('2048-07-20'),('2048-07-21'),('2048-07-22'),('2048-07-23'),('2048-07-24'),('2048-07-25'),('2048-07-26'),('2048-07-27'),('2048-07-28'),('2048-07-29'),('2048-07-30'),('2048-07-31'),('2048-08-01'),('2048-08-02'),('2048-08-03'),('2048-08-04'),('2048-08-05'),('2048-08-06'),('2048-08-07'),('2048-08-08'),('2048-08-09'),('2048-08-10'),('2048-08-11'),('2048-08-12'),('2048-08-13'),('2048-08-14'),('2048-08-15'),('2048-08-16'),('2048-08-17'),('2048-08-18'),('2048-08-19'),('2048-08-20'),('2048-08-21'),('2048-08-22'),('2048-08-23'),('2048-08-24'),('2048-08-25'),('2048-08-26'),('2048-08-27'),('2048-08-28'),('2048-08-29'),('2048-08-30'),('2048-08-31'),('2048-09-01'),('2048-09-02'),('2048-09-03'),('2048-09-04'),('2048-09-05'),('2048-09-06'),('2048-09-07'),('2048-09-08'),('2048-09-09'),('2048-09-10'),('2048-09-11'),('2048-09-12'),('2048-09-13'),('2048-09-14'),('2048-09-15'),('2048-09-16'),('2048-09-17'),('2048-09-18'),('2048-09-19'),('2048-09-20'),('2048-09-21'),('2048-09-22'),('2048-09-23'),('2048-09-24'),('2048-09-25'),('2048-09-26'),('2048-09-27'),('2048-09-28'),('2048-09-29'),('2048-09-30'),('2048-10-01'),('2048-10-02'),('2048-10-03'),('2048-10-04'),('2048-10-05'),('2048-10-06'),('2048-10-07'),('2048-10-08'),('2048-10-09'),('2048-10-10'),('2048-10-11'),('2048-10-12'),('2048-10-13'),('2048-10-14'),('2048-10-15'),('2048-10-16'),('2048-10-17'),('2048-10-18'),('2048-10-19'),('2048-10-20'),('2048-10-21'),('2048-10-22'),('2048-10-23'),('2048-10-24'),('2048-10-25'),('2048-10-26'),('2048-10-27'),('2048-10-28'),('2048-10-29'),('2048-10-30'),('2048-10-31'),('2048-11-01'),('2048-11-02'),('2048-11-03'),('2048-11-04'),('2048-11-05'),('2048-11-06'),('2048-11-07'),('2048-11-08'),('2048-11-09'),('2048-11-10'),('2048-11-11'),('2048-11-12'),('2048-11-13'),('2048-11-14'),('2048-11-15'),('2048-11-16'),('2048-11-17'),('2048-11-18'),('2048-11-19'),('2048-11-20'),('2048-11-21'),('2048-11-22'),('2048-11-23'),('2048-11-24'),('2048-11-25'),('2048-11-26'),('2048-11-27'),('2048-11-28'),('2048-11-29'),('2048-11-30'),('2048-12-01'),('2048-12-02'),('2048-12-03'),('2048-12-04'),('2048-12-05'),('2048-12-06'),('2048-12-07'),('2048-12-08'),('2048-12-09'),('2048-12-10'),('2048-12-11'),('2048-12-12'),('2048-12-13'),('2048-12-14'),('2048-12-15'),('2048-12-16'),('2048-12-17'),('2048-12-18'),('2048-12-19'),('2048-12-20'),('2048-12-21'),('2048-12-22'),('2048-12-23'),('2048-12-24'),('2048-12-25'),('2048-12-26'),('2048-12-27'),('2048-12-28'),('2048-12-29'),('2048-12-30'),('2048-12-31'),('2049-01-01'),('2049-01-02'),('2049-01-03'),('2049-01-04'),('2049-01-05'),('2049-01-06'),('2049-01-07'),('2049-01-08'),('2049-01-09'),('2049-01-10'),('2049-01-11'),('2049-01-12'),('2049-01-13'),('2049-01-14'),('2049-01-15'),('2049-01-16'),('2049-01-17'),('2049-01-18'),('2049-01-19'),('2049-01-20'),('2049-01-21'),('2049-01-22'),('2049-01-23'),('2049-01-24'),('2049-01-25'),('2049-01-26'),('2049-01-27'),('2049-01-28'),('2049-01-29'),('2049-01-30'),('2049-01-31'),('2049-02-01'),('2049-02-02'),('2049-02-03'),('2049-02-04'),('2049-02-05'),('2049-02-06'),('2049-02-07'),('2049-02-08'),('2049-02-09'),('2049-02-10'),('2049-02-11'),('2049-02-12'),('2049-02-13'),('2049-02-14'),('2049-02-15'),('2049-02-16'),('2049-02-17'),('2049-02-18'),('2049-02-19'),('2049-02-20'),('2049-02-21'),('2049-02-22'),('2049-02-23'),('2049-02-24'),('2049-02-25'),('2049-02-26'),('2049-02-27'),('2049-02-28'),('2049-03-01'),('2049-03-02'),('2049-03-03'),('2049-03-04'),('2049-03-05'),('2049-03-06'),('2049-03-07'),('2049-03-08'),('2049-03-09'),('2049-03-10'),('2049-03-11'),('2049-03-12'),('2049-03-13'),('2049-03-14'),('2049-03-15'),('2049-03-16'),('2049-03-17'),('2049-03-18'),('2049-03-19'),('2049-03-20'),('2049-03-21'),('2049-03-22'),('2049-03-23'),('2049-03-24'),('2049-03-25'),('2049-03-26'),('2049-03-27'),('2049-03-28'),('2049-03-29'),('2049-03-30'),('2049-03-31'),('2049-04-01'),('2049-04-02'),('2049-04-03'),('2049-04-04'),('2049-04-05'),('2049-04-06'),('2049-04-07'),('2049-04-08'),('2049-04-09'),('2049-04-10'),('2049-04-11'),('2049-04-12'),('2049-04-13'),('2049-04-14'),('2049-04-15'),('2049-04-16'),('2049-04-17'),('2049-04-18'),('2049-04-19'),('2049-04-20'),('2049-04-21'),('2049-04-22'),('2049-04-23'),('2049-04-24'),('2049-04-25'),('2049-04-26'),('2049-04-27'),('2049-04-28'),('2049-04-29'),('2049-04-30'),('2049-05-01'),('2049-05-02'),('2049-05-03'),('2049-05-04'),('2049-05-05'),('2049-05-06'),('2049-05-07'),('2049-05-08'),('2049-05-09'),('2049-05-10'),('2049-05-11'),('2049-05-12'),('2049-05-13'),('2049-05-14'),('2049-05-15'),('2049-05-16'),('2049-05-17'),('2049-05-18'),('2049-05-19'),('2049-05-20'),('2049-05-21'),('2049-05-22'),('2049-05-23'),('2049-05-24'),('2049-05-25'),('2049-05-26'),('2049-05-27'),('2049-05-28'),('2049-05-29'),('2049-05-30'),('2049-05-31'),('2049-06-01'),('2049-06-02'),('2049-06-03'),('2049-06-04'),('2049-06-05'),('2049-06-06'),('2049-06-07'),('2049-06-08'),('2049-06-09'),('2049-06-10'),('2049-06-11'),('2049-06-12'),('2049-06-13'),('2049-06-14'),('2049-06-15'),('2049-06-16'),('2049-06-17'),('2049-06-18'),('2049-06-19'),('2049-06-20'),('2049-06-21'),('2049-06-22'),('2049-06-23'),('2049-06-24'),('2049-06-25'),('2049-06-26'),('2049-06-27'),('2049-06-28'),('2049-06-29'),('2049-06-30'),('2049-07-01'),('2049-07-02'),('2049-07-03'),('2049-07-04'),('2049-07-05'),('2049-07-06'),('2049-07-07'),('2049-07-08'),('2049-07-09'),('2049-07-10'),('2049-07-11'),('2049-07-12'),('2049-07-13'),('2049-07-14'),('2049-07-15'),('2049-07-16'),('2049-07-17'),('2049-07-18'),('2049-07-19'),('2049-07-20'),('2049-07-21'),('2049-07-22'),('2049-07-23'),('2049-07-24'),('2049-07-25'),('2049-07-26'),('2049-07-27'),('2049-07-28'),('2049-07-29'),('2049-07-30'),('2049-07-31'),('2049-08-01'),('2049-08-02'),('2049-08-03'),('2049-08-04'),('2049-08-05'),('2049-08-06'),('2049-08-07'),('2049-08-08'),('2049-08-09'),('2049-08-10'),('2049-08-11'),('2049-08-12'),('2049-08-13'),('2049-08-14'),('2049-08-15'),('2049-08-16'),('2049-08-17'),('2049-08-18'),('2049-08-19'),('2049-08-20'),('2049-08-21'),('2049-08-22'),('2049-08-23'),('2049-08-24'),('2049-08-25'),('2049-08-26'),('2049-08-27'),('2049-08-28'),('2049-08-29'),('2049-08-30'),('2049-08-31'),('2049-09-01'),('2049-09-02'),('2049-09-03'),('2049-09-04'),('2049-09-05'),('2049-09-06'),('2049-09-07'),('2049-09-08'),('2049-09-09'),('2049-09-10'),('2049-09-11'),('2049-09-12'),('2049-09-13'),('2049-09-14'),('2049-09-15'),('2049-09-16'),('2049-09-17'),('2049-09-18'),('2049-09-19'),('2049-09-20'),('2049-09-21'),('2049-09-22'),('2049-09-23'),('2049-09-24'),('2049-09-25'),('2049-09-26'),('2049-09-27'),('2049-09-28'),('2049-09-29'),('2049-09-30'),('2049-10-01'),('2049-10-02'),('2049-10-03'),('2049-10-04'),('2049-10-05'),('2049-10-06'),('2049-10-07'),('2049-10-08'),('2049-10-09'),('2049-10-10'),('2049-10-11'),('2049-10-12'),('2049-10-13'),('2049-10-14'),('2049-10-15'),('2049-10-16'),('2049-10-17'),('2049-10-18'),('2049-10-19'),('2049-10-20'),('2049-10-21'),('2049-10-22'),('2049-10-23'),('2049-10-24'),('2049-10-25'),('2049-10-26'),('2049-10-27'),('2049-10-28'),('2049-10-29'),('2049-10-30'),('2049-10-31'),('2049-11-01'),('2049-11-02'),('2049-11-03'),('2049-11-04'),('2049-11-05'),('2049-11-06'),('2049-11-07'),('2049-11-08'),('2049-11-09'),('2049-11-10'),('2049-11-11'),('2049-11-12'),('2049-11-13'),('2049-11-14'),('2049-11-15'),('2049-11-16'),('2049-11-17'),('2049-11-18'),('2049-11-19'),('2049-11-20'),('2049-11-21'),('2049-11-22'),('2049-11-23'),('2049-11-24'),('2049-11-25'),('2049-11-26'),('2049-11-27'),('2049-11-28'),('2049-11-29'),('2049-11-30'),('2049-12-01'),('2049-12-02'),('2049-12-03'),('2049-12-04'),('2049-12-05'),('2049-12-06'),('2049-12-07'),('2049-12-08'),('2049-12-09'),('2049-12-10'),('2049-12-11'),('2049-12-12'),('2049-12-13'),('2049-12-14'),('2049-12-15'),('2049-12-16'),('2049-12-17'),('2049-12-18'),('2049-12-19'),('2049-12-20'),('2049-12-21'),('2049-12-22'),('2049-12-23'),('2049-12-24'),('2049-12-25'),('2049-12-26'),('2049-12-27'),('2049-12-28'),('2049-12-29'),('2049-12-30'),('2049-12-31'),('2050-01-01'),('2050-01-02'),('2050-01-03'),('2050-01-04'),('2050-01-05'),('2050-01-06'),('2050-01-07'),('2050-01-08'),('2050-01-09'),('2050-01-10'),('2050-01-11'),('2050-01-12'),('2050-01-13'),('2050-01-14'),('2050-01-15'),('2050-01-16'),('2050-01-17'),('2050-01-18'),('2050-01-19'),('2050-01-20'),('2050-01-21'),('2050-01-22'),('2050-01-23'),('2050-01-24'),('2050-01-25'),('2050-01-26'),('2050-01-27'),('2050-01-28'),('2050-01-29'),('2050-01-30'),('2050-01-31'),('2050-02-01'),('2050-02-02'),('2050-02-03'),('2050-02-04'),('2050-02-05'),('2050-02-06'),('2050-02-07'),('2050-02-08'),('2050-02-09'),('2050-02-10'),('2050-02-11'),('2050-02-12'),('2050-02-13'),('2050-02-14'),('2050-02-15'),('2050-02-16'),('2050-02-17'),('2050-02-18'),('2050-02-19'),('2050-02-20'),('2050-02-21'),('2050-02-22'),('2050-02-23'),('2050-02-24'),('2050-02-25'),('2050-02-26'),('2050-02-27'),('2050-02-28'),('2050-03-01'),('2050-03-02'),('2050-03-03'),('2050-03-04'),('2050-03-05'),('2050-03-06'),('2050-03-07'),('2050-03-08'),('2050-03-09'),('2050-03-10'),('2050-03-11'),('2050-03-12'),('2050-03-13'),('2050-03-14'),('2050-03-15'),('2050-03-16'),('2050-03-17'),('2050-03-18'),('2050-03-19'),('2050-03-20'),('2050-03-21'),('2050-03-22'),('2050-03-23'),('2050-03-24'),('2050-03-25'),('2050-03-26'),('2050-03-27'),('2050-03-28'),('2050-03-29'),('2050-03-30'),('2050-03-31'),('2050-04-01'),('2050-04-02'),('2050-04-03'),('2050-04-04'),('2050-04-05'),('2050-04-06'),('2050-04-07'),('2050-04-08'),('2050-04-09'),('2050-04-10'),('2050-04-11'),('2050-04-12'),('2050-04-13'),('2050-04-14'),('2050-04-15'),('2050-04-16'),('2050-04-17'),('2050-04-18'),('2050-04-19'),('2050-04-20'),('2050-04-21'),('2050-04-22'),('2050-04-23'),('2050-04-24'),('2050-04-25'),('2050-04-26'),('2050-04-27'),('2050-04-28'),('2050-04-29'),('2050-04-30'),('2050-05-01'),('2050-05-02'),('2050-05-03'),('2050-05-04'),('2050-05-05'),('2050-05-06'),('2050-05-07'),('2050-05-08'),('2050-05-09'),('2050-05-10'),('2050-05-11'),('2050-05-12'),('2050-05-13'),('2050-05-14'),('2050-05-15'),('2050-05-16'),('2050-05-17'),('2050-05-18'),('2050-05-19'),('2050-05-20'),('2050-05-21'),('2050-05-22'),('2050-05-23'),('2050-05-24'),('2050-05-25'),('2050-05-26'),('2050-05-27'),('2050-05-28'),('2050-05-29'),('2050-05-30'),('2050-05-31'),('2050-06-01'),('2050-06-02'),('2050-06-03'),('2050-06-04'),('2050-06-05'),('2050-06-06'),('2050-06-07'),('2050-06-08'),('2050-06-09'),('2050-06-10'),('2050-06-11'),('2050-06-12'),('2050-06-13'),('2050-06-14'),('2050-06-15'),('2050-06-16'),('2050-06-17'),('2050-06-18'),('2050-06-19'),('2050-06-20'),('2050-06-21'),('2050-06-22'),('2050-06-23'),('2050-06-24'),('2050-06-25'),('2050-06-26'),('2050-06-27'),('2050-06-28'),('2050-06-29'),('2050-06-30'),('2050-07-01'),('2050-07-02'),('2050-07-03'),('2050-07-04'),('2050-07-05'),('2050-07-06'),('2050-07-07'),('2050-07-08'),('2050-07-09'),('2050-07-10'),('2050-07-11'),('2050-07-12'),('2050-07-13'),('2050-07-14'),('2050-07-15'),('2050-07-16'),('2050-07-17'),('2050-07-18'),('2050-07-19'),('2050-07-20'),('2050-07-21'),('2050-07-22'),('2050-07-23'),('2050-07-24'),('2050-07-25'),('2050-07-26'),('2050-07-27'),('2050-07-28'),('2050-07-29'),('2050-07-30'),('2050-07-31'),('2050-08-01'),('2050-08-02'),('2050-08-03'),('2050-08-04'),('2050-08-05'),('2050-08-06'),('2050-08-07'),('2050-08-08'),('2050-08-09'),('2050-08-10'),('2050-08-11'),('2050-08-12'),('2050-08-13'),('2050-08-14'),('2050-08-15'),('2050-08-16'),('2050-08-17'),('2050-08-18'),('2050-08-19'),('2050-08-20'),('2050-08-21'),('2050-08-22'),('2050-08-23'),('2050-08-24'),('2050-08-25'),('2050-08-26'),('2050-08-27'),('2050-08-28'),('2050-08-29'),('2050-08-30'),('2050-08-31'),('2050-09-01'),('2050-09-02'),('2050-09-03'),('2050-09-04'),('2050-09-05'),('2050-09-06'),('2050-09-07'),('2050-09-08'),('2050-09-09'),('2050-09-10'),('2050-09-11'),('2050-09-12'),('2050-09-13'),('2050-09-14'),('2050-09-15'),('2050-09-16'),('2050-09-17'),('2050-09-18'),('2050-09-19'),('2050-09-20'),('2050-09-21'),('2050-09-22'),('2050-09-23'),('2050-09-24'),('2050-09-25'),('2050-09-26'),('2050-09-27'),('2050-09-28'),('2050-09-29'),('2050-09-30'),('2050-10-01'),('2050-10-02'),('2050-10-03'),('2050-10-04'),('2050-10-05'),('2050-10-06'),('2050-10-07'),('2050-10-08'),('2050-10-09'),('2050-10-10'),('2050-10-11'),('2050-10-12'),('2050-10-13'),('2050-10-14'),('2050-10-15'),('2050-10-16'),('2050-10-17'),('2050-10-18'),('2050-10-19'),('2050-10-20'),('2050-10-21'),('2050-10-22'),('2050-10-23'),('2050-10-24'),('2050-10-25'),('2050-10-26'),('2050-10-27'),('2050-10-28'),('2050-10-29'),('2050-10-30'),('2050-10-31'),('2050-11-01'),('2050-11-02'),('2050-11-03'),('2050-11-04'),('2050-11-05'),('2050-11-06'),('2050-11-07'),('2050-11-08'),('2050-11-09'),('2050-11-10'),('2050-11-11'),('2050-11-12'),('2050-11-13'),('2050-11-14'),('2050-11-15'),('2050-11-16'),('2050-11-17'),('2050-11-18'),('2050-11-19'),('2050-11-20'),('2050-11-21'),('2050-11-22'),('2050-11-23'),('2050-11-24'),('2050-11-25'),('2050-11-26'),('2050-11-27'),('2050-11-28'),('2050-11-29'),('2050-11-30'),('2050-12-01'),('2050-12-02'),('2050-12-03'),('2050-12-04'),('2050-12-05'),('2050-12-06'),('2050-12-07'),('2050-12-08'),('2050-12-09'),('2050-12-10'),('2050-12-11'),('2050-12-12'),('2050-12-13'),('2050-12-14'),('2050-12-15'),('2050-12-16'),('2050-12-17'),('2050-12-18'),('2050-12-19'),('2050-12-20'),('2050-12-21'),('2050-12-22'),('2050-12-23'),('2050-12-24'),('2050-12-25'),('2050-12-26'),('2050-12-27'),('2050-12-28'),('2050-12-29'),('2050-12-30'),('2050-12-31'),('2051-01-01'),('2051-01-02'),('2051-01-03'),('2051-01-04'),('2051-01-05'),('2051-01-06'),('2051-01-07'),('2051-01-08'),('2051-01-09'),('2051-01-10'),('2051-01-11'),('2051-01-12'),('2051-01-13'),('2051-01-14'),('2051-01-15'),('2051-01-16'),('2051-01-17'),('2051-01-18'),('2051-01-19'),('2051-01-20'),('2051-01-21'),('2051-01-22'),('2051-01-23'),('2051-01-24'),('2051-01-25'),('2051-01-26'),('2051-01-27'),('2051-01-28'),('2051-01-29'),('2051-01-30'),('2051-01-31'),('2051-02-01'),('2051-02-02'),('2051-02-03'),('2051-02-04'),('2051-02-05'),('2051-02-06'),('2051-02-07'),('2051-02-08'),('2051-02-09'),('2051-02-10'),('2051-02-11'),('2051-02-12'),('2051-02-13'),('2051-02-14'),('2051-02-15'),('2051-02-16'),('2051-02-17'),('2051-02-18'),('2051-02-19'),('2051-02-20'),('2051-02-21'),('2051-02-22'),('2051-02-23'),('2051-02-24'),('2051-02-25'),('2051-02-26'),('2051-02-27'),('2051-02-28'),('2051-03-01'),('2051-03-02'),('2051-03-03'),('2051-03-04'),('2051-03-05'),('2051-03-06'),('2051-03-07'),('2051-03-08'),('2051-03-09'),('2051-03-10'),('2051-03-11'),('2051-03-12'),('2051-03-13'),('2051-03-14'),('2051-03-15'),('2051-03-16'),('2051-03-17'),('2051-03-18'),('2051-03-19'),('2051-03-20'),('2051-03-21'),('2051-03-22'),('2051-03-23'),('2051-03-24'),('2051-03-25'),('2051-03-26'),('2051-03-27'),('2051-03-28'),('2051-03-29'),('2051-03-30'),('2051-03-31'),('2051-04-01'),('2051-04-02'),('2051-04-03'),('2051-04-04'),('2051-04-05'),('2051-04-06'),('2051-04-07'),('2051-04-08'),('2051-04-09'),('2051-04-10'),('2051-04-11'),('2051-04-12'),('2051-04-13'),('2051-04-14'),('2051-04-15'),('2051-04-16'),('2051-04-17'),('2051-04-18'),('2051-04-19'),('2051-04-20'),('2051-04-21'),('2051-04-22'),('2051-04-23'),('2051-04-24'),('2051-04-25'),('2051-04-26'),('2051-04-27'),('2051-04-28'),('2051-04-29'),('2051-04-30'),('2051-05-01'),('2051-05-02'),('2051-05-03'),('2051-05-04'),('2051-05-05'),('2051-05-06'),('2051-05-07'),('2051-05-08'),('2051-05-09'),('2051-05-10'),('2051-05-11'),('2051-05-12'),('2051-05-13'),('2051-05-14'),('2051-05-15'),('2051-05-16'),('2051-05-17'),('2051-05-18'),('2051-05-19'),('2051-05-20'),('2051-05-21'),('2051-05-22'),('2051-05-23'),('2051-05-24'),('2051-05-25'),('2051-05-26'),('2051-05-27'),('2051-05-28'),('2051-05-29'),('2051-05-30'),('2051-05-31'),('2051-06-01'),('2051-06-02'),('2051-06-03'),('2051-06-04'),('2051-06-05'),('2051-06-06'),('2051-06-07'),('2051-06-08'),('2051-06-09'),('2051-06-10'),('2051-06-11'),('2051-06-12'),('2051-06-13'),('2051-06-14'),('2051-06-15'),('2051-06-16'),('2051-06-17'),('2051-06-18'),('2051-06-19'),('2051-06-20'),('2051-06-21'),('2051-06-22'),('2051-06-23'),('2051-06-24'),('2051-06-25'),('2051-06-26'),('2051-06-27'),('2051-06-28'),('2051-06-29'),('2051-06-30'),('2051-07-01'),('2051-07-02'),('2051-07-03'),('2051-07-04'),('2051-07-05'),('2051-07-06'),('2051-07-07'),('2051-07-08'),('2051-07-09'),('2051-07-10'),('2051-07-11'),('2051-07-12'),('2051-07-13'),('2051-07-14'),('2051-07-15'),('2051-07-16'),('2051-07-17'),('2051-07-18'),('2051-07-19'),('2051-07-20'),('2051-07-21'),('2051-07-22'),('2051-07-23'),('2051-07-24'),('2051-07-25'),('2051-07-26'),('2051-07-27'),('2051-07-28'),('2051-07-29'),('2051-07-30'),('2051-07-31'),('2051-08-01'),('2051-08-02'),('2051-08-03'),('2051-08-04'),('2051-08-05'),('2051-08-06'),('2051-08-07'),('2051-08-08'),('2051-08-09'),('2051-08-10'),('2051-08-11'),('2051-08-12'),('2051-08-13'),('2051-08-14'),('2051-08-15'),('2051-08-16'),('2051-08-17'),('2051-08-18'),('2051-08-19'),('2051-08-20'),('2051-08-21'),('2051-08-22'),('2051-08-23'),('2051-08-24'),('2051-08-25'),('2051-08-26'),('2051-08-27'),('2051-08-28'),('2051-08-29'),('2051-08-30'),('2051-08-31'),('2051-09-01'),('2051-09-02'),('2051-09-03'),('2051-09-04'),('2051-09-05'),('2051-09-06'),('2051-09-07'),('2051-09-08'),('2051-09-09'),('2051-09-10'),('2051-09-11'),('2051-09-12'),('2051-09-13'),('2051-09-14'),('2051-09-15'),('2051-09-16'),('2051-09-17'),('2051-09-18'),('2051-09-19'),('2051-09-20'),('2051-09-21'),('2051-09-22'),('2051-09-23'),('2051-09-24'),('2051-09-25'),('2051-09-26'),('2051-09-27'),('2051-09-28'),('2051-09-29'),('2051-09-30'),('2051-10-01'),('2051-10-02'),('2051-10-03'),('2051-10-04'),('2051-10-05'),('2051-10-06'),('2051-10-07'),('2051-10-08'),('2051-10-09'),('2051-10-10'),('2051-10-11'),('2051-10-12'),('2051-10-13'),('2051-10-14'),('2051-10-15'),('2051-10-16'),('2051-10-17'),('2051-10-18'),('2051-10-19'),('2051-10-20'),('2051-10-21'),('2051-10-22'),('2051-10-23'),('2051-10-24'),('2051-10-25'),('2051-10-26'),('2051-10-27'),('2051-10-28'),('2051-10-29'),('2051-10-30'),('2051-10-31'),('2051-11-01'),('2051-11-02'),('2051-11-03'),('2051-11-04'),('2051-11-05'),('2051-11-06'),('2051-11-07'),('2051-11-08'),('2051-11-09'),('2051-11-10'),('2051-11-11'),('2051-11-12'),('2051-11-13'),('2051-11-14'),('2051-11-15'),('2051-11-16'),('2051-11-17'),('2051-11-18'),('2051-11-19'),('2051-11-20'),('2051-11-21'),('2051-11-22'),('2051-11-23'),('2051-11-24'),('2051-11-25'),('2051-11-26'),('2051-11-27'),('2051-11-28'),('2051-11-29'),('2051-11-30'),('2051-12-01'),('2051-12-02'),('2051-12-03'),('2051-12-04'),('2051-12-05'),('2051-12-06'),('2051-12-07'),('2051-12-08'),('2051-12-09'),('2051-12-10'),('2051-12-11'),('2051-12-12'),('2051-12-13'),('2051-12-14'),('2051-12-15'),('2051-12-16'),('2051-12-17'),('2051-12-18'),('2051-12-19'),('2051-12-20'),('2051-12-21'),('2051-12-22'),('2051-12-23'),('2051-12-24'),('2051-12-25'),('2051-12-26'),('2051-12-27'),('2051-12-28'),('2051-12-29'),('2051-12-30'),('2051-12-31'),('2052-01-01'),('2052-01-02'),('2052-01-03'),('2052-01-04'),('2052-01-05'),('2052-01-06'),('2052-01-07'),('2052-01-08'),('2052-01-09'),('2052-01-10'),('2052-01-11'),('2052-01-12'),('2052-01-13'),('2052-01-14'),('2052-01-15'),('2052-01-16'),('2052-01-17'),('2052-01-18'),('2052-01-19'),('2052-01-20'),('2052-01-21'),('2052-01-22'),('2052-01-23'),('2052-01-24'),('2052-01-25'),('2052-01-26'),('2052-01-27'),('2052-01-28'),('2052-01-29'),('2052-01-30'),('2052-01-31'),('2052-02-01'),('2052-02-02'),('2052-02-03'),('2052-02-04'),('2052-02-05'),('2052-02-06'),('2052-02-07'),('2052-02-08'),('2052-02-09'),('2052-02-10'),('2052-02-11'),('2052-02-12'),('2052-02-13'),('2052-02-14'),('2052-02-15'),('2052-02-16'),('2052-02-17'),('2052-02-18'),('2052-02-19'),('2052-02-20'),('2052-02-21'),('2052-02-22'),('2052-02-23'),('2052-02-24'),('2052-02-25'),('2052-02-26'),('2052-02-27'),('2052-02-28'),('2052-02-29'),('2052-03-01'),('2052-03-02'),('2052-03-03'),('2052-03-04'),('2052-03-05'),('2052-03-06'),('2052-03-07'),('2052-03-08'),('2052-03-09'),('2052-03-10'),('2052-03-11'),('2052-03-12'),('2052-03-13'),('2052-03-14'),('2052-03-15'),('2052-03-16'),('2052-03-17'),('2052-03-18'),('2052-03-19'),('2052-03-20'),('2052-03-21'),('2052-03-22'),('2052-03-23'),('2052-03-24'),('2052-03-25'),('2052-03-26'),('2052-03-27'),('2052-03-28'),('2052-03-29'),('2052-03-30'),('2052-03-31'),('2052-04-01'),('2052-04-02'),('2052-04-03'),('2052-04-04'),('2052-04-05'),('2052-04-06'),('2052-04-07'),('2052-04-08'),('2052-04-09'),('2052-04-10'),('2052-04-11'),('2052-04-12'),('2052-04-13'),('2052-04-14'),('2052-04-15'),('2052-04-16'),('2052-04-17'),('2052-04-18'),('2052-04-19'),('2052-04-20'),('2052-04-21'),('2052-04-22'),('2052-04-23'),('2052-04-24'),('2052-04-25'),('2052-04-26'),('2052-04-27'),('2052-04-28'),('2052-04-29'),('2052-04-30'),('2052-05-01'),('2052-05-02'),('2052-05-03'),('2052-05-04'),('2052-05-05'),('2052-05-06'),('2052-05-07'),('2052-05-08'),('2052-05-09'),('2052-05-10'),('2052-05-11'),('2052-05-12'),('2052-05-13'),('2052-05-14'),('2052-05-15'),('2052-05-16'),('2052-05-17'),('2052-05-18'),('2052-05-19'),('2052-05-20'),('2052-05-21'),('2052-05-22'),('2052-05-23'),('2052-05-24'),('2052-05-25'),('2052-05-26'),('2052-05-27'),('2052-05-28'),('2052-05-29'),('2052-05-30'),('2052-05-31'),('2052-06-01'),('2052-06-02'),('2052-06-03'),('2052-06-04'),('2052-06-05'),('2052-06-06'),('2052-06-07'),('2052-06-08'),('2052-06-09'),('2052-06-10'),('2052-06-11'),('2052-06-12'),('2052-06-13'),('2052-06-14'),('2052-06-15'),('2052-06-16'),('2052-06-17'),('2052-06-18'),('2052-06-19'),('2052-06-20'),('2052-06-21'),('2052-06-22'),('2052-06-23'),('2052-06-24'),('2052-06-25'),('2052-06-26'),('2052-06-27'),('2052-06-28'),('2052-06-29'),('2052-06-30'),('2052-07-01'),('2052-07-02'),('2052-07-03'),('2052-07-04'),('2052-07-05'),('2052-07-06'),('2052-07-07'),('2052-07-08'),('2052-07-09'),('2052-07-10'),('2052-07-11'),('2052-07-12'),('2052-07-13'),('2052-07-14'),('2052-07-15'),('2052-07-16'),('2052-07-17'),('2052-07-18'),('2052-07-19'),('2052-07-20'),('2052-07-21'),('2052-07-22'),('2052-07-23'),('2052-07-24'),('2052-07-25'),('2052-07-26'),('2052-07-27'),('2052-07-28'),('2052-07-29'),('2052-07-30'),('2052-07-31'),('2052-08-01'),('2052-08-02'),('2052-08-03'),('2052-08-04'),('2052-08-05'),('2052-08-06'),('2052-08-07'),('2052-08-08'),('2052-08-09'),('2052-08-10'),('2052-08-11'),('2052-08-12'),('2052-08-13'),('2052-08-14'),('2052-08-15'),('2052-08-16'),('2052-08-17'),('2052-08-18'),('2052-08-19'),('2052-08-20'),('2052-08-21'),('2052-08-22'),('2052-08-23'),('2052-08-24'),('2052-08-25'),('2052-08-26'),('2052-08-27'),('2052-08-28'),('2052-08-29'),('2052-08-30'),('2052-08-31'),('2052-09-01'),('2052-09-02'),('2052-09-03'),('2052-09-04'),('2052-09-05'),('2052-09-06'),('2052-09-07'),('2052-09-08'),('2052-09-09'),('2052-09-10'),('2052-09-11'),('2052-09-12'),('2052-09-13'),('2052-09-14'),('2052-09-15'),('2052-09-16'),('2052-09-17'),('2052-09-18'),('2052-09-19'),('2052-09-20'),('2052-09-21'),('2052-09-22'),('2052-09-23'),('2052-09-24'),('2052-09-25'),('2052-09-26'),('2052-09-27'),('2052-09-28'),('2052-09-29'),('2052-09-30'),('2052-10-01'),('2052-10-02'),('2052-10-03'),('2052-10-04'),('2052-10-05'),('2052-10-06'),('2052-10-07'),('2052-10-08'),('2052-10-09'),('2052-10-10'),('2052-10-11'),('2052-10-12'),('2052-10-13'),('2052-10-14'),('2052-10-15'),('2052-10-16'),('2052-10-17'),('2052-10-18'),('2052-10-19'),('2052-10-20'),('2052-10-21'),('2052-10-22'),('2052-10-23'),('2052-10-24'),('2052-10-25'),('2052-10-26'),('2052-10-27'),('2052-10-28'),('2052-10-29'),('2052-10-30'),('2052-10-31'),('2052-11-01'),('2052-11-02'),('2052-11-03'),('2052-11-04'),('2052-11-05'),('2052-11-06'),('2052-11-07'),('2052-11-08'),('2052-11-09'),('2052-11-10'),('2052-11-11'),('2052-11-12'),('2052-11-13'),('2052-11-14'),('2052-11-15'),('2052-11-16'),('2052-11-17'),('2052-11-18'),('2052-11-19'),('2052-11-20'),('2052-11-21'),('2052-11-22'),('2052-11-23'),('2052-11-24'),('2052-11-25'),('2052-11-26'),('2052-11-27'),('2052-11-28'),('2052-11-29'),('2052-11-30'),('2052-12-01'),('2052-12-02'),('2052-12-03'),('2052-12-04'),('2052-12-05'),('2052-12-06'),('2052-12-07'),('2052-12-08'),('2052-12-09'),('2052-12-10'),('2052-12-11'),('2052-12-12'),('2052-12-13'),('2052-12-14'),('2052-12-15'),('2052-12-16'),('2052-12-17'),('2052-12-18'),('2052-12-19'),('2052-12-20'),('2052-12-21'),('2052-12-22'),('2052-12-23'),('2052-12-24'),('2052-12-25'),('2052-12-26'),('2052-12-27'),('2052-12-28'),('2052-12-29'),('2052-12-30'),('2052-12-31'),('2053-01-01'),('2053-01-02'),('2053-01-03'),('2053-01-04'),('2053-01-05'),('2053-01-06'),('2053-01-07'),('2053-01-08'),('2053-01-09'),('2053-01-10'),('2053-01-11'),('2053-01-12'),('2053-01-13'),('2053-01-14'),('2053-01-15'),('2053-01-16'),('2053-01-17'),('2053-01-18'),('2053-01-19'),('2053-01-20'),('2053-01-21'),('2053-01-22'),('2053-01-23'),('2053-01-24'),('2053-01-25'),('2053-01-26'),('2053-01-27'),('2053-01-28'),('2053-01-29'),('2053-01-30'),('2053-01-31'),('2053-02-01'),('2053-02-02'),('2053-02-03'),('2053-02-04'),('2053-02-05'),('2053-02-06'),('2053-02-07'),('2053-02-08'),('2053-02-09'),('2053-02-10'),('2053-02-11'),('2053-02-12'),('2053-02-13'),('2053-02-14'),('2053-02-15'),('2053-02-16'),('2053-02-17'),('2053-02-18'),('2053-02-19'),('2053-02-20'),('2053-02-21'),('2053-02-22'),('2053-02-23'),('2053-02-24'),('2053-02-25'),('2053-02-26'),('2053-02-27'),('2053-02-28'),('2053-03-01'),('2053-03-02'),('2053-03-03'),('2053-03-04'),('2053-03-05'),('2053-03-06'),('2053-03-07'),('2053-03-08'),('2053-03-09'),('2053-03-10'),('2053-03-11'),('2053-03-12'),('2053-03-13'),('2053-03-14'),('2053-03-15'),('2053-03-16'),('2053-03-17'),('2053-03-18'),('2053-03-19'),('2053-03-20'),('2053-03-21'),('2053-03-22'),('2053-03-23'),('2053-03-24'),('2053-03-25'),('2053-03-26'),('2053-03-27'),('2053-03-28'),('2053-03-29'),('2053-03-30'),('2053-03-31'),('2053-04-01'),('2053-04-02'),('2053-04-03'),('2053-04-04'),('2053-04-05'),('2053-04-06'),('2053-04-07'),('2053-04-08'),('2053-04-09'),('2053-04-10'),('2053-04-11'),('2053-04-12'),('2053-04-13'),('2053-04-14'),('2053-04-15'),('2053-04-16'),('2053-04-17'),('2053-04-18'),('2053-04-19'),('2053-04-20'),('2053-04-21'),('2053-04-22'),('2053-04-23'),('2053-04-24'),('2053-04-25'),('2053-04-26'),('2053-04-27'),('2053-04-28'),('2053-04-29'),('2053-04-30'),('2053-05-01'),('2053-05-02'),('2053-05-03'),('2053-05-04'),('2053-05-05'),('2053-05-06'),('2053-05-07'),('2053-05-08'),('2053-05-09'),('2053-05-10'),('2053-05-11'),('2053-05-12'),('2053-05-13'),('2053-05-14'),('2053-05-15'),('2053-05-16'),('2053-05-17'),('2053-05-18'),('2053-05-19'),('2053-05-20'),('2053-05-21'),('2053-05-22'),('2053-05-23'),('2053-05-24'),('2053-05-25'),('2053-05-26'),('2053-05-27'),('2053-05-28'),('2053-05-29'),('2053-05-30'),('2053-05-31'),('2053-06-01'),('2053-06-02'),('2053-06-03'),('2053-06-04'),('2053-06-05'),('2053-06-06'),('2053-06-07'),('2053-06-08'),('2053-06-09'),('2053-06-10'),('2053-06-11'),('2053-06-12'),('2053-06-13'),('2053-06-14'),('2053-06-15'),('2053-06-16'),('2053-06-17'),('2053-06-18'),('2053-06-19'),('2053-06-20'),('2053-06-21'),('2053-06-22'),('2053-06-23'),('2053-06-24'),('2053-06-25'),('2053-06-26'),('2053-06-27'),('2053-06-28'),('2053-06-29'),('2053-06-30'),('2053-07-01'),('2053-07-02'),('2053-07-03'),('2053-07-04'),('2053-07-05'),('2053-07-06'),('2053-07-07'),('2053-07-08'),('2053-07-09'),('2053-07-10'),('2053-07-11'),('2053-07-12'),('2053-07-13'),('2053-07-14'),('2053-07-15'),('2053-07-16'),('2053-07-17'),('2053-07-18'),('2053-07-19'),('2053-07-20'),('2053-07-21'),('2053-07-22'),('2053-07-23'),('2053-07-24'),('2053-07-25'),('2053-07-26'),('2053-07-27'),('2053-07-28'),('2053-07-29'),('2053-07-30'),('2053-07-31'),('2053-08-01'),('2053-08-02'),('2053-08-03'),('2053-08-04'),('2053-08-05'),('2053-08-06'),('2053-08-07'),('2053-08-08'),('2053-08-09'),('2053-08-10'),('2053-08-11'),('2053-08-12'),('2053-08-13'),('2053-08-14'),('2053-08-15'),('2053-08-16'),('2053-08-17'),('2053-08-18'),('2053-08-19'),('2053-08-20'),('2053-08-21'),('2053-08-22'),('2053-08-23'),('2053-08-24'),('2053-08-25'),('2053-08-26'),('2053-08-27'),('2053-08-28'),('2053-08-29'),('2053-08-30'),('2053-08-31'),('2053-09-01'),('2053-09-02'),('2053-09-03'),('2053-09-04'),('2053-09-05'),('2053-09-06'),('2053-09-07'),('2053-09-08'),('2053-09-09'),('2053-09-10'),('2053-09-11'),('2053-09-12'),('2053-09-13'),('2053-09-14'),('2053-09-15'),('2053-09-16'),('2053-09-17'),('2053-09-18'),('2053-09-19'),('2053-09-20'),('2053-09-21'),('2053-09-22'),('2053-09-23'),('2053-09-24'),('2053-09-25'),('2053-09-26'),('2053-09-27'),('2053-09-28'),('2053-09-29'),('2053-09-30'),('2053-10-01'),('2053-10-02'),('2053-10-03'),('2053-10-04'),('2053-10-05'),('2053-10-06'),('2053-10-07'),('2053-10-08'),('2053-10-09'),('2053-10-10'),('2053-10-11'),('2053-10-12'),('2053-10-13'),('2053-10-14'),('2053-10-15'),('2053-10-16'),('2053-10-17'),('2053-10-18'),('2053-10-19'),('2053-10-20'),('2053-10-21'),('2053-10-22'),('2053-10-23'),('2053-10-24'),('2053-10-25'),('2053-10-26'),('2053-10-27'),('2053-10-28'),('2053-10-29'),('2053-10-30'),('2053-10-31'),('2053-11-01'),('2053-11-02'),('2053-11-03'),('2053-11-04'),('2053-11-05'),('2053-11-06'),('2053-11-07'),('2053-11-08'),('2053-11-09'),('2053-11-10'),('2053-11-11'),('2053-11-12'),('2053-11-13'),('2053-11-14'),('2053-11-15'),('2053-11-16'),('2053-11-17'),('2053-11-18'),('2053-11-19'),('2053-11-20'),('2053-11-21'),('2053-11-22'),('2053-11-23'),('2053-11-24'),('2053-11-25'),('2053-11-26'),('2053-11-27'),('2053-11-28'),('2053-11-29'),('2053-11-30'),('2053-12-01'),('2053-12-02'),('2053-12-03'),('2053-12-04'),('2053-12-05'),('2053-12-06'),('2053-12-07'),('2053-12-08'),('2053-12-09'),('2053-12-10'),('2053-12-11'),('2053-12-12'),('2053-12-13'),('2053-12-14'),('2053-12-15'),('2053-12-16'),('2053-12-17'),('2053-12-18'),('2053-12-19'),('2053-12-20'),('2053-12-21'),('2053-12-22'),('2053-12-23'),('2053-12-24'),('2053-12-25'),('2053-12-26'),('2053-12-27'),('2053-12-28'),('2053-12-29'),('2053-12-30'),('2053-12-31'),('2054-01-01'),('2054-01-02'),('2054-01-03'),('2054-01-04'),('2054-01-05'),('2054-01-06'),('2054-01-07'),('2054-01-08'),('2054-01-09'),('2054-01-10'),('2054-01-11'),('2054-01-12'),('2054-01-13'),('2054-01-14'),('2054-01-15'),('2054-01-16'),('2054-01-17'),('2054-01-18'),('2054-01-19'),('2054-01-20'),('2054-01-21'),('2054-01-22'),('2054-01-23'),('2054-01-24'),('2054-01-25'),('2054-01-26'),('2054-01-27'),('2054-01-28'),('2054-01-29'),('2054-01-30'),('2054-01-31'),('2054-02-01'),('2054-02-02'),('2054-02-03'),('2054-02-04'),('2054-02-05'),('2054-02-06'),('2054-02-07'),('2054-02-08'),('2054-02-09'),('2054-02-10'),('2054-02-11'),('2054-02-12'),('2054-02-13'),('2054-02-14'),('2054-02-15'),('2054-02-16'),('2054-02-17'),('2054-02-18'),('2054-02-19'),('2054-02-20'),('2054-02-21'),('2054-02-22'),('2054-02-23'),('2054-02-24'),('2054-02-25'),('2054-02-26'),('2054-02-27'),('2054-02-28'),('2054-03-01'),('2054-03-02'),('2054-03-03'),('2054-03-04'),('2054-03-05'),('2054-03-06'),('2054-03-07'),('2054-03-08'),('2054-03-09'),('2054-03-10'),('2054-03-11'),('2054-03-12'),('2054-03-13'),('2054-03-14'),('2054-03-15'),('2054-03-16'),('2054-03-17'),('2054-03-18'),('2054-03-19'),('2054-03-20'),('2054-03-21'),('2054-03-22'),('2054-03-23'),('2054-03-24'),('2054-03-25'),('2054-03-26'),('2054-03-27'),('2054-03-28'),('2054-03-29'),('2054-03-30'),('2054-03-31'),('2054-04-01'),('2054-04-02'),('2054-04-03'),('2054-04-04'),('2054-04-05'),('2054-04-06'),('2054-04-07'),('2054-04-08'),('2054-04-09'),('2054-04-10'),('2054-04-11'),('2054-04-12'),('2054-04-13'),('2054-04-14'),('2054-04-15'),('2054-04-16'),('2054-04-17'),('2054-04-18'),('2054-04-19'),('2054-04-20'),('2054-04-21'),('2054-04-22'),('2054-04-23'),('2054-04-24'),('2054-04-25'),('2054-04-26'),('2054-04-27'),('2054-04-28'),('2054-04-29'),('2054-04-30'),('2054-05-01'),('2054-05-02'),('2054-05-03'),('2054-05-04'),('2054-05-05'),('2054-05-06'),('2054-05-07'),('2054-05-08'),('2054-05-09'),('2054-05-10'),('2054-05-11'),('2054-05-12'),('2054-05-13'),('2054-05-14'),('2054-05-15'),('2054-05-16'),('2054-05-17'),('2054-05-18'),('2054-05-19'),('2054-05-20'),('2054-05-21'),('2054-05-22'),('2054-05-23'),('2054-05-24'),('2054-05-25'),('2054-05-26'),('2054-05-27'),('2054-05-28'),('2054-05-29'),('2054-05-30'),('2054-05-31'),('2054-06-01'),('2054-06-02'),('2054-06-03'),('2054-06-04'),('2054-06-05'),('2054-06-06'),('2054-06-07'),('2054-06-08'),('2054-06-09'),('2054-06-10'),('2054-06-11'),('2054-06-12'),('2054-06-13'),('2054-06-14'),('2054-06-15'),('2054-06-16'),('2054-06-17'),('2054-06-18'),('2054-06-19'),('2054-06-20'),('2054-06-21'),('2054-06-22'),('2054-06-23'),('2054-06-24'),('2054-06-25'),('2054-06-26'),('2054-06-27'),('2054-06-28'),('2054-06-29'),('2054-06-30'),('2054-07-01'),('2054-07-02'),('2054-07-03'),('2054-07-04'),('2054-07-05'),('2054-07-06'),('2054-07-07'),('2054-07-08'),('2054-07-09'),('2054-07-10'),('2054-07-11'),('2054-07-12'),('2054-07-13'),('2054-07-14'),('2054-07-15'),('2054-07-16'),('2054-07-17'),('2054-07-18'),('2054-07-19'),('2054-07-20'),('2054-07-21'),('2054-07-22'),('2054-07-23'),('2054-07-24'),('2054-07-25'),('2054-07-26'),('2054-07-27'),('2054-07-28'),('2054-07-29'),('2054-07-30'),('2054-07-31'),('2054-08-01'),('2054-08-02'),('2054-08-03'),('2054-08-04'),('2054-08-05'),('2054-08-06'),('2054-08-07'),('2054-08-08'),('2054-08-09'),('2054-08-10'),('2054-08-11'),('2054-08-12'),('2054-08-13'),('2054-08-14'),('2054-08-15'),('2054-08-16'),('2054-08-17'),('2054-08-18'),('2054-08-19'),('2054-08-20'),('2054-08-21'),('2054-08-22'),('2054-08-23'),('2054-08-24'),('2054-08-25'),('2054-08-26'),('2054-08-27'),('2054-08-28'),('2054-08-29'),('2054-08-30'),('2054-08-31'),('2054-09-01'),('2054-09-02'),('2054-09-03'),('2054-09-04'),('2054-09-05'),('2054-09-06'),('2054-09-07'),('2054-09-08'),('2054-09-09'),('2054-09-10'),('2054-09-11'),('2054-09-12'),('2054-09-13'),('2054-09-14'),('2054-09-15'),('2054-09-16'),('2054-09-17'),('2054-09-18'),('2054-09-19'),('2054-09-20'),('2054-09-21'),('2054-09-22'),('2054-09-23'),('2054-09-24'),('2054-09-25'),('2054-09-26'),('2054-09-27'),('2054-09-28'),('2054-09-29'),('2054-09-30'),('2054-10-01'),('2054-10-02'),('2054-10-03'),('2054-10-04'),('2054-10-05'),('2054-10-06'),('2054-10-07'),('2054-10-08'),('2054-10-09'),('2054-10-10'),('2054-10-11'),('2054-10-12'),('2054-10-13'),('2054-10-14'),('2054-10-15'),('2054-10-16'),('2054-10-17'),('2054-10-18'),('2054-10-19'),('2054-10-20'),('2054-10-21'),('2054-10-22'),('2054-10-23'),('2054-10-24'),('2054-10-25'),('2054-10-26'),('2054-10-27'),('2054-10-28'),('2054-10-29'),('2054-10-30'),('2054-10-31'),('2054-11-01'),('2054-11-02'),('2054-11-03'),('2054-11-04'),('2054-11-05'),('2054-11-06'),('2054-11-07'),('2054-11-08'),('2054-11-09'),('2054-11-10'),('2054-11-11'),('2054-11-12'),('2054-11-13'),('2054-11-14'),('2054-11-15'),('2054-11-16'),('2054-11-17'),('2054-11-18'),('2054-11-19'),('2054-11-20'),('2054-11-21'),('2054-11-22'),('2054-11-23'),('2054-11-24'),('2054-11-25'),('2054-11-26'),('2054-11-27'),('2054-11-28'),('2054-11-29'),('2054-11-30'),('2054-12-01'),('2054-12-02'),('2054-12-03'),('2054-12-04'),('2054-12-05'),('2054-12-06'),('2054-12-07'),('2054-12-08'),('2054-12-09'),('2054-12-10'),('2054-12-11'),('2054-12-12'),('2054-12-13'),('2054-12-14'),('2054-12-15'),('2054-12-16'),('2054-12-17'),('2054-12-18'),('2054-12-19'),('2054-12-20'),('2054-12-21'),('2054-12-22'),('2054-12-23'),('2054-12-24'),('2054-12-25'),('2054-12-26'),('2054-12-27'),('2054-12-28'),('2054-12-29'),('2054-12-30'),('2054-12-31'),('2055-01-01'),('2055-01-02'),('2055-01-03'),('2055-01-04'),('2055-01-05'),('2055-01-06'),('2055-01-07'),('2055-01-08'),('2055-01-09'),('2055-01-10'),('2055-01-11'),('2055-01-12'),('2055-01-13'),('2055-01-14'),('2055-01-15'),('2055-01-16'),('2055-01-17'),('2055-01-18'),('2055-01-19'),('2055-01-20'),('2055-01-21'),('2055-01-22'),('2055-01-23'),('2055-01-24'),('2055-01-25'),('2055-01-26'),('2055-01-27'),('2055-01-28'),('2055-01-29'),('2055-01-30'),('2055-01-31'),('2055-02-01'),('2055-02-02'),('2055-02-03'),('2055-02-04'),('2055-02-05'),('2055-02-06'),('2055-02-07'),('2055-02-08'),('2055-02-09'),('2055-02-10'),('2055-02-11'),('2055-02-12'),('2055-02-13'),('2055-02-14'),('2055-02-15'),('2055-02-16'),('2055-02-17'),('2055-02-18'),('2055-02-19'),('2055-02-20'),('2055-02-21'),('2055-02-22'),('2055-02-23'),('2055-02-24'),('2055-02-25'),('2055-02-26'),('2055-02-27'),('2055-02-28'),('2055-03-01'),('2055-03-02'),('2055-03-03'),('2055-03-04'),('2055-03-05'),('2055-03-06'),('2055-03-07'),('2055-03-08'),('2055-03-09'),('2055-03-10'),('2055-03-11'),('2055-03-12'),('2055-03-13'),('2055-03-14'),('2055-03-15'),('2055-03-16'),('2055-03-17'),('2055-03-18'),('2055-03-19'),('2055-03-20'),('2055-03-21'),('2055-03-22'),('2055-03-23'),('2055-03-24'),('2055-03-25'),('2055-03-26'),('2055-03-27'),('2055-03-28'),('2055-03-29'),('2055-03-30'),('2055-03-31'),('2055-04-01'),('2055-04-02'),('2055-04-03'),('2055-04-04'),('2055-04-05'),('2055-04-06'),('2055-04-07'),('2055-04-08'),('2055-04-09'),('2055-04-10'),('2055-04-11'),('2055-04-12'),('2055-04-13'),('2055-04-14'),('2055-04-15'),('2055-04-16'),('2055-04-17'),('2055-04-18'),('2055-04-19'),('2055-04-20'),('2055-04-21'),('2055-04-22'),('2055-04-23'),('2055-04-24'),('2055-04-25'),('2055-04-26'),('2055-04-27'),('2055-04-28'),('2055-04-29'),('2055-04-30'),('2055-05-01'),('2055-05-02'),('2055-05-03'),('2055-05-04'),('2055-05-05'),('2055-05-06'),('2055-05-07'),('2055-05-08'),('2055-05-09'),('2055-05-10'),('2055-05-11'),('2055-05-12'),('2055-05-13'),('2055-05-14'),('2055-05-15'),('2055-05-16'),('2055-05-17'),('2055-05-18'),('2055-05-19'),('2055-05-20'),('2055-05-21'),('2055-05-22'),('2055-05-23'),('2055-05-24'),('2055-05-25'),('2055-05-26'),('2055-05-27'),('2055-05-28'),('2055-05-29'),('2055-05-30'),('2055-05-31'),('2055-06-01'),('2055-06-02'),('2055-06-03'),('2055-06-04'),('2055-06-05'),('2055-06-06'),('2055-06-07'),('2055-06-08'),('2055-06-09'),('2055-06-10'),('2055-06-11'),('2055-06-12'),('2055-06-13'),('2055-06-14'),('2055-06-15'),('2055-06-16'),('2055-06-17'),('2055-06-18'),('2055-06-19'),('2055-06-20'),('2055-06-21'),('2055-06-22'),('2055-06-23'),('2055-06-24'),('2055-06-25'),('2055-06-26'),('2055-06-27'),('2055-06-28'),('2055-06-29'),('2055-06-30'),('2055-07-01'),('2055-07-02'),('2055-07-03'),('2055-07-04'),('2055-07-05'),('2055-07-06'),('2055-07-07'),('2055-07-08'),('2055-07-09'),('2055-07-10'),('2055-07-11'),('2055-07-12'),('2055-07-13'),('2055-07-14'),('2055-07-15'),('2055-07-16'),('2055-07-17'),('2055-07-18'),('2055-07-19'),('2055-07-20'),('2055-07-21'),('2055-07-22'),('2055-07-23'),('2055-07-24'),('2055-07-25'),('2055-07-26'),('2055-07-27'),('2055-07-28'),('2055-07-29'),('2055-07-30'),('2055-07-31'),('2055-08-01'),('2055-08-02'),('2055-08-03'),('2055-08-04'),('2055-08-05'),('2055-08-06'),('2055-08-07'),('2055-08-08'),('2055-08-09'),('2055-08-10'),('2055-08-11'),('2055-08-12'),('2055-08-13'),('2055-08-14'),('2055-08-15'),('2055-08-16'),('2055-08-17'),('2055-08-18'),('2055-08-19'),('2055-08-20'),('2055-08-21'),('2055-08-22'),('2055-08-23'),('2055-08-24'),('2055-08-25'),('2055-08-26'),('2055-08-27'),('2055-08-28'),('2055-08-29'),('2055-08-30'),('2055-08-31'),('2055-09-01'),('2055-09-02'),('2055-09-03'),('2055-09-04'),('2055-09-05'),('2055-09-06'),('2055-09-07'),('2055-09-08'),('2055-09-09'),('2055-09-10'),('2055-09-11'),('2055-09-12'),('2055-09-13'),('2055-09-14'),('2055-09-15'),('2055-09-16'),('2055-09-17'),('2055-09-18'),('2055-09-19'),('2055-09-20'),('2055-09-21'),('2055-09-22'),('2055-09-23'),('2055-09-24'),('2055-09-25'),('2055-09-26'),('2055-09-27'),('2055-09-28'),('2055-09-29'),('2055-09-30'),('2055-10-01'),('2055-10-02'),('2055-10-03'),('2055-10-04'),('2055-10-05'),('2055-10-06'),('2055-10-07'),('2055-10-08'),('2055-10-09'),('2055-10-10'),('2055-10-11'),('2055-10-12'),('2055-10-13'),('2055-10-14'),('2055-10-15'),('2055-10-16'),('2055-10-17'),('2055-10-18'),('2055-10-19'),('2055-10-20'),('2055-10-21'),('2055-10-22'),('2055-10-23'),('2055-10-24'),('2055-10-25'),('2055-10-26'),('2055-10-27'),('2055-10-28'),('2055-10-29'),('2055-10-30'),('2055-10-31'),('2055-11-01'),('2055-11-02'),('2055-11-03'),('2055-11-04'),('2055-11-05'),('2055-11-06'),('2055-11-07'),('2055-11-08'),('2055-11-09'),('2055-11-10'),('2055-11-11'),('2055-11-12'),('2055-11-13'),('2055-11-14'),('2055-11-15'),('2055-11-16'),('2055-11-17'),('2055-11-18'),('2055-11-19'),('2055-11-20'),('2055-11-21'),('2055-11-22'),('2055-11-23'),('2055-11-24'),('2055-11-25'),('2055-11-26'),('2055-11-27'),('2055-11-28'),('2055-11-29'),('2055-11-30'),('2055-12-01'),('2055-12-02'),('2055-12-03'),('2055-12-04'),('2055-12-05'),('2055-12-06'),('2055-12-07'),('2055-12-08'),('2055-12-09'),('2055-12-10'),('2055-12-11'),('2055-12-12'),('2055-12-13'),('2055-12-14'),('2055-12-15'),('2055-12-16'),('2055-12-17'),('2055-12-18'),('2055-12-19'),('2055-12-20'),('2055-12-21'),('2055-12-22'),('2055-12-23'),('2055-12-24'),('2055-12-25'),('2055-12-26'),('2055-12-27'),('2055-12-28'),('2055-12-29'),('2055-12-30'),('2055-12-31'),('2056-01-01'),('2056-01-02'),('2056-01-03'),('2056-01-04'),('2056-01-05'),('2056-01-06'),('2056-01-07'),('2056-01-08'),('2056-01-09'),('2056-01-10'),('2056-01-11'),('2056-01-12'),('2056-01-13'),('2056-01-14'),('2056-01-15'),('2056-01-16'),('2056-01-17'),('2056-01-18'),('2056-01-19'),('2056-01-20'),('2056-01-21'),('2056-01-22'),('2056-01-23'),('2056-01-24'),('2056-01-25'),('2056-01-26'),('2056-01-27'),('2056-01-28'),('2056-01-29'),('2056-01-30'),('2056-01-31'),('2056-02-01'),('2056-02-02'),('2056-02-03'),('2056-02-04'),('2056-02-05'),('2056-02-06'),('2056-02-07'),('2056-02-08'),('2056-02-09'),('2056-02-10'),('2056-02-11'),('2056-02-12'),('2056-02-13'),('2056-02-14'),('2056-02-15'),('2056-02-16'),('2056-02-17'),('2056-02-18'),('2056-02-19'),('2056-02-20'),('2056-02-21'),('2056-02-22'),('2056-02-23'),('2056-02-24'),('2056-02-25'),('2056-02-26'),('2056-02-27'),('2056-02-28'),('2056-02-29'),('2056-03-01'),('2056-03-02'),('2056-03-03'),('2056-03-04'),('2056-03-05'),('2056-03-06'),('2056-03-07'),('2056-03-08'),('2056-03-09'),('2056-03-10'),('2056-03-11'),('2056-03-12'),('2056-03-13'),('2056-03-14'),('2056-03-15'),('2056-03-16'),('2056-03-17'),('2056-03-18'),('2056-03-19'),('2056-03-20'),('2056-03-21'),('2056-03-22'),('2056-03-23'),('2056-03-24'),('2056-03-25'),('2056-03-26'),('2056-03-27'),('2056-03-28'),('2056-03-29'),('2056-03-30'),('2056-03-31'),('2056-04-01'),('2056-04-02'),('2056-04-03'),('2056-04-04'),('2056-04-05'),('2056-04-06'),('2056-04-07'),('2056-04-08'),('2056-04-09'),('2056-04-10'),('2056-04-11'),('2056-04-12'),('2056-04-13'),('2056-04-14'),('2056-04-15'),('2056-04-16'),('2056-04-17'),('2056-04-18'),('2056-04-19'),('2056-04-20'),('2056-04-21'),('2056-04-22'),('2056-04-23'),('2056-04-24'),('2056-04-25'),('2056-04-26'),('2056-04-27'),('2056-04-28'),('2056-04-29'),('2056-04-30'),('2056-05-01'),('2056-05-02'),('2056-05-03'),('2056-05-04'),('2056-05-05'),('2056-05-06'),('2056-05-07'),('2056-05-08'),('2056-05-09'),('2056-05-10'),('2056-05-11'),('2056-05-12'),('2056-05-13'),('2056-05-14'),('2056-05-15'),('2056-05-16'),('2056-05-17'),('2056-05-18'),('2056-05-19'),('2056-05-20'),('2056-05-21'),('2056-05-22'),('2056-05-23'),('2056-05-24'),('2056-05-25'),('2056-05-26'),('2056-05-27'),('2056-05-28'),('2056-05-29'),('2056-05-30'),('2056-05-31'),('2056-06-01'),('2056-06-02'),('2056-06-03'),('2056-06-04'),('2056-06-05'),('2056-06-06'),('2056-06-07'),('2056-06-08'),('2056-06-09'),('2056-06-10'),('2056-06-11'),('2056-06-12'),('2056-06-13'),('2056-06-14'),('2056-06-15'),('2056-06-16'),('2056-06-17'),('2056-06-18'),('2056-06-19'),('2056-06-20'),('2056-06-21'),('2056-06-22'),('2056-06-23'),('2056-06-24'),('2056-06-25'),('2056-06-26'),('2056-06-27'),('2056-06-28'),('2056-06-29'),('2056-06-30'),('2056-07-01'),('2056-07-02'),('2056-07-03'),('2056-07-04'),('2056-07-05'),('2056-07-06'),('2056-07-07'),('2056-07-08'),('2056-07-09'),('2056-07-10'),('2056-07-11'),('2056-07-12'),('2056-07-13'),('2056-07-14'),('2056-07-15'),('2056-07-16'),('2056-07-17'),('2056-07-18'),('2056-07-19'),('2056-07-20'),('2056-07-21'),('2056-07-22'),('2056-07-23'),('2056-07-24'),('2056-07-25'),('2056-07-26'),('2056-07-27'),('2056-07-28'),('2056-07-29'),('2056-07-30'),('2056-07-31'),('2056-08-01'),('2056-08-02'),('2056-08-03'),('2056-08-04'),('2056-08-05'),('2056-08-06'),('2056-08-07'),('2056-08-08'),('2056-08-09'),('2056-08-10'),('2056-08-11'),('2056-08-12'),('2056-08-13'),('2056-08-14'),('2056-08-15'),('2056-08-16'),('2056-08-17'),('2056-08-18'),('2056-08-19'),('2056-08-20'),('2056-08-21'),('2056-08-22'),('2056-08-23'),('2056-08-24'),('2056-08-25'),('2056-08-26'),('2056-08-27'),('2056-08-28'),('2056-08-29'),('2056-08-30'),('2056-08-31'),('2056-09-01'),('2056-09-02'),('2056-09-03'),('2056-09-04'),('2056-09-05'),('2056-09-06'),('2056-09-07'),('2056-09-08'),('2056-09-09'),('2056-09-10'),('2056-09-11'),('2056-09-12'),('2056-09-13'),('2056-09-14'),('2056-09-15'),('2056-09-16'),('2056-09-17'),('2056-09-18'),('2056-09-19'),('2056-09-20'),('2056-09-21'),('2056-09-22'),('2056-09-23'),('2056-09-24'),('2056-09-25'),('2056-09-26'),('2056-09-27'),('2056-09-28'),('2056-09-29'),('2056-09-30'),('2056-10-01'),('2056-10-02'),('2056-10-03'),('2056-10-04'),('2056-10-05'),('2056-10-06'),('2056-10-07'),('2056-10-08'),('2056-10-09'),('2056-10-10'),('2056-10-11'),('2056-10-12'),('2056-10-13'),('2056-10-14'),('2056-10-15'),('2056-10-16'),('2056-10-17'),('2056-10-18'),('2056-10-19'),('2056-10-20'),('2056-10-21'),('2056-10-22'),('2056-10-23'),('2056-10-24'),('2056-10-25'),('2056-10-26'),('2056-10-27'),('2056-10-28'),('2056-10-29'),('2056-10-30'),('2056-10-31'),('2056-11-01'),('2056-11-02'),('2056-11-03'),('2056-11-04'),('2056-11-05'),('2056-11-06'),('2056-11-07'),('2056-11-08'),('2056-11-09'),('2056-11-10'),('2056-11-11'),('2056-11-12'),('2056-11-13'),('2056-11-14'),('2056-11-15'),('2056-11-16'),('2056-11-17'),('2056-11-18'),('2056-11-19'),('2056-11-20'),('2056-11-21'),('2056-11-22'),('2056-11-23'),('2056-11-24'),('2056-11-25'),('2056-11-26'),('2056-11-27'),('2056-11-28'),('2056-11-29'),('2056-11-30'),('2056-12-01'),('2056-12-02'),('2056-12-03'),('2056-12-04'),('2056-12-05'),('2056-12-06'),('2056-12-07'),('2056-12-08'),('2056-12-09'),('2056-12-10'),('2056-12-11'),('2056-12-12'),('2056-12-13'),('2056-12-14'),('2056-12-15'),('2056-12-16'),('2056-12-17'),('2056-12-18'),('2056-12-19'),('2056-12-20'),('2056-12-21'),('2056-12-22'),('2056-12-23'),('2056-12-24'),('2056-12-25'),('2056-12-26'),('2056-12-27'),('2056-12-28'),('2056-12-29'),('2056-12-30'),('2056-12-31'),('2057-01-01'),('2057-01-02'),('2057-01-03'),('2057-01-04'),('2057-01-05'),('2057-01-06'),('2057-01-07'),('2057-01-08'),('2057-01-09'),('2057-01-10'),('2057-01-11'),('2057-01-12'),('2057-01-13'),('2057-01-14'),('2057-01-15'),('2057-01-16'),('2057-01-17'),('2057-01-18'),('2057-01-19'),('2057-01-20'),('2057-01-21'),('2057-01-22'),('2057-01-23'),('2057-01-24'),('2057-01-25'),('2057-01-26'),('2057-01-27'),('2057-01-28'),('2057-01-29'),('2057-01-30'),('2057-01-31'),('2057-02-01'),('2057-02-02'),('2057-02-03'),('2057-02-04'),('2057-02-05'),('2057-02-06'),('2057-02-07'),('2057-02-08'),('2057-02-09'),('2057-02-10'),('2057-02-11'),('2057-02-12'),('2057-02-13'),('2057-02-14'),('2057-02-15'),('2057-02-16'),('2057-02-17'),('2057-02-18'),('2057-02-19'),('2057-02-20'),('2057-02-21'),('2057-02-22'),('2057-02-23'),('2057-02-24'),('2057-02-25'),('2057-02-26'),('2057-02-27'),('2057-02-28'),('2057-03-01'),('2057-03-02'),('2057-03-03'),('2057-03-04'),('2057-03-05'),('2057-03-06'),('2057-03-07'),('2057-03-08'),('2057-03-09'),('2057-03-10'),('2057-03-11'),('2057-03-12'),('2057-03-13'),('2057-03-14'),('2057-03-15'),('2057-03-16'),('2057-03-17'),('2057-03-18'),('2057-03-19'),('2057-03-20'),('2057-03-21'),('2057-03-22'),('2057-03-23'),('2057-03-24'),('2057-03-25'),('2057-03-26'),('2057-03-27'),('2057-03-28'),('2057-03-29'),('2057-03-30'),('2057-03-31'),('2057-04-01'),('2057-04-02'),('2057-04-03'),('2057-04-04'),('2057-04-05'),('2057-04-06'),('2057-04-07'),('2057-04-08'),('2057-04-09'),('2057-04-10'),('2057-04-11'),('2057-04-12'),('2057-04-13'),('2057-04-14'),('2057-04-15'),('2057-04-16'),('2057-04-17'),('2057-04-18'),('2057-04-19'),('2057-04-20'),('2057-04-21'),('2057-04-22'),('2057-04-23'),('2057-04-24'),('2057-04-25'),('2057-04-26'),('2057-04-27'),('2057-04-28'),('2057-04-29'),('2057-04-30'),('2057-05-01'),('2057-05-02'),('2057-05-03'),('2057-05-04'),('2057-05-05'),('2057-05-06'),('2057-05-07'),('2057-05-08'),('2057-05-09'),('2057-05-10'),('2057-05-11'),('2057-05-12'),('2057-05-13'),('2057-05-14'),('2057-05-15'),('2057-05-16'),('2057-05-17'),('2057-05-18'),('2057-05-19'),('2057-05-20'),('2057-05-21'),('2057-05-22'),('2057-05-23'),('2057-05-24'),('2057-05-25'),('2057-05-26'),('2057-05-27'),('2057-05-28'),('2057-05-29'),('2057-05-30'),('2057-05-31'),('2057-06-01'),('2057-06-02'),('2057-06-03'),('2057-06-04'),('2057-06-05'),('2057-06-06'),('2057-06-07'),('2057-06-08'),('2057-06-09'),('2057-06-10'),('2057-06-11'),('2057-06-12'),('2057-06-13'),('2057-06-14'),('2057-06-15'),('2057-06-16'),('2057-06-17'),('2057-06-18'),('2057-06-19'),('2057-06-20'),('2057-06-21'),('2057-06-22'),('2057-06-23'),('2057-06-24'),('2057-06-25'),('2057-06-26'),('2057-06-27'),('2057-06-28'),('2057-06-29'),('2057-06-30'),('2057-07-01'),('2057-07-02'),('2057-07-03'),('2057-07-04'),('2057-07-05'),('2057-07-06'),('2057-07-07'),('2057-07-08'),('2057-07-09'),('2057-07-10'),('2057-07-11'),('2057-07-12'),('2057-07-13'),('2057-07-14'),('2057-07-15'),('2057-07-16'),('2057-07-17'),('2057-07-18'),('2057-07-19'),('2057-07-20'),('2057-07-21'),('2057-07-22'),('2057-07-23'),('2057-07-24'),('2057-07-25'),('2057-07-26'),('2057-07-27'),('2057-07-28'),('2057-07-29'),('2057-07-30'),('2057-07-31'),('2057-08-01'),('2057-08-02'),('2057-08-03'),('2057-08-04'),('2057-08-05'),('2057-08-06'),('2057-08-07'),('2057-08-08'),('2057-08-09'),('2057-08-10'),('2057-08-11'),('2057-08-12'),('2057-08-13'),('2057-08-14'),('2057-08-15'),('2057-08-16'),('2057-08-17'),('2057-08-18'),('2057-08-19'),('2057-08-20'),('2057-08-21'),('2057-08-22'),('2057-08-23'),('2057-08-24'),('2057-08-25'),('2057-08-26'),('2057-08-27'),('2057-08-28'),('2057-08-29'),('2057-08-30'),('2057-08-31'),('2057-09-01'),('2057-09-02'),('2057-09-03'),('2057-09-04'),('2057-09-05'),('2057-09-06'),('2057-09-07'),('2057-09-08'),('2057-09-09'),('2057-09-10'),('2057-09-11'),('2057-09-12'),('2057-09-13'),('2057-09-14'),('2057-09-15'),('2057-09-16'),('2057-09-17'),('2057-09-18'),('2057-09-19'),('2057-09-20'),('2057-09-21'),('2057-09-22'),('2057-09-23'),('2057-09-24'),('2057-09-25'),('2057-09-26'),('2057-09-27'),('2057-09-28'),('2057-09-29'),('2057-09-30'),('2057-10-01'),('2057-10-02'),('2057-10-03'),('2057-10-04'),('2057-10-05'),('2057-10-06'),('2057-10-07'),('2057-10-08'),('2057-10-09'),('2057-10-10'),('2057-10-11'),('2057-10-12'),('2057-10-13'),('2057-10-14'),('2057-10-15'),('2057-10-16'),('2057-10-17'),('2057-10-18'),('2057-10-19'),('2057-10-20'),('2057-10-21'),('2057-10-22'),('2057-10-23'),('2057-10-24'),('2057-10-25'),('2057-10-26'),('2057-10-27'),('2057-10-28'),('2057-10-29'),('2057-10-30'),('2057-10-31'),('2057-11-01'),('2057-11-02'),('2057-11-03'),('2057-11-04'),('2057-11-05'),('2057-11-06'),('2057-11-07'),('2057-11-08'),('2057-11-09'),('2057-11-10'),('2057-11-11'),('2057-11-12'),('2057-11-13'),('2057-11-14'),('2057-11-15'),('2057-11-16'),('2057-11-17'),('2057-11-18'),('2057-11-19'),('2057-11-20'),('2057-11-21'),('2057-11-22'),('2057-11-23'),('2057-11-24'),('2057-11-25'),('2057-11-26'),('2057-11-27'),('2057-11-28'),('2057-11-29'),('2057-11-30'),('2057-12-01'),('2057-12-02'),('2057-12-03'),('2057-12-04'),('2057-12-05'),('2057-12-06'),('2057-12-07'),('2057-12-08'),('2057-12-09'),('2057-12-10'),('2057-12-11'),('2057-12-12'),('2057-12-13'),('2057-12-14'),('2057-12-15'),('2057-12-16'),('2057-12-17'),('2057-12-18'),('2057-12-19'),('2057-12-20'),('2057-12-21'),('2057-12-22'),('2057-12-23'),('2057-12-24'),('2057-12-25'),('2057-12-26'),('2057-12-27'),('2057-12-28'),('2057-12-29'),('2057-12-30'),('2057-12-31'),('2058-01-01'),('2058-01-02'),('2058-01-03'),('2058-01-04'),('2058-01-05'),('2058-01-06'),('2058-01-07'),('2058-01-08'),('2058-01-09'),('2058-01-10'),('2058-01-11'),('2058-01-12'),('2058-01-13'),('2058-01-14'),('2058-01-15'),('2058-01-16'),('2058-01-17'),('2058-01-18'),('2058-01-19'),('2058-01-20'),('2058-01-21'),('2058-01-22'),('2058-01-23'),('2058-01-24'),('2058-01-25'),('2058-01-26'),('2058-01-27'),('2058-01-28'),('2058-01-29'),('2058-01-30'),('2058-01-31'),('2058-02-01'),('2058-02-02'),('2058-02-03'),('2058-02-04'),('2058-02-05'),('2058-02-06'),('2058-02-07'),('2058-02-08'),('2058-02-09'),('2058-02-10'),('2058-02-11'),('2058-02-12'),('2058-02-13'),('2058-02-14'),('2058-02-15'),('2058-02-16'),('2058-02-17'),('2058-02-18'),('2058-02-19'),('2058-02-20'),('2058-02-21'),('2058-02-22'),('2058-02-23'),('2058-02-24'),('2058-02-25'),('2058-02-26'),('2058-02-27'),('2058-02-28'),('2058-03-01'),('2058-03-02'),('2058-03-03'),('2058-03-04'),('2058-03-05'),('2058-03-06'),('2058-03-07'),('2058-03-08'),('2058-03-09'),('2058-03-10'),('2058-03-11'),('2058-03-12'),('2058-03-13'),('2058-03-14'),('2058-03-15'),('2058-03-16'),('2058-03-17'),('2058-03-18'),('2058-03-19'),('2058-03-20'),('2058-03-21'),('2058-03-22'),('2058-03-23'),('2058-03-24'),('2058-03-25'),('2058-03-26'),('2058-03-27'),('2058-03-28'),('2058-03-29'),('2058-03-30'),('2058-03-31'),('2058-04-01'),('2058-04-02'),('2058-04-03'),('2058-04-04'),('2058-04-05'),('2058-04-06'),('2058-04-07'),('2058-04-08'),('2058-04-09'),('2058-04-10'),('2058-04-11'),('2058-04-12'),('2058-04-13'),('2058-04-14'),('2058-04-15'),('2058-04-16'),('2058-04-17'),('2058-04-18'),('2058-04-19'),('2058-04-20'),('2058-04-21'),('2058-04-22'),('2058-04-23'),('2058-04-24'),('2058-04-25'),('2058-04-26'),('2058-04-27'),('2058-04-28'),('2058-04-29'),('2058-04-30'),('2058-05-01'),('2058-05-02'),('2058-05-03'),('2058-05-04'),('2058-05-05'),('2058-05-06'),('2058-05-07'),('2058-05-08'),('2058-05-09'),('2058-05-10'),('2058-05-11'),('2058-05-12'),('2058-05-13'),('2058-05-14'),('2058-05-15'),('2058-05-16'),('2058-05-17'),('2058-05-18'),('2058-05-19'),('2058-05-20'),('2058-05-21'),('2058-05-22'),('2058-05-23'),('2058-05-24'),('2058-05-25'),('2058-05-26'),('2058-05-27'),('2058-05-28'),('2058-05-29'),('2058-05-30'),('2058-05-31'),('2058-06-01'),('2058-06-02'),('2058-06-03'),('2058-06-04'),('2058-06-05'),('2058-06-06'),('2058-06-07'),('2058-06-08'),('2058-06-09'),('2058-06-10'),('2058-06-11'),('2058-06-12'),('2058-06-13'),('2058-06-14'),('2058-06-15'),('2058-06-16'),('2058-06-17'),('2058-06-18'),('2058-06-19'),('2058-06-20'),('2058-06-21'),('2058-06-22'),('2058-06-23'),('2058-06-24'),('2058-06-25'),('2058-06-26'),('2058-06-27'),('2058-06-28'),('2058-06-29'),('2058-06-30'),('2058-07-01'),('2058-07-02'),('2058-07-03'),('2058-07-04'),('2058-07-05'),('2058-07-06'),('2058-07-07'),('2058-07-08'),('2058-07-09'),('2058-07-10'),('2058-07-11'),('2058-07-12'),('2058-07-13'),('2058-07-14'),('2058-07-15'),('2058-07-16'),('2058-07-17'),('2058-07-18'),('2058-07-19'),('2058-07-20'),('2058-07-21'),('2058-07-22'),('2058-07-23'),('2058-07-24'),('2058-07-25'),('2058-07-26'),('2058-07-27'),('2058-07-28'),('2058-07-29'),('2058-07-30'),('2058-07-31'),('2058-08-01'),('2058-08-02'),('2058-08-03'),('2058-08-04'),('2058-08-05'),('2058-08-06'),('2058-08-07'),('2058-08-08'),('2058-08-09'),('2058-08-10'),('2058-08-11'),('2058-08-12'),('2058-08-13'),('2058-08-14'),('2058-08-15'),('2058-08-16'),('2058-08-17'),('2058-08-18'),('2058-08-19'),('2058-08-20'),('2058-08-21'),('2058-08-22'),('2058-08-23'),('2058-08-24'),('2058-08-25'),('2058-08-26'),('2058-08-27'),('2058-08-28'),('2058-08-29'),('2058-08-30'),('2058-08-31'),('2058-09-01'),('2058-09-02'),('2058-09-03'),('2058-09-04'),('2058-09-05'),('2058-09-06'),('2058-09-07'),('2058-09-08'),('2058-09-09'),('2058-09-10'),('2058-09-11'),('2058-09-12'),('2058-09-13'),('2058-09-14'),('2058-09-15'),('2058-09-16'),('2058-09-17'),('2058-09-18'),('2058-09-19'),('2058-09-20'),('2058-09-21'),('2058-09-22'),('2058-09-23'),('2058-09-24'),('2058-09-25'),('2058-09-26'),('2058-09-27'),('2058-09-28'),('2058-09-29'),('2058-09-30'),('2058-10-01'),('2058-10-02'),('2058-10-03'),('2058-10-04'),('2058-10-05'),('2058-10-06'),('2058-10-07'),('2058-10-08'),('2058-10-09'),('2058-10-10'),('2058-10-11'),('2058-10-12'),('2058-10-13'),('2058-10-14'),('2058-10-15'),('2058-10-16'),('2058-10-17'),('2058-10-18'),('2058-10-19'),('2058-10-20'),('2058-10-21'),('2058-10-22'),('2058-10-23'),('2058-10-24'),('2058-10-25'),('2058-10-26'),('2058-10-27'),('2058-10-28'),('2058-10-29'),('2058-10-30'),('2058-10-31'),('2058-11-01'),('2058-11-02'),('2058-11-03'),('2058-11-04'),('2058-11-05'),('2058-11-06'),('2058-11-07'),('2058-11-08'),('2058-11-09'),('2058-11-10'),('2058-11-11'),('2058-11-12'),('2058-11-13'),('2058-11-14'),('2058-11-15'),('2058-11-16'),('2058-11-17'),('2058-11-18'),('2058-11-19'),('2058-11-20'),('2058-11-21'),('2058-11-22'),('2058-11-23'),('2058-11-24'),('2058-11-25'),('2058-11-26'),('2058-11-27'),('2058-11-28'),('2058-11-29'),('2058-11-30'),('2058-12-01'),('2058-12-02'),('2058-12-03'),('2058-12-04'),('2058-12-05'),('2058-12-06'),('2058-12-07'),('2058-12-08'),('2058-12-09'),('2058-12-10'),('2058-12-11'),('2058-12-12'),('2058-12-13'),('2058-12-14'),('2058-12-15'),('2058-12-16'),('2058-12-17'),('2058-12-18'),('2058-12-19'),('2058-12-20'),('2058-12-21'),('2058-12-22'),('2058-12-23'),('2058-12-24'),('2058-12-25'),('2058-12-26'),('2058-12-27'),('2058-12-28'),('2058-12-29'),('2058-12-30'),('2058-12-31'),('2059-01-01'),('2059-01-02'),('2059-01-03'),('2059-01-04'),('2059-01-05'),('2059-01-06'),('2059-01-07'),('2059-01-08'),('2059-01-09'),('2059-01-10'),('2059-01-11'),('2059-01-12'),('2059-01-13'),('2059-01-14'),('2059-01-15'),('2059-01-16'),('2059-01-17'),('2059-01-18'),('2059-01-19'),('2059-01-20'),('2059-01-21'),('2059-01-22'),('2059-01-23'),('2059-01-24'),('2059-01-25'),('2059-01-26'),('2059-01-27'),('2059-01-28'),('2059-01-29'),('2059-01-30'),('2059-01-31'),('2059-02-01'),('2059-02-02'),('2059-02-03'),('2059-02-04'),('2059-02-05'),('2059-02-06'),('2059-02-07'),('2059-02-08'),('2059-02-09'),('2059-02-10'),('2059-02-11'),('2059-02-12'),('2059-02-13'),('2059-02-14'),('2059-02-15'),('2059-02-16'),('2059-02-17'),('2059-02-18'),('2059-02-19'),('2059-02-20'),('2059-02-21'),('2059-02-22'),('2059-02-23'),('2059-02-24'),('2059-02-25'),('2059-02-26'),('2059-02-27'),('2059-02-28'),('2059-03-01'),('2059-03-02'),('2059-03-03'),('2059-03-04'),('2059-03-05'),('2059-03-06'),('2059-03-07'),('2059-03-08'),('2059-03-09'),('2059-03-10'),('2059-03-11'),('2059-03-12'),('2059-03-13'),('2059-03-14'),('2059-03-15'),('2059-03-16'),('2059-03-17'),('2059-03-18'),('2059-03-19'),('2059-03-20'),('2059-03-21'),('2059-03-22'),('2059-03-23'),('2059-03-24'),('2059-03-25'),('2059-03-26'),('2059-03-27'),('2059-03-28'),('2059-03-29'),('2059-03-30'),('2059-03-31'),('2059-04-01'),('2059-04-02'),('2059-04-03'),('2059-04-04'),('2059-04-05'),('2059-04-06'),('2059-04-07'),('2059-04-08'),('2059-04-09'),('2059-04-10'),('2059-04-11'),('2059-04-12'),('2059-04-13'),('2059-04-14'),('2059-04-15'),('2059-04-16'),('2059-04-17'),('2059-04-18'),('2059-04-19'),('2059-04-20'),('2059-04-21'),('2059-04-22'),('2059-04-23'),('2059-04-24'),('2059-04-25'),('2059-04-26'),('2059-04-27'),('2059-04-28'),('2059-04-29'),('2059-04-30'),('2059-05-01'),('2059-05-02'),('2059-05-03'),('2059-05-04'),('2059-05-05'),('2059-05-06'),('2059-05-07'),('2059-05-08'),('2059-05-09'),('2059-05-10'),('2059-05-11'),('2059-05-12'),('2059-05-13'),('2059-05-14'),('2059-05-15'),('2059-05-16'),('2059-05-17'),('2059-05-18'),('2059-05-19'),('2059-05-20'),('2059-05-21'),('2059-05-22'),('2059-05-23'),('2059-05-24'),('2059-05-25'),('2059-05-26'),('2059-05-27'),('2059-05-28'),('2059-05-29'),('2059-05-30'),('2059-05-31'),('2059-06-01'),('2059-06-02'),('2059-06-03'),('2059-06-04'),('2059-06-05'),('2059-06-06'),('2059-06-07'),('2059-06-08'),('2059-06-09'),('2059-06-10'),('2059-06-11'),('2059-06-12'),('2059-06-13'),('2059-06-14'),('2059-06-15'),('2059-06-16'),('2059-06-17'),('2059-06-18'),('2059-06-19'),('2059-06-20'),('2059-06-21'),('2059-06-22'),('2059-06-23'),('2059-06-24'),('2059-06-25'),('2059-06-26'),('2059-06-27'),('2059-06-28'),('2059-06-29'),('2059-06-30'),('2059-07-01'),('2059-07-02'),('2059-07-03'),('2059-07-04'),('2059-07-05'),('2059-07-06'),('2059-07-07'),('2059-07-08'),('2059-07-09'),('2059-07-10'),('2059-07-11'),('2059-07-12'),('2059-07-13'),('2059-07-14'),('2059-07-15'),('2059-07-16'),('2059-07-17'),('2059-07-18'),('2059-07-19'),('2059-07-20'),('2059-07-21'),('2059-07-22'),('2059-07-23'),('2059-07-24'),('2059-07-25'),('2059-07-26'),('2059-07-27'),('2059-07-28'),('2059-07-29'),('2059-07-30'),('2059-07-31'),('2059-08-01'),('2059-08-02'),('2059-08-03'),('2059-08-04'),('2059-08-05'),('2059-08-06'),('2059-08-07'),('2059-08-08'),('2059-08-09'),('2059-08-10'),('2059-08-11'),('2059-08-12'),('2059-08-13'),('2059-08-14'),('2059-08-15'),('2059-08-16'),('2059-08-17'),('2059-08-18'),('2059-08-19'),('2059-08-20'),('2059-08-21'),('2059-08-22'),('2059-08-23'),('2059-08-24'),('2059-08-25'),('2059-08-26'),('2059-08-27'),('2059-08-28'),('2059-08-29'),('2059-08-30'),('2059-08-31'),('2059-09-01'),('2059-09-02'),('2059-09-03'),('2059-09-04'),('2059-09-05'),('2059-09-06'),('2059-09-07'),('2059-09-08'),('2059-09-09'),('2059-09-10'),('2059-09-11'),('2059-09-12'),('2059-09-13'),('2059-09-14'),('2059-09-15'),('2059-09-16'),('2059-09-17'),('2059-09-18'),('2059-09-19'),('2059-09-20'),('2059-09-21'),('2059-09-22'),('2059-09-23'),('2059-09-24'),('2059-09-25'),('2059-09-26'),('2059-09-27'),('2059-09-28'),('2059-09-29'),('2059-09-30'),('2059-10-01'),('2059-10-02'),('2059-10-03'),('2059-10-04'),('2059-10-05'),('2059-10-06'),('2059-10-07'),('2059-10-08'),('2059-10-09'),('2059-10-10'),('2059-10-11'),('2059-10-12'),('2059-10-13'),('2059-10-14'),('2059-10-15'),('2059-10-16'),('2059-10-17'),('2059-10-18'),('2059-10-19'),('2059-10-20'),('2059-10-21'),('2059-10-22'),('2059-10-23'),('2059-10-24'),('2059-10-25'),('2059-10-26'),('2059-10-27'),('2059-10-28'),('2059-10-29'),('2059-10-30'),('2059-10-31'),('2059-11-01'),('2059-11-02'),('2059-11-03'),('2059-11-04'),('2059-11-05'),('2059-11-06'),('2059-11-07'),('2059-11-08'),('2059-11-09'),('2059-11-10'),('2059-11-11'),('2059-11-12'),('2059-11-13'),('2059-11-14'),('2059-11-15'),('2059-11-16'),('2059-11-17'),('2059-11-18'),('2059-11-19'),('2059-11-20'),('2059-11-21'),('2059-11-22'),('2059-11-23'),('2059-11-24'),('2059-11-25'),('2059-11-26'),('2059-11-27'),('2059-11-28'),('2059-11-29'),('2059-11-30'),('2059-12-01'),('2059-12-02'),('2059-12-03'),('2059-12-04'),('2059-12-05'),('2059-12-06'),('2059-12-07'),('2059-12-08'),('2059-12-09'),('2059-12-10'),('2059-12-11'),('2059-12-12'),('2059-12-13'),('2059-12-14'),('2059-12-15'),('2059-12-16'),('2059-12-17'),('2059-12-18'),('2059-12-19'),('2059-12-20'),('2059-12-21'),('2059-12-22'),('2059-12-23'),('2059-12-24'),('2059-12-25'),('2059-12-26'),('2059-12-27'),('2059-12-28'),('2059-12-29'),('2059-12-30'),('2059-12-31'),('2060-01-01'),('2060-01-02'),('2060-01-03'),('2060-01-04'),('2060-01-05'),('2060-01-06'),('2060-01-07'),('2060-01-08'),('2060-01-09'),('2060-01-10'),('2060-01-11'),('2060-01-12'),('2060-01-13'),('2060-01-14'),('2060-01-15'),('2060-01-16'),('2060-01-17'),('2060-01-18'),('2060-01-19'),('2060-01-20'),('2060-01-21'),('2060-01-22'),('2060-01-23'),('2060-01-24'),('2060-01-25'),('2060-01-26'),('2060-01-27'),('2060-01-28'),('2060-01-29'),('2060-01-30'),('2060-01-31'),('2060-02-01'),('2060-02-02'),('2060-02-03'),('2060-02-04'),('2060-02-05'),('2060-02-06'),('2060-02-07'),('2060-02-08'),('2060-02-09'),('2060-02-10'),('2060-02-11'),('2060-02-12'),('2060-02-13'),('2060-02-14'),('2060-02-15'),('2060-02-16'),('2060-02-17'),('2060-02-18'),('2060-02-19'),('2060-02-20'),('2060-02-21'),('2060-02-22'),('2060-02-23'),('2060-02-24'),('2060-02-25'),('2060-02-26'),('2060-02-27'),('2060-02-28'),('2060-02-29'),('2060-03-01'),('2060-03-02'),('2060-03-03'),('2060-03-04'),('2060-03-05'),('2060-03-06'),('2060-03-07'),('2060-03-08'),('2060-03-09'),('2060-03-10'),('2060-03-11'),('2060-03-12'),('2060-03-13'),('2060-03-14'),('2060-03-15'),('2060-03-16'),('2060-03-17'),('2060-03-18'),('2060-03-19'),('2060-03-20'),('2060-03-21'),('2060-03-22'),('2060-03-23'),('2060-03-24'),('2060-03-25'),('2060-03-26'),('2060-03-27'),('2060-03-28'),('2060-03-29'),('2060-03-30'),('2060-03-31'),('2060-04-01'),('2060-04-02'),('2060-04-03'),('2060-04-04'),('2060-04-05'),('2060-04-06'),('2060-04-07'),('2060-04-08'),('2060-04-09'),('2060-04-10'),('2060-04-11'),('2060-04-12'),('2060-04-13'),('2060-04-14'),('2060-04-15'),('2060-04-16'),('2060-04-17'),('2060-04-18'),('2060-04-19'),('2060-04-20'),('2060-04-21'),('2060-04-22'),('2060-04-23'),('2060-04-24'),('2060-04-25'),('2060-04-26'),('2060-04-27'),('2060-04-28'),('2060-04-29'),('2060-04-30'),('2060-05-01'),('2060-05-02'),('2060-05-03'),('2060-05-04'),('2060-05-05'),('2060-05-06'),('2060-05-07'),('2060-05-08'),('2060-05-09'),('2060-05-10'),('2060-05-11'),('2060-05-12'),('2060-05-13'),('2060-05-14'),('2060-05-15'),('2060-05-16'),('2060-05-17'),('2060-05-18'),('2060-05-19'),('2060-05-20'),('2060-05-21'),('2060-05-22'),('2060-05-23'),('2060-05-24'),('2060-05-25'),('2060-05-26'),('2060-05-27'),('2060-05-28'),('2060-05-29'),('2060-05-30'),('2060-05-31'),('2060-06-01'),('2060-06-02'),('2060-06-03'),('2060-06-04'),('2060-06-05'),('2060-06-06'),('2060-06-07'),('2060-06-08'),('2060-06-09'),('2060-06-10'),('2060-06-11'),('2060-06-12'),('2060-06-13'),('2060-06-14'),('2060-06-15'),('2060-06-16'),('2060-06-17'),('2060-06-18'),('2060-06-19'),('2060-06-20'),('2060-06-21'),('2060-06-22'),('2060-06-23'),('2060-06-24'),('2060-06-25'),('2060-06-26'),('2060-06-27'),('2060-06-28'),('2060-06-29'),('2060-06-30'),('2060-07-01'),('2060-07-02'),('2060-07-03'),('2060-07-04'),('2060-07-05'),('2060-07-06'),('2060-07-07'),('2060-07-08'),('2060-07-09'),('2060-07-10'),('2060-07-11'),('2060-07-12'),('2060-07-13'),('2060-07-14'),('2060-07-15'),('2060-07-16'),('2060-07-17'),('2060-07-18'),('2060-07-19'),('2060-07-20'),('2060-07-21'),('2060-07-22'),('2060-07-23'),('2060-07-24'),('2060-07-25'),('2060-07-26'),('2060-07-27'),('2060-07-28'),('2060-07-29'),('2060-07-30'),('2060-07-31'),('2060-08-01'),('2060-08-02'),('2060-08-03'),('2060-08-04'),('2060-08-05'),('2060-08-06'),('2060-08-07'),('2060-08-08'),('2060-08-09'),('2060-08-10'),('2060-08-11'),('2060-08-12'),('2060-08-13'),('2060-08-14'),('2060-08-15'),('2060-08-16'),('2060-08-17'),('2060-08-18'),('2060-08-19'),('2060-08-20'),('2060-08-21'),('2060-08-22'),('2060-08-23'),('2060-08-24'),('2060-08-25'),('2060-08-26'),('2060-08-27'),('2060-08-28'),('2060-08-29'),('2060-08-30'),('2060-08-31'),('2060-09-01'),('2060-09-02'),('2060-09-03'),('2060-09-04'),('2060-09-05'),('2060-09-06'),('2060-09-07'),('2060-09-08'),('2060-09-09'),('2060-09-10'),('2060-09-11'),('2060-09-12'),('2060-09-13'),('2060-09-14'),('2060-09-15'),('2060-09-16'),('2060-09-17'),('2060-09-18'),('2060-09-19'),('2060-09-20'),('2060-09-21'),('2060-09-22'),('2060-09-23'),('2060-09-24'),('2060-09-25'),('2060-09-26'),('2060-09-27'),('2060-09-28'),('2060-09-29'),('2060-09-30'),('2060-10-01'),('2060-10-02'),('2060-10-03'),('2060-10-04'),('2060-10-05'),('2060-10-06'),('2060-10-07'),('2060-10-08'),('2060-10-09'),('2060-10-10'),('2060-10-11'),('2060-10-12'),('2060-10-13'),('2060-10-14'),('2060-10-15'),('2060-10-16'),('2060-10-17'),('2060-10-18'),('2060-10-19'),('2060-10-20'),('2060-10-21'),('2060-10-22'),('2060-10-23'),('2060-10-24'),('2060-10-25'),('2060-10-26'),('2060-10-27'),('2060-10-28'),('2060-10-29'),('2060-10-30'),('2060-10-31'),('2060-11-01'),('2060-11-02'),('2060-11-03'),('2060-11-04'),('2060-11-05'),('2060-11-06'),('2060-11-07'),('2060-11-08'),('2060-11-09'),('2060-11-10'),('2060-11-11'),('2060-11-12'),('2060-11-13'),('2060-11-14'),('2060-11-15'),('2060-11-16'),('2060-11-17'),('2060-11-18'),('2060-11-19'),('2060-11-20'),('2060-11-21'),('2060-11-22'),('2060-11-23'),('2060-11-24'),('2060-11-25'),('2060-11-26'),('2060-11-27'),('2060-11-28'),('2060-11-29'),('2060-11-30'),('2060-12-01'),('2060-12-02'),('2060-12-03'),('2060-12-04'),('2060-12-05'),('2060-12-06'),('2060-12-07'),('2060-12-08'),('2060-12-09'),('2060-12-10'),('2060-12-11'),('2060-12-12'),('2060-12-13'),('2060-12-14'),('2060-12-15'),('2060-12-16'),('2060-12-17'),('2060-12-18'),('2060-12-19'),('2060-12-20'),('2060-12-21'),('2060-12-22'),('2060-12-23'),('2060-12-24'),('2060-12-25'),('2060-12-26'),('2060-12-27'),('2060-12-28'),('2060-12-29'),('2060-12-30'),('2060-12-31'),('2061-01-01'),('2061-01-02'),('2061-01-03'),('2061-01-04'),('2061-01-05'),('2061-01-06'),('2061-01-07'),('2061-01-08'),('2061-01-09'),('2061-01-10'),('2061-01-11'),('2061-01-12'),('2061-01-13'),('2061-01-14'),('2061-01-15'),('2061-01-16'),('2061-01-17'),('2061-01-18'),('2061-01-19'),('2061-01-20'),('2061-01-21'),('2061-01-22'),('2061-01-23'),('2061-01-24'),('2061-01-25'),('2061-01-26'),('2061-01-27'),('2061-01-28'),('2061-01-29'),('2061-01-30'),('2061-01-31'),('2061-02-01'),('2061-02-02'),('2061-02-03'),('2061-02-04'),('2061-02-05'),('2061-02-06'),('2061-02-07'),('2061-02-08'),('2061-02-09'),('2061-02-10'),('2061-02-11'),('2061-02-12'),('2061-02-13'),('2061-02-14'),('2061-02-15'),('2061-02-16'),('2061-02-17'),('2061-02-18'),('2061-02-19'),('2061-02-20'),('2061-02-21'),('2061-02-22'),('2061-02-23'),('2061-02-24'),('2061-02-25'),('2061-02-26'),('2061-02-27'),('2061-02-28'),('2061-03-01'),('2061-03-02'),('2061-03-03'),('2061-03-04'),('2061-03-05'),('2061-03-06'),('2061-03-07'),('2061-03-08'),('2061-03-09'),('2061-03-10'),('2061-03-11'),('2061-03-12'),('2061-03-13'),('2061-03-14'),('2061-03-15'),('2061-03-16'),('2061-03-17'),('2061-03-18'),('2061-03-19'),('2061-03-20'),('2061-03-21'),('2061-03-22'),('2061-03-23'),('2061-03-24'),('2061-03-25'),('2061-03-26'),('2061-03-27'),('2061-03-28'),('2061-03-29'),('2061-03-30'),('2061-03-31'),('2061-04-01'),('2061-04-02'),('2061-04-03'),('2061-04-04'),('2061-04-05'),('2061-04-06'),('2061-04-07'),('2061-04-08'),('2061-04-09'),('2061-04-10'),('2061-04-11'),('2061-04-12'),('2061-04-13'),('2061-04-14'),('2061-04-15'),('2061-04-16'),('2061-04-17'),('2061-04-18'),('2061-04-19'),('2061-04-20'),('2061-04-21'),('2061-04-22'),('2061-04-23'),('2061-04-24'),('2061-04-25'),('2061-04-26'),('2061-04-27'),('2061-04-28'),('2061-04-29'),('2061-04-30'),('2061-05-01'),('2061-05-02'),('2061-05-03'),('2061-05-04'),('2061-05-05'),('2061-05-06'),('2061-05-07'),('2061-05-08'),('2061-05-09'),('2061-05-10'),('2061-05-11'),('2061-05-12'),('2061-05-13'),('2061-05-14'),('2061-05-15'),('2061-05-16'),('2061-05-17'),('2061-05-18'),('2061-05-19'),('2061-05-20'),('2061-05-21'),('2061-05-22'),('2061-05-23'),('2061-05-24'),('2061-05-25'),('2061-05-26'),('2061-05-27'),('2061-05-28'),('2061-05-29'),('2061-05-30'),('2061-05-31'),('2061-06-01'),('2061-06-02'),('2061-06-03'),('2061-06-04'),('2061-06-05'),('2061-06-06'),('2061-06-07'),('2061-06-08'),('2061-06-09'),('2061-06-10'),('2061-06-11'),('2061-06-12'),('2061-06-13'),('2061-06-14'),('2061-06-15'),('2061-06-16'),('2061-06-17'),('2061-06-18'),('2061-06-19'),('2061-06-20'),('2061-06-21'),('2061-06-22'),('2061-06-23'),('2061-06-24'),('2061-06-25'),('2061-06-26'),('2061-06-27'),('2061-06-28'),('2061-06-29'),('2061-06-30'),('2061-07-01'),('2061-07-02'),('2061-07-03'),('2061-07-04'),('2061-07-05'),('2061-07-06'),('2061-07-07'),('2061-07-08'),('2061-07-09'),('2061-07-10'),('2061-07-11'),('2061-07-12'),('2061-07-13'),('2061-07-14'),('2061-07-15'),('2061-07-16'),('2061-07-17'),('2061-07-18'),('2061-07-19'),('2061-07-20'),('2061-07-21'),('2061-07-22'),('2061-07-23'),('2061-07-24'),('2061-07-25'),('2061-07-26'),('2061-07-27'),('2061-07-28'),('2061-07-29'),('2061-07-30'),('2061-07-31'),('2061-08-01'),('2061-08-02'),('2061-08-03'),('2061-08-04'),('2061-08-05'),('2061-08-06'),('2061-08-07'),('2061-08-08'),('2061-08-09'),('2061-08-10'),('2061-08-11'),('2061-08-12'),('2061-08-13'),('2061-08-14'),('2061-08-15'),('2061-08-16'),('2061-08-17'),('2061-08-18'),('2061-08-19'),('2061-08-20'),('2061-08-21'),('2061-08-22'),('2061-08-23'),('2061-08-24'),('2061-08-25'),('2061-08-26'),('2061-08-27'),('2061-08-28'),('2061-08-29'),('2061-08-30'),('2061-08-31'),('2061-09-01'),('2061-09-02'),('2061-09-03'),('2061-09-04'),('2061-09-05'),('2061-09-06'),('2061-09-07'),('2061-09-08'),('2061-09-09'),('2061-09-10'),('2061-09-11'),('2061-09-12'),('2061-09-13'),('2061-09-14'),('2061-09-15'),('2061-09-16'),('2061-09-17'),('2061-09-18'),('2061-09-19'),('2061-09-20'),('2061-09-21'),('2061-09-22'),('2061-09-23'),('2061-09-24'),('2061-09-25'),('2061-09-26'),('2061-09-27'),('2061-09-28'),('2061-09-29'),('2061-09-30'),('2061-10-01'),('2061-10-02'),('2061-10-03'),('2061-10-04'),('2061-10-05'),('2061-10-06'),('2061-10-07'),('2061-10-08'),('2061-10-09'),('2061-10-10'),('2061-10-11'),('2061-10-12'),('2061-10-13'),('2061-10-14'),('2061-10-15'),('2061-10-16'),('2061-10-17'),('2061-10-18'),('2061-10-19'),('2061-10-20'),('2061-10-21'),('2061-10-22'),('2061-10-23'),('2061-10-24'),('2061-10-25'),('2061-10-26'),('2061-10-27'),('2061-10-28'),('2061-10-29'),('2061-10-30'),('2061-10-31'),('2061-11-01'),('2061-11-02'),('2061-11-03'),('2061-11-04'),('2061-11-05'),('2061-11-06'),('2061-11-07'),('2061-11-08'),('2061-11-09'),('2061-11-10'),('2061-11-11'),('2061-11-12'),('2061-11-13'),('2061-11-14'),('2061-11-15'),('2061-11-16'),('2061-11-17'),('2061-11-18'),('2061-11-19'),('2061-11-20'),('2061-11-21'),('2061-11-22'),('2061-11-23'),('2061-11-24'),('2061-11-25'),('2061-11-26'),('2061-11-27'),('2061-11-28'),('2061-11-29'),('2061-11-30'),('2061-12-01'),('2061-12-02'),('2061-12-03'),('2061-12-04'),('2061-12-05'),('2061-12-06'),('2061-12-07'),('2061-12-08'),('2061-12-09'),('2061-12-10'),('2061-12-11'),('2061-12-12'),('2061-12-13'),('2061-12-14'),('2061-12-15'),('2061-12-16'),('2061-12-17'),('2061-12-18'),('2061-12-19'),('2061-12-20'),('2061-12-21'),('2061-12-22'),('2061-12-23'),('2061-12-24'),('2061-12-25'),('2061-12-26'),('2061-12-27'),('2061-12-28'),('2061-12-29'),('2061-12-30'),('2061-12-31'),('2062-01-01'),('2062-01-02'),('2062-01-03'),('2062-01-04'),('2062-01-05'),('2062-01-06'),('2062-01-07'),('2062-01-08'),('2062-01-09'),('2062-01-10'),('2062-01-11'),('2062-01-12'),('2062-01-13'),('2062-01-14'),('2062-01-15'),('2062-01-16'),('2062-01-17'),('2062-01-18'),('2062-01-19'),('2062-01-20'),('2062-01-21'),('2062-01-22'),('2062-01-23'),('2062-01-24'),('2062-01-25'),('2062-01-26'),('2062-01-27'),('2062-01-28'),('2062-01-29'),('2062-01-30'),('2062-01-31'),('2062-02-01'),('2062-02-02'),('2062-02-03'),('2062-02-04'),('2062-02-05'),('2062-02-06'),('2062-02-07'),('2062-02-08'),('2062-02-09'),('2062-02-10'),('2062-02-11'),('2062-02-12'),('2062-02-13'),('2062-02-14'),('2062-02-15'),('2062-02-16'),('2062-02-17'),('2062-02-18'),('2062-02-19'),('2062-02-20'),('2062-02-21'),('2062-02-22'),('2062-02-23'),('2062-02-24'),('2062-02-25'),('2062-02-26'),('2062-02-27'),('2062-02-28'),('2062-03-01'),('2062-03-02'),('2062-03-03'),('2062-03-04'),('2062-03-05'),('2062-03-06'),('2062-03-07'),('2062-03-08'),('2062-03-09'),('2062-03-10'),('2062-03-11'),('2062-03-12'),('2062-03-13'),('2062-03-14'),('2062-03-15'),('2062-03-16'),('2062-03-17'),('2062-03-18'),('2062-03-19'),('2062-03-20'),('2062-03-21'),('2062-03-22'),('2062-03-23'),('2062-03-24'),('2062-03-25'),('2062-03-26'),('2062-03-27'),('2062-03-28'),('2062-03-29'),('2062-03-30'),('2062-03-31'),('2062-04-01'),('2062-04-02'),('2062-04-03'),('2062-04-04'),('2062-04-05'),('2062-04-06'),('2062-04-07'),('2062-04-08'),('2062-04-09'),('2062-04-10'),('2062-04-11'),('2062-04-12'),('2062-04-13'),('2062-04-14'),('2062-04-15'),('2062-04-16'),('2062-04-17'),('2062-04-18'),('2062-04-19'),('2062-04-20'),('2062-04-21'),('2062-04-22'),('2062-04-23'),('2062-04-24'),('2062-04-25'),('2062-04-26'),('2062-04-27'),('2062-04-28'),('2062-04-29'),('2062-04-30'),('2062-05-01'),('2062-05-02'),('2062-05-03'),('2062-05-04'),('2062-05-05'),('2062-05-06'),('2062-05-07'),('2062-05-08'),('2062-05-09'),('2062-05-10'),('2062-05-11'),('2062-05-12'),('2062-05-13'),('2062-05-14'),('2062-05-15'),('2062-05-16'),('2062-05-17'),('2062-05-18'),('2062-05-19'),('2062-05-20'),('2062-05-21'),('2062-05-22'),('2062-05-23'),('2062-05-24'),('2062-05-25'),('2062-05-26'),('2062-05-27'),('2062-05-28'),('2062-05-29'),('2062-05-30'),('2062-05-31'),('2062-06-01'),('2062-06-02'),('2062-06-03'),('2062-06-04'),('2062-06-05'),('2062-06-06'),('2062-06-07'),('2062-06-08'),('2062-06-09'),('2062-06-10'),('2062-06-11'),('2062-06-12'),('2062-06-13'),('2062-06-14'),('2062-06-15'),('2062-06-16'),('2062-06-17'),('2062-06-18'),('2062-06-19'),('2062-06-20'),('2062-06-21'),('2062-06-22'),('2062-06-23'),('2062-06-24'),('2062-06-25'),('2062-06-26'),('2062-06-27'),('2062-06-28'),('2062-06-29'),('2062-06-30'),('2062-07-01'),('2062-07-02'),('2062-07-03'),('2062-07-04'),('2062-07-05'),('2062-07-06'),('2062-07-07'),('2062-07-08'),('2062-07-09'),('2062-07-10'),('2062-07-11'),('2062-07-12'),('2062-07-13'),('2062-07-14'),('2062-07-15'),('2062-07-16'),('2062-07-17'),('2062-07-18'),('2062-07-19'),('2062-07-20'),('2062-07-21'),('2062-07-22'),('2062-07-23'),('2062-07-24'),('2062-07-25'),('2062-07-26'),('2062-07-27'),('2062-07-28'),('2062-07-29'),('2062-07-30'),('2062-07-31'),('2062-08-01'),('2062-08-02'),('2062-08-03'),('2062-08-04'),('2062-08-05'),('2062-08-06'),('2062-08-07'),('2062-08-08'),('2062-08-09'),('2062-08-10'),('2062-08-11'),('2062-08-12'),('2062-08-13'),('2062-08-14'),('2062-08-15'),('2062-08-16'),('2062-08-17'),('2062-08-18'),('2062-08-19'),('2062-08-20'),('2062-08-21'),('2062-08-22'),('2062-08-23'),('2062-08-24'),('2062-08-25'),('2062-08-26'),('2062-08-27'),('2062-08-28'),('2062-08-29'),('2062-08-30'),('2062-08-31'),('2062-09-01'),('2062-09-02'),('2062-09-03'),('2062-09-04'),('2062-09-05'),('2062-09-06'),('2062-09-07'),('2062-09-08'),('2062-09-09'),('2062-09-10'),('2062-09-11'),('2062-09-12'),('2062-09-13'),('2062-09-14'),('2062-09-15'),('2062-09-16'),('2062-09-17'),('2062-09-18'),('2062-09-19'),('2062-09-20'),('2062-09-21'),('2062-09-22'),('2062-09-23'),('2062-09-24'),('2062-09-25'),('2062-09-26'),('2062-09-27'),('2062-09-28'),('2062-09-29'),('2062-09-30'),('2062-10-01'),('2062-10-02'),('2062-10-03'),('2062-10-04'),('2062-10-05'),('2062-10-06'),('2062-10-07'),('2062-10-08'),('2062-10-09'),('2062-10-10'),('2062-10-11'),('2062-10-12'),('2062-10-13'),('2062-10-14'),('2062-10-15'),('2062-10-16'),('2062-10-17'),('2062-10-18'),('2062-10-19'),('2062-10-20'),('2062-10-21'),('2062-10-22'),('2062-10-23'),('2062-10-24'),('2062-10-25'),('2062-10-26'),('2062-10-27'),('2062-10-28'),('2062-10-29'),('2062-10-30'),('2062-10-31'),('2062-11-01'),('2062-11-02'),('2062-11-03'),('2062-11-04'),('2062-11-05'),('2062-11-06'),('2062-11-07'),('2062-11-08'),('2062-11-09'),('2062-11-10'),('2062-11-11'),('2062-11-12'),('2062-11-13'),('2062-11-14'),('2062-11-15'),('2062-11-16'),('2062-11-17'),('2062-11-18'),('2062-11-19'),('2062-11-20'),('2062-11-21'),('2062-11-22'),('2062-11-23'),('2062-11-24'),('2062-11-25'),('2062-11-26'),('2062-11-27'),('2062-11-28'),('2062-11-29'),('2062-11-30'),('2062-12-01'),('2062-12-02'),('2062-12-03'),('2062-12-04'),('2062-12-05'),('2062-12-06'),('2062-12-07'),('2062-12-08'),('2062-12-09'),('2062-12-10'),('2062-12-11'),('2062-12-12'),('2062-12-13'),('2062-12-14'),('2062-12-15'),('2062-12-16'),('2062-12-17'),('2062-12-18'),('2062-12-19'),('2062-12-20'),('2062-12-21'),('2062-12-22'),('2062-12-23'),('2062-12-24'),('2062-12-25'),('2062-12-26'),('2062-12-27'),('2062-12-28'),('2062-12-29'),('2062-12-30'),('2062-12-31'),('2063-01-01'),('2063-01-02'),('2063-01-03'),('2063-01-04'),('2063-01-05'),('2063-01-06'),('2063-01-07'),('2063-01-08'),('2063-01-09'),('2063-01-10'),('2063-01-11'),('2063-01-12'),('2063-01-13'),('2063-01-14'),('2063-01-15'),('2063-01-16'),('2063-01-17'),('2063-01-18'),('2063-01-19'),('2063-01-20'),('2063-01-21'),('2063-01-22'),('2063-01-23'),('2063-01-24'),('2063-01-25'),('2063-01-26'),('2063-01-27'),('2063-01-28'),('2063-01-29'),('2063-01-30'),('2063-01-31'),('2063-02-01'),('2063-02-02'),('2063-02-03'),('2063-02-04'),('2063-02-05'),('2063-02-06'),('2063-02-07'),('2063-02-08'),('2063-02-09'),('2063-02-10'),('2063-02-11'),('2063-02-12'),('2063-02-13'),('2063-02-14'),('2063-02-15'),('2063-02-16'),('2063-02-17'),('2063-02-18'),('2063-02-19'),('2063-02-20'),('2063-02-21'),('2063-02-22'),('2063-02-23'),('2063-02-24'),('2063-02-25'),('2063-02-26'),('2063-02-27'),('2063-02-28'),('2063-03-01'),('2063-03-02'),('2063-03-03'),('2063-03-04'),('2063-03-05'),('2063-03-06'),('2063-03-07'),('2063-03-08'),('2063-03-09'),('2063-03-10'),('2063-03-11'),('2063-03-12'),('2063-03-13'),('2063-03-14'),('2063-03-15'),('2063-03-16'),('2063-03-17'),('2063-03-18'),('2063-03-19'),('2063-03-20'),('2063-03-21'),('2063-03-22'),('2063-03-23'),('2063-03-24'),('2063-03-25'),('2063-03-26'),('2063-03-27'),('2063-03-28'),('2063-03-29'),('2063-03-30'),('2063-03-31'),('2063-04-01'),('2063-04-02'),('2063-04-03'),('2063-04-04'),('2063-04-05'),('2063-04-06'),('2063-04-07'),('2063-04-08'),('2063-04-09'),('2063-04-10'),('2063-04-11'),('2063-04-12'),('2063-04-13'),('2063-04-14'),('2063-04-15'),('2063-04-16'),('2063-04-17'),('2063-04-18'),('2063-04-19'),('2063-04-20'),('2063-04-21'),('2063-04-22'),('2063-04-23'),('2063-04-24'),('2063-04-25'),('2063-04-26'),('2063-04-27'),('2063-04-28'),('2063-04-29'),('2063-04-30'),('2063-05-01'),('2063-05-02'),('2063-05-03'),('2063-05-04'),('2063-05-05'),('2063-05-06'),('2063-05-07'),('2063-05-08'),('2063-05-09'),('2063-05-10'),('2063-05-11'),('2063-05-12'),('2063-05-13'),('2063-05-14'),('2063-05-15'),('2063-05-16'),('2063-05-17'),('2063-05-18'),('2063-05-19'),('2063-05-20'),('2063-05-21'),('2063-05-22'),('2063-05-23'),('2063-05-24'),('2063-05-25'),('2063-05-26'),('2063-05-27'),('2063-05-28'),('2063-05-29'),('2063-05-30'),('2063-05-31'),('2063-06-01'),('2063-06-02'),('2063-06-03'),('2063-06-04'),('2063-06-05'),('2063-06-06'),('2063-06-07'),('2063-06-08'),('2063-06-09'),('2063-06-10'),('2063-06-11'),('2063-06-12'),('2063-06-13'),('2063-06-14'),('2063-06-15'),('2063-06-16'),('2063-06-17'),('2063-06-18'),('2063-06-19'),('2063-06-20'),('2063-06-21'),('2063-06-22'),('2063-06-23'),('2063-06-24'),('2063-06-25'),('2063-06-26'),('2063-06-27'),('2063-06-28'),('2063-06-29'),('2063-06-30'),('2063-07-01'),('2063-07-02'),('2063-07-03'),('2063-07-04'),('2063-07-05'),('2063-07-06'),('2063-07-07'),('2063-07-08'),('2063-07-09'),('2063-07-10'),('2063-07-11'),('2063-07-12'),('2063-07-13'),('2063-07-14'),('2063-07-15'),('2063-07-16'),('2063-07-17'),('2063-07-18'),('2063-07-19'),('2063-07-20'),('2063-07-21'),('2063-07-22'),('2063-07-23'),('2063-07-24'),('2063-07-25'),('2063-07-26'),('2063-07-27'),('2063-07-28'),('2063-07-29'),('2063-07-30'),('2063-07-31'),('2063-08-01'),('2063-08-02'),('2063-08-03'),('2063-08-04'),('2063-08-05'),('2063-08-06'),('2063-08-07'),('2063-08-08'),('2063-08-09'),('2063-08-10'),('2063-08-11'),('2063-08-12'),('2063-08-13'),('2063-08-14'),('2063-08-15'),('2063-08-16'),('2063-08-17'),('2063-08-18'),('2063-08-19'),('2063-08-20'),('2063-08-21'),('2063-08-22'),('2063-08-23'),('2063-08-24'),('2063-08-25'),('2063-08-26'),('2063-08-27'),('2063-08-28'),('2063-08-29'),('2063-08-30'),('2063-08-31'),('2063-09-01'),('2063-09-02'),('2063-09-03'),('2063-09-04'),('2063-09-05'),('2063-09-06'),('2063-09-07'),('2063-09-08'),('2063-09-09'),('2063-09-10'),('2063-09-11'),('2063-09-12'),('2063-09-13'),('2063-09-14'),('2063-09-15'),('2063-09-16'),('2063-09-17'),('2063-09-18'),('2063-09-19'),('2063-09-20'),('2063-09-21'),('2063-09-22'),('2063-09-23'),('2063-09-24'),('2063-09-25'),('2063-09-26'),('2063-09-27'),('2063-09-28'),('2063-09-29'),('2063-09-30'),('2063-10-01'),('2063-10-02'),('2063-10-03'),('2063-10-04'),('2063-10-05'),('2063-10-06'),('2063-10-07'),('2063-10-08'),('2063-10-09'),('2063-10-10'),('2063-10-11'),('2063-10-12'),('2063-10-13'),('2063-10-14'),('2063-10-15'),('2063-10-16'),('2063-10-17'),('2063-10-18'),('2063-10-19'),('2063-10-20'),('2063-10-21'),('2063-10-22'),('2063-10-23'),('2063-10-24'),('2063-10-25'),('2063-10-26'),('2063-10-27'),('2063-10-28'),('2063-10-29'),('2063-10-30'),('2063-10-31'),('2063-11-01'),('2063-11-02'),('2063-11-03'),('2063-11-04'),('2063-11-05'),('2063-11-06'),('2063-11-07'),('2063-11-08'),('2063-11-09'),('2063-11-10'),('2063-11-11'),('2063-11-12'),('2063-11-13'),('2063-11-14'),('2063-11-15'),('2063-11-16'),('2063-11-17'),('2063-11-18'),('2063-11-19'),('2063-11-20'),('2063-11-21'),('2063-11-22'),('2063-11-23'),('2063-11-24'),('2063-11-25'),('2063-11-26'),('2063-11-27'),('2063-11-28'),('2063-11-29'),('2063-11-30'),('2063-12-01'),('2063-12-02'),('2063-12-03'),('2063-12-04'),('2063-12-05'),('2063-12-06'),('2063-12-07'),('2063-12-08'),('2063-12-09'),('2063-12-10'),('2063-12-11'),('2063-12-12'),('2063-12-13'),('2063-12-14'),('2063-12-15'),('2063-12-16'),('2063-12-17'),('2063-12-18'),('2063-12-19'),('2063-12-20'),('2063-12-21'),('2063-12-22'),('2063-12-23'),('2063-12-24'),('2063-12-25'),('2063-12-26'),('2063-12-27'),('2063-12-28'),('2063-12-29'),('2063-12-30'),('2063-12-31'),('2064-01-01'),('2064-01-02'),('2064-01-03'),('2064-01-04'),('2064-01-05'),('2064-01-06'),('2064-01-07'),('2064-01-08'),('2064-01-09'),('2064-01-10'),('2064-01-11'),('2064-01-12'),('2064-01-13'),('2064-01-14'),('2064-01-15'),('2064-01-16'),('2064-01-17'),('2064-01-18'),('2064-01-19'),('2064-01-20'),('2064-01-21'),('2064-01-22'),('2064-01-23'),('2064-01-24'),('2064-01-25'),('2064-01-26'),('2064-01-27'),('2064-01-28'),('2064-01-29'),('2064-01-30'),('2064-01-31'),('2064-02-01'),('2064-02-02'),('2064-02-03'),('2064-02-04'),('2064-02-05'),('2064-02-06'),('2064-02-07'),('2064-02-08'),('2064-02-09'),('2064-02-10'),('2064-02-11'),('2064-02-12'),('2064-02-13'),('2064-02-14'),('2064-02-15'),('2064-02-16'),('2064-02-17'),('2064-02-18'),('2064-02-19'),('2064-02-20'),('2064-02-21'),('2064-02-22'),('2064-02-23'),('2064-02-24'),('2064-02-25'),('2064-02-26'),('2064-02-27'),('2064-02-28'),('2064-02-29'),('2064-03-01'),('2064-03-02'),('2064-03-03'),('2064-03-04'),('2064-03-05'),('2064-03-06'),('2064-03-07'),('2064-03-08'),('2064-03-09'),('2064-03-10'),('2064-03-11'),('2064-03-12'),('2064-03-13'),('2064-03-14'),('2064-03-15'),('2064-03-16'),('2064-03-17'),('2064-03-18'),('2064-03-19'),('2064-03-20'),('2064-03-21'),('2064-03-22'),('2064-03-23'),('2064-03-24'),('2064-03-25'),('2064-03-26'),('2064-03-27'),('2064-03-28'),('2064-03-29'),('2064-03-30'),('2064-03-31'),('2064-04-01'),('2064-04-02'),('2064-04-03'),('2064-04-04'),('2064-04-05'),('2064-04-06'),('2064-04-07'),('2064-04-08'),('2064-04-09'),('2064-04-10'),('2064-04-11'),('2064-04-12'),('2064-04-13'),('2064-04-14'),('2064-04-15'),('2064-04-16'),('2064-04-17'),('2064-04-18'),('2064-04-19'),('2064-04-20'),('2064-04-21'),('2064-04-22'),('2064-04-23'),('2064-04-24'),('2064-04-25'),('2064-04-26'),('2064-04-27'),('2064-04-28'),('2064-04-29'),('2064-04-30'),('2064-05-01'),('2064-05-02'),('2064-05-03'),('2064-05-04'),('2064-05-05'),('2064-05-06'),('2064-05-07'),('2064-05-08'),('2064-05-09'),('2064-05-10'),('2064-05-11'),('2064-05-12'),('2064-05-13'),('2064-05-14'),('2064-05-15'),('2064-05-16'),('2064-05-17'),('2064-05-18'),('2064-05-19'),('2064-05-20'),('2064-05-21'),('2064-05-22'),('2064-05-23'),('2064-05-24'),('2064-05-25'),('2064-05-26'),('2064-05-27'),('2064-05-28'),('2064-05-29'),('2064-05-30'),('2064-05-31'),('2064-06-01'),('2064-06-02'),('2064-06-03'),('2064-06-04'),('2064-06-05'),('2064-06-06'),('2064-06-07'),('2064-06-08'),('2064-06-09'),('2064-06-10'),('2064-06-11'),('2064-06-12'),('2064-06-13'),('2064-06-14'),('2064-06-15'),('2064-06-16'),('2064-06-17'),('2064-06-18'),('2064-06-19'),('2064-06-20'),('2064-06-21'),('2064-06-22'),('2064-06-23'),('2064-06-24'),('2064-06-25'),('2064-06-26'),('2064-06-27'),('2064-06-28'),('2064-06-29'),('2064-06-30'),('2064-07-01'),('2064-07-02'),('2064-07-03'),('2064-07-04'),('2064-07-05'),('2064-07-06'),('2064-07-07'),('2064-07-08'),('2064-07-09'),('2064-07-10'),('2064-07-11'),('2064-07-12'),('2064-07-13'),('2064-07-14'),('2064-07-15'),('2064-07-16'),('2064-07-17'),('2064-07-18'),('2064-07-19'),('2064-07-20'),('2064-07-21'),('2064-07-22'),('2064-07-23'),('2064-07-24'),('2064-07-25'),('2064-07-26'),('2064-07-27'),('2064-07-28'),('2064-07-29'),('2064-07-30'),('2064-07-31'),('2064-08-01'),('2064-08-02'),('2064-08-03'),('2064-08-04'),('2064-08-05'),('2064-08-06'),('2064-08-07'),('2064-08-08'),('2064-08-09'),('2064-08-10'),('2064-08-11'),('2064-08-12'),('2064-08-13'),('2064-08-14'),('2064-08-15'),('2064-08-16'),('2064-08-17'),('2064-08-18'),('2064-08-19'),('2064-08-20'),('2064-08-21'),('2064-08-22'),('2064-08-23'),('2064-08-24'),('2064-08-25'),('2064-08-26'),('2064-08-27'),('2064-08-28'),('2064-08-29'),('2064-08-30'),('2064-08-31'),('2064-09-01'),('2064-09-02'),('2064-09-03'),('2064-09-04'),('2064-09-05'),('2064-09-06'),('2064-09-07'),('2064-09-08'),('2064-09-09'),('2064-09-10'),('2064-09-11'),('2064-09-12'),('2064-09-13'),('2064-09-14'),('2064-09-15'),('2064-09-16'),('2064-09-17'),('2064-09-18'),('2064-09-19'),('2064-09-20'),('2064-09-21'),('2064-09-22'),('2064-09-23'),('2064-09-24'),('2064-09-25'),('2064-09-26'),('2064-09-27'),('2064-09-28'),('2064-09-29'),('2064-09-30'),('2064-10-01'),('2064-10-02'),('2064-10-03'),('2064-10-04'),('2064-10-05'),('2064-10-06'),('2064-10-07'),('2064-10-08'),('2064-10-09'),('2064-10-10'),('2064-10-11'),('2064-10-12'),('2064-10-13'),('2064-10-14'),('2064-10-15'),('2064-10-16'),('2064-10-17'),('2064-10-18'),('2064-10-19'),('2064-10-20'),('2064-10-21'),('2064-10-22'),('2064-10-23'),('2064-10-24'),('2064-10-25'),('2064-10-26'),('2064-10-27'),('2064-10-28'),('2064-10-29'),('2064-10-30'),('2064-10-31'),('2064-11-01'),('2064-11-02'),('2064-11-03'),('2064-11-04'),('2064-11-05'),('2064-11-06'),('2064-11-07'),('2064-11-08'),('2064-11-09'),('2064-11-10'),('2064-11-11'),('2064-11-12'),('2064-11-13'),('2064-11-14'),('2064-11-15'),('2064-11-16'),('2064-11-17'),('2064-11-18'),('2064-11-19'),('2064-11-20'),('2064-11-21'),('2064-11-22'),('2064-11-23'),('2064-11-24'),('2064-11-25'),('2064-11-26'),('2064-11-27'),('2064-11-28'),('2064-11-29'),('2064-11-30'),('2064-12-01'),('2064-12-02'),('2064-12-03'),('2064-12-04'),('2064-12-05'),('2064-12-06'),('2064-12-07'),('2064-12-08'),('2064-12-09'),('2064-12-10'),('2064-12-11'),('2064-12-12'),('2064-12-13'),('2064-12-14'),('2064-12-15'),('2064-12-16'),('2064-12-17'),('2064-12-18'),('2064-12-19'),('2064-12-20'),('2064-12-21'),('2064-12-22'),('2064-12-23'),('2064-12-24'),('2064-12-25'),('2064-12-26'),('2064-12-27'),('2064-12-28'),('2064-12-29'),('2064-12-30'),('2064-12-31'),('2065-01-01'),('2065-01-02'),('2065-01-03'),('2065-01-04'),('2065-01-05'),('2065-01-06'),('2065-01-07'),('2065-01-08'),('2065-01-09'),('2065-01-10'),('2065-01-11'),('2065-01-12'),('2065-01-13'),('2065-01-14'),('2065-01-15'),('2065-01-16'),('2065-01-17'),('2065-01-18'),('2065-01-19'),('2065-01-20'),('2065-01-21'),('2065-01-22'),('2065-01-23'),('2065-01-24'),('2065-01-25'),('2065-01-26'),('2065-01-27'),('2065-01-28'),('2065-01-29'),('2065-01-30'),('2065-01-31'),('2065-02-01'),('2065-02-02'),('2065-02-03'),('2065-02-04'),('2065-02-05'),('2065-02-06'),('2065-02-07'),('2065-02-08'),('2065-02-09'),('2065-02-10'),('2065-02-11'),('2065-02-12'),('2065-02-13'),('2065-02-14'),('2065-02-15'),('2065-02-16'),('2065-02-17'),('2065-02-18'),('2065-02-19'),('2065-02-20'),('2065-02-21'),('2065-02-22'),('2065-02-23'),('2065-02-24'),('2065-02-25'),('2065-02-26'),('2065-02-27'),('2065-02-28'),('2065-03-01'),('2065-03-02'),('2065-03-03'),('2065-03-04'),('2065-03-05'),('2065-03-06'),('2065-03-07'),('2065-03-08'),('2065-03-09'),('2065-03-10'),('2065-03-11'),('2065-03-12'),('2065-03-13'),('2065-03-14'),('2065-03-15'),('2065-03-16'),('2065-03-17'),('2065-03-18'),('2065-03-19'),('2065-03-20'),('2065-03-21'),('2065-03-22'),('2065-03-23'),('2065-03-24'),('2065-03-25'),('2065-03-26'),('2065-03-27'),('2065-03-28'),('2065-03-29'),('2065-03-30'),('2065-03-31'),('2065-04-01'),('2065-04-02'),('2065-04-03'),('2065-04-04'),('2065-04-05'),('2065-04-06'),('2065-04-07'),('2065-04-08'),('2065-04-09'),('2065-04-10'),('2065-04-11'),('2065-04-12'),('2065-04-13'),('2065-04-14'),('2065-04-15'),('2065-04-16'),('2065-04-17'),('2065-04-18'),('2065-04-19'),('2065-04-20'),('2065-04-21'),('2065-04-22'),('2065-04-23'),('2065-04-24'),('2065-04-25'),('2065-04-26'),('2065-04-27'),('2065-04-28'),('2065-04-29'),('2065-04-30'),('2065-05-01'),('2065-05-02'),('2065-05-03'),('2065-05-04'),('2065-05-05'),('2065-05-06'),('2065-05-07'),('2065-05-08'),('2065-05-09'),('2065-05-10'),('2065-05-11'),('2065-05-12'),('2065-05-13'),('2065-05-14'),('2065-05-15'),('2065-05-16'),('2065-05-17'),('2065-05-18'),('2065-05-19'),('2065-05-20'),('2065-05-21'),('2065-05-22'),('2065-05-23'),('2065-05-24'),('2065-05-25'),('2065-05-26'),('2065-05-27'),('2065-05-28'),('2065-05-29'),('2065-05-30'),('2065-05-31'),('2065-06-01'),('2065-06-02'),('2065-06-03'),('2065-06-04'),('2065-06-05'),('2065-06-06'),('2065-06-07'),('2065-06-08'),('2065-06-09'),('2065-06-10'),('2065-06-11'),('2065-06-12'),('2065-06-13'),('2065-06-14'),('2065-06-15'),('2065-06-16'),('2065-06-17'),('2065-06-18'),('2065-06-19'),('2065-06-20'),('2065-06-21'),('2065-06-22'),('2065-06-23'),('2065-06-24'),('2065-06-25'),('2065-06-26'),('2065-06-27'),('2065-06-28'),('2065-06-29'),('2065-06-30'),('2065-07-01'),('2065-07-02'),('2065-07-03'),('2065-07-04'),('2065-07-05'),('2065-07-06'),('2065-07-07'),('2065-07-08'),('2065-07-09'),('2065-07-10'),('2065-07-11'),('2065-07-12'),('2065-07-13'),('2065-07-14'),('2065-07-15'),('2065-07-16'),('2065-07-17'),('2065-07-18'),('2065-07-19'),('2065-07-20'),('2065-07-21'),('2065-07-22'),('2065-07-23'),('2065-07-24'),('2065-07-25'),('2065-07-26'),('2065-07-27'),('2065-07-28'),('2065-07-29'),('2065-07-30'),('2065-07-31'),('2065-08-01'),('2065-08-02'),('2065-08-03'),('2065-08-04'),('2065-08-05'),('2065-08-06'),('2065-08-07'),('2065-08-08'),('2065-08-09'),('2065-08-10'),('2065-08-11'),('2065-08-12'),('2065-08-13'),('2065-08-14'),('2065-08-15'),('2065-08-16'),('2065-08-17'),('2065-08-18'),('2065-08-19'),('2065-08-20'),('2065-08-21'),('2065-08-22'),('2065-08-23'),('2065-08-24'),('2065-08-25'),('2065-08-26'),('2065-08-27'),('2065-08-28'),('2065-08-29'),('2065-08-30'),('2065-08-31'),('2065-09-01'),('2065-09-02'),('2065-09-03'),('2065-09-04'),('2065-09-05'),('2065-09-06'),('2065-09-07'),('2065-09-08'),('2065-09-09'),('2065-09-10'),('2065-09-11'),('2065-09-12'),('2065-09-13'),('2065-09-14'),('2065-09-15'),('2065-09-16'),('2065-09-17'),('2065-09-18'),('2065-09-19'),('2065-09-20'),('2065-09-21'),('2065-09-22'),('2065-09-23'),('2065-09-24'),('2065-09-25'),('2065-09-26'),('2065-09-27'),('2065-09-28'),('2065-09-29'),('2065-09-30'),('2065-10-01'),('2065-10-02'),('2065-10-03'),('2065-10-04'),('2065-10-05'),('2065-10-06'),('2065-10-07'),('2065-10-08'),('2065-10-09'),('2065-10-10'),('2065-10-11'),('2065-10-12'),('2065-10-13'),('2065-10-14'),('2065-10-15'),('2065-10-16'),('2065-10-17'),('2065-10-18'),('2065-10-19'),('2065-10-20'),('2065-10-21'),('2065-10-22'),('2065-10-23'),('2065-10-24'),('2065-10-25'),('2065-10-26'),('2065-10-27'),('2065-10-28'),('2065-10-29'),('2065-10-30'),('2065-10-31'),('2065-11-01'),('2065-11-02'),('2065-11-03'),('2065-11-04'),('2065-11-05'),('2065-11-06'),('2065-11-07'),('2065-11-08'),('2065-11-09'),('2065-11-10'),('2065-11-11'),('2065-11-12'),('2065-11-13'),('2065-11-14'),('2065-11-15'),('2065-11-16'),('2065-11-17'),('2065-11-18'),('2065-11-19'),('2065-11-20'),('2065-11-21'),('2065-11-22'),('2065-11-23'),('2065-11-24'),('2065-11-25'),('2065-11-26'),('2065-11-27'),('2065-11-28'),('2065-11-29'),('2065-11-30'),('2065-12-01'),('2065-12-02'),('2065-12-03'),('2065-12-04'),('2065-12-05'),('2065-12-06'),('2065-12-07'),('2065-12-08'),('2065-12-09'),('2065-12-10'),('2065-12-11'),('2065-12-12'),('2065-12-13'),('2065-12-14'),('2065-12-15'),('2065-12-16'),('2065-12-17'),('2065-12-18'),('2065-12-19'),('2065-12-20'),('2065-12-21'),('2065-12-22'),('2065-12-23'),('2065-12-24'),('2065-12-25'),('2065-12-26'),('2065-12-27'),('2065-12-28'),('2065-12-29'),('2065-12-30'),('2065-12-31'),('2066-01-01'),('2066-01-02'),('2066-01-03'),('2066-01-04'),('2066-01-05'),('2066-01-06'),('2066-01-07'),('2066-01-08'),('2066-01-09'),('2066-01-10'),('2066-01-11'),('2066-01-12'),('2066-01-13'),('2066-01-14'),('2066-01-15'),('2066-01-16'),('2066-01-17'),('2066-01-18'),('2066-01-19'),('2066-01-20'),('2066-01-21'),('2066-01-22'),('2066-01-23'),('2066-01-24'),('2066-01-25'),('2066-01-26'),('2066-01-27'),('2066-01-28'),('2066-01-29'),('2066-01-30'),('2066-01-31'),('2066-02-01'),('2066-02-02'),('2066-02-03'),('2066-02-04'),('2066-02-05'),('2066-02-06'),('2066-02-07'),('2066-02-08'),('2066-02-09'),('2066-02-10'),('2066-02-11'),('2066-02-12'),('2066-02-13'),('2066-02-14'),('2066-02-15'),('2066-02-16'),('2066-02-17'),('2066-02-18'),('2066-02-19'),('2066-02-20'),('2066-02-21'),('2066-02-22'),('2066-02-23'),('2066-02-24'),('2066-02-25'),('2066-02-26'),('2066-02-27'),('2066-02-28'),('2066-03-01'),('2066-03-02'),('2066-03-03'),('2066-03-04'),('2066-03-05'),('2066-03-06'),('2066-03-07'),('2066-03-08'),('2066-03-09'),('2066-03-10'),('2066-03-11'),('2066-03-12'),('2066-03-13'),('2066-03-14'),('2066-03-15'),('2066-03-16'),('2066-03-17'),('2066-03-18'),('2066-03-19'),('2066-03-20'),('2066-03-21'),('2066-03-22'),('2066-03-23'),('2066-03-24'),('2066-03-25'),('2066-03-26'),('2066-03-27'),('2066-03-28'),('2066-03-29'),('2066-03-30'),('2066-03-31'),('2066-04-01'),('2066-04-02'),('2066-04-03'),('2066-04-04'),('2066-04-05'),('2066-04-06'),('2066-04-07'),('2066-04-08'),('2066-04-09'),('2066-04-10'),('2066-04-11'),('2066-04-12'),('2066-04-13'),('2066-04-14'),('2066-04-15'),('2066-04-16'),('2066-04-17'),('2066-04-18'),('2066-04-19'),('2066-04-20'),('2066-04-21'),('2066-04-22'),('2066-04-23'),('2066-04-24'),('2066-04-25'),('2066-04-26'),('2066-04-27'),('2066-04-28'),('2066-04-29'),('2066-04-30'),('2066-05-01'),('2066-05-02'),('2066-05-03'),('2066-05-04'),('2066-05-05'),('2066-05-06'),('2066-05-07'),('2066-05-08'),('2066-05-09'),('2066-05-10'),('2066-05-11'),('2066-05-12'),('2066-05-13'),('2066-05-14'),('2066-05-15'),('2066-05-16'),('2066-05-17'),('2066-05-18'),('2066-05-19'),('2066-05-20'),('2066-05-21'),('2066-05-22'),('2066-05-23'),('2066-05-24'),('2066-05-25'),('2066-05-26'),('2066-05-27'),('2066-05-28'),('2066-05-29'),('2066-05-30'),('2066-05-31'),('2066-06-01'),('2066-06-02'),('2066-06-03'),('2066-06-04'),('2066-06-05'),('2066-06-06'),('2066-06-07'),('2066-06-08'),('2066-06-09'),('2066-06-10'),('2066-06-11'),('2066-06-12'),('2066-06-13'),('2066-06-14'),('2066-06-15'),('2066-06-16'),('2066-06-17'),('2066-06-18'),('2066-06-19'),('2066-06-20'),('2066-06-21'),('2066-06-22'),('2066-06-23'),('2066-06-24'),('2066-06-25'),('2066-06-26'),('2066-06-27'),('2066-06-28'),('2066-06-29'),('2066-06-30'),('2066-07-01'),('2066-07-02'),('2066-07-03'),('2066-07-04'),('2066-07-05'),('2066-07-06'),('2066-07-07'),('2066-07-08'),('2066-07-09'),('2066-07-10'),('2066-07-11'),('2066-07-12'),('2066-07-13'),('2066-07-14'),('2066-07-15'),('2066-07-16'),('2066-07-17'),('2066-07-18'),('2066-07-19'),('2066-07-20'),('2066-07-21'),('2066-07-22'),('2066-07-23'),('2066-07-24'),('2066-07-25'),('2066-07-26'),('2066-07-27'),('2066-07-28'),('2066-07-29'),('2066-07-30'),('2066-07-31'),('2066-08-01'),('2066-08-02'),('2066-08-03'),('2066-08-04'),('2066-08-05'),('2066-08-06'),('2066-08-07'),('2066-08-08'),('2066-08-09'),('2066-08-10'),('2066-08-11'),('2066-08-12'),('2066-08-13'),('2066-08-14'),('2066-08-15'),('2066-08-16'),('2066-08-17'),('2066-08-18'),('2066-08-19'),('2066-08-20'),('2066-08-21'),('2066-08-22'),('2066-08-23'),('2066-08-24'),('2066-08-25'),('2066-08-26'),('2066-08-27'),('2066-08-28'),('2066-08-29'),('2066-08-30'),('2066-08-31'),('2066-09-01'),('2066-09-02'),('2066-09-03'),('2066-09-04'),('2066-09-05'),('2066-09-06'),('2066-09-07'),('2066-09-08'),('2066-09-09'),('2066-09-10'),('2066-09-11'),('2066-09-12'),('2066-09-13'),('2066-09-14'),('2066-09-15'),('2066-09-16'),('2066-09-17'),('2066-09-18'),('2066-09-19'),('2066-09-20'),('2066-09-21'),('2066-09-22'),('2066-09-23'),('2066-09-24'),('2066-09-25'),('2066-09-26'),('2066-09-27'),('2066-09-28'),('2066-09-29'),('2066-09-30'),('2066-10-01'),('2066-10-02'),('2066-10-03'),('2066-10-04'),('2066-10-05'),('2066-10-06'),('2066-10-07'),('2066-10-08'),('2066-10-09'),('2066-10-10'),('2066-10-11'),('2066-10-12'),('2066-10-13'),('2066-10-14'),('2066-10-15'),('2066-10-16'),('2066-10-17'),('2066-10-18'),('2066-10-19'),('2066-10-20'),('2066-10-21'),('2066-10-22'),('2066-10-23'),('2066-10-24'),('2066-10-25'),('2066-10-26'),('2066-10-27'),('2066-10-28'),('2066-10-29'),('2066-10-30'),('2066-10-31'),('2066-11-01'),('2066-11-02'),('2066-11-03'),('2066-11-04'),('2066-11-05'),('2066-11-06'),('2066-11-07'),('2066-11-08'),('2066-11-09'),('2066-11-10'),('2066-11-11'),('2066-11-12'),('2066-11-13'),('2066-11-14'),('2066-11-15'),('2066-11-16'),('2066-11-17'),('2066-11-18'),('2066-11-19'),('2066-11-20'),('2066-11-21'),('2066-11-22'),('2066-11-23'),('2066-11-24'),('2066-11-25'),('2066-11-26'),('2066-11-27'),('2066-11-28'),('2066-11-29'),('2066-11-30'),('2066-12-01'),('2066-12-02'),('2066-12-03'),('2066-12-04'),('2066-12-05'),('2066-12-06'),('2066-12-07'),('2066-12-08'),('2066-12-09'),('2066-12-10'),('2066-12-11'),('2066-12-12'),('2066-12-13'),('2066-12-14'),('2066-12-15'),('2066-12-16'),('2066-12-17'),('2066-12-18'),('2066-12-19'),('2066-12-20'),('2066-12-21'),('2066-12-22'),('2066-12-23'),('2066-12-24'),('2066-12-25'),('2066-12-26'),('2066-12-27'),('2066-12-28'),('2066-12-29'),('2066-12-30'),('2066-12-31'),('2067-01-01'),('2067-01-02'),('2067-01-03'),('2067-01-04'),('2067-01-05'),('2067-01-06'),('2067-01-07'),('2067-01-08'),('2067-01-09'),('2067-01-10'),('2067-01-11'),('2067-01-12'),('2067-01-13'),('2067-01-14'),('2067-01-15'),('2067-01-16'),('2067-01-17'),('2067-01-18'),('2067-01-19'),('2067-01-20'),('2067-01-21'),('2067-01-22'),('2067-01-23'),('2067-01-24'),('2067-01-25'),('2067-01-26'),('2067-01-27'),('2067-01-28'),('2067-01-29'),('2067-01-30'),('2067-01-31'),('2067-02-01'),('2067-02-02'),('2067-02-03'),('2067-02-04'),('2067-02-05'),('2067-02-06'),('2067-02-07'),('2067-02-08'),('2067-02-09'),('2067-02-10'),('2067-02-11'),('2067-02-12'),('2067-02-13'),('2067-02-14'),('2067-02-15'),('2067-02-16'),('2067-02-17'),('2067-02-18'),('2067-02-19'),('2067-02-20'),('2067-02-21'),('2067-02-22'),('2067-02-23'),('2067-02-24'),('2067-02-25'),('2067-02-26'),('2067-02-27'),('2067-02-28'),('2067-03-01'),('2067-03-02'),('2067-03-03'),('2067-03-04'),('2067-03-05'),('2067-03-06'),('2067-03-07'),('2067-03-08'),('2067-03-09'),('2067-03-10'),('2067-03-11'),('2067-03-12'),('2067-03-13'),('2067-03-14'),('2067-03-15'),('2067-03-16'),('2067-03-17'),('2067-03-18'),('2067-03-19'),('2067-03-20'),('2067-03-21'),('2067-03-22'),('2067-03-23'),('2067-03-24'),('2067-03-25'),('2067-03-26'),('2067-03-27'),('2067-03-28'),('2067-03-29'),('2067-03-30'),('2067-03-31'),('2067-04-01'),('2067-04-02'),('2067-04-03'),('2067-04-04'),('2067-04-05'),('2067-04-06'),('2067-04-07'),('2067-04-08'),('2067-04-09'),('2067-04-10'),('2067-04-11'),('2067-04-12'),('2067-04-13'),('2067-04-14'),('2067-04-15'),('2067-04-16'),('2067-04-17'),('2067-04-18'),('2067-04-19'),('2067-04-20'),('2067-04-21'),('2067-04-22'),('2067-04-23'),('2067-04-24'),('2067-04-25'),('2067-04-26'),('2067-04-27'),('2067-04-28'),('2067-04-29'),('2067-04-30'),('2067-05-01'),('2067-05-02'),('2067-05-03'),('2067-05-04'),('2067-05-05'),('2067-05-06'),('2067-05-07'),('2067-05-08'),('2067-05-09'),('2067-05-10'),('2067-05-11'),('2067-05-12'),('2067-05-13'),('2067-05-14'),('2067-05-15'),('2067-05-16'),('2067-05-17'),('2067-05-18'),('2067-05-19'),('2067-05-20'),('2067-05-21'),('2067-05-22'),('2067-05-23'),('2067-05-24'),('2067-05-25'),('2067-05-26'),('2067-05-27'),('2067-05-28'),('2067-05-29'),('2067-05-30'),('2067-05-31'),('2067-06-01'),('2067-06-02'),('2067-06-03'),('2067-06-04'),('2067-06-05'),('2067-06-06'),('2067-06-07'),('2067-06-08'),('2067-06-09'),('2067-06-10'),('2067-06-11'),('2067-06-12'),('2067-06-13'),('2067-06-14'),('2067-06-15'),('2067-06-16'),('2067-06-17'),('2067-06-18'),('2067-06-19'),('2067-06-20'),('2067-06-21'),('2067-06-22'),('2067-06-23'),('2067-06-24'),('2067-06-25'),('2067-06-26'),('2067-06-27'),('2067-06-28'),('2067-06-29'),('2067-06-30'),('2067-07-01'),('2067-07-02'),('2067-07-03'),('2067-07-04'),('2067-07-05'),('2067-07-06'),('2067-07-07'),('2067-07-08'),('2067-07-09'),('2067-07-10'),('2067-07-11'),('2067-07-12'),('2067-07-13'),('2067-07-14'),('2067-07-15'),('2067-07-16'),('2067-07-17'),('2067-07-18'),('2067-07-19'),('2067-07-20'),('2067-07-21'),('2067-07-22'),('2067-07-23'),('2067-07-24'),('2067-07-25'),('2067-07-26'),('2067-07-27'),('2067-07-28'),('2067-07-29'),('2067-07-30'),('2067-07-31'),('2067-08-01'),('2067-08-02'),('2067-08-03'),('2067-08-04'),('2067-08-05'),('2067-08-06'),('2067-08-07'),('2067-08-08'),('2067-08-09'),('2067-08-10'),('2067-08-11'),('2067-08-12'),('2067-08-13'),('2067-08-14'),('2067-08-15'),('2067-08-16'),('2067-08-17'),('2067-08-18'),('2067-08-19'),('2067-08-20'),('2067-08-21'),('2067-08-22'),('2067-08-23'),('2067-08-24'),('2067-08-25'),('2067-08-26'),('2067-08-27'),('2067-08-28'),('2067-08-29'),('2067-08-30'),('2067-08-31'),('2067-09-01'),('2067-09-02'),('2067-09-03'),('2067-09-04'),('2067-09-05'),('2067-09-06'),('2067-09-07'),('2067-09-08'),('2067-09-09'),('2067-09-10'),('2067-09-11'),('2067-09-12'),('2067-09-13'),('2067-09-14'),('2067-09-15'),('2067-09-16'),('2067-09-17'),('2067-09-18'),('2067-09-19'),('2067-09-20'),('2067-09-21'),('2067-09-22'),('2067-09-23'),('2067-09-24'),('2067-09-25'),('2067-09-26'),('2067-09-27'),('2067-09-28'),('2067-09-29'),('2067-09-30'),('2067-10-01'),('2067-10-02'),('2067-10-03'),('2067-10-04'),('2067-10-05'),('2067-10-06'),('2067-10-07'),('2067-10-08'),('2067-10-09'),('2067-10-10'),('2067-10-11'),('2067-10-12'),('2067-10-13'),('2067-10-14'),('2067-10-15'),('2067-10-16'),('2067-10-17'),('2067-10-18'),('2067-10-19'),('2067-10-20'),('2067-10-21'),('2067-10-22'),('2067-10-23'),('2067-10-24'),('2067-10-25'),('2067-10-26'),('2067-10-27'),('2067-10-28'),('2067-10-29'),('2067-10-30'),('2067-10-31'),('2067-11-01'),('2067-11-02'),('2067-11-03'),('2067-11-04'),('2067-11-05'),('2067-11-06'),('2067-11-07'),('2067-11-08'),('2067-11-09'),('2067-11-10'),('2067-11-11'),('2067-11-12'),('2067-11-13'),('2067-11-14'),('2067-11-15'),('2067-11-16'),('2067-11-17'),('2067-11-18'),('2067-11-19'),('2067-11-20'),('2067-11-21'),('2067-11-22'),('2067-11-23'),('2067-11-24'),('2067-11-25'),('2067-11-26'),('2067-11-27'),('2067-11-28'),('2067-11-29'),('2067-11-30'),('2067-12-01'),('2067-12-02'),('2067-12-03'),('2067-12-04'),('2067-12-05'),('2067-12-06'),('2067-12-07'),('2067-12-08'),('2067-12-09'),('2067-12-10'),('2067-12-11'),('2067-12-12'),('2067-12-13'),('2067-12-14'),('2067-12-15'),('2067-12-16'),('2067-12-17'),('2067-12-18'),('2067-12-19'),('2067-12-20'),('2067-12-21'),('2067-12-22'),('2067-12-23'),('2067-12-24'),('2067-12-25'),('2067-12-26'),('2067-12-27'),('2067-12-28'),('2067-12-29'),('2067-12-30'),('2067-12-31'),('2068-01-01'),('2068-01-02'),('2068-01-03'),('2068-01-04'),('2068-01-05'),('2068-01-06'),('2068-01-07'),('2068-01-08'),('2068-01-09'),('2068-01-10'),('2068-01-11'),('2068-01-12'),('2068-01-13'),('2068-01-14'),('2068-01-15'),('2068-01-16'),('2068-01-17'),('2068-01-18'),('2068-01-19'),('2068-01-20'),('2068-01-21'),('2068-01-22'),('2068-01-23'),('2068-01-24'),('2068-01-25'),('2068-01-26'),('2068-01-27'),('2068-01-28'),('2068-01-29'),('2068-01-30'),('2068-01-31'),('2068-02-01'),('2068-02-02'),('2068-02-03'),('2068-02-04'),('2068-02-05'),('2068-02-06'),('2068-02-07'),('2068-02-08'),('2068-02-09'),('2068-02-10'),('2068-02-11'),('2068-02-12'),('2068-02-13'),('2068-02-14'),('2068-02-15'),('2068-02-16'),('2068-02-17'),('2068-02-18'),('2068-02-19'),('2068-02-20'),('2068-02-21'),('2068-02-22'),('2068-02-23'),('2068-02-24'),('2068-02-25'),('2068-02-26'),('2068-02-27'),('2068-02-28'),('2068-02-29'),('2068-03-01'),('2068-03-02'),('2068-03-03'),('2068-03-04'),('2068-03-05'),('2068-03-06'),('2068-03-07'),('2068-03-08'),('2068-03-09'),('2068-03-10'),('2068-03-11'),('2068-03-12'),('2068-03-13'),('2068-03-14'),('2068-03-15'),('2068-03-16'),('2068-03-17'),('2068-03-18'),('2068-03-19'),('2068-03-20'),('2068-03-21'),('2068-03-22'),('2068-03-23'),('2068-03-24'),('2068-03-25'),('2068-03-26'),('2068-03-27'),('2068-03-28'),('2068-03-29'),('2068-03-30'),('2068-03-31'),('2068-04-01'),('2068-04-02'),('2068-04-03'),('2068-04-04'),('2068-04-05'),('2068-04-06'),('2068-04-07'),('2068-04-08'),('2068-04-09'),('2068-04-10'),('2068-04-11'),('2068-04-12'),('2068-04-13'),('2068-04-14'),('2068-04-15'),('2068-04-16'),('2068-04-17'),('2068-04-18'),('2068-04-19'),('2068-04-20'),('2068-04-21'),('2068-04-22'),('2068-04-23'),('2068-04-24'),('2068-04-25'),('2068-04-26'),('2068-04-27'),('2068-04-28'),('2068-04-29'),('2068-04-30'),('2068-05-01'),('2068-05-02'),('2068-05-03'),('2068-05-04'),('2068-05-05'),('2068-05-06'),('2068-05-07'),('2068-05-08'),('2068-05-09'),('2068-05-10'),('2068-05-11'),('2068-05-12'),('2068-05-13'),('2068-05-14'),('2068-05-15'),('2068-05-16'),('2068-05-17'),('2068-05-18'),('2068-05-19'),('2068-05-20'),('2068-05-21'),('2068-05-22'),('2068-05-23'),('2068-05-24'),('2068-05-25'),('2068-05-26'),('2068-05-27'),('2068-05-28'),('2068-05-29'),('2068-05-30'),('2068-05-31'),('2068-06-01'),('2068-06-02'),('2068-06-03'),('2068-06-04'),('2068-06-05'),('2068-06-06'),('2068-06-07'),('2068-06-08'),('2068-06-09'),('2068-06-10'),('2068-06-11'),('2068-06-12'),('2068-06-13'),('2068-06-14'),('2068-06-15'),('2068-06-16'),('2068-06-17'),('2068-06-18'),('2068-06-19'),('2068-06-20'),('2068-06-21'),('2068-06-22'),('2068-06-23'),('2068-06-24'),('2068-06-25'),('2068-06-26'),('2068-06-27'),('2068-06-28'),('2068-06-29'),('2068-06-30'),('2068-07-01'),('2068-07-02'),('2068-07-03'),('2068-07-04'),('2068-07-05'),('2068-07-06'),('2068-07-07'),('2068-07-08'),('2068-07-09'),('2068-07-10'),('2068-07-11'),('2068-07-12'),('2068-07-13'),('2068-07-14'),('2068-07-15'),('2068-07-16'),('2068-07-17'),('2068-07-18'),('2068-07-19'),('2068-07-20'),('2068-07-21'),('2068-07-22'),('2068-07-23'),('2068-07-24'),('2068-07-25'),('2068-07-26'),('2068-07-27'),('2068-07-28'),('2068-07-29'),('2068-07-30'),('2068-07-31'),('2068-08-01'),('2068-08-02'),('2068-08-03'),('2068-08-04'),('2068-08-05'),('2068-08-06'),('2068-08-07'),('2068-08-08'),('2068-08-09'),('2068-08-10'),('2068-08-11'),('2068-08-12'),('2068-08-13'),('2068-08-14'),('2068-08-15'),('2068-08-16'),('2068-08-17'),('2068-08-18'),('2068-08-19'),('2068-08-20'),('2068-08-21'),('2068-08-22'),('2068-08-23'),('2068-08-24'),('2068-08-25'),('2068-08-26'),('2068-08-27'),('2068-08-28'),('2068-08-29'),('2068-08-30'),('2068-08-31'),('2068-09-01'),('2068-09-02'),('2068-09-03'),('2068-09-04'),('2068-09-05'),('2068-09-06'),('2068-09-07'),('2068-09-08'),('2068-09-09'),('2068-09-10'),('2068-09-11'),('2068-09-12'),('2068-09-13'),('2068-09-14'),('2068-09-15'),('2068-09-16'),('2068-09-17'),('2068-09-18'),('2068-09-19'),('2068-09-20'),('2068-09-21'),('2068-09-22'),('2068-09-23'),('2068-09-24'),('2068-09-25'),('2068-09-26'),('2068-09-27'),('2068-09-28'),('2068-09-29'),('2068-09-30'),('2068-10-01'),('2068-10-02'),('2068-10-03'),('2068-10-04'),('2068-10-05'),('2068-10-06'),('2068-10-07'),('2068-10-08'),('2068-10-09'),('2068-10-10'),('2068-10-11'),('2068-10-12'),('2068-10-13'),('2068-10-14'),('2068-10-15'),('2068-10-16'),('2068-10-17'),('2068-10-18'),('2068-10-19'),('2068-10-20'),('2068-10-21'),('2068-10-22'),('2068-10-23'),('2068-10-24'),('2068-10-25'),('2068-10-26'),('2068-10-27'),('2068-10-28'),('2068-10-29'),('2068-10-30'),('2068-10-31'),('2068-11-01'),('2068-11-02'),('2068-11-03'),('2068-11-04'),('2068-11-05'),('2068-11-06'),('2068-11-07'),('2068-11-08'),('2068-11-09'),('2068-11-10'),('2068-11-11'),('2068-11-12'),('2068-11-13'),('2068-11-14'),('2068-11-15'),('2068-11-16'),('2068-11-17'),('2068-11-18'),('2068-11-19'),('2068-11-20'),('2068-11-21'),('2068-11-22'),('2068-11-23'),('2068-11-24'),('2068-11-25'),('2068-11-26'),('2068-11-27'),('2068-11-28'),('2068-11-29'),('2068-11-30'),('2068-12-01'),('2068-12-02'),('2068-12-03'),('2068-12-04'),('2068-12-05'),('2068-12-06'),('2068-12-07'),('2068-12-08'),('2068-12-09'),('2068-12-10'),('2068-12-11'),('2068-12-12'),('2068-12-13'),('2068-12-14'),('2068-12-15'),('2068-12-16'),('2068-12-17'),('2068-12-18'),('2068-12-19'),('2068-12-20'),('2068-12-21'),('2068-12-22'),('2068-12-23'),('2068-12-24'),('2068-12-25'),('2068-12-26'),('2068-12-27'),('2068-12-28'),('2068-12-29'),('2068-12-30'),('2068-12-31'),('2069-01-01'),('2069-01-02'),('2069-01-03'),('2069-01-04'),('2069-01-05'),('2069-01-06'),('2069-01-07'),('2069-01-08'),('2069-01-09'),('2069-01-10'),('2069-01-11'),('2069-01-12'),('2069-01-13'),('2069-01-14'),('2069-01-15'),('2069-01-16'),('2069-01-17'),('2069-01-18'),('2069-01-19'),('2069-01-20'),('2069-01-21'),('2069-01-22'),('2069-01-23'),('2069-01-24'),('2069-01-25'),('2069-01-26'),('2069-01-27'),('2069-01-28'),('2069-01-29'),('2069-01-30'),('2069-01-31'),('2069-02-01'),('2069-02-02'),('2069-02-03'),('2069-02-04'),('2069-02-05'),('2069-02-06'),('2069-02-07'),('2069-02-08'),('2069-02-09'),('2069-02-10'),('2069-02-11'),('2069-02-12'),('2069-02-13'),('2069-02-14'),('2069-02-15'),('2069-02-16'),('2069-02-17'),('2069-02-18'),('2069-02-19'),('2069-02-20'),('2069-02-21'),('2069-02-22'),('2069-02-23'),('2069-02-24'),('2069-02-25'),('2069-02-26'),('2069-02-27'),('2069-02-28'),('2069-03-01'),('2069-03-02'),('2069-03-03'),('2069-03-04'),('2069-03-05'),('2069-03-06'),('2069-03-07'),('2069-03-08'),('2069-03-09'),('2069-03-10'),('2069-03-11'),('2069-03-12'),('2069-03-13'),('2069-03-14'),('2069-03-15'),('2069-03-16'),('2069-03-17'),('2069-03-18'),('2069-03-19'),('2069-03-20'),('2069-03-21'),('2069-03-22'),('2069-03-23'),('2069-03-24'),('2069-03-25'),('2069-03-26'),('2069-03-27'),('2069-03-28'),('2069-03-29'),('2069-03-30'),('2069-03-31'),('2069-04-01'),('2069-04-02'),('2069-04-03'),('2069-04-04'),('2069-04-05'),('2069-04-06'),('2069-04-07'),('2069-04-08'),('2069-04-09'),('2069-04-10'),('2069-04-11'),('2069-04-12'),('2069-04-13'),('2069-04-14'),('2069-04-15'),('2069-04-16'),('2069-04-17'),('2069-04-18'),('2069-04-19'),('2069-04-20'),('2069-04-21'),('2069-04-22'),('2069-04-23'),('2069-04-24'),('2069-04-25'),('2069-04-26'),('2069-04-27'),('2069-04-28'),('2069-04-29'),('2069-04-30'),('2069-05-01'),('2069-05-02'),('2069-05-03'),('2069-05-04'),('2069-05-05'),('2069-05-06'),('2069-05-07'),('2069-05-08'),('2069-05-09'),('2069-05-10'),('2069-05-11'),('2069-05-12'),('2069-05-13'),('2069-05-14'),('2069-05-15'),('2069-05-16'),('2069-05-17'),('2069-05-18'),('2069-05-19'),('2069-05-20'),('2069-05-21'),('2069-05-22'),('2069-05-23'),('2069-05-24'),('2069-05-25'),('2069-05-26'),('2069-05-27'),('2069-05-28'),('2069-05-29'),('2069-05-30'),('2069-05-31'),('2069-06-01'),('2069-06-02'),('2069-06-03'),('2069-06-04'),('2069-06-05'),('2069-06-06'),('2069-06-07'),('2069-06-08'),('2069-06-09'),('2069-06-10'),('2069-06-11'),('2069-06-12'),('2069-06-13'),('2069-06-14'),('2069-06-15'),('2069-06-16'),('2069-06-17'),('2069-06-18'),('2069-06-19'),('2069-06-20'),('2069-06-21'),('2069-06-22'),('2069-06-23'),('2069-06-24'),('2069-06-25'),('2069-06-26'),('2069-06-27'),('2069-06-28'),('2069-06-29'),('2069-06-30'),('2069-07-01'),('2069-07-02'),('2069-07-03'),('2069-07-04'),('2069-07-05'),('2069-07-06'),('2069-07-07'),('2069-07-08'),('2069-07-09'),('2069-07-10'),('2069-07-11'),('2069-07-12'),('2069-07-13'),('2069-07-14'),('2069-07-15'),('2069-07-16'),('2069-07-17'),('2069-07-18'),('2069-07-19'),('2069-07-20'),('2069-07-21'),('2069-07-22'),('2069-07-23'),('2069-07-24'),('2069-07-25'),('2069-07-26'),('2069-07-27'),('2069-07-28'),('2069-07-29'),('2069-07-30'),('2069-07-31'),('2069-08-01'),('2069-08-02'),('2069-08-03'),('2069-08-04'),('2069-08-05'),('2069-08-06'),('2069-08-07'),('2069-08-08'),('2069-08-09'),('2069-08-10'),('2069-08-11'),('2069-08-12'),('2069-08-13'),('2069-08-14'),('2069-08-15'),('2069-08-16'),('2069-08-17'),('2069-08-18'),('2069-08-19'),('2069-08-20'),('2069-08-21'),('2069-08-22'),('2069-08-23'),('2069-08-24'),('2069-08-25'),('2069-08-26'),('2069-08-27'),('2069-08-28'),('2069-08-29'),('2069-08-30'),('2069-08-31'),('2069-09-01'),('2069-09-02'),('2069-09-03'),('2069-09-04'),('2069-09-05'),('2069-09-06'),('2069-09-07'),('2069-09-08'),('2069-09-09'),('2069-09-10'),('2069-09-11'),('2069-09-12'),('2069-09-13'),('2069-09-14'),('2069-09-15'),('2069-09-16'),('2069-09-17'),('2069-09-18'),('2069-09-19'),('2069-09-20'),('2069-09-21'),('2069-09-22'),('2069-09-23'),('2069-09-24'),('2069-09-25'),('2069-09-26'),('2069-09-27'),('2069-09-28'),('2069-09-29'),('2069-09-30'),('2069-10-01'),('2069-10-02'),('2069-10-03'),('2069-10-04'),('2069-10-05'),('2069-10-06'),('2069-10-07'),('2069-10-08'),('2069-10-09'),('2069-10-10'),('2069-10-11'),('2069-10-12'),('2069-10-13'),('2069-10-14'),('2069-10-15'),('2069-10-16'),('2069-10-17'),('2069-10-18'),('2069-10-19'),('2069-10-20'),('2069-10-21'),('2069-10-22'),('2069-10-23'),('2069-10-24'),('2069-10-25'),('2069-10-26'),('2069-10-27'),('2069-10-28'),('2069-10-29'),('2069-10-30'),('2069-10-31'),('2069-11-01'),('2069-11-02'),('2069-11-03'),('2069-11-04'),('2069-11-05'),('2069-11-06'),('2069-11-07'),('2069-11-08'),('2069-11-09'),('2069-11-10'),('2069-11-11'),('2069-11-12'),('2069-11-13'),('2069-11-14'),('2069-11-15'),('2069-11-16'),('2069-11-17'),('2069-11-18'),('2069-11-19'),('2069-11-20'),('2069-11-21'),('2069-11-22'),('2069-11-23'),('2069-11-24'),('2069-11-25'),('2069-11-26'),('2069-11-27'),('2069-11-28'),('2069-11-29'),('2069-11-30'),('2069-12-01'),('2069-12-02'),('2069-12-03'),('2069-12-04'),('2069-12-05'),('2069-12-06'),('2069-12-07'),('2069-12-08'),('2069-12-09'),('2069-12-10'),('2069-12-11'),('2069-12-12'),('2069-12-13'),('2069-12-14'),('2069-12-15'),('2069-12-16'),('2069-12-17'),('2069-12-18'),('2069-12-19'),('2069-12-20'),('2069-12-21'),('2069-12-22'),('2069-12-23'),('2069-12-24'),('2069-12-25'),('2069-12-26'),('2069-12-27'),('2069-12-28'),('2069-12-29'),('2069-12-30'),('2069-12-31'),('2070-01-01'),('2070-01-02'),('2070-01-03'),('2070-01-04'),('2070-01-05'),('2070-01-06'),('2070-01-07'),('2070-01-08'),('2070-01-09'),('2070-01-10'),('2070-01-11'),('2070-01-12'),('2070-01-13'),('2070-01-14'),('2070-01-15'),('2070-01-16'),('2070-01-17'),('2070-01-18'),('2070-01-19'),('2070-01-20'),('2070-01-21'),('2070-01-22'),('2070-01-23'),('2070-01-24'),('2070-01-25'),('2070-01-26'),('2070-01-27'),('2070-01-28'),('2070-01-29'),('2070-01-30'),('2070-01-31'),('2070-02-01'),('2070-02-02'),('2070-02-03'),('2070-02-04'),('2070-02-05'),('2070-02-06'),('2070-02-07'),('2070-02-08'),('2070-02-09'),('2070-02-10'),('2070-02-11'),('2070-02-12'),('2070-02-13'),('2070-02-14'),('2070-02-15'),('2070-02-16'),('2070-02-17'),('2070-02-18'),('2070-02-19'),('2070-02-20'),('2070-02-21'),('2070-02-22'),('2070-02-23'),('2070-02-24'),('2070-02-25'),('2070-02-26'),('2070-02-27'),('2070-02-28'),('2070-03-01'),('2070-03-02'),('2070-03-03'),('2070-03-04'),('2070-03-05'),('2070-03-06'),('2070-03-07'),('2070-03-08'),('2070-03-09'),('2070-03-10'),('2070-03-11'),('2070-03-12'),('2070-03-13'),('2070-03-14'),('2070-03-15'),('2070-03-16'),('2070-03-17'),('2070-03-18'),('2070-03-19'),('2070-03-20'),('2070-03-21'),('2070-03-22'),('2070-03-23'),('2070-03-24'),('2070-03-25'),('2070-03-26'),('2070-03-27'),('2070-03-28'),('2070-03-29'),('2070-03-30'),('2070-03-31'),('2070-04-01'),('2070-04-02'),('2070-04-03'),('2070-04-04'),('2070-04-05'),('2070-04-06'),('2070-04-07'),('2070-04-08'),('2070-04-09'),('2070-04-10'),('2070-04-11'),('2070-04-12'),('2070-04-13'),('2070-04-14'),('2070-04-15'),('2070-04-16'),('2070-04-17'),('2070-04-18'),('2070-04-19'),('2070-04-20'),('2070-04-21'),('2070-04-22'),('2070-04-23'),('2070-04-24'),('2070-04-25'),('2070-04-26'),('2070-04-27'),('2070-04-28'),('2070-04-29'),('2070-04-30'),('2070-05-01'),('2070-05-02'),('2070-05-03'),('2070-05-04'),('2070-05-05'),('2070-05-06'),('2070-05-07'),('2070-05-08'),('2070-05-09'),('2070-05-10'),('2070-05-11'),('2070-05-12'),('2070-05-13'),('2070-05-14'),('2070-05-15'),('2070-05-16'),('2070-05-17'),('2070-05-18'),('2070-05-19'),('2070-05-20'),('2070-05-21'),('2070-05-22'),('2070-05-23'),('2070-05-24'),('2070-05-25'),('2070-05-26'),('2070-05-27'),('2070-05-28'),('2070-05-29'),('2070-05-30'),('2070-05-31'),('2070-06-01'),('2070-06-02'),('2070-06-03'),('2070-06-04'),('2070-06-05'),('2070-06-06'),('2070-06-07'),('2070-06-08'),('2070-06-09'),('2070-06-10'),('2070-06-11'),('2070-06-12'),('2070-06-13'),('2070-06-14'),('2070-06-15'),('2070-06-16'),('2070-06-17'),('2070-06-18'),('2070-06-19'),('2070-06-20'),('2070-06-21'),('2070-06-22'),('2070-06-23'),('2070-06-24'),('2070-06-25'),('2070-06-26'),('2070-06-27'),('2070-06-28'),('2070-06-29'),('2070-06-30'),('2070-07-01'),('2070-07-02'),('2070-07-03'),('2070-07-04'),('2070-07-05'),('2070-07-06'),('2070-07-07'),('2070-07-08'),('2070-07-09'),('2070-07-10'),('2070-07-11'),('2070-07-12'),('2070-07-13'),('2070-07-14'),('2070-07-15'),('2070-07-16'),('2070-07-17'),('2070-07-18'),('2070-07-19'),('2070-07-20'),('2070-07-21'),('2070-07-22'),('2070-07-23'),('2070-07-24'),('2070-07-25'),('2070-07-26'),('2070-07-27'),('2070-07-28'),('2070-07-29'),('2070-07-30'),('2070-07-31'),('2070-08-01'),('2070-08-02'),('2070-08-03'),('2070-08-04'),('2070-08-05'),('2070-08-06'),('2070-08-07'),('2070-08-08'),('2070-08-09'),('2070-08-10'),('2070-08-11'),('2070-08-12'),('2070-08-13'),('2070-08-14'),('2070-08-15'),('2070-08-16'),('2070-08-17'),('2070-08-18'),('2070-08-19'),('2070-08-20'),('2070-08-21'),('2070-08-22'),('2070-08-23'),('2070-08-24'),('2070-08-25'),('2070-08-26'),('2070-08-27'),('2070-08-28'),('2070-08-29'),('2070-08-30'),('2070-08-31'),('2070-09-01'),('2070-09-02'),('2070-09-03'),('2070-09-04'),('2070-09-05'),('2070-09-06'),('2070-09-07'),('2070-09-08'),('2070-09-09'),('2070-09-10'),('2070-09-11'),('2070-09-12'),('2070-09-13'),('2070-09-14'),('2070-09-15'),('2070-09-16'),('2070-09-17'),('2070-09-18'),('2070-09-19'),('2070-09-20'),('2070-09-21'),('2070-09-22'),('2070-09-23'),('2070-09-24'),('2070-09-25'),('2070-09-26'),('2070-09-27'),('2070-09-28'),('2070-09-29'),('2070-09-30'),('2070-10-01'),('2070-10-02'),('2070-10-03'),('2070-10-04'),('2070-10-05'),('2070-10-06'),('2070-10-07'),('2070-10-08'),('2070-10-09'),('2070-10-10'),('2070-10-11'),('2070-10-12'),('2070-10-13'),('2070-10-14'),('2070-10-15'),('2070-10-16'),('2070-10-17'),('2070-10-18'),('2070-10-19'),('2070-10-20'),('2070-10-21'),('2070-10-22'),('2070-10-23'),('2070-10-24'),('2070-10-25'),('2070-10-26'),('2070-10-27'),('2070-10-28'),('2070-10-29'),('2070-10-30'),('2070-10-31'),('2070-11-01'),('2070-11-02'),('2070-11-03'),('2070-11-04'),('2070-11-05'),('2070-11-06'),('2070-11-07'),('2070-11-08'),('2070-11-09'),('2070-11-10'),('2070-11-11'),('2070-11-12'),('2070-11-13'),('2070-11-14'),('2070-11-15'),('2070-11-16'),('2070-11-17'),('2070-11-18'),('2070-11-19'),('2070-11-20'),('2070-11-21'),('2070-11-22'),('2070-11-23'),('2070-11-24'),('2070-11-25'),('2070-11-26'),('2070-11-27'),('2070-11-28'),('2070-11-29'),('2070-11-30'),('2070-12-01'),('2070-12-02'),('2070-12-03'),('2070-12-04'),('2070-12-05'),('2070-12-06'),('2070-12-07'),('2070-12-08'),('2070-12-09'),('2070-12-10'),('2070-12-11'),('2070-12-12'),('2070-12-13'),('2070-12-14'),('2070-12-15'),('2070-12-16'),('2070-12-17'),('2070-12-18'),('2070-12-19'),('2070-12-20'),('2070-12-21'),('2070-12-22'),('2070-12-23'),('2070-12-24'),('2070-12-25'),('2070-12-26'),('2070-12-27'),('2070-12-28'),('2070-12-29'),('2070-12-30'),('2070-12-31'),('2071-01-01'),('2071-01-02'),('2071-01-03'),('2071-01-04'),('2071-01-05'),('2071-01-06'),('2071-01-07'),('2071-01-08'),('2071-01-09'),('2071-01-10'),('2071-01-11'),('2071-01-12'),('2071-01-13'),('2071-01-14'),('2071-01-15'),('2071-01-16'),('2071-01-17'),('2071-01-18'),('2071-01-19'),('2071-01-20'),('2071-01-21'),('2071-01-22'),('2071-01-23'),('2071-01-24'),('2071-01-25'),('2071-01-26'),('2071-01-27'),('2071-01-28'),('2071-01-29'),('2071-01-30'),('2071-01-31'),('2071-02-01'),('2071-02-02'),('2071-02-03'),('2071-02-04'),('2071-02-05'),('2071-02-06'),('2071-02-07'),('2071-02-08'),('2071-02-09'),('2071-02-10'),('2071-02-11'),('2071-02-12'),('2071-02-13'),('2071-02-14'),('2071-02-15'),('2071-02-16'),('2071-02-17'),('2071-02-18'),('2071-02-19'),('2071-02-20'),('2071-02-21'),('2071-02-22'),('2071-02-23'),('2071-02-24'),('2071-02-25'),('2071-02-26'),('2071-02-27'),('2071-02-28'),('2071-03-01'),('2071-03-02'),('2071-03-03'),('2071-03-04'),('2071-03-05'),('2071-03-06'),('2071-03-07'),('2071-03-08'),('2071-03-09'),('2071-03-10'),('2071-03-11'),('2071-03-12'),('2071-03-13'),('2071-03-14'),('2071-03-15'),('2071-03-16'),('2071-03-17'),('2071-03-18'),('2071-03-19'),('2071-03-20'),('2071-03-21'),('2071-03-22'),('2071-03-23'),('2071-03-24'),('2071-03-25'),('2071-03-26'),('2071-03-27'),('2071-03-28'),('2071-03-29'),('2071-03-30'),('2071-03-31'),('2071-04-01'),('2071-04-02'),('2071-04-03'),('2071-04-04'),('2071-04-05'),('2071-04-06'),('2071-04-07'),('2071-04-08'),('2071-04-09'),('2071-04-10'),('2071-04-11'),('2071-04-12'),('2071-04-13'),('2071-04-14'),('2071-04-15'),('2071-04-16'),('2071-04-17'),('2071-04-18'),('2071-04-19'),('2071-04-20'),('2071-04-21'),('2071-04-22'),('2071-04-23'),('2071-04-24'),('2071-04-25'),('2071-04-26'),('2071-04-27'),('2071-04-28'),('2071-04-29'),('2071-04-30'),('2071-05-01'),('2071-05-02'),('2071-05-03'),('2071-05-04'),('2071-05-05'),('2071-05-06'),('2071-05-07'),('2071-05-08'),('2071-05-09'),('2071-05-10'),('2071-05-11'),('2071-05-12'),('2071-05-13'),('2071-05-14'),('2071-05-15'),('2071-05-16'),('2071-05-17'),('2071-05-18'),('2071-05-19'),('2071-05-20'),('2071-05-21'),('2071-05-22'),('2071-05-23'),('2071-05-24'),('2071-05-25'),('2071-05-26'),('2071-05-27'),('2071-05-28'),('2071-05-29'),('2071-05-30'),('2071-05-31'),('2071-06-01'),('2071-06-02'),('2071-06-03'),('2071-06-04'),('2071-06-05'),('2071-06-06'),('2071-06-07'),('2071-06-08'),('2071-06-09'),('2071-06-10'),('2071-06-11'),('2071-06-12'),('2071-06-13'),('2071-06-14'),('2071-06-15'),('2071-06-16'),('2071-06-17'),('2071-06-18'),('2071-06-19'),('2071-06-20'),('2071-06-21'),('2071-06-22'),('2071-06-23'),('2071-06-24'),('2071-06-25'),('2071-06-26'),('2071-06-27'),('2071-06-28'),('2071-06-29'),('2071-06-30'),('2071-07-01'),('2071-07-02'),('2071-07-03'),('2071-07-04'),('2071-07-05'),('2071-07-06'),('2071-07-07'),('2071-07-08'),('2071-07-09'),('2071-07-10'),('2071-07-11'),('2071-07-12'),('2071-07-13'),('2071-07-14'),('2071-07-15'),('2071-07-16'),('2071-07-17'),('2071-07-18'),('2071-07-19'),('2071-07-20'),('2071-07-21'),('2071-07-22'),('2071-07-23'),('2071-07-24'),('2071-07-25'),('2071-07-26'),('2071-07-27'),('2071-07-28'),('2071-07-29'),('2071-07-30'),('2071-07-31'),('2071-08-01'),('2071-08-02'),('2071-08-03'),('2071-08-04'),('2071-08-05'),('2071-08-06'),('2071-08-07'),('2071-08-08'),('2071-08-09'),('2071-08-10'),('2071-08-11'),('2071-08-12'),('2071-08-13'),('2071-08-14'),('2071-08-15'),('2071-08-16'),('2071-08-17'),('2071-08-18'),('2071-08-19'),('2071-08-20'),('2071-08-21'),('2071-08-22'),('2071-08-23'),('2071-08-24'),('2071-08-25'),('2071-08-26'),('2071-08-27'),('2071-08-28'),('2071-08-29'),('2071-08-30'),('2071-08-31'),('2071-09-01'),('2071-09-02'),('2071-09-03'),('2071-09-04'),('2071-09-05'),('2071-09-06'),('2071-09-07'),('2071-09-08'),('2071-09-09'),('2071-09-10'),('2071-09-11'),('2071-09-12'),('2071-09-13'),('2071-09-14'),('2071-09-15'),('2071-09-16'),('2071-09-17'),('2071-09-18'),('2071-09-19'),('2071-09-20'),('2071-09-21'),('2071-09-22'),('2071-09-23'),('2071-09-24'),('2071-09-25'),('2071-09-26'),('2071-09-27'),('2071-09-28'),('2071-09-29'),('2071-09-30'),('2071-10-01'),('2071-10-02'),('2071-10-03'),('2071-10-04'),('2071-10-05'),('2071-10-06'),('2071-10-07'),('2071-10-08'),('2071-10-09'),('2071-10-10'),('2071-10-11'),('2071-10-12'),('2071-10-13'),('2071-10-14'),('2071-10-15'),('2071-10-16'),('2071-10-17'),('2071-10-18'),('2071-10-19'),('2071-10-20'),('2071-10-21'),('2071-10-22'),('2071-10-23'),('2071-10-24'),('2071-10-25'),('2071-10-26'),('2071-10-27'),('2071-10-28'),('2071-10-29'),('2071-10-30'),('2071-10-31'),('2071-11-01'),('2071-11-02'),('2071-11-03'),('2071-11-04'),('2071-11-05'),('2071-11-06'),('2071-11-07'),('2071-11-08'),('2071-11-09'),('2071-11-10'),('2071-11-11'),('2071-11-12'),('2071-11-13'),('2071-11-14'),('2071-11-15'),('2071-11-16'),('2071-11-17'),('2071-11-18'),('2071-11-19'),('2071-11-20'),('2071-11-21'),('2071-11-22'),('2071-11-23'),('2071-11-24'),('2071-11-25'),('2071-11-26'),('2071-11-27'),('2071-11-28'),('2071-11-29'),('2071-11-30'),('2071-12-01'),('2071-12-02'),('2071-12-03'),('2071-12-04'),('2071-12-05'),('2071-12-06'),('2071-12-07'),('2071-12-08'),('2071-12-09'),('2071-12-10'),('2071-12-11'),('2071-12-12'),('2071-12-13'),('2071-12-14'),('2071-12-15'),('2071-12-16'),('2071-12-17'),('2071-12-18'),('2071-12-19'),('2071-12-20'),('2071-12-21'),('2071-12-22'),('2071-12-23'),('2071-12-24'),('2071-12-25'),('2071-12-26'),('2071-12-27'),('2071-12-28'),('2071-12-29'),('2071-12-30'),('2071-12-31'),('2072-01-01'),('2072-01-02'),('2072-01-03'),('2072-01-04'),('2072-01-05'),('2072-01-06'),('2072-01-07'),('2072-01-08'),('2072-01-09'),('2072-01-10'),('2072-01-11'),('2072-01-12'),('2072-01-13'),('2072-01-14'),('2072-01-15'),('2072-01-16'),('2072-01-17'),('2072-01-18'),('2072-01-19'),('2072-01-20'),('2072-01-21'),('2072-01-22'),('2072-01-23'),('2072-01-24'),('2072-01-25'),('2072-01-26'),('2072-01-27'),('2072-01-28'),('2072-01-29'),('2072-01-30'),('2072-01-31'),('2072-02-01'),('2072-02-02'),('2072-02-03'),('2072-02-04'),('2072-02-05'),('2072-02-06'),('2072-02-07'),('2072-02-08'),('2072-02-09'),('2072-02-10'),('2072-02-11'),('2072-02-12'),('2072-02-13'),('2072-02-14'),('2072-02-15'),('2072-02-16'),('2072-02-17'),('2072-02-18'),('2072-02-19'),('2072-02-20'),('2072-02-21'),('2072-02-22'),('2072-02-23'),('2072-02-24'),('2072-02-25'),('2072-02-26'),('2072-02-27'),('2072-02-28'),('2072-02-29'),('2072-03-01'),('2072-03-02'),('2072-03-03'),('2072-03-04'),('2072-03-05'),('2072-03-06'),('2072-03-07'),('2072-03-08'),('2072-03-09'),('2072-03-10'),('2072-03-11'),('2072-03-12'),('2072-03-13'),('2072-03-14'),('2072-03-15'),('2072-03-16'),('2072-03-17'),('2072-03-18'),('2072-03-19'),('2072-03-20'),('2072-03-21'),('2072-03-22'),('2072-03-23'),('2072-03-24'),('2072-03-25'),('2072-03-26'),('2072-03-27'),('2072-03-28'),('2072-03-29'),('2072-03-30'),('2072-03-31'),('2072-04-01'),('2072-04-02'),('2072-04-03'),('2072-04-04'),('2072-04-05'),('2072-04-06'),('2072-04-07'),('2072-04-08'),('2072-04-09'),('2072-04-10'),('2072-04-11'),('2072-04-12'),('2072-04-13'),('2072-04-14'),('2072-04-15'),('2072-04-16'),('2072-04-17'),('2072-04-18'),('2072-04-19'),('2072-04-20'),('2072-04-21'),('2072-04-22'),('2072-04-23'),('2072-04-24'),('2072-04-25'),('2072-04-26'),('2072-04-27'),('2072-04-28'),('2072-04-29'),('2072-04-30'),('2072-05-01'),('2072-05-02'),('2072-05-03'),('2072-05-04'),('2072-05-05'),('2072-05-06'),('2072-05-07'),('2072-05-08'),('2072-05-09'),('2072-05-10'),('2072-05-11'),('2072-05-12'),('2072-05-13'),('2072-05-14'),('2072-05-15'),('2072-05-16'),('2072-05-17'),('2072-05-18'),('2072-05-19'),('2072-05-20'),('2072-05-21'),('2072-05-22'),('2072-05-23'),('2072-05-24'),('2072-05-25'),('2072-05-26'),('2072-05-27'),('2072-05-28'),('2072-05-29'),('2072-05-30'),('2072-05-31'),('2072-06-01'),('2072-06-02'),('2072-06-03'),('2072-06-04'),('2072-06-05'),('2072-06-06'),('2072-06-07'),('2072-06-08'),('2072-06-09'),('2072-06-10'),('2072-06-11'),('2072-06-12'),('2072-06-13'),('2072-06-14'),('2072-06-15'),('2072-06-16'),('2072-06-17'),('2072-06-18'),('2072-06-19'),('2072-06-20'),('2072-06-21'),('2072-06-22'),('2072-06-23'),('2072-06-24'),('2072-06-25'),('2072-06-26'),('2072-06-27'),('2072-06-28'),('2072-06-29'),('2072-06-30'),('2072-07-01'),('2072-07-02'),('2072-07-03'),('2072-07-04'),('2072-07-05'),('2072-07-06'),('2072-07-07'),('2072-07-08'),('2072-07-09'),('2072-07-10'),('2072-07-11'),('2072-07-12'),('2072-07-13'),('2072-07-14'),('2072-07-15'),('2072-07-16'),('2072-07-17'),('2072-07-18'),('2072-07-19'),('2072-07-20'),('2072-07-21'),('2072-07-22'),('2072-07-23'),('2072-07-24'),('2072-07-25'),('2072-07-26'),('2072-07-27'),('2072-07-28'),('2072-07-29'),('2072-07-30'),('2072-07-31'),('2072-08-01'),('2072-08-02'),('2072-08-03'),('2072-08-04'),('2072-08-05'),('2072-08-06'),('2072-08-07'),('2072-08-08'),('2072-08-09'),('2072-08-10'),('2072-08-11'),('2072-08-12'),('2072-08-13'),('2072-08-14'),('2072-08-15'),('2072-08-16'),('2072-08-17'),('2072-08-18'),('2072-08-19'),('2072-08-20'),('2072-08-21'),('2072-08-22'),('2072-08-23'),('2072-08-24'),('2072-08-25'),('2072-08-26'),('2072-08-27'),('2072-08-28'),('2072-08-29'),('2072-08-30'),('2072-08-31'),('2072-09-01'),('2072-09-02'),('2072-09-03'),('2072-09-04'),('2072-09-05'),('2072-09-06'),('2072-09-07'),('2072-09-08'),('2072-09-09'),('2072-09-10'),('2072-09-11'),('2072-09-12'),('2072-09-13'),('2072-09-14'),('2072-09-15'),('2072-09-16'),('2072-09-17'),('2072-09-18'),('2072-09-19'),('2072-09-20'),('2072-09-21'),('2072-09-22'),('2072-09-23'),('2072-09-24'),('2072-09-25'),('2072-09-26'),('2072-09-27'),('2072-09-28'),('2072-09-29'),('2072-09-30'),('2072-10-01'),('2072-10-02'),('2072-10-03'),('2072-10-04'),('2072-10-05'),('2072-10-06'),('2072-10-07'),('2072-10-08'),('2072-10-09'),('2072-10-10'),('2072-10-11'),('2072-10-12'),('2072-10-13'),('2072-10-14'),('2072-10-15'),('2072-10-16'),('2072-10-17'),('2072-10-18'),('2072-10-19'),('2072-10-20'),('2072-10-21'),('2072-10-22'),('2072-10-23'),('2072-10-24'),('2072-10-25'),('2072-10-26'),('2072-10-27'),('2072-10-28'),('2072-10-29'),('2072-10-30'),('2072-10-31'),('2072-11-01'),('2072-11-02'),('2072-11-03'),('2072-11-04'),('2072-11-05'),('2072-11-06'),('2072-11-07'),('2072-11-08'),('2072-11-09'),('2072-11-10'),('2072-11-11'),('2072-11-12'),('2072-11-13'),('2072-11-14'),('2072-11-15'),('2072-11-16'),('2072-11-17'),('2072-11-18'),('2072-11-19'),('2072-11-20'),('2072-11-21'),('2072-11-22'),('2072-11-23'),('2072-11-24'),('2072-11-25'),('2072-11-26'),('2072-11-27'),('2072-11-28'),('2072-11-29'),('2072-11-30'),('2072-12-01'),('2072-12-02'),('2072-12-03'),('2072-12-04'),('2072-12-05'),('2072-12-06'),('2072-12-07'),('2072-12-08'),('2072-12-09'),('2072-12-10'),('2072-12-11'),('2072-12-12'),('2072-12-13'),('2072-12-14'),('2072-12-15'),('2072-12-16'),('2072-12-17'),('2072-12-18'),('2072-12-19'),('2072-12-20'),('2072-12-21'),('2072-12-22'),('2072-12-23'),('2072-12-24'),('2072-12-25'),('2072-12-26'),('2072-12-27'),('2072-12-28'),('2072-12-29'),('2072-12-30'),('2072-12-31'),('2073-01-01'),('2073-01-02'),('2073-01-03'),('2073-01-04'),('2073-01-05'),('2073-01-06'),('2073-01-07'),('2073-01-08'),('2073-01-09'),('2073-01-10'),('2073-01-11'),('2073-01-12'),('2073-01-13'),('2073-01-14'),('2073-01-15'),('2073-01-16'),('2073-01-17'),('2073-01-18'),('2073-01-19'),('2073-01-20'),('2073-01-21'),('2073-01-22'),('2073-01-23'),('2073-01-24'),('2073-01-25'),('2073-01-26'),('2073-01-27'),('2073-01-28'),('2073-01-29'),('2073-01-30'),('2073-01-31'),('2073-02-01'),('2073-02-02'),('2073-02-03'),('2073-02-04'),('2073-02-05'),('2073-02-06'),('2073-02-07'),('2073-02-08'),('2073-02-09'),('2073-02-10'),('2073-02-11'),('2073-02-12'),('2073-02-13'),('2073-02-14'),('2073-02-15'),('2073-02-16'),('2073-02-17'),('2073-02-18'),('2073-02-19'),('2073-02-20'),('2073-02-21'),('2073-02-22'),('2073-02-23'),('2073-02-24'),('2073-02-25'),('2073-02-26'),('2073-02-27'),('2073-02-28'),('2073-03-01'),('2073-03-02'),('2073-03-03'),('2073-03-04'),('2073-03-05'),('2073-03-06'),('2073-03-07'),('2073-03-08'),('2073-03-09'),('2073-03-10'),('2073-03-11'),('2073-03-12'),('2073-03-13'),('2073-03-14'),('2073-03-15'),('2073-03-16'),('2073-03-17'),('2073-03-18'),('2073-03-19'),('2073-03-20'),('2073-03-21'),('2073-03-22'),('2073-03-23'),('2073-03-24'),('2073-03-25'),('2073-03-26'),('2073-03-27'),('2073-03-28'),('2073-03-29'),('2073-03-30'),('2073-03-31'),('2073-04-01'),('2073-04-02'),('2073-04-03'),('2073-04-04'),('2073-04-05'),('2073-04-06'),('2073-04-07'),('2073-04-08'),('2073-04-09'),('2073-04-10'),('2073-04-11'),('2073-04-12'),('2073-04-13'),('2073-04-14'),('2073-04-15'),('2073-04-16'),('2073-04-17'),('2073-04-18'),('2073-04-19'),('2073-04-20'),('2073-04-21'),('2073-04-22'),('2073-04-23'),('2073-04-24'),('2073-04-25'),('2073-04-26'),('2073-04-27'),('2073-04-28'),('2073-04-29'),('2073-04-30'),('2073-05-01'),('2073-05-02'),('2073-05-03'),('2073-05-04'),('2073-05-05'),('2073-05-06'),('2073-05-07'),('2073-05-08'),('2073-05-09'),('2073-05-10'),('2073-05-11'),('2073-05-12'),('2073-05-13'),('2073-05-14'),('2073-05-15'),('2073-05-16'),('2073-05-17'),('2073-05-18'),('2073-05-19'),('2073-05-20'),('2073-05-21'),('2073-05-22'),('2073-05-23'),('2073-05-24'),('2073-05-25'),('2073-05-26'),('2073-05-27'),('2073-05-28'),('2073-05-29'),('2073-05-30'),('2073-05-31'),('2073-06-01'),('2073-06-02'),('2073-06-03'),('2073-06-04'),('2073-06-05'),('2073-06-06'),('2073-06-07'),('2073-06-08'),('2073-06-09'),('2073-06-10'),('2073-06-11'),('2073-06-12'),('2073-06-13'),('2073-06-14'),('2073-06-15'),('2073-06-16'),('2073-06-17'),('2073-06-18'),('2073-06-19'),('2073-06-20'),('2073-06-21'),('2073-06-22'),('2073-06-23'),('2073-06-24'),('2073-06-25'),('2073-06-26'),('2073-06-27'),('2073-06-28'),('2073-06-29'),('2073-06-30'),('2073-07-01'),('2073-07-02'),('2073-07-03'),('2073-07-04'),('2073-07-05'),('2073-07-06'),('2073-07-07'),('2073-07-08'),('2073-07-09'),('2073-07-10'),('2073-07-11'),('2073-07-12'),('2073-07-13'),('2073-07-14'),('2073-07-15'),('2073-07-16'),('2073-07-17'),('2073-07-18'),('2073-07-19'),('2073-07-20'),('2073-07-21'),('2073-07-22'),('2073-07-23'),('2073-07-24'),('2073-07-25'),('2073-07-26'),('2073-07-27'),('2073-07-28'),('2073-07-29'),('2073-07-30'),('2073-07-31'),('2073-08-01'),('2073-08-02'),('2073-08-03'),('2073-08-04'),('2073-08-05'),('2073-08-06'),('2073-08-07'),('2073-08-08'),('2073-08-09'),('2073-08-10'),('2073-08-11'),('2073-08-12'),('2073-08-13'),('2073-08-14'),('2073-08-15'),('2073-08-16'),('2073-08-17'),('2073-08-18'),('2073-08-19'),('2073-08-20'),('2073-08-21'),('2073-08-22'),('2073-08-23'),('2073-08-24'),('2073-08-25'),('2073-08-26'),('2073-08-27'),('2073-08-28'),('2073-08-29'),('2073-08-30'),('2073-08-31'),('2073-09-01'),('2073-09-02'),('2073-09-03'),('2073-09-04'),('2073-09-05'),('2073-09-06'),('2073-09-07'),('2073-09-08'),('2073-09-09'),('2073-09-10'),('2073-09-11'),('2073-09-12'),('2073-09-13'),('2073-09-14'),('2073-09-15'),('2073-09-16'),('2073-09-17'),('2073-09-18'),('2073-09-19'),('2073-09-20'),('2073-09-21'),('2073-09-22'),('2073-09-23'),('2073-09-24'),('2073-09-25'),('2073-09-26'),('2073-09-27'),('2073-09-28'),('2073-09-29'),('2073-09-30'),('2073-10-01'),('2073-10-02'),('2073-10-03'),('2073-10-04'),('2073-10-05'),('2073-10-06'),('2073-10-07'),('2073-10-08'),('2073-10-09'),('2073-10-10'),('2073-10-11'),('2073-10-12'),('2073-10-13'),('2073-10-14'),('2073-10-15'),('2073-10-16'),('2073-10-17'),('2073-10-18'),('2073-10-19'),('2073-10-20'),('2073-10-21'),('2073-10-22'),('2073-10-23'),('2073-10-24'),('2073-10-25'),('2073-10-26'),('2073-10-27'),('2073-10-28'),('2073-10-29'),('2073-10-30'),('2073-10-31'),('2073-11-01'),('2073-11-02'),('2073-11-03'),('2073-11-04'),('2073-11-05'),('2073-11-06'),('2073-11-07'),('2073-11-08'),('2073-11-09'),('2073-11-10'),('2073-11-11'),('2073-11-12'),('2073-11-13'),('2073-11-14'),('2073-11-15'),('2073-11-16'),('2073-11-17'),('2073-11-18'),('2073-11-19'),('2073-11-20'),('2073-11-21'),('2073-11-22'),('2073-11-23'),('2073-11-24'),('2073-11-25'),('2073-11-26'),('2073-11-27'),('2073-11-28'),('2073-11-29'),('2073-11-30'),('2073-12-01'),('2073-12-02'),('2073-12-03'),('2073-12-04'),('2073-12-05'),('2073-12-06'),('2073-12-07'),('2073-12-08'),('2073-12-09'),('2073-12-10'),('2073-12-11'),('2073-12-12'),('2073-12-13'),('2073-12-14'),('2073-12-15'),('2073-12-16'),('2073-12-17'),('2073-12-18'),('2073-12-19'),('2073-12-20'),('2073-12-21'),('2073-12-22'),('2073-12-23'),('2073-12-24'),('2073-12-25'),('2073-12-26'),('2073-12-27'),('2073-12-28'),('2073-12-29'),('2073-12-30'),('2073-12-31'),('2074-01-01'),('2074-01-02'),('2074-01-03'),('2074-01-04'),('2074-01-05'),('2074-01-06'),('2074-01-07'),('2074-01-08'),('2074-01-09'),('2074-01-10'),('2074-01-11'),('2074-01-12'),('2074-01-13'),('2074-01-14'),('2074-01-15'),('2074-01-16'),('2074-01-17'),('2074-01-18'),('2074-01-19'),('2074-01-20'),('2074-01-21'),('2074-01-22'),('2074-01-23'),('2074-01-24'),('2074-01-25'),('2074-01-26'),('2074-01-27'),('2074-01-28'),('2074-01-29'),('2074-01-30'),('2074-01-31'),('2074-02-01'),('2074-02-02'),('2074-02-03'),('2074-02-04'),('2074-02-05'),('2074-02-06'),('2074-02-07'),('2074-02-08'),('2074-02-09'),('2074-02-10'),('2074-02-11'),('2074-02-12'),('2074-02-13'),('2074-02-14'),('2074-02-15'),('2074-02-16'),('2074-02-17'),('2074-02-18'),('2074-02-19'),('2074-02-20'),('2074-02-21'),('2074-02-22'),('2074-02-23'),('2074-02-24'),('2074-02-25'),('2074-02-26'),('2074-02-27'),('2074-02-28'),('2074-03-01'),('2074-03-02'),('2074-03-03'),('2074-03-04'),('2074-03-05'),('2074-03-06'),('2074-03-07'),('2074-03-08'),('2074-03-09'),('2074-03-10'),('2074-03-11'),('2074-03-12'),('2074-03-13'),('2074-03-14'),('2074-03-15'),('2074-03-16'),('2074-03-17'),('2074-03-18'),('2074-03-19'),('2074-03-20'),('2074-03-21'),('2074-03-22'),('2074-03-23'),('2074-03-24'),('2074-03-25'),('2074-03-26'),('2074-03-27'),('2074-03-28'),('2074-03-29'),('2074-03-30'),('2074-03-31'),('2074-04-01'),('2074-04-02'),('2074-04-03'),('2074-04-04'),('2074-04-05'),('2074-04-06'),('2074-04-07'),('2074-04-08'),('2074-04-09'),('2074-04-10'),('2074-04-11'),('2074-04-12'),('2074-04-13'),('2074-04-14'),('2074-04-15'),('2074-04-16'),('2074-04-17'),('2074-04-18'),('2074-04-19'),('2074-04-20'),('2074-04-21'),('2074-04-22'),('2074-04-23'),('2074-04-24'),('2074-04-25'),('2074-04-26'),('2074-04-27'),('2074-04-28'),('2074-04-29'),('2074-04-30'),('2074-05-01'),('2074-05-02'),('2074-05-03'),('2074-05-04'),('2074-05-05'),('2074-05-06'),('2074-05-07'),('2074-05-08'),('2074-05-09'),('2074-05-10'),('2074-05-11'),('2074-05-12'),('2074-05-13'),('2074-05-14'),('2074-05-15'),('2074-05-16'),('2074-05-17'),('2074-05-18'),('2074-05-19'),('2074-05-20'),('2074-05-21'),('2074-05-22'),('2074-05-23'),('2074-05-24'),('2074-05-25'),('2074-05-26'),('2074-05-27'),('2074-05-28'),('2074-05-29'),('2074-05-30'),('2074-05-31'),('2074-06-01'),('2074-06-02'),('2074-06-03'),('2074-06-04'),('2074-06-05'),('2074-06-06'),('2074-06-07'),('2074-06-08'),('2074-06-09'),('2074-06-10'),('2074-06-11'),('2074-06-12'),('2074-06-13'),('2074-06-14'),('2074-06-15'),('2074-06-16'),('2074-06-17'),('2074-06-18'),('2074-06-19'),('2074-06-20'),('2074-06-21'),('2074-06-22'),('2074-06-23'),('2074-06-24'),('2074-06-25'),('2074-06-26'),('2074-06-27'),('2074-06-28'),('2074-06-29'),('2074-06-30'),('2074-07-01'),('2074-07-02'),('2074-07-03'),('2074-07-04'),('2074-07-05'),('2074-07-06'),('2074-07-07'),('2074-07-08'),('2074-07-09'),('2074-07-10'),('2074-07-11'),('2074-07-12'),('2074-07-13'),('2074-07-14'),('2074-07-15'),('2074-07-16'),('2074-07-17'),('2074-07-18'),('2074-07-19'),('2074-07-20'),('2074-07-21'),('2074-07-22'),('2074-07-23'),('2074-07-24'),('2074-07-25'),('2074-07-26'),('2074-07-27'),('2074-07-28'),('2074-07-29'),('2074-07-30'),('2074-07-31'),('2074-08-01'),('2074-08-02'),('2074-08-03'),('2074-08-04'),('2074-08-05'),('2074-08-06'),('2074-08-07'),('2074-08-08'),('2074-08-09'),('2074-08-10'),('2074-08-11'),('2074-08-12'),('2074-08-13'),('2074-08-14'),('2074-08-15'),('2074-08-16'),('2074-08-17'),('2074-08-18'),('2074-08-19'),('2074-08-20'),('2074-08-21'),('2074-08-22'),('2074-08-23'),('2074-08-24'),('2074-08-25'),('2074-08-26'),('2074-08-27'),('2074-08-28'),('2074-08-29'),('2074-08-30'),('2074-08-31'),('2074-09-01'),('2074-09-02'),('2074-09-03'),('2074-09-04'),('2074-09-05'),('2074-09-06'),('2074-09-07'),('2074-09-08'),('2074-09-09'),('2074-09-10'),('2074-09-11'),('2074-09-12'),('2074-09-13'),('2074-09-14'),('2074-09-15'),('2074-09-16'),('2074-09-17'),('2074-09-18'),('2074-09-19'),('2074-09-20'),('2074-09-21'),('2074-09-22'),('2074-09-23'),('2074-09-24'),('2074-09-25'),('2074-09-26'),('2074-09-27'),('2074-09-28'),('2074-09-29'),('2074-09-30'),('2074-10-01'),('2074-10-02'),('2074-10-03'),('2074-10-04'),('2074-10-05'),('2074-10-06'),('2074-10-07'),('2074-10-08'),('2074-10-09'),('2074-10-10'),('2074-10-11'),('2074-10-12'),('2074-10-13'),('2074-10-14'),('2074-10-15'),('2074-10-16'),('2074-10-17'),('2074-10-18'),('2074-10-19'),('2074-10-20'),('2074-10-21'),('2074-10-22'),('2074-10-23'),('2074-10-24'),('2074-10-25'),('2074-10-26'),('2074-10-27'),('2074-10-28'),('2074-10-29'),('2074-10-30'),('2074-10-31'),('2074-11-01'),('2074-11-02'),('2074-11-03'),('2074-11-04'),('2074-11-05'),('2074-11-06'),('2074-11-07'),('2074-11-08'),('2074-11-09'),('2074-11-10'),('2074-11-11'),('2074-11-12'),('2074-11-13'),('2074-11-14'),('2074-11-15'),('2074-11-16'),('2074-11-17'),('2074-11-18'),('2074-11-19'),('2074-11-20'),('2074-11-21'),('2074-11-22'),('2074-11-23'),('2074-11-24'),('2074-11-25'),('2074-11-26'),('2074-11-27'),('2074-11-28'),('2074-11-29'),('2074-11-30'),('2074-12-01'),('2074-12-02'),('2074-12-03'),('2074-12-04'),('2074-12-05'),('2074-12-06'),('2074-12-07'),('2074-12-08'),('2074-12-09'),('2074-12-10'),('2074-12-11'),('2074-12-12'),('2074-12-13'),('2074-12-14'),('2074-12-15'),('2074-12-16'),('2074-12-17'),('2074-12-18'),('2074-12-19'),('2074-12-20'),('2074-12-21'),('2074-12-22'),('2074-12-23'),('2074-12-24'),('2074-12-25'),('2074-12-26'),('2074-12-27'),('2074-12-28'),('2074-12-29'),('2074-12-30'),('2074-12-31'),('2075-01-01'),('2075-01-02'),('2075-01-03'),('2075-01-04'),('2075-01-05'),('2075-01-06'),('2075-01-07'),('2075-01-08'),('2075-01-09'),('2075-01-10'),('2075-01-11'),('2075-01-12'),('2075-01-13'),('2075-01-14'),('2075-01-15'),('2075-01-16'),('2075-01-17'),('2075-01-18'),('2075-01-19'),('2075-01-20'),('2075-01-21'),('2075-01-22'),('2075-01-23'),('2075-01-24'),('2075-01-25'),('2075-01-26'),('2075-01-27'),('2075-01-28'),('2075-01-29'),('2075-01-30'),('2075-01-31'),('2075-02-01'),('2075-02-02'),('2075-02-03'),('2075-02-04'),('2075-02-05'),('2075-02-06'),('2075-02-07'),('2075-02-08'),('2075-02-09'),('2075-02-10'),('2075-02-11'),('2075-02-12'),('2075-02-13'),('2075-02-14'),('2075-02-15'),('2075-02-16'),('2075-02-17'),('2075-02-18'),('2075-02-19'),('2075-02-20'),('2075-02-21'),('2075-02-22'),('2075-02-23'),('2075-02-24'),('2075-02-25'),('2075-02-26'),('2075-02-27'),('2075-02-28'),('2075-03-01'),('2075-03-02'),('2075-03-03'),('2075-03-04'),('2075-03-05'),('2075-03-06'),('2075-03-07'),('2075-03-08'),('2075-03-09'),('2075-03-10'),('2075-03-11'),('2075-03-12'),('2075-03-13'),('2075-03-14'),('2075-03-15'),('2075-03-16'),('2075-03-17'),('2075-03-18'),('2075-03-19'),('2075-03-20'),('2075-03-21'),('2075-03-22'),('2075-03-23'),('2075-03-24'),('2075-03-25'),('2075-03-26'),('2075-03-27'),('2075-03-28'),('2075-03-29'),('2075-03-30'),('2075-03-31'),('2075-04-01'),('2075-04-02'),('2075-04-03'),('2075-04-04'),('2075-04-05'),('2075-04-06'),('2075-04-07'),('2075-04-08'),('2075-04-09'),('2075-04-10'),('2075-04-11'),('2075-04-12'),('2075-04-13'),('2075-04-14'),('2075-04-15'),('2075-04-16'),('2075-04-17'),('2075-04-18'),('2075-04-19'),('2075-04-20'),('2075-04-21'),('2075-04-22'),('2075-04-23'),('2075-04-24'),('2075-04-25'),('2075-04-26'),('2075-04-27'),('2075-04-28'),('2075-04-29'),('2075-04-30'),('2075-05-01'),('2075-05-02'),('2075-05-03'),('2075-05-04'),('2075-05-05'),('2075-05-06'),('2075-05-07'),('2075-05-08'),('2075-05-09'),('2075-05-10'),('2075-05-11'),('2075-05-12'),('2075-05-13'),('2075-05-14'),('2075-05-15'),('2075-05-16'),('2075-05-17'),('2075-05-18'),('2075-05-19'),('2075-05-20'),('2075-05-21'),('2075-05-22'),('2075-05-23'),('2075-05-24'),('2075-05-25'),('2075-05-26'),('2075-05-27'),('2075-05-28'),('2075-05-29'),('2075-05-30'),('2075-05-31'),('2075-06-01'),('2075-06-02'),('2075-06-03'),('2075-06-04'),('2075-06-05'),('2075-06-06'),('2075-06-07'),('2075-06-08'),('2075-06-09'),('2075-06-10'),('2075-06-11'),('2075-06-12'),('2075-06-13'),('2075-06-14'),('2075-06-15'),('2075-06-16'),('2075-06-17'),('2075-06-18'),('2075-06-19'),('2075-06-20'),('2075-06-21'),('2075-06-22'),('2075-06-23'),('2075-06-24'),('2075-06-25'),('2075-06-26'),('2075-06-27'),('2075-06-28'),('2075-06-29'),('2075-06-30'),('2075-07-01'),('2075-07-02'),('2075-07-03'),('2075-07-04'),('2075-07-05'),('2075-07-06'),('2075-07-07'),('2075-07-08'),('2075-07-09'),('2075-07-10'),('2075-07-11'),('2075-07-12'),('2075-07-13'),('2075-07-14'),('2075-07-15'),('2075-07-16'),('2075-07-17'),('2075-07-18'),('2075-07-19'),('2075-07-20'),('2075-07-21'),('2075-07-22'),('2075-07-23'),('2075-07-24'),('2075-07-25'),('2075-07-26'),('2075-07-27'),('2075-07-28'),('2075-07-29'),('2075-07-30'),('2075-07-31'),('2075-08-01'),('2075-08-02'),('2075-08-03'),('2075-08-04'),('2075-08-05'),('2075-08-06'),('2075-08-07'),('2075-08-08'),('2075-08-09'),('2075-08-10'),('2075-08-11'),('2075-08-12'),('2075-08-13'),('2075-08-14'),('2075-08-15'),('2075-08-16'),('2075-08-17'),('2075-08-18'),('2075-08-19'),('2075-08-20'),('2075-08-21'),('2075-08-22'),('2075-08-23'),('2075-08-24'),('2075-08-25'),('2075-08-26'),('2075-08-27'),('2075-08-28'),('2075-08-29'),('2075-08-30'),('2075-08-31'),('2075-09-01'),('2075-09-02'),('2075-09-03'),('2075-09-04'),('2075-09-05'),('2075-09-06'),('2075-09-07'),('2075-09-08'),('2075-09-09'),('2075-09-10'),('2075-09-11'),('2075-09-12'),('2075-09-13'),('2075-09-14'),('2075-09-15'),('2075-09-16'),('2075-09-17'),('2075-09-18'),('2075-09-19'),('2075-09-20'),('2075-09-21'),('2075-09-22'),('2075-09-23'),('2075-09-24'),('2075-09-25'),('2075-09-26'),('2075-09-27'),('2075-09-28'),('2075-09-29'),('2075-09-30'),('2075-10-01'),('2075-10-02'),('2075-10-03'),('2075-10-04'),('2075-10-05'),('2075-10-06'),('2075-10-07'),('2075-10-08'),('2075-10-09'),('2075-10-10'),('2075-10-11'),('2075-10-12'),('2075-10-13'),('2075-10-14'),('2075-10-15'),('2075-10-16'),('2075-10-17'),('2075-10-18'),('2075-10-19'),('2075-10-20'),('2075-10-21'),('2075-10-22'),('2075-10-23'),('2075-10-24'),('2075-10-25'),('2075-10-26'),('2075-10-27'),('2075-10-28'),('2075-10-29'),('2075-10-30'),('2075-10-31'),('2075-11-01'),('2075-11-02'),('2075-11-03'),('2075-11-04'),('2075-11-05'),('2075-11-06'),('2075-11-07'),('2075-11-08'),('2075-11-09'),('2075-11-10'),('2075-11-11'),('2075-11-12'),('2075-11-13'),('2075-11-14'),('2075-11-15'),('2075-11-16'),('2075-11-17'),('2075-11-18'),('2075-11-19'),('2075-11-20'),('2075-11-21'),('2075-11-22'),('2075-11-23'),('2075-11-24'),('2075-11-25'),('2075-11-26'),('2075-11-27'),('2075-11-28'),('2075-11-29'),('2075-11-30'),('2075-12-01'),('2075-12-02'),('2075-12-03'),('2075-12-04'),('2075-12-05'),('2075-12-06'),('2075-12-07'),('2075-12-08'),('2075-12-09'),('2075-12-10'),('2075-12-11'),('2075-12-12'),('2075-12-13'),('2075-12-14'),('2075-12-15'),('2075-12-16'),('2075-12-17'),('2075-12-18'),('2075-12-19'),('2075-12-20'),('2075-12-21'),('2075-12-22'),('2075-12-23'),('2075-12-24'),('2075-12-25'),('2075-12-26'),('2075-12-27'),('2075-12-28'),('2075-12-29'),('2075-12-30'),('2075-12-31'),('2076-01-01'),('2076-01-02'),('2076-01-03'),('2076-01-04'),('2076-01-05'),('2076-01-06'),('2076-01-07'),('2076-01-08'),('2076-01-09'),('2076-01-10'),('2076-01-11'),('2076-01-12'),('2076-01-13'),('2076-01-14'),('2076-01-15'),('2076-01-16'),('2076-01-17'),('2076-01-18'),('2076-01-19'),('2076-01-20'),('2076-01-21'),('2076-01-22'),('2076-01-23'),('2076-01-24'),('2076-01-25'),('2076-01-26'),('2076-01-27'),('2076-01-28'),('2076-01-29'),('2076-01-30'),('2076-01-31'),('2076-02-01'),('2076-02-02'),('2076-02-03'),('2076-02-04'),('2076-02-05'),('2076-02-06'),('2076-02-07'),('2076-02-08'),('2076-02-09'),('2076-02-10'),('2076-02-11'),('2076-02-12'),('2076-02-13'),('2076-02-14'),('2076-02-15'),('2076-02-16'),('2076-02-17'),('2076-02-18'),('2076-02-19'),('2076-02-20'),('2076-02-21'),('2076-02-22'),('2076-02-23'),('2076-02-24'),('2076-02-25'),('2076-02-26'),('2076-02-27'),('2076-02-28'),('2076-02-29'),('2076-03-01'),('2076-03-02'),('2076-03-03'),('2076-03-04'),('2076-03-05'),('2076-03-06'),('2076-03-07'),('2076-03-08'),('2076-03-09'),('2076-03-10'),('2076-03-11'),('2076-03-12'),('2076-03-13'),('2076-03-14'),('2076-03-15'),('2076-03-16'),('2076-03-17'),('2076-03-18'),('2076-03-19'),('2076-03-20'),('2076-03-21'),('2076-03-22'),('2076-03-23'),('2076-03-24'),('2076-03-25'),('2076-03-26'),('2076-03-27'),('2076-03-28'),('2076-03-29'),('2076-03-30'),('2076-03-31'),('2076-04-01'),('2076-04-02'),('2076-04-03'),('2076-04-04'),('2076-04-05'),('2076-04-06'),('2076-04-07'),('2076-04-08'),('2076-04-09'),('2076-04-10'),('2076-04-11'),('2076-04-12'),('2076-04-13'),('2076-04-14'),('2076-04-15'),('2076-04-16'),('2076-04-17'),('2076-04-18'),('2076-04-19'),('2076-04-20'),('2076-04-21'),('2076-04-22'),('2076-04-23'),('2076-04-24'),('2076-04-25'),('2076-04-26'),('2076-04-27'),('2076-04-28'),('2076-04-29'),('2076-04-30'),('2076-05-01'),('2076-05-02'),('2076-05-03'),('2076-05-04'),('2076-05-05'),('2076-05-06'),('2076-05-07'),('2076-05-08'),('2076-05-09'),('2076-05-10'),('2076-05-11'),('2076-05-12'),('2076-05-13'),('2076-05-14'),('2076-05-15'),('2076-05-16'),('2076-05-17'),('2076-05-18'),('2076-05-19'),('2076-05-20'),('2076-05-21'),('2076-05-22'),('2076-05-23'),('2076-05-24'),('2076-05-25'),('2076-05-26'),('2076-05-27'),('2076-05-28'),('2076-05-29'),('2076-05-30'),('2076-05-31'),('2076-06-01'),('2076-06-02'),('2076-06-03'),('2076-06-04'),('2076-06-05'),('2076-06-06'),('2076-06-07'),('2076-06-08'),('2076-06-09'),('2076-06-10'),('2076-06-11'),('2076-06-12'),('2076-06-13'),('2076-06-14'),('2076-06-15'),('2076-06-16'),('2076-06-17'),('2076-06-18'),('2076-06-19'),('2076-06-20'),('2076-06-21'),('2076-06-22'),('2076-06-23'),('2076-06-24'),('2076-06-25'),('2076-06-26'),('2076-06-27'),('2076-06-28'),('2076-06-29'),('2076-06-30'),('2076-07-01'),('2076-07-02'),('2076-07-03'),('2076-07-04'),('2076-07-05'),('2076-07-06'),('2076-07-07'),('2076-07-08'),('2076-07-09'),('2076-07-10'),('2076-07-11'),('2076-07-12'),('2076-07-13'),('2076-07-14'),('2076-07-15'),('2076-07-16'),('2076-07-17'),('2076-07-18'),('2076-07-19'),('2076-07-20'),('2076-07-21'),('2076-07-22'),('2076-07-23'),('2076-07-24'),('2076-07-25'),('2076-07-26'),('2076-07-27'),('2076-07-28'),('2076-07-29'),('2076-07-30'),('2076-07-31'),('2076-08-01'),('2076-08-02'),('2076-08-03'),('2076-08-04'),('2076-08-05'),('2076-08-06'),('2076-08-07'),('2076-08-08'),('2076-08-09'),('2076-08-10'),('2076-08-11'),('2076-08-12'),('2076-08-13'),('2076-08-14'),('2076-08-15'),('2076-08-16'),('2076-08-17'),('2076-08-18'),('2076-08-19'),('2076-08-20'),('2076-08-21'),('2076-08-22'),('2076-08-23'),('2076-08-24'),('2076-08-25'),('2076-08-26'),('2076-08-27'),('2076-08-28'),('2076-08-29'),('2076-08-30'),('2076-08-31'),('2076-09-01'),('2076-09-02'),('2076-09-03'),('2076-09-04'),('2076-09-05'),('2076-09-06'),('2076-09-07'),('2076-09-08'),('2076-09-09'),('2076-09-10'),('2076-09-11'),('2076-09-12'),('2076-09-13'),('2076-09-14'),('2076-09-15'),('2076-09-16'),('2076-09-17'),('2076-09-18'),('2076-09-19'),('2076-09-20'),('2076-09-21'),('2076-09-22'),('2076-09-23'),('2076-09-24'),('2076-09-25'),('2076-09-26'),('2076-09-27'),('2076-09-28'),('2076-09-29'),('2076-09-30'),('2076-10-01'),('2076-10-02'),('2076-10-03'),('2076-10-04'),('2076-10-05'),('2076-10-06'),('2076-10-07'),('2076-10-08'),('2076-10-09'),('2076-10-10'),('2076-10-11'),('2076-10-12'),('2076-10-13'),('2076-10-14'),('2076-10-15'),('2076-10-16'),('2076-10-17'),('2076-10-18'),('2076-10-19'),('2076-10-20'),('2076-10-21'),('2076-10-22'),('2076-10-23'),('2076-10-24'),('2076-10-25'),('2076-10-26'),('2076-10-27'),('2076-10-28'),('2076-10-29'),('2076-10-30'),('2076-10-31'),('2076-11-01'),('2076-11-02'),('2076-11-03'),('2076-11-04'),('2076-11-05'),('2076-11-06'),('2076-11-07'),('2076-11-08'),('2076-11-09'),('2076-11-10'),('2076-11-11'),('2076-11-12'),('2076-11-13'),('2076-11-14'),('2076-11-15'),('2076-11-16'),('2076-11-17'),('2076-11-18'),('2076-11-19'),('2076-11-20'),('2076-11-21'),('2076-11-22'),('2076-11-23'),('2076-11-24'),('2076-11-25'),('2076-11-26'),('2076-11-27'),('2076-11-28'),('2076-11-29'),('2076-11-30'),('2076-12-01'),('2076-12-02'),('2076-12-03'),('2076-12-04'),('2076-12-05'),('2076-12-06'),('2076-12-07'),('2076-12-08'),('2076-12-09'),('2076-12-10'),('2076-12-11'),('2076-12-12'),('2076-12-13'),('2076-12-14'),('2076-12-15'),('2076-12-16'),('2076-12-17'),('2076-12-18'),('2076-12-19'),('2076-12-20'),('2076-12-21'),('2076-12-22'),('2076-12-23'),('2076-12-24'),('2076-12-25'),('2076-12-26'),('2076-12-27'),('2076-12-28'),('2076-12-29'),('2076-12-30'),('2076-12-31'),('2077-01-01'),('2077-01-02'),('2077-01-03'),('2077-01-04'),('2077-01-05'),('2077-01-06'),('2077-01-07'),('2077-01-08'),('2077-01-09'),('2077-01-10'),('2077-01-11'),('2077-01-12'),('2077-01-13'),('2077-01-14'),('2077-01-15'),('2077-01-16'),('2077-01-17'),('2077-01-18'),('2077-01-19'),('2077-01-20'),('2077-01-21'),('2077-01-22'),('2077-01-23'),('2077-01-24'),('2077-01-25'),('2077-01-26'),('2077-01-27'),('2077-01-28'),('2077-01-29'),('2077-01-30'),('2077-01-31'),('2077-02-01'),('2077-02-02'),('2077-02-03'),('2077-02-04'),('2077-02-05'),('2077-02-06'),('2077-02-07'),('2077-02-08'),('2077-02-09'),('2077-02-10'),('2077-02-11'),('2077-02-12'),('2077-02-13'),('2077-02-14'),('2077-02-15'),('2077-02-16'),('2077-02-17'),('2077-02-18'),('2077-02-19'),('2077-02-20'),('2077-02-21'),('2077-02-22'),('2077-02-23'),('2077-02-24'),('2077-02-25'),('2077-02-26'),('2077-02-27'),('2077-02-28'),('2077-03-01'),('2077-03-02'),('2077-03-03'),('2077-03-04'),('2077-03-05'),('2077-03-06'),('2077-03-07'),('2077-03-08'),('2077-03-09'),('2077-03-10'),('2077-03-11'),('2077-03-12'),('2077-03-13'),('2077-03-14'),('2077-03-15'),('2077-03-16'),('2077-03-17'),('2077-03-18'),('2077-03-19'),('2077-03-20'),('2077-03-21'),('2077-03-22'),('2077-03-23'),('2077-03-24'),('2077-03-25'),('2077-03-26'),('2077-03-27'),('2077-03-28'),('2077-03-29'),('2077-03-30'),('2077-03-31'),('2077-04-01'),('2077-04-02'),('2077-04-03'),('2077-04-04'),('2077-04-05'),('2077-04-06'),('2077-04-07'),('2077-04-08'),('2077-04-09'),('2077-04-10'),('2077-04-11'),('2077-04-12'),('2077-04-13'),('2077-04-14'),('2077-04-15'),('2077-04-16'),('2077-04-17'),('2077-04-18'),('2077-04-19'),('2077-04-20'),('2077-04-21'),('2077-04-22'),('2077-04-23'),('2077-04-24'),('2077-04-25'),('2077-04-26'),('2077-04-27'),('2077-04-28'),('2077-04-29'),('2077-04-30'),('2077-05-01'),('2077-05-02'),('2077-05-03'),('2077-05-04'),('2077-05-05'),('2077-05-06'),('2077-05-07'),('2077-05-08'),('2077-05-09'),('2077-05-10'),('2077-05-11'),('2077-05-12'),('2077-05-13'),('2077-05-14'),('2077-05-15'),('2077-05-16'),('2077-05-17'),('2077-05-18'),('2077-05-19'),('2077-05-20'),('2077-05-21'),('2077-05-22'),('2077-05-23'),('2077-05-24'),('2077-05-25'),('2077-05-26'),('2077-05-27'),('2077-05-28'),('2077-05-29'),('2077-05-30'),('2077-05-31'),('2077-06-01'),('2077-06-02'),('2077-06-03'),('2077-06-04'),('2077-06-05'),('2077-06-06'),('2077-06-07'),('2077-06-08'),('2077-06-09'),('2077-06-10'),('2077-06-11'),('2077-06-12'),('2077-06-13'),('2077-06-14'),('2077-06-15'),('2077-06-16'),('2077-06-17'),('2077-06-18'),('2077-06-19'),('2077-06-20'),('2077-06-21'),('2077-06-22'),('2077-06-23'),('2077-06-24'),('2077-06-25'),('2077-06-26'),('2077-06-27'),('2077-06-28'),('2077-06-29'),('2077-06-30'),('2077-07-01'),('2077-07-02'),('2077-07-03'),('2077-07-04'),('2077-07-05'),('2077-07-06'),('2077-07-07'),('2077-07-08'),('2077-07-09'),('2077-07-10'),('2077-07-11'),('2077-07-12'),('2077-07-13'),('2077-07-14'),('2077-07-15'),('2077-07-16'),('2077-07-17'),('2077-07-18'),('2077-07-19'),('2077-07-20'),('2077-07-21'),('2077-07-22'),('2077-07-23'),('2077-07-24'),('2077-07-25'),('2077-07-26'),('2077-07-27'),('2077-07-28'),('2077-07-29'),('2077-07-30'),('2077-07-31'),('2077-08-01'),('2077-08-02'),('2077-08-03'),('2077-08-04'),('2077-08-05'),('2077-08-06'),('2077-08-07'),('2077-08-08'),('2077-08-09'),('2077-08-10'),('2077-08-11'),('2077-08-12'),('2077-08-13'),('2077-08-14'),('2077-08-15'),('2077-08-16'),('2077-08-17'),('2077-08-18'),('2077-08-19'),('2077-08-20'),('2077-08-21'),('2077-08-22'),('2077-08-23'),('2077-08-24'),('2077-08-25'),('2077-08-26'),('2077-08-27'),('2077-08-28'),('2077-08-29'),('2077-08-30'),('2077-08-31'),('2077-09-01'),('2077-09-02'),('2077-09-03'),('2077-09-04'),('2077-09-05'),('2077-09-06'),('2077-09-07'),('2077-09-08'),('2077-09-09'),('2077-09-10'),('2077-09-11'),('2077-09-12'),('2077-09-13'),('2077-09-14'),('2077-09-15'),('2077-09-16'),('2077-09-17'),('2077-09-18'),('2077-09-19'),('2077-09-20'),('2077-09-21'),('2077-09-22'),('2077-09-23'),('2077-09-24'),('2077-09-25'),('2077-09-26'),('2077-09-27'),('2077-09-28'),('2077-09-29'),('2077-09-30'),('2077-10-01'),('2077-10-02'),('2077-10-03'),('2077-10-04'),('2077-10-05'),('2077-10-06'),('2077-10-07'),('2077-10-08'),('2077-10-09'),('2077-10-10'),('2077-10-11'),('2077-10-12'),('2077-10-13'),('2077-10-14'),('2077-10-15'),('2077-10-16'),('2077-10-17'),('2077-10-18'),('2077-10-19'),('2077-10-20'),('2077-10-21'),('2077-10-22'),('2077-10-23'),('2077-10-24'),('2077-10-25'),('2077-10-26'),('2077-10-27'),('2077-10-28'),('2077-10-29'),('2077-10-30'),('2077-10-31'),('2077-11-01'),('2077-11-02'),('2077-11-03'),('2077-11-04'),('2077-11-05'),('2077-11-06'),('2077-11-07'),('2077-11-08'),('2077-11-09'),('2077-11-10'),('2077-11-11'),('2077-11-12'),('2077-11-13'),('2077-11-14'),('2077-11-15'),('2077-11-16'),('2077-11-17'),('2077-11-18'),('2077-11-19'),('2077-11-20'),('2077-11-21'),('2077-11-22'),('2077-11-23'),('2077-11-24'),('2077-11-25'),('2077-11-26'),('2077-11-27'),('2077-11-28'),('2077-11-29'),('2077-11-30'),('2077-12-01'),('2077-12-02'),('2077-12-03'),('2077-12-04'),('2077-12-05'),('2077-12-06'),('2077-12-07'),('2077-12-08'),('2077-12-09'),('2077-12-10'),('2077-12-11'),('2077-12-12'),('2077-12-13'),('2077-12-14'),('2077-12-15'),('2077-12-16'),('2077-12-17'),('2077-12-18'),('2077-12-19'),('2077-12-20'),('2077-12-21'),('2077-12-22'),('2077-12-23'),('2077-12-24'),('2077-12-25'),('2077-12-26'),('2077-12-27'),('2077-12-28'),('2077-12-29'),('2077-12-30'),('2077-12-31'),('2078-01-01'),('2078-01-02'),('2078-01-03'),('2078-01-04'),('2078-01-05'),('2078-01-06'),('2078-01-07'),('2078-01-08'),('2078-01-09'),('2078-01-10'),('2078-01-11'),('2078-01-12'),('2078-01-13'),('2078-01-14'),('2078-01-15'),('2078-01-16'),('2078-01-17'),('2078-01-18'),('2078-01-19'),('2078-01-20'),('2078-01-21'),('2078-01-22'),('2078-01-23'),('2078-01-24'),('2078-01-25'),('2078-01-26'),('2078-01-27'),('2078-01-28'),('2078-01-29'),('2078-01-30'),('2078-01-31'),('2078-02-01'),('2078-02-02'),('2078-02-03'),('2078-02-04'),('2078-02-05'),('2078-02-06'),('2078-02-07'),('2078-02-08'),('2078-02-09'),('2078-02-10'),('2078-02-11'),('2078-02-12'),('2078-02-13'),('2078-02-14'),('2078-02-15'),('2078-02-16'),('2078-02-17'),('2078-02-18'),('2078-02-19'),('2078-02-20'),('2078-02-21'),('2078-02-22'),('2078-02-23'),('2078-02-24'),('2078-02-25'),('2078-02-26'),('2078-02-27'),('2078-02-28'),('2078-03-01'),('2078-03-02'),('2078-03-03'),('2078-03-04'),('2078-03-05'),('2078-03-06'),('2078-03-07'),('2078-03-08'),('2078-03-09'),('2078-03-10'),('2078-03-11'),('2078-03-12'),('2078-03-13'),('2078-03-14'),('2078-03-15'),('2078-03-16'),('2078-03-17'),('2078-03-18'),('2078-03-19'),('2078-03-20'),('2078-03-21'),('2078-03-22'),('2078-03-23'),('2078-03-24'),('2078-03-25'),('2078-03-26'),('2078-03-27'),('2078-03-28'),('2078-03-29'),('2078-03-30'),('2078-03-31'),('2078-04-01'),('2078-04-02'),('2078-04-03'),('2078-04-04'),('2078-04-05'),('2078-04-06'),('2078-04-07'),('2078-04-08'),('2078-04-09'),('2078-04-10'),('2078-04-11'),('2078-04-12'),('2078-04-13'),('2078-04-14'),('2078-04-15'),('2078-04-16'),('2078-04-17'),('2078-04-18'),('2078-04-19'),('2078-04-20'),('2078-04-21'),('2078-04-22'),('2078-04-23'),('2078-04-24'),('2078-04-25'),('2078-04-26'),('2078-04-27'),('2078-04-28'),('2078-04-29'),('2078-04-30'),('2078-05-01'),('2078-05-02'),('2078-05-03'),('2078-05-04'),('2078-05-05'),('2078-05-06'),('2078-05-07'),('2078-05-08'),('2078-05-09'),('2078-05-10'),('2078-05-11'),('2078-05-12'),('2078-05-13'),('2078-05-14'),('2078-05-15'),('2078-05-16'),('2078-05-17'),('2078-05-18'),('2078-05-19'),('2078-05-20'),('2078-05-21'),('2078-05-22'),('2078-05-23'),('2078-05-24'),('2078-05-25'),('2078-05-26'),('2078-05-27'),('2078-05-28'),('2078-05-29'),('2078-05-30'),('2078-05-31'),('2078-06-01'),('2078-06-02'),('2078-06-03'),('2078-06-04'),('2078-06-05'),('2078-06-06'),('2078-06-07'),('2078-06-08'),('2078-06-09'),('2078-06-10'),('2078-06-11'),('2078-06-12'),('2078-06-13'),('2078-06-14'),('2078-06-15'),('2078-06-16'),('2078-06-17'),('2078-06-18'),('2078-06-19'),('2078-06-20'),('2078-06-21'),('2078-06-22'),('2078-06-23'),('2078-06-24'),('2078-06-25'),('2078-06-26'),('2078-06-27'),('2078-06-28'),('2078-06-29'),('2078-06-30'),('2078-07-01'),('2078-07-02'),('2078-07-03'),('2078-07-04'),('2078-07-05'),('2078-07-06'),('2078-07-07'),('2078-07-08'),('2078-07-09'),('2078-07-10'),('2078-07-11'),('2078-07-12'),('2078-07-13'),('2078-07-14'),('2078-07-15'),('2078-07-16'),('2078-07-17'),('2078-07-18'),('2078-07-19'),('2078-07-20'),('2078-07-21'),('2078-07-22'),('2078-07-23'),('2078-07-24'),('2078-07-25'),('2078-07-26'),('2078-07-27'),('2078-07-28'),('2078-07-29'),('2078-07-30'),('2078-07-31'),('2078-08-01'),('2078-08-02'),('2078-08-03'),('2078-08-04'),('2078-08-05'),('2078-08-06'),('2078-08-07'),('2078-08-08'),('2078-08-09'),('2078-08-10'),('2078-08-11'),('2078-08-12'),('2078-08-13'),('2078-08-14'),('2078-08-15'),('2078-08-16'),('2078-08-17'),('2078-08-18'),('2078-08-19'),('2078-08-20'),('2078-08-21'),('2078-08-22'),('2078-08-23'),('2078-08-24'),('2078-08-25'),('2078-08-26'),('2078-08-27'),('2078-08-28'),('2078-08-29'),('2078-08-30'),('2078-08-31'),('2078-09-01'),('2078-09-02'),('2078-09-03'),('2078-09-04'),('2078-09-05'),('2078-09-06'),('2078-09-07'),('2078-09-08'),('2078-09-09'),('2078-09-10'),('2078-09-11'),('2078-09-12'),('2078-09-13'),('2078-09-14'),('2078-09-15'),('2078-09-16'),('2078-09-17'),('2078-09-18'),('2078-09-19'),('2078-09-20'),('2078-09-21'),('2078-09-22'),('2078-09-23'),('2078-09-24'),('2078-09-25'),('2078-09-26'),('2078-09-27'),('2078-09-28'),('2078-09-29'),('2078-09-30'),('2078-10-01'),('2078-10-02'),('2078-10-03'),('2078-10-04'),('2078-10-05'),('2078-10-06'),('2078-10-07'),('2078-10-08'),('2078-10-09'),('2078-10-10'),('2078-10-11'),('2078-10-12'),('2078-10-13'),('2078-10-14'),('2078-10-15'),('2078-10-16'),('2078-10-17'),('2078-10-18'),('2078-10-19'),('2078-10-20'),('2078-10-21'),('2078-10-22'),('2078-10-23'),('2078-10-24'),('2078-10-25'),('2078-10-26'),('2078-10-27'),('2078-10-28'),('2078-10-29'),('2078-10-30'),('2078-10-31'),('2078-11-01'),('2078-11-02'),('2078-11-03'),('2078-11-04'),('2078-11-05'),('2078-11-06'),('2078-11-07'),('2078-11-08'),('2078-11-09'),('2078-11-10'),('2078-11-11'),('2078-11-12'),('2078-11-13'),('2078-11-14'),('2078-11-15'),('2078-11-16'),('2078-11-17'),('2078-11-18'),('2078-11-19'),('2078-11-20'),('2078-11-21'),('2078-11-22'),('2078-11-23'),('2078-11-24'),('2078-11-25'),('2078-11-26'),('2078-11-27'),('2078-11-28'),('2078-11-29'),('2078-11-30'),('2078-12-01'),('2078-12-02'),('2078-12-03'),('2078-12-04'),('2078-12-05'),('2078-12-06'),('2078-12-07'),('2078-12-08'),('2078-12-09'),('2078-12-10'),('2078-12-11'),('2078-12-12'),('2078-12-13'),('2078-12-14'),('2078-12-15'),('2078-12-16'),('2078-12-17'),('2078-12-18'),('2078-12-19'),('2078-12-20'),('2078-12-21'),('2078-12-22'),('2078-12-23'),('2078-12-24'),('2078-12-25'),('2078-12-26'),('2078-12-27'),('2078-12-28'),('2078-12-29'),('2078-12-30'),('2078-12-31'),('2079-01-01'),('2079-01-02'),('2079-01-03'),('2079-01-04'),('2079-01-05'),('2079-01-06'),('2079-01-07'),('2079-01-08'),('2079-01-09'),('2079-01-10'),('2079-01-11'),('2079-01-12'),('2079-01-13'),('2079-01-14'),('2079-01-15'),('2079-01-16'),('2079-01-17'),('2079-01-18'),('2079-01-19'),('2079-01-20'),('2079-01-21'),('2079-01-22'),('2079-01-23'),('2079-01-24'),('2079-01-25'),('2079-01-26'),('2079-01-27'),('2079-01-28'),('2079-01-29'),('2079-01-30'),('2079-01-31'),('2079-02-01'),('2079-02-02'),('2079-02-03'),('2079-02-04'),('2079-02-05'),('2079-02-06'),('2079-02-07'),('2079-02-08'),('2079-02-09'),('2079-02-10'),('2079-02-11'),('2079-02-12'),('2079-02-13'),('2079-02-14'),('2079-02-15'),('2079-02-16'),('2079-02-17'),('2079-02-18'),('2079-02-19'),('2079-02-20'),('2079-02-21'),('2079-02-22'),('2079-02-23'),('2079-02-24'),('2079-02-25'),('2079-02-26'),('2079-02-27'),('2079-02-28'),('2079-03-01'),('2079-03-02'),('2079-03-03'),('2079-03-04'),('2079-03-05'),('2079-03-06'),('2079-03-07'),('2079-03-08'),('2079-03-09'),('2079-03-10'),('2079-03-11'),('2079-03-12'),('2079-03-13'),('2079-03-14'),('2079-03-15'),('2079-03-16'),('2079-03-17'),('2079-03-18'),('2079-03-19'),('2079-03-20'),('2079-03-21'),('2079-03-22'),('2079-03-23'),('2079-03-24'),('2079-03-25'),('2079-03-26'),('2079-03-27'),('2079-03-28'),('2079-03-29'),('2079-03-30'),('2079-03-31'),('2079-04-01'),('2079-04-02'),('2079-04-03'),('2079-04-04'),('2079-04-05'),('2079-04-06'),('2079-04-07'),('2079-04-08'),('2079-04-09'),('2079-04-10'),('2079-04-11'),('2079-04-12'),('2079-04-13'),('2079-04-14'),('2079-04-15'),('2079-04-16'),('2079-04-17'),('2079-04-18'),('2079-04-19'),('2079-04-20'),('2079-04-21'),('2079-04-22'),('2079-04-23'),('2079-04-24'),('2079-04-25'),('2079-04-26'),('2079-04-27'),('2079-04-28'),('2079-04-29'),('2079-04-30'),('2079-05-01'),('2079-05-02'),('2079-05-03'),('2079-05-04'),('2079-05-05'),('2079-05-06'),('2079-05-07'),('2079-05-08'),('2079-05-09'),('2079-05-10'),('2079-05-11'),('2079-05-12'),('2079-05-13'),('2079-05-14'),('2079-05-15'),('2079-05-16'),('2079-05-17'),('2079-05-18'),('2079-05-19'),('2079-05-20'),('2079-05-21'),('2079-05-22'),('2079-05-23'),('2079-05-24'),('2079-05-25'),('2079-05-26'),('2079-05-27'),('2079-05-28'),('2079-05-29'),('2079-05-30'),('2079-05-31'),('2079-06-01'),('2079-06-02'),('2079-06-03'),('2079-06-04'),('2079-06-05'),('2079-06-06'),('2079-06-07'),('2079-06-08'),('2079-06-09'),('2079-06-10'),('2079-06-11'),('2079-06-12'),('2079-06-13'),('2079-06-14'),('2079-06-15'),('2079-06-16'),('2079-06-17'),('2079-06-18'),('2079-06-19'),('2079-06-20'),('2079-06-21'),('2079-06-22'),('2079-06-23'),('2079-06-24'),('2079-06-25'),('2079-06-26'),('2079-06-27'),('2079-06-28'),('2079-06-29'),('2079-06-30'),('2079-07-01'),('2079-07-02'),('2079-07-03'),('2079-07-04'),('2079-07-05'),('2079-07-06'),('2079-07-07'),('2079-07-08'),('2079-07-09'),('2079-07-10'),('2079-07-11'),('2079-07-12'),('2079-07-13'),('2079-07-14'),('2079-07-15'),('2079-07-16'),('2079-07-17'),('2079-07-18'),('2079-07-19'),('2079-07-20'),('2079-07-21'),('2079-07-22'),('2079-07-23'),('2079-07-24'),('2079-07-25'),('2079-07-26'),('2079-07-27'),('2079-07-28'),('2079-07-29'),('2079-07-30'),('2079-07-31'),('2079-08-01'),('2079-08-02'),('2079-08-03'),('2079-08-04'),('2079-08-05'),('2079-08-06'),('2079-08-07'),('2079-08-08'),('2079-08-09'),('2079-08-10'),('2079-08-11'),('2079-08-12'),('2079-08-13'),('2079-08-14'),('2079-08-15'),('2079-08-16'),('2079-08-17'),('2079-08-18'),('2079-08-19'),('2079-08-20'),('2079-08-21'),('2079-08-22'),('2079-08-23'),('2079-08-24'),('2079-08-25'),('2079-08-26'),('2079-08-27'),('2079-08-28'),('2079-08-29'),('2079-08-30'),('2079-08-31'),('2079-09-01'),('2079-09-02'),('2079-09-03'),('2079-09-04'),('2079-09-05'),('2079-09-06'),('2079-09-07'),('2079-09-08'),('2079-09-09'),('2079-09-10'),('2079-09-11'),('2079-09-12'),('2079-09-13'),('2079-09-14'),('2079-09-15'),('2079-09-16'),('2079-09-17'),('2079-09-18'),('2079-09-19'),('2079-09-20'),('2079-09-21'),('2079-09-22'),('2079-09-23'),('2079-09-24'),('2079-09-25'),('2079-09-26'),('2079-09-27'),('2079-09-28'),('2079-09-29'),('2079-09-30'),('2079-10-01'),('2079-10-02'),('2079-10-03'),('2079-10-04'),('2079-10-05'),('2079-10-06'),('2079-10-07'),('2079-10-08'),('2079-10-09'),('2079-10-10'),('2079-10-11'),('2079-10-12'),('2079-10-13'),('2079-10-14'),('2079-10-15'),('2079-10-16'),('2079-10-17'),('2079-10-18'),('2079-10-19'),('2079-10-20'),('2079-10-21'),('2079-10-22'),('2079-10-23'),('2079-10-24'),('2079-10-25'),('2079-10-26'),('2079-10-27'),('2079-10-28'),('2079-10-29'),('2079-10-30'),('2079-10-31'),('2079-11-01'),('2079-11-02'),('2079-11-03'),('2079-11-04'),('2079-11-05'),('2079-11-06'),('2079-11-07'),('2079-11-08'),('2079-11-09'),('2079-11-10'),('2079-11-11'),('2079-11-12'),('2079-11-13'),('2079-11-14'),('2079-11-15'),('2079-11-16'),('2079-11-17'),('2079-11-18'),('2079-11-19'),('2079-11-20'),('2079-11-21'),('2079-11-22'),('2079-11-23'),('2079-11-24'),('2079-11-25'),('2079-11-26'),('2079-11-27'),('2079-11-28'),('2079-11-29'),('2079-11-30'),('2079-12-01'),('2079-12-02'),('2079-12-03'),('2079-12-04'),('2079-12-05'),('2079-12-06'),('2079-12-07'),('2079-12-08'),('2079-12-09'),('2079-12-10'),('2079-12-11'),('2079-12-12'),('2079-12-13'),('2079-12-14'),('2079-12-15'),('2079-12-16'),('2079-12-17'),('2079-12-18'),('2079-12-19'),('2079-12-20'),('2079-12-21'),('2079-12-22'),('2079-12-23'),('2079-12-24'),('2079-12-25'),('2079-12-26'),('2079-12-27'),('2079-12-28'),('2079-12-29'),('2079-12-30'),('2079-12-31'),('2080-01-01'),('2080-01-02'),('2080-01-03'),('2080-01-04'),('2080-01-05'),('2080-01-06'),('2080-01-07'),('2080-01-08'),('2080-01-09'),('2080-01-10'),('2080-01-11'),('2080-01-12'),('2080-01-13'),('2080-01-14'),('2080-01-15'),('2080-01-16'),('2080-01-17'),('2080-01-18'),('2080-01-19'),('2080-01-20'),('2080-01-21'),('2080-01-22'),('2080-01-23'),('2080-01-24'),('2080-01-25'),('2080-01-26'),('2080-01-27'),('2080-01-28'),('2080-01-29'),('2080-01-30'),('2080-01-31'),('2080-02-01'),('2080-02-02'),('2080-02-03'),('2080-02-04'),('2080-02-05'),('2080-02-06'),('2080-02-07'),('2080-02-08'),('2080-02-09'),('2080-02-10'),('2080-02-11'),('2080-02-12'),('2080-02-13'),('2080-02-14'),('2080-02-15'),('2080-02-16'),('2080-02-17'),('2080-02-18'),('2080-02-19'),('2080-02-20'),('2080-02-21'),('2080-02-22'),('2080-02-23'),('2080-02-24'),('2080-02-25'),('2080-02-26'),('2080-02-27'),('2080-02-28'),('2080-02-29'),('2080-03-01'),('2080-03-02'),('2080-03-03'),('2080-03-04'),('2080-03-05'),('2080-03-06'),('2080-03-07'),('2080-03-08'),('2080-03-09'),('2080-03-10'),('2080-03-11'),('2080-03-12'),('2080-03-13'),('2080-03-14'),('2080-03-15'),('2080-03-16'),('2080-03-17'),('2080-03-18'),('2080-03-19'),('2080-03-20'),('2080-03-21'),('2080-03-22'),('2080-03-23'),('2080-03-24'),('2080-03-25'),('2080-03-26'),('2080-03-27'),('2080-03-28'),('2080-03-29'),('2080-03-30'),('2080-03-31'),('2080-04-01'),('2080-04-02'),('2080-04-03'),('2080-04-04'),('2080-04-05'),('2080-04-06'),('2080-04-07'),('2080-04-08'),('2080-04-09'),('2080-04-10'),('2080-04-11'),('2080-04-12'),('2080-04-13'),('2080-04-14'),('2080-04-15'),('2080-04-16'),('2080-04-17'),('2080-04-18'),('2080-04-19'),('2080-04-20'),('2080-04-21'),('2080-04-22'),('2080-04-23'),('2080-04-24'),('2080-04-25'),('2080-04-26'),('2080-04-27'),('2080-04-28'),('2080-04-29'),('2080-04-30'),('2080-05-01'),('2080-05-02'),('2080-05-03'),('2080-05-04'),('2080-05-05'),('2080-05-06'),('2080-05-07'),('2080-05-08'),('2080-05-09'),('2080-05-10'),('2080-05-11'),('2080-05-12'),('2080-05-13'),('2080-05-14'),('2080-05-15'),('2080-05-16'),('2080-05-17'),('2080-05-18'),('2080-05-19'),('2080-05-20'),('2080-05-21'),('2080-05-22'),('2080-05-23'),('2080-05-24'),('2080-05-25'),('2080-05-26'),('2080-05-27'),('2080-05-28'),('2080-05-29'),('2080-05-30'),('2080-05-31'),('2080-06-01'),('2080-06-02'),('2080-06-03'),('2080-06-04'),('2080-06-05'),('2080-06-06'),('2080-06-07'),('2080-06-08'),('2080-06-09'),('2080-06-10'),('2080-06-11'),('2080-06-12'),('2080-06-13'),('2080-06-14'),('2080-06-15'),('2080-06-16'),('2080-06-17'),('2080-06-18'),('2080-06-19'),('2080-06-20'),('2080-06-21'),('2080-06-22'),('2080-06-23'),('2080-06-24'),('2080-06-25'),('2080-06-26'),('2080-06-27'),('2080-06-28'),('2080-06-29'),('2080-06-30'),('2080-07-01'),('2080-07-02'),('2080-07-03'),('2080-07-04'),('2080-07-05'),('2080-07-06'),('2080-07-07'),('2080-07-08'),('2080-07-09'),('2080-07-10'),('2080-07-11'),('2080-07-12'),('2080-07-13'),('2080-07-14'),('2080-07-15'),('2080-07-16'),('2080-07-17'),('2080-07-18'),('2080-07-19'),('2080-07-20'),('2080-07-21'),('2080-07-22'),('2080-07-23'),('2080-07-24'),('2080-07-25'),('2080-07-26'),('2080-07-27'),('2080-07-28'),('2080-07-29'),('2080-07-30'),('2080-07-31'),('2080-08-01'),('2080-08-02'),('2080-08-03'),('2080-08-04'),('2080-08-05'),('2080-08-06'),('2080-08-07'),('2080-08-08'),('2080-08-09'),('2080-08-10'),('2080-08-11'),('2080-08-12'),('2080-08-13'),('2080-08-14'),('2080-08-15'),('2080-08-16'),('2080-08-17'),('2080-08-18'),('2080-08-19'),('2080-08-20'),('2080-08-21'),('2080-08-22'),('2080-08-23'),('2080-08-24'),('2080-08-25'),('2080-08-26'),('2080-08-27'),('2080-08-28'),('2080-08-29'),('2080-08-30'),('2080-08-31'),('2080-09-01'),('2080-09-02'),('2080-09-03'),('2080-09-04'),('2080-09-05'),('2080-09-06'),('2080-09-07'),('2080-09-08'),('2080-09-09'),('2080-09-10'),('2080-09-11'),('2080-09-12'),('2080-09-13'),('2080-09-14'),('2080-09-15'),('2080-09-16'),('2080-09-17'),('2080-09-18'),('2080-09-19'),('2080-09-20'),('2080-09-21'),('2080-09-22'),('2080-09-23'),('2080-09-24'),('2080-09-25'),('2080-09-26'),('2080-09-27'),('2080-09-28'),('2080-09-29'),('2080-09-30'),('2080-10-01'),('2080-10-02'),('2080-10-03'),('2080-10-04'),('2080-10-05'),('2080-10-06'),('2080-10-07'),('2080-10-08'),('2080-10-09'),('2080-10-10'),('2080-10-11'),('2080-10-12'),('2080-10-13'),('2080-10-14'),('2080-10-15'),('2080-10-16'),('2080-10-17'),('2080-10-18'),('2080-10-19'),('2080-10-20'),('2080-10-21'),('2080-10-22'),('2080-10-23'),('2080-10-24'),('2080-10-25'),('2080-10-26'),('2080-10-27'),('2080-10-28'),('2080-10-29'),('2080-10-30'),('2080-10-31'),('2080-11-01'),('2080-11-02'),('2080-11-03'),('2080-11-04'),('2080-11-05'),('2080-11-06'),('2080-11-07'),('2080-11-08'),('2080-11-09'),('2080-11-10'),('2080-11-11'),('2080-11-12'),('2080-11-13'),('2080-11-14'),('2080-11-15'),('2080-11-16'),('2080-11-17'),('2080-11-18'),('2080-11-19'),('2080-11-20'),('2080-11-21'),('2080-11-22'),('2080-11-23'),('2080-11-24'),('2080-11-25'),('2080-11-26'),('2080-11-27'),('2080-11-28'),('2080-11-29'),('2080-11-30'),('2080-12-01'),('2080-12-02'),('2080-12-03'),('2080-12-04'),('2080-12-05'),('2080-12-06'),('2080-12-07'),('2080-12-08'),('2080-12-09'),('2080-12-10'),('2080-12-11'),('2080-12-12'),('2080-12-13'),('2080-12-14'),('2080-12-15'),('2080-12-16'),('2080-12-17'),('2080-12-18'),('2080-12-19'),('2080-12-20'),('2080-12-21'),('2080-12-22'),('2080-12-23'),('2080-12-24'),('2080-12-25'),('2080-12-26'),('2080-12-27'),('2080-12-28'),('2080-12-29'),('2080-12-30'),('2080-12-31'),('2081-01-01'),('2081-01-02'),('2081-01-03'),('2081-01-04'),('2081-01-05'),('2081-01-06'),('2081-01-07'),('2081-01-08'),('2081-01-09'),('2081-01-10'),('2081-01-11'),('2081-01-12'),('2081-01-13'),('2081-01-14'),('2081-01-15'),('2081-01-16'),('2081-01-17'),('2081-01-18'),('2081-01-19'),('2081-01-20'),('2081-01-21'),('2081-01-22'),('2081-01-23'),('2081-01-24'),('2081-01-25'),('2081-01-26'),('2081-01-27'),('2081-01-28'),('2081-01-29'),('2081-01-30'),('2081-01-31'),('2081-02-01'),('2081-02-02'),('2081-02-03'),('2081-02-04'),('2081-02-05'),('2081-02-06'),('2081-02-07'),('2081-02-08'),('2081-02-09'),('2081-02-10'),('2081-02-11'),('2081-02-12'),('2081-02-13'),('2081-02-14'),('2081-02-15'),('2081-02-16'),('2081-02-17'),('2081-02-18'),('2081-02-19'),('2081-02-20'),('2081-02-21'),('2081-02-22'),('2081-02-23'),('2081-02-24'),('2081-02-25'),('2081-02-26'),('2081-02-27'),('2081-02-28'),('2081-03-01'),('2081-03-02'),('2081-03-03'),('2081-03-04'),('2081-03-05'),('2081-03-06'),('2081-03-07'),('2081-03-08'),('2081-03-09'),('2081-03-10'),('2081-03-11'),('2081-03-12'),('2081-03-13'),('2081-03-14'),('2081-03-15'),('2081-03-16'),('2081-03-17'),('2081-03-18'),('2081-03-19'),('2081-03-20'),('2081-03-21'),('2081-03-22'),('2081-03-23'),('2081-03-24'),('2081-03-25'),('2081-03-26'),('2081-03-27'),('2081-03-28'),('2081-03-29'),('2081-03-30'),('2081-03-31'),('2081-04-01'),('2081-04-02'),('2081-04-03'),('2081-04-04'),('2081-04-05'),('2081-04-06'),('2081-04-07'),('2081-04-08'),('2081-04-09'),('2081-04-10'),('2081-04-11'),('2081-04-12'),('2081-04-13'),('2081-04-14'),('2081-04-15'),('2081-04-16'),('2081-04-17'),('2081-04-18'),('2081-04-19'),('2081-04-20'),('2081-04-21'),('2081-04-22'),('2081-04-23'),('2081-04-24'),('2081-04-25'),('2081-04-26'),('2081-04-27'),('2081-04-28'),('2081-04-29'),('2081-04-30'),('2081-05-01'),('2081-05-02'),('2081-05-03'),('2081-05-04'),('2081-05-05'),('2081-05-06'),('2081-05-07'),('2081-05-08'),('2081-05-09'),('2081-05-10'),('2081-05-11'),('2081-05-12'),('2081-05-13'),('2081-05-14'),('2081-05-15'),('2081-05-16'),('2081-05-17'),('2081-05-18'),('2081-05-19'),('2081-05-20'),('2081-05-21'),('2081-05-22'),('2081-05-23'),('2081-05-24'),('2081-05-25'),('2081-05-26'),('2081-05-27'),('2081-05-28'),('2081-05-29'),('2081-05-30'),('2081-05-31'),('2081-06-01'),('2081-06-02'),('2081-06-03'),('2081-06-04'),('2081-06-05'),('2081-06-06'),('2081-06-07'),('2081-06-08'),('2081-06-09'),('2081-06-10'),('2081-06-11'),('2081-06-12'),('2081-06-13'),('2081-06-14'),('2081-06-15'),('2081-06-16'),('2081-06-17'),('2081-06-18'),('2081-06-19'),('2081-06-20'),('2081-06-21'),('2081-06-22'),('2081-06-23'),('2081-06-24'),('2081-06-25'),('2081-06-26'),('2081-06-27'),('2081-06-28'),('2081-06-29'),('2081-06-30'),('2081-07-01'),('2081-07-02'),('2081-07-03'),('2081-07-04'),('2081-07-05'),('2081-07-06'),('2081-07-07'),('2081-07-08'),('2081-07-09'),('2081-07-10'),('2081-07-11'),('2081-07-12'),('2081-07-13'),('2081-07-14'),('2081-07-15'),('2081-07-16'),('2081-07-17'),('2081-07-18'),('2081-07-19'),('2081-07-20'),('2081-07-21'),('2081-07-22'),('2081-07-23'),('2081-07-24'),('2081-07-25'),('2081-07-26'),('2081-07-27'),('2081-07-28'),('2081-07-29'),('2081-07-30'),('2081-07-31'),('2081-08-01'),('2081-08-02'),('2081-08-03'),('2081-08-04'),('2081-08-05'),('2081-08-06'),('2081-08-07'),('2081-08-08'),('2081-08-09'),('2081-08-10'),('2081-08-11'),('2081-08-12'),('2081-08-13'),('2081-08-14'),('2081-08-15'),('2081-08-16'),('2081-08-17'),('2081-08-18'),('2081-08-19'),('2081-08-20'),('2081-08-21'),('2081-08-22'),('2081-08-23'),('2081-08-24'),('2081-08-25'),('2081-08-26'),('2081-08-27'),('2081-08-28'),('2081-08-29'),('2081-08-30'),('2081-08-31'),('2081-09-01'),('2081-09-02'),('2081-09-03'),('2081-09-04'),('2081-09-05'),('2081-09-06'),('2081-09-07'),('2081-09-08'),('2081-09-09'),('2081-09-10'),('2081-09-11'),('2081-09-12'),('2081-09-13'),('2081-09-14'),('2081-09-15'),('2081-09-16'),('2081-09-17'),('2081-09-18'),('2081-09-19'),('2081-09-20'),('2081-09-21'),('2081-09-22'),('2081-09-23'),('2081-09-24'),('2081-09-25'),('2081-09-26'),('2081-09-27'),('2081-09-28'),('2081-09-29'),('2081-09-30'),('2081-10-01'),('2081-10-02'),('2081-10-03'),('2081-10-04'),('2081-10-05'),('2081-10-06'),('2081-10-07'),('2081-10-08'),('2081-10-09'),('2081-10-10'),('2081-10-11'),('2081-10-12'),('2081-10-13'),('2081-10-14'),('2081-10-15'),('2081-10-16'),('2081-10-17'),('2081-10-18'),('2081-10-19'),('2081-10-20'),('2081-10-21'),('2081-10-22'),('2081-10-23'),('2081-10-24'),('2081-10-25'),('2081-10-26'),('2081-10-27'),('2081-10-28'),('2081-10-29'),('2081-10-30'),('2081-10-31'),('2081-11-01'),('2081-11-02'),('2081-11-03'),('2081-11-04'),('2081-11-05'),('2081-11-06'),('2081-11-07'),('2081-11-08'),('2081-11-09'),('2081-11-10'),('2081-11-11'),('2081-11-12'),('2081-11-13'),('2081-11-14'),('2081-11-15'),('2081-11-16'),('2081-11-17'),('2081-11-18'),('2081-11-19'),('2081-11-20'),('2081-11-21'),('2081-11-22'),('2081-11-23'),('2081-11-24'),('2081-11-25'),('2081-11-26'),('2081-11-27'),('2081-11-28'),('2081-11-29'),('2081-11-30'),('2081-12-01'),('2081-12-02'),('2081-12-03'),('2081-12-04'),('2081-12-05'),('2081-12-06'),('2081-12-07'),('2081-12-08'),('2081-12-09'),('2081-12-10'),('2081-12-11'),('2081-12-12'),('2081-12-13'),('2081-12-14'),('2081-12-15'),('2081-12-16'),('2081-12-17'),('2081-12-18'),('2081-12-19'),('2081-12-20'),('2081-12-21'),('2081-12-22'),('2081-12-23'),('2081-12-24'),('2081-12-25'),('2081-12-26'),('2081-12-27'),('2081-12-28'),('2081-12-29'),('2081-12-30'),('2081-12-31'),('2082-01-01'),('2082-01-02'),('2082-01-03'),('2082-01-04'),('2082-01-05'),('2082-01-06'),('2082-01-07'),('2082-01-08'),('2082-01-09'),('2082-01-10'),('2082-01-11'),('2082-01-12'),('2082-01-13'),('2082-01-14'),('2082-01-15'),('2082-01-16'),('2082-01-17'),('2082-01-18'),('2082-01-19'),('2082-01-20'),('2082-01-21'),('2082-01-22'),('2082-01-23'),('2082-01-24'),('2082-01-25'),('2082-01-26'),('2082-01-27'),('2082-01-28'),('2082-01-29'),('2082-01-30'),('2082-01-31'),('2082-02-01'),('2082-02-02'),('2082-02-03'),('2082-02-04'),('2082-02-05'),('2082-02-06'),('2082-02-07'),('2082-02-08'),('2082-02-09'),('2082-02-10'),('2082-02-11'),('2082-02-12'),('2082-02-13'),('2082-02-14'),('2082-02-15'),('2082-02-16'),('2082-02-17'),('2082-02-18'),('2082-02-19'),('2082-02-20'),('2082-02-21'),('2082-02-22'),('2082-02-23'),('2082-02-24'),('2082-02-25'),('2082-02-26'),('2082-02-27'),('2082-02-28'),('2082-03-01'),('2082-03-02'),('2082-03-03'),('2082-03-04'),('2082-03-05'),('2082-03-06'),('2082-03-07'),('2082-03-08'),('2082-03-09'),('2082-03-10'),('2082-03-11'),('2082-03-12'),('2082-03-13'),('2082-03-14'),('2082-03-15'),('2082-03-16'),('2082-03-17'),('2082-03-18'),('2082-03-19'),('2082-03-20'),('2082-03-21'),('2082-03-22'),('2082-03-23'),('2082-03-24'),('2082-03-25'),('2082-03-26'),('2082-03-27'),('2082-03-28'),('2082-03-29'),('2082-03-30'),('2082-03-31'),('2082-04-01'),('2082-04-02'),('2082-04-03'),('2082-04-04'),('2082-04-05'),('2082-04-06'),('2082-04-07'),('2082-04-08'),('2082-04-09'),('2082-04-10'),('2082-04-11'),('2082-04-12'),('2082-04-13'),('2082-04-14'),('2082-04-15'),('2082-04-16'),('2082-04-17'),('2082-04-18'),('2082-04-19'),('2082-04-20'),('2082-04-21'),('2082-04-22'),('2082-04-23'),('2082-04-24'),('2082-04-25'),('2082-04-26'),('2082-04-27'),('2082-04-28'),('2082-04-29'),('2082-04-30'),('2082-05-01'),('2082-05-02'),('2082-05-03'),('2082-05-04'),('2082-05-05'),('2082-05-06'),('2082-05-07'),('2082-05-08'),('2082-05-09'),('2082-05-10'),('2082-05-11'),('2082-05-12'),('2082-05-13'),('2082-05-14'),('2082-05-15'),('2082-05-16'),('2082-05-17'),('2082-05-18'),('2082-05-19'),('2082-05-20'),('2082-05-21'),('2082-05-22'),('2082-05-23'),('2082-05-24'),('2082-05-25'),('2082-05-26'),('2082-05-27'),('2082-05-28'),('2082-05-29'),('2082-05-30'),('2082-05-31'),('2082-06-01'),('2082-06-02'),('2082-06-03'),('2082-06-04'),('2082-06-05'),('2082-06-06'),('2082-06-07'),('2082-06-08'),('2082-06-09'),('2082-06-10'),('2082-06-11'),('2082-06-12'),('2082-06-13'),('2082-06-14'),('2082-06-15'),('2082-06-16'),('2082-06-17'),('2082-06-18'),('2082-06-19'),('2082-06-20'),('2082-06-21'),('2082-06-22'),('2082-06-23'),('2082-06-24'),('2082-06-25'),('2082-06-26'),('2082-06-27'),('2082-06-28'),('2082-06-29'),('2082-06-30'),('2082-07-01'),('2082-07-02'),('2082-07-03'),('2082-07-04'),('2082-07-05'),('2082-07-06'),('2082-07-07'),('2082-07-08'),('2082-07-09'),('2082-07-10'),('2082-07-11'),('2082-07-12'),('2082-07-13'),('2082-07-14'),('2082-07-15'),('2082-07-16'),('2082-07-17'),('2082-07-18'),('2082-07-19'),('2082-07-20'),('2082-07-21'),('2082-07-22'),('2082-07-23'),('2082-07-24'),('2082-07-25'),('2082-07-26'),('2082-07-27'),('2082-07-28'),('2082-07-29'),('2082-07-30'),('2082-07-31'),('2082-08-01'),('2082-08-02'),('2082-08-03'),('2082-08-04'),('2082-08-05'),('2082-08-06'),('2082-08-07'),('2082-08-08'),('2082-08-09'),('2082-08-10'),('2082-08-11'),('2082-08-12'),('2082-08-13'),('2082-08-14'),('2082-08-15'),('2082-08-16'),('2082-08-17'),('2082-08-18'),('2082-08-19'),('2082-08-20'),('2082-08-21'),('2082-08-22'),('2082-08-23'),('2082-08-24'),('2082-08-25'),('2082-08-26'),('2082-08-27'),('2082-08-28'),('2082-08-29'),('2082-08-30'),('2082-08-31'),('2082-09-01'),('2082-09-02'),('2082-09-03'),('2082-09-04'),('2082-09-05'),('2082-09-06'),('2082-09-07'),('2082-09-08'),('2082-09-09'),('2082-09-10'),('2082-09-11'),('2082-09-12'),('2082-09-13'),('2082-09-14'),('2082-09-15'),('2082-09-16'),('2082-09-17'),('2082-09-18'),('2082-09-19'),('2082-09-20'),('2082-09-21'),('2082-09-22'),('2082-09-23'),('2082-09-24'),('2082-09-25'),('2082-09-26'),('2082-09-27'),('2082-09-28'),('2082-09-29'),('2082-09-30'),('2082-10-01'),('2082-10-02'),('2082-10-03'),('2082-10-04'),('2082-10-05'),('2082-10-06'),('2082-10-07'),('2082-10-08'),('2082-10-09'),('2082-10-10'),('2082-10-11'),('2082-10-12'),('2082-10-13'),('2082-10-14'),('2082-10-15'),('2082-10-16'),('2082-10-17'),('2082-10-18'),('2082-10-19'),('2082-10-20'),('2082-10-21'),('2082-10-22'),('2082-10-23'),('2082-10-24'),('2082-10-25'),('2082-10-26'),('2082-10-27'),('2082-10-28'),('2082-10-29'),('2082-10-30'),('2082-10-31'),('2082-11-01'),('2082-11-02'),('2082-11-03'),('2082-11-04'),('2082-11-05'),('2082-11-06'),('2082-11-07'),('2082-11-08'),('2082-11-09'),('2082-11-10'),('2082-11-11'),('2082-11-12'),('2082-11-13'),('2082-11-14'),('2082-11-15'),('2082-11-16'),('2082-11-17'),('2082-11-18'),('2082-11-19'),('2082-11-20'),('2082-11-21'),('2082-11-22'),('2082-11-23'),('2082-11-24'),('2082-11-25'),('2082-11-26'),('2082-11-27'),('2082-11-28'),('2082-11-29'),('2082-11-30'),('2082-12-01'),('2082-12-02'),('2082-12-03'),('2082-12-04'),('2082-12-05'),('2082-12-06'),('2082-12-07'),('2082-12-08'),('2082-12-09'),('2082-12-10'),('2082-12-11'),('2082-12-12'),('2082-12-13'),('2082-12-14'),('2082-12-15'),('2082-12-16'),('2082-12-17'),('2082-12-18'),('2082-12-19'),('2082-12-20'),('2082-12-21'),('2082-12-22'),('2082-12-23'),('2082-12-24'),('2082-12-25'),('2082-12-26'),('2082-12-27'),('2082-12-28'),('2082-12-29'),('2082-12-30'),('2082-12-31'),('2083-01-01'),('2083-01-02'),('2083-01-03'),('2083-01-04'),('2083-01-05'),('2083-01-06'),('2083-01-07'),('2083-01-08'),('2083-01-09'),('2083-01-10'),('2083-01-11'),('2083-01-12'),('2083-01-13'),('2083-01-14'),('2083-01-15'),('2083-01-16'),('2083-01-17'),('2083-01-18'),('2083-01-19'),('2083-01-20'),('2083-01-21'),('2083-01-22'),('2083-01-23'),('2083-01-24'),('2083-01-25'),('2083-01-26'),('2083-01-27'),('2083-01-28'),('2083-01-29'),('2083-01-30'),('2083-01-31'),('2083-02-01'),('2083-02-02'),('2083-02-03'),('2083-02-04'),('2083-02-05'),('2083-02-06'),('2083-02-07'),('2083-02-08'),('2083-02-09'),('2083-02-10'),('2083-02-11'),('2083-02-12'),('2083-02-13'),('2083-02-14'),('2083-02-15'),('2083-02-16'),('2083-02-17'),('2083-02-18'),('2083-02-19'),('2083-02-20'),('2083-02-21'),('2083-02-22'),('2083-02-23'),('2083-02-24'),('2083-02-25'),('2083-02-26'),('2083-02-27'),('2083-02-28'),('2083-03-01'),('2083-03-02'),('2083-03-03'),('2083-03-04'),('2083-03-05'),('2083-03-06'),('2083-03-07'),('2083-03-08'),('2083-03-09'),('2083-03-10'),('2083-03-11'),('2083-03-12'),('2083-03-13'),('2083-03-14'),('2083-03-15'),('2083-03-16'),('2083-03-17'),('2083-03-18'),('2083-03-19'),('2083-03-20'),('2083-03-21'),('2083-03-22'),('2083-03-23'),('2083-03-24'),('2083-03-25'),('2083-03-26'),('2083-03-27'),('2083-03-28'),('2083-03-29'),('2083-03-30'),('2083-03-31'),('2083-04-01'),('2083-04-02'),('2083-04-03'),('2083-04-04'),('2083-04-05'),('2083-04-06'),('2083-04-07'),('2083-04-08'),('2083-04-09'),('2083-04-10'),('2083-04-11'),('2083-04-12'),('2083-04-13'),('2083-04-14'),('2083-04-15'),('2083-04-16'),('2083-04-17'),('2083-04-18'),('2083-04-19'),('2083-04-20'),('2083-04-21'),('2083-04-22'),('2083-04-23'),('2083-04-24'),('2083-04-25'),('2083-04-26'),('2083-04-27'),('2083-04-28'),('2083-04-29'),('2083-04-30'),('2083-05-01'),('2083-05-02'),('2083-05-03'),('2083-05-04'),('2083-05-05'),('2083-05-06'),('2083-05-07'),('2083-05-08'),('2083-05-09'),('2083-05-10'),('2083-05-11'),('2083-05-12'),('2083-05-13'),('2083-05-14'),('2083-05-15'),('2083-05-16'),('2083-05-17'),('2083-05-18'),('2083-05-19'),('2083-05-20'),('2083-05-21'),('2083-05-22'),('2083-05-23'),('2083-05-24'),('2083-05-25'),('2083-05-26'),('2083-05-27'),('2083-05-28'),('2083-05-29'),('2083-05-30'),('2083-05-31'),('2083-06-01'),('2083-06-02'),('2083-06-03'),('2083-06-04'),('2083-06-05'),('2083-06-06'),('2083-06-07'),('2083-06-08'),('2083-06-09'),('2083-06-10'),('2083-06-11'),('2083-06-12'),('2083-06-13'),('2083-06-14'),('2083-06-15'),('2083-06-16'),('2083-06-17'),('2083-06-18'),('2083-06-19'),('2083-06-20'),('2083-06-21'),('2083-06-22'),('2083-06-23'),('2083-06-24'),('2083-06-25'),('2083-06-26'),('2083-06-27'),('2083-06-28'),('2083-06-29'),('2083-06-30'),('2083-07-01'),('2083-07-02'),('2083-07-03'),('2083-07-04'),('2083-07-05'),('2083-07-06'),('2083-07-07'),('2083-07-08'),('2083-07-09'),('2083-07-10'),('2083-07-11'),('2083-07-12'),('2083-07-13'),('2083-07-14'),('2083-07-15'),('2083-07-16'),('2083-07-17'),('2083-07-18'),('2083-07-19'),('2083-07-20'),('2083-07-21'),('2083-07-22'),('2083-07-23'),('2083-07-24'),('2083-07-25'),('2083-07-26'),('2083-07-27'),('2083-07-28'),('2083-07-29'),('2083-07-30'),('2083-07-31'),('2083-08-01'),('2083-08-02'),('2083-08-03'),('2083-08-04'),('2083-08-05'),('2083-08-06'),('2083-08-07'),('2083-08-08'),('2083-08-09'),('2083-08-10'),('2083-08-11'),('2083-08-12'),('2083-08-13'),('2083-08-14'),('2083-08-15'),('2083-08-16'),('2083-08-17'),('2083-08-18'),('2083-08-19'),('2083-08-20'),('2083-08-21'),('2083-08-22'),('2083-08-23'),('2083-08-24'),('2083-08-25'),('2083-08-26'),('2083-08-27'),('2083-08-28'),('2083-08-29'),('2083-08-30'),('2083-08-31'),('2083-09-01'),('2083-09-02'),('2083-09-03'),('2083-09-04'),('2083-09-05'),('2083-09-06'),('2083-09-07'),('2083-09-08'),('2083-09-09'),('2083-09-10'),('2083-09-11'),('2083-09-12'),('2083-09-13'),('2083-09-14'),('2083-09-15'),('2083-09-16'),('2083-09-17'),('2083-09-18'),('2083-09-19'),('2083-09-20'),('2083-09-21'),('2083-09-22'),('2083-09-23'),('2083-09-24'),('2083-09-25'),('2083-09-26'),('2083-09-27'),('2083-09-28'),('2083-09-29'),('2083-09-30'),('2083-10-01'),('2083-10-02'),('2083-10-03'),('2083-10-04'),('2083-10-05'),('2083-10-06'),('2083-10-07'),('2083-10-08'),('2083-10-09'),('2083-10-10'),('2083-10-11'),('2083-10-12'),('2083-10-13'),('2083-10-14'),('2083-10-15'),('2083-10-16'),('2083-10-17'),('2083-10-18'),('2083-10-19'),('2083-10-20'),('2083-10-21'),('2083-10-22'),('2083-10-23'),('2083-10-24'),('2083-10-25'),('2083-10-26'),('2083-10-27'),('2083-10-28'),('2083-10-29'),('2083-10-30'),('2083-10-31'),('2083-11-01'),('2083-11-02'),('2083-11-03'),('2083-11-04'),('2083-11-05'),('2083-11-06'),('2083-11-07'),('2083-11-08'),('2083-11-09'),('2083-11-10'),('2083-11-11'),('2083-11-12'),('2083-11-13'),('2083-11-14'),('2083-11-15'),('2083-11-16'),('2083-11-17'),('2083-11-18'),('2083-11-19'),('2083-11-20'),('2083-11-21'),('2083-11-22'),('2083-11-23'),('2083-11-24'),('2083-11-25'),('2083-11-26'),('2083-11-27'),('2083-11-28'),('2083-11-29'),('2083-11-30'),('2083-12-01'),('2083-12-02'),('2083-12-03'),('2083-12-04'),('2083-12-05'),('2083-12-06'),('2083-12-07'),('2083-12-08'),('2083-12-09'),('2083-12-10'),('2083-12-11'),('2083-12-12'),('2083-12-13'),('2083-12-14'),('2083-12-15'),('2083-12-16'),('2083-12-17'),('2083-12-18'),('2083-12-19'),('2083-12-20'),('2083-12-21'),('2083-12-22'),('2083-12-23'),('2083-12-24'),('2083-12-25'),('2083-12-26'),('2083-12-27'),('2083-12-28'),('2083-12-29'),('2083-12-30'),('2083-12-31'),('2084-01-01'),('2084-01-02'),('2084-01-03'),('2084-01-04'),('2084-01-05'),('2084-01-06'),('2084-01-07'),('2084-01-08'),('2084-01-09'),('2084-01-10'),('2084-01-11'),('2084-01-12'),('2084-01-13'),('2084-01-14'),('2084-01-15'),('2084-01-16'),('2084-01-17'),('2084-01-18'),('2084-01-19'),('2084-01-20'),('2084-01-21'),('2084-01-22'),('2084-01-23'),('2084-01-24'),('2084-01-25'),('2084-01-26'),('2084-01-27'),('2084-01-28'),('2084-01-29'),('2084-01-30'),('2084-01-31'),('2084-02-01'),('2084-02-02'),('2084-02-03'),('2084-02-04'),('2084-02-05'),('2084-02-06'),('2084-02-07'),('2084-02-08'),('2084-02-09'),('2084-02-10'),('2084-02-11'),('2084-02-12'),('2084-02-13'),('2084-02-14'),('2084-02-15'),('2084-02-16'),('2084-02-17'),('2084-02-18'),('2084-02-19'),('2084-02-20'),('2084-02-21'),('2084-02-22'),('2084-02-23'),('2084-02-24'),('2084-02-25'),('2084-02-26'),('2084-02-27'),('2084-02-28'),('2084-02-29'),('2084-03-01'),('2084-03-02'),('2084-03-03'),('2084-03-04'),('2084-03-05'),('2084-03-06'),('2084-03-07'),('2084-03-08'),('2084-03-09'),('2084-03-10'),('2084-03-11'),('2084-03-12'),('2084-03-13'),('2084-03-14'),('2084-03-15'),('2084-03-16'),('2084-03-17'),('2084-03-18'),('2084-03-19'),('2084-03-20'),('2084-03-21'),('2084-03-22'),('2084-03-23'),('2084-03-24'),('2084-03-25'),('2084-03-26'),('2084-03-27'),('2084-03-28'),('2084-03-29'),('2084-03-30'),('2084-03-31'),('2084-04-01'),('2084-04-02'),('2084-04-03'),('2084-04-04'),('2084-04-05'),('2084-04-06'),('2084-04-07'),('2084-04-08'),('2084-04-09'),('2084-04-10'),('2084-04-11'),('2084-04-12'),('2084-04-13'),('2084-04-14'),('2084-04-15'),('2084-04-16'),('2084-04-17'),('2084-04-18'),('2084-04-19'),('2084-04-20'),('2084-04-21'),('2084-04-22'),('2084-04-23'),('2084-04-24'),('2084-04-25'),('2084-04-26'),('2084-04-27'),('2084-04-28'),('2084-04-29'),('2084-04-30'),('2084-05-01'),('2084-05-02'),('2084-05-03'),('2084-05-04'),('2084-05-05'),('2084-05-06'),('2084-05-07'),('2084-05-08'),('2084-05-09'),('2084-05-10'),('2084-05-11'),('2084-05-12'),('2084-05-13'),('2084-05-14'),('2084-05-15'),('2084-05-16'),('2084-05-17'),('2084-05-18'),('2084-05-19'),('2084-05-20'),('2084-05-21'),('2084-05-22'),('2084-05-23'),('2084-05-24'),('2084-05-25'),('2084-05-26'),('2084-05-27'),('2084-05-28'),('2084-05-29'),('2084-05-30'),('2084-05-31'),('2084-06-01'),('2084-06-02'),('2084-06-03'),('2084-06-04'),('2084-06-05'),('2084-06-06'),('2084-06-07'),('2084-06-08'),('2084-06-09'),('2084-06-10'),('2084-06-11'),('2084-06-12'),('2084-06-13'),('2084-06-14'),('2084-06-15'),('2084-06-16'),('2084-06-17'),('2084-06-18'),('2084-06-19'),('2084-06-20'),('2084-06-21'),('2084-06-22'),('2084-06-23'),('2084-06-24'),('2084-06-25'),('2084-06-26'),('2084-06-27'),('2084-06-28'),('2084-06-29'),('2084-06-30'),('2084-07-01'),('2084-07-02'),('2084-07-03'),('2084-07-04'),('2084-07-05'),('2084-07-06'),('2084-07-07'),('2084-07-08'),('2084-07-09'),('2084-07-10'),('2084-07-11'),('2084-07-12'),('2084-07-13'),('2084-07-14'),('2084-07-15'),('2084-07-16'),('2084-07-17'),('2084-07-18'),('2084-07-19'),('2084-07-20'),('2084-07-21'),('2084-07-22'),('2084-07-23'),('2084-07-24'),('2084-07-25'),('2084-07-26'),('2084-07-27'),('2084-07-28'),('2084-07-29'),('2084-07-30'),('2084-07-31'),('2084-08-01'),('2084-08-02'),('2084-08-03'),('2084-08-04'),('2084-08-05'),('2084-08-06'),('2084-08-07'),('2084-08-08'),('2084-08-09'),('2084-08-10'),('2084-08-11'),('2084-08-12'),('2084-08-13'),('2084-08-14'),('2084-08-15'),('2084-08-16'),('2084-08-17'),('2084-08-18'),('2084-08-19'),('2084-08-20'),('2084-08-21'),('2084-08-22'),('2084-08-23'),('2084-08-24'),('2084-08-25'),('2084-08-26'),('2084-08-27'),('2084-08-28'),('2084-08-29'),('2084-08-30'),('2084-08-31'),('2084-09-01'),('2084-09-02'),('2084-09-03'),('2084-09-04'),('2084-09-05'),('2084-09-06'),('2084-09-07'),('2084-09-08'),('2084-09-09'),('2084-09-10'),('2084-09-11'),('2084-09-12'),('2084-09-13'),('2084-09-14'),('2084-09-15'),('2084-09-16'),('2084-09-17'),('2084-09-18'),('2084-09-19'),('2084-09-20'),('2084-09-21'),('2084-09-22'),('2084-09-23'),('2084-09-24'),('2084-09-25'),('2084-09-26'),('2084-09-27'),('2084-09-28'),('2084-09-29'),('2084-09-30'),('2084-10-01'),('2084-10-02'),('2084-10-03'),('2084-10-04'),('2084-10-05'),('2084-10-06'),('2084-10-07'),('2084-10-08'),('2084-10-09'),('2084-10-10'),('2084-10-11'),('2084-10-12'),('2084-10-13'),('2084-10-14'),('2084-10-15'),('2084-10-16'),('2084-10-17'),('2084-10-18'),('2084-10-19'),('2084-10-20'),('2084-10-21'),('2084-10-22'),('2084-10-23'),('2084-10-24'),('2084-10-25'),('2084-10-26'),('2084-10-27'),('2084-10-28'),('2084-10-29'),('2084-10-30'),('2084-10-31'),('2084-11-01'),('2084-11-02'),('2084-11-03'),('2084-11-04'),('2084-11-05'),('2084-11-06'),('2084-11-07'),('2084-11-08'),('2084-11-09'),('2084-11-10'),('2084-11-11'),('2084-11-12'),('2084-11-13'),('2084-11-14'),('2084-11-15'),('2084-11-16'),('2084-11-17'),('2084-11-18'),('2084-11-19'),('2084-11-20'),('2084-11-21'),('2084-11-22'),('2084-11-23'),('2084-11-24'),('2084-11-25'),('2084-11-26'),('2084-11-27'),('2084-11-28'),('2084-11-29'),('2084-11-30'),('2084-12-01'),('2084-12-02'),('2084-12-03'),('2084-12-04'),('2084-12-05'),('2084-12-06'),('2084-12-07'),('2084-12-08'),('2084-12-09'),('2084-12-10'),('2084-12-11'),('2084-12-12'),('2084-12-13'),('2084-12-14'),('2084-12-15'),('2084-12-16'),('2084-12-17'),('2084-12-18'),('2084-12-19'),('2084-12-20'),('2084-12-21'),('2084-12-22'),('2084-12-23'),('2084-12-24'),('2084-12-25'),('2084-12-26'),('2084-12-27'),('2084-12-28'),('2084-12-29'),('2084-12-30'),('2084-12-31'),('2085-01-01'),('2085-01-02'),('2085-01-03'),('2085-01-04'),('2085-01-05'),('2085-01-06'),('2085-01-07'),('2085-01-08'),('2085-01-09'),('2085-01-10'),('2085-01-11'),('2085-01-12'),('2085-01-13'),('2085-01-14'),('2085-01-15'),('2085-01-16'),('2085-01-17'),('2085-01-18'),('2085-01-19'),('2085-01-20'),('2085-01-21'),('2085-01-22'),('2085-01-23'),('2085-01-24'),('2085-01-25'),('2085-01-26'),('2085-01-27'),('2085-01-28'),('2085-01-29'),('2085-01-30'),('2085-01-31'),('2085-02-01'),('2085-02-02'),('2085-02-03'),('2085-02-04'),('2085-02-05'),('2085-02-06'),('2085-02-07'),('2085-02-08'),('2085-02-09'),('2085-02-10'),('2085-02-11'),('2085-02-12'),('2085-02-13'),('2085-02-14'),('2085-02-15'),('2085-02-16'),('2085-02-17'),('2085-02-18'),('2085-02-19'),('2085-02-20'),('2085-02-21'),('2085-02-22'),('2085-02-23'),('2085-02-24'),('2085-02-25'),('2085-02-26'),('2085-02-27'),('2085-02-28'),('2085-03-01'),('2085-03-02'),('2085-03-03'),('2085-03-04'),('2085-03-05'),('2085-03-06'),('2085-03-07'),('2085-03-08'),('2085-03-09'),('2085-03-10'),('2085-03-11'),('2085-03-12'),('2085-03-13'),('2085-03-14'),('2085-03-15'),('2085-03-16'),('2085-03-17'),('2085-03-18'),('2085-03-19'),('2085-03-20'),('2085-03-21'),('2085-03-22'),('2085-03-23'),('2085-03-24'),('2085-03-25'),('2085-03-26'),('2085-03-27'),('2085-03-28'),('2085-03-29'),('2085-03-30'),('2085-03-31'),('2085-04-01'),('2085-04-02'),('2085-04-03'),('2085-04-04'),('2085-04-05'),('2085-04-06'),('2085-04-07'),('2085-04-08'),('2085-04-09'),('2085-04-10'),('2085-04-11'),('2085-04-12'),('2085-04-13'),('2085-04-14'),('2085-04-15'),('2085-04-16'),('2085-04-17'),('2085-04-18'),('2085-04-19'),('2085-04-20'),('2085-04-21'),('2085-04-22'),('2085-04-23'),('2085-04-24'),('2085-04-25'),('2085-04-26'),('2085-04-27'),('2085-04-28'),('2085-04-29'),('2085-04-30'),('2085-05-01'),('2085-05-02'),('2085-05-03'),('2085-05-04'),('2085-05-05'),('2085-05-06'),('2085-05-07'),('2085-05-08'),('2085-05-09'),('2085-05-10'),('2085-05-11'),('2085-05-12'),('2085-05-13'),('2085-05-14'),('2085-05-15'),('2085-05-16'),('2085-05-17'),('2085-05-18'),('2085-05-19'),('2085-05-20'),('2085-05-21'),('2085-05-22'),('2085-05-23'),('2085-05-24'),('2085-05-25'),('2085-05-26'),('2085-05-27'),('2085-05-28'),('2085-05-29'),('2085-05-30'),('2085-05-31'),('2085-06-01'),('2085-06-02'),('2085-06-03'),('2085-06-04'),('2085-06-05'),('2085-06-06'),('2085-06-07'),('2085-06-08'),('2085-06-09'),('2085-06-10'),('2085-06-11'),('2085-06-12'),('2085-06-13'),('2085-06-14'),('2085-06-15'),('2085-06-16'),('2085-06-17'),('2085-06-18'),('2085-06-19'),('2085-06-20'),('2085-06-21'),('2085-06-22'),('2085-06-23'),('2085-06-24'),('2085-06-25'),('2085-06-26'),('2085-06-27'),('2085-06-28'),('2085-06-29'),('2085-06-30'),('2085-07-01'),('2085-07-02'),('2085-07-03'),('2085-07-04'),('2085-07-05'),('2085-07-06'),('2085-07-07'),('2085-07-08'),('2085-07-09'),('2085-07-10'),('2085-07-11'),('2085-07-12'),('2085-07-13'),('2085-07-14'),('2085-07-15'),('2085-07-16'),('2085-07-17'),('2085-07-18'),('2085-07-19'),('2085-07-20'),('2085-07-21'),('2085-07-22'),('2085-07-23'),('2085-07-24'),('2085-07-25'),('2085-07-26'),('2085-07-27'),('2085-07-28'),('2085-07-29'),('2085-07-30'),('2085-07-31'),('2085-08-01'),('2085-08-02'),('2085-08-03'),('2085-08-04'),('2085-08-05'),('2085-08-06'),('2085-08-07'),('2085-08-08'),('2085-08-09'),('2085-08-10'),('2085-08-11'),('2085-08-12'),('2085-08-13'),('2085-08-14'),('2085-08-15'),('2085-08-16'),('2085-08-17'),('2085-08-18'),('2085-08-19'),('2085-08-20'),('2085-08-21'),('2085-08-22'),('2085-08-23'),('2085-08-24'),('2085-08-25'),('2085-08-26'),('2085-08-27'),('2085-08-28'),('2085-08-29'),('2085-08-30'),('2085-08-31'),('2085-09-01'),('2085-09-02'),('2085-09-03'),('2085-09-04'),('2085-09-05'),('2085-09-06'),('2085-09-07'),('2085-09-08'),('2085-09-09'),('2085-09-10'),('2085-09-11'),('2085-09-12'),('2085-09-13'),('2085-09-14'),('2085-09-15'),('2085-09-16'),('2085-09-17'),('2085-09-18'),('2085-09-19'),('2085-09-20'),('2085-09-21'),('2085-09-22'),('2085-09-23'),('2085-09-24'),('2085-09-25'),('2085-09-26'),('2085-09-27'),('2085-09-28'),('2085-09-29'),('2085-09-30'),('2085-10-01'),('2085-10-02'),('2085-10-03'),('2085-10-04'),('2085-10-05'),('2085-10-06'),('2085-10-07'),('2085-10-08'),('2085-10-09'),('2085-10-10'),('2085-10-11'),('2085-10-12'),('2085-10-13'),('2085-10-14'),('2085-10-15'),('2085-10-16'),('2085-10-17'),('2085-10-18'),('2085-10-19'),('2085-10-20'),('2085-10-21'),('2085-10-22'),('2085-10-23'),('2085-10-24'),('2085-10-25'),('2085-10-26'),('2085-10-27'),('2085-10-28'),('2085-10-29'),('2085-10-30'),('2085-10-31'),('2085-11-01'),('2085-11-02'),('2085-11-03'),('2085-11-04'),('2085-11-05'),('2085-11-06'),('2085-11-07'),('2085-11-08'),('2085-11-09'),('2085-11-10'),('2085-11-11'),('2085-11-12'),('2085-11-13'),('2085-11-14'),('2085-11-15'),('2085-11-16'),('2085-11-17'),('2085-11-18'),('2085-11-19'),('2085-11-20'),('2085-11-21'),('2085-11-22'),('2085-11-23'),('2085-11-24'),('2085-11-25'),('2085-11-26'),('2085-11-27'),('2085-11-28'),('2085-11-29'),('2085-11-30'),('2085-12-01'),('2085-12-02'),('2085-12-03'),('2085-12-04'),('2085-12-05'),('2085-12-06'),('2085-12-07'),('2085-12-08'),('2085-12-09'),('2085-12-10'),('2085-12-11'),('2085-12-12'),('2085-12-13'),('2085-12-14'),('2085-12-15'),('2085-12-16'),('2085-12-17'),('2085-12-18'),('2085-12-19'),('2085-12-20'),('2085-12-21'),('2085-12-22'),('2085-12-23'),('2085-12-24'),('2085-12-25'),('2085-12-26'),('2085-12-27'),('2085-12-28'),('2085-12-29'),('2085-12-30'),('2085-12-31'),('2086-01-01'),('2086-01-02'),('2086-01-03'),('2086-01-04'),('2086-01-05'),('2086-01-06'),('2086-01-07'),('2086-01-08'),('2086-01-09'),('2086-01-10'),('2086-01-11'),('2086-01-12'),('2086-01-13'),('2086-01-14'),('2086-01-15'),('2086-01-16'),('2086-01-17'),('2086-01-18'),('2086-01-19'),('2086-01-20'),('2086-01-21'),('2086-01-22'),('2086-01-23'),('2086-01-24'),('2086-01-25'),('2086-01-26'),('2086-01-27'),('2086-01-28'),('2086-01-29'),('2086-01-30'),('2086-01-31'),('2086-02-01'),('2086-02-02'),('2086-02-03'),('2086-02-04'),('2086-02-05'),('2086-02-06'),('2086-02-07'),('2086-02-08'),('2086-02-09'),('2086-02-10'),('2086-02-11'),('2086-02-12'),('2086-02-13'),('2086-02-14'),('2086-02-15'),('2086-02-16'),('2086-02-17'),('2086-02-18'),('2086-02-19'),('2086-02-20'),('2086-02-21'),('2086-02-22'),('2086-02-23'),('2086-02-24'),('2086-02-25'),('2086-02-26'),('2086-02-27'),('2086-02-28'),('2086-03-01'),('2086-03-02'),('2086-03-03'),('2086-03-04'),('2086-03-05'),('2086-03-06'),('2086-03-07'),('2086-03-08'),('2086-03-09'),('2086-03-10'),('2086-03-11'),('2086-03-12'),('2086-03-13'),('2086-03-14'),('2086-03-15'),('2086-03-16'),('2086-03-17'),('2086-03-18'),('2086-03-19'),('2086-03-20'),('2086-03-21'),('2086-03-22'),('2086-03-23'),('2086-03-24'),('2086-03-25'),('2086-03-26'),('2086-03-27'),('2086-03-28'),('2086-03-29'),('2086-03-30'),('2086-03-31'),('2086-04-01'),('2086-04-02'),('2086-04-03'),('2086-04-04'),('2086-04-05'),('2086-04-06'),('2086-04-07'),('2086-04-08'),('2086-04-09'),('2086-04-10'),('2086-04-11'),('2086-04-12'),('2086-04-13'),('2086-04-14'),('2086-04-15'),('2086-04-16'),('2086-04-17'),('2086-04-18'),('2086-04-19'),('2086-04-20'),('2086-04-21'),('2086-04-22'),('2086-04-23'),('2086-04-24'),('2086-04-25'),('2086-04-26'),('2086-04-27'),('2086-04-28'),('2086-04-29'),('2086-04-30'),('2086-05-01'),('2086-05-02'),('2086-05-03'),('2086-05-04'),('2086-05-05'),('2086-05-06'),('2086-05-07'),('2086-05-08'),('2086-05-09'),('2086-05-10'),('2086-05-11'),('2086-05-12'),('2086-05-13'),('2086-05-14'),('2086-05-15'),('2086-05-16'),('2086-05-17'),('2086-05-18'),('2086-05-19'),('2086-05-20'),('2086-05-21'),('2086-05-22'),('2086-05-23'),('2086-05-24'),('2086-05-25'),('2086-05-26'),('2086-05-27'),('2086-05-28'),('2086-05-29'),('2086-05-30'),('2086-05-31'),('2086-06-01'),('2086-06-02'),('2086-06-03'),('2086-06-04'),('2086-06-05'),('2086-06-06'),('2086-06-07'),('2086-06-08'),('2086-06-09'),('2086-06-10'),('2086-06-11'),('2086-06-12'),('2086-06-13'),('2086-06-14'),('2086-06-15'),('2086-06-16'),('2086-06-17'),('2086-06-18'),('2086-06-19'),('2086-06-20'),('2086-06-21'),('2086-06-22'),('2086-06-23'),('2086-06-24'),('2086-06-25'),('2086-06-26'),('2086-06-27'),('2086-06-28'),('2086-06-29'),('2086-06-30'),('2086-07-01'),('2086-07-02'),('2086-07-03'),('2086-07-04'),('2086-07-05'),('2086-07-06'),('2086-07-07'),('2086-07-08'),('2086-07-09'),('2086-07-10'),('2086-07-11'),('2086-07-12'),('2086-07-13'),('2086-07-14'),('2086-07-15'),('2086-07-16'),('2086-07-17'),('2086-07-18'),('2086-07-19'),('2086-07-20'),('2086-07-21'),('2086-07-22'),('2086-07-23'),('2086-07-24'),('2086-07-25'),('2086-07-26'),('2086-07-27'),('2086-07-28'),('2086-07-29'),('2086-07-30'),('2086-07-31'),('2086-08-01'),('2086-08-02'),('2086-08-03'),('2086-08-04'),('2086-08-05'),('2086-08-06'),('2086-08-07'),('2086-08-08'),('2086-08-09'),('2086-08-10'),('2086-08-11'),('2086-08-12'),('2086-08-13'),('2086-08-14'),('2086-08-15'),('2086-08-16'),('2086-08-17'),('2086-08-18'),('2086-08-19'),('2086-08-20'),('2086-08-21'),('2086-08-22'),('2086-08-23'),('2086-08-24'),('2086-08-25'),('2086-08-26'),('2086-08-27'),('2086-08-28'),('2086-08-29'),('2086-08-30'),('2086-08-31'),('2086-09-01'),('2086-09-02'),('2086-09-03'),('2086-09-04'),('2086-09-05'),('2086-09-06'),('2086-09-07'),('2086-09-08'),('2086-09-09'),('2086-09-10'),('2086-09-11'),('2086-09-12'),('2086-09-13'),('2086-09-14'),('2086-09-15'),('2086-09-16'),('2086-09-17'),('2086-09-18'),('2086-09-19'),('2086-09-20'),('2086-09-21'),('2086-09-22'),('2086-09-23'),('2086-09-24'),('2086-09-25'),('2086-09-26'),('2086-09-27'),('2086-09-28'),('2086-09-29'),('2086-09-30'),('2086-10-01'),('2086-10-02'),('2086-10-03'),('2086-10-04'),('2086-10-05'),('2086-10-06'),('2086-10-07'),('2086-10-08'),('2086-10-09'),('2086-10-10'),('2086-10-11'),('2086-10-12'),('2086-10-13'),('2086-10-14'),('2086-10-15'),('2086-10-16'),('2086-10-17'),('2086-10-18'),('2086-10-19'),('2086-10-20'),('2086-10-21'),('2086-10-22'),('2086-10-23'),('2086-10-24'),('2086-10-25'),('2086-10-26'),('2086-10-27'),('2086-10-28'),('2086-10-29'),('2086-10-30'),('2086-10-31'),('2086-11-01'),('2086-11-02'),('2086-11-03'),('2086-11-04'),('2086-11-05'),('2086-11-06'),('2086-11-07'),('2086-11-08'),('2086-11-09'),('2086-11-10'),('2086-11-11'),('2086-11-12'),('2086-11-13'),('2086-11-14'),('2086-11-15'),('2086-11-16'),('2086-11-17'),('2086-11-18'),('2086-11-19'),('2086-11-20'),('2086-11-21'),('2086-11-22'),('2086-11-23'),('2086-11-24'),('2086-11-25'),('2086-11-26'),('2086-11-27'),('2086-11-28'),('2086-11-29'),('2086-11-30'),('2086-12-01'),('2086-12-02'),('2086-12-03'),('2086-12-04'),('2086-12-05'),('2086-12-06'),('2086-12-07'),('2086-12-08'),('2086-12-09'),('2086-12-10'),('2086-12-11'),('2086-12-12'),('2086-12-13'),('2086-12-14'),('2086-12-15'),('2086-12-16'),('2086-12-17'),('2086-12-18'),('2086-12-19'),('2086-12-20'),('2086-12-21'),('2086-12-22'),('2086-12-23'),('2086-12-24'),('2086-12-25'),('2086-12-26'),('2086-12-27'),('2086-12-28'),('2086-12-29'),('2086-12-30'),('2086-12-31'),('2087-01-01'),('2087-01-02'),('2087-01-03'),('2087-01-04'),('2087-01-05'),('2087-01-06'),('2087-01-07'),('2087-01-08'),('2087-01-09'),('2087-01-10'),('2087-01-11'),('2087-01-12'),('2087-01-13'),('2087-01-14'),('2087-01-15'),('2087-01-16'),('2087-01-17'),('2087-01-18'),('2087-01-19'),('2087-01-20'),('2087-01-21'),('2087-01-22'),('2087-01-23'),('2087-01-24'),('2087-01-25'),('2087-01-26'),('2087-01-27'),('2087-01-28'),('2087-01-29'),('2087-01-30'),('2087-01-31'),('2087-02-01'),('2087-02-02'),('2087-02-03'),('2087-02-04'),('2087-02-05'),('2087-02-06'),('2087-02-07'),('2087-02-08'),('2087-02-09'),('2087-02-10'),('2087-02-11'),('2087-02-12'),('2087-02-13'),('2087-02-14'),('2087-02-15'),('2087-02-16'),('2087-02-17'),('2087-02-18'),('2087-02-19'),('2087-02-20'),('2087-02-21'),('2087-02-22'),('2087-02-23'),('2087-02-24'),('2087-02-25'),('2087-02-26'),('2087-02-27'),('2087-02-28'),('2087-03-01'),('2087-03-02'),('2087-03-03'),('2087-03-04'),('2087-03-05'),('2087-03-06'),('2087-03-07'),('2087-03-08'),('2087-03-09'),('2087-03-10'),('2087-03-11'),('2087-03-12'),('2087-03-13'),('2087-03-14'),('2087-03-15'),('2087-03-16'),('2087-03-17'),('2087-03-18'),('2087-03-19'),('2087-03-20'),('2087-03-21'),('2087-03-22'),('2087-03-23'),('2087-03-24'),('2087-03-25'),('2087-03-26'),('2087-03-27'),('2087-03-28'),('2087-03-29'),('2087-03-30'),('2087-03-31'),('2087-04-01'),('2087-04-02'),('2087-04-03'),('2087-04-04'),('2087-04-05'),('2087-04-06'),('2087-04-07'),('2087-04-08'),('2087-04-09'),('2087-04-10'),('2087-04-11'),('2087-04-12'),('2087-04-13'),('2087-04-14'),('2087-04-15'),('2087-04-16'),('2087-04-17'),('2087-04-18'),('2087-04-19'),('2087-04-20'),('2087-04-21'),('2087-04-22'),('2087-04-23'),('2087-04-24'),('2087-04-25'),('2087-04-26'),('2087-04-27'),('2087-04-28'),('2087-04-29'),('2087-04-30'),('2087-05-01'),('2087-05-02'),('2087-05-03'),('2087-05-04'),('2087-05-05'),('2087-05-06'),('2087-05-07'),('2087-05-08'),('2087-05-09'),('2087-05-10'),('2087-05-11'),('2087-05-12'),('2087-05-13'),('2087-05-14'),('2087-05-15'),('2087-05-16'),('2087-05-17'),('2087-05-18'),('2087-05-19'),('2087-05-20'),('2087-05-21'),('2087-05-22'),('2087-05-23'),('2087-05-24'),('2087-05-25'),('2087-05-26'),('2087-05-27'),('2087-05-28'),('2087-05-29'),('2087-05-30'),('2087-05-31'),('2087-06-01'),('2087-06-02'),('2087-06-03'),('2087-06-04'),('2087-06-05'),('2087-06-06'),('2087-06-07'),('2087-06-08'),('2087-06-09'),('2087-06-10'),('2087-06-11'),('2087-06-12'),('2087-06-13'),('2087-06-14'),('2087-06-15'),('2087-06-16'),('2087-06-17'),('2087-06-18'),('2087-06-19'),('2087-06-20'),('2087-06-21'),('2087-06-22'),('2087-06-23'),('2087-06-24'),('2087-06-25'),('2087-06-26'),('2087-06-27'),('2087-06-28'),('2087-06-29'),('2087-06-30'),('2087-07-01'),('2087-07-02'),('2087-07-03'),('2087-07-04'),('2087-07-05'),('2087-07-06'),('2087-07-07'),('2087-07-08'),('2087-07-09'),('2087-07-10'),('2087-07-11'),('2087-07-12'),('2087-07-13'),('2087-07-14'),('2087-07-15'),('2087-07-16'),('2087-07-17'),('2087-07-18'),('2087-07-19'),('2087-07-20'),('2087-07-21'),('2087-07-22'),('2087-07-23'),('2087-07-24'),('2087-07-25'),('2087-07-26'),('2087-07-27'),('2087-07-28'),('2087-07-29'),('2087-07-30'),('2087-07-31'),('2087-08-01'),('2087-08-02'),('2087-08-03'),('2087-08-04'),('2087-08-05'),('2087-08-06'),('2087-08-07'),('2087-08-08'),('2087-08-09'),('2087-08-10'),('2087-08-11'),('2087-08-12'),('2087-08-13'),('2087-08-14'),('2087-08-15'),('2087-08-16'),('2087-08-17'),('2087-08-18'),('2087-08-19'),('2087-08-20'),('2087-08-21'),('2087-08-22'),('2087-08-23'),('2087-08-24'),('2087-08-25'),('2087-08-26'),('2087-08-27'),('2087-08-28'),('2087-08-29'),('2087-08-30'),('2087-08-31'),('2087-09-01'),('2087-09-02'),('2087-09-03'),('2087-09-04'),('2087-09-05'),('2087-09-06'),('2087-09-07'),('2087-09-08'),('2087-09-09'),('2087-09-10'),('2087-09-11'),('2087-09-12'),('2087-09-13'),('2087-09-14'),('2087-09-15'),('2087-09-16'),('2087-09-17'),('2087-09-18'),('2087-09-19'),('2087-09-20'),('2087-09-21'),('2087-09-22'),('2087-09-23'),('2087-09-24'),('2087-09-25'),('2087-09-26'),('2087-09-27'),('2087-09-28'),('2087-09-29'),('2087-09-30'),('2087-10-01'),('2087-10-02'),('2087-10-03'),('2087-10-04'),('2087-10-05'),('2087-10-06'),('2087-10-07'),('2087-10-08'),('2087-10-09'),('2087-10-10'),('2087-10-11'),('2087-10-12'),('2087-10-13'),('2087-10-14'),('2087-10-15'),('2087-10-16'),('2087-10-17'),('2087-10-18'),('2087-10-19'),('2087-10-20'),('2087-10-21'),('2087-10-22'),('2087-10-23'),('2087-10-24'),('2087-10-25'),('2087-10-26'),('2087-10-27'),('2087-10-28'),('2087-10-29'),('2087-10-30'),('2087-10-31'),('2087-11-01'),('2087-11-02'),('2087-11-03'),('2087-11-04'),('2087-11-05'),('2087-11-06'),('2087-11-07'),('2087-11-08'),('2087-11-09'),('2087-11-10'),('2087-11-11'),('2087-11-12'),('2087-11-13'),('2087-11-14'),('2087-11-15'),('2087-11-16'),('2087-11-17'),('2087-11-18'),('2087-11-19'),('2087-11-20'),('2087-11-21'),('2087-11-22'),('2087-11-23'),('2087-11-24'),('2087-11-25'),('2087-11-26'),('2087-11-27'),('2087-11-28'),('2087-11-29'),('2087-11-30'),('2087-12-01'),('2087-12-02'),('2087-12-03'),('2087-12-04'),('2087-12-05'),('2087-12-06'),('2087-12-07'),('2087-12-08'),('2087-12-09'),('2087-12-10'),('2087-12-11'),('2087-12-12'),('2087-12-13'),('2087-12-14'),('2087-12-15'),('2087-12-16'),('2087-12-17'),('2087-12-18'),('2087-12-19'),('2087-12-20'),('2087-12-21'),('2087-12-22'),('2087-12-23'),('2087-12-24'),('2087-12-25'),('2087-12-26'),('2087-12-27'),('2087-12-28'),('2087-12-29'),('2087-12-30'),('2087-12-31'),('2088-01-01'),('2088-01-02'),('2088-01-03'),('2088-01-04'),('2088-01-05'),('2088-01-06'),('2088-01-07'),('2088-01-08'),('2088-01-09'),('2088-01-10'),('2088-01-11'),('2088-01-12'),('2088-01-13'),('2088-01-14'),('2088-01-15'),('2088-01-16'),('2088-01-17'),('2088-01-18'),('2088-01-19'),('2088-01-20'),('2088-01-21'),('2088-01-22'),('2088-01-23'),('2088-01-24'),('2088-01-25'),('2088-01-26'),('2088-01-27'),('2088-01-28'),('2088-01-29'),('2088-01-30'),('2088-01-31'),('2088-02-01'),('2088-02-02'),('2088-02-03'),('2088-02-04'),('2088-02-05'),('2088-02-06'),('2088-02-07'),('2088-02-08'),('2088-02-09'),('2088-02-10'),('2088-02-11'),('2088-02-12'),('2088-02-13'),('2088-02-14'),('2088-02-15'),('2088-02-16'),('2088-02-17'),('2088-02-18'),('2088-02-19'),('2088-02-20'),('2088-02-21'),('2088-02-22'),('2088-02-23'),('2088-02-24'),('2088-02-25'),('2088-02-26'),('2088-02-27'),('2088-02-28'),('2088-02-29'),('2088-03-01'),('2088-03-02'),('2088-03-03'),('2088-03-04'),('2088-03-05'),('2088-03-06'),('2088-03-07'),('2088-03-08'),('2088-03-09'),('2088-03-10'),('2088-03-11'),('2088-03-12'),('2088-03-13'),('2088-03-14'),('2088-03-15'),('2088-03-16'),('2088-03-17'),('2088-03-18'),('2088-03-19'),('2088-03-20'),('2088-03-21'),('2088-03-22'),('2088-03-23'),('2088-03-24'),('2088-03-25'),('2088-03-26'),('2088-03-27'),('2088-03-28'),('2088-03-29'),('2088-03-30'),('2088-03-31'),('2088-04-01'),('2088-04-02'),('2088-04-03'),('2088-04-04'),('2088-04-05'),('2088-04-06'),('2088-04-07'),('2088-04-08'),('2088-04-09'),('2088-04-10'),('2088-04-11'),('2088-04-12'),('2088-04-13'),('2088-04-14'),('2088-04-15'),('2088-04-16'),('2088-04-17'),('2088-04-18'),('2088-04-19'),('2088-04-20'),('2088-04-21'),('2088-04-22'),('2088-04-23'),('2088-04-24'),('2088-04-25'),('2088-04-26'),('2088-04-27'),('2088-04-28'),('2088-04-29'),('2088-04-30'),('2088-05-01'),('2088-05-02'),('2088-05-03'),('2088-05-04'),('2088-05-05'),('2088-05-06'),('2088-05-07'),('2088-05-08'),('2088-05-09'),('2088-05-10'),('2088-05-11'),('2088-05-12'),('2088-05-13'),('2088-05-14'),('2088-05-15'),('2088-05-16'),('2088-05-17'),('2088-05-18'),('2088-05-19'),('2088-05-20'),('2088-05-21'),('2088-05-22'),('2088-05-23'),('2088-05-24'),('2088-05-25'),('2088-05-26'),('2088-05-27'),('2088-05-28'),('2088-05-29'),('2088-05-30'),('2088-05-31'),('2088-06-01'),('2088-06-02'),('2088-06-03'),('2088-06-04'),('2088-06-05'),('2088-06-06'),('2088-06-07'),('2088-06-08'),('2088-06-09'),('2088-06-10'),('2088-06-11'),('2088-06-12'),('2088-06-13'),('2088-06-14'),('2088-06-15'),('2088-06-16'),('2088-06-17'),('2088-06-18'),('2088-06-19'),('2088-06-20'),('2088-06-21'),('2088-06-22'),('2088-06-23'),('2088-06-24'),('2088-06-25'),('2088-06-26'),('2088-06-27'),('2088-06-28'),('2088-06-29'),('2088-06-30'),('2088-07-01'),('2088-07-02'),('2088-07-03'),('2088-07-04'),('2088-07-05'),('2088-07-06'),('2088-07-07'),('2088-07-08'),('2088-07-09'),('2088-07-10'),('2088-07-11'),('2088-07-12'),('2088-07-13'),('2088-07-14'),('2088-07-15'),('2088-07-16'),('2088-07-17'),('2088-07-18'),('2088-07-19'),('2088-07-20'),('2088-07-21'),('2088-07-22'),('2088-07-23'),('2088-07-24'),('2088-07-25'),('2088-07-26'),('2088-07-27'),('2088-07-28'),('2088-07-29'),('2088-07-30'),('2088-07-31'),('2088-08-01'),('2088-08-02'),('2088-08-03'),('2088-08-04'),('2088-08-05'),('2088-08-06'),('2088-08-07'),('2088-08-08'),('2088-08-09'),('2088-08-10'),('2088-08-11'),('2088-08-12'),('2088-08-13'),('2088-08-14'),('2088-08-15'),('2088-08-16'),('2088-08-17'),('2088-08-18'),('2088-08-19'),('2088-08-20'),('2088-08-21'),('2088-08-22'),('2088-08-23'),('2088-08-24'),('2088-08-25'),('2088-08-26'),('2088-08-27'),('2088-08-28'),('2088-08-29'),('2088-08-30'),('2088-08-31'),('2088-09-01'),('2088-09-02'),('2088-09-03'),('2088-09-04'),('2088-09-05'),('2088-09-06'),('2088-09-07'),('2088-09-08'),('2088-09-09'),('2088-09-10'),('2088-09-11'),('2088-09-12'),('2088-09-13'),('2088-09-14'),('2088-09-15'),('2088-09-16'),('2088-09-17'),('2088-09-18'),('2088-09-19'),('2088-09-20'),('2088-09-21'),('2088-09-22'),('2088-09-23'),('2088-09-24'),('2088-09-25'),('2088-09-26'),('2088-09-27'),('2088-09-28'),('2088-09-29'),('2088-09-30'),('2088-10-01'),('2088-10-02'),('2088-10-03'),('2088-10-04'),('2088-10-05'),('2088-10-06'),('2088-10-07'),('2088-10-08'),('2088-10-09'),('2088-10-10'),('2088-10-11'),('2088-10-12'),('2088-10-13'),('2088-10-14'),('2088-10-15'),('2088-10-16'),('2088-10-17'),('2088-10-18'),('2088-10-19'),('2088-10-20'),('2088-10-21'),('2088-10-22'),('2088-10-23'),('2088-10-24'),('2088-10-25'),('2088-10-26'),('2088-10-27'),('2088-10-28'),('2088-10-29'),('2088-10-30'),('2088-10-31'),('2088-11-01'),('2088-11-02'),('2088-11-03'),('2088-11-04'),('2088-11-05'),('2088-11-06'),('2088-11-07'),('2088-11-08'),('2088-11-09'),('2088-11-10'),('2088-11-11'),('2088-11-12'),('2088-11-13'),('2088-11-14'),('2088-11-15'),('2088-11-16'),('2088-11-17'),('2088-11-18'),('2088-11-19'),('2088-11-20'),('2088-11-21'),('2088-11-22'),('2088-11-23'),('2088-11-24'),('2088-11-25'),('2088-11-26'),('2088-11-27'),('2088-11-28'),('2088-11-29'),('2088-11-30'),('2088-12-01'),('2088-12-02'),('2088-12-03'),('2088-12-04'),('2088-12-05'),('2088-12-06'),('2088-12-07'),('2088-12-08'),('2088-12-09'),('2088-12-10'),('2088-12-11'),('2088-12-12'),('2088-12-13'),('2088-12-14'),('2088-12-15'),('2088-12-16'),('2088-12-17'),('2088-12-18'),('2088-12-19'),('2088-12-20'),('2088-12-21'),('2088-12-22'),('2088-12-23'),('2088-12-24'),('2088-12-25'),('2088-12-26'),('2088-12-27'),('2088-12-28'),('2088-12-29'),('2088-12-30'),('2088-12-31'),('2089-01-01'),('2089-01-02'),('2089-01-03'),('2089-01-04'),('2089-01-05'),('2089-01-06'),('2089-01-07'),('2089-01-08'),('2089-01-09'),('2089-01-10'),('2089-01-11'),('2089-01-12'),('2089-01-13'),('2089-01-14'),('2089-01-15'),('2089-01-16'),('2089-01-17'),('2089-01-18'),('2089-01-19'),('2089-01-20'),('2089-01-21'),('2089-01-22'),('2089-01-23'),('2089-01-24'),('2089-01-25'),('2089-01-26'),('2089-01-27'),('2089-01-28'),('2089-01-29'),('2089-01-30'),('2089-01-31'),('2089-02-01'),('2089-02-02'),('2089-02-03'),('2089-02-04'),('2089-02-05'),('2089-02-06'),('2089-02-07'),('2089-02-08'),('2089-02-09'),('2089-02-10'),('2089-02-11'),('2089-02-12'),('2089-02-13'),('2089-02-14'),('2089-02-15'),('2089-02-16'),('2089-02-17'),('2089-02-18'),('2089-02-19'),('2089-02-20'),('2089-02-21'),('2089-02-22'),('2089-02-23'),('2089-02-24'),('2089-02-25'),('2089-02-26'),('2089-02-27'),('2089-02-28'),('2089-03-01'),('2089-03-02'),('2089-03-03'),('2089-03-04'),('2089-03-05'),('2089-03-06'),('2089-03-07'),('2089-03-08'),('2089-03-09'),('2089-03-10'),('2089-03-11'),('2089-03-12'),('2089-03-13'),('2089-03-14'),('2089-03-15'),('2089-03-16'),('2089-03-17'),('2089-03-18'),('2089-03-19'),('2089-03-20'),('2089-03-21'),('2089-03-22'),('2089-03-23'),('2089-03-24'),('2089-03-25'),('2089-03-26'),('2089-03-27'),('2089-03-28'),('2089-03-29'),('2089-03-30'),('2089-03-31'),('2089-04-01'),('2089-04-02'),('2089-04-03'),('2089-04-04'),('2089-04-05'),('2089-04-06'),('2089-04-07'),('2089-04-08'),('2089-04-09'),('2089-04-10'),('2089-04-11'),('2089-04-12'),('2089-04-13'),('2089-04-14'),('2089-04-15'),('2089-04-16'),('2089-04-17'),('2089-04-18'),('2089-04-19'),('2089-04-20'),('2089-04-21'),('2089-04-22'),('2089-04-23'),('2089-04-24'),('2089-04-25'),('2089-04-26'),('2089-04-27'),('2089-04-28'),('2089-04-29'),('2089-04-30'),('2089-05-01'),('2089-05-02'),('2089-05-03'),('2089-05-04'),('2089-05-05'),('2089-05-06'),('2089-05-07'),('2089-05-08'),('2089-05-09'),('2089-05-10'),('2089-05-11'),('2089-05-12'),('2089-05-13'),('2089-05-14'),('2089-05-15'),('2089-05-16'),('2089-05-17'),('2089-05-18'),('2089-05-19'),('2089-05-20'),('2089-05-21'),('2089-05-22'),('2089-05-23'),('2089-05-24'),('2089-05-25'),('2089-05-26'),('2089-05-27'),('2089-05-28'),('2089-05-29'),('2089-05-30'),('2089-05-31'),('2089-06-01'),('2089-06-02'),('2089-06-03'),('2089-06-04'),('2089-06-05'),('2089-06-06'),('2089-06-07'),('2089-06-08'),('2089-06-09'),('2089-06-10'),('2089-06-11'),('2089-06-12'),('2089-06-13'),('2089-06-14'),('2089-06-15'),('2089-06-16'),('2089-06-17'),('2089-06-18'),('2089-06-19'),('2089-06-20'),('2089-06-21'),('2089-06-22'),('2089-06-23'),('2089-06-24'),('2089-06-25'),('2089-06-26'),('2089-06-27'),('2089-06-28'),('2089-06-29'),('2089-06-30'),('2089-07-01'),('2089-07-02'),('2089-07-03'),('2089-07-04'),('2089-07-05'),('2089-07-06'),('2089-07-07'),('2089-07-08'),('2089-07-09'),('2089-07-10'),('2089-07-11'),('2089-07-12'),('2089-07-13'),('2089-07-14'),('2089-07-15'),('2089-07-16'),('2089-07-17'),('2089-07-18'),('2089-07-19'),('2089-07-20'),('2089-07-21'),('2089-07-22'),('2089-07-23'),('2089-07-24'),('2089-07-25'),('2089-07-26'),('2089-07-27'),('2089-07-28'),('2089-07-29'),('2089-07-30'),('2089-07-31'),('2089-08-01'),('2089-08-02'),('2089-08-03'),('2089-08-04'),('2089-08-05'),('2089-08-06'),('2089-08-07'),('2089-08-08'),('2089-08-09'),('2089-08-10'),('2089-08-11'),('2089-08-12'),('2089-08-13'),('2089-08-14'),('2089-08-15'),('2089-08-16'),('2089-08-17'),('2089-08-18'),('2089-08-19'),('2089-08-20'),('2089-08-21'),('2089-08-22'),('2089-08-23'),('2089-08-24'),('2089-08-25'),('2089-08-26'),('2089-08-27'),('2089-08-28'),('2089-08-29'),('2089-08-30'),('2089-08-31'),('2089-09-01'),('2089-09-02'),('2089-09-03'),('2089-09-04'),('2089-09-05'),('2089-09-06'),('2089-09-07'),('2089-09-08'),('2089-09-09'),('2089-09-10'),('2089-09-11'),('2089-09-12'),('2089-09-13'),('2089-09-14'),('2089-09-15'),('2089-09-16'),('2089-09-17'),('2089-09-18'),('2089-09-19'),('2089-09-20'),('2089-09-21'),('2089-09-22'),('2089-09-23'),('2089-09-24'),('2089-09-25'),('2089-09-26'),('2089-09-27'),('2089-09-28'),('2089-09-29'),('2089-09-30'),('2089-10-01'),('2089-10-02'),('2089-10-03'),('2089-10-04'),('2089-10-05'),('2089-10-06'),('2089-10-07'),('2089-10-08'),('2089-10-09'),('2089-10-10'),('2089-10-11'),('2089-10-12'),('2089-10-13'),('2089-10-14'),('2089-10-15'),('2089-10-16'),('2089-10-17'),('2089-10-18'),('2089-10-19'),('2089-10-20'),('2089-10-21'),('2089-10-22'),('2089-10-23'),('2089-10-24'),('2089-10-25'),('2089-10-26'),('2089-10-27'),('2089-10-28'),('2089-10-29'),('2089-10-30'),('2089-10-31'),('2089-11-01'),('2089-11-02'),('2089-11-03'),('2089-11-04'),('2089-11-05'),('2089-11-06'),('2089-11-07'),('2089-11-08'),('2089-11-09'),('2089-11-10'),('2089-11-11'),('2089-11-12'),('2089-11-13'),('2089-11-14'),('2089-11-15'),('2089-11-16'),('2089-11-17'),('2089-11-18'),('2089-11-19'),('2089-11-20'),('2089-11-21'),('2089-11-22'),('2089-11-23'),('2089-11-24'),('2089-11-25'),('2089-11-26'),('2089-11-27'),('2089-11-28'),('2089-11-29'),('2089-11-30'),('2089-12-01'),('2089-12-02'),('2089-12-03'),('2089-12-04'),('2089-12-05'),('2089-12-06'),('2089-12-07'),('2089-12-08'),('2089-12-09'),('2089-12-10'),('2089-12-11'),('2089-12-12'),('2089-12-13'),('2089-12-14'),('2089-12-15'),('2089-12-16'),('2089-12-17'),('2089-12-18'),('2089-12-19'),('2089-12-20'),('2089-12-21'),('2089-12-22'),('2089-12-23'),('2089-12-24'),('2089-12-25'),('2089-12-26'),('2089-12-27'),('2089-12-28'),('2089-12-29'),('2089-12-30'),('2089-12-31'),('2090-01-01'),('2090-01-02'),('2090-01-03'),('2090-01-04'),('2090-01-05'),('2090-01-06'),('2090-01-07'),('2090-01-08'),('2090-01-09'),('2090-01-10'),('2090-01-11'),('2090-01-12'),('2090-01-13'),('2090-01-14'),('2090-01-15'),('2090-01-16'),('2090-01-17'),('2090-01-18'),('2090-01-19'),('2090-01-20'),('2090-01-21'),('2090-01-22'),('2090-01-23'),('2090-01-24'),('2090-01-25'),('2090-01-26'),('2090-01-27'),('2090-01-28'),('2090-01-29'),('2090-01-30'),('2090-01-31'),('2090-02-01'),('2090-02-02'),('2090-02-03'),('2090-02-04'),('2090-02-05'),('2090-02-06'),('2090-02-07'),('2090-02-08'),('2090-02-09'),('2090-02-10'),('2090-02-11'),('2090-02-12'),('2090-02-13'),('2090-02-14'),('2090-02-15'),('2090-02-16'),('2090-02-17'),('2090-02-18'),('2090-02-19'),('2090-02-20'),('2090-02-21'),('2090-02-22'),('2090-02-23'),('2090-02-24'),('2090-02-25'),('2090-02-26'),('2090-02-27'),('2090-02-28'),('2090-03-01'),('2090-03-02'),('2090-03-03'),('2090-03-04'),('2090-03-05'),('2090-03-06'),('2090-03-07'),('2090-03-08'),('2090-03-09'),('2090-03-10'),('2090-03-11'),('2090-03-12'),('2090-03-13'),('2090-03-14'),('2090-03-15'),('2090-03-16'),('2090-03-17'),('2090-03-18'),('2090-03-19'),('2090-03-20'),('2090-03-21'),('2090-03-22'),('2090-03-23'),('2090-03-24'),('2090-03-25'),('2090-03-26'),('2090-03-27'),('2090-03-28'),('2090-03-29'),('2090-03-30'),('2090-03-31'),('2090-04-01'),('2090-04-02'),('2090-04-03'),('2090-04-04'),('2090-04-05'),('2090-04-06'),('2090-04-07'),('2090-04-08'),('2090-04-09'),('2090-04-10'),('2090-04-11'),('2090-04-12'),('2090-04-13'),('2090-04-14'),('2090-04-15'),('2090-04-16'),('2090-04-17'),('2090-04-18'),('2090-04-19'),('2090-04-20'),('2090-04-21'),('2090-04-22'),('2090-04-23'),('2090-04-24'),('2090-04-25'),('2090-04-26'),('2090-04-27'),('2090-04-28'),('2090-04-29'),('2090-04-30'),('2090-05-01'),('2090-05-02'),('2090-05-03'),('2090-05-04'),('2090-05-05'),('2090-05-06'),('2090-05-07'),('2090-05-08'),('2090-05-09'),('2090-05-10'),('2090-05-11'),('2090-05-12'),('2090-05-13'),('2090-05-14'),('2090-05-15'),('2090-05-16'),('2090-05-17'),('2090-05-18'),('2090-05-19'),('2090-05-20'),('2090-05-21'),('2090-05-22'),('2090-05-23'),('2090-05-24'),('2090-05-25'),('2090-05-26'),('2090-05-27'),('2090-05-28'),('2090-05-29'),('2090-05-30'),('2090-05-31'),('2090-06-01'),('2090-06-02'),('2090-06-03'),('2090-06-04'),('2090-06-05'),('2090-06-06'),('2090-06-07'),('2090-06-08'),('2090-06-09'),('2090-06-10'),('2090-06-11'),('2090-06-12'),('2090-06-13'),('2090-06-14'),('2090-06-15'),('2090-06-16'),('2090-06-17'),('2090-06-18'),('2090-06-19'),('2090-06-20'),('2090-06-21'),('2090-06-22'),('2090-06-23'),('2090-06-24'),('2090-06-25'),('2090-06-26'),('2090-06-27'),('2090-06-28'),('2090-06-29'),('2090-06-30'),('2090-07-01'),('2090-07-02'),('2090-07-03'),('2090-07-04'),('2090-07-05'),('2090-07-06'),('2090-07-07'),('2090-07-08'),('2090-07-09'),('2090-07-10'),('2090-07-11'),('2090-07-12'),('2090-07-13'),('2090-07-14'),('2090-07-15'),('2090-07-16'),('2090-07-17'),('2090-07-18'),('2090-07-19'),('2090-07-20'),('2090-07-21'),('2090-07-22'),('2090-07-23'),('2090-07-24'),('2090-07-25'),('2090-07-26'),('2090-07-27'),('2090-07-28'),('2090-07-29'),('2090-07-30'),('2090-07-31'),('2090-08-01'),('2090-08-02'),('2090-08-03'),('2090-08-04'),('2090-08-05'),('2090-08-06'),('2090-08-07'),('2090-08-08'),('2090-08-09'),('2090-08-10'),('2090-08-11'),('2090-08-12'),('2090-08-13'),('2090-08-14'),('2090-08-15'),('2090-08-16'),('2090-08-17'),('2090-08-18'),('2090-08-19'),('2090-08-20'),('2090-08-21'),('2090-08-22'),('2090-08-23'),('2090-08-24'),('2090-08-25'),('2090-08-26'),('2090-08-27'),('2090-08-28'),('2090-08-29'),('2090-08-30'),('2090-08-31'),('2090-09-01'),('2090-09-02'),('2090-09-03'),('2090-09-04'),('2090-09-05'),('2090-09-06'),('2090-09-07'),('2090-09-08'),('2090-09-09'),('2090-09-10'),('2090-09-11'),('2090-09-12'),('2090-09-13'),('2090-09-14'),('2090-09-15'),('2090-09-16'),('2090-09-17'),('2090-09-18'),('2090-09-19'),('2090-09-20'),('2090-09-21'),('2090-09-22'),('2090-09-23'),('2090-09-24'),('2090-09-25'),('2090-09-26'),('2090-09-27'),('2090-09-28'),('2090-09-29'),('2090-09-30'),('2090-10-01'),('2090-10-02'),('2090-10-03'),('2090-10-04'),('2090-10-05'),('2090-10-06'),('2090-10-07'),('2090-10-08'),('2090-10-09'),('2090-10-10'),('2090-10-11'),('2090-10-12'),('2090-10-13'),('2090-10-14'),('2090-10-15'),('2090-10-16'),('2090-10-17'),('2090-10-18'),('2090-10-19'),('2090-10-20'),('2090-10-21'),('2090-10-22'),('2090-10-23'),('2090-10-24'),('2090-10-25'),('2090-10-26'),('2090-10-27'),('2090-10-28'),('2090-10-29'),('2090-10-30'),('2090-10-31'),('2090-11-01'),('2090-11-02'),('2090-11-03'),('2090-11-04'),('2090-11-05'),('2090-11-06'),('2090-11-07'),('2090-11-08'),('2090-11-09'),('2090-11-10'),('2090-11-11'),('2090-11-12'),('2090-11-13'),('2090-11-14'),('2090-11-15'),('2090-11-16'),('2090-11-17'),('2090-11-18'),('2090-11-19'),('2090-11-20'),('2090-11-21'),('2090-11-22'),('2090-11-23'),('2090-11-24'),('2090-11-25'),('2090-11-26'),('2090-11-27'),('2090-11-28'),('2090-11-29'),('2090-11-30'),('2090-12-01'),('2090-12-02'),('2090-12-03'),('2090-12-04'),('2090-12-05'),('2090-12-06'),('2090-12-07'),('2090-12-08'),('2090-12-09'),('2090-12-10'),('2090-12-11'),('2090-12-12'),('2090-12-13'),('2090-12-14'),('2090-12-15'),('2090-12-16'),('2090-12-17'),('2090-12-18'),('2090-12-19'),('2090-12-20'),('2090-12-21'),('2090-12-22'),('2090-12-23'),('2090-12-24'),('2090-12-25'),('2090-12-26'),('2090-12-27'),('2090-12-28'),('2090-12-29'),('2090-12-30'),('2090-12-31'),('2091-01-01'),('2091-01-02'),('2091-01-03'),('2091-01-04'),('2091-01-05'),('2091-01-06'),('2091-01-07'),('2091-01-08'),('2091-01-09'),('2091-01-10'),('2091-01-11'),('2091-01-12'),('2091-01-13'),('2091-01-14'),('2091-01-15'),('2091-01-16'),('2091-01-17'),('2091-01-18'),('2091-01-19'),('2091-01-20'),('2091-01-21'),('2091-01-22'),('2091-01-23'),('2091-01-24'),('2091-01-25'),('2091-01-26'),('2091-01-27'),('2091-01-28'),('2091-01-29'),('2091-01-30'),('2091-01-31'),('2091-02-01'),('2091-02-02'),('2091-02-03'),('2091-02-04'),('2091-02-05'),('2091-02-06'),('2091-02-07'),('2091-02-08'),('2091-02-09'),('2091-02-10'),('2091-02-11'),('2091-02-12'),('2091-02-13'),('2091-02-14'),('2091-02-15'),('2091-02-16'),('2091-02-17'),('2091-02-18'),('2091-02-19'),('2091-02-20'),('2091-02-21'),('2091-02-22'),('2091-02-23'),('2091-02-24'),('2091-02-25'),('2091-02-26'),('2091-02-27'),('2091-02-28'),('2091-03-01'),('2091-03-02'),('2091-03-03'),('2091-03-04'),('2091-03-05'),('2091-03-06'),('2091-03-07'),('2091-03-08'),('2091-03-09'),('2091-03-10'),('2091-03-11'),('2091-03-12'),('2091-03-13'),('2091-03-14'),('2091-03-15'),('2091-03-16'),('2091-03-17'),('2091-03-18'),('2091-03-19'),('2091-03-20'),('2091-03-21'),('2091-03-22'),('2091-03-23'),('2091-03-24'),('2091-03-25'),('2091-03-26'),('2091-03-27'),('2091-03-28'),('2091-03-29'),('2091-03-30'),('2091-03-31'),('2091-04-01'),('2091-04-02'),('2091-04-03'),('2091-04-04'),('2091-04-05'),('2091-04-06'),('2091-04-07'),('2091-04-08'),('2091-04-09'),('2091-04-10'),('2091-04-11'),('2091-04-12'),('2091-04-13'),('2091-04-14'),('2091-04-15'),('2091-04-16'),('2091-04-17'),('2091-04-18'),('2091-04-19'),('2091-04-20'),('2091-04-21'),('2091-04-22'),('2091-04-23'),('2091-04-24'),('2091-04-25'),('2091-04-26'),('2091-04-27'),('2091-04-28'),('2091-04-29'),('2091-04-30'),('2091-05-01'),('2091-05-02'),('2091-05-03'),('2091-05-04'),('2091-05-05'),('2091-05-06'),('2091-05-07'),('2091-05-08'),('2091-05-09'),('2091-05-10'),('2091-05-11'),('2091-05-12'),('2091-05-13'),('2091-05-14'),('2091-05-15'),('2091-05-16'),('2091-05-17'),('2091-05-18'),('2091-05-19'),('2091-05-20'),('2091-05-21'),('2091-05-22'),('2091-05-23'),('2091-05-24'),('2091-05-25'),('2091-05-26'),('2091-05-27'),('2091-05-28'),('2091-05-29'),('2091-05-30'),('2091-05-31'),('2091-06-01'),('2091-06-02'),('2091-06-03'),('2091-06-04'),('2091-06-05'),('2091-06-06'),('2091-06-07'),('2091-06-08'),('2091-06-09'),('2091-06-10'),('2091-06-11'),('2091-06-12'),('2091-06-13'),('2091-06-14'),('2091-06-15'),('2091-06-16'),('2091-06-17'),('2091-06-18'),('2091-06-19'),('2091-06-20'),('2091-06-21'),('2091-06-22'),('2091-06-23'),('2091-06-24'),('2091-06-25'),('2091-06-26'),('2091-06-27'),('2091-06-28'),('2091-06-29'),('2091-06-30'),('2091-07-01'),('2091-07-02'),('2091-07-03'),('2091-07-04'),('2091-07-05'),('2091-07-06'),('2091-07-07'),('2091-07-08'),('2091-07-09'),('2091-07-10'),('2091-07-11'),('2091-07-12'),('2091-07-13'),('2091-07-14'),('2091-07-15'),('2091-07-16'),('2091-07-17'),('2091-07-18'),('2091-07-19'),('2091-07-20'),('2091-07-21'),('2091-07-22'),('2091-07-23'),('2091-07-24'),('2091-07-25'),('2091-07-26'),('2091-07-27'),('2091-07-28'),('2091-07-29'),('2091-07-30'),('2091-07-31'),('2091-08-01'),('2091-08-02'),('2091-08-03'),('2091-08-04'),('2091-08-05'),('2091-08-06'),('2091-08-07'),('2091-08-08'),('2091-08-09'),('2091-08-10'),('2091-08-11'),('2091-08-12'),('2091-08-13'),('2091-08-14'),('2091-08-15'),('2091-08-16'),('2091-08-17'),('2091-08-18'),('2091-08-19'),('2091-08-20'),('2091-08-21'),('2091-08-22'),('2091-08-23'),('2091-08-24'),('2091-08-25'),('2091-08-26'),('2091-08-27'),('2091-08-28'),('2091-08-29'),('2091-08-30'),('2091-08-31'),('2091-09-01'),('2091-09-02'),('2091-09-03'),('2091-09-04'),('2091-09-05'),('2091-09-06'),('2091-09-07'),('2091-09-08'),('2091-09-09'),('2091-09-10'),('2091-09-11'),('2091-09-12'),('2091-09-13'),('2091-09-14'),('2091-09-15'),('2091-09-16'),('2091-09-17'),('2091-09-18'),('2091-09-19'),('2091-09-20'),('2091-09-21'),('2091-09-22'),('2091-09-23'),('2091-09-24'),('2091-09-25'),('2091-09-26'),('2091-09-27'),('2091-09-28'),('2091-09-29'),('2091-09-30'),('2091-10-01'),('2091-10-02'),('2091-10-03'),('2091-10-04'),('2091-10-05'),('2091-10-06'),('2091-10-07'),('2091-10-08'),('2091-10-09'),('2091-10-10'),('2091-10-11'),('2091-10-12'),('2091-10-13'),('2091-10-14'),('2091-10-15'),('2091-10-16'),('2091-10-17'),('2091-10-18'),('2091-10-19'),('2091-10-20'),('2091-10-21'),('2091-10-22'),('2091-10-23'),('2091-10-24'),('2091-10-25'),('2091-10-26'),('2091-10-27'),('2091-10-28'),('2091-10-29'),('2091-10-30'),('2091-10-31'),('2091-11-01'),('2091-11-02'),('2091-11-03'),('2091-11-04'),('2091-11-05'),('2091-11-06'),('2091-11-07'),('2091-11-08'),('2091-11-09'),('2091-11-10'),('2091-11-11'),('2091-11-12'),('2091-11-13'),('2091-11-14'),('2091-11-15'),('2091-11-16'),('2091-11-17'),('2091-11-18'),('2091-11-19'),('2091-11-20'),('2091-11-21'),('2091-11-22'),('2091-11-23'),('2091-11-24'),('2091-11-25'),('2091-11-26'),('2091-11-27'),('2091-11-28'),('2091-11-29'),('2091-11-30'),('2091-12-01'),('2091-12-02'),('2091-12-03'),('2091-12-04'),('2091-12-05'),('2091-12-06'),('2091-12-07'),('2091-12-08'),('2091-12-09'),('2091-12-10'),('2091-12-11'),('2091-12-12'),('2091-12-13'),('2091-12-14'),('2091-12-15'),('2091-12-16'),('2091-12-17'),('2091-12-18'),('2091-12-19'),('2091-12-20'),('2091-12-21'),('2091-12-22'),('2091-12-23'),('2091-12-24'),('2091-12-25'),('2091-12-26'),('2091-12-27'),('2091-12-28'),('2091-12-29'),('2091-12-30'),('2091-12-31'),('2092-01-01'),('2092-01-02'),('2092-01-03'),('2092-01-04'),('2092-01-05'),('2092-01-06'),('2092-01-07'),('2092-01-08'),('2092-01-09'),('2092-01-10'),('2092-01-11'),('2092-01-12'),('2092-01-13'),('2092-01-14'),('2092-01-15'),('2092-01-16'),('2092-01-17'),('2092-01-18'),('2092-01-19'),('2092-01-20'),('2092-01-21'),('2092-01-22'),('2092-01-23'),('2092-01-24'),('2092-01-25'),('2092-01-26'),('2092-01-27'),('2092-01-28'),('2092-01-29'),('2092-01-30'),('2092-01-31'),('2092-02-01'),('2092-02-02'),('2092-02-03'),('2092-02-04'),('2092-02-05'),('2092-02-06'),('2092-02-07'),('2092-02-08'),('2092-02-09'),('2092-02-10'),('2092-02-11'),('2092-02-12'),('2092-02-13'),('2092-02-14'),('2092-02-15'),('2092-02-16'),('2092-02-17'),('2092-02-18'),('2092-02-19'),('2092-02-20'),('2092-02-21'),('2092-02-22'),('2092-02-23'),('2092-02-24'),('2092-02-25'),('2092-02-26'),('2092-02-27'),('2092-02-28'),('2092-02-29'),('2092-03-01'),('2092-03-02'),('2092-03-03'),('2092-03-04'),('2092-03-05'),('2092-03-06'),('2092-03-07'),('2092-03-08'),('2092-03-09'),('2092-03-10'),('2092-03-11'),('2092-03-12'),('2092-03-13'),('2092-03-14'),('2092-03-15'),('2092-03-16'),('2092-03-17'),('2092-03-18'),('2092-03-19'),('2092-03-20'),('2092-03-21'),('2092-03-22'),('2092-03-23'),('2092-03-24'),('2092-03-25'),('2092-03-26'),('2092-03-27'),('2092-03-28'),('2092-03-29'),('2092-03-30'),('2092-03-31'),('2092-04-01'),('2092-04-02'),('2092-04-03'),('2092-04-04'),('2092-04-05'),('2092-04-06'),('2092-04-07'),('2092-04-08'),('2092-04-09'),('2092-04-10'),('2092-04-11'),('2092-04-12'),('2092-04-13'),('2092-04-14'),('2092-04-15'),('2092-04-16'),('2092-04-17'),('2092-04-18'),('2092-04-19'),('2092-04-20'),('2092-04-21'),('2092-04-22'),('2092-04-23'),('2092-04-24'),('2092-04-25'),('2092-04-26'),('2092-04-27'),('2092-04-28'),('2092-04-29'),('2092-04-30'),('2092-05-01'),('2092-05-02'),('2092-05-03'),('2092-05-04'),('2092-05-05'),('2092-05-06'),('2092-05-07'),('2092-05-08'),('2092-05-09'),('2092-05-10'),('2092-05-11'),('2092-05-12'),('2092-05-13'),('2092-05-14'),('2092-05-15'),('2092-05-16'),('2092-05-17'),('2092-05-18'),('2092-05-19'),('2092-05-20'),('2092-05-21'),('2092-05-22'),('2092-05-23'),('2092-05-24'),('2092-05-25'),('2092-05-26'),('2092-05-27'),('2092-05-28'),('2092-05-29'),('2092-05-30'),('2092-05-31'),('2092-06-01'),('2092-06-02'),('2092-06-03'),('2092-06-04'),('2092-06-05'),('2092-06-06'),('2092-06-07'),('2092-06-08'),('2092-06-09'),('2092-06-10'),('2092-06-11'),('2092-06-12'),('2092-06-13'),('2092-06-14'),('2092-06-15'),('2092-06-16'),('2092-06-17'),('2092-06-18'),('2092-06-19'),('2092-06-20'),('2092-06-21'),('2092-06-22'),('2092-06-23'),('2092-06-24'),('2092-06-25'),('2092-06-26'),('2092-06-27'),('2092-06-28'),('2092-06-29'),('2092-06-30'),('2092-07-01'),('2092-07-02'),('2092-07-03'),('2092-07-04'),('2092-07-05'),('2092-07-06'),('2092-07-07'),('2092-07-08'),('2092-07-09'),('2092-07-10'),('2092-07-11'),('2092-07-12'),('2092-07-13'),('2092-07-14'),('2092-07-15'),('2092-07-16'),('2092-07-17'),('2092-07-18'),('2092-07-19'),('2092-07-20'),('2092-07-21'),('2092-07-22'),('2092-07-23'),('2092-07-24'),('2092-07-25'),('2092-07-26'),('2092-07-27'),('2092-07-28'),('2092-07-29'),('2092-07-30'),('2092-07-31'),('2092-08-01'),('2092-08-02'),('2092-08-03'),('2092-08-04'),('2092-08-05'),('2092-08-06'),('2092-08-07'),('2092-08-08'),('2092-08-09'),('2092-08-10'),('2092-08-11'),('2092-08-12'),('2092-08-13'),('2092-08-14'),('2092-08-15'),('2092-08-16'),('2092-08-17'),('2092-08-18'),('2092-08-19'),('2092-08-20'),('2092-08-21'),('2092-08-22'),('2092-08-23'),('2092-08-24'),('2092-08-25'),('2092-08-26'),('2092-08-27'),('2092-08-28'),('2092-08-29'),('2092-08-30'),('2092-08-31'),('2092-09-01'),('2092-09-02'),('2092-09-03'),('2092-09-04'),('2092-09-05'),('2092-09-06'),('2092-09-07'),('2092-09-08'),('2092-09-09'),('2092-09-10'),('2092-09-11'),('2092-09-12'),('2092-09-13'),('2092-09-14'),('2092-09-15'),('2092-09-16'),('2092-09-17'),('2092-09-18'),('2092-09-19'),('2092-09-20'),('2092-09-21'),('2092-09-22'),('2092-09-23'),('2092-09-24'),('2092-09-25'),('2092-09-26'),('2092-09-27'),('2092-09-28'),('2092-09-29'),('2092-09-30'),('2092-10-01'),('2092-10-02'),('2092-10-03'),('2092-10-04'),('2092-10-05'),('2092-10-06'),('2092-10-07'),('2092-10-08'),('2092-10-09'),('2092-10-10'),('2092-10-11'),('2092-10-12'),('2092-10-13'),('2092-10-14'),('2092-10-15'),('2092-10-16'),('2092-10-17'),('2092-10-18'),('2092-10-19'),('2092-10-20'),('2092-10-21'),('2092-10-22'),('2092-10-23'),('2092-10-24'),('2092-10-25'),('2092-10-26'),('2092-10-27'),('2092-10-28'),('2092-10-29'),('2092-10-30'),('2092-10-31'),('2092-11-01'),('2092-11-02'),('2092-11-03'),('2092-11-04'),('2092-11-05'),('2092-11-06'),('2092-11-07'),('2092-11-08'),('2092-11-09'),('2092-11-10'),('2092-11-11'),('2092-11-12'),('2092-11-13'),('2092-11-14'),('2092-11-15'),('2092-11-16'),('2092-11-17'),('2092-11-18'),('2092-11-19'),('2092-11-20'),('2092-11-21'),('2092-11-22'),('2092-11-23'),('2092-11-24'),('2092-11-25'),('2092-11-26'),('2092-11-27'),('2092-11-28'),('2092-11-29'),('2092-11-30'),('2092-12-01'),('2092-12-02'),('2092-12-03'),('2092-12-04'),('2092-12-05'),('2092-12-06'),('2092-12-07'),('2092-12-08'),('2092-12-09'),('2092-12-10'),('2092-12-11'),('2092-12-12'),('2092-12-13'),('2092-12-14'),('2092-12-15'),('2092-12-16'),('2092-12-17'),('2092-12-18'),('2092-12-19'),('2092-12-20'),('2092-12-21'),('2092-12-22'),('2092-12-23'),('2092-12-24'),('2092-12-25'),('2092-12-26'),('2092-12-27'),('2092-12-28'),('2092-12-29'),('2092-12-30'),('2092-12-31'),('2093-01-01'),('2093-01-02'),('2093-01-03'),('2093-01-04'),('2093-01-05'),('2093-01-06'),('2093-01-07'),('2093-01-08'),('2093-01-09'),('2093-01-10'),('2093-01-11'),('2093-01-12'),('2093-01-13'),('2093-01-14'),('2093-01-15'),('2093-01-16'),('2093-01-17'),('2093-01-18'),('2093-01-19'),('2093-01-20'),('2093-01-21'),('2093-01-22'),('2093-01-23'),('2093-01-24'),('2093-01-25'),('2093-01-26'),('2093-01-27'),('2093-01-28'),('2093-01-29'),('2093-01-30'),('2093-01-31'),('2093-02-01'),('2093-02-02'),('2093-02-03'),('2093-02-04'),('2093-02-05'),('2093-02-06'),('2093-02-07'),('2093-02-08'),('2093-02-09'),('2093-02-10'),('2093-02-11'),('2093-02-12'),('2093-02-13'),('2093-02-14'),('2093-02-15'),('2093-02-16'),('2093-02-17'),('2093-02-18'),('2093-02-19'),('2093-02-20'),('2093-02-21'),('2093-02-22'),('2093-02-23'),('2093-02-24'),('2093-02-25'),('2093-02-26'),('2093-02-27'),('2093-02-28'),('2093-03-01'),('2093-03-02'),('2093-03-03'),('2093-03-04'),('2093-03-05'),('2093-03-06'),('2093-03-07'),('2093-03-08'),('2093-03-09'),('2093-03-10'),('2093-03-11'),('2093-03-12'),('2093-03-13'),('2093-03-14'),('2093-03-15'),('2093-03-16'),('2093-03-17'),('2093-03-18'),('2093-03-19'),('2093-03-20'),('2093-03-21'),('2093-03-22'),('2093-03-23'),('2093-03-24'),('2093-03-25'),('2093-03-26'),('2093-03-27'),('2093-03-28'),('2093-03-29'),('2093-03-30'),('2093-03-31'),('2093-04-01'),('2093-04-02'),('2093-04-03'),('2093-04-04'),('2093-04-05'),('2093-04-06'),('2093-04-07'),('2093-04-08'),('2093-04-09'),('2093-04-10'),('2093-04-11'),('2093-04-12'),('2093-04-13'),('2093-04-14'),('2093-04-15'),('2093-04-16'),('2093-04-17'),('2093-04-18'),('2093-04-19'),('2093-04-20'),('2093-04-21'),('2093-04-22'),('2093-04-23'),('2093-04-24'),('2093-04-25'),('2093-04-26'),('2093-04-27'),('2093-04-28'),('2093-04-29'),('2093-04-30'),('2093-05-01'),('2093-05-02'),('2093-05-03'),('2093-05-04'),('2093-05-05'),('2093-05-06'),('2093-05-07'),('2093-05-08'),('2093-05-09'),('2093-05-10'),('2093-05-11'),('2093-05-12'),('2093-05-13'),('2093-05-14'),('2093-05-15'),('2093-05-16'),('2093-05-17'),('2093-05-18'),('2093-05-19'),('2093-05-20'),('2093-05-21'),('2093-05-22'),('2093-05-23'),('2093-05-24'),('2093-05-25'),('2093-05-26'),('2093-05-27'),('2093-05-28'),('2093-05-29'),('2093-05-30'),('2093-05-31'),('2093-06-01'),('2093-06-02'),('2093-06-03'),('2093-06-04'),('2093-06-05'),('2093-06-06'),('2093-06-07'),('2093-06-08'),('2093-06-09'),('2093-06-10'),('2093-06-11'),('2093-06-12'),('2093-06-13'),('2093-06-14'),('2093-06-15'),('2093-06-16'),('2093-06-17'),('2093-06-18'),('2093-06-19'),('2093-06-20'),('2093-06-21'),('2093-06-22'),('2093-06-23'),('2093-06-24'),('2093-06-25'),('2093-06-26'),('2093-06-27'),('2093-06-28'),('2093-06-29'),('2093-06-30'),('2093-07-01'),('2093-07-02'),('2093-07-03'),('2093-07-04'),('2093-07-05'),('2093-07-06'),('2093-07-07'),('2093-07-08'),('2093-07-09'),('2093-07-10'),('2093-07-11'),('2093-07-12'),('2093-07-13'),('2093-07-14'),('2093-07-15'),('2093-07-16'),('2093-07-17'),('2093-07-18'),('2093-07-19'),('2093-07-20'),('2093-07-21'),('2093-07-22'),('2093-07-23'),('2093-07-24'),('2093-07-25'),('2093-07-26'),('2093-07-27'),('2093-07-28'),('2093-07-29'),('2093-07-30'),('2093-07-31'),('2093-08-01'),('2093-08-02'),('2093-08-03'),('2093-08-04'),('2093-08-05'),('2093-08-06'),('2093-08-07'),('2093-08-08'),('2093-08-09'),('2093-08-10'),('2093-08-11'),('2093-08-12'),('2093-08-13'),('2093-08-14'),('2093-08-15'),('2093-08-16'),('2093-08-17'),('2093-08-18'),('2093-08-19'),('2093-08-20'),('2093-08-21'),('2093-08-22'),('2093-08-23'),('2093-08-24'),('2093-08-25'),('2093-08-26'),('2093-08-27'),('2093-08-28'),('2093-08-29'),('2093-08-30'),('2093-08-31'),('2093-09-01'),('2093-09-02'),('2093-09-03'),('2093-09-04'),('2093-09-05'),('2093-09-06'),('2093-09-07'),('2093-09-08'),('2093-09-09'),('2093-09-10'),('2093-09-11'),('2093-09-12'),('2093-09-13'),('2093-09-14'),('2093-09-15'),('2093-09-16'),('2093-09-17'),('2093-09-18'),('2093-09-19'),('2093-09-20'),('2093-09-21'),('2093-09-22'),('2093-09-23'),('2093-09-24'),('2093-09-25'),('2093-09-26'),('2093-09-27'),('2093-09-28'),('2093-09-29'),('2093-09-30'),('2093-10-01'),('2093-10-02'),('2093-10-03'),('2093-10-04'),('2093-10-05'),('2093-10-06'),('2093-10-07'),('2093-10-08'),('2093-10-09'),('2093-10-10'),('2093-10-11'),('2093-10-12'),('2093-10-13'),('2093-10-14'),('2093-10-15'),('2093-10-16'),('2093-10-17'),('2093-10-18'),('2093-10-19'),('2093-10-20'),('2093-10-21'),('2093-10-22'),('2093-10-23'),('2093-10-24'),('2093-10-25'),('2093-10-26'),('2093-10-27'),('2093-10-28'),('2093-10-29'),('2093-10-30'),('2093-10-31'),('2093-11-01'),('2093-11-02'),('2093-11-03'),('2093-11-04'),('2093-11-05'),('2093-11-06'),('2093-11-07'),('2093-11-08'),('2093-11-09'),('2093-11-10'),('2093-11-11'),('2093-11-12'),('2093-11-13'),('2093-11-14'),('2093-11-15'),('2093-11-16'),('2093-11-17'),('2093-11-18'),('2093-11-19'),('2093-11-20'),('2093-11-21'),('2093-11-22'),('2093-11-23'),('2093-11-24'),('2093-11-25'),('2093-11-26'),('2093-11-27'),('2093-11-28'),('2093-11-29'),('2093-11-30'),('2093-12-01'),('2093-12-02'),('2093-12-03'),('2093-12-04'),('2093-12-05'),('2093-12-06'),('2093-12-07'),('2093-12-08'),('2093-12-09'),('2093-12-10'),('2093-12-11'),('2093-12-12'),('2093-12-13'),('2093-12-14'),('2093-12-15'),('2093-12-16'),('2093-12-17'),('2093-12-18'),('2093-12-19'),('2093-12-20'),('2093-12-21'),('2093-12-22'),('2093-12-23'),('2093-12-24'),('2093-12-25'),('2093-12-26'),('2093-12-27'),('2093-12-28'),('2093-12-29'),('2093-12-30'),('2093-12-31'),('2094-01-01'),('2094-01-02'),('2094-01-03'),('2094-01-04'),('2094-01-05'),('2094-01-06'),('2094-01-07'),('2094-01-08'),('2094-01-09'),('2094-01-10'),('2094-01-11'),('2094-01-12'),('2094-01-13'),('2094-01-14'),('2094-01-15'),('2094-01-16'),('2094-01-17'),('2094-01-18'),('2094-01-19'),('2094-01-20'),('2094-01-21'),('2094-01-22'),('2094-01-23'),('2094-01-24'),('2094-01-25'),('2094-01-26'),('2094-01-27'),('2094-01-28'),('2094-01-29'),('2094-01-30'),('2094-01-31'),('2094-02-01'),('2094-02-02'),('2094-02-03'),('2094-02-04'),('2094-02-05'),('2094-02-06'),('2094-02-07'),('2094-02-08'),('2094-02-09'),('2094-02-10'),('2094-02-11'),('2094-02-12'),('2094-02-13'),('2094-02-14'),('2094-02-15'),('2094-02-16'),('2094-02-17'),('2094-02-18'),('2094-02-19'),('2094-02-20'),('2094-02-21'),('2094-02-22'),('2094-02-23'),('2094-02-24'),('2094-02-25'),('2094-02-26'),('2094-02-27'),('2094-02-28'),('2094-03-01'),('2094-03-02'),('2094-03-03'),('2094-03-04'),('2094-03-05'),('2094-03-06'),('2094-03-07'),('2094-03-08'),('2094-03-09'),('2094-03-10'),('2094-03-11'),('2094-03-12'),('2094-03-13'),('2094-03-14'),('2094-03-15'),('2094-03-16'),('2094-03-17'),('2094-03-18'),('2094-03-19'),('2094-03-20'),('2094-03-21'),('2094-03-22'),('2094-03-23'),('2094-03-24'),('2094-03-25'),('2094-03-26'),('2094-03-27'),('2094-03-28'),('2094-03-29'),('2094-03-30'),('2094-03-31'),('2094-04-01'),('2094-04-02'),('2094-04-03'),('2094-04-04'),('2094-04-05'),('2094-04-06'),('2094-04-07'),('2094-04-08'),('2094-04-09'),('2094-04-10'),('2094-04-11'),('2094-04-12'),('2094-04-13'),('2094-04-14'),('2094-04-15'),('2094-04-16'),('2094-04-17'),('2094-04-18'),('2094-04-19'),('2094-04-20'),('2094-04-21'),('2094-04-22'),('2094-04-23'),('2094-04-24'),('2094-04-25'),('2094-04-26'),('2094-04-27'),('2094-04-28'),('2094-04-29'),('2094-04-30'),('2094-05-01'),('2094-05-02'),('2094-05-03'),('2094-05-04'),('2094-05-05'),('2094-05-06'),('2094-05-07'),('2094-05-08'),('2094-05-09'),('2094-05-10'),('2094-05-11'),('2094-05-12'),('2094-05-13'),('2094-05-14'),('2094-05-15'),('2094-05-16'),('2094-05-17'),('2094-05-18'),('2094-05-19'),('2094-05-20'),('2094-05-21'),('2094-05-22'),('2094-05-23'),('2094-05-24'),('2094-05-25'),('2094-05-26'),('2094-05-27'),('2094-05-28'),('2094-05-29'),('2094-05-30'),('2094-05-31'),('2094-06-01'),('2094-06-02'),('2094-06-03'),('2094-06-04'),('2094-06-05'),('2094-06-06'),('2094-06-07'),('2094-06-08'),('2094-06-09'),('2094-06-10'),('2094-06-11'),('2094-06-12'),('2094-06-13'),('2094-06-14'),('2094-06-15'),('2094-06-16'),('2094-06-17'),('2094-06-18'),('2094-06-19'),('2094-06-20'),('2094-06-21'),('2094-06-22'),('2094-06-23'),('2094-06-24'),('2094-06-25'),('2094-06-26'),('2094-06-27'),('2094-06-28'),('2094-06-29'),('2094-06-30'),('2094-07-01'),('2094-07-02'),('2094-07-03'),('2094-07-04'),('2094-07-05'),('2094-07-06'),('2094-07-07'),('2094-07-08'),('2094-07-09'),('2094-07-10'),('2094-07-11'),('2094-07-12'),('2094-07-13'),('2094-07-14'),('2094-07-15'),('2094-07-16'),('2094-07-17'),('2094-07-18'),('2094-07-19'),('2094-07-20'),('2094-07-21'),('2094-07-22'),('2094-07-23'),('2094-07-24'),('2094-07-25'),('2094-07-26'),('2094-07-27'),('2094-07-28'),('2094-07-29'),('2094-07-30'),('2094-07-31'),('2094-08-01'),('2094-08-02'),('2094-08-03'),('2094-08-04'),('2094-08-05'),('2094-08-06'),('2094-08-07'),('2094-08-08'),('2094-08-09'),('2094-08-10'),('2094-08-11'),('2094-08-12'),('2094-08-13'),('2094-08-14'),('2094-08-15'),('2094-08-16'),('2094-08-17'),('2094-08-18'),('2094-08-19'),('2094-08-20'),('2094-08-21'),('2094-08-22'),('2094-08-23'),('2094-08-24'),('2094-08-25'),('2094-08-26'),('2094-08-27'),('2094-08-28'),('2094-08-29'),('2094-08-30'),('2094-08-31'),('2094-09-01'),('2094-09-02'),('2094-09-03'),('2094-09-04'),('2094-09-05'),('2094-09-06'),('2094-09-07'),('2094-09-08'),('2094-09-09'),('2094-09-10'),('2094-09-11'),('2094-09-12'),('2094-09-13'),('2094-09-14'),('2094-09-15'),('2094-09-16'),('2094-09-17'),('2094-09-18'),('2094-09-19'),('2094-09-20'),('2094-09-21'),('2094-09-22'),('2094-09-23'),('2094-09-24'),('2094-09-25'),('2094-09-26'),('2094-09-27'),('2094-09-28'),('2094-09-29'),('2094-09-30'),('2094-10-01'),('2094-10-02'),('2094-10-03'),('2094-10-04'),('2094-10-05'),('2094-10-06'),('2094-10-07'),('2094-10-08'),('2094-10-09'),('2094-10-10'),('2094-10-11'),('2094-10-12'),('2094-10-13'),('2094-10-14'),('2094-10-15'),('2094-10-16'),('2094-10-17'),('2094-10-18'),('2094-10-19'),('2094-10-20'),('2094-10-21'),('2094-10-22'),('2094-10-23'),('2094-10-24'),('2094-10-25'),('2094-10-26'),('2094-10-27'),('2094-10-28'),('2094-10-29'),('2094-10-30'),('2094-10-31'),('2094-11-01'),('2094-11-02'),('2094-11-03'),('2094-11-04'),('2094-11-05'),('2094-11-06'),('2094-11-07'),('2094-11-08'),('2094-11-09'),('2094-11-10'),('2094-11-11'),('2094-11-12'),('2094-11-13'),('2094-11-14'),('2094-11-15'),('2094-11-16'),('2094-11-17'),('2094-11-18'),('2094-11-19'),('2094-11-20'),('2094-11-21'),('2094-11-22'),('2094-11-23'),('2094-11-24'),('2094-11-25'),('2094-11-26'),('2094-11-27'),('2094-11-28'),('2094-11-29'),('2094-11-30'),('2094-12-01'),('2094-12-02'),('2094-12-03'),('2094-12-04'),('2094-12-05'),('2094-12-06'),('2094-12-07'),('2094-12-08'),('2094-12-09'),('2094-12-10'),('2094-12-11'),('2094-12-12'),('2094-12-13'),('2094-12-14'),('2094-12-15'),('2094-12-16'),('2094-12-17'),('2094-12-18'),('2094-12-19'),('2094-12-20'),('2094-12-21'),('2094-12-22'),('2094-12-23'),('2094-12-24'),('2094-12-25'),('2094-12-26'),('2094-12-27'),('2094-12-28'),('2094-12-29'),('2094-12-30'),('2094-12-31'),('2095-01-01'),('2095-01-02'),('2095-01-03'),('2095-01-04'),('2095-01-05'),('2095-01-06'),('2095-01-07'),('2095-01-08'),('2095-01-09'),('2095-01-10'),('2095-01-11'),('2095-01-12'),('2095-01-13'),('2095-01-14'),('2095-01-15'),('2095-01-16'),('2095-01-17'),('2095-01-18'),('2095-01-19'),('2095-01-20'),('2095-01-21'),('2095-01-22'),('2095-01-23'),('2095-01-24'),('2095-01-25'),('2095-01-26'),('2095-01-27'),('2095-01-28'),('2095-01-29'),('2095-01-30'),('2095-01-31'),('2095-02-01'),('2095-02-02'),('2095-02-03'),('2095-02-04'),('2095-02-05'),('2095-02-06'),('2095-02-07'),('2095-02-08'),('2095-02-09'),('2095-02-10'),('2095-02-11'),('2095-02-12'),('2095-02-13'),('2095-02-14'),('2095-02-15'),('2095-02-16'),('2095-02-17'),('2095-02-18'),('2095-02-19'),('2095-02-20'),('2095-02-21'),('2095-02-22'),('2095-02-23'),('2095-02-24'),('2095-02-25'),('2095-02-26'),('2095-02-27'),('2095-02-28'),('2095-03-01'),('2095-03-02'),('2095-03-03'),('2095-03-04'),('2095-03-05'),('2095-03-06'),('2095-03-07'),('2095-03-08'),('2095-03-09'),('2095-03-10'),('2095-03-11'),('2095-03-12'),('2095-03-13'),('2095-03-14'),('2095-03-15'),('2095-03-16'),('2095-03-17'),('2095-03-18'),('2095-03-19'),('2095-03-20'),('2095-03-21'),('2095-03-22'),('2095-03-23'),('2095-03-24'),('2095-03-25'),('2095-03-26'),('2095-03-27'),('2095-03-28'),('2095-03-29'),('2095-03-30'),('2095-03-31'),('2095-04-01'),('2095-04-02'),('2095-04-03'),('2095-04-04'),('2095-04-05'),('2095-04-06'),('2095-04-07'),('2095-04-08'),('2095-04-09'),('2095-04-10'),('2095-04-11'),('2095-04-12'),('2095-04-13'),('2095-04-14'),('2095-04-15'),('2095-04-16'),('2095-04-17'),('2095-04-18'),('2095-04-19'),('2095-04-20'),('2095-04-21'),('2095-04-22'),('2095-04-23'),('2095-04-24'),('2095-04-25'),('2095-04-26'),('2095-04-27'),('2095-04-28'),('2095-04-29'),('2095-04-30'),('2095-05-01'),('2095-05-02'),('2095-05-03'),('2095-05-04'),('2095-05-05'),('2095-05-06'),('2095-05-07'),('2095-05-08'),('2095-05-09'),('2095-05-10'),('2095-05-11'),('2095-05-12'),('2095-05-13'),('2095-05-14'),('2095-05-15'),('2095-05-16'),('2095-05-17'),('2095-05-18'),('2095-05-19'),('2095-05-20'),('2095-05-21'),('2095-05-22'),('2095-05-23'),('2095-05-24'),('2095-05-25'),('2095-05-26'),('2095-05-27'),('2095-05-28'),('2095-05-29'),('2095-05-30'),('2095-05-31'),('2095-06-01'),('2095-06-02'),('2095-06-03'),('2095-06-04'),('2095-06-05'),('2095-06-06'),('2095-06-07'),('2095-06-08'),('2095-06-09'),('2095-06-10'),('2095-06-11'),('2095-06-12'),('2095-06-13'),('2095-06-14'),('2095-06-15'),('2095-06-16'),('2095-06-17'),('2095-06-18'),('2095-06-19'),('2095-06-20'),('2095-06-21'),('2095-06-22'),('2095-06-23'),('2095-06-24'),('2095-06-25'),('2095-06-26'),('2095-06-27'),('2095-06-28'),('2095-06-29'),('2095-06-30'),('2095-07-01'),('2095-07-02'),('2095-07-03'),('2095-07-04'),('2095-07-05'),('2095-07-06'),('2095-07-07'),('2095-07-08'),('2095-07-09'),('2095-07-10'),('2095-07-11'),('2095-07-12'),('2095-07-13'),('2095-07-14'),('2095-07-15'),('2095-07-16'),('2095-07-17'),('2095-07-18'),('2095-07-19'),('2095-07-20'),('2095-07-21'),('2095-07-22'),('2095-07-23'),('2095-07-24'),('2095-07-25'),('2095-07-26'),('2095-07-27'),('2095-07-28'),('2095-07-29'),('2095-07-30'),('2095-07-31'),('2095-08-01'),('2095-08-02'),('2095-08-03'),('2095-08-04'),('2095-08-05'),('2095-08-06'),('2095-08-07'),('2095-08-08'),('2095-08-09'),('2095-08-10'),('2095-08-11'),('2095-08-12'),('2095-08-13'),('2095-08-14'),('2095-08-15'),('2095-08-16'),('2095-08-17'),('2095-08-18'),('2095-08-19'),('2095-08-20'),('2095-08-21'),('2095-08-22'),('2095-08-23'),('2095-08-24'),('2095-08-25'),('2095-08-26'),('2095-08-27'),('2095-08-28'),('2095-08-29'),('2095-08-30'),('2095-08-31'),('2095-09-01'),('2095-09-02'),('2095-09-03'),('2095-09-04'),('2095-09-05'),('2095-09-06'),('2095-09-07'),('2095-09-08'),('2095-09-09'),('2095-09-10'),('2095-09-11'),('2095-09-12'),('2095-09-13'),('2095-09-14'),('2095-09-15'),('2095-09-16'),('2095-09-17'),('2095-09-18'),('2095-09-19'),('2095-09-20'),('2095-09-21'),('2095-09-22'),('2095-09-23'),('2095-09-24'),('2095-09-25'),('2095-09-26'),('2095-09-27'),('2095-09-28'),('2095-09-29'),('2095-09-30'),('2095-10-01'),('2095-10-02'),('2095-10-03'),('2095-10-04'),('2095-10-05'),('2095-10-06'),('2095-10-07'),('2095-10-08'),('2095-10-09'),('2095-10-10'),('2095-10-11'),('2095-10-12'),('2095-10-13'),('2095-10-14'),('2095-10-15'),('2095-10-16'),('2095-10-17'),('2095-10-18'),('2095-10-19'),('2095-10-20'),('2095-10-21'),('2095-10-22'),('2095-10-23'),('2095-10-24'),('2095-10-25'),('2095-10-26'),('2095-10-27'),('2095-10-28'),('2095-10-29'),('2095-10-30'),('2095-10-31'),('2095-11-01'),('2095-11-02'),('2095-11-03'),('2095-11-04'),('2095-11-05'),('2095-11-06'),('2095-11-07'),('2095-11-08'),('2095-11-09'),('2095-11-10'),('2095-11-11'),('2095-11-12'),('2095-11-13'),('2095-11-14'),('2095-11-15'),('2095-11-16'),('2095-11-17'),('2095-11-18'),('2095-11-19'),('2095-11-20'),('2095-11-21'),('2095-11-22'),('2095-11-23'),('2095-11-24'),('2095-11-25'),('2095-11-26'),('2095-11-27'),('2095-11-28'),('2095-11-29'),('2095-11-30'),('2095-12-01'),('2095-12-02'),('2095-12-03'),('2095-12-04'),('2095-12-05'),('2095-12-06'),('2095-12-07'),('2095-12-08'),('2095-12-09'),('2095-12-10'),('2095-12-11'),('2095-12-12'),('2095-12-13'),('2095-12-14'),('2095-12-15'),('2095-12-16'),('2095-12-17'),('2095-12-18'),('2095-12-19'),('2095-12-20'),('2095-12-21'),('2095-12-22'),('2095-12-23'),('2095-12-24'),('2095-12-25'),('2095-12-26'),('2095-12-27'),('2095-12-28'),('2095-12-29'),('2095-12-30'),('2095-12-31'),('2096-01-01'),('2096-01-02'),('2096-01-03'),('2096-01-04'),('2096-01-05'),('2096-01-06'),('2096-01-07'),('2096-01-08'),('2096-01-09'),('2096-01-10'),('2096-01-11'),('2096-01-12'),('2096-01-13'),('2096-01-14'),('2096-01-15'),('2096-01-16'),('2096-01-17'),('2096-01-18'),('2096-01-19'),('2096-01-20'),('2096-01-21'),('2096-01-22'),('2096-01-23'),('2096-01-24'),('2096-01-25'),('2096-01-26'),('2096-01-27'),('2096-01-28'),('2096-01-29'),('2096-01-30'),('2096-01-31'),('2096-02-01'),('2096-02-02'),('2096-02-03'),('2096-02-04'),('2096-02-05'),('2096-02-06'),('2096-02-07'),('2096-02-08'),('2096-02-09'),('2096-02-10'),('2096-02-11'),('2096-02-12'),('2096-02-13'),('2096-02-14'),('2096-02-15'),('2096-02-16'),('2096-02-17'),('2096-02-18'),('2096-02-19'),('2096-02-20'),('2096-02-21'),('2096-02-22'),('2096-02-23'),('2096-02-24'),('2096-02-25'),('2096-02-26'),('2096-02-27'),('2096-02-28'),('2096-02-29'),('2096-03-01'),('2096-03-02'),('2096-03-03'),('2096-03-04'),('2096-03-05'),('2096-03-06'),('2096-03-07'),('2096-03-08'),('2096-03-09'),('2096-03-10'),('2096-03-11'),('2096-03-12'),('2096-03-13'),('2096-03-14'),('2096-03-15'),('2096-03-16'),('2096-03-17'),('2096-03-18'),('2096-03-19'),('2096-03-20'),('2096-03-21'),('2096-03-22'),('2096-03-23'),('2096-03-24'),('2096-03-25'),('2096-03-26'),('2096-03-27'),('2096-03-28'),('2096-03-29'),('2096-03-30'),('2096-03-31'),('2096-04-01'),('2096-04-02'),('2096-04-03'),('2096-04-04'),('2096-04-05'),('2096-04-06'),('2096-04-07'),('2096-04-08'),('2096-04-09'),('2096-04-10'),('2096-04-11'),('2096-04-12'),('2096-04-13'),('2096-04-14'),('2096-04-15'),('2096-04-16'),('2096-04-17'),('2096-04-18'),('2096-04-19'),('2096-04-20'),('2096-04-21'),('2096-04-22'),('2096-04-23'),('2096-04-24'),('2096-04-25'),('2096-04-26'),('2096-04-27'),('2096-04-28'),('2096-04-29'),('2096-04-30'),('2096-05-01'),('2096-05-02'),('2096-05-03'),('2096-05-04'),('2096-05-05'),('2096-05-06'),('2096-05-07'),('2096-05-08'),('2096-05-09'),('2096-05-10'),('2096-05-11'),('2096-05-12'),('2096-05-13'),('2096-05-14'),('2096-05-15'),('2096-05-16'),('2096-05-17'),('2096-05-18'),('2096-05-19'),('2096-05-20'),('2096-05-21'),('2096-05-22'),('2096-05-23'),('2096-05-24'),('2096-05-25'),('2096-05-26'),('2096-05-27'),('2096-05-28'),('2096-05-29'),('2096-05-30'),('2096-05-31'),('2096-06-01'),('2096-06-02'),('2096-06-03'),('2096-06-04'),('2096-06-05'),('2096-06-06'),('2096-06-07'),('2096-06-08'),('2096-06-09'),('2096-06-10'),('2096-06-11'),('2096-06-12'),('2096-06-13'),('2096-06-14'),('2096-06-15'),('2096-06-16'),('2096-06-17'),('2096-06-18'),('2096-06-19'),('2096-06-20'),('2096-06-21'),('2096-06-22'),('2096-06-23'),('2096-06-24'),('2096-06-25'),('2096-06-26'),('2096-06-27'),('2096-06-28'),('2096-06-29'),('2096-06-30'),('2096-07-01'),('2096-07-02'),('2096-07-03'),('2096-07-04'),('2096-07-05'),('2096-07-06'),('2096-07-07'),('2096-07-08'),('2096-07-09'),('2096-07-10'),('2096-07-11'),('2096-07-12'),('2096-07-13'),('2096-07-14'),('2096-07-15'),('2096-07-16'),('2096-07-17'),('2096-07-18'),('2096-07-19'),('2096-07-20'),('2096-07-21'),('2096-07-22'),('2096-07-23'),('2096-07-24'),('2096-07-25'),('2096-07-26'),('2096-07-27'),('2096-07-28'),('2096-07-29'),('2096-07-30'),('2096-07-31'),('2096-08-01'),('2096-08-02'),('2096-08-03'),('2096-08-04'),('2096-08-05'),('2096-08-06'),('2096-08-07'),('2096-08-08'),('2096-08-09'),('2096-08-10'),('2096-08-11'),('2096-08-12'),('2096-08-13'),('2096-08-14'),('2096-08-15'),('2096-08-16'),('2096-08-17'),('2096-08-18'),('2096-08-19'),('2096-08-20'),('2096-08-21'),('2096-08-22'),('2096-08-23'),('2096-08-24'),('2096-08-25'),('2096-08-26'),('2096-08-27'),('2096-08-28'),('2096-08-29'),('2096-08-30'),('2096-08-31'),('2096-09-01'),('2096-09-02'),('2096-09-03'),('2096-09-04'),('2096-09-05'),('2096-09-06'),('2096-09-07'),('2096-09-08'),('2096-09-09'),('2096-09-10'),('2096-09-11'),('2096-09-12'),('2096-09-13'),('2096-09-14'),('2096-09-15'),('2096-09-16'),('2096-09-17'),('2096-09-18'),('2096-09-19'),('2096-09-20'),('2096-09-21'),('2096-09-22'),('2096-09-23'),('2096-09-24'),('2096-09-25'),('2096-09-26'),('2096-09-27'),('2096-09-28'),('2096-09-29'),('2096-09-30'),('2096-10-01'),('2096-10-02'),('2096-10-03'),('2096-10-04'),('2096-10-05'),('2096-10-06'),('2096-10-07'),('2096-10-08'),('2096-10-09'),('2096-10-10'),('2096-10-11'),('2096-10-12'),('2096-10-13'),('2096-10-14'),('2096-10-15'),('2096-10-16'),('2096-10-17'),('2096-10-18'),('2096-10-19'),('2096-10-20'),('2096-10-21'),('2096-10-22'),('2096-10-23'),('2096-10-24'),('2096-10-25'),('2096-10-26'),('2096-10-27'),('2096-10-28'),('2096-10-29'),('2096-10-30'),('2096-10-31'),('2096-11-01'),('2096-11-02'),('2096-11-03'),('2096-11-04'),('2096-11-05'),('2096-11-06'),('2096-11-07'),('2096-11-08'),('2096-11-09'),('2096-11-10'),('2096-11-11'),('2096-11-12'),('2096-11-13'),('2096-11-14'),('2096-11-15'),('2096-11-16'),('2096-11-17'),('2096-11-18'),('2096-11-19'),('2096-11-20'),('2096-11-21'),('2096-11-22'),('2096-11-23'),('2096-11-24'),('2096-11-25'),('2096-11-26'),('2096-11-27'),('2096-11-28'),('2096-11-29'),('2096-11-30'),('2096-12-01'),('2096-12-02'),('2096-12-03'),('2096-12-04'),('2096-12-05'),('2096-12-06'),('2096-12-07'),('2096-12-08'),('2096-12-09'),('2096-12-10'),('2096-12-11'),('2096-12-12'),('2096-12-13'),('2096-12-14'),('2096-12-15'),('2096-12-16'),('2096-12-17'),('2096-12-18'),('2096-12-19'),('2096-12-20'),('2096-12-21'),('2096-12-22'),('2096-12-23'),('2096-12-24'),('2096-12-25'),('2096-12-26'),('2096-12-27'),('2096-12-28'),('2096-12-29'),('2096-12-30'),('2096-12-31'),('2097-01-01'),('2097-01-02'),('2097-01-03'),('2097-01-04'),('2097-01-05'),('2097-01-06'),('2097-01-07'),('2097-01-08'),('2097-01-09'),('2097-01-10'),('2097-01-11'),('2097-01-12'),('2097-01-13'),('2097-01-14'),('2097-01-15'),('2097-01-16'),('2097-01-17'),('2097-01-18'),('2097-01-19'),('2097-01-20'),('2097-01-21'),('2097-01-22'),('2097-01-23'),('2097-01-24'),('2097-01-25'),('2097-01-26'),('2097-01-27'),('2097-01-28'),('2097-01-29'),('2097-01-30'),('2097-01-31'),('2097-02-01'),('2097-02-02'),('2097-02-03'),('2097-02-04'),('2097-02-05'),('2097-02-06'),('2097-02-07'),('2097-02-08'),('2097-02-09'),('2097-02-10'),('2097-02-11'),('2097-02-12'),('2097-02-13'),('2097-02-14'),('2097-02-15'),('2097-02-16'),('2097-02-17'),('2097-02-18'),('2097-02-19'),('2097-02-20'),('2097-02-21'),('2097-02-22'),('2097-02-23'),('2097-02-24'),('2097-02-25'),('2097-02-26'),('2097-02-27'),('2097-02-28'),('2097-03-01'),('2097-03-02'),('2097-03-03'),('2097-03-04'),('2097-03-05'),('2097-03-06'),('2097-03-07'),('2097-03-08'),('2097-03-09'),('2097-03-10'),('2097-03-11'),('2097-03-12'),('2097-03-13'),('2097-03-14'),('2097-03-15'),('2097-03-16'),('2097-03-17'),('2097-03-18'),('2097-03-19'),('2097-03-20'),('2097-03-21'),('2097-03-22'),('2097-03-23'),('2097-03-24'),('2097-03-25'),('2097-03-26'),('2097-03-27'),('2097-03-28'),('2097-03-29'),('2097-03-30'),('2097-03-31'),('2097-04-01'),('2097-04-02'),('2097-04-03'),('2097-04-04'),('2097-04-05'),('2097-04-06'),('2097-04-07'),('2097-04-08'),('2097-04-09'),('2097-04-10'),('2097-04-11'),('2097-04-12'),('2097-04-13'),('2097-04-14'),('2097-04-15'),('2097-04-16'),('2097-04-17'),('2097-04-18'),('2097-04-19'),('2097-04-20'),('2097-04-21'),('2097-04-22'),('2097-04-23'),('2097-04-24'),('2097-04-25'),('2097-04-26'),('2097-04-27'),('2097-04-28'),('2097-04-29'),('2097-04-30'),('2097-05-01'),('2097-05-02'),('2097-05-03'),('2097-05-04'),('2097-05-05'),('2097-05-06'),('2097-05-07'),('2097-05-08'),('2097-05-09'),('2097-05-10'),('2097-05-11'),('2097-05-12'),('2097-05-13'),('2097-05-14'),('2097-05-15'),('2097-05-16'),('2097-05-17'),('2097-05-18'),('2097-05-19'),('2097-05-20'),('2097-05-21'),('2097-05-22'),('2097-05-23'),('2097-05-24'),('2097-05-25'),('2097-05-26'),('2097-05-27'),('2097-05-28'),('2097-05-29'),('2097-05-30'),('2097-05-31'),('2097-06-01'),('2097-06-02'),('2097-06-03'),('2097-06-04'),('2097-06-05'),('2097-06-06'),('2097-06-07'),('2097-06-08'),('2097-06-09'),('2097-06-10'),('2097-06-11'),('2097-06-12'),('2097-06-13'),('2097-06-14'),('2097-06-15'),('2097-06-16'),('2097-06-17'),('2097-06-18'),('2097-06-19'),('2097-06-20'),('2097-06-21'),('2097-06-22'),('2097-06-23'),('2097-06-24'),('2097-06-25'),('2097-06-26'),('2097-06-27'),('2097-06-28'),('2097-06-29'),('2097-06-30'),('2097-07-01'),('2097-07-02'),('2097-07-03'),('2097-07-04'),('2097-07-05'),('2097-07-06'),('2097-07-07'),('2097-07-08'),('2097-07-09'),('2097-07-10'),('2097-07-11'),('2097-07-12'),('2097-07-13'),('2097-07-14'),('2097-07-15'),('2097-07-16'),('2097-07-17'),('2097-07-18'),('2097-07-19'),('2097-07-20'),('2097-07-21'),('2097-07-22'),('2097-07-23'),('2097-07-24'),('2097-07-25'),('2097-07-26'),('2097-07-27'),('2097-07-28'),('2097-07-29'),('2097-07-30'),('2097-07-31'),('2097-08-01'),('2097-08-02'),('2097-08-03'),('2097-08-04'),('2097-08-05'),('2097-08-06'),('2097-08-07'),('2097-08-08'),('2097-08-09'),('2097-08-10'),('2097-08-11'),('2097-08-12'),('2097-08-13'),('2097-08-14'),('2097-08-15'),('2097-08-16'),('2097-08-17'),('2097-08-18'),('2097-08-19'),('2097-08-20'),('2097-08-21'),('2097-08-22'),('2097-08-23'),('2097-08-24'),('2097-08-25'),('2097-08-26'),('2097-08-27'),('2097-08-28'),('2097-08-29'),('2097-08-30'),('2097-08-31'),('2097-09-01'),('2097-09-02'),('2097-09-03'),('2097-09-04'),('2097-09-05'),('2097-09-06'),('2097-09-07'),('2097-09-08'),('2097-09-09'),('2097-09-10'),('2097-09-11'),('2097-09-12'),('2097-09-13'),('2097-09-14'),('2097-09-15'),('2097-09-16'),('2097-09-17'),('2097-09-18'),('2097-09-19'),('2097-09-20'),('2097-09-21'),('2097-09-22'),('2097-09-23'),('2097-09-24'),('2097-09-25'),('2097-09-26'),('2097-09-27'),('2097-09-28'),('2097-09-29'),('2097-09-30'),('2097-10-01'),('2097-10-02'),('2097-10-03'),('2097-10-04'),('2097-10-05'),('2097-10-06'),('2097-10-07'),('2097-10-08'),('2097-10-09'),('2097-10-10'),('2097-10-11'),('2097-10-12'),('2097-10-13'),('2097-10-14'),('2097-10-15'),('2097-10-16'),('2097-10-17'),('2097-10-18'),('2097-10-19'),('2097-10-20'),('2097-10-21'),('2097-10-22'),('2097-10-23'),('2097-10-24'),('2097-10-25'),('2097-10-26'),('2097-10-27'),('2097-10-28'),('2097-10-29'),('2097-10-30'),('2097-10-31'),('2097-11-01'),('2097-11-02'),('2097-11-03'),('2097-11-04'),('2097-11-05'),('2097-11-06'),('2097-11-07'),('2097-11-08'),('2097-11-09'),('2097-11-10'),('2097-11-11'),('2097-11-12'),('2097-11-13'),('2097-11-14'),('2097-11-15'),('2097-11-16'),('2097-11-17'),('2097-11-18'),('2097-11-19'),('2097-11-20'),('2097-11-21'),('2097-11-22'),('2097-11-23'),('2097-11-24'),('2097-11-25'),('2097-11-26'),('2097-11-27'),('2097-11-28'),('2097-11-29'),('2097-11-30'),('2097-12-01'),('2097-12-02'),('2097-12-03'),('2097-12-04'),('2097-12-05'),('2097-12-06'),('2097-12-07'),('2097-12-08'),('2097-12-09'),('2097-12-10'),('2097-12-11'),('2097-12-12'),('2097-12-13'),('2097-12-14'),('2097-12-15'),('2097-12-16'),('2097-12-17'),('2097-12-18'),('2097-12-19'),('2097-12-20'),('2097-12-21'),('2097-12-22'),('2097-12-23'),('2097-12-24'),('2097-12-25'),('2097-12-26'),('2097-12-27'),('2097-12-28'),('2097-12-29'),('2097-12-30'),('2097-12-31'),('2098-01-01'),('2098-01-02'),('2098-01-03'),('2098-01-04'),('2098-01-05'),('2098-01-06'),('2098-01-07'),('2098-01-08'),('2098-01-09'),('2098-01-10'),('2098-01-11'),('2098-01-12'),('2098-01-13'),('2098-01-14'),('2098-01-15'),('2098-01-16'),('2098-01-17'),('2098-01-18'),('2098-01-19'),('2098-01-20'),('2098-01-21'),('2098-01-22'),('2098-01-23'),('2098-01-24'),('2098-01-25'),('2098-01-26'),('2098-01-27'),('2098-01-28'),('2098-01-29'),('2098-01-30'),('2098-01-31'),('2098-02-01'),('2098-02-02'),('2098-02-03'),('2098-02-04'),('2098-02-05'),('2098-02-06'),('2098-02-07'),('2098-02-08'),('2098-02-09'),('2098-02-10'),('2098-02-11'),('2098-02-12'),('2098-02-13'),('2098-02-14'),('2098-02-15'),('2098-02-16'),('2098-02-17'),('2098-02-18'),('2098-02-19'),('2098-02-20'),('2098-02-21'),('2098-02-22'),('2098-02-23'),('2098-02-24'),('2098-02-25'),('2098-02-26'),('2098-02-27'),('2098-02-28'),('2098-03-01'),('2098-03-02'),('2098-03-03'),('2098-03-04'),('2098-03-05'),('2098-03-06'),('2098-03-07'),('2098-03-08'),('2098-03-09'),('2098-03-10'),('2098-03-11'),('2098-03-12'),('2098-03-13'),('2098-03-14'),('2098-03-15'),('2098-03-16'),('2098-03-17'),('2098-03-18'),('2098-03-19'),('2098-03-20'),('2098-03-21'),('2098-03-22'),('2098-03-23'),('2098-03-24'),('2098-03-25'),('2098-03-26'),('2098-03-27'),('2098-03-28'),('2098-03-29'),('2098-03-30'),('2098-03-31'),('2098-04-01'),('2098-04-02'),('2098-04-03'),('2098-04-04'),('2098-04-05'),('2098-04-06'),('2098-04-07'),('2098-04-08'),('2098-04-09'),('2098-04-10'),('2098-04-11'),('2098-04-12'),('2098-04-13'),('2098-04-14'),('2098-04-15'),('2098-04-16'),('2098-04-17'),('2098-04-18'),('2098-04-19'),('2098-04-20'),('2098-04-21'),('2098-04-22'),('2098-04-23'),('2098-04-24'),('2098-04-25'),('2098-04-26'),('2098-04-27'),('2098-04-28'),('2098-04-29'),('2098-04-30'),('2098-05-01'),('2098-05-02'),('2098-05-03'),('2098-05-04'),('2098-05-05'),('2098-05-06'),('2098-05-07'),('2098-05-08'),('2098-05-09'),('2098-05-10'),('2098-05-11'),('2098-05-12'),('2098-05-13'),('2098-05-14'),('2098-05-15'),('2098-05-16'),('2098-05-17'),('2098-05-18'),('2098-05-19'),('2098-05-20'),('2098-05-21'),('2098-05-22'),('2098-05-23'),('2098-05-24'),('2098-05-25'),('2098-05-26'),('2098-05-27'),('2098-05-28'),('2098-05-29'),('2098-05-30'),('2098-05-31'),('2098-06-01'),('2098-06-02'),('2098-06-03'),('2098-06-04'),('2098-06-05'),('2098-06-06'),('2098-06-07'),('2098-06-08'),('2098-06-09'),('2098-06-10'),('2098-06-11'),('2098-06-12'),('2098-06-13'),('2098-06-14'),('2098-06-15'),('2098-06-16'),('2098-06-17'),('2098-06-18'),('2098-06-19'),('2098-06-20'),('2098-06-21'),('2098-06-22'),('2098-06-23'),('2098-06-24'),('2098-06-25'),('2098-06-26'),('2098-06-27'),('2098-06-28'),('2098-06-29'),('2098-06-30'),('2098-07-01'),('2098-07-02'),('2098-07-03'),('2098-07-04'),('2098-07-05'),('2098-07-06'),('2098-07-07'),('2098-07-08'),('2098-07-09'),('2098-07-10'),('2098-07-11'),('2098-07-12'),('2098-07-13'),('2098-07-14'),('2098-07-15'),('2098-07-16'),('2098-07-17'),('2098-07-18'),('2098-07-19'),('2098-07-20'),('2098-07-21'),('2098-07-22'),('2098-07-23'),('2098-07-24'),('2098-07-25'),('2098-07-26'),('2098-07-27'),('2098-07-28'),('2098-07-29'),('2098-07-30'),('2098-07-31'),('2098-08-01'),('2098-08-02'),('2098-08-03'),('2098-08-04'),('2098-08-05'),('2098-08-06'),('2098-08-07'),('2098-08-08'),('2098-08-09'),('2098-08-10'),('2098-08-11'),('2098-08-12'),('2098-08-13'),('2098-08-14'),('2098-08-15'),('2098-08-16'),('2098-08-17'),('2098-08-18'),('2098-08-19'),('2098-08-20'),('2098-08-21'),('2098-08-22'),('2098-08-23'),('2098-08-24'),('2098-08-25'),('2098-08-26'),('2098-08-27'),('2098-08-28'),('2098-08-29'),('2098-08-30'),('2098-08-31'),('2098-09-01'),('2098-09-02'),('2098-09-03'),('2098-09-04'),('2098-09-05'),('2098-09-06'),('2098-09-07'),('2098-09-08'),('2098-09-09'),('2098-09-10'),('2098-09-11'),('2098-09-12'),('2098-09-13'),('2098-09-14'),('2098-09-15'),('2098-09-16'),('2098-09-17'),('2098-09-18'),('2098-09-19'),('2098-09-20'),('2098-09-21'),('2098-09-22'),('2098-09-23'),('2098-09-24'),('2098-09-25'),('2098-09-26'),('2098-09-27'),('2098-09-28'),('2098-09-29'),('2098-09-30'),('2098-10-01'),('2098-10-02'),('2098-10-03'),('2098-10-04'),('2098-10-05'),('2098-10-06'),('2098-10-07'),('2098-10-08'),('2098-10-09'),('2098-10-10'),('2098-10-11'),('2098-10-12'),('2098-10-13'),('2098-10-14'),('2098-10-15'),('2098-10-16'),('2098-10-17'),('2098-10-18'),('2098-10-19'),('2098-10-20'),('2098-10-21'),('2098-10-22'),('2098-10-23'),('2098-10-24'),('2098-10-25'),('2098-10-26'),('2098-10-27'),('2098-10-28'),('2098-10-29'),('2098-10-30'),('2098-10-31'),('2098-11-01'),('2098-11-02'),('2098-11-03'),('2098-11-04'),('2098-11-05'),('2098-11-06'),('2098-11-07'),('2098-11-08'),('2098-11-09'),('2098-11-10'),('2098-11-11'),('2098-11-12'),('2098-11-13'),('2098-11-14'),('2098-11-15'),('2098-11-16'),('2098-11-17'),('2098-11-18'),('2098-11-19'),('2098-11-20'),('2098-11-21'),('2098-11-22'),('2098-11-23'),('2098-11-24'),('2098-11-25'),('2098-11-26'),('2098-11-27'),('2098-11-28'),('2098-11-29'),('2098-11-30'),('2098-12-01'),('2098-12-02'),('2098-12-03'),('2098-12-04'),('2098-12-05'),('2098-12-06'),('2098-12-07'),('2098-12-08'),('2098-12-09'),('2098-12-10'),('2098-12-11'),('2098-12-12'),('2098-12-13'),('2098-12-14'),('2098-12-15'),('2098-12-16'),('2098-12-17'),('2098-12-18'),('2098-12-19'),('2098-12-20'),('2098-12-21'),('2098-12-22'),('2098-12-23'),('2098-12-24'),('2098-12-25'),('2098-12-26'),('2098-12-27'),('2098-12-28'),('2098-12-29'),('2098-12-30'),('2098-12-31'),('2099-01-01'),('2099-01-02'),('2099-01-03'),('2099-01-04'),('2099-01-05'),('2099-01-06'),('2099-01-07'),('2099-01-08'),('2099-01-09'),('2099-01-10'),('2099-01-11'),('2099-01-12'),('2099-01-13'),('2099-01-14'),('2099-01-15'),('2099-01-16'),('2099-01-17'),('2099-01-18'),('2099-01-19'),('2099-01-20'),('2099-01-21'),('2099-01-22'),('2099-01-23'),('2099-01-24'),('2099-01-25'),('2099-01-26'),('2099-01-27'),('2099-01-28'),('2099-01-29'),('2099-01-30'),('2099-01-31'),('2099-02-01'),('2099-02-02'),('2099-02-03'),('2099-02-04'),('2099-02-05'),('2099-02-06'),('2099-02-07'),('2099-02-08'),('2099-02-09'),('2099-02-10'),('2099-02-11'),('2099-02-12'),('2099-02-13'),('2099-02-14'),('2099-02-15'),('2099-02-16'),('2099-02-17'),('2099-02-18'),('2099-02-19'),('2099-02-20'),('2099-02-21'),('2099-02-22'),('2099-02-23'),('2099-02-24'),('2099-02-25'),('2099-02-26'),('2099-02-27'),('2099-02-28'),('2099-03-01'),('2099-03-02'),('2099-03-03'),('2099-03-04'),('2099-03-05'),('2099-03-06'),('2099-03-07'),('2099-03-08'),('2099-03-09'),('2099-03-10'),('2099-03-11'),('2099-03-12'),('2099-03-13'),('2099-03-14'),('2099-03-15'),('2099-03-16'),('2099-03-17'),('2099-03-18'),('2099-03-19'),('2099-03-20'),('2099-03-21'),('2099-03-22'),('2099-03-23'),('2099-03-24'),('2099-03-25'),('2099-03-26'),('2099-03-27'),('2099-03-28'),('2099-03-29'),('2099-03-30'),('2099-03-31'),('2099-04-01'),('2099-04-02'),('2099-04-03'),('2099-04-04'),('2099-04-05'),('2099-04-06'),('2099-04-07'),('2099-04-08'),('2099-04-09'),('2099-04-10'),('2099-04-11'),('2099-04-12'),('2099-04-13'),('2099-04-14'),('2099-04-15'),('2099-04-16'),('2099-04-17'),('2099-04-18'),('2099-04-19'),('2099-04-20'),('2099-04-21'),('2099-04-22'),('2099-04-23'),('2099-04-24'),('2099-04-25'),('2099-04-26'),('2099-04-27'),('2099-04-28'),('2099-04-29'),('2099-04-30'),('2099-05-01'),('2099-05-02'),('2099-05-03'),('2099-05-04'),('2099-05-05'),('2099-05-06'),('2099-05-07'),('2099-05-08'),('2099-05-09'),('2099-05-10'),('2099-05-11'),('2099-05-12'),('2099-05-13'),('2099-05-14'),('2099-05-15'),('2099-05-16'),('2099-05-17'),('2099-05-18'),('2099-05-19'),('2099-05-20'),('2099-05-21'),('2099-05-22'),('2099-05-23'),('2099-05-24'),('2099-05-25'),('2099-05-26'),('2099-05-27'),('2099-05-28'),('2099-05-29'),('2099-05-30'),('2099-05-31'),('2099-06-01'),('2099-06-02'),('2099-06-03'),('2099-06-04'),('2099-06-05'),('2099-06-06'),('2099-06-07'),('2099-06-08'),('2099-06-09'),('2099-06-10'),('2099-06-11'),('2099-06-12'),('2099-06-13'),('2099-06-14'),('2099-06-15'),('2099-06-16'),('2099-06-17'),('2099-06-18'),('2099-06-19'),('2099-06-20'),('2099-06-21'),('2099-06-22'),('2099-06-23'),('2099-06-24'),('2099-06-25'),('2099-06-26'),('2099-06-27'),('2099-06-28'),('2099-06-29'),('2099-06-30'),('2099-07-01'),('2099-07-02'),('2099-07-03'),('2099-07-04'),('2099-07-05'),('2099-07-06'),('2099-07-07'),('2099-07-08'),('2099-07-09'),('2099-07-10'),('2099-07-11'),('2099-07-12'),('2099-07-13'),('2099-07-14'),('2099-07-15'),('2099-07-16'),('2099-07-17'),('2099-07-18'),('2099-07-19'),('2099-07-20'),('2099-07-21'),('2099-07-22'),('2099-07-23'),('2099-07-24'),('2099-07-25'),('2099-07-26'),('2099-07-27'),('2099-07-28'),('2099-07-29'),('2099-07-30'),('2099-07-31'),('2099-08-01'),('2099-08-02'),('2099-08-03'),('2099-08-04'),('2099-08-05'),('2099-08-06'),('2099-08-07'),('2099-08-08'),('2099-08-09'),('2099-08-10'),('2099-08-11'),('2099-08-12'),('2099-08-13'),('2099-08-14'),('2099-08-15'),('2099-08-16'),('2099-08-17'),('2099-08-18'),('2099-08-19'),('2099-08-20'),('2099-08-21'),('2099-08-22'),('2099-08-23'),('2099-08-24'),('2099-08-25'),('2099-08-26'),('2099-08-27'),('2099-08-28'),('2099-08-29'),('2099-08-30'),('2099-08-31'),('2099-09-01'),('2099-09-02'),('2099-09-03'),('2099-09-04'),('2099-09-05'),('2099-09-06'),('2099-09-07'),('2099-09-08'),('2099-09-09'),('2099-09-10'),('2099-09-11'),('2099-09-12'),('2099-09-13'),('2099-09-14'),('2099-09-15'),('2099-09-16'),('2099-09-17'),('2099-09-18'),('2099-09-19'),('2099-09-20'),('2099-09-21'),('2099-09-22'),('2099-09-23'),('2099-09-24'),('2099-09-25'),('2099-09-26'),('2099-09-27'),('2099-09-28'),('2099-09-29'),('2099-09-30'),('2099-10-01'),('2099-10-02'),('2099-10-03'),('2099-10-04'),('2099-10-05'),('2099-10-06'),('2099-10-07'),('2099-10-08'),('2099-10-09'),('2099-10-10'),('2099-10-11'),('2099-10-12'),('2099-10-13'),('2099-10-14'),('2099-10-15'),('2099-10-16'),('2099-10-17'),('2099-10-18'),('2099-10-19'),('2099-10-20'),('2099-10-21'),('2099-10-22'),('2099-10-23'),('2099-10-24'),('2099-10-25'),('2099-10-26'),('2099-10-27'),('2099-10-28'),('2099-10-29'),('2099-10-30'),('2099-10-31'),('2099-11-01'),('2099-11-02'),('2099-11-03'),('2099-11-04'),('2099-11-05'),('2099-11-06'),('2099-11-07'),('2099-11-08'),('2099-11-09'),('2099-11-10'),('2099-11-11'),('2099-11-12'),('2099-11-13'),('2099-11-14'),('2099-11-15'),('2099-11-16'),('2099-11-17'),('2099-11-18'),('2099-11-19'),('2099-11-20'),('2099-11-21'),('2099-11-22'),('2099-11-23'),('2099-11-24'),('2099-11-25'),('2099-11-26'),('2099-11-27'),('2099-11-28'),('2099-11-29'),('2099-11-30'),('2099-12-01'),('2099-12-02'),('2099-12-03'),('2099-12-04'),('2099-12-05'),('2099-12-06'),('2099-12-07'),('2099-12-08'),('2099-12-09'),('2099-12-10'),('2099-12-11'),('2099-12-12'),('2099-12-13'),('2099-12-14'),('2099-12-15'),('2099-12-16'),('2099-12-17'),('2099-12-18'),('2099-12-19'),('2099-12-20'),('2099-12-21'),('2099-12-22'),('2099-12-23'),('2099-12-24'),('2099-12-25'),('2099-12-26'),('2099-12-27'),('2099-12-28'),('2099-12-29'),('2099-12-30'),('2099-12-31');
/*!40000 ALTER TABLE `sys_date` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `systems`
--

DROP TABLE IF EXISTS `systems`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `systems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `system` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apiKey` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ticketId` (`ticketId`),
  KEY `userId` (`userId`),
  CONSTRAINT `ticket_assignment_histories_ibfk_3` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_assignment_histories_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_attachments_docId_ticketId_unique` (`ticketId`,`docId`),
  KEY `docId` (`docId`),
  CONSTRAINT `ticket_attachments_ibfk_3` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_attachments_ibfk_4` FOREIGN KEY (`docId`) REFERENCES `docs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_categories`
--

LOCK TABLES `ticket_categories` WRITE;
/*!40000 ALTER TABLE `ticket_categories` DISABLE KEYS */;
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
  `context` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supportLevel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigneeType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subCategoryId` (`subCategoryId`),
  KEY `priorityId` (`priorityId`),
  CONSTRAINT `ticket_contexts_ibfk_3` FOREIGN KEY (`subCategoryId`) REFERENCES `ticket_sub_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_contexts_ibfk_4` FOREIGN KEY (`priorityId`) REFERENCES `ticket_priorities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `department` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `budget` double(9,2) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedBudget` double(9,2) DEFAULT NULL,
  `declinedMessage` text COLLATE utf8mb4_unicode_ci,
  `date` datetime DEFAULT NULL,
  `by` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ticketId` (`ticketId`),
  KEY `messageId` (`messageId`),
  CONSTRAINT `ticket_expenses_ibfk_3` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_expenses_ibfk_4` FOREIGN KEY (`messageId`) REFERENCES `ticket_messages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ticket_mails_mailId_ticketId_unique` (`ticketId`,`mailId`),
  KEY `mailId` (`mailId`),
  CONSTRAINT `ticket_mails_ibfk_3` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ticket_mails_ibfk_4` FOREIGN KEY (`mailId`) REFERENCES `mails` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `reply` text COLLATE utf8mb4_unicode_ci,
  `date` datetime DEFAULT NULL,
  `to` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `by` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `read` int(11) DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `fromUserId` int(11) DEFAULT NULL,
  `user` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ticketId` (`ticketId`),
  KEY `docId` (`docId`),
  KEY `userId` (`userId`),
  KEY `fromUserId` (`fromUserId`),
  CONSTRAINT `ticket_messages_ibfk_5` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_messages_ibfk_6` FOREIGN KEY (`docId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ticket_messages_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT `ticket_messages_ibfk_8` FOREIGN KEY (`fromUserId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attendIn` int(11) DEFAULT NULL,
  `attendInType` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resolveIn` int(11) DEFAULT NULL,
  `resolveInType` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closeIn` int(11) DEFAULT NULL,
  `closeInType` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `user` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ticketId` (`ticketId`),
  CONSTRAINT `ticket_status_histories_ibfk_1` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `ticket_sub_categories_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `ticket_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_sub_categories`
--

LOCK TABLES `ticket_sub_categories` WRITE;
/*!40000 ALTER TABLE `ticket_sub_categories` DISABLE KEYS */;
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
  `category` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subCategory` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `context` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refNo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `issue` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `date` datetime DEFAULT NULL,
  `attended` datetime DEFAULT NULL,
  `expectedAttended` datetime DEFAULT NULL,
  `resolved` datetime DEFAULT NULL,
  `expectedResolved` datetime DEFAULT NULL,
  `closed` datetime DEFAULT NULL,
  `expectedClosed` datetime DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assignedTo` int(11) DEFAULT NULL,
  `contextId` int(11) DEFAULT NULL,
  `priorityId` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `lastMsgId` int(11) DEFAULT NULL,
  `setAside` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `urn` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `submitedDate` date DEFAULT NULL,
  `verifiedDate` date DEFAULT NULL,
  `verifiedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `module` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticketId` int(11) DEFAULT NULL,
  `messageId` int(11) DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `from` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `read` int(11) DEFAULT '0',
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `toUser` (`toUser`),
  KEY `ticketId` (`ticketId`),
  KEY `messageId` (`messageId`),
  CONSTRAINT `user_messages_ibfk_4` FOREIGN KEY (`toUser`) REFERENCES `users` (`id`),
  CONSTRAINT `user_messages_ibfk_5` FOREIGN KEY (`ticketId`) REFERENCES `tickets` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_messages_ibfk_6` FOREIGN KEY (`messageId`) REFERENCES `ticket_messages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `webPushId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobilePushId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsappNo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `user_notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `cityIds` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `locationIds` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `buildingIds` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supportLevel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigneeTypes` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_roles_roleId_userId_unique` (`userId`,`roleId`),
  KEY `roleId` (`roleId`),
  CONSTRAINT `user_roles_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `user_roles_ibfk_4` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (2,5,4,NULL,NULL,NULL,NULL,NULL,'2023-06-27 17:45:47','2023-06-27 17:45:47'),(29,8,1,'1','1','1','FirstLine','ACC,BMT,RMT,ELEC','2023-09-01 04:48:37','2023-09-01 04:48:37'),(30,4,1,'',NULL,'',NULL,NULL,'2023-09-01 04:48:59','2023-09-01 04:48:59'),(31,1,1,'',NULL,'',NULL,NULL,'2023-09-01 04:49:19','2023-09-01 04:49:19'),(32,12,1,'1','1',NULL,NULL,NULL,'2023-09-06 15:15:42','2023-09-06 15:15:42');
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `roles` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `added` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `webPushId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobilePushId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `users_ibfk_1` (`companyId`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`companyId`) REFERENCES `company` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Loki','lokesh','Loki@Hub','loki@hustlehub.xyz','9000021909','Admin',1,'2023-06-22 11:03:00','2023-09-06 15:07:10','lokesh',NULL,NULL,1,'2023-06-22 11:03:00','2023-06-22 11:03:00'),(4,'Rajesh','lokesh.2','pass','rajesh@hustlehub.xyz','9000021901','Admin',1,'2023-06-22 14:53:16','2023-09-01 04:48:59','lokesh',NULL,NULL,1,NULL,NULL),(5,'Loki','tech.p','Loki@Hub','loki@techhub.com','9000021902','admin',1,'2023-06-22 22:28:25','2023-06-27 17:52:24','sam',NULL,NULL,2,NULL,NULL),(6,'Loki 3','loki.3','Loki@Hub','loki@hustlehub.xyz','9000021909','',1,'2023-07-19 17:05:33','2023-07-19 17:05:33','sam',NULL,NULL,NULL,NULL,NULL),(7,'Loki 3','loki.3','Loki@Hub','loki@hustlehub.xyz','9000021909','',1,'2023-07-19 17:48:02','2023-07-19 17:48:02','sam',NULL,NULL,NULL,NULL,NULL),(8,'Pratibha Singh','loki3','Hustlehub@erp','pratibha@hustlehub.xyz','9000002199','Admin',1,'2023-07-21 12:26:34','2023-09-06 15:06:41','loki3',NULL,NULL,1,NULL,NULL),(9,'Loki','loki','Loki@HUb','lokii@hustlehub.xyz','9000021909','SA',1,'2023-07-25 12:23:10','2023-09-26 11:40:36','loki',NULL,NULL,1,'2023-07-25 12:23:10','2023-07-25 12:23:10'),(10,'Harish Kumar','harish.k','Hustlehub@erp','harishkumar@hustlehub.xyz','9000021909','Admin',1,'2023-09-01 04:50:19','2023-09-02 11:07:27','harish.k',NULL,NULL,1,'2023-09-01 04:50:19','2023-09-01 04:50:19'),(11,'KIMIDI DILEEP','kimidi.d','Dileep@123','dileep.k@hustlehub.xyz','7288807787','Admin',1,'2023-09-06 14:39:20','2023-09-06 14:39:20','lokesh',NULL,NULL,1,'2023-09-06 14:39:20','2023-09-06 14:39:20'),(12,'Samhitha','samhitha','Samhitha1611','samhitha@hustlehub.xyz','6360316930','Admin',1,'2023-09-06 15:14:02','2023-09-06 15:35:56','samhitha',NULL,NULL,1,'2023-09-06 15:14:02','2023-09-06 15:14:02'),(13,'Bhavya','bhavya','8792515534','Bhavya.a@hustlehub.xyz','8792515534','Admin',1,'2023-09-06 15:15:25','2023-09-06 15:36:13','bhavya',NULL,NULL,1,'2023-09-06 15:15:25','2023-09-06 15:15:25');
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
  `benificiaryName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accountNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ifscCode` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bankBranch` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `verified` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  CONSTRAINT `vendor_bank_accounts_ibfk_1` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `title` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  KEY `idProofId` (`idProofId`),
  KEY `addressProofId` (`addressProofId`),
  CONSTRAINT `vendor_contacts_ibfk_4` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_contacts_ibfk_5` FOREIGN KEY (`idProofId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_contacts_ibfk_6` FOREIGN KEY (`addressProofId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_contacts`
--

LOCK TABLES `vendor_contacts` WRITE;
/*!40000 ALTER TABLE `vendor_contacts` DISABLE KEYS */;
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
  `term` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `dateFrom` datetime DEFAULT NULL,
  `dateTo` datetime DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archieved` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tagName` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `onAdvance` int(11) DEFAULT NULL,
  `onDelivery` int(11) DEFAULT NULL,
  `inProgress` int(11) DEFAULT NULL,
  `inProgressStages` text COLLATE utf8mb4_unicode_ci,
  `onFinish` int(11) DEFAULT NULL,
  `afterFinish` int(11) DEFAULT NULL,
  `afterFinishStages` text COLLATE utf8mb4_unicode_ci,
  `active` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  CONSTRAINT `vendor_payment_terms_ibfk_1` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `title` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refNo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `purpose` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subPurpose` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `estimatedBudget` double(9,2) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `proposedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `proposedUserId` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `budgetAmount` double(15,2) DEFAULT NULL,
  `paidAmount` double(15,2) DEFAULT NULL,
  `approvedAmount` double(15,2) DEFAULT NULL,
  `releasedAmount` double(15,2) DEFAULT NULL,
  `draftAmount` double(15,2) DEFAULT NULL,
  `dueAmount` double(15,2) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `buildingId` (`buildingId`),
  KEY `officeId` (`officeId`),
  KEY `bookingId` (`bookingId`),
  KEY `proposedUserId` (`proposedUserId`),
  CONSTRAINT `vendor_projects_ibfk_5` FOREIGN KEY (`buildingId`) REFERENCES `buildings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_projects_ibfk_6` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_projects_ibfk_7` FOREIGN KEY (`bookingId`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_projects_ibfk_8` FOREIGN KEY (`proposedUserId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `receivedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveredOn` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `purchaseItemId` (`purchaseItemId`),
  CONSTRAINT `vendor_purchase_item_deliveries_ibfk_1` FOREIGN KEY (`purchaseItemId`) REFERENCES `vendor_purchase_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendorPurchaseItemStatusId` (`vendorPurchaseItemStatusId`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `vendor_purchase_item_status_images_ibfk_3` FOREIGN KEY (`vendorPurchaseItemStatusId`) REFERENCES `vendor_purchase_item_statuses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_item_status_images_ibfk_4` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `description` text COLLATE utf8mb4_unicode_ci,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `purchaseItemId` (`purchaseItemId`),
  KEY `mileStoneId` (`mileStoneId`),
  CONSTRAINT `vendor_purchase_item_statuses_ibfk_3` FOREIGN KEY (`purchaseItemId`) REFERENCES `vendor_purchase_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_item_statuses_ibfk_4` FOREIGN KEY (`mileStoneId`) REFERENCES `vendor_purchase_order_milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `additionalChargesNote` text COLLATE utf8mb4_unicode_ci,
  `additionalCharges` double(9,2) DEFAULT NULL,
  `deliveryCharges` double(9,2) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `itemType` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `skuId` (`skuId`),
  KEY `paymentTermId` (`paymentTermId`),
  CONSTRAINT `vendor_purchase_items_ibfk_5` FOREIGN KEY (`purchaseOrderId`) REFERENCES `vendor_purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_items_ibfk_6` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_items_ibfk_7` FOREIGN KEY (`skuId`) REFERENCES `skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_items_ibfk_8` FOREIGN KEY (`paymentTermId`) REFERENCES `vendor_payment_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `purchaseOrderInvoiceId` (`purchaseOrderInvoiceId`),
  CONSTRAINT `vendor_purchase_order_invoice_gsts_ibfk_1` FOREIGN KEY (`purchaseOrderInvoiceId`) REFERENCES `vendor_purchase_order_invoices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `billNo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invoiceNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taxableAmount` double(11,2) DEFAULT NULL,
  `gst` double(11,2) DEFAULT NULL,
  `tds` double(11,2) DEFAULT NULL,
  `igst` double(11,2) DEFAULT NULL,
  `cgst` double(11,2) DEFAULT NULL,
  `sgst` double(11,2) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gstVerificationStatus` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `gstFileId` (`gstFileId`),
  KEY `docId` (`docId`),
  CONSTRAINT `vendor_purchase_order_invoices_ibfk_4` FOREIGN KEY (`purchaseOrderId`) REFERENCES `vendor_purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_invoices_ibfk_5` FOREIGN KEY (`gstFileId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_invoices_ibfk_6` FOREIGN KEY (`docId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `paymentMode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payoutId` int(11) DEFAULT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `utr` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chequeNumber` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chequeIssueTo` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chequeIssuedDate` datetime DEFAULT NULL,
  `releasedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `releasedOn` datetime DEFAULT NULL,
  `approvedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `paidBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paidOn` datetime DEFAULT NULL,
  `expectedDate` datetime DEFAULT NULL,
  `actualDate` datetime DEFAULT NULL,
  `debitCardAccountId` int(11) DEFAULT NULL,
  `pettyCashAccountId` int(11) DEFAULT NULL,
  `isPrepaid` int(11) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `parentMilestoneId` (`parentMilestoneId`),
  KEY `purchaseOrderId` (`purchaseOrderId`),
  KEY `purchaseItemId` (`purchaseItemId`),
  KEY `payoutId` (`payoutId`),
  CONSTRAINT `vendor_purchase_order_milestones_ibfk_5` FOREIGN KEY (`parentMilestoneId`) REFERENCES `vendor_purchase_order_milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_milestones_ibfk_6` FOREIGN KEY (`purchaseOrderId`) REFERENCES `vendor_purchase_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_milestones_ibfk_7` FOREIGN KEY (`purchaseItemId`) REFERENCES `vendor_purchase_items` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_purchase_order_milestones_ibfk_8` FOREIGN KEY (`payoutId`) REFERENCES `payout_payments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refNo` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `startedOn` datetime DEFAULT NULL,
  `startedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `closedOn` datetime DEFAULT NULL,
  `closedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `editHistory` text COLLATE utf8mb4_unicode_ci,
  `additionalChargesNote` text COLLATE utf8mb4_unicode_ci,
  `deletedReason` text COLLATE utf8mb4_unicode_ci,
  `additionalCharges` double(9,2) DEFAULT NULL,
  `deliveryCharges` double(9,2) DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `isOpex` int(11) DEFAULT NULL,
  `isBill` int(11) DEFAULT NULL,
  `hasAdvancePayment` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendorSkuId` (`vendorSkuId`),
  KEY `paymentTermId` (`paymentTermId`),
  CONSTRAINT `vendor_sku_pricings_ibfk_3` FOREIGN KEY (`vendorSkuId`) REFERENCES `vendor_skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_sku_pricings_ibfk_4` FOREIGN KEY (`paymentTermId`) REFERENCES `vendor_payment_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rejectedMessage` text COLLATE utf8mb4_unicode_ci,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  KEY `opexTypeId` (`opexTypeId`),
  KEY `skuId` (`skuId`),
  CONSTRAINT `vendor_skus_ibfk_4` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_skus_ibfk_5` FOREIGN KEY (`opexTypeId`) REFERENCES `opex_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_skus_ibfk_6` FOREIGN KEY (`skuId`) REFERENCES `skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `term` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `dateFrom` datetime DEFAULT NULL,
  `dateTo` datetime DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `archieved` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `year` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  KEY `milestoneId` (`milestoneId`),
  CONSTRAINT `vendor_tds_deductions_ibfk_3` FOREIGN KEY (`vendorId`) REFERENCES `vendor_skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_tds_deductions_ibfk_4` FOREIGN KEY (`milestoneId`) REFERENCES `vendor_purchase_order_milestones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `updatedBy` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vendorId` (`vendorId`),
  KEY `complianceTermId` (`complianceTermId`),
  KEY `tdsFileId` (`tdsFileId`),
  CONSTRAINT `vendor_tds_payments_ibfk_4` FOREIGN KEY (`vendorId`) REFERENCES `vendors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_tds_payments_ibfk_5` FOREIGN KEY (`complianceTermId`) REFERENCES `vendor_tds_compliance_terms` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_tds_payments_ibfk_6` FOREIGN KEY (`tdsFileId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `description` text COLLATE utf8mb4_unicode_ci,
  `units` int(11) DEFAULT NULL,
  `unitPrice` double(9,2) DEFAULT NULL,
  `cost` double(9,2) DEFAULT NULL,
  `gst` double(9,2) DEFAULT NULL,
  `totalAmount` double(9,2) DEFAULT NULL,
  `totalDiscount` double(9,2) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `declinedComments` text COLLATE utf8mb4_unicode_ci,
  `vendorAcceptanceStatus` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendorRejectedReason` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vendorRejectedComments` text COLLATE utf8mb4_unicode_ci,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `workOrderId` (`workOrderId`),
  KEY `skuId` (`skuId`),
  KEY `paymentTermId` (`paymentTermId`),
  CONSTRAINT `vendor_work_items_ibfk_4` FOREIGN KEY (`workOrderId`) REFERENCES `vendor_work_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_work_items_ibfk_5` FOREIGN KEY (`skuId`) REFERENCES `skus` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vendor_work_items_ibfk_6` FOREIGN KEY (`paymentTermId`) REFERENCES `vendor_payment_terms` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `refNo` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `proposedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `proposedOn` datetime DEFAULT NULL,
  `approvedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  `vendorAcceptedOn` datetime DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `budget` double(9,2) DEFAULT NULL,
  `manager` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `executive` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isOpex` int(11) DEFAULT NULL,
  `additionalChargesNote` text COLLATE utf8mb4_unicode_ci,
  `expectedDates` text COLLATE utf8mb4_unicode_ci,
  `additionalCharges` double(9,2) DEFAULT NULL,
  `deliveryCharges` double(9,2) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `vendorType` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refNo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `hasGst` int(11) DEFAULT NULL,
  `pan` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gst` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `msme` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `panId` int(11) DEFAULT NULL,
  `gstId` int(11) DEFAULT NULL,
  `cinId` int(11) DEFAULT NULL,
  `msmeId` int(11) DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  `cityId` int(11) DEFAULT NULL,
  `verified` int(11) DEFAULT NULL,
  `verifiedBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verifiedOn` datetime DEFAULT NULL,
  `referredBy` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referredOn` datetime DEFAULT NULL,
  `paymentMode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isServiceVendor` int(11) DEFAULT NULL,
  `itLedgerAdded` int(11) DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cityId` (`cityId`),
  CONSTRAINT `vendors_ibfk_1` FOREIGN KEY (`cityId`) REFERENCES `cities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendors`
--

LOCK TABLES `vendors` WRITE;
/*!40000 ALTER TABLE `vendors` DISABLE KEYS */;
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
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `leadId` (`leadId`),
  KEY `officeId` (`officeId`),
  KEY `assignedTo` (`assignedTo`),
  CONSTRAINT `visits_ibfk_4` FOREIGN KEY (`leadId`) REFERENCES `leads` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `visits_ibfk_5` FOREIGN KEY (`officeId`) REFERENCES `offices` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `visits_ibfk_6` FOREIGN KEY (`assignedTo`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desktopSubscription` text COLLATE utf8mb4_unicode_ci,
  `androidSubscription` text COLLATE utf8mb4_unicode_ci,
  `date` datetime DEFAULT NULL,
  `updated` datetime DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `clientId` (`clientId`),
  CONSTRAINT `vm_subscriptions_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageId` int(11) DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comingFrom` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `registeredOn` datetime DEFAULT NULL,
  `lastVisit` datetime DEFAULT NULL,
  `status` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientId` int(11) DEFAULT NULL,
  `companyId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `imageId` (`imageId`),
  CONSTRAINT `vm_visitors_ibfk_1` FOREIGN KEY (`imageId`) REFERENCES `docs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
  `purpose` text COLLATE utf8mb4_unicode_ci,
  `message` text COLLATE utf8mb4_unicode_ci,
  `visiteeName` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visiteePhone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visiteeDesignation` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visiteeCompany` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `subscriptionId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `visitorId` (`visitorId`),
  KEY `subscriptionId` (`subscriptionId`),
  CONSTRAINT `vm_visits_ibfk_3` FOREIGN KEY (`visitorId`) REFERENCES `vm_visitors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `vm_visits_ibfk_4` FOREIGN KEY (`subscriptionId`) REFERENCES `vm_subscriptions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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

-- Dump completed on 2024-01-16 19:51:58
