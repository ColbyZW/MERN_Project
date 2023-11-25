import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { Card, Form, Button, Container, InputGroup, Spinner, Image, Stack } from 'react-bootstrap';
import './ProfilePage.css';

const serverURL = process.env.REACT_APP_SERVER_URL;

function ProfilePage() {
    const {id} = useParams()
    const {uid} = useOutletContext()
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [photo, setPhoto] = useState(null);
    const [fileKey, setFileKey] = useState(0);
    const [newPhoto, setNewPhoto] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [client, setClient] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate()

    useEffect(() => {
        fetch(serverURL + "/user/isLoggedIn")
            .then(response => response.json())
            .then(data => {
                if (data.redirect) {
                    navigate(data.redirect)
                }
            })
        getProfile()
        getProjects();
    }, []);

    function getProjects() {
        fetch(`${serverURL}/user/projects/${id}`)
            .then(response => response.json())
            .then(data => {
                setJobs(data)
            })
    }

    function jobClick(id) {
        navigate("/home/job/" + id)
    }

    function getProfile() {
        fetch(`${serverURL}/user/${id}`)
            .then(response => response.json())
            .then(data => {
                setProfile(data)
                setName(data.name)
                if (data.client) {
                    setCompany(data.client.company)
                    setClient(true)
                } else {
                    setCompany(data.lancer.company)
                }
                setPhoto(data.photo.url)
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }

    function handleFileChange(event) {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            setNewPhoto(event.currentTarget.files[0])
        }
    }

    function handleSave() {
        const formData = new FormData();
        if (newPhoto) {
            formData.append('photo', newPhoto);
        }
        if (!name.trim().length || !company.trim().length) {
            setErrMsg("Please don't leave any fields blank");
            setErr(true);
            return;
        }
        formData.append('name', name);
        formData.append('company', company);

        fetch(`${serverURL}/user`, {
            method: 'POST',
            body: formData,
        })
        .then(() => {
            setEditMode(false);
            setFileKey(key => key+1);
            getProfile()
        })
        .catch(error => {
            console.error('Error saving profile:', error);
        });
    }

    function renderProfileCard() {
        return (
            <Card>
                <Card.Header className="d-flex justify-content-between">
                    <h2>{name}'s Profile</h2>
                    {uid === profile._id &&
                        <Button variant="secondary" onClick={() => setEditMode(!editMode)}>
                            {editMode ? 'Cancel' : 'Edit'}
                        </Button>
                    }
                </Card.Header>
                <Card.Body>
                    {editMode ? (
                        <Form>
                            <InputGroup className="mb-3 w-50">
                                <Stack>
                                    <Form.Group>
                                        <Form.Label><h5>Profile Picture</h5></Form.Label>
                                        <Form.Control key={fileKey} type="file" onChange={handleFileChange} />
                                    </Form.Group>
                                </Stack>
                            </InputGroup>
                            <InputGroup className="mb-3 w-50">
                                <InputGroup.Text>Name</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3 w-50">
                                <InputGroup.Text>Email</InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    value={profile.email}
                                    disabled
                                />
                            </InputGroup>
                            <InputGroup className="mb-3 w-50">
                                <InputGroup.Text>Company Name</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={company}
                                    onChange={e => setCompany(e.target.value)}
                                />
                            </InputGroup>
                            <Button variant="primary" onClick={handleSave}>Save</Button>
                            {err && <p className="text-danger">{errMsg}</p>}
                        </Form>
                    ) : (
                        <Card.Text className="d-flex flex-column flex-md-row">
                            <Image className="profile my-2 mx-5" src={photo} roundedCircle/>
                            <Stack>
                                <p><strong>Name:</strong> {name}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Company:</strong> {company}</p>
                            </Stack>
                        </Card.Text>
                    )}
                </Card.Body>
            </Card>

        )
    }

    function renderJobs() {
        return (
            <Container className="my-4" fluid>
                <Card>
                    {client && 
                    <Card.Body>
                        <h4>{uid === profile._id ? "Your": name + "'s"} Current Job Postings</h4>
                            {jobs.map((job, i) => (
                            <Card key={job._id} onClick={() => jobClick(job._id)} className="my-2 job-card">
                                    <Card.Header className="d-flex justify-content-between">
                                        <Stack>
                                            <h5>{job.name}</h5>
                                            <div>{job.pay}</div>
                                            <div>Assigned to: {job.lancer ? job.lancer.company : "No one!"}</div>
                                        </Stack>
                                        <div>Posted: {new Date(job.createdAt).toDateString()}</div>
                                    </Card.Header>
                                </Card>
                            ))}
                    </Card.Body>
                    }
                    {!client &&
                    <Card.Body>
                        <h4>{uid === profile._id ? "Your": name + "'s"} Currently Assigned Jobs</h4>
                            {jobs.map((job, i) => (
                            <Card key={job._id} onClick={() => jobClick(job._id)} className="my-2 job-card">
                                    <Card.Header className="d-flex justify-content-between">
                                        <Stack>
                                            <h5>{job.name}</h5>
                                            <div>{job.pay}</div>
                                        </Stack>
                                        <div>Posted: {new Date(job.createdAt).toDateString()}</div>
                                    </Card.Header>
                                </Card>
                            ))}
                    </Card.Body>
                    }
                </Card>
            </Container>
        )
    }

    function renderSpinner() {
        return (
            <Container className="text-center my-5">
                <Spinner></Spinner>
                <p>Fetching profile info...</p>
            </Container>
        )
    }

    return (
        <Container fluid>
            {!profile && renderSpinner()}
            {profile && renderProfileCard()}
            {profile && jobs && renderJobs()}
        </Container>
    );
}

export default ProfilePage;
