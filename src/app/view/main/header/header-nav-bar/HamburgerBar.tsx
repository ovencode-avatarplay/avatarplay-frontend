import React from 'react';
import Drawer from '@mui/material/Drawer';
import styles from './HamburgerBar.module.css';
import {useAtom} from 'jotai';
import {userDropDownAtom} from '@/components/layout/shared/UserDropdown';

interface HamburgerBarProps {
  open: boolean;
  isLeft?: boolean;
  onClose: () => void;
}

const HamburgerBar: React.FC<HamburgerBarProps> = ({open, onClose, isLeft = true}) => {
  const [dataUserDropDown, setUserDropDown] = useAtom(userDropDownAtom);

  return (
    <Drawer open={open} onClose={onClose} anchor={isLeft ? 'left' : 'right'} classes={{paper: styles.drawerPaper}}>
      <div className={styles.drawerContent}>
        {/* 프로필 섹션 */}
        <div
          className={styles.profileSection}
          onClick={() => {
            dataUserDropDown.onClick();
          }}
        >
          <img
            src="https://lh3.googleusercontent.com/a/ACg8ocIcO1zSwxnycGO-Acbr2hoS8uVf0ZjRzLMpVIgchUsXI3cDTA=s96-c"
            alt="Profile"
            className={styles.profileImage}
          />
          <div className={styles.profileInfo}>
            <p className={styles.profileName}>Felixidol</p>
            <p className={styles.profileEmail}>Felix40493@gmail.com</p>
          </div>
        </div>

        {/* 메뉴 섹션 */}
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>
            <span className={styles.menuIcon}>⚙️</span> Account Center
          </li>
          <li className={styles.menuItem}>
            <span className={styles.menuIcon}>💼</span> My Wallet
          </li>
        </ul>

        {/* 포인트 섹션 */}
        <div className={styles.pointsSection}>
          <div className={styles.point}>
            <span className={styles.pointIcon}>💎</span>
            <span className={styles.pointText}>10.5K</span>
          </div>
          <div className={styles.point}>
            <span className={styles.pointIcon}>⭐</span>
            <span className={styles.pointText}>100</span>
          </div>
        </div>

        {/* 기타 메뉴 */}
        <ul className={styles.menuList}>
          <li className={styles.menuItem}>Payment Management</li>
          <li className={styles.menuItem}>Studio (Creator Center)</li>
          <li className={styles.menuItem}>Episode</li>
          <li className={styles.menuItem}>Subscription List</li>
          <li className={styles.menuItem}>Dashboard</li>
          <li className={styles.menuItem}>Supports</li>
        </ul>
      </div>
    </Drawer>
  );
};

export default HamburgerBar;
