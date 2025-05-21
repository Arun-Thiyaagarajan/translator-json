import { RouterProvider } from "react-router-dom";
import { AntMessageProvider } from "@hooks/useAntMessage";
import { CustomAlertProvider } from "@hooks/useCustomAlert";
import router from "@routes/Router";

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