import { useState, useEffect, useContext } from "react";

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

    useEffect(() => {
        setColours(projects[index].colour_scheme);
    }, [index, projects, setColours]);

    return (
        <div id={styles["project-view"]}>
            <Filter setProjects={setProjects} ALL_PROJECTS={ALL_PROJECTS} />
            <ProjectNav setIndex={setIndex} currentIndex={index} projects={projects} />


            <div id={styles["project-card-container"]}>
                {index > 0 && (
                    <ProjectCard 
                        project={projects[index - 1]}  
                        preview={'prev'}
                    />
                )}

                <ProjectCard project={projects[index]} />
                
                {index < projects.length - 1 && (
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