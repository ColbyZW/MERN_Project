import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Stack, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import './Job.css'
import Options from "../components/Options";
import MessageCard from "../components/MessageCard";
import JobInfoCard from "../components/JobInfoCard";

const serverURL = process.env.REACT_APP_SERVER_URL;

function Job() {
    const [userInfo, setUserInfo] = useState()
    const { id } = useParams();
    const [job, setJob] = useState(null)
    const [file, setFile] = useState(null)
    const [message, setMessage] = useState("")
    const [fileKey, setFileKey] = useState(0)

    function getJobInfo() {
        fetch(serverURL + "/project/" + id)
        .then(res => res.json())
        .then(data => {
            setJob(data)
        })
    }

    function getUserInfo() {
        fetch(serverURL + "/user")
        .then(response => response.json())
        .then(data => {
            if (data.status !== 400) {
                setUserInfo(data)
            }
        })
    }

    useEffect(() => {
        getJobInfo();
        getUserInfo();
    }, [])

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
            setFileKey(key => key+1)
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
                        <Form.Control key={fileKey} onChange={handleFile} type="file" size="sm"/>
                    </Form.Group>
                    <Button className="my-1" onClick={handleSubmit} variant="secondary">Submit</Button>
                </Card.Body>
                <Card.Body>
                    {job.projectMessage.messages.map(message => {
                        return (
                            <MessageCard key={message._id} handleChange={() => getJobInfo()} message={message} userInfo={userInfo}/>
                        )
                    })}
                </Card.Body>
            </Card>
        )
    }

    return (
        <Container fluid>
            {!job && renderSpinner()}
            {job && <JobInfoCard handleChange={() => getJobInfo()} userInfo={userInfo} job={job}/>}
            {job && renderJobMessages(job)}
        </Container>
    )
}

export default Job;