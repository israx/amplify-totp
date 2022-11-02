import react, { useState, useEffect, useRef } from "react";
import { Auth, Hub } from "aws-amplify";
import { SignInComponent } from "../components/SignInComponent";
import { SignUpComponent } from "../components/SignUpComponent";
import { ConfirmSignUpComponent } from "../components/ConfirmSignUpComponent";
import { CustomeAuthComponent } from "../components/CustomeAuthComponent";
import { CircularProgress } from "@mui/material";
import { ConfirmSignInTOTP } from "../components/ConfirmSignInTOTP";
import { NewPasswordRequiredComponent } from "../components/NewPasswordRequiredComponent";
import { QRCodeComponent } from "../components/QRCodeComponent";

export const Authenticator = ({
  children,
}: {
  children: (user: any) => JSX.Element;
}) => {
  const [authState, setAuthState] = useState<
    | "signIn"
    | "signUp"
    | "confirmSignUp"
    | "authChallenge"
    | "confirmSignInTOTP"
    | "newPasswordRequired"
    | "authenticated"
     | "verifyTotp"
    | null
  >(null);

  const user = useRef<any>(null);
  useEffect(() => {
    setCurrentUser();

    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      const { event } = payload;
      switch (event) {
        case "signOut":
          setAuthState("signIn");
          break;
        case "autoSignIn":
          const userSession = payload.data;

          user.current = userSession
          setAuthState("authenticated")
  
          break;
      }
    });

    return unsubscribe;
  }, []);

  async function setCurrentUser() {
    try {
      const resp = await Auth.currentAuthenticatedUser();
      user.current = resp;

      return resp ? setAuthState("authenticated") : setAuthState("signIn");
    } catch (error) {
      console.log(error);
      setAuthState("signIn");
    }
  }

  switch (authState) {
    case "signIn":
      return <SignInComponent user={user} setAuthState={setAuthState} />;
    case "signUp":
      return <SignUpComponent setAuthState={setAuthState} />;
    case "confirmSignUp":
      return <ConfirmSignUpComponent setAuthState={setAuthState} />;
    case "authChallenge":
      return <CustomeAuthComponent user={user} setAuthState={setAuthState} />;
    case "confirmSignInTOTP":
      return <ConfirmSignInTOTP user={user} setAuthState={setAuthState} />;
    case "newPasswordRequired":
      return (
        <NewPasswordRequiredComponent user={user} setAuthState={setAuthState} />
      );
    case "verifyTotp":
      return <QRCodeComponent user={user.current} />
    case "authenticated":
      return children(user.current);
  }

  return <CircularProgress />;
};
