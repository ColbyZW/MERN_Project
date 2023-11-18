import React, { useState, useEffect } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import './ProfilePage.css';

const serverURL = process.env.REACT_APP_SERVER_URL;

function ProfilePage() {
    const [profile, setProfile] = useState({ name: '', email: '', bio: '' });
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        // Replace with actual API call to fetch profile data
        fetch(`${serverURL}/profile`)
            .then(response => response.json())
            .then(data => setProfile(data));
    }, []);

    function handleSave() {
        // Save profile data
        // Replace with actual API call to save profile data
        fetch(`${serverURL}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        }).then(() => {
            setEditMode(false);
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
