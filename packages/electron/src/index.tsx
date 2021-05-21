/* eslint-disable no-console */
import React from 'react';
import { render } from 'react-dom';
import { getFileTree, getPopulatedFileTree } from 'utils/markdown';
import App from './App';

getPopulatedFileTree('./vault/Xeo').then((out) => console.log(out));
