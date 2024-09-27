// Router

import React, { useState } from 'react'
import ContentHeader from './ContentHeader';
import EpisodeSetup from './episode/EpisodeSetup';

import Style from './ContentMain.module.css'

import ContentBottom from './ContentBottom';
import ContentGimmick from './content-gimmick/ContentGimmick';
import ContentPreviewChat from './content-preview-chat/ContentPreviewChat';
import ContentPublishing from './content-publishing/ContentPublishing';
import ContentDashboard from './content-dashboard/ContentDashboard';
import ChapterBoard from './chapter/ChapterBoard';
import {sendContentSave, SaveContentReq, SaveContentRes} from '@/app/NetWork/MyNetWork'
import { contentInfo } from '@/types/apps/content/contentInfo';
import { publishInfo } from '@/types/apps/content/chapter/publishInfo';

const ContentMain: React.FC = () => {
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isChapterboardOpen, setIsChapterboardOpen] = useState(false);
    const [isGimmickOpen, setIsGimmickOpen] = useState(false);
    const [isPublishingOpen, setIsPublishingOpen] = useState(false);

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

    const defaultContentInfo = (): contentInfo => ({
        id: 1111,
        chapterInfoList: [], // TODO 기본값 설정
        publishInfo: defaultPublishInfo()
    });
    const defaultPublishInfo = (): publishInfo => ({
        languageType: 0,
        contentName: 'test name',
        thumbnail: 'test thumbnail',
        contentDescription: 'test desc',
        authorComment: 'test comment',
        visibilityType: 0,
        monetization: true,
        nsfw: 0
    });

    const defaultSaveContentReq = (): SaveContentReq => ({
        userID: 7,                  // 7번 유저가 테스트 가능
        contentInfo: defaultContentInfo(),  // contentInfo의 디폴트 값 사용
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
                <ContentHeader onOpenDrawer={handleOpenDashboard} />
                <div className={Style.content}>
                    <EpisodeSetup onDrawerOpen={handleOpenChapterboard}/>

                    <ContentDashboard open={isDashboardOpen} onClose={handleCloseDashboard}/>
                    <ChapterBoard open={isChapterboardOpen} onClose={handleCloseChapterboard} />
                    <ContentGimmick open={isGimmickOpen} onClose={handleCloseGimmick}/>
                    <ContentPreviewChat />
                    <ContentPublishing open={isPublishingOpen} onClose={handleClosePublishing}/>
                </div>
                <ContentBottom onGimmickOpen = {handleOpenGimmick} onPublishingOpen={handleOpenPublishing}/>
            </main>
        </>
    )
}

export default ContentMain;