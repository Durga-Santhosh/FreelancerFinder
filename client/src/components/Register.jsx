import React, { useContext } from 'react'

import { GeneralContext } from '../context/GeneralContext';

const Register = ({setAuthType}) => {


  const {setUsername, setEmail, setPassword, setUsertype, register} = useContext(GeneralContext);

  const handleRegister = async (e) =>{
    e.preventDefault();
    await register();
  }

  return (
    <form className="authForm">
    <h2>Register</h2>
    <div className="form-floating mb-3 authFormInputs">

      <label htmlFor="floatingInput">Username :</label>
        <input type="text" className="form-control" id="floatingInput" placeholder="username"
                                                   onChange={(e)=> setUsername(e.target.value)} />
    </div>
    <div className="form-floating mb-3 authFormInputs">

      <label htmlFor="floatingInput">Email :</label>
        <input type="email" className="form-control" id="floatingEmail" placeholder="name@example.com"
                                                   onChange={(e)=> setEmail(e.target.value)} />
    </div>
    <div className="form-floating mb-3 authFormInputs">

      <label htmlFor="floatingPassword">Password :</label>
        <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                                                   onChange={(e)=> setPassword(e.target.value)} /> 
    </div>
    <select className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" 
                                                  onChange={(e)=> setUsertype(e.target.value)}>
      <option value="">User Type</option>
      <option value="freelancer">Freelancer</option>
      <option value="client">Client</option>
      <option value="admin">Admin</option>
    </select>

    <button className="btn btn-primary" onClick={handleRegister}>Sign up</button>
    <p>Already registered? <span onClick={()=> setAuthType('login')}>Login</span></p>
</form>
  )
}

export default Register