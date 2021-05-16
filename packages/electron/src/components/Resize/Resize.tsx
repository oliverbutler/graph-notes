import classNames from 'classnames';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useEffect } from 'react';

// For left hand side resizeable https://codesandbox.io/s/icy-architecture-1qtbz?file=/src/index.tsx

interface Props {
  defaultWindowWidth: number;
  minWindowWidth?: number;
  maxWindowWidth?: number;
  dragHandleWidth: number;
  children: JSX.Element;
  className?: string;
  dragHandleClassName?: string;
  onSetWidth?: (num: number) => void;
}

const Resize = ({
  children,
  defaultWindowWidth,
  minWindowWidth,
  maxWindowWidth,
  dragHandleWidth,
  className,
  dragHandleClassName,
  onSetWidth,
}: Props) => {
  const x = useMotionValue(defaultWindowWidth);
  const width = useTransform(
    x,
    (xSize) => `${xSize + 0.5 * dragHandleWidth}px`
  );

  useEffect(() => {}, [x]);

  return (
    <div className="flex flex-row relative">
      <motion.div
        className={classNames('h-screen', className)}
        style={{ width }}
      >
        {children}
      </motion.div>
      <motion.div
        className={classNames(
          'absolute bg-gray-100 h-full cursor-col-resize',
          dragHandleClassName
        )}
        style={{ width: dragHandleWidth, x }}
        drag="x"
        dragMomentum={false}
        onDragEnd={() => {
          if (onSetWidth) onSetWidth(x.get());
        }}
        dragConstraints={{
          left: minWindowWidth || undefined,
          right: maxWindowWidth || undefined,
        }}
      />
    </div>
  );
};

Resize.defaultProps = {
  className: '',
  dragHandleClassName: '',
  minWindowWidth: null,
  maxWindowWidth: null,
  onSetWidth: null,
};

export default Resize;
