/**
 * ============================================================================
 * TÊN FILE: BookingsListPage.tsx
 * VỊ TRÍ: src/pages/staff/BookingsListPage.tsx
 * PHÂN HỆ: Quản trị Nghiệp vụ Đặt phòng (Central Reservation System - CRS)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Trung tâm tra cứu và quản lý toàn bộ hồ sơ lưu trú của khách sạn Nitro Grand:
 *     + Tìm kiếm đa năng: Theo mã PNR, tên khách, số điện thoại, số phòng gán.
 *     + Bộ lọc đa chiều: Trạng thái (Chờ nhận phòng, Đang ở, Đã trả phòng, Đã hủy) & Kênh đặt (Web, App, Quầy, OTA).
 *     + Bảng dữ liệu tương tác: Xem chi tiết ngày đến/đi, tổng tiền, phương thức thanh toán.
 *     + Tác vụ trực tiếp tại từng dòng:
 *         * Check-in nhanh cho khách sắp đến.
 *         * Check-out trả phòng và quyết toán chi phí.
 *         * Mở Drawer xem toàn bộ lịch sử và dịch vụ kèm theo.
 *     + Xuất danh sách Excel hoặc in ấn phục vụ kiểm toán ca trực.
 * - Kết nối Backend REST API:
 *     + `GET /api/v1/bookings`: Tải danh sách đơn đặt phòng.
 *     + `PATCH /api/v1/bookings/:id/status`: Cập nhật trạng thái Check-in / Check-out.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  Filter,
  LogIn,
  LogOut,
  PlusCircle,
  Search,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { EmptyState, Skeleton } from '../../components/common/StateViews';
import { StatusBadge } from '../../components/common/StatusBadge';
import { bookingService } from '../../services/api';
import { Booking, BookingSource, BookingStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

export const BookingsListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [sourceFilter, setSourceFilter] = useState<BookingSource | 'ALL'>('ALL');

  useEffect(() => {
    bookingService.getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: BookingStatus) => {
    await bookingService.updateBookingStatus(id, newStatus);
    const updated = await bookingService.getBookings();
    setBookings(updated);
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (sourceFilter !== 'ALL' && b.source !== sourceFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchCode = b.bookingCode.toLowerCase().includes(q);
      const matchName = b.guestName.toLowerCase().includes(q);
      const matchPhone = b.guestPhone.includes(q);
      const matchRoom = b.roomNumber?.includes(q);
      if (!matchCode && !matchName && !matchPhone && !matchRoom) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.bookingsList')}</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Quản lý toàn bộ danh sách đặt phòng từ các kênh Web, App, Lễ tân và OTA
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            icon={<Download className="w-4 h-4" />}
            className="flex-1 sm:flex-initial justify-center"
          >
            <span className="truncate">Xuất Excel / In</span>
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => navigate('/staff/walk-in')}
            icon={<PlusCircle className="w-4 h-4" />}
            className="flex-1 sm:flex-initial justify-center font-bold"
          >
            <span className="truncate">+ Walk-in</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã, tên khách, SĐT, số phòng..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F5AA6]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          {/* Status filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#475569] font-semibold">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 bg-slate-50 font-semibold text-[#0F172A]"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="CONFIRMED">Đã xác nhận (Sắp đến)</option>
              <option value="CHECKED_IN">Đã nhận phòng (Đang ở)</option>
              <option value="CHECKED_OUT">Đã trả phòng</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>

          {/* Source filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#475569] font-semibold">Kênh đặt:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 bg-slate-50 font-semibold text-[#0F172A]"
            >
              <option value="ALL">Tất cả nguồn</option>
              <option value="WEB">Website trực tuyến</option>
              <option value="MOBILE">Ứng dụng Mobile</option>
              <option value="COUNTER">Tại quầy Lễ tân</option>
              <option value="OTA">Kênh OTA đối tác</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Mã đặt phòng</th>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Hạng / Phòng</th>
                <th className="py-3 px-4">Lưu trú</th>
                <th className="py-3 px-4">Đêm</th>
                <th className="py-3 px-4">Tổng tiền</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4">Kênh</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-4">
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    {/* Booking Code */}
                    <td className="py-3 px-4 font-mono font-bold text-[#1F5AA6]">
                      {b.bookingCode}
                    </td>

                    {/* Guest Name & Phone */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0F172A]">{b.guestName}</div>
                      <div className="text-[11px] text-[#475569] font-mono">{b.guestPhone}</div>
                    </td>

                    {/* Room Type & Room Number */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0F172A]">{b.roomTypeName}</div>
                      <div className="text-[11px] text-[#1F5AA6] font-bold">
                        {b.roomNumber ? `Phòng ${b.roomNumber}` : 'Chưa xếp phòng'}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-4">
                      <div>{formatDate(b.checkInDate)}</div>
                      <div className="text-[11px] text-slate-500">&rarr; {formatDate(b.checkOutDate)}</div>
                    </td>

                    {/* Nights */}
                    <td className="py-3 px-4 font-bold">{b.nights}</td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 font-extrabold text-[#0F172A] tabular-nums">
                      {formatCurrency(b.totalAmount)}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={b.status} type="booking" size="sm" />
                    </td>

                    {/* Source */}
                    <td className="py-3 px-4">
                      <StatusBadge status={b.source} type="source" size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/staff/bookings/${b.id}`)}
                          icon={<Eye className="w-3.5 h-3.5" />}
                          className="h-7 text-xs px-2"
                        >
                          Xem
                        </Button>

                        {b.status === 'CONFIRMED' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleUpdateStatus(b.id, 'CHECKED_IN')}
                            className="h-7 text-xs px-2 bg-[#1F5AA6]"
                          >
                            Check-in
                          </Button>
                        )}

                        {b.status === 'CHECKED_IN' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUpdateStatus(b.id, 'CHECKED_OUT')}
                            className="h-7 text-xs px-2 bg-amber-600 text-white hover:bg-amber-700"
                          >
                            Check-out
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    Không tìm thấy đơn đặt phòng nào phù hợp với điều kiện tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
