import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";
import React, { useState } from "react";

import { Auth } from "aws-amplify";

type ConfirmSignUpFormData = {
  code: string;
};
export const ConfirmSignUpComponent = ({
  setAuthState,
}: {
  setAuthState: Function;
}) => {
  const [data, setData] = useState<ConfirmSignUpFormData>({
    code: "",
  });

  async function handleConfirm() {
    try {
      const username = localStorage.getItem("username") ?? "";
      const resp = await Auth.confirmSignUp(username, data.code);

      console.log(resp);
      setAuthState("signIn");
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "300px",
        padding: 2,
        border: "1px solid gray",
        borderRadius: "8px",
      }}
    >
      <FormControl>
        <InputLabel htmlFor="code">Code</InputLabel>
        <Input
          id="code"
          name="code"
          onChange={handleChange}
          value={data.code}
        />
      </FormControl>
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Button variant="contained" onClick={handleConfirm}>
          Confirm
        </Button>
        <Button variant="text">Go to Sign In</Button>
      </Box>
    </Box>
  );
};
