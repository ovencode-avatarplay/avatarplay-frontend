import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Style from './EpisodeImageUpload.module.css'

const Input = styled('input')({
    display: 'none',
});

const EpisodeImageUpload: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box className={Style.imageArea}>
            {imagePreview ? (
                <img src={imagePreview} alt="Episode Setup" className={Style.setupImage} />
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No image selected. Please upload an image.
                </Typography>
            )}
            <label htmlFor="image-upload">
                <Input
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    onChange={handleImageChange}
                />
                <Button variant="contained" component="span">
                    Upload Image
                </Button>
            </label>
        </Box>
    );
};

export default EpisodeImageUpload;
