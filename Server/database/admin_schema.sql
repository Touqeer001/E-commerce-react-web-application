CREATE TABLE IF NOT EXISTS admins (
  id INT NOT NULL AUTO_INCREMENT, name VARCHAR(100) NOT NULL, email VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL, role ENUM('SUPER_ADMIN','ADMIN','EDITOR') NOT NULL DEFAULT 'EDITOR',
  is_active TINYINT(1) NOT NULL DEFAULT 1, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id), UNIQUE KEY uq_admins_email (email)
);
UPDATE orders SET order_status = 'Confirmed' WHERE order_status = 'Paid';
ALTER TABLE orders MODIFY order_status ENUM('Pending','Confirmed','Packed','Shipped','Delivered','Cancelled') NOT NULL DEFAULT 'Pending';
