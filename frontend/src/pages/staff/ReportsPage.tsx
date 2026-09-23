/**
 * ============================================================================
 * TÊN FILE: ReportsPage.tsx
 * VỊ TRÍ: src/pages/staff/ReportsPage.tsx
 * PHÂN HỆ: Trung tâm Báo cáo Tài chính & Xuất dữ liệu (Financial Reporting & Export)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Khối tạo và tải các mẫu báo cáo chuẩn hóa cho khách sạn 4 sao:
 *     1. Báo cáo Doanh thu Tổng hợp: Bóc tách phòng, F&B, dịch vụ, thuế VAT.
 *     2. Báo cáo Công suất & ADR / RevPAR theo thời gian.
 *     3. Báo cáo Kiểm toán Ca đêm (Night Audit Balancing Sheet).
 *     4. Báo cáo Kênh đặt phòng OTA vs Direct Web vs Khách vãng lai.
 *     5. Tùy chọn xuất file Excel (CSV / XLSX) hoặc in trực tiếp PDF theo tiêu chuẩn kế toán.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  BarChart,
  Calendar,
  CheckCircle2,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../utils/format';

export const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState('REVENUE');
  const [timeRange, setTimeRange] = useState('THIS_MONTH');

  const reportList = [
    {
      id: 'REVENUE',
      title: 'Báo cáo Doanh thu Tổng hợp',
      desc: 'Bóc tách doanh số phòng, F&B, dịch vụ phụ trợ và thuế giá trị gia tăng.',
      generated: '20/09/2026 08:00',
    },
    {
      id: 'OCCUPANCY',
      title: 'Báo cáo Công suất & ADR / RevPAR',
      desc: 'Tỷ lệ lấp đầy phòng theo ngày, giá bán phòng bình quân (ADR) và RevPAR.',
      generated: '20/09/2026 08:00',
    },
    {
      id: 'NIGHT_AUDIT',
      title: 'Báo cáo Kiểm toán Ca đêm (Night Audit)',
      desc: 'Bảng đối chiếu cân bằng sổ sách, tiền mặt thực tế và số liệu POS ca đêm.',
      generated: '20/09/2026 06:15',
    },
    {
      id: 'SERVICES_CONSUMPTION',
      title: 'Báo cáo Tiêu thụ Dịch vụ & Minibar',
      desc: 'Chi tiết xuất kho minibar, giặt là, spa và voucher khuyến mại theo từng phòng.',
      generated: '19/09/2026 23:59',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.reports')}</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Xuất dữ liệu kế toán, kiểm toán ca đêm và phân tích chỉ số kinh doanh khách sạn
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-4 h-4" />}
          >
            In báo cáo
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => alert('Đang xuất file Excel...')}
            icon={<FileSpreadsheet className="w-4 h-4" />}
            className="bg-[#1F5AA6]"
          >
            Xuất file Excel (.xlsx)
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#475569]">Khoảng thời gian:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="p-2 border rounded-lg bg-slate-50 font-semibold text-[#0F172A]"
          >
            <option value="TODAY">Hôm nay (20/09/2026)</option>
            <option value="THIS_WEEK">Tuần này (14/09 - 20/09)</option>
            <option value="THIS_MONTH">Tháng này (Tháng 09/2026)</option>
            <option value="LAST_MONTH">Tháng trước (Tháng 08/2026)</option>
            <option value="YEAR">Cả năm 2026</option>
          </select>
        </div>

        <div className="text-slate-500 font-semibold">
          Đơn vị tiền tệ: <span className="text-[#0F172A] font-bold">VND (₫)</span> • Chuẩn VAS
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportList.map((rep) => (
          <div
            key={rep.id}
            onClick={() => setReportType(rep.id)}
            className={`p-5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-4 ${
              reportType === rep.id
                ? 'border-[#1F5AA6] bg-blue-50/40 ring-1 ring-[#1F5AA6]'
                : 'border-[#E2E8F0] bg-white hover:border-slate-300'
            }`}
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#EAF2FB] text-[#1F5AA6] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0F172A]">{rep.title}</h3>
              <p className="text-xs text-[#475569]">{rep.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>Cập nhật lúc: {rep.generated}</span>
              <span className="font-bold text-[#1F5AA6] flex items-center gap-1">
                <Download className="w-3.5 h-3.5" /> Tải về
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Table of Current Report */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 className="font-bold text-base text-[#0F172A]">
            Xem trước: Bảng tổng hợp chỉ số vận hành (Tháng 09/2026)
          </h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Dữ liệu đã khóa sổ kiểm toán
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Tổng doanh thu thuần:</span>
            <span className="text-base font-extrabold text-[#1F5AA6] mt-1 block">
              142.500.000 ₫
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Tỷ lệ lấp đầy bình quân:</span>
            <span className="text-base font-extrabold text-[#059669] mt-1 block">78.5%</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">Giá phòng bình quân (ADR):</span>
            <span className="text-base font-extrabold text-[#D97706] mt-1 block">
              1.850.000 ₫
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-500 block">RevPAR:</span>
            <span className="text-base font-extrabold text-[#7C3AED] mt-1 block">
              1.452.250 ₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
