import { getBlockPath } from 'db';
import React, { useEffect, useState } from 'react';
import { PageBlock } from 'types/block';

type Props = {
  pageBlock: PageBlock;
};

/**
 * Slate Navbar
 */
const Navbar = ({ pageBlock }: Props) => {
  const [path, setPath] = useState<PageBlock[]>([]);

  useEffect(() => {
    const doFunc = async () => {
      const p = await getBlockPath(pageBlock.id);
      setPath(p);
    };
    doFunc();
  }, [pageBlock]);

  return (
    <div id="navbar" className="p-2 flex flex-row ">
      {path.map((block) => (
        <p key={`path-${block.id}`}>
          {block.emoji} {block.title}
        </p>
      ))}
    </div>
  );
};

export default Navbar;
