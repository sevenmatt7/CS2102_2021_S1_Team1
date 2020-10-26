import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const EditProfile = ({name, address, profile_pic_URL}) => {
    
    const [inputs, setInputs] = useState({
        full_name: "",
        user_address: "",
        profile_pic_address: "",
    });

    const {full_name, user_address, profile_pic_address } = inputs;
    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    const saveChanges = async (e) => {
        e.preventDefault();
        try {
           
            const body = {full_name, user_address, profile_pic_address };
            const response = await fetch("http://localhost:5000/edituser", {
                method: "PUT",
                headers: { "Content-Type": "application/json",
                            token: localStorage.token },
                body: JSON.stringify(body)
            });
            
            const parseResponse = await response.json();
            console.log(parseResponse)
            const successMessage = 'You have successfully edited your profile!';
            toast.success(successMessage);
            window.location.reload();
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <Fragment>
            <button className="btn btn-light" data-toggle="modal" data-target='#editmodal'
              onClick={e => setInputs({full_name: name, user_address: address, profile_pic_address: profile_pic_URL})}>Edit Profile</button>
              
            <div className="modal fade" id={`editmodal`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit your personal details</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body mx-3">
                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Full name</label>
                                <input type="text" 
                                name="full_name"
                                value={full_name}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                />
                            </div>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">URL of profile picture</label>
                                <input type="text" 
                                name="profile_pic_address"
                                value={profile_pic_address}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                />
                            </div>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Address</label>
                                <input type="text" 
                                name="user_address"
                                value={user_address}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" data-dismiss="modal" 
                            onClick={e => saveChanges(e)} >Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default EditProfile;