/**
 * ============================================================================
 * TÊN FILE: BookingTimelinePage.tsx
 * VỊ TRÍ: src/pages/staff/BookingTimelinePage.tsx
 * PHÂN HỆ: Lịch Đặt phòng Trực quan (Gantt Chart Room Timeline)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Biểu diễn lịch trình chiếm phòng theo sơ đồ Gantt trực quan:
 *     + Trục tung (Y-axis): Danh sách 60 phòng được cố định (Sticky left column).
 *     + Trục hoành (X-axis): Các mốc ngày tương lai (tùy chọn cửa sổ 7 ngày, 14 ngày hoặc 30 ngày).
 *     + Khối thanh dài thể hiện khoảng lưu trú (Check-in đến Check-out) kèm tên khách, mã PNR.
 *     + Nhận biết ngày cuối tuần, ngày hiện tại (Today highlight màu xanh dương).
 *     + Nhấp vào ô phòng trống để khởi tạo đơn Walk-in tức thì.
 * - Kết nối Backend REST API:
 *     + `GET /api/v1/rooms`: Lấy danh sách phòng.
 *     + `GET /api/v1/bookings`: Lấy các khoảng đặt phòng tương ứng.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorOpen,
  PlusCircle,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { bookingService, roomService } from '../../services/api';
import { Booking, Room } from '../../types';
import { formatDate } from '../../utils/format';

export const BookingTimelinePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [daysCount, setDaysCount] = useState<7 | 14 | 30>(14);

  // Current view window start date
  const [startDate, setStartDate] = useState(new Date('2026-09-20'));

  useEffect(() => {
    Promise.all([roomService.getRooms(), bookingService.getBookings()]).then(
      ([rData, bData]) => {
        setRooms(rData.slice(0, 18)); // Show 18 rooms for comfortable timeline scroll
        setBookings(bData);
      }
    );
  }, []);

  // Generate date array
  const dateColumns: Date[] = [];
  for (let i = 0; i < daysCount; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dateColumns.push(d);
  }

  const handlePrev = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() - daysCount);
    setStartDate(d);
  };

  const handleNext = () => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + daysCount);
    setStartDate(d);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.roomTimeline')}</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Lịch đặt phòng trực quan dạng sơ đồ Gantt theo phòng và ngày
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Days toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {[7, 14, 30].map((num) => (
              <button
                key={num}
                onClick={() => setDaysCount(num as any)}
                className={`px-3 py-1 rounded-lg transition ${
                  daysCount === num ? 'bg-white text-[#1F5AA6] shadow-xs' : 'text-slate-600'
                }`}
              >
                {num} ngày
              </button>
            ))}
          </div>

          <Button
            variant="gold"
            size="sm"
            onClick={() => navigate('/staff/walk-in')}
            icon={<PlusCircle className="w-4 h-4" />}
          >
            + Walk-in
          </Button>
        </div>
      </div>

      {/* Date Navigation & Controls */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
            aria-label="Lùi ngày"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-[#0F172A]">
            {dateColumns[0]?.toLocaleDateString('vi-VN')} &mdash;{' '}
            {dateColumns[dateColumns.length - 1]?.toLocaleDateString('vi-VN')}
          </span>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
            aria-label="Tiến ngày"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setStartDate(new Date('2026-09-20'))}
          className="text-xs font-semibold text-[#1F5AA6] hover:underline"
        >
          Hôm nay
        </button>
      </div>

      {/* Gantt Timeline Board */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-[#E2E8F0]">
                <th className="sticky left-0 z-20 bg-slate-100 border-r border-[#E2E8F0] px-4 py-3 text-left w-36 font-bold text-[#0F172A]">
                  Phòng / Hạng
                </th>
                {dateColumns.map((date, idx) => {
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                  const isToday = date.toISOString().slice(0, 10) === '2026-09-20';
                  return (
                    <th
                      key={idx}
                      className={`px-2 py-2.5 text-center min-w-[65px] border-r border-slate-200 font-semibold ${
                        isToday
                          ? 'bg-blue-100 text-[#1F5AA6]'
                          : isWeekend
                          ? 'bg-amber-50/50 text-amber-900'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="text-[10px] uppercase">
                        {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                      </div>
                      <div className="text-xs font-bold">{date.getDate()}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => {
                // Find bookings assigned to this room
                const roomBookings = bookings.filter((b) => b.roomNumber === room.roomNumber);

                return (
                  <tr
                    key={room.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition"
                  >
                    {/* Sticky Room Label */}
                    <td className="sticky left-0 z-10 bg-white border-r border-[#E2E8F0] px-3 py-2.5 font-semibold text-[#0F172A] shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-[#1F5AA6]">
                          {room.roomNumber}
                        </span>
                        <span className="text-[10px] px-1 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {room.roomTypeCode}
                        </span>
                      </div>
                    </td>

                    {/* Timeline grid cells */}
                    {dateColumns.map((colDate, idx) => {
                      const dateStr = colDate.toISOString().slice(0, 10);

                      // Check if any booking spans this date
                      const bookingOnDate = roomBookings.find(
                        (b) => dateStr >= b.checkInDate && dateStr < b.checkOutDate
                      );

                      if (bookingOnDate) {
                        const isStart = dateStr === bookingOnDate.checkInDate;
                        const isCheckedIn = bookingOnDate.status === 'CHECKED_IN';
                        const colorClass = isCheckedIn
                          ? 'bg-blue-600 text-white'
                          : 'bg-amber-500 text-white';

                        return (
                          <td
                            key={idx}
                            onClick={() => navigate(`/staff/bookings/${bookingOnDate.id}`)}
                            className="p-1 border-r border-slate-100 cursor-pointer"
                          >
                            <div
                              className={`h-8 rounded-lg px-2 flex items-center justify-start text-[11px] font-bold truncate shadow-xs ${colorClass}`}
                              title={`${bookingOnDate.guestName} (${bookingOnDate.bookingCode})`}
                            >
                              {isStart && (
                                <span className="truncate">{bookingOnDate.guestName}</span>
                              )}
                            </div>
                          </td>
                        );
                      }

                      // Empty slot - click to quick walk-in
                      return (
                        <td
                          key={idx}
                          onClick={() =>
                            navigate(
                              `/staff/walk-in?roomId=${room.id}&roomNumber=${room.roomNumber}&checkIn=${dateStr}`
                            )
                          }
                          className="p-1 border-r border-slate-100 hover:bg-emerald-50/50 cursor-pointer transition text-center"
                          title="Trống - Bấm để đặt phòng"
                        >
                          <div className="h-8 rounded-md hover:border border-emerald-300 border-dashed" />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
