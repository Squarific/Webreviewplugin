/*
	USE THIS TO REMOVE ALL DATA
*/

DROP TABLE statusses;
DROP TABLE users;
DROP TABLE reviews;
DROP TABLE additions;
DROP TABLE logs;

/*
	USE THIS TO SETUP A NEW DATABASE
*/

CREATE TABLE IF NOT EXISTS statusses (
	statusId INT AUTO_INCREMENT,
	description VARCHAR(255),
	PRIMARY KEY (statusId)
);

CREATE TABLE IF NOT EXISTS emailSecrets (
	secretId BIGINT AUTO_INCREMENT,
	userId BIGINT,
	secret VARCHAR(12)
);

CREATE TABLE IF NOT EXISTS users (
	userId BIGINT AUTO_INCREMENT,
	username VARCHAR(255),
	password VARCHAR(255),
	email VARCHAR(255),
	email_confirmed TINYINT(1),
	moderator TINYINT(1),
	PRIMARY KEY (userId)
);

CREATE TABLE IF NOT EXISTS reviews (
	reviewId BIGINT AUTO_INCREMENT,
	userId BIGINT,
	modMade TINYINT(1),
	modVerified TINYINT(1),
	domainContacted TINYINT(1),
	visible TINYINT(1) DEFAULT TRUE,
	contested INT, /* 0: FALSE, 1: TRUE, 2: FAILED*/
	reviewIcon INT, /* 0: GREEN, 1: YELLOW, 2: RED, 3: GRAY*/
	statusType INT,
	agreeVotes BIGINT,
	assignedMod BIGINT,
	reviewedDomain TEXT,
	reviewedTime DATETIME,
	shortDescription VARCHAR(255),
	longDescription TEXT,
	PRIMARY KEY (reviewId)
);

CREATE TABLE IF NOT EXISTS additions (
	additionId BIGINT AUTO_INCREMENT,
	reviewId BIGINT,
	shortDescription VARCHAR(255),
	longDescription TEXT,
	additionTime DATETIME,
	PRIMARY KEY (additionId)
);

CREATE TABLE IF NOT EXISTS logs (
	logId BIGINT AUTO_INCREMENT,
	targetId BIGINT,
	targetType INT, /* 0: UNKNOWN, 1: GENERAL, 2: REVIEWS, 3: ADDITIONS, 4 USERS*/
	description VARCHAR(255),
	logTime DATETIME,
	PRIMARY KEY (logId)
);