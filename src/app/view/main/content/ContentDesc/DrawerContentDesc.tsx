'use client';

// 리액트
import React, {useEffect, useState} from 'react';
import {RootState} from '@/redux-store/ReduxStore';
import {useDispatch, useSelector} from 'react-redux';
import {
  closeDrawerContentDesc,
  openDrawerContentId,
  setDrawerEpisodeId,
} from '@/redux-store/slices/DrawerContentDescSlice';
import {setStateChatting, ChattingState} from '@/redux-store/slices/Chatting';
import {setUrlLinkUse} from '@/redux-store/slices/ChattingEnter';

// MUI
import {
  Drawer,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  Chip,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';

import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';

// Network
import {
  GetContentByIdReq,
  GetContentByIdRes,
  sendContentByIdGet,
  recommendContentInfo,
} from '@/app/NetWork/ContentNetwork';

// Css
import styles from './DrawerContentDesc.module.css';

// Items
import DrawerContentEpisodeItemList from './ContentEpisodeList';
import ContentRecommendList from './ContentRecommendList';
import {EpisodeCardProps} from './ContentDescType';

import Link from 'next/link';
import LoadingOverlay from '@/components/create/LoadingOverlay';

const DrawerContentDesc = () => {
  const dispatch = useDispatch();
  const {open, contentId, episodeId: episodeId} = useSelector((state: RootState) => state.drawerContentDesc);

  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'Episode' | 'Reccomend'>('Episode');

  const [contentUrl, setContentUrl] = useState('?v=vAPWL926G7M');

  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(-1);
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number>(-1);
  const userId = useSelector((state: RootState) => state.user.userId);

  const [contentWholeDesc, setContentWholeDesc] = useState<GetContentByIdRes>(); // 컨텐츠 설명 전체

  // Content, Chapter, Episode 혼동 때문에 Name, Thumbnail은 접두사
  const [contentName, setContentName] = useState('contentName');
  const [contentThumbnail, setContentThumbnail] = useState('');
  const [contentDescription, setContentDescription] = useState('contentDescription');
  const [authorName, setAuthorName] = useState('authorName');
  const [chatCount, setChatCount] = useState(0);
  const [chatUserCount, setChatUserCount] = useState(0);
  const [tagList, setTaglist] = useState<string[]>(['tag1', 'tag2']);
  const [selectTagList, setSelectTaglist] = useState<string[]>(['tag1', 'tag2']);
  const [authorComment, setAuthorComment] = useState('authorComment');
  const [recommendContentList, setRecommendContentList] = useState<recommendContentInfo[]>([]);

  const [chapters, setChapters] = useState<{id: number; name: string}[]>([]);
  const [episodes, setEpisodes] = useState<{id: number; name: string}[]>([]);

  const [episodeItems, setEpisodeItems] = useState<EpisodeCardProps[]>([]);

  const currentChattingState = useSelector((state: RootState) => state.chatting);

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

  const handleTabChange = (event: React.SyntheticEvent, value: any) => {
    setSelectedTab(value);
  };

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

  useEffect(() => {
    if (open) {
      GetContentByContentId(contentId); // Drawer가 열릴 때 호출
    }
  }, [open, contentId]);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => handleCloseDrawer()}
      PaperProps={{
        sx: {
          height: '85vh',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          overflow: 'hidden',
          bottom: '0px',
          maxWidth: '500px',
          margin: '0 auto',
        },
      }}
    >
      <Box className={styles.thumbnailArea}>
        <Box
          className={styles.imageThumbnail}
          sx={{
            backgroundImage: `url(${contentThumbnail})`,
          }}
        ></Box>
        <IconButton className={styles.thumbnailButton} onClick={handleCloseDrawer} sx={{position: 'absolute'}}>
          <CloseIcon />
        </IconButton>
        <Typography className={styles.thumbnailTitle}>{contentName}</Typography>
      </Box>
      <main className={styles.content}>
        <Card>
          <CardContent sx={{padding: 1}}>
            <Box className={styles.descriptionBox}>{contentDescription}</Box>
          </CardContent>
          <Divider className={styles.divider} />
          <CardContent sx={{padding: 1}}>
            <div className={styles.cardProducerArea}>
              <Box textAlign="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <ChatBubbleIcon color="action" />
                  <Typography variant="h6">{chatCount}</Typography>
                </Stack>
              </Box>
              <Box textAlign="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PeopleIcon color="action" />
                  <Typography variant="h6">{chatUserCount}</Typography>
                </Stack>
              </Box>
              <Box textAlign="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <QuestionAnswerIcon color="action" />
                  <Typography variant="h6">Story</Typography>
                </Stack>
              </Box>
            </div>
            <Box className={styles.tagContainer}>
              {selectTagList.map((tag, index) => (
                <Chip key={index} label={tag} className={styles.tagChip} />
              ))}
            </Box>
            <Divider className={styles.divider} />
          </CardContent>
          <Divider className={styles.divider} />
          <CardContent sx={{paddingTop: 1, paddingLeft: 3, paddingRight: 3}}>
            <div>
              <Link href={`/:lang/chat${contentUrl}`} className={styles.startNewChatButton}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    dispatch(setUrlLinkUse(false)); // 채팅이 url 링크를 통해 여는 것이 아니라는 것을 명시해준다.
                  }}
                >
                  Continue
                </Button>
              </Link>
            </div>
            <div className={styles.contentButtonArea}>
              <Button sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <AddIcon />
                Add to My List
              </Button>
              <Button sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <ThumbUpIcon />
                Rate
              </Button>
              <Button sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <ShareIcon />
                Share
              </Button>
            </div>

            {/* ContentDataTab */}
            <div className={styles.contentDataTab}>
              <Tabs value={selectedTab} onChange={handleTabChange} centered>
                <Tab label="Episodes" value="Episode" />
                <Tab label="Recommend" value="Reccomend" />
              </Tabs>
            </div>

            {selectedTab === 'Episode' ? (
              <>
                <Box className={styles.chapterBox}>
                  <Typography className={styles.chapterName} variant="h6">
                    Chapter
                  </Typography>
                  <Select
                    className={styles.chapterSelect}
                    value={selectedChapterIdx}
                    onChange={e => setSelectedChapterIdx(parseInt(e.target.value as string))}
                    displayEmpty
                  >
                    {chapters.map((chapter, index) => (
                      <MenuItem key={chapter.id} value={index}>
                        {chapter.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <div className={styles.episodeListContainer}>
                  <DrawerContentEpisodeItemList episodes={episodeItems} onEpisodeSelect={handleEpisodeSelect} />
                </div>
              </>
            ) : (
              <>
                <Typography variant="h6">Content Recommend</Typography>
                <ContentRecommendList
                  recommendContents={recommendContentList}
                  onSelectContent={handleRecommendContentSelect}
                />
              </>
            )}
          </CardContent>
        </Card>
      </main>
      <LoadingOverlay loading={loading} />
    </Drawer>
  );
};

export default DrawerContentDesc;
