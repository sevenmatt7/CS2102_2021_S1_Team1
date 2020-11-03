import React, { Fragment, useEffect, useState } from "react";
import RegisterPage from '../Assets/Images/RegisterPage.jpg';
import { toast } from "react-toastify";

const TakeLeave = ({ setAuth }) => {

    const employment_type = localStorage.emp_type;
    let service_avail_dates = "";
    const [leaves, checkLeaves] = useState([]);
    const [daysOfLeaves, setDaysOfLeaves] = useState(65)

    const [inputs, setInputs] = useState({
        apply_leave_from: "",
        apply_leave_to: ""
    });

    const { apply_leave_from, apply_leave_to } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { apply_leave_from, apply_leave_to }
            const response = await fetch("http://localhost:5000/takeleave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body)
            });

            const parseResponse = await response.json();
            if (parseResponse == "You cannot take leave during this period!") {
                toast.error(parseResponse);
            } else {
                // Show success message on front end
                const successMessage = 'You have indicated your leave from ' + apply_leave_from + ' to ' +
                    apply_leave_to + '!';
                toast.success(successMessage);
                const timer = setTimeout(() => {
                    window.location.reload(false);
                }, 1500);
                return () => clearTimeout(timer);
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    // Get the current working period from Database
    // const getLeaves = async () => {
    //     try {
    //         const response = await fetch("http://localhost:5000/checkleave", {
    //             method: "GET",
    //             headers: { token: localStorage.token }
    //         });
    //         const jsonData = await response.json();
    //         checkLeaves(jsonData);
    //     } catch (error) {
    //         console.log(error.message)
    //     }
    // };

    // Get updates of current leave quota to display to caretaker
    var date_diff_indays = function (date1, date2) {
        let dt1 = new Date(date1);
        let dt2 = new Date(date2);
        return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
    }

    let daysInAYear = 365;
    leaves.map(data => {
        service_avail_dates += '/';
        service_avail_dates += data.service_avail;
        const splitDate = data.service_avail.split(',');
        const differenceInDays = date_diff_indays(splitDate[0], splitDate[1]);
        daysInAYear -= differenceInDays;
    })
    let daysRemaining = 65;
    daysRemaining -= daysInAYear;

    useEffect(() => {
        // getLeaves();
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
                                    which can be taken between working periods of 150 days.
                                </p>
                                <div>
                                    {/* <p className="text-center"><u>Here are your current working periods:</u></p>
                                    {leaves.map((leave, i) => (
                                        <div key={i} >
                                            <p className="text-center">{(leave.service_avail).replace(",", " to ") + " --- [" + date_diff_indays(leave.service_avail.split(',')[0], leave.service_avail.split(',')[1]) + " Days]"}</p>
                                        </div>
                                    ))}
                                    <p className="text-center">You have <b>{daysRemaining}</b> days of leaves remaining this year.</p> */}
                                </div>
                                <form onSubmit={onSubmitForm}>
                                    <div className="row">
                                        <div className="col form-group">
                                            <label>Start date</label>
                                            <input type="date"
                                                name="apply_leave_from"
                                                placeholder="YYYY-MM-DD"
                                                className="form-control"
                                                value={apply_leave_from}
                                                onChange={e => onChange(e)} />
                                        </div>
                                        <div className="col form-group">
                                            <label>End date</label>
                                            <input type="date"
                                                name="apply_leave_to"
                                                placeholder="YYYY-MM-DD"
                                                className="form-control"
                                                value={apply_leave_to}
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