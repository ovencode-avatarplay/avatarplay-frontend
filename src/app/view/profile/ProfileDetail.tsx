'use client';

import React, {useEffect, useRef, useState} from 'react';
import styles from './ProfileDetail.module.scss';
import {BoldArchive, BoldComment, BoldDislike, BoldFollowers, BoldLike, LineArchive, LineClose} from '@ui/Icons';
import cx from 'classnames';
import {useRouter} from 'next/navigation';
import {GetCharacterInfoReq, sendGetCharacterProfileInfo} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import Link from 'next/link';
import {getCurrentLanguage, getLocalizedLink} from '@/utils/UrlMove';
import {bookmark, InteractionType, sendDisLike, sendLike} from '@/app/NetWork/CommonNetwork';
import getLocalizedText from '@/utils/getLocalizedText';
import useCustomRouter from '@/utils/useCustomRouter';
import {COMMON_TAG_HEAD_TAG} from './ProfileBase';
import CustomButton from '@/components/layout/shared/CustomButton';

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
  profileId = 0,
  characterInfo = null,
  urlLinkKey = '',
  isPath = false,
  onRefresh = () => {},
}: {
  profileId: number;
  characterInfo: CharacterInfo | null;
  urlLinkKey: string;
  isPath?: boolean;
  onRefresh: () => void;
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
            <img
              src={BoldLike.src}
              alt=""
              className={cx(styles.like, characterInfo?.isLike && styles.active)}
              onClick={async () => {
                const isLike = !characterInfo?.isLike;
                await sendLike(InteractionType.Character, profileId, isLike);
                if (isLike && characterInfo?.isDisLike) {
                  await sendDisLike(InteractionType.Character, profileId, false);
                }

                onRefresh();
              }}
            />
            <div className={cx(styles.count, characterInfo?.isLike && styles.active)}>{characterInfo?.likeCount}</div>
          </div>
          <img
            src={BoldDislike.src}
            alt=""
            className={cx(styles.dislike, characterInfo?.isDisLike && styles.active)}
            onClick={async () => {
              const isDisLike = !characterInfo?.isDisLike;
              await sendDisLike(InteractionType.Character, profileId, isDisLike);
              if (isDisLike && characterInfo?.isLike) {
                await sendLike(InteractionType.Character, profileId, false);
              }

              onRefresh();
            }}
          />
          {!data?.characterInfo?.isBookmark && (
            <img
              src={LineArchive.src}
              alt=""
              className={styles.bookmark}
              onClick={async () => {
                await bookmark({interactionType: InteractionType.Character, isBookMark: true, typeValueId: profileId});
                onRefresh();
              }}
            />
          )}
          {data?.characterInfo?.isBookmark && (
            <img
              src={BoldArchive.src}
              alt=""
              className={cx(styles.bookmark, styles.active)}
              onClick={async () => {
                await bookmark({interactionType: InteractionType.Character, isBookMark: false, typeValueId: profileId});
                onRefresh();
              }}
            />
          )}
        </div>
      </div>
      {metatags?.length != 0 && (
        <ul className={styles.metatags}>
          {metatags?.map((one, index) => {
            const value = one.includes(COMMON_TAG_HEAD_TAG) ? getLocalizedText(one) : one;

            return <li className={styles.item}>{value}</li>;
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
          {!!data.characterInfo?.description && (
            <div className={styles.textWrap}>
              <div className={cx(styles.label, styles.descriptionLabel)}>
                {getLocalizedText('createcharacter001_label_012')}
              </div>
              <TextArea value={data.characterInfo?.description || ''} />
            </div>
          )}
          {!!data.characterInfo?.worldScenario && (
            <div className={styles.textWrap}>
              <div className={styles.label}>{getLocalizedText('createcharacter001_label_017')}</div>
              <TextArea value={data.characterInfo?.worldScenario || ''} />
            </div>
          )}
          {data.characterInfo?.introduction ? (
            <>
              <div className={styles.textWrap}>
                <div className={styles.label}>{getLocalizedText('createcharacter001_label_018')}</div>
                <TextArea value={data.characterInfo?.introduction || ''} />
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

      {/* <section className={styles.myNameSection}>
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
      </section> */}

      {/* <section className={styles.myRoleSection}> */}
      {/* <div className={styles.roleWrap}>
          <div className={styles.label}>My role (optional)</div>
          <img src={LineArrowDown.src} alt="" />
        </div> */}
      {/* <div className={styles.recentSetting}>Recent Setting</div> */}
      <Link href={getLocalizedLink(`/chat/?v=${data?.urlLinkKey}` || `?v=`)}>
        <CustomButton
          size="Large"
          state="Normal"
          type="ColorPrimary"
          customClassName={[cx(styles.startNewChat, !isPath && styles.embedded)]}
        >
          {getLocalizedText('common_button_startnewchat')}
        </CustomButton>
      </Link>
      {/* </section> */}
    </>
  );
};

const ProfileDetail = ({profileId}: Props) => {
  const {back} = useCustomRouter();
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
    const resGetcharacterInfo = await sendGetCharacterProfileInfo(reqGetcharacterInfo);
    data.characterInfo = resGetcharacterInfo.data?.characterInfo || null;
    data.urlLinkKey = resGetcharacterInfo.data?.urlLinkKey || '';

    setData({...data});
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.title}>{data.characterInfo?.name}</div>
        <img className={styles.iconClose} src={LineClose.src} onClick={() => back()} />
      </header>
      <main className={styles.main}>
        <CharacterProfileDetailComponent
          profileId={profileId}
          characterInfo={data?.characterInfo}
          urlLinkKey={data.urlLinkKey}
          isPath
          onRefresh={() => {}}
        />
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
      readOnly={true}
      ref={textareaRef}
      onInput={resizeTextarea}
      rows={1}
      style={{overflow: 'hidden', resize: 'none'}}
    />
  );
};
