import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, User, BarChart2 } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/camera', icon: Camera, label: 'Scan' },
        { path: '/profile', icon: User, label: 'Profile' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 glass-card mx-4 mb-4 p-4 flex justify-around items-center z-50">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <div className={`p-2 rounded-2xl ${isActive ? 'bg-primary/20' : ''}`}>
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default Navbar;
