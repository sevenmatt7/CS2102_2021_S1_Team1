import React, { Fragment, useState, useEffect } from "react";

const PCSCommission = () => {

    const [commission, setCommission] = useState(0);
    const [name, setName] = useState("");
    const [fulltime, setFulltime] = useState(0);
    const [parttime, setParttime] = useState(0);
    const [petowners, setPetowners] = useState([]);
    const [totalPetOwners, setTotalPetOwners] = useState("")
    const [petownerDistribution, setPetownerDistribution] = useState({
        central: '',
        north: '',
        northeast: '',
        east: '',
        west: ''
    })
    const [caretakerDistribution, setCaretakerDistribution] = useState({
        central: '',
        north: '',
        northeast: '',
        east: '',
        west: ''
    })

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
            let numEachPetType = [0, 0, 0, 0, 0, 0]
            let total = 0
            jsonData.owner.map(owner => {
                total = owner.sum
                if (owner.pet_type === 'rabbit') numEachPetType[0] = owner.count
                else if (owner.pet_type === 'reptile') numEachPetType[1] = owner.count
                else if (owner.pet_type === 'cat') numEachPetType[2] = owner.count
                else if (owner.pet_type === 'fish') numEachPetType[3] = owner.count
                else if (owner.pet_type === 'bird') numEachPetType[4] = owner.count
                else if (owner.pet_type === 'dog') numEachPetType[5] = owner.count
            })
            setPetowners(numEachPetType)
            setTotalPetOwners(total)
            // [central, north, northeast, east, west]
            let areaDistribution = [0, 0, 0, 0, 0]
            // getting area distribution of petowners
            jsonData.petownerDistribution.map(area => {
                if (area.user_area === 'Central') areaDistribution[0] = area.count
                else if (area.user_area === 'North') areaDistribution[1] = area.count
                else if (area.user_area === 'Northeast') areaDistribution[2] = area.count
                else if (area.user_area === 'East') areaDistribution[3] = area.count
                else if (area.user_area === 'West') areaDistribution[4] = area.count
            })
            setPetownerDistribution({
                central: areaDistribution[0],
                north: areaDistribution[1],
                northeast: areaDistribution[2],
                east: areaDistribution[3],
                west: areaDistribution[4]
            })
            areaDistribution = [0, 0, 0, 0, 0]
            // getting area distribution of caretakers
            jsonData.caretakerDistribution.map(area => {
                if (area.user_area === 'Central') areaDistribution[0] = area.count
                else if (area.user_area === 'North') areaDistribution[1] = area.count
                else if (area.user_area === 'Northeast') areaDistribution[2] = area.count
                else if (area.user_area === 'East') areaDistribution[3] = area.count
                else if (area.user_area === 'West') areaDistribution[4] = area.count
            })
            setCaretakerDistribution({
                central: areaDistribution[0],
                north: areaDistribution[1],
                northeast: areaDistribution[2],
                east: areaDistribution[3],
                west: areaDistribution[4]
            })

        } catch (err) {
            console.error(err.message);
        }
    };

    const getCommission = async () => {
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
    useEffect(() => {
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
                            <div className="card">
                                <div className="card-body">
                                    <h4 classname="mb-5">Total Earnings earned by: {name}</h4>
                                    <h5>💰 Commission: ${commission}</h5>
                                </div>
                            </div>
                        </div>
                        <div className="card-body ">
                            <div className="card">
                                <div className="card-body">
                                    {/* <h4>Total number of pet owners: {petowners.reduce((a, b) => { return parseInt(a) + parseInt(b) }, 0)} </h4> */}
                                    <h4>Total number of pet owners: {totalPetOwners} </h4>
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
                            <div className="card">
                                <div className="card-body">
                                    <h4>Total number of caretakers: {parseInt(fulltime) + parseInt(parttime)}</h4>
                                    <p className="font-weight-bold">Part time: {parttime}</p>
                                    <p className="font-weight-bold">Full time: {fulltime}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card-body ">
                            <div className="card">
                                <div className="card-body">
                                    <h4>Distribution of Care Taker locations</h4>
                                    <p className="font-weight-bold">Central: {caretakerDistribution.central}</p>
                                    <p className="font-weight-bold">North: {caretakerDistribution.north}</p>
                                    <p className="font-weight-bold">Northeast: {caretakerDistribution.northeast}</p>
                                    <p className="font-weight-bold">East: {caretakerDistribution.east}</p>
                                    <p className="font-weight-bold">West: {caretakerDistribution.west}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card-body ">
                            <div className="card">
                                <div className="card-body">
                                    <h4>Distribution of Pet Owner locations</h4>
                                    <p className="font-weight-bold">Central: {petownerDistribution.central}</p>
                                    <p className="font-weight-bold">North: {petownerDistribution.north}</p>
                                    <p className="font-weight-bold">Northeast: {petownerDistribution.northeast}</p>
                                    <p className="font-weight-bold">East: {petownerDistribution.east}</p>
                                    <p className="font-weight-bold">West: {petownerDistribution.west}</p>
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