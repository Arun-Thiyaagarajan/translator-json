import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { AntMessageProvider } from "./hooks/useAntMessage";
import { CustomAlertProvider } from "./hooks/useCustomAlert";

const App = () => {
  return (
    <AntMessageProvider>
      <CustomAlertProvider>
        <RouterProvider router={router} />
      </CustomAlertProvider>
    </AntMessageProvider>
  );
};

export default App;