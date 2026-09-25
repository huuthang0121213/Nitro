/**
 * ============================================================================
 * TÊN FILE: DateRangePicker.tsx
 * VỊ TRÍ: src/components/common/DateRangePicker.tsx
 * PHÂN HỆ: Thành phần Giao diện Dùng chung (Common UI Components)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Cung cấp bộ chọn khoảng ngày nhận phòng (Check-in) và trả phòng (Check-out).
 * - Tự động tính toán số đêm lưu trú (Nights) và xác thực logic ngày (Check-out > Check-in).
 * - Tích hợp các phím tắt chọn nhanh tiện lợi:
 *     + Hôm nay - Ngày mai (1 đêm)
 *     + Cuối tuần này (Thứ 6 - Chủ nhật, 2 đêm)
 *     + Tuần tới (7 ngày tới)
 * - Tối ưu hóa giao diện Responsive:
 *     + Trên Mobile (< 640px): Popover tự động căn chỉnh `w-[calc(100vw-2rem)]`
 *       chống tràn mép màn hình, chữ ngày hiển thị gọn gàng, nút bấm to dễ chạm.
 *     + Trên Desktop: Căn chuẩn dropdown thẻ nổi bật với bóng đổ êm ái.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../utils/format';

interface DateRangePickerProps {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  onChange: (startDate: string, endDate: string, nights: number) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  const calculateNights = (start: string, end: string): number => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights(startDate, endDate);

  const handleApply = () => {
    const calculated = calculateNights(tempStart, tempEnd);
    onChange(tempStart, tempEnd, calculated);
    setIsOpen(false);
  };

  // Preset shortcut dates (Hôm nay - Ngày mai, Cuối tuần này)
  const setQuickDates = (daysFromNow: number, durationNights: number) => {
    const start = new Date();
    start.setDate(start.getDate() + daysFromNow);
    const end = new Date(start);
    end.setDate(end.getDate() + durationNights);

    const sStr = start.toISOString().slice(0, 10);
    const eStr = end.toISOString().slice(0, 10);
    setTempStart(sStr);
    setTempEnd(eStr);
    onChange(sStr, eStr, durationNights);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-left hover:border-[#1F5AA6] focus:outline-none focus:ring-2 focus:ring-[#1F5AA6]/20 transition-all min-h-[48px] cursor-pointer"
        aria-label="Chọn ngày nhận và trả phòng"
      >
        <div className="flex items-center gap-2.5 overflow-hidden w-full">
          <Calendar className="w-5 h-5 text-[#1F5AA6] shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#475569] uppercase tracking-wider truncate">
              {t('search.checkIn')} &rarr; {t('search.checkOut')}
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F172A] flex-wrap">
              <span className="whitespace-nowrap">{formatDate(startDate)}</span>
              <span className="text-slate-400">-</span>
              <span className="whitespace-nowrap">{formatDate(endDate)}</span>
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-[#EAF2FB] text-[#1F5AA6] font-bold whitespace-nowrap">
                {nights} {t('search.nights')}
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-[360px] bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
              <span className="font-bold text-sm text-[#0F172A]">
                {t('search.checkIn')} &amp; {t('search.checkOut')}
              </span>
              <span className="text-xs text-[#1F5AA6] font-bold bg-blue-50 px-2 py-0.5 rounded-full">
                {calculateNights(tempStart, tempEnd)} {t('search.nights')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  {t('search.checkIn')}
                </label>
                <input
                  type="date"
                  value={tempStart}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setTempStart(e.target.value)}
                  className="w-full text-xs font-semibold p-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5AA6]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#475569] mb-1">
                  {t('search.checkOut')}
                </label>
                <input
                  type="date"
                  value={tempEnd}
                  min={tempStart}
                  onChange={(e) => setTempEnd(e.target.value)}
                  className="w-full text-xs font-semibold p-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1F5AA6]"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
                Chọn nhanh tiện lợi:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuickDates(0, 1)}
                  className="px-2 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-left truncate transition"
                >
                  ⚡ Hôm nay (1 đêm)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDates(1, 1)}
                  className="px-2 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-left truncate transition"
                >
                  🌅 Ngày mai (1 đêm)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDates(5, 2)}
                  className="px-2 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-left truncate transition"
                >
                  🏖️ Cuối tuần này (2 đêm)
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDates(7, 3)}
                  className="px-2 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium text-left truncate transition"
                >
                  🌴 Tuần tới (3 đêm)
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-1.5 text-xs font-bold text-white bg-[#1F5AA6] hover:bg-[#184A8A] rounded-lg shadow-xs transition cursor-pointer"
              >
                Áp dụng ngày
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
