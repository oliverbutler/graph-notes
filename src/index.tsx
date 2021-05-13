/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import { initDb } from 'db';
import App from './App';

// Connect to DB then launch app
initDb()
  .then(() => render(<App />, document.getElementById('root')))
  .catch((err) => {
    console.error(err);
  });
