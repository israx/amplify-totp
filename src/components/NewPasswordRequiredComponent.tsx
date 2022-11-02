import { Box, Button, FormControl, Input, InputLabel } from "@mui/material";
import { useState } from "react";
import { fromArrayToMap } from "../utils/fromArrayToMap";
import { Auth } from "aws-amplify";


export const NewPasswordRequiredComponent = ({
  user,
  setAuthState,
}: {
  user: any;
  setAuthState: Function;
}) => {
  const attributes: string[] | null | undefined =
    user.current.challengeParam.requiredAttributes;

  const attributesMap = fromArrayToMap(attributes);
  const [data, setData] = useState<typeof attributesMap>(attributesMap);

  const [password, setPassword] = useState<string>("");

  async function handleConfirm() {
    try {
      // before
      const resp = await Auth.completeNewPassword(user.current, password, data);

      // after

      // const res = await Authv2.confirmSignIn({
      //   newPassword: "password",
      //   options: { userAttributes: data },
      // });



      setAuthState("authenticated");
    } catch (error) {
      console.log(error);
    }
  }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = e.target;

    if (name === "password") return setPassword(value);
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
      <FormControl key="password">
        <InputLabel htmlFor="password">Password</InputLabel>
        <Input
          id="password"
          name="password"
          onChange={handleChange}
          value={password}
        />
      </FormControl>
      {attributes &&
        attributes.map((attribute) => (
          <FormControl key={attribute}>
            <InputLabel htmlFor={attribute}>{attribute}</InputLabel>
            <Input
              id={attribute}
              name={attribute}
              onChange={handleChange}
              value={data[attribute]}
            />
          </FormControl>
        ))}

      <Button onClick={() => handleConfirm()}>Confirm</Button>
    </Box>
  );
};
