import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, TextInput, Title } from 'react-native-paper';
import { API_BASE_URL, COLORS, SPACING } from './constants';

export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    if (!email.trim()) return 'Email is required';
    if (!password.trim()) return 'Password is required';
    if (!isLogin && !username.trim()) return 'Username is required';
    return null;
  };

  const submit = async () => {
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }
    setLoading(true);
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const data = isLogin ? { email: email.trim(), password } : { username: username.trim(), email: email.trim(), password };
      const res = await axios.post(`${API_BASE_URL}/auth${endpoint}`, data);
      if (isLogin) {
        await AsyncStorage.setItem('token', res.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
        Alert.alert('Success', 'Logged in successfully!');
      } else {
        Alert.alert('Success', 'Registered successfully! Please login.');
        setIsLogin(true);
        setUsername('');
      }
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Error', isLogin ? 'Login failed. Check credentials.' : 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Animated.ScrollView style={{ opacity: fadeAnim }} contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Ionicons name="person-circle" size={64} color={COLORS.primary} />
            <Title style={styles.title}>{isLogin ? 'Welcome Back' : 'Join Bhandarlok'}</Title>
            <Text style={styles.subtitle}>{isLogin ? 'Sign in to your account' : 'Create your account'}</Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              {!isLogin && (
                <TextInput
                  label="Username"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                  mode="outlined"
                  autoCapitalize="none"
                />
              )}
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry
              />

              <Button mode="contained" onPress={submit} loading={loading} style={styles.button}>
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </Card.Content>
          </Card>

          <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.switchLink}>{isLogin ? 'Register' : 'Login'}</Text>
            </Text>
          </TouchableOpacity>
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, justifyContent: 'center', padding: SPACING.large },
  header: { alignItems: 'center', marginBottom: SPACING.xlarge },
  title: { fontSize: 28, fontWeight: 'bold', color: COLORS.primary, marginTop: SPACING.medium, marginBottom: SPACING.small },
  subtitle: { fontSize: 16, color: COLORS.textLight, textAlign: 'center' },
  card: { marginBottom: SPACING.large, borderRadius: 12, elevation: 6 },
  input: { marginBottom: SPACING.medium },
  button: { marginTop: SPACING.medium },
  switchButton: { alignItems: 'center' },
  switchText: { fontSize: 16, color: COLORS.textLight },
  switchLink: { color: COLORS.primary, fontWeight: 'bold' },
});
