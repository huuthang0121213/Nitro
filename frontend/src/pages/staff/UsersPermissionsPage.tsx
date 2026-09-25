/**
 * ============================================================================
 * TÊN FILE: UsersPermissionsPage.tsx
 * VỊ TRÍ: src/pages/staff/UsersPermissionsPage.tsx
 * PHÂN HỆ: Quản trị Tài khoản Nhân sự & Phân quyền RBAC (Role-Based Access Control)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Quản trị danh sách nhân sự khách sạn và cấp quyền truy cập hệ thống:
 *     + Bốn cấp độ vai trò:
 *         * ADMIN: Toàn quyền cấu hình phòng, giá, nhân sự, kiểm toán.
 *         * MANAGER: Xem báo cáo doanh thu, duyệt chi phí, quản lý lịch làm việc.
 *         * FRONT_DESK: Đặt phòng, check-in, check-out, sơ đồ phòng, bàn giao ca.
 *         * CUSTOMER: Chỉ xem và quản lý đơn đặt phòng cá nhân.
 *     + Bảng ma trận phân quyền chi tiết (RBAC Permission Matrix) minh bạch.
 *     + Modal thêm mới tài khoản nhân viên hoặc thay đổi vai trò trực tiếp.
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  Edit2,
  Key,
  Lock,
  PlusCircle,
  Search,
  Shield,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { User as UserType, UserRole } from '../../types';

const INITIAL_USERS: UserType[] = [
  {
    id: 'u-1',
    name: 'Nguyễn Văn Quản Trị',
    email: 'admin@nitrohotel.vn',
    phone: '0909998877',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-2',
    name: 'Trần Thị Giám Đốc',
    email: 'manager@nitrohotel.vn',
    phone: '0901112233',
    role: 'MANAGER',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-3',
    name: 'Lê Hoàng Lễ Tân',
    email: 'reception@nitrohotel.vn',
    phone: '0903334455',
    role: 'FRONT_DESK',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'u-4',
    name: 'Võ Minh Thuận',
    email: 'thuan.vo@nitrohotel.vn',
    phone: '0905556677',
    role: 'FRONT_DESK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
];

export const UsersPermissionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserType[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('FRONT_DESK');

  const handleOpenAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('FRONT_DESK');
    setModalOpen(true);
  };

  const handleOpenEdit = (u: UserType) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone);
    setRole(u.role);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? { ...u, name, email, phone, role } : u))
      );
    } else {
      setUsers([
        ...users,
        {
          id: `u-${Date.now()}`,
          name,
          email,
          phone,
          role,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        },
      ]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.usersPermissions')}</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Quản trị tài khoản nhân viên nội bộ, phân quyền vai trò Lễ tân, Quản lý và Quản trị
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleOpenAdd}
          icon={<PlusCircle className="w-4 h-4" />}
          className="font-bold"
        >
          + Thêm tài khoản mới
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-[#E2E8F0] text-slate-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nhân sự</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Số điện thoại</th>
                <th className="py-3 px-4">Vai trò (Role)</th>
                <th className="py-3 px-4">Quyền hạn hệ thống</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-bold text-[#0F172A]">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono">{u.email}</td>
                  <td className="py-3 px-4 font-mono">{u.phone}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        u.role === 'ADMIN'
                          ? 'bg-rose-100 text-rose-800'
                          : u.role === 'MANAGER'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-[#1F5AA6]'
                      }`}
                    >
                      {t(`role.${u.role}`)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {u.role === 'ADMIN'
                      ? 'Toàn quyền cấu hình, nhân sự & phân quyền'
                      : u.role === 'MANAGER'
                      ? 'Báo cáo doanh thu, phòng, dịch vụ'
                      : 'Check-in, Check-out, sơ đồ phòng, hóa đơn'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(u)}
                      icon={<Edit2 className="w-3.5 h-3.5" />}
                      className="h-7 text-xs px-2"
                    >
                      Sửa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Chỉnh sửa tài khoản nhân viên' : 'Thêm tài khoản nhân viên'}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              Lưu tài khoản
            </Button>
          </div>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Họ và tên nhân sự:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Email đăng nhập:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Số điện thoại:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[#E2E8F0]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Phân quyền vai trò:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full p-2.5 rounded-lg border border-[#E2E8F0] bg-white font-semibold"
            >
              <option value="FRONT_DESK">Lễ tân (Front Desk) - Vận hành ca, check-in, timeline</option>
              <option value="MANAGER">Quản lý (Manager) - Xem báo cáo, doanh thu, quản lý phòng &amp; dịch vụ</option>
              <option value="ADMIN">Quản trị viên (Admin) - Toàn quyền hệ thống</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};
