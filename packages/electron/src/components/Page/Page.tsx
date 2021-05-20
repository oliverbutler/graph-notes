import React from 'react';
import IconRender from 'components/IconRender';
import ContentBlockList from 'components/ContentBlock/ContentBlockList';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { IAppState } from 'redux/reducers';

/**
 * Renders a page
 *
 * @param page
 * @returns
 */
const Page = () => {
  const page = useSelector((state: IAppState) =>
    state.pageState.currentPage
      ? state.pageState.pages[state.pageState.currentPage]
      : null
  );

  if (!page) {
    return <h1>Loading Page...</h1>;
  }

  return (
    <div className="page min-h-full flex flex-col">
      <div className="text-7xl mb-6 mt-12 p-2 w-min hover:bg-gray-100 rounded-md cursor-pointer relative select-none">
        <IconRender className="text-7xl" icon={page.emoji} />
      </div>

      <h1
        className={classNames('text-4xl font-bold text-left', {
          'text-gray-300': !page.title,
        })}
      >
        {page.title || 'Untitled'}
      </h1>

      {/* <ContentBlockList blocks={page.children} /> */}
    </div>
  );
};

export default Page;
