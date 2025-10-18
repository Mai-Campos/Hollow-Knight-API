import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

/*"primary": "#1212a1",
              "background-light": "#9c9caa",
              "background-dark": "#222241", */

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
        px: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#222241",
          p: { xs: 2, sm: 3 },
          borderRadius: "50%",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <WarningAmberIcon
          sx={{
            fontSize: { xs: "14vw", sm: "8vw" },
            color: "#C3C3C3",
            maxWidth: "120px",
            maxHeight: "120px",
            lineHeight: 1.6,
          }}
        />
      </Box>
      <Typography variant="h3" sx={{ color: "#9A8C98", mb: 2 }}>
        Path Blocked
      </Typography>
      <Typography sx={{ mb: 3, color: "#9c9caa" }}>
        Only those who bear the mark of Hallownest may pass.
        <br /> You are an outsider. Seek the proper credentials or turn back.
      </Typography>
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#9A8C98",
          color: "#0D0D12",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#C9B6D1" },
        }}
        onClick={() => navigate("/login")}
      >
        Enter Hallownest
      </Button>
    </Box>
  );
}

export default AccessDenied;
