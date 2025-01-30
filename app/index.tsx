import { Redirect } from "expo-router";
import { useAuthStore } from "@/app/stores/AuthStore";

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/screens/auth/AuthScreen" />
  );
}
