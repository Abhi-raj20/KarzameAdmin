import { Box } from "@mui/material";
import React from "react";

const EmptyData = () => {
  return (
    <Box mx={2} mt={-3} py={3} px={2} variant="gradient" bgColor="white">
      <p style={{}}>No data available.</p>
    </Box>
  );
};

export default EmptyData;
