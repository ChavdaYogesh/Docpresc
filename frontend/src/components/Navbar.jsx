import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/login')
  }

  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
      <ul className='md:flex items-start gap-5 font-medium hidden'>
        <NavLink to='/' >
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors' >
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/medicine-search' >
          <li className='py-1'>MEDICINE SEARCH</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about' >
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact' >
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4 '>
        {
          token && userData
            ? <div className='flex items-center gap-3 cursor-pointer group relative'>
              <div className='flex items-center gap-2'>
                <img 
                  className='w-10 h-10 rounded-full border-2 border-green-200 hover:border-green-300 transition-all duration-300 object-cover shadow-sm' 
                  src={userData.image} 
                  alt="Profile" 
                />
                <span className='hidden sm:block text-sm font-medium text-gray-700'>{userData.name}</span>
              </div>
              <img className='w-3 transition-transform duration-300 group-hover:rotate-180' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-16 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-white rounded-lg shadow-lg border border-gray-100 flex flex-col gap-1 p-2'>
                  <p onClick={() => navigate('/my-profile')} className='hover:bg-green-50 hover:text-green-700 cursor-pointer px-3 py-2 rounded-md transition-colors duration-200'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:bg-green-50 hover:text-green-700 cursor-pointer px-3 py-2 rounded-md transition-colors duration-200'>My Appointments</p>
                  <p onClick={() => navigate('/medicine-search')} className='hover:bg-green-50 hover:text-green-700 cursor-pointer px-3 py-2 rounded-md transition-colors duration-200'>Medicine Search</p>
                  <hr className='border-gray-100 my-1' />
                  <p onClick={logout} className='hover:bg-red-50 hover:text-red-600 cursor-pointer px-3 py-2 rounded-md transition-colors duration-200'>Logout</p>
                </div>
              </div>
            </div>
            : <button onClick={() => navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-green-600 transition-colors duration-300'>Create account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`md:hidden ${showMenu ? 'fixed w-full' : 'h-0 w-0'} right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors' ><p className='px-4 py-2 rounded full inline-block'>ALL DOCTORS</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/medicine-search' ><p className='px-4 py-2 rounded full inline-block'>MEDICINE SEARCH</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about' ><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact' ><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar