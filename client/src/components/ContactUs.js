import React, { Fragment, useState, useEffect } from "react"


const ContactUs = () => {
    const [subject, setSubject] = useState('Getting Started')
    const [message, setMessage] = useState()
    const [date, setDate] = useState(new Date())
    const [filter, setFilter] = useState('All')
    const [enquiries, setEnquiries] = useState([])

    const onInputChange = event => {
        // console.log("enter onInputChange")
        const value = event.target.value;
        setMessage(value)
        // console.log(value)
    };


    const handleSubmit = async e => {
        e.preventDefault()
        try {
            // console.log(e)
            console.log((new Date()).getDate())
            setDate(new Date().toLocaleDateString())
            const body = { subject: subject, message: message, date: date }
            // console.log(body)
            const response = await fetch(
                "http://localhost:5000/contact",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        token: localStorage.token
                    },
                    body: JSON.stringify(body)
                }
            )
            window.location.reload(false)
        } catch (err) {
            console.error(err.message)
        }
    }

    const getDate = enquiry => {
        let dateString = enquiry.submission
        const index = dateString.indexOf('T')
        return dateString.substring(0, index)
    }

    const getEnquiries = async () => {
        try {
            const response = await fetch("http://localhost:5000/contact?" + new URLSearchParams({
                enq_type: filter
            }), {
                method: "GET"
            })
            const data = await response.json()
            setEnquiries(data)

        } catch (err) {
            console.error(err.message)
        }
    }



    // get enquiries on mount
    useEffect(() => {
        getEnquiries()
    }, [filter])

    // get enquiries

    return (
        <Fragment>

            <div className="container-fluid  p-3">
                <div className="card mx-auto" style={{ width: "30rem" }}>
                    <div className="card-title text-center m-3">
                        <h2>Submit your enquiries here!</h2>
                    </div>

                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="form-group" controlId="subject">
                                <label>Subject</label>

                                <select className="form-control" value={subject} onChange={e => setSubject(e.target.value)}>
                                    <option value="Getting Started">Getting Started</option>
                                    <option value="Account and Profile">Account and Profile</option>
                                    <option value="Finding Sitter">Finding Sitter</option>
                                    <option value="Bookings">Bookings</option>
                                    <option value="Payments">Payments</option>
                                    <option value="Safety">Safety</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>


                            <div className="form-group" controlId="subject">
                                <label>Question</label>
                                <textarea
                                    className="form-control"
                                    name="message"
                                    value={message}
                                    rows="3"
                                    placeholder="Enter your question"
                                    onChange={onInputChange}
                                />
                            </div>
                            <button className="btn btn-primary" variant="primary" type="submit">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>

            </div>
            <br></br>
            <div className="container">
                <h2 className="text-center mb-5">Previously Asked Questions</h2>
                <div class="input-group mb-3">
                    <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect01">Category</label>
                    </div>
                    <select className="form-control" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Getting Started">Getting Started</option>
                        <option value="Account and Profile">Account and Profile</option>
                        <option value="Finding Sitter">Finding Sitter</option>
                        <option value="Bookings">Bookings</option>
                        <option value="Payments">Payments</option>
                        <option value="Safety">Safety</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <table className="table mt-5 mb-5">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Date</th>
                            <th width={'50%'}>Question</th>
                            <th width={'50%'}>Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td>John</td>
                            <td>Doe</td>
                            <td>john@example.com</td>
                        </tr> */}
                        {
                            enquiries.map((enquiry, index) => (
                                <tr key={index}>
                                    <td>{enquiry.enq_type}</td>
                                    <td>{getDate(enquiry)}</td>
                                    <td>{enquiry.enq_message}</td>
                                    <td>{enquiry.answer}</td>
                                </tr>
                            ))
                            // (filter === 'All') ?
                            //     (enquiries.map(enquiry => (
                            //         <tr key={enquiry.e_id}>
                            //             {/* <td>{enquiry.enq_type}</td> */}
                            //             <td>
                            //                 {enquiry.enq_message}
                            //             </td>
                            //         </tr>
                            //     )))
                            //     :
                            //     (enquiries.filter(enquiry => (enquiry.enq_type === filter)).map(filteredenquiry => (
                            //         <tr key={filteredenquiry.e_id}>
                            //             {/* <td>{filteredenquiry.enq_type}</td> */}
                            //             <td>
                            //                 {filteredenquiry.enq_message}
                            //             </td>
                            //         </tr>
                            //     )))


                        }
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default ContactUs