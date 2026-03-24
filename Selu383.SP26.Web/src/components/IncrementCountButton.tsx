import { useContext, useEffect, useState, type ReactNode } from "react";
import { UserLoggedInContext } from "@/context/UserLoggedInContext";

export interface IncrementCountButtonProps {
  setCount: React.Dispatch<React.SetStateAction<number>>;
  count: number;
}
export function IncrementCountButton({ setCount, count }: IncrementCountButtonProps): ReactNode {
  useEffect(() => {
    console.log("mounted:IncrementCountButton");
    return () => {
      console.log("unmounted: IncrementCountButton");
    };
  }, []);
  return <button onClick={() => setCount((count) => count + 1)}>count is {count}!!!!</button>;
}

export function UncontrolledIncrementCountButton(): ReactNode {
  const [count, setCount] = useState(0);
  const isLoggedIn = useContext(UserLoggedInContext);
  if (!isLoggedIn) {
    return <p>You must be logged in to increment the count</p>;
  }

  return <IncrementCountButton setCount={setCount} count={count} />;
}
