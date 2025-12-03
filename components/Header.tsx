
import React from 'react';
import { Sun, Moon, ChevronDown, User, LogOut, Settings, Flame, BarChart3 } from 'lucide-react';

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
    <header className="shrink-0 z-50 w-full no-print sticky top-0 py-3 transition-all duration-300 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1800px] mx-auto h-[72px] flex items-center justify-between rounded-2xl bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/20 px-6 relative overflow-hidden">
          
          {/* Decor: Top highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent"></div>

          {/* LEFT: Branding */}
          <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                  <div className="absolute -inset-2 bg-indigo-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-300">
                      <Flame size={22} className="animate-pulse-slow" fill="currentColor" fillOpacity={0.2} strokeWidth={2.5} />
                  </div>
              </div>
              <div className="flex flex-col justify-center">
                  <h1 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight leading-none flex items-center gap-1">
                      Boiler <span className="text-indigo-600 dark:text-indigo-400">KPI</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                      <span className="flex h-1.5 w-1.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
                          Performance System
                      </span>
                  </div>
              </div>
          </div>
          
          {/* RIGHT: Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            
            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:text-indigo-500 dark:hover:text-indigo-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 active:scale-95"
                title="Đổi giao diện"
            >
                {darkMode ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>

            {/* Login / User Profile */}
            <div>
                {isLoggedIn && userProfile ? (
                    <div className="flex items-center gap-3 group cursor-pointer relative">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-slate-800 dark:text-white leading-none">{userProfile.name}</div>
                        </div>
                        <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-md transition-transform group-hover:scale-105 group-hover:border-indigo-500/50">
                            {userProfile.avatar ? (
                                <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600">
                                    <User size={20} />
                                </div>
                            )}
                        </div>
                        
                        {/* Dropdown */}
                        <div className="absolute top-full right-0 mt-4 w-60 bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-2 hidden group-hover:block animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-3xl z-[60]">
                             <div className="px-3 py-3 border-b border-slate-100 dark:border-white/5 sm:hidden">
                                <p className="text-xs font-bold text-slate-900 dark:text-white">{userProfile.name}</p>
                             </div>
                             
                             <div className="p-2">
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <Settings size={16} /> Cài đặt tài khoản
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                    <BarChart3 size={16} /> Lịch sử đánh giá
                                </button>
                             </div>

                             <div className="h-px bg-slate-100 dark:bg-white/5 my-1 mx-2"></div>
                             
                             <div className="p-2">
                                <button 
                                    onClick={onLogoutClick}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                                >
                                    <LogOut size={16} /> Đăng xuất
                                </button>
                             </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={onLoginClick}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                    >
                        <span>Đăng Nhập</span>
                        <ChevronDown size={14} className="-rotate-90" />
                    </button>
                )}
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header;
