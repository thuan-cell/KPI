import React from 'react';
import { KPI_DATA } from '../constants';
import { EvaluationState, EmployeeInfo } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { CheckCircle2, AlertTriangle, FileText, Calendar, Layers } from 'lucide-react';

// Khai báo kiểu dữ liệu cho props của DashboardReport
interface DashboardReportProps {
  ratings: EvaluationState;
  selectedMonth: string;
  totalScore: number;
  maxTotalScore: number;
  percent: number;
  ranking: string;
  categoryScores: any[];
  employeeInfo: EmployeeInfo;
  logoUrl: string | null;
  penaltyApplied?: boolean;
}

const DashboardReport: React.FC<DashboardReportProps> = ({
  ratings,
  selectedMonth,
  totalScore,
  maxTotalScore,
  percent,
  ranking,
  categoryScores,
  employeeInfo,
  logoUrl,
  penaltyApplied
}) => {
  // Lấy năm và tháng từ selectedMonth (vd: "2024-06")
  const [year, month] = selectedMonth.split('-');
  // Xử lý ngày lập báo cáo, nếu có ngày thì lấy, không thì lấy ngày hiện tại
  const reportDateObj = employeeInfo.reportDate ? new Date(employeeInfo.reportDate) : new Date();

  // Mảng màu cho biểu đồ Pie và cột
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    // KHUNG TỔNG THỂ TRANG - chỉnh sửa padding trái/phải/trên/dưới ở px-[10mm] py-[10mm] cho lề trang
    <div className="bg-white text-slate-900 font-sans w-full px-[10mm] py-[10mm] relative box-border flex flex-col h-full min-h-[297mm]">

      {/* ---------------- PHẦN HEADER ---------------- */}
      <div className="border-b-2 border-slate-900 pb-4 mb-4">
        
        {/* HÀNG TRÊN: LOGO và THÔNG TIN NGẮN */}
        <div className="flex justify-between items-center mb-4">
            
            {/* VÙNG LOGO */}
            <div className="flex items-center gap-4">
                 {/* Chiều cao logo chỉnh ở h-14, max chiều rộng ở max-w-[150px] */}
                 <div className="h-16 w-auto max-w-[160px] flex items-center">
                    <img
                        src={logoUrl || "/triviet-logo.png"}
                        alt="Logo"
                        className="h-full w-auto object-contain object-left"
                    />
                 </div>
                 {/* Đường ngăn giữa logo và tên công ty */}
                 <div className="h-10 w-px bg-slate-300 mx-1"></div>
                 {/* Tên công ty và mô tả nhỏ chỉnh ở đây */}
                 <div className="flex flex-col justify-center items-center">
                    <p className="text-[9px] font-bold uppercase tracking-wide leading-tight text-slate-800">
                        Công Ty TNHH Trí Việt Biogen
                    </p>
                    <p className="text-[10px] font-medium leading-tight text-slate-500 mt-1">
                        Hệ thống đánh giá KPI
                    </p>
                 </div>
            </div>

             {/* KHUNG THÔNG TIN META BÊN PHẢI */}
            {/* Sửa màu và viền ở border, bg, rounded, shadow-sm */}
            <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              {/* Box "Kỳ đánh giá" - Min width ở min-w-[90px], padding ở px-4 py-2 */}
              <div className="px-4 py-2 border-r border-slate-200 flex flex-col items-center justify-center min-w-[90px]">
                <span className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1.5 mb-1">
                  <Calendar size={10} /> Kỳ đánh giá
                </span>
                <span className="text-blue-700 font-black text-xs whitespace-nowrap">
                  THÁNG {month}/{year}
                </span>
              </div>
              {/* Box "Ngày lập" */}
              <div className="px-4 py-2 border-r border-slate-200 flex flex-col items-center justify-center min-w-[90px]">
                <span className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1.5 mb-1">
                  <FileText size={10} /> Ngày lập
                </span>
                <span className="text-slate-800 font-bold text-xs whitespace-nowrap">
                  {reportDateObj.toLocaleDateString("vi-VN")}
                </span>
              </div>
              {/* Box "Mã biểu mẫu" */}
              <div className="px-4 py-2 flex flex-col items-center justify-center min-w-[90px]">
                <span className="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1.5 mb-1">
                  <Layers size={10} /> Mã biểu mẫu
                </span>
                <span className="font-bold text-xs text-slate-800 whitespace-nowrap">BM-KPI-01</span>
              </div>
            </div>
        </div>

        {/* TIÊU ĐỀ CHÍNH Ở GIỮA TRANG */}
        {/* Sửa font, màu và kích cỡ ở text-3xl, font-black, text-blue-900 */}
        <div className="text-center w-full">
             <h1 className="text-3xl font-black text-blue-900 uppercase leading-tight tracking-tight mb-2">
                ĐÁNH GIÁ HIỆU QUẢ CÔNG VIỆC
             </h1>
             <div className="flex items-center justify-center gap-4 opacity-80">
                {/* Đường gạch ngang 2 bên tiêu đề, chiều dài ở w-16 */}
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-400"></div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
                    Performance Appraisal Report
                </p>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-400"></div>
             </div>
        </div>
      </div>



      {/* --- THÔNG TIN NHÂN VIÊN (GỌN 1 DÒNG) --- */}
      {/* Sửa số lượng cột tại grid-cols-4, chỉnh padding p-2, khoảng cách các trường ở gap-4 */}
      <div className="bg-slate-50 border border-slate-200 rounded p-2 mb-2 grid grid-cols-4 gap-4 text-[10px]">
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[9px] mb-0.5">Họ và tên</span>
            <span className="font-bold uppercase text-blue-900 text-xs">{employeeInfo.name || '................................'}</span>
         </div>
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[9px] mb-0.5">Mã nhân viên</span>
            <span className="font-bold text-slate-800">{employeeInfo.id || '................................'}</span>
         </div>
         <div className="flex flex-col border-r border-slate-200 pr-2">
            <span className="text-slate-500 uppercase text-[9px] mb-0.5">Chức vụ</span>
            <span className="font-bold text-slate-800">{employeeInfo.position || '................................'}</span>
         </div>
         <div className="flex flex-col">
            <span className="text-slate-500 uppercase text-[9px] mb-0.5">Bộ phận</span>
            <span className="font-bold text-slate-800">{employeeInfo.department || '................................'}</span>
         </div>
      </div>

      {/* --- KHU VỰC DASHBOARD/BIỂU ĐỒ --- */}
      {/* Sửa chiều cao chung ở h-28, số cột ở grid-cols-3, khoảng cách giữa các cột ở gap-2 */}
      <div className="grid grid-cols-3 gap-2 mb-2 h-28">
         {/* KHUNG TỔNG KẾT ĐIỂM KPI */}
         {/* Chỉnh padding ở p-2, căn giữa flex-col items-center,... */}
         <div className="col-span-1 bg-white rounded border border-slate-200 p-2 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
            {/* Icon nền mờ góc phải */}
            <div className="absolute top-0 right-0 p-1 opacity-5">
               <CheckCircle2 size={60} />
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tổng Điểm</div>
            {/* Chỉnh kích cỡ số điểm tổng ở text-4xl */}
            <div className="text-4xl font-extrabold text-blue-900 leading-none mb-1">{Number(totalScore).toFixed(2)}</div>
            {/* Dòng tổng điểm tối đa */}
            <div className="text-slate-400 text-[10px] font-medium mb-1">/ {maxTotalScore} điểm tối đa</div>
            {/* Box xếp loại: đổi màu theo phần trăm điểm */}
            <div className={`px-4 py-1 rounded-full text-[10px] font-bold border ${
               percent >= 90 ? 'bg-green-100 text-green-800 border-green-200' :
               percent >= 70 ? 'bg-blue-100 text-blue-800 border-blue-200' :
               'bg-red-100 text-red-800 border-red-200'
            }`}>
               XẾP LOẠI: {ranking.toUpperCase()}
            </div>
            
            {/* Hiện thông báo trừ điểm nếu có lỗi yếu */}
            {penaltyApplied && (
               <div className="text-[10px] font-bold text-red-600 mt-2 flex items-center justify-center gap-1 bg-red-50 px-2 py-1 rounded border border-red-100">
                 <AlertTriangle size={12} /> Đã trừ 30 điểm (Lỗi Yếu)
               </div>
            )}
         </div>

         {/* BIỂU ĐỒ PIE (CƠ CẤU ĐIỂM) */}
         {/* Sửa kích cỡ biểu đồ tại width/height, padding - p-1 */}
         <div className="col-span-1 border border-slate-200 rounded p-1 relative shadow-sm flex items-center justify-center">
            {/* Tiêu đề nhỏ góc trên trái */}
            <div className="absolute top-1 left-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">Cơ cấu điểm</div>
            <div className="w-full h-full flex items-center justify-center">
                <PieChart width={200} height={120}>
                <Pie
                    data={categoryScores}
                    cx="50%"
                    cy="50%"
                    innerRadius={25} // Bán kính trong để tạo hiệu ứng donut, muốn dày/mỏng hơn thì chỉnh ở đây
                    outerRadius={45} // Bán kính ngoài
                    paddingAngle={2}
                    dataKey="score"
                    nameKey="shortName"
                    isAnimationActive={false}
                    labelLine={false}
                    // Chú thích: Muốn hiện % tương ứng trong slice lớn hơn 5%
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return percent > 0.05 ? (
                            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={8} fontWeight="bold">
                            {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        ) : null;
                    }}
                >
                    {categoryScores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                {/* Chỉnh font chú thích legend tại wrapperStyle.fontSize */}
                <Legend iconSize={8} wrapperStyle={{ fontSize: '8px', bottom: 0 }} layout="horizontal" align="center" verticalAlign="bottom" />
                </PieChart>
            </div>
         </div>

         {/* BIỂU ĐỒ BAR (SO SÁNH ĐIỂM CÁC MỤC) */}
         <div className="col-span-1 border border-slate-200 rounded p-1 relative shadow-sm flex items-center justify-center">
            {/* Tiêu đề bảng nhỏ ở góc trên trái */}
            <div className="absolute top-1 left-2 text-[8px] font-bold text-slate-500 uppercase tracking-wider">Chi tiết theo mục</div>
            {/* Padding trong khu vực biểu đồ: pl-2 pt-2 */}
            <div className="w-full h-full flex items-center justify-center pl-2 pt-2">
                <BarChart width={200} height={120} data={categoryScores} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                {/* Đổi cỡ label trục và màu bằng tick.fontSize/fill/fontWeight */}
                <XAxis dataKey="shortName" tick={{fontSize: 8, fill: '#0f172a', fontWeight: 600}} interval={0} />
                <YAxis tick={{fontSize: 8, fill: '#64748b'}} domain={[0, 'dataMax']} />
                {/* Cột tối đa và đạt được chỉnh màu và độ rộng ở fill/barSize */}
                <Bar dataKey="max" fill="#cbd5e1" radius={[2, 2, 0, 0]} barSize={10} name="Tối đa" isAnimationActive={false} />
                <Bar dataKey="score" fill="#1e3a8a" radius={[2, 2, 0, 0]} barSize={10} name="Đạt được" isAnimationActive={false} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '8px', paddingTop: '5px' }} />
                </BarChart>
            </div>
         </div>
      </div>

      {/* --- BẢNG CHI TIẾT ĐIỂM (Thu nhỏ, viền và chữ nhỏ) --- */}
      {/* Chỉnh margin trên/dưới của bảng  mb-3 mt-10 */}
      <div className="mb-3 mt-10">
         {/* Tiêu đề bảng chi tiết, đổi màu ở bg-blue-900, kích cỡ ở text-[10px], padding py-1 px-2 */}
         <h3 className="text-[10px] font-bold text-white bg-blue-900 uppercase py-1 px-2 mb-0 rounded-t inline-block">Bảng điểm chi tiết</h3>
         <div className="border-t-2 border-blue-900">
            <table className="w-full text-[9px] border-collapse">
                <thead>
                <tr className="bg-slate-100 text-slate-800 uppercase font-bold">
                    {/* chỉnh độ rộng ở w-* */}
                    <th className="border border-slate-300 p-1 text-center w-6">TT</th>
                    <th className="border border-slate-300 p-1 text-left">Nội dung / Tiêu chí đánh giá</th>
                    <th className="border border-slate-300 p-1 text-center w-8"> Điểm Max</th>
                    <th className="border border-slate-300 p-1 text-center w-8"> Điểm Đạt</th>
                    <th className="border border-slate-300 p-1 text-center w-14">Xếp loại</th>
                    <th className="border border-slate-300 p-1 text-left w-[340px]">Ghi chú</th>
                </tr>
                </thead>
                <tbody>
                {KPI_DATA.map(category => (
                    <React.Fragment key={category.id}>
                        {/* Dòng tiêu đề từng danh mục (in đậm, nền nhạt) */}
                        <tr className="bg-blue-50/50 font-bold text-blue-900">
                            <td className="border border-slate-300 p-1 text-center">{category.id.split('_')[1]}</td>
                            <td className="border border-slate-300 p-1" colSpan={5}>{category.name}</td>
                        </tr>
                        {/* Lặp từng tiêu chí nhỏ  */}
                        {category.items.map(item => {
                            const rating = ratings[item.id];
                            return (
                            <tr key={item.id}>
                                <td className="border border-slate-300 p-1 text-center text-slate-500">{item.code}</td>
                                <td className="border border-slate-300 p-1">
                                    <div className="font-semibold text-slate-800">{item.name}</div>
                                    <div className="text-slate-500 italic mt-0.5 text-[8px] leading-tight">
                                        {/* Chỉnh mô tả tiêu chí ở đây, đối với trường hợp chưa có đánh giá sẽ lấy mục tiêu GOOD */}
                                        {rating ? item.criteria[rating.level].description : `Mục tiêu: ${item.criteria['GOOD'].description}`}
                                    </div>
                                </td>
                                <td className="border border-slate-300 p-1 text-center text-slate-500">{item.maxPoints}</td>
                                <td className="border border-slate-300 p-1 text-center font-bold text-slate-800">{rating ? rating.actualScore.toFixed(2) : '0.00'}</td>
                                <td className="border border-slate-300 p-1 text-center">
                                    {/* Hiển thị badge xếp loại với màu khác nhau cho từng loại, có thể chỉnh màu ở đây */}
                                    {rating ? (
                                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0 rounded text-[8px] font-bold border ${
                                        rating.level === 'GOOD' ? 'bg-green-50 text-green-700 border-green-200' :
                                        rating.level === 'AVERAGE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                        'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {rating.level === 'GOOD' ? 'TỐT' : rating.level === 'AVERAGE' ? 'TRUNG BÌNH' : 'YẾU'}
                                        </span>
                                    ) : <span className="text-slate-300">-</span>}
                                </td>
                                {/* Ghi chú, cho phép ngắt dòng tự động */}
                                <td className="border border-slate-300 p-1 text-slate-600 whitespace-normal break-words">{rating?.notes}</td>
                            </tr>
                            );
                        })}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
         </div>
      </div>

      {/* --- CHỮ KÝ VÀ XÁC NHẬN (Đáy trang) --- */}
      {/* Tăng/giảm số cột ở grid-cols-3, chỉnh khoảng cách cột ở gap-8 */}
      <div className="grid grid-cols-3 gap-8 mt-5">
         <div className="text-center">
            {/* Tiêu đề người ký, chỉnh margin dưới ở mb-28 */}
            <div className="font-bold text-[9px] uppercase mb-28 text-slate-800">Người được đánh giá</div>
            {/* Chỉnh nét gạch tay ký và font ở đây */}
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[9px] font-bold text-slate-900 uppercase">
                {employeeInfo.name || ''}
            </div>
         </div>
         <div className="text-center">
            <div className="font-bold text-[9px] uppercase mb-28 text-slate-800">Người đánh giá</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[8px] text-slate-400 italic">Ký & ghi rõ họ tên</div>
         </div>
         <div className="text-center">
            <div className="font-bold text-[9px] uppercase mb-28 text-slate-800">Giám đốc phê duyệt</div>
            <div className="border-t border-slate-300 w-24 mx-auto pt-1 text-[8px] text-slate-400 italic">Ký & ghi rõ họ tên</div>
         </div>
      </div>
    </div>
  );
};

// Xuất component DashboardReport
export default DashboardReport;