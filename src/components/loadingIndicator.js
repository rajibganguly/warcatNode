import React from 'react';
import LoaderText from './loaderText';

const LoadingIndicator = ({isLoading}) => {
  return (
    <>
      {isLoading && <LoaderText />}
    </>
    
  );
};

export default LoadingIndicator;
