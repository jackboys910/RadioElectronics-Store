import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Tabs } from 'expo-router'

import Colors from '@/constants/Colors'
import { useColorScheme } from '@/components/useColorScheme'

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name']
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: { display: 'none' },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'index',
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
        }}
      />
      <Tabs.Screen
        name="Auth"
        options={{
          title: 'Auth',
        }}
      />
      <Tabs.Screen
        name="Admin"
        options={{
          title: 'Admin',
        }}
      />
      <Tabs.Screen
        name="DevicePage"
        options={{
          title: 'DevicePage',
        }}
      />
      <Tabs.Screen
        name="Basket"
        options={{
          title: 'Basket',
        }}
      />
    </Tabs>
  )
}
