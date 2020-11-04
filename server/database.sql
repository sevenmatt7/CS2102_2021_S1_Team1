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
	admin_email VARCHAR REFERENCES PCSAdmins(admin_email) ON DELETE cascade,
	caretaker_email VARCHAR REFERENCES Caretakers(caretaker_email) ON DELETE cascade,
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
	is_avail BOOLEAN DEFAULT TRUE,
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
	SELECT COUNT(owner_rating) INTO reviews_num
	FROM Transactions_Details
	WHERE caretaker_email = NEW.caretaker_email;
	IF (reviews_num > 0) THEN
		SELECT AVG(owner_rating) INTO rating
		FROM Transactions_Details
		WHERE caretaker_email = NEW.caretaker_email;
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
	EXECUTE FUNCTION update_caretaker_rating();


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
		count BIGINT := 0;
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
			SELECT COUNT(*) INTO count
			FROM Transactions_Details
			WHERE (caretaker_email = NEW.caretaker_email 
			AND service_avail_from = NEW.service_avail_from
			AND service_avail_to = NEW.service_avail_to AND t_status = 3 
			AND date_start >= duration_from AND date_start <= duration_to);
			
			IF (count >= pet_limit AND NEW.t_status = 3) THEN
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


-- Trigger to update the price of the fulltime caretaker's services after the avg_rating is computed, 
DROP FUNCTION IF EXISTS update_fulltime_price() CASCADE;
CREATE OR REPLACE FUNCTION update_fulltime_price()
RETURNS TRIGGER AS $$ 
	DECLARE 
		emp_type VARCHAR := NEW.employment_type;
		rating NUMERIC;
		new_price INTEGER := 50;
	BEGIN
		-- get rating of caretaker
		SELECT avg_rating INTO rating
		FROM Caretakers
		WHERE caretaker_email = NEW.caretaker_email;
		IF (emp_type = 'fulltime') THEN
			IF (rating > 4.2 AND rating < 4.4 ) THEN
				new_price := 52;
			ELSIF (rating > 4.2 AND rating < 4.4 ) THEN
				new_price := 55;
			ELSIF (rating > 4.4 AND rating < 4.6 ) THEN
				new_price := 59;
			ELSIF (rating > 4.6 AND rating < 4.8 ) THEN
				new_price := 64;
			ELSIF (rating > 4.8 ) THEN
				new_price := 70;
			END IF;
		END IF;
		EXECUTE 'UPDATE Manages SET base_price = $1 WHERE caretaker_email = $2' USING new_price, NEW.caretaker_email;
		EXECUTE 'UPDATE Offers_Services SET daily_price = $1 WHERE caretaker_email = $2' USING new_price, NEW.caretaker_email;
		RETURN NEW;
 	END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fulltime_price
	AFTER UPDATE OF avg_rating ON Caretakers
	FOR EACH ROW
	EXECUTE PROCEDURE update_fulltime_price();

-- Trigger to check if the full time caretaker can take leave 
DROP FUNCTION IF EXISTS take_leave_for_fulltime() CASCADE;
CREATE OR REPLACE FUNCTION take_leave_for_fulltime()
RETURNS TRIGGER AS $$ 
	DECLARE 
		emp_type VARCHAR := NEW.employment_type;
		rating NUMERIC;
		new_price INTEGER := 50;
	BEGIN
		
		SELECT avg_rating INTO rating
		FROM Caretakers
		WHERE caretaker_email = NEW.caretaker_email;
		IF (emp_type = 'fulltime') THEN
			IF (rating > 4.2 AND rating < 4.4 ) THEN
				new_price := 52;
			ELSIF (rating > 4.2 AND rating < 4.4 ) THEN
				new_price := 55;
			ELSIF (rating > 4.4 AND rating < 4.6 ) THEN
				new_price := 59;
			ELSIF (rating > 4.6 AND rating < 4.8 ) THEN
				new_price := 64;
			ELSIF (rating > 4.8 ) THEN
				new_price := 70;
			END IF;
		END IF;
		EXECUTE 'UPDATE Manages SET base_price = $1 WHERE caretaker_email = $2' USING new_price, NEW.caretaker_email;
		EXECUTE 'UPDATE Offers_Services SET daily_price = $1 WHERE caretaker_email = $2' USING new_price, NEW.caretaker_email;
		RETURN NEW;
 	END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER take_leave_for_fulltime
	BEFORE UPDATE OF is_avail ON Caretakers
	FOR EACH ROW
	EXECUTE PROCEDURE take_leave_for_fulltime();


-- function to check if full time caretaker can take leave
DROP FUNCTION IF EXISTS check_for_leave(input_email VARCHAR, leave_start DATE, leave_end DATE);
CREATE OR REPLACE FUNCTION check_for_leave(input_email VARCHAR, leave_start DATE, leave_end DATE)
RETURNS TABLE (new_service_avail_from1 DATE,
			    new_service_avail_to1 DATE,
				new_service_avail_from2 DATE,
				new_service_avail_to2 DATE,
				leave_duration INTEGER) AS $$ 
	DECLARE 
		old_service_avail_from DATE;
		old_service_avail_to DATE;
		previous_150_start DATE;
		previous_150_end DATE;
		leave_period INTEGER;
	BEGIN
		-- Check for valid input
		IF leave_end < leave_start THEN
			RAISE EXCEPTION 'You cannot take leave during this period!';
		END IF;
		
		-- First, get the service period of the caretaker that contains the leave period from the Offers_services table
		SELECT service_avail_from, service_avail_to INTO old_service_avail_from, old_service_avail_to
		FROM Offers_Services 
		WHERE caretaker_email = input_email AND leave_start >= service_avail_from AND leave_end <= service_avail_to;
		
		-- Then, check if there are any transactions accepted within the leave period, if yes return 0
		IF (SELECT COUNT(*) FROM Transactions_Details WHERE caretaker_email = input_email AND 
			service_avail_from = old_service_avail_from AND service_avail_to = old_service_avail_to AND 
			leave_start >= duration_from AND leave_end <= duration_to AND t_status = 3) > 0 THEN
			RAISE EXCEPTION 'You cannot take leave during this period!';
		END IF;

		-- proceed to check whether the caretaker has already had a 150 consecutive day period IN THE SAME YEAR
		-- if they do not have a 150 day period served, 
		SELECT service_avail_from, service_avail_to INTO previous_150_start, previous_150_end
		FROM Offers_services WHERE caretaker_email = input_email AND (service_avail_to - service_avail_from >= 150);
		
		-- check if the previous 150 day shift was completed in the same year. If not, return false
		IF (SELECT extract(year from previous_150_end)) != (SELECT extract(year from old_service_avail_from)) THEN
			RAISE EXCEPTION 'You cannot take leave during this period!';
		END IF;

		leave_period := leave_end - leave_start + 1;
		-- check whether the previous 150 day shift has an overlap with the current one we are looking at
		IF (previous_150_start, previous_150_end) OVERLAPS (old_service_avail_from, old_service_avail_to) THEN
			
            -- check if the curr period has at least 300 days since we need to split up into 2 consecutive 150 days
			IF (old_service_avail_to - old_service_avail_from - (leave_end - leave_start) > 300) THEN
				-- if can split up, return true
				IF (leave_start - old_service_avail_from > 150 AND old_service_avail_to - leave_end > 150) THEN
					RETURN QUERY SELECT old_service_avail_from::DATE, (leave_start-1)::DATE,
							(leave_end+1)::DATE, old_service_avail_to::DATE, leave_period AS leave_duration;
				ELSIF (leave_start - old_service_avail_from > 300 OR old_service_avail_to - leave_end > 300) THEN
					RETURN QUERY SELECT old_service_avail_from::DATE, (leave_start-1)::DATE,
							(leave_end+1)::DATE, old_service_avail_to::DATE, leave_period AS leave_duration;
				END IF;
			END IF;
			
		-- this means that there was already a 150 day consecutive period worked in the past
		ELSE
			IF (old_service_avail_to - old_service_avail_from - (leave_end - leave_start) > 150) THEN
				-- if can split up, return true
				IF (leave_start - old_service_avail_from > 150 OR old_service_avail_to - leave_end > 150) THEN
					RETURN QUERY SELECT old_service_avail_from::DATE, (leave_start-1)::DATE,
							(leave_end+1)::DATE, old_service_avail_to::DATE, leave_period AS leave_duration;
                ELSE
                    RAISE EXCEPTION 'You cannot take leave during this period!';
				END IF;
				-- if cannot split up to 150 days, return false
			END IF;
		END IF;

 	END; 
$$ LANGUAGE plpgsql;

-- function to get underperforming caretakers (rating less than 2)
DROP FUNCTION IF EXISTS get_underperforming_caretakers();
DROP TYPE IF EXISTS return_type;
CREATE TYPE return_type AS
    		( caretaker VARCHAR, num_pet_days NUMERIC, avg_rating NUMERIC, num_rating_5 NUMERIC, num_rating_4 NUMERIC, num_rating_3 NUMERIC, num_rating_2 NUMERIC, num_rating_1 NUMERIC, num_rating_0 NUMERIC );
CREATE OR REPLACE FUNCTION get_underperforming_caretakers()
RETURNS SETOF return_type AS $$ 
	DECLARE 
		caretakers_arr VARCHAR [] := '{}';
		caretaker VARCHAR;
		avg_rating_arr NUMERIC [] := '{}';
		transactions_duration_to DATE [] := '{}';
		transactions_duration_from DATE [] := '{}';
		duration NUMERIC;
		num_pet_days NUMERIC;
		num_ratings NUMERIC;
		val return_type;
		rec RECORD;
	BEGIN
		caretakers_arr := ARRAY (SELECT caretaker_email
		FROM caretakers
		WHERE employment_type = 'fulltime'
		AND avg_rating <= 2
		ORDER BY avg_rating ASC);

		avg_rating_arr := ARRAY (SELECT avg_rating
		FROM caretakers
		WHERE employment_type = 'fulltime'
		AND avg_rating <= 2
		ORDER BY avg_rating ASC);

		FOR index IN array_lower(caretakers_arr, 1) .. array_upper(caretakers_arr, 1) LOOP 

			transactions_duration_from := ARRAY (SELECT duration_from
													FROM transactions_details
													WHERE caretaker_email = caretakers_arr[index]);
			transactions_duration_to := ARRAY (SELECT duration_to
													FROM transactions_details
													WHERE caretaker_email = caretakers_arr[index]);
			IF array_length(transactions_duration_from, 1) IS NULL OR array_length(transactions_duration_from, 1) = 0 THEN
				CONTINUE;
			END IF;
			num_ratings := (SELECT COUNT(*)
							FROM transactions_details
							WHERE caretaker_email = caretakers_arr[index]
							AND owner_rating IS NOT NULL);
			IF num_ratings = 0 THEN
				CONTINUE;
			END IF;
			num_pet_days := 0;
			FOR i IN array_lower(transactions_duration_from, 1) .. array_upper(transactions_duration_from, 1) LOOP
				duration := transactions_duration_to[i] - transactions_duration_from[i] + 1;
				num_pet_days := num_pet_days + duration;
			END LOOP;
			val.caretaker := caretakers_arr[index];
			val.num_pet_days := num_pet_days;
			val.avg_rating := avg_rating_arr[index];
			val.num_rating_5 := (SELECT COUNT(*)
									FROM transactions_details
									WHERE caretaker_email = caretakers_arr[index]
									AND owner_rating = 5);
			val.num_rating_4 := (SELECT COUNT(*)
									FROM transactions_details
									WHERE caretaker_email = caretakers_arr[index]
									AND owner_rating = 4);
			val.num_rating_3 := (SELECT COUNT(*)
									FROM transactions_details
									WHERE caretaker_email = caretakers_arr[index]
									AND owner_rating = 3);
			val.num_rating_2 := (SELECT COUNT(*)
									FROM transactions_details
									WHERE caretaker_email = caretakers_arr[index]
									AND owner_rating = 2);
			val.num_rating_1 := (SELECT COUNT(*)
									FROM transactions_details
									WHERE caretaker_email = caretakers_arr[index]
									AND owner_rating = 1);
			val.num_rating_0 := (SELECT COUNT(*)
									FROM transactions_details
									WHERE caretaker_email = caretakers_arr[index]
									AND owner_rating = 0);
			RETURN NEXT val;
		END LOOP;
		
		RETURN;

 	END; 
$$ LANGUAGE plpgsql;













-- CREATE OR REPLACE FUNCTION update_availability(new_avail_from DATE, new_avail_to DATE, 
-- 												caretaker_email DATE , type_pref DATE, 
-- 												old_avail_from DATE, old_avail_to DATE )
-- RETURNS INTEGER AS $$ 
-- 	BEGIN
-- 		-- Change the service_avail_from and service_avail_to of the service that we need to split the availability
-- 		-- of
-- 		PERFORM 'UPDATE Offers_Services SET service_avail_from = old_avail_from, service_avail_to = new_avail_to
-- 				WHERE (caretaker_email = caretaker_email AND type_pref = type_pref AND service_avail_to = old_avail_to
-- 				AND service_avail_from = old_avail_from)';
-- 		-- Get all transactions that are related to the service offered by the caretaker that we need 
-- 		-- to change the dates to
-- 		PERFORM 'UPDATE TRansactions_Details
-- 				SET service_avail_from = new_avail_from, service_avail_to = new_avail_to
-- 				WHERE (caretaker_email = caretaker_email AND type_pref = type_pref AND service_avail_to = old_avail_to
-- 				AND service_avail_from = old_avail_from)';
		
-- 		RETURN 1;
--  	END; 
-- $$ LANGUAGE plpgsql;

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
