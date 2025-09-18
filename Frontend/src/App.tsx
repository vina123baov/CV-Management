// src/App.tsx
import React from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Divider,
  InputBase,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const drawerWidth = 240;

function SidebarContent() {
  return (
    <Box sx={{ width: drawerWidth }} role="presentation" p={2}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar sx={{ bgcolor: "primary.main" }}>A</Avatar>
        <Box>
          <Typography variant="subtitle1">admintest</Typography>
          <Typography variant="caption" color="text.secondary">
            adminhieu@gmail.com
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 1 }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Bảng điều khiển" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <WorkOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Mô tả công việc" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Ứng viên" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <CalendarTodayIcon />
            </ListItemIcon>
            <ListItemText primary="Lịch phỏng vấn" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <StarBorderIcon />
            </ListItemIcon>
            <ListItemText primary="Đánh giá phỏng vấn" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <EmailIcon />
            </ListItemIcon>
            <ListItemText primary="Quản lý email" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Cài đặt" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

const theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: ['"Inter"', "Roboto", '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
  },
});

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: "background.paper",
            color: "text.primary",
            boxShadow: "none",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap component="div">
              Recruit AI
            </Typography>

            <Box sx={{ flexGrow: 1 }} />

            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  px: 1,
                  border: 1,
                  borderColor: "divider",
                  minWidth: 200,
                }}
              >
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                <InputBase placeholder="Tìm kiếm..." inputProps={{ "aria-label": "search" }} />
              </Box>

              <Button variant="contained" startIcon={<AddIcon />}>
                Thêm mới
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          <SidebarContent />
        </Drawer>

        {/* Permanent drawer on sm+ */}
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
            display: { xs: "none", sm: "block" },
          }}
          aria-label="sidebar"
        >
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                borderRight: 1,
                borderColor: "divider",
              },
            }}
          >
            <Toolbar />
            <SidebarContent />
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: "100vh",
            bgcolor: "background.default",
          }}
        >
          <Toolbar /> {/* spacing for fixed AppBar */}
          <Typography variant="h4" gutterBottom>
            Bảng điều khiển
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }}
            gap={2}
            mb={2}
          >
            <Box p={2} border="1px solid" borderColor="divider" borderRadius={1}>
              <Typography variant="subtitle2">Tổng ứng viên</Typography>
              <Typography variant="h5">1,247</Typography>
            </Box>

            <Box p={2} border="1px solid" borderColor="divider" borderRadius={1}>
              <Typography variant="subtitle2">Vị trí tuyển</Typography>
              <Typography variant="h5">24</Typography>
            </Box>

            <Box p={2} border="1px solid" borderColor="divider" borderRadius={1}>
              <Typography variant="subtitle2">Lịch hôm nay</Typography>
              <Typography variant="h5">3</Typography>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>
            Ứng viên mới
          </Typography>
          <Box p={2} border="1px dashed" borderColor="divider" borderRadius={1}>
            <Typography>- Nguyễn Văn A — Frontend Developer</Typography>
            <Typography>- Trần Thị B — Backend</Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
