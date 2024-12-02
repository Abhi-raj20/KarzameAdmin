// import MDBox from "components/MDBox";
// import {
//    TextField,  Select,
//   Grid,
//   Button,
//   Typography,
//   Card,
//   CardContent,
//   Container,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Box,
//   InputLabel, MenuItem, FormControl, 
// } from "@mui/material";
// // import  Select from '@mui/material/Select';
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";
// import MDTypography from "components/MDTypography";
// import { getDatabase, ref, get } from "firebase/database";
// import { styled } from '@mui/material/styles';
// import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useSelector } from "react-redux";

// function Recharge() {
//   const navigate = useNavigate();
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [usedAmount, setUsedAmount] = useState(0);
//   const [unusedAmount, setUnusedAmount] = useState(0);
//   const [rechargeCards, setRechargeCards] = useState([]);
//   const [age, setAge] = useState('');
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [userId, setUserId] = useState("");
//   const [kmRange, setKmRange] = useState("");
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const allData = useSelector((state) => state.data.allData);
//  //  Sample list of users
//   //  const users = [
//   //   { id: "1", name: "User 1" },
//   //   { id: "2", name: "User 2" },
//   //   { id: "3", name: "User 3" },
//   // ];
//   let users = [];

//   const getData = async () => {
//       setLoading(true);
//       setRows([]); 
//       users = []; // Reset users array at the beginning
//       const dataBase = getDatabase();
//       const usersRef = ref(dataBase, "/users");
  
//       try {
//           const snapShot = await get(usersRef);
  
//           if (snapShot.exists()) {
//               const data = snapShot.val();
//               const newRows = [];
//               let index = 1;
  
//               for (const key in data) {
//                   if (data.hasOwnProperty(key)) {
//                       const user = data[key];
//                       console.log("User data...", user.userName);
                      
//                       const userData = {
//                           id: index,
//                           name: user.userName,
//                       };
                      
//                       users.push(userData);
//                       newRows.push(userData); // Add user data to newRows
//                       index++;
//                   }
//               }
  
//               setRows(newRows); // Update state with newRows
//           }
//       } catch (error) {
//           console.error("Error fetching data:", error);
//       } finally {
//           setLoading(false);
//       }
//   };
  

//     // getData();
//   // KM range options
//   const kmRanges = ["0-10 KM", "10-20 KM", "20-30 KM"];
//   const handleFileChange = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile || !userId || !kmRange) {
//       alert("Please fill in all the fields!");
//       return;
//     }

//     // Create form data
//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     formData.append("userId", userId);
//     formData.append("kmRange", kmRange);

//     try {
//       // API call
//       const response = await axios.post("http://api.itracknet.com/upload", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("File uploaded successfully:", response.data);
//       alert("File uploaded successfully");
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("Error uploading file");
//     }
//   };


//   const VisuallyHiddenInput = styled('input')({
//     clip: 'rect(0 0 0 0)',
//     clipPath: 'inset(50%)',
//     height: 1,
//     overflow: 'hidden',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     whiteSpace: 'nowrap',
//     width: 1,
//   });
  
//   const handleChange = (event) => {
//     setAge(event.target.value);
//   };

//   const handleFileUpload = (event) => {
//     const files = event.target.files;
//     console.log("Uploaded files:", files);
//     // Add logic to handle file upload
//   };

//   const getRechargeCards = async () => {
//     const dataBase = getDatabase();
//     console.log("Fetching recharge cards...");

//     const rechargeRef = ref(dataBase, "/users"); // Adjust the path as needed

//     try {
//       const snapshot = await get(rechargeRef);
//       const data = snapshot.val();
//       if (data && allData) {
//         const cards = Object.values(data);
//         // console.log("cardssssss....",cards);
        
//         let allCards = [];
       

//         // Iterate through each user and gather all recharge cards
//         cards.forEach(user => {
//           // console.log("uuser....",user);
          
//           if (user.RechargeCards) {
//             // Assuming `username` and `mobilenumber` are properties of the `user` object
//             const username = user.userName || "Unknown"; // Default to "Unknown" if username is not present
//             const mobileNumber = user.userPhone  || "Unknown"; // Default to "Unknown" if mobile number is not present
            
//             // RechargeCards is an object, so we need to loop through its keys
//             const rechargeCardEntries = Object.entries(user.RechargeCards);
            
//             rechargeCardEntries.forEach(([key, card]) => {
//               // Each `card` is now an individual recharge card object
//               allCards.push({
//                 id: key, // Key is the unique card identifier
//                 username, // Include username
//                 mobileNumber, // Include mobile number
//                 ...card  // Spread the card object to get all its properties
//               });
//             });
//           }
//         });
//         console.log("alll cards",allCards);
        
//         setRechargeCards(allCards);

//         const total = allCards.length;
//         const used = allCards.filter(card => card.Status === "Used").length;
//         const unused = total - used;
  
//         setTotalAmount(total);
//         setUsedAmount(used);
//         setUnusedAmount(unused);
//       }
//       // if (data) {
//       //   const cards = Object.values(data);
//       //   const cardList = cards.flatMap(user => user.RechargeCards || []);
        
//       //   console.log("Recharge cards data:", cardList);
//       //   for (const users in cardList) {
//       // const user = cardList[users];
//       // console.log("user recharge data", user);
//       // setRechargeCards(user);

//       // const total = user.length;
//       // const used = user.filter(card => card.Status === "Used").length;
//       // const unused = total - used;

//       // setTotalAmount(total);
//       // setUsedAmount(used);
//       // setUnusedAmount(unused);
//       // for (const element in user) {
//       //   const data = user[element];
//       //   console.log("data....", data);
        
      
//       // }
//       // const recharge = user.RechargeCards;
//       // console.log("recharge user....",recharge);
      
      
//       //   }
//       //   setRechargeCards(cardList);

//       //   const total = cardList.length;
//       //   const used = cardList.filter(card => card.Status === "Used").length;
//       //   const unused = total - used;

//       //   setTotalAmount(total);
//       //   setUsedAmount(used);
//       //   setUnusedAmount(unused);
//       // }
//        else {
//         console.log("No recharge cards found.");
//       }
//     } catch (error) {
//       console.error("Error fetching recharge cards:", error);
//     }
//   };
// console.log("users form data.....",users);

//   useEffect(() => {
//     const user = localStorage.getItem("user");
//     if (!user) {
//         navigate("/authentication/sign-in");
//     }
//     getRechargeCards();
//     getData();
//     // getData();
// }, [allData]);

 
//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox py={3}>
//         <Container>
//           <MDBox
//             mx={2}
//             mt={-3}
//             py={3}
//             px={2}
//             variant="gradient"
//             bgColor="info"
//             borderRadius="lg"
//             coloredShadow="info"
//           >
//             <ToastContainer />
//             <MDTypography variant="h6" color="white">
//               Recharge Cards Dashboard
//             </MDTypography>
//           </MDBox>

//           <Grid container spacing={2} my={3}>
//             <Grid item xs={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h4" align="center" color="primary">
//                     {totalAmount}
//                   </Typography>
//                   <Typography variant="h6" align="center" color="textSecondary">
//                     Total
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h4" align="center" color="primary">
//                     {usedAmount}
//                   </Typography>
//                   <Typography variant="h6" align="center" color="textSecondary">
//                     Used
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//             <Grid item xs={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h4" align="center" color="primary">
//                     {unusedAmount}
//                   </Typography>
//                   <Typography variant="h6" align="center" color="textSecondary">
//                     Unused
//                   </Typography>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         { allData ?  <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{
//         display: "flex",
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         gap: 2,
//         p: 2,
//       }}
//     >
//       <input type="file" onChange={handleFileChange} />

//       <FormControl fullWidth>
//         <InputLabel id="user-select-label">User Name</InputLabel>
//         <Select
//           labelId="user-select-label"
//           value={userId}
//           label="User Name"
//           onChange={(e) => setUserId(e.target.value)}
//         >
//           {rows.map((user) => (
//             <MenuItem key={user.id} value={user.id}>
//               {user.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <FormControl fullWidth>
//         <InputLabel id="km-range-label">KM Range</InputLabel>
//         <Select
//           labelId="km-range-label"
//           value={kmRange}
//           label="KM Range"
//           onChange={(e) => setKmRange(e.target.value)}
//         >
//           {kmRanges.map((range, index) => (
//             <MenuItem key={index} value={range}>
//               {range}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <Button type="submit" variant="contained" color="primary">
//         Submit
//       </Button>
//     </Box> : 'Null' }
        
//           <Card>
//             <CardContent>
//               <TableContainer component={Paper}>
//                 <Table>
//                   <TableHead>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell>SNo</TableCell>
//                       <TableCell>User Name</TableCell>
//                       <TableCell>Moblie Number</TableCell>
//                       <TableCell>Card Number</TableCell>
//                       <TableCell>Network</TableCell>
//                       <TableCell>Status</TableCell>
//                       <TableCell>Date</TableCell>
//                       <TableCell>Edit</TableCell>
//                     </TableRow>
                  
                  
//                     {rechargeCards.map((card, index) => (
//                       <TableRow key={index}>
//                         <TableCell>{index + 1}</TableCell>
//                         <TableCell>{card.username}</TableCell>
//                         <TableCell>{card.mobileNumber}</TableCell>
//                         <TableCell>{card.Card_Number}</TableCell>
//                         <TableCell>{card.Network}</TableCell>
//                         <TableCell>{card.Status}</TableCell>
//                         <TableCell>{new Date(card.Date).toLocaleDateString()}</TableCell>
//                         <TableCell><Button>Edit</Button></TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                     </TableHead>
//                 </Table>
//               </TableContainer>
//             </CardContent>
//           </Card>
//         </Container>
//       </MDBox>
//     </DashboardLayout>
//   );
// }

// export default Recharge;


import MDBox from "components/MDBox";
import {
  TextField, Select, Grid, Button, Typography, Card,
  CardContent, Container, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Box,
  InputLabel, MenuItem, FormControl,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import MDTypography from "components/MDTypography";
import { getDatabase, ref, get } from "firebase/database";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function Recharge() {
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [usedAmount, setUsedAmount] = useState(0);
  const [unusedAmount, setUnusedAmount] = useState(0);
  const [rechargeCards, setRechargeCards] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userId, setUserId] = useState("");
  const [kmRange, setKmRange] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const allData = useSelector((state) => state.data.allData);

  const getData = async () => {
    setLoading(true);
    const dataBase = getDatabase();
    const usersRef = ref(dataBase, "/users");

    try {
      const snapShot = await get(usersRef);

      if (snapShot.exists()) {
        const data = snapShot.val();
        const newUsers = Object.values(data).map((user, index) => ({
          id: index + 1,
          name: user.userName || "Unknown",
        }));

        setUsers(newUsers);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !userId || !kmRange) {
      alert("Please fill in all the fields!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userKey", userId);
    formData.append("KMRange", kmRange);

    try {
      const response = await axios.post("http://localhost:4001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      // alert("Error uploading file");
    }
  };

  const getRechargeCards = async () => {
    const dataBase = getDatabase();
    const rechargeRef = ref(dataBase, "/users");

    try {
      const snapshot = await get(rechargeRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const cards = Object.values(data);
        let allCards = [];

        cards.forEach((user) => {
          if (user.RechargeCards) {
            const username = user.userName || "Unknown";
            const mobileNumber = user.userPhone || "Unknown";

            Object.entries(user.RechargeCards).forEach(([key, card]) => {
              allCards.push({
                id: key,
                username,
                mobileNumber,
                ...card,
              });
            });
          }
        });

        setRechargeCards(allCards);

        const total = allCards.length;
        const used = allCards.filter((card) => card.Status === "Used").length;
        setTotalAmount(total);
        setUsedAmount(used);
        setUnusedAmount(total - used);
      }
    } catch (error) {
      console.error("Error fetching recharge cards:", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/authentication/sign-in");
    }
    getRechargeCards();
    getData();
  }, [allData]);


  const kmRanges = ["0-10 KM", "10-20 KM", "20-30 KM"];

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
              Recharge Cards Dashboard
            </MDTypography>
          </MDBox>

          <Grid container spacing={2} my={3}>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center" color="primary">
                    {totalAmount}
                  </Typography>
                  <Typography variant="h6" align="center" color="textSecondary">
                    Total
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center" color="primary">
                    {usedAmount}
                  </Typography>
                  <Typography variant="h6" align="center" color="textSecondary">
                    Used
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography variant="h4" align="center" color="primary">
                    {unusedAmount}
                  </Typography>
                  <Typography variant="h6" align="center" color="textSecondary">
                    Unused
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {allData ? (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                p: 2,
              }}
            >
              <input type="file" onChange={handleFileChange} />
              <FormControl fullWidth>
                <InputLabel id="user-select-label">User Name</InputLabel>
                <Select
                  labelId="user-select-label"
                  value={userId}
                  label="User Name"
                  onChange={(e) => setUserId(e.target.value)}
                >
                   <MenuItem value="all">All Users</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="km-range-label">KM Range</InputLabel>
                <Select
                  labelId="km-range-label"
                  value={kmRange}
                  label="KM Range"
                  onChange={(e) => setKmRange(e.target.value)}
                >
                  {kmRanges.map((range, index) => (
                    <MenuItem key={index} value={range}>
                      {range}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          ) : (
            <Typography color="error">No data available</Typography>
          )}

          <Card>
            <CardContent>
              <TableContainer component={Paper}>
                <Table>
                  
                  <TableBody>
                    <TableRow>
                      <TableCell>SNo</TableCell>
                      <TableCell>User Name</TableCell>
                      <TableCell>Mobile Number</TableCell>
                      <TableCell>Card Number</TableCell>
                      <TableCell>Network</TableCell>
                      <TableCell>KM Range</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Edit</TableCell>
                    </TableRow>
                 
                    {rechargeCards.map((card, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{card.username}</TableCell>
                        <TableCell>{card.mobileNumber}</TableCell>
                        <TableCell>{card.Card_Number}</TableCell>
                        <TableCell>{card.Network}</TableCell>
                        <TableCell>{card.KMRange}</TableCell>
                        <TableCell>{card.Status}</TableCell>
                        <TableCell>{card.Date}</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Container>
      </MDBox>
    </DashboardLayout>
  );
}

export default Recharge;
