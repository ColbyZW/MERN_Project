import React, { useEffect, useState } from "react";
import { Card, Container, InputGroup, Spinner, Stack, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./JobList.css"

const serverURL = process.env.REACT_APP_SERVER_URL

function JobList() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const navigate = useNavigate()

    function getJobs() {
        fetch(serverURL + "/project")
        .then(res => res.json())
        .then(data => {
            setJobs(data)
            setLoading(false)
        })
    }

    useEffect(() => {
        getJobs()
    }, [])

    function renderSpinner() {
        return (
            <Container fluid className="text-center my-5">
                <Spinner></Spinner>
                <p>Fetching jobs...</p>
            </Container>
        )
    }

    function jobClick(id) {
        navigate("/home/job/" + id)
    }

    function handleSearch(e) {
        setSearch(e.target.value);
        fetch(serverURL + "/project/search?searchString=" + e.target.value)
        .then(res => res.json())
        .then(data => setJobs(data));
    }

    function renderJobs(jobList) {
        return (
            jobList.map(job => (
                <Card key={job._id} onClick={() => jobClick(job._id)} className="my-2 job-card">
                    <Card.Header className="d-flex justify-content-between">
                        <Stack>
                            <h5>{job.name}</h5>
                            <div>{job.pay}</div>
                        </Stack>
                        <div>Posted: {new Date(job.createdAt).toDateString()}</div>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text className="text-truncate">{job.description}</Card.Text>
                    </Card.Body>
                </Card>
            ))
        )
    }

    return (
        <Container fluid className="overflow-auto">
            <div className="w-100">
                <InputGroup>
                    <InputGroup.Text>Search</InputGroup.Text>
                    <Form.Control value={search} onChange={handleSearch}/>
                </InputGroup>
            </div>
            <div className="job-list">
            {
                loading && renderSpinner()
            }
            {
                !loading && renderJobs(jobs)
            }
            </div>
        </Container>
    )
}

export default JobList;