import React ,{useState} from 'react'
import {useNavigate} from 'react-router-dom'

const SignUp = (props) => {
  const navigate = useNavigate();
  const [logincreds, setLoginCreds] = useState({name:"" , email: "" , password : "" , cpassword : ""})
  const onChange = (e) => {
    setLoginCreds({ ...logincreds, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI5NGUzMTY4MWEwN2VjZDY5NjdiM2U5In0sImlhdCI6MTY1MzkyNDY2MX0.DLYoZNOt83VgkEaI4CpAcx-nX60S6TGUVQqX_ppl95M'
      },
      body: JSON.stringify({ name:logincreds.name , email: logincreds.email, password: logincreds.password })
    });
    const json = await response.json();
    console.log(json) ;
    if(json.success){
      localStorage.setItem('token', json.authtoken);
      navigate("/");
      props.showAlert("Account created Successfully" , "success")
    }
    else {
      props.showAlert("Invalid Details" , "danger")
    }


  }
  return (
    <div className='container mt-3'>
      <h2>Create an Account for iNoteBook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="name" className="form-control" id="name" name="name" aria-describedby="emailHelp" onChange={onChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" onChange={onChange} />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" onChange={onChange} required minlength={5} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange}  required minlength={5}/>
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp