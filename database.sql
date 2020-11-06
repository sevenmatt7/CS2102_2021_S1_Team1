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
DROP FUNCTION IF EXISTS update_caretaker_rating() CASCADE;
DROP FUNCTION IF EXISTS check_caretaker_limit() CASCADE;
DROP FUNCTION IF EXISTS update_fulltime_price() CASCADE;
DROP FUNCTION IF EXISTS get_underperforming_caretakers();
DROP TYPE IF EXISTS return_type;
DROP FUNCTION IF EXISTS assign_to_admin();
DROP FUNCTION IF EXISTS check_for_leave(input_email VARCHAR, leave_start DATE, leave_end DATE);
DROP FUNCTION IF EXISTS start_of_month(DATE);
DROP FUNCTION IF EXISTS user_exists_in_month(startDate DATE, endDate DATE, input_month DATE);
DROP FUNCTION IF EXISTS calc_salary(input_email VARCHAR);
DROP FUNCTION IF EXISTS calc_monthly_salary(input_email VARCHAR, input_month DATE);
DROP FUNCTION IF EXISTS salary(e_type VARCHAR, total_pet_days, pet_days NUMERIC, cost NUMERIC);
DROP FUNCTION IF EXISTS calc_salary_for_all();
DROP FUNCTION IF EXISTS calc_salary_for_all_for_a_month(input_month DATE);
DROP FUNCTION IF EXISTS get_underperforming_caretakers();

CREATE TABLE Users (
	email VARCHAR,
	full_name VARCHAR NOT NULL,
	user_password VARCHAR NOT NULL,
	profile_pic_address VARCHAR,
	user_area VARCHAR,
	user_address VARCHAR,
	is_deleted BOOLEAN DEFAULT FALSE,
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
	is_deleted BOOLEAN DEFAULT FALSE,
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

-- t_status as integer (1: submitted, 2: rejected, 3: accepted, 4: completed, 5: review has been submitted)
CREATE TABLE Transactions_Details (
	caretaker_email VARCHAR,
	employment_type VARCHAR,
	pet_type VARCHAR,
	pet_name VARCHAR,
	owner_email VARCHAR CHECK (caretaker_email != owner_email),
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
	CHECK (caretaker_email != owner_email),
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

-----------------------------------------------------------------------------------------------------------------------
-- SQL TRIGGERS IMPLEMENTED
-----------------------------------------------------------------------------------------------------------------------

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
		-- if the status change is to 2 (reject), 4(complete), 5(review submitted),
		-- the checks do not need to be performed.
		IF (NEW.t_status = 2 OR NEW.t_status = 4 OR NEW.t_status = 5) THEN
			RETURN NEW;
		END IF;

		-- the code below will execute only when the caretaker is about to accept a bid
		-- get rating of caretaker
		SELECT avg_rating INTO rating
		FROM Caretakers
		WHERE caretaker_email = NEW.caretaker_email;
		
		-- for a full time caretaker or a part time caretaker with a rating >= 4, the limit is 5
		IF ((emp_type = 'parttime' AND rating >= 4) OR emp_type = 'fulltime') THEN
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

-- Trigger to update the price of the fulltime caretaker's services after the avg_rating is computed, 
DROP FUNCTION IF EXISTS update_fulltime_price() CASCADE;
CREATE OR REPLACE FUNCTION update_fulltime_price()
RETURNS TRIGGER AS $$ 
	DECLARE 
		emp_type VARCHAR := NEW.employment_type;
		rating NUMERIC;
		reviews INTEGER;
		new_price INTEGER := 50;
	BEGIN
		-- get rating of caretaker
		SELECT avg_rating, no_of_reviews INTO rating, reviews
		FROM Caretakers
		WHERE caretaker_email = NEW.caretaker_email;
		IF (emp_type = 'fulltime' AND reviews >= 10) THEN
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


-----------------------------------------------------------------------------------------------------------------------
-- SQL FUNCTIONS USED 
-----------------------------------------------------------------------------------------------------------------------

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
			RETURN 50;
		END IF;
		RETURN 0;
 	END; 
$$ LANGUAGE plpgsql;


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
		new_service_avail_to_1 DATE;
		new_service_avail_from_2 DATE;
		leave_period INTEGER;
	BEGIN
		-- Check for valid input
		IF leave_end < leave_start THEN
			RAISE EXCEPTION 'You cannot take leave during this period!';
		END IF;
		
		-- First, get the service period of the caretaker that contains the leave period from the Offers_services table
		SELECT service_avail_from, service_avail_to INTO old_service_avail_from, old_service_avail_to
		FROM Offers_Services 
		WHERE caretaker_email = input_email AND leave_start >= service_avail_from AND leave_end <= service_avail_to AND is_avail = 't';
		
		-- Then, check if there are any transactions accepted within the leave period, if yes return 0
		IF (SELECT COUNT(*) FROM Transactions_Details WHERE caretaker_email = input_email AND 
			service_avail_from = old_service_avail_from AND service_avail_to = old_service_avail_to AND 
			leave_start >= duration_from AND leave_end <= duration_to AND t_status = 3) > 0 THEN
			RAISE EXCEPTION 'You cannot take leave during this period!';
		END IF;

		-- proceed to check whether the caretaker has already had a 150 consecutive day period IN THE SAME YEAR
		-- if they do not have a 150 day period served, 
		SELECT service_avail_from, service_avail_to INTO previous_150_start, previous_150_end
		FROM Offers_services WHERE caretaker_email = input_email AND (service_avail_to - service_avail_from >= 150)
		AND service_avail_to < old_service_avail_from;
		
		-- check if the previous 150 day shift was completed in the same year. If not, return false
		IF (SELECT extract(year from previous_150_end)) != (SELECT extract(year from old_service_avail_from)) THEN
			RAISE EXCEPTION 'You cannot take leave during this period!';
		END IF;

		leave_period := leave_end - leave_start + 1;
		new_service_avail_to_1 := leave_start - 1;
		new_service_avail_from_2 := leave_end + 1;
		
		-- case when the start of the leave == service_avail_from date (e.g 1/1/2020 start leave and 1/1/2020 start availability)
		IF (leave_start = old_service_avail_from) THEN
			new_service_avail_to_1 := old_service_avail_from;
		END IF;

		-- case when end of leave ==  service_avail_to date (e.g 31/10/2020 end leave and 31/10/2020 end availability)
		IF (leave_end = old_service_avail_to) THEN
			new_service_avail_from_2 := old_service_avail_to;
		END IF;

		-- check whether the previous 150 day shift has an overlap with the current one we are looking at
		IF (previous_150_start, previous_150_end) OVERLAPS (old_service_avail_from, old_service_avail_to)  THEN
			RAISE EXCEPTION 'You cannot take leave during this period!';
		END IF;
			
        -- check if the curr period has at least 300 days since we need to split up into 2 consecutive 150 days
		IF (old_service_avail_to - old_service_avail_from - (leave_end - leave_start) > 300) THEN
			-- if can split up, return true
			IF (leave_start - old_service_avail_from > 150 AND old_service_avail_to - leave_end > 150) THEN
				-- this is when the date that the caretaker wants to take leave on is on the same day the availability starts when he takes a one day leave
				-- so need to add 1 day to the date (e.g availability starts on 1/1/2020 so the new availability should start on 2/1/2020)
				IF (old_service_avail_from = leave_start AND leave_period = 1) THEN
					old_service_avail_from := old_service_avail_from + 1;
					new_service_avail_to_1 := new_service_avail_to_1 + 1;
				END IF;

				IF (old_service_avail_to = leave_end AND leave_period = 1) THEN
					old_service_avail_to := old_service_avail_to + 1;
					new_service_avail_from_2 := new_service_avail_from_2 + 1;
				END IF;

				RETURN QUERY SELECT old_service_avail_from::DATE AS new_service_avail_from1, new_service_avail_to_1::DATE AS new_service_avail_to1,
				new_service_avail_from_2::DATE AS new_service_avail_from2, old_service_avail_to::DATE AS new_service_avail_to2, leave_period AS leave_duration;


			ELSIF (leave_start - old_service_avail_from > 300 OR old_service_avail_to - leave_end > 300) THEN
				-- this is when the date that the caretaker wants to take leave on is on the same day the availability starts when he takes a one day leave
				-- so need to add 1 day to the date (e.g availability starts on 1/1/2020 so the new availability should start on 2/1/2020)
				IF (old_service_avail_from = leave_start AND leave_period = 1) THEN
					old_service_avail_from := old_service_avail_from + 1;
					new_service_avail_to_1 := new_service_avail_to_1 + 1;
				END IF;

				IF (old_service_avail_to = leave_end AND leave_period = 1) THEN
					old_service_avail_to := old_service_avail_to + 1;
					new_service_avail_from_2 := new_service_avail_from_2 + 1;
				END IF;

				RETURN QUERY SELECT old_service_avail_from::DATE AS new_service_avail_from1, new_service_avail_to_1::DATE AS new_service_avail_to1,
				new_service_avail_from_2::DATE AS new_service_avail_from2, old_service_avail_to::DATE AS new_service_avail_to2, leave_period AS leave_duration;

			ELSE 
				RAISE EXCEPTION 'You cannot take leave during this period!';
			END IF;
			
		-- this means that there was already a 150 day consecutive period worked in the past
		ELSE
			IF (old_service_avail_to - old_service_avail_from - (leave_end - leave_start) > 150) THEN
				-- if can split up, return true
				IF (leave_start - old_service_avail_from > 150 OR old_service_avail_to - leave_end > 150) THEN
					-- this is when the date that the caretaker wants to take leave on is on the same day the availability starts when he takes a one day leave
					-- so need to add 1 day to the date (e.g availability starts on 1/1/2020 so the new availability should start on 2/1/2020)
					IF (old_service_avail_from = leave_start AND leave_period = 1) THEN
						old_service_avail_from := old_service_avail_from + 1;
						new_service_avail_to_1 := new_service_avail_to_1 + 1;
					END IF;

					IF (old_service_avail_to = leave_end AND leave_period = 1) THEN
						old_service_avail_to := old_service_avail_to + 1;
						new_service_avail_from_2 := new_service_avail_from_2 + 1;
					END IF;

					RETURN QUERY SELECT old_service_avail_from::DATE AS new_service_avail_from1, new_service_avail_to_1::DATE AS new_service_avail_to1,
					new_service_avail_from_2::DATE AS new_service_avail_from2, old_service_avail_to::DATE AS new_service_avail_to2, leave_period AS leave_duration;
                ELSE
                    RAISE EXCEPTION 'You cannot take leave during this period!';
				END IF;
			ELSE-- if cannot split up to 150 days, return false
				RAISE EXCEPTION 'You cannot take leave during this period!';
			END IF;
		END IF;
 	END; 
$$ LANGUAGE plpgsql;

-- Returns start day of month
DROP FUNCTION IF EXISTS start_of_month(DATE);
CREATE OR REPLACE FUNCTION start_of_month(DATE)
RETURNS DATE AS $$
	BEGIN
		RETURN (SELECT (date_trunc('month', $1)::DATE));
	END
$$ LANGUAGE plpgsql;

-- Returns last day of month
DROP FUNCTION IF EXISTS end_of_month(DATE);
CREATE OR REPLACE FUNCTION end_of_month(DATE)
RETURNS DATE AS $$
	BEGIN
		RETURN (SELECT (date_trunc('month', $1) + interval '1 month' - interval '1 day')::DATE);
	END
$$ LANGUAGE plpgsql;

-- Returns total working days in a given month
DROP FUNCTION IF EXISTS calc_total_days(startDate DATE, endDate DATE, input_month DATE);
CREATE OR REPLACE FUNCTION calc_total_days(startDate DATE, endDate DATE, input_month DATE)
RETURNS NUMERIC AS $$
	DECLARE
		firstDayOfMonth DATE := start_of_month(input_month);
		lastDayOfMonth DATE := end_of_month(input_month);
	BEGIN
		IF (firstDayOfMonth <= startDate AND lastDayOfMonth >= endDate) THEN
			RETURN SUM(endDate - startDate) + 1;
		ELSIF (firstDayOfMonth <= startDate AND lastDayOfMonth < endDate) THEN
			RETURN SUM(lastDayOfMonth - startDate) + 1;
		ELSE
			RETURN SUM(endDate - startDate) - SUM(firstDayOfMonth - startDate) + 1;
		END IF;
	END
$$ LANGUAGE plpgsql;

-- Checks if user exists in a given month
DROP FUNCTION IF EXISTS user_exists_in_month(startDate DATE, endDate DATE, input_month DATE);
CREATE OR REPLACE FUNCTION user_exists_in_month(startDate DATE, endDate DATE, input_month DATE)
RETURNS BOOLEAN AS $$
	DECLARE
		firstDayOfMonth DATE := start_of_month(input_month);
		lastDayOfMonth DATE := end_of_month(input_month);
	BEGIN
		RETURN (startDate <= lastDayOfMonth AND endDate >= firstDayOfMonth);
	END
$$ LANGUAGE plpgsql;

-- calculate salary
DROP FUNCTION IF EXISTS salary(e_type VARCHAR, total_pet_days NUMERIC, pet_days NUMERIC, cost NUMERIC);
CREATE OR REPLACE FUNCTION salary(e_type VARCHAR, total_pet_days NUMERIC, pet_days NUMERIC, cost NUMERIC)
RETURNS NUMERIC AS $$
	DECLARE
		daysBefore60 NUMERIC := 0;
		daysAfter60 NUMERIC := 0;
	BEGIN
		IF (e_type= 'parttime') THEN
			RETURN pet_days * cost * 0.75;
		ELSE
			IF (total_pet_days >= 60) THEN
				RETURN pet_days * cost * 0.8;
			ELSIF (pet_days + total_pet_days > 60) THEN
				daysBefore60 := 60 - pet_days;
				daysAfter60 := pet_days - daysBefore60;
				RETURN pet_days * cost * 0.8;
			ELSE
				RETURN  pet_days * cost;
			END IF;
		END IF;
	END
$$ LANGUAGE plpgsql;

-- calculates total salary for a single user
DROP FUNCTION IF EXISTS calc_salary(input_email VARCHAR);
CREATE OR REPLACE FUNCTION calc_salary(input_email VARCHAR)
RETURNS RECORD AS $$ 
	DECLARE 
		total_pet_days NUMERIC := 0;
		total_salary NUMERIC := 0;
		i RECORD;
		ret RECORD;
		currPetDays NUMERIC := 0;
		daysBefore60 NUMERIC := 0;
		daysAfter60 NUMERIC := 0;
	BEGIN
		FOR i IN
			SELECT cost, duration_from, duration_to, employment_type 
			FROM transactions_details
			WHERE caretaker_email=input_email AND t_status>=3
			ORDER BY duration_from
			LOOP
				currPetDays := SUM(i.duration_to::date-i.duration_from::date+1);
				total_salary := total_salary + salary(i.employment_type, total_pet_days, currPetDays, i.cost);
				total_pet_days := total_pet_days + currPetDays;
		END LOOP; 
		ret := (total_salary, total_pet_days);
		RETURN ret;
 	END; 
$$ LANGUAGE plpgsql;

-- filter salary based on month
DROP FUNCTION IF EXISTS calc_monthly_salary(input_email VARCHAR, input_month DATE);
CREATE OR REPLACE FUNCTION calc_monthly_salary(input_email VARCHAR, input_month DATE)
RETURNS RECORD AS $$ 
	DECLARE 
		total_pet_days NUMERIC := 0;
		total_salary NUMERIC := 0;
		i RECORD;
		ret RECORD;
		currPetDays NUMERIC := 0;
		daysBefore60 NUMERIC := 0;
		daysAfter60 NUMERIC := 0;
	BEGIN
		FOR i IN
			SELECT cost, duration_from, duration_to, employment_type 
			FROM transactions_details
			WHERE caretaker_email=input_email AND t_status>=3
			ORDER BY duration_from
			LOOP
				IF (NOT user_exists_in_month(i.duration_from, i.duration_to, input_month)) THEN 
					CONTINUE;
				END IF;
				currPetDays := calc_total_days(i.duration_from, i.duration_to, input_month);
				total_salary := total_salary + salary(i.employment_type, total_pet_days, currPetDays, i.cost);
				total_pet_days := total_pet_days + currPetDays;
		END LOOP; 
		ret := (total_salary, total_pet_days);
		RETURN ret;
 	END; 
$$ LANGUAGE plpgsql;

-- calculates total salary for all single user
DROP FUNCTION IF EXISTS calc_salary_for_all();
CREATE OR REPLACE FUNCTION calc_salary_for_all()
RETURNS TABLE (caretaker_email VARCHAR,
			         full_name VARCHAR,
			   employment_type VARCHAR,
			        avg_rating NUMERIC,
			    total_pet_days NUMERIC,
		          total_salary NUMERIC) AS $$ 
	DECLARE 
		i RECORD;
	BEGIN
		FOR i IN
			SELECT c.caretaker_email AS caretaker_email, u.full_name AS full_name, 
			       c.employment_type AS employment_type, ROUND(AVG(c.avg_rating),2) AS avg_rating 
			  FROM (Transactions_Details AS td JOIN Caretakers AS c 
				ON td.caretaker_email=c.caretaker_email) JOIN Users AS u 
				ON c.caretaker_email=u.email WHERE td.t_status>=3
			GROUP BY c.caretaker_email, u.full_name, c.employment_type						
			LOOP
				caretaker_email := i.caretaker_email;
				full_name := i.caretaker_email;
				employment_type := i.employment_type;
				avg_rating := i.avg_rating;
				SELECT salary, pet_days INTO total_salary, total_pet_days 
				  FROM calc_salary(i.caretaker_email)
				    AS (salary NUMERIC, pet_days NUMERIC);
				RETURN NEXT;
		END LOOP; 
 	END; 
$$ LANGUAGE plpgsql;

-- calculates total salary for all single user for a single month
DROP FUNCTION IF EXISTS calc_salary_for_all_for_a_month(input_month DATE);
CREATE OR REPLACE FUNCTION calc_salary_for_all_for_a_month(input_month DATE)
RETURNS TABLE (caretaker_email VARCHAR,
			         full_name VARCHAR,
			   employment_type VARCHAR,
			        avg_rating NUMERIC,
			    total_pet_days NUMERIC,
		          total_salary NUMERIC) AS $$ 
	DECLARE 
		i RECORD;
	BEGIN
		FOR i IN
			SELECT c.caretaker_email AS caretaker_email, u.full_name AS full_name, 
			       c.employment_type AS employment_type, ROUND(AVG(c.avg_rating),2) AS avg_rating 
			  FROM (Transactions_Details AS td JOIN Caretakers AS c 
				ON td.caretaker_email=c.caretaker_email) JOIN Users AS u 
				ON c.caretaker_email=u.email WHERE td.t_status>=3
			GROUP BY c.caretaker_email, u.full_name, c.employment_type						
			LOOP
				SELECT salary, pet_days INTO total_salary, total_pet_days 
				  FROM calc_monthly_salary(i.caretaker_email, input_month)
				    AS (salary NUMERIC, pet_days NUMERIC);
				IF (total_salary = 0 OR total_pet_days = 0) THEN
					CONTINUE;
				END IF;
				caretaker_email := i.caretaker_email;
				full_name := i.caretaker_email;
				employment_type := i.employment_type;
				avg_rating := i.avg_rating;
				RETURN NEXT;
		END LOOP; 
 	END; 
$$ LANGUAGE plpgsql;

-- function to get underperforming caretakers (rating less than 2)
DROP FUNCTION IF EXISTS get_underperforming_caretakers();
DROP TYPE IF EXISTS return_type;
CREATE TYPE return_type AS
    		( caretaker VARCHAR, num_pet_days NUMERIC, avg_rating NUMERIC, num_rating_5 NUMERIC, 
			num_rating_4 NUMERIC, num_rating_3 NUMERIC, num_rating_2 NUMERIC, num_rating_1 NUMERIC, num_rating_0 NUMERIC );
CREATE OR REPLACE FUNCTION get_underperforming_caretakers()
RETURNS SETOF return_type AS $$ 
	DECLARE 
		val return_type;
		i RECORD;
		j RECORD;
		
	BEGIN
		-- get table containing caretaker email, average rating, and total num of pet days of caretakers 
		-- who have at least 1 transaction that has been given a rating
		-- and has an average rating of less than 2
		FOR i IN (SELECT caretakers.caretaker_email, avg_rating, SUM(duration_to::date-duration_from::date+1)
					FROM caretakers INNER JOIN transactions_details ON caretakers.caretaker_email = transactions_details.caretaker_email
					WHERE EXISTS (SELECT 1 FROM transactions_details t 
									WHERE t.caretaker_email = caretakers.caretaker_email 
									AND t.owner_rating IS NOT NULL)
					AND avg_rating < 2
					GROUP BY caretakers.caretaker_email) LOOP
			val.caretaker := i.caretaker_email;
			val.num_pet_days := i.sum;
			val.avg_rating := i.avg_rating;
			val.num_rating_5 := 0;
			val.num_rating_4 := 0;
			val.num_rating_3 := 0;
			val.num_rating_2 := 0;
			val.num_rating_1 := 0;
			val.num_rating_0 := 0;
			-- find number of ratings for each value for each caretaker
			FOR j IN (SELECT owner_rating, COUNT(*)
						FROM transactions_details
						WHERE caretaker_email = i.caretaker_email
						GROUP BY owner_rating) LOOP
				IF j.owner_rating = 0 THEN
					val.num_rating_0 := j.count;
				ELSIF j.owner_rating = 1 THEN
					val.num_rating_1 := j.count;
				ELSIF j.owner_rating = 2 THEN 
					val.num_rating_2 := j.count;
				ELSIF j.owner_rating = 3 THEN
					val.num_rating_3 := j.count;
				ELSIF j.owner_rating = 4 THEN
					val.num_rating_4 := j.count;
				ELSIF j.owner_rating = 5 THEN
					val.num_rating_5 := j.count;
				END IF;
			END LOOP;
			RETURN NEXT val;
		END LOOP;

		
		
		RETURN;

 	END; 
$$ LANGUAGE plpgsql;