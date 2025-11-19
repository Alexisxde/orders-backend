INSERT INTO users (_id, name, email, password, role, created_at, id_avatar) VALUES
("c7150dab-216d-43b6-8c89-0e22c5e2a06d", "User", "user@user.com", "$2b$10$fW6dSP9Nw2mUvpFdA0J0LOGCHH4CMqgSUK88qXzfaXOjB7CiFFUoW", "user", "2025-11-07 00:17:42", NULL);

INSERT INTO images (_id, url) VALUES
("dcbjswtbrziln4awz4a9", "https://res.cloudinary.com/dzfntog8k/image/upload/v1762300789/dcbjswtbrziln4awz4a9.jpg"),
("mxarf0aku4ub1b9sjqoa", "https://res.cloudinary.com/dzfntog8k/image/upload/v1762293853/mxarf0aku4ub1b9sjqoa.jpg");

INSERT INTO user_images (_id, image_id, user_id) VALUES
("c6295c63-d25c-4a0f-9881-f3171b888d3b", "dcbjswtbrziln4awz4a9", "c7150dab-216d-43b6-8c89-0e22c5e2a06d"),
("c7150dab-216d-43b6-8c89-0e22c5e2a06d", "mxarf0aku4ub1b9sjqoa", "c7150dab-216d-43b6-8c89-0e22c5e2a06d");

INSERT INTO products (_id, name, unit_price, description, disabled, created_at, image_id, user_id) VALUES
("1be933f9-ee4a-49a1-8b50-310dd0bb8961", "Hamburguesa Especial", 10000, "Deliciosa hamburguesa con ingredientes frescos y una salsa especial.", false, "2025-11-07 00:19:15", "c7150dab-216d-43b6-8c89-0e22c5e2a06d", "c7150dab-216d-43b6-8c89-0e22c5e2a06d");

INSERT INTO orders (_id, payment_method, status, name, phone, total, created_at, user_id) VALUES
("11111111-aaaa-bbbb-cccc-000000000006", "cash", "delivered", "Cliente Uno", "3794000001", 10000, "2025-06-06 12:15:00", "c7150dab-216d-43b6-8c89-0e22c5e2a06d"),
("22222222-aaaa-bbbb-cccc-000000000007", "cash", "delivered", "Cliente Dos", "3794000002", 20000, "2025-07-07 14:30:00", "c7150dab-216d-43b6-8c89-0e22c5e2a06d"),
("33333333-aaaa-bbbb-cccc-000000000008", "cash", "delivered", "Cliente Tres", NULL, 30000, "2025-08-08 18:45:00", "c7150dab-216d-43b6-8c89-0e22c5e2a06d"),
("44444444-aaaa-bbbb-cccc-000000000009", "cash", "delivered", "Cliente Cuatro", "3794000004", 10000, "2025-09-09 11:20:00", "c7150dab-216d-43b6-8c89-0e22c5e2a06d"),
("55555555-aaaa-bbbb-cccc-000000000010", "cash", "delivered", "Cliente Cinco", NULL, 20000, "2025-10-10 20:05:00", "c7150dab-216d-43b6-8c89-0e22c5e2a06d"),
("66666666-aaaa-bbbb-cccc-000000000011", "cash", "delivered", "Cliente Seis", "3794000006", 10000, "2025-11-11 09:50:00", "c7150dab-216d-43b6-8c89-0e22c5e2a06d");

INSERT INTO order_details (_id, quantity, price, observation, order_id, product_id) VALUES
("aaaa1111-bbbb-cccc-dddd-000000000006", 1, 10000, "Sin observaciones", "11111111-aaaa-bbbb-cccc-000000000006", "1be933f9-ee4a-49a1-8b50-310dd0bb8961"),
("aaaa2222-bbbb-cccc-dddd-000000000007", 2, 10000, "Uno con extra queso", "22222222-aaaa-bbbb-cccc-000000000007", "1be933f9-ee4a-49a1-8b50-310dd0bb8961"),
("aaaa3333-bbbb-cccc-dddd-000000000008", 3, 10000, "Sin cebolla", "33333333-aaaa-bbbb-cccc-000000000008", "1be933f9-ee4a-49a1-8b50-310dd0bb8961"),
("aaaa4444-bbbb-cccc-dddd-000000000009", 1, 10000, "Sin observaciones", "44444444-aaaa-bbbb-cccc-000000000009", "1be933f9-ee4a-49a1-8b50-310dd0bb8961"),
("aaaa5555-bbbb-cccc-dddd-000000000010", 2, 10000, "Sin observaciones", "55555555-aaaa-bbbb-cccc-000000000010", "1be933f9-ee4a-49a1-8b50-310dd0bb8961"),
("aaaa6666-bbbb-cccc-dddd-000000000011", 1, 10000, "Sin mayonesa", "66666666-aaaa-bbbb-cccc-000000000011", "1be933f9-ee4a-49a1-8b50-310dd0bb8961");

