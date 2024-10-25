import React, {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Grid, IconButton} from '@mui/material';
import {useMediaQuery} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (images: File[]) => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({isOpen, onClose, onUpload}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // PC와 모바일 구분

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    onUpload(selectedFiles);
    setSelectedFiles([]); // 업로드 후 초기화
    onClose(); // 다이얼로그 닫기
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Upload Images</DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept="image/*"
          multiple
          style={{display: 'none'}}
          id="image-upload-input"
          onChange={handleFileSelect}
        />
        <label htmlFor="image-upload-input">
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddPhotoAlternateIcon />}
            component="span"
            fullWidth
            sx={{marginBottom: 2}}
          >
            Select Images
          </Button>
        </label>

        {/* 선택한 이미지 미리보기 */}
        <Grid container spacing={2}>
          {selectedFiles.map((file, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
              <Box position="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  style={{width: '100%', height: 'auto', borderRadius: 8}}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpload} color="primary" variant="contained" disabled={selectedFiles.length === 0}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageUploadDialog;
