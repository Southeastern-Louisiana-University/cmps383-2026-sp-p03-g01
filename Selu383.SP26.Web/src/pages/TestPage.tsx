import { Link } from "react-router";

export function TestPage() {
  return (
    <div>
      <h1>Test Page</h1>
      <p>This is a test page for routing.</p>
      <Link to="/">Back to home!</Link>
    </div>
  );
}
