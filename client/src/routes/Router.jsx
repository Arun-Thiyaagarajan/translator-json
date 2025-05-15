import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/MainLayout";

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    // Add action if you're using form submission
  },
]);

export default router;