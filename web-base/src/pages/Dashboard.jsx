import { Button } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { handleLogoutAPI } from "~/apis";
import axiosInstance from "~/utils/authorizedAxios";
import { API_ROOT, TAB_URLS } from "~/utils/constants";
import Banner from "~/assets/trungquandev-bg-img.jpeg";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy ra giá trị tab dựa thoe url khi refresh trang
  // console.log(location);
  const getDefaultActiveTab = () => {
    let activeTab = TAB_URLS.DASHBOARD;
    Object.values(TAB_URLS).forEach((tab) => {
      if (location.pathname.includes(tab)) {
        activeTab = tab;
      }
    });
    return activeTab;
  };

  const [tab, setTab] = useState(getDefaultActiveTab());

  const handleChangeTab = (event, newTab) => {
    setTab(newTab);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosInstance.get(`${API_ROOT}/v1/dashboards/access`);
      // await axiosInstance.get(`${API_ROOT}/v1/dashboards/access`);
      // await axiosInstance.get(`${API_ROOT}/v1/dashboards/access`);
      // await axiosInstance.get(`${API_ROOT}/v1/dashboards/access`);
      // await axiosInstance.get(`${API_ROOT}/v1/dashboards/access`);
      setUser(res.data);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    await handleLogoutAPI();

    // Xóa thông tin user (Cả 2 TH đều làm)
    localStorage.removeItem("userInfo");
    setUser(null);

    // Cuối cùng navigate đến trang login
    navigate("/login");
  };

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          width: "100vw",
          height: "100vh",
        }}
      >
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        padding: "0 1em",
        gap: 2,
      }}
    >
      <Box as={Link} to={"#"}>
        <Box
          component={"img"}
          sx={{
            width: "100%",
            height: "180px",
            borderRadius: "6px",
            objectFit: "cover",
          }}
          src={Banner}
        />
      </Box>

      <Alert
        severity="info"
        sx={{
          ".MuiAlert-message": { overflow: "hidden" },
          width: { md: "max-content" },
        }}
      >
        Đây là trang Dashboard sau khi user:&nbsp;
        <Typography
          variant="span"
          sx={{ fontWeight: "bold", "&:hover": { color: "#fdba26" } }}
        >
          {user?.email}
        </Typography>
        &nbsp; đăng nhập thành công thì mới cho truy cập vào.
      </Alert>

      <Alert
        severity="success"
        variant="outlined"
        sx={{
          ".MuiAlert-message": { overflow: "hidden" },
          width: { md: "max-content" },
        }}
      >
        Role hiện tại của user:&nbsp;
        <Typography
          variant="span"
          sx={{ fontWeight: "bold", "&:hover": { color: "#fdba26" } }}
        >
          {user?.role}
        </Typography>
      </Alert>

      {/* Khu vực phân quyền truy cập */}
      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChangeTab}
            aria-label="RBAC Permissions Tabs"
          >
            <Tab
              label="Dashboard"
              value={TAB_URLS.DASHBOARD}
              component={Link}
              to="/dashboard"
            />
            <Tab
              label="Support"
              value={TAB_URLS.SUPPORT}
              component={Link}
              to="/support"
            />
            <Tab
              label="Messages"
              value={TAB_URLS.MESSAGES}
              component={Link}
              to="/messages"
            />
            <Tab
              label="Revenue"
              value={TAB_URLS.REVENUE}
              component={Link}
              to="/revenue"
            />
            <Tab
              label="Admin Tools"
              value={TAB_URLS.ADMIN_TOOLS}
              component={Link}
              to="/admin-tools"
            />
          </TabList>
        </Box>
        <TabPanel value={TAB_URLS.DASHBOARD}>
          <Alert severity="success" sx={{ width: "max-content" }}>
            Nội dung trang dashboard cho tất cả các Roles
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.SUPPORT}>
          <Alert severity="success" sx={{ width: "max-content" }}>
            Nội dung trang Support
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.MESSAGES}>
          <Alert severity="info" sx={{ width: "max-content" }}>
            Nội dung trang Message
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.REVENUE}>
          <Alert severity="warning" sx={{ width: "max-content" }}>
            Nội dung trang Revenue
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.ADMIN_TOOLS}>
          <Alert severity="error" sx={{ width: "max-content" }}>
            Nội dung trang Admin Tools
          </Alert>
        </TabPanel>
      </TabContext>
      <Divider />
      <Button
        type="button"
        variant="contained"
        color="info"
        size="large"
        sx={{ mt: 2, alignSelf: "flex-end" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
}

export default Dashboard;
