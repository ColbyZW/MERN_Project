import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import './Job.css'
import MessageCard from "../components/MessageCard";
import JobInfoCard from "../components/JobInfoCard";

const serverURL = process.env.REACT_APP_SERVER_URL;

function Job() {
    const [userInfo, setUserInfo] = useState()
    const { id } = useParams();
    const [job, setJob] = useState(null)
    const [file, setFile] = useState("")
    const [message, setMessage] = useState("")
    const [fileKey, setFileKey] = useState(0)
    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")
    const navigate = useNavigate()

    function getJobInfo() {
        fetch(serverURL + "/project/" + id)
        .then(res => {
            if (res.status === 400) {
               navigate("/home") 
               return
            }
            return res.json()
        })
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
            setErr(true)
            setErrMsg("No blank messages, please")
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
        }).then(res => {
            if (res.status !== 200) {
                setErr(true)
                setErrMsg("We encountered an issue adding your message")
                return false;
            }
            return res.json()
        })
        .then(data => {
            if (!data) return;
            setFile(null)
            setFileKey(key => key+1)
            setMessage("")
            getJobInfo()
            setErr(false)
        })
    }

    function renderSpinner() {
        return (
            <Container className="text-center my-5">
                <Spinner></Spinner>
                <p>Fetching job info...</p>
            </Container>
        )
    }

    function renderJobMessages(job) {
    return (
            <Card className="mt-3">
                <Card.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Write a message</Form.Label>
                        <Form.Control value={message} onChange={handleText} as="textarea" rows={3}></Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control className="w-25" key={fileKey} onChange={handleFile} type="file" size="sm"/>
                    </Form.Group>
                    <Button className="my-1" onClick={handleSubmit} variant="secondary">Submit</Button>
                    {err && <p className="text-danger">{errMsg}</p>}
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