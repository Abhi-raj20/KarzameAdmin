// Material Dashboard 2 React components
import MDBox from "components/MDBox";

import {
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Container,
  TextField,
} from "@mui/material";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { useCallback, useEffect, useState } from "react";
import container from "assets/theme/components/container";
import { ToastContainer } from "react-toastify";
import MDTypography from "components/MDTypography";

import { getDatabase, ref, onValue, set, get, update } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

function Subcription() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priceCounter, setPriceCounter] = useState(30); // Default price
  const [subValues, setSubValues] = useState({ Basic: 0, Premium: 0, Standard: 0, OneUsd: 0 });

  const handlePlanChange = (newPlan, price) => {
    setSelectedPlan(newPlan);
    setPriceCounter(price);
    setIsModalOpen(true); // Open the modal when changing the price
  };

  // const handleSubscriptionUpdate = useCallback(() => {
  //   updateSubscriptionValue(selectedPlan, priceCounter)
  // }, [priceCounter, selectedPlan])

  const handlePriceChange = (newPrice) => {
    if ((selectedPlan == "Basic" && newPrice == 1) || newPrice == "Free") {
      setPriceCounter("Free");
      return;
    }
    if (newPrice == 1) {
      return;
    }
    setPriceCounter(newPrice - 1);
  };

  const handleAddition = (value) => {
    if (value == "Free") {
      setPriceCounter(1);
      return;
    } else {
      setPriceCounter(value + 1);
    }
  };

  const getSubscription = async () => {
    const dataBase = getDatabase();
    const adminRef = ref(dataBase, "/adminLogin");

    try {
      const snapshot = await get(adminRef);
      const adminData = snapshot.val();

      if (adminData && adminData.Subscription) {
        const subscriptionData = adminData.Subscription;

        setSubValues(subscriptionData);
        // Now, `subscriptionData` contains the Subscription information
        console.log(subscriptionData); // You can process or log the subscription data here
      } else {
        console.log("No Subscription data found.");
      }
    } catch (error) {
      console.error("Error fetching Subscription data:", error);
    }
  };

  const updateSubscriptionValue = useCallback(async (subscriptionType, newValue) => {
    try {
      const database = getDatabase();
      const adminRef = ref(database, "/adminLogin");

      if (subscriptionType === "Basic" && newValue === 0) {
        newValue = "Free";
      }

      // Fetch the current admin data
      const snapshot = await get(adminRef);
      const adminData = snapshot.val();

      if (adminData && adminData.Subscription) {
        // Update the value for the specified subscription type
        adminData.Subscription[subscriptionType] = newValue;

        // Update the database with the modified data
        await update(adminRef, adminData);

        console.log(`Updated ${subscriptionType} to ${newValue}`);
        setIsModalOpen(false);
        getSubscription();
      } else {
        console.log("No Subscription data found.");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
    }
  }, []);

  const updateSubscriptionNaira = useCallback(
    async (type, newValue) => {
      console.log("newvalu of naira", newValue);
      try {
        const database = getDatabase();
        const adminRef = ref(database, "/adminLogin");

        // Fetch the current admin data
        const snapshot = await get(adminRef);
        const adminData = snapshot.val();

        if (adminData && adminData.Subscription) {
          // Calculate the new values based on subValues and newValue
          if (subValues.Basic == "Free") {
            var updatedNairaBasic = "Free";
          } else {
            var updatedNairaBasic = subValues.Basic * Number(newValue);
          }
          const updatedNairaPremium = subValues.Premium * newValue;
          const updatedNairaStandard = subValues.Standard * newValue;

          // Update the values in the admin data
          adminData.Subscription.Naira_Basic = updatedNairaBasic;
          adminData.Subscription.Naira_Premium = updatedNairaPremium;
          adminData.Subscription.Naira_Standard = updatedNairaStandard;
          adminData.Subscription.OneUsd = newValue;

          // Update the database with the modified data
          await update(adminRef, adminData);

          console.log(`Updated Naira values and OneUsd to ${newValue}`);
          setIsModalOpen(false);
          getSubscription();
        } else {
          console.log("No Subscription data found.");
        }
      } catch (error) {
        console.error("Error updating subscription:", error);
      }
    },
    [subValues]
  ); // Make sure to include subValues in the dependency array

  useEffect(() => {
    getSubscription();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Container>
          <MDBox
            mx={2}
            mt={-3}
            py={3}
            px={2}
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
          >
            <ToastContainer />
            <MDTypography variant="h6" color="white">
              Subscription
            </MDTypography>
          </MDBox>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card className="mt-3">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Naira
                  </Typography>
                  <Typography>1 USD = {subValues?.OneUsd} ₦</Typography>
                  <Typography>
                    {/* Price: <span className="h4">{subValues?.OneUsd}</span> */}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className="text-light mt-3"
                    onClick={() => handlePlanChange("OneUsd", subValues.OneUsd)}
                  >
                    Change Price
                  </Button>
                </CardContent>
              </Card>
              <Card className="mt-3">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Basic
                  </Typography>
                  <Typography>Plan: Basic</Typography>
                  <Typography>
                    Price: <span className="h4">{subValues?.Basic} USD </span>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className="text-light mt-3"
                    onClick={() =>
                      handlePlanChange("Basic", subValues?.Basic == "Free" ? 0 : subValues.Basic)
                    }
                  >
                    Change Price
                  </Button>
                </CardContent>
              </Card>
              <Card className="mt-3">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Premium
                  </Typography>
                  <Typography>Plan: Premium </Typography>
                  <Typography>
                    Price: <span className="h4">{subValues?.Premium} USD </span>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className="text-light mt-3"
                    onClick={() => handlePlanChange("Premium", subValues?.Premium)}
                  >
                    Change Price
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card className="mt-3">
                <CardContent>
                  <Typography variant="h5" component="div">
                    Standard
                  </Typography>
                  <Typography>Plan: Standard</Typography>
                  <Typography>
                    Price: <span className="h4">{subValues?.Standard} USD </span>
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className="text-light mt-3"
                    onClick={() => handlePlanChange("Standard", subValues?.Standard)}
                  >
                    Change Price
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <DialogContent>
              <Typography variant="h5" component="div">
                Basic
              </Typography>
              <div className="mt-0">
                <Typography variant="h6" className="mt-0 mb-2">
                  Change Price{" "}
                </Typography>
                <Button
                  variant="contained"
                  className="text-light btn-xl ps-5 pe-5 h5 fs-5"
                  color="primary"
                  onClick={() => handleAddition(priceCounter)}
                >
                  +
                </Button>
                {/* <Typography variant="h6" className="ms-3" component={"span"}>
                  {priceCounter}
                </Typography> */}
                <TextField
                  className="ms-1"
                  label="Price"
                  type={priceCounter == "Free" ? "text" : "number"}
                  value={priceCounter}
                  onChange={(e) => setPriceCounter(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  className="text-light btn-xl ps-5 pe-5 ms-3 fs-5"
                  onClick={() => handlePriceChange(priceCounter)}
                >
                  -
                </Button>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button
                className="text-light"
                variant="contained"
                color="primary"
                onClick={() =>
                  selectedPlan == "OneUsd"
                    ? updateSubscriptionNaira(selectedPlan, priceCounter)
                    : updateSubscriptionValue(selectedPlan, priceCounter)
                }
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Subcription;
