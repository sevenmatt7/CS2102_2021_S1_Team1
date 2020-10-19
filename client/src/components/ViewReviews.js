import React, { Fragment, useState } from "react";
import { toast } from "react-toastify";

const ViewReviews = ({ search, i }) => {
    const pet_name = search.pet_name
    const caretaker_email = search.caretaker_email
    const employment_type = search.employment_type
    const duration = search.duration
    const [reviews, setReviews] = useState([]);

    const getReviews= async () => {
        try {
            const response = await fetch('http://localhost:5000/getreview?' + new URLSearchParams({
                caretaker_email: caretaker_email,
                employment_type: employment_type,
            }), {
            method: "GET"
            });

            const jsonData = await response.json();
            setReviews(jsonData);
        } catch (err) {
            console.error(err.message)
        }
    }

    const [inputs, setInputs] = useState({
        rating: 0,
        review: ""
    });

    const {rating, review} = inputs;
    const onChange = (e) => {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }

    return (
        
        <Fragment>
            <button className="btn btn-success" data-toggle="modal" data-target={`#id${i}review`}
              onClick={e => getReviews(e)}>View reviews</button>
              
            <div className="modal fade" id={`id${i}review`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Here is what people have said about {search.full_name}!</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body mx-3">
                        {reviews.map((review, i) => (
                            <div>
                            <h5>Review from: {review.full_name}</h5>
                            <p>Comments: {review.owner_review}</p>
                            <p>Rating: {review.owner_rating}</p>
                            </div>))}
                        
                        
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ViewReviews;