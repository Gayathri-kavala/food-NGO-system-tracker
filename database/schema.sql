CREATE DATABASE IF NOT EXISTS ai_mess_food;
USE ai_mess_food;

CREATE TABLE donors (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  trust_score INT NOT NULL DEFAULT 75,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ngos (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  capacity_meals INT NOT NULL,
  current_load INT NOT NULL DEFAULT 0,
  trust_score INT NOT NULL DEFAULT 75,
  phone VARCHAR(32),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE food_listings (
  id VARCHAR(64) PRIMARY KEY,
  donor_id VARCHAR(64) NOT NULL,
  food_type VARCHAR(80) NOT NULL,
  quantity_meals INT NOT NULL,
  image_url VARCHAR(255),
  prepared_at DATETIME NOT NULL,
  storage_condition VARCHAR(40) NOT NULL,
  temperature_c DECIMAL(5, 2) NOT NULL,
  safety_status ENUM('Safe', 'Risky', 'Unsafe') NOT NULL,
  safety_reason JSON NOT NULL,
  remaining_safe_hours DECIMAL(6, 2) NOT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'analyzed',
  created_at DATETIME NOT NULL,
  FOREIGN KEY (donor_id) REFERENCES donors(id)
);

CREATE TABLE pickups (
  id VARCHAR(64) PRIMARY KEY,
  food_listing_id VARCHAR(64) NOT NULL,
  ngo_id VARCHAR(64) NOT NULL,
  status VARCHAR(40) NOT NULL,
  driver_lat DECIMAL(10, 7),
  driver_lng DECIMAL(10, 7),
  eta_minutes INT,
  assigned_at DATETIME NOT NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (food_listing_id) REFERENCES food_listings(id),
  FOREIGN KEY (ngo_id) REFERENCES ngos(id)
);

CREATE TABLE trust_scores (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  entity_type ENUM('donor', 'ngo') NOT NULL,
  entity_id VARCHAR(64) NOT NULL,
  event VARCHAR(80) NOT NULL,
  delta INT NOT NULL,
  score_after INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE decision_logs (
  id VARCHAR(64) PRIMARY KEY,
  event VARCHAR(80) NOT NULL,
  payload JSON NOT NULL,
  created_at DATETIME NOT NULL
);

