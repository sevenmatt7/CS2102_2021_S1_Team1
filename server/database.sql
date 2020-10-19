DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS PetOwners CASCADE;
DROP TABLE IF EXISTS Caretakers CASCADE;
DROP TABLE IF EXISTS PCSAdmins CASCADE;
DROP TABLE IF EXISTS Manages CASCADE;
DROP TABLE IF EXISTS Categories CASCADE;
DROP TABLE IF EXISTS Owns_Pets CASCADE;
DROP TABLE IF EXISTS Offers_Services CASCADE;
DROP TABLE IF EXISTS Transactions_Details CASCADE;
DROP TABLE IF EXISTS Enquiries CASCADE;

CREATE TABLE Users (
	email VARCHAR,
	full_name VARCHAR NOT NULL,
	user_password VARCHAR NOT NULL,
	profile_pic_address VARCHAR,
	user_address VARCHAR,
	PRIMARY KEY (email)
);

CREATE TABLE PetOwners (
	owner_email VARCHAR
	REFERENCES Users(email)
	ON DELETE cascade,
	PRIMARY KEY (owner_email)
);

CREATE TABLE Caretakers(
	caretaker_email VARCHAR
	REFERENCES Users(email)
	ON DELETE cascade,
	employment_type VARCHAR NOT NULL,
	avg_rating NUMERIC,
	no_of_reviews INTEGER,
	PRIMARY KEY (caretaker_email)
);

CREATE TABLE PCSAdmins (
	admin_email VARCHAR
	REFERENCES Users(email)
	ON DELETE cascade,
	PRIMARY KEY (admin_email)
);

CREATE TABLE Manages (
	admin_email VARCHAR REFERENCES PCSAdmins(admin_email),
	caretaker_email VARCHAR REFERENCES Caretakers(caretaker_email),
	PRIMARY KEY (admin_email, caretaker_email)
);

CREATE TABLE Categories (
	pet_type VARCHAR PRIMARY KEY
);

INSERT INTO Categories (pet_type)
VALUES ('dog'), ('cat'), ('fish'), ('rabbit'), ('bird'), ('reptile');

--Removed pet_id, changed primary key to (owner_email, pet_name)
CREATE TABLE Owns_Pets (
	owner_email VARCHAR REFERENCES PetOwners(owner_email)
	ON DELETE cascade,
	gender CHAR NOT NULL,
	pet_name VARCHAR NOT NULL,
	special_req VARCHAR,
	pet_type VARCHAR REFERENCES Categories(pet_type),
	PRIMARY KEY (owner_email, pet_name)
);

--Added back service_type for easy analysis for PCSAdmin
CREATE TABLE Offers_Services (  
	caretaker_email VARCHAR REFERENCES Caretakers(caretaker_email)
	ON DELETE cascade,
	employment_type VARCHAR NOT NULL,
	service_avail VARCHAR NOT NULL, --Set by Caretaker (date as string)
	type_pref VARCHAR NOT NULL,
	daily_price NUMERIC NOT NULL,
	PRIMARY KEY (caretaker_email, type_pref, service_avail)
);

--Removed pet_id, changed foreign key to (owner_email, pet_name) from Owns_Pets table
--Added status as integer (1: submitted, 2: rejected, 3: accepted)
CREATE TABLE Transactions_Details (
	caretaker_email VARCHAR,
	employment_type VARCHAR,
	pet_name VARCHAR,
	owner_email VARCHAR,
	owner_review VARCHAR,
	owner_rating INTEGER,
	payment_mode VARCHAR NOT NULL,
	cost NUMERIC NOT NULL,
	mode_of_transfer VARCHAR NOT NULL,
	duration VARCHAR NOT NULL, --Set by PetOwner
	t_status INTEGER DEFAULT 1,
	PRIMARY KEY (caretaker_email, pet_name, owner_email, duration),
	FOREIGN KEY (owner_email, pet_name) REFERENCES Owns_Pets(owner_email, pet_name)
);

--Combined Enquires and Enquiries table, removed e_id, primary key changed to (user_email, enq_message)
--Removed Answers Table, added into Answer and Admin_email into Enquires table
CREATE TABLE Enquiries (
	user_email VARCHAR REFERENCES Users(email),
	enq_type VARCHAR,
	submission DATE,
	enq_message VARCHAR,
	answer VARCHAR,
	admin_email VARCHAR REFERENCES PCSAdmins(admin_email),
	PRIMARY KEY (user_email, enq_message)
);

--Removed e_id, changed foreign key, changed primary key
-- CREATE TABLE Answers (
-- 	user_email VARCHAR,
-- 	enq_message VARCHAR,
-- 	admin_email VARCHAR REFERENCES PCSAdmins(admin_email),
-- 	FOREIGN KEY (user_email, enq_message) REFERENCES Enquires(user_email, enq_message),
-- 	PRIMARY KEY (user_email, enq_message, admin_email)
-- ); 

-- CREATE TABLE Belongs_to (
-- 	pet_id INTEGER REFERENCES Owns_Pets(pet_id),
-- 	breed_name VARCHAR,
-- 	PRIMARY KEY (pet_id)
-- );

--- Trigger to update caretaker avg_rating after every review is submitted by the owner
CREATE OR REPLACE FUNCTION update_caretaker_rating()
RETURNS TRIGGER AS $$ 
	BEGIN
	UPDATE Caretakers 
	SET avg_rating = (SELECT AVG(owner_rating) 
	FROM Transactions_Details
	WHERE caretaker_email = NEW.caretaker_email),
	no_of_reviews = (SELECT COUNT(owner_rating) 
	FROM Transactions_Details
	WHERE caretaker_email = NEW.caretaker_email)
    WHERE (caretaker_email = NEW.caretaker_email);
	RETURN NULL;
 	END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_caretaker_rating
	AFTER UPDATE ON Transactions_Details
	FOR EACH ROW
	EXECUTE PROCEDURE update_caretaker_rating();