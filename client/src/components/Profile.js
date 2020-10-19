import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom"
import RegisterPage from '../Assets/Images/RegisterPage.jpg';
import { toast } from "react-toastify";
import imposter from "../Assets/Images/imposter.jpg";
import OwnerReview from "./OwnerReview"
const Profile = ({ setAuth }) => {

  const [name, setName] = useState("");
  const [searches, setSearches] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const acc_type = localStorage.acc_type;

  // const {service_avail_from, service_avail_to, service_type, daily_price} = inputs;

  // const onChange = (e) => {
  //     setInputs({...inputs, [e.target.name]: e.target.value})
  // }

  const submitTransaction = async (e, search) => {
    e.preventDefault();
    const emp_type = localStorage.emp_type;

    try {
      const { full_name, user_address, selected_pet, gender, pet_type, special_req, offer_price,
        service_request_period, transfer_mode, owner_email } = search;

      const body = {
        full_name, user_address, selected_pet, gender, pet_type, special_req, offer_price,
        service_request_period, transfer_mode, owner_email, emp_type
      }
      const response = await fetch("http://localhost:5000/acceptbid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token
        },
        body: JSON.stringify(body)
      });

      const parseResponse = await response.json();

      const successMessage = `You have accepted the offer from ${full_name}!`
      toast.success(successMessage);
    } catch (err) {
      console.error(err.message)
    }
  }

  const getProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/home/", {
        method: "GET",
        headers: { token: localStorage.token }
      });

      const parseData = await res.json();
      setName(parseData.full_name);
    } catch (err) {
      console.error(err.message);
    }
  };


  const getSearches = async () => {
    try {
      let response;
      if (acc_type === "petowner") {
        response = await fetch("http://localhost:5000/pets", {
          method: "GET",
          headers: { token: localStorage.token }
        });
        const jsonData = await response.json();
        setSearches(jsonData);
      } else if (acc_type === "caretaker") {
        const response = await fetch("http://localhost:5000/bids", {
          method: "GET",
          headers: { token: localStorage.token }
        });
        const jsonData = await response.json();
        setSearches(jsonData);
      }

      const jsonData = await response.json();
      setSearches(jsonData);
    } catch (error) {
      console.log(error.message)
    }
  };

  const getTransactions = async () => {
    try {
      const res = await fetch("http://localhost:5000/transactions", {
        method: "GET",
        headers: { token: localStorage.token, acc_type: acc_type }
      });
      const jsonData = await res.json();
      setTransactions(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getProfile();
    getSearches();
    getTransactions();
  }, [])


  return (
    <Fragment>

      <div class="container emp-profile">
        <form method="post">
          <div class="row">
            <div class="col-md-4">
              <div class="profile-img">
                <img src={imposter} alt="" />
                <div class="file btn btn-lg btn-primary">
                  Change Photo
                                <input type="file" name="file" />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="profile-head">
                <h5>
                  {name}
                </h5>
                <h6>
                  {acc_type}
                </h6>
                <p class="proile-rating">RATINGS : <span>8/10</span></p>
              </div>
            </div>
            <div class="col-md-2">
              <input type="submit" class="profile-edit-btn" name="btnAddMore" value="Edit Profile" />
            </div>
          </div>
          <div class="profile-head">
            <ul class="nav nav-tabs" id="myTab" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">
                  {acc_type === "petowner" ? "Other Info" : "Other Info"}
                </a>
              </li>
            </ul>
            <div class="row">
            </div>
            <div class="col-md-8">
              <div class="tab-content profile-tab" id="myTabContent">
                <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div class="row">
                    <div class="col-md-6">
                      <label>Name</label>
                    </div>
                    <div class="col-md-6">
                      <p>{name}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <label>Profession</label>
                    </div>
                    <div class="col-md-6">
                      <p>{localStorage.acc_type}</p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6">
                      <label>Email</label>
                    </div>
                    <div class="col-md-6">
                      <p></p>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <label>Your Bio</label><br />
                      <p>Insert details here/ Other info</p>
                    </div>
                  </div>
                </div>

                <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <div class="row">
                    <div class="col-md-6">

                    </div>
                    <div class="col-md-6">
                      <p><label>Can add other details here (Enquiries for Pet Owners/ Transaction history for CareTakers)</label></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* If is Pet Owner, List their pets */}
      <div class="container">
        <div class="row">
          {acc_type === "petowner" && 
          <div class="card-deck">
            <h1>My Pets</h1>
            {searches.map((search, i) => (
              <div class="col-md-6 mb-4">
                <div key={i} className="card mb-3">
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img src={imposter} alt="" class="card-img" />
                    </div>
                    <div className="card-text col-md-8">
                      <div className="card-body">
                        <h5 className="card-title"> {search.pet_name}</h5>
                        <p className="card-text">Gender: {search.gender}</p>
                        <p className="card-text">Pet Type: {search.pet_type}</p>
                        <p className="card-text">Special Requirement: {search.special_req}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>

      <div class="container">
        <div class="row">
          {acc_type === "petowner" && <div className="card-deck">
            <h1>My transactions</h1>
            {transactions.map((search, i) => (
              <div class="col-md-6 mb-4">
                <div key={i} className="card mb-3" style={{ minWidth: 540, maxWidth: 540 }}>
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img src={imposter} alt="" class="card-img" />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">My pet is with {search.full_name}</h5>
                        <p className="card-text" >Address: {search.user_address}</p>
                        <p className="card-text">Pet Name: {search.pet_name}</p>
                        <p className="card-text">Gender: {search.gender}</p>
                        <p className="card-text">Type: {search.pet_type}</p>
                        <p className="card-text">Special requirments: {search.special_req}</p>
                        <p className="card-text"> Offered price/day: {search.cost}</p>
                        <p className="card-text">Requested period: {search.duration}</p>
                        <p className="card-text">Transfer mode: {search.mode_of_transfer}</p>
                        <p className="card-text">Status: {search.t_status}</p>
                        <OwnerReview search={search} i={i}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>

      {/* If is Care Taker, List their job offers */}
      <div class="container">
        <div class="row">
          {acc_type === "caretaker" && <div className="card-deck">
            {searches.map((search, i) => (
              <div class="col-md-6 mb-4">
                <div key={i} className="card mb-3" style={{ minWidth: 540, maxWidth: 540 }}>
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img src={imposter} alt="" class="card-img" />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">Offer from {search.full_name}</h5>
                        <p className="card-text" >Address: {search.user_address}</p>
                        <p className="card-text">Pet Name: {search.selected_pet}</p>
                        <p className="card-text">Gender: {search.gender}</p>
                        <p className="card-text">Type: {search.pet_type}</p>
                        <p className="card-text">Special requirments: {search.special_req}</p>
                        <p className="card-text"> Offered price/day: {search.offer_price}</p>
                        <p className="card-text">Requested period: {search.service_request_period}</p>
                        <p className="card-text">Transfer mode: {search.transfer_mode}</p>
                        <div className="row">
                          <button className="btn btn-success col-md-5 col-sm-5 col-12" onClick={e => submitTransaction(e, search)} >Submit</button>
                          <div className="col-md-1 col-sm-1 col-12" />
                          <button className="btn btn-danger  col-md-5 col-sm-5 col-12">Reject</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>

    </Fragment>
  );
};

export default Profile;