import React, { Fragment, useState, useEffect } from "react"


const ContactUs = () => {
    const [subject, setSubject] = useState('Getting Started')
    const [message, setMessage] = useState()
    const [date, setDate] = useState(new Date())

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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            )
            window.location.reload(false)
        } catch (err) {
            console.error(err.message)
        }
    }

    const getEnquiries = async () => {
        try {
            const response = await fetch("http://localhost:5000/contact")
            const data = await response.json()
            setEnquiries(data)
        } catch (err) {
            console.error(err.message)
        }
    }



    // get enquiries on mount
    useEffect(() => {
        getEnquiries()
    }, [])

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
                                <label>Message</label>
                                <textarea
                                    className="form-control"
                                    name="message"
                                    value={message}
                                    rows="3"
                                    placeholder="Enter your message"
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
            <h2>FAQ</h2>
            <table className="table mt-5">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                        <td>John</td>
                        <td>Doe</td>
                        <td>john@example.com</td>
                    </tr> */}
                    {
                        enquiries.map(enquiry => (
                            <tr key={enquiry.e_id}>
                                <td>{enquiry.enq_type}</td>
                                <td>
                                    {enquiry.enq_message}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Fragment>
    )
}

export default ContactUs