import * as SecureStore from "expo-secure-store";
import { v4 as uuid } from "uuid";

export async function getSessionId() {
  let sid = await SecureStore.getItemAsync("session-id");
  if (!sid) {
    sid = uuid();
    await SecureStore.setItemAsync("session-id", sid);
  }
  return sid;
}
