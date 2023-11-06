import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

const serverURL = process.env.REACT_APP_SERVER_URL

function Home() {
    const [name, setName] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch(serverURL + "/user/name")
        .then(response => response.json())
        .then(data => {
          if (data.redirect) {
            navigate(data.redirect)
          } else {
            setName(data.name)
          }
        })
    }, [])

  return (
    <div>
      <header>
        {name && "Welcome back " + name + "!"}
      </header>
    </div>
  );
}

export default Home;