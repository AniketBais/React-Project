import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../../auth/UserContext';
import logo from '../../assets/logo.png'

function NavBar() {
    const [open, setOpen] = useState(false)

    const menu = [
        { id: "1", title: "Expenses", path: "/home", end: true },
        { id: "2", title: "Manage Expenses", path: "/home/manageExpense" },
    ];

    const { logout } = useContext(UserContext)
    const navigate = useNavigate();

    const navStyle = ({ isActive }) =>
        `block w-full h-full px-3 py-2 rounded transition-all duration-200 
         hover:scale-105 hover:font-medium 
         hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
         active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
         ${isActive ? "bg-blue-500 text-white" : ""}`

    return (
        <div className='sticky top-0 z-50 w-full bg-blue-600/30 backdrop-blur-md border-b border-white/10'>

            <div className='h-16 flex items-center justify-between px-4 md:px-10'>
                <h1 className='font-bold text-lg'>EXPENSES MANAGER</h1>

                {/* Hamburger */}
                <button 
                    className='md:hidden text-2xl'
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>

                {/* Desktop Menu */}
                <ul className='hidden md:flex gap-8'>
                    {menu.map((item) => (
                        <li key={item.id}>
                            <NavLink to={item.path} end={item.end} className={navStyle}>
                                {item.title}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Right section */}
                <div className='hidden md:flex gap-2 items-center'>
                    <img src={logo} className='w-8 h-8 object-cover' />

                    <button
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        className="bg-red-400 px-3 py-1 rounded transition-all duration-200 
                        hover:scale-105 hover:font-medium 
                        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
                        active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* 📱 Mobile Menu */}
            {open && (
                <div className='md:hidden px-4 pb-4'>
                    <ul className='flex flex-col gap-3'>
                        {menu.map((item) => (
                            <li key={item.id}>
                                <NavLink 
                                    to={item.path} 
                                    className={navStyle}
                                    onClick={() => setOpen(false)}
                                >
                                    {item.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    <div className='flex gap-3 items-center mt-4'>
                        <img src={logo} className='w-8 h-8 object-cover' />

                        <button
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                            className="bg-red-400 px-3 py-1 rounded w-full"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default NavBar