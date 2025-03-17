'use client';

import React, {useEffect, useRef, useState} from 'react';
import styles from './ProfileDetail.module.scss';
import {
  BoldAI,
  BoldArchive,
  BoldComment,
  BoldDislike,
  BoldFollowers,
  BoldHeart,
  BoldLike,
  BoldMenuDots,
  BoldPin,
  BoldVideo,
  LineArchive,
  LineArrowDown,
  LineClose,
} from '@ui/Icons';
import cx from 'classnames';
import {useRouter} from 'next/navigation';
import {GetCharacterInfoReq, GetCharacterInfoRes, sendGetCharacterInfo} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import Link from 'next/link';
import {getCurrentLanguage, getLocalizedLink} from '@/utils/UrlMove';

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

export const CharacterProfileDetailComponent = ({
  characterInfo = null,
  urlLinkKey = '',
  isPath = false,
}: {
  characterInfo: CharacterInfo | null;
  urlLinkKey: string;
  isPath?: boolean;
}) => {
  const [data, setData] = useState<ProfileType>({
    indexTab: eTabType.Feed,
    indexSessionTab: eTabSessionType.NewSession,
    isOpenSelectProfile: true,
    characterInfo: characterInfo,
    urlLinkKey: urlLinkKey,
  });
  useEffect(() => {
    setData(v => ({...v, characterInfo: characterInfo, urlLinkKey: urlLinkKey}));
  }, [characterInfo, urlLinkKey]);

  const metatags = data.characterInfo?.tag?.split(',') || [];
  const characterImages = data.characterInfo?.mediaTemplateList || [];
  return (
    <>
      <section className={styles.characterMainImageWrap}>
        <img src={data.characterInfo?.mainImageUrl} alt="" className={styles.characterMainImage} />
        {/* <div className={styles.bgGradient}></div> */}
      </section>
      <div className={styles.infoWrap}>
        <div className={styles.left}>
          <div className={styles.top}>
            <Link
              href={getLocalizedLink(`/profile/` + data.characterInfo?.pdProfileSimpleInfo?.urlLinkKey + '?from=""')}
            >
              <img src={data.characterInfo?.pdProfileSimpleInfo.iconImageUrl} alt="" className={styles.profileMaker} />
              <div className={styles.name}>{data.characterInfo?.pdProfileSimpleInfo.name}</div>
            </Link>
          </div>
          <div className={styles.bottom}>
            <div className={styles.viewsWrap}>
              <img src={BoldFollowers.src} alt="" className={styles.icon} />
              <div className={styles.count}>{data.characterInfo?.chatUserCount}</div>
            </div>
            <div className={styles.commentWrap}>
              <img src={BoldComment.src} alt="" className={styles.icon} />
              <div className={styles.count}>{data.characterInfo?.chatCount}</div>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.likeWrap}>
            <img src={BoldLike.src} alt="" className={styles.like} />
            <div className={styles.count}>55K</div>
          </div>
          <img src={BoldDislike.src} alt="" className={styles.dislike} />
          {!data?.characterInfo?.isBookMark && <img src={LineArchive.src} alt="" className={styles.bookmark} />}
          {data?.characterInfo?.isBookMark && <img src={BoldArchive.src} alt="" className={styles.bookmark} />}
        </div>
      </div>
      {metatags?.length != 0 && (
        <ul className={styles.metatags}>
          {metatags?.map((one, index) => {
            return <li className={styles.item}>{one}</li>;
          })}
        </ul>
      )}

      {characterImages?.length != 0 && (
        <ul className={styles.thumbnails}>
          {characterImages?.map((one, index) => {
            return (
              <li className={styles.item}>
                <img src={one.imageUrl} alt="" />
              </li>
            );
          })}
        </ul>
      )}

      <section className={styles.tabSection}>
        <div className={styles.tabContent}>
          <div className={styles.textWrap}>
            <div className={cx(styles.label, styles.descriptionLabel)}>Description</div>
            <TextArea value={data.characterInfo?.description || ''} />
          </div>
          <div className={styles.textWrap}>
            <div className={styles.label}>World Senario</div>
            <TextArea value={data.characterInfo?.worldScenario || ''} />
          </div>
          {data.characterInfo?.creatorComment ? (
            <>
              <div className={styles.textWrap}>
                <div className={styles.label}>Creator Comment</div>
                <TextArea value={data.characterInfo?.creatorComment || ''} />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </section>

      {/* <section className={styles.sessionTab}>
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
      </section> */}

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
        <Link href={getLocalizedLink(`/chat/?v=${data?.urlLinkKey}` || `?v=`)}>
          <button className={cx(styles.startNewChat, !isPath && styles.embedded)}>Start New Chat</button>
        </Link>
      </section>
    </>
  );
};

const ProfileDetail = ({profileId}: Props) => {
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
      languageType: getCurrentLanguage(),
      profileId: profileId,
    };
    const resGetcharacterInfo = await sendGetCharacterInfo(reqGetcharacterInfo);
    data.characterInfo = resGetcharacterInfo.data?.characterInfo || null;
    data.urlLinkKey = resGetcharacterInfo.data?.urlLinkKey || '';

    setData({...data});
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.title}>{data.characterInfo?.name}</div>
        <img className={styles.iconClose} src={LineClose.src} onClick={() => router.back()} />
      </header>
      <main className={styles.main}>
        <CharacterProfileDetailComponent characterInfo={data?.characterInfo} urlLinkKey={data.urlLinkKey} isPath />
      </main>
      <footer className={styles.footer}></footer>
    </>
  );
};

export default ProfileDetail;

type TextAreaType = {
  value: string;
};

export const TextArea = ({value}: TextAreaType) => {
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
      rows={1}
      style={{overflow: 'hidden', resize: 'none'}}
    />
  );
};
