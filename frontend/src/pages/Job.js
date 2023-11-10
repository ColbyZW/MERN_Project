import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Stack, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import './Job.css'

const serverURL = process.env.REACT_APP_SERVER_URL;

function Job() {
    const { id } = useParams();
    const [job, setJob] = useState(null)
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState(null)

    function getJobInfo() {
        fetch(serverURL + "/project/" + id)
        .then(res => res.json())
        .then(data => {
            setJob(data)
        })
    }

    useEffect(() => {
        getJobInfo();
    }, [])

    function renderJobCard(job) {
        return (
        <Card>
            <Card.Header className="d-flex justify-content-between">
                <Stack>
                    <h5>{job.title}</h5>
                    <h6>Pay: {job.pay}</h6>
                    <h6>Posted By: {job.client.company}</h6>
                </Stack>
                <Stack className="align-items-end">
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
        )
    }

    function handleFile(e) {
        setFile(e.currentTarget.files[0])
    }

    function handleText(e) {
        setMessage(e.target.value)
    }

    function handleSubmit() {
        if (message === null || message.trim() === "") {
            return;
        }
        const formData = new FormData();
        if (file) {
            formData.append("photo", file)
        }
        formData.append("message", message)
        formData.append("projectId", id)
        fetch(serverURL + "/project/message", {
            method: "POST",
            body: formData
        }).then(res => res.json())
        .then(data => {
            if (data.status === 400) {
                // do something
            }
            setFile(null)
            setMessage("")
            getJobInfo()
        })
    }

    function renderSpinner() {
        return (
            <Container className="text-center">
                <Spinner></Spinner>
                <p>Fetching job info...</p>
            </Container>
        )
    }

    function renderJobMessages(job) {
    return (
            <Card className="mt-3">
                <Card.Body>
                    <Form.Group>
                        <Form.Label>Write a message</Form.Label>
                        <Form.Control value={message} onChange={handleText} as="textarea" rows={3}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control value={file} onChange={handleFile} type="file" size="sm"/>
                    </Form.Group>
                    <Button className="my-1" onClick={handleSubmit} variant="secondary">Submit</Button>
                </Card.Body>
                <Card.Body>
                    {job.projectMessage.messages.map(message => {
                        return (
                        <Card className="my-2">
                            <Card.Header className="d-flex justify-content-between">
                                <div>{message.creator.name}</div>
                                <div>{new Date(message.createdAt).toDateString()} {new Date(message.createdAt).toLocaleTimeString()}</div>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                </Card.Title>
                                <Card.Text>
                                    {message.messageContents}
                                </Card.Text>
                            {message.photos.length > 0 && <Card.Img className="msg-img" variant="bottom" src={message.photos[0].url}/>}
                            </Card.Body>
                        </Card>
                        )
                    })}
                </Card.Body>
            </Card>
        )
    }

    return (
        <Container fluid>
            {!job && renderSpinner()}
            {job && renderJobCard(job)}
            {job && renderJobMessages(job)}
        </Container>
    )
}

export default Job;