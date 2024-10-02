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

    
    const foundContent = contentInfo.find(item => item.id === Number(contentID));

    const defaultSaveContentReq = (): SaveContentReq => ({
        contentInfo: foundContent ?? DefaultContentInfo.contentInfo[0],
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
    };
    const handleChapterNameChange = (newName: string) => {

    };

    const handleEpisodeNameChange = (newName: string) => {

    };


    return (
        <>
            <main className={Style.contentMain}>
                <ContentInfoManager />
                <>curChapterIndex {selectedChapter}</>
                <>curEpisodeIndex {selectedEpisode}</>
                <ContentHeader contentTitle={foundContent?.publishInfo.contentName ?? ''} onOpenDrawer={handleOpenDashboard} />
                <div className={Style.content}>
                    <EpisodeSetup onDrawerOpen={handleOpenChapterboard} 
                        contentId={foundContent?.id ?? 0}
                        chapterIndex={selectedChapter ?? 0}
                        episodeIndex={selectedEpisode?.episodeId ?? 0}
                    />

                    <ContentDashboard
                        open={isDashboardOpen}
                        onClose={handleCloseDashboard}
                        onSelectItem={handleItemSelect} 
                        
                    />
                    <ChapterBoard 
                    open={isChapterboardOpen} 
                    onClose={handleCloseChapterboard}
                    initialChapters={foundContent?.chapterInfoList || []}
                    onChapterNameChanged={handleChapterNameChange} 
                    onEpisodeNameChanged={handleEpisodeNameChange} 
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
