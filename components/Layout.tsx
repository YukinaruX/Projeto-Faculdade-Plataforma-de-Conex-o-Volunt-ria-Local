import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, LogOut, User as UserIcon, Briefcase, Home } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path ? "text-primary-600 font-semibold" : "text-gray-600 hover:text-primary-600";

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Heart className="h-8 w-8 text-primary-500 fill-current" />
              <span className="ml-2 text-xl font-bold text-gray-800">Conecta Causa</span>
            </div>
            
            <div className="flex items-center space-x-8">
              {user ? (
                <>
                  <Link to="/dashboard" className={`flex items-center space-x-1 ${isActive('/dashboard')}`}>
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link to="/explore" className={`flex items-center space-x-1 ${isActive('/explore')}`}>
                    <Briefcase className="h-4 w-4" />
                    <span>Vagas</span>
                  </Link>
                  <div className="flex items-center space-x-4 border-l pl-6 border-gray-200">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <span className="hidden md:inline">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-500" title="Sair">
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-x-4">
                  <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium">Entrar</Link>
                  <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition font-medium">
                    Cadastrar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 text-center text-gray-500 text-sm">
          <p>© 2024 Conecta Causa. Conectando corações a propósitos.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;