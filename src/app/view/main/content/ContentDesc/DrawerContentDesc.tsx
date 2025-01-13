'use client';

// 리액트
import React, {useEffect, useRef, useState} from 'react';
import {RootState} from '@/redux-store/ReduxStore';
import {useDispatch, useSelector} from 'react-redux';
import Link from 'next/link';

// Redux
import {
  closeDrawerContentDesc,
  openDrawerContentId,
  setDrawerEpisodeId,
} from '@/redux-store/slices/DrawerContentDescSlice';
import {setStateChatting, ChattingState} from '@/redux-store/slices/Chatting';
import {setUrlLinkUse} from '@/redux-store/slices/ChattingEnter';

// Network
import {
  GetContentByIdReq,
  GetContentByIdRes,
  sendContentByIdGet,
  recommendContentInfo,
} from '@/app/NetWork/ContentNetwork';

// Css
import styles from './DrawerContentDesc.module.css';
import {
  BoldArrowDown,
  BoldChatRoundDots,
  BoldFolderPlus,
  BoldFollowers,
  BoldLike,
  BoldPlay,
  BoldShare,
} from '@ui/Icons';
// MUI
import {Drawer, Select, MenuItem} from '@mui/material';

// Components
import {getLocalizedLink} from '@/utils/UrlMove';
import DrawerContentEpisodeItemList from './ContentEpisodeList';
import ContentRecommendList from './ContentRecommendList';
import {EpisodeCardProps} from './ContentDescType';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import Tabs from '@/components/layout/shared/Tabs';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import CustomButton from '@/components/layout/shared/CustomButton';

const DrawerContentDesc = () => {
  const dispatch = useDispatch();
  const {open, contentId, episodeId: episodeId} = useSelector((state: RootState) => state.drawerContentDesc);

  const [loading, setLoading] = useState(false);

  const [contentUrl, setContentUrl] = useState('?v=vAPWL926G7M');

  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(-1);
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number>(-1);
  const userId = useSelector((state: RootState) => state.user.userId);

  const [contentWholeDesc, setContentWholeDesc] = useState<GetContentByIdRes>(); // 컨텐츠 설명 전체

  // Content, Chapter, Episode 혼동 때문에 Name, Thumbnail은 접두사
  const [contentName, setContentName] = useState('contentName');
  const [contentThumbnail, setContentThumbnail] = useState('');
  const [contentDescription, setContentDescription] = useState('contentDescription');

  const [contentDescExpanded, setContentDescExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [authorName, setAuthorName] = useState('authorName');
  const [chatCount, setChatCount] = useState(0);
  const [chatUserCount, setChatUserCount] = useState(0);
  const [tagList, setTaglist] = useState<string[]>(['tag1', 'tag2']);
  const [selectTagList, setSelectTaglist] = useState<string[]>(['tag1', 'tag2']);
  const [authorComment, setAuthorComment] = useState('authorComment');
  const [recommendContentList, setRecommendContentList] = useState<recommendContentInfo[]>([]);

  const [chapters, setChapters] = useState<{id: number; name: string}[]>([]);
  const [episodes, setEpisodes] = useState<{id: number; name: string}[]>([]);
  const [chapterSelectDrawerOpen, setChapterSelectDrawerOpen] = useState(false);
  const [drawerItems, setDrawerItems] = useState<SelectDrawerItem[]>([]);

  const [episodeItems, setEpisodeItems] = useState<EpisodeCardProps[]>([]);

  const currentChattingState = useSelector((state: RootState) => state.chatting);

  const handleEpisodeSelect = (episodeIndex: number) => {
    setSelectedEpisodeIdx(episodeIndex);
    const selectedEpisode = episodeItems[episodeIndex];
    dispatch(setDrawerEpisodeId(selectedEpisode.episodeId)); // Redux에 선택된 에피소드 ID 설정
  };

  const handleRecommendContentSelect = (contentId: number) => {
    dispatch(openDrawerContentId(contentId));
  };

  const handleCloseDrawer = () => {
    dispatch(closeDrawerContentDesc());
  };

  const handleToggleExpand = () => {
    setContentDescExpanded(!contentDescExpanded);
  };

  useEffect(() => {
    const chattingState: ChattingState = {
      contentName: currentChattingState.contentName || '',
      episodeName: currentChattingState.episodeName || '',
      contentId: Number(contentId),
      episodeId: Number(episodeId),
      contentUrl: contentUrl,
    };
    dispatch(setStateChatting(chattingState));

    setContentUrl(`?v=${contentWholeDesc?.urlLinkKey}` || `?v=`);
  }, [episodeId]);

  useEffect(() => {
    if (contentWholeDesc) {
      setContentName(contentWholeDesc.publishInfo.contentName);
      setContentThumbnail(contentWholeDesc.publishInfo.thumbnail);
      setContentDescription(contentWholeDesc.publishInfo.contentDescription);
      setAuthorName(contentWholeDesc.publishInfo.authorName);
      setAuthorComment(contentWholeDesc.publishInfo.authorComment);
      setChatCount(contentWholeDesc.chatCount);
      setChatUserCount(contentWholeDesc.chatUserCount);
      setTaglist(contentWholeDesc.publishInfo.tagList); // SelectTag가 맞음 //아님 전체 Tag가 맞고 SelectTag는 따로 있음
      setSelectTaglist(contentWholeDesc.publishInfo.selectTagList); // SelectTag가 맞음 //아님 전체 Tag가 맞고 SelectTag는 따로 있음
      if (contentWholeDesc.chapterInfoList) {
        const chaptersData = contentWholeDesc.chapterInfoList?.map(chapter => ({
          id: chapter.id,
          name: chapter.name,
        }));
        setChapters(chaptersData);
      }
      setSelectedChapterIdx(0);
      setRecommendContentList(contentWholeDesc.recommandContentInfoList);
      setSelectedEpisodeIdx(0);
      setEpisodes(contentWholeDesc.chapterInfoList[0].episodeInfoList);
      dispatch(setDrawerEpisodeId(contentWholeDesc.chapterInfoList[0].episodeInfoList[0].id));

      setContentUrl(`?v=${contentWholeDesc?.urlLinkKey}` || `?v=`);
    }
  }, [contentWholeDesc]);

  useEffect(() => {
    const newItems = chapters.map((chapter, index) => ({
      name: chapter.name,
      onClick: () => setSelectedChapterIdx(index), // 챕터 선택
    }));
    setDrawerItems(newItems);
  }, [chapters]);

  // chapter가 변경될 때 에피소드 리스트 업데이트
  useEffect(() => {
    setSelectedEpisodeIdx(0);

    if (contentWholeDesc) {
      const selectedChapter = contentWholeDesc.chapterInfoList[selectedChapterIdx];
      const updatedEpisodeItems = selectedChapter?.episodeInfoList?.map(episode => ({
        episodeId: episode.id,
        name: episode.name,
        desc: episode.description,
        thumbnail: episode.thumbnailList[0],
        isLock: episode.isLock,
        intimacy: episode.intimacyProgress,
        imageCount: episode.thumbnailList.length,
      }));
      setEpisodeItems(updatedEpisodeItems); // 에피소드 리스트 업데이트
    }
  }, [chapters, selectedChapterIdx]);

  useEffect(() => {
    if (open) {
      GetContentByContentId(contentId); // Drawer가 열릴 때 호출
    }
  }, [open, contentId]);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(getComputedStyle(contentRef.current).lineHeight || '0', 10);
      const maxHeight = lineHeight * 3; // 3줄 높이 계산
      const actualHeight = contentRef.current.scrollHeight;
      setIsOverflowing(actualHeight > maxHeight); // 실제 높이가 3줄을 초과하면 true
    }
  }, [contentDescription]);

  // Explore 에서 선택한 컨텐츠를 Id로 가져옴 (Play사이클 채팅 진입에서 사용하기 위함)
  const GetContentByContentId = async (contentId: number) => {
    setLoading(true);

    try {
      const req: GetContentByIdReq = {contentId: contentId, language: navigator.language};
      const response = await sendContentByIdGet(req);

      if (response?.data) {
        setContentWholeDesc(response.data);
      } else {
        throw new Error(`No contentInfo in response for ID: ${contentId}`);
      }
    } catch (error) {
      console.error('Error fetching content info:', error);
      throw error; // 에러를 상위로 전달
    } finally {
      setLoading(false);
    }
  };

  const tabData = [
    {
      label: 'Episodes',
      preContent: '',
      content: (
        <>
          <div className={styles.chapterArea}>
            <div className={styles.chapterSelectBox}>
              <div className={styles.chapterTitle}>Selected Season</div>
              {chapters && chapters[selectedChapterIdx] && (
                <button className={styles.chapterSelectArea} onClick={() => setChapterSelectDrawerOpen(true)}>
                  <div className={styles.chapterSelected}>{chapters[selectedChapterIdx].name}</div>
                  <img className={styles.dropDownIcon} src={BoldArrowDown.src} />
                </button>
              )}

              <SelectDrawer
                isOpen={chapterSelectDrawerOpen}
                onClose={() => setChapterSelectDrawerOpen(false)}
                items={drawerItems}
                selectedIndex={selectedChapterIdx}
              />
            </div>
            <DrawerContentEpisodeItemList episodes={episodeItems} onEpisodeSelect={handleEpisodeSelect} />
          </div>
        </>
      ),
    },
    {
      label: 'More Like This',
      preContent: '',
      content: (
        <>
          <div>Content Recommend</div>
          <ContentRecommendList
            recommendContents={recommendContentList}
            onSelectContent={handleRecommendContentSelect}
          />
        </>
      ),
    },
    {
      label: '',
      preContent: '',
      content: <></>,
      isPlaceholder: true,
    },
  ];

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => handleCloseDrawer()}
      PaperProps={{
        sx: {
          height: 'calc((var(--vh, 1vh) * 100) - 111px)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          background: 'var(--White, #FFF)',
          overflow: 'hidden',
          bottom: '0px',
          maxWidth: '402px',
          margin: '0 auto',
        },
      }}
    >
      <div className={styles.handleArea}>
        <div className={styles.handleBar}></div>
      </div>
      <div className={styles.drawerContainer}>
        <div className={styles.topArea}>
          <div className={styles.thumbnailArea}>
            <div className={styles.thumbnailContainer}>
              <img className={styles.thumbnailImage} src={contentThumbnail} />
            </div>
          </div>
          <div className={styles.descriptionArea}>
            <div className={styles.contentName}>{contentName}</div>
            <div className={styles.tagArea}>
              {selectTagList.map((tag, index) => (
                <div key={index} className={styles.tagChip}>
                  {tag}
                </div>
              ))}
            </div>
            <div
              ref={contentRef}
              className={contentDescExpanded ? styles.fullContentDesc : styles.contentDesc}
              title={!contentDescExpanded && isOverflowing ? contentDescription : ''}
            >
              {contentDescription}
            </div>
            {isOverflowing && !contentDescExpanded && (
              <div className={styles.readMore} onClick={handleToggleExpand}>
                Read More
              </div>
            )}
            {contentDescExpanded && (
              <div className={styles.readMore} onClick={handleToggleExpand}>
                Show Less
              </div>
            )}
          </div>
        </div>

        <div className={styles.botArea}>
          <div className={styles.buttonArea}>
            <div className={styles.countArea}>
              <div className={styles.countItem}>
                <img className={styles.countIcon} src={BoldChatRoundDots.src} />
                <div className={styles.countText}>{chatCount}</div>
              </div>
              <div className={styles.countItem}>
                <img className={styles.countIcon} src={BoldFollowers.src} />
                <div className={styles.countText}>{chatUserCount}</div>
              </div>
            </div>
            <div className={styles.contentButtonArea}>
              <button className={styles.contentButton}>
                <div className={styles.contentButtonItem}>
                  <img className={styles.buttonIcon} src={BoldFolderPlus.src} />
                  My List
                </div>
              </button>
              <div className={styles.contentDivider} />
              <button className={styles.contentButton}>
                <div className={styles.contentButtonItem}>
                  <img className={styles.buttonIcon} src={BoldLike.src} />
                  Rate
                </div>
              </button>
              <div className={styles.contentDivider} />
              <button className={styles.contentButton}>
                <div className={styles.contentButtonItem}>
                  <img className={styles.buttonIcon} src={BoldShare.src} />
                  Share
                </div>
              </button>
            </div>
            <div className={styles.playButton}>
              <Link href={getLocalizedLink(`/chat${contentUrl}`)}>
                <CustomButton
                  size="Large"
                  state="IconLeft"
                  type="Primary"
                  icon={BoldPlay.src}
                  iconClass={styles.playIcon}
                  customClassName={[styles.playButton]}
                  onClick={() => {
                    dispatch(setUrlLinkUse(false)); // 채팅이 url 링크를 통해 여는 것이 아니라는 것을 명시해준다.
                  }}
                >
                  Continue
                </CustomButton>
              </Link>
            </div>
          </div>
          <Tabs tabs={tabData} placeholderWidth="40vw" headerStyle={{padding: '0'}} contentStyle={{padding: '0'}} />
        </div>
        <LoadingOverlay loading={loading} />
      </div>
    </Drawer>
  );
};

export default DrawerContentDesc;
