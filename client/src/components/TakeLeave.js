import React, { Fragment, useEffect, useState } from "react";
import RegisterPage from '../Assets/Images/RegisterPage.jpg';
import { toast } from "react-toastify";

const TakeLeave = ({ setAuth }) => {

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
    let service_avail_dates = "";
    const [workdays, setWorkdays] = useState([]);
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
            const response = await fetch("/takeleave", {
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

    // Get the current working periods from Database
    const getWorkdays = async () => {
        try {
            const response = await fetch("/checkworkdays", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const jsonData = await response.json();
            setWorkdays(jsonData);
        } catch (error) {
            console.log(error.message)
        }
    };

    // let daysInAYear = 365;
    // leaves.map(data => {
    //     service_avail_dates += '/';
    //     service_avail_dates += data.service_avail;
    //     const splitDate = data.service_avail.split(',');
    //     const differenceInDays = date_diff_indays(splitDate[0], splitDate[1]);
    //     daysInAYear -= differenceInDays;
    // })
    // let daysRemaining = 65;
    // daysRemaining -= daysInAYear;

    useEffect(() => {
        getWorkdays();
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
                                    <p className="text-center"><u>Here are your current working periods:</u></p>
                                    {workdays.map((shift, i) => (
                                        <div key={i} >
                                            <p className="text-center">{parseDate(shift.service_avail_from) + " to " + parseDate(shift.service_avail_to) + " --- " + shift.type_pref}</p>
                                        </div>
                                    ))}
                                    {/*<p className="text-center">You have <b>{daysRemaining}</b> days of leaves remaining this year.</p> */}
                                </div>
                                <form onSubmit={onSubmitForm}>
                                   
                                        <div className="form-group">
                                            <label>Start date</label>
                                            <input type="date"
                                                name="apply_leave_from"
                                                placeholder="YYYY-MM-DD"
                                                className="form-control"
                                                value={apply_leave_from}
                                                onChange={e => onChange(e)} />
                                        </div>
                                        <div className="form-group">
                                            <label>End date</label>
                                            <input type="date"
                                                name="apply_leave_to"
                                                placeholder="YYYY-MM-DD"
                                                className="form-control"
                                                value={apply_leave_to}
                                                onChange={e => onChange(e)} />
                                        </div>
                                        <div className="form-group ">
                                            <label>Employment Type</label>
                                            <input type="text"
                                                name="employment_type"
                                                readOnly
                                                className="form-control"
                                                value={employment_type === "parttime" ? "Part-time" : "Full-time"}
                                            />
                                        </div>
                                    
                                    <button className="btn btn-success btn-block mt-5">Submit</button>
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