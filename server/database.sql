-- SET timezone 'Asia/Singapore'; SET datestyle 'ISO', 'DMY'

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
	avg_rating NUMERIC DEFAULT 0,
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
	base_price NUMERIC DEFAULT 50,
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
	is_unavail BOOLEAN DEFAULT FALSE,
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
DROP FUNCTION IF EXISTS update_caretaker_rating() CASCADE;
CREATE OR REPLACE FUNCTION update_caretaker_rating()
RETURNS TRIGGER AS $$ 
	DECLARE 
		rating NUMERIC := 0;
		reviews_num INTEGER := 0;
	BEGIN
	SELECT AVG(owner_rating) INTO rating
	FROM Transactions_Details
	WHERE caretaker_email = NEW.caretaker_email;
	SELECT COUNT(owner_rating) INTO reviews_num
	FROM Transactions_Details
	WHERE caretaker_email = NEW.caretaker_email;
	IF (reviews_num = 0) THEN
		rating := 0;
	END IF;
	UPDATE Caretakers 
	SET avg_rating = rating,
	no_of_reviews = reviews_num
    WHERE (caretaker_email = NEW.caretaker_email);
	RETURN NULL;
 	END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_caretaker_rating
	AFTER UPDATE ON Transactions_Details
	FOR EACH ROW
	EXECUTE PROCEDURE update_caretaker_rating();


--- Trigger to check whether caretaker already reached the max amount of pets in his care 
DROP FUNCTION IF EXISTS check_caretaker_limit() CASCADE;
CREATE OR REPLACE FUNCTION check_caretaker_limit()
RETURNS TRIGGER AS $$ 
	DECLARE 
		date_start DATE := NEW.duration_from;
		date_end DATE := NEW.duration_to;
		emp_type VARCHAR := NEW.employment_type;
		rating NUMERIC;
		pet_limit INTEGER := 2;
	BEGIN
		-- get rating of caretaker
		SELECT avg_rating INTO rating
		FROM Caretakers
		WHERE caretaker_email = NEW.caretaker_email;
		IF ((emp_type = 'parttime' AND rating > 4) OR emp_type = 'fulltime') THEN
			pet_limit := 5;
		END IF;
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
				AND date_start >= duration_from AND date_start <= duration_to)) >= pet_limit THEN
					IF (NEW.t_status = 4 OR NEW.t_status = 5) THEN
						RETURN NEW;
					END IF;
				RAISE EXCEPTION 'You have already reached the limit for the number of pets you can take care of!';
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

-- function to assign admin to user at registration
DROP FUNCTION IF EXISTS assign_to_admin();
CREATE OR REPLACE FUNCTION assign_to_admin(input_email VARCHAR, emp_type VARCHAR)
RETURNS NUMERIC AS $$ 
	DECLARE 
		assigned_admin VARCHAR;
		daily_price NUMERIC;
	BEGIN
		SELECT admin_email into assigned_admin
		FROM PCSAdmins
		ORDER BY RANDOM()
		LIMIT 1;
		EXECUTE 'INSERT INTO Manages(admin_email, caretaker_email) VALUES ($1,$2)'
      	USING assigned_admin, input_email;  
		IF emp_type = 'fulltime' THEN
			SELECT base_price INTO daily_price FROM Manages WHERE admin_email = assigned_admin;
			RETURN daily_price;
		END IF;
		RETURN 0;
 	END; 
$$ LANGUAGE plpgsql;
























CREATE OR REPLACE FUNCTION update_availability(new_avail_from DATE, new_avail_to DATE, 
												caretaker_email DATE , type_pref DATE, 
												old_avail_from DATE, old_avail_to DATE )
RETURNS INTEGER AS $$ 
	BEGIN
		-- Change the service_avail_from and service_avail_to of the service that we need to split the availability
		-- of
		PERFORM 'UPDATE Offers_Services SET service_avail_from = old_avail_from, service_avail_to = new_avail_to
				WHERE (caretaker_email = caretaker_email AND type_pref = type_pref AND service_avail_to = old_avail_to
				AND service_avail_from = old_avail_from)';
		-- Get all transactions that are related to the service offered by the caretaker that we need 
		-- to change the dates to
		PERFORM 'UPDATE TRansactions_Details
				SET service_avail_from = new_avail_from, service_avail_to = new_avail_to
				WHERE (caretaker_email = caretaker_email AND type_pref = type_pref AND service_avail_to = old_avail_to
				AND service_avail_from = old_avail_from)';
		
		RETURN 1;
 	END; 
$$ LANGUAGE plpgsql;

--- Trigger to check whether a full time caretaker can take leave
-- DROP FUNCTION IF EXISTS login_user(character varying,character varying);
-- CREATE OR REPLACE FUNCTION login_user(in_email VARCHAR, acc_type VARCHAR)
-- RETURNS TABLE (email VARCHAR, 
-- 				user_password VARCHAR, 
-- 				emp_type VARCHAR) AS $$ 
-- 	BEGIN
-- 		IF (SELECT COUNT(*) from users WHERE Users.email = in_email) = 0 THEN
-- 			RAISE EXCEPTION 'User with email does not exist';
-- 		ELSE
-- 			IF acc_type = 'petowner' THEN
-- 			IF (SELECT COUNT(*) from PetOwners WHERE owner_email = in_email) = 0 THEN
-- 				RAISE EXCEPTION 'User is not registered as a pet owner';
-- 			END IF;

-- 			RETURN QUERY 
-- 			SELECT Users.email, Users.user_password, 'trash' AS emp_type
-- 			FROM PetOwners LEFT JOIN Users ON Petowners.owner_email = Users.email
-- 			WHERE Users.email = in_email;

-- 			ELSIF acc_type = 'caretaker' THEN
-- 			IF (SELECT COUNT(*) from Caretakers WHERE caretaker_email = in_email) = 0 THEN
-- 				RAISE EXCEPTION 'User is not registered as a pet owner';
-- 			END IF;
			
-- 			RETURN QUERY 
-- 			SELECT Users.email, Users.user_password, Caretakers.employment_type as emp_type
-- 			FROM Caretakers LEFT JOIN Users ON Caretakers.caretaker_email = Users.email
-- 			WHERE Users.email = in_email;

-- 			ELSE
-- 			IF (SELECT COUNT(*) from PCSAdmins WHERE admin_email = in_email) = 0 THEN
-- 				RAISE EXCEPTION 'User is not registered as an admin';
-- 			END IF;
			
-- 			RETURN QUERY 
-- 			SELECT Users.email, Users.user_password, 'trash' AS emp_type
-- 			FROM PCSAdmins LEFT JOIN Users ON PCSAdmins.admin_email = Users.email
-- 			WHERE Users.email = in_email;
-- 			END IF;
-- 		END IF;
--  	END; 
-- $$ LANGUAGE plpgsql;
