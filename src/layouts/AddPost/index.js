import React, { useEffect, useState } from "react";
import { Card, Grid, Modal, Typography, Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";
import Zoom from "react-img-hover-zoom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import ClipLoader from "react-spinners/ClipLoader";

function AddPost() {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [imgUrl, setImageUrl] = useState(null);
  const [per, setPer] = useState(null);
  const [loading, setLoading] = useState(false);
  const deletePost = async (id) => {
    console.log(id);
    const res = await deleteDoc(doc(db, "posts", id));
    getData();
  };

  const handleOpenImage = async () => {
    alert ('img')
  };

  const handleCloseImage = async () => {
    alert ('closeing')
  };

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const arr = [];
    querySnapshot.forEach((_item) => {
      console.log("post data  >>>", _item.id);
      const item = _item.data();
      arr.push({
        Name: item.userHandle,
        Id: item.userId,
        Image: (
          // <Zoom
          //   img={item.postImg}
          //   zoomScale={5}
          //   width={100}
          //   height={100}
          //   className=""
          // />
          <img
            src={item.postImg}
            alt="post image error"
            id={item.postImg}
            onMouseOver={() => handleOpenImage()}
            onMouseOut={() => handleCloseImage()}
            style={{ width: "50px", height: "50px", borderRadius: "20%" }}
          />
        ),
        Comments: item.comments,
        Likes: item.Likes ? item.Likes : 0,
        status: item.userEmail,
        action: (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => deletePost(_item.id)}
          >
            delete
          </button>
        ),
      });
    });
    setRows(arr);
  };
  const handleSelectFile = (e) => {
    setFile(e.target.files[0]);
    console.log(e.target.files[0]);
  };
  const uploadFile = () => {
    const name = new Date().getTime() + file.name;
    const storageRef = ref(storage, name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setPer(progress);
        console.log(progress);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          setImageUrl(downloadURL);
          setLoading(false);
          return downloadURL;
        });
      }
    );
  };
  const handleSubmit = async () => {
    var userData = JSON.parse(localStorage.getItem("user"));
    const docRef = await addDoc(collection(db, "posts"), {
      userId: userData.uid,
      userHandle: "Admin",
      postTime: serverTimestamp(),
      content: "post",
      likes: 0,
      comments: 0,
      likesByUsers: [],
      dislikes: 0,
      dislikesByUsers: [],
      postImg: imgUrl,
    });
    console.log(docRef);
    getData();
    setOpen(false);
  };
  useEffect(() => {
    getData();
    if (file) {
      setLoading(true);
      uploadFile();
    }
  }, [file]);
  const columns = [
    { Header: "Post By", accessor: "Name", align: "left" },
    { Header: "User Id", accessor: "Id", align: "left" },
    { Header: "Image", accessor: "Image", align: "left" },
    { Header: "Comments", accessor: "Comments", align: "center" },
    { Header: "Likes", accessor: "Likes", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  //   const rows = [
  //     {
  //       Name: "mudasaar",
  //       Image: "test",
  //     },
  //     {
  //       Name: "mudasaar",
  //       Image: "test",
  //     },
  //     {
  //       Name: "mudasaar",
  //       Image: "test",
  //     },
  //   ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
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
                <MDTypography variant="h6" color="white">
                  Posts
                </MDTypography>
                <div style={{ float: "right", height: 0, marginTop: -40 }}>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => setOpen(true)}
                    style={{
                      fontSize: 30,
                      color: "white",
                      backgroundColor: "none",
                      borderColor: "none",
                    }}
                  >
                    +
                  </button>
                </div>
                <Modal
                  open={open}
                  style={{ borderRadius: 20 }}
                  onClose={() => setOpen(false)}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    style={{
                      backgroundColor: "white",
                      borderRadius: 20,
                      alignSelf: "center",
                      width: 500,
                      marginTop: "10%",
                      marginLeft: "auto",
                      marginRight: "auto",
                      height: 450,
                    }}
                  >
                    <Typography
                      id="modal-modal-title"
                      className="hello , test fslkslk"
                      variant="h6"
                      component="h2"
                      align="center"
                      padding={2}
                    >
                      Create Post
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Whats on your mind?"
                        style={{
                          height: "auto",
                          width: 430,
                          fontSize: 12,
                          alignSelf: "center",
                          marginLeft: "auto",
                          marginRight: "auto",
                          border: "none",
                          marginTop: 30,
                        }}
                      />
                      <div>
                        {loading ? (
                          <ClipLoader
                            color={"red"}
                            loading={loading}
                            cssOverride={{}}
                            size={40}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                            title="uploading"
                          />
                        ) : (
                          <img
                            src={
                              file
                                ? URL.createObjectURL(file)
                                : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            height={200}
                            width={200}
                            alt="error"
                            style={{ alignSelf: "center", borderRadius: 20 }}
                          />
                        )}
                      </div>
                      <input
                        id="file"
                        className="form-control form-control-sm w-50 mt-5"
                        style={{
                          alignSelf: "center",
                          marginRight: "auto",
                          marginLeft: "auto",
                        }}
                        type="file"
                        onChange={(e) => handleSelectFile(e)}
                      />
                    </Typography>
                    <button
                      disabled={per !== null && per < 100}
                      type="button"
                      id="submit_btn"
                      onClick={() => handleSubmit()}
                      className="btn btn-primary btn btn-sm ps-3 pe-3"
                      style={{
                        marginTop: "2%",
                        marginLeft: "45%",
                        marginRight: "45%",
                        alignSelf: "center",
                      }}
                    >
                      post
                    </button>
                  </Box>
                </Modal>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default AddPost;
