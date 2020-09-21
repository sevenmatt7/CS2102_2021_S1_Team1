CREATE DATABASE sampleapp;

CREATE TABLE sample(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255)
);

CREATE DATABASE jwttutorial;
create extension if not exists "uuid-ossp";

CREATE TABLE Users (
	user_id uuid PRIMARY KEY 
    DEFAULT uuid_generate_v4(),
	full_name VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	user_password VARCHAR NOT NULL,
	profile_pic_address VARCHAR,
	user_address VARCHAR
);

INSERT INTO users (full_name, email, user_password) VALUES
('MATT', 'matt@g.com', 'test123');