import "@/styles/App.css";

import { useState } from "react";
import { useAuth } from "@/context/UserLoggedInContext";

function Login(){
    
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isLoading, login, logout, isLoggedIn } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    event.preventDefault();
    console.log("Form submitted with username:", userName, "and password:", password);

    try {
      await login(userName, password);
      setUsername("");
      setPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An error occurred during login. Please try again.");
      }
      console.error("Error during login:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="card"><p>Loading...</p></div>;
  }
    
  return (
    <div className="card">
      {isLoggedIn ? (
        <div>
          <h2>Welcome, {user?.userName}!</h2>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Login!</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <br />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Submit"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login