import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as Yup from 'yup';
import { supabase } from "../../src/supabase/client";
import global from '../../styles/globalStyles';

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
          <Text style={[global.title, {marginBottom: 20, textAlign: 'center',}] }>Create Account</Text>

          <Text style={global.label}>Email</Text>
          <TextInput
            style={[global.input, touched.email && errors.email && global.inputError]}
            placeholder="Enter your email"
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            value={values.email}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {touched.email && errors.email && (
            <Text style={global.error}>{errors.email}</Text>
          )}

          <Text style={global.label}>Password</Text>
          <TextInput
            style={[global.input, touched.password && errors.password && gloabl.inputError]}
            placeholder="Enter password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry
            editable={!loading}
          />
          {touched.password && errors.password && (
            <Text style={global.error}>{errors.password}</Text>
          )}

          <Text style={global.label}>Confirm Password</Text>
          <TextInput
            style={[global.input, touched.confirmPassword && errors.confirmPassword && global.inputError]}
            placeholder="Confirm password"
            onChangeText={handleChange('confirmPassword')}
            onBlur={handleBlur('confirmPassword')}
            value={values.confirmPassword}
            secureTextEntry
            editable={!loading}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <Text style={global.error}>{errors.confirmPassword}</Text>
          )}
          
          <Pressable
            style={loading ? [global.button, { opacity: 0.6 }] : global.button}
            onPress={() => {
              if (!loading) handleSubmit();
            }}
            disabled={loading}
          >
            <Text style={global.buttonText}>
              {loading ? "Creating Account..." : "Register"}
            </Text>
          </Pressable>

          {msg ? <Text style={global.message}>{msg}</Text> : null}

          <Text style={[global.link, { textAlign: "center", marginTop: 20 }]} onPress={() => router.push('/auth/login')}>
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
});
