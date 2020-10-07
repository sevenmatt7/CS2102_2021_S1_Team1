import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom"
import Nav_bar from "./Nav_bar.js"
import RegisterPage from '../Assets/Images/RegisterPage.jpg';

const Register = ({setAuth}) => {

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
        profile_pic: "",
        address: ""
    });

    const {email, password, name, profile_pic, address} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {

            const body = { name, email, password, profile_pic, address}
            const response = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            
            const parseResponse = await response.json();
            localStorage.setItem("token", parseResponse.jwtToken)
            setAuth(true)
        } catch (err) {
            console.error(err.message)
        }
    }

    
    return (
        <Fragment>
            <Nav_bar />
            <div className="container">
                <div class="row">
                    
                    <div class="col-sm">
                        <div className="auth-wrapper"> 
                            <div className="auth-inner">
                                <h1 className="text-center my-5">Register</h1>
                                <form onSubmit={onSubmitForm}> 
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
                                        <label>Full Name</label>
                                        <input type="text" 
                                        name="name" 
                                        placeholder="Full Name"
                                        className="form-control"
                                        value={name}
                                        onChange={e => onChange(e)}/>
                                    </div>
                                    {/* <input type="text" 
                                    name="profile_pic" 
                                    placeholder="Profile Pic"
                                    className="form-control my-3"
                                    value={profile_pic}
                                    onChange={e => onChange(e)}/> */}
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" 
                                        name="address" 
                                        placeholder="Address"
                                        className="form-control"
                                        value={address}
                                        onChange={e => onChange(e)}/>
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
                        <div class="card" >
                            <img class="img-wrapper" src={RegisterPage} />
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