import { useState, useEffect, useContext, useCallback } from "react";

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";
import Filter from './SkillFilter';

import styles from "./ProjectView.module.css";
import { ColourSchemeContext } from "../../layout/ColourSchemeContext";

import rfdc from 'rfdc';

const ProjectView = ({ projects, setProjects }) => {
    const [index, setIndex] = useState(0)
    const { setColours } = useContext(ColourSchemeContext);
    const [ ALL_PROJECTS] = useState(() => {
        const clone = rfdc();
        return clone(projects);
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const handleResize = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        setColours(projects[index].colour_scheme);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [index, projects, setColours, handleResize]);

    return (
        <div id={styles["project-view"]}>
            <Filter setProjects={setProjects} ALL_PROJECTS={ALL_PROJECTS} />
            <ProjectNav setIndex={setIndex} currentIndex={index} projects={projects} />


            <div id={styles["project-card-container"]}>
                {!isMobile && index > 0 && (
                    <ProjectCard 
                        project={projects[index - 1]}  
                        preview={'prev'}
                    />
                )}

                <ProjectCard project={projects[index]} />
                
                {!isMobile && index < projects.length - 1 && (
                    <ProjectCard 
                        project={projects[index + 1]} 
                        preview={'next'}   
                />    
                )}
            </div>
        </div>
    )
}

export default ProjectView;