import { useState } from "react";

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";

const ProjectView = ({ projects }) => {
    const [index, setIndex] = useState(0)

    const nextProject = () => {
        setIndex(index + 1);
    }

    const previousProject = () => {
        setIndex(index - 1);
    }

    return (
        <>
            <ProjectNav setIndex={setIndex} currentIndex={index} projectCount={projects.length} />

            
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
        </>
    )
}

export default ProjectView;