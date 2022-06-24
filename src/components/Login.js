import React ,{useState} from 'react'
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
    const navigate = useNavigate();
    const [logincreds, setLoginCreds] = useState({email: "" , password : ""})
    const onChange = (e) => {
        setLoginCreds({...logincreds , [e.target.name]: e.target.value})
    }
    const handleSubmit = async(e) => {
        e.preventDefault() ;
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json' ,
              'auth-token':'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI5NGUzMTY4MWEwN2VjZDY5NjdiM2U5In0sImlhdCI6MTY1MzkyNDY2MX0.DLYoZNOt83VgkEaI4CpAcx-nX60S6TGUVQqX_ppl95M'
            },
            body : JSON.stringify({email:logincreds.email , password:logincreds.password})
          });
          const json = await response.json() ;
          
          if(json.success===true) {
            localStorage.setItem('token' , json.authtoken) ;
            props.showAlert("Login Successful" , "success")
            navigate("/");
            console.log(json) ;
            
          }
          else {
            props.showAlert("Invalid Credentials" , "danger")
          }
    }
    return (
        <div className='container mt-3' onSubmit={handleSubmit}>
            <h2>Login to Continue to iNoteBook</h2>
            <form>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" onChange={onChange} className="form-control" id="email" name='email' aria-describedby="emailHelp"/>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" onChange={onChange} className="form-control" id="password" name='password'/>
                </div>
                
                <button type="submit" className="btn btn-primary" >Login</button>
            </form>
        </div>
    )
}

export default Login