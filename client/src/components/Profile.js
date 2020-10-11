import React, {Fragment, useState, useEffect} from "react";
import {Link} from "react-router-dom"
import RegisterPage from '../Assets/Images/RegisterPage.jpg';
import { toast } from "react-toastify";

const Profile = ({setAuth}) => {

    const [name, setName] = useState("");
    const [searches, setSearches] = useState([]);
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
                     service_request_period, transfer_mode, owner_email} = search;

            const body = { full_name, user_address, selected_pet, gender, pet_type, special_req, offer_price,
                            service_request_period, transfer_mode, owner_email, emp_type }
            const response = await fetch("http://localhost:5000/acceptbid", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                            token: localStorage.token },
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
                headers: {token: localStorage.token}
                });
                const jsonData = await response.json();
                setSearches(jsonData);
            } else if (acc_type === "caretaker") {
                const response = await fetch("http://localhost:5000/bids", {
                method: "GET",
                headers: {token: localStorage.token}
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

    useEffect(() => {
        getProfile();
        getSearches();
    }, [])

    
    return (
        <Fragment>
            <h1>Hello {name}!</h1>
            {acc_type === "petowner" && <div className="card-deck">
            {searches.map((search, i) => (
            <div key={i} className="card mb-3" style={{ minWidth: 540, maxWidth: 540 }}>
                <div className="row no-gutters">
                <div className="col-md-4">
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{search.pet_name}</h5>
                        <p className="card-text" >Gender: {search.gender}</p>
                        <p className="card-text">Pet Type: {search.pet_type}</p>
                        <p className="card-text">Special Requirement: {search.special_req}</p>
                    </div>
                </div>
                </div>
            </div>
            ))}
            </div>}
            {acc_type === "caretaker" && <div className="card-deck">
            {searches.map((search, i) => (
            <div key={i} className="card mb-3" style={{ minWidth: 540, maxWidth: 540 }}>
            <div className="row no-gutters">
              <div className="col-md-4">
                
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
                  <div className ="row">
                    <button className="btn btn-success col-md-5 col-sm-5 col-12" onClick={e => submitTransaction(e, search)} >Submit</button>
                    <div className="col-md-1 col-sm-1 col-12"/>
                    <button className="btn btn-danger  col-md-5 col-sm-5 col-12">Reject</button>
                  </div>
                </div>
              </div>
            </div>
            </div>
            ))}
            </div>}
        </Fragment>
    );
};

export default Profile;