"use client";
// Modal or Drawer

import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';
import { addNewCharacter, updateUserInfo, deleteCharacter, clearChatList, getActiveUserData } from '@/redux-store/slices/chat';
import { sendCharacterData, updateCharacterData, deleteCharacterData, UpdateCharacterReq, fetchCharacterInfo, DeleteCharacterReq } from '@/app//NetWork/MyNetWork'; // 서버와의 통신을 위한 API 함수
import styles from './EpisodeDescription.module.css'; // CSS 모듈 import

export interface CharacterDataType {
    userId: number;
    characterName: string;
    characterDescription: string;
    worldScenario: string;
    introduction: string;
    secret: string;
    thumbnail: string;
}

interface CharacterPopupProps {
    dataDefault?: CharacterDataType;
    isModify: boolean;
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CharacterDataType) => void;
}

export const EpisodeDescription: React.FC<CharacterPopupProps> = ({ dataDefault, isModify = false, open, onClose, onSubmit }) => {
    const chatStore = useSelector((state: RootState) => state.chat);
    const userId = useSelector((state: RootState) => state.user.userId);
    const savedUserId = localStorage.getItem('userId');
    
    const [characterName, setCharacterName] = useState<string>(dataDefault?.characterName || "");
    const [characterDescription, setCharacterDescription] = useState<string>(dataDefault?.characterDescription || "");
    const [worldScenario, setWorldScenario] = useState<string>(dataDefault?.worldScenario || "");
    const [introduction, setIntroduction] = useState<string>(dataDefault?.introduction || "");
    const [secret, setSecret] = useState<string>(dataDefault?.secret || "");
    const [thumbnail, setThumbnail] = useState<string>(dataDefault?.thumbnail || "");
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    const createCharacter = async () => {
        const characterData = {
            userId,
            characterName,
            characterDescription,
            worldScenario,
            introduction,
            secret,
            thumbnail,
        };
        const response = await sendCharacterData(characterData);
        if (response.resultCode === 0) {
            onSubmit(characterData); // 부모 컴포넌트로 데이터 전달
            updateChatList();
            setError(null);
            return response;
        }
    };

    const updateChatList = async () => {
        const resCharacterInfo = await fetchCharacterInfo();
        if (!resCharacterInfo?.data?.characterInfoList) return;
        dispatch(clearChatList());
        for (let i = 0; i < resCharacterInfo.data.characterInfoList.length; i++) {
            const character = resCharacterInfo.data?.characterInfoList[i];
            dispatch(addNewCharacter({ character }));
        }
    };

    const updateCharacter = async () => {
        const characterData = {
            userId,
            characterName,
            characterDescription,
            worldScenario,
            introduction,
            secret,
            thumbnail,
        };
        const UpdateData: UpdateCharacterReq = {
            userID: chatStore.profileUser.id,
            characterID: userId,
            characterName: characterName,
            characterDescription: characterDescription,
            worldScenario: worldScenario,
            introduction: introduction,
            secret: secret,
            thumbnail: thumbnail,
        };
        const response = await updateCharacterData(UpdateData);
        if (response.resultCode === 0) {
            onSubmit(characterData); // 부모 컴포넌트로 데이터 전달
            dispatch(updateUserInfo({
                userId: userId || 0,
                newFullName: characterData.characterName || "이름 없음",
                newRole: "낫띵",
                characterDescription: characterData.characterDescription,
                worldScenario: characterData.worldScenario,
                introduction: characterData.introduction,
                secret: characterData.secret,
            }));
            updateChatList();
            setError(null);
            return response;
        }
    };

    const handleDeleteCharacter = async () => {
        const deleteData: DeleteCharacterReq = {
            characterID: userId,
        };
        const response = await deleteCharacterData(deleteData);
        if (response.resultCode === 0) {
            dispatch(deleteCharacter(deleteData.characterID));
            updateChatList();
            setError(null);
            dispatch(getActiveUserData(-1)); // 액티브유저 초기화 해주자..
        }
        onClose(); // 제출 후 Dialog를 닫습니다.
    };

    const handleSubmit = async () => {
        let response;
        try {
            if (!isModify) {
                response = await createCharacter();
            } else {
                response = await updateCharacter();
            }
            if (response?.resultCode != 0) {
                setError(response?.resultMessage || "handleSubmit Error");
            }
        } catch (error: any) {
            setError(error.message);
        }
        onClose(); // 제출 후 Dialog를 닫습니다.
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Typography className={styles.dialogTitle}>Character Information</Typography>
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <Typography variant="subtitle1" gutterBottom>
                    Please enter the character details below:
                </Typography>
                <TextField
                    label="Character ID"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={userId}
                    disabled
                />
                <TextField
                    label="Character Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                />
                <TextField
                    label="Character Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={characterDescription}
                    onChange={(e) => setCharacterDescription(e.target.value)}
                />
                <TextField
                    label="World Scenario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={worldScenario}
                    onChange={(e) => setWorldScenario(e.target.value)}
                />
                <TextField
                    label="Introduction"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                />
                <TextField
                    label="Secret"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                />
                <TextField
                    label="Thumbnail"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                />
                {error && <Typography className={styles.errorMessage}>{error}</Typography>}
            </DialogContent>
            <DialogActions className={styles.dialogActions}>
                {/* <div>
                    <Button onClick={handleSubmit} color="primary">
                        {isModify ? "Modify" : "Create"}
                    </Button>
                </div> */}
                <Button onClick={onClose} color="primary">
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EpisodeDescription;
