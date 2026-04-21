import "@/styles/App.css";

import { useState } from "react";
import { useAuth } from "@/context/UserLoggedInContext";

function Signup(){
    
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup, isLoggedIn, user } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    event.preventDefault();
    console.log("Form submitted with username:", userName, "and password:", password);

    try {
      await signup(userName, password);
      setUsername("");
      setPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An error occurred during signup. Please try again.");
      }
      console.error("Error during signup:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn) {
    return (
      <div className="card">
        <h2>Signup Successful!</h2>
        <p>You are now logged in as {user?.userName}.</p>
      </div>
    );
  }
    
    return (

      <div className ="card">
        <h2>Sign up!</h2>
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
              {isSubmitting ? "Signing up..." : "Submit"}
            </button>
        </form>


      </div>
    )
}

export default Signup