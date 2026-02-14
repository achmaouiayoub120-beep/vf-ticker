-- Stadium Ticket Pro - Initial schema (PostgreSQL 15+)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stadiums (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  capacity INT,
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seat_zones (
  id SERIAL PRIMARY KEY,
  stadium_id INT REFERENCES stadiums(id) ON DELETE CASCADE,
  name TEXT,
  price_multiplier NUMERIC(4,2) DEFAULT 1.0
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  stadium_id INT REFERENCES stadiums(id) ON DELETE CASCADE,
  home_team TEXT,
  away_team TEXT,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_matches_stadium ON matches(stadium_id);

CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  stadium_id INT REFERENCES stadiums(id) ON DELETE CASCADE,
  zone_id INT REFERENCES seat_zones(id) ON DELETE CASCADE,
  row CHAR(3),
  number INT,
  status VARCHAR(20) DEFAULT 'available',
  version INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE UNIQUE INDEX idx_seat_stadium_row_number ON seats(stadium_id, row, number);
CREATE INDEX idx_seats_zone ON seats(zone_id);
CREATE INDEX idx_seats_status ON seats(status);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  total NUMERIC(10,2),
  payment_status VARCHAR(20) DEFAULT 'pending',
  lock_token VARCHAR(64),
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id);

CREATE TABLE IF NOT EXISTS seat_reservations (
  id SERIAL PRIMARY KEY,
  lock_token VARCHAR(64) UNIQUE NOT NULL,
  match_id INT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  seat_id INT NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_reservations_expires ON seat_reservations(expires_at);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  match_id INT REFERENCES matches(id) ON DELETE CASCADE,
  seat_id INT REFERENCES seats(id) ON DELETE CASCADE,
  qr_code TEXT,
  status VARCHAR(20) DEFAULT 'issued'
);

CREATE INDEX idx_tickets_order ON tickets(order_id);
