import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { db } from '@/db/client';
import { exportActivitiesCSV } from '@/db/export';
import { users as usersTable } from '@/db/schema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eq } from 'drizzle-orm';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TripContext } from '../_layout';

const PROFILE_PIC_KEY = 'profilePicture';

export default function ProfileScreen() {
  const router = useRouter();
  const context = useContext(TripContext);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_PIC_KEY).then((uri) => {
      if (uri) setProfilePic(uri);
    });
  }, []);

  if (!context) return null;

  const { trips, activities, categories, currentUser, setCurrentUser, colorScheme, toggleTheme } = context;
  const bgColor = colorScheme === 'dark' ? '#151718' : '#F8FAFC';
  const textColor = colorScheme === 'dark' ? '#ECEDEE' : '#111827';
  const subtitleColor = colorScheme === 'dark' ? '#9BA1A6' : '#6B7280';

  const handleLogout = () => {
    setCurrentUser(null);
    router.replace('/login');
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    await db.delete(usersTable).where(eq(usersTable.id, currentUser.id));
    setCurrentUser(null);
    router.replace('/login');
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setProfilePic(uri);
      await AsyncStorage.setItem(PROFILE_PIC_KEY, uri);
    }
  };

  const handleExport = async () => {
    try {
      await exportActivitiesCSV(activities, trips, categories);
    } catch (e) {
      Alert.alert('Export failed', 'Could not export activities. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Profile"
          subtitle="Account and settings"
          textColor={textColor}
          subtitleColor={subtitleColor}
        />

        <View style={styles.avatarSection}>
          <Pressable
            accessibilityLabel="Change profile photo"
            accessibilityRole="button"
            onPress={pickImage}
            style={styles.avatarCircle}
          >
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person-outline" size={36} color="#94A3B8" />
              </View>
            )}
          </Pressable>
          <Text style={styles.avatarLabel}>Change Photo</Text>
        </View>

        <View style={styles.section}>
          <PrimaryButton
            label="Manage Categories & Targets"
            variant="secondary"
            onPress={() => router.push({ pathname: '/manage' })}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
          <View style={styles.themeRow}>
            <Text style={[styles.themeLabel, { color: textColor }]}>Dark Mode</Text>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: '#0F766E' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
          {currentUser ? (
            <Text style={[styles.emailText, { color: subtitleColor }]}>{currentUser.email}</Text>
          ) : null}
          <PrimaryButton
            label="Export Activities"
            variant="secondary"
            onPress={handleExport}
          />
          <View style={styles.dangerButton}>
            <PrimaryButton
              label="Log Out"
              variant="secondary"
              onPress={handleLogout}
            />
          </View>
          <View style={styles.dangerButton}>
            <PrimaryButton
              label="Delete Account"
              variant="danger"
              onPress={handleDeleteAccount}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  content: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarCircle: {
    height: 80,
    width: 80,
  },
  avatarPlaceholder: {
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
  avatarImage: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  avatarLabel: {
    color: '#0F766E',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  emailText: {
    color: '#475569',
    fontSize: 14,
    marginBottom: 12,
  },
  dangerButton: {
    marginTop: 10,
  },
  themeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeLabel: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '500',
  },
});
