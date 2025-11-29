import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Yup from 'yup';
import { supabase } from "../../src/supabase/client";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // Register user with email and password
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      console.log('signUp response:', { data, error });

      // If Supabase returned an error, surface it
      if (error) {
        console.error('Registration error:', error);
        setMsg(error.message || 'Registration error');
        Alert.alert('Registration Error', error.message || 'Registration error');
      } else if (!data || !data.user) {
        // No error but also no user returned -> treat as failure
        console.error('Registration failed: no user returned', data);
        const details = data ? JSON.stringify(data) : 'no data';
        setMsg('Registration failed: no user created');
        Alert.alert('Registration Error', 'User not created. ' + details);
      } else {
        // Success
        console.log('User created:', data.user);
        setMsg('Account created successfully');
        Alert.alert('Success', 'Account created successfully!');
        // Navigate back to login
        router.replace('/auth/login');
      }
    } catch (error) {
      console.error('Unexpected error during registration', error);
      setMsg(error.message || 'Unexpected error');
      Alert.alert('Error', error.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleRegister}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View style={styles.container}>
          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, touched.email && errors.email && styles.inputError]}
            placeholder="Enter your email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {touched.email && errors.email && (
            <Text style={styles.error}>{errors.email}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, touched.password && errors.password && styles.inputError]}
            placeholder="Enter password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry
            editable={!loading}
          />
          {touched.password && errors.password && (
            <Text style={styles.error}>{errors.password}</Text>
          )}

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, touched.confirmPassword && errors.confirmPassword && styles.inputError]}
            placeholder="Confirm password"
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            value={values.confirmPassword}
            secureTextEntry
            editable={!loading}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={styles.error}>{errors.confirmPassword}</Text>
          )}

          <Button
            title={loading ? 'Creating Account...' : 'Register'}
            onPress={handleSubmit}
            disabled={loading}
          />

          {msg ? <Text style={styles.message}>{msg}</Text> : null}

          <Text style={styles.link} onPress={() => router.push('/auth/login')}>
            Already have an account? Login
          </Text>
        </View>
      )}
    </Formik>
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
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  error: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 8,
  },
  link: {
    color: '#0a7ea4',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
