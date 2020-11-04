import React, { Fragment, useState, useEffect } from "react";
import { Jumbotron as Jumbo } from 'react-bootstrap';
import imposter from "../Assets/Images/imposter.jpg";
import { toast } from "react-toastify";
import AnimatedNumber from 'react-animated-number';

const Caretaker = () => {
    const [name, setName] = useState("");
    const [reviews, setReviews] = useState([]);
    const [button, setButton] = useState({ t_status: "" });
    const [transactions, setTransactions] = useState([]);
    const [salary, setSalary] = useState("");
    const [petDays, setPetdays] = useState("");
    const [month, setMonth] = useState("ALL Months");
    const acc_type = localStorage.acc_type;

    const month_conversion = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December', 'ALL Months'];
    //function to get current date
    // function parseDate(raw_date) {
    //     function parseMonth(month) {
    //         switch (month) {
    //             case 'Jan':
    //                 return '01';
    //             case 'Feb':
    //                 return '02';
    //             case 'Mar':
    //                 return '03';
    //             case 'Apr':
    //                 return '04';
    //             case 'May':
    //                 return '05';
    //             case 'Jun':
    //                 return '06';
    //             case 'Jul':
    //                 return '07';
    //             case 'Aug':
    //                 return '08';
    //             case 'Sep':
    //                 return '09';
    //             case 'Oct':
    //                 return '10';
    //             case 'Nov':
    //                 return '11';
    //             case 'Dec':
    //                 return '12';
    //         }
    //     }

    //     let date_string = new Date(raw_date).toDateString();
    //     let date_tokens = date_string.split(" ");
    //     return `${date_tokens[3]}-${parseMonth(date_tokens[1])}-${date_tokens[2]}`
    // }

    const getProfile = async () => {
        try {
            const res = await fetch("http://localhost:5000/home/", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const jsonData = await res.json();
            setName(jsonData.full_name);
        } catch (err) {
            console.error(err.message);
        }
    };

    const acceptBid = async (e, search, status_update) => {
        e.preventDefault();
        try {
            const { owner_email, pet_name, duration_to, duration_from } = search;
            // check if caretaker can actually complete the job or not first
            //DO NOT DELETE
            //   if (status_update === 4) {
            //     const curr_date = parseDate(new Date());
            //     const txn_end_date = parseDate(duration_to);
            //     // console.log(curr_date)
            //     // console.log(txn_end_date)
            //     // check if the date of the job completion is correct
            //     if (curr_date < txn_end_date) {
            //         toast.error('You cannot complete this job now!')
            //         return;
            //     }
            //   }

            const body = { owner_email, pet_name, duration_to, duration_from, status_update };
            const response = await fetch("http://localhost:5000/changebid", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body)
            });

            const txn = await response.json();
            if (txn.t_status) {
                if (txn.t_status === 3) { //when the caretaker accepts the bid
                    toast.success(`You have accepted the offer from ${search.full_name}!`);
                } else if (txn.t_status === 2) {  //when the caretaker rejects the bid
                    toast.error(`You have rejected the offer from ${search.full_name}!`);
                } else if (txn.t_status === 4) { //when the job is marked as complete
                    toast.success(`🎉 You have completed the job from ${search.full_name}!`);
                }
            } else {
                toast.error(txn);
            }


            window.location.reload();

        } catch (err) {
            console.error(err.message);
        }
    }

    const getReviews = async () => {
        try {
            const response = await fetch("http://localhost:5000/getreview?" + new URLSearchParams({
                caretaker_email: localStorage.token,
                employment_type: "",
            }), {
                method: "GET"
            });

            const jsonData = await response.json();
            setReviews(jsonData);
        } catch (err) {
            // console.error(err.message)
        }
    };

    const getDays = (start, end) => {
        let start_date = new Date(start)
        let end_date = new Date(end)

        let day_in_ms = 1000 * 3600 * 24

        return (end_date - start_date) / day_in_ms
    }

    const getTransactions = async () => {
        try {
            const t_value = button['t_status'];
            const res = await fetch("http://localhost:5000/transactions?" + new URLSearchParams({
                t_status: t_value
            }), {
                method: "GET",
                headers: { token: localStorage.token, acc_type: acc_type }
            });
            const jsonData = await res.json();
            setTransactions(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    // Calculate salary based on employment type, hourly rate and no. of pet days
    const calc_salary = (hour_rate, pet_days, employment_type) => {
        if (employment_type === 'parttime')
            return hour_rate * pet_days * 0.75;
        else
            return hour_rate * pet_days;
    }

    // Creates Date Object based on input string format
    const parseDate = (str) => {
        var mdy = str.split('-');
        var date = new Date(mdy[0], mdy[1] - 1, mdy[2]);
        return date;
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

    // Counts number of pet days from input stringduration
    const count_pet_days = (fd, sd) => {
        let first_date = (fd.split('T'))[0];
        let second_date = (sd.split('T'))[0];
        return datediff(parseDate(first_date), parseDate(second_date));
    }

    // Adds additional attributes to user object
    const countSalary = (user, petdays) => {
        let calc_days = count_pet_days(user.duration_from, user.duration_to);
        let base_price = Number(user.cost);
        let pet_days = (typeof petdays === 'undefined') ? calc_days : petdays;
        let employment_type = user.employment_type;
        let salary = calc_salary(base_price, pet_days, employment_type);
        return salary;
    }

    const getSalary = async () => {
        try {
            const response = await fetch("http://localhost:5000/salary?" + new URLSearchParams({
                caretaker_email: localStorage.token,
            }), {
                method: "GET"
            });
            const salaryData = await response.json();
            let totalSalary = 0;
            let totalPetDays = 0;
            for (let i = 0; i < Object.keys(salaryData).length; i++) {
                let salary = countSalary(salaryData[i]);
                let startDate = salaryData[i].duration_from;
                let endDate = salaryData[i].duration_to;
                let pet_days = count_pet_days(startDate, endDate);
                totalPetDays += pet_days;
                totalSalary += salary;
            }
            setSalary(totalSalary);
            setPetdays(totalPetDays);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getTransactionStatus = (status) => {
        switch (status) {
            case 1:
                return "Submitted";
            case 2:
                return "Rejected";
            case 3:
                return "Accepted";
            case 4:
                return "Completed";
            case 5:
                return "Completed";
            default:
                return "";
        }
    }

    const getTransferMode = (mode) => {
        switch (mode) {
            case "1":
                return "Delivery by Pet Owner";
            case "2":
                return "Pickup by Caretaker";
            case "3":
                return "Transfer at HQ";
            default:
                return "";
        }
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
    const updated_salary = (salaryData, petDays, currentPetDays) => {
        if (salaryData.employment_type === "parttime")
            return (salaryData.cost * petDays * 0.75);
        else { // Full-time
            if (petDays + currentPetDays >= 30)
                return petDays * salaryData.cost * 0.8;
            else if (petDays + currentPetDays > 30) {
                let daysbefore30 = 30 - petDays;
                let daysafter30 = petDays - daysbefore30;
                return (daysbefore30 * salaryData.cost) + (daysafter30 * salaryData.cost * 0.8);
            } else
                return salaryData.cost * petDays;
        }
    }

    // Filter salary based on a given month
    const filterSalary = async (month) => {
        try {
            const response = await fetch("http://localhost:5000/filtersalary?" + new URLSearchParams({
                caretaker_email: localStorage.token,
                month: month
            }), {
                method: "GET"
            });
            const salaryData = await response.json();
            let totalSalary = 0;
            let totalPetDays = 0;
            for (let i = 0; i < Object.keys(salaryData).length; i++) {
                let petDay = calc_total_days(salaryData[i], month);
                let salary = updated_salary(salaryData[i], petDay, totalPetDays);
                totalSalary += salary;
                totalPetDays += petDay;
            }
            setPetdays(totalPetDays);
            setSalary(totalSalary);
        } catch (error) {
            console.log(error.message);
        }
    };

    const editPet = () => {

    }

    const changeButton = (num) => {
        setButton({ t_status: num });
    }

    const handleClick = (e) => {
        if (Number(e.target.value) === 13) getSalary();
        else filterSalary(Number(e.target.value));
        setMonth(month_conversion[Number(e.target.value) - 1]);
    }

    useEffect(() => {
        getReviews();
        getTransactions();
        getProfile();
        getSalary();
    }, [])

    useEffect(() => {
        getTransactions();

    }, [button])

    return (
        <Fragment>
            {/* Tabs at the top*/}
            <div className="container petowner-home">
                <h1 className="mb-3">👋 Welcome back {name}!</h1>
                <div className="profile-head">
                    <ul className="nav nav-tabs" id="PetOwnerTab" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" id="transactions-tab" data-toggle="tab" href="#transactions" role="tab"
                                aria-controls="transactions" aria-selected="true">Transactions</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" id="pets-tab" data-toggle="tab" href="#pets" role="tab"
                                aria-controls="pets" aria-selected="false">Earnings</a>
                        </li>
                    </ul>
                </div>


                {/* Tab contents */}
                <div className="tab-content" id="PetOwnerTabContent">
                    {/* Transaction information */}
                    <div className="tab-pane fade show active" id="transactions" role="tabpanel" aria-labelledby="transactions-tab">
                        {acc_type === "caretaker" && <div className="container-fluid">

                            <div className="btn-group mb-3" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-secondary" value=""
                                    onClick={(e) => changeButton(e.target.value)}>All</button>
                                <button type="button" className="btn btn-secondary" value="4"
                                    onClick={(e) => changeButton(e.target.value)}>Completed</button>
                                <button type="button" className="btn btn-secondary" value="3"
                                    onClick={(e) => changeButton(e.target.value)}>Accepted</button>
                                <button type="button" className="btn btn-secondary" value="1"
                                    onClick={(e) => changeButton(e.target.value)}>Submitted</button>
                                <button type="button" className="btn btn-secondary" value="2"
                                    onClick={(e) => changeButton(e.target.value)}>Rejected</button>
                            </div>

                            <div className="row">
                                <div className="card-deck">
                                    {transactions.map((search, i) => (
                                        <div key={i} className="col-md-6 mb-4">
                                            <div className="card mb-3">
                                                <div className="row no-gutters">
                                                    <div className="col-md-4">
                                                        <img src={imposter} alt="" className="card-img" />
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="card-body">
                                                            <h5 className="card-title">Offer from {search.full_name}</h5>
                                                            <p className="card-text" >Address: {search.user_address}</p>
                                                            <p className="card-text">Pet Name: {search.pet_name}</p>
                                                            <p className="card-text">Gender: {search.gender}</p>
                                                            <p className="card-text">Type: {search.pet_type}</p>
                                                            <p className="card-text">Special requirements: {search.special_req}</p>
                                                            <p className="card-text"> Offered price/day: {search.cost}</p>
                                                            <p className="card-text">Requested period: {`${new Date(search.duration_from).toDateString()} TO ${new Date(search.duration_to).toDateString()}`}</p>
                                                            <p className="card-text">Transfer mode: {getTransferMode(search.mode_of_transfer)}</p>
                                                            {search.t_status === 1 && <div className="row">
                                                                <button className="btn btn-success col-md-5 col-sm-5 col-12" onClick={(e) => acceptBid(e, search, 3)} >Accept</button>
                                                                <div className="col-md-1 col-sm-1 col-12" />
                                                                <button className="btn btn-danger  col-md-5 col-sm-5 col-12" onClick={(e) => acceptBid(e, search, 2)} >Reject</button>
                                                            </div>}
                                                            {search.t_status === 2 && <button className="btn btn-warning btn-block">Rejected</button>}
                                                            {search.t_status === 3 && <div className="row">
                                                                <button className="btn btn-primary disabled col-md-5 col-sm-5 col-12" >Accepted</button>
                                                                <div className="col-md-1 col-sm-1 col-12" />
                                                                <button className="btn btn-success col-md-5 col-sm-5 col-12" onClick={(e) => acceptBid(e, search, 4)} >Complete job</button>
                                                            </div>}
                                                            {(search.t_status >= 4 && search.t_status <= 6) && <button className="btn btn-success btn-block">Completed</button>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>}
                    </div>

                    {/* Earnings information */}
                    <div className="tab-pane fade" id="pets" role="tabpanel" aria-labelledby="pets-tab">

                        <div className="col">

                            <div className="card-body">
                                <button className="btn btn-primary dropdown-toggle" style={{ position: "relative", width: "130px" }}
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

                            <div className="card mb-3">
                                <div className="card-body">
                                    <h2>Total salary earned: ${salary}</h2>
                                </div>
                            </div>

                            <div className="card mb-3">
                                <div className="card-body">
                                    <h2>Total number of pet days for {month}: {petDays}</h2>
                                </div>
                            </div>

                            <div className="card mb-3">
                                <div className="card-body">
                                    <h2 className="mb-3">My reviews:</h2>
                                    {reviews.map((review, i) => (
                                        <div className='card-deck'>
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h2>Review from: {review.full_name}</h2>
                                                    <p>Comments: {review.owner_review}</p>
                                                    <p>Rating: {review.owner_rating}</p>
                                                </div>
                                            </div>
                                        </div>))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>



        </Fragment >
    )

};

export default Caretaker; 