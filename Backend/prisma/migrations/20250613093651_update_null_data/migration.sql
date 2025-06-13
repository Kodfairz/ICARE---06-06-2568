-- DropForeignKey
ALTER TABLE `healtharticles` DROP FOREIGN KEY `healtharticles_ibfk_3`;

-- AlterTable
ALTER TABLE `healtharticles` MODIFY `VideoID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `healtharticles` ADD CONSTRAINT `healtharticles_ibfk_3` FOREIGN KEY (`VideoID`) REFERENCES `videolibrary`(`VideoID`) ON DELETE SET NULL ON UPDATE RESTRICT;
