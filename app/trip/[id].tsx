import { useLocalSearchParams, useRouter } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import InfoTag from '@/components/ui/info-tag';
import PrimaryButton from '@/components/ui/primary-button';
import ScreenHeader from '@/components/ui/screen-header';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eq } from 'drizzle-orm';
import * as Notifications from 'expo-notifications';
import { db } from '@/db/client';
import { trips as tripsTable } from '@/db/schema';
import { Trip, TripContext } from '../_layout';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = process.env.EXPO_PUBLIC_WEATHER_API;

type WeatherData = {
  temperature: number;
  weathercode: number;
};

function weatherDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 55) return 'Drizzle';
  if (code <= 65) return 'Rain';
  if (code <= 75) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

export default function TripDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const context = useContext(TripContext);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);

  useEffect(() => {
    if (!context) return;
    const trip = context.trips.find((t: Trip) => t.id === Number(id));
    if (!trip) return;

    async function fetchWeather() {
      setWeatherLoading(true);
      setWeatherError(false);
      try {
        const geoRes = await fetch(
          `${GEOCODING_URL}?name=${encodeURIComponent(trip!.destination)}&count=1`
        );
        const geoJson = await geoRes.json();
        const location = geoJson?.results?.[0];
        if (!location) {
          setWeatherError(true);
          return;
        }

        const weatherRes = await fetch(
          `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`
        );
        const weatherJson = await weatherRes.json();
        const cw = weatherJson?.current_weather;
        if (!cw) {
          setWeatherError(true);
          return;
        }

        setWeather({ temperature: cw.temperature, weathercode: cw.weathercode });
      } catch {
        setWeatherError(true);
      } finally {
        setWeatherLoading(false);
      }
    }

    fetchWeather();
  }, [id, context]);

  if (!context) return null;

  const { trips, setTrips, categories } = context;

  const trip = trips.find((t: Trip) => t.id === Number(id));

  if (!trip) return null;

  const category = categories.find((c) => c.id === trip.categoryId);

  const deleteTrip = async () => {
    await db
      .delete(tripsTable)
      .where(eq(tripsTable.id, Number(id)));

    const rows = await db.select().from(tripsTable);
    setTrips(rows);
    router.back();
  };

  const setTripReminder = async () => {
    const tripDate = new Date(trip.startDate);
    tripDate.setHours(9, 0, 0, 0);

    if (tripDate <= new Date()) {
      Alert.alert('Cannot set reminder', 'This trip date has already passed');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Trip to ${trip.destination} starts today!`,
        body: "Have a great trip! Don't forget to log your activities",
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: tripDate },
    });

    Alert.alert('Reminder set', "You'll be notified on " + trip.startDate);
  };

  const setPackReminder = async () => {
    const tripDate = new Date(trip.startDate);
    tripDate.setDate(tripDate.getDate() - 1);
    tripDate.setHours(9, 0, 0, 0);

    if (tripDate <= new Date()) {
      Alert.alert('Cannot set reminder', 'This trip date has already passed');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time to pack for ${trip.destination}!`,
        body: "Your trip starts tomorrow. Don't forget to pack!",
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: tripDate },
    });

    const packDateStr = tripDate.toISOString().split('T')[0];
    Alert.alert('Reminder set', "You'll be reminded to pack on " + packDateStr);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title={trip.name} subtitle={trip.destination} />
      <View style={styles.tags}>
        <InfoTag label="From" value={trip.startDate} />
        <InfoTag label="To" value={trip.endDate} />
        {category ? <InfoTag label="Category" value={category.name} /> : null}
      </View>

      <View style={styles.weatherCard}>
        <Text style={styles.weatherTitle}>Current Weather</Text>
        {weatherLoading ? (
          <Text style={styles.weatherBody}>Loading weather...</Text>
        ) : weatherError || !weather ? (
          <Text style={styles.weatherBody}>Weather unavailable</Text>
        ) : (
          <Text style={styles.weatherBody}>
            {weather.temperature}°C - {weatherDescription(weather.weathercode)}
          </Text>
        )}
      </View>

      <PrimaryButton
        label="Add Activity"
        onPress={() =>
          router.push({ pathname: '/trip/[id]/add-activity', params: { id } })
        }
      />

      <View style={styles.buttonSpacing}>
        <PrimaryButton
          label="Edit"
          variant="secondary"
          onPress={() =>
            router.push({ pathname: '/trip/[id]/edit', params: { id } })
          }
        />
      </View>

      <View style={styles.buttonSpacing}>
        <PrimaryButton
          label="Set Reminder"
          variant="secondary"
          onPress={setTripReminder}
        />
      </View>

      <View style={styles.buttonSpacing}>
        <PrimaryButton
          label="Remind me to pack"
          variant="secondary"
          onPress={setPackReminder}
        />
      </View>

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Delete" variant="danger" onPress={deleteTrip} />
      </View>

      <View style={styles.buttonSpacing}>
        <PrimaryButton label="Back" variant="secondary" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F8FAFC',
    flex: 1,
    padding: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 18,
    padding: 14,
  },
  weatherTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  weatherBody: {
    color: '#6B7280',
    fontSize: 14,
  },
  buttonSpacing: {
    marginTop: 10,
  },
});
