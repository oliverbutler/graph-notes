import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IAppState } from 'redux/reducers';
import { IPage } from 'redux/reducers/pages';
import { Block } from 'types/block';

/**
 * Navbar takes the current page, and works out the path to it
 */
const Navbar = () => {
  const page = useSelector((state: IAppState) =>
    state.pageState.currentPage
      ? state.pageState.pages[state.pageState.currentPage]
      : null
  );

  const [path, setPath] = useState<IPage[]>([]);

  // Every time the page changes, re-calculate the path
  useEffect(() => {
    page && setPath([page]);
  }, [page]);

  return (
    <div id="navbar" className="p-2 flex flex-row ">
      {path.map((block, index) => (
        <p key={`path-${block.id}`} className="mr-1.5">
          {block.emoji} {block.title || 'Untitled'}{' '}
          {index < path.length - 1 && '>'}
        </p>
      ))}
    </div>
  );
};

export default Navbar;
