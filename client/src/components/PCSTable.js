import React, { Fragment, useEffect, useState } from "react"

const PCSTable = () => {

    const [caretakers, setCaretakers] = useState([]);
    const [month, setMonth] = useState("Select Month");
    const month_conversion = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December', 'Select Month'];

    // Creates Date Object based on input string format
    const parseDate = (str) => {
        var mdy = str.split('-');
        return new Date(mdy[0], mdy[1] - 1, mdy[2]);
    }

    // Finds the total number of days between two dates
    const datediff = (first, second) => {
        return Math.round((second - first) / (1000 * 60 * 60 * 24)) + 1;
    }

    // Creates Date object of first day of month
    const filterStartDate = (month, startDate) => {
        var mdy = startDate.split('-');
        return new Date(mdy[0], month - 1, "1");
    }

    // Creates Date object of last day of month
    const filterEndDate = (month, endDate) => {
        var mdy = endDate.split('-');
        return new Date(mdy[0], month, "0");
    }

    // Converts user object to JSON format 
    const generateJSONUser = (users) => {
        var list_user = [];
        for (let user in users) {
            let JSON_user = {
                'caretaker_email': user,
                'full_name': users[user].full_name,
                'employment_type': users[user].employment_type,
                'avg_rating': users[user].avg_rating,
                'pet_days': users[user].pet_days,
                'salary': users[user].salary,
            };
            list_user.push(JSON_user);
        }
        return list_user;
    }

    // Counts number of pet days from input stringduration
    const count_pet_days = (fd, sd) => {
        // let date_array = duration.split(',');
        let first_date = (fd.split('T'))[0];
        let second_date = (sd.split('T'))[0];
        return datediff(parseDate(first_date), parseDate(second_date));
    }

    // Calculate salary based on employment type, hourly rate and no. of pet days
    const calc_salary = (hour_rate, pet_days, employment_type) => {
        if (employment_type === 'parttime')
            return hour_rate * pet_days * 0.75;
        else
            return hour_rate * pet_days;
    }

    // Calculate hour_rate based on employment type, base price and rating
    const calc_hour_rate = (base_price, rating, employment_type) => {
        let ratingMultipler = 10;
        if (employment_type === 'parttime')
            return base_price;
        else
            return base_price + rating * ratingMultipler;
    }

    // Checks if user already exists in users_list
    const new_user_exists = (user, users_list) => {
        return user.caretaker_email in users_list;
    }

    // Filters users if exists in a given month
    const user_exists_in_month = (userData, month) => {
        let first_date = (userData.duration_from.split('T'))[0];
        let second_date = (userData.duration_to.split('T'))[0];
        let startDate = parseDate(first_date);
        let endDate = parseDate(second_date);
        let fsd = filterStartDate(month, first_date);
        let fed = filterEndDate(month, second_date);
        return (startDate <= fed && endDate >= fsd);
    }

    // Calculates total working days in a given month
    const calc_total_days = (userData, month) => {
        let first_date = (userData.duration_from.split('T'))[0];
        let second_date = (userData.duration_to.split('T'))[0];
        let startDate = parseDate(first_date);
        let endDate = parseDate(second_date);
        let fsd = filterStartDate(month, first_date);
        let fed = filterEndDate(month, second_date);
        if (fsd <= startDate && fed >= endDate) {
            return datediff(startDate, endDate);
        } else if (fsd <= startDate && fed < endDate) {
            return datediff(startDate, fed);
        } else {
            return datediff(startDate, endDate) - datediff(startDate, fsd) + 1;
        }
    }

    // Updates salary of current_user 
    const updated_salary = (current_user, new_user) => {
        if (current_user.employment_type === "parttime")
            return (new_user.cost * new_user.pet_days * 0.75);
        else { // Full-time
            if (current_user.pet_days >= 30)
                return new_user.pet_days * new_user.hour_rate * 0.8;
            else if (current_user.pet_days + new_user.pet_days > 30) {
                let daysbefore30 = 30 - current_user.pet_days;
                let daysafter30 = new_user.pet_days - daysbefore30;
                return (daysbefore30 * new_user.hour_rate) + (daysafter30 * new_user.hour_rate * 0.8);
            } else
                return new_user.salary;
        }
    }

    // Adds additional attributes to user object
    const createDetailedUser = (user, petdays) => { 
        let calc_days = count_pet_days(user.duration_from, user.duration_to);
        let rating = Number(user.avg_rating);
        let base_price = Number(user.cost);
        let pet_days = (typeof petdays === 'undefined') ? calc_days : petdays;
        let employment_type = user.employment_type;
        let hour_rate = calc_hour_rate(base_price, rating, employment_type);
        let salary = calc_salary(hour_rate, pet_days, employment_type);
        let instance = {
            'caretaker_email': user.caretaker_email,
            'full_name': user.full_name,
            'employment_type': employment_type,
            'avg_rating': rating,
            'total_rating': rating,
            'pet_days': pet_days,
            'salary': salary,
            'cost': base_price,
            'count': 1,
            'hour_rate': hour_rate
        }
        return instance;
    }

    // Updates users list with new user 
    const update_users_list = (userData, new_user, users_list) => {
        let email = userData.caretaker_email;
        let current_user = users_list[email];
        if (new_user_exists(new_user, users_list)) {
            current_user.salary += updated_salary(current_user, new_user);
            current_user.pet_days += new_user.pet_days;
            current_user.count += new_user.count;
            current_user.total_rating += Number(new_user.avg_rating);
            current_user.avg_rating = current_user.total_rating / current_user.count;
        } else {
            users_list[email] = new_user;
        }
        return users_list;
    }

    // Filter month button handler
    const handleClick = (e) => {
        if (Number(e.target.value) === 13) getCareTakers();
        else filterTable(Number(e.target.value));
        setMonth(month_conversion[Number(e.target.value) - 1]);
    }

    // Default method to get all CareTakers earnings
    const getCareTakers = async () => {
        try {
            const response = await fetch("/caretakersadmin");
            const userData = await response.json();
            let users_list = {};
            for (let i = 0; i < Object.keys(userData).length; i++) {
                let new_user = createDetailedUser(userData[i]);
                users_list = update_users_list(userData[i], new_user, users_list);
            }
            setCaretakers(generateJSONUser(users_list));
        } catch (error) {
            console.log(error.message);
        }

    };

    // Filter table based on a given month
    const filterTable = async (month) => {
        try {
            const response = await fetch("/caretakersadmin");
            const userData = await response.json();
            let users_list = {};
            for (let i = 0; i < Object.keys(userData).length; i++) {
                let new_user;
                if (user_exists_in_month(userData[i], month)) {
                    let totalDays = calc_total_days(userData[i], month)
                    new_user = createDetailedUser(userData[i], totalDays);
                } else continue;
                users_list = update_users_list(userData[i], new_user, users_list);
            }
            setCaretakers(generateJSONUser(users_list));
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getCareTakers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Fragment>
            <div style={{ width: "450px", position: "relative" }}>
                <h2>Caretaker Earnings</h2>
                <button className="btn btn-primary dropdown-toggle" style={{ position: "absolute", right: "0", top: "0", textAlign: "center", width: "130px" }}
                    type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {month}
                </button>
                <div className="dropdown-menu scrollable-menu" aria-labelledby="dropdownMenu2">
                    <button className="dropdown-item" value="13" onClick={(e) => handleClick(e)}>All</button>
                    <button className="dropdown-item" value="1" onClick={(e) => handleClick(e)}>January</button>
                    <button className="dropdown-item" value="2" onClick={(e) => handleClick(e)}>February</button>
                    <button className="dropdown-item" value="3" onClick={(e) => handleClick(e)}>March</button>
                    <button className="dropdown-item" value="4" onClick={(e) => handleClick(e)}>April</button>
                    <button className="dropdown-item" value="5" onClick={(e) => handleClick(e)}>May</button>
                    <button className="dropdown-item" value="6" onClick={(e) => handleClick(e)}>June</button>
                    <button className="dropdown-item" value="7" onClick={(e) => handleClick(e)}>July</button>
                    <button className="dropdown-item" value="8" onClick={(e) => handleClick(e)}>August</button>
                    <button className="dropdown-item" value="9" onClick={(e) => handleClick(e)}>September</button>
                    <button className="dropdown-item" value="10" onClick={(e) => handleClick(e)}>October</button>
                    <button className="dropdown-item" value="11" onClick={(e) => handleClick(e)}>November</button>
                    <button className="dropdown-item" value="12" onClick={(e) => handleClick(e)}>December</button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th className="text-center" scope="col">Caretaker Email</th>
                            <th className="text-center" scope="col">Full Name</th>
                            <th className="text-center" scope="col">Employment Type</th>
                            <th className="text-center" scope="col">Average Rating</th>
                            <th className="text-center" scope="col">Pet-days</th>
                            <th className="text-center" scope="col">Salary</th>
                        </tr>
                    </thead>
                    {caretakers.map((caretaker, i) => (
                        <tbody key={i}>
                            <tr>
                                <th className="text-center" scope="row">{caretaker.caretaker_email}</th>
                                <td className="text-center">{caretaker.full_name}</td>
                                <td className="text-center">{caretaker.employment_type}</td>
                                <td className="text-center">{caretaker.avg_rating}</td>
                                <td className="text-center">{caretaker.pet_days}</td>
                                <td className="text-center">{caretaker.salary}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </Fragment>
    );
};

export default PCSTable;