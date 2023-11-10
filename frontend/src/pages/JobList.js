import React, { useEffect, useState } from "react";
import { Card, Container, Spinner, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./JobList.css"

const serverURL = process.env.REACT_APP_SERVER_URL

function JobList() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
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
            <Container className="text-center">
                <Spinner></Spinner>
                <p>Fetching jobs...</p>
            </Container>
        )
    }

    function jobClick(id) {
        navigate("/home/job/" + id)
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
        <Container fluid>
            {
                loading && renderSpinner()
            }
            {
                !loading && renderJobs(jobs)
            }
        </Container>
    )
}

export default JobList;