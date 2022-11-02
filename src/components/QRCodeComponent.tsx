import { Box, Button, TextField, Typography } from "@mui/material";
import QRCode from "react-qr-code";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Auth } from "aws-amplify";

export const QRCodeComponent = ({ user }: { user: any }) => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();

  // get qr code from the query string
  const QRcode = searchParams.get("code");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVerificationCode(e.target.value);
  }

  const str =
    "otpauth://totp/AWSCognito:" + user.username + "?secret=" + QRcode;

  async function handleVerify() {
    if (!QRcode)
      throw new Error(
        "QR code is not defined, please check the value of your query string"
      );

    if (!verificationCode)
      return console.warn("verification code can't be empty");

    try {
      const resp = await Auth.verifyTotpToken(user, verificationCode);
      console.log({ resp });
      const mfaRes = await Auth.setPreferredMFA(user, "TOTP");
      console.log(mfaRes);

      searchParams.delete("code");
      setSearchParams(searchParams);
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
        display: QRcode ? "flex" : "none",
        flexDirection: "column",
        gap: 2,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" component="h2">
        QR CODE
      </Typography>

      {/* 
        show QR code and verify button as long as 
        the QRcode from the query string is not null
       */}
      {QRcode && <QRCode value={str} />}
      <TextField value={verificationCode} onChange={handleChange} />
      {QRcode && <Button onClick={() => handleVerify()}>Verify</Button>}
    </Box>
  );
};
