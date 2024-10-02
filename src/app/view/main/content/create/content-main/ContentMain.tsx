import React, { useState } from 'react';
import ContentHeader from './ContentHeader';
import EpisodeSetup from './episode/EpisodeSetup';

import Style from './ContentMain.module.css';

import ContentBottom from './ContentBottom';
import ContentGimmick from './content-gimmick/ContentGimmick';
import ContentPreviewChat from './content-preview-chat/ContentPreviewChat';
import ContentPublishing from './content-publishing/ContentPublishing';
import ContentDashboard from './content-dashboard/ContentDashboard';
import ChapterBoard from './chapter/ChapterBoard';
import { sendContentSave, SaveContentReq } from '@/app/NetWork/MyNetWork';
import ContentInfoManager from './ContentInfoManager';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';
import DefaultContentInfo from '@/data/create/content-info-data.json';

const ContentMain: React.FC = () => {
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isChapterboardOpen, setIsChapterboardOpen] = useState(false);
    const [isGimmickOpen, setIsGimmickOpen] = useState(false);
    const [isPublishingOpen, setIsPublishingOpen] = useState(false);
    const [curChapterID, setCurChapterID] = useState<number>(1);

    const contentInfo = useSelector((state: RootState) => state.content.contentInfo ?? []); // null이면 빈 배열로 대체

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


    // 현재 챕터 ID로 콘텐츠를 찾음
    const foundContent = contentInfo.find(item => item.id === Number(curChapterID));

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

    return (
        <>
            <main className={Style.contentMain}>
                <ContentInfoManager />
                <ContentHeader onOpenDrawer={handleOpenDashboard} />
                <div className={Style.content}>
                    <EpisodeSetup onDrawerOpen={handleOpenChapterboard} />

                    <ContentDashboard open={isDashboardOpen} onClose={handleCloseDashboard} />
                    <ChapterBoard open={isChapterboardOpen} onClose={handleCloseChapterboard} />
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
