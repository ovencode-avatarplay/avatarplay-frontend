'use client';

import React, {useCallback, useState} from 'react';

import {Box, Button, Drawer} from '@mui/material';
import ProfileTopEditMenu from './ProfileTopEditMenu';
import ProfileInfo from './ProfileInfo';
import profileData from 'data/profile/profile-data.json';
import ProfileTopViewMenu from './ProfileTopViewMenu';
import {
  BoldAltArrowDown,
  BoldHeart,
  BoldMenuDots,
  BoldMore,
  BoldPin,
  BoldVideo,
  LineArrowDown,
  LineCheck,
  LineMenu,
  LinePlus,
  LineShare,
} from '@ui/Icons';
import styles from './ProfileBase.module.scss';
import cx from 'classnames';
import Select, {components, StylesConfig} from 'react-select';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';

enum eTabType {
  Feed,
  Channel,
  Character,
  Shared,
}

type ProfileType = {
  indexTab: eTabType;
  isOpenSelectProfile: boolean;
};
// /profile?type=pd?id=123123
const ProfileBase = () => {
  const [data, setData] = useState<ProfileType>({
    indexTab: eTabType.Feed,
    isOpenSelectProfile: true,
  });

  const SelectBoxArrowComponent = useCallback(
    () => <img className={styles.icon} src={BoldAltArrowDown.src} alt="altArrowDown" />,
    [],
  );
  const SelectBoxValueComponent = useCallback((data: any) => {
    return (
      <div key={data.id} className={styles.label}>
        {data.value}
      </div>
    );
  }, []);
  const SelectBoxOptionComponent = useCallback(
    (data: any, isSelected: boolean) => (
      <>
        <div className={styles.optionWrap}>
          <div key={data.id} className={styles.labelOption}>
            {data.value}
          </div>
          {isSelected && <img className={styles.iconCheck} src={LineCheck.src} alt="altArrowDown" />}
        </div>
      </>
    ),
    [],
  );

  return (
    <>
      <section className={styles.header}>
        <div className={styles.left}>
          <div
            className={styles.selectProfileNameWrap}
            onClick={() => {
              data.isOpenSelectProfile = true;
              setData({...data});
            }}
          >
            <div className={styles.profileName}>Angel_Sasha</div>
            <div className={styles.iconSelect}>
              <img src={LineArrowDown.src} alt="" />
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <img className={cx(styles.icon, styles.iconShare)} src={LineShare.src} alt="" />
          <img className={cx(styles.icon, styles.iconMenu)} src={LineMenu.src} alt="" />
        </div>
      </section>
      <section className={styles.main}>
        <div className={styles.buttonWrap}>
          <button className={styles.subscribe}>Subscribe</button>
          <button className={styles.favorite}>Favorites</button>
          <button className={styles.playlist}>Playlist</button>
        </div>
        <div className={styles.profileStatisticsWrap}>
          <div className={styles.imgProfileWrap}>
            <img className={styles.imgProfile} src="/images/profile_sample/img_sample_profile1.png" alt="" />
            <div className={styles.iconProfileEditWrap}>
              <img className={styles.icon} src="/ui/profile/icon_edit.svg" alt="" />
            </div>
          </div>

          <div className={styles.itemStatistic}>
            <div className={styles.count}>200</div>
            <div className={styles.label}>Posts</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>120k</div>
            <div className={styles.label}>Followers</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>3.4k</div>
            <div className={styles.label}>Following</div>
          </div>
        </div>
        <div className={styles.profileDetail}>
          <div className={styles.name}>Angel_Sasha</div>
          <div className={styles.verify}>
            <span className={styles.label}>Creator</span>
            <img className={styles.icon} src="/ui/profile/icon_verify.svg" alt="" />
          </div>
          <div className={styles.hashTag}>
            <ul>
              <li className={styles.item}>#HauntingMelody</li>
              <li className={styles.item}>#HauntingMelody</li>
              <li className={styles.item}>#HauntingMelody</li>
              <li className={styles.item}>#HauntingMelody</li>
              <li className={styles.item}>#HauntingMelody</li>
            </ul>
          </div>
          <div className={styles.showMore}>Show more...</div>
          <div className={styles.buttons}>
            <button className={styles.edit}>Edit</button>
            <button className={styles.ad}>AD</button>
            <button className={styles.friends}>Friends</button>
          </div>
          {/* <ul className={styles.recruitList}> */}
          <Swiper
            className={styles.recruitList}
            freeMode={true}
            slidesPerView={'auto'}
            onSlideChange={() => {}}
            onSwiper={swiper => {}}
            spaceBetween={8}
          >
            <SwiperSlide>
              <li className={cx(styles.item, styles.addRecruit)}>
                <div className={styles.circle}>
                  <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                </div>
                <div className={styles.label}>Add</div>
              </li>
            </SwiperSlide>
            <SwiperSlide>
              <li className={styles.item}>
                <div className={styles.circle}>
                  <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                  <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                  <span className={cx(styles.grade, styles.original)}>Original</span>
                </div>
                <div className={styles.label}>Idol University</div>
              </li>
            </SwiperSlide>
            <SwiperSlide>
              <li className={styles.item}>
                <div className={styles.circle}>
                  <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                  <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                  <span className={cx(styles.grade, styles.fan)}>Fan</span>
                </div>
                <div className={styles.label}>Idol University</div>
              </li>
            </SwiperSlide>
            <SwiperSlide>
              <li className={styles.item}>
                <div className={styles.circle}>
                  <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                  <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                  <span className={cx(styles.grade, styles.fan)}>Fan</span>
                </div>
                <div className={styles.label}>Idol University</div>
              </li>
            </SwiperSlide>
            <SwiperSlide>
              <li className={styles.item}>
                <div className={styles.circle}>
                  <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                  <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                  <span className={cx(styles.grade, styles.fan)}>Fan</span>
                </div>
                <div className={styles.label}>Idol University</div>
              </li>
            </SwiperSlide>
          </Swiper>
        </div>
        <section className={styles.tabSection}>
          <div
            className={styles.tabHeader}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              const target = e.target as HTMLElement;
              const category = target.closest('[data-tab]')?.getAttribute('data-tab');
              if (category) {
                data.indexTab = parseInt(category);
              }
              setData({...data});
            }}
          >
            <div className={cx(styles.label, data.indexTab == eTabType.Feed && styles.active)} data-tab={eTabType.Feed}>
              Feed
            </div>
            <div
              className={cx(styles.label, data.indexTab == eTabType.Channel && styles.active)}
              data-tab={eTabType.Channel}
            >
              Channel
            </div>
            <div
              className={cx(styles.label, data.indexTab == eTabType.Character && styles.active)}
              data-tab={eTabType.Character}
            >
              Character
            </div>
            <div
              className={cx(styles.label, data.indexTab == eTabType.Shared && styles.active)}
              data-tab={eTabType.Shared}
            >
              Shared
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.filter}>
            <div className={styles.left}>
              <div className={cx(styles.iconWrap, styles.active)}>
                <img src="/ui/profile/icon_grid.svg" alt="" />
              </div>
              <div className={styles.iconWrap}>
                <img src="/ui/profile/icon_video.svg" alt="" />
              </div>
              <div className={styles.iconWrap}>
                <img src="/ui/profile/icon_image.svg" alt="" />
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.filterTypeWrap}>
                <SelectBox
                  value={{id: 1, value: 'Most Popular'}}
                  options={[
                    {id: 0, value: 'Newest'},
                    {id: 1, value: 'Most Popular'},
                    {id: 2, value: 'Weekly Popular'},
                    {id: 3, value: 'Monthly Popular'},
                  ]}
                  ArrowComponent={SelectBoxArrowComponent}
                  ValueComponent={SelectBoxValueComponent}
                  OptionComponent={SelectBoxOptionComponent}
                  onChangedCharacter={id => {}}
                />
                {/* <div className={styles.label}>Newest</div> */}
                {/* <img className={styles.icon} src={BoldAltArrowDown.src} alt="" /> */}
              </div>
            </div>
          </div>
          <div className={styles.tabContent}>
            <ul className={styles.itemWrap}>
              <li className={styles.item}>
                <img className={styles.imgThumbnail} src="/images/profile_sample/img_sample_feed1.png" alt="" />
                <div className={styles.pin}>
                  <img src={BoldPin.src} alt="" />
                </div>
                <div className={styles.info}>
                  <div className={styles.likeWrap}>
                    <img src={BoldHeart.src} alt="" />
                    <div className={styles.value}>1,450</div>
                  </div>
                  <div className={styles.viewWrap}>
                    <img src={BoldVideo.src} alt="" />
                    <div className={styles.value}>23</div>
                  </div>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>
                    Organic Food is Better for Your Health Organic Food is Better for Your Health Organic Food is Better
                    for Your Health
                  </div>
                  <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                </div>
              </li>
              <li className={styles.item}>
                <img className={styles.imgThumbnail} src="/images/profile_sample/img_sample_feed1.png" alt="" />
                <div className={styles.pin}>
                  <img src={BoldPin.src} alt="" />
                </div>
                <div className={styles.info}>
                  <div className={styles.likeWrap}>
                    <img src={BoldHeart.src} alt="" />
                    <div className={styles.value}>1,450</div>
                  </div>
                  <div className={styles.viewWrap}>
                    <img src={BoldVideo.src} alt="" />
                    <div className={styles.value}>23</div>
                  </div>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>
                    Organic Food is Better for Your Health Organic Food is Better for Your Health Organic Food is Better
                    for Your Health
                  </div>
                  <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                </div>
              </li>
              <li className={styles.item}>
                <img className={styles.imgThumbnail} src="/images/profile_sample/img_sample_feed1.png" alt="" />
                <div className={styles.pin}>
                  <img src={BoldPin.src} alt="" />
                </div>
                <div className={styles.info}>
                  <div className={styles.likeWrap}>
                    <img src={BoldHeart.src} alt="" />
                    <div className={styles.value}>1,450</div>
                  </div>
                  <div className={styles.viewWrap}>
                    <img src={BoldVideo.src} alt="" />
                    <div className={styles.value}>23</div>
                  </div>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>
                    Organic Food is Better for Your Health Organic Food is Better for Your Health Organic Food is Better
                    for Your Health
                  </div>
                  <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                </div>
              </li>
              <li className={styles.item}>
                <img className={styles.imgThumbnail} src="/images/profile_sample/img_sample_feed1.png" alt="" />
                <div className={styles.pin}>
                  <img src={BoldPin.src} alt="" />
                </div>
                <div className={styles.info}>
                  <div className={styles.likeWrap}>
                    <img src={BoldHeart.src} alt="" />
                    <div className={styles.value}>1,450</div>
                  </div>
                  <div className={styles.viewWrap}>
                    <img src={BoldVideo.src} alt="" />
                    <div className={styles.value}>23</div>
                  </div>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>
                    Organic Food is Better for Your Health Organic Food is Better for Your Health Organic Food is Better
                    for Your Health
                  </div>
                  <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                </div>
              </li>
              <li className={styles.item}>
                <img className={styles.imgThumbnail} src="/images/profile_sample/img_sample_feed1.png" alt="" />
                <div className={styles.pin}>
                  <img src={BoldPin.src} alt="" />
                </div>
                <div className={styles.info}>
                  <div className={styles.likeWrap}>
                    <img src={BoldHeart.src} alt="" />
                    <div className={styles.value}>1,450</div>
                  </div>
                  <div className={styles.viewWrap}>
                    <img src={BoldVideo.src} alt="" />
                    <div className={styles.value}>23</div>
                  </div>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>
                    Organic Food is Better for Your Health Organic Food is Better for Your Health Organic Food is Better
                    for Your Health
                  </div>
                  <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                </div>
              </li>
            </ul>
          </div>
        </section>
      </section>
      <section className={styles.footer}></section>
      <SelectProfile
        open={data.isOpenSelectProfile}
        handleCloseDrawer={() => {
          data.isOpenSelectProfile = false;
          setData({...data});
        }}
      />
    </>
  );
};

export default ProfileBase;

export type SelectBoxProps = {
  value: {id: number; [key: string]: any} | null;
  options: {id: number; [key: string]: any}[];
  OptionComponent: (data: {id: number; [key: string]: any}, isSelected: boolean) => JSX.Element;
  ValueComponent: (data: any) => JSX.Element;
  ArrowComponent: () => JSX.Element;
  onChangedCharacter: (id: number) => void;
};

const customStyles: StylesConfig<{id: number; [key: string]: any}, false> = {
  control: provided => ({
    ...provided,
    borderColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {
      borderColor: 'transparent',
    },
    '&:focus': {
      borderColor: 'transparent',
    },
    background: 'transparent',
    padding: 0,
    cursor: 'pointer',
    width: '184px',
  }),
  singleValue: provided => ({
    // value부분
    ...provided,
  }),
  valueContainer: provided => ({
    ...provided,
    paddingLeft: 0,
    textAlign: 'right',
  }),
  input: provided => ({
    ...provided,
  }),
  option: (provided, state) => ({
    // 옵션 부분
    ...provided,
    backgroundColor: state.isSelected ? '#ffffff' : 'transparent',
    color: 'black',
    ':active': {
      backgroundColor: state.isSelected ? '#ffffff' : 'transparent',
    },
    cursor: 'pointer',

    padding: '11px 14px',
    boxSizing: 'border-box',
  }),
  menu: provided => ({
    ...provided,
    marginTop: '7px',
  }),
  menuList: provided => ({
    ...provided,
    padding: 0,
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.10)',
  }),
  indicatorSeparator: provided => ({
    ...provided,
    display: 'none',
  }),
  dropdownIndicator: provided => ({
    ...provided,
  }),
};

export const SelectBox: React.FC<SelectBoxProps> = ({
  value,
  options,
  OptionComponent,
  ValueComponent,
  ArrowComponent,
  onChangedCharacter,
}) => {
  const [selectedOption, setSelectedOption] = useState<{id: number} | null>(value);

  return (
    <Select
      isSearchable={false}
      value={selectedOption}
      onChange={option => {
        if (option) {
          setSelectedOption(option);
          onChangedCharacter(option.id);
        }
      }}
      styles={customStyles}
      options={options}
      components={{
        DropdownIndicator: ArrowComponent,
        Option: props => (
          <components.Option {...props}>
            {OptionComponent(props.data, props.isSelected)} {/* 드롭다운에서는 isSingleValue = false */}
          </components.Option>
        ),
        SingleValue: props => (
          <components.SingleValue {...props}>
            {ValueComponent(props.data)} {/* 선택된 값에서는 isSingleValue = true */}
          </components.SingleValue>
        ),
      }}
      getOptionValue={option => option.id.toString()}
    />
  );
};

const SelectProfile = ({open, handleCloseDrawer}) => {
  return (
    <Drawer
      className={styles.drawer}
      anchor="bottom"
      open={open}
      onClose={() => handleCloseDrawer()}
      PaperProps={{
        sx: {
          // height: 'calc((var(--vh, 1vh) * 100) - 111px)',
          padding: '8px 20px 45px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          // background: 'var(--White, #FFF)',
          // overflow: 'hidden',
          // bottom: '0px',
          // width: 'var(--full-width)',
          // margin: '0 auto',
        },
      }}
    >
      <div className={styles.handleArea}>
        <div className={styles.handleBar}></div>
      </div>
      <div className={styles.title}>Select Profile</div>
      <div className={styles.content}>
        <ul className={styles.profileList}>
          <li className={styles.item}>
            <div className={styles.left}>
              <img className={styles.imgProfile} src="/images/profile_sample/img_sample_profile1.png" alt="" />
              <div className={styles.nameWrap}>
                <div className={styles.name}>Angel_Sasha</div>
              </div>
            </div>
            <div className={styles.right}>
              <img className={styles.iconChecked} src="/ui/profile/icon_select_proflie_checked.svg" alt="" />
            </div>
          </li>
          <li className={styles.item}>
            <div className={styles.left}>
              <img className={styles.imgProfile} src="/images/profile_sample/img_sample_profile1.png" alt="" />
              <div className={styles.nameWrap}>
                <span className={styles.grade}>Original</span>
                <div className={styles.name}>Angel_Sasha</div>
              </div>
            </div>
            <div className={styles.right}>
              <img className={styles.iconMore} src={BoldMore.src} alt="" />
            </div>
          </li>
          <li className={styles.item}>
            <div className={styles.left}>
              <div className={styles.addIconWrap}>
                <img src={LinePlus.src} alt="" />
              </div>
              <div className={styles.nameWrap}>
                <div className={styles.name}>Add New Profile</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </Drawer>
  );
};
