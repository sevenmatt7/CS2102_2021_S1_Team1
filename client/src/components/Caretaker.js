import React, { Fragment, useState, useEffect } from "react";
import { Jumbotron as Jumbo } from 'react-bootstrap';
import imposter from "../Assets/Images/imposter.jpg";
import EditPet from "./EditPet";
import OwnerReview from "./OwnerReview";
import { toast } from "react-toastify";

const Caretaker = () => {

    const [searches, setSearches] = useState([]);
    const [button, setButton] = useState({ t_status: "" });
    const [transactions, setTransactions] = useState([]);
    const acc_type = localStorage.acc_type;

    const acceptBid = async (e, search, status_update) => {
        e.preventDefault();
        const emp_type = localStorage.emp_type;
    
        try {
          const { owner_email, pet_name, duration } = search;
    
          const body = { owner_email, pet_name, duration, status_update };
          const response = await fetch("http://localhost:5000/changebid", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              token: localStorage.token
            },
            body: JSON.stringify(body)
          });
    
          const parseResponse = await response.json();
    
          if (status_update === 3) { //when the caretaker accepts the bid
            toast.success(`You have accepted the offer from ${search.full_name}!`);
          } else if (status_update === 2) {  //when the caretaker rejects the bid
            toast.error(`You have rejected the offer from ${search.full_name}!`);
          } else if (status_update === 4) { //when the job is marked as complete
            toast.success(`🎉 You have completed the job from ${search.full_name}!`);
          }
    
          window.location.reload();
         
        } catch (err) {
          console.error(err.message);
        }
    }
    
    const getDays = (start, end) => {
        let start_date = new Date(start)
        let end_date = new Date(end)
        
        let day_in_ms = 1000*3600*24

        return (end_date-start_date)/day_in_ms
    }

    const getPetDays = (transactions) => {
        let days_in_jobs = transactions.map( (txn, i) => (
            getDays(txn.duration.split(',')[0], txn.duration.split(',')[1])
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

    const deletePet = async (pet_name) => {
        try {
            const res = await fetch("http://localhost:5000/deletepet/" + pet_name,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        token: localStorage.token
                    },
                });
            const jsonData = await res.json();
            console.log(jsonData);
            
        } catch (err) {
            console.error(err.message);
        }
    }

    const getTransactionStatus = (status) => {
        switch (status) {
            case 1:
                return "Submitted";
                break;
            case 2:
                return "Rejected";
                break;
            case 3:
                return "Accepted";
                break;
            case 4:
                return "Completed";
                break;
            case 5:
                return "Completed";
                break;
            default:
                return "";
                break;
        }
    }

    const getTransferMode = (mode) => {
        switch (mode) {
            case "1":
                return "Delivery by Pet Owner";
                break;
            case "2":
                return "Pickup by Caretaker";
                break;
            case "3":
                return "Transfer at HQ";
                break;
            default:
                return "";
                break;
        }
    }

    const editPet = () => {

    }

    const changeButton = (num) => {
        setButton({ t_status: num });
    }

    useEffect(() => {
        
        getTransactions();
    }, [])

    useEffect(() => {
        getTransactions();
    }, [button])

    return (
        <Fragment>
            {/* Tabs at the top*/}
            <div className="container petowner-home">
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
                                                        <p className="card-text">Requested period: {search.duration}</p>
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
                        <h1>My estimated earnings for the month: {getEarnings(getPetDays(transactions)).reduce((sum, value) => sum + value, 0)}</h1>
                        <h1>Total number of pet days for the month: {getPetDays(transactions).reduce((sum, value) => sum + value, 0)}</h1>
                        <h1>My reviews: {}</h1>
                        
                        <h1>Total number of pet days for the month: {}</h1>
                        <div className="row">

                            {/* <div className="card-deck">
                                {searches.map((search, i) => (
                                    <div key={i} className="col-md-6 mb-4">
                                        <div className="card mb-3">
                                            <div className="row no-gutters">
                                                <div className="col-md-4">
                                                    <img src={imposter} alt="" className="card-img" />
                                                </div>
                                                <div className="card-text col-md-8">
                                                    <div className="card-body">
                                                        <h5 className="card-title ml-2"> {search.pet_name}</h5>
                                                        <p className="card-text">Gender: {search.gender}</p>
                                                        <p className="card-text">Pet Type: {search.pet_type}</p>
                                                        <p className="card-text">Special Requirement: {search.special_req}</p>
                                                        <EditPet search={search} i={i}/>
                                                        <button className="btn btn-danger"
                                                            onClick={() => deletePet(search.pet_name)}>Delete</button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div> */}

                        </div>
                    </div>
                </div>
            </div>



        </Fragment >
    )

};

export default Caretaker; 