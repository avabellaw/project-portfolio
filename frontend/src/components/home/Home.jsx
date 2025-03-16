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

    const projectImgPreloaded = useRef({})
        
    const preloadProjectImage = (prefetch, project) => {
        const link = document.createElement('link');
        link.rel = prefetch ? 'prefetch': 'preload';
        link.as = 'image';
        link.href = project.image_url;
        document.head.appendChild(link);
    }

    const loadProjects = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/projects`);

            const data = await response.json();

            // If error in response, throw error to be caught by catch block
            if (!response.ok) {
                throw new Error(data.message);
            }
            
            for (let i = 0; i < data.length; i++) {
                let project = data[i]
                let isPreloaded = projectImgPreloaded[project.id]
                if (isPreloaded) continue;

                preloadProjectImage(i >= 2, project)
                projectImgPreloaded[project.id] = true
            }

            setProjects(data);
            setLoading(false);
        } catch (error) {
            // If fetch fails, try again up to 3 times
            const msg = `Unable to fetch projects (attempt: ${fetchAttempts.current})`
            console.error(msg);
            fetchAttempts.current += 1;
            if (fetchAttempts.current < 3) {
                loadProjects();
            } else {
                // After final attempt, set error state
                setError("Unable to fetch projects.");
                setLoading(false);
            }
        } 
    }, [fetchAttempts, setError, setLoading]);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]); // Run when the component mounts

    if (loading) return <ClipLoader
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"/>

    else if (error) return (
        <>
            <h2>Error: {error}</h2>
            <p>
                I'm sorry, please try again later.
            </p>
        </>
    )
    
    else if (projects.length === 0) return <p>No projects found</p>

    return (
        <>
            <ProjectView projects={projects} setProjects={setProjects} />
        </>
    )
}

export default Home;