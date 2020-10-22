import React, { Fragment, useEffect, useState } from "react"


const PCSTable = () => {
    const [caretakers, setCaretakers] = useState([]);
    const [month, setMonth] = useState("Select Month");
    const month_conversion = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December', 'Select Month'];
    const parseDate = (str) => {
        var mdy = str.split('-');
        return new Date(mdy[0], mdy[1] - 1, mdy[2]);
    }

    const datediff = (first, second) => {
        return Math.round((second - first) / (1000 * 60 * 60 * 24)) + 1;
    }

    const filterStartDate = (month, startDate) => {
        var mdy = startDate.split('-');
        return new Date(mdy[0], month - 1, "1");
    }

    const filterEndDate = (month, endDate) => {
        var mdy = endDate.split('-');
        return new Date(mdy[0], month, "0");
    }

    const generateJSONArray = (bigobj) => {
        var finalarr = [];
        for (let obj in bigobj) {
            let tempobj = {};
            tempobj['caretaker_email'] = obj;
            tempobj['full_name'] = bigobj[obj]['full_name'];
            tempobj['employment_type'] = bigobj[obj]['employment_type'];
            tempobj['avg_rating'] = bigobj[obj]['avg_rating'];
            tempobj['pet_days'] = bigobj[obj]['pet_days'];
            tempobj['salary'] = bigobj[obj]['salary'];
            finalarr.push(tempobj);
        }
        return finalarr;
    }

    const createSmallObj = (obj, arg) => {
        let smallobj = {};
        let dateArray = obj['duration'].split(',');
        let ratingMultiplier = Number(obj['avg_rating']);
        let pet_days = (typeof arg === 'undefined') ? Number(datediff(parseDate(dateArray[0]), parseDate(dateArray[1]))) : arg;
        let hour_rate = Number(obj['cost']) + ratingMultiplier * 10;
        smallobj['caretaker_email'] = obj['caretaker_email'];
        smallobj['full_name'] = obj['full_name'];
        smallobj['employment_type'] = obj['employment_type'];
        smallobj['avg_rating'] = Number(obj['avg_rating']);
        smallobj['total_rating'] = Number(obj['avg_rating']);
        smallobj['pet_days'] = pet_days;
        smallobj['salary'] = pet_days * hour_rate;
        smallobj['count'] = 1;
        smallobj['cost'] = Number(obj['cost']);
        smallobj['hour_rate'] = hour_rate;
        return smallobj;
    }

    const getCareTakers = async () => {
        try {
            const response = await fetch("http://localhost:5000/caretakersadmin");
            const jsonData = await response.json();
            let bigobj = {};
            for (let i = 0; i < Object.keys(jsonData).length; i++) {
                let smallobj = createSmallObj(jsonData[i]);
                if (smallobj['caretaker_email'] in bigobj) {
                    if (bigobj[jsonData[i]['caretaker_email']]['employment_type'] === "Part-time") {
                        bigobj[jsonData[i]['caretaker_email']]['salary'] += smallobj['cost'] * smallobj['pet_days'] * 0.75;
                    } else {
                        if (bigobj[jsonData[i]['caretaker_email']]['pet_days'] >= 30) {
                            bigobj[jsonData[i]['caretaker_email']]['salary'] += smallobj['pet_days'] * 0.8 * smallobj['hour_rate'];
                        } else if (bigobj[jsonData[i]['caretaker_email']]['pet_days'] + smallobj['pet_days'] > 30) {
                            let diff1 = 30 - bigobj[jsonData[i]['caretaker_email']]['pet_days'];
                            let diff2 = smallobj['pet_days'] - diff1;
                            bigobj[jsonData[i]['caretaker_email']]['salary'] += diff1 * smallobj['hour_rate'];
                            bigobj[jsonData[i]['caretaker_email']]['salary'] += diff2 * 0.8 * smallobj['hour_rate'];
                        } else {
                            bigobj[jsonData[i]['caretaker_email']]['salary'] += smallobj['salary'];
                        }
                    }
                    bigobj[jsonData[i]['caretaker_email']]['pet_days'] += smallobj['pet_days'];
                    bigobj[jsonData[i]['caretaker_email']]['count'] += smallobj['count'];
                    bigobj[jsonData[i]['caretaker_email']]['total_rating'] += Number(smallobj['avg_rating']);
                    bigobj[jsonData[i]['caretaker_email']]['avg_rating'] = bigobj[jsonData[i]['caretaker_email']]['total_rating'] / bigobj[jsonData[i]['caretaker_email']]['count'];
                } else {
                    if (smallobj['employment_type'] === "Part-time")
                        smallobj['salary'] = smallobj['cost'] * smallobj['pet_days'] * 0.75;
                    bigobj[jsonData[i]['caretaker_email']] = smallobj;
                }
                // console.log(Number(smallobj['avg_rating']), jsonData[i]['caretaker_email'], bigobj[jsonData[i]['caretaker_email']]['avg_rating'], bigobj[jsonData[i]['caretaker_email']]['count']);
            }
            setCaretakers(generateJSONArray(bigobj));
        } catch (error) {
            console.log(error.message);
        }

    };

    const filterTable = async (month) => {
        try {
            const response = await fetch("http://localhost:5000/caretakersadmin");
            const jsonData = await response.json();
            let bigobj = {};
            for (let i = 0; i < Object.keys(jsonData).length; i++) {
                let dateArray = jsonData[i]['duration'].split(',');
                let startDate = parseDate(dateArray[0]);
                let endDate = parseDate(dateArray[1]);
                let fsd = filterStartDate(month, dateArray[0]);
                let fed = filterEndDate(month, dateArray[1]);
                let totalDays = 0;
                let smallobj = {};
                if (startDate <= fed && endDate >= fsd) {
                    if (fsd <= startDate && fed >= endDate) {
                        totalDays = datediff(startDate, endDate);
                    } else if (fsd <= startDate && fed < endDate) {
                        totalDays = datediff(startDate, fed);
                    } else {
                        // console.log(startDate);
                        // console.log(endDate);
                        totalDays = datediff(startDate, endDate) - datediff(startDate, fsd) + 1;
                    }
                    console.log(totalDays);
                    smallobj = createSmallObj(jsonData[i], totalDays);
                }
                if (startDate <= fed && endDate >= fsd) {
                    if (smallobj['caretaker_email'] in bigobj) {
                        if (bigobj[jsonData[i]['caretaker_email']]['employment_type'] === "Part-time") {
                            bigobj[jsonData[i]['caretaker_email']]['salary'] += smallobj['cost'] * smallobj['pet_days'] * 0.75;
                        } else {
                            if (bigobj[jsonData[i]['caretaker_email']]['pet_days'] >= 30) {
                                bigobj[jsonData[i]['caretaker_email']]['salary'] += smallobj['pet_days'] * 0.8 * smallobj['hour_rate'];
                            } else if (bigobj[jsonData[i]['caretaker_email']]['pet_days'] + smallobj['pet_days'] > 30) {
                                let diff1 = 30 - bigobj[jsonData[i]['caretaker_email']]['pet_days'];
                                let diff2 = smallobj['pet_days'] - diff1;
                                bigobj[jsonData[i]['caretaker_email']]['salary'] += diff1 * smallobj['hour_rate'];
                                bigobj[jsonData[i]['caretaker_email']]['salary'] += diff2 * 0.8 * smallobj['hour_rate'];
                            } else {
                                bigobj[jsonData[i]['caretaker_email']]['salary'] += smallobj['salary'];
                            }
                        }

                        bigobj[jsonData[i]['caretaker_email']]['pet_days'] += smallobj['pet_days'];
                        bigobj[jsonData[i]['caretaker_email']]['count'] += smallobj['count'];
                        bigobj[jsonData[i]['caretaker_email']]['total_rating'] += Number(smallobj['avg_rating']);
                        bigobj[jsonData[i]['caretaker_email']]['avg_rating'] = bigobj[jsonData[i]['caretaker_email']]['total_rating'] / bigobj[jsonData[i]['caretaker_email']]['count'];
                    } else {
                        if (smallobj['employment_type'] === "Part-time")
                            smallobj['salary'] = smallobj['cost'] * smallobj['pet_days'] * 0.75;
                        bigobj[jsonData[i]['caretaker_email']] = smallobj;
                    }
                }
            }
            console.log(bigobj)
            setCaretakers(generateJSONArray(bigobj));
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getCareTakers();
    }, []);

    const handleClick = (e) => {
        if (Number(e.target.value) === 13) getCareTakers();
        else filterTable(Number(e.target.value));
        setMonth(month_conversion[Number(e.target.value) - 1]);
        console.log(e.target.value);
    }
    return (
        <Fragment>
            <div style={{ width: "450px", position: "relative" }}>
                <h2>Caretaker Earnings</h2>
                <button className="btn btn-primary dropdown-toggle" style={{ position: "absolute", right: "0", top: "0", textAlign: "center", width: "130px" }}
                    type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {month}
                </button>
                <div className="dropdown-menu scrollable-menu" aria-labelledby="dropdownMenu2">
                    <button className="dropdown-item" value="13" onClick={(e) => handleClick(e)}>All</button>
                    <button className="dropdown-item" value="1" onClick={(e) => handleClick(e)}>January</button>
                    <button className="dropdown-item" value="2" onClick={(e) => handleClick(e)}>February</button>
                    <button className="dropdown-item" value="3" onClick={(e) => handleClick(e)}>March</button>
                    <button className="dropdown-item" value="4" onClick={(e) => handleClick(e)}>April</button>
                    <button className="dropdown-item" value="5" onClick={(e) => handleClick(e)}>May</button>
                    <button className="dropdown-item" value="6" onClick={(e) => handleClick(e)}>June</button>
                    <button className="dropdown-item" value="7" onClick={(e) => handleClick(e)}>July</button>
                    <button className="dropdown-item" value="8" onClick={(e) => handleClick(e)}>August</button>
                    <button className="dropdown-item" value="9" onClick={(e) => handleClick(e)}>September</button>
                    <button className="dropdown-item" value="10" onClick={(e) => handleClick(e)}>October</button>
                    <button className="dropdown-item" value="11" onClick={(e) => handleClick(e)}>November</button>
                    <button className="dropdown-item" value="12" onClick={(e) => handleClick(e)}>December</button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th className="text-center" scope="col">Caretaker Email</th>
                            <th className="text-center" scope="col">Full Name</th>
                            <th className="text-center" scope="col">Employment Type</th>
                            <th className="text-center" scope="col">Average Rating</th>
                            <th className="text-center" scope="col">Pet-days</th>
                            <th className="text-center" scope="col">Salary</th>
                        </tr>
                    </thead>
                    {caretakers.map((caretaker, i) => (
                        <tbody key={i}>
                            <tr>
                                <th className="text-center" scope="row">{caretaker.caretaker_email}</th>
                                <td className="text-center">{caretaker.full_name}</td>
                                <td className="text-center">{caretaker.employment_type}</td>
                                <td className="text-center">{caretaker.avg_rating}</td>
                                <td className="text-center">{caretaker.pet_days}</td>
                                <td className="text-center">{caretaker.salary}</td>

                            </tr>
                        </tbody>
                    ))}
                </table>

            </div>
        </Fragment>


    );
};

export default PCSTable;