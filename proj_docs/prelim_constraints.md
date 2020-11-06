# Preliminary Constraints (Final)
Please find the ER diagram [here](Final_ER_Diagram.pdf)
1. Each user is identified by his/her email. Their full name and password must be recorded.
2. Users ISA relationship satisfies overlap and covering constraints (a user cannot be anything other than Caretaker, Pet Owner or PCS Admin but user can be both a pet owner and a caretaker).
3. Each Caretaker must have employment type (either full or part time). A caretaker's average rating and their number of reviews are computed and updated.
4. Each Caretaker is managed by exactly one PCS Admin.
5. Each PCS Admin must manage at least one Caretaker.  
6. Each Pet is owned by exactly one PetOwner but each PetOwner can own any number of pets.
7. Each Pet is identified using their name, type and owner's email. A pet's gender must be recorded.
8. If a PetOwner is deleted, all records of his/her Pets will be deleted. 
9. A Pet must have a type but it can only be one of the types that is listed in the Categories entity (Dog, Cat, Fish, Rabbit, Bird, Reptile).
10. The Enquiries entity contains enquiries submitted by any Pet Owner or Caretaker. A user can send any number of these Enquiries.
11. Each Enquiry is identified by its message and the user email who submitted the enquiry. An enquiry must have a type, which are one of the following: (Getting Started, Account and Profile, Finding Sitter, Bookings, Payments, Safety, Others).
12. Each Enquiry will be answered by one of the PCS Admins.
13. A PCS Admin can answer any number of enquiries.
14. A Pet Owner linked to his/her Pet in the aggregate of Owns and a Caretaker linked to the Service that he/she is offering will participate in a Transaction when a service has been requested by a Pet Owner (Transaction status set to **"1"**: **"Submitted"**).
15. Each transaction detail will link to exactly one transaction.
16. Each transaction detail is identified by a Care Taker's email, a pet name, a Pet Owner's email, the Duration From and Duration To. The payment mode (cash or credit card), cost, mode of transfer (pet owner deliver, caretaker pick up or via physical building of PCS), duration of the transaction (from and to), and the period that a Care Taker is offering his services (from and to) that the transaction duration falls in between, must be recorded.
17. A Caretaker that is also a PetOwner in the system cannot participate in a transaction (e.g you cannot take care of your own pet if you are both a caretaker and a petowner).
18. When a Caretaker offers Services to the Pet Owners, these Services are categorised into the their type preferences (Dog, Cat, Fish, Rabbit, Bird, Reptile).
19. Each Service is identified by its Care Taker's email, pet type preference, service available from and service available to. The Care Taker's employment type, and the daily price must be recorded.

# Comments from Prof Adi
- [X] try not to cross the line if possible **need to change in ER diagram**
- [X] why are some lines in red?  is it for relationship? **need to change in ER diagram**

- [X] Each user is identified by his/her user_id. Their full name, email, password and address must be recorded.
==> so "email" is not unique? **Already changed the primary keys to email instead of uuid**

- [X] Each Caretaker must have employment type (either full or part-timer), average rating and number of reviews.
--> on "average rating and number of reviews."
    is this computed or updated? need to make sure they are consistent **Yes the average rating and the number of reviews are computed and updated**
    
- [X] Each Caretaker is managed by exactly one PCS Admin.
==> key+total but a normal line? **(not implicit constraint?)**

- [X] Each PCS Admin must manage at least one Caretaker. 
==> wrong type of line **(not implicit constraint?)**

- [x] Each Pet is identified using pet_id and their name, type, gender and special requirements of the pet must be recorded.
==> why pet_id?
    in fact, why must it be existential dependency and not identity dependency? **Changed to identity dependency**

- [X] If a PetOwner is deleted, all records of his/her Pets will be deleted. The pet_id of a Pet can uniquely identify its PetOwner.
==> so yeah, why?  I would assume this is serial, but without justification. **Already changed to identity**

- [X] A Pet can have a breed but it must be one of the breeds that is listed in the Breeds entity.
--> may want to generalize this into "categories" instead
    breed may be too specific, but this is up to you
    also, the notion of breed typically only exists for dogs/cats and not lizards **already changed**

- [X] The Enquiries entity contains any questions or help messages that any Pet Owner or Caretaker can send, a user can send any number of these Enquiries
==> no constraint between "Enquiry" and "Enquiries"? **fixed**

- [X] Each Enquiry is identified by its e_id. Their type (Getting Started, Account and Profile, Finding Sitter, Bookings, Payments, Safety),
==> again, no justification for e_id **No e_id**

- [X] Each transaction detail will link to exactly one transaction.
--> probably naming problem, but is it any "bids" or only "successful bids"? **Already changed**

- [X] Each transaction detail will be identified using its tx_id. The review, rating, payment mode (pre-registered credit card or cash),
==> again, no justification for e_id **Already changed**

- [X] cost, mode of transfer (pet owner deliver, caretaker pick up or via physical building of PCS) and duration of the transaction must be recorded.
--> is cost computed or updated or filled in?  make sure it is consistent **done already**

- [X] Each Service can only be identified with the Caretaker's user_id
==> this does not make sense since it means that there can only be one "service" for each "caretaker"
    there should be identity even on weak entity, otherwise why not make attribute? **already changed**

## Preliminary constraints (Old)
1. Each user is identified by his/her user_id. Their full name, email, password and address must be recorded.
2. Users ISA relationship satisfies overlap and covering constraints (a user cannot be anything other than Caretaker, Pet Owner or PCS Admin
   but user can be both a pet owner and a caretaker)
3. Each Caretaker must have employment type (either full or part-timer), average rating and number of reviews.
4. Each Caretaker is managed by exactly one PCS Admin.
5. Each PCS Admin must manage at least one Caretaker.  

6. Each Pet is owned by exactly one PetOwner but each PetOwner can own any number of pets.
7. Each Pet is identified using pet_id and their name, type, gender and special requirements of the pet must be recorded.
8. If a PetOwner is deleted, all records of his/her Pets will be deleted. The pet_id of a Pet can uniquely identify its PetOwner. 
9. A Pet can have a breed but it must be one of the breeds that is listed in the Breeds entity.

10. The Enquiries entity contains any questions or help messages that any Pet Owner or Caretaker can send, a user can send any number of these Enquiries
11. Each Enquiry is identified by its e_id. Their type (Getting Started, Account and Profile, Finding Sitter, Bookings, Payments, Safety), 
    message of concern and date must be recorded.
12. Each Enquiry will be answered by one of the PCS Admins
13. A PCS Admin can answer any number of enquiries

14. A Pet Owner linked to his/her Pet in the aggregate of Owns and a Caretaker linked to the service that he/she is offering will participate in a transaction
    when a deal has been finalised
15. Each transaction detail will link to exactly one transaction.
16. Each transaction detail will be identified using its tx_id. The review, rating, payment mode (pre-registered credit card or cash), 
    cost, mode of transfer (pet owner deliver, caretaker pick up or via physical building of PCS) and duration of the transaction must be recorded.
17. A Caretaker that is also a PetOwner in the system cannot participate in a transaction (e.g you cannot take care of your own pet if you are both a caretaker
and a petowner)

18. A Caretaker offers Services to the Pet Owners, these Services are categorised into the their types (dog caretaking, cat caretaking .etc)
19. Each Service can only be identified with the Caretaker's user_id
20. The type attribute of Service cannot uniquely identify its offer. If an Offer is deleted, all records of Service will be deleted.