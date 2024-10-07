//Drawer
// ContentPublishing.tsx
import React, { useState } from 'react';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import { Box, Drawer, Typography, TextField, Button, Select, MenuItem, Chip, Snackbar, Alert } from '@mui/material';
import Style from './ContentPublishing.module.css';
import tagsData from '@/data/publish-tags.json';
import RadioButtonGroup from '@/components/create/RadioButtonGroup';

interface Props {
    open: boolean;
    onClose: () => void;
    onPublish : () => void;
}

const ContentPublishing: React.FC<Props> = ({ open, onClose /*, onPublish*/ }) => {
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showMoreTags, setShowMoreTags] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [showTagCount, setShowTagCount] = useState(6);

    const [visibility, setVisibility] = useState<string>('private');
    const [monetization, setMonetization] = useState<string>('on');
    const [NSFW, setNSFW] = useState<string>('on');


    const handleTagSelect = (tag: string) => {
        if (selectedTags.length >= 7) {
            setOpenSnackbar(true); // 경고 메시지 표시
            return;
        }
        setSelectedTags((prev) => [...prev, tag]);
    };

    const handleTagRemove = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    const handleMoreTagsToggle = () => {
        setShowMoreTags((prev) => !prev);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: '100vw', height: '100vh' },
            }}
        >
            <Box className={Style.drawerContainer}>
                <CreateDrawerHeader title='Publishing Setup' onClose={onClose} />

                {/* 첫 번째 설정 박스 */}
                <Box className={Style.settingBox}>
                    <Typography variant="h6">Language Select</Typography>
                    <Select fullWidth variant="outlined">
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="ko">Korean</MenuItem>
                        <MenuItem value="ar">Arab</MenuItem>
                        {/* 다른 언어 추가 가능 */}
                    </Select>

                    <Typography variant="subtitle1" className={Style.label}>Content Introduction</Typography>
                    <TextField fullWidth multiline rows={3} variant="outlined" />

                    <Typography variant="subtitle1" className={Style.label}>Creator's Comment</Typography>
                    <TextField fullWidth multiline rows={3} variant="outlined" />
                </Box>

                {/* 두 번째 설정 박스 */}
                <Box className={Style.settingBox}>
                    <Typography variant="h6">Content Tag</Typography>

                    <Box display="flex" alignItems="center" justifyContent="right" className={Style.tagContainer}>
                        {selectedTags.length > 0 ? null : (
                            <Typography variant="body2" color="textSecondary" sx={{ padding: '8px' }}>
                                Please Select 1~7 Tags
                            </Typography>
                        )}
                        <Button variant="contained" onClick={() => setSelectedTags([])} sx={{ marginLeft: '16px' }}>
                            Reset
                        </Button>
                    </Box>
                    <Box display="flex" flexWrap="wrap" sx={{ flexGrow: 1 }}>
                        {
                            selectedTags.map((tag) => (
                                <Chip
                                    key={tag}
                                    label={tag}
                                    onDelete={() => handleTagRemove(tag)}
                                    className={Style.chip}
                                />
                            ))
                        }
                    </Box>
                    {/* 태그 선택 부분 */}
                    <Box className={Style.tagSelect}>
                        {tagsData.slice(0, showTagCount).map((tag) => ( // 첫 6개 태그만 표시
                            <Button
                                key={tag}
                                variant="outlined"
                                onClick={() => handleTagSelect(tag)}
                                disabled={selectedTags.includes(tag)}
                            >
                                {tag}
                            </Button>
                        ))}
                    </Box>

                    {/* 추가적인 태그 내용 */}
                    {showMoreTags && (
                        <Box className={Style.moreTags}>
                            {tagsData.slice(showTagCount).map((tag) => ( // 6개 이후의 태그 표시
                                <Button
                                    key={tag}
                                    variant="outlined"
                                    onClick={() => handleTagSelect(tag)}
                                    disabled={selectedTags.includes(tag)}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </Box>
                    )}

                    {/* More 버튼 */}
                    <Button variant="outlined" onClick={handleMoreTagsToggle}>
                        {showMoreTags ? 'Show Less' : 'More'}
                    </Button>
                </Box>
                {/* 라디오 버튼 그룹 추가 */}
                <RadioButtonGroup
                    title="Visibility"
                    description="공개 설정"
                    options={[
                        { value: 'private', label: 'Private' },
                        { value: 'unlisted', label: 'Unlisted' },
                        { value: 'public', label: 'Public' },
                    ]}
                    selectedValue={visibility}
                    onChange={setVisibility}
                />
                <RadioButtonGroup
                    title="Monetization"
                    description="수익화 제한"
                    options={[
                        { value: 'on', label: 'ON' },
                        { value: 'off', label: 'OFF' },
                    ]}
                    selectedValue={monetization}
                    onChange={setMonetization}
                />
                <RadioButtonGroup
                    title="NSFW"
                    description="성인 컨텐츠"
                    options={[
                        { value: 'on', label: 'ON' },
                        { value: 'off', label: 'OFF' },
                    ]}
                    selectedValue={NSFW}
                    onChange={setNSFW}
                />

                <Button variant="outlined" onClick={ () => {}}>
                    Publish!
                </Button>



                {/* Snackbar 경고 메시지 */}
                <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity="warning">
                        You can only select up to 7 tags!
                    </Alert>
                </Snackbar>
            </Box>
        </Drawer>
    );
};

export default ContentPublishing;
