import { useState, useEffect, useContext, useCallback, useMemo } from "react";

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";
import Filter from './SkillFilter';

import styles from "./ProjectView.module.css";
import { ColourSchemeContext } from "../../layout/ColourSchemeContext";

import rfdc from 'rfdc';

const ProjectView = ({ projects, setProjects }) => {
    const [index, setIndex] = useState(0)
    const { setColours } = useContext(ColourSchemeContext);

    const [ALL_PROJECTS] = useState(() => {
        // Clone the projects array for filtering
        const clone = rfdc();
        return clone(projects);
    });

    // Determine whether screen is under 768px
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const handleResize = useCallback(() => {
        // Set the isMobile state based on the window width
        setIsMobile(window.innerWidth < 768);
    }, []);

    const viewControls = useMemo(() => ({
        nextProject: () => {
            setIndex((prevIndex) => Math.min(prevIndex + 1, projects.length - 1));
        },
        prevProject: () => {
            setIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        },
        setIndex: (i) => {
            setIndex(i);
        },
        getIndex: () => {
            return index;
        }
    }), [index, setIndex, projects.length]);

    useEffect(() => {
        // Set the colours scheme using context API
        setColours(projects[index].colour_scheme);

        // Event listener for resizing the window
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [index, projects, setColours, handleResize]);

    return (
        <div id={styles["project-view"]}>
            <Filter setProjects={setProjects} ALL_PROJECTS={ALL_PROJECTS} />
            <ProjectNav viewControls={viewControls} projects={projects} />

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