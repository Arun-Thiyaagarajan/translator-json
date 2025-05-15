import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import { useAntMessage } from "./hooks/useAntMessage";

const App = () => {
  const { contextHolder } = useAntMessage();

  return (
    <>
      {contextHolder}  {/* Ant Design message holder */}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
