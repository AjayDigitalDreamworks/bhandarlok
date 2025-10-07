import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Button, Card, TextInput, Title } from 'react-native-paper';
import { API_BASE_URL, COLORS, SPACING } from '../constants';

interface User {
  _id: string;
  username: string;
  email: string;
}

export default function AccountProfile() {
  const [isLogin, setIsLogin] = useState(true); // To switch between Login and Register
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Check if user is logged in
  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUser();
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
        setUser(res.data.user);
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

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          setUser(null); // Set user to null after logout
          Alert.alert('Logged out', 'You have been logged out.');
        },
      },
    ]);
  };

  if (!user) {
    // Show login/register page if the user is not logged in
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

  // If user is logged in, show the profile page
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label={user.username.charAt(0).toUpperCase()} style={styles.avatar} />
        <Title style={styles.title}>{user.username}</Title>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Account Settings</Title>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="person" size={24} color={COLORS.primary} />
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Ionicons name="list" size={24} color={COLORS.primary} />
            <Text style={styles.optionText}>My Bhandaras</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={logout}>
            <Ionicons name="log-out" size={24} color={COLORS.error} />
            <Text style={[styles.optionText, { color: COLORS.error }]}>Logout</Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
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
  avatar: { backgroundColor: COLORS.primary },
  email: { fontSize: 16, color: COLORS.textLight },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.medium },
  optionText: { fontSize: 16, marginLeft: SPACING.medium, color: COLORS.text },
});
