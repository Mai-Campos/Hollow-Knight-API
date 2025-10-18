import { Box, Typography, Button } from "@mui/material";
import image from "../../assets/404.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

function PageNotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/404") {
      navigate("/404");
    }
  }, [location, navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: "bold" }}>
        Page Not Found
      </Typography>
      <Typography sx={{ mb: 3, mt: 1 }}>
        The path you seek is shrouded in darkness. Return to the main hall or
        seek another route.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        sx={{
          backgroundColor: "#9A8C98",
          color: "#0D0D12",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#C9B6D1" },
        }}
      >
        Return to Home
      </Button>
    </Box>
  );
}

export default PageNotFound;
