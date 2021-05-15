import React from 'react';
import { Plus } from 'react-feather';

type Props = {
  icon?: string;
  text?: string;
  onClick: any;
};

const IconButton = ({ icon, text, onClick }: Props) => {
  return (
    <button
      className="icon-button flex flex-row hover:bg-gray-200 px-1 m-0.5 rounded-md focus:outline-none"
      onClick={onClick}
      type="button"
    >
      <Plus />
      <p>{text}</p>
    </button>
  );
};

IconButton.defaultProps = {
  icon: '',
  text: '',
};

export default IconButton;
