// Router

import React from 'react'
import ContentHeader from './ContentHeader';
import EpisodeSetup from './episode/EpisodeSetup';

import { useNavigate } from 'react-router-dom';
import ContentBottom from './ContentBottom';

const ContentMain: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <ContentHeader onBack={() => {navigate('/') }} onOpenDrawer={() => { }} />
            <EpisodeSetup />
            <ContentBottom/>
        </>
    )
}

export default ContentMain;