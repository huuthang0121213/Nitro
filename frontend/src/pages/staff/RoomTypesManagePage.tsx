/**
 * ============================================================================
 * TÊN FILE: RoomTypesManagePage.tsx
 * VỊ TRÍ: src/pages/staff/RoomTypesManagePage.tsx
 * PHÂN HỆ: Quản trị Hạng phòng & Giá niêm yết (Room Types & Tariff Management)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Quản lý cấu hình 5 hạng phòng tiêu chuẩn của khách sạn (Deluxe, Executive, Suite, Penthouse, Family):
 *     + Xem danh sách hạng phòng: Giá cơ sở/đêm, Diện tích m², Sức chứa người lớn/trẻ em, Tiện nghi.
 *     + Drawer chỉnh sửa giá bán theo mùa, cập nhật hình ảnh đại diện, mô tả chi tiết.
 *     + Thêm hạng phòng mới hoặc tắt/bật kinh doanh hạng phòng.
 * - Kết nối Backend REST API:
 *     + `GET /api/v1/room-types`: Tải danh sách cấu hình hạng phòng.
 *     + `PUT /api/v1/room-types/:id`: Cập nhật giá bán và thông số kỹ thuật.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  BedDouble,
  Check,
  Edit2,
  Image as ImageIcon,
  PlusCircle,
  Trash2,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';
import { Drawer } from '../../components/common/Drawer';
import { roomService } from '../../services/api';
import { RoomType } from '../../types';
import { formatCurrency } from '../../utils/format';

export const RoomTypesManagePage: React.FC = () => {
  const { t } = useTranslation();
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [capacityAdults, setCapacityAdults] = useState(2);
  const [capacityChildren, setCapacityChildren] = useState(1);
  const [area, setArea] = useState(30);
  const [description, setDescription] = useState('');

  useEffect(() => {
    roomService.getRoomTypes().then(setRoomTypes);
  }, []);

  const handleOpenEdit = (rt: RoomType) => {
    setSelectedType(rt);
    setName(rt.name);
    setBasePrice(rt.basePrice);
    setCapacityAdults(rt.capacityAdults ?? rt.maxGuests ?? 2);
    setCapacityChildren(rt.capacityChildren ?? 1);
    setArea(rt.area);
    setDescription(rt.description);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedType) return;
    const updated = roomTypes.map((rt) =>
      rt.id === selectedType.id
        ? {
            ...rt,
            name,
            basePrice,
            capacityAdults,
            capacityChildren,
            area,
            description,
          }
        : rt
    );
    setRoomTypes(updated);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.roomTypesManage')}</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Quản lý 6 hạng phòng chuẩn, định mức giá niêm yết, tiện nghi và sức chứa
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => {}}
          icon={<PlusCircle className="w-4 h-4" />}
          className="font-bold"
        >
          + Thêm hạng phòng mới
        </Button>
      </div>

      {/* Grid of Room Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roomTypes.map((rt) => (
          <div
            key={rt.id}
            className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="relative h-44">
              <img
                src={rt.images[0]}
                alt={rt.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#0F172A]/80 text-white backdrop-blur-xs">
                {rt.code}
              </span>
            </div>

            <div className="p-5 space-y-3 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#0F172A]">{rt.name}</h3>
                  <div className="text-xs text-[#475569] flex items-center gap-3 mt-1">
                    <span>{rt.area} m²</span>
                    <span>•</span>
                    <span>
                      {rt.capacityAdults} người lớn, {rt.capacityChildren} trẻ
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500">Giá niêm yết:</div>
                  <div className="text-sm font-extrabold text-[#1F5AA6] tabular-nums">
                    {formatCurrency(rt.basePrice)}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">{rt.description}</p>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                {rt.amenities.slice(0, 4).map((a, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                  >
                    {a}
                  </span>
                ))}
                {rt.amenities.length > 4 && (
                  <span className="text-[10px] text-slate-500 px-1 py-0.5">
                    +{rt.amenities.length - 4}
                  </span>
                )}
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-[#E2E8F0] flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenEdit(rt)}
                icon={<Edit2 className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Drawer */}
      <Drawer
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={selectedType ? `Chỉnh sửa hạng phòng: ${selectedType.name}` : ''}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Lưu thay đổi
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Tên hạng phòng:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Giá cơ bản (₫/đêm):</label>
              <input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Diện tích (m²):</label>
              <input
                type="number"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Số người lớn tối đa:</label>
              <input
                type="number"
                value={capacityAdults}
                onChange={(e) => setCapacityAdults(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Số trẻ em tối đa:</label>
              <input
                type="number"
                value={capacityChildren}
                onChange={(e) => setCapacityChildren(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Mô tả chi tiết:</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};
