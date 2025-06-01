// src/App.jsx
import { useCallback, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PhotoProvider } from "./context/PhotoContext";
import MatchPhotos from "./containers/MatchPhotos"; // page qui affiche les photos d'un match
import HomePage from "./containers/HomePage";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage /> // page principale
    },
    {
      path: "/match/:matchName",
      element: <MatchPhotos /> // accès direct à un match
    }
  ]);

  return (
    <PhotoProvider>
        <RouterProvider router={router} />
    </PhotoProvider>
  );
}

export default App;
