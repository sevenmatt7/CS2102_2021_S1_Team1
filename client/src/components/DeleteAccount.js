import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const DeleteAccount = ({ setAuth }) => {

    // const acc_type = localStorage.acc_type;
    // const employment_type = localStorage.employment_type;

    const [deletion, setDeletion] = useState({
        delete_text: "",
    });

    const onChange = (e) => {
        setDeletion({...deletion, [e.target.name]: e.target.value})
    }

    const saveChanges = async (e) => {
        if (deletion.delete_text == "delete") {
            e.preventDefault();
            try {
                const response = await fetch("/profile/deleteuser", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json",
                                token: localStorage.token },
                });
                
                const parseResponse = await response.json();
                console.log(parseResponse)
                if (parseResponse.rowCount == 0) {
                    toast.error("You cannot delete your account now!");
                }
                else {
                    const successMessage = 'You have successfully deleted your account!';
                    toast.success(successMessage);
                    localStorage.removeItem("token");
                    localStorage.removeItem("acc_type");
                    if (localStorage.emp_type) {
                        localStorage.removeItem("emp_type");
                    }
                    setAuth(false);
                    //window.location.reload();
                }
                
            } catch (err) {
                console.error(err.message);
            }
        }
        else {
            toast.error("Wrong Input!");
        }
    }

    return (
        <Fragment>
            <button className="btn btn-danger mt-1" data-toggle="modal" data-target='#deletemodal'
            >Delete Account</button>
              
            <div className="modal fade" id={`deletemodal`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Are you sure you want to delete your account?</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body mx-3">
                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Type 'delete' to confirm</label>
                                <input type="text" 
                                name="delete_text"
                                value={deletion.delete_text}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                />
                            </div>
                            
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" data-dismiss="modal" 
                            onClick={e => saveChanges(e)}> Submit </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default DeleteAccount;