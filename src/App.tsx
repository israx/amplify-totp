import React, { useEffect, useState } from "react";
import { Amplify, Auth, Hub } from "aws-amplify";
import awsConfig from "./aws-exports";
//import { Authenticator } from "@aws-amplify/ui-react";
import { Authenticator } from "./screens/Authenticator";
import "@aws-amplify/ui-react/styles.css";
import { Home } from "./screens/Home";

Amplify.configure({
  ...awsConfig,
});

function App() {
 
  return (
    <div
      className="App"
      style={{
        padding: "3rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <Authenticator>{(user) => <Home user={user} />}</Authenticator>
    </div>
  );
}

export default App;
