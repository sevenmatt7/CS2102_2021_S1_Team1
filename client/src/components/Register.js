import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom"
import RegisterPage from '../Assets/Images/RegisterPage.jpg';
import { toast } from "react-toastify";

const Register = ({ setAuth }) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
        address: ""
    });

    const [acc_type, setAcctype] = useState("petowner");
    const [emp_type, setEmployment] = useState("fulltime");

    const { email, password, name, address } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value })
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {

            const body = { name, email, password, address, acc_type, emp_type }
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseResponse = await response.json();
            if (parseResponse.jwtToken) {
                localStorage.setItem("token", parseResponse.jwtToken);
                localStorage.setItem("acc_type", parseResponse.acc_type);
                localStorage.setItem("emp_type", parseResponse.emp_type);
                setAuth(true);
                toast.success("Register Successfully");
            } else {
                setAuth(false);
                toast.error("You were not assigned an admin but your account has been created");
            }
        } catch (err) {
            toast.error(err.message);
        }
    }


    return (
        <Fragment>
            <div className="container">
                <div className="row">

                    <div className="col-sm">
                        <div className="auth-wrapper">
                            <div className="auth-inner">
                                <h1 className="text-center my-5">Register</h1>
                                <form onSubmit={onSubmitForm}>
                                    <div className="form-group">
                                        <label>What would you like to register as?</label>
                                        <select className="form-control" value={acc_type} onChange={e => setAcctype(e.target.value)}>
                                            <option value="petowner">Pet Owner</option>
                                            <option value="caretaker">Caretaker</option>
                                            <option value="both">Pet Owner & Caretaker</option>
                                            {/* <option value="pcsadmin">PCSAdmin</option> */}
                                        </select>
                                    </div>
                                    {(acc_type === "caretaker" || acc_type === "both") &&
                                        <div className="form-group">
                                            <label>Part-time or Full-time?</label>
                                            <select className="form-control" value={emp_type} onChange={e => setEmployment(e.target.value)}>
                                                <option value="fulltime">Full-time</option>
                                                <option value="parttime">Part-time</option>
                                            </select>
                                        </div>
                                    }
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input type="email"
                                            name="email"
                                            placeholder="Email"
                                            className="form-control"
                                            value={email}
                                            onChange={e => onChange(e)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input type="password"
                                            name="password"
                                            placeholder="Password"
                                            className="form-control"
                                            value={password}
                                            onChange={e => onChange(e)} />
                                    </div>

                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text"
                                            name="name"
                                            placeholder="Full Name"
                                            className="form-control"
                                            value={name}
                                            onChange={e => onChange(e)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text"
                                            name="address"
                                            placeholder="Address"
                                            className="form-control"
                                            value={address}
                                            onChange={e => onChange(e)} />
                                    </div>


                                    <button className="btn btn-success btn-block">Submit</button>
                                </form>
                                <p className="forgot-password text-right">
                                    Got an account?  <Link to="/login">Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="col-sm">
                        <div class="card" id="register-banner">
                            <img class="img-wrapper" src={RegisterPage} alt="Happy people with their pets" />
                            <div class="card-body">
                                <h5 class="card-title">Join Us!</h5>
                                <p class="card-text">We are a loving community of Pet Owners and Care Takers, we're sure you'll find a home with us!</p>
                    
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
};

export default Register;