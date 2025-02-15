import { useState, useEffect, useContext } from 'react';
import ProjectView from './project/ProjectView';

import ClipLoader from "react-spinners/ClipLoader";

import { LoadingContext } from '../layout/LoadingProvider';

const API_URL = process.env.REACT_APP_API_URL

function Home() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);

    const {loading, setLoading} = useContext(LoadingContext);

    useEffect(() => {
        fetch(`${API_URL}/projects`)
            .then(response => response.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []); // Run when the component mounts

    if (loading) return <ClipLoader
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
    if (error) return <p>Error: {error.message}</p>
    if (projects.length === 0) return <p>No projects found</p>

    return (
        <>
            <ProjectView projects={projects} setProjects={setProjects} />
        </>
    )
}

export default Home;