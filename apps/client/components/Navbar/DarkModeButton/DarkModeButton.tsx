import { FiMoon } from 'react-icons/fi';
import { useTheme } from 'next-themes';
import classNames from 'classnames';
import { Clickable } from '@xeo-editor/ui';

export const DarkModeButton: React.FunctionComponent = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Clickable
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="select-none"
    >
      <FiMoon
        className={classNames({
          'fill-current text-white': theme === 'dark',
        })}
      />
    </Clickable>
  );
};
