/**
 * ============================================================================
 * TÊN FILE: RoomBoardPage.tsx
 * VỊ TRÍ: src/pages/staff/RoomBoardPage.tsx
 * PHÂN HỆ: Nghiệp vụ Lễ tân & Buồng phòng (Front Desk Room Matrix & Housekeeping)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Hiển thị sơ đồ ma trận 60 phòng thuộc 10 tầng của khách sạn Nitro Grand:
 *     + Mã màu trực quan phân loại 5 trạng thái phòng: Trống (Xanh lá), Đang ở (Xanh dương),
 *       Đã đặt trước (Vàng hổ phách), Đang dọn dẹp (Tím), Bảo trì (Đỏ).
 *     + Thanh lọc nhanh số lượng phòng theo trạng thái, lọc theo tầng (1 - 10) và hạng phòng.
 *     + Thao tác nhanh (Quick Actions) qua Drawer trượt:
 *         * Check-in khách đã đặt trước hoặc Walk-in phòng trống.
 *         * Check-out trả phòng, in hóa đơn.
 *         * Chuyển trạng thái dọn buồng phòng (Housekeeping Cleaned).
 *         * Đổi phòng khẩn cấp cho khách (Room Change).
 * - Kết nối Backend REST API:
 *     + `GET /api/v1/rooms`: Lấy danh sách trạng thái phòng.
 *     + `PATCH /api/v1/rooms/:id/status`: Cập nhật trạng thái phòng (Housekeeping, Maintenance).
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  BedDouble,
  Check,
  CheckCircle2,
  Clock,
  DoorOpen,
  Filter,
  PlusCircle,
  RefreshCw,
  Search,
  Sparkles,
  User,
  Wrench,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Drawer } from '../../components/common/Drawer';
import { StatusBadge } from '../../components/common/StatusBadge';
import { bookingService, roomService } from '../../services/api';
import { Booking, Room, RoomStatus } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format';

export const RoomBoardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'ALL'>('ALL');
  const [floorFilter, setFloorFilter] = useState<number | 'ALL'>('ALL');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Room for Drawer
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    Promise.all([roomService.getRooms(), bookingService.getBookings()]).then(
      ([rData, bData]) => {
        setRooms(rData);
        setBookings(bData);
        setLoading(false);
      }
    );
  }, []);

  const handleUpdateRoomStatus = async (roomId: string, newStatus: RoomStatus) => {
    await roomService.updateRoomStatus(roomId, newStatus);
    const updated = await roomService.getRooms();
    setRooms(updated);
    if (selectedRoom && selectedRoom.id === roomId) {
      setSelectedRoom({ ...selectedRoom, status: newStatus });
    }
  };

  // Status counts
  const counts = {
    ALL: rooms.length,
    AVAILABLE: rooms.filter((r) => r.status === 'AVAILABLE').length,
    OCCUPIED: rooms.filter((r) => r.status === 'OCCUPIED').length,
    RESERVED: rooms.filter((r) => r.status === 'RESERVED').length,
    CLEANING: rooms.filter((r) => r.status === 'CLEANING').length,
    MAINTENANCE: rooms.filter((r) => r.status === 'MAINTENANCE').length,
  };

  // Filtered rooms
  const filteredRooms = rooms.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (floorFilter !== 'ALL' && r.floor !== floorFilter) return false;
    if (roomTypeFilter !== 'ALL' && (r.roomTypeCode || r.roomType?.code) !== roomTypeFilter) return false;
    const num = r.roomNumber || r.number || '';
    if (searchQuery.trim() && !num.includes(searchQuery.trim())) return false;
    return true;
  });

  // Group rooms by floor (10 floors down)
  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort((a, b) => b - a);

  // Find related booking for selected room
  const activeBooking = selectedRoom
    ? bookings.find(
        (b) =>
          b.roomNumber === (selectedRoom.roomNumber || selectedRoom.number) &&
          (b.status === 'CHECKED_IN' || b.status === 'CONFIRMED')
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Page Title & Fast Walk-in */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.roomBoard')}</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Sơ đồ trực quan 60 phòng thuộc 10 tầng khách sạn Nitro Grand
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/staff/timeline')}
            icon={<Clock className="w-4 h-4" />}
            className="flex-1 sm:flex-initial justify-center"
          >
            <span className="truncate">Lịch Timeline</span>
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => navigate('/staff/walk-in')}
            icon={<PlusCircle className="w-4 h-4" />}
            className="flex-1 sm:flex-initial justify-center font-bold"
          >
            <span className="truncate">+ Walk-in</span>
          </Button>
        </div>
      </div>

      {/* Status Legend Bar (Interactive filter chips with counts) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-3 shadow-xs flex items-center gap-2 overflow-x-auto pb-2 sm:pb-3 sm:flex-wrap text-xs">
        <span className="text-[#475569] font-bold mr-1 shrink-0">Trạng thái:</span>
        {[
          { key: 'ALL', label: 'Tất cả', count: counts.ALL, bg: 'bg-slate-100 text-slate-800' },
          { key: 'AVAILABLE', label: 'Trống', count: counts.AVAILABLE, bg: 'bg-emerald-100 text-emerald-800' },
          { key: 'OCCUPIED', label: 'Đang ở', count: counts.OCCUPIED, bg: 'bg-blue-100 text-blue-800' },
          { key: 'RESERVED', label: 'Đã đặt trước', count: counts.RESERVED, bg: 'bg-amber-100 text-amber-800' },
          { key: 'CLEANING', label: 'Đang dọn', count: counts.CLEANING, bg: 'bg-purple-100 text-purple-800' },
          { key: 'MAINTENANCE', label: 'Bảo trì', count: counts.MAINTENANCE, bg: 'bg-rose-100 text-rose-800' },
        ].map((item) => {
          const active = statusFilter === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setStatusFilter(item.key as any)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
                active ? 'ring-2 ring-[#1F5AA6] ' + item.bg : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="whitespace-nowrap">{item.label}</span>
              <span className="text-[10px] bg-white/80 px-1.5 py-0.2 rounded-full tabular-nums">
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Controls Row */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          {/* Floor filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#475569] font-semibold">Tầng:</span>
            <select
              value={floorFilter}
              onChange={(e) =>
                setFloorFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
              }
              className="border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 bg-slate-50 font-semibold text-[#0F172A]"
            >
              <option value="ALL">Tất cả tầng (1 - 10)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((fl) => (
                <option key={fl} value={fl}>
                  Tầng {fl}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#475569] font-semibold">Hạng:</span>
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="border border-[#E2E8F0] rounded-lg px-2.5 py-1.5 bg-slate-50 font-semibold text-[#0F172A]"
            >
              <option value="ALL">Tất cả hạng phòng</option>
              <option value="STD">Standard (STD)</option>
              <option value="SUP">Superior (SUP)</option>
              <option value="DLX">Deluxe (DLX)</option>
              <option value="FAM">Family Suite (FAM)</option>
              <option value="EXE">Executive Suite (EXE)</option>
              <option value="PRE">Presidential (PRE)</option>
            </select>
          </div>
        </div>

        {/* Room Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm số phòng (VD: 302)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1F5AA6]"
          />
        </div>
      </div>

      {/* Room Grid by Floors */}
      <div className="space-y-6">
        {floors
          .filter((f) => floorFilter === 'ALL' || floorFilter === f)
          .map((floor) => {
            const floorRooms = filteredRooms.filter((r) => r.floor === floor);
            if (floorRooms.length === 0) return null;

            return (
              <div key={floor} className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
                  <span className="font-extrabold text-sm text-[#0B1F3A] uppercase tracking-wider flex items-center gap-2">
                    <DoorOpen className="w-4 h-4 text-[#1F5AA6]" />
                    Tầng {floor} ({floorRooms.length} phòng)
                  </span>
                  <span className="text-[11px] text-[#475569]">
                    {floor === 10
                      ? 'Tầng Tổng Thống & Executive'
                      : floor >= 7
                      ? 'Tầng Cao View Toàn Cảnh'
                      : 'Tầng Tiêu Chuẩn'}
                  </span>
                </div>

                {/* 6 Rooms Grid per floor */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {floorRooms.map((room) => {
                    const isOccupied = room.status === 'OCCUPIED';
                    const isAvailable = room.status === 'AVAILABLE';
                    const isReserved = room.status === 'RESERVED';
                    const isCleaning = room.status === 'CLEANING';
                    const isMaintenance = room.status === 'MAINTENANCE';

                    const borderBg = isAvailable
                      ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50'
                      : isOccupied
                      ? 'border-blue-200 bg-blue-50/40 hover:bg-blue-50'
                      : isReserved
                      ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50'
                      : isCleaning
                      ? 'border-purple-200 bg-purple-50/40 hover:bg-purple-50'
                      : 'border-rose-200 bg-rose-50/40 hover:bg-rose-50';

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`p-3 rounded-xl border-2 transition transform hover:-translate-y-0.5 cursor-pointer shadow-2xs flex flex-col justify-between min-h-[105px] ${borderBg}`}
                      >
                        {/* Header: Room Number & Type Code */}
                        <div className="flex items-start justify-between">
                          <span className="font-mono font-extrabold text-lg text-[#0F172A]">
                            {room.roomNumber}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/90 text-slate-700 shadow-2xs border border-slate-200">
                            {room.roomTypeCode}
                          </span>
                        </div>

                        {/* Status badge & detail */}
                        <div>
                          <StatusBadge status={room.status} type="room" size="sm" />
                          {room.guestName && (
                            <div className="text-[11px] font-bold text-[#0F172A] truncate mt-1">
                              {room.guestName}
                            </div>
                          )}
                          {isCleaning && (
                            <div className="text-[10px] text-purple-700 flex items-center gap-1 mt-0.5">
                              <Sparkles className="w-3 h-3" /> Đang dọn
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Room Action Slide-over Drawer */}
      <Drawer
        isOpen={Boolean(selectedRoom)}
        onClose={() => setSelectedRoom(null)}
        title={
          selectedRoom ? (
            <div className="flex items-center gap-2">
              <DoorOpen className="w-5 h-5 text-[#1F5AA6]" />
              <span>Phòng {selectedRoom.roomNumber}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#1F5AA6] border border-blue-200">
                {selectedRoom.roomTypeName}
              </span>
            </div>
          ) : (
            'Chi tiết phòng'
          )
        }
        footer={
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedRoom(null)}
            >
              Đóng
            </Button>
            {selectedRoom?.status === 'AVAILABLE' && (
              <Button
                variant="gold"
                size="sm"
                onClick={() => {
                  navigate(`/staff/walk-in?roomId=${selectedRoom.id}&roomNumber=${selectedRoom.roomNumber}`);
                }}
              >
                + Đặt phòng Walk-in
              </Button>
            )}
          </div>
        }
      >
        {selectedRoom && (
          <div className="space-y-6 text-xs">
            {/* Status overview */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Trạng thái hiện tại:</span>
                <StatusBadge status={selectedRoom.status} type="room" size="md" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Tầng:</span>
                <span className="font-bold text-[#0F172A]">Tầng {selectedRoom.floor}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Hạng phòng:</span>
                <span className="font-bold text-[#1F5AA6]">
                  {selectedRoom.roomTypeName} ({selectedRoom.roomTypeCode})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Tình trạng vệ sinh:</span>
                <span
                  className={`font-bold ${
                    selectedRoom.isClean ? 'text-emerald-700' : 'text-purple-700'
                  }`}
                >
                  {selectedRoom.isClean ? '✓ Đã sạch sẽ' : 'Chờ vệ sinh'}
                </span>
              </div>
            </div>

            {/* Quick Status Control Buttons */}
            <div>
              <span className="block font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                Chuyển trạng thái nhanh:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'AVAILABLE')}
                  className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                >
                  ✓ Trống (Sẵn sàng)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'CLEANING')}
                  className="text-purple-700 border-purple-200 hover:bg-purple-50"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Chờ dọn phòng
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'MAINTENANCE')}
                  className="text-rose-700 border-rose-200 hover:bg-rose-50"
                >
                  <Wrench className="w-3.5 h-3.5 mr-1" /> Bảo trì thiết bị
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'OCCUPIED')}
                  className="text-blue-700 border-blue-200 hover:bg-blue-50"
                >
                  Đang có khách ở
                </Button>
              </div>
            </div>

            {/* In-House or Reserved Booking details */}
            {activeBooking ? (
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-blue-200">
                  <span className="font-bold text-[#0F172A]">Thông tin khách lưu trú:</span>
                  <StatusBadge status={activeBooking.status} type="booking" size="sm" />
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475569]">Mã đặt phòng:</span>
                  <span className="font-mono font-bold text-[#1F5AA6]">
                    {activeBooking.bookingCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475569]">Khách hàng:</span>
                  <span className="font-bold text-[#0F172A]">{activeBooking.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475569]">Số điện thoại:</span>
                  <span className="font-mono text-[#0F172A]">{activeBooking.guestPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#475569]">Lưu trú:</span>
                  <span>
                    {formatDate(activeBooking.checkInDate)} &rarr;{' '}
                    {formatDate(activeBooking.checkOutDate)}
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/staff/bookings/${activeBooking.id}`)}
                  >
                    Xem chi tiết hồ sơ &amp; Hóa đơn
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-[#475569]">
                Hiện không có lượt khách nào đang gán vào phòng này.
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
