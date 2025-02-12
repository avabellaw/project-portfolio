import { useState, useEffect, useContext } from "react";

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";
import Filter from './SkillFilter';

import styles from "./ProjectView.module.css";
import { ColourSchemeContext } from "../../layout/ColourSchemeContext";

const ProjectView = ({ projects }) => {
    const [index, setIndex] = useState(0)
    const { setColours } = useContext(ColourSchemeContext);

    useEffect(() => {
        setColours(projects[index].colour_scheme);
    }, [index, projects, setColours]);

    return (
        <div id={styles["project-view"]}>
            <Filter />
            <ProjectNav setIndex={setIndex} currentIndex={index} projects={projects} />


            <>
                {/* {index > 0 && (
                    <ProjectCard 
                        project={projects[index - 1]}  
                    />
                )} */}

                <ProjectCard project={projects[index]} />
                {/* 
                {index < projects.length - 1 && (
                    <ProjectCard 
                        project={projects[index + 1]}    
                />    
                )} */}
            </>
        </div>
    )
}

export default ProjectView;