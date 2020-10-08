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

    // const onSubmitForm = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const service_avail = service_avail_from + ',' + service_avail_to;
    //         const body = {service_avail, service_type, daily_price, pet_type}
    //         const response = await fetch("http://localhost:5000/setavail", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json",
    //                         token: localStorage.token },
    //             body: JSON.stringify(body)
    //         });
            
    //         const parseResponse = await response.json();
    //         let dateArr = parseResponse.split(',')
    //         const successMessage = 'You have indicated your availability from ' + dateArr[0] + ' to ' +
    //                                 dateArr[1] + '!';
    //         toast.success(successMessage);
    //     } catch (err) {
    //         console.error(err.message)
    //     }
    // }

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
            } else if (acc_type === "caretaker") {
                const response = await fetch("http://localhost:5000/offers", {
                method: "GET",
                headers: {token: localStorage.token}
                }); 
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
                  <h5 className="card-title">{search.full_name}</h5>
                  <p className="card-text" >Address: {search.user_address}</p>
                  <p className="card-text">Employment Type: {search.employment_type}</p>
                  <p className="card-text">Available: {search.service_avail}</p>
                  <p className="card-text" >Price/day: {search.daily_price}</p>
                  <p className="card-text">Pet type: {search.type_pref}</p>
                  <button className="btn btn-success btn-block">Submit</button>
                  {/* <RequestService search={search} pet_type={search.type_pref} caretaker_email={search.caretaker_email} /> */}
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