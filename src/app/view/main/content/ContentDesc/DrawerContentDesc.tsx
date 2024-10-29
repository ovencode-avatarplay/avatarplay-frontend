'use client';

// 리액트
import React, {useEffect, useState} from 'react';
import {RootState} from '@/redux-store/ReduxStore';
import {useDispatch, useSelector} from 'react-redux';
import {
  closeDrawerContentDesc,
  openDrawerContentId,
  setDrawerEpisodeId,
} from '@/redux-store/slices/drawerContentDescSlice';
import {setStateChatting, ChattingState} from '@/redux-store/slices/chatting';

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
  Avatar,
  Divider,
  CardMedia,
  IconButton,
} from '@mui/material';

import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';

// Network
import {
  GetContentByIdReq,
  GetContentByIdRes,
  sendContentByIdGet,
  recommendContentInfo,
} from '@/app/NetWork/ContentNetwork';

// Css
import Style from './DrawerContentDesc.module.css';

// Items
import DrawerContentEpisodeItemList from './ContentEpisodeList';
import {EpisodeCardProps} from '@/types/apps/episode-card-type';
import ContentRecommendList from './ContentRecommendList';
import Link from 'next/link';
import {Padding} from '@mui/icons-material';

const DrawerContentDesc = () => {
  const {open, contentId, episodeId: episodeId} = useSelector((state: RootState) => state.drawerContentDesc);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(-1);
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number>(-1);
  const userId = useSelector((state: RootState) => state.user.userId);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [contentWholeDesc, setContentWholeDesc] = useState<GetContentByIdRes>(); // 컨텐츠 설명 전체

  // Content, Chapter, Episode 혼동 때문에 Name, Thumbnail은 접두사
  const [contentName, setContentName] = useState('contentName');
  const [contentThumbnail, setContentThumbnail] = useState('/Images/001.png');
  const [contentDescription, setContentDescription] = useState('contentDescription');
  const [authorName, setAuthorName] = useState('authorName');
  const [chatCount, setChatCount] = useState(0);
  const [chatUserCount, setChatUserCount] = useState(0);
  const [tagList, setTaglist] = useState<string[]>(['tag1', 'tag2']);
  const [authorComment, setAuthorComment] = useState('authorComment');
  const [recommendContentList, setRecommendContentList] = useState<recommendContentInfo[]>([]);

  const [chapters, setChapters] = useState<{id: number; name: string}[]>([]);
  const [episodes, setEpisodes] = useState<{id: number; name: string}[]>([]);

  const [episodeItems, setEpisodeItems] = useState<EpisodeCardProps[]>([]);

  useEffect(() => {
    const chattingState: ChattingState = {
      contentName: `content episode${episodeId}`,
      episodeName: `episode${episodeId}`,
      episodeId: Number(episodeId),
    };
    dispatch(setStateChatting(chattingState));
  }, [episodeId]);

  useEffect(() => {
    if (contentWholeDesc) {
      setContentName(contentWholeDesc.publishInfo.contentName);
      setContentThumbnail(contentWholeDesc.chapterInfoList[0].episodeInfoList[0].thumbnailList[0]); //.publishInfo.thumbnail
      setContentDescription(contentWholeDesc.publishInfo.contentDescription);
      setAuthorName(contentWholeDesc.publishInfo.authorName);
      setAuthorComment(contentWholeDesc.publishInfo.authorComment);
      setChatCount(contentWholeDesc.chatCount);
      setChatUserCount(contentWholeDesc.chatUserCount);
      setTaglist(contentWholeDesc.publishInfo.tagList); // SelectTag가 맞음
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
      const req: GetContentByIdReq = {userId: userId, contentId: contentId};
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
          bottom: '5vh',
        },
      }}
    >
      <div className={Style.header}>
        <Typography>{contentName}</Typography>
        <Box>
          <IconButton
            className={Style.headerButton}
            onClick={() => {
              /* Add upload functionality */
            }}
          >
            <UploadIcon />
          </IconButton>
          <IconButton className={Style.headerButton} onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
      </div>
      <main className={Style.content}>
        <CardMedia
          component="img"
          height="200"
          image={contentThumbnail}
          alt={contentName}
          className={Style.imageThumbnail}
          onError={() => setContentThumbnail('/Images/001.png')}
        />
        <Card>
          <CardContent sx={{padding: 1}}>
            <div className={Style.cardProducerArea}>
              <Avatar sx={{bgcolor: 'primary.main', width: 48, height: 48}}>
                {authorName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h6">{authorName}</Typography>
              </Box>
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
            </div>
          </CardContent>
          <Divider className={Style.divider} />
          <CardContent sx={{paddingTop: 1, paddingLeft: 3, paddingRight: 3}}>
            <Box className={Style.tagContainer}>
              {tagList.map((tag, index) => (
                <Chip key={index} label={tag} className={Style.tagChip} />
              ))}
            </Box>

            <Divider className={Style.divider} />
            <Typography variant="h6">Author Comment</Typography>
            <Box className={Style.descriptionBox}>{authorComment}</Box>

            <Typography variant="h6">ContentDescription</Typography>
            <Box className={Style.descriptionBox}>{contentDescription}</Box>

            <Divider className={Style.divider} />
            <Typography variant="h6">Content Recommend</Typography>

            <ContentRecommendList
              recommendContents={recommendContentList}
              onSelectContent={handleRecommendContentSelect}
            />
          </CardContent>
        </Card>
      </main>
      <main className={Style.chatingControlPanel}>
        <Box className={Style.chapterBox}>
          <Typography className={Style.chapterName} variant="h6">
            Chapter
          </Typography>
          <Select
            className={Style.chapterSelect}
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
        <div className={Style.episodeListContainer}>
          <DrawerContentEpisodeItemList episodes={episodeItems} onEpisodeSelect={handleEpisodeSelect} />
        </div>
        <Link href={`/:lang/chat`} className={Style.startNewChatButton}>
          <Button variant="contained" fullWidth>
            Start new chat - episode : {episodeId}
          </Button>
        </Link>
      </main>
    </Drawer>
  );
};

export default DrawerContentDesc;
