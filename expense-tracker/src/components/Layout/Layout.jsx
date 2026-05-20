import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import NavBar from '../navbar/NavBar'
import { UserContext } from '../../auth/UserContext'

function Layout() {
  const { user, loading } = useContext(UserContext);

  //Wait until localStorage check finishes
  if (loading) {
    return <h2>Loading...</h2>;
  }

  // If not logged in → go to login
  if (!user) {
    return <Navigate to="/login" />
  }
  console.log(user)

  return (
    <div>
      <NavBar />
      <main className="flex-1 w-full overflow-hidden bg-slate-50">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout