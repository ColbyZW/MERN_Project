import React, {useEffect, useState} from "react";
import DatePicker from 'react-datepicker';
import { Card, Stack, InputGroup, Form, Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

const serverURL = process.env.REACT_APP_SERVER_URL;

function CreateJob() {
    const [title, setTitle] = useState("")
    const [pay, setPay] = useState("")
    const [start, setStart] = useState(Date.now())
    const [end, setEnd] = useState(Date.now())
    const [jobDesc, setJobDesc] = useState("")
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("")
    const [userInfo, setUserInfo] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        getUserInfo();
    }, [])

    function getUserInfo() {
        fetch(serverURL + "/user")
        .then(response => response.json())
        .then(data => {
            if (data.status !== 400) {
                setUserInfo(data)
            }
        })
    }

    function handleSubmit() {
        if (title.trim() === "" || pay.trim() === "" || jobDesc.trim() === "") {
            setErr(true)
            setErrMsg("Please fill out all of the fields")
            return;
        }
        if (end < start) {
            setErr(true)
            setErrMsg("Start date has to be before the end date")
            return;
        }

        const payload = {
            title: title,
            description: jobDesc,
            pay: pay,
            startDate: start,
            endDate: end
        }

        fetch(serverURL + "/project", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.status !== 200) {
                setErr(true)
                setErrMsg("We encountered an error making your post");
                return false;
            }
            return res.json()
        })
        .then(data => {
            if (!data) return;
            navigate("/home/job/" + data.postId)
        })
    }
    
    function renderClientCard() {
        return (
            <Card className="m-3">
                <Card.Header className="d-flex justify-content-between">
                    <Stack gap={2}>
                        <h6>Find a Lancer to assist with your project!</h6>
                        <InputGroup>
                            <InputGroup.Text>Title</InputGroup.Text>
                            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Text>Pay</InputGroup.Text>
                            <Form.Control type="text" value={pay} onChange={(e) => setPay(e.target.value)}/>
                        </InputGroup>
                    </Stack>
                    <Stack className="align-items-end">
                        <h6>Start Date: <DatePicker selected={start} onChange={(date) => setStart(date)}/></h6>
                        <h6>End Date: <DatePicker selected={end} onChange={(date) => setEnd(date)}/></h6>
                    </Stack>            
                </Card.Header>
                <Card.Body>
                <Form.Group>
                    <Form.Label>Job Description</Form.Label>
                    <Form.Control value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} as="textarea" rows={3}></Form.Control>
                    <Button className="my-2" variant="secondary" onClick={handleSubmit}>Finish</Button>
                </Form.Group>
                {err && <p className="text-danger">{errMsg}</p>}
                </Card.Body>
            </Card>
        )
    }

    function renderSpinner() {
        return (
            <Container className="text-center my-5">
                <Spinner></Spinner>
                <p>Fetching job info...</p>
            </Container>
        )
    }

    function renderLancerInfo() {
        return (
            <Card className="m-3">
                <Card.Header>
                    <h6>Sorry, only Client accounts are allowed to make posts!</h6>
                    <h6>Head over to the Job Board to find a job to take!</h6>
                </Card.Header>
            </Card>
        )
    }

    return (
        <div>
            {!userInfo && renderSpinner()}
            {userInfo && userInfo.client && renderClientCard()}
            {userInfo && userInfo.lancer && renderLancerInfo()}
        </div>
    )
}

export default CreateJob;