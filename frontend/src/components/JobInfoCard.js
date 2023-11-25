import React, {useState} from "react";
import { Card, Stack, Form, Button, InputGroup } from "react-bootstrap";
import Options from "./Options";
import { useNavigate, useParams, Link } from "react-router-dom";
import './JobInfoCard.css'

const serverURL = process.env.REACT_APP_SERVER_URL;

function JobInfoCard({job, userInfo, handleChange}) {
    const client = userInfo.client ? userInfo.client : {_id: '0'}
    const lancer = userInfo.lancer ? userInfo.lancer : {_id: '0'}
    const { id } = useParams();
    const [editing, setEditing] = useState(false)
    const [title, setTitle] = useState(job.title)
    const [pay, setPay] = useState(job.pay)
    const [jobDesc, setJobDesc] = useState(job.description)
    const navigate = useNavigate()
    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const [alreadyAssigned, setAlreadyAssigned] = useState(false)

    function handleTitle(e) {
        setTitle(e.target.value)
    }

    function handlePay(e) {
        setPay(e.target.value)
    }

    function handleJobDesc(e) {
        setJobDesc(e.target.value)
    }

    function handleDelete() {
        fetch(serverURL + "/project/" + job._id, {method: "DELETE"})
        .then(res => {
            if (res.status !== 200) {
                setErr(true)
                setErrMsg("We encountered an error deleting your post")
                return false
            }
            return res.json()
        })
        .then((data) => {
            if (!data) return;
            navigate("/home")
        })
    }

    function assignLancer() {
        const payload = {
            projectId: id
        }
        fetch(serverURL + "/project/assign", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => {
            if (res.status === 500) {
                setAlreadyAssigned(true)
            } else {
                handleChange()
            }
        })
    }

    function unassignLancer() {
        const payload = {
            projectId: id
        }
        fetch(serverURL + "/project/unassign", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }).then(res => {
            handleChange()
        })
    }

    function handleSubmit() {
        if (title.trim() === "" || jobDesc.trim() === "" || pay.trim() === "") {
            setErr(true)
            setErrMsg("Make sure there are no blank fields");
            return
        }
        const payload = {
            name: title.trim(),
            description: jobDesc.trim(),
            pay: pay,
            startDate: job.startDate,
            endDate: job.endDate,
            projectId: job._id
        }
        fetch(serverURL + "/project/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.status !== 200) {
                setErr(true)
                setErrMsg("We encountered an error submitting your post")
                return false
            }
            return res.json()
        })
        .then((data) => {
            if (!data) return;
            handleChange()
            setEditing(false)
            setErr(false)
        })
    }

    return (
        <div>
            {editing && 
             <Card>
                <Card.Header className="d-flex justify-content-between">
                    <Stack gap={2}>
                        <InputGroup>
                            <InputGroup.Text>Title</InputGroup.Text>
                            <Form.Control type="text" value={title} onChange={handleTitle}/>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text>Pay</InputGroup.Text>
                            <Form.Control type="text" value={pay} onChange={handlePay}/>
                        </InputGroup>
                        <h6>Posted By: {job.client && job.client.company}</h6>
                    </Stack>
                    <Stack className="align-items-end">
                        <h6>Start: {new Date(job.startDate).toDateString()}</h6>
                        <h6>End: {new Date(job.endDate).toDateString()}</h6>
                    </Stack>            
                </Card.Header>
                <Card.Body>
                <Form.Group>
                    <Form.Label>Edit job description</Form.Label>
                    <Form.Control value={jobDesc} onChange={handleJobDesc} as="textarea" rows={3}></Form.Control>
                    <Button variant="secondary" onClick={handleSubmit}>Finish</Button>
                </Form.Group>
                {err && <p className="text-danger">{errMsg}</p>}
                </Card.Body>
            </Card>
            }
            {!editing &&
            <Card>
                <Card.Header className="d-flex justify-content-between">
                    <Stack>
                        <h5>{job.title}</h5>
                        <h6>Pay: {job.pay}</h6>
                        <h6>Posted By: <Link to={"/home/profile/" + job.client._id}>{job.client.company}</Link></h6>
                        <h6>
                            Currently Assigned to: 
                            {job.lancer ? <Link to={"/home/profile/" + job.lancer._id}>{job.lancer.company}</Link> : "No one!"}
                        </h6>
                    </Stack>
                    <Stack className="align-items-end">
                        {client && client._id === job.client._id && 
                            <Options setEdit={setEditing} handleDelete={() => handleDelete()}/>
                        }
                        <h6>Start: {new Date(job.startDate).toDateString()}</h6>
                        <h6>End: {new Date(job.endDate).toDateString()}</h6>
                        {client && client._id === "0" && !job.lancer && 
                            <Button className="align-self-end" onClick={assignLancer}>Assign Yourself</Button>
                        }
                        {job.lancer && job.lancer._id === lancer._id &&
                            <Button className="align-self-end" onClick={unassignLancer}>Unassign Yourself</Button>
                        }
                        {alreadyAssigned && <p className="text-danger">This job has already been taken</p>}
                    </Stack>            
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        <p style={{whiteSpace: "pre-line"}}>
                            {job.description}
                        </p>
                    </Card.Text>
                </Card.Body>
            </Card>
            }
        </div>
    )
}

export default JobInfoCard;