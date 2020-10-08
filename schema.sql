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

CREATE TABLE Owns_Pets (
	owner_email VARCHAR REFERENCES PetOwners(owner_email)
	ON DELETE cascade,
	pet_id SERIAL,
	gender CHAR NOT NULL,
	pet_name VARCHAR NOT NULL,
	special_req VARCHAR,
	pet_type VARCHAR REFERENCES Categories(pet_type),
	PRIMARY KEY (pet_id)
);

-- CREATE TABLE Belongs_to (
-- 	pet_id INTEGER REFERENCES Owns_Pets(pet_id),
-- 	breed_name VARCHAR,
-- 	PRIMARY KEY (pet_id)
-- );

CREATE TABLE Owns_aggregate (
	owner_email VARCHAR REFERENCES PetOwners(owner_email),
	pet_id INTEGER REFERENCES Owns_Pets(pet_id),
	PRIMARY KEY (owner_email, pet_id)
);

CREATE TABLE Offers_Services (  
	caretaker_email VARCHAR REFERENCES Caretakers(caretaker_email)
	ON DELETE cascade,
	service_type VARCHAR NOT NULL,
	service_avail VARCHAR NOT NULL,
	type_pref VARCHAR NOT NULL,
	daily_price NUMERIC NOT NULL,
	PRIMARY KEY (caretaker_email, service_type)
);

CREATE TABLE Petowner_Bids (  
	owner_email VARCHAR REFERENCES PetOwners(owner_email)
	ON DELETE cascade,
	caretaker_email VARCHAR REFERENCES Caretakers(caretaker_email)
	ON DELETE cascade,
	selected_pet VARCHAR NOT NULL,
	pet_type VARCHAR NOT NULL,
	service_request_period VARCHAR NOT NULL,
	offer_price NUMERIC NOT NULL,
	transfer_mode INTEGER NOT NULL, 
	PRIMARY KEY (owner_email, caretaker_email, selected_pet, service_request_period)
);

CREATE TABLE Transactions_Details (
	caretaker_email VARCHAR,
	tx_type VARCHAR,
	pet_id INTEGER,
	owner_email VARCHAR,
	tx_id SERIAL,
	owner_review VARCHAR,
	owner_rating VARCHAR,
	payment_mode VARCHAR NOT NULL,
	cost NUMERIC NOT NULL,
	mode_of_transfer VARCHAR NOT NULL,
	duration INTEGER NOT NULL,
	PRIMARY KEY (tx_id),
	FOREIGN KEY (caretaker_email, tx_type) REFERENCES Offers_services(caretaker_email, service_type),
	FOREIGN KEY (pet_id, owner_email) REFERENCES Owns_aggregate(pet_id, owner_email)
);

CREATE TABLE Enquiries (
	e_id SERIAL,
	enq_type VARCHAR,
	submission DATE,
	enq_message VARCHAR,
	PRIMARY KEY (e_id)
);

CREATE TABLE Enquires (
	e_id INTEGER REFERENCES Enquiries(e_id),
	user_email VARCHAR REFERENCES Users(email),
	PRIMARY KEY (e_id, user_email)
);

CREATE TABLE Answers (
	e_id INTEGER REFERENCES Enquiries(e_id),
	admin_email VARCHAR REFERENCES PCSAdmins(admin_email),
	PRIMARY KEY (e_id, admin_email)
); 
