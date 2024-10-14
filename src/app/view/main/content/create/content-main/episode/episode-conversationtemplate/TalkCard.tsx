import React, { useState } from 'react';
import { Card, FormControl, Select, MenuItem, Button, Typography, Avatar, IconButton, Collapse } from '@mui/material';
import styles from './TalkCard.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InputCard from './InputCard';
import { SelectChangeEvent } from '@mui/material';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux-store/ReduxStore';
import { updateConversationTalk, addConversationTalkItem, removeConversationItem } from '@/redux-store/slices/conversationTalk';
import { Conversation } from '@/types/apps/content/episode/conversation';

interface TalkCardProps {
    card: {
        id: number;
        title: string;
        description: string;
    };
    selectedPriority: string;
    priorities: string[];
    onChange: (event: SelectChangeEvent<string>) => void;
    onDelete: (id: number) => void;
    updateUserTalk: (itemIndex: number, value: string) => void;
    updateCharacterTalk: (itemIndex: number, value: string) => void;
}

const TalkCard: React.FC<TalkCardProps> = ({ card, selectedPriority, priorities, onChange, onDelete, updateUserTalk, updateCharacterTalk }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isExpanded, setIsExpanded] = useState(true);
    
    // Conversation 구조를 사용한 상태 관리
    const [userInputCards, setUserInputCards] = useState<Conversation[]>([
        { conversationType: 1, user: "User Talk", character: "" }
    ]);
    const [characterInputCards, setCharacterInputCards] = useState<Conversation[]>([
        { conversationType: 2, user: "", character: "Character Talk" }
    ]);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const addUserInputCard = () => {
        const newUserTalk: Conversation = {
            conversationType: 1,
            user: `New User Talk ${userInputCards.length + 1}`,
            character: "",
        };

        // 로컬 상태 업데이트
        setUserInputCards((prev) => [...prev, newUserTalk]);

        // Redux 상태 업데이트
        dispatch(addConversationTalkItem({
            conversationIndex: card.id,
            type: 'user',
            newTalk: newUserTalk.user,
        }));
    };

    const addCharacterInputCard = () => {
        const newCharacterTalk: Conversation = {
            conversationType: 2,
            user: "",
            character: `New Character Talk ${characterInputCards.length + 1}`,
        };

        // 로컬 상태 업데이트
        setCharacterInputCards((prev) => [...prev, newCharacterTalk]);

        // Redux 상태 업데이트
        dispatch(addConversationTalkItem({
            conversationIndex: card.id,
            type: 'character',
            newTalk: newCharacterTalk.character,
        }));
    };

    const handleUpdateInputCard = (type: 'user' | 'character', index: number, value: string) => {
        if (type === 'user') {
            setUserInputCards((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], user: value };
                return updated;
            });
            dispatch(updateConversationTalk({
                conversationIndex: card.id,
                itemIndex: index,
                type: 'user',
                newTalk: value,
            }));
        } else {
            setCharacterInputCards((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index], character: value };
                return updated;
            });
            dispatch(updateConversationTalk({
                conversationIndex: card.id,
                itemIndex: index,
                type: 'character',
                newTalk: value,
            }));
        }
    };

    const handleDeleteInputCard = (type: 'user' | 'character', index: number) => {
        if (type === 'user') {
            setUserInputCards((prev) => {
                const updated = [...prev];
                updated.splice(index, 1); // 해당 인덱스를 제거
                return updated;
            });

            dispatch(removeConversationItem({
                conversationIndex: card.id,
                itemIndex: index,
                type: 'user',
            }));
        } else {
            setCharacterInputCards((prev) => {
                const updated = [...prev];
                updated.splice(index, 1); // 해당 인덱스를 제거
                return updated;
            });

            dispatch(removeConversationItem({
                conversationIndex: card.id,
                itemIndex: index,
                type: 'character',
            }));
        }
    };

    return (
        <Card className={styles.card}>
            <div className={styles.topArea}>
                <FormControl className={styles.formControl} variant="outlined">
                    <Select
                        value={selectedPriority}
                        onChange={onChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{ height: '30px' }}
                    >
                        {priorities.map((priority) => (
                            <MenuItem key={priority} value={priority}>
                                {priority}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button className={styles.button1} onClick={() => onDelete(card.id)}>delete</Button>
            </div>

            {/* User's Talk */}
            <div className={styles.divBox}>
                <div className={styles.innerBox}>
                    <Card className={styles.cardTop}>
                        <Avatar src="/path/to/image.jpg" alt="Avatar" className={styles.cardTopImage} />
                        <Typography variant="subtitle2" className={styles.cardTopText} onClick={toggleExpand} style={{ cursor: 'pointer' }}>
                            User's Talk
                        </Typography>
                        <IconButton onClick={addUserInputCard}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Card>
                    <Card className={styles.cardRect}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <div>
                                {userInputCards.map((inputCard, index) => (
                                    <div key={index} style={{ paddingBottom: '10px' }}>
                                        <InputCard
                                            defaultValue={inputCard.user}
                                            onChange={(value) => handleUpdateInputCard('user', index, value)}
                                            onDelete={() => handleDeleteInputCard('user', index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Collapse>
                    </Card>
                </div>

                <br />

                {/* Character's Talk */}
                <div className={styles.innerBox}>
                    <Card className={styles.cardTop}>
                        <Avatar src="/path/to/image.jpg" alt="Avatar" className={styles.cardTopImage} />
                        <Typography variant="subtitle2" className={styles.cardTopText} onClick={toggleExpand} style={{ cursor: 'pointer' }}>
                            Character's Talk
                        </Typography>
                        <IconButton onClick={addCharacterInputCard}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Card>
                    <Card className={styles.cardRect}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <div>
                                {characterInputCards.map((inputCard, index) => (
                                    <div key={index} style={{ paddingBottom: '10px' }}>
                                        <InputCard
                                            defaultValue={inputCard.character}
                                            onChange={(value) => handleUpdateInputCard('character', index, value)}
                                            onDelete={() => handleDeleteInputCard('character', index)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Collapse>
                    </Card>
                </div>
            </div>
        </Card>
    );
};

export default TalkCard;
