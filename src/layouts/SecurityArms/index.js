
// Material Dashboard 2 React components
import MDBox from "components/MDBox";


import { Grid, Typography, Card, CardContent, Button, Dialog, DialogContent, DialogActions, Container } from '@mui/material';
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import { useCallback, useEffect, useState } from "react";
import container from "assets/theme/components/container";
import { ToastContainer } from "react-toastify";
import MDTypography from "components/MDTypography";

import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";





function SecurityArms() {
    const [selectedPlan, setSelectedPlan] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [priceCounter, setPriceCounter] = useState(30); // Default price
    const [armsValue, setArmsValue] = useState({ Days: 0, Distance_covered: 0, SecurityMen: 0, SecurityRate: 0 })

    const [selectedValue, setSelectedValue] = useState('');

    const [newType, setNewType ] = useState('');


    const getSecurityData = async () => {
        const dataBase = getDatabase();
        const adminRef = ref(dataBase, "/adminLogin/SecurityData"); // Navigate to the "SecurityData" node under "adminLogin"

        try {
            const snapshot = await get(adminRef);
            const securityData = snapshot.val();

            if (securityData) {
                // Now, `securityData` contains the Security Data
                setArmsValue(securityData)
                console.log(securityData); // You can process or log the security data here
            } else {
                console.log("No Security Data found.");
            }
        } catch (error) {
            console.error("Error fetching Security Data:", error);
        }
    };






    const handlePriceChange = (type) => {
        // setnewValue(newPrice - 1)
        if (type === "Days" || type === "Distance_covered" || type === "SecurityMen" || type === "SecurityRate") {
            setArmsValue({ ...armsValue, [type]: armsValue[type] - 1 });
        }
    }

    const handleAddition = (type) => {
        if (type === "Days" || type === "Distance_covered" || type === "SecurityMen" || type === "SecurityRate") {
            setArmsValue({ ...armsValue, [type]: armsValue[type] + 1 });
        }
    };



    const openModal = (value) => {
        setIsModalOpen(true);
        setSelectedValue(value);
        getLabelForSelectedValue(value)
    };

    const getLabelForSelectedValue = (selectedValue) => {
        let label;
        switch (selectedValue) {
          case "Days":
            label = "Days";
            break;
          case "Distance_covered":
            label = "Distance Covered";
            break;
          case "SecurityMen":
            label = "Security Men";
            break;
          case "SecurityRate":
            label = "Security Rate";
            break;
          default:
            label = selectedValue;
            break;
        }
      
        // Set the newType state with the computed label
        setNewType(label);
      
        return label;
      };
      
      
      
      
      
      


    const handleSave = (armsValue) => {
        const dataBase = getDatabase();
        const securityRef = ref(dataBase, '/adminLogin/SecurityData'); // Update the path to your SecurityData

        try {
            // Use the set function to update the data in the database
            set(securityRef, armsValue, (error) => {
                if (error) {
                    console.error('Error updating SecurityData:', error);
                } else {
                    console.log('SecurityData updated successfully.');
                }
            });
        } catch (error) {
            console.error('Error updating SecurityData:', error);
        }
        setIsModalOpen(false)
    };






    useEffect(() => {
        getSecurityData()

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
                        Armed Security Management
                        </MDTypography>
                    </MDBox>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Card className="mt-3">
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Days
                                    </Typography>
                                    <Typography>
                                        Days: <span className="h4">{armsValue?.Days}</span>
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="text-light mt-3"
                                        onClick={() => openModal('Days')}
                                    >
                                        Change Value
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Card className="mt-3">
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Distance Covered
                                    </Typography>
                                    <Typography>
                                        Distance Covered: <span className="h4">{armsValue?.Distance_covered}</span>
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="text-light mt-3"
                                        onClick={() => openModal('Distance_covered')}
                                    >
                                        Change Value
                                    </Button>
                                </CardContent>
                            </Card>

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Card className="mt-3">
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Security Men
                                    </Typography>
                                    <Typography>
                                        Security Men: <span className="h4">{armsValue?.SecurityMen}</span>
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="text-light mt-3"
                                        onClick={() => openModal('SecurityMen')}
                                    >
                                        Change Value
                                    </Button>
                                </CardContent>
                            </Card>

                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Card className="mt-3">
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Security Rate
                                    </Typography>
                                    <Typography>
                                        Security Rate: <span className="h4">{armsValue?.SecurityRate}</span>
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="text-light mt-3"
                                        onClick={() => openModal('SecurityRate')}
                                    >
                                        Change Value
                                    </Button>
                                </CardContent>
                            </Card>

                        </Grid>


                    </Grid>



                    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <DialogContent>
                            <Typography variant="h5" component="div">
                                {newType}
                            </Typography>
                            <div className="mt-0">
                                <Typography variant="h6" className="mt-0 mb-2">Change {newType} </Typography>
                                <Button
                                    variant="contained"
                                    className="text-light btn-xl ps-5 pe-5 h5 fs-5"
                                    color="primary"
                                    onClick={() => handleAddition(selectedValue)}
                                >
                                    +
                                </Button>
                                <Typography variant="h6" className="ms-3" component={"span"}>
                                    {armsValue[selectedValue]}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className="text-light btn-xl ps-5 pe-5 ms-3 fs-5"

                                    onClick={() => handlePriceChange(selectedValue)}
                                >
                                    -
                                </Button>
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button type="button" className="text-light" variant="contained" color="primary" onClick={() => handleSave(armsValue)}>
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

export default SecurityArms;
