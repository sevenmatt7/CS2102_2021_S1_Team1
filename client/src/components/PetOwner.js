import React, { Fragment, useState, useEffect } from "react";
import { Jumbotron as Jumbo } from 'react-bootstrap';
import imposter from "../Assets/Images/imposter.jpg";
import OwnerReview from "./OwnerReview";

const PetOwner = () => {

    const [searches, setSearches] = useState([]);
    const [button, setButton] = useState({ t_status: "" });
    const [transactions, setTransactions] = useState([]);
    const acc_type = localStorage.acc_type;

    const getPets = async () => {
        try {
            if (acc_type === "petowner") {
                const response = await fetch("http://localhost:5000/pets", {
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
            getPets();
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
                                                            <p className="card-text">Requested period: {search.duration}</p>
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
                                                        <div className="row">
                                                            <button className="btn btn-warning col-md-5 col-sm-5 col-12"
                                                                onClick={() => editPet()}>Edit</button>
                                                            <div className="col-md-1 col-sm-1 col-12" />
                                                            <button className="btn btn-danger  col-md-5 col-sm-5 col-12"
                                                                onClick={() => deletePet(search.pet_name)}>Delete</button>
                                                        </div>
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