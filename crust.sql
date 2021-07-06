/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80023
 Source Host           : 127.0.0.1:3306
 Source Schema         : crust

 Target Server Type    : MySQL
 Target Server Version : 80023
 File Encoding         : 65001

 Date: 06/07/2021 16:36:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for file_upload_info
-- ----------------------------
DROP TABLE IF EXISTS `file_upload_info`;
CREATE TABLE `file_upload_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file_id` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '文件编号',
  `file_type` varchar(60) COLLATE utf8_bin NOT NULL COMMENT '文件类型',
  `folder_id` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '所在文件夹编号',
  `zip_id` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '压缩包编号',
  `cb_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '回调地址',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '文件状态：0：未压缩，1：已压缩，2：请求下载，3：正在下载，4：下载失败，5：完成回调',
  `update_time` int NOT NULL DEFAULT '0' COMMENT '更新时间',
  `create_time` int NOT NULL DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `file_id` (`file_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='上传文件信息表';

-- ----------------------------
-- Records of file_upload_info
-- ----------------------------
BEGIN;
INSERT INTO `file_upload_info` VALUES (1, '1625397355534', '.png', 'upload_1', '1625557581255', '', 1, 1625557581, 1625397355);
INSERT INTO `file_upload_info` VALUES (2, '1625397407558', '.png', 'upload_2', '1625457591304', '', 1, 1625457591, 1625397407);
INSERT INTO `file_upload_info` VALUES (3, '1625397522106', '.png', 'upload_3', '1625457630967', '', 1, 1625457630, 1625397522);
INSERT INTO `file_upload_info` VALUES (4, '1625397692763', '.zip', 'upload_4', '1625458565102', '', 1, 1625458565, 1625397692);
INSERT INTO `file_upload_info` VALUES (5, '1625455498190', '.jpg', 'upload_1', '1625557581255', '', 1, 1625557581, 1625455498);
INSERT INTO `file_upload_info` VALUES (6, '1625456219937', '.jpg', 'upload_1', '1625557581255', '', 1, 1625557581, 1625456220);
INSERT INTO `file_upload_info` VALUES (7, '1625457591160', '.jpg', 'upload_2', '1625457591304', '', 1, 1625457591, 1625457591);
INSERT INTO `file_upload_info` VALUES (8, '1625457630842', '.jpg', 'upload_3', '1625457630967', '', 1, 1625457630, 1625457630);
INSERT INTO `file_upload_info` VALUES (9, '1625458564982', '.jpg', 'upload_4', '1625458565102', 'http://127.0.0.1:7001/api/open/upload', 5, 1625490437, 1625458565);
INSERT INTO `file_upload_info` VALUES (10, '1625543273577', '.jpg', 'upload_1', '1625557581255', '', 1, 1625557581, 1625543273);
INSERT INTO `file_upload_info` VALUES (11, '1625543359850', '.jpg', 'upload_1', '1625557581255', '', 1, 1625557581, 1625543359);
INSERT INTO `file_upload_info` VALUES (12, '1625557581088', '.jpg', 'upload_1', '1625557581255', '', 1, 1625557581, 1625557581);
COMMIT;

-- ----------------------------
-- Table structure for zip_ipfs_info
-- ----------------------------
DROP TABLE IF EXISTS `zip_ipfs_info`;
CREATE TABLE `zip_ipfs_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `zip_id` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '文件编号',
  `cid` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '所在文件夹编号',
  `size` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '压缩包编号',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '文件状态：0：未下单，1：下单成功，2：下单失败或正在执行，3：未过期，4：已过期',
  `expired_on` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL DEFAULT '' COMMENT '过期区块',
  `calculated_at` varchar(60) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT '' COMMENT '当前区块',
  `update_time` int NOT NULL DEFAULT '0' COMMENT '更新时间',
  `create_time` int NOT NULL DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `zip_id` (`zip_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='压缩包信息表';

-- ----------------------------
-- Records of zip_ipfs_info
-- ----------------------------
BEGIN;
INSERT INTO `zip_ipfs_info` VALUES (1, '1625388896718', 'QmQf2YZNpWvQwgbx24Bf5DAcFxSChoFXedQPt9xx1gDq5A', '18356829', 3, '4864851', '2272851', 1625558479, 1625388896);
INSERT INTO `zip_ipfs_info` VALUES (2, '1625397355586', 'QmUcj4nHV3qSFL6wZ36BkaZzp69SXKNXJpx8opzALErBZ3', '1699893', 2, '0', '2274182', 1625558779, 1625397355);
INSERT INTO `zip_ipfs_info` VALUES (3, '1625397407614', 'QmZppVdp8XX7CPbxMfG4kZBtdgn1sDA3QbmZEvqnYQgZkW', '1699613', 2, '4867228', '2275228', 1625559079, 1625397407);
INSERT INTO `zip_ipfs_info` VALUES (4, '1625397522143', 'QmQ6zeCAjKvLp6gsGz68iF2Sgtz6T5XaKp9LCkAyq4Nxkc', '1699613', 3, '0', '2275378', 1625559379, 1625397522);
INSERT INTO `zip_ipfs_info` VALUES (5, '1625397692812', 'QmTQ25L2iwCat5re6XKEYYgvXcDtDpisfJs1R2HTuJEVz6', '1700273', 2, '0', '2275975', 1625559564, 1625397692);
INSERT INTO `zip_ipfs_info` VALUES (6, '1625455498367', 'QmYf66YYc4N187E4Xu2zDUchfZeVrbag1B2z6XZGPJyoTs', '18459051', 3, '4876001', '2284001', 1625559579, 1625455498);
INSERT INTO `zip_ipfs_info` VALUES (7, '1625456220051', 'Qmew5Us1aargNvDZN6q6ycv1zfc29NxdKu9cT6cZghUmVb', '36815791', 3, '4876520', '2284520', 1625559773, 1625456220);
INSERT INTO `zip_ipfs_info` VALUES (8, '1625457591304', 'QmXuqE9rejBAup7aH6Q3oqmPwN5dB6FpHQZVrbdGm8Wbfe', '18356829', 3, '4876397', '2284397', 1625560073, 1625457591);
INSERT INTO `zip_ipfs_info` VALUES (9, '1625457630967', 'QmUv32xJswkceEEiGK8f9a5CvBkh3yYa7tvr4erxFKnNY8', '18356829', 2, '0', '2284318', 1625560394, 1625457630);
INSERT INTO `zip_ipfs_info` VALUES (10, '1625458565102', 'QmTeM5MatM3nW1fDaZJGAr1VRavPc93ip5P88SsFfS6QN3', '18356829', 1, '', NULL, 1625458947, 1625458565);
INSERT INTO `zip_ipfs_info` VALUES (11, '1625557581255', 'QmZNFCKqwQ2E2ESUQABkB1vrGkUnTaPpmBrBKi7VdxRGne', '55172650', 1, '', NULL, 1625557643, 1625557581);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
