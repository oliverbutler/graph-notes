/* eslint-disable no-console */
import initializeDb from 'database';
import React from 'react';
import { render } from 'react-dom';
import App from './App';

initializeDb();

render(<App />, document.getElementById('root'));
