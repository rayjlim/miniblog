
-- phpMyAdmin SQL Dump
-- version 2.11.11.3
-- http://www.phpmyadmin.net
--
-- Host: 50.63.229.106
-- Generation Time: Nov 30, 2019 at 09:59 AM
-- Server version: 5.0.96
-- PHP Version: 5.1.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `lilplaytmain`
--

-- --------------------------------------------------------

--
-- Table structure for table `sms_entries`
--

CREATE TABLE `sms_entries` (
  `id` int(11) NOT NULL,
  `content` text CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `user_id` int(11) NOT NULL,
  `locations` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

ALTER TABLE `sms_entries`
  ADD PRIMARY KEY (`id`);
