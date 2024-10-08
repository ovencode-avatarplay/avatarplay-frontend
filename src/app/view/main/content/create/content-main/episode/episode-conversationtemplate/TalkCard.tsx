// TalkCard.tsx

import React, { useState } from 'react';
import { Card, FormControl, Select, MenuItem, Button, Typography, Avatar, IconButton, Collapse } from '@mui/material';
import styles from './TalkCard.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InputCard from './InputCard';
import { SelectChangeEvent } from '@mui/material';

interface TalkCardProps {
    card: {
        id: number;
        title: string;
        description: string;
    };
    selectedPriority: string;
    priorities: string[];
    onChange: (event: SelectChangeEvent<string>) => void;
    onDeleteInputCard?: (id: number) => void;
}

const TalkCard: React.FC<TalkCardProps> = ({ card, selectedPriority, priorities, onChange, onDeleteInputCard }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [inputCards, setInputCards] = useState([{ id: 1, value: "Small" }]);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const addInputCard = () => {
        setInputCards((prev) => [
            ...prev,
            { id: prev.length + 1, value: "New Value" }
        ]);
    };

    const handleDeleteInputCard = (id: number) => {
        setInputCards((prev) => prev.filter((card) => card.id !== id));
        if (onDeleteInputCard) {
            onDeleteInputCard(id);
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
                <Button className={styles.button1} onClick={() => onDeleteInputCard?.(card.id)}>delete</Button>
            </div>

            <div className={styles.divBox}>
                <div className={styles.innerBox}>
                    <Card className={styles.cardTop}>
                        <Avatar src="/path/to/image.jpg" alt="Avatar" className={styles.cardTopImage} />
                        <Typography variant="subtitle2" className={styles.cardTopText} onClick={toggleExpand} style={{ cursor: 'pointer' }}>
                            User's Talk
                        </Typography>
                        <IconButton onClick={addInputCard}>
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Card>

                    <Card className={styles.cardRect}>
                        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <div>
                                {inputCards.map((inputCard) => (
                                    <div key={inputCard.id} style={{ paddingBottom: '10px' }}>
                                        <InputCard
                                            defaultValue={inputCard.value}
                                            onDelete={() => handleDeleteInputCard(inputCard.id)}
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
