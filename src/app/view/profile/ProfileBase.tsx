'use client';

import React, {useState} from 'react';

import {Box, Button} from '@mui/material';
import ProfileTopEditMenu from './ProfileTopEditMenu';
import ProfileInfo from './ProfileInfo';
import profileData from 'data/profile/profile-data.json';
import ProfileTopViewMenu from './ProfileTopViewMenu';
import {BoldAltArrowDown, BoldMenuDots, BoldPin, LineArrowDown, LineMenu, LineShare} from '@ui/Icons';
import styles from './ProfileBase.module.scss';
import cx from 'classnames';
// /profile?type=pd?id=123123
const ProfileBase = () => {
  return (
    <>
      <section className={styles.header}>
        <div className={styles.left}>
          <div className={styles.selectProfileNameWrap}>
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
          <ul className={styles.recruitList}>
            <li className={cx(styles.item, styles.addRecruit)}>
              <div className={styles.circle}>
                <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
              </div>
              <div className={styles.label}>Add</div>
            </li>
            <li className={styles.item}>
              <div className={styles.circle}>
                <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                <span className={cx(styles.grade, styles.original)}>Original</span>
              </div>
              <div className={styles.label}>Idol University</div>
            </li>
            <li className={styles.item}>
              <div className={styles.circle}>
                <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                <span className={cx(styles.grade, styles.fan)}>Fan</span>
              </div>
              <div className={styles.label}>Idol University</div>
            </li>
          </ul>
        </div>
        <section className={styles.tabSection}>
          <div className={styles.tabHeader}>
            <div className={cx(styles.label, styles.active)}>Feed</div>
            <div className={styles.label}>Channel</div>
            <div className={styles.label}>Character</div>
            <div className={styles.label}>Shared</div>
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
                <div className={styles.label}>Newest</div>
                <img className={styles.icon} src={BoldAltArrowDown.src} alt="" />
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
                <div className={styles.titleWrap}>
                  <div className={styles.title}>Organic Food is Better for Your Health</div>
                  <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                </div>
              </li>
              <li className={styles.item}>
                <img className={styles.imgThumbnail} src="/images/profile_sample/img_sample_feed1.png" alt="" />
                <div className={styles.pin}>
                  <img src={BoldPin.src} alt="" />
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>Organic Food is Better for Your Health</div>
                  <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                </div>
              </li>
              <li className={styles.item}>
                <img className={styles.imgThumbnail} src="/images/profile_sample/img_sample_feed1.png" alt="" />
                <div className={styles.pin}>
                  <img src={BoldPin.src} alt="" />
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>Organic Food is Better for Your Health</div>
                  <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                </div>
              </li>
              <li className={styles.item}>
                <img className={styles.imgThumbnail} src="/images/profile_sample/img_sample_feed1.png" alt="" />
                <div className={styles.pin}>
                  <img src={BoldPin.src} alt="" />
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>Organic Food is Better for Your Health</div>
                  <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                </div>
              </li>
            </ul>
          </div>
        </section>
      </section>
      <section className={styles.footer}></section>
    </>
  );
};

export default ProfileBase;
