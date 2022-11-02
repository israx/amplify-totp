import React, { useState } from "react";
import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";
import { Auth } from "aws-amplify";
import { setUser } from "../utils/storage";
import { AuthApi } from "../service/auth";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { useSearchParams } from "react-router-dom";

type SignInFormData = {
  username: string;
  password: string;
};
export const SignInComponent = ({
  user,
  setAuthState,
}: {
  user: any;
  setAuthState: Function;
}) => {
  const [data, setData] = useState<SignInFormData>({
    username: "",
    password: "",
  });

  const [searchParams, setSearchParams] = useSearchParams();

  async function handleSignIn() {
    try {
     
      const resp = await Auth.signIn(data.username, data.password);

      console.log(resp);

     
      user.current = resp;
      
      const authenticationFlowType = resp.authenticationFlowType;

      

      switch (resp.challengeName) {
        case "CUSTOM_CHALLENGE":
          return setAuthState("authChallenge");
        case "SOFTWARE_TOKEN_MFA":
          return setAuthState("confirmSignInTOTP");
        case "NEW_PASSWORD_REQUIRED":
          return setAuthState("newPasswordRequired");
        case "MFA_SETUP":
          const secretCode = await Auth.setupTOTP(resp);
          setSearchParams({ code: secretCode });
          console.log(secretCode);
          return setAuthState("verifyTotp");
      }

      setAuthState("authenticated");
    } catch (error) {
      console.log(error);
    }
  }
  async function handleFederate() {
    try {
      const credentials = await AuthApi.federate(
        CognitoHostedUIIdentityProvider.Google
      );
      console.log(credentials);
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

        padding: 3,
        border: "1px solid gray",
        borderRadius: "8px",
      }}
    >
      <FormControl>
        <InputLabel htmlFor="username">Email address</InputLabel>
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
      <Box display="flex" justifyContent="center" gap={2} mt={2}>
        <Button variant="contained" onClick={handleSignIn}>
          Sign In
        </Button>
        <Button variant="contained" onClick={handleFederate}>
          Google
        </Button>
        <Button variant="text" onClick={() => setAuthState("signUp")}>
          {" "}
          Sign up
        </Button>
      </Box>
    </Box>
  );
};
