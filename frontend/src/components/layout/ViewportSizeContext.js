import { useState, useEffect, useCallback, createContext } from 'react';

const ViewportSizeContext = createContext();

function ViewportSizeProvider({ children }) {
    // Determine whether screen is under 768px
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const handleResize = useCallback(() => {
        // Set the isMobile state based on the window width
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        // Event listener for resizing the window
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    // Potential for other viewport size checks
    return <ViewportSizeContext.Provider value={isMobile}>{children}</ViewportSizeContext.Provider>;
}

export {ViewportSizeContext, ViewportSizeProvider}