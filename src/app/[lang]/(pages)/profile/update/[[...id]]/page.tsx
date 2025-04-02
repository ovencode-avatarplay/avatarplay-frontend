'use client';
import {LineArrowLeft, BoldMenuDots, LineArrowDown, LineClose, LineUpload} from '@ui/Icons';
import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import styles from './ProfileUpdate.module.scss';
import {useFieldArray, useForm} from 'react-hook-form';
import {COMMON_TAG_HEAD_INTEREST, SelectBox} from '@/app/view/profile/ProfileBase';
import {Dialog, Drawer} from '@mui/material';
import cx from 'classnames';

import {getLocalizedLink, pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {getBackUrl} from '@/utils/util-1';
import {getPdInfo, MediaState, PdPortfolioInfo, updatePdInfo, UpdatePdInfoReq} from '@/app/NetWork/ProfileNetwork';
import {MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'; // 필요시 다른 모듈도 가져오기
import {DataUsageSharp} from '@mui/icons-material';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {getAuth} from '@/app/NetWork/AuthNetwork';
import {updateProfile} from '@/redux-store/slices/Profile';
import {useDispatch} from 'react-redux';
import useCustomRouter from '@/utils/useCustomRouter';
import getLocalizedText from '@/utils/getLocalizedText';
type Props = {
  params: {
    id?: string[];
  };
};

const PageProfileUpdate = ({params: {id = ['0']}}: Props) => {
  const profileId = parseInt(id?.[0]);
  return (
    <>
      <ProfileUpdate profileId={profileId} />
    </>
  );
};

export default PageProfileUpdate;

export type PortfolioListPopupType = {
  dataList: PdPortfolioInfo[];
  onClose: () => void;
  onChange: (data: PdPortfolioInfo[]) => void;
};

export const PortfolioListPopup = ({dataList, onChange, onClose}: PortfolioListPopupType) => {
  const [data, setData] = useState<{
    isSettingOpen: boolean;
    idSelected: number;
    portfolioList: PdPortfolioInfo[];
    isOpenEditDrawer: boolean;
  }>({
    isSettingOpen: false,
    idSelected: 0,
    portfolioList: [],
    isOpenEditDrawer: false,
  });
  useEffect(() => {
    data.portfolioList = dataList || [];
    setData({...data});
  }, [dataList]);

  let settingItems: SelectDrawerItem[] = [
    {
      name: 'Edit',
      onClick: () => {
        data.isOpenEditDrawer = true;
        setData({...data});
      },
    },
    {
      name: 'Share',
      onClick: () => {},
    },
    {
      name: 'Delete',
      onClick: () => {
        data.portfolioList.splice(data.idSelected, 1);
        setData({...data});
        onChange(data.portfolioList);
      },
    },
  ];
  return (
    <>
      <Dialog open={true} onClose={onClose} fullScreen>
        <section className={styles.portfolioPreviewSection}>
          <header>
            <img
              src={LineArrowLeft.src}
              alt="back"
              className={styles.back}
              onClick={() => {
                onChange;
                onClose();
              }}
            />
            <div className={styles.title}>{getLocalizedText('profile045_title_001')}</div>
          </header>
          <main>
            <div className={styles.countPortfolio}>
              {getLocalizedText('profile045_label_002')} {data.portfolioList.length}
            </div>
            <ul className={styles.itemList}>
              {data.portfolioList.map((one, index) => {
                const date = one?.createAt ? new Date(one?.createAt) : new Date();
                const formattedDate = date.toLocaleDateString('ko-KR').replace(/-/g, '.');
                return (
                  <li className={styles.item} key={index}>
                    <img className={styles.thumbnail} src={one.imageUrl} alt="" />
                    <div className={styles.description}>{one.description}</div>
                    <div className={styles.dateRegistration}>
                      {getLocalizedText('profile034_label_003')} {formattedDate}
                    </div>
                    {/* <div className={styles.settingWrap}>
                      <img
                        src={BoldMenuDots.src}
                        alt=""
                        className={styles.setting}
                        onClick={() => {
                          data.isSettingOpen = true;
                          data.idSelected = index;
                          setData({...data});
                        }}
                      />
                    </div> */}
                  </li>
                );
              })}
            </ul>
            <SelectDrawer
              isOpen={data.isSettingOpen}
              onClose={() => {
                data.isSettingOpen = false;
                setData({...data});
              }}
              items={settingItems}
              selectedIndex={-1}
            />
            <DrawerCreatePortfolio
              dataList={data.portfolioList}
              id={data.idSelected}
              open={data.isOpenEditDrawer}
              onChange={dataList => {
                data.portfolioList = dataList;
                setData({...data});
                onChange(data.portfolioList);
              }}
              onClose={() => {
                data.isOpenEditDrawer = false;
                setData({...data});
              }}
            />
          </main>
          <footer></footer>
        </section>
      </Dialog>
    </>
  );
};
