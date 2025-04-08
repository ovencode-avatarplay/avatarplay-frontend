import {Drawer} from '@mui/material';
import {useEffect, useState} from 'react';
import styles from './CreateChannel.module.scss';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import {LineCheck} from '@ui/Icons';
import cx from 'classnames';

export type DrawerSelectType = {
  title: string;
  description: string;
  tags: {isActive: boolean; value: string}[];
  open: boolean;
  onClose: () => void;
  onChange: (tags: {isActive: boolean; value: string}[]) => void;
};
export const DrawerSelect = ({title, description, tags, open, onClose, onChange}: DrawerSelectType) => {
  const [data, setData] = useState({
    tagList: tags,
  });

  useEffect(() => {
    if (!open) return;

    data.tagList = tags;
    setData({...data});
  }, [open]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => onClose()}
      PaperProps={{
        className: `${styles.drawer} ${styles.drawerSelect}`,
        sx: {
          overflow: 'hidden',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        },
      }}
    >
      <div className={styles.handleArea}>
        <div className={styles.handleBar}></div>
      </div>
      <div className={cx(styles.titleWrap, styles.drawalSelectHeader)}>
        <div className={styles.blank}></div>
        <div className={styles.title}>{title}</div>
        <CustomToolTip tooltipText="Channel IP" />
      </div>
      <div className={cx(styles.drawalSelectContent)}>
        <div
          className={styles.tagWrap}
          onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const target = e.target as HTMLElement;
            const index = parseInt(target.closest('[data-tag]')?.getAttribute('data-tag') || '-1');
            if (index >= 0) {
              for (let i = 0; i < data.tagList.length; i++) {
                data.tagList[i].isActive = false;
              }
              data.tagList[index].isActive = true;
              setData({...data});
              onChange(data.tagList);
            }
          }}
        >
          {data.tagList.map((tag, index) => {
            return (
              <div className={cx(styles.tag, tag.isActive && styles.active)} data-tag={index}>
                <div className={styles.value}>{tag?.value}</div>
                <div className={styles.iconCheckWrap}>{tag.isActive && <img src={LineCheck.src} alt="" />}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Drawer>
  );
};
