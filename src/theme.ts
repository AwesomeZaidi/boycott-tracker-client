import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "medium, sans-serif", // Replace 'Your Custom Font' with your desired font
    body1: {
      fontFamily: "medium",
    },
    h2: {
      fontFamily: 'black'
    },
    h4: {
      fontFamily: "bold",
    },
  },
  palette: {
    primary: {
      main: "#YourCustomColor", // Replace with your desired primary color
    },
    secondary: {
      main: "#YourSecondaryColor", // Replace with your desired secondary color
    },
    // You can customize other colors as needed
  },
});

export default theme;
