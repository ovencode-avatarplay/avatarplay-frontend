import React from 'react';
import Link from 'next/link';
import {Typography} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import styles from './StudioDashboardMenu.module.css';

interface StudioDashboardMenuProps {
  icon: React.ReactNode; // MUI 아이콘을 받을 수 있도록
  text: string;
}

const StudioDashboardMenu: React.FC<StudioDashboardMenuProps> = ({icon, text}) => {
  return (
    <div className={styles.container}>
      {/* Studio Label with ChevronLeft Icon */}
      <div className={styles.studioLink}>
        <Link href={`/studio`} passHref>
          <Typography className={styles.label} component="a">
            <ChevronLeftIcon className={styles.chevronIcon} />
            Studio
          </Typography>
        </Link>
      </div>

      {/* Centered Items */}
      <div className={styles.centerItems}>
        <div className={styles.item}>
          <div className={styles.icon}>{icon}</div>
          <Typography className={styles.text}>{text}</Typography>
        </div>
      </div>
    </div>
  );
};

export default StudioDashboardMenu;
