import { useState, useContext, useMemo, useEffect } from 'react';

import rfdc from 'rfdc';

import { ColourSchemeContext } from "../../../layout/ColourSchemeContext";

import styles from '../ProjectView.module.css';

export default function useProjectViewControls(projects, setProjects, isMobile) {
    const [skillFilter, setSkillFilter] = useState(null);
    const { setColours } = useContext(ColourSchemeContext);
    const [index, setIndex] = useState(0);
    const [autoScroll, setAutoScroll] = useState(false);

    useEffect(() => {
        if(!autoScroll) setColours(projects[index].colour_scheme)
    }, [index, projects, autoScroll, setColours])

    const viewControls = useMemo(() => ({
        nextProject: () => {
            if (index === projects.length - 1) {
                return;
            }
            let nextIndex = index + 1;
            setIndex(nextIndex);
        },
        prevProject: () => {
            if (index === 0) {
                return;
            }
            let nextIndex = index - 1;
            setIndex(nextIndex);
        },
        scrollToProject: (i) => {
            if (isMobile) {
                setIndex(i);
                return;
            }

            // Cancel if already at specified index
            if (viewControls.getIndex() === i){
                return;
            }
            setAutoScroll(true);
            // Gets the project card container and sets the scroll position to the selected project card
            const cardContainer = document.getElementById(styles['project-card-container']);

            /* 
                Disable scroll snapping while scrolling to the selected project
                This prevents scroll snapping from interfering with the scrollIntoView function
            */
            cardContainer.style.scrollSnapType = 'none'; // Fixes instant scroll glitch - see above comment
            cardContainer.addEventListener('scrollend', () => {
                // Re-enable scroll snapping and set autoScroll to false to enable colour scheme changes
                cardContainer.style.scrollSnapType = 'y mandatory';
                setAutoScroll(false);
            }, { once: true });

            const card = cardContainer.children[i];
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
        setIndex: (i) => {
            setIndex(i);
        },
        getIndex: () => {
            return index;
        },
        setColours: (colourScheme) => {
            setColours(colourScheme)
        }
    }), [index, projects, setAutoScroll, isMobile, setColours]);

    const [ALL_PROJECTS] = useState(() => {
        // Clone the projects array for filtering
        const clone = rfdc();
        return clone(projects);
    }, []);

    /**
     * Apply the filtered projects. No args will clear the filter.
     * @param {Skill} skill 
     * @param filteredProjects 
     */
    const applyFilter = (skill = null, filteredProjects = ALL_PROJECTS) => {
        if (skill !== null) {
            skill = { value: skill.id, label: skill.name }
        }

        // Get the new index of the current project from the filtered array
        // let newIndex = filteredProjects.findIndex((p) => p.id === projects[index].id )

        setSkillFilter(skill);

        // Set index to 0 before updating projects array so index is inbounds
        setIndex(0);
        setProjects(filteredProjects);

        // If the project now at index 0 wasn't the current project, scroll to it
        if (filteredProjects.length !== 1){
            // Set the colour scheme of the project before scrolling to it
            setColours(filteredProjects[0].colour_scheme);
            viewControls.scrollToProject(0);
        } 
    }

    const filterProjectsBySkill = (skill) => {
        /**
         * Filters the projects based on the selected skill
         * @param {Object} skill - Skill object
         */

        if (!skill) {
            applyFilter();
            return
        }

        const filteredProjects = ALL_PROJECTS.filter(project =>
            project.skills.some(projectSkill => projectSkill.id === skill.id)
        );

        if (filteredProjects.length === 0) {
            // If no projects have the selected skill, show all projects
            applyFilter();
            return;
        }

        applyFilter(skill, filteredProjects)
    }

    return { viewControls, filterProjectsBySkill, skillFilter, index };
};