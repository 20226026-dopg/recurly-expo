import { View, Text } from 'react-native'
import React from 'react'
import { Link } from "expo-router"

const SignUp = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-primary">SignUp</Text>
      <Link href="/(auth)/sign-in.tsx">
        <Text className="text-lg text-primary">Already have an account? Sign In</Text>
      </Link>
    </View>
  )
}

export default SignUp