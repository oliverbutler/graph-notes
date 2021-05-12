import IconRender from 'components/IconRender';
import Resize from 'components/Resize';
import React from 'react';
import { Block, isPageBlock } from 'types/block';

type RecursivePageProps = {
  blocks: Block[];
};

const RecursivePage = ({ blocks }: RecursivePageProps) => {
  return (
    <div key="sidebar-block-group">
      {blocks.map((page) => {
        if (isPageBlock(page)) {
          return (
            <div className="ml-3" key={`sidebar-block-${page.id}`}>
              <div className="flex flex-row">
                <IconRender icon={page.icon} className="mr-1" /> {page.title}
              </div>
              {page.children && <RecursivePage blocks={page.children} />}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

type SidebarProps = {
  blocks: Block[];
};

const Sidebar = ({ blocks }: SidebarProps) => {
  return (
    <Resize
      defaultWindowWidth={192}
      minWindowWidth={150}
      dragHandleWidth={4}
      className="bg-gray-100"
      dragHandleClassName="bg-gray-200"
    >
      <RecursivePage blocks={blocks} />
    </Resize>
  );
};

export default Sidebar;
