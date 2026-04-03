import { Text, View } from "react-native";
import "@/global.css";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold text-success">Hello</Text>
      <Link href="/onboarding">
        <Text className="text-lg text-primary">Go to Onboarding</Text>
      </Link>
      <Link href="/(auth)/sign-up">
        <Text className="text-lg text-primary">Go to Sign Up</Text>
      </Link>
      <Link href="/(auth)/sign-in">
        <Text className="text-lg text-primary">Go to Sign In</Text>
      </Link>
    </View>
  );
}
