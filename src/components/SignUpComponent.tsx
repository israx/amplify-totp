import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";
import React, { useState } from "react";
import { Auth } from "aws-amplify";

type SignUpFormData = {
  username: string;
  password: string;
  email: string;

};
export const SignUpComponent = ({
  setAuthState,
}: {
  setAuthState: Function;
}) => {
  const [data, setData] = useState<SignUpFormData>({
    username: "",
    password: "",
    email: "",
 
  });

  async function handleSignUp() {
    try {
      const resp = await Auth.signUp({
        username: data.username,
        password: data.password,
        attributes: {
          email: data.email,
        },
      });

      console.log(resp)
      data.username && localStorage.setItem("username", data.username);
      setAuthState("confirmSignUp");
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
        width: "350px",
        padding: 2,
        border: "1px solid gray",
        borderRadius: "8px",
      }}
    >
      <FormControl>
        <InputLabel htmlFor="username">Username</InputLabel>
        <Input
          id="username"
          name="username"
          onChange={handleChange}
          value={data.username}
        />
      </FormControl>

      <FormControl>
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          name="password"
          onChange={handleChange}
          value={data.password}
        />
      </FormControl>

      <FormControl>
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          id="email"
          name="email"
          onChange={handleChange}
          value={data.email}
        />
      </FormControl>

      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Button variant="contained" onClick={() => handleSignUp()}>
          Sign Up
        </Button>
        <Button variant="text" onClick={() => setAuthState("signIn")}>
          Go back to sign in
        </Button>
      </Box>
    </Box>
  );
};
