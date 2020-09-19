CREATE TABLE Users (
	user_id INTEGER PRIMARY KEY,
	full_name VARCHAR,
	email VARCHAR,
	password VARCHAR,
	profile_pic_address VARCHAR,
	address VARCHAR
);

CREATE TABLE PetOwners (
	owner_id INTEGER PRIMARY KEY
	REFERENCES Users(user_id)
	ON DELETE cascade
);
CREATE TABLE Caretakers(
	caretaker_id INTEGER PRIMARY KEY
	REFERENCES Users(user_id)
	ON DELETE cascade,
	employment_type VARCHAR,
	avg_rating NUMERIC,
	no_of_reviews INTEGER,
);
CREATE TABLE PCSAdmins (
	admin_id INTEGER PRIMARY KEY
	REFERENCES Users(user_id)
	ON DELETE cascade
);
CREATE TABLE Manages (
	admin_id INTEGER REFERENCES PCSAdmins(admin_id),
	caretaker_id INTEGER REFERENCES Caretakers(caretaker_id)
	PRIMARY KEY (admin_id, caretaker_id)
);

CREATE TABLE Owns_Pets (
	owner_id INTEGER REFERENCES PetOwners(owner_id)
	ON DELETE cascade,
	pet_id INTEGER PRIMARY KEY,
	gender CHAR,
	name VARCHAR,
	special_req VARCHAR,
	type VARCHAR,
	display_pic_address VARCHAR
);

CREATE TABLE Belongs_to (
	pet_id INTEGER REFERENCES Owns_Pets(pet_id),
	breed_name VARCHAR,
	PRIMARY KEY pet_id
);

CREATE TABLE Breeds (
	breed_name VARCHAR PRIMARY KEY
);

CREATE TABLE Owns_aggregate (
	owner_id INTEGER REFERENCES Owns_Pets(owner_id),
	pet_id INTEGER REFERENCES Owns_Pets(pet_id),
	PRIMARY KEY (owner_id, pet_id)
);

CREATE TABLE Offers_Services (  
	caretaker_id INTEGER REFERENCES Caretakers(caretaker_id)
	ON DELETE cascade,
	type VARCHAR NOT NULL,
	availability VARCHAR,
	type_pref VARCHAR,
	daily_price NUMERIC,
	PRIMARY KEY (caretaker_id, type)
);

CREATE TABLE Transactions_Details (
	caretaker_id INTEGER REFERENCES Offers_Services(caretaker_id),
	type VARCHAR REFERENCES Offers_Services(type),
	pet_id INTEGER REFERENCES Owns_aggregate(pet_id),
	owner_id INTEGER REFERENCES Owns_aggregate(owner_id),
	tx_id INTEGER NOT NULL,
	owner_review VARCHAR,
	owner_rating VARCHAR,
	payment_mode VARCHAR,
	cost NUMERIC,
	mode_of_transfer VARCHAR,
	duration INTEGER,
	PRIMARY KEY (tx_id)
);

CREATE TABLE Enquiries (
	e_id INTEGER PRIMARY KEY
	type VARCHAR,
	submission DATETIME,
	message VARCHAR
);

CREATE TABLE Enquires (
	e_id INTEGER REFERENCES Enquiries(e_id),
	user_id INTEGER REFERENCES Users(user_id),
	PRIMARY KEY (e_id, user_id)
);

CREATE TABLE Answers (
	e_id INTEGER REFERENCES Enquiries(e_id),
	admin_id INTEGER REFERENCES PCSAdmins(admin_id),
	PRIMARY KEY (e_id, admin_id)
);