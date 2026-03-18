-- =============================================
-- 1. TABLAS
-- =============================================

CREATE TABLE IF NOT EXISTS hotels (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    country     VARCHAR(100) NOT NULL,
    city        VARCHAR(100) NOT NULL,
    address     VARCHAR(255),
    stars       INTEGER CHECK (stars BETWEEN 1 AND 5),
    category    VARCHAR(100),
    phone       VARCHAR(50),
    email       VARCHAR(150),
    active      BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS room_types (
    id              BIGSERIAL PRIMARY KEY,
    hotel_id        BIGINT NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    capacity        INTEGER,
    price_per_night DECIMAL(10, 2),
    active          BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS availabilities (
    id               BIGSERIAL PRIMARY KEY,
    room_type_id     BIGINT NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    date             DATE NOT NULL,
    total_rooms      INTEGER NOT NULL,
    available_rooms  INTEGER NOT NULL,
    CONSTRAINT uq_room_date UNIQUE (room_type_id, date),
    CONSTRAINT chk_rooms CHECK (available_rooms <= total_rooms)
);

CREATE TABLE IF NOT EXISTS reservations (
    id                  BIGSERIAL PRIMARY KEY,
    reservation_code    VARCHAR(20) NOT NULL UNIQUE,
    room_type_id        BIGINT NOT NULL REFERENCES room_types(id),
    guest_name          VARCHAR(255) NOT NULL,
    guest_email         VARCHAR(150) NOT NULL,
    guest_phone         VARCHAR(50),
    check_in            DATE NOT NULL,
    check_out           DATE NOT NULL,
    number_of_rooms     INTEGER DEFAULT 1,
    total_price         DECIMAL(10, 2),
    status              VARCHAR(20) DEFAULT 'CONFIRMED'
                            CHECK (status IN ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING')),
    notes               TEXT,
    created_at          TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_dates CHECK (check_out > check_in)
);

-- =============================================
-- 2. ÍNDICES
-- =============================================

CREATE INDEX idx_hotels_name     ON hotels(name);
CREATE INDEX idx_hotels_city     ON hotels(city);
CREATE INDEX idx_hotels_country  ON hotels(country);
CREATE INDEX idx_hotels_active   ON hotels(active);

CREATE INDEX idx_room_types_hotel_id ON room_types(hotel_id);

CREATE INDEX idx_availabilities_date         ON availabilities(date);
CREATE INDEX idx_availabilities_room_type_id ON availabilities(room_type_id);

CREATE INDEX idx_reservations_code     ON reservations(reservation_code);
CREATE INDEX idx_reservations_status   ON reservations(status);
CREATE INDEX idx_reservations_check_in ON reservations(check_in);
CREATE INDEX idx_reservations_guest    ON reservations(guest_email);

-- =============================================
-- 3. HOTELES
-- =============================================

INSERT INTO hotels (name, country, city, address, stars, category, phone, email, active) VALUES
('Hotel Arts Barcelona',     'España',        'Barcelona', 'Carrer de la Marina, 19',        5, 'Lujo',       '+34 932 211 000',  'info@hotelartsbarcelona.com', TRUE),
('Hotel Ritz Madrid',        'España',        'Madrid',    'Plaza de la Lealtad, 5',          5, 'Lujo',       '+34 917 016 767',  'info@ritzmadrid.com',         TRUE),
('Hotel Alfonso XIII',       'España',        'Sevilla',   'Calle San Fernando, 2',           5, 'Lujo',       '+34 954 917 000',  'info@alfonsoxiii.com',        TRUE),
('Grand Hotel Excelsior',    'Italia',        'Roma',      'Via Veneto, 125',                 5, 'Lujo',       '+39 06 4708',      'info@excelsiorroma.com',      TRUE),
('Jumeirah Burj Al Arab',    'Emiratos',      'Dubái',     'Jumeirah Beach Road',             5, 'Ultra Lujo', '+971 4 301 7777',  'info@jumeirah.com',           TRUE),
('Baglioni Resort Maldivas', 'Maldivas',      'Maafushi',  'Maagau Island, Dhaalu Atoll',    5, 'Resort',     '+960 676 0000',    'info@baglioniresort.com',     TRUE),
('Hotel Casa Fuster',        'España',        'Barcelona', 'Passeig de Gràcia, 132',          5, 'Boutique',   '+34 932 553 000',  'info@hotelcasafuster.com',    TRUE),
('Mandarin Oriental',        'Reino Unido',   'Londres',   'Hyde Park Corner, 66',            5, 'Lujo',       '+44 20 7235 2000', 'info@mandarinlondres.com',    TRUE);

-- =============================================
-- 4. TIPOS DE HABITACIÓN
-- =============================================

INSERT INTO room_types (hotel_id, name, description, capacity, price_per_night, active) VALUES
-- Hotel Arts Barcelona (hotel_id: 1) → IDs 1, 2, 3
(1, 'Habitación Superior', 'Vistas al mar Mediterráneo, cama king size',        2, 350.00,  TRUE),
(1, 'Suite Junior',        'Salón independiente, terraza privada con vistas',   2, 650.00,  TRUE),
(1, 'Suite Arts',          'Suite de lujo con mayordomo personal incluido',     4, 1200.00, TRUE),

-- Hotel Ritz Madrid (hotel_id: 2) → IDs 4, 5, 6
(2, 'Habitación Deluxe',   'Vistas a Plaza de la Lealtad, decoración clásica', 2, 420.00,  TRUE),
(2, 'Suite Junior',        'Sala de estar separada, baño de mármol',           2, 780.00,  TRUE),
(2, 'Suite Real',          'Suite presidencial, comedor privado',              4, 2500.00, TRUE),

-- Hotel Alfonso XIII (hotel_id: 3) → IDs 7, 8
(3, 'Habitación Superior', 'Patio andaluz, arquitectura mudéjar',              2, 380.00,  TRUE),
(3, 'Suite Sevilla',       'Terraza con vistas a la Giralda',                  2, 900.00,  TRUE),

-- Grand Hotel Excelsior Roma (hotel_id: 4) → IDs 9, 10
(4, 'Habitación Classic',  'Decoración imperial italiana, vistas a Via Veneto',2, 310.00,  TRUE),
(4, 'Suite Imperiale',     'La suite más icónica de Roma, 300m²',             4, 3500.00, TRUE),

-- Jumeirah Burj Al Arab (hotel_id: 5) → IDs 11, 12
(5, 'Suite Deluxe',        'Suite dúplex con vistas al Golfo Pérsico',         2, 2800.00, TRUE),
(5, 'Suite Presidencial',  'Butler service 24h, piscina privada',              4, 8000.00, TRUE),

-- Baglioni Resort Maldivas (hotel_id: 6) → IDs 13, 14
(6, 'Villa Laguna',        'Villa sobre el agua, acceso directo al océano',    2, 1800.00, TRUE),
(6, 'Villa Presidencial',  'Villa privada con piscina infinita y chef privado',4, 5500.00, TRUE),

-- Hotel Casa Fuster (hotel_id: 7) → IDs 15, 16
(7, 'Habitación Deluxe',   'Edificio modernista de Domènech i Montaner',       2, 280.00,  TRUE),
(7, 'Suite Fuster',        'La suite más grande del Passeig de Gràcia',        2, 750.00,  TRUE),

-- Mandarin Oriental Londres (hotel_id: 8) → IDs 17, 18
(8, 'Habitación Hyde Park','Vistas directas a Hyde Park',                      2, 520.00,  TRUE),
(8, 'Suite Mandarin',      'Terraza privada con vistas panorámicas de Londres',4, 1900.00, TRUE);

-- =============================================
-- 5. DISPONIBILIDAD
-- =============================================

INSERT INTO availabilities (room_type_id, date, total_rooms, available_rooms) VALUES
-- Arts Barcelona - Habitación Superior (id: 1)
(1, CURRENT_DATE,      20, 8),
(1, CURRENT_DATE + 1,  20, 12),
(1, CURRENT_DATE + 2,  20, 5),
(1, CURRENT_DATE + 3,  20, 15),
(1, CURRENT_DATE + 4,  20, 3),
(1, CURRENT_DATE + 5,  20, 18),
(1, CURRENT_DATE + 6,  20, 0),
(1, CURRENT_DATE + 7,  20, 10),
(1, CURRENT_DATE + 14, 20, 20),
(1, CURRENT_DATE + 30, 20, 20),

-- Arts Barcelona - Suite Junior (id: 2)
(2, CURRENT_DATE,      8, 2),
(2, CURRENT_DATE + 1,  8, 5),
(2, CURRENT_DATE + 2,  8, 0),
(2, CURRENT_DATE + 3,  8, 7),
(2, CURRENT_DATE + 4,  8, 3),
(2, CURRENT_DATE + 5,  8, 8),
(2, CURRENT_DATE + 7,  8, 4),
(2, CURRENT_DATE + 14, 8, 8),

-- Arts Barcelona - Suite Arts (id: 3)
(3, CURRENT_DATE,      3, 1),
(3, CURRENT_DATE + 1,  3, 0),
(3, CURRENT_DATE + 2,  3, 2),
(3, CURRENT_DATE + 7,  3, 3),
(3, CURRENT_DATE + 14, 3, 3),

-- Ritz Madrid - Habitación Deluxe (id: 4)
(4, CURRENT_DATE,      15, 6),
(4, CURRENT_DATE + 1,  15, 10),
(4, CURRENT_DATE + 2,  15, 4),
(4, CURRENT_DATE + 3,  15, 13),
(4, CURRENT_DATE + 4,  15, 0),
(4, CURRENT_DATE + 5,  15, 15),
(4, CURRENT_DATE + 7,  15, 9),
(4, CURRENT_DATE + 14, 15, 15),

-- Ritz Madrid - Suite Junior (id: 5)
(5, CURRENT_DATE,      6, 3),
(5, CURRENT_DATE + 1,  6, 1),
(5, CURRENT_DATE + 2,  6, 6),
(5, CURRENT_DATE + 3,  6, 4),
(5, CURRENT_DATE + 7,  6, 6),
(5, CURRENT_DATE + 14, 6, 6),

-- Alfonso XIII - Habitación Superior (id: 7)
(7, CURRENT_DATE,      12, 7),
(7, CURRENT_DATE + 1,  12, 4),
(7, CURRENT_DATE + 2,  12, 11),
(7, CURRENT_DATE + 3,  12, 2),
(7, CURRENT_DATE + 4,  12, 12),
(7, CURRENT_DATE + 7,  12, 9),
(7, CURRENT_DATE + 14, 12, 12),

-- Alfonso XIII - Suite Sevilla (id: 8)
(8, CURRENT_DATE,      4, 1),
(8, CURRENT_DATE + 1,  4, 0),
(8, CURRENT_DATE + 2,  4, 3),
(8, CURRENT_DATE + 3,  4, 4),
(8, CURRENT_DATE + 7,  4, 2),
(8, CURRENT_DATE + 14, 4, 4),

-- Jumeirah - Suite Deluxe (id: 11)
(11, CURRENT_DATE,      10, 4),
(11, CURRENT_DATE + 1,  10, 7),
(11, CURRENT_DATE + 2,  10, 2),
(11, CURRENT_DATE + 3,  10, 10),
(11, CURRENT_DATE + 7,  10, 6),
(11, CURRENT_DATE + 14, 10, 10),

-- Baglioni Maldivas - Villa Laguna (id: 13)
(13, CURRENT_DATE,      15, 6),
(13, CURRENT_DATE + 1,  15, 3),
(13, CURRENT_DATE + 2,  15, 11),
(13, CURRENT_DATE + 3,  15, 0),
(13, CURRENT_DATE + 4,  15, 8),
(13, CURRENT_DATE + 7,  15, 15),
(13, CURRENT_DATE + 14, 15, 15),

-- Mandarin Oriental - Habitación Hyde Park (id: 17)
(17, CURRENT_DATE,      18, 9),
(17, CURRENT_DATE + 1,  18, 14),
(17, CURRENT_DATE + 2,  18, 3),
(17, CURRENT_DATE + 3,  18, 18),
(17, CURRENT_DATE + 7,  18, 11),
(17, CURRENT_DATE + 14, 18, 18);

-- =============================================
-- 6. RESERVAS
-- =============================================

INSERT INTO reservations (reservation_code, room_type_id, guest_name, guest_email, guest_phone, check_in, check_out, number_of_rooms, total_price, status, notes) VALUES
-- Confirmadas
('ALT-000001', 1,  'Carlos Martínez',  'carlos.martinez@email.com',   '+34 611 222 333',  CURRENT_DATE,       CURRENT_DATE + 3,  1, 1050.00,  'CONFIRMED', 'Cliente VIP, solicita habitación alta'),
('ALT-000002', 4,  'Sophie Dubois',    'sophie.dubois@email.fr',       '+33 6 12 34 56',   CURRENT_DATE,       CURRENT_DATE + 5,  2, 4200.00,  'CONFIRMED', NULL),
('ALT-000003', 7,  'James Whitfield',  'j.whitfield@company.co.uk',    '+44 7700 900123',  CURRENT_DATE + 1,   CURRENT_DATE + 4,  1, 1140.00,  'CONFIRMED', 'Llegada tardía, después de las 22h'),
('ALT-000004', 11, 'Ahmed Al-Rashid',  'ahmed@alrashid.ae',            '+971 50 123 4567', CURRENT_DATE + 1,   CURRENT_DATE + 7,  1, 16800.00, 'CONFIRMED', 'Solicita traslado privado desde aeropuerto'),
('ALT-000005', 13, 'Isabella Rossi',   'isabella.rossi@gmail.com',     '+39 333 444 5555', CURRENT_DATE + 2,   CURRENT_DATE + 9,  1, 12600.00, 'CONFIRMED', 'Luna de miel, decoración romántica'),
('ALT-000006', 2,  'María González',   'maria.gonzalez@empresa.es',    '+34 699 888 777',  CURRENT_DATE + 2,   CURRENT_DATE + 4,  1, 1300.00,  'CONFIRMED', NULL),
('ALT-000007', 17, 'Hans Mueller',     'hans.mueller@berlin.de',       '+49 30 12345678',  CURRENT_DATE + 3,   CURRENT_DATE + 6,  2, 3120.00,  'CONFIRMED', 'Viaje de negocios'),
('ALT-000008', 5,  'Laura Sánchez',    'laura.sanchez@agencia.es',     '+34 622 111 000',  CURRENT_DATE + 3,   CURRENT_DATE + 8,  1, 3900.00,  'CONFIRMED', NULL),

-- Pendientes
('ALT-000009', 8,  'Pierre Lefebvre',  'pierre@lefebvre.fr',           '+33 7 98 76 54',   CURRENT_DATE + 5,   CURRENT_DATE + 8,  1, 2700.00,  'PENDING',   'Pendiente de confirmación de pago'),
('ALT-000010', 3,  'Yuki Tanaka',      'yuki.tanaka@jp.com',           '+81 90 1234 5678', CURRENT_DATE + 7,   CURRENT_DATE + 10, 1, 3600.00,  'PENDING',   'Solicita factura a nombre de empresa'),

-- Completadas
('ALT-000011', 1,  'Roberto Fernández','roberto.fdez@hotmail.com',     '+34 655 444 333',  CURRENT_DATE - 7,   CURRENT_DATE - 4,  2, 2100.00,  'COMPLETED', NULL),
('ALT-000012', 4,  'Emma Thompson',    'emma.thompson@uk.com',         '+44 7911 123456',  CURRENT_DATE - 10,  CURRENT_DATE - 7,  1, 1260.00,  'COMPLETED', 'Repite cliente, tercera estancia'),
('ALT-000013', 7,  'Diego Ramírez',    'diego.ramirez@mx.com',         '+52 55 1234 5678', CURRENT_DATE - 5,   CURRENT_DATE - 2,  1, 1140.00,  'COMPLETED', NULL),
('ALT-000014', 13, 'Mei Lin',          'mei.lin@shanghai.cn',          '+86 138 0013 8000',CURRENT_DATE - 14,  CURRENT_DATE - 7,  1, 12600.00, 'COMPLETED', 'Solicitud especial: dieta vegana'),
('ALT-000015', 17, 'Oliver Schmidt',   'oliver.schmidt@de.com',        '+49 89 12345',     CURRENT_DATE - 3,   CURRENT_DATE - 1,  1, 1040.00,  'COMPLETED', NULL),

-- Canceladas
('ALT-000016', 2,  'Ana Pérez',        'ana.perez@correo.es',          '+34 677 555 444',  CURRENT_DATE + 10,  CURRENT_DATE + 14, 1, 2600.00,  'CANCELLED', 'Cancelación por motivos personales'),
('ALT-000017', 11, 'Raj Patel',        'raj.patel@india.in',           '+91 98765 43210',  CURRENT_DATE + 5,   CURRENT_DATE + 12, 1, 19600.00, 'CANCELLED', 'Cancelado por el cliente'),
('ALT-000018', 5,  'Claire Moreau',    'claire.moreau@france.fr',      '+33 6 55 44 33',   CURRENT_DATE + 8,   CURRENT_DATE + 11, 2, 4680.00,  'CANCELLED', NULL);