import { useRouter, useSegments } from "expo-router";
import React from "react";
import { IAccountResponse } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import authSlice from "../store/slices/auth";
import axios from "axios";
// @ts-expect-error
import { API_URL } from "@env";

export interface IAuthContext {
    signIn: (email: string, password: string) => void;
    signUp: (email: string, username: string, password: string) => void;
    signOut: () => void;
    clearMessage: () => void;
    auth: IAccountResponse | null;
    loading: boolean;
    message: string;
}

export interface IAuthRequestPayload {
    email: string;
    password: string;
    username?: string;
}

const AuthContext = React.createContext<IAuthContext | null>(null);

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(auth: IAccountResponse | null) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !auth &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/sign-in");
    } else if (auth && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/");
    }
  }, [auth, segments]);
}

export const Provider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  useProtectedRoute(auth.account || null);

  const sendAuthRequest = (action: 'login' | 'register', payload: IAuthRequestPayload) => {
    setLoading(true);

    const apiUrl = API_URL || 'http://localhost:8000/api';

    axios
      .post(`${apiUrl}/auth/${action}/`, payload)
      .then((res) => {
        console.log(res);
        dispatch(
          authSlice.actions.setAuthTokens({
            token: res.data.access,
            refreshToken: res.data.refresh,
          })
        );
        dispatch(authSlice.actions.setAccount(res.data));
        setLoading(false);
        router.replace("/");
      })
      .catch((err) => {
        console.log('error: ', err);
        if (err.response) {
          setMessage(err.response.data.detail);
        } else {
          setMessage(err.message);
        }

        setLoading(false);
      });
  };

  const handleSignin = (email: string, password: string) => {
    sendAuthRequest('login', { email, password });
  };

  const handleSignUp = (email: string, username: string, password: string) => {
    sendAuthRequest('register', { email, username, password });
  };

  const handleSignOut = () => {
    dispatch(authSlice.actions.logout());
    router.replace("/sign-in");
  }

  const handleClearMessage = () => {
    setMessage("");
  }

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignin,
        signOut: handleSignOut,
        signUp: handleSignUp,
        clearMessage: handleClearMessage,
        auth: auth.account,
        loading,
        message,
      }}
    >
      {props?.children}
    </AuthContext.Provider>
  );
}