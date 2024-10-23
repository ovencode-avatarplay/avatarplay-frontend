'use client';

import React, {useEffect, useState} from 'react';
import {RootState} from '@/redux-store/ReduxStore';
import {useDispatch, useSelector} from 'react-redux';
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
} from '@mui/material';
import {
  closeDrawerContentDesc,
  openDrawerContentId,
  setDrawerEpisodeId,
} from '@/redux-store/slices/drawerContentDescSlice';
import Style from './DrawerContentDesc.module.css';
import {setStateChatting, ChattingState} from '@/redux-store/slices/chatting';
import Link from 'next/link';
import {
  GetContentByIdReq,
  GetContentByIdRes,
  sendContentByIdGet,
  recommendContentInfo,
} from '@/app/NetWork/ContentNetwork';
import DrawerContentEpisodeItemList from './ContentEpisodeList';
import {EpisodeCardProps} from '@/types/apps/episode-card-type';
import ContentRecommendList from './ContentRecommendList';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';

const DrawerContentDesc = () => {
  const {open, contentId, episodeId: episodeId} = useSelector((state: RootState) => state.drawerContentDesc);
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(-1);
  const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState<number>(-1);
  const userId = useSelector((state: RootState) => state.user.userId);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [contentDesc, setContentDesc] = useState<GetContentByIdRes>();

  // Content, Chapter, Episode 혼동 때문에 Name, Thumbnail은 접두사
  const [contentName, setContentName] = useState('contentName');
  const [contentThumbnail, setContentThumbnail] = useState('/Images/001.png');
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
    if (contentDesc != null) {
      setContentName(contentDesc.publishInfo.contentName);
      setContentThumbnail(contentDesc.publishInfo.thumbnail);
      setAuthorName(contentDesc.publishInfo.authorName);
      setAuthorComment(contentDesc.publishInfo.authorComment);
      setChatCount(contentDesc.chatCount);
      setChatUserCount(contentDesc.chatUserCount);
      setTaglist(contentDesc.publishInfo.tagList); // SelectTag가 맞음
      if (contentDesc.chapterInfoList) {
        const chaptersData = contentDesc.chapterInfoList?.map(chapter => ({
          id: chapter.id,
          name: chapter.name,
        }));
        setChapters(chaptersData);
      }
      setSelectedChapterIdx(0);
      setRecommendContentList(contentDesc.recommandContentInfoList);
      setSelectedEpisodeIdx(0);
      setEpisodes(contentDesc.chapterInfoList[0].episodeInfoList);
      dispatch(setDrawerEpisodeId(contentDesc.chapterInfoList[0].episodeInfoList[0].id));
    }
  }, [contentDesc]);

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
    if (contentDesc) {
      setSelectedEpisodeIdx(0);
      const selectedChapter = contentDesc.chapterInfoList[selectedChapterIdx];
      const updatedEpisodeItems = selectedChapter.episodeInfoList?.map(episode => ({
        episodeId: episode.id,
        intimacy: 111,
        imageCount: 222,
        thumbnail: episode.thumbnail,
        name: episode.name,
      }));
      setEpisodeItems(updatedEpisodeItems); // 에피소드 리스트 업데이트
    }
  }, [selectedChapterIdx, contentDesc]);

  // Explore 에서 선택한 컨텐츠를 Id로 가져옴 (Play사이클 채팅 진입에서 사용하기 위함)
  const GetContentByContentId = async (contentId: number) => {
    setLoading(true);

    try {
      const req: GetContentByIdReq = {userId: userId, contentId: contentId};
      const response = await sendContentByIdGet(req);

      if (response?.data) {
        setContentDesc(response.data);
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
          height: '90vh',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden',
        },
      }}
    >
      <div className={Style.header}>
        <Typography>{contentName}</Typography>
        <div>
          <Button
            variant="outlined"
            onClick={() => {
              /* Add upload functionality */
            }}
          >
            Upload
          </Button>
          <Button variant="outlined" onClick={() => dispatch(closeDrawerContentDesc())}>
            Close
          </Button>
        </div>
      </div>
      <main className={Style.content}>
        <CardMedia
          component="img"
          height="200"
          image={contentThumbnail}
          alt={contentName}
          className={Style.imageThumbnail}
        />
        <Card elevation={3} sx={{borderRadius: 2, padding: 2}}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={5}>
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
            </Stack>
          </CardContent>
        </Card>

        <Card className={Style.tagCard}>
          <CardContent>
            <Typography variant="h6">Publishing Tags</Typography>
            <Box className={Style.tagContainer}>
              {tagList.map((tag, index) => (
                <Chip key={index} label={tag} className={Style.tagChip} />
              ))}
            </Box>

            <Divider className={Style.divider} />
            <Typography variant="h6">Author Comment</Typography>
            <Box className={Style.descriptionBox}>{authorComment}</Box>

            <Divider className={Style.divider} />
            <Typography variant="h6">Content Recommend</Typography>
            <Box className={Style.descriptionBox}>
              <ContentRecommendList
                recommendContents={recommendContentList}
                onSelectContent={handleRecommendContentSelect}
              />
            </Box>
          </CardContent>
        </Card>
      </main>
      <main className={Style.chatingControlPanel}>
        <Box className={Style.chapterBox}>
          <Typography variant="h6">Chapter</Typography>
          <Select
            className={Style.chapterSelect}
            value={selectedChapterIdx}
            onChange={e => setSelectedChapterIdx(parseInt(e.target.value as string))}
            displayEmpty
            fullWidth
          >
            {chapters.map((chapter, index) => (
              <MenuItem key={chapter.id} value={index}>
                {chapter.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <DrawerContentEpisodeItemList episodes={episodeItems} onEpisodeSelect={handleEpisodeSelect} />
        <Link href={`/:lang/chat`}>
          <Button className={Style.startNewChatButton} variant="contained" fullWidth>
            Start new chat - episode : {episodeId}
          </Button>
        </Link>
      </main>
    </Drawer>
  );
};

export default DrawerContentDesc;
