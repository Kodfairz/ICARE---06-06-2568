-- CreateTable
CREATE TABLE `admins` (
    `AdminID` INTEGER NOT NULL AUTO_INCREMENT,
    `AdminName` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`AdminID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articleedits` (
    `EditID` INTEGER NOT NULL AUTO_INCREMENT,
    `HealthArticleID` INTEGER NOT NULL,
    `AdminID` INTEGER NOT NULL,
    `EditDate` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `EditDescription` TEXT NULL,

    INDEX `AdminID`(`AdminID`),
    INDEX `HealthArticleID`(`HealthArticleID`),
    PRIMARY KEY (`EditID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `CategoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `CategoryName` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`CategoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disease_medications` (
    `DiseaseID` INTEGER NOT NULL,
    `MedicationID` INTEGER NOT NULL,

    INDEX `MedicationID`(`MedicationID`),
    PRIMARY KEY (`DiseaseID`, `MedicationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `disease_treatments` (
    `DiseaseID` INTEGER NOT NULL,
    `TreatmentID` INTEGER NOT NULL,

    INDEX `TreatmentID`(`TreatmentID`),
    PRIMARY KEY (`DiseaseID`, `TreatmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diseases` (
    `DiseaseID` INTEGER NOT NULL AUTO_INCREMENT,
    `DiseaseName` VARCHAR(255) NOT NULL,
    `Description` TEXT NULL,
    `CategoryID` INTEGER NOT NULL,
    `ICD10_Code` VARCHAR(20) NULL,
    `RiskFactors` TEXT NOT NULL,
    `Prevention` TEXT NOT NULL,
    `Symptoms` TEXT NOT NULL,
    `Diagnosis` TEXT NOT NULL,

    INDEX `CategoryID`(`CategoryID`),
    PRIMARY KEY (`DiseaseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedbacks` (
    `FeedbackID` INTEGER NOT NULL AUTO_INCREMENT,
    `FeedbackText` TEXT NOT NULL,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `HealthArticleID` INTEGER NULL,

    INDEX `HealthArticleID`(`HealthArticleID`),
    PRIMARY KEY (`FeedbackID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `healtharticles` (
    `HealthArticleID` INTEGER NOT NULL AUTO_INCREMENT,
    `DiseaseID` INTEGER NOT NULL,
    `AdminID` INTEGER NOT NULL,
    `ImageID` INTEGER NOT NULL,
    `VideoID` INTEGER NOT NULL,
    `Views` INTEGER NOT NULL,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `isActive` BOOLEAN NOT NULL,

    INDEX `AdminID`(`AdminID`),
    INDEX `DiseaseID`(`DiseaseID`),
    INDEX `ImageID`(`ImageID`),
    INDEX `VideoID`(`VideoID`),
    PRIMARY KEY (`HealthArticleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `imagelibrary` (
    `ImageID` INTEGER NOT NULL AUTO_INCREMENT,
    `ImageName` VARCHAR(255) NOT NULL,
    `ImageURL` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`ImageID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `medications` (
    `MedicationID` INTEGER NOT NULL AUTO_INCREMENT,
    `MedicationName` VARCHAR(255) NOT NULL,
    `GenericName` VARCHAR(255) NULL,
    `DosageForm` VARCHAR(50) NULL,
    `Strength` VARCHAR(50) NULL,
    `Indications` TEXT NULL,
    `SideEffects` TEXT NULL,
    `Contraindications` TEXT NULL,

    PRIMARY KEY (`MedicationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `treatments` (
    `TreatmentID` INTEGER NOT NULL AUTO_INCREMENT,
    `TreatmentName` VARCHAR(255) NOT NULL,
    `Description` TEXT NULL,
    `Procedures` TEXT NULL,
    `Duration` VARCHAR(50) NULL,
    `SideEffects` TEXT NULL,
    `Contraindications` TEXT NULL,

    PRIMARY KEY (`TreatmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `videoarticles` (
    `VideoArticleID` INTEGER NOT NULL AUTO_INCREMENT,
    `ImageID` INTEGER NOT NULL,
    `VideoID` INTEGER NOT NULL,
    `AdminID` INTEGER NOT NULL,
    `Title` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NOT NULL,
    `Views` INTEGER NOT NULL,
    `CreatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL,

    INDEX `VideoID`(`VideoID`),
    INDEX `AdminID`(`AdminID`),
    PRIMARY KEY (`VideoArticleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `videolibrary` (
    `VideoID` INTEGER NOT NULL AUTO_INCREMENT,
    `VideoName` VARCHAR(255) NOT NULL,
    `VideoURL` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`VideoID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articleedits` ADD CONSTRAINT `articleedits_ibfk_1` FOREIGN KEY (`HealthArticleID`) REFERENCES `healtharticles`(`HealthArticleID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `articleedits` ADD CONSTRAINT `articleedits_ibfk_2` FOREIGN KEY (`AdminID`) REFERENCES `admins`(`AdminID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `disease_medications` ADD CONSTRAINT `disease_medications_ibfk_1` FOREIGN KEY (`DiseaseID`) REFERENCES `diseases`(`DiseaseID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `disease_medications` ADD CONSTRAINT `disease_medications_ibfk_2` FOREIGN KEY (`MedicationID`) REFERENCES `medications`(`MedicationID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `disease_treatments` ADD CONSTRAINT `disease_treatments_ibfk_1` FOREIGN KEY (`DiseaseID`) REFERENCES `diseases`(`DiseaseID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `disease_treatments` ADD CONSTRAINT `disease_treatments_ibfk_2` FOREIGN KEY (`TreatmentID`) REFERENCES `treatments`(`TreatmentID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `diseases` ADD CONSTRAINT `diseases_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories`(`CategoryID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`HealthArticleID`) REFERENCES `healtharticles`(`HealthArticleID`) ON DELETE RESTRICT ON UPDATE SET NULL;

-- AddForeignKey
ALTER TABLE `healtharticles` ADD CONSTRAINT `healtharticles_ibfk_1` FOREIGN KEY (`DiseaseID`) REFERENCES `diseases`(`DiseaseID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `healtharticles` ADD CONSTRAINT `healtharticles_ibfk_2` FOREIGN KEY (`ImageID`) REFERENCES `imagelibrary`(`ImageID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `healtharticles` ADD CONSTRAINT `healtharticles_ibfk_3` FOREIGN KEY (`VideoID`) REFERENCES `videolibrary`(`VideoID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `healtharticles` ADD CONSTRAINT `healtharticles_ibfk_4` FOREIGN KEY (`AdminID`) REFERENCES `admins`(`AdminID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `videoarticles` ADD CONSTRAINT `videoarticles_ibfk_1` FOREIGN KEY (`VideoID`) REFERENCES `videolibrary`(`VideoID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `videoarticles` ADD CONSTRAINT `imagearticles_ibfk_1` FOREIGN KEY (`ImageID`) REFERENCES `imagelibrary`(`ImageID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `videoarticles` ADD CONSTRAINT `videoarticles_ibfk_2` FOREIGN KEY (`AdminID`) REFERENCES `admins`(`AdminID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
