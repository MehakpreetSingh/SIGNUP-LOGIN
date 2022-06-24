import {useState} from 'react' ;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Navbar from "./components/Navbar";
import Alert from "./components/Alert";

function App() {
  const [alert , setAlert] = useState(null) ;
  const showAlert = (message , type) => {
    setAlert({
      msg : message,
      type : type 
    })
    setTimeout(()=>{
      setAlert(null)
    },1000)
  }
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <div className="container">
        <Routes>
          <Route exact path="/login" element={<Login showAlert ={showAlert}/>}/>
          <Route exact path="/signup" element={<SignUp showAlert ={showAlert}/>}/>
        </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
