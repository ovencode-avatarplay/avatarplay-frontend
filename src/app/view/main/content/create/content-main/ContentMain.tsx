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
    
    const handleOpenPublishing = () => {
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