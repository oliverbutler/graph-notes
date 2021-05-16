import React from 'react';

interface Props {
  icon?: string;
  className?: string;
}

const IconRender = ({ icon, className }: Props) => {
  if (!icon) return null;
  return <div className={className || ''}>{icon}</div>;
};

IconRender.defaultProps = {
  icon: '',
  className: '',
};

export default IconRender;
