import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import './ProfilePage.css';

const serverURL = process.env.REACT_APP_SERVER_URL;

function ProfilePage() {
    const [profile, setProfile] = useState({ photo: '', name: '', email: '', bio: '' });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        fetch(`${serverURL}/profile`)
            .then(response => response.json())
            .then(data => setProfile(data))
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }, []);

    function handleFileChange(event) {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setProfile({ ...profile, photo: file });
        }
    }

    function handleSave() {
        const formData = new FormData();
        formData.append('photo', profile.photo);
        formData.append('name', profile.name);
        formData.append('email', profile.email);
        formData.append('bio', profile.bio);

        fetch(`${serverURL}/profile`, {
            method: 'POST',
            body: formData,
        })
        .then(() => {
            setEditMode(false);
        })
        .catch(error => {
            console.error('Error saving profile:', error);
        });
    }

    return (
        <Card>
            <Card.Header>
                <h2>Profile Page</h2>
                <Button variant="secondary" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Cancel' : 'Edit'}
                </Button>
            </Card.Header>
            <Card.Body>
                {editMode ? (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Profile Photo</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={profile.name}
                                onChange={e => setProfile({ ...profile, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={profile.bio}
                                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                    </Form>
                ) : (
                    <div>
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Bio:</strong> {profile.bio}</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default ProfilePage;
