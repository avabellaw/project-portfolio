import { useState, useContext, useMemo, useEffect } from 'react';

import { ColourSchemeContext } from "../../../layout/ColourSchemeContext";

import styles from '../ProjectView.module.css';

export default function useProjectViewControls(filteredProjects, skillFilter, setSkillFilter, isMobile) {
    const { setColours } = useContext(ColourSchemeContext);
    const [index, setIndex] = useState(0);
    const [autoScroll, setAutoScroll] = useState(false);

    useEffect(() => {
        if(!autoScroll) setColours(filteredProjects()[index].colour_scheme)
    }, [index, filteredProjects, autoScroll, setColours, skillFilter])

    const viewControls = useMemo(() => ({
        nextProject: () => {
            if (index === filteredProjects().length - 1) {
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
    }), [index, filteredProjects, setAutoScroll, isMobile, setColours]);

    const filterProjectsBySkill = (skill) => {
        /**
         * Filters the projects based on the selected skill
         * @param {Object} skill - Skill object
         */

        if (skill !== null) {
            skill = { value: skill.id, label: skill.name }
        }

        setSkillFilter(skill);

        // Set index to 0 before updating projects array so index is inbounds
        setIndex(0);

        // Skill filter won't be updated yet so filter manually
        const newlyFilteredArray = filteredProjects(skill);

        // If the project now at index 0 wasn't the current project, scroll to it
        if (newlyFilteredArray.length !== 1){
            // Set the colour scheme of the project before scrolling to it
            setColours(newlyFilteredArray[0].colour_scheme);
            viewControls.scrollToProject(0);
        }
    }

    return { viewControls, filterProjectsBySkill, index };
};