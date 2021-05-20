/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import { getFileTree, getPopulatedFileTree } from 'utils/markdown';
import App from './App';

getPopulatedFileTree('./vault/Xeo').then((res) => console.log(res));

// Connect to DB then launch app
// render(<App />, document.getElementById('root'));
