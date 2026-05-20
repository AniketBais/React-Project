import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './components/login/Login'
import NavBar from './components/navbar/NavBar'
import Home from './components/home/Home'
import ManageExpenses from './components/manageExpenses/ManageExpenses'
import Layout from './components/Layout/Layout'
import CreateAccount from './components/login/CreateAccount'
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate  } from 'react-router-dom'
import { UserProvider } from './auth/UserContext'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Default Page*/}
      <Route path='/' element = {<Navigate to='/login'/>}/>
      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<CreateAccount />} />
      {/* APP ROUTES (WITH NAVBAR) */}
      <Route path="/home" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="manageExpense" element={<ManageExpenses />} />
      </Route>
    </>
  )
)

createRoot(document.getElementById('root')).render(
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
    
  
)
