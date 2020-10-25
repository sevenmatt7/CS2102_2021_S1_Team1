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

INSERT INTO Categories (pet_type) VALUES ('dog'), ('cat'), ('fish'), ('rabbit'), ('bird'), ('reptile');

CREATE TABLE Owns_Pets (
	owner_email VARCHAR REFERENCES PetOwners(owner_email)
	ON DELETE cascade,
	gender CHAR NOT NULL,
	pet_name VARCHAR NOT NULL,
	special_req VARCHAR,
	pet_type VARCHAR REFERENCES Categories(pet_type),
	PRIMARY KEY (owner_email, pet_name)
);

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
--Added status as integer (1: submitted, 2: rejected, 3: accepted, 4: completed, 5: review has been submitted)
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

-- Trigger to Update the Offers_Services available dates whenever the condition of 5 pets jobs in the same period has been met.
-- Step 1: get individual dates for new_tx_duration
-- Step 2: for each date, find number of accepted transactions that contain that date
-- Step 3: if number = 5, split availability in offers_services

CREATE OR REPLACE FUNCTION update_offers_services_avail() -- current working on
RETURNS TRIGGER AS $$
	DECLARE 
		new_tx_startdate DATE := TO_DATE(SPLIT_PART(NEW.duration, ',', 1), 'YYYY-MM-DD');	-- new transaction duration (Step 1)
		new_tx_enddate DATE := TO_DATE(SPLIT_PART(NEW.duration, ',', 2), 'YYYY-MM-DD');
		new_tx_dates DATE [] := '{}';				-- dates that new transaction duration intersect with existing transaction durations
		new_tx_date DATE;							-- DATE variable used for FOREACH loop
		date_iter DATE;
		num_jobs NUMERIC;
		curr_service_avail VARCHAR;
		curr_type_pref VARCHAR;
		curr_daily_price NUMERIC;
		curr_service_avail_startdate DATE;
		curr_service_avail_enddate DATE;
		new_service_avail_1 VARCHAR;
		new_service_avail_2 VARCHAR;

	BEGIN 
		
		date_iter := new_tx_startdate;

		WHILE date_iter <= new_tx_enddate LOOP 
		-- get individual dates from NEW.duration
			new_tx_dates := ARRAY_APPEND(new_tx_dates, date_iter);
			date_iter = date_iter + 1;
		END LOOP;

		FOREACH new_tx_date IN ARRAY new_tx_dates LOOP 
		-- get number of jobs accepted for each new_tx_date for that caretaker
			SELECT COUNT(*) INTO num_jobs
				FROM Transactions_Details tx_d
				WHERE new_tx_date >= TO_DATE(SPLIT_PART(tx_d.duration, ',', 1), 'YYYY-MM-DD')
				AND new_tx_date <= TO_DATE(SPLIT_PART(tx_d.duration, ',', 2), 'YYYY-MM-DD')
				AND tx_d.t_status = 3
				AND tx_d.caretaker_email = NEW.caretaker_email;

			IF num_jobs = 5 THEN -- if a date has reached 5 jobs

				-- get service_avail period of that caretaker containing the date that has reached 5 jobs
				SELECT service_avail, type_pref, daily_price INTO curr_service_avail, curr_type_pref, curr_daily_price 
					FROM Offers_Services o_s
					WHERE new_tx_date >= TO_DATE(SPLIT_PART(o_s.service_avail, ',', 1), 'YYYY-MM-DD')
					AND new_tx_date <= TO_DATE(SPLIT_PART(o_s.service_avail, ',', 2), 'YYYY-MM-DD')
					AND o_s.caretaker_email = NEW.caretaker_email;

				curr_service_avail_startdate := TO_DATE(SPLIT_PART(curr_service_avail, ',', 1), 'YYYY-MM-DD');
				curr_service_avail_enddate := TO_DATE(SPLIT_PART(curr_service_avail, ',', 2), 'YYYY-MM-DD');

				IF new_tx_date = curr_service_avail_startdate THEN 
					new_service_avail_1 := TO_CHAR(curr_service_avail_startdate + 1, 'YYYY-MM-DD') || ',' || TO_CHAR(curr_service_avail_enddate, 'YYYY-MM-DD');
					-- insert updated service_avail
					INSERT INTO Offers_Services(caretaker_email, employment_type, service_avail, type_pref, daily_price) 
						VALUES (NEW.caretaker_email, NEW.employment_type, new_service_avail_1, curr_type_pref, curr_daily_price);
					-- delete old service_avail
					DELETE FROM Offers_Services 
						WHERE caretaker_email = NEW.caretaker_email
						AND service_avail = curr_service_avail;

				ELSIF new_tx_date = curr_service_avail_enddate THEN
					new_service_avail_1 := TO_CHAR(curr_service_avail_startdate, 'YYYY-MM-DD') || ',' || TO_CHAR(curr_service_avail_enddate - 1, 'YYYY-MM-DD');
					-- insert updated service_avail
					INSERT INTO Offers_Services(caretaker_email, employment_type, service_avail, type_pref, daily_price) 
						VALUES (NEW.caretaker_email, NEW.employment_type, new_service_avail_1, curr_type_pref, curr_daily_price);
					-- delete old service_avail
					DELETE FROM Offers_Services 
						WHERE caretaker_email = NEW.caretaker_email
						AND service_avail = curr_service_avail;
						
				ELSE -- new_tx_date is in between startdate and enddate of service_avail
					new_service_avail_1 := TO_CHAR(curr_service_avail_startdate, 'YYYY-MM-DD') || ',' || TO_CHAR(new_tx_date - 1, 'YYYY-MM-DD');
					new_service_avail_2 := TO_CHAR(new_tx_date + 1, 'YYYY-MM-DD') || ',' || TO_CHAR(curr_service_avail_enddate, 'YYYY-MM-DD');
					-- insert updated service_avails
					INSERT INTO Offers_Services(caretaker_email, employment_type, service_avail, type_pref, daily_price) 
						VALUES (NEW.caretaker_email, NEW.employment_type, new_service_avail_1, curr_type_pref, curr_daily_price);
					INSERT INTO Offers_Services(caretaker_email, employment_type, service_avail, type_pref, daily_price) 
						VALUES (NEW.caretaker_email, NEW.employment_type, new_service_avail_2, curr_type_pref, curr_daily_price);
					-- delete old service_avail
					DELETE FROM Offers_Services 
						WHERE caretaker_email = NEW.caretaker_email
						AND service_avail = curr_service_avail;
				END IF;
				
			END IF;
		END LOOP;
		RETURN NULL;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_offers_services_avail
	AFTER UPDATE OF t_status ON Transactions_Details
	FOR EACH ROW
	WHEN (OLD.t_status = 1 AND NEW.t_status = 3)
	EXECUTE PROCEDURE update_offers_services_avail();


