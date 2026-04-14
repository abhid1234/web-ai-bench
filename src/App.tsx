import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, lazy: () => import("./routes/BenchPage") },
      { path: "matrix", lazy: () => import("./routes/MatrixPage") },
      { path: "models", lazy: () => import("./routes/ModelsPage") },
      { path: "about", lazy: () => import("./routes/AboutPage") },
    ],
  },
]);
