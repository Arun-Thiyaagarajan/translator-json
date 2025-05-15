import { message } from 'antd';

let showMessage = () => { }; // Global function to be set dynamically

const useAntMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  showMessage = (type, content) => {
    messageApi.open({ type, content });
  };

  return { contextHolder, showMessage };
};

export { useAntMessage, showMessage };
