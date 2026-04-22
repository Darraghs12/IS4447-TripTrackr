import React from 'react';
import { render } from '@testing-library/react-native';
import { TripContext } from '../app/_layout';
import IndexScreen from '../app/(tabs)/index';

jest.mock('@/db/client', () => ({
  db: { select: jest.fn(), insert: jest.fn() },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  Stack: () => null,
}));

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return { SafeAreaView: View };
});

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  SchedulableTriggerInputTypes: { DATE: 'date' },
}));

const mockTrip = {
  id: 1,
  name: 'Test Trip',
  destination: 'Paris, France',
  startDate: '2026-06-01',
  endDate: '2026-06-10',
  categoryId: null,
  notes: null,
};

describe('IndexScreen', () => {
  it('renders the trip name and the add button', () => {
    const { getByText } = render(
      <TripContext.Provider
        value={{
          trips: [mockTrip],
          setTrips: jest.fn(),
          activities: [],
          setActivities: jest.fn(),
          categories: [],
          setCategories: jest.fn(),
          targets: [],
          setTargets: jest.fn(),
          currentUser: null,
          setCurrentUser: jest.fn(),
          colorScheme: 'light',
          toggleTheme: jest.fn(),
        }}
      >
        <IndexScreen />
      </TripContext.Provider>
    );

    expect(getByText('Test Trip')).toBeTruthy();
    expect(getByText('Add Trip')).toBeTruthy();
  });
});
