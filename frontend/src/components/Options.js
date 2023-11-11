import React from "react"
import { Dropdown, DropdownButton, ButtonGroup } from "react-bootstrap";
import './Options.css'

function Options({setEdit, handleDelete}) {

    return (
        <DropdownButton 
            as={ButtonGroup}
            size="sm"
            variant="secondary"
            title="..."
        >
            <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
            <Dropdown.Item onClick={() => setEdit(true)}>Edit</Dropdown.Item>
        </DropdownButton>
    )
}

export default Options;