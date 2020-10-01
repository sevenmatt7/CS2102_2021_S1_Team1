import React, { Fragment } from "react";

const RequestService = ({ search }) => {

    // console.log(search)

    return (
        <Fragment>
            <button className="btn btn-success" data-toggle="modal" data-target={`#id${search.caretaker_id}`}>Request service!</button>
            <div className="modal fade" id={`id${search.caretaker_id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Request Service from {search.full_name}!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body mx-3">
                            
                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right" htmlFor={`bid${search.caretaker_id}`}>Bidding Offer ($ per hr)</label>
                                <input type="text" pattern="[0-9]+" maxLength="4" id={`bid${search.caretaker_id}`} className="form-control validate" required="required" />

                            </div>
                            <label className="my-1 mr-2" htmlFor="modeOfPetXfer">Mode of Pet Transfer</label>
                            <select className="custom-select mt-2 mb-4 mr-sm-2" id="modeOfPetXfer" required="required">
                                <option selected disabled>Choose...</option>
                                <option value="1">Pet Owner deliver</option>
                                <option value="2">Care Taker pickup</option>
                                <option value="3">Transfer via building at PCS</option>
                            </select>
                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right" htmlFor="startDate">Start Date</label>
                                <input type="datetime-local" id="startDate" className="form-control validate" min="2020-01-01T23:59" max="2099-12-31T23:59" required="required" />
                            </div>
                            <div className="md-form mb-4">
                                <label data-error="wrong" data-success="right" htmlFor="endDate">End Date</label>
                                <input type="datetime-local" id="endDate" className="form-control validate" min="2020-01-01T23:59" max="2099-12-31T23:59" required="required" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-primary">Submit Bidding</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default RequestService;