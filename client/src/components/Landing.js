import React,  { Fragment, useState } from "react";
import {Link} from "react-router-dom"

const LandingPage = () => {

    return (
        <Fragment>
            <h1 className="text-center mt-5 mb-5">Welcome to Pet Society!</h1>
            {/* <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={description} 
                onChange={e => setDescription(e.target.value)}/> 
                </form>*/}
                <Link to="/login">
                    <button className="btn btn-success btn-block">Login</button>
                </Link>
                <Link to="/register">
                    <button className="btn btn-primary btn-block mt-3">Register</button>
                </Link>
                
                
            
        </Fragment>
    );
    
};

export default LandingPage;