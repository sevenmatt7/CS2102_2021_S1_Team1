import React, { Fragment, useState, useEffect } from "react";

const PCSCommission = () => {

    const [commission, setCommission] = useState("");
    const [name, setName] = useState("");

    const getProfile = async () => {
        try {
            const res = await fetch("/home/", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const jsonData = await res.json();
            setName(jsonData.full_name);
        } catch (err) {
            console.error(err.message);
        }
    };

    const getCommission = async() => {
        try {
            console.log(localStorage.token)
            const response = await fetch("/commission?" + new URLSearchParams({
                admin_email: localStorage.token,
            }), {
                method: "GET"
            });
            const data = await response.json();
            setCommission(data.sum);
        } catch (err) {
            console.log(err.message);
        }
    }
    useEffect(()=>{
        getCommission();
        getProfile();
    }, [])

    return (
        <Fragment>
            <div className="col-md-6">
                <div className="card ">
                    <div className="card-header ">
                        <h4 className="card-title">Total Earnings earned by: {name}</h4>
                    </div>
                    <div className="card-body ">
                            <div  className="card-new text-black bg-light mb-3 mb-3">
                                <div className="card-body">
                                    <h5>Commission: ${commission}</h5>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default PCSCommission;