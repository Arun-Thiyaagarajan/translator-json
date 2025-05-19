// AntMessageProvider.jsx
import { createContext, useContext } from 'react';
import { message } from 'antd';

const AntMessageContext = createContext(null);

export const AntMessageProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  message.config({
    top: 100,
    duration: 2,
    maxCount: 3,
    zIndex: 1100,
  });

  const showMessage = (type, content) => {
    messageApi.open({ type, content });
  };

  return (
    <AntMessageContext.Provider value={{ showMessage }}>
      {contextHolder}
      {children}
    </AntMessageContext.Provider>
  );
};

export const useAntMessage = () => {
  const context = useContext(AntMessageContext);
  if (!context) {
    throw new Error('useAntMessage must be used within AntMessageProvider');
  }
  return context;
};