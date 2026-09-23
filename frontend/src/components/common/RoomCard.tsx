/**
 * ============================================================================
 * TÊN FILE: RoomCard.tsx
 * VỊ TRÍ: src/components/common/RoomCard.tsx
 * PHÂN HỆ: Thành phần Giao diện Dùng chung (Common UI Components)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Card hiển thị thông tin hạng phòng (Room Type) bao gồm:
 *     + Album ảnh chuyển đổi (Carousel hình ảnh) kèm badge "Chỉ còn X phòng".
 *     + Tên phòng song ngữ, diện tích m², số khách tối đa, cấu hình giường.
 *     + Danh sách tiện nghi nổi bật (Wi-Fi, Điều hòa, Bồn tắm nằm, Hủy miễn phí).
 *     + Giá phòng mỗi đêm và tổng chi phí theo số đêm đã chọn.
 *     + Nút điều hướng "Chi tiết" và nút CTA "Chọn phòng" vào luồng đặt.
 * - Tối ưu hóa Responsive cho Mobile & Tablet:
 *     + Trên điện thoại: Tự động đổi sang layout dọc (vertical), khu vực giá và nút bấm
 *       sắp xếp theo cột (`flex-col sm:flex-row`), nút bấm to rõ 100% chiều ngang,
 *       tuyệt đối không bị rớt chữ hoặc tràn viền.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Bath,
  BedDouble,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Users,
  Wifi,
  Wind,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { RoomType } from '../../types';
import { formatCurrency } from '../../utils/format';
import { Button } from './Button';

interface RoomCardProps {
  roomType: RoomType;
  nights?: number;
  availableCount?: number;
  onSelect?: (roomType: RoomType) => void;
  layout?: 'horizontal' | 'grid';
}

export const RoomCard: React.FC<RoomCardProps> = ({
  roomType,
  nights = 1,
  availableCount = 4,
  onSelect,
  layout = 'horizontal',
}) => {
  const { t } = useTranslation();
  const { language } = useApp();
  const navigate = useNavigate();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images = roomType.images?.length > 0 ? roomType.images : [roomType.image];
  const isEn = language === 'en';

  const totalPrice = roomType.basePrice * nights;

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(roomType);
    } else {
      navigate(`/rooms/${roomType.id}`);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex ${
        layout === 'horizontal' ? 'flex-col md:flex-row' : 'flex-col'
      }`}
    >
      {/* Photo carousel container */}
      <div
        className={`relative overflow-hidden bg-slate-100 shrink-0 group ${
          layout === 'horizontal'
            ? 'w-full md:w-[280px] lg:w-[360px] h-[220px] md:h-auto min-h-[220px]'
            : 'h-[220px] w-full'
        }`}
      >
        <img
          src={images[currentImgIndex]}
          alt={isEn ? roomType.nameEn : roomType.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge: only N left if <= 3 */}
        {availableCount <= 3 && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide">
            {t('search.onlyLeft', { count: availableCount })}
          </div>
        )}

        {/* Image navigation controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Ảnh trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Ảnh tiếp"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentImgIndex ? 'bg-white w-4' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Info container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3
                onClick={() => navigate(`/rooms/${roomType.id}`)}
                className="text-base sm:text-lg md:text-xl font-bold text-[#0F172A] hover:text-[#1F5AA6] transition cursor-pointer"
              >
                {isEn ? roomType.nameEn : roomType.name}
              </h3>
              <p className="text-xs text-[#475569] line-clamp-2 mt-1 leading-relaxed">
                {isEn ? roomType.descriptionEn : roomType.description}
              </p>
            </div>
          </div>

          {/* Key specs badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-2 sm:py-2.5 border-y border-[#E2E8F0] my-2.5 sm:my-3 text-xs text-[#475569]">
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-[#1F5AA6] shrink-0" />
              <span>{roomType.area} m²</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#1F5AA6] shrink-0" />
              <span>
                {roomType.maxGuests} {t('search.adults')}
              </span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 text-[#1F5AA6] shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {isEn ? roomType.bedTypeEn : roomType.bedType}
              </span>
            </div>
          </div>

          {/* Highlighted amenities */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              <Wifi className="w-3 h-3 text-[#1F5AA6]" /> Wi-Fi
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              <Wind className="w-3 h-3 text-[#1F5AA6]" /> Điều hòa
            </span>
            {roomType.code === 'DLX' && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                <Bath className="w-3 h-3 text-[#1F5AA6]" /> Bồn tắm
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              <Check className="w-3 h-3 text-emerald-600" /> {t('search.freeCancellation')}
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-3 border-t border-[#E2E8F0] gap-3">
          <div>
            <div className="text-[11px] text-[#94A3B8] uppercase font-semibold tracking-wider">
              {t('room.perNight')}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold text-[#1F5AA6] tabular-nums">
                {formatCurrency(roomType.basePrice, language)}
              </span>
            </div>
            {nights > 1 && (
              <div className="text-xs text-[#475569] font-medium mt-0.5">
                {t('room.totalPrice')}:{' '}
                <span className="font-bold text-slate-900 tabular-nums">
                  {formatCurrency(totalPrice, language)}
                </span>{' '}
                ({nights} {t('search.nights')})
              </div>
            )}
          </div>

          {/* Action buttons: on mobile full width grid, on sm flex */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/rooms/${roomType.id}`)}
              className="w-full sm:w-auto font-medium"
            >
              {t('room.details')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSelect}
              className="w-full sm:w-auto bg-[#1F5AA6] hover:bg-[#184A8A] font-bold"
            >
              {t('room.selectRoom')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
