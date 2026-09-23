/**
 * ============================================================================
 * TÊN FILE: BookingDetailPage.tsx
 * VỊ TRÍ: src/pages/customer/BookingDetailPage.tsx
 * PHÂN HỆ: Cổng Khách hàng - Chi tiết & Biên nhận Đặt phòng (Customer Booking Voucher)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Xem chi tiết phiếu xác nhận đặt phòng dành cho khách hàng:
 *     1. Mã đặt chỗ PNR lớn kèm huy hiệu trạng thái (StatusBadge).
 *     2. Tiến trình lưu trú trực quan: Đã đặt -> Đã nhận phòng -> Đã trả phòng.
 *     3. Thẻ mã QR Check-in siêu tốc không chạm tại sảnh đón.
 *     4. Thông tin chi tiết phòng, thời gian nhận/trả phòng và chính sách khách sạn.
 *     5. Bóc tách hóa đơn thanh toán chi tiết.
 *     6. Nút In hóa đơn / Lưu PDF và Modal Hủy phòng kèm chính sách hoàn tiền 4 sao.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DoorOpen,
  Mail,
  MapPin,
  Phone,
  Printer,
  QrCode,
  ShieldAlert,
  User,
  XCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/StateViews';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useApp } from '../../context/AppContext';
import { bookingService } from '../../services/api';
import { Booking } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useApp();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Cancel Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Thay đổi lịch trình cá nhân');
  const [cancelNote, setCancelNote] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    bookingService.getBookingById(id).then((data) => {
      setBooking(data);
      setLoading(false);
    });
  }, [id]);

  if (loading || !booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const handleConfirmCancel = async () => {
    setCancelling(true);
    try {
      const updated = await bookingService.updateBookingStatus(
        booking.id,
        'CANCELLED',
        { cancellationReason: `${cancelReason}: ${cancelNote}` }
      );
      setBooking(updated);
      setCancelModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        to="/my-bookings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A]"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('booking.backToMyBookings')}
      </Link>

      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-xl font-extrabold text-[#0F172A]">
              {booking.bookingCode}
            </span>
            <StatusBadge status={booking.status} type="booking" size="md" />
          </div>
          <p className="text-xs text-[#475569]">
            Ngày tạo: {formatDate(booking.createdAt)} • Kênh: {booking.source}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-4 h-4" />}
            className="flex-1 sm:flex-initial justify-center"
          >
            In hóa đơn
          </Button>
          {booking.status === 'CONFIRMED' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 flex-1 sm:flex-initial justify-center"
            >
              Hủy đặt phòng
            </Button>
          )}
        </div>
      </div>

      {/* Booking Timeline Flow */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <h3 className="text-xs font-bold text-[#475569] uppercase tracking-wider mb-4">
          Tiến trình lưu trú
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-1">
              ✓
            </div>
            <span className="font-bold text-[#0F172A]">1. Đã đặt &amp; Thanh toán</span>
            <span className="text-[11px] text-[#94A3B8]">Xác nhận tức thì</span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                booking.status === 'CHECKED_IN' || booking.status === 'CHECKED_OUT'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              2
            </div>
            <span className="font-bold text-[#0F172A]">2. Nhận phòng (Check-in)</span>
            <span className="text-[11px] text-[#94A3B8]">
              {formatDate(booking.checkInDate)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${
                booking.status === 'CHECKED_OUT'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              3
            </div>
            <span className="font-bold text-[#0F172A]">3. Trả phòng (Check-out)</span>
            <span className="text-[11px] text-[#94A3B8]">
              {formatDate(booking.checkOutDate)}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Block 1: Room & Stay */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <DoorOpen className="w-4 h-4 text-[#1F5AA6]" />
            Thông tin phòng &amp; lưu trú
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#475569]">Loại phòng:</span>
              <span className="font-bold text-[#1F5AA6]">{booking.roomTypeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Số phòng:</span>
              <span className="font-bold text-[#0F172A]">
                {booking.roomNumber ? `Phòng ${booking.roomNumber}` : 'Sẽ xếp khi nhận phòng'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Thời gian nhận phòng:</span>
              <span className="font-bold text-[#0F172A]">
                {formatDate(booking.checkInDate)} (từ 14:00)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Thời gian trả phòng:</span>
              <span className="font-bold text-[#0F172A]">
                {formatDate(booking.checkOutDate)} (trước 12:00)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Số lượng khách:</span>
              <span className="font-bold text-[#0F172A]">
                {booking.adults} người lớn • {booking.children} trẻ em
              </span>
            </div>
          </div>
        </div>

        {/* Block 2: Guest Details */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <User className="w-4 h-4 text-[#1F5AA6]" />
            Thông tin khách hàng
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#475569]">Họ tên khách:</span>
              <span className="font-bold text-[#0F172A]">{booking.guestName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Số điện thoại:</span>
              <span className="font-mono text-[#0F172A]">{booking.guestPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Email:</span>
              <span className="text-[#0F172A]">{booking.guestEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Giờ đến dự kiến:</span>
              <span className="text-[#0F172A]">{booking.estimatedArrivalTime || '14:00'}</span>
            </div>
            {booking.specialRequests && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[#475569] block mb-1">Yêu cầu đặc biệt:</span>
                <p className="p-2 bg-slate-50 rounded-lg text-slate-700 italic">
                  "{booking.specialRequests}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Block 3: Billing Breakdown */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <CreditCard className="w-4 h-4 text-[#1F5AA6]" />
          Chi tiết thanh toán &amp; Hóa đơn
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-[#475569]">
            <span>Tiền phòng cơ bản ({booking.nights} đêm):</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(booking.totalAmount * 0.88, language)}
            </span>
          </div>

          {booking.extraServices && booking.extraServices.length > 0 && (
            <div className="space-y-1 pl-2 border-l-2 border-slate-200">
              {booking.extraServices.map((s) => (
                <div key={s.id} className="flex justify-between text-slate-600">
                  <span>+ {s.name}:</span>
                  <span className="tabular-nums">{formatCurrency(s.price, language)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between text-[#475569]">
            <span>Phí dịch vụ &amp; Thuế VAT:</span>
            <span className="font-semibold tabular-nums">
              {formatCurrency(booking.totalAmount * 0.12, language)}
            </span>
          </div>

          <div className="flex justify-between items-baseline pt-3 border-t border-[#E2E8F0] text-sm font-bold text-[#0F172A]">
            <span>Tổng cộng:</span>
            <span className="text-lg text-[#1F5AA6] tabular-nums font-extrabold">
              {formatCurrency(booking.totalAmount, language)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs font-semibold pt-1">
            <span className="text-[#475569]">Phương thức thanh toán:</span>
            <span className="text-[#0F172A]">{booking.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-[#475569]">Trạng thái thanh toán:</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              {booking.paymentStatus === 'PAID' ? 'Đã thanh toán đủ' : 'Thanh toán tại quầy'}
            </span>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title={
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
            <span>Hủy đặt phòng #{booking.bookingCode}</span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCancelModalOpen(false)}
            >
              Giữ lại đặt phòng
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Đang hủy...' : 'Xác nhận hủy đặt phòng'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#475569]">
            Bạn có chắc chắn muốn hủy đặt phòng này? Theo chính sách của Nitro Grand Hotel,
            đặt phòng được hủy miễn phí trước 48h kể từ thời điểm nhận phòng.
          </p>

          <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-emerald-800">
            <span className="font-bold">Số tiền hoàn lại dự kiến: </span>
            <span className="font-extrabold tabular-nums">
              {formatCurrency(booking.paidAmount, language)} (Hoàn 100%)
            </span>
            <p className="text-[11px] text-emerald-700 mt-1">
              Tiền sẽ được hoàn về tài khoản gốc trong vòng 3 - 5 ngày làm việc.
            </p>
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">
              Lý do hủy đặt phòng:
            </label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-white"
            >
              <option value="Thay đổi lịch trình cá nhân">Thay đổi lịch trình cá nhân</option>
              <option value="Bệnh đột xuất hoặc lý do y tế">Bệnh đột xuất hoặc lý do y tế</option>
              <option value="Tìm được phòng nghỉ khác phù hợp hơn">Tìm được phòng nghỉ khác phù hợp hơn</option>
              <option value="Khác">Lý do khác</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Ghi chú bổ sung (nếu có):</label>
            <textarea
              rows={2}
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
              placeholder="Nhập ghi chú thêm..."
              className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0]"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
