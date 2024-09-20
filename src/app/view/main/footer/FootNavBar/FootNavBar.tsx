"use client";

import React, { useState } from 'react';
import './FootNavBar.css';
import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import CreateIcon from '@mui/icons-material/AddCircleOutline';
import ContentIcon from '@mui/icons-material/DynamicFeed';
import GameIcon from '@mui/icons-material/SportsEsports';

const FootNavBar = () => {
    const buttons = [
        { label: 'Home', icon: <HomeIcon /> },
        { label: 'Explore', icon: <ExploreIcon /> },
        { label: 'Create', icon: <CreateIcon /> },
        { label: 'Content', icon: <ContentIcon /> },
        { label: 'Game', icon: <GameIcon /> }
    ];

    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleButtonClick = (index: number) => {
        setSelectedIndex(index);
    };

    return (
        <nav className="foot-nav-bar">
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    className={`nav-button ${selectedIndex === index ? 'selected' : ''}`}
                    variant="text"
                    onClick={() => handleButtonClick(index)}
                >
                    <div className="nav-button-content">
                        {button.icon}
                        {button.label}
                    </div>
                </Button>
            ))}
        </nav>
    );
};

export default FootNavBar;
