import { useState, useEffect, useContext, useCallback, useRef } from 'react';
import ProjectView from './project/ProjectView';

import ClipLoader from "react-spinners/ClipLoader";

import { LoadingContext } from '../layout/LoadingProvider';

const API_URL = process.env.REACT_APP_API_URL

function Home() {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState(null);
    const fetchAttempts = useRef(1);

    const { loading, setLoading } = useContext(LoadingContext);

    const loadProjects = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/projects`);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setProjects(data);

        } catch (error) {
            const msg = `Unable to fetch projects (attempt: ${fetchAttempts.current})`
            console.error(msg);
            fetchAttempts.current += 1;
            if (fetchAttempts.current < 3) {
                loadProjects();
                return;
            } else {
                setError("Unable to fetch projects.");
            }
        } finally {
            setLoading(false);
        }
    }, [fetchAttempts, setError, setLoading]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]); // Run when the component mounts

    if (loading) return <ClipLoader
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
    />
    if (error) return (
        <>
            <h2>Error: {error}</h2>
            <p>
                I'm sorry, please try again later.
            </p>
        </>
    )

    if (projects.length === 0) return <p>No projects found</p>

    return (
        <>
            <ProjectView projects={projects} setProjects={setProjects} />
        </>
    )
}

export default Home;