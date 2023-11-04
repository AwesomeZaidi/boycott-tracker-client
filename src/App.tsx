import { Box, ThemeProvider } from "@mui/material";
import "./App.css";
import Connect from "./components/Connect";
import Home from "./components/Home";

import "./styles.scss";
import theme from "./theme";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/israel",
      element: <Connect />,
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <Box mt={2}>
        <img
          src="/logo-medium.svg"
          style={{ height: "2.2em", marginLeft: "2em" }}
        />
        <RouterProvider router={router} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
