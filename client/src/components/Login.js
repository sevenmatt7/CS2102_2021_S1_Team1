import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom"
import { toast } from "react-toastify";
import LoginPage from '../Assets/Images/LoginPage.jpg';

const Login = ({ setAuth }) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

    const [acc_type, setAcctype] = useState("petowner");

    const {email, password} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        try {
            const body = {email, password, acc_type}
            const response = await fetch("/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)

            });

            const parseResponse = await response.json()
            if (parseResponse.jwtToken) {
                localStorage.setItem("token", parseResponse.jwtToken);
                localStorage.setItem("acc_type", parseResponse.acc_type)
                if (parseResponse.emp_type) {
                    localStorage.setItem("emp_type", parseResponse.emp_type)
                }
                setAuth(true);
                toast.success("Logged in Successfully");
              } else {
                setAuth(false);
                toast.error(parseResponse);
              }
        } catch (err) {
            console.error(err.message)
        }
    }
    return (
        <Fragment>
            
            {/* Container for Login components */}
            <div className="container">
                <div className="row">

                    <div className="col-sm" >
                        <div className="card" id="login-banner">
                            <img className="img-wrapper" src={LoginPage} alt="Happy pet owner with his dog" />
                            <div className="card-body">
                                <h5 className="card-title">Welcome Home!</h5>
                                <p className="card-text">Here at Pet Society, we offer quality service to ensure you and your pet get the best experience!</p>
                    
                            </div>
                        </div>
                    </div>
                    

                    <div className="col-sm">
                        <div className="auth-wrapper"> 
                            <div className="auth-inner">
                                <h1 className="text-center my-5">Login</h1>
                                <form onSubmit={onSubmitForm}>
                                <div className="form-group">
                                    <label>What are you logging in as?</label>
                                    <select className="form-control" value={acc_type} onChange={e => setAcctype(e.target.value)}>
                                        <option value="petowner">Pet Owner</option>
                                        <option value="caretaker">Caretaker</option>
                                        <option value="admin">PCSAdmin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" 
                                    name="email" 
                                    placeholder="Email"
                                    className="form-control"
                                    value={email}
                                    onChange={e => onChange(e)}/>
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type="password" 
                                    name="password" 
                                    placeholder="Password"
                                    className="form-control"
                                    value={password}
                                    onChange={e => onChange(e)}/>
                                </div>
                                <div className="form-group">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                                    </div>
                                </div>
                                <button className="btn btn-success btn-block">Submit</button>
                                </form>
                                <p className="forgot-password text-right">
                                    New User? Click here to <Link to="/c/register">Register</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment>
    );
};

export default Login;