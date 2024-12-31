import React from 'react';
import styles from './SelectDrawer.module.css';
import {LineCheck} from '@ui/Icons';
import {Drawer} from '@mui/material';

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
}

const SelectDrawer: React.FC<SelectDrawerProps> = ({items, isOpen, onClose, selectedIndex}) => {
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
            // transform: 'translate(50%, 0)',
            width: 'calc(100vw - 32px)',
            maxWidth: '402px',
            margin: '0 auto',
            padding: '8px 20px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          },
        }}
        BackdropProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.70)',
          },
        }}
        style={{zIndex: '1399'}}
      >
        <div className={styles.handleArea}>
          <div className={styles.handleBar}></div>
        </div>
        <div className={styles.drawerBox}>
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
