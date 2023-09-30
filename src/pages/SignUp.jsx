import {useState} from 'react';
import {supabase} from '../supabase/client.js';
import {Link} from 'react-router-dom'

const SignUp = () => {

  const [formData, setFormData] = useState({
    Fullname: '', Email: '', Password: ''
  });

  console.log(formData)

  const handleChange = (e) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData, 
        [e.target.name]: e.target.value
      }
    })
  }

  async function handleSubmit(e){
    e.preventDefault()

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.Email,
        password: formData.Password,
        options: {
          data: {
            first_name: formData.Fullname,
            age: 27
          }
        }
      })
      alert('Check your email for verification link')

    } catch (error) {
      alert(error);
    }
  }

  return (
    <div> 
      <form onSubmit={handleSubmit}>
        <input placeholder='Fullname' name='Fullname' onChange={handleChange}/>
        <input placeholder='Email' name='Email' onChange={handleChange}/>
        <input placeholder='Password' name='Password' type='password' onChange={handleChange}/>
        <button type='submit'> Submit </button>
      </form>
      Already have an account? <Link to={'/'}>Login</Link>
    </div>
  )
}

export default SignUp