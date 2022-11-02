import { Box, Button, Switch } from "@mui/material";
import { Auth } from "aws-amplify";
import { useState } from "react";
import { AuthApi } from "../service/auth";
import { AuthFlows } from "../Interface/enums/authFlow";
import { QRCodeComponent } from "../components/QRCodeComponent";
import { useSearchParams } from "react-router-dom";

export const Home = ({ user }: { user: any }) => {
  const [authFlow, setAuthFlow] = useState<string | null>(
    user.authenticationFlowType
  );
  const preferedMFA = user.preferredMFA;

  const [checked, setChecked] = useState({
    custom: authFlow === AuthFlows.CUSTOM_AUTH ? true : false,
    totp: preferedMFA === "SOFTWARE_TOKEN_MFA" ? true : false,
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get("code");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setChecked((prev) => {
      if (name === "custom") {
        handleAuthFlowType(checked);
      } else if (name === "totp") {
        handleTOTP(checked);
      }

      return {
        ...prev,
        [name]: checked,
      };
    });
  };

  async function handleSetAuthFlow() {
    try {
      const resp = await Auth.currentAuthenticatedUser();
      setAuthFlow(resp.authenticationFlowType);
    } catch (error) {
      console.log(error);
    }
  }

  function handleAuthFlowType(checked: boolean) {
    if (checked) return AuthApi.setAuthFlow(AuthFlows.CUSTOM_AUTH);

    AuthApi.setAuthFlow(AuthFlows.USER_SRP_AUTH);
  }

  async function handleTOTP(checked: boolean) {
    // Set to NO MFA when no checked
    if (!checked) {
      Auth.setPreferredMFA(user, "NOMFA");
      searchParams.delete("code");
      return setSearchParams(searchParams);
    }
    try {
      const code = await Auth.setupTOTP(user);

      setSearchParams({ code });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Box
      sx={{
        border: "solid 1px #DCDCDC",
        padding: 1,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",

        boxShadow: 1,
      }}
    >
      <Button onClick={async () => console.log(await AuthApi.getCredentials())}>
        Credentials
      </Button>
      <Button
        onClick={async () => console.log(await Auth.currentAuthenticatedUser())}
      >
        User
      </Button>
      <Box>
        <Button onClick={() => handleSetAuthFlow()}>Type of auth flow</Button>:{" "}
        {authFlow}
      </Box>
      <Box>
        CUSTOM_AUTH:
        <Switch
          name="custom"
          checked={checked.custom}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Box>
      <Box>
        TOTP:
        <Switch
          name="totp"
          checked={checked.totp}
          onChange={handleChange}
          inputProps={{ "aria-label": "controlled" }}
        />
      </Box>

      {code && <QRCodeComponent user={user} />}

      <Button
        variant="contained"
        onClick={async () => {
          Auth.signOut();
          localStorage.removeItem("user");
        }}
      >
        Sign Out
      </Button>
    </Box>
  );
};
