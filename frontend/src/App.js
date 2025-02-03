import './App.css';
import React, { useState, useEffect } from 'react';

function App() {
    const [data, setData] = useState("");

    useEffect(() => {
        fetch("/hello")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                console.log(data.message);
            })    
    }, []);

    return (
        <div>
            <h1>React App</h1>
            <p>{data.message}</p>
        </div>
    );
}

export default App;
