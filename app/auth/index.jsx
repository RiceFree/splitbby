import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from "../../src/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMsg(error.message);
      Alert.alert('Login Error', error.message);
    } else {
      setMsg('Controlla la tua email per il link.');
      Alert.alert('Success', 'Check your email for the login link.');
    }
    setLoading(false);
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

      <Button
        title={loading ? 'Sending link...' : 'Invia link'}
        onPress={handleLogin}
        disabled={loading}
      />

      {msg ? <Text style={styles.message}>{msg}</Text> : null}

      <Text style={styles.link} onPress={() => router.push('register')}>
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