import { View, Text } from 'react-native'
import React from 'react'
import { Link } from "expo-router"

const SignIn = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-primary">SignIn</Text>
      <Link href="/(auth)/sign-up.tsx">
        <Text className="text-lg text-primary">Don't have an account? Sign Up</Text>
      </Link>
    </View>
  )
}

export default SignIn