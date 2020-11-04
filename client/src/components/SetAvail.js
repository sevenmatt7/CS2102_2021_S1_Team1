import React, { Fragment, useEffect, useState } from "react";
import RegisterPage from '../Assets/Images/RegisterPage.jpg';
import { toast } from "react-toastify";

const SetAvail = ({ setAuth }) => {
    // helper function to parse date
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

    const employment_type = localStorage.emp_type;

    const [inputs, setInputs] = useState({
        service_avail_from: "",
        service_avail_to: "",
        daily_price: 0,
    });

    const [pet_type, setPetType] = useState("dog");
    const { service_avail_from, service_avail_to, daily_price } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
        updateDateLimit();
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { service_avail_from, service_avail_to, employment_type, daily_price, pet_type }
            const response = await fetch("http://localhost:5000/setavail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body)
            });

            const avail_dates = await response.json();
            const start_date = parseDate(avail_dates.service_avail_from);
            const end_date = parseDate(avail_dates.service_avail_to); 
            const successMessage = 'You have indicated your availability from ' + start_date + ' to ' +
                end_date + ' !';
            toast.success(successMessage);
        } catch (err) {
            toast.error(err.message)
        }
    }

    //Set minimum date to current day, maximum date to 1 year after the current date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var yyyyplus = yyyy + 1;
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    var nextyear = yyyyplus + '-' + mm + '-' + dd;

    const updateDateLimit = () => {
        document.getElementById("datefield1").setAttribute("min", today);
        if (inputs.service_avail_to != "") {
            document.getElementById("datefield1").setAttribute("max", inputs.service_avail_to);
        }
        if (inputs.service_avail_from != "") {
            document.getElementById("datefield2").setAttribute("min", inputs.service_avail_from);
        }
        
        document.getElementById("datefield2").setAttribute("max", nextyear);
    }

    useEffect(() => {
        updateDateLimit();
    }, [inputs])

    return (
        <Fragment>
            <div className="container">
                <div class="row">

                    <div class="col-sm">
                        <div className="auth-wrapper">
                            <div className="auth-inner">
                                <h1 className="text-center mt-3 mb-3">When are you available?</h1>
                                <p className="text-center">
                                    As a part-time caretaker, you need to indicate your
                                    availability, pet preference & daily price in order to receive bids.
                                </p>
                                <form onSubmit={onSubmitForm}>
                                    <div className="row">
                                        <div className="col form-group">
                                            <label>Start date</label>
                                            <input type="date"
                                                id="datefield1"
                                                name="service_avail_from"
                                                placeholder="YYYY-MM-DD"
                                                className="form-control"
                                                value={service_avail_from}
                                                onChange={e => onChange(e)} />
                                        </div>
                                        <div className="col form-group">
                                            <label>End date</label>
                                            <input type="date"
                                                name="service_avail_to"
                                                placeholder="YYYY-MM-DD"
                                                className="form-control"
                                                id="datefield2"
                                                value={service_avail_to}
                                                onChange={e => onChange(e)} />
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
                                            onChange={e => onChange(e)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Employment Type</label>
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
                            <img class="img-wrapper" src={RegisterPage} alt="Happy people with their pets" />
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