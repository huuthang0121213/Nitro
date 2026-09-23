/**
 * ============================================================================
 * TÊN FILE: RoomsManagePage.tsx
 * VỊ TRÍ: src/pages/staff/RoomsManagePage.tsx
 * PHÂN HỆ: Quản trị Danh mục Phòng Vật lý (Room Inventory Management)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Quản trị 60 phòng vật lý thuộc 10 tầng của khách sạn:
 *     + Bảng liệt kê chi tiết: Số phòng, Tầng, Hạng phòng tương ứng, Trạng thái buồng phòng.
 *     + Chức năng gán trạng thái Buồng phòng nhanh (Housekeeping clean toggle).
 *     + Chuyển trạng thái Bảo trì (Maintenance) khi thiết bị hư hỏng.
 *     + Bộ lọc đa năng theo Tầng và Trạng thái phòng.
 * - Kết nối Backend REST API:
 *     + `GET /api/v1/rooms`: Lấy danh sách phòng.
 *     + `PATCH /api/v1/rooms/:id/status`: Cập nhật trạng thái dọn dẹp / bảo trì.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  DoorOpen,
  Edit2,
  Filter,
  PlusCircle,
  Search,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { roomService } from '../../services/api';
import { Room, RoomStatus } from '../../types';

export const RoomsManagePage: React.FC = () => {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [floorFilter, setFloorFilter] = useState<number | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<RoomStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    roomService.getRooms().then(setRooms);
  }, []);

  const handleToggleClean = async (room: Room) => {
    const updatedStatus: RoomStatus = room.status === 'CLEANING' ? 'AVAILABLE' : 'CLEANING';
    await roomService.updateRoomStatus(room.id, updatedStatus);
    const refreshed = await roomService.getRooms();
    setRooms(refreshed);
  };

  const filtered = rooms.filter((r) => {
    if (floorFilter !== 'ALL' && r.floor !== floorFilter) return false;
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    const roomNum = r.roomNumber || r.number || '';
    if (search.trim() && !roomNum.includes(search.trim())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.roomsManage')}</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Quản lý hiện trạng kỹ thuật, buồng phòng và phân bổ 60 phòng khách sạn
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => {}}
          icon={<PlusCircle className="w-4 h-4" />}
          className="font-bold"
        >
          + Thêm phòng vật lý mới
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm số phòng (101, 204)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-[#E2E8F0] rounded-lg"
          />
        </div>

        <div className="flex items-center gap-3 text-xs w-full sm:w-auto">
          <select
            value={floorFilter}
            onChange={(e) =>
              setFloorFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
            }
            className="p-1.5 border rounded-lg bg-slate-50 font-semibold"
          >
            <option value="ALL">Tất cả tầng (1 - 10)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => (
              <option key={f} value={f}>
                Tầng {f}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="p-1.5 border rounded-lg bg-slate-50 font-semibold"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="AVAILABLE">Trống (AVAILABLE)</option>
            <option value="OCCUPIED">Đang ở (OCCUPIED)</option>
            <option value="RESERVED">Đã đặt (RESERVED)</option>
            <option value="CLEANING">Đang dọn (CLEANING)</option>
            <option value="MAINTENANCE">Bảo trì (MAINTENANCE)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Số phòng</th>
                <th className="py-3 px-4">Tầng</th>
                <th className="py-3 px-4">Hạng phòng</th>
                <th className="py-3 px-4">Trạng thái vận hành</th>
                <th className="py-3 px-4">Tình trạng vệ sinh</th>
                <th className="py-3 px-4">Khách đang ở</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((room) => (
                <tr key={room.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-extrabold text-sm text-[#0F172A]">
                    {room.roomNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-600">Tầng {room.floor}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#1F5AA6]">{room.roomTypeName}</span>
                    <span className="ml-1 text-[10px] text-slate-500">({room.roomTypeCode})</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={room.status} type="room" size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleClean(room)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer transition ${
                        room.isClean
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      {room.isClean ? '✓ Sạch sẽ' : 'Chờ vệ sinh'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    {room.guestName || '—'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {}}
                      className="h-7 text-xs px-2"
                    >
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
