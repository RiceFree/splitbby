import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../../src/supabase/client";
import global from "../../styles/globalStyles";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("Attempting sign in with email/password", { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("signIn response:", { data, error });

      if (error) {
        setMsg(error.message || "Login error");
        Alert.alert("Login Error", error.message || "Login error");
      } else if (data?.session) {
        setMsg("Login successful");
        // navigate to expenses (app expects authenticated users there)
        router.replace("/households");
      } else {
        // No error but also no session -> show message
        setMsg(
          "Login did not return a session. Check email confirmation or credentials."
        );
        Alert.alert(
          "Login",
          "No session returned. Please check your credentials or confirm your email."
        );
      }
    } catch (err) {
      console.error("Unexpected login error", err);
      setMsg(err.message || "Unexpected error");
      Alert.alert("Error", err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[global.title, { marginBottom: 20, textAlign: "center" }]}>
        Login
      </Text>

      <Text style={global.label}>Email</Text>
      <TextInput
        style={global.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder="Enter your email"
        editable={!loading}
        keyboardType="email-address"
      />

      <Text style={global.label}>Password</Text>
      <TextInput
        style={global.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        editable={!loading}
      />

      <Pressable
        style={loading ? [global.button, { opacity: 0.6 }] : global.button}
        onPress={() => {
          if (!loading) handleLogin();
        }}
        disabled={loading}
      >
        <Text style={global.buttonText}>
          {loading ? "Loggin in..." : "Login"}
        </Text>
      </Pressable>

      {msg ? <Text style={global.message}>{msg}</Text> : null}

      <Text
        style={[global.link, { textAlign: "center", marginTop: 20 }]}
        onPress={() => router.push("/auth/register")}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
});
