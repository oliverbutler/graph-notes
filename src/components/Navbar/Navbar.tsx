import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IAppState } from 'redux/reducers';
import { Block } from 'types/block';

/**
 * Navbar takes the current page, and works out the path to it
 */
const Navbar = () => {
  const pages = useSelector((state: IAppState) => state.pageState.pages);
  const pageId = useSelector((state: IAppState) => state.pageState.currentPage);

  const [path, setPath] = useState<Block[]>([]);

  // Every time the page changes, re-calculate the path
  useEffect(() => {
    const newPath: Block[] = [];
    let target = pageId;
    let found = false;

    while (!found) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      const currentPage = pages.find((p) => p.id === target);

      if (currentPage) {
        newPath.push(currentPage);
        if (currentPage.parentId) {
          target = currentPage.parentId;
        } else {
          found = true;
        }
      } else {
        found = true;
      }
    }
    setPath(newPath.reverse());
  }, [pageId, pages]);

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
