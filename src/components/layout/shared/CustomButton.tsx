import React from 'react';
import styles from './CustomButton.module.css';

type Size = 'Large' | 'Medium' | 'Small' | 'XSmall';
type State = 'Normal' | 'IconLeft' | 'IconRight' | 'Icon';
type Type = 'ColorPrimary' | 'ColorSecondary' | 'Primary' | 'Secondary' | 'Tertiary';
type ButtonType = 'button' | 'submit' | 'reset' | undefined;

interface CustomButtonProps {
  size: Size;
  state: State;
  type: Type;
  isDisabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  icon?: string;
  iconClass?: string;
  style?: React.CSSProperties;
  customClassName?: string[];
  buttonType?: ButtonType;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  size,
  state,
  type,
  isDisabled = false,
  onClick,
  children,
  icon,
  iconClass,
  style,
  customClassName = [],
  buttonType = 'button',
}) => {
  const sizeClass = styles[`size${size}`];
  const typeClass = styles[`type${type}`];
  const stateClass = styles[`state${state}`];
  const disabledClass = isDisabled ? styles.disabled : '';
  const hoverClass = !isDisabled ? styles.hover : '';

  const combinedClassName = [
    styles.button,
    sizeClass,
    typeClass,
    stateClass,
    disabledClass,
    hoverClass,
    ...customClassName.filter(Boolean),
  ].join(' ');

  return (
    <button type={buttonType} className={combinedClassName} onClick={onClick} disabled={isDisabled} style={style}>
      {state === 'IconLeft' && <img className={`${styles.buttonIcon} ${iconClass}`} src={icon} />}
      {state !== 'Icon' && children}
      {state === 'IconRight' && <img className={`${styles.buttonIcon} ${iconClass}`} src={icon} />}
      {state === 'Icon' && <img className={`${styles.buttonIcon} ${iconClass}`} src={icon} />}
    </button>
  );
};

export default CustomButton;
