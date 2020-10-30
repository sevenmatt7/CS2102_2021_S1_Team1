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
DROP FUNCTION IF EXISTS update_caretaker_rating CASCADE;

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
	PRIMARY KEY (owner_email, pet_name, pet_type)
);

CREATE TABLE Offers_Services (  
	caretaker_email VARCHAR REFERENCES Caretakers(caretaker_email)
	ON DELETE cascade,
	employment_type VARCHAR NOT NULL,
	service_avail_from DATE NOT NULL, 
	service_avail_to DATE NOT NULL, 
	type_pref VARCHAR NOT NULL,
	daily_price NUMERIC NOT NULL,
	PRIMARY KEY (caretaker_email, type_pref, service_avail_from, service_avail_to)
);

-- when caretaker take leave 
-- avail 10/29 to 10/29
-- txns 10/29 to 11/05
-- leave 11/06 to 11/20 15 days leave
-- -> avail change 10/29 to 11/05 and 11/21 to 10/29
-- -> txns, search for caretaker email, t_status = 3 or 4 or 5, service_avail_from and to change to 10/29 to 11/05

-- t_status as integer (1: submitted, 2: rejected, 3: accepted, 4: completed, 5: review has been submitted)
CREATE TABLE Transactions_Details (
	caretaker_email VARCHAR,
	employment_type VARCHAR,
	pet_type VARCHAR,
	pet_name VARCHAR,
	owner_email VARCHAR,
	owner_review VARCHAR,
	owner_rating INTEGER,
	payment_mode VARCHAR NOT NULL,
	cost NUMERIC NOT NULL,
	mode_of_transfer VARCHAR NOT NULL,
	duration_from DATE NOT NULL, --Set by PetOwner
	duration_to DATE NOT NULL, --Set by PetOwner
	service_avail_from DATE NOT NULL, 
	service_avail_to DATE NOT NULL,
	t_status INTEGER DEFAULT 1,
	PRIMARY KEY (caretaker_email, pet_name, owner_email, duration_to, duration_from),
	CHECK (duration_from >= service_avail_from), -- the start of the service must be same day or days later than the start of the availability period
	CHECK (duration_to <= service_avail_to), -- the end of the service must be same day or earlier than the end date of the availability period
	FOREIGN KEY (owner_email, pet_name, pet_type) REFERENCES Owns_Pets(owner_email, pet_name, pet_type),
	FOREIGN KEY (caretaker_email, pet_type, service_avail_from, service_avail_to) 
	REFERENCES Offers_Services(caretaker_email, type_pref, service_avail_from, service_avail_to)
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

<<<<<<< HEAD
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


=======
DROP FUNCTION IF EXISTS check_caretaker_limit() CASCADE;
--- Trigger to check whether caretaker already reached the max amount of pets in his care 
CREATE OR REPLACE FUNCTION check_caretaker_limit()
RETURNS TRIGGER AS $$ 
	DECLARE 
		date_start DATE := NEW.duration_from;
		date_end DATE := NEW.duration_to;
	BEGIN
		-- Loop over the each date of the new bid to be accepted and check if any of the days have
		-- more than 5 transactions in progress
		WHILE date_start <= date_end LOOP
			-- select all the transactions that are also in the same availability period as the transaction
			-- to be accepted and check if they amount to 5
			IF (SELECT COUNT(*)
				FROM Transactions_Details
				WHERE (caretaker_email = NEW.caretaker_email 
				AND service_avail_from = NEW.service_avail_from
				AND service_avail_to = NEW.service_avail_to AND t_status = 3 
				AND date_start >= duration_from AND date_start <= duration_to)) >= 5 THEN
					IF (NEW.t_status = 4 OR NEW.t_status = 5) THEN
						RETURN NEW;
					END IF;
					RAISE EXCEPTION 'Max number of pets under care reached';
					RETURN NULL;
			END IF;
			date_start := date_start + 1;
		END LOOP;
		
		RETURN NEW;
 	END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_caretaker_limit
	BEFORE UPDATE ON Transactions_Details
	FOR EACH ROW
	EXECUTE PROCEDURE check_caretaker_limit();
>>>>>>> be7dd6b592f9eb85cec06ea3346e34c61701225b
