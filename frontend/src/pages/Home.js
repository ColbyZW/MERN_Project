import React, {useEffect, useState} from 'react'

const serverURL = process.env.REACT_APP_SERVER_URL

function Home() {
    const [name, setName] = useState(null)

    useEffect(() => {
        fetch(serverURL + "/user/name")
        .then(response => response.json())
        .then(data => setName(data.name))
    }, [])

  return (
    <div>
      <header>
        Welcome back {name && name}!
      </header>
    </div>
  );
}

export default Home;