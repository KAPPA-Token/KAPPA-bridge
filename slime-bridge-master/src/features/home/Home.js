import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <div>
            <Link to="/swap">Swap</Link>
            <Link to="/bridge">Bridge</Link>
        </div>
    )
}

export default Home
