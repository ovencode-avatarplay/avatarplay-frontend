import {GenerateAudioReq, sendGenerateAudio} from '@/app/NetWork/AudioResourceNetwork';

export const GenerateTtsUrl = async (text: string, characterId: number, voiceId: string): Promise<string | null> => {
  try {
    console.log('generate tts' + text);

    const req: GenerateAudioReq = {text, characterId, voiceId};
    const response = await sendGenerateAudio(req);

    if (response?.audioUrl) {
      return response.audioUrl; // 생성된 오디오 URL 반환
    } else {
      throw new Error(`No response for file`);
    }
  } catch (error) {
    console.error('Error generating audio:', error);
    return null; // 오류 발생 시 null 반환
  }
};
