import "@/styles/App.css";

function Home(){
    return (
      <div className="App">
        <h2>Welcome to Caffinated Lions!</h2>
        <p>
          Experience the best coffee in town with our wide selection of blends and flavors. 
          Join our rewards program to earn points and enjoy exclusive offers. 
          Find a location near you and visit us today!
        </p>
        
        <div className="content">
          <h2>Seasonal Items</h2>

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