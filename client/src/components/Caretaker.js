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
    const acc_type = localStorage.acc_type;
    
    //function to get current date
    function parseDate(raw_date) {
        function parseMonth(month) {
            switch (month) {
                case 'Jan':
                    return '01';
                case 'Feb':
                    return '02';
                case 'Mar':
                    return '03';
                case 'Apr':
                    return '04';
                case 'May':
                    return '05';
                case 'Jun':
                    return '06';
                case 'Jul':
                    return '07';
                case 'Aug':
                    return '08';
                case 'Sep':
                    return '09';
                case 'Oct':
                    return '10';
                case 'Nov':
                    return '11';
                case 'Dec':
                    return '12';
            }
        }
    
        let date_string = new Date(raw_date).toDateString();
        let date_tokens = date_string.split(" ");
        return `${date_tokens[3]}-${parseMonth(date_tokens[1])}-${date_tokens[2]}`
    }

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
    
    const getReviews= async () => {
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
        
        let day_in_ms = 1000*3600*24

        return (end_date-start_date)/day_in_ms
    }

    const getPetDays = (transactions) => {
        let days_in_jobs = transactions.map( (txn, i) => (
            getDays(txn.duration_from, txn.duration_to)
        ))
        return days_in_jobs
    }

    const getEarnings = (days_in_jobs) => {
        let rates_in_jobs = transactions.map( (txn, i) => (
            txn.cost
        ))
        let earnings_in_jobs = []
        for (let i = 0; i < days_in_jobs.length; i++) {
            earnings_in_jobs.push(days_in_jobs[i]*rates_in_jobs[i])
        }
        return earnings_in_jobs
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
            console.log(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };


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

    const editPet = () => {

    }

    const changeButton = (num) => {
        setButton({ t_status: num });
    }

    useEffect(() => {
        getReviews();
        getTransactions();
        getProfile();
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
                    <ul class="nav nav-tabs" id="PetOwnerTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="transactions-tab" data-toggle="tab" href="#transactions" role="tab"
                                aria-controls="transactions" aria-selected="true">Transactions</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="pets-tab" data-toggle="tab" href="#pets" role="tab"
                                aria-controls="pets" aria-selected="false">Earnings</a>
                        </li>
                    </ul>
                </div>


                {/* Tab contents */}
                <div class="tab-content" id="PetOwnerTabContent">
                    {/* Transaction information */}
                    <div class="tab-pane fade show active" id="transactions" role="tabpanel" aria-labelledby="transactions-tab">
                        {acc_type === "caretaker" && <div className="container-fluid">

                            <div class="btn-group mb-3" role="group" aria-label="Basic example">
                                <button type="button" class="btn btn-secondary" value=""
                                    onClick={(e) => changeButton(e.target.value)}>All</button>
                                <button type="button" class="btn btn-secondary" value="4"
                                    onClick={(e) => changeButton(e.target.value)}>Completed</button>
                                <button type="button" class="btn btn-secondary" value="3"
                                    onClick={(e) => changeButton(e.target.value)}>Accepted</button>
                                <button type="button" class="btn btn-secondary" value="1"
                                    onClick={(e) => changeButton(e.target.value)}>Submitted</button>
                                <button type="button" class="btn btn-secondary" value="2"
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
                                                        {(search.t_status >= 4 && search.t_status <= 6)  && <button className="btn btn-success btn-block">Completed</button>}
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
                    <div class="tab-pane fade" id="pets" role="tabpanel" aria-labelledby="pets-tab">
                        <div className="col">

                            <div className="card mb-3">
                                <div className="card-body">
                                <h1>My estimated earnings for the month: ${getEarnings(getPetDays(transactions)).reduce((sum, value) => sum + value, 0)}</h1>
                                </div>
                            </div>

                            <div className="card mb-3">
                                <div className="card-body">
                                <h1>Total number of pet days for the month: {getPetDays(transactions).reduce((sum, value) => sum + value, 0)}</h1>
                                </div>
                            </div>
                            
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h1 className="mb-3">My reviews:</h1>
                                        <div className='card-deck'>
                                            {reviews.map((review, i) => (
                                            <div className="card mb-3">
                                                <div className="card-body">
                                                    <h5>Review from: {review.full_name}</h5>
                                                    <p>Comments: {review.owner_review}</p>
                                                    <p>Rating: {review.owner_rating}</p>
                                                </div>
                                            </div>))}
                                        </div>
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