import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function isDesktop() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  return isDesktop;
}
