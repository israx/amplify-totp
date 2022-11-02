import React, { useState } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";
import { Auth } from "aws-amplify";

type CustomeAuthFormData = {
  challenge: string;
};
export const CustomeAuthComponent = ({
  user,
  setAuthState,
}: {
  user: any;
  setAuthState: Function;
}) => {
  const [data, setData] = useState<CustomeAuthFormData>({
    challenge: "",
  });

  async function handleCustomeAuthChallenge() {
    try {

      // before:
      const resp = await Auth.sendCustomChallengeAnswer(
        user.current,
        data.challenge
      );
    
      // after:
      
      //const res = await Authv2.confirmSignIn({challengeResponses: data.challenge})
      setAuthState("authenticated");
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
        <InputLabel htmlFor="challenge">Auth Challenge</InputLabel>
        <Input
          id="challenge"
          name="challenge"
          onChange={handleChange}
          value={data.challenge}
        />
      </FormControl>

      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Button variant="contained" onClick={handleCustomeAuthChallenge}>
          verify
        </Button>
      </Box>
    </Box>
  );
};
