import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const OwnerReview = ({ search, i }) => {
    const pet_name = search.pet_name;
    const caretaker_email = search.caretaker_email;
    const employment_type = search.employment_type;
    const duration = search.duration;

    const [inputs, setInputs] = useState({
        rating: 5,
        review: ""
    });

    const {rating, review} = inputs;

    const submitReview= async (e) => {
        e.preventDefault();
        try {
            // const service_request_period = service_request_from + ',' + service_request_to;
           
            const body = { caretaker_email, employment_type, pet_name, duration, rating, review };
            const response = await fetch("http://localhost:5000/submitreview", {
                method: "PUT",
                headers: { "Content-Type": "application/json",
                            token: localStorage.token },
                body: JSON.stringify(body)
            });
            
            const parseResponse = await response.json();
            let dateArr = parseResponse.split(',')
            const successMessage = "Your review for " + dateArr[0] + " to " +
                                    dateArr[1] + " has been submitted!";
            toast.success(successMessage);
            window.location.reload();
        } catch (err) {
            console.error(err.message)
        }
    }

    
    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    return (
        <Fragment>
            <button className="btn btn-success" data-toggle="modal" data-target={`#id${i}review`}
              >Submit Review</button>
              
            <div className="modal fade" id={`id${i}review`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Submit review for {search.full_name}!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body mx-3">
                            
                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Rating (out of 5)</label>
                                <input type="number" 
                                pattern="[0-9]+" 
                                maxLength="2" 
                                min = "0"
                                max = "5"
                                name="rating"
                                value={rating}
                                onChange={(e) => onChange(e)}
                                id={`bid${search.full_name}`} 
                                className="form-control validate" 
                                required="required" />
                            </div>

                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Any comments?</label>
                                <input type="text"
                                name="review"
                                value={review}
                                onChange={e => onChange(e)}
                                id={`bid${search.full_name}`} 
                                className="form-control validate" 
                                />
                            </div>

                            {/* <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right">Bidding Offer ($ per hr)</label>
                                <input type="number" 
                                pattern="[0-9]+" 
                                maxLength="4" 
                                name="bidding_offer"
                                value={bidding_offer}
                                onChange={e => onChange(e)}
                                id={`bid${search.full_name}`} 
                                className="form-control validate" 
                                required="required" />
                            </div> */}

                            {/* <label className="my-1 mr-2" htmlFor="modeOfPetXfer">Mode of Pet Transfer</label>
                            <select className="custom-select mt-2 mb-4 mr-sm-2" id="modeOfPetXfer" value={transfer_mode} 
                            onChange={e => setTransferMode(e.target.value)} required="required">
                                <option selected disabled>Choose...</option>
                                <option value="1">Pet Owner deliver</option>
                                <option value="2">Care Taker pickup</option>
                                <option value="3">Transfer via building at PCS</option>
                            </select> */}

                            {/* <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right" htmlFor="startDate">Start Date</label>
                                <input type="datetime-local" 
                                id="startDate" 
                                name="service_request_from"
                                value={service_request_from}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                min="2020-01-01T23:59" 
                                max="2099-12-31T23:59" 
                                required="required" />
                            </div> */}

                            {/* <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right" htmlFor="endDate">End Date</label>
                                <input type="datetime-local" 
                                id="endDate" 
                                name="service_request_to"
                                value={service_request_to}
                                onChange={e => onChange(e)}
                                className="form-control validate" 
                                min="2020-01-01T23:59" 
                                max="2099-12-31T23:59" 
                                required="required" />
                            </div> */}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary" data-dismiss="modal" 
                             onClick={(e) => submitReview(e)}>Submit Review</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default OwnerReview;