import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, InputGroup, Spinner, Image, Stack } from 'react-bootstrap';
import './ProfilePage.css';

const serverURL = process.env.REACT_APP_SERVER_URL;

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [photo, setPhoto] = useState(null);
    const [fileKey, setFileKey] = useState(0);
    const [newPhoto, setNewPhoto] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    useEffect(() => {
        getProfile()
    }, []);

    function getProfile() {
        fetch(`${serverURL}/user`)
            .then(response => response.json())
            .then(data => {
                setProfile(data)
                setName(data.name)
                if (data.client) {
                    setCompany(data.client.company)
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
                    <Button variant="secondary" onClick={() => setEditMode(!editMode)}>
                        {editMode ? 'Cancel' : 'Edit'}
                    </Button>
                </Card.Header>
                <Card.Body>
                    {editMode ? (
                        <Form>
                            <InputGroup className="mb-3 w-50">
                                <Stack>
                                    <InputGroup.Text>Profile Photo</InputGroup.Text>
                                    <Form.Control key={fileKey} type="file" onChange={handleFileChange} />
                                </Stack>
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Name</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <InputGroup.Text>Email</InputGroup.Text>
                                <Form.Control
                                    type="email"
                                    value={profile.email}
                                    disabled
                                />
                            </InputGroup>
                            <InputGroup className="mb-3">
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
        </Container>
    );
}

export default ProfilePage;
