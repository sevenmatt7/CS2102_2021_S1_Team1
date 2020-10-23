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
	avg_rating NUMERIC,  -- NEED TO CREATE TRIGGER TO UPDATE AFTER EVERY REVIEW SUBMISSION
	no_of_reviews INTEGER, -- NEED TO CREATE TRIGGER TO UPDATE AFTER EVERY REVIEW SUBMISSION
	PRIMARY KEY (caretaker_email)
);

CREATE TABLE PCSAdmins ( --create an account directly through the sql table
	admin_email VARCHAR
	REFERENCES Users(email)
	ON DELETE cascade,
	PRIMARY KEY (admin_email)
);

CREATE TABLE Manages (  --need to be filled in using trigger when PCSAdmins are assigned people to be taken care of
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
	PRIMARY KEY (owner_email, gender, pet_name, pet_type)
);

--Removed service_type because its redundant, dont have to be specific (just take care)
CREATE TABLE Offers_Services (  
	caretaker_email VARCHAR REFERENCES Caretakers(caretaker_email)
	ON DELETE cascade,
    service_type VARCHAR NOT NULL,
	service_avail VARCHAR NOT NULL, --Set by Caretaker
	type_pref VARCHAR NOT NULL,
	daily_price NUMERIC NOT NULL,
	PRIMARY KEY (caretaker_email, type_pref, service_avail)
);

--Removed pet_id, changed foreign key to (owner_email, pet_name) from Owns_Pets table
CREATE TABLE Transactions_Details (
	caretaker_email VARCHAR,
	tx_type VARCHAR,
	pet_name VARCHAR,
	owner_email VARCHAR,
	owner_review VARCHAR,
	owner_rating VARCHAR,
	payment_mode VARCHAR NOT NULL,
	cost NUMERIC NOT NULL,
	mode_of_transfer VARCHAR NOT NULL,
	duration VARCHAR NOT NULL, --Set by PetOwner
	is_accepted BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (caretaker_email, pet_name, owner_email, duration),
	FOREIGN KEY (caretaker_email, tx_type) REFERENCES Offers_services(caretaker_email, service_type),
	-- FOREIGN KEY (owner_email, pet_name) REFERENCES Owns_Pets(owner_email, pet_name)
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