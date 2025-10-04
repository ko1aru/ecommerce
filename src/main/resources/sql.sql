-- create database ecommerce;
use ecommerce;
show tables;

describe users;
select * from users;
update users set role='ADMIN' where id=2;
delete from users where id=7;
alter table users add validation_token VARCHAR(255);
alter table users add refresh_token VARCHAR(255);
update users set is_verified = 1 where id = 1;

select * from product_review_and_rating;
delete from product_review_and_rating where id = 4;

select * from product;
update product set average_rating = 0 where id = 3;
INSERT INTO product (name, description, brand, category, price, stock, image_url, average_rating) VALUES
('iPhone 14', 'Latest Apple iPhone with A15 Bionic', 'Apple', 'Smartphone', 79999, 50, 'https://m.media-amazon.com/images/I/61cwywLZR-L._SL1500_.jpg', 0),
('Galaxy S23', 'Samsung flagship Android smartphone', 'Samsung', 'Smartphone', 69999, 40, 'https://m.media-amazon.com/images/I/71qe6Yt-TPL._SL1500_.jpg', 0),
('Pixel 7 Pro', 'Google smartphone with Android 13', 'Google', 'Smartphone', 64999, 30, 'https://m.media-amazon.com/images/I/61xQO3p3AFL._SL1500_.jpg', 0),
('OnePlus 11', 'Flagship killer Android phone', 'OnePlus', 'Smartphone', 59999, 35, 'https://m.media-amazon.com/images/I/61amb0CfMGL._SL1500_.jpg', 0),
('MacBook Air M2', 'Apple laptop with M2 chip', 'Apple', 'Laptop', 109999, 25, 'https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg', 0),
('Dell XPS 13', 'Compact Windows laptop', 'Dell', 'Laptop', 99999, 20, 'https://m.media-amazon.com/images/I/71e5zB1qbIL._SL1500_.jpg', 0),
('Sony WH-1000XM5', 'Noise Cancelling Wireless Headphones', 'Sony', 'Headphones', 29999, 100, 'https://m.media-amazon.com/images/I/61+btxzpfDL._SL1500_.jpg', 0),
('AirPods Pro 2', 'Apple wireless earbuds with ANC', 'Apple', 'Headphones', 24999, 80, 'https://m.media-amazon.com/images/I/61SUj2aKoEL._SL1500_.jpg', 0),
('Logitech MX Master 3S', 'Ergonomic wireless mouse', 'Logitech', 'Accessories', 9999, 150, 'https://m.media-amazon.com/images/I/61ni3t1ryQL._SL1500_.jpg', 0),
('Samsung 55" QLED TV', 'Smart QLED 4K TV', 'Samsung', 'TV', 84999, 15, 'https://m.media-amazon.com/images/I/91o08D7+B5L._SL1500_.jpg', 0);
INSERT INTO product (average_rating, brand, category, description, image_url, name, price, stock)
VALUES
-- Smartphones
(0, 'Apple', 'Smartphones', 'iPhone 14 with A15 Bionic chip, 128GB storage', 'https://m.media-amazon.com/images/I/61cwywLZR-L._SL1500_.jpg', 'iPhone 14', 69999.00, 50),
(0, 'Samsung', 'Smartphones', 'Samsung Galaxy S23, 128GB, 5G enabled', 'https://m.media-amazon.com/images/I/71HUnJvHsbL._SL1500_.jpg', 'Samsung Galaxy S23', 64999.00, 40),
-- Laptops
(0, 'Dell', 'Laptops', 'Dell Inspiron 15, Intel i5 12th Gen, 8GB RAM, 512GB SSD', 'https://m.media-amazon.com/images/I/71OjjOQWw3L._SL1500_.jpg', 'Dell Inspiron 15', 55990.00, 30),
(0, 'HP', 'Laptops', 'HP Pavilion 14, Ryzen 5, 16GB RAM, 512GB SSD', 'https://m.media-amazon.com/images/I/81zx4YsvblL._SL1500_.jpg', 'HP Pavilion 14', 62990.00, 25),
-- Headphones
(0, 'Sony', 'Headphones', 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', 'https://m.media-amazon.com/images/I/61+J9dw3w-L._SL1500_.jpg', 'Sony WH-1000XM5', 29990.00, 60),
(0, 'boAt', 'Headphones', 'boAt Rockerz 550 Bluetooth Wireless Over Ear Headphones', 'https://m.media-amazon.com/images/I/61u1VALn6JL._SL1500_.jpg', 'boAt Rockerz 550', 1999.00, 100),
-- Watches
(0, 'Fossil', 'Watches', 'Fossil Gen 6 Smartwatch, Stainless Steel, 44mm', 'https://m.media-amazon.com/images/I/71OQt9uJHHL._UL1500_.jpg', 'Fossil Gen 6', 22995.00, 20),
(0, 'Casio', 'Watches', 'Casio G-Shock Analog-Digital Black Dial Men\'s Watch', 'https://m.media-amazon.com/images/I/71sX2Q7udHL._UL1500_.jpg', 'Casio G-Shock', 7995.00, 35);
INSERT INTO product (average_rating, brand, category, description, image_url, name, price, stock)
VALUES
-- Shoes
(0, 'Nike', 'Shoes', 'Nike Air Max 270, Men\'s Running Shoes', 'https://m.media-amazon.com/images/I/71hM1h95FmL._UL1500_.jpg', 'Nike Air Max 270', 11995.00, 40),
(0, 'Adidas', 'Shoes', 'Adidas Ultraboost 22, Men\'s Running Shoes', 'https://m.media-amazon.com/images/I/71EJHwXxoGL._UL1500_.jpg', 'Adidas Ultraboost 22', 13999.00, 35),
(0, 'Puma', 'Shoes', 'Puma Smash v2 L Sneakers for Men', 'https://m.media-amazon.com/images/I/71Fy95zAG7L._UL1500_.jpg', 'Puma Smash v2', 2999.00, 60),
(0, 'Skechers', 'Shoes', 'Skechers Go Walk Max-Athletic Air Mesh Walking Shoe', 'https://m.media-amazon.com/images/I/81R1uov9h3L._UL1500_.jpg', 'Skechers Go Walk Max', 4999.00, 50),
-- Bags
(0, 'American Tourister', 'Bags', 'American Tourister 32L Casual Backpack', 'https://m.media-amazon.com/images/I/91PlA1U7oUL._SL1500_.jpg', 'American Tourister Backpack', 1999.00, 70),
(0, 'Wildcraft', 'Bags', 'Wildcraft 44L Laptop Backpack', 'https://m.media-amazon.com/images/I/91ttLf-2vLL._SL1500_.jpg', 'Wildcraft Laptop Backpack', 2999.00, 50),
(0, 'Skybags', 'Bags', 'Skybags Trooper 55cm Hard Luggage Suitcase', 'https://m.media-amazon.com/images/I/81c5j-pv0hL._SL1500_.jpg', 'Skybags Suitcase', 3999.00, 30),
(0, 'Safari', 'Bags', 'Safari Pentagon 78cm Large Check-in Luggage', 'https://m.media-amazon.com/images/I/81kY7NZ8v-L._SL1500_.jpg', 'Safari Pentagon Luggage', 4999.00, 20);

select * from product where category = 'Laptops';
update product set category = 'Laptops' where category = 'Laptop';

-- Granting remote access to root user
-- ALTER USER 'root'@'%' IDENTIFIED BY 'root';
CREATE USER 'root'@'%' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

SELECT Host, User FROM mysql.user WHERE User='root';