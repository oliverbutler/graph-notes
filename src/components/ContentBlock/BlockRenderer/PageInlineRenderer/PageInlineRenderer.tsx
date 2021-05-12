import IconRender from 'components/IconRender';
import React from 'react';
import { PageBlock } from 'types/block';

interface Props {
  page: PageBlock;
}

const PageInlineRenderer = ({ page }: Props) => {
  return (
    <div className="flex flex-row cursor-pointer hover:bg-gray-100 select-none">
      <IconRender icon={page.icon} className="ml-1" />
      <p className="underline ml-1">{page.title}</p>
    </div>
  );
};

export default PageInlineRenderer;
