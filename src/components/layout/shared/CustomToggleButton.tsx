import React from 'react';
import styles from './CustomToggleButton.module.css';

interface ToggleButtonProps {
  isToggled: boolean;
  size?: 'sm' | 'md' | 'lg'; // Size of the toggle
  theme?: 'light' | 'dark'; // Theme of the toggle
  state?: 'default' | 'hover' | 'focus' | 'disabled'; // State of the toggle
  onToggle: () => void;
}

const CustomToggleButton: React.FC<ToggleButtonProps> = ({
  isToggled,
  size = 'md',
  theme = 'light',
  state = 'default',
  onToggle,
}) => {
  return (
    <div
      className={`${styles.toggleBackground} ${styles[size]} ${styles[theme]} ${styles[state]} ${
        isToggled ? styles.toggled : ''
      }`}
      onClick={state !== 'disabled' ? onToggle : undefined}
    >
      <button
        className={`${styles.toggleButton} ${styles[size]}  ${styles[theme]} ${styles[state]} ${
          isToggled ? styles.toggled : ''
        }`}
        aria-pressed={isToggled}
        disabled={state === 'disabled'}
      />
    </div>
  );
};

export default CustomToggleButton;
