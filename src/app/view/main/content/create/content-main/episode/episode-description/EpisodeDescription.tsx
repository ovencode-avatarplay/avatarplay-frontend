"use client";
// Modal or Drawer

import React, {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore'
import { addNewCharacter, updateUserInfo, deleteCharacter, clearChatList, getActiveUserData } from '@/redux-store/slices/chat';

import { sendCharacterData, updateCharacterData, deleteCharacterData, UpdateCharacterReq, fetchCharacterInfo, DeleteCharacterReq } from '@/app//NetWork/MyNetWork'; // 서버와의 통신을 위한 API 함수

// const EpisodeDescription: React.FC = () => {
//     return (
//         <div>
//             EpisodeDescription
//         </div>)
// }

//export default EpisodeDescription;

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
    onSubmit: (data:
      CharacterDataType
    ) => void;
  }

export const EpisodeDescription: React.FC<CharacterPopupProps> = ({dataDefault, isModify = false, open, onClose, onSubmit }) => {
    //console.log("CharacterPopup 호출")
    //console.log({ dataDefault }, isModify)
    // States
    const chatStore = useSelector((state: RootState) => state.chat)
  
    const [userId, setUserId] = useState<number>(dataDefault?.userId || chatStore.profileUser.id);
    const [characterName, setCharacterName] = useState<string>(dataDefault?.characterName || "");
    const [characterDescription, setCharacterDescription] = useState<string>(dataDefault?.characterDescription || "");
    const [worldScenario, setWorldScenario] = useState<string>(dataDefault?.worldScenario || "");
    const [introduction, setIntroduction] = useState<string>(dataDefault?.introduction || "");
    const [secret, setSecret] = useState<string>(dataDefault?.secret || "");
    const [thumbnail, setThumbnail] = useState<string>(dataDefault?.thumbnail || "");
    const [error, setError] = useState<string | null>(null);
  
     const dispatch = useDispatch();
  
    //console.log("유저정보  ", dataDefault);
  
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
      //console.log(characterData);
      //return;
      // 서버로 데이터를 전송합니다.
      const response = await sendCharacterData(characterData);
  
      if (response.resultCode === 0) {
        // 성공적으로 전송되었을 때
        onSubmit(characterData); // 부모 컴포넌트로 데이터 전달
        //chat.ts의 DB 내용 갱신
  
        updateChatList();
        // dispatch( updateUserInfo({
        //   userId: 2,
        //   newFullName: characterData.characterName,
        //   newRole: "낫띵",
        //   characterDescription: characterData.characterDescription,
        //   worldScenario: characterData.worldScenario,
        //   introduction: characterData.introduction,
        //   secret: characterData.secret
        // }));
        setError(null);
        return response;
      }
  
    }
  
    const updateChatList = async () => {
      const resCharacterInfo = await fetchCharacterInfo();
  
      //console.log("resCharacterInfo : ", resCharacterInfo);
      if (!resCharacterInfo?.data?.characterInfoList) return;
  
      dispatch(clearChatList());
  
      for (let i = 0; i < resCharacterInfo.data.characterInfoList.length; i++) {
        const character = resCharacterInfo.data?.characterInfoList[i];
  
        dispatch(addNewCharacter({
          character,
        }));
      }
    }
  
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
      console.log("업데이트캐릭터1 ", UpdateData);
      const response = await updateCharacterData(UpdateData);
      if (response.resultCode === 0) {
        // 성공적으로 전송되었을 때
        onSubmit(characterData); // 부모 컴포넌트로 데이터 전달
        //chat.ts의 DB 내용 갱신
        dispatch(updateUserInfo({
          userId: userId || 0,
          newFullName: characterData.characterName || "이름 없음",
          newRole: "낫띵",
          characterDescription: characterData.characterDescription,
          worldScenario: characterData.worldScenario,
          introduction: characterData.introduction,
          secret: characterData.secret
        }));
        updateChatList();
  
        setError(null);
        return response;
      }
    }
  
    // 캐릭터 삭제처리하는 함수
    const handleDeleteCharacter = async () => {
      const deleteData: DeleteCharacterReq = {
        characterID: userId
      }
  
      const response = await deleteCharacterData(deleteData)
      if (response.resultCode === 0) {
        console.log('삭제처리 요청');
        dispatch(deleteCharacter(deleteData.characterID));
        updateChatList();
        setError(null);
        dispatch(getActiveUserData(-1)); // 액티브유저 초기화 해주자..
        console.log('삭제처리 완료');
      }
      onClose(); // 제출 후 Dialog를 닫습니다.
    }
  
    // 폼 제출을 처리하는 핸들러 함수
    const handleSubmit = async () => {
      let response;
      try {
        //alert('isModify : ' + isModify)
        if (!isModify) {
          response = await createCharacter()
          console.log("만들기 캐릭터 ", response?.data);
  
        } else {
          response = await updateCharacter()
          console.log("업데이트캐릭터 ", response?.data);
        }
  
        if (response?.resultCode != 0) {
          setError(response?.resultMessage || "handleSubmit Error");
        }
      } catch (error: any) {
        // 전송 중 에러가 발생했을 때
        setError(error.message);
      }
  
      onClose(); // 제출 후 Dialog를 닫습니다.
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography>Character Information</Typography>
        </DialogTitle>
        <DialogContent>
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
            onChange={(e) => setUserId(Number(e.target.value))}
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
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px' // Adjust padding as needed
          }}
        >
          {/* Left aligned buttons */}
          <div>
            {/*{isModify && (
              <Button onClick={handleDeleteCharacter} color="primary">
                Delete
              </Button>
            )}*/}
            <Button onClick={handleSubmit} color="primary">
              {isModify ? "Modify" : "Create"}
            </Button>
          </div>
          {/* Right aligned button */}
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
  
        </DialogActions>
      </Dialog>
    );
  };
  
  export default EpisodeDescription;