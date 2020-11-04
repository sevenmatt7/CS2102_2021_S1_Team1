import React, { Fragment, useEffect, useState } from 'react'
import { toast } from "react-toastify";

const PCSEnquiries = () => {
	const [enquiries, setEnquiries] = useState([])
	const [currReply, setCurrReply] = useState()

	const [filter, setFilter] = useState('All')

	const handleReply = async e => {
		e.preventDefault();
		try {
			const answer = e.target[0].value
			if (answer === '') {
				toast.error("You have not replied!");
				return
			}
			const { user_email, enq_message } = enquiries[currReply]
			const body = { user_email, enq_message, answer }
			const response = await fetch(
				"/pcsanswer",
				{
					method: "PUT",
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
			const response = await fetch("/pcsenquiries?" + new URLSearchParams({
				filter: filter
			}), {
				method: "GET"
			})
			const data = await response.json()
			setEnquiries(data)

		} catch (err) {
			console.error(err.message)
		}
	}

	useEffect(() => {
		getEnquiries()
	}, [filter])

	return (
		<Fragment>
			<div className="container">
				<div class="input-group mb-3 mt-3">
					<div class="input-group-prepend">
						<label class="input-group-text" for="inputGroupSelect01">Filter</label>
					</div>
					<select class="custom-select" id="inputGroupSelect01" value={filter} onChange={e => setFilter(e.target.value)}>
						<option value="All">All</option>
						<option value="Pending">Pending</option>
						<option value="Replied">Replied</option>
					</select>
				</div>

				<hr></hr>
				<table class="table">
					<thead>
						<tr>
							<th scope="col" width={"1%"}>#</th>
							<th scope="col" width={"1%"}>User</th>
							<th scope="col" width={"5%"}>Subject</th>
							<th scope="col" width={"13%"}>Date</th>
							<th scope="col">Question</th>
							<th scope="col">Reply</th>
							<th scope="col" width={"5%"}>Action</th>
						</tr>
					</thead>
					<tbody>
						{
							enquiries.map((enquiry, index) => (
								<tr key={index}>
									<th scope="row">{index + 1}</th>
									<td>{enquiry.user_email}</td>
									<td>{enquiry.enq_type}</td>
									<td>{getDate(enquiry)}</td>
									<td>{enquiry.enq_message}</td>
									<td>{enquiry.answer}</td>
									<td>
										{/* <!-- Button trigger modal --> */}
										{(enquiry.answer == null) && <button type="button" onClick={e => setCurrReply(index)} class="btn btn-danger" data-toggle="modal" data-target={`#staticBackdrop${index}`} >
											Reply
										</button>}
										{enquiry.answer != null && <button type="button" onClick={e => setCurrReply(index)} class="btn btn-primary" data-toggle="modal" data-target={`#staticBackdrop${index}`} >
											Edit
										</button>}

										{/* <!-- Modal --> */}
										<div class="modal fade" id={`staticBackdrop${index}`} data-backdrop="static" data-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
											<div class="modal-dialog">
												<div class="modal-content">
													<div class="modal-header">
														<h5 class="modal-title" id="staticBackdropLabel">Subject: {enquiry.enq_type}</h5>
														<button type="button" class="close" data-dismiss="modal" aria-label="Close">
															<span aria-hidden="true">&times;</span>
														</button>
													</div>
													<form onSubmit={handleReply}>
														<div class="modal-body">
															<div class="form-group">
																<div>Question: {enquiry.enq_message}</div>
																<br></br>
																<textarea class="form-control" id={`exampleFormControlTextarea${index}`} rows="3" defaultValue={enquiry.answer}></textarea>
															</div>
														</div>
														<div class="modal-footer">
															<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
															<button type="submit" class="btn btn-primary">Submit</button>
														</div>
													</form>
												</div>
											</div>
										</div>
									</td>
								</tr>
							))
						}

					</tbody>
				</table>
			</div>
		</Fragment>
	)
}

export default PCSEnquiries