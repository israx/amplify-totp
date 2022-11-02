import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Auth } from "aws-amplify";
import { AuthFlows } from "../Interface/enums/authFlow";
import { PreferredMFA } from "../Interface/auth/auth";

class CognitoAuth {
  async getCredentials() {
    const credentials = Auth.Credentials.get();
    const currentCred = await Auth.currentCredentials();
    const currentUserCred = await Auth.currentUserCredentials();
    return { credentials, currentCred, currentUserCred };
  }

  async federate(provider: CognitoHostedUIIdentityProvider) {
    const credentials = await Auth.federatedSignIn({ provider });
  }

  async signIn(username: string, password?: string) {
    return await Auth.signIn(username, password);
  }

  async customeAuthChallenge(user: any, resp: string) {
    return await Auth.sendCustomChallengeAnswer(user, resp);
  }

  async signUp(signUpOp: {
    username: string;
    password: string;
    email: string;
    phone_number: string;
  }) {
    return await Auth.signUp({
      username: signUpOp.username,
      password: signUpOp.password,

      attributes: {
        email: signUpOp.email,
      },
    });
  }

  async confirmSignUp(username: string, code: string) {
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
      console.log("error confirming sign up", error);
    }
  }

  async setAuthFlow(flow: AuthFlows) {
    const configs = Auth.configure({
      authenticationFlowType: flow,
    });
  }

  async setMFA(user: any, mfa: PreferredMFA) {
    
    return Auth.setPreferredMFA(user, mfa);
  }
}

export const AuthApi = new CognitoAuth();
