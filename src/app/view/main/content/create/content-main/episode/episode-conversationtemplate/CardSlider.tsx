import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import styles from './CardSlider.module.css';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import TalkCard from './TalkCard'; // TalkCard 컴포넌트 임포트
import { SelectChangeEvent } from '@mui/material'; // SelectChangeEvent 임포트

const CardSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cards = [
        { id: 1, title: 'Card 1', description: 'Description for Card 1' },
        { id: 2, title: 'Card 2', description: 'Description for Card 2' },
        { id: 3, title: 'Card 3', description: 'Description for Card 3' },
    ];

    const nextCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    };

    const prevCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    };

    const priorities = ['Mandatory', 'Depends on'];
    const [selectedPriority, setSelectedPriority] = useState(priorities[0]);

    const handleChange = (event: SelectChangeEvent<string>) => { // 수정된 부분
        setSelectedPriority(event.target.value as string);
    };

    return (
        <Box className={styles.cardSlider}>
            <Button className={styles.arrowButton} onClick={prevCard}><ArrowBackIos /></Button>
            <Box className={styles.cardsContainer}>
                <Box className={styles.cardsWrapper} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {cards.map((card) => (
                        <TalkCard
                            key={card.id}
                            card={card}
                            selectedPriority={selectedPriority}
                            priorities={priorities}
                            onChange={handleChange}
                        />
                    ))}
                </Box>
            </Box>
            <Button className={styles.arrowButton} onClick={nextCard}><ArrowForwardIos /></Button>
        </Box>
    );
};

export default CardSlider;
