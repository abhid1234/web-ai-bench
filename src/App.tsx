import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/pitch",
    lazy: () => import("./routes/PitchDeck"),
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, lazy: () => import("./routes/CurriculumIndex") },
      { path: "learn/why", lazy: () => import("./routes/lessons/Lesson0Why") },
      { path: "learn/backends", lazy: () => import("./routes/lessons/Lesson1Backends") },
      { path: "learn/npu", lazy: () => import("./routes/lessons/Lesson2NPU") },
      { path: "learn/models", lazy: () => import("./routes/lessons/Lesson3Models") },
      { path: "learn/matrix", lazy: () => import("./routes/lessons/Lesson4Matrix") },
      { path: "learn/run", lazy: () => import("./routes/lessons/Lesson5Run") },
      { path: "learn/quantization", lazy: () => import("./routes/lessons/Lesson6Quantization") },
      // Legacy redirects from the pre-curriculum URLs
      { path: "matrix", element: <Navigate to="/learn/matrix" replace /> },
      { path: "models", element: <Navigate to="/learn/models" replace /> },
      { path: "about", element: <Navigate to="/learn/why" replace /> },
    ],
  },
]);
