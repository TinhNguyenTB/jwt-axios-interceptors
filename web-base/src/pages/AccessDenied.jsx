import { Box, Button, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        gap: 2,
        backgroundColor: red[500],
      }}
    >
      <Typography variant="h1" style={{ color: "white" }}>
        403
      </Typography>
      <Typography variant="h6" style={{ color: "white" }}>
        You don’t have permission to access for this resource.
      </Typography>
      <Button variant="contained" component={Link} to="/">
        Back Home
      </Button>
    </Box>
  );
}
