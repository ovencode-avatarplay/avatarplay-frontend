import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import styles from './CardSlider.module.css';
import { ArrowForwardIos, ArrowBackIos } from '@mui/icons-material';
import TalkCard from './TalkCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux-store/ReduxStore';
import { addConversationTalk, updateConversationTalk, removeConversationTalk } from '@/redux-store/slices/conversationTalk';
import { SelectChangeEvent } from '@mui/material';
import {  ConversationPriortyType, ConversationTalkType } from '@/types/apps/dataTypes';
import { Conversation } from '@/types/apps/content/episode/conversation';


const CardSlider: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const conversationList = useSelector((state: RootState) => state.conversationTalk.conversationList);

    const [currentIndex, setCurrentIndex] = useState(0);
    const priorities = ['Mandatory', 'Depends on'];
    const [selectedPriority, setSelectedPriority] = useState(priorities[0]);

    const nextCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % conversationList.length);
    };

    const prevCard = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + conversationList.length) % conversationList.length);
    };

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedPriority(event.target.value as string);
    };

    const addTalkCard = () => {
        const newCard = {
            user: [{ type: ConversationTalkType.Speech, talk: 'New User Talk' }],
            character: [{ type: ConversationTalkType.Action, talk: 'New Character Talk' }],
            conversationTpye: ConversationPriortyType.Mandatory,
        };
        dispatch(addConversationTalk(newCard));
        setCurrentIndex(conversationList.length); // 새 카드를 추가하고 해당 카드로 이동
    };

    const deleteTalkCard = (id: number) => {
        dispatch(removeConversationTalk(id));
        setCurrentIndex((prevIndex) => Math.max(0, Math.min(prevIndex, conversationList.length - 2)));
    };

    const updateUserTalk = (conversationIndex: number, itemIndex: number, value: string) => {
        dispatch(updateConversationTalk({
            conversationIndex,
            itemIndex,
            type: 'user',
            newTalk: value,
        }));
    };

    const updateCharacterTalk = (conversationIndex: number, itemIndex: number, value: string) => {
        dispatch(updateConversationTalk({
            conversationIndex,
            itemIndex,
            type: 'character',
            newTalk: value,
        }));
    };

    return (
        <Box className={styles.body}>
            <Box className={styles.cardSlider}>
                <Button className={styles.arrowButton} onClick={prevCard}><ArrowBackIos /></Button>
                <Box className={styles.cardsContainer}>
                    <Box className={styles.cardsWrapper} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {conversationList.map((card, index) => (
                            <TalkCard
                                key={card.id}
                                card={{ id: card.id, title: `Card ${card.id + 1}`, description: card.user[0]?.talk || '' }}
                                selectedPriority={selectedPriority}
                                priorities={priorities}
                                onChange={handleChange}
                                onDelete={() => deleteTalkCard(card.id)}
                                updateUserTalk={(itemIndex: number, value: string) => updateUserTalk(card.id, itemIndex, value)}
                                updateCharacterTalk={(itemIndex: number, value: string) => updateCharacterTalk(card.id, itemIndex, value)}
                            />
                        ))}
                    </Box>
                </Box>
                <Button className={styles.arrowButton} onClick={nextCard}><ArrowForwardIos /></Button>
            </Box>
            <Button className={styles.buttonAdd} onClick={addTalkCard}>Add Conversation</Button>
        </Box>
    );
};

export default CardSlider;
