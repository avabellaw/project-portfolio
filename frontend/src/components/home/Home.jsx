import { useState, useEffect } from 'react';
import Filter from './SkillFilter';
import ProjectView from './project/ProjectView';

const API_URL = process.env.REACT_APP_API_URL

function Home(){
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


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

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>
    if (projects.length === 0) return <p>No projects found</p>

    return (
        <>
            <Filter />
            <ProjectView projects={projects}/>
        </>
    )
}

export default Home;