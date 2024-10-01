import { StyleSheet, Text, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Link } from 'expo-router'
import React from 'react'

const App = () => {
  return (
    <View style={styles.container}>
      <Text>Aora</Text>
      <StatusBar style='auto' />
      <Link href={'/profile'} style={{ color: 'blue'}}>Go to Profile</Link>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})