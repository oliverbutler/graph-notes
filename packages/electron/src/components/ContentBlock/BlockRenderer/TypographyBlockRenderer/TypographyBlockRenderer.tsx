import React, { useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { TypographyBlock } from 'types/block';

const typography = (block: TypographyBlock) => {
  switch (block.variant) {
    case 'h1':
      return 'text-3xl font-bold mt-6';
    case 'h2':
      return 'text-2xl font-bold mt-4';
    case 'h3':
      return 'text-xl font-bold mt-3';
    default:
      return 'text-base';
  }
};

interface Props {
  block: TypographyBlock;
  readonly?: boolean;
}

/**
 * Render an editable TypographyBlock
 */
const TypographyBlockRenderer = ({ block, readonly }: Props) => {
  const [text, setText] = useState(block.content);

  return (
    <ContentEditable
      className={`bg-transparent w-full max-w-full outline-none y-auto text-left break-words ${typography(
        block
      )}`}
      onChange={(e) => setText(e.target.value)}
      contentEditable
      html={text}
      disabled={readonly}
    />
  );
};

TypographyBlockRenderer.defaultProps = {
  readonly: false,
};

export default TypographyBlockRenderer;
