import React from 'react';
import loading from '../assets/loading.svg';

const Loading = () => (
  <div className="spinner">
    <img src={loading} alt="Loading" />
    <span>...</span>
  </div>
);

export default Loading;
