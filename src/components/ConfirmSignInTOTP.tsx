import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Auth } from "aws-amplify";

export const ConfirmSignInTOTP = ({
  user,
  setAuthState,
}: {
  user: any;
  setAuthState: Function;
}) => {
  const [verificationCode, setVerificationCode] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVerificationCode(e.target.value);
  }

  async function handleVerify() {
    if (!verificationCode)
      return console.warn("verification code can't be empty");

    try {
      const resp = await Auth.confirmSignIn(
        user.current,
        verificationCode,
        "SOFTWARE_TOKEN_MFA"
      );

      console.log(resp)

     
      user.current = await Auth.currentAuthenticatedUser();

      setAuthState("authenticated");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box
      sx={{
        padding: 2,
        border: "1px solid #DCDCDC",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h2">
        QR CODE
      </Typography>

      <TextField value={verificationCode} onChange={handleChange} />
      <Button onClick={() => handleVerify()}>Verify</Button>
    </Box>
  );
};
