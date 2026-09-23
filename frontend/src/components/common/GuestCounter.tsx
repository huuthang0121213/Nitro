/**
 * ============================================================================
 * TÊN FILE: GuestCounter.tsx
 * VỊ TRÍ: src/components/common/GuestCounter.tsx
 * PHÂN HỆ: Thành phần Giao diện Dùng chung (Common UI Components)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Cho phép khách hàng hoặc nhân viên lễ tân tùy chỉnh số lượng Người lớn (Adults),
 *   Trẻ em (Children) và Số lượng phòng cần đặt (Rooms).
 * - Kiểm soát giới hạn hợp lệ (tối thiểu 1 người lớn, 1 phòng, không âm số trẻ em).
 * - Tối ưu hóa trên Smartphone: Popover tự co giãn theo chiều rộng màn hình,
 *   các nút bấm tăng/giảm đạt kích thước chuẩn ngón tay bấm (touch target 40px+).
 * ============================================================================
 */

import React, { useState } from 'react';
import { Minus, Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GuestCounterProps {
  adults: number;
  childrenCount: number;
  rooms: number;
  onChange: (adults: number, children: number, rooms: number) => void;
  className?: string;
}

export const GuestCounter: React.FC<GuestCounterProps> = ({
  adults,
  childrenCount,
  rooms,
  onChange,
  className = '',
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleAdultChange = (delta: number) => {
    const next = Math.max(1, adults + delta);
    onChange(next, childrenCount, rooms);
  };

  const handleChildChange = (delta: number) => {
    const next = Math.max(0, childrenCount + delta);
    onChange(adults, next, rooms);
  };

  const handleRoomChange = (delta: number) => {
    const next = Math.max(1, rooms + delta);
    onChange(adults, childrenCount, next);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-left hover:border-[#1F5AA6] focus:outline-none focus:ring-2 focus:ring-[#1F5AA6]/20 transition-all min-h-[48px] cursor-pointer"
        aria-label="Chọn số lượng khách và phòng"
      >
        <div className="flex items-center gap-2.5 overflow-hidden w-full">
          <Users className="w-5 h-5 text-[#1F5AA6] shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[10px] sm:text-[11px] font-bold text-[#475569] uppercase tracking-wider truncate">
              {t('search.guests')}
            </span>
            <div className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate">
              {adults} {t('search.adults')}
              {childrenCount > 0 ? `, ${childrenCount} ${t('search.children')}` : ''}
              {` • ${rooms} ${t('search.rooms')}`}
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
          <div className="absolute left-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-[320px] bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#0F172A]">
                    {t('search.adults')}
                  </div>
                  <div className="text-xs text-[#94A3B8]">Từ 13 tuổi trở lên</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={adults <= 1}
                    onClick={() => handleAdultChange(-1)}
                    className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer active:scale-95"
                    aria-label="Giảm người lớn"
                  >
                    <Minus className="w-4 h-4 text-slate-700" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-[#0F172A]">
                    {adults}
                  </span>
                  <button
                    type="button"
                    disabled={adults >= 10}
                    onClick={() => handleAdultChange(1)}
                    className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer active:scale-95"
                    aria-label="Tăng người lớn"
                  >
                    <Plus className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <div className="text-sm font-bold text-[#0F172A]">
                    {t('search.children')}
                  </div>
                  <div className="text-xs text-[#94A3B8]">Từ 0 - 12 tuổi</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={childrenCount <= 0}
                    onClick={() => handleChildChange(-1)}
                    className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer active:scale-95"
                    aria-label="Giảm trẻ em"
                  >
                    <Minus className="w-4 h-4 text-slate-700" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-[#0F172A]">
                    {childrenCount}
                  </span>
                  <button
                    type="button"
                    disabled={childrenCount >= 6}
                    onClick={() => handleChildChange(1)}
                    className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer active:scale-95"
                    aria-label="Tăng trẻ em"
                  >
                    <Plus className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>

              {/* Rooms */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div>
                  <div className="text-sm font-bold text-[#0F172A]">
                    {t('search.rooms')}
                  </div>
                  <div className="text-xs text-[#94A3B8]">Số phòng yêu cầu</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={rooms <= 1}
                    onClick={() => handleRoomChange(-1)}
                    className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer active:scale-95"
                    aria-label="Giảm số phòng"
                  >
                    <Minus className="w-4 h-4 text-slate-700" />
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-[#0F172A]">
                    {rooms}
                  </span>
                  <button
                    type="button"
                    disabled={rooms >= 5}
                    onClick={() => handleRoomChange(1)}
                    className="w-9 h-9 rounded-full border border-[#E2E8F0] flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer active:scale-95"
                    aria-label="Tăng số phòng"
                  >
                    <Plus className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-white bg-[#1F5AA6] hover:bg-[#184A8A] rounded-lg transition cursor-pointer"
              >
                Xong
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
