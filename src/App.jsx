import Menu from "./components/Menu";
import { BrowserRouter } from 'react-router-dom';



function App() {
  return (
      <>
          <BrowserRouter>
          
              <div className="container">
                  <Menu />
                  
              </div>
          </BrowserRouter>
      </>
  );
}

export default App;
