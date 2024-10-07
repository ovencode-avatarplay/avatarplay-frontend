import React from 'react';
import { Card, CardContent, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, CardHeader, Avatar, IconButton, Typography, TextField } from '@mui/material';
import styles from './TalkCard.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
interface TalkCardProps {
    card: {
        id: number;
        title: string;
        description: string;
    };
    selectedPriority: string;
    priorities: string[];
    onChange: (event: SelectChangeEvent<string>) => void;
}

const TalkCard: React.FC<TalkCardProps> = ({ card, selectedPriority, priorities, onChange }) => {
    return (
        <Card className={styles.card}>
            <div className={styles.topArea}>
                <FormControl className={styles.formControl} variant="outlined">

                    <Select
                        value={selectedPriority}
                        onChange={onChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Without label' }}
                        sx={{
                            height: '30px',
                        }}
                    >
                        {priorities.map((priority) => (
                            <MenuItem key={priority} value={priority}>
                                {priority}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button className={styles.button1}> delete </Button>
            </div>
            <Card className={styles.cardRect}>
                <Card className={styles.cardTop}>
                    <Avatar src="/path/to/image.jpg" alt="Avatar" className={styles.cardTopImage} />
                    <Typography variant="subtitle2" className={styles.cardTopText}>
                        User's Talk
                    </Typography>
                    <AddCircleOutlineIcon></AddCircleOutlineIcon>
                </Card>
                <Card>
                    <TextField
                        hiddenLabel
                        id="filled-hidden-label-small"
                        defaultValue="Small"
                        variant="filled"
                        size="small"
                    />
                </Card>
            </Card>

        </Card >
    );
};

export default TalkCard;
