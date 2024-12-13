import Cookies from "js-cookie";

export function clearAuthCookies(moveToHomepage: boolean = true) {
  Cookies.remove("session_token");
  Cookies.remove("refresh_token");
  if (moveToHomepage) {
    window.location.href = "/";
  }
}
