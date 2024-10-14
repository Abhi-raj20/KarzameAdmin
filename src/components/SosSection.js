import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ButtonBase from "@mui/material/ButtonBase"; // Import ButtonBase

import { CircularProgressBar } from "@tomik23/react-circular-progress-bar";

const SosSection = ({ color, title, icon, OnPress, count, per }) => {
  const props = {
    percent: per, // Your other props here
    colorSlice: color,
    colorCircle: "#00a1ff",
    fontColor: "#ffff",
    fontSize: "1.6rem",
    fontWeight: 400,
    size: 60,
    stroke: 7,
    strokeBottom: 5,
    speed: 60,
    cut: 0,
    rotation: -90,
    opacity: 10,
    fill: "#00000",
    unit: "%",
    textPosition: "0.35em",
    animationOff: false,
    strokeDasharray: "10,1",
    inverse: false,
    round: false,
    number: true,
    linearGradient: ["#ffff"],
  };
  return (
    <ButtonBase
      onClick={OnPress}
      style={{
        width: 270,
        height: "100px !important", // Use !important to override conflicting styles
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 20px",
        marginLeft: 10,
        borderRadius: 5,
      }}
    >
      <IconButton color="inherit">{icon}</IconButton>

      {title !== "All" ? <CircularProgressBar {...props}></CircularProgressBar> : null}

      <Typography
        color="white"
        variant="h6"
        component="div"
        style={{ color: "white", width: 150 }}
        sx={{
          marginEnd: 20,
          color: "white",
        }}
      >
        {title}
        <br />
        {count}
      </Typography>
    </ButtonBase>
  );
};

export default SosSection;
