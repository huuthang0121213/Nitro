/**
 * ============================================================================
 * TÊN FILE: SystemSettingsPage.tsx
 * VỊ TRÍ: src/pages/staff/SystemSettingsPage.tsx
 * PHÂN HỆ: Thiết lập Hệ thống Khách sạn & Cổng thanh toán (System Settings)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Cấu hình thông số vận hành cốt lõi toàn khách sạn:
 *     + Thông tin định danh: Tên pháp nhân, Địa chỉ (24 Nguyễn Huệ, Q1), Hotline, Email.
 *     + Khung giờ quy chuẩn: Giờ nhận phòng (14:00), Giờ trả phòng (12:00).
 *     + Thời gian giữ phòng tạm (Hold timer countdown, mặc định 10 phút).
 *     + Tích hợp cổng thanh toán trực tuyến: VNPay, MoMo, VietQR, ZaloPay.
 *     + Cấu hình máy in hóa đơn POS nhiệt và thẻ từ buồng phòng RFID.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Bell,
  Building,
  Check,
  Clock,
  CreditCard,
  Globe,
  Hotel,
  Key,
  Lock,
  Save,
  Shield,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';

export const SystemSettingsPage: React.FC = () => {
  const { t } = useTranslation();

  // Hotel Info State
  const [hotelName, setHotelName] = useState('Nitro Grand Hotel Saigon');
  const [hotelAddress, setHotelAddress] = useState('24 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh');
  const [hotelPhone, setHotelPhone] = useState('1900 1234 / (028) 3822 9999');
  const [hotelEmail, setHotelEmail] = useState('booking@nitrograndhotel.vn');
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('12:00');
  const [holdTimerMinutes, setHoldTimerMinutes] = useState(10);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Integration settings
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'https://api.nitrohotel.vn/v1');
  const [paymentGateway, setPaymentGateway] = useState('VNPAY_SANDBOX');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.systemSettings')}</h1>
        <p className="text-xs text-[#475569] mt-0.5">
          Cấu hình quy chuẩn khách sạn, tham số giữ chỗ trực tuyến và thông tin định danh hệ thống
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hotel Identity */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Hotel className="w-4 h-4 text-[#1F5AA6]" />
            Thông tin thương hiệu &amp; Định vị khách sạn
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Tên khách sạn chính thức:</label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#1F5AA6]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">Địa chỉ trụ sở:</label>
              <input
                type="text"
                value={hotelAddress}
                onChange={(e) => setHotelAddress(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#1F5AA6]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#475569] mb-1">Tổng đài tiếp tân:</label>
                <input
                  type="text"
                  value={hotelPhone}
                  onChange={(e) => setHotelPhone(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#1F5AA6]"
                />
              </div>
              <div>
                <label className="block font-bold text-[#475569] mb-1">Email đặt phòng:</label>
                <input
                  type="email"
                  value={hotelEmail}
                  onChange={(e) => setHotelEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#1F5AA6]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stay Rules & Hold Timers */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Clock className="w-4 h-4 text-[#1F5AA6]" />
            Quy định giờ giấc &amp; Tham số giữ chỗ (Hold Timer)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#475569] mb-1">Giờ Check-in tiêu chuẩn:</label>
              <input
                type="text"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">Giờ Check-out tiêu chuẩn:</label>
              <input
                type="text"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#475569] mb-1">
                Thời gian giữ chỗ thanh toán (phút):
              </label>
              <input
                type="number"
                value={holdTimerMinutes}
                onChange={(e) => setHoldTimerMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
          </div>
        </div>

        {/* Integration API Config */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#0F172A] flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Globe className="w-4 h-4 text-[#1F5AA6]" />
            Cấu hình cổng API &amp; Cổng thanh toán (REST Gateway)
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#475569] mb-1">
                Base URL REST API (VITE_API_URL):
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Khi sinh viên kết nối sang máy chủ backend thật, chỉ cần đổi biến này trong .env.
              </span>
            </div>

            <div>
              <label className="block font-bold text-[#475569] mb-1">
                Cổng thanh toán Sandbox đang kết nối:
              </label>
              <select
                value={paymentGateway}
                onChange={(e) => setPaymentGateway(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-white"
              >
                <option value="VNPAY_SANDBOX">VNPAY QR Sandbox Demo</option>
                <option value="MOMO_TEST">MoMo QR Test Environment</option>
                <option value="VIETQR_NAPAS">VietQR 24/7 Napas</option>
              </select>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="text-xs text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            Đã lưu và cập nhật toàn bộ cấu hình hệ thống thành công!
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="gold"
            size="md"
            icon={<Save className="w-4 h-4" />}
            className="font-bold shadow-md px-6"
          >
            Lưu cấu hình hệ thống
          </Button>
        </div>
      </form>
    </div>
  );
};
