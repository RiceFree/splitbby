import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from "../../src/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log('Attempting sign in with email/password', { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('signIn response:', { data, error });

      if (error) {
        setMsg(error.message || 'Login error');
        Alert.alert('Login Error', error.message || 'Login error');
      } else if (data?.session) {
        setMsg('Login successful');
        // navigate to expenses (app expects authenticated users there)
        router.replace('/expenses');
      } else {
        // No error but also no session -> show message
        setMsg('Login did not return a session. Check email confirmation or credentials.');
        Alert.alert('Login', 'No session returned. Please check your credentials or confirm your email.');
      }
    } catch (err) {
      console.error('Unexpected login error', err);
      setMsg(err.message || 'Unexpected error');
      Alert.alert('Error', err.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder="Enter your email"
        editable={!loading}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
        editable={!loading}
      />

      <Button
        title={loading ? 'Logging in...' : 'Accedi'}
        onPress={handleLogin}
        disabled={loading}
      />

      {msg ? <Text style={styles.message}>{msg}</Text> : null}

      <Text style={styles.link} onPress={() => router.push('/auth/register')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  message: {
    marginTop: 16,
    textAlign: 'center',
    color: '#0a7ea4',
  },
  link: {
    color: '#0a7ea4',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});