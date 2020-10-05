import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom"

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
            <div className="container">
                <h1 className="text-center my-5">Register</h1>
                <form onSubmit={onSubmitForm}> 
                    <input type="email" 
                    name="email" 
                    placeholder="Email"
                    className="form-control my-3"
                    value={email}
                    onChange={e => onChange(e)}/>
                    <input type="password" 
                    name="password" 
                    placeholder="Password"
                    className="form-control my-3"
                    value={password}
                    onChange={e => onChange(e)}/>
                    <input type="text" 
                    name="name" 
                    placeholder="Full Name"
                    className="form-control my-3"
                    value={name}
                    onChange={e => onChange(e)}/>
                    <input type="text" 
                    name="profile_pic" 
                    placeholder="Profile Pic"
                    className="form-control my-3"
                    value={profile_pic}
                    onChange={e => onChange(e)}/>
                    <input type="text" 
                    name="address" 
                    placeholder="Address"
                    className="form-control my-3"
                    value={address}
                    onChange={e => onChange(e)}/>
                    <button className="btn btn-success btn-block">Submit</button>
                </form>
                <Link to="/login">Login</Link>
            </div>
        </Fragment>
    );
};

export default Register;