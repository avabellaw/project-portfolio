import { useState, useEffect, useCallback, createContext } from 'react';

const ViewportSizeContext = createContext();

function ViewportSizeProvider({ children }) {
    const getIsMobile = useCallback(() => window.innerWidth < 768, []);
    const getIsMedium = useCallback(() => window.innerWidth > 768 && window.innerWidth < 1200, []);
    const getIsFullLayout = useCallback(() => !getIsMobile() && !getIsMedium(), [getIsMobile, getIsMedium]);


    // Determine whether screen is under 768px
    const [isMobile, setIsMobile] = useState(getIsMobile());
    const [isMedium, setIsMedium] = useState(getIsMedium());
    const [isFullLayout, setIsFullLayout] = useState(getIsFullLayout());

    const handleResize = useCallback(() => {
        // Set states based on the window width
        setIsMobile(getIsMobile());
        setIsMedium(getIsMedium());
        setIsFullLayout(getIsFullLayout());
    }, [getIsMobile, getIsMedium, getIsFullLayout]);

    useEffect(() => {
        // Event listener for resizing the window
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    // Potential for other viewport size checks
    return <ViewportSizeContext.Provider value={{ isMobile, isMedium, isFullLayout }}>{children}</ViewportSizeContext.Provider>;
}

export { ViewportSizeContext, ViewportSizeProvider }