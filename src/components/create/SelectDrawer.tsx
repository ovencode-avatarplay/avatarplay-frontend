import React, {Children, ReactNode} from 'react';
import styles from './SelectDrawer.module.css';
import {LineCheck} from '@ui/Icons';
import {Drawer} from '@mui/material';
import cx from 'classnames';

export interface SelectDrawerItem {
  name: string;
  icon?: string;
  onClick: () => void;
}

interface SelectDrawerProps {
  items: SelectDrawerItem[];
  isOpen: boolean;
  onClose: () => void;
  selectedIndex: number;
  children?: ReactNode;
}

const SelectDrawer: React.FC<SelectDrawerProps> = ({items, isOpen, onClose, selectedIndex, children}) => {
  return (
    <>
      {isOpen && <div className={styles.selectDrawerBack} onClick={onClose}></div>}
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={onClose}
        classes={{paper: styles.drawerPaper}}
        PaperProps={{
          sx: {
            width: 'var(--full-width)',
            margin: '0 auto',
            padding: '8px 20px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          },
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'inherit', // 원하는 배경색 적용
            },
          },
        }}
        style={{zIndex: '1399'}}
      >
        <div className={styles.handleArea}>
          <div className={styles.handleBar}></div>
        </div>
        {children && <div className={styles.customContent}>{children}</div>}
        <div className={cx(styles.drawerBox, styles.maxHeight)}>
          {items.map((item, idx) => (
            <button
              key={idx}
              className={styles.drawerItem}
              onClick={() => {
                item.onClick();
                onClose(); // 항목 클릭 시 드로어 닫기
              }}
            >
              <div className={styles.drawerTextArea}>
                {item.icon && <img src={item.icon} alt="" className={styles.drawerIcon} />}
                <span className={styles.drawerText}>{item.name}</span>
              </div>
              {idx === selectedIndex && <img className={styles.drawerCheckIcon} src={LineCheck.src} />}
            </button>
          ))}
        </div>
      </Drawer>
    </>
  );
};

export default SelectDrawer;
