import React, {Fragment, useState} from "react";
import { Link, withRouter } from "react-router-dom"
import RegisterPage from '../Assets/Images/RegisterPage.jpg';
import { toast } from "react-toastify";

const RegisterPet = ({setAuth}) => {

    const [inputs, setInputs] = useState({
        pet_name: "",
        special_req: ""
    });

    const [gender, setGender] = useState("M");
    const [pet_type, setPetType] = useState("dog");
    const {pet_name, special_req} = inputs;

    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { pet_name, special_req, pet_type, gender }
            const response = await fetch("http://localhost:5000/auth/registerpet", {
                method: "POST",
                headers: { "Content-Type": "application/json",
                            token: localStorage.token },
                body: JSON.stringify(body)
            });
            
            const parseResponse = await response.json();
            const successMessage = 'Your pet ' + parseResponse + ' has been succesfully registered!'
            toast.success(successMessage);
            
        } catch (err) {
            console.error(err.message)
        }

        //this.props.history.push('/profile')
    }

    
    return (
        <Fragment>
            <div className="container">
                <div class="row">
                    
                    <div class="col-sm">
                        <div className="auth-wrapper"> 
                            <div className="auth-inner">
                                <h1 className="text-center my-5">Register Your Pet!</h1>
                                <form onSubmit={onSubmitForm}> 
                                    <div className="form-group">
                                        <label>Pet Name</label>
                                        <input type="text" 
                                        name="pet_name" 
                                        placeholder="Pet Name"
                                        className="form-control"
                                        value={pet_name}
                                        onChange={e => onChange(e)}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Pet Gender</label>
                                        <select className="form-control" value={gender} onChange={e => setGender(e.target.value)}>
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                        </select>
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
                                        <label>Special Requirements</label>
                                        <input type="text" 
                                        name="special_req" 
                                        placeholder=""
                                        className="form-control"
                                        value={special_req}
                                        onChange={e => onChange(e)}/>
                                    </div>
                                        <button className="btn btn-success btn-block">
                                            Submit</button>
                                </form>
                            </div>
                        </div>   
                    </div>

                    <div class="col-sm">
                        <div class="card" >
                            <img class="img-wrapper" src={RegisterPage} />
                            <div class="card-body">
                                <h5 class="card-title">Join us!</h5>
                                <p class="card-text">We are a loving community of Pet Owners and Care Takers, we're sure you'll find a home with us!</p>
                    
                            </div>
                        </div>
                    </div>

                </div> 
            </div>
        </Fragment>
    );
};

export default RegisterPet;