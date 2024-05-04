import React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-promise-loader';
import LoaderText from './loaderText';

const LoadingIndicator = () => {
  const { promiseInProgress } = usePromiseTracker();

  return (
    <div>
      <Loader
        promiseInProgress={promiseInProgress}
        color="#000" // Customize loader color
      />
      {promiseInProgress && <LoaderText />}
    </div>
  );
};

export default LoadingIndicator;