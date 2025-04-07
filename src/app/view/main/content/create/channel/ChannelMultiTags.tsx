import {Drawer} from '@mui/material';
import {useEffect, useState} from 'react';
import {DrawerSelectType} from './ChannelDrawerSelector';
import styles from './CreateChannel.module.scss';
import cx from 'classnames';
import {LineRegenerate} from '@ui/Icons';
import getLocalizedText from '@/utils/getLocalizedText';
import {COMMON_TAG_HEAD_TAG} from '@/app/view/profile/ProfileBase';
import CustomButton from '@/components/layout/shared/CustomButton';

export type DrawerMultipleTagsType = {
  title: string;
  description: string;
  tags: {isActive: boolean; value: string}[];
  open: boolean;
  onClose: () => void;
  onChange: (tags: {isActive: boolean; value: string}[]) => void;
};
export const DrawerMultipleTags = ({title, description, tags, open, onClose, onChange}: DrawerSelectType) => {
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
        className: cx(styles.drawer, styles.drawerMultipleTags),
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
      <div className={styles.title}>{title}</div>
      <div className={cx(styles.handleContent, styles.drawerMultipleTags)}>
        <div
          className={styles.refreshWrap}
          onClick={() => {
            const dataReset = tags.map(v => ({...v, isActive: false}));
            data.tagList = dataReset;
            setData({...data});
            // onChange(dataReset);
          }}
        >
          <div className={styles.btnWrap}>
            <div className={styles.labelRefresh}>{getLocalizedText('common_button_refresh')}</div>
            <img src={LineRegenerate.src} alt="" />
          </div>
        </div>
        <div
          className={styles.tagWrap}
          onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const target = e.target as HTMLElement;
            const index = parseInt(target.closest('[data-tag]')?.getAttribute('data-tag') || '-1');
            if (index >= 0) {
              data.tagList[index].isActive = !data.tagList[index].isActive;
              setData({...data});
            }
          }}
        >
          {data.tagList.map((tag, index) => {
            const value = tag?.value?.includes(COMMON_TAG_HEAD_TAG) ? getLocalizedText(tag?.value) : tag?.value;

            return (
              <div className={cx(styles.tag, tag.isActive && styles.active)} data-tag={index}>
                <div className={styles.value}>{value}</div>
              </div>
            );
          })}
        </div>
      </div>
      <CustomButton
        size="Medium"
        state="Normal"
        type="Primary"
        customClassName={[styles.submitBtn]}
        onClick={() => {
          onChange(data.tagList);
          onClose();
        }}
      >
        Submit
      </CustomButton>
    </Drawer>
  );
};
