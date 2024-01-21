import { getGoogleUrl } from "../getGoogleUrl";
import { useCookies } from "react-cookie";

function AuthBar() {
  const [cookies, setCookie] = useCookies(["token"]);

  return (
    <>
      {cookies.token ? (
        <div>Logged in</div>
      ) : (
        <a href={getGoogleUrl()}>Login</a>
      )}
      <p>AuthBar</p>
    </>
  );
}

export default AuthBar;
