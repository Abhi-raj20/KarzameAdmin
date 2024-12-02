import { Alert, Box, Modal,Dialog,Avatar,Button } from "@mui/material";
import React from "react";
import { Link,useNavigate } from "react-router-dom";

const TripAlert = React.memo(({ isOpen,userInfo, onClose, notification, index, type }) => {
  // const navigate = useNavigate();
  // navigate("locate:239")
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const modalTop = 1 + index * 0.7 + "%";
  const navigate = useNavigate();
  console.log("vir item >>>>>>>>", notification);
  return (
    <Modal
      open={isOpen}
      // className="position-relative"
      style={{ borderRadius: 5, marginTop: modalTop }}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        // className=""
        // style={{
        //   backgroundColor: "white",
        //   borderRadius: 20,
        //   alignSelf: "center",
        //   marginTop: "10%",
        //   marginLeft: "auto", 
        //   marginRight: "auto",
        //   height: 320,
        //   width: 550,
        // }}
      >
       <Dialog open={open} onClose={handleClose}>
      {userInfo && (
        <Box
          sx={{
            width: 250,
            padding: 3,
            borderRadius: 2,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <Avatar
            alt="User Photo"
            src={userInfo.userImage}
            sx={{ width: 80, height: 80 }}
          />
          <Link to={`/app1map/${userInfo?.id}`}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#d32f2f",
                color: "#ffffff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#c62828" },
              }}
            >
              Short Distance Escort Request
            </Button>
          </Link>
          <Box
            sx={{
              width: "100%",
              padding: 1,
              backgroundColor: "#00bcd4",
              color: "#ffffff",
              textAlign: "center",
              borderRadius: 1,
            }}
          >
            {userInfo.userName}
          </Box>
          <Box
            sx={{
              width: "100%",
              padding: 1,
              backgroundColor: "#d32f2f",
              color: "#ffffff",
              textAlign: "center",
              borderRadius: 1,
            }}
          >
            {userInfo.userPhone}
          </Box>
          <Link to={`/app1map/${userInfo?.id}`}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#000000",
                color: "#ffffff",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#333333" },
              }}
            >
              Escort
            </Button>
          </Link>
        </Box>
      )}
    </Dialog>
      </Box>
    </Modal>
  );
});

export default TripAlert;
