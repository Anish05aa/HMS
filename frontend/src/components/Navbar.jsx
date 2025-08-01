import { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

// import { useTheme } from '../context/ThemeContext';



const Navbar = () => {
  const navigate = useNavigate();

  const {token, setToken,userData} = useContext(AppContext)

  // const { darkMode, toggleTheme } = useTheme();



  const [showMenu, setShowMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileClick = () => {
    // this executes only if the screen size is small
    if (window.innerWidth < 768) {
      setShowProfileMenu(!showProfileMenu);
    }
  };

  const logout=()=>{
    setToken(false)
    localStorage.removeItem('token')
  }


  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <NavLink to='/' className={({ isActive }) => (isActive ? 'active group' : 'group')}>
          <li className='py-1'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-[#28a745] w-3/5 m-auto hidden group-[.active]:block' />
        </NavLink>
        <NavLink to='/doctors' className={({ isActive }) => (isActive ? 'active group' : 'group')}>
          <li className='py-1'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-[#28a745] w-3/5 m-auto hidden group-[.active]:block' />
        </NavLink>
        <NavLink to='/about' className={({ isActive }) => (isActive ? 'active group' : 'group')}>
          <li className='py-1'>ABOUT</li>
          <hr className='border-none outline-none h-0.5 bg-[#28a745] w-3/5 m-auto hidden group-[.active]:block' />
        </NavLink>
        <NavLink to='/contact' className={({ isActive }) => (isActive ? 'active group' : 'group')}>
          <li className='py-1'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-[#28a745] w-3/5 m-auto hidden group-[.active]:block' />
        </NavLink>
      </ul>
      {/* <button
      onClick={toggleTheme}
      className="p-2 rounded text-sm border dark:border-white border-gray-700"
    >
      {darkMode ? '🌙 Dark' : '☀️ Light'}
    </button> */}

      <div className='flex items-center gap-4'>
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative' onClick={handleProfileClick}>
              <img src={userData.image} alt="" className='w-8 rounded-full' />
              <img src={assets.dropdown_icon} alt="" className='w-2.5' />
              <div className={`absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 ${showProfileMenu ? 'block' : 'hidden'
                } group-hover:block`}>
                <div className='min-w-48 bg-[#d4edda] rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <button className='bg-[#28a745] text-white px-8 py-3 rounded-full font-light hidden md:block' onClick={() => navigate('/login')}>Create Account</button>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
        {/* ---mobile menu----- */}
        <div className={`${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-10 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-45' src={assets.logo} alt="" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/'><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Navbar;