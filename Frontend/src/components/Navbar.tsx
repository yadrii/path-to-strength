import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Heart, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary fill-primary/20" />
          <span className="text-xl font-display font-semibold text-foreground">
            {t('Sahara', 'सहारा')}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to={user?.role === 'ngo' ? '/ngo-dashboard' : '/dashboard'}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.name}
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button className="btn-hero text-sm px-6 py-2">
                {t('Login', 'लगइन')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
