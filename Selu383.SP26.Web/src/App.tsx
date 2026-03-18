import './App.css'

function Home(){
    return (
      <div className="App">
        <div className="nav">
          <h1>Cafinated Lions</h1>
          <ul className="nav">
            <li className="navItem">Menu</li>
            <li className="navItem">Rewards</li>
            <li className="navItem">Locations</li>
            <li className="navItem"><img src="path/to/image.jpg" alt="Bag"></img></li>
            <li className="navItem">Account</li>
          </ul>
        </div>
        <h2>Welcome to Cafinated Lions!</h2>
        <p>
          Experience the best coffee in town with our wide selection of blends and flavors. 
          Join our rewards program to earn points and enjoy exclusive offers. 
          Find a location near you and visit us today!
        </p>
        
        <div className="content">
          <h2>Our Menu</h2>

          <ul>
            <li>
              <div className="card">
                <h3>Product1</h3>
                <p>Description of Product1</p>
              </div>
            </li>
            <li>
              <div className="card">
                <h3>Product2</h3>
                <p>Description of Product2</p>
              </div>
            </li>
            <li>
              <div className="card">
                <h3>Product3</h3>
                <p>Description of Product3</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    )
}

export default Home