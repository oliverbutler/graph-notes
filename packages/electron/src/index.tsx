/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import {
  readMarkdownHeader,
  getFileTree,
  getPopulatedFileTree,
} from 'utils/markdown';
import App from './App';

// Connect to DB then launch app
// render(<App />, document.getElementById('root'));

// readMarkdownHeader('./vault/Xeo/🦄 Xeo Architechture.md').then((res) =>
//   console.log(res)
// );

getPopulatedFileTree('./vault/Xeo').then((res) => console.log(res));
