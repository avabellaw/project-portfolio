import { createContext, useState } from 'react';

const ColourSchemeContext = createContext();

const ColourSchemeProvider = ({ children }) => {
    const [colours, setColours] = useState({
        primary_colour: 'white',
        secondary_colour: 'gray',
        text_colour: 'black',
        highlight_colour: 'gold'
    });

    return <ColourSchemeContext.Provider value={{ colours, setColours }}>{children}</ColourSchemeContext.Provider>;
};

export { ColourSchemeContext, ColourSchemeProvider };