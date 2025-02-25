// src/components/common/AddressInput.js
import React from "react";
import { Box, Button } from "@mui/material";
import CustomTextField from "./CustomTextField";

const AddressInput = ({ address, setAddress, onSearch }) => {
    return (
        <Box sx={{ display: "flex", gap: "10px" }}>
            <CustomTextField 
                label="주소" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                required 
            />
            <Button variant="outlined" onClick={onSearch}>
                주소 찾기
            </Button>
        </Box>
    );
};

export default AddressInput;
