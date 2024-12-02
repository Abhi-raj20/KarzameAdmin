import { useCallback, useState } from "react";

// react-router-dom components
import { Link, Navigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import { useNavigate } from "react-router-dom";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { getDatabase, ref, onValue, set, push, get } from "firebase/database";
import { setLoggedIn, useMaterialUIController } from "context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Typography } from "@mui/material";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const handleSetRememberMe = () => setRememberMe(!rememberMe);
  const [controller, dispatch] = useMaterialUIController();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const handleSignIn = useCallback(async () => {
    const dataBase = getDatabase();
    const adminRef = ref(dataBase, "/adminLogin");

    try {
      const snapshot = await get(adminRef);

      if (snapshot.exists()) {
        const adminData = snapshot.val();
        const admins = Object.values(adminData);

        const admin = admins.find((element) => {
          return element && element.userName === email && element.password === pass;
        });

        if (admin) {
          console.log("Login successful");
          setLoggedIn(dispatch, true);
          localStorage.setItem("user", JSON.stringify(admin));
          navigate("/Online_Offline_Users");
          setTimeout(() => {
            toast.success(`Login successfully`, {
              autoClose: 3000,
              position: toast.POSITION.TOP_CENTER,
            });
          }, 1400);
        } else {
          console.log("Invalid credentials");
          toast.warn(`Username or password do not match`, {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } else {
        console.log("Admin data not found");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  }, [pass, email]);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={2}
          textAlign="center"
        >
          <ToastContainer />
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
          <Grid container spacing={0} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <MDTypography variant="h6" textAlign="center" fontWeight="medium" color="white" mt={1}>
              Karzame
            </MDTypography>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3} mt={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                fullWidth
                onChange={(e) => setPass(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              {/* <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography> */}
            </MDBox>
            <MDBox mt={5} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={() => handleSignIn()}>
                sign in
              </MDButton>
            </MDBox>
            {/* <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox> */}
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
