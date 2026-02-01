// Credit: Joe Hill on dev.to [https://dev.to/astr0sl0th/create-a-delayed-component-48pp]
import React from 'react';

const DelayedComponent = ({ wait, children }) => {
  const [isShown, setIsShown] = React.useState(false);

  React.useEffect(() => {

    const timer = setTimeout(() => {
      setIsShown(true);
    }, wait);

    return () => clearTimeout(timer);
  }, [wait]);

  return isShown && children;
};

export default DelayedComponent;
