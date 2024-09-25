// Router

import React from 'react'
import ContentHeader from './ContentHeader';
import EpisodeSetup from './episode/EpisodeSetup';

import Style from './ContentMain.module.css'

import { useNavigate } from 'react-router-dom';
import ContentBottom from './ContentBottom';
import ContentGimmick from './content-gimmick/ContentGimmick';
import ContentPreviewChat from './content-preview-chat/ContentPreviewChat';
import ContentPublishing from './content-publishing/ContentPublishing';
import ContentDashboard from './content-dashboard/ContentDashboard';

const ContentMain: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <main className={Style.contentMain}>
                <ContentHeader onBack={() => { navigate('/') }} onOpenDrawer={() => { }} />
                <div className={Style.content}>
                    <EpisodeSetup />

                    <ContentDashboard />
                    <ContentGimmick />
                    <ContentPreviewChat />
                    <ContentPublishing />
                </div>
                <ContentBottom />
            </main>
        </>
    )
}

export default ContentMain;