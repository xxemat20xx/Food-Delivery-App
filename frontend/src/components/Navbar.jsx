import { useAuthStore } from "../store/useAuthStore"
import { useNavigate } from "react-router-dom";
const Navbar = ({ children }) => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/')
    }
  return (
    <>
        <nav className='bg-amber-600 p-3 fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 transition-all duration-500 backdrop-blur-md'>
                <div className='flex items-center justify-between'>
                    <button className='font-bold text-slate-100'>Logo</button>
                    <button
                    onClick={() => handleLogout()}
                    >Logout</button>
                </div>
        </nav>
        <main>
            {children}
        </main>
    </>
  )
}

export default Navbar