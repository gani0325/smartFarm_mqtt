import * as React from "react";
import { Link, Outlet } from "react-router-dom";
import { ListItemButton } from "@mui/material";
import { ListItemIcon } from "@mui/material";
import { ListItemText } from "@mui/material";
import { default as DashboardIcon } from "@mui/icons-material/Dashboard";
import { default as BarChartIcon } from "@mui/icons-material/BarChart";
import { default as DevicesIcon } from "@mui/icons-material/Devices";
import Box from "@mui/material/Box";
import { List } from "@mui/material";
import { Container } from "@mui/material";

const Layout = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* 메뉴 박스 */}
        <Box sx={{ width: 200 }}>
          <List component="nav">
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="대시보드" />
            </ListItemButton>

            <ListItemButton component={Link} to="/history">
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="히스토리" />
            </ListItemButton>

            <ListItemButton component={Link} to="/manage">
              <ListItemIcon>
                <DevicesIcon />
              </ListItemIcon>
              <ListItemText primary="관리" />
            </ListItemButton>
          </List>
        </Box>

        {/* 컨텐츠 박스 */}
        <Box
          component="main"
          sx={{
            backgroundColor: "#F0F0F0",
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
