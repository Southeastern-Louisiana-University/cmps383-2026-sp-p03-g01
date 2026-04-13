import "@/styles/App.css";

function Home(){
    return (

      //This assumes the user is not logged in, so I need to get the authentication stuff set up.
      <div>
        <h2>Welcome!</h2>
        <p>
          Experience the best coffee in town with our wide selection of blends and flavors. 
          Join our rewards program to earn points and enjoy exclusive offers. 
          Find a location near you and visit us today!
        </p>
        
        <table>
          <tr><th>Featured Drinks</th></tr>
          <tr>
            <td>
              <div className="card">
                <h3>Spring Tea</h3>
                <p>A delightful taste sensation</p>
              </div>
            </td>

            <td>
              <div className="card">
                <h3>Spring Coffee</h3>
                <p>A rich and smooth blend</p>
              </div>
            </td>

            <td>
              <div className="card">
                <h3>Spring Pastry</h3>
                <p>A delicious treat for any time of day</p>
              </div>
            </td>

          </tr>
        </table>

      </div>
    )
}

export default Home