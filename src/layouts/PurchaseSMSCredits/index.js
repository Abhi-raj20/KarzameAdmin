import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";

function PurchaseSMSCredits() {
  const [credits, setCredits] = useState(0);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creditBalance, setCreditBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);

  useEffect(() => {
    // Fetch credit balance on component mount
    fetchCreditBalance();
  }, []);

  const fetchCreditBalance = async () => {
    try {
      setLoadingBalance(true); // Set loading state to true while fetching
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: "MA-b2ec5784-ac65-4e7d-bbba-cef1b1aa7102",
        },
      };
      const response = await fetch("https://api.smslive247.com/api/v4/accounts/self", options);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCreditBalance(data.creditBalance);
    } catch (error) {
      console.error("Error fetching credit balance:", error);
      // Handle error if needed
    } finally {
      setLoadingBalance(false); // Set loading state to false when done fetching
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.smslive247.com/api/v4/credits/purchase", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/*+json",
          Authorization: "MA-b2ec5784-ac65-4e7d-bbba-cef1b1aa7102",
        },
        body: JSON.stringify({ amount: credits }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${JSON.stringify(errorData)}`);
      }

      // Check if response is empty before parsing JSON
      const responseData = await response.text();
      if (!responseData) {
        throw new Error("Empty response received from the server");
      }

      const data = JSON.parse(responseData);
      setResponse(data);
      toast.success("Purchase successful!");
      // Refresh credit balance after purchase
      fetchCreditBalance();
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Purchase failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
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
              Purchase SMS Credits
            </MDTypography>
          </MDBox>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card className="mt-3">
                <CardContent>
                  <div>
                    <TextField
                      type="number"
                      value={credits}
                      onChange={(e) => setCredits(e.target.value)}
                      label="Credits"
                      fullWidth
                    />

                    <Button
                      onClick={handlePurchase}
                      variant="contained"
                      color="primary"
                      className="mt-2"
                      disabled={loading}
                      style={{ color: "white" }}
                    >
                      {loading ? <CircularProgress size={24} /> : "Purchase Credits"}
                    </Button>
                    {response && <div>{JSON.stringify(response)}</div>}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Display credit balance with loader */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card className="mt-3">
                <CardContent>
                  <div>
                    {loadingBalance ? (
                      <CircularProgress />
                    ) : (
                      <MDTypography variant="h6" color="textPrimary">
                        Current Credit Balance: {creditBalance}
                      </MDTypography>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </MDBox>
    </DashboardLayout>
  );
}

export default PurchaseSMSCredits;
