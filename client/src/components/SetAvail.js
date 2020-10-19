import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom"
import RegisterPage from '../Assets/Images/RegisterPage.jpg';
import { toast } from "react-toastify";

const SetAvail = ({setAuth}) => {

    const employment_type = localStorage.emp_type;

    const [inputs, setInputs] = useState({
        service_avail_from: "",
        service_avail_to: "",
        daily_price: 0,
    });
    
    const [pet_type, setPetType] = useState("dog");
    const {service_avail_from, service_avail_to, daily_price} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const service_avail = service_avail_from + ',' + service_avail_to;
            const body = {service_avail, employment_type, daily_price, pet_type}
            const response = await fetch("http://localhost:5000/setavail", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                            token: localStorage.token },
                body: JSON.stringify(body)
            });
            
            const parseResponse = await response.json();
            let dateArr = parseResponse.split(',')
            const successMessage = 'You have indicated your availability from ' + dateArr[0] + ' to ' +
                                    dateArr[1] + '!';
            toast.success(successMessage);
        } catch (err) {
            console.error(err.message)
        }
    }

    
    return (
        <Fragment>
            <div className="container">
                <div class="row">
                    
                    <div class="col-sm">
                        <div className="auth-wrapper"> 
                            <div className="auth-inner">
                                <h1 className="text-center mt-3 mb-3">When are you available?</h1>
                                <p className="text-center">
                                    If you are a full-time caretaker, you need
                                    to indicate your availability in periods of 150 days.
                                </p>
                                <form onSubmit={onSubmitForm}> 
                                    <div className="row">
                                        <div className="col form-group">
                                            <label>Start date</label>
                                            <input type="date" 
                                            name="service_avail_from" 
                                            placeholder="YYYY-MM-DD"
                                            className="form-control"
                                            value={service_avail_from}
                                            onChange={e => onChange(e)}/>
                                        </div>
                                        <div className="col form-group">
                                            <label>End date</label>
                                            <input type="date" 
                                            name="service_avail_to" 
                                            placeholder="YYYY-MM-DD"
                                            className="form-control"
                                            value={service_avail_to}
                                            onChange={e => onChange(e)}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Pet Kind</label>
                                        <select className="form-control" value={pet_type} onChange={e => setPetType(e.target.value)}>
                                            <option value="dog">Dog</option>
                                            <option value="cat">Cat</option>
                                            <option value="fish">Fish</option>
                                            <option value="rabbit">Rabbit</option>
                                            <option value="bird">Bird</option>
                                            <option value="reptile">Reptile</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Daily Price</label>
                                        <input type="number" 
                                        name="daily_price" 
                                        placeholder=""
                                        className="form-control"
                                        value={daily_price}
                                        onChange={e => onChange(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Service Type</label>
                                        <input type="text" 
                                        name="employment_type" 
                                        readOnly
                                        className="form-control"
                                        value={employment_type === "parttime" ? "Part-time" : "Full-time"}
                                        />
                                    </div>
                                    <button className="btn btn-success btn-block">Submit</button>
                                </form>
                            </div>
                        </div>   
                    </div>

                    <div class="col-sm">
                        <div class="card" >
                            <img class="img-wrapper" src={RegisterPage} />
                            <div class="card-body">
                                <h5 class="card-title">Get offers from pet owners as soon as possible!</h5>
                                <p class="card-text">By indicating your availability, we will advertise your services to the pet owners on our site!</p>
                    
                            </div>
                        </div>
                    </div>

                </div> 
            </div>
        </Fragment>
    );
};

export default SetAvail;