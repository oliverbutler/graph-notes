import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { Block, PageBlock } from 'types/block';
import Sidebar from 'components/Sidebar/Sidebar';
import Navbar from 'components/Navbar/Navbar';
import Page from 'components/Page/Page';

const page: PageBlock = {
  id: '1',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  title: 'Page time 🚀',
  icon: {
    emoji: '❤️',
  },
  children: [
    {
      id: '4',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      variant: 'h1',
      content: 'We have big headings',
      parentId: '1',
    },
    {
      id: '2',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      variant: 'p',
      content: 'We have little teeny-tiny paragraphs',
      parentId: '1',
    },
    {
      id: '6',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      variant: 'h2',
      content: 'Want some links?',
      parentId: '1',
    },
    {
      id: '3',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: 'Cats Stuff',
      icon: {
        emoji: '🐈‍⬛',
      },
    },
    {
      id: '5',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: 'Finances',
      icon: {
        emoji: '🤑',
      },
    },
  ],
};

const blocks: Block[] = [page];

const Hello = () => {
  return (
    <div className="w-1/2 mx-auto my-6 min-h-full ">
      <Page page={page} />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div
        id="app"
        className="flex flex-row absolute inset-0 bg-white text-center h-full justify justify-center overflow-hidden"
      >
        <Sidebar blocks={blocks} />
        <div id="page-container" className="flex flex-col flex-grow">
          <Navbar />
          <Switch>
            <div className="overflow-scroll min-h-full">
              <Route path="/" component={Hello} />
            </div>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
