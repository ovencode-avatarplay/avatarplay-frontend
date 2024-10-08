import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';

import Style from './ContentMain.module.css';

// 디버그용 컴포넌트
import ContentInfoManager from './ContentInfoManager';

// 항상 보여지는 컴포넌트
import ContentHeader from './ContentHeader';
import EpisodeSetup from './episode/EpisodeSetup';
import ContentBottom from './ContentBottom';

// 상황에 따라 나타나는 컴포넌트
import ContentGimmick from './content-gimmick/ContentGimmick';
import ContentPreviewChat from './content-preview-chat/ContentPreviewChat';
import ContentPublishing from './content-publishing/ContentPublishing';
import ContentDashboard from './content-dashboard/ContentDashboard';
import ChapterBoard from './chapter/ChapterBoard';

// 네트워크
import { sendContentSave, SaveContentReq, GetContentReq, sendContentGet } from '@/app/NetWork/ContentNetwork';

// Redux
import { setSelectedChapter, setSelectedEpisode, setContentID } from '@/redux-store/slices/ContentSelection'
import { setContentInfo, updateContentInfo } from '@/redux-store/slices/ContentInfo';
import { setCurrentEpisodeInfo } from '@/redux-store/slices/EpisodeInfo';

// Interface
import { ContentInfo } from '@/types/apps/content/contentInfo';

// Json
import DefaultContentInfo from '@/data/create/content-info-data.json';


const ContentMain: React.FC = () => {
    const dispatch = useDispatch();

    // 컴포넌트 오픈 상태
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isChapterboardOpen, setIsChapterboardOpen] = useState(false);
    const [isGimmickOpen, setIsGimmickOpen] = useState(false);
    const [isPublishingOpen, setIsPublishingOpen] = useState(false);


    // Redux
    const contentInfo = useSelector((state: RootState) => state.content.contentInfo ?? []); // null이면 빈 배열로 대체
    const selectedChapter = useSelector((state: RootState) => state.contentselection.selectedChapter);
    const selectedEpisode = useSelector((state: RootState) => state.contentselection.selectedEpisode);
    
    // 이전에 로드된 selectedChapter와 selectedEpisode를 저장하기 위한 ref
    const prevChapterRef = useRef<number | null>(null);
    const prevEpisodeRef = useRef<number | null>(null);
    
    const contentID = useSelector((state: RootState) => state.contentselection.contentID);

    const editedChapterBoard = useSelector((state: RootState) => state.chapterBoard);
    const editedPublishInfo = useSelector((state: RootState) => state.publish);
    const editedEpisode = useSelector((state: RootState) => state.episode);

    const defaultContentInfo: ContentInfo = DefaultContentInfo.contentInfo[0] as ContentInfo;
    const curContent = contentInfo.find(item => item.id === Number(contentID)) ?? defaultContentInfo;
    
    const targetContent = curContent ? { ...curContent } : { ...defaultContentInfo };

    const fetchAndSetContentInfo = async () => {
        try {
            const contentIds = [42, 41, 36, 37];

            const contentPromises = contentIds.map(async (id) => {
                const req: GetContentReq = { contentId: id };
                const response = await sendContentGet(req);

                if (response?.data?.contentInfo) {
                    return response.data.contentInfo;
                } else {
                    throw new Error("No contentInfo in response");
                }
            });

            const contentData: ContentInfo[] = await Promise.all(contentPromises);

            dispatch(setContentInfo(contentData));

        } catch (error) {
            console.error('Error fetching content info:', error);
        }
    };

    useEffect(() => {
        fetchAndSetContentInfo();
    }, [])

    useEffect(() => {
        // Chapterboard가 열리면 챕터 또는 에피소드를 변경하겠다는 의사로 인식해서 현재까지 수정한 정보를 현재 에피소드에 저장.
        if (isChapterboardOpen) {
            saveEpisodeData(); 
        }
    }, [isChapterboardOpen]);

    const handleOpenDashboard = () => {
        setIsDashboardOpen(true);
    };

    const handleCloseDashboard = () => {
        setIsDashboardOpen(false);
    };

    const handleOpenChapterboard = () => {
        setIsChapterboardOpen(true);
    };
    const handleCloseChapterboard = () => {
        setIsChapterboardOpen(false);
    };

    const handleOpenGimmick = () => {
        setIsGimmickOpen(true);
    };
    const handleCloseGimmick = () => {
        setIsGimmickOpen(false);
    };

    const defaultSaveContentReq = (): SaveContentReq => ({
        contentInfo: curContent ?? defaultContentInfo,
    });

    const [saveData, setSaveData] = useState<SaveContentReq>(defaultSaveContentReq);

    const handleOpenPublishing = () => {
        setIsPublishingOpen(true);
    };

    const handleClosePublishing = () => {
        setIsPublishingOpen(false);
    };

    const handlePublish = () =>
    {
        if (!curContent) {
            console.error("No content selected.");
            return;
        }

        if (!editedPublishInfo) {
            console.error("No editedPublishInfo available.");
            return;
        }

        saveEpisodeData();
        
        const updatedContent = {
            ...targetContent, 
            publishInfo: { ...editedPublishInfo },
        };
    
        const tmp: SaveContentReq = {
            contentInfo: updatedContent,
        };    
    
        setSaveData(tmp);
        sendContentSave(tmp);
    }

    const handleItemSelect = (id: number) => {
        dispatch(setContentID(id));

        const content = contentInfo.find(item => item.id === id);

        if (content) {
            if (id < 0) {
                console.error("Invalid content ID:", id);
                return;
            }
            const chapterInfoList = content.chapterInfoList;

            if (!chapterInfoList || chapterInfoList.length === 0) {
                console.error("No chapters available for content ID:", id);
                return;
            }

            let firstChapter = chapterInfoList[0].id;
            dispatch(setSelectedChapter(firstChapter));

            let firstEpisode = chapterInfoList[0].episodeInfoList[0]?.id; // Ensure episodes are available
            if (firstEpisode) {
                dispatch(setSelectedEpisode(firstEpisode));
            } else {
                console.error("No episodes available for the first chapter of content ID:", id);
            }
        }
    };
    
    // 에피소드 로드 함수
    const loadEpisodeData = () => {
        const chapter = targetContent.chapterInfoList.find(chapter => chapter.id === selectedChapter);

        if (chapter) {
            const episode = chapter.episodeInfoList.find(episode => episode.id === selectedEpisode);
            if (episode) {
                // Redux에 현재 선택된 에피소드 데이터 업데이트
                dispatch(setCurrentEpisodeInfo(episode));
            } else {
                console.error("Episode not found with id:", selectedEpisode);
            }
        } else {
            console.error("Chapter not found with id:", selectedChapter);
        }
    };

    // selectedChapter 또는 selectedEpisode가 변경될 때마다 호출
    useEffect(() => {
        // selectedChapter 또는 selectedEpisode가 이전 값과 다를 때만 호출
        if (
            selectedChapter !== prevChapterRef.current || 
            selectedEpisode !== prevEpisodeRef.current
        ) {
            if (selectedChapter !== null && selectedEpisode !== null) {
                loadEpisodeData(); // 새로운 에피소드 로드
                // 이전 값을 갱신
                prevChapterRef.current = selectedChapter;
                prevEpisodeRef.current = selectedEpisode;
            }
        }
    }, [selectedChapter, selectedEpisode]);

    function saveEpisodeData() {
        // selectedChapter와 일치하는 챕터를 찾기
        const chapterIndex = targetContent.chapterInfoList.findIndex(chapter => chapter.id === selectedChapter);
        
        if (chapterIndex !== -1) {
            const chapter = targetContent.chapterInfoList[chapterIndex];
    
            // selectedEpisode와 일치하는 에피소드를 찾기
            const episodeIndex = chapter.episodeInfoList.findIndex(episode => episode.id === selectedEpisode);
    
            if (episodeIndex !== -1) {
                // episodeInfoList 배열을 불변성을 유지하면서 새로운 배열로 업데이트
                const updatedEpisodeList = [
                    ...chapter.episodeInfoList.slice(0, episodeIndex),     // 기존 에피소드 리스트의 앞 부분
                    { ...editedEpisode.currentEpisodeInfo },               // 새로운 에피소드 정보
                    ...chapter.episodeInfoList.slice(episodeIndex + 1)     // 기존 에피소드 리스트의 뒷 부분
                ];
    
                // 수정된 chapter 정보로 업데이트
                const updatedChapter = {
                    ...chapter,
                    episodeInfoList: updatedEpisodeList                    // 새로운 에피소드 리스트 할당
                };
    
                // chapterInfoList 배열도 불변성을 유지하면서 새로운 배열로 업데이트
                const updatedChapterList = [
                    ...targetContent.chapterInfoList.slice(0, chapterIndex),
                    updatedChapter,
                    ...targetContent.chapterInfoList.slice(chapterIndex + 1)
                ];
    
                targetContent.chapterInfoList = updatedChapterList;
    
                // Redux 상태 업데이트
                dispatch(updateContentInfo({
                    id: contentID,                                         // 현재 선택된 콘텐츠 ID
                    chapterInfoList: updatedChapterList,                   // 업데이트된 챕터 정보 리스트
                }));
            } else {
                console.error("Episode not found with id:", selectedEpisode);
            }
        } else {
            console.error("Chapter not found with id:", selectedChapter);
        }
    }
    
    

    return (
        <>
            <main className={Style.contentMain}>
                {/* <ContentInfoManager />
                <p>curContentId {curContent?.id}</p>
                <p>curChapterId {selectedChapter}</p>
                <p>curEpisodeId {selectedEpisode}</p> */}
                <ContentHeader contentTitle={curContent?.publishInfo.contentName ?? ''} onOpenDrawer={handleOpenDashboard} />
                <div className={Style.content}>
                    <EpisodeSetup onDrawerOpen={handleOpenChapterboard}
                        contentId={curContent?.id ?? 0}
                        chapterId={selectedChapter}
                        episodeId={selectedEpisode}
                    />

                    <ContentDashboard
                        open={isDashboardOpen}
                        onClose={handleCloseDashboard}
                        onSelectItem={handleItemSelect}

                    />
                    <ChapterBoard
                        open={isChapterboardOpen}
                        onClose={handleCloseChapterboard}
                        initialChapters={curContent?.chapterInfoList || []}
                    />
                    <ContentGimmick open={isGimmickOpen} onClose={handleCloseGimmick} />
                    <ContentPreviewChat />
                    <ContentPublishing open={isPublishingOpen} onClose={handleClosePublishing} onPublish={handlePublish} contentTag={curContent.publishInfo.contentTag} />
                </div>
                <ContentBottom onGimmickOpen={handleOpenGimmick} onPublishingOpen={handleOpenPublishing} />
            </main>
        </>
    );
};

export default ContentMain;
