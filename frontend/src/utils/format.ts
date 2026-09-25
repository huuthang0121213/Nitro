/**
 * ============================================================================
 * TÊN FILE: format.ts
 * VỊ TRÍ: src/utils/format.ts
 * PHÂN HỆ: Tiện ích Định dạng Dữ liệu & Bản đồ Trạng thái (Formatting & Status Mapping)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Chứa các hàm chuyển đổi và định dạng dữ liệu hiển thị nhất quán trên toàn ứng dụng:
 *     + formatCurrency: Định dạng tiền tệ VND theo chuẩn Việt Nam (vi-VN) hoặc Quốc tế (en-US).
 *     + formatDate / formatDateTime: Chuẩn hóa hiển thị ngày tháng theo định dạng dd/MM/yyyy.
 *     + maskPhone / maskIdCard: Ẩn thông tin nhạy cảm của khách hàng (bảo mật dữ liệu cá nhân).
 * - Cung cấp bảng mã màu, biểu tượng và nhãn song ngữ cho các trạng thái:
 *     + BOOKING_STATUS_MAP: Trạng thái đặt phòng (Chờ xác nhận, Đã xác nhận, Đang ở, Đã trả phòng, Đã hủy).
 *     + ROOM_STATUS_MAP: Trạng thái phòng (Sẵn sàng, Đã đặt, Đang ở, Đang dọn dẹp, Bảo trì).
 * ============================================================================
 */

import { BookingSource, BookingStatus, RoomStatus } from '../types';

/**
 * Định dạng tiền tệ VND sang chuỗi có dấu phân cách hàng nghìn.
 * @param amount - Số tiền VND nguyên dương
 * @param language - Mã ngôn ngữ 'vi' hoặc 'en'
 */
export const formatCurrency = (amount: number, language: 'vi' | 'en' = 'vi'): string => {
  if (language === 'en') {
    return '₫' + amount.toLocaleString('en-US');
  }
  return amount.toLocaleString('vi-VN') + ' ₫';
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 7) return phone;
  const clean = phone.trim();
  return clean.slice(0, 3) + '****' + clean.slice(-3);
};

export const maskIdCard = (id: string): string => {
  if (!id || id.length < 6) return id;
  return id.slice(0, 3) + '******' + id.slice(-3);
};

export interface StatusConfig {
  labelVi: string;
  labelEn: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  dotColor: string;
  iconName: string;
}

export const BOOKING_STATUS_MAP: Record<BookingStatus, StatusConfig> = {
  PENDING: {
    labelVi: 'Đang giữ chỗ',
    labelEn: 'Pending',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    dotColor: 'bg-amber-500',
    iconName: 'Clock',
  },
  CONFIRMED: {
    labelVi: 'Đã xác nhận',
    labelEn: 'Confirmed',
    bgColor: 'bg-blue-50',
    textColor: 'text-[#1F5AA6]',
    borderColor: 'border-blue-200',
    dotColor: 'bg-[#1F5AA6]',
    iconName: 'CheckCircle',
  },
  CHECKED_IN: {
    labelVi: 'Đang lưu trú',
    labelEn: 'Checked-in',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    dotColor: 'bg-emerald-600',
    iconName: 'Key',
  },
  CHECKED_OUT: {
    labelVi: 'Đã trả phòng',
    labelEn: 'Checked-out',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-600',
    borderColor: 'border-slate-200',
    dotColor: 'bg-slate-400',
    iconName: 'LogOut',
  },
  CANCELLED: {
    labelVi: 'Đã hủy',
    labelEn: 'Cancelled',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
    dotColor: 'bg-rose-600',
    iconName: 'XCircle',
  },
  EXPIRED: {
    labelVi: 'Hết hạn giữ chỗ',
    labelEn: 'Expired',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-500',
    borderColor: 'border-gray-200',
    dotColor: 'bg-gray-400',
    iconName: 'TimerOff',
  },
  NO_SHOW: {
    labelVi: 'Không đến',
    labelEn: 'No-show',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    dotColor: 'bg-purple-600',
    iconName: 'UserX',
  },
};

export const ROOM_STATUS_MAP: Record<RoomStatus, {
  labelVi: string;
  labelEn: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  badgeBg: string;
}> = {
  AVAILABLE: {
    labelVi: 'Trống',
    labelEn: 'Available',
    bgColor: 'bg-[#DCFCE7]',
    textColor: 'text-emerald-800',
    borderColor: 'border-[#16A34A]',
    badgeBg: 'bg-[#DCFCE7] text-emerald-800 border-emerald-300',
  },
  RESERVED: {
    labelVi: 'Đã đặt',
    labelEn: 'Reserved',
    bgColor: 'bg-[#DBEAFE]',
    textColor: 'text-blue-800',
    borderColor: 'border-[#1F5AA6]',
    badgeBg: 'bg-[#DBEAFE] text-blue-800 border-blue-300',
  },
  OCCUPIED: {
    labelVi: 'Có khách',
    labelEn: 'Occupied',
    bgColor: 'bg-[#FFEDD5]',
    textColor: 'text-orange-800',
    borderColor: 'border-[#EA580C]',
    badgeBg: 'bg-[#FFEDD5] text-orange-800 border-orange-300',
  },
  CLEANING: {
    labelVi: 'Đang dọn',
    labelEn: 'Cleaning',
    bgColor: 'bg-[#FEF9C3]',
    textColor: 'text-yellow-800',
    borderColor: 'border-[#CA8A04]',
    badgeBg: 'bg-[#FEF9C3] text-yellow-800 border-yellow-300',
  },
  MAINTENANCE: {
    labelVi: 'Bảo trì',
    labelEn: 'Maintenance',
    bgColor: 'bg-[#E2E8F0]',
    textColor: 'text-slate-700',
    borderColor: 'border-[#64748B]',
    badgeBg: 'bg-[#E2E8F0] text-slate-700 border-slate-300',
  },
};

export const BOOKING_SOURCE_MAP: Record<BookingSource, {
  labelVi: string;
  labelEn: string;
  color: string;
  textColor: string;
  bgColor: string;
}> = {
  WEB: {
    labelVi: 'Web',
    labelEn: 'Web',
    color: '#1F5AA6',
    textColor: 'text-[#1F5AA6]',
    bgColor: 'bg-blue-50 border-blue-200 text-[#1F5AA6]',
  },
  MOBILE: {
    labelVi: 'Mobile App',
    labelEn: 'Mobile App',
    color: '#7C3AED',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200 text-purple-700',
  },
  COUNTER: {
    labelVi: 'Quầy',
    labelEn: 'Front Desk / Walk-in',
    color: '#EA580C',
    textColor: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200 text-orange-700',
  },
  OTA: {
    labelVi: 'Đại lý OTA',
    labelEn: 'Online Travel Agent',
    color: '#059669',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
};
