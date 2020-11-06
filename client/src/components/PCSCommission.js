import React, { Fragment, useState, useEffect } from "react";

const PCSCommission = () => {

    const [commission, setCommission] = useState("");
    const [name, setName] = useState("");
    const [fulltime, setFulltime] = useState(0);
    const [parttime, setParttime] = useState(0);
    const [petowners, setPetowners] = useState([]);
    
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

    const getStats = async () => {
        try {
            const res = await fetch("/admin/stats", {
                method: "GET",
                headers: { token: localStorage.token }
            });
            const jsonData = await res.json();
            //jsonObject is received and is parsed as such below
            //parsing the number of caretakers
            setFulltime(jsonData.caretaker[0].count)
            setParttime(jsonData.caretaker[1].count)
            // 0 is rabbit, 1 is reptile, 2 is cat, 3 is fish, 4 is bird, 5 is dog
            setPetowners([jsonData.owner[0].count, jsonData.owner[1].count, jsonData.owner[2].count,
                jsonData.owner[3].count, jsonData.owner[4].count, jsonData.owner[5].count])
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
        getStats();
    }, [])

    return (
        <Fragment>
            <div className="col">
                <div className="card ">
                    <div className="card-header ">
                        <h3 className="card-title">📈 Site statistics</h3>
                    </div>
                    <div className="card-deck">
                    <div className="card-body ">
                            <div  className="card">
                                <div className="card-body">
                                    <h4 classname="mb-5">Total Earnings earned by: {name}</h4>
                                    <h5>💰 Commission: ${commission}</h5>
                                </div>
                            </div>
                    </div>
                    <div className="card-body ">
                            <div  className="card">
                                <div className="card-body">
                                    <h4>Total number of pet owners: {petowners.reduce((a, b) => {return parseInt(a)+parseInt(b)}, 0)} </h4>
                                    <div className="row">
                                        <p className="col font-weight-bold">🐇 owners: {petowners[0]}</p>
                                        <p className="col font-weight-bold">🦎 owners: {petowners[1]}</p>
                                        <p className="col font-weight-bold">🐈 owners: {petowners[2]}</p>
                                    </div>
                                    <div className="row">
                                        <p className="col font-weight-bold">🐠 owners: {petowners[3]}</p>
                                        <p className="col font-weight-bold">🦜 owners: {petowners[4]}</p>
                                        <p className="col font-weight-bold">🐕 owners: {petowners[5]}</p>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className="card-body ">
                            <div  className="card">
                                <div className="card-body">
                                    <h4>Total number of caretakers: {parseInt(fulltime) + parseInt(parttime)}</h4>
                                    <p className="font-weight-bold">Part time: {parttime}</p>
                                    <p className="font-weight-bold">Full time: {fulltime}</p>
                                </div>
                            </div>
                    </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
};

export default PCSCommission;