import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.global.css';
import { Block, PageBlock } from 'types/block';
import Sidebar from 'components/Sidebar/Sidebar';
import Navbar from 'components/Navbar/Navbar';
import Page from 'components/Page/Page';

// const Hello = () => {
//   return (

//   );
// };

export default function App() {
  const [rootBlocks, setRootBlocks] = useState<PageBlock[]>([]);

  return (
    <Router>
      <div
        id="app"
        className="flex flex-row absolute inset-0 bg-white text-center h-full justify justify-center overflow-hidden"
      >
        <Sidebar blocks={rootBlocks} />
        <div id="page-container" className="flex flex-col flex-grow">
          {rootBlocks[0] && <Navbar pageBlock={rootBlocks[0]} />}
          <Switch>
            <div className="overflow-scroll min-h-full">
              <div className="w-1/2 mx-auto my-6 min-h-full ">
                {rootBlocks[0] && <Page page={rootBlocks[0]} />}
              </div>
            </div>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
