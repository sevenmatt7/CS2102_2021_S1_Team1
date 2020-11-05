import React, { Fragment, useState, useEffect } from "react";
import { Jumbotron as Jumbo } from 'react-bootstrap';
import imposter from "../Assets/Images/imposter.jpg";
import EditPet from "./EditPet";
import OwnerReview from "./OwnerReview";

const PetOwner = () => {
    const [name, setName] = useState("");
    const [searches, setSearches] = useState([]);
    const [button, setButton] = useState({ t_status: "" });
    const [transactions, setTransactions] = useState([]);
    const acc_type = localStorage.acc_type;

    const getProfile = async () => {
        try {
          const res = await fetch("/home/", {
            method: "GET",
            headers: { token: localStorage.token }
          });
    
          const jsonData = await res.json();
          setName(jsonData.full_name);
        } catch (err) {
          console.error(err.message);
        }
    };

    const getPets = async () => {
        try {
            if (acc_type === "petowner") {
                const response = await fetch("/pets", {
                    method: "GET",
                    headers: { token: localStorage.token }
                });
                const jsonData = await response.json();
                setSearches(jsonData);
            }
        } catch (error) {
            console.log(error.message)
        }
    };

    const getTransactions = async () => {
        try {
            const t_value = button['t_status'];
            const res = await fetch("/transactions?" + new URLSearchParams({
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
            const res = await fetch("/deletepet/" + pet_name,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        token: localStorage.token
                    },
                });
            const jsonData = await res.json();
            console.log(jsonData);
            getPets();
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

    const editPet = () => {

    }

    const changeButton = (num) => {
        setButton({ t_status: num });
    }

    useEffect(() => {
        getPets();
        getTransactions();
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
                                aria-controls="pets" aria-selected="false">Pets</a>
                        </li>
                    </ul>
                </div>


                {/* Tab contents */}
                <div class="tab-content" id="PetOwnerTabContent">
                    {/* Transaction information */}
                    <div class="tab-pane fade show active" id="transactions" role="tabpanel" aria-labelledby="transactions-tab">
                        {acc_type === "petowner" && <div className="container-fluid">

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
                                                            <h5 className="card-title ml-2">{search.pet_name} with {search.full_name}</h5>
                                                            <p className="card-text" >Caretaker's Address: {search.user_address}</p>
                                                            <p className="card-text">Pet Name: {search.pet_name}</p>
                                                            {search.gender !== null && <p className="card-text">Gender: {search.gender}</p>}
                                                            {search.pet_type !== null && <p className="card-text">Pet type: {search.pet_type}</p>}
                                                            {search.special_req !== null && <p className="card-text">Special requirements: {search.special_req}</p>}
                                                            <p className="card-text"> Offered price/day: {search.cost}</p>
                                                            <p className="card-text">Requested period: {`${new Date(search.duration_from).toDateString()} TO ${new Date(search.duration_to).toDateString()}`}</p>
                                                            <p className="card-text">Transfer mode: {getTransferMode(search.mode_of_transfer)}</p>
                                                            <p className="card-text">Status: {getTransactionStatus(search.t_status)}</p>
                                                            {search.t_status === 4 && <OwnerReview search={search} i={i} />}
                                                            {search.t_status === 5 && <button className="btn disabled btn-light btn-block">You have submitted a review!</button>}
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

                    {/* Pet information */}
                    <div class="tab-pane fade" id="pets" role="tabpanel" aria-labelledby="pets-tab">
                        <div className="row">
                            <div className="card-deck">
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
                            </div>

                        </div>
                    </div>
                </div>
            </div>



        </Fragment >
    )

};

export default PetOwner; 