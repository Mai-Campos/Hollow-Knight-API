import { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import icon from "../assets/icon.ico";
import { NavLink, useLocation } from "react-router-dom";
import { logout } from "../api/authService";

const pages = ["Home", "Characters", "Abilities", "Regions"];
const settings = ["Logout"];

function NavBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [isLogin, setIsLogin] = useState(false);

  const location = useLocation();

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLogin(true);
    }
  }, [location]);

  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="img"
            src={icon}
            alt="Icono Hollow Knight"
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              display: { xs: "none", md: "flex" },
              "@media (max-width: 320px)": {
                display: "none",
              },
            }}
          />

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "roboto",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              letterSpacing: 2,
            }}
          >
            HOLLOW KNIGHT API
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: {
                  xs: "block",
                  md: "none",
                  "& .MuiPaper-root": {
                    backgroundColor: "#0f172a",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
                  },
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  component={NavLink}
                  to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                  onClick={handleCloseNavMenu}
                  sx={{ color: "#C3C3C3" }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box
            component="img"
            src={icon}
            alt="Icono Hollow Knight"
            sx={{
              width: 35,
              height: 35,
              mr: 1,
              display: { xs: "flex", md: "none" },
              "@media (max-width: 320px)": {
                display: "none",
              },
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontFamily: "roboto",
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
            }}
          >
            HOLLOW KNIGHT
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page}
                component={NavLink}
                to={page === "Home" ? "/" : `/${page.toLowerCase()}`}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "#C3C3C3",
                  display: "block",
                  fontWeight: "bold",
                  "&:hover": { color: "#93c5fd" },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {isLogin ? (
              <Tooltip title="Configuración">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="Usuario"
                    src="/static/images/avatar/2.jp"
                    sx={{
                      width: 40,
                      height: 40,
                      "@media (max-width: 320px)": {
                        width: 28,
                        height: 28,
                      },
                    }}
                  />
                </IconButton>
              </Tooltip>
            ) : (
              location.pathname !== "/login" && (
                <Button
                  component={NavLink}
                  to="/login"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "#0D0D12",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    "&:hover": { backgroundColor: "#1e293b" },
                    borderRadius: 3,
                  }}
                >
                  LOGIN
                </Button>
              )
            )}
            <Menu
              sx={{
                mt: "45px",
                "& .MuiPaper-root": {
                  backgroundColor: "#0f172a",
                  borderRadius: "12px",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.4)",
                  color: "#C3C3C3",
                },
              }}
              id="menu-appbar"
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography
                    textAlign="center"
                    onClick={() => {
                      logout();
                      setIsLogin(false);
                    }}
                  >
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
