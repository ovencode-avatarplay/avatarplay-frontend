import React, {useState} from 'react';
import styles from './ChatBottom.module.css';
import AddIcon from '@mui/icons-material/Add';
import {BoldSend, Emoticon, LineRecording, LineReward, VideoFrame} from '@ui/Icons';
import {useAtom} from 'jotai';
import {ToastMessageAtom} from '@/app/Root';
import {isOpenAddContentAtom, isOpenEmojiPickerAtom} from './ChatAtom';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import DrawerDonation from '../../create/common/DrawerDonation';
import {sendUpload, UploadMediaState} from '@/app/NetWork/ImageNetwork';
import {MediaState} from '@/app/NetWork/ChatMessageNetwork';
interface Props {
  onSend: (text: string, mediaState: MediaState, mediaUrl: string) => void;
}

const ChatBottom: React.FC<Props> = ({onSend}) => {
  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const [text, setText] = useState('');
  const [isOpenAddContent, setIsOpenAddContent] = useAtom(isOpenAddContentAtom);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useAtom(isOpenEmojiPickerAtom);

  const handleSend = (mediaState: MediaState, mediaUrl: string) => {
    if (!text.trim() && mediaState == MediaState.None) return;
    onSend(text, mediaState, mediaUrl);
    setText('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <button
          className={styles.plusButton}
          onClick={() => {
            setIsOpenAddContent(prev => !prev);
            setIsOpenEmojiPicker(false);
          }}
          style={{
            transform: isOpenAddContent ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <AddIcon />
        </button>

        <div className={styles.inputWrap}>
          <input
            className={styles.inputField}
            placeholder="Input..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(MediaState.None, '')}
          />
          <div className={styles.sendWrap} onClick={() => handleSend(MediaState.None, '')}>
            <img src={BoldSend.src} className={styles.sendIcon} />
          </div>
        </div>

        <img
          src={LineRecording.src}
          className={styles.micIcon}
          onClick={() => {
            dataToast.open('추후 개발 예정');
          }}
        />
      </div>

      <div className={`${styles.addContent} ${isOpenAddContent ? styles.show : ''}`}>
        <AddContent setText={setText} handleSend={handleSend} />
      </div>
    </div>
  );
};

export default ChatBottom;

interface AddContentProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
  handleSend: (mediaState: MediaState, mediaUrl: string) => void;
}

const AddContent: React.FC<AddContentProps> = ({setText, handleSend}) => {
  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const [isOpenEmojiPicker, setIsOpenEmojiPicker] = useAtom(isOpenEmojiPickerAtom);
  const handleSendDonation = (price: string) => {
    setText(price);
    // handleSend();
  };
  const getDmChatMediaState = (file: File): UploadMediaState => {
    const mimeType = file.type;

    if (mimeType.startsWith('image/')) {
      return UploadMediaState.DmChatImage;
    }
    if (mimeType.startsWith('video/')) {
      return UploadMediaState.DmChatVideo;
    }
    if (mimeType.startsWith('audio/')) {
      return UploadMediaState.DmChatAudio;
    }

    return UploadMediaState.None;
  };

  const handleMediaUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*,audio/*';

    input.onchange = async event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const mediaState = getDmChatMediaState(file); // ✅ 자동 판별
        const response = await sendUpload({
          imageList: [file],
          mediaState: mediaState, // 또는 ContentVideo, 일단 하나만 사용
        });

        const uploadedUrl = response?.data?.imageUrlList[0];
        if (uploadedUrl) {
          let chatState = MediaState.None;
          if (mediaState == UploadMediaState.DmChatAudio) chatState = MediaState.Audio;
          else if (mediaState == UploadMediaState.DmChatImage) chatState = MediaState.Image;
          else if (mediaState == UploadMediaState.DmChatVideo) chatState = MediaState.Video;
          handleSend(chatState, uploadedUrl);
        } else {
          dataToast.open('추후 제공 예정');
        }
      } catch (err) {
        console.error('업로드 중 오류 발생:', err);
        dataToast.open('추후 제공 예정');
      }
    };
    input.click();
  };
  const [isDonation, setDonation] = useState(false);
  return (
    <>
      {!isOpenEmojiPicker && (
        <>
          <div className={styles.addItem} onClick={() => setDonation(true)}>
            <div className={styles.addItemRound}>
              <img src={LineReward.src} className={styles.addItemIcon} />
            </div>
            <span className={styles.addItemText}>gift</span>
          </div>
          <div
            className={styles.addItem}
            onClick={() => handleMediaUpload()} // ✅ 연결
          >
            <div className={styles.addItemRound}>
              <img src={VideoFrame.src} className={styles.addItemIcon} />
            </div>
            <span className={styles.addItemText}>Media</span>
          </div>
          <div
            className={styles.addItem}
            onClick={() => {
              setIsOpenEmojiPicker(prev => !prev);
            }}
          >
            <div className={styles.addItemRound}>
              <img src={Emoticon.src} className={styles.addItemIcon} />
            </div>
            <span className={styles.addItemText}>Emoticon</span>
          </div>
        </>
      )}
      {/* ✅ Emoticon 누르면 Picker 열기 */}
      {isOpenEmojiPicker && (
        <div className={styles.pickerWrap}>
          <Picker
            data={data}
            theme="light"
            dynamicWidth={true} // ✅ 꼭 켜야 함
            emojiButtonSize={30} // ✅ 버튼 크기만 조정
            searchPosition="none"
            previewPosition="none"
            onEmojiSelect={(emoji: any) => {
              setText(prev => prev + emoji.native);
            }}
            maxFrequentRows={4}
            perLine={10}
          />
        </div>
      )}
      {isDonation && (
        <DrawerDonation isOpen={isDonation} giveToPDId={33} onClose={() => setDonation(false)} sponsoredName={'asd'} />
      )}
    </>
  );
};
