import { isValidUsername } from "6pp";
export const usernameValdator = (username: string) => {
  if (!isValidUsername(username))
    return { isValid: false, errorMessage: "username is Invalid" };
};
