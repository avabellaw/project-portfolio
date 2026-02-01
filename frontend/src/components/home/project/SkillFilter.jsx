import { useEffect, useState } from 'react'
import Select from 'react-select'

import styles from './SkillFilter.module.css'
import './ReactSelectOverrides.css'

const Filter = ({ selectedValue, filterProjectsBySkill }) => {
    const API_URL = process.env.REACT_APP_API_URL

    const [skills, setSkills] = useState();
    const [inputValue, setInputValue] = useState('');

    const [menuIsOpen, setMenuIsOpen] = useState(false); // Might use in future

    // CSS colour variables
    const skillSelectedColour = getComputedStyle(document.documentElement).getPropertyValue('--skill-selected-colour');
    const skillBorderColour = getComputedStyle(document.documentElement).getPropertyValue('--skill-filter-border-colour');
    const primaryColour = getComputedStyle(document.documentElement).getPropertyValue('--primary-colour');

    // Overrides the CSS for ReactSelect
    const customStyles = {
        container: (baseStyles, state) => ({
            ...baseStyles,
            border: `2px solid ${state.isFocused ? skillSelectedColour : skillBorderColour}`,
            borderRadius: '10px',
            boxSizing: 'content-box',
            overflow: 'hidden',
        }),
        // List of skills that are suggestions when typing
        menu: (baseStyles, state) => ({
            ...baseStyles,
            position: 'relative',
            margin: '0',
            borderRadius: '0',
        }),
        menuList: (baseStyles, state) => ({
            ...baseStyles,
            paddingBottom: '0'
        }),
        // Skill option in menu
        option: (baseStyles, state) => ({
            ...baseStyles,
            opacity: state.isFocused ? '1' : '0.7',
            backgroundColor: 'transparent',
            borderColor: state.isFocused ? skillSelectedColour : primaryColour,
            borderWidth: state.isFocused ? "4px" : '0',
            borderStyle: 'solid',
            borderRight: 'none',
            borderTop: 'none',
            borderBottom: 'none',
            boxShadow: `inset ${state.isSelected && !state.isFocused ? "4" : "0"}px 0px 0px 0px ${primaryColour}`,
            cursor: state.isFocused && 'pointer'
        }),
        control: (baseStyles, state) => ({
            ...baseStyles,
            opacity: state.isFocused ? '1' : '0.95',
            borderRadius: '0',
            cursor: 'text',
            border: 'none'
        }),
        placeholder: (baseStyles, state) => ({
            ...baseStyles,
            display: 'flex',
            fontSize: '0.9em'
        }),
    }

    const sortedSkills = skills && skills.toSorted((a, b) => {
        const comparison = a.label.localeCompare(b.label)

        // If not same position alphabetically
        if (comparison !== 0) return comparison

        // 
        return a.label.length - b.label.length
    });

    useEffect(() => {
        fetch(`${API_URL}/skills`)
            .then(res => res.json())
            .then(data => {
                let options = data.map((skill) => {
                    return { value: skill.id, label: skill.name }
                })

                setSkills(options)
            })
    }, [API_URL])


    const handleChange = (option, actionMeta) => {
        /**
         * Handles react-select change event
         */
        switch (actionMeta.action) {
            case 'select-option':
                // Skill was selected
                filterProjectsBySkill({ id: option.value, name: option.label });
                break;
            case 'clear':
                // Clear button was clicked
                filterProjectsBySkill(null);
                break;
            default:
                break;
        }
    };

    const formatPlaceholder = () => (
        /**
         * Adds the filter image icon to the placeholder
         */
        <>
            {/* SVG embedded in html for reliability and to set fill colour in CSS */}
            <svg
                height="1.2em" /* sibling span must have same line-height*/
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z" fill="#000000" />
            </svg>

            {/* line-height value must match height of svg */}
            <span
                style={{ lineHeight: "1.2em" }}
            >Filter by skill</span>
        </>
    );

    const handleInputChanged = (input) => {
        /**
         * Checks if the input matches any of the skill labels.
         * If it does, select the option.
         * Otherwise, if not already, reset the selected value and show all projects.
         */
        setInputValue(input);

        let perfectMatch;
        // Matches skills that contain the current input text
        const partialSkillMatches = skills.reduce((matched, skill) => {
            let lSkill = skill.label.toLowerCase();
            let lInput = input.toLowerCase();

            // If atleast partial match
            if (lSkill.includes(lInput)) {
                if (lSkill === lInput) {
                    // Variable for skill that perfectly matches the whole string
                    perfectMatch = skill;
                } else {
                    // List for input that partially matches the string
                    matched.push(skill);
                }
            }

            return matched;
        }, [])

        if (perfectMatch && partialSkillMatches.length === 0) {
            filterProjectsBySkill({ id: perfectMatch.value, name: perfectMatch.label });

            setInputValue('');
            document.querySelector('.skills-filter__input').blur();
        }
    };

    return (
        <div id={styles['skill-filter-container']}>
            <Select
                options={sortedSkills}
                onChange={handleChange}
                placeholder={formatPlaceholder()}
                classNamePrefix="skills-filter"
                isClearable={true}
                onInputChange={handleInputChanged}
                value={selectedValue}
                inputValue={inputValue}
                aria-label='Filter by skill'
                noOptionsMessage={() => 'No skills match'}
                styles={customStyles}
                onMenuOpen={() => setMenuIsOpen(true)}
                onMenuClose={() => setMenuIsOpen(false)}
            />
        </div>
    )
}

export default Filter