USE ai_mess_food;

INSERT INTO donors (id, name, lat, lng, trust_score) VALUES
('donor-1', 'Green Valley Mess', 12.9716000, 77.5946000, 82),
('donor-2', 'North Campus Cafeteria', 12.9345000, 77.6101000, 76)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO ngos (id, name, lat, lng, capacity_meals, current_load, trust_score, phone) VALUES
('ngo-1', 'Hope Meals Foundation', 12.9850000, 77.6020000, 140, 40, 91, '+91-90000-10001'),
('ngo-2', 'Little Stars Orphanage', 12.9270000, 77.6260000, 80, 30, 84, '+91-90000-10002'),
('ngo-3', 'Care Home Trust', 12.9550000, 77.5700000, 120, 85, 88, '+91-90000-10003'),
('ngo-4', 'Night Shelter Kitchen', 13.0050000, 77.6150000, 200, 160, 72, '+91-90000-10004')
ON DUPLICATE KEY UPDATE name = VALUES(name), capacity_meals = VALUES(capacity_meals);

