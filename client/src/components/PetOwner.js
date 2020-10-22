import React, { Fragment, useState, useEffect } from "react";
import imposter from "../Assets/Images/imposter.jpg";

const PetOwner = () => {

    const [searches, setSearches] = useState([]);
    const acc_type = localStorage.acc_type;
    useEffect(() => {
        getPets();
    }, [])

    const getPets = async () => {
        try {
            if (acc_type === "petowner") {
                const response = await fetch("http://localhost:5000/pets", {
                    method: "GET",
                    headers: { token: localStorage.token }
                });
                const jsonData = await response.json();
                setSearches(jsonData);
            }
        } catch (error) {
            console.log(error.message)
        }
    };

    return (
        <Fragment>
            <div className="container petowner-home">
                <div className="profile-head">
                    <ul class="nav nav-tabs" id="PetOwnerTab" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="transactions-tab" data-toggle="tab" href="#transactions" role="tab"
                                aria-controls="transactions" aria-selected="true">Transactions</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="pets-tab" data-toggle="tab" href="#pets" role="tab"
                                aria-controls="pets" aria-selected="false">Pets</a>
                        </li>
                    </ul>
                </div>
                <div class="tab-content" id="PetOwnerTabContent">
                    <div class="tab-pane fade show active" id="transactions" role="tabpanel" aria-labelledby="transactions-tab">Transactions test</div>
                    <div class="tab-pane fade mt-4" id="pets" role="tabpanel" aria-labelledby="pets-tab">
                        {/* <h2 className="mb-3">My Pets</h2> */}
                        <div className="row">
                            <div className="card-deck">
                                {searches.map((search, i) => (
                                    <div className="col-md-6 mb-4">
                                        <div key={i} className="card mb-3">
                                            <div className="row no-gutters">
                                                <div className="col-md-4">
                                                    <img src={imposter} alt="" className="card-img" />
                                                </div>
                                                <div className="card-text col-md-8">
                                                    <div className="card-body">
                                                        <h5 className="card-title"> {search.pet_name}</h5>
                                                        <p className="card-text">Gender: {search.gender}</p>
                                                        <p className="card-text">Pet Type: {search.pet_type}</p>
                                                        <p className="card-text">Special Requirement: {search.special_req}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </Fragment>
    )

};

export default PetOwner; 