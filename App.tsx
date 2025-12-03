

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import InputSection from './components/InputSection';
import ResultsPanel from './components/ResultsPanel';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import { EvaluationState, RatingLevel, EmployeeInfo } from './types';
import { KPI_DATA } from './constants';
import { User, CreditCard, Upload, Printer, X, Calendar } from 'lucide-react';
import DashboardReport from './components/DashboardReport';
import { authService, UserAccount } from './services/authService';

function App() {
  const [ratings, setRatings] = useState<EvaluationState>({});
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });
  
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{name: string, role: string, avatar?: string} | undefined>(undefined);

  const [showPreview, setShowPreview] = useState(false);
  
  const [employeeInfo, setEmployeeInfo] = useState<EmployeeInfo>({
    name: '',
    id: '',
    position: '',
    department: '',
    reportDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    const sessionUser = authService.getCurrentUser();
    if (sessionUser) {
      handleLoginSuccess(sessionUser);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setIsLoggedIn(true);
    setCurrentUser({ 
      name: user.fullName, 
      role: user.role, 
      avatar: user.avatar 
    });
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(undefined);
    setEmployeeInfo(prev => ({
        ...prev,
        name: '',
        id: '',
        position: '',
        department: ''
    }));
    setRatings({});
  };

  const handleRate = useCallback((id: string, level: RatingLevel, score: number) => {
    setRatings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        level,
        actualScore: score,
        notes: prev[id]?.notes || ''
      }
    }));
  }, []);

  const handleNoteChange = useCallback((id: string, note: string) => {
    setRatings(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        notes: note
      }
    }));
  }, []);

  const handleInfoChange = (field: keyof EmployeeInfo, value: string) => {
    setEmployeeInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { categoryScores, totalScore, maxTotalScore, percent, ranking, penaltyApplied } = useMemo(() => {
    let totalScore = 0;
    let maxTotalScore = 0;
    let penaltyApplied = false;
    
    const categoryScores = KPI_DATA.map(cat => {
      let catScore = 0;
      let catMax = 0;
      cat.items.forEach(item => {
        catMax += item.maxPoints;
        if (ratings[item.id]) {
          catScore += ratings[item.id].actualScore;
          // Check for penalty condition: Any item rated WEAK triggers the penalty
          if (ratings[item.id].level === RatingLevel.WEAK) {
            penaltyApplied = true;
          }
        }
      });
      
      catScore = Math.round(catScore * 100) / 100;
      totalScore += catScore;
      maxTotalScore += catMax;
      
      const percentage = catMax > 0 ? Math.round((catScore / catMax) * 100) : 0;
      
      let shortName = cat.name.split('.')[1]?.trim() || cat.name;
      const lowerName = cat.name.toLowerCase();

      if (lowerName.includes("vận hành")) shortName = "Vận hành";
      else if (lowerName.includes("an toàn")) shortName = "An toàn";
      else if (lowerName.includes("thiết bị")) shortName = "Thiết bị";
      else if (lowerName.includes("nhân sự")) shortName = "Nhân sự";
      else if (lowerName.includes("báo cáo")) shortName = "Báo cáo";

      return { 
        id: cat.id,
        name: cat.name, 
        shortName: shortName,
        score: catScore, 
        max: catMax, 
        percentage: percentage
      };
    });

    // Apply 30 point penalty if any item is WEAK
    if (penaltyApplied) {
        totalScore -= 30;
    }

    // Ensure non-negative score
    if (totalScore < 0) totalScore = 0;

    totalScore = Math.round(totalScore * 100) / 100;
    const percent = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
    
    let ranking = "---";
    // Check totalScore against point thresholds explicitly
    // Logic updated: Excellent >= 90, Pass >= 70, Fail < 70
    if (totalScore > 0 || penaltyApplied) {
        if (totalScore >= 90) {
            ranking = "Xuất Sắc";
        }
        else if (totalScore >= 70) {
            ranking = "Đạt Yêu Cầu";
        }
        else {
            ranking = "Không Đạt";
        }
    }

    return { categoryScores, totalScore, maxTotalScore, percent, ranking, penaltyApplied };
  }, [ratings]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen xl:h-screen flex flex-col bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500/30 print:bg-white transition-colors duration-500 xl:overflow-hidden relative overflow-x-hidden">
      
      {isLoggedIn && (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none no-print">
           <div className="absolute top-[-20%] left-[20%] w-[1000px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen opacity-60"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[800px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
           <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-white/40 dark:bg-slate-800/20 rounded-full blur-[150px] mix-blend-overlay dark:mix-blend-normal opacity-20"></div>
        </div>
      )}

      {isLoggedIn && (
        <Header 
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          isLoggedIn={isLoggedIn}
          userProfile={currentUser}
          onLoginClick={() => {}}
          onLogoutClick={handleLogout}
        />
      )}

      <main className="flex-1 relative z-10 w-full max-w-[1920px] mx-auto xl:overflow-hidden flex flex-col">
        {!isLoggedIn ? (
          <LandingPage onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="flex flex-col xl:flex-row xl:h-full h-auto">
            
            {/* Left Column: Inputs */}
            <div className="flex-1 order-2 xl:order-1 no-print min-w-0 xl:h-full h-auto xl:overflow-y-auto scroll-smooth custom-scrollbar">
              <div className="p-4 md:p-8 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
                
                <div className="group relative bg-white/80 dark:bg-[#0f172a]/60 backdrop-blur-xl rounded-[24px] shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-white/50 dark:border-white/5 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/30">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>

                  <div className="px-5 py-5 md:px-8 md:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10 bg-gradient-to-b from-white/50 to-transparent dark:from-white/5 dark:to-transparent border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-4 md:gap-5">
                      <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/50 dark:to-slate-900 text-indigo-600 dark:text-indigo-400 shadow-inner border border-white/60 dark:border-white/10 shrink-0">
                        <User size={24} strokeWidth={2} className="md:w-[26px] md:h-[26px]" />
                      </div>
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-tight">Thông tin nhân sự</h2>
                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 tracking-wide">Cập nhật hồ sơ đánh giá định kỳ</p>
                      </div>
                    </div>
                    
                    <div className="relative self-start md:self-auto">
                      <input type="file" id="logo-upload" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      <label 
                        htmlFor="logo-upload" 
                        className="cursor-pointer group/btn flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wide bg-white dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 px-4 py-2.5 md:px-5 md:py-3 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm backdrop-blur-sm"
                      >
                        {companyLogo ? (
                          <>
                            <div className="w-5 h-5 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                              <img src={companyLogo} alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-emerald-600 dark:text-emerald-400 hidden sm:inline">Đã tải Logo</span>
                            <span className="text-emerald-600 dark:text-emerald-400 sm:hidden">Xong</span>
                          </>
                        ) : (
                          <>
                            <Upload size={16} />
                            <span>Tải Logo</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Họ và tên nhân viên</label>
                        <div className="relative group/input">
                            <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="text"
                                placeholder="Nhập họ tên đầy đủ..."
                                className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400 shadow-inner"
                                value={employeeInfo.name}
                                onChange={e => handleInfoChange('name', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Mã nhân viên</label>
                        <div className="relative group/input">
                            <CreditCard className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="text"
                                placeholder="VD: NV-001"
                                className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400 shadow-inner"
                                value={employeeInfo.id}
                                onChange={e => handleInfoChange('id', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Chức vụ</label>
                        <div className="relative group/input">
                            <CreditCard className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="text"
                                placeholder="VD: Trưởng ca / Nhân viên"
                                className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400 shadow-inner"
                                value={employeeInfo.position}
                                onChange={e => handleInfoChange('position', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Bộ phận / Phòng ban</label>
                        <div className="relative group/input">
                             <CreditCard className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                             <input 
                                type="text"
                                placeholder="VD: Vận Hành Lò Hơi"
                                className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white placeholder:text-slate-400 shadow-inner"
                                value={employeeInfo.department}
                                onChange={e => handleInfoChange('department', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Kỳ đánh giá</label>
                        <div className="relative group/input">
                            <Calendar className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="month"
                                className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white shadow-inner"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide ml-1">Ngày lập</label>
                        <div className="relative group/input">
                            <Calendar className="absolute left-4 top-3.5 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors" size={18} />
                            <input 
                                type="date"
                                className="w-full bg-slate-50 dark:bg-[#0f172a]/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all dark:text-white shadow-inner"
                                value={employeeInfo.reportDate}
                                onChange={(e) => handleInfoChange('reportDate', e.target.value)}
                            />
                        </div>
                    </div>
                  </div>
                </div>

                <InputSection 
                  ratings={ratings} 
                  onRate={handleRate} 
                  onNoteChange={handleNoteChange} 
                />

                <div className="p-6 md:p-8 rounded-[20px] bg-slate-900 dark:bg-[#0f172a] text-white overflow-hidden relative shadow-2xl">
                     <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-lg font-bold uppercase tracking-widest">Tiêu chuẩn xếp loại</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-900/20 border border-emerald-500/20 relative group hover:border-emerald-500/40 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-black text-emerald-400 text-lg">XUẤT SẮC</span>
                                    <span className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded">90 - 100 điểm</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">Hoàn thành xuất sắc nhiệm vụ, không xảy ra sự cố, tuân thủ tuyệt đối quy trình.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-900/20 border border-blue-500/20 relative group hover:border-blue-500/40 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-black text-blue-400 text-lg">ĐẠT YÊU CẦU</span>
                                    <span className="px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded">70 - 90 điểm</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">Hoàn thành nhiệm vụ được giao, còn sai sót nhỏ nhưng đã khắc phục kịp thời.</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 to-rose-900/20 border border-rose-500/20 relative group hover:border-rose-500/40 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-black text-rose-400 text-lg">KHÔNG ĐẠT</span>
                                    <span className="px-2 py-1 bg-rose-500 text-white text-[10px] font-bold rounded">&lt; 70 điểm</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">Vi phạm quy trình vận hành, để xảy ra sự cố nghiêm trọng hoặc thiếu trách nhiệm.</p>
                            </div>
                        </div>
                     </div>
                </div>
              </div>
            </div>

            {/* Right Column: Results - Framed Widget Mode */}
            {/* Added responsive classes: h-auto on mobile, order-last to keep at bottom on mobile */}
            <div className="w-full xl:w-[380px] shrink-0 xl:h-full h-auto flex flex-col relative z-20 pointer-events-none xl:pointer-events-auto xl:order-2 order-2 p-4 xl:p-4 mb-6 xl:mb-0">
               <div className="h-full pointer-events-auto">
                   <ResultsPanel 
                      categoryScores={categoryScores}
                      totalScore={totalScore}
                      percent={percent}
                      ranking={ranking}
                      selectedMonth={selectedMonth}
                      showPreview={showPreview}
                      setShowPreview={setShowPreview}
                      onPrint={handlePrint}
                      penaltyApplied={penaltyApplied}
                   />
               </div>
            </div>
          </div>
        )}
      </main>

      {/* PRINT PREVIEW OVERLAY - Updated Design */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md flex justify-center overflow-y-auto p-4 md:p-8 custom-scrollbar">
            
            {/* Floating Top-Right Actions */}
            <div className="fixed top-4 right-4 md:top-6 md:right-6 flex items-center gap-0 bg-slate-800/90 border border-white/10 rounded-lg p-1 shadow-2xl z-[110] backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-500">
                 <button 
                    onClick={handlePrint} 
                    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white text-slate-900 rounded-md font-bold text-xs hover:bg-indigo-50 transition-colors uppercase tracking-wide shadow-sm"
                 >
                    <Printer size={14} /> <span className="hidden sm:inline">In Báo Cáo</span><span className="sm:hidden">In</span>
                 </button>
                 <div className="w-px h-6 bg-white/10 mx-1"></div>
                 <button 
                    onClick={() => setShowPreview(false)} 
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                 >
                    <X size={18} />
                 </button>
            </div>

            <div id="printable-dashboard" className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl origin-top animate-in zoom-in-95 duration-300 relative mt-10 mb-10">
              <DashboardReport 
                ratings={ratings}
                selectedMonth={selectedMonth}
                totalScore={totalScore}
                maxTotalScore={maxTotalScore}
                percent={percent}
                ranking={ranking}
                categoryScores={categoryScores}
                employeeInfo={employeeInfo}
                logoUrl={companyLogo}
                penaltyApplied={penaltyApplied}
              />
            </div>
        </div>
      )}
    </div>
  );
}

export default App;
