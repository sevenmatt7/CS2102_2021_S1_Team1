import React, { Fragment, useEffect, useState } from "react";
import RegisterPage from '../Assets/Images/RegisterPage.jpg';
import { toast } from "react-toastify";

const TakeLeave = ({ setAuth }) => {

    const employment_type = localStorage.emp_type;
    const [leaves, checkLeaves] = useState([]);
    const [inputs, setInputs] = useState({
        service_avail_from: "",
        service_avail_to: ""
    });

    const { service_avail_from, service_avail_to } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const service_avail = service_avail_from + ',' + service_avail_to;
            const body = { service_avail, employment_type }
            const response = await fetch("http://localhost:5000/takeleave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body)
            });

            const parseResponse = await response.json();
            let dateArr = parseResponse.split(',')
            const successMessage = 'You have indicated your leave from ' + dateArr[0] + ' to ' +
                dateArr[1] + '!';
            toast.success(successMessage);
        } catch (err) {
            console.error(err.message)
        }
    }

    const getLeaves = async () => {
        try {
            const response = await fetch("http://localhost:5000/checkleave", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const jsonData = await response.json();
            checkLeaves(jsonData);
        } catch (error) {
            console.log(error.message)
        }
    };

    var date_diff_indays = function(date1, date2) {
        let dt1 = new Date(date1);
        let dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
        }

    let daysInAYear = 365;
    leaves.map(data => {
        const splitDate = data.service_avail.split(',');
        const differenceInDays = date_diff_indays(splitDate[0], splitDate[1]);
        daysInAYear -= differenceInDays;  
        })

    useEffect(() => {
        getLeaves();
    }, []);

    return (
        <Fragment>
            <div className="container">
                <div class="row">
                    <div class="col-sm">
                        <div className="auth-wrapper">
                            <div className="auth-inner">
                                <h1 className="text-center mt-3 mb-3">When would you like to take leave?</h1>
                                <p className="text-center">
                                    As a full-time caretaker, you have up to 65 days of leave a year
                                    which can be taken after working periods of 150 days.
                                </p>
                                <div>
                                    <p className="text-center"><u>Here are your current working periods:</u></p>
                                    {leaves.map((leave, i) => (
                                        <div key={i} >
                                            <p className="text-center">{(leave.service_avail).replace(",", " to ")}</p>
                                        </div>
                                    ))}
                                    <p className="text-center">You have {daysInAYear} days of leaves remaining.</p>
                                </div>
                                <form onSubmit={onSubmitForm}>
                                    <div className="row">
                                        <div className="col form-group">
                                            <label>Start date</label>
                                            <input type="date"
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
                                                value={service_avail_to}
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
                                <h5 class="card-title">Pets under your care will be missing you when you're gone!</h5>
                                <p class="card-text">By indicating your leave, we will remove your availability to pet owners on our site!</p>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
};

export default TakeLeave;