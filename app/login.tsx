import FormField from '@/components/ui/form-field';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Colours } from '@/constants/colours';
import { db } from '@/db/client';
import { users as usersTable } from '@/db/schema';
import * as bcrypt from 'bcryptjs';
import { getRandomBytes } from 'expo-crypto';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TripContext } from './_layout';

bcrypt.setRandomFallback((len) => {
  const buf = getRandomBytes(len);
  return Array.from(buf);
});

export default function LoginScreen() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!context) return null;

  const { setCurrentUser } = context;

  const handleLogin = () => {
    setError('');
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        const rows = await db.select().from(usersTable);
        const user = rows.find((u) => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
          setError('No account found with that email.');
          return;
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          setError('Incorrect password.');
          return;
        }

        setCurrentUser(user);
        router.replace('/(tabs)');
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 50);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
        />
        <ScreenHeader title="Welcome Back" subtitle="Sign in to TripTrackr" />
        <View style={styles.form}>
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
          />
          <FormField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? <Text style={styles.loadingText}>Signing in...</Text> : null}

        <PrimaryButton label="Log In" onPress={handleLogin} disabled={loading} />

        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Don't have an account? </Text>
          <Text
            style={styles.link}
            onPress={() => router.replace('/register')}
          >
            Register
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colours.background,
    flex: 1,
    padding: 20,
  },
  content: {
    paddingBottom: 24,
  },
  form: {
    marginBottom: 6,
  },
  error: {
    color: Colours.danger,
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  linkText: {
    color: Colours.textSecondary,
    fontSize: 14,
  },
  link: {
    color: Colours.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    color: Colours.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  logo: {
    alignSelf: 'center',
    height: 250,
    marginBottom: 1,
    resizeMode: 'contain',
    width: 250,
  },
});
