-- Stadium Ticket Pro - Morocco seed
-- Run after migrations. Images path: assets/images/stadiums/

-- Stadiums (5 stades marocains)
INSERT INTO stadiums (id, name, city, capacity, meta, created_at) VALUES
(1, 'Stade Mohammed V', 'Casablanca', 45000, '{"image":"assets/images/stadiums/mohammed_v_stadium_1600.webp","imageMobile":"assets/images/stadiums/mohammed_v_stadium_800.webp","imageThumb":"assets/images/stadiums/mohammed_v_stadium_thumb.webp","alt":"Stade Mohammed V — Casablanca, façade et tribunes","notes":"Home of Raja & Wydad","source":"Wikimedia Commons"}', now()),
(2, 'Stade de Marrakech', 'Marrakech', 45240, '{"image":"assets/images/stadiums/stade_marrakech_1600.webp","imageMobile":"assets/images/stadiums/stade_marrakech_800.webp","imageThumb":"assets/images/stadiums/stade_marrakech_thumb.webp","alt":"Grand Stade de Marrakech, vue extérieure","source":"Wikimedia Commons"}', now()),
(3, 'Complexe sportif de Fès', 'Fès', 45000, '{"image":"assets/images/stadiums/complexe_sportif_fes_1600.webp","imageMobile":"assets/images/stadiums/complexe_sportif_fes_800.webp","imageThumb":"assets/images/stadiums/complexe_sportif_fes_thumb.webp","alt":"Complexe sportif de Fès — tribunes et pelouse","source":"Wikimedia Commons"}', now()),
(4, 'Prince Moulay Abdellah Stadium', 'Rabat', 69500, '{"image":"assets/images/stadiums/moulay_abdellah_1600.webp","imageMobile":"assets/images/stadiums/moulay_abdellah_800.webp","imageThumb":"assets/images/stadiums/moulay_abdellah_thumb.webp","alt":"Prince Moulay Abdellah Stadium — Rabat","notes":"Sports complex, national team venue","source":"Wikimedia Commons"}', now()),
(5, 'Grand Stade de Tanger (Ibn Batouta)', 'Tanger', 75600, '{"image":"assets/images/stadiums/tanger_ibn_batouta_1600.webp","imageMobile":"assets/images/stadiums/tanger_ibn_batouta_800.webp","imageThumb":"assets/images/stadiums/tanger_ibn_batouta_thumb.webp","alt":"Grand Stade de Tanger (Ibn Batouta)","source":"Wikimedia Commons"}', now())
ON CONFLICT (id) DO NOTHING;

SELECT setval('stadiums_id_seq', (SELECT COALESCE(MAX(id),1) FROM stadiums));

-- Seat zones per stadium (VIP, Tribune, Gradins, Supporters for Mohammed V; 3 zones for others)
INSERT INTO seat_zones (stadium_id, name, price_multiplier) VALUES
(1, 'VIP', 2.5), (1, 'Tribune principale', 1.5), (1, 'Gradins', 1.0), (1, 'Supporters A', 0.8), (1, 'Supporters B', 0.8),
(2, 'Loges VIP', 2.2), (2, 'Tribune centrale', 1.4), (2, 'Gradins', 1.0),
(3, 'VIP', 2.2), (3, 'Tribune', 1.4), (3, 'Gradins', 1.0),
(4, 'VIP', 2.5), (4, 'Tribune', 1.5), (4, 'Gradins', 1.0),
(5, 'VIP', 2.2), (5, 'Tribune', 1.4), (5, 'Gradins', 1.0);

-- Matches (4-6 matches démo - Raja, Wydad, MAS, KACM, AS FAR)
INSERT INTO matches (stadium_id, home_team, away_team, match_date, base_price, created_at) VALUES
(1, 'Raja Casablanca', 'Wydad AC', now() + interval '14 days', 150.00, now()),
(1, 'Raja Casablanca', 'AS FAR', now() + interval '28 days', 120.00, now()),
(2, 'Kawkab de Marrakech', 'Raja Casablanca', now() + interval '21 days', 80.00, now()),
(3, 'Maghreb de Fès', 'Wydad AC', now() + interval '35 days', 70.00, now()),
(4, 'AS FAR', 'Raja Casablanca', now() + interval '42 days', 100.00, now()),
(5, 'Ittihad Tanger', 'Wydad AC', now() + interval '49 days', 90.00, now());

-- Seats: ~120-500 per stadium, 3-5 zones. Simplified: rows A-Z, numbers 1-20 per zone.
-- Mohammed V: 5 zones, 400 seats total
DO $$
DECLARE zid INT; r TEXT; n INT; row_idx INT;
BEGIN
  FOR zid IN 1..5 LOOP
    FOR n IN 1..80 LOOP
      row_idx := (n-1)/20;
      r := chr(65 + row_idx);
      INSERT INTO seats (stadium_id, zone_id, row, number, status, version) VALUES (1, zid, r, mod(n-1, 20)+1, 'available', 0);
    END LOOP;
  END LOOP;
END $$;

-- Stade 2: 3 zones, 120 seats
DO $$
DECLARE zid INT; r TEXT; n INT;
BEGIN
  FOR zid IN 6..8 LOOP
    FOR n IN 1..40 LOOP
      r := chr(65 + (n-1)/10::int);
      INSERT INTO seats (stadium_id, zone_id, row, number, status, version) VALUES (2, zid, r, (n-1)%10+1, 'available', 0);
    END LOOP;
  END LOOP;
END $$;

-- Stade 3: 3 zones, 120 seats
DO $$
DECLARE zid INT; n INT;
BEGIN
  FOR zid IN 9..11 LOOP
    FOR n IN 1..40 LOOP
      INSERT INTO seats (stadium_id, zone_id, row, number, status, version) VALUES (3, zid, 'A', n, 'available', 0);
    END LOOP;
  END LOOP;
END $$;

-- Stade 4: 3 zones, 150 seats
DO $$
DECLARE zid INT; n INT;
BEGIN
  FOR zid IN 12..14 LOOP
    FOR n IN 1..50 LOOP
      INSERT INTO seats (stadium_id, zone_id, row, number, status, version) VALUES (4, zid, 'A', n, 'available', 0);
    END LOOP;
  END LOOP;
END $$;

-- Stade 5: 3 zones, 150 seats
DO $$
DECLARE zid INT; n INT;
BEGIN
  FOR zid IN 15..17 LOOP
    FOR n IN 1..50 LOOP
      INSERT INTO seats (stadium_id, zone_id, row, number, status, version) VALUES (5, zid, 'A', n, 'available', 0);
    END LOOP;
  END LOOP;
END $$;

-- Users: 2 admin, 2 user (passwords hashed with Argon2id - DemoAdmin1!, DemoAdmin2!, DemoUser1!, DemoUser2!)
-- Pre-generated Argon2id hashes for: DemoAdmin1! etc. (run backend to generate or use bcrypt equivalent)
INSERT INTO users (nom, prenom, email, password, role, created_at) VALUES
('Admin', 'One', 'admin1@stadium.ma', '$argon2id$v=19$m=65536,t=3,p=4$saltedhashplaceholder1$placeholder', 'admin', now()),
('Admin', 'Two', 'admin2@stadium.ma', '$argon2id$v=19$m=65536,t=3,p=4$saltedhashplaceholder2$placeholder', 'admin', now()),
('User', 'Demo1', 'user1@stadium.ma', '$argon2id$v=19$m=65536,t=3,p=4$saltedhashplaceholder3$placeholder', 'user', now()),
('User', 'Demo2', 'user2@stadium.ma', '$argon2id$v=19$m=65536,t=3,p=4$saltedhashplaceholder4$placeholder', 'user', now())
ON CONFLICT (email) DO NOTHING;

-- Note: Replace password hashes with real Argon2id hashes from backend (e.g. run: node -e "const argon2=require('argon2'); argon2.hash('DemoAdmin1!').then(console.log)" )
