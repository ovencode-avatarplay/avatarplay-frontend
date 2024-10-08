import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import styles from './CardSlider.module.css';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import TalkCard from './TalkCard';
import { SelectChangeEvent } from '@mui/material';

const CardSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cards, setCards] = useState([
        { id: 1, title: 'Card 1', description: 'Description for Card 1' },
        { id: 2, title: 'Card 2', description: 'Description for Card 2' },
        { id: 3, title: 'Card 3', description: 'Description for Card 3' },
    ]);

    const priorities = ['Mandatory', 'Depends on'];
    const [selectedPriority, setSelectedPriority] = useState(priorities[0]);

    const nextCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    };

    const prevCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    };

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedPriority(event.target.value as string);
    };

    const addTalkCard = () => {
        const newCard = {
            id: cards.length + 1,
            title: `Card ${cards.length + 1}`,
            description: `Description for Card ${cards.length + 1}`,
        };
        setCards((prevCards) => [...prevCards, newCard]);
    };

    const deleteTalkCard = (id: number) => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== id));
        // 현재 인덱스가 삭제된 카드의 인덱스와 같거나 큰 경우 이전 카드로 이동
        setCurrentIndex((prevIndex) => Math.max(0, Math.min(prevIndex, cards.length - 2)));
    };

    return (
        <Box className={styles.body}>
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
                                onDeleteInputCard={() => deleteTalkCard(card.id)} // TalkCard 삭제 함수 연결
                            />
                        ))}
                    </Box>
                </Box>
                <Button className={styles.arrowButton} onClick={nextCard}><ArrowForwardIos /></Button>
            </Box>
            <br></br>
            <Button className={styles.buttonAdd} onClick={addTalkCard}>Add Conversation</Button>
        </Box>
    );
};

export default CardSlider;
