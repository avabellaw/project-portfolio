import { useEffect, useState, useRef } from 'react'
import Select from 'react-select'

import styles from './SkillFilter.module.css'
import './SkillFilter.css'

const Filter = ({ ALL_PROJECTS, setProjects }) => {
    const API_URL = process.env.REACT_APP_API_URL

    const [skills, setSkills] = useState();
    const [selectedValue, setSelectedValue] = useState(null);
    const [inputValue, setInputValue] = useState('');


    useEffect(() => {
        fetch(`${API_URL}/skills`)
            .then(res => res.json())
            .then(data => {
                let options = data.map((skill) => {
                    return { value: skill.id, label: skill.name }
                })

                setSkills(options)
            })
    }, [])


    const selectOption = (skillId) => {
        const filteredProjects = ALL_PROJECTS.filter(project =>
            project.skills.some(skill => skill.id === skillId)
        );

        if (filteredProjects.length === 0) {
            // If no projects have the selected skill, show all projects
            setProjects(ALL_PROJECTS);
            setSelectedValue(null);
            return;
        }

        setSelectedValue({ value: skillId, label: skills.find(skill => skill.value === parseInt(skillId)).label });
        setProjects(filteredProjects);
    }

    const handleChange = (option, actionMeta) => {
        /**
         * Handles react-select change event
         */
        switch (actionMeta.action) {
            case 'select-option':
                // Skill was selected
                selectOption(option.value);
                break;
            case 'clear':
                // Clear button was clicked
                setSelectedValue(null);
                setProjects(ALL_PROJECTS);
                break;
            default:
                break;
        }
    };

    const formatPlaceholder = () => (
        /**
         * Adds the filter image icon to the placeholder
         */
        <div id={styles['placeholder']}>
            {/* SVG embedded in html for reliability and to set fill colour in CSS */}
            <svg width="1.1em" height="1.1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z" fill="#000000" />
            </svg>
            <span>Filter by skill</span>
        </div>
    );

    const handleInputChanged = (input) => {
        /**
         * Checks if the input matches any of the skill labels.
         * If it does, select the option.
         * Otherwise, if not already, reset the selected value and show all projects.
         */
        setInputValue(input);
        const matchedSkill = skills.find(skill => skill.label.toLowerCase() === input.toLowerCase());
        if (matchedSkill) {
            selectOption(matchedSkill.value);
            setInputValue('');
            document.querySelector('.skills-filter__input').blur();
        }
    };

    return (
        <div id={styles['skill-filter-container']}>
            <Select
                options={skills}
                onChange={handleChange}
                placeholder={formatPlaceholder()}
                classNamePrefix="skills-filter"
                isClearable={true}
                onInputChange={handleInputChanged}
                value={selectedValue}
                inputValue={inputValue}
            />
        </div>
    )
}

export default Filter