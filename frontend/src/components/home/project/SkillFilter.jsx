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
            <img src="/icons/sort.png" alt="Filter" />
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