import React from 'react';
import Link from 'next/link';
import {Typography} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PostAddIcon from '@mui/icons-material/PostAdd';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import styles from './StudioTopMenu.module.css';
import {getLocalizedLink} from '@/utils/UrlMove';

interface MenuItem {
  icon: React.ReactNode;
  text: string;
  url: string;
}

//const prefixUrl = '/:lang/studio';
const prefixUrl = '/studio';

const items: MenuItem[] = [
  {icon: <StarIcon />, text: 'Character', url: '/character'},
  {icon: <AutoStoriesIcon />, text: 'Story', url: '/story'},
  {icon: <PostAddIcon />, text: 'Post', url: '/post'},
  {icon: <WallpaperIcon />, text: 'Background', url: '/background'},
];

const StudioTopMenu: React.FC = () => {
  return (
    <div className={styles.menuContainer}>
      {items.map((item, index) => (
        <Link key={index} href={getLocalizedLink(prefixUrl + item.url)} passHref>
          <div className={styles.menuItem}>
            <div className={styles.icon}>{item.icon}</div>
            <Typography className={styles.text}>{item.text}</Typography>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default StudioTopMenu;
