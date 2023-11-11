import React, {useState} from "react";
import { Card, Stack, Form, Button } from "react-bootstrap";
import Options from "./Options";

const serverURL = process.env.REACT_APP_SERVER_URL;
function MessageCard({message, userInfo, handleChange}) {
    const [editing, setEditing] = useState(false)
    const [messageContents, setMessageContents] = useState(message.messageContents)
    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")

    function handleText(e) {
        setMessageContents(e.target.value)
    }

    function handleSubmit() {
        if (messageContents.trim() === "") {
            setErr(true)
            setErrMsg("No blank messages, please")
            return;
        }
        const payload = {message: messageContents, id: message._id}
        fetch(serverURL + '/project/message', {
            method: "PUT",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => {
            if (res.status !== 200) {
                setErr(true)
                setErrMsg("We encountered an error submitting your message")
                return false
            }
            res.json()
        })
        .then((data) => {
            if (!data) return;
            setEditing(false)
            handleChange()
            setErr(false)
        })
    }

    function handleDelete() {
        fetch(serverURL + "/project/message/" + message._id, {method: "DELETE"})
        .then(res => {
            if (res.status === 400) {
                setErr(true)
                setErrMsg("We encountered an error deleting your message")
                return false
            }
            return res.json()
        })
        .then((data) => {
            if (!data) return;
            handleChange()
        })
    }

    return (
        <Card className="my-2">
            <Card.Header className="d-flex justify-content-between">
                <Stack>
                    <div>{message.creator.name}</div>
                    <div style={{fontSize: '0.8em'}}>{new Date(message.createdAt).toDateString()} at {new Date(message.createdAt).toLocaleTimeString()}</div>
                </Stack>
                <Stack className="align-items-end">
                        {userInfo._id === message.creator._id && <Options setEdit={setEditing} handleDelete={() => handleDelete()}/>}
                </Stack>
            </Card.Header>
            <Card.Body>
                {editing && 
                <div>
                    <Form.Group>
                        <Form.Label>Write a message</Form.Label>
                        <Form.Control value={messageContents} onChange={handleText} as="textarea" rows={3}></Form.Control>
                        <Button variant="secondary" onClick={handleSubmit}>Finish</Button>
                    </Form.Group>
                    {err && <p className="text-danger">{errMsg}</p>}
                </div>
                }
                {!editing && 
                    <Card.Text>
                        {message.messageContents}
                    </Card.Text>
                }
            {message.photos.length > 0 && <Card.Img className="msg-img" variant="bottom" src={message.photos[0].url}/>}
            </Card.Body>
        </Card>
    )
}

export default MessageCard;