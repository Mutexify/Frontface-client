import { useEffect } from "react";
import { getGoogleUrl } from "../getGoogleUrl";
import { useCookies } from "react-cookie";

import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../redux/authSlice";

function AuthBar() {
  const [cookies, setCookie] = useCookies(["token"]);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      console.log("fetching user");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/users/me`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        dispatch(login(data.data.user));
      } else {
        setCookie("token", "");
        dispatch(logout());
      }
    };
    fetchUser();
  }, [cookies.token, setCookie, dispatch]);

  console.log(user);

  return (
    <div style={{ padding: 20 }}>
      {user ? (
        <div>
          <div>Logged in</div>
          <div>email: {user.payload.email}</div>
          <button onClick={() => setCookie("token", "")}>Logout</button>
        </div>
      ) : (
        <a href={getGoogleUrl()}>Login</a>
      )}
    </div>
  );
}

export default AuthBar;
