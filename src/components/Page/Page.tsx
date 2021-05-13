import React from 'react';
import { PageBlock } from 'types/block';
import IconRender from 'components/IconRender';
import ContentBlockList from 'components/ContentBlock/ContentBlockList';

type Props = {
  page: PageBlock;
};

/**
 * Renders a page
 *
 * @param page
 * @returns
 */
const Page = ({ page }: Props) => {
  return (
    <div className="page min-h-full flex flex-col">
      <div className="text-7xl mb-6 mt-12 p-2 w-min hover:bg-gray-100 rounded-md cursor-pointer relative select-none">
        <IconRender icon={{ emoji: page.emoji }} />
      </div>

      <h1 className="text-4xl font-bold text-left">{page.title}</h1>
      <ContentBlockList blocks={page.children} />
    </div>
  );
};

export default Page;
