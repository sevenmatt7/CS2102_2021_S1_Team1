CREATE TABLE Users (
	user_id uuid 
    DEFAULT uuid_generate_v4(),
	full_name VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	user_password VARCHAR NOT NULL,
	profile_pic_address VARCHAR,
	user_address VARCHAR
	PRIMARY KEY (user_id)
);

CREATE TABLE PetOwners (
	owner_id uuid
	REFERENCES Users(user_id)
	ON DELETE cascade
	PRIMARY KEY (owner_id)
);

CREATE TABLE Caretakers(
	caretaker_id uuid
	REFERENCES Users(user_id)
	ON DELETE cascade,
	employment_type VARCHAR NOT NULL,
	avg_rating NUMERIC,
	no_of_reviews INTEGER,
	PRIMARY KEY (caretaker_id)
);

CREATE TABLE PCSAdmins (
	admin_id uuid,
	REFERENCES Users(user_id)
	ON DELETE cascade,
	PRIMARY KEY (admin_id)
);

CREATE TABLE Manages (
	admin_id uuid REFERENCES PCSAdmins(admin_id),
	caretaker_id uuid REFERENCES Caretakers(caretaker_id)
	PRIMARY KEY (admin_id, caretaker_id)
);

CREATE TABLE Owns_Pets (
	owner_id uuid REFERENCES PetOwners(owner_id)
	ON DELETE cascade,
	pet_id uuid,
	gender CHAR,
	pet_name VARCHAR,
	special_req VARCHAR,
	pet_type VARCHAR,
	display_pic_address VARCHAR,
	PRIMARY KEY (pet_id)
);

CREATE TABLE Belongs_to (
	pet_id uuid REFERENCES Owns_Pets(pet_id),
	breed_name VARCHAR,
	PRIMARY KEY (pet_id)
);

CREATE TABLE Breeds (
	breed_name VARCHAR PRIMARY KEY
);

CREATE TABLE Owns_aggregate (
	owner_id uuid REFERENCES Owns_Pets(owner_id),
	pet_id uuid REFERENCES Owns_Pets(pet_id),
	PRIMARY KEY (owner_id, pet_id)
);

CREATE TABLE Offers_Services (  
	caretaker_id uuid REFERENCES Caretakers(caretaker_id)
	ON DELETE cascade,
	service_type VARCHAR NOT NULL,
	service_avail VARCHAR,
	type_pref VARCHAR,
	daily_price NUMERIC,
	PRIMARY KEY (caretaker_id, service_type)
);

CREATE TABLE Transactions_Details (
	caretaker_id uuid REFERENCES Offers_Services(caretaker_id),
	tx_type VARCHAR REFERENCES Offers_Services(type),
	pet_id uuid REFERENCES Owns_aggregate(pet_id),
	owner_id uuid REFERENCES Owns_aggregate(owner_id),
	tx_id uuid DEFAULT uuid_generate_v4(),
	owner_review VARCHAR,
	owner_rating VARCHAR,
	payment_mode VARCHAR NOT NULL,
	cost NUMERIC NOT NULL,
	mode_of_transfer VARCHAR NOT NULL,
	duration INTEGER NOT NULL,
	PRIMARY KEY (tx_id)
);

CREATE TABLE Enquiries (
	e_id uuid 
    DEFAULT uuid_generate_v4(),
	enq_type VARCHAR,
	submission DATE,
	enq_message VARCHAR,
	PRIMARY KEY (e_id)
);

CREATE TABLE Enquires (
	e_id uuid REFERENCES Enquiries(e_id),
	user_id uuid REFERENCES Users(user_id),
	PRIMARY KEY (e_id, user_id)
);

CREATE TABLE Answers (
	e_id uuid REFERENCES Enquiries(e_id),
	admin_id uuid REFERENCES PCSAdmins(admin_id),
	PRIMARY KEY (e_id, admin_id)
); 
