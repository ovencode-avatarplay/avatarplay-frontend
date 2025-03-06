import React from 'react';
import styles from './CustomSelector.module.scss';
import cx from 'classnames';
import {LineArrowDown} from '@ui/Icons';

type Props = {
  onClick: () => void;
  error?: boolean;
  value: string | number;
};

const CustomSelector = ({onClick, error, value}: Props) => {
  return (
    <>
      <div className={cx(styles.selectWrap, error && styles.error)} onClick={onClick}>
        {!value && <div className={styles.placeholder}>Select</div>}
        {value && <div className={styles.value}>{value}</div>}
        <img src={'/ui/shared/icon_select.svg'} alt="" />
      </div>
    </>
  );
};

export default CustomSelector;
