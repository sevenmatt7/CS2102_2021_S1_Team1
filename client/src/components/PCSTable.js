import React, { Fragment, useEffect, useState } from "react"

const PCSTable = () => {

    const [caretakers, setCaretakers] = useState([]);
    const [month, setMonth] = useState("Total");
    const month_conversion = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December', 'Select Month'];

    // Filter month button handler
    const handleClick = (e) => {
        if (Number(e.target.value) === 13) getCareTakers();
        else filterTable(Number(e.target.value));
        setMonth(month_conversion[Number(e.target.value) - 1]);
    }

    // Default method to get all CareTakers earnings
    const getCareTakers = async () => {
        try {
            const response = await fetch("/PCSTable");
            const data = await response.json();
            setCaretakers(data);
        } catch (error) {
            console.log(error.message);
        }
    };
    // Filter table based on a given month
    const filterTable = async (month) => {
        try {
            const response = await fetch("/PCSTableFilter?" + new URLSearchParams({
                month: month
            }), {
                method: "GET"
            });
            const data = await response.json();
            setCaretakers(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        getCareTakers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                <td className="text-center">{caretaker.total_pet_days}</td>
                                <td className="text-center">{caretaker.total_salary}</td>
                            </tr>
                        </tbody>
                    ))}
                </table>
            </div>
        </Fragment>
    );
};

export default PCSTable;