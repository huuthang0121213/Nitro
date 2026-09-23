/**
 * ============================================================================
 * TÊN FILE: WalkInBookingPage.tsx
 * VỊ TRÍ: src/pages/staff/WalkInBookingPage.tsx
 * PHÂN HỆ: Nghiệp vụ Tiếp đón Khách vãng lai tại Quầy (Front Desk Walk-in Booking)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Quy trình 3 bước tốc độ cao phục vụ khách vào trực tiếp không đặt trước:
 *     + Bước 1: Chọn phòng trống trực quan theo số phòng, tầng và hạng phòng.
 *     + Bước 2: Nhập nhanh CCCD / Passport, Họ tên, SĐT, số đêm lưu trú, số lượng khách.
 *     + Bước 3: Quyết toán thu tiền tại quầy (Tiền mặt + tính tiền thối tự động, Quẹt POS, hoặc Quét QR Chuyển khoản).
 *     + Tùy chọn: Tự động Check-in phòng ngay lập tức và phát hành thẻ phòng.
 * - Kết nối Backend REST API:
 *     + `POST /api/v1/bookings`: Tạo đơn đặt phòng mới kênh COUNTER.
 *     + `PATCH /api/v1/rooms/:id/status`: Đổi trạng thái phòng sang OCCUPIED.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  CreditCard,
  DollarSign,
  DoorOpen,
  PlusCircle,
  QrCode,
  Search,
  User,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { bookingService, roomService } from '../../services/api';
import { Room, RoomType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

export const WalkInBookingPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);

  // Selected state
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [nights, setNights] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Guest details
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [idCard, setIdCard] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'POS' | 'TRANSFER'>('CASH');
  const [cashGiven, setCashGiven] = useState(2000000);
  const [autoCheckIn, setAutoCheckIn] = useState(true);

  useEffect(() => {
    Promise.all([roomService.getRooms(), roomService.getRoomTypes()]).then(
      ([rData, rtData]) => {
        const available = rData.filter((r) => r.status === 'AVAILABLE');
        setRooms(available);
        setRoomTypes(rtData);

        // Pre-select if URL params passed
        const paramRoomId = searchParams.get('roomId');
        if (paramRoomId) {
          const match = available.find((r) => r.id === paramRoomId);
          if (match) setSelectedRoom(match);
        }
      }
    );
  }, [searchParams]);

  const matchedRoomType = selectedRoom
    ? roomTypes.find((rt) => rt.id === selectedRoom.roomTypeId)
    : null;

  const basePrice = matchedRoomType?.basePrice || 1200000;
  const totalAmount = basePrice * nights;
  const changeDue = Math.max(0, cashGiven - totalAmount);

  const handleCompleteWalkIn = async () => {
    if (!selectedRoom) return;

    await bookingService.createBooking({
      roomTypeId: selectedRoom.roomTypeId,
      roomTypeName: selectedRoom.roomTypeName,
      roomNumber: selectedRoom.roomNumber,
      checkInDate: new Date().toISOString().slice(0, 10),
      checkOutDate: new Date(Date.now() + nights * 86400000).toISOString().slice(0, 10),
      nights,
      adults,
      children,
      guestName: guestName || 'Khách vãng lai',
      guestPhone: guestPhone || '0900000000',
      guestEmail: guestEmail || 'khach@nitrohotel.vn',
      totalAmount,
      paidAmount: totalAmount,
      paymentMethod: paymentMethod === 'CASH' ? 'TIEN_MAT' : paymentMethod === 'POS' ? 'THE_POS' : 'CHUYEN_KHOAN',
      status: autoCheckIn ? 'CHECKED_IN' : 'CONFIRMED',
      source: 'COUNTER',
    });

    // Update room status to OCCUPIED
    await roomService.updateRoomStatus(selectedRoom.id, autoCheckIn ? 'OCCUPIED' : 'RESERVED');

    navigate('/staff/overview');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        to="/staff/overview"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A]"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('staff.backToOverview')}
      </Link>

      {/* Header & Stepper */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">
              Đặt phòng trực tiếp tại quầy (Walk-in)
            </h1>
            <p className="text-xs text-[#475569] mt-0.5">
              Quy trình nhanh 3 bước dành cho nhân viên Lễ tân nhận khách vãng lai
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">
            Kênh: Tại quầy (COUNTER)
          </span>
        </div>

        {/* 3 Step Indicators */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0] text-xs font-semibold">
          <div
            className={`p-2.5 rounded-xl border flex items-center gap-2 ${
              step === 1
                ? 'border-[#1F5AA6] bg-blue-50/50 text-[#1F5AA6]'
                : step > 1
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[11px] font-bold shrink-0">
              {step > 1 ? '✓' : '1'}
            </span>
            <span className="truncate">1. Chọn phòng trống</span>
          </div>

          <div
            className={`p-2.5 rounded-xl border flex items-center gap-2 ${
              step === 2
                ? 'border-[#1F5AA6] bg-blue-50/50 text-[#1F5AA6]'
                : step > 2
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[11px] font-bold shrink-0">
              {step > 2 ? '✓' : '2'}
            </span>
            <span className="truncate">2. Thông tin khách</span>
          </div>

          <div
            className={`p-2.5 rounded-xl border flex items-center gap-2 ${
              step === 3
                ? 'border-[#1F5AA6] bg-blue-50/50 text-[#1F5AA6]'
                : 'border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-current text-white flex items-center justify-center text-[11px] font-bold shrink-0">
              3
            </span>
            <span className="truncate">3. Thanh toán &amp; Nhận phòng</span>
          </div>
        </div>
      </div>

      {/* Step 1: Select Available Room */}
      {step === 1 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#0F172A]">
              Chọn phòng còn trống ({rooms.length} phòng sẵn sàng)
            </h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Số đêm:</span>
              <input
                type="number"
                min={1}
                max={30}
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-16 p-1 border rounded text-center font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {rooms.map((room) => {
              const isSelected = selectedRoom?.id === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition text-center space-y-1 ${
                    isSelected
                      ? 'border-[#1F5AA6] bg-blue-50 ring-2 ring-[#1F5AA6]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-mono font-extrabold text-base text-[#0F172A]">
                    {room.roomNumber}
                  </div>
                  <div className="text-[10px] font-bold text-[#1F5AA6] uppercase">
                    {room.roomTypeCode}
                  </div>
                  <div className="text-[10px] text-slate-500">Tầng {room.floor}</div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
            <Button
              variant="primary"
              size="md"
              disabled={!selectedRoom}
              onClick={() => setStep(2)}
            >
              Tiếp tục nhập thông tin khách &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Guest Details */}
      {step === 2 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#0F172A]">Thông tin khách lưu trú</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#475569] mb-1">
                Họ và tên khách hàng *
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="VD: Trần Văn Bình"
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Số điện thoại *</label>
              <input
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="0912345678"
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Số CCCD / Hộ chiếu *</label>
              <input
                type="text"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                placeholder="07909400xxxx"
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Email (nếu có)</label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="khach@example.com"
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-between">
            <Button variant="outline" size="md" onClick={() => setStep(1)}>
              &larr; Chọn lại phòng
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={!guestName.trim()}
              onClick={() => setStep(3)}
            >
              Tiến hành thanh toán &rarr;
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Payment & Instant Check-in */}
      {step === 3 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-[#0F172A]">Thanh toán &amp; Nhận phòng</h2>

          {/* Booking recap */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span>Phòng đã chọn:</span>
              <span className="font-bold text-[#1F5AA6]">
                Phòng {selectedRoom?.roomNumber} ({selectedRoom?.roomTypeName})
              </span>
            </div>
            <div className="flex justify-between">
              <span>Khách hàng:</span>
              <span className="font-bold">{guestName} ({guestPhone})</span>
            </div>
            <div className="flex justify-between">
              <span>Thời gian ở:</span>
              <span className="font-bold">{nights} đêm</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold">
              <span>Tổng tiền thu tại quầy:</span>
              <span className="text-xl text-[#1F5AA6] tabular-nums font-extrabold">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#0F172A]">
              Hình thức thu tiền tại quầy:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'CASH', label: 'Tiền mặt' },
                { id: 'POS', label: 'Quẹt thẻ POS' },
                { id: 'TRANSFER', label: 'Chuyển khoản QR' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                    paymentMethod === m.id
                      ? 'border-[#1F5AA6] bg-blue-50 text-[#1F5AA6]'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {paymentMethod === 'CASH' && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[#475569]">
                  Tiền khách đưa (₫):
                </label>
                <input
                  type="number"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(Number(e.target.value))}
                  className="w-full text-sm p-2.5 rounded-lg border border-[#E2E8F0]"
                />
                <div className="flex justify-between p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold">
                  <span>Tiền thối lại khách:</span>
                  <span>{formatCurrency(changeDue)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Check-in checkbox */}
          <div className="pt-2 border-t border-[#E2E8F0]">
            <label className="flex items-center gap-2 text-xs font-bold text-[#0F172A] cursor-pointer">
              <input
                type="checkbox"
                checked={autoCheckIn}
                onChange={(e) => setAutoCheckIn(e.target.checked)}
                className="rounded text-[#1F5AA6] focus:ring-[#1F5AA6]"
              />
              <span>Tự động Check-in phòng ngay sau khi lưu</span>
            </label>
          </div>

          {/* Final Submit */}
          <div className="pt-4 border-t border-[#E2E8F0] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => setStep(2)}
              className="w-full sm:w-auto text-center justify-center"
            >
              &larr; Quay lại thông tin
            </Button>
            <Button
              variant="gold"
              size="lg"
              onClick={handleCompleteWalkIn}
              className="w-full sm:w-auto font-bold shadow-md px-8 py-3 text-center justify-center"
            >
              Hoàn tất &amp; Giao phòng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
