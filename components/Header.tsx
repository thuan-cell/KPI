
import React from 'react';
import { Sun, Moon, ChevronDown, User, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  userProfile?: { name: string; role: string; avatar?: string };
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  toggleTheme, 
  isLoggedIn, 
  userProfile, 
  onLoginClick,
  onLogoutClick 
}) => {
  return (
    // Floating Glass Header
    <header className="shrink-0 z-50 w-full no-print sticky top-0 py-3 transition-all duration-300 px-4">
        <div className="max-w-[1600px] mx-auto h-[64px] flex items-center justify-end rounded-2xl bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-black/20 px-6">
          
          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:text-indigo-500 dark:hover:text-indigo-400"
                title="Đổi giao diện"
            >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/10"></div>

            {/* Login / User Profile */}
            <div>
                {isLoggedIn && userProfile ? (
                    <div className="flex items-center gap-3 group cursor-pointer relative">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-slate-800 dark:text-white leading-none">{userProfile.name}</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-md transition-transform group-hover:scale-105">
                            {userProfile.avatar ? (
                                <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                                    <User size={18} />
                                </div>
                            )}
                        </div>
                        
                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-3 w-52 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-1.5 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-sm">
                             <div className="px-3 py-3 border-b border-slate-100 dark:border-white/5 sm:hidden">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{userProfile.name}</p>
                             </div>
                             <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <Settings size={14} /> Cài đặt tài khoản
                             </button>
                             <div className="h-px bg-slate-100 dark:bg-white/5 my-1"></div>
                             <button 
                                onClick={onLogoutClick}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                            >
                                <LogOut size={14} /> Đăng xuất
                             </button>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={onLoginClick}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <span>Đăng Nhập</span>
                        <ChevronDown size={12} className="-rotate-90" />
                    </button>
                )}
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header;
