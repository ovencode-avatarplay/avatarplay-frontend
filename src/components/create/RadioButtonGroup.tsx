import React, { useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';

interface RadioButtonGroupProps {
    title: string;
    description: string;
    options: { value: string; label: string }[];
    selectedValue: string;
    onChange: (value: string) => void;
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ title, description, options, selectedValue, onChange }) => {
    const [showDescription, setShowDescription] = useState(false);

    const handleInfoClick = () => {
        setShowDescription((prev) => !prev);
    };

    return (
        <Box marginBottom={3}>
            {/* 타이틀과 Info 버튼 */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{title}</Typography>
                <Button variant="outlined" onClick={handleInfoClick}>
                    Info
                </Button>
            </Box>

            {/* 설명 텍스트 */}
            {showDescription && (
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                    {description}
                </Typography>
            )}

            {/* 라디오 버튼 그룹 */}
            <FormControl component="fieldset" sx={{ marginTop: 2 }}>
                <RadioGroup value={selectedValue} onChange={(e) => onChange(e.target.value)}>
                    {options.map((option) => (
                        <FormControlLabel
                            key={option.value}
                            control={<Radio />}
                            label={option.label}
                            value={option.value}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default RadioButtonGroup;
