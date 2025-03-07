'use client';

import {GetCharacterInfoReq, sendGetCharacterInfo} from '@/app/NetWork/CharacterNetwork';
import CreateCharacterMain2 from '@/app/view/main/content/create/character/CreateCharacterMain2';
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
  const getCharacterInfo = async (characterId: number) => {
    try {
      const req: GetCharacterInfoReq = {languageType: getCurrentLanguage(), characterId};
      const response = await sendGetCharacterInfo(req);

      if (response.data) {
        const characterInfo: CharacterInfo = response.data.characterInfo;
        setCurrentSelectedCharacter(characterInfo);
      } else {
        throw new Error(`No characterInfo in response : ${characterId}`);
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
    <>{loading ? <p></p> : <CreateCharacterMain2 id={id} isUpdate={true} characterInfo={currentSelectedCharacter} />}</>
  );
};

export default Page;
