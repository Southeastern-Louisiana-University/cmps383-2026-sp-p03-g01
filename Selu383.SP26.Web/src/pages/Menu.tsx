import "@/styles/App.css"

function Menu(){
    return (
      <div>
        <h2>Here's our whole menu!</h2>
        <ul>
          <li className="card">
            <h2>Hypothetical Menu Item</h2>
            <p>It's a great item, you should try it!</p>
          </li>
          <li className="card">
            <h2>Hypothetical Menu Item 2</h2>
            <p>It's an even better item, you should try it!</p>
          </li>
        </ul>
      </div>
    )
}

export default Menu