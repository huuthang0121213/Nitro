/**
 * ============================================================================
 * TÊN FILE: AuditLogsPage.tsx
 * VỊ TRÍ: src/pages/staff/AuditLogsPage.tsx
 * PHÂN HỆ: Nhật ký Kiểm toán Bảo mật & Truy vết (Audit Logs & Security Tracing)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Hệ thống ghi nhận và lưu trữ toàn bộ nhật ký sự kiện kiểm toán bất biến:
 *     + Ghi nhận thời gian chính xác tới từng giây (Timestamp).
 *     + Danh tính tài khoản thực hiện (Admin, Lễ tân, Thu ngân, Hệ thống tự động).
 *     + Hành động thao tác (Check-in, Check-out, Đổi phòng, Cập nhật giá, Đổi vai trò).
 *     + Đối tượng bị tác động (Mã phòng, Mã đặt phòng PNR, Mã khách hàng).
 *     + Địa chỉ IP và chi tiết thông điệp thao tác.
 *     + Công cụ tìm kiếm tức thì và xuất file phục vụ công tác thanh tra/kiểm toán.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Filter,
  Search,
  Shield,
  User,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';

interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  role: string;
  action: string;
  target: string;
  ipAddress: string;
  details: string;
}

const MOCK_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '20/09/2026 08:24:12',
    userName: 'Lê Hoàng Lễ Tân',
    role: 'FRONT_DESK',
    action: 'CHECK_IN',
    target: 'NGH-2026-8801 (Phòng 302)',
    ipAddress: '192.168.1.102',
    details: 'Xác nhận nhận phòng thành công, giao thẻ từ #302A.',
  },
  {
    id: 'log-2',
    timestamp: '20/09/2026 08:15:40',
    userName: 'Hệ thống tự động',
    role: 'SYSTEM',
    action: 'HOLD_EXPIRED',
    target: 'NGH-2026-8799',
    ipAddress: '127.0.0.1',
    details: 'Hết hạn giữ chỗ 10 phút, phòng 504 được hoàn trả trạng thái AVAILABLE.',
  },
  {
    id: 'log-3',
    timestamp: '20/09/2026 07:55:10',
    userName: 'Nguyễn Văn Quản Trị',
    role: 'ADMIN',
    action: 'UPDATE_PRICE',
    target: 'Hạng Executive Suite',
    ipAddress: '192.168.1.10',
    details: 'Cập nhật giá niêm yết từ 2.800.000 ₫ lên 3.200.000 ₫.',
  },
  {
    id: 'log-4',
    timestamp: '20/09/2026 07:30:00',
    userName: 'Trần Thị Giám Đốc',
    role: 'MANAGER',
    action: 'EXPORT_REPORT',
    target: 'Báo cáo doanh thu tháng 9',
    ipAddress: '192.168.1.25',
    details: 'Xuất file Excel báo cáo doanh thu tài chính kỳ 01 - 20/09.',
  },
  {
    id: 'log-5',
    timestamp: '20/09/2026 06:10:22',
    userName: 'Võ Minh Thuận',
    role: 'FRONT_DESK',
    action: 'CHECK_OUT',
    target: 'NGH-2026-8785 (Phòng 701)',
    ipAddress: '192.168.1.104',
    details: 'Quyết toán trả phòng, thu thêm 120.000 ₫ phụ thu minibar.',
  },
];

export const AuditLogsPage: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS);
  const [search, setSearch] = useState('');

  const filtered = logs.filter(
    (l) =>
      l.userName.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.auditLogs')}</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Nhật ký hoạt động bảo mật, truy vết lịch sử thao tác của từng nhân viên và hệ thống
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          icon={<Download className="w-4 h-4" />}
        >
          Xuất nhật ký (CSV)
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo người dùng, hành động, phòng..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-lg"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
          {filtered.length} sự kiện được ghi nhận
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Người thực hiện</th>
                <th className="py-3 px-4">Hành vi (Action)</th>
                <th className="py-3 px-4">Đối tượng tác động</th>
                <th className="py-3 px-4">Địa chỉ IP</th>
                <th className="py-3 px-4">Chi tiết thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition font-mono">
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 px-4 font-sans font-bold text-[#0F172A]">
                    {log.userName}
                    <span className="ml-1.5 text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-blue-50 text-[#1F5AA6] border border-blue-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans font-semibold text-slate-800">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{log.ipAddress}</td>
                  <td className="py-3 px-4 font-sans text-slate-700">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
