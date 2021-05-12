import React from 'react';
import { Block, isPageBlock, isTypographyBlock } from 'types/block';
import PageInlineRenderer from './PageInlineRenderer/PageInlineRenderer';
import TypographyBlockRenderer from './TypographyBlockRenderer/TypographyBlockRenderer';

interface Props {
  block: Block;
}

/**
 * Takes a ContentBlock and displays the appropriate type of Block
 */
const BlockRenderer = ({ block }: Props) => {
  if (isTypographyBlock(block)) {
    return <TypographyBlockRenderer block={block} />;
  }
  if (isPageBlock(block)) {
    return <PageInlineRenderer page={block} />;
  }
  return <p>Unknown Block Type</p>;
};

export default BlockRenderer;
