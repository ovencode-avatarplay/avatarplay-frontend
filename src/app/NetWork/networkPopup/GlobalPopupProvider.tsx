// components/GlobalPopupRenderer.tsx
import {useEffect, useState} from 'react';

import {registerPopupRenderer, confirmPopup} from './popupManager';
import CustomPopup from '@/components/layout/shared/CustomPopup';

type PopupParams = {
  title: string;
  description?: string;
};

export default function GlobalPopupRenderer() {
  const [isOpen, setIsOpen] = useState(false);
  const [params, setParams] = useState<PopupParams>({title: '', description: ''});

  useEffect(() => {
    registerPopupRenderer(popupParams => {
      setParams(popupParams);
      setIsOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    confirmPopup();
  };

  if (!isOpen) return null;

  return (
    <CustomPopup
      type="alert"
      title={params.title}
      // description={params.description}
      buttons={[
        {
          label: '확인',
          onClick: handleConfirm,
          isPrimary: true,
        },
      ]}
    />
  );
}
