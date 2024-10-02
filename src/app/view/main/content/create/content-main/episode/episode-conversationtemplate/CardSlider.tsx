// CardSlider.tsx
import React, { useState } from 'react';
import { Box, Button, Card, CardContent } from '@mui/material';
import styles from './CardSlider.module.css';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';

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

    return (
        <Box className={styles.cardSlider}>
            <Button onClick={prevCard}><ArrowBackIos /></Button>
            <Box className={styles.cardsContainer}>
                <Box className={styles.cardsWrapper} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {cards.map((card) => (
                        <Card key={card.id} className={styles.card}>
                            <CardContent>
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
            <Button onClick={nextCard}><ArrowForwardIos /></Button>
        </Box>
    );
};

export default CardSlider;
