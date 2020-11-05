# CS2102 AY20/21 Team 1 Project Report
<!--  For reference
MARKING SCHEME
- ER Data Model
- Relational Schema
- Interesting queries (3 most interesting to how application can improve business decision)
- Triggers for complex constraints
- User interface design
-->
## 📝 Table of Contents
-  [Team](#info)
-  [Application's data requirements and functionalities](#application_description)
-  [Entity Relationship Model](#er_diagram)
-  [Database schema](#schema)
-  [Normalization](#normalization)
-  [Interesting triggers](#triggers)
-  [Tools and frameworks used](#tools_used)
-  [Screenshots of app](#screenshots)
-  [Conclusion](#conclusion)

## 👨‍💻  Team <a name = "info"></a>
| Name | Student Number | Responsibilities
|------------ | ------------- | -------------
| Matthew Nathanael Sugiri | A0183805B | Triggers, Integration, API development, Deployment
| Joshua Tam | A0190309H | Frontend, 
| Tan Guan Yew | A0183464Y | Frontend, 
| Sean Lim | A0187123H | Admin features,
| Glen Wong | A0188100N | Frontend, 

## 🧐 Application's data requirements and functionalities <a name = "application_description"></a>

## 🚀 Entity Relationship Model <a name = "er_diagram"></a>
![Image of final ER diagram](https://i.ibb.co/qYYvRHM/ER-diagram-img.jpg)

Constraints not shown in ER diagram:
- Duration_to and duration_from of transaction_details must be in between the service_avail_from and service_avail_to attributes


## Database schema <a name = "schema"></a>
**Insert final schema.sql code here**
**Also need to list down app constraints not captured by schema aka the constraints reinforced by triggers**

#### Users ISA PetOwners, Caretakers, PCSAdmins schema
```sql
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
```

#### Manages and Categories schema
```sql
CREATE TABLE Manages (
	admin_email VARCHAR REFERENCES PCSAdmins(admin_email) ON DELETE cascade,
	caretaker_email VARCHAR REFERENCES Caretakers(caretaker_email) ON DELETE cascade,
	base_price NUMERIC DEFAULT 50,
	PRIMARY KEY (admin_email, caretaker_email)
);

CREATE TABLE Categories (
	pet_type VARCHAR PRIMARY KEY
);
```

#### Owns_Pets and Offers_Services schema
```sql
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
```

#### Transactions and transactions_details schema
```sql
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
```

#### Enquiries schema
```sql
CREATE TABLE Enquiries (
	user_email VARCHAR REFERENCES Users(email),
	enq_type VARCHAR,
	submission DATE,
	enq_message VARCHAR,
	answer VARCHAR,
	admin_email VARCHAR REFERENCES PCSAdmins(admin_email),
	PRIMARY KEY (user_email, enq_message)
);
```

## Normalization level of database <a name = "normalization"></a>
**3NF or CNF?**

## 🎉 Three non-trivial triggers used in the application <a name = "triggers"></a>
**Must show code and write description for each trigger**
Trigger to update the average rating of the caretaker and the number of reviews for the caretaker
Trigger to update the availability of the caretaker 
Trigger to update the employee/caretaker of the month

## 🎉 Three most complex queries implemented in apllication <a name = "queries"></a>
**Show code and write description**
A cool SQL query would be to aggregate the number of pets in each category (dog, cat, lizard)
and then compare it to the the number of caretakers that can take care od the different types of pets then the business can see what kind of caretakers they should advertise to join their website
(For example, there are more lizards then lizard caretakers so more lizard caretakers should be recruited)


## ⛏️ Tools and Frameworks used <a name = "tools_used"></a>
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [ReactJS](https://reactjs.org/) - Frontend 
- [NodeJS](https://nodejs.org/en/) - Server Environment

## 🎈 Screenshots of application <a name = "screenshots"></a>

## 🏁 Summary of difficulties encountered and lessons learned from project <a name = "conclusion"></a>
