'use client';

import React, {useEffect, useRef, useState} from 'react';
import styles from './ProfileDetail.module.scss';
import {
  BoldAI,
  BoldComment,
  BoldFollowers,
  BoldHeart,
  BoldMenuDots,
  BoldPin,
  BoldVideo,
  LineArrowDown,
  LineClose,
} from '@ui/Icons';
import cx from 'classnames';
import {useRouter} from 'next/navigation';
import {GetCharacterInfoReq, GetCharacterInfoRes, sendGetCharacterInfo} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/ContentInfo';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';

type Props = {
  profileId: number;
};

enum eTabType {
  Feed,
  Channel,
  Character,
  Shared,
}

enum eTabSessionType {
  NewSession,
  LastSession,
}

type ProfileType = {
  indexTab: eTabType;
  indexSessionTab: eTabSessionType;
  isOpenSelectProfile: boolean;
  characterInfo: CharacterInfo | null;
  urlLinkKey: string;
};

const PageProfileDetail = ({profileId}: Props) => {
  console.log(profileId);
  const router = useRouter();
  const [data, setData] = useState<ProfileType>({
    indexTab: eTabType.Feed,
    indexSessionTab: eTabSessionType.NewSession,
    isOpenSelectProfile: true,
    characterInfo: null,
    urlLinkKey: '',
  });

  useEffect(() => {
    getCharacterInfo(profileId);
  }, [profileId]);

  const getCharacterInfo = async (profileId: number) => {
    const reqGetcharacterInfo: GetCharacterInfoReq = {
      characterId: profileId,
    };
    const resGetcharacterInfo = await sendGetCharacterInfo(reqGetcharacterInfo);
    data.characterInfo = resGetcharacterInfo.data?.characterInfo || null;
    data.urlLinkKey = `?v=${resGetcharacterInfo.data?.urlLinkKey}` || `?v=`;

    setData({...data});
  };

  const metatags = data.characterInfo?.tag?.split(',') || [];
  const characterImages = data.characterInfo?.portraitGalleryImageUrl || [];
  return (
    <>
      <header className={styles.header}>
        <div className={styles.title}>{data.characterInfo?.name}</div>
        <img className={styles.iconClose} src={LineClose.src} onClick={() => router.back()} />
      </header>
      <main className={styles.main}>
        <section className={styles.characterMainImageWrap}>
          <img src={data.characterInfo?.mainImageUrl} alt="" className={styles.characterMainImage} />
          <div className={styles.infoWrap}>
            <Link href={getLocalizedLink(`/profile/` + data.characterInfo?.pdProfileSimpleInfo?.id)}>
              <div className={styles.left}>
                <img
                  src={data.characterInfo?.pdProfileSimpleInfo.iconImageUrl}
                  alt=""
                  className={styles.profileMaker}
                />
                <div className={styles.name}>{data.characterInfo?.pdProfileSimpleInfo.name}</div>
              </div>
            </Link>
            <div className={styles.right}>
              <div className={styles.statistics}>
                <div className={styles.commentWrap}>
                  <img src={BoldComment.src} alt="" className={styles.icon} />
                  <div className={styles.count}>{data.characterInfo?.chatCount}</div>
                </div>
                <div className={styles.viewsWrap}>
                  <img src={BoldFollowers.src} alt="" className={styles.icon} />
                  <div className={styles.count}>{data.characterInfo?.chatUserCount}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {metatags?.length != 0 && (
          <ul className={styles.metatags}>
            {metatags?.map((one, index) => {
              return <li className={styles.item}>{one}</li>;
            })}
          </ul>
        )}

        {characterImages?.length != 0 && (
          <ul className={styles.thumbnails}>
            {data.characterInfo?.portraitGalleryImageUrl.map((one, index) => {
              return (
                <li className={styles.item}>
                  <img src={one.imageUrl} alt="" />
                </li>
              );
            })}
          </ul>
        )}

        <section className={styles.tabSection}>
          {/* <div
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
          <div className={styles.line}></div> */}
          <div className={styles.tabContent}>
            <div className={styles.textWrap}>
              <div className={styles.label}>World Senario</div>
              <TextArea value={data.characterInfo?.worldScenario || ''} />
            </div>
            <div className={styles.textWrap}>
              <div className={styles.label}>Greeting</div>
              <TextArea value={data.characterInfo?.greeting || ''} />
            </div>

            <div className={styles.textWrap}>
              <div className={styles.label}>Creator Comment</div>
              <TextArea value={data.characterInfo?.description || ''} />
            </div>
          </div>
        </section>

        <section className={styles.sessionTab}>
          <div
            className={styles.tabHeader}
            onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              const target = e.target as HTMLElement;
              const category = target.closest('[data-tab]')?.getAttribute('data-tab');
              if (category) {
                data.indexSessionTab = parseInt(category);
              }
              setData({...data});
            }}
          >
            <div
              className={cx(styles.label, data.indexSessionTab == eTabSessionType.NewSession && styles.active)}
              data-tab={eTabSessionType.NewSession}
            >
              New Session
            </div>
            <div
              className={cx(styles.label, data.indexSessionTab == eTabSessionType.LastSession && styles.active)}
              data-tab={eTabSessionType.LastSession}
            >
              Last Session
            </div>
          </div>
          <div className={styles.line}></div>
        </section>

        <section className={styles.myNameSection}>
          <div className={styles.label}>
            My Name <span className={styles.highlight}>*</span>
          </div>
          <div className={styles.description}>You will be called "Sally"</div>
          <div className={styles.inputWrap}>
            <input placeholder="Sally" type="text" className={styles.inputName} />
            <button className={styles.changeNameWrap}>
              <img src={'/ui/profile/icon_profiledetail_changename.svg'} alt="" />
            </button>
          </div>
        </section>

        <section className={styles.myRoleSection}>
          <div className={styles.roleWrap}>
            <div className={styles.label}>My role (optional)</div>
            <img src={LineArrowDown.src} alt="" />
          </div>
          <div className={styles.recentSetting}>Recent Setting</div>
        </section>

        {/* <section className={styles.relatedCharactersSection}>
          <div className={styles.label}>Related Characters</div>
          <div className={styles.tabContent}>
            <ul className={styles.itemWrap}>
              <li className={styles.item}>
                <img className={styles.imgThumbnail} src="/images/profile_sample/img_sample_feed1.png" alt="" />
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
        </section> */}
        <Link href={getLocalizedLink(`/chat${data.urlLinkKey}`)}>
          <button className={styles.startNewChat}>Start New Chat</button>
        </Link>
      </main>
      <footer className={styles.footer}></footer>
    </>
  );
};

export default PageProfileDetail;

type TextAreaType = {
  value: string;
};

const TextArea = ({value}: TextAreaType) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    resizeTextarea(); // 초기 로딩 시 높이 조정
  }, []);

  return (
    <textarea
      value={value}
      ref={textareaRef}
      onInput={resizeTextarea}
      style={{overflow: 'hidden', resize: 'none', minHeight: '40px'}}
    />
  );
};
