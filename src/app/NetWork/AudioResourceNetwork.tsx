import api, {ResponseAPI} from './ApiInstance';

export interface GenerateAudioReq {
  text: string;
  voiceId: string;
}

export interface GenerateAudioRes {
  audioUrl: string;
}

export const sendGenerateAudio = async (payload: GenerateAudioReq): Promise<GenerateAudioRes> => {
  try {
    const response = await api.post<Blob>('Resource/generateTts', JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob', // mp3 파일 형식 수신을 위한 blob 설정
    });

    if (response.status === 200) {
      const audioBlob = new Blob([response.data], {type: 'audio/mp3'});
      const res: GenerateAudioRes = {
        audioUrl: URL.createObjectURL(audioBlob), // audioUrl 생성 및 초기화
      };

      return res; // 생성된 URL을 반환하여 오디오 재생에 사용
    } else {
      throw new Error(`GenerateTts Error: ${response.status}`);
    }
  } catch (error: any) {
    console.error('Error GenerateTts:', error);
    throw new Error('Audio generation failed');
  }
};
