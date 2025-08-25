import { useState,useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Settings, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    title: '',
    bio: '',
    timezone: '',
    language: 'en'
  });
  const isActive = (path: string) => location.pathname === path;
    useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // or sessionStorage
        const res = await fetch('http://localhost:8080/user/me', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();

        setProfile({
          ...profile,
          fullName: data.name,
          email: data.email,
        });
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile');
      }
    };

    fetchUser();
  }, []);
  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Teams', path: '/teams' },
    { name: 'Projects', path: '/projects' },
  ];

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TS</span>
            </div>
            <span className="gradient-text font-poppins font-bold text-xl hidden sm:block">
              TeamSphere
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'gradient-text bg-white/10'
                    : 'text-gray-600 hover:text-primary hover:bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="User" />
                    <AvatarFallback className="bg-gradient-primary text-white">{profile.fullName[0]}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile.fullName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'gradient-text bg-white/10'
                      : 'text-gray-600 hover:text-primary hover:bg-white/5'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t border-white/20 pt-2 mt-2">
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-primary hover:bg-white/5"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;