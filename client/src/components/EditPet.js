import React, { Fragment, useState } from "react";

const EditPet = ({ search, i }) => {
    const pet_name = search.pet_name;
    const special_req = search.special_req;
    const pet_type = search.pet_type;
    const gender = search.gender;

    const [info, setInfo] = useState({
        old_pet_name: pet_name,
        new_pet_name: pet_name,
        special_req: special_req,
        pet_type: pet_type,
        gender: gender
    });

    const editPet = async () => {
        try {
            const body = info;
            const res = await fetch("/editpet", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    token: localStorage.token
                },
                body: JSON.stringify(body)
            });
            const JsonData = await res.json();
            console.log(JsonData);
            window.location.reload();

        } catch (err) {
            console.error(err.message)
        }
    }


    const onChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
    }

    return (
        <Fragment>
            <button className="btn btn-warning" data-toggle="modal" data-target={`#id${i}petedit`}>Edit</button>

            <div className="modal fade" id={`id${i}petedit`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit information of {search.pet_name}:</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body mx-3">

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Name</label>
                                <input type="text"
                                    name="new_pet_name"
                                    value={info.new_pet_name}
                                    onChange={(e) => onChange(e)}
                                    id={`name${info.new_pet_name}`}
                                    className="form-control validate"
                                    required="required" />
                            </div>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Gender</label>
                                <select className="form-control" name="gender" value={info.gender} id={`gender${info.gender}`} onChange={(e) => onChange(e)}>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Pet Type</label>
                                <select id={`type${info.pet_type}`} name="pet_type" class="form-control" value={info.pet_type} onChange={(e) => onChange(e)}>
                                    <option value="dog">Dog</option>
                                    <option value="cat">Cat</option>
                                    <option value="bird">Bird</option>
                                    <option value="rabbit">Rabbit</option>
                                    <option value="reptile">Reptile</option>
                                </select>
                            </div>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Special Requirements</label>
                                <input type="text"
                                    name="special_req"
                                    value={info.special_req}
                                    onChange={(e) => onChange(e)}
                                    id={`req${info.special_req}`}
                                    className="form-control validate"
                                />
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" data-dismiss="modal"
                                onClick={() => editPet()}>Edit</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default EditPet;