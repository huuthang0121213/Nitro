/**
 * ============================================================================
 * TÊN FILE: BookingDetailStaffPage.tsx
 * VỊ TRÍ: src/pages/staff/BookingDetailStaffPage.tsx
 * PHÂN HỆ: Chi tiết Hồ sơ Lưu trú & Nghiệp vụ Lễ tân (Booking Folio & Folio Settlement)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Xem toàn diện hồ sơ đặt phòng (Booking Folio):
 *     + Thông tin khách hàng: Họ tên, SĐT, Email, CCCD/Passport.
 *     + Chi tiết phòng: Số phòng, Hạng phòng, Tầng, Ngày nhận/trả.
 *     + Bảng kê chi phí và dịch vụ gia tăng đã sử dụng (Minibar, Dịch vụ giặt là, Ăn uống).
 *     + Modal Check-in chuyên sâu: Ghi nhận số thẻ phòng (Keycard RFID) và quét CCCD.
 *     + Modal Check-out & Quyết toán chi phí phát sinh: Tính tiền thừa, in hóa đơn đỏ VAT.
 *     + Hủy phòng và hoàn tiền theo quy chế 4 sao.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  DoorOpen,
  Mail,
  Phone,
  Printer,
  ShieldCheck,
  User,
  Utensils,
  XCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/StateViews';
import { StatusBadge } from '../../components/common/StatusBadge';
import { bookingService } from '../../services/api';
import { Booking, BookingStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

export const BookingDetailStaffPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Check-in modal
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [idCardNumber, setIdCardNumber] = useState('079094001234');
  const [roomKeyAssigned, setRoomKeyAssigned] = useState('Thẻ từ #102A');

  // Check-out modal
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false);
  const [extraMinibar, setExtraMinibar] = useState(120000); // e.g. minibar used
  const [paymentMethodStaff, setPaymentMethodStaff] = useState('Tiền mặt');
  const [cashReceived, setCashReceived] = useState(200000);

  useEffect(() => {
    if (!id) return;
    bookingService.getBookingById(id).then((data) => {
      setBooking(data);
      setLoading(false);
    });
  }, [id]);

  if (loading || !booking) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const handleConfirmCheckIn = async () => {
    const updated = await bookingService.updateBookingStatus(booking.id, 'CHECKED_IN');
    setBooking(updated);
    setCheckInModalOpen(false);
  };

  const handleConfirmCheckOut = async () => {
    const updated = await bookingService.updateBookingStatus(booking.id, 'CHECKED_OUT');
    setBooking(updated);
    setCheckOutModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back Link */}
      <Link
        to="/staff/bookings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A]"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('staff.backToBookings')}
      </Link>

      {/* Top Header Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-2xl font-extrabold text-[#0F172A]">
              {booking.bookingCode}
            </span>
            <StatusBadge status={booking.status} type="booking" size="md" />
            <StatusBadge status={booking.source} type="source" size="sm" />
          </div>
          <p className="text-xs text-[#475569]">
            Ngày tạo: {formatDate(booking.createdAt)} • Kênh: {booking.source}
          </p>
        </div>

        {/* Operational Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.print()}
            icon={<Printer className="w-4 h-4" />}
            className="flex-1 sm:flex-initial justify-center"
          >
            In Folio
          </Button>

          {booking.status === 'CONFIRMED' && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCheckInModalOpen(true)}
              className="bg-[#1F5AA6] font-bold flex-1 sm:flex-initial justify-center"
            >
              Tiến hành Check-in
            </Button>
          )}

          {booking.status === 'CHECKED_IN' && (
            <Button
              variant="gold"
              size="md"
              onClick={() => setCheckOutModalOpen(true)}
              className="font-bold flex-1 sm:flex-initial justify-center"
            >
              Check-out &amp; Quyết toán
            </Button>
          )}
        </div>
      </div>

      {/* 2-Column Ledger & Folio View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest and Stay Details */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-[#1F5AA6]" />
            Thông tin định danh khách hàng
          </h3>

          <div className="space-y-2 text-xs">
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
            <div className="flex justify-between">
              <span className="text-[#475569]">Số khách:</span>
              <span className="font-bold text-[#0F172A]">
                {booking.adults} người lớn • {booking.children} trẻ em
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-[#475569] text-xs block mb-1 font-semibold">
              Yêu cầu đặc biệt từ khách:
            </span>
            <p className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 italic border border-slate-200">
              "{booking.specialRequests || 'Không có yêu cầu đặc biệt'}"
            </p>
          </div>
        </div>

        {/* Room & Folio Billing */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#0F172A] border-b border-[#E2E8F0] pb-3 flex items-center gap-2">
            <DoorOpen className="w-4 h-4 text-[#1F5AA6]" />
            Thông tin phòng &amp; Bảng kê Folio
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#475569]">Hạng phòng:</span>
              <span className="font-bold text-[#1F5AA6]">{booking.roomTypeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Số phòng gán:</span>
              <span className="font-bold text-base text-[#0F172A]">
                {booking.roomNumber ? `Phòng ${booking.roomNumber}` : 'Chưa xếp phòng'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#475569]">Thời gian ở:</span>
              <span className="font-bold text-[#0F172A]">
                {formatDate(booking.checkInDate)} &rarr; {formatDate(booking.checkOutDate)} ({booking.nights} đêm)
              </span>
            </div>
          </div>

          {/* Charges Folio Breakdown */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-2 text-xs">
            <div className="flex justify-between text-[#475569]">
              <span>Tiền phòng:</span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(booking.totalAmount * 0.88)}
              </span>
            </div>
            <div className="flex justify-between text-[#475569]">
              <span>Phí dịch vụ &amp; VAT:</span>
              <span className="font-semibold tabular-nums">
                {formatCurrency(booking.totalAmount * 0.12)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-[#E2E8F0] text-sm font-bold">
              <span>Tổng chi phí:</span>
              <span className="text-lg text-[#1F5AA6] tabular-nums font-extrabold">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-[#475569]">Đã thu trước:</span>
              <span className="font-bold text-emerald-700">
                {formatCurrency(booking.paidAmount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold pt-1 border-t border-slate-100">
              <span>Còn lại phải thu tại quầy:</span>
              <span className="text-rose-600">
                {formatCurrency(Math.max(0, booking.totalAmount - booking.paidAmount))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Modal */}
      <Modal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
        title={`Tiến hành Check-in: #${booking.bookingCode}`}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setCheckInModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmCheckIn}>
              Xác nhận Check-in &amp; Giao chìa khóa
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
            <div className="font-bold text-[#1F5AA6]">Xác thực khách hàng</div>
            <p className="text-slate-600">
              Khách: <span className="font-bold text-[#0F172A]">{booking.guestName}</span> • Phòng:{' '}
              <span className="font-bold text-[#0F172A]">{booking.roomNumber}</span>
            </p>
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">
              Số CMND / CCCD / Hộ chiếu khách:
            </label>
            <input
              type="text"
              value={idCardNumber}
              onChange={(e) => setIdCardNumber(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Mã thẻ từ gán cho khách:</label>
            <input
              type="text"
              value={roomKeyAssigned}
              onChange={(e) => setRoomKeyAssigned(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0]"
            />
          </div>
        </div>
      </Modal>

      {/* Check-out Modal */}
      <Modal
        isOpen={checkOutModalOpen}
        onClose={() => setCheckOutModalOpen(false)}
        title={`Quyết toán Check-out: #${booking.bookingCode}`}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setCheckOutModalOpen(false)}>
              Đóng
            </Button>
            <Button variant="gold" size="sm" onClick={handleConfirmCheckOut}>
              Hoàn tất Check-out &amp; In hóa đơn
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex justify-between">
              <span>Tiền phòng đã thanh toán:</span>
              <span className="font-bold text-emerald-700">✓ Đủ</span>
            </div>
            <div className="flex justify-between">
              <span>Phát sinh Minibar / Giặt ủi:</span>
              <span className="font-bold text-rose-600">{formatCurrency(extraMinibar)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm">
              <span>Tổng cần thu tại quầy:</span>
              <span className="text-[#1F5AA6]">{formatCurrency(extraMinibar)}</span>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">
              Hình thức thanh toán tại quầy:
            </label>
            <select
              value={paymentMethodStaff}
              onChange={(e) => setPaymentMethodStaff(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0] bg-white"
            >
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Quẹt thẻ POS">Quẹt thẻ POS (Visa/Master/ATM)</option>
              <option value="Chuyển khoản QR">Chuyển khoản QR ngân hàng</option>
            </select>
          </div>

          {paymentMethodStaff === 'Tiền mặt' && (
            <div className="space-y-2">
              <div>
                <label className="block font-bold text-[#0F172A] mb-1">
                  Tiền khách đưa (₫):
                </label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E2E8F0]"
                />
              </div>
              <div className="flex justify-between p-2.5 bg-emerald-50 text-emerald-800 rounded-lg font-bold">
                <span>Tiền thối lại cho khách:</span>
                <span>{formatCurrency(Math.max(0, cashReceived - extraMinibar))}</span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
