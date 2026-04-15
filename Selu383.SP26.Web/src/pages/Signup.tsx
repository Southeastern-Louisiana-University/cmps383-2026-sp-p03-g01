import "@/styles/App.css";

function Login(){
    
    
    return (

      <div className ="card">
        <h2>Sign up!</h2>
        <form>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="UserName" />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="Password" />
            <br />
            <button type="submit">Submit</button>
        </form>


      </div>
    )
}

export default Login