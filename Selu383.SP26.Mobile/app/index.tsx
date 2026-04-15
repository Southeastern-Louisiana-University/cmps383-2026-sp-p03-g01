import { Redirect } from "expo-router";

export default function Index() {
  // Do not render any UI here.
  // Let Expo show the real splash, then jump straight into the tabs.
  return <Redirect href="/(tabs)" />;
}
