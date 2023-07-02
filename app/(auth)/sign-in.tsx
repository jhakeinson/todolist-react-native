import React from "react";
import { useTheme } from 'react-native-paper';
import { View, StyleSheet } from "react-native";
import { IAuthContext, useAuth } from "../../lib/context/auth";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";


const Login = () => {
  const theme = useTheme();
  const router = useRouter();

  const { signIn, loading, message } = useAuth() as IAuthContext;

  const [emailInput, setEmailInput] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");

  return (
    <View style={{
        ... styles.container,
        backgroundColor: theme.colors.background,
    }}>
      <Text style={styles.text} variant="headlineLarge">
        Sign in
      </Text>
      <TextInput
        mode="outlined"
        style={styles.textInput}
        label="Email"
        value={emailInput}
        onChangeText={(text) => setEmailInput(text)}
      />
      <TextInput
        mode="outlined"
        style={styles.textInput}
        secureTextEntry
        label="Password"
        value={passwordInput}
        onChangeText={(text) => setPasswordInput(text)}
      />

      <Button
        mode="contained"
        loading={loading}
        style={styles.button}
        onPress={() => signIn(emailInput, passwordInput)}
      > Sign in </Button>

      {message && (<Text variant="bodyLarge" style={{ marginTop: 10, color: 'red' }}> {message} </Text>)}

      <Text variant="bodyLarge" style={{
        marginTop: 30,
        marginBottom: 10,
      }}> - or - </Text>

      <Button
        mode="contained"
        buttonColor={'#a2a200'}
        style={styles.button}
        onPress={() => router.push("/register") }
      >
        Create an account
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
  },
  textInput: {
    width: "100%",
    marginTop: 10,
    rounded: true,
  },
  text: {
    marginBottom: 10,
  },
  button: {
    width: "100%",
    marginTop: 15,
  },
});

export default Login;
