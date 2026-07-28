-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: littletr
-- ------------------------------------------------------
-- Server version	9.7.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'f593f551-899b-11f1-bd86-70c94e62ac40:1-225';

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pincode` varchar(10) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,1,'xyz','xyz','9527444269','xyz','maharashtra','421308','india','2026-07-27 14:28:49'),(2,1,'ansari','xyz','9527444269','xyz','xyz','421306','xyz','2026-07-27 14:34:58'),(3,1,'ansari','xyz','9527444269','xyz','xyz','421306','xyz','2026-07-27 14:36:17'),(4,1,'xyz','xyz','9527444269','xy','xyz','421308','xyz','2026-07-27 14:42:33'),(5,1,'test','test','9527444269','bhiwandi','maharashtra','421308','india','2026-07-28 08:30:44'),(6,1,'test1','test','09527444269','bhiwANDI','MAHARASHTRA','421308','India','2026-07-28 08:36:16'),(7,1,'ansari','test','09527444269','bhiwANDI','MAHARASHTRA','421308','India','2026-07-28 08:57:44'),(8,1,'aaa','test','09527444269','bhiwANDI','MAHARASHTRA','421308','India','2026-07-28 09:10:01'),(9,1,'ansari','test','09527444269','bhiwANDI','MAHARASHTRA','421308','India','2026-07-28 09:39:52'),(10,1,'Touqeer','test','09527444269','bhiwANDI','MAHARASHTRA','421308','India','2026-07-28 10:25:50'),(11,1,'fan','test','09527444269','bhiwANDI','MAHARASHTRA','421308','India','2026-07-28 11:28:28');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `size` varchar(20) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (16,2,6,'6Y',NULL,'2026-07-28 11:27:33'),(17,12,1,'6Y',NULL,'2026-07-28 11:49:44'),(18,12,1,'6Y',NULL,'2026-07-28 11:49:47'),(19,4,1,'10Y',NULL,'2026-07-28 11:51:04');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Boys',NULL),(2,'Girls',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (8,6,4,2,899.00),(9,7,5,1,699.00),(10,8,2,6,599.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `address_id` int NOT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `shipping` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `payment_status` enum('Pending','Paid','Failed','Refunded') DEFAULT 'Pending',
  `order_status` enum('Pending','Paid','Shipped','Delivered','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `address_id` (`address_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (6,1,9,1798.00,179.80,0.00,1977.80,'Paid','Paid','2026-07-28 09:39:52'),(7,1,10,699.00,69.90,0.00,768.90,'Paid','Paid','2026-07-28 10:25:50'),(8,1,11,3594.00,359.40,0.00,3953.40,'Paid','Paid','2026-07-28 11:28:28');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('Pending','Success','Failed') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_colors`
--

DROP TABLE IF EXISTS `product_colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_colors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `color` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_colors`
--

LOCK TABLES `product_colors` WRITE;
/*!40000 ALTER TABLE `product_colors` DISABLE KEYS */;
INSERT INTO `product_colors` VALUES (1,1,'#1B2A5B'),(2,1,'#000000'),(3,1,'#F44336'),(4,1,'#4CAF50'),(5,2,'#1B2A5B'),(6,2,'#000000'),(7,2,'#F44336'),(8,2,'#4CAF50'),(9,3,'#1B2A5B'),(10,3,'#000000'),(11,3,'#F44336'),(12,3,'#4CAF50'),(13,4,'#1B2A5B'),(14,4,'#000000'),(15,4,'#F44336'),(16,4,'#4CAF50'),(17,5,'Olive'),(18,6,'Yellow'),(19,7,'Navy'),(20,8,'Sky Blue'),(21,9,'Green'),(22,10,'Red'),(23,11,'Blue'),(24,12,'Grey'),(25,13,'Black'),(26,14,'White'),(27,15,'Black'),(28,16,'Blue'),(29,17,'Dark Blue'),(30,18,'Orange'),(31,19,'Brown'),(32,20,'White');
/*!40000 ALTER TABLE `product_colors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_images` (`product_id`),
  CONSTRAINT `fk_product_images` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'https://i.imgur.com/R2PN9Wq.jpeg'),(2,1,'https://i.imgur.com/IvxMPFr.jpeg'),(3,1,'https://i.imgur.com/7eW9nXP.jpeg'),(4,2,'https://i.imgur.com/ZKGofuB.jpeg'),(5,2,'https://i.imgur.com/GJi73H0.jpeg'),(6,2,'https://i.imgur.com/633Fqrz.jpeg'),(7,3,'https://i.imgur.com/mp3rUty.jpeg'),(8,3,'https://i.imgur.com/JQRGIc2.jpeg'),(9,4,'https://i.imgur.com/9LFjwpI.jpeg'),(10,4,'https://i.imgur.com/vzrTgUR.jpeg'),(11,4,'https://i.imgur.com/p5NdI6n.jpeg'),(12,5,'https://i.imgur.com/R3iobJA.jpeg'),(13,5,'https://i.imgur.com/Wv2KTsf.jpeg'),(14,5,'https://i.imgur.com/76HAxcA.jpeg'),(15,6,'https://i.imgur.com/wXuQ7bm.jpeg'),(16,6,'https://i.imgur.com/BZrIEmb.jpeg'),(17,6,'https://i.imgur.com/KcT6BE0.jpeg'),(18,7,'https://i.imgur.com/cBuLvBi.jpeg'),(19,7,'https://i.imgur.com/N1GkCIR.jpeg'),(20,7,'https://i.imgur.com/kKc9A5p.jpeg'),(21,8,'https://i.imgur.com/KeqG6r4.jpeg'),(22,8,'https://i.imgur.com/xGQOw3p.jpeg'),(23,8,'https://i.imgur.com/oO5OUjb.jpeg'),(24,9,'https://i.imgur.com/UsFIvYs.jpeg'),(25,9,'https://i.imgur.com/YIq57b6.jpeg'),(26,10,'https://images.pexels.com/photos/428340/pexels-photo-428340.jpeg'),(27,11,'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg'),(28,12,'https://images.pexels.com/photos/6311658/pexels-photo-6311658.jpeg'),(29,13,'https://images.pexels.com/photos/6311609/pexels-photo-6311609.jpeg'),(30,14,'https://i.imgur.com/UsFIvYs.jpeg'),(31,14,'https://i.imgur.com/YIq57b6.jpeg'),(32,15,'https://images.pexels.com/photos/6311484/pexels-photo-6311484.jpeg'),(33,16,'https://images.pexels.com/photos/6311605/pexels-photo-6311605.jpeg'),(34,17,'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg'),(35,18,'https://images.pexels.com/photos/3775534/pexels-photo-3775534.jpeg'),(36,19,'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg'),(37,20,'https://images.pexels.com/photos/3775531/pexels-photo-3775531.jpeg');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_sizes`
--

DROP TABLE IF EXISTS `product_sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_sizes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `size` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_sizes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_sizes`
--

LOCK TABLES `product_sizes` WRITE;
/*!40000 ALTER TABLE `product_sizes` DISABLE KEYS */;
INSERT INTO `product_sizes` VALUES (1,1,'4Y'),(2,1,'5Y'),(3,2,'6Y'),(4,2,'7Y'),(5,3,'8Y'),(6,3,'10Y'),(7,4,'10Y'),(8,4,'12Y'),(9,5,'6Y'),(10,5,'7Y'),(11,6,'8Y'),(12,6,'10Y'),(13,7,'5Y'),(14,7,'6Y'),(15,8,'3Y'),(16,8,'4Y'),(17,9,'10Y'),(18,9,'12Y'),(19,10,'8Y'),(20,10,'10Y'),(21,11,'8Y'),(22,11,'10Y'),(23,12,'6Y'),(24,12,'7Y'),(25,13,'4Y'),(26,13,'5Y'),(27,14,'10Y'),(28,14,'12Y'),(29,15,'8Y'),(30,15,'10Y'),(31,16,'6Y'),(32,16,'7Y'),(33,17,'10Y'),(34,17,'12Y'),(35,18,'8Y'),(36,18,'10Y'),(37,19,'10Y'),(38,19,'12Y'),(39,20,'6Y'),(40,20,'7Y');
/*!40000 ALTER TABLE `product_sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category_id` int DEFAULT NULL,
  `stock` int DEFAULT '0',
  `rating` decimal(2,1) DEFAULT '0.0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `sub_category` varchar(100) DEFAULT NULL,
  `age_group` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_product_category` (`category_id`),
  CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Dino Print T-Shirt','',449.00,1,100,4.5,'2026-07-27 10:30:14','T-Shirts','4-5 Years'),(2,'Striped T-Shirt','',599.00,2,100,4.4,'2026-07-27 10:30:14','T-Shirts','6-7 Years'),(3,'Denim Jacket','',999.00,1,100,4.6,'2026-07-27 10:30:14','Jackets','8-10 Years'),(4,'Graphic Hoodie','',899.00,1,100,4.3,'2026-07-27 10:30:14','Hoodies','10-12 Years'),(5,'Cargo Pants','',699.00,1,100,4.4,'2026-07-27 10:30:14','Pants','6-7 Years'),(6,'Check Shirt','',599.00,1,100,4.2,'2026-07-27 10:30:15','Shirts','8-10 Years'),(7,'Jogger Pants','',649.00,1,100,4.3,'2026-07-27 10:30:15','Pants','5-6 Years'),(8,'Printed T-Shirt','',449.00,1,100,4.1,'2026-07-27 10:30:15','T-Shirts','3-4 Years'),(9,'Bomber Jacket','',1199.00,1,100,4.6,'2026-07-27 10:30:15','Jackets','10-12 Years'),(10,'Polo T-Shirt','',599.00,1,100,4.3,'2026-07-27 10:30:15','T-Shirts','8-10 Years'),(11,'Slim Fit Jeans','',799.00,1,100,4.5,'2026-07-27 10:30:15','Jeans','8-10 Years'),(12,'Hoodie Set','',1099.00,1,100,4.2,'2026-07-27 10:30:15','Hoodies','6-7 Years'),(13,'Cotton Shorts','',399.00,1,100,4.4,'2026-07-27 10:30:15','Shorts','4-5 Years'),(14,'Casual Shirt','',699.00,1,100,4.5,'2026-07-27 10:30:15','Shirts','10-12 Years'),(15,'Winter Hoodie','',999.00,1,100,4.8,'2026-07-27 10:30:15','Hoodies','8-10 Years'),(16,'Denim Shorts','',549.00,1,100,4.4,'2026-07-27 10:30:15','Shorts','6-7 Years'),(17,'Casual Jeans','',899.00,1,100,4.5,'2026-07-27 10:30:15','Jeans','10-12 Years'),(18,'Sports T-Shirt','',499.00,1,100,4.6,'2026-07-27 10:30:15','T-Shirts','8-10 Years'),(19,'Warm Jacket','',1399.00,1,100,4.7,'2026-07-27 10:30:15','Jackets','10-12 Years'),(20,'Classic Polo','',649.00,1,100,4.4,'2026-07-27 10:30:15','T-Shirts','6-7 Years');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `google_id` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `google_id` (`google_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'102648989233813470908','Touqeer _ibn_Khursheed','touqeeransari001@gmail.com','https://lh3.googleusercontent.com/a/ACg8ocLZk7wTqkJOtPKbIyleztgUhpM_6gUIT7oTcmkXFI1BXZFBQsi-=s96-c','2026-07-27 14:25:47');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-28 19:00:03
