import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { getGoogleUrl } from "../getGoogleUrl";

import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../../redux/authSlice";

function AuthBar() {
  const [cookies, setCookie] = useCookies(["token"]);
  const backend_url = process.env.REACT_APP_BASE_URL;

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      console.log("fetching user");
      const response = await fetch(`${backend_url}/api/users/me`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        dispatch(login(data.data.user));
      } else {
        await fetchLogout(backend_url, () => dispatch(logout()));
      }
    };
    fetchUser();
  }, [cookies.token, setCookie, dispatch, backend_url]);

  console.log(user);

  return (
    <div style={{ padding: 20 }}>
      {user ? (
        <div>
          <div>Logged in</div>
          <div>email: {user.payload.email}</div>
          <button
            onClick={async () => {
              await fetchLogout(backend_url, () => dispatch(logout()));
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <a href={getGoogleUrl()}>Login</a>
      )}
    </div>
  );
}

async function fetchLogout(backend_url, doLogout) {
  const response = await fetch(`${backend_url}/api/auth/logout`, {
    credentials: "include",
  });

  if (response.ok) {
    doLogout();
  } else {
    console.log("logout failed");
  }
}

export default AuthBar;
