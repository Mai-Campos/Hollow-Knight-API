import {
  Box,
  Container,
  TextField,
  Typography,
  Button,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";
import { useState } from "react";
import { register } from "../../api/authService";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate("/");
    } catch (error) {
      setError(error.message);
      setOpenSnackBar(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        py: 4,
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openSnackBar}
        onClose={handleCloseSnackBar}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Container maxWidth="sm">
        <Container sx={{ mb: 4 }}>
          <Typography
            align="center"
            component="h1"
            sx={{
              fontSize: {
                sm: "2rem",
                md: "1.5rem",
                lg: "2rem",
              },
              fontWeight: "700",
              lineHeight: "1.1",
            }}
          >
            CREATE YOUR ACCOUNT
          </Typography>
          <Typography
            align="center"
            component="p"
            sx={{ mt: 1, color: "gray", fontStyle: "italic" }}
          >
            JOIN TO HOLLOWNEST EXPLORATION
          </Typography>
        </Container>
        <Paper
          elevation={6}
          sx={{
            backgroundColor: "#1E1E2F",
            p: 4,
            borderRadius: "16px",
          }}
        >
          <form onSubmit={(e) => handleSubmit(e)}>
            <TextField
              fullWidth
              margin="dense"
              name="name"
              label="Full Name"
              type="text"
              onChange={(e) => handleChange(e)}
              required
              sx={{
                input: { color: "white" },
                label: { color: "#C3C3C3" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#374151" },
                  "&:hover fieldset": { borderColor: "#9A8C98" },
                  "&.Mui-focused fieldset": { borderColor: "#9A8C98" },
                },
              }}
            />
            <TextField
              fullWidth
              onChange={(e) => handleChange(e)}
              margin="dense"
              name="email"
              label="Email"
              type={"email"}
              required
              sx={{
                input: { color: "white" },
                label: { color: "#C3C3C3" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#374151" },
                  "&:hover fieldset": { borderColor: "#9A8C98" },
                  "&.Mui-focused fieldset": { borderColor: "#9A8C98" },
                },
              }}
            />
            <TextField
              onChange={(e) => handleChange(e)}
              fullWidth
              margin="dense"
              name="password"
              label="Password"
              type={"password"}
              required
              sx={{
                input: { color: "white" },
                label: { color: "#C3C3C3" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#374151" },
                  "&:hover fieldset": { borderColor: "#9A8C98" },
                  "&.Mui-focused fieldset": { borderColor: "#9A8C98" },
                },
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                py: 1.2,
                fontWeight: "bold",
                backgroundColor: "#9A8C98",
                color: "#0D0D12",
                "&:hover": {
                  backgroundColor: "#C9B6D1",
                },
              }}
            >
              REGISTER
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
