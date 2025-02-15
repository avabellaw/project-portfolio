import { useState, useEffect, useContext, useCallback, useMemo } from "react";

import ProjectCard from "./card-components/ProjectCard";
import ProjectNav from "./card-components/ProjectNav";
import Filter from './SkillFilter';

import styles from "./ProjectView.module.css";
import { ColourSchemeContext } from "../../layout/ColourSchemeContext";

import rfdc from 'rfdc';

import { motion } from "motion/react";

const ProjectView = ({ projects, setProjects }) => {
    const { setColours } = useContext(ColourSchemeContext);

    const [scrollY, setScrollY] = useState(0);

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
            setScrollY((prevScroll) => Math.min(prevScroll + 1, projects.length - 1));
        },
        prevProject: () => {
            setScrollY((prevScroll) => Math.max(prevScroll - 1, 0));
        },
        setIndex: (i) => {
            setScrollY(i);
        },
        getIndex: () => {
            return scrollY;
        }
    }), [projects.length, setScrollY, scrollY]);

    useEffect(() => {
        // Set the colours scheme using context API
        setColours(projects[scrollY].colour_scheme);

        // Event listener for resizing the window
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [scrollY, projects, setColours, handleResize]);

    const cardVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    };

    return (
        <div id={styles["project-view"]}>
            <Filter setProjects={setProjects} ALL_PROJECTS={ALL_PROJECTS} />
            <ProjectNav viewControls={viewControls} projects={projects} />

            <div id={styles["project-card-container"]}>
                
                {projects.map((project) => (
                    <ProjectCard project={project} />
                ))}

            </div>
        </div>
    )
}

export default ProjectView;