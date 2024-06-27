"use client";
import { Roboto } from "next/font/google";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#AF80ED",
      },
      secondary: {
        main: "#C2DE4A",
      },
    },

    typography: {
      fontFamily: roboto.style.fontFamily,
    },
  })
);

export { theme };
