/**
 * ============================================================================
 * TÊN FILE: SearchResultsPage.tsx
 * VỊ TRÍ: src/pages/customer/SearchResultsPage.tsx
 * PHÂN HỆ: Cổng Thông tin Khách hàng (Room Search & Availability Results)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Trang tìm kiếm và lọc phòng lưu trú trực tuyến của khách:
 *     1. Thanh tìm kiếm nhanh: Đồng bộ thời gian thực khoảng ngày lưu trú và số lượng khách.
 *     2. Bộ lọc đa tiêu chí (Filter Sidebar trên Desktop, Drawer trượt trên Smartphone/Tablet):
 *        Lọc theo khoảng giá tối đa, hạng phòng (STD, SUP, DLX, STE), tiện ích (Bữa sáng, Ban công, Bồn tắm).
 *     3. Sắp xếp thông minh: Giá tăng/giảm dần, diện tích phòng lớn nhất, độ phổ biến.
 *     4. Danh sách thẻ RoomCard tương tác (xem ảnh, chi tiết, chuyển sang bước Đặt phòng).
 * - Kết nối Backend REST API:
 *     + `GET /api/v1/rooms/search?checkIn=...&checkOut=...&guests=...`: Tra cứu phòng trống theo thời gian thực.
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  ChevronDown,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { DateRangePicker } from '../../components/common/DateRangePicker';
import { GuestCounter } from '../../components/common/GuestCounter';
import { RoomCard } from '../../components/common/RoomCard';
import { EmptyState, Skeleton } from '../../components/common/StateViews';
import { useApp } from '../../context/AppContext';
import { roomService } from '../../services/api';
import { RoomType } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

export const SearchResultsPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search URL query params
  const checkInParam = searchParams.get('checkIn') || new Date().toISOString().slice(0, 10);
  const checkOutParam =
    searchParams.get('checkOut') ||
    new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const adultsParam = parseInt(searchParams.get('adults') || '2', 10);
  const childrenParam = parseInt(searchParams.get('children') || '0', 10);
  const roomsParam = parseInt(searchParams.get('rooms') || '1', 10);

  const [startDate, setStartDate] = useState(checkInParam);
  const [endDate, setEndDate] = useState(checkOutParam);
  const [adults, setAdults] = useState(adultsParam);
  const [childrenCount, setChildrenCount] = useState(childrenParam);
  const [roomsCount, setRoomsCount] = useState(roomsParam);

  const [allRoomTypes, setAllRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [maxPrice, setMaxPrice] = useState<number>(6000000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [freeCancellationOnly, setFreeCancellationOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'area' | 'popular'>('popular');

  // Calculate nights
  const nights = useMemo(() => {
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [startDate, endDate]);

  useEffect(() => {
    setLoading(true);
    roomService.getRoomTypes().then((data) => {
      setAllRoomTypes(data);
      setLoading(false);
    });
  }, []);

  const handleUpdateSearchParams = (newStart: string, newEnd: string) => {
    setStartDate(newStart);
    setEndDate(newEnd);
    setSearchParams({
      checkIn: newStart,
      checkOut: newEnd,
      adults: String(adults),
      children: String(childrenCount),
      rooms: String(roomsCount),
    });
  };

  const handleClearFilters = () => {
    setMaxPrice(6000000);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setFreeCancellationOnly(false);
    setSortBy('popular');
  };

  // Filter and sort room types
  const filteredRooms = useMemo(() => {
    return allRoomTypes
      .filter((room) => {
        // Price filter
        if (room.basePrice > maxPrice) return false;
        // Room type filter
        if (selectedTypes.length > 0 && !selectedTypes.includes(room.code)) {
          return false;
        }
        // Guest capacity check
        if ((room.maxGuests || 2) < adults) return false;
        // Amenities filter
        if (selectedAmenities.length > 0) {
          const hasAll = selectedAmenities.every((amenity) =>
            room.amenities.some((a) => a.toLowerCase().includes(amenity.toLowerCase()))
          );
          if (!hasAll) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.basePrice - b.basePrice;
        if (sortBy === 'price_desc') return b.basePrice - a.basePrice;
        if (sortBy === 'area') return b.area - a.area;
        return 0; // popular default
      });
  }, [allRoomTypes, maxPrice, selectedTypes, selectedAmenities, adults, sortBy]);

  const amenityOptions = [
    { label: 'Wi-Fi', value: 'wi-fi' },
    { label: 'Bữa sáng buffet', value: 'bữa sáng' },
    { label: 'Bồn tắm', value: 'bồn tắm' },
    { label: 'Ban công', value: 'ban công' },
    { label: 'View thành phố', value: 'view' },
    { label: 'Xe đưa đón', value: 'đưa đón' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Sticky Search Header Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="w-full lg:w-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={(s, e) => handleUpdateSearchParams(s, e)}
            />
            <GuestCounter
              adults={adults}
              childrenCount={childrenCount}
              rooms={roomsCount}
              onChange={(a, c, r) => {
                setAdults(a);
                setChildrenCount(c);
                setRoomsCount(r);
              }}
            />
          </div>

          <div className="w-full lg:w-auto flex items-center justify-between sm:justify-end gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
            <div className="text-xs text-[#475569]">
              <span className="font-bold text-base text-[#1F5AA6] mr-1">
                {filteredRooms.length}
              </span>
              {t('search.resultsFound', { count: filteredRooms.length })}
            </div>

            {/* Mobile Filter Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden"
              icon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Bộ lọc
            </Button>
          </div>
        </div>
      </div>

      {/* Applied Filter Chips */}
      {(selectedTypes.length > 0 || selectedAmenities.length > 0 || maxPrice < 6000000) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#475569] font-semibold">Đang áp dụng:</span>
          {maxPrice < 6000000 && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#EAF2FB] text-[#1F5AA6] px-2.5 py-1 rounded-full font-medium">
              &le; {formatCurrency(maxPrice, language)}
              <button
                onClick={() => setMaxPrice(6000000)}
                className="hover:text-blue-900"
                aria-label="Xóa lọc giá"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedTypes.map((code) => (
            <span
              key={code}
              className="inline-flex items-center gap-1 text-xs bg-[#EAF2FB] text-[#1F5AA6] px-2.5 py-1 rounded-full font-medium"
            >
              Loại: {code}
              <button
                onClick={() => setSelectedTypes(selectedTypes.filter((t) => t !== code))}
                className="hover:text-blue-900"
                aria-label={`Xóa loại ${code}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {selectedAmenities.map((am) => (
            <span
              key={am}
              className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-medium"
            >
              {am}
              <button
                onClick={() => setSelectedAmenities(selectedAmenities.filter((a) => a !== am))}
                className="hover:text-slate-900"
                aria-label={`Xóa tiện nghi ${am}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={handleClearFilters}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold underline ml-2 cursor-pointer"
          >
            {t('search.clearFilter')}
          </button>
        </div>
      )}

      {/* Main Grid: Filters Sidebar + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filter Sidebar (Desktop) */}
        <aside className="hidden lg:block bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-6 self-start sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <span className="font-bold text-sm text-[#0F172A] flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#1F5AA6]" />
              Bộ lọc tìm kiếm
            </span>
            <button
              onClick={handleClearFilters}
              className="text-xs text-[#1F5AA6] hover:underline font-semibold cursor-pointer"
            >
              {t('search.clearFilter')}
            </button>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-[#0F172A] mb-2">
              <span>{t('search.priceRange')}</span>
              <span className="text-[#1F5AA6] font-bold tabular-nums">
                {formatCurrency(maxPrice, language)}
              </span>
            </div>
            <input
              type="range"
              min="850000"
              max="6000000"
              step="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1F5AA6]"
            />
            <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1">
              <span>850.000 ₫</span>
              <span>6.000.000 ₫</span>
            </div>
          </div>

          {/* Room Types */}
          <div className="border-t border-[#E2E8F0] pt-4">
            <span className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">
              {t('search.roomType')}
            </span>
            <div className="space-y-2">
              {['STD', 'SUP', 'DLX', 'FAM', 'EXE', 'PRE'].map((code) => {
                const checked = selectedTypes.includes(code);
                return (
                  <label
                    key={code}
                    className="flex items-center justify-between text-xs text-[#475569] hover:text-[#0F172A] cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          if (checked) {
                            setSelectedTypes(selectedTypes.filter((t) => t !== code));
                          } else {
                            setSelectedTypes([...selectedTypes, code]);
                          }
                        }}
                        className="rounded border-[#E2E8F0] text-[#1F5AA6] focus:ring-[#1F5AA6]"
                      />
                      <span>{code} — {allRoomTypes.find((r) => r.code === code)?.name}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Amenities */}
          <div className="border-t border-[#E2E8F0] pt-4">
            <span className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2.5">
              {t('search.amenities')}
            </span>
            <div className="space-y-2">
              {amenityOptions.map((opt) => {
                const checked = selectedAmenities.includes(opt.value);
                return (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 text-xs text-[#475569] hover:text-[#0F172A] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          setSelectedAmenities(selectedAmenities.filter((a) => a !== opt.value));
                        } else {
                          setSelectedAmenities([...selectedAmenities, opt.value]);
                        }
                      }}
                      className="rounded border-[#E2E8F0] text-[#1F5AA6] focus:ring-[#1F5AA6]"
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Results Column */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sorting Bar */}
          <div className="flex items-center justify-between bg-white border border-[#E2E8F0] px-4 py-2.5 rounded-xl shadow-xs">
            <span className="text-xs text-[#475569] font-medium hidden sm:inline">
              Hiển thị kết quả tốt nhất:
            </span>

            <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-[#475569] font-semibold">{t('search.sort')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#0F172A] bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#1F5AA6]"
              >
                <option value="popular">{t('search.sortPopular')}</option>
                <option value="price_asc">{t('search.sortPriceLow')}</option>
                <option value="price_desc">{t('search.sortPriceHigh')}</option>
                <option value="area">{t('search.sortArea')}</option>
              </select>
            </div>
          </div>

          {/* List of Rooms */}
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="space-y-4">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  roomType={room}
                  nights={nights}
                  availableCount={room.code === 'PRE' ? 2 : room.code === 'EXE' ? 3 : 5}
                  onSelect={(rt) => {
                    navigate(`/rooms/${rt.id}?checkIn=${startDate}&checkOut=${endDate}&adults=${adults}&children=${childrenCount}`);
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('search.noResults')}
              description={t('search.noResultsDesc')}
              actionText="Xóa tất cả bộ lọc"
              onAction={handleClearFilters}
            />
          )}

          {/* Nearby Date Suggestion Card if 0 or 1 result */}
          {filteredRooms.length <= 1 && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                {t('search.tryNearbyDates')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-amber-200">
                  <div>
                    <div className="font-bold text-[#0F172A]">25/09 - 27/09 (Cuối tuần)</div>
                    <div className="text-emerald-700 font-medium">Từ 1.050.000 ₫ • 4 phòng trống</div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUpdateSearchParams('2026-09-25', '2026-09-27')}
                  >
                    {t('search.viewDate')}
                  </Button>
                </div>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-amber-200">
                  <div>
                    <div className="font-bold text-[#0F172A]">28/09 - 30/09 (Đầu tuần)</div>
                    <div className="text-emerald-700 font-medium">Từ 850.000 ₫ • 7 phòng trống</div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUpdateSearchParams('2026-09-28', '2026-09-30')}
                  >
                    {t('search.viewDate')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <span className="font-bold text-sm text-[#0F172A]">Bộ lọc tìm kiếm</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <span className="block text-xs font-bold text-[#0F172A] mb-2">
                  Khoảng giá tối đa: {formatCurrency(maxPrice, language)}
                </span>
                <input
                  type="range"
                  min="850000"
                  max="6000000"
                  step="100000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1F5AA6]"
                />
              </div>

              <div className="border-t border-[#E2E8F0] pt-3">
                <span className="block text-xs font-bold text-[#0F172A] mb-2">Loại phòng</span>
                {['STD', 'SUP', 'DLX', 'FAM', 'EXE', 'PRE'].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-xs py-1 text-[#475569]">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(c)}
                      onChange={() => {
                        if (selectedTypes.includes(c)) {
                          setSelectedTypes(selectedTypes.filter((t) => t !== c));
                        } else {
                          setSelectedTypes([...selectedTypes, c]);
                        }
                      }}
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-1/2"
                onClick={handleClearFilters}
              >
                Xóa lọc
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="w-1/2"
                onClick={() => setMobileFilterOpen(false)}
              >
                Áp dụng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
