import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

const ContentInfoManager: React.FC = () => {
  const [inputId, setInputId] = useState<number | ''>(''); // 입력된 ID 상태
  const contentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo);
  const [result, setResult] = useState<string | null>(null); // 결과 상태

  const handleSearch = () => {
    if (contentInfo) {
      setResult(`Content Name: ${contentInfo.publishInfo?.contentName}`);
    } else {
      setResult('Content not found');
    }
  };

  return (
    <div>
      <input type="number" value={inputId} onChange={e => setInputId(Number(e.target.value))} placeholder="Enter ID" />
      <button onClick={handleSearch}>Search</button>
      {result && <div>{result}</div>}
    </div>
  );
};

export default ContentInfoManager;
