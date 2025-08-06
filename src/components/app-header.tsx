import { Link, NavLink } from 'react-router-dom';
import { mainMenu } from '@/config/menu';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { AppLogo } from './app-logo';
import { IconButton } from './ui/icon-button';

export function AppHeader() {
  return (
    <header className="bg-background border-b border-[#e5e8eb]">
      <div className="flex items-center justify-between px-10 pt-3 pb-[13px] relative size-full">
        <div className="flex items-center gap-8 min-w-[300px] shrink-0">
          <Link to="/" className="flex items-center gap-4">
            <AppLogo />
          </Link>

          <nav className="flex items-center gap-9">
            {mainMenu.map((item, index) => (
              <NavLink
                key={index}
                to={item.url}
                className={({ isActive }) =>
                  cn(
                    'text-[14px] leading-[21px] transition-colors',
                    isActive
                      ? 'font-["Inter:Bold",_sans-serif] font-bold text-[#0d0f1c]'
                      : 'font-["Inter:Medium",_sans-serif] font-medium text-[#565a6f] hover:text-[#0d0f1c]'
                  )
                }
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end grow">
          <IconButton aria-label="user-button" variant="default">
            <Star size={20} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
