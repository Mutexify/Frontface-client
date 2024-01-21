import { useEffect, useState } from "react";
import { getGoogleUrl } from "../getGoogleUrl";
import { useCookies } from "react-cookie";

function AuthBar() {
  const [cookies, setCookie] = useCookies(["token"]);
  const [user, setUser] = useState(null);

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
        setUser(data.data.user);
      } else {
        setCookie("token", "");
        setUser(null);
      }
    };
    fetchUser();
  }, [cookies.token, setCookie]);

  return (
    <div style={{ padding: 20 }}>
      {user ? (
        <div>
          <div>Logged in</div>
          <div>email: {user.email}</div>
          <button onClick={() => setCookie("token", "")}>Logout</button>
        </div>
      ) : (
        <a href={getGoogleUrl()}>Login</a>
      )}
    </div>
  );
}

export default AuthBar;
