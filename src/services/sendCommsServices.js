import apiClient from "../util/api-client";
import { jwtDecode } from "jwt-decode";

function validateToken(token) {
  try {
    console.log("inside validate token: ", token);
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (decodedToken.exp < currentTime) {
      console.log("Token has expired.");
      return false; // Token is expired
    }

    // You can also check other claims if needed (e.g., 'iss', 'aud')
    console.log("Token is valid (client-side check).");
    return true; // Token is valid (client-side check)
  } catch (error) {
    console.log("Invalid token:", error);
    return false; // Token is invalid
  }
}
export function SendEmail(body) {
  return apiClient.post("/sendcomms/sendemail", body);
}
export function PostContact(body) {
  //console.log("inside postcontact");
  return apiClient.post("/google/db-1000-contactus", body);
}
export function PostLog(body) {
  //console.log("inside PostLog", body);
  return apiClient.post("/google/userlog", body);
}
export function GetSecure_Contact(body, accessSilentToken, jwt_access_token) {
  apiClient.defaults.headers["x-auth-token"] = `${accessSilentToken}`;
  apiClient.defaults.headers["Authorization"] = `${jwt_access_token}`;

  //console.log("inside GetSecure_Contact token", token);
  //console.log("inside GetSecure_Contact", body);
  return apiClient.get("/api/v1/secure/db-1000-contactus1", body);
}

export function GetAuth0_ChallengeAPITokenAuthorization(
  body,
  accessSilentToken,
  jwt_access_token
) {
  apiClient.defaults.headers["x-auth-token"] = `${accessSilentToken}`;
  // var validateToken1 = validateToken(accessSilentToken);
  //console.log("validateToken1", validateToken1);
  return apiClient.get(
    "/api/v1/auth0/db-3001-auth0challenges-api-getaccess-token",
    body
  );
}
export function GetAuth0_SearchUser(body, accessSilentToken, jwt_access_token) {
  apiClient.defaults.headers["x-auth-token"] = `${accessSilentToken}`;
  apiClient.defaults.headers["Authorization"] = `${jwt_access_token}`;
  apiClient.defaults.headers["Content-Type"] = "application/json";
  //console.log("INSIDE SENDCOMMSERVICES: ", body);
  return apiClient.get("/api/v1/auth0/db-3002-auth0-searchuser", body);
}