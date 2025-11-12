import { Box, Button, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        gap: 2,
        backgroundColor: purple[500],
      }}
    >
      <Typography variant="h1" style={{ color: "white" }}>
        404
      </Typography>
      <Typography variant="h6" style={{ color: "white" }}>
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Back Home
      </Button>
    </Box>
  );
}
