import React, { useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';

interface RadioButtonGroupProps {
    title: string;
    description: string;
    options: { value: string | number | boolean; label: string }[];
    selectedValue: string | number | boolean;
    onChange: (value: string | number | boolean) => void; 
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ title, description, options, selectedValue, onChange }) => {
    const [showDescription, setShowDescription] = useState(false);

    const handleInfoClick = () => {
        setShowDescription((prev) => !prev);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        // value가 boolean 또는 number일 수 있으므로, 기본 string을 파싱하여 처리
        if (value === 'true' || value === 'false') {
            onChange(value === 'true'); 
        } else if (!isNaN(Number(value))) {
            onChange(Number(value)); 
        } else {
            onChange(value);
        }
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
                <RadioGroup value={String(selectedValue)} onChange={handleChange}>
                    {options.map((option) => (
                        <FormControlLabel
                            key={String(option.value)}
                            control={<Radio />}
                            label={option.label}
                            value={String(option.value)}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </Box>
    );
};

export default RadioButtonGroup;
