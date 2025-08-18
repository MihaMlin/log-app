import API from "../axios-client";

export const getUserMutationFn = async () => await API.get("/users/me");
