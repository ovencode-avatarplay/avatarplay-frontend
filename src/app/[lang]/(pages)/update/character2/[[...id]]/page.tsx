'use client';

import {GetCharacterInfoReq, sendGetCharacterProfileInfo} from '@/app/NetWork/CharacterNetwork';
import CreateCharacterMain from '@/app/view/main/content/create/character/CreateCharacterMain';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import {getCurrentLanguage} from '@/utils/UrlMove';
import {useEffect, useState} from 'react';

type Props = {
  params: {
    id?: string[];
  };
};

const Page = ({params}: Props) => {
  const id = parseInt(params?.id?.[0] || '0');

  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  // 캐릭터 정보를 가져오는 함수
  const getCharacterInfo = async (profileId: number) => {
    try {
      const req: GetCharacterInfoReq = {languageType: getCurrentLanguage(), profileId};
      const response = await sendGetCharacterProfileInfo(req);

      if (response.data) {
        const characterInfo: CharacterInfo = response.data.characterInfo;
        setCurrentSelectedCharacter(characterInfo);
      } else {
        throw new Error(`No characterInfo in response : ${profileId}`);
      }
    } catch (error) {
      console.error('Error fetching Character Info:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id > 0) {
      getCharacterInfo(id);
    }
  }, [id]);

  return (
    <>{loading ? <p></p> : <CreateCharacterMain id={id} isUpdate={true} characterInfo={currentSelectedCharacter} />}</>
  );
};

export default Page;
