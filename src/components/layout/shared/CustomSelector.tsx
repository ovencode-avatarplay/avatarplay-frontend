import React from 'react';
import styles from './CustomSelector.module.scss';
import cx from 'classnames';
import {LineArrowDown} from '@ui/Icons';
import getLocalizedText from '@/utils/getLocalizedText';

type Props = {
  onClick: () => void;
  error?: boolean;
  value: string | number;
};

const CustomSelector = ({onClick, error, value}: Props) => {
  return (
    <>
      <div className={cx(styles.selectWrap, error && !value && styles.error)} onClick={onClick}>
        {!value && <div className={styles.placeholder}>{getLocalizedText('Common', 'common_sample_079')}</div>}
        {value && <div className={styles.value}>{value}</div>}
        <img className={styles.arrowDown} src={'/ui/shared/icon_select.svg'} alt="" />
      </div>
    </>
  );
};

export default CustomSelector;
