import { useDispatch } from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import { useNavigate } from 'react-router-dom'

function LogoutBtn() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const logoutHandler = async ()=>{
      try {
        authService.logout() // delete Appwrite session
        dispatch(logout())  // clear Redux state
        navigate("/login")  // redirect to login
      } catch (error) {
        console.log("Logout error", error)
      }
    }
  return (
    <button className='inLine-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full' onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn