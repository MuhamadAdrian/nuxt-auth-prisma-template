-- CreateTable
CREATE TABLE `student_classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(5) NOT NULL,
    `name` VARCHAR(25) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `gender` ENUM('Laki_Laki', 'Perempuan', 'Unknown') NULL DEFAULT 'Unknown',
    `place_of_birth` VARCHAR(50) NULL,
    `date_of_birth` DATETIME(3) NULL,
    `family_order` CHAR(2) NULL,
    `number_of_siblings` CHAR(2) NULL,
    `previous_school` VARCHAR(100) NULL,
    `last_education` ENUM('SD', 'SMP', 'SMA_SEDERAJAT', 'Sarjana', 'Magister', 'Doktor', 'Unknown') NULL DEFAULT 'Unknown',
    `phone_number` VARCHAR(16) NULL,
    `address` TEXT NULL,
    `neighborhood_association` VARCHAR(191) NULL,
    `citizens_association` VARCHAR(191) NULL,
    `student_class_id` INTEGER NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `Student_student_class_id_fkey`(`student_class_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` TEXT NOT NULL,
    `refresh_token` TEXT NOT NULL,
    `ip` VARCHAR(191) NULL,
    `device_name` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `os` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `Student_student_class_id_fkey` FOREIGN KEY (`student_class_id`) REFERENCES `student_classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
