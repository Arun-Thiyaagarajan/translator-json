import { createContext, useState, useContext, useCallback } from 'react';
import { Alert } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';

const AlertContext = createContext();

export const CustomAlertProvider = ({ children, position = 'topRight' }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((type, message, description = '', duration = 10000) => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, type, message, description }]);

    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, duration);
  }, []);

  const positionStyle = {
    topRight: { top: 100, right: 24 },
    topLeft: { top: 100, left: 24 },
    bottomRight: { bottom: 24, right: 24 },
    bottomLeft: { bottom: 24, left: 24 },
    topCenter: { top: 100, left: '50%', transform: 'translateX(-50%)' },
    bottomCenter: { bottom: 100, left: '50%', transform: 'translateX(-50%)' },
  }[position];

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Alert Container */}
      <div style={{ position: 'fixed', zIndex: 1500, ...positionStyle }}>
        <AnimatePresence>
          {alerts.map(({ id, type, message, description }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: 8 }}
            >
              <Alert
                type={type}
                message={message}
                description={description}
                showIcon
                // closable
                onClose={() => setAlerts(prev => prev.filter(alert => alert.id !== id))}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
};

export const useCustomAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useCustomAlert must be used within a CustomAlertProvider');
  }
  return context;
};