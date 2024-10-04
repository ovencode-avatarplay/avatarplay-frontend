import React, { useEffect, useState } from 'react';
import ContentHeader from './ContentHeader';
import EpisodeSetup from './episode/EpisodeSetup';

import Style from './ContentMain.module.css';

import ContentBottom from './ContentBottom';
import ContentGimmick from './content-gimmick/ContentGimmick';
import ContentPreviewChat from './content-preview-chat/ContentPreviewChat';
import ContentPublishing from './content-publishing/ContentPublishing';
import ContentDashboard from './content-dashboard/ContentDashboard';
import ChapterBoard from './chapter/ChapterBoard';
import { sendContentSave, SaveContentReq, GetContentReq, sendContentGet } from '@/app/NetWork/MyNetWork';
import ContentInfoManager from './ContentInfoManager';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';
import { setSelectedChapter, setSelectedEpisode, setContentID } from '@/redux-store/slices/ContentSelection'
import DefaultContentInfo from '@/data/create/content-info-data.json';
import {setContentInfo} from '@/redux-store/slices/ContentInfo';
import { ContentInfo } from '@/types/apps/content/contentInfo';

const ContentMain: React.FC = () => {
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isChapterboardOpen, setIsChapterboardOpen] = useState(false);
    const [isGimmickOpen, setIsGimmickOpen] = useState(false);
    const [isPublishingOpen, setIsPublishingOpen] = useState(false);

    const dispatch = useDispatch(); 
    
    const contentInfo = useSelector((state: RootState) => state.content.contentInfo ?? []); // null이면 빈 배열로 대체
    const selectedChapter = useSelector((state: RootState) => state.contentselection.selectedChapter);
    const selectedEpisode = useSelector((state: RootState) => state.contentselection.selectedEpisode);
    const contentID = useSelector((state: RootState) => state.contentselection.contentID);

    const fetchAndSetContentInfo = async () => {
        try {
            const contentIds = [35,36,37];
    
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
    },[])

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
    
    const curContent = contentInfo.find(item => item.id === Number(contentID));

    const defaultSaveContentReq = (): SaveContentReq => ({
        contentInfo: curContent ?? DefaultContentInfo.contentInfo[0],
    });

    const [saveData, setSaveData] = useState<SaveContentReq>(defaultSaveContentReq);

    const handleOpenPublishing = () => {
        sendContentSave(saveData);
        setIsPublishingOpen(true);
    };

    const handleClosePublishing = () => {
        setIsPublishingOpen(false);
    };

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
                    onChapterNameChanged={() => {}} 
                    onEpisodeNameChanged={() => {}} 
                     />
                    <ContentGimmick open={isGimmickOpen} onClose={handleCloseGimmick} />
                    <ContentPreviewChat />
                    <ContentPublishing open={isPublishingOpen} onClose={handleClosePublishing} />
                </div>
                <ContentBottom onGimmickOpen={handleOpenGimmick} onPublishingOpen={handleOpenPublishing} />
            </main>
        </>
    );
};

export default ContentMain;
