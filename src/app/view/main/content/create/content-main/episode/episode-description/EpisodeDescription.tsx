"use client";
// Modal or Drawer

import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';
import { addNewCharacter, updateUserInfo, deleteCharacter, clearChatList, getActiveUserData } from '@/redux-store/slices/chat';
import { sendCharacterData, updateCharacterData, deleteCharacterData, UpdateCharacterReq, fetchCharacterInfo, DeleteCharacterReq } from '@/app/NetWork/CharacterNetwork'; // 서버와의 통신을 위한 API 함수
import styles from './EpisodeDescription.module.css'; // CSS 모듈 import
import { setUserName, setUserDescription, setUserScenarioDescription, setUserIntroDescription, setUserSecret } from '@/redux-store/slices/userInfo';
import  episodeDesc   from "@content/episode/episodeDescription";

export interface CharacterDataType {
    userId: number;
    characterName: string;
    characterDescription: string;
    worldScenario: string;
    introduction: string;
    secret: string;
    //thumbnail: string;
}

interface CharacterPopupProps {
    dataDefault?: CharacterDataType;
    isModify: boolean;
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CharacterDataType) => void;
}

export const EpisodeDescription: React.FC<CharacterPopupProps> = ({ dataDefault, isModify = false, open, onClose, onSubmit }) => {
    //const chatStore = useSelector((state: RootState) => state.chat);
    const userId = useSelector((state: RootState) => state.user.userId);

    const characterNameStore = useSelector( (state: RootState) => state.user.episodeInfo.characterName);
    const characterDescriptionStore = useSelector( (state: RootState) => state.user.episodeInfo.characterDescription);
    const worldScenarioStore = useSelector( (state: RootState) => state.user.episodeInfo.scenarioDescription);
    const introductionStore = useSelector( (state: RootState) => state.user.episodeInfo.introDescription);
    const secretStore = useSelector( (state: RootState) => state.user.episodeInfo.secret);
    
     const [characterName, setCharacterName] = useState<string>(characterNameStore || "");
     const [characterDescription, setCharacterDescription] = useState<string>(characterDescriptionStore|| "");
     const [worldScenario, setWorldScenario] = useState<string>(worldScenarioStore || "");
     const [introduction, setIntroduction] = useState<string>(introductionStore || "");
     const [secret, setSecret] = useState<string>(secretStore || "");
     //const [thumbnail, setThumbnail] = useState<string>(dataDefault?.thumbnail || "");
    const [error, setError] = useState<string | null>(null);

    
    const dispatch = useDispatch();

    const updateChatList = async () => {
        const resCharacterInfo = await fetchCharacterInfo();
        if (!resCharacterInfo?.data?.characterInfoList) return;
        dispatch(clearChatList());
        for (let i = 0; i < resCharacterInfo.data.characterInfoList.length; i++) {
            const character = resCharacterInfo.data?.characterInfoList[i];
            dispatch(addNewCharacter({ character }));
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
        // let response;
        // try {
        //     if (!isModify) {
        //         response = await createCharacter();
        //     } else {
        //         response = await updateCharacter();
        //     }
        //     if (response?.resultCode != 0) {
        //         setError(response?.resultMessage || "handleSubmit Error");
        //     }
        // } catch (error: any) {
        //     setError(error.message);
        // }
        onClose(); // 제출 후 Dialog를 닫습니다.
    };

    // const onChangeName = () => {
    //     dispatch( setUserName())
    // }

    const onChangeName = (name: string) =>
    {
        setCharacterName(name);
        dispatch(setUserName(name))
    }
    const onChangeCharacterDescription = (description: string) =>
    {
        setCharacterDescription(description);
        dispatch(setUserDescription(description))
    }
    const onChangesetWorldScenario = (worldScenario: string) =>
    {
        setWorldScenario(worldScenario);
        dispatch(setUserScenarioDescription(worldScenario))
    }

    const onChangesetIntroduction = (worldScenario: string) =>
    {
        setIntroduction(worldScenario);
        dispatch(setUserIntroDescription(worldScenario))
    }

    const onChangesetSecret = (worldScenario: string) =>
    {
        setSecret(worldScenario);
        dispatch(setUserSecret(worldScenario))
    }
        
    
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
                    label="User ID"
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
                    onChange={(e) => onChangeName(e.target.value)
                        
                    }
                />
                <TextField
                    label="Character Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={characterDescription}
                    onChange={(e) => onChangeCharacterDescription(e.target.value)}
                />
                <TextField
                    label="World Scenario"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={worldScenario}
                    onChange={(e) => onChangesetWorldScenario(e.target.value)}
                />
                <TextField
                    label="Introduction"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={introduction}
                    onChange={(e) => onChangesetIntroduction(e.target.value)}
                />
                <TextField
                    label="Secret"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={secret}
                    onChange={(e) => onChangesetSecret(e.target.value)}
                />
                {/* <TextField
                    label="Thumbnail"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                /> */}
                {error && <Typography className={styles.errorMessage}>{error}</Typography>}
            </DialogContent>
            <DialogActions className={styles.dialogActions}>
                {/* <div>
                    <Button onClick={handleSubmit} color="primary">
                        {isModify ? "Modify" : "Create"}
                    </Button>
                </div> */}
                <Button onClick={onClose} color="primary" className={styles.confirmButton} >
                    확인
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EpisodeDescription;
