import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import ForYou from './screens/ForYou';
import Upload from './screens/Upload';

const Tab = createBottomTabNavigator();

function Placeholder({ label }: { label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'black' }}>
      <Text style={{ color: 'white' }}>{label}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#000' }, tabBarActiveTintColor: '#fff', tabBarInactiveTintColor: '#888' }}>
        <Tab.Screen name="Home" component={ForYou} />
        <Tab.Screen name="Sound" children={() => <Placeholder label="Sound" />} />
        <Tab.Screen name="Creator" children={() => <Placeholder label="Creator" />} />
        <Tab.Screen name="Hashtag" children={() => <Placeholder label="Hashtag" />} />
        <Tab.Screen name="Upload" component={Upload} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

