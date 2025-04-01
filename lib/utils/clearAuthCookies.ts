import Cookies from "js-cookie";

export function clearAuthCookies() {
  Cookies.remove("session_token");
  Cookies.remove("refresh_token");
}
