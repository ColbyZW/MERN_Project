import React, {useState} from "react";
import { Card, Stack, Form, Button, InputGroup } from "react-bootstrap";
import Options from "./Options";

const serverURL = process.env.REACT_APP_SERVER_URL;

function JobInfoCard({job, userInfo, handleChange}) {
    let client = userInfo.client ? userInfo.client : {_id: '1'}
    const [editing, setEditing] = useState(false)
    const [title, setTitle] = useState(job.title)
    const [pay, setPay] = useState(job.pay)
    const [jobDesc, setJobDesc] = useState(job.description)

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

    }

    function handleSubmit() {
        const payload = {
            name: title,
            description: jobDesc,
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
        }).then(res => res.json())
        .then((data) => {
            if (data.status !== 400) {
                handleChange()
                setEditing(false)
            }
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
                        <h6>Posted By: {job.client.company}</h6>
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
                </Card.Body>
            </Card>
            }
            {!editing &&
            <Card>
                <Card.Header className="d-flex justify-content-between">
                    <Stack>
                        <h5>{job.title}</h5>
                        <h6>Pay: {job.pay}</h6>
                        <h6>Posted By: {job.client.company}</h6>
                    </Stack>
                    <Stack className="align-items-end">
                        {client._id === job.client._id && 
                            <Options setEdit={setEditing} handleDelete={() => handleDelete()}/>
                        }
                        <h6>Start: {new Date(job.startDate).toDateString()}</h6>
                        <h6>End: {new Date(job.endDate).toDateString()}</h6>
                    </Stack>            
                </Card.Header>
                <Card.Body>
                    <Card.Text>
                        {job.description}
                    </Card.Text>
                </Card.Body>
            </Card>
            }
        </div>
    )
}

export default JobInfoCard;