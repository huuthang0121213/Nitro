import React, { useState } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  NavLink, 
  Navigate, 
  useLocation, 
  useNavigate, 
  Outlet 
} from 'react-router-dom';

import { 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Home, 
  Compass, 
  Calendar, 
  LogIn, 
  LayoutDashboard, 
  Grid, 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  BedDouble, 
  Check,
  Palette,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Play,
  RotateCcw,
  Phone,
  Mail,
  MapPin,
  User
} from 'lucide-react';

import { AppProvider, useApp } from './context/AppContext';
import { CustomerLayout } from './layouts/CustomerLayout';
import { StaffLayout } from './layouts/StaffLayout';
import { Button } from './components/common/Button';
import { Modal } from './components/common/Modal';
import { Drawer } from './components/common/Drawer';
import { StatusBadge } from './components/common/StatusBadge';
import { StatCard } from './components/common/StatCard';
import { Skeleton, EmptyState, ErrorState } from './components/common/StateViews';

import { MOCK_ROOM_TYPES, MOCK_ROOMS, MOCK_BOOKINGS, MOCK_USERS } from './mocks/data';

// ============================================================================
// 1. THANH TRẠNG THÁI TIẾN ĐỘ SPRINT 1 (TASK-13)
// ============================================================================
function TaskHeader() {
  const location = useLocation();
  const [showGuide, setShowGuide] = useState(false);
  const { role, setRole } = useApp();

  return (
    <>
      <header className="bg-navy-900 text-white py-2 px-4 text-xs font-medium border-b border-blue-900/40 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SPRINT 1 | <strong>TASK-13: XÂY DỰNG BỐ CỤC KHUNG QUẢN TRỊ STAFF (STAFF LAYOUT)</strong></span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-blue-900/80 text-[10px] font-mono border border-blue-700/50">
              src/layouts/StaffLayout.tsx
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Dynamic RBAC Role Switcher */}
            <div className="flex items-center gap-1.5 bg-blue-950/90 px-2 py-1 rounded-lg border border-blue-800 text-[11px]">
              <span className="text-slate-400 hidden sm:inline font-mono">Vai trò RBAC:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="bg-navy-900 text-amber-300 font-bold border-none outline-none text-xs rounded cursor-pointer"
                aria-label="Chuyển đổi vai trò RBAC"
              >
                <option value="CUSTOMER">Khách (CUSTOMER - Khóa 403)</option>
                <option value="FRONT_DESK">Lễ tân (FRONT_DESK - 5 mục)</option>
                <option value="MANAGER">Quản lý (MANAGER - 10 mục)</option>
                <option value="ADMIN">Quản trị viên (ADMIN - 13 mục)</option>
              </select>
            </div>

            {/* Quick Testing Links */}
            <div className="hidden xl:flex items-center gap-1.5 text-[11px]">
              <Link to="/" className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition">Khách</Link>
              <Link to="/staff/overview" className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition">Ca trực</Link>
              <Link to="/staff/room-board" className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition">Sơ đồ phòng</Link>
              <Link to="/staff/dashboard" className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition">Dashboard</Link>
              <Link to="/components" className="px-2 py-0.5 rounded bg-blue-800/60 hover:bg-blue-800 text-slate-200 transition flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-400" /> Base UI
              </Link>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono bg-blue-950/70 px-2.5 py-1 rounded border border-blue-800">
              <span className="text-slate-400">URL:</span>
              <span className="text-emerald-300 font-bold">{location.pathname}</span>
            </div>

            <button
              onClick={() => setShowGuide(!showGuide)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold border border-amber-500/40 transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Cách kiểm tra Staff
            </button>
          </div>
        </div>
      </header>

      {/* Modal Hướng dẫn kiểm tra TASK-13 */}
      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Hướng Dẫn 4 Cách Kiểm Tra Khung Quản Trị Staff (TASK-13)</h3>
              </div>
              <button 
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-primary-600 block mb-1">Cách 1: Trải nghiệm bố cục chuẩn PMS khách sạn 4 sao</span>
                <p>Truy cập vào <strong>/staff/overview</strong>: Xem <strong>Sidebar Dark Navy (#0B1F3A)</strong> bên trái, thanh <strong>Header</strong> (ô tìm kiếm PNR/tên khách, chuông thông báo ca, chuyển ngữ VI/EN, nút bấm vàng <strong>+ Walk-in</strong>), và vùng làm việc <strong>&lt;Outlet /&gt;</strong>.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-indigo-700 block mb-1">Cách 2: Thử nghiệm phân quyền động RBAC &amp; Khóa bảo vệ 403 Forbidden</span>
                <p>Sử dụng ô chọn <strong>Vai trò RBAC</strong> trên thanh header trên cùng:</p>
                <ul className="list-disc pl-4 space-y-1 mt-1">
                  <li>Chọn <strong>Khách (CUSTOMER)</strong>: Hệ thống lập tức chặn và hiển thị màn hình <strong>403 Forbidden</strong> không cho phép truy cập.</li>
                  <li>Chọn <strong>Lễ tân (FRONT_DESK)</strong>: Sidebar chỉ hiện 5 chức năng lễ tân (Ca trực, Sơ đồ phòng, Timeline, Đơn đặt, Khách hàng).</li>
                  <li>Chọn <strong>Quản lý (MANAGER)</strong>: Mở thêm 5 menu quản trị (+ Dashboard, Loại phòng, Phòng, Dịch vụ, Báo cáo).</li>
                  <li>Chọn <strong>Quản trị viên (ADMIN)</strong>: Mở toàn bộ 13 menu (+ Người dùng, Cài đặt, Nhật ký).</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-amber-700 block mb-1">Cách 3: Thử nghiệm Thu gọn/Mở rộng Sidebar &amp; Drawer trên Di động</span>
                <p>Bấm vào nút mũi tên cạnh logo ở đầu Sidebar để thu nhỏ thành dạng icon-only (width 80px) và mở rộng lại (width 256px). Thu nhỏ màn hình để bấm nút 3 gạch mở Menu Drawer trượt từ cạnh trái.</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-emerald-700 block mb-1">Cách 4: Kiểm tra Chuông thông báo ca &amp; Biên dịch TypeScript</span>
                <p>Bấm vào biểu tượng <strong>Chuông thông báo</strong> trên Header Staff để mở danh sách 3 sự kiện ca trực mới nhất. Chạy <code className="text-emerald-700 font-mono bg-emerald-50 px-1 py-0.5 rounded">npm run lint</code> để thấy toàn bộ StaffLayout đạt 0 lỗi biên dịch.</p>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowGuide(false)}
                className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold text-xs hover:bg-primary-700 cursor-pointer"
              >
                Đã hiểu, đóng hướng dẫn
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================================
// 4. MÀN HÌNH KIỂM THỬ THÀNH PHẦN CƠ SỞ (TASK-11 COMPONENT SHOWCASE)
// ============================================================================
function ComponentsShowcasePageView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header Title */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-primary-600 text-xs font-semibold mb-2">
          <Palette className="w-3.5 h-3.5 text-amber-500" />
          TASK-11: Thư Viện Thành Phần Cơ Sở (Base UI Primitives)
        </div>
        <h1 className="text-3xl font-serif font-bold text-slate-900">
          Trưng Bày & Kiểm Thử Các Thành Phần Cơ Sở
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tập hợp 6 UI Components dùng chung trong <code className="text-primary-600 font-mono">src/components/common/</code> đạt chuẩn Design System khách sạn 4 sao.
        </p>
      </div>

      {/* 1. Button Showcase */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              1. Nút Bấm Chuẩn Thương Hiệu (Button Component)
            </h2>
            <p className="text-xs text-slate-500">6 Biến thể màu sắc (variant), 3 kích thước (size) và trạng thái loading</p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isLoadingBtn} 
              onChange={(e) => setIsLoadingBtn(e.target.checked)} 
              className="rounded text-primary-600"
            />
            Bật trạng thái Loading
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Biến Thể Màu Sắc (Variants):</span>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" loading={isLoadingBtn}>Primary Button</Button>
              <Button variant="secondary" loading={isLoadingBtn}>Secondary</Button>
              <Button variant="outline" loading={isLoadingBtn}>Outline Light</Button>
              <Button variant="ghost" loading={isLoadingBtn}>Ghost Button</Button>
              <Button variant="gold" loading={isLoadingBtn}>Gold VIP 4★</Button>
              <Button variant="danger" loading={isLoadingBtn}>Danger (Hủy)</Button>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Kích Thước (Sizes):</span>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm" variant="primary">Small (sm)</Button>
              <Button size="md" variant="primary">Medium (md - 44px)</Button>
              <Button size="lg" variant="primary">Large (lg - 48px)</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dialog Modal & Slide Drawer Showcase */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          2. Cửa Sổ Bật Lên (Modal) & Thanh Trượt (Drawer)
        </h2>
        <p className="text-xs text-slate-500">Hỗ trợ phím ESC, nhấn ra ngoài để đóng, khóa cuộn trang body và hiệu ứng chuyển động mượt mà.</p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Button 
            variant="primary" 
            onClick={() => setIsModalOpen(true)}
            icon={<Sliders className="w-4 h-4" />}
          >
            Mở Cửa Sổ Modal Thử Nghiệm
          </Button>

          <Button 
            variant="outline" 
            onClick={() => setIsDrawerOpen(true)}
            icon={<Sliders className="w-4 h-4" />}
          >
            Mở Thanh Trượt Phải (Drawer)
          </Button>
        </div>

        {/* Modal Instance */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Xác Nhận Đặt Phòng (Demo Modal)"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                Hủy Bỏ
              </Button>
              <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
                Đồng Ý Tiếp Tục
              </Button>
            </>
          }
        >
          <div className="space-y-3 text-xs text-slate-600">
            <p>Đây là thành phần <strong>Modal.tsx</strong> tiêu chuẩn của Nitro Grand Hotel.</p>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900">
              <span className="font-bold block">Tính năng kỹ thuật:</span>
              • Tự động khóa cuộn trang (body overflow lock)<br/>
              • Nhấn phím <kbd className="bg-white px-1 py-0.5 rounded shadow text-[10px]">ESC</kbd> để đóng nhanh<br/>
              • Backdrop làm mờ tinh tế (backdrop-blur-xs)
            </div>
          </div>
        </Modal>

        {/* Drawer Instance */}
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title="Chi Tiết Đơn Đặt Phòng (Demo Drawer)"
          footer={
            <Button variant="primary" size="sm" onClick={() => setIsDrawerOpen(false)}>
              Đóng Thanh Trượt
            </Button>
          }
        >
          <div className="space-y-4 text-xs text-slate-600">
            <p>Đây là thành phần <strong>Drawer.tsx</strong> trượt từ cạnh phải màn hình.</p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Mã đơn:</span>
                <span className="font-mono font-bold text-primary-600">NTR-260921-0042</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Khách hàng:</span>
                <span className="font-semibold text-slate-800">Trần Thị Thu Thảo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phòng:</span>
                <span className="font-bold text-slate-900">Phòng 302 (Deluxe City View)</span>
              </div>
            </div>
          </div>
        </Drawer>
      </section>

      {/* 3. StatusBadge Showcase */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-2 h-2 rounded-full bg-purple-600"></span>
          3. Huy Hiệu Trạng Thái Trực Quan (StatusBadge Component)
        </h2>
        
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Trạng Thái Đơn Đặt Phòng (type=&quot;booking&quot;):</span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge type="booking" status="PENDING" />
              <StatusBadge type="booking" status="CONFIRMED" />
              <StatusBadge type="booking" status="CHECKED_IN" />
              <StatusBadge type="booking" status="CHECKED_OUT" />
              <StatusBadge type="booking" status="CANCELLED" />
              <StatusBadge type="booking" status="EXPIRED" />
              <StatusBadge type="booking" status="NO_SHOW" />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Trạng Thái Buồng Phòng PMS (type=&quot;room&quot;):</span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge type="room" status="AVAILABLE" />
              <StatusBadge type="room" status="RESERVED" />
              <StatusBadge type="room" status="OCCUPIED" />
              <StatusBadge type="room" status="CLEANING" />
              <StatusBadge type="room" status="MAINTENANCE" />
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Kênh Phân Phối (type=&quot;source&quot;):</span>
            <div className="flex flex-wrap gap-2">
              <StatusBadge type="source" status="WEB" />
              <StatusBadge type="source" status="MOBILE" />
              <StatusBadge type="source" status="COUNTER" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. StatCard Showcase */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
          4. Thẻ Chỉ Số Thống Kê & KPI (StatCard Component)
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Doanh Thu Tháng Này"
            value="428.500.000 đ"
            diff={12.4}
            diffLabel="so với tháng trước"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatCard
            title="Công Suất Phòng (Occupancy)"
            value="78.5%"
            diff={4.2}
            diffLabel="tăng trưởng"
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatCard
            title="Tỷ Lệ Hủy Phòng (Cancellation)"
            value="3.8%"
            diff={-1.5}
            diffLabel="giảm (tích cực)"
            isInverseTrend={true}
            icon={<AlertTriangle className="w-5 h-5" />}
          />
        </div>
      </section>

      {/* 5. StateViews (Skeleton, Empty, Error) Showcase */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
          5. Trạng Thái Giao Diện (StateViews: Skeleton, Empty, Error)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Skeleton Box */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Khung Xương Tải Trang (Skeleton):</span>
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-8 w-1/2 mt-2" />
            </div>
          </div>

          {/* Empty State */}
          <EmptyState
            title="Chưa Có Đơn Đặt Nào"
            description="Bạn chưa thực hiện đơn đặt phòng nào trong kỳ này."
            actionText="Khám Phá Phòng Ngay"
            onAction={() => alert('Chuyển tới /rooms')}
          />

          {/* Error State */}
          <ErrorState
            title="Mất Kết Nối Máy Chủ"
            description="Không thể đồng bộ dữ liệu với máy chủ. Vui lòng kiểm tra kết nối mạng."
            onRetry={() => alert('Thử lại thành công!')}
          />
        </div>
      </section>
    </div>
  );
}

// --- 4.1 Trang Chủ (Home /) ---
function HomePageView() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Hero Welcome */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Route: / (Trang Chủ Khách Hàng)
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Kỳ Nghỉ Thượng Lưu Tại Trái Tim Sài Gòn
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Trải nghiệm dịch vụ lưu trú 4 sao chuẩn quốc tế. Hệ thống điều hướng React Router đã kết nối thông suốt giữa Cổng đặt phòng và Bàn làm việc lễ tân.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/rooms"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Khám Phá Các Hạng Phòng
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/components"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm border border-white/20 transition-all cursor-pointer"
            >
              <Palette className="w-4 h-4 text-amber-400" />
              Xem Thư Viện Base UI
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center">
            <BedDouble className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Hạng Phòng & Đặt Chỗ</h3>
          <p className="text-xs text-slate-500">
            Xem 6 hạng phòng chuẩn 4 sao với bảng giá niêm yết và tiện ích chi tiết.
          </p>
          <Link to="/rooms" className="text-xs font-bold text-primary-600 hover:text-blue-800 flex items-center gap-1 pt-1">
            Chuyển tới /rooms <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Grid className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Sơ Đồ Buồng Phòng PMS</h3>
          <p className="text-xs text-slate-500">
            Trực quan hóa 32 buồng phòng Tầng 1 - 6 theo 5 trạng thái vận hành.
          </p>
          <Link to="/staff/room-board" className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 pt-1">
            Chuyển tới /staff/room-board <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Báo Cáo Quản Trị</h3>
          <p className="text-xs text-slate-500">
            Biểu đồ phân tích công suất phòng, doanh thu và nguồn khách thực tế.
          </p>
          <Link to="/staff/dashboard" className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 pt-1">
            Chuyển tới /staff/dashboard <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- 4.2 Trang Hạng Phòng (/rooms) ---
function RoomsPageView() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /rooms</span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Danh Mục Hạng Phòng Lưu Trú</h1>
        </div>
        <Link to="/booking" className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold text-xs shadow-sm hover:bg-primary-700">
          Thử Quy Trình Đặt Phòng
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ROOM_TYPES.map((rt) => (
          <div key={rt.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <img src={rt.image} alt={rt.name} className="w-full h-44 object-cover" />
            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-base">{rt.name}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">{rt.code}</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{rt.description}</p>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-base font-bold text-emerald-600">{rt.basePrice.toLocaleString('vi-VN')} đ<span className="text-xs text-slate-400 font-normal">/đêm</span></span>
                <Link to="/booking" className="text-xs font-semibold text-primary-600 hover:underline">
                  Chọn phòng →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4.3 Trang Quy Trình Đặt Phòng (/booking) ---
function BookingPageView() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /booking</span>
        <h1 className="text-3xl font-serif font-bold text-slate-900">Quy Trình Đặt Phòng 3 Bước</h1>
        <p className="text-xs text-slate-500">Khung điều hướng đặt phòng tích hợp đếm ngược 10 phút giữ chỗ</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">1</span>
            <span className="font-bold text-sm text-slate-900">Chọn Dịch Vụ</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">2</span>
            <span className="text-sm">Thông Tin Khách</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">3</span>
            <span className="text-sm">Thanh Toán Giả Lập</span>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Bộ khung Routing Đặt Phòng Sẵn Sàng</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Hệ thống đường dẫn <code className="text-primary-600 font-mono">/booking/step-1</code>, <code className="text-primary-600 font-mono">/booking/step-2</code>, <code className="text-primary-600 font-mono">/booking/step-3</code> sẽ được hiện thực toàn diện trong Sprint 2 (TASK-20, 22, 23).
          </p>
          <div className="pt-2">
            <Link to="/rooms" className="text-xs font-semibold text-primary-600 hover:underline">
              ← Quay lại chọn hạng phòng khác
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 4.4 Trang Đăng Nhập (/login) ---
function LoginPageView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-mono text-primary-600 uppercase font-bold tracking-wider">Route: /login</span>
          <h2 className="text-2xl font-serif font-bold text-slate-900">Đăng Nhập Nitro Grand Hotel</h2>
          <p className="text-xs text-slate-500">Đăng nhập bằng tài khoản phân quyền 4 cấp</p>
        </div>

        {/* Quick fill buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-600 block">Chọn nhanh tài khoản kiểm thử:</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => navigate('/staff/overview')}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 text-blue-900 font-medium hover:bg-blue-100 text-left transition-all cursor-pointer"
            >
              <span className="font-bold block text-[11px]">Lễ Tân (FRONT_DESK)</span>
              <span className="text-[10px] opacity-75">letan@nitrohotel.com</span>
            </button>
            <button
              onClick={() => navigate('/staff/dashboard')}
              className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 font-medium hover:bg-amber-100 text-left transition-all cursor-pointer"
            >
              <span className="font-bold block text-[11px]">Quản Lý (MANAGER)</span>
              <span className="text-[10px] opacity-75">manager@nitrohotel.com</span>
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-between items-center text-xs">
          <Link to="/" className="text-slate-500 hover:text-slate-800">
            ← Trở về Trang Chủ
          </Link>
          <button 
            onClick={() => navigate('/staff/overview')}
            className="px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 shadow-sm cursor-pointer"
          >
            Vào Trang Quản Trị →
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 4.5 Màn Hình Quản Trị 1: Tổng Quan Ca Trực (/staff/overview) ---
function StaffOverviewPageView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/overview</span>
          <h1 className="text-2xl font-bold text-slate-900">Bàn Giao Ca & Tổng Quan Vận Hành</h1>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
          CA SÁNG: 06:00 - 14:00
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">Khách Check-in Hôm Nay</span>
          <p className="text-2xl font-bold text-primary-600">8 Phòng</p>
          <span className="text-[11px] text-slate-400">3 phòng đã nhận thực tế</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">Khách Check-out Hôm Nay</span>
          <p className="text-2xl font-bold text-amber-600">5 Phòng</p>
          <span className="text-[11px] text-slate-400">2 phòng đã thanh toán xong</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">Phòng Cần Dọn Dẹp (Dirty)</span>
          <p className="text-2xl font-bold text-rose-600">2 Buồng</p>
          <span className="text-[11px] text-slate-400">Buồng phòng đang thực hiện</span>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-900 text-sm">Gợi ý chuyển nhanh Route trong Cổng Staff:</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link to="/staff/room-board" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">
            → Xem Sơ đồ buồng phòng (/staff/room-board)
          </Link>
          <Link to="/staff/bookings" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">
            → Xem Quản lý đơn phòng (/staff/bookings)
          </Link>
          <Link to="/staff/dashboard" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium">
            → Xem Báo cáo thống kê (/staff/dashboard)
          </Link>
        </div>
      </div>
    </div>
  );
}

// --- 4.6 Màn Hình Quản Trị 2: Sơ Đồ Buồng Phòng (/staff/room-board) ---
function RoomBoardPageView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/room-board</span>
          <h1 className="text-2xl font-bold text-slate-900">Sơ Đồ Buồng Phòng Trực Quan (32 Phòng)</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Trống ({MOCK_ROOMS.filter(r => r.status === 'AVAILABLE').length})</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Ở ({MOCK_ROOMS.filter(r => r.status === 'OCCUPIED').length})</span>
          <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Bẩn ({MOCK_ROOMS.filter(r => r.status === 'CLEANING').length})</span>
        </div>
      </div>

      {/* Grid 24 Phòng mẫu */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {MOCK_ROOMS.slice(0, 24).map((rm) => (
          <div 
            key={rm.id} 
            className={`p-3 rounded-xl border text-center space-y-1 transition-all ${
              rm.status === 'AVAILABLE' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' :
              rm.status === 'OCCUPIED' ? 'bg-rose-50/70 border-rose-200 text-rose-900' :
              rm.status === 'CLEANING' ? 'bg-amber-50/70 border-amber-200 text-amber-900' :
              'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <span className="font-bold text-sm block">P.{rm.number}</span>
            <span className="text-[10px] block opacity-75 font-mono">{rm.roomTypeCode} · Tầng {rm.floor}</span>
            <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/60">
              {rm.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4.7 Màn Hình Quản Trị 3: Quản Lý Đơn Đặt Phòng (/staff/bookings) ---
function BookingsListPageView() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/bookings</span>
        <h1 className="text-2xl font-bold text-slate-900">Danh Sách Đơn Đặt Phòng ({MOCK_BOOKINGS.length} Đơn Mẫu)</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Mã đơn</th>
              <th className="py-3 px-4">Tên khách hàng</th>
              <th className="py-3 px-4">Phòng</th>
              <th className="py-3 px-4">Nhận - Trả</th>
              <th className="py-3 px-4">Tổng tiền</th>
              <th className="py-3 px-4">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {MOCK_BOOKINGS.slice(0, 6).map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-mono font-bold text-primary-600">{b.bookingCode}</td>
                <td className="py-3 px-4 font-semibold text-slate-900">{b.guestName}</td>
                <td className="py-3 px-4 font-mono">P.{b.roomNumber || 'Chưa gán'}</td>
                <td className="py-3 px-4 text-slate-600">{b.checkInDate} → {b.checkOutDate}</td>
                <td className="py-3 px-4 font-bold text-emerald-600">{b.totalAmount.toLocaleString('vi-VN')} đ</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 4.8 Màn Hình Quản Trị 4: Báo Cáo Doanh Thu (/staff/dashboard) ---
function DashboardPageView() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/dashboard</span>
        <h1 className="text-2xl font-bold text-slate-900">Báo Cáo Hoạt Động & Chỉ Số Doanh Thu</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">Công Suất Phòng (Occupancy)</span>
          <p className="text-2xl font-bold text-primary-600">78.5%</p>
          <span className="text-[11px] text-emerald-600 font-semibold">↑ +4.2% so với tháng trước</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">Doanh Thu Tháng Này</span>
          <p className="text-2xl font-bold text-emerald-600">428.500.000 đ</p>
          <span className="text-[11px] text-emerald-600 font-semibold">↑ Vượt 12% chỉ tiêu</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">Tổng Số Lượt Đặt</span>
          <p className="text-2xl font-bold text-purple-600">142 Lượt</p>
          <span className="text-[11px] text-slate-400">Trung bình 2.4 đêm/đơn</span>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">Tỷ Lệ Hủy Phòng</span>
          <p className="text-2xl font-bold text-slate-700">3.8%</p>
          <span className="text-[11px] text-emerald-600">Mức an toàn (&lt; 5%)</span>
        </div>
      </div>
    </div>
  );
}

// --- 4.9 Màn hình Đặt phòng của tôi (/my-bookings) ---
function MyBookingsPageView() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /my-bookings</span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">Danh Sách Đặt Phòng Của Bạn</h1>
        <p className="text-xs text-slate-500 mt-1">Theo dõi mã đặt phòng, thời gian lưu trú và trạng thái thanh toán theo thời gian thực.</p>
      </div>

      <div className="space-y-4">
        {MOCK_BOOKINGS.map((b) => (
          <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-sm text-primary-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  {b.bookingCode}
                </span>
                <StatusBadge type="booking" status={b.status} />
                <StatusBadge type="source" status={b.source} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {b.paymentStatus}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base">{b.roomTypeName}</h3>
              <p className="text-xs text-slate-500">
                Nhận phòng: <span className="font-semibold text-slate-700">{b.checkInDate}</span> &bull; Trả phòng: <span className="font-semibold text-slate-700">{b.checkOutDate}</span> &bull; {b.nights} đêm
              </p>
            </div>
            <div className="text-right flex flex-col items-start md:items-end gap-1.5 w-full md:w-auto">
              <div className="text-lg font-bold text-primary-600">
                {b.totalAmount.toLocaleString('vi-VN')} đ
              </div>
              <span className="text-[11px] text-slate-400">Đã thanh toán {b.paidAmount.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4.10 Màn hình Liên hệ (/contact) ---
function ContactPageView() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4 text-center">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /contact</span>
        <h1 className="text-3xl font-serif font-bold text-slate-900">Liên Hệ Nitro Grand Hotel</h1>
        <p className="text-xs text-slate-500 mt-1">Đội ngũ chăm sóc khách hàng 4 sao sẵn sàng phục vụ 24/7</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center mx-auto">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Địa Chỉ Khách Sạn</h3>
          <p className="text-xs text-slate-500">24 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Phone className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Hotline Hỗ Trợ</h3>
          <p className="text-xs text-slate-500 font-semibold">1900 1234 &bull; 028 3822 9999</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Hòm Thư Điện Tử</h3>
          <p className="text-xs text-slate-500 font-semibold">booking@nitrohotel.vn</p>
        </div>
      </div>
    </div>
  );
}

// --- 4.11 Màn hình Hồ sơ Khách hàng (/profile) ---
function ProfilePageView() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /profile</span>
        <h1 className="text-2xl font-serif font-bold text-slate-900">Hồ Sơ Tài Khoản Của Bạn</h1>
        <p className="text-xs text-slate-500 mt-1">Thông tin định danh và hạng thẻ thành viên Nitro Rewards</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
            alt="Nguyễn Văn A"
            className="w-16 h-16 rounded-full object-cover border-2 border-primary-600"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Nguyễn Văn An</h2>
            <p className="text-xs text-slate-500">customer@gmail.com &bull; 0901 234 567</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-blue-50 text-primary-600 border border-blue-200 text-[11px] font-bold">
              Thành Viên VIP Gold (Giảm 10%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block">Số CMND / Hộ chiếu:</span>
            <span className="font-semibold text-slate-800">079099001234</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block">Quốc tịch:</span>
            <span className="font-semibold text-slate-800">Việt Nam</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block">Tổng đơn đã đặt:</span>
            <span className="font-semibold text-slate-800">3 Đơn thành công</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block">Điểm thưởng tích lũy:</span>
            <span className="font-semibold text-amber-600">1.250 Điểm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 4.12 Màn Hình 404 Không Tìm Thấy Trang (*) ---
function NotFoundPageView() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-2xl mx-auto">
        404
      </div>
      <h1 className="text-3xl font-serif font-bold text-slate-900">Không Tìm Thấy Trang Yêu Cầu</h1>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        Đường dẫn bạn vừa truy cập không tồn tại trong cấu hình bộ định tuyến của khách sạn.
      </p>
      <Link to="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold text-xs shadow-sm">
        <Home className="w-4 h-4" /> Quay Về Trang Chủ
      </Link>
    </div>
  );
}

// --- 4.13 Màn hình Lịch đặt phòng Timeline (/staff/timeline) ---
function BookingTimelinePageView() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/timeline</span>
        <h1 className="text-2xl font-bold text-slate-900">Lịch Biểu Đặt Phòng (Timeline PMS)</h1>
        <p className="text-xs text-slate-500 mt-1">Trực quan hóa lịch lưu trú và công suất 32 buồng phòng theo dòng thời gian.</p>
      </div>
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Tuần hiện tại: 24/09/2026 – 30/09/2026</span>
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Công suất dự kiến: 82%
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-center text-xs">
          {['T2 (24)', 'T3 (25)', 'T4 (26)', 'T5 (27)', 'T6 (28)', 'T7 (29)', 'CN (30)'].map((day, idx) => (
            <div key={day} className={`p-3 rounded-xl border ${idx === 0 ? 'bg-blue-50 border-primary-600 font-bold text-primary-600' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <span>{day}</span>
              <p className="text-[11px] mt-1 font-mono text-slate-500">{22 + idx} phòng kín</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 4.14 Màn hình Danh sách Khách hàng (/staff/customers) ---
function CustomersListPageView() {
  const customers = MOCK_USERS.filter((u) => u.role === 'CUSTOMER');
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/customers</span>
        <h1 className="text-2xl font-bold text-slate-900">Hồ Sơ Khách Hàng Lưu Trú</h1>
        <p className="text-xs text-slate-500 mt-1">Quản lý lịch sử lưu trú, định danh CCCD/Hộ chiếu và hạng thẻ Nitro Rewards.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Số điện thoại</th>
              <th className="py-3 px-4">Hạng thành viên</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-full object-cover" />
                  {c.name}
                </td>
                <td className="py-3 px-4 text-slate-600">{c.email}</td>
                <td className="py-3 px-4 font-mono">{c.phone}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    VIP Gold
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 4.15 Màn hình Quản lý Loại phòng (/staff/room-types) ---
function RoomTypesPageView() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/room-types</span>
        <h1 className="text-2xl font-bold text-slate-900">Danh Mục Hạng Phòng ({MOCK_ROOM_TYPES.length} Hạng)</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_ROOM_TYPES.map((rt) => (
          <div key={rt.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <img src={rt.image} alt={rt.name} className="w-full h-32 object-cover rounded-xl" />
            <h3 className="font-bold text-slate-900 text-sm">{rt.name}</h3>
            <p className="text-xs font-mono text-primary-600 font-bold">{rt.basePrice.toLocaleString('vi-VN')} đ / đêm</p>
            <span className="text-[11px] text-slate-500 block">Sức chứa: {rt.maxGuests || 2} khách &bull; {rt.area}m²</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4.16 Màn hình Quản lý Phòng (/staff/rooms) ---
function RoomsManagePageView() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/rooms</span>
        <h1 className="text-2xl font-bold text-slate-900">Quản Lý 32 Buồng Phòng Vật Lý</h1>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm text-xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {MOCK_ROOMS.map((r) => (
            <div key={r.id} className="p-2.5 rounded-lg border border-slate-200 text-center space-y-1">
              <span className="font-bold block text-slate-800">P.{r.number}</span>
              <StatusBadge type="room" status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 4.17 Màn hình Quản lý Dịch vụ (/staff/services) ---
function ServicesManagePageView() {
  const services = [
    { name: 'Buffet Sáng Quốc Tế', price: 250000, category: 'Ẩm thực' },
    { name: 'Đưa Đón Sân Bay Tân Sơn Nhất', price: 450000, category: 'Vận chuyển' },
    { name: 'Liệu Trình Spa Thư Giãn 60p', price: 650000, category: 'Sức khỏe' },
    { name: 'Giặt Ủi Lấy Ngay', price: 120000, category: 'Tiện ích' },
  ];
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/services</span>
        <h1 className="text-2xl font-bold text-slate-900">Dịch Vụ &amp; Tiện Ích Gia Tăng</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s.name} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{s.name}</h3>
              <span className="text-xs text-slate-400">{s.category}</span>
            </div>
            <span className="font-bold text-primary-600 text-sm">{s.price.toLocaleString('vi-VN')} đ</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4.18 Màn hình Báo cáo (/staff/reports) ---
function ReportsPageView() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/reports</span>
        <h1 className="text-2xl font-bold text-slate-900">Báo Cáo Tổng Hợp &amp; Xuất Dữ Liệu</h1>
      </div>
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs text-slate-600">
        <p>Hỗ trợ xuất báo cáo doanh thu, công suất buồng phòng (RevPAR, ADR) và thuế VAT theo chuẩn Kế toán Việt Nam.</p>
        <div className="flex gap-3">
          <Button variant="primary" size="sm">Xuất Excel Báo Cáo Tháng</Button>
          <Button variant="outline" size="sm">Xem Bản In PDF</Button>
        </div>
      </div>
    </div>
  );
}

// --- 4.19 Màn hình Người dùng & Phân quyền (/staff/users) ---
function UsersPermissionsPageView() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/users</span>
        <h1 className="text-2xl font-bold text-slate-900">Tài Khoản Nhân Sự &amp; Phân Quyền RBAC</h1>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Nhân sự</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Vai trò hệ thống</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_USERS.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                  {u.name}
                </td>
                <td className="py-3 px-4 text-slate-600">{u.email}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-primary-600 border border-blue-200">
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 4.20 Màn hình Cấu hình Hệ thống (/staff/settings) ---
function SystemSettingsPageView() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/settings</span>
        <h1 className="text-2xl font-bold text-slate-900">Cấu Hình Thông Số Khách Sạn</h1>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Giờ nhận phòng chuẩn:</span>
            <span className="font-bold text-slate-800 text-sm">14:00</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Giờ trả phòng chuẩn:</span>
            <span className="font-bold text-slate-800 text-sm">12:00</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Thuế VAT:</span>
            <span className="font-bold text-slate-800 text-sm">8%</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-400 block">Phí phục vụ:</span>
            <span className="font-bold text-slate-800 text-sm">5%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 4.21 Màn hình Nhật ký Hoạt động (/staff/logs) ---
function AuditLogsPageView() {
  const logs = [
    { time: '14:22:10', actor: 'Lễ tân Trần Thị B', action: 'Gán phòng 302 cho đơn NTR-260921-0042' },
    { time: '13:50:05', actor: 'Quản lý Lê Hoàng C', action: 'Điều chỉnh giá phòng Deluxe City View' },
    { time: '11:15:30', actor: 'Hệ thống tự động', action: 'Giải phóng phòng giữ quá 10 phút' },
  ];
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/logs</span>
        <h1 className="text-2xl font-bold text-slate-900">Nhật Ký Hoạt Động &amp; Vết Kiểm Toán (Audit Trail)</h1>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 text-xs">
        {logs.map((l, i) => (
          <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">{l.actor}</span>
              <p className="text-slate-500 mt-0.5">{l.action}</p>
            </div>
            <span className="font-mono text-slate-400 text-[11px]">{l.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4.22 Màn hình Đặt phòng Walk-in (/staff/walk-in) ---
function WalkInBookingPageView() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-mono text-primary-600 font-bold uppercase">Route: /staff/walk-in</span>
        <h1 className="text-2xl font-bold text-slate-900">Tạo Đặt Phòng Tại Quầy (Walk-in)</h1>
        <p className="text-xs text-slate-500 mt-1">Dành cho lễ tân tiếp đón khách vãng lai và làm thủ tục check-in tức thì.</p>
      </div>
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-bold text-slate-700">Họ và tên khách hàng:</label>
          <input type="text" placeholder="Nhập họ tên khách..." className="w-full p-2.5 rounded-xl border border-slate-200" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Số CCCD / Hộ chiếu:</label>
            <input type="text" placeholder="079..." className="w-full p-2.5 rounded-xl border border-slate-200" />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Số điện thoại:</label>
            <input type="text" placeholder="09..." className="w-full p-2.5 rounded-xl border border-slate-200" />
          </div>
        </div>
        <div className="pt-2">
          <Button variant="gold" size="md" className="w-full">
            Hoàn tất đặt phòng &amp; Check-in ngay
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. CÂY ĐỊNH TUYẾN CHÍNH (ROOT APP ROUTER COMPONENT)
// ============================================================================
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <TaskHeader />
        <Routes>
          {/* Phân hệ 1: Khách Hàng (Customer Layout) */}
          <Route path="/" element={<CustomerLayout />}>
            <Route index element={<HomePageView />} />
            <Route path="rooms" element={<RoomsPageView />} />
            <Route path="booking" element={<BookingPageView />} />
            <Route path="my-bookings" element={<MyBookingsPageView />} />
            <Route path="contact" element={<ContactPageView />} />
            <Route path="profile" element={<ProfilePageView />} />
            <Route path="components" element={<ComponentsShowcasePageView />} />
          </Route>

          {/* Phân hệ 2: Xác Thực (Auth) */}
          <Route path="/login" element={<LoginPageView />} />

          {/* Phân hệ 3: Quản Trị Staff (Staff Layout) */}
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<Navigate to="/staff/overview" replace />} />
            <Route path="overview" element={<StaffOverviewPageView />} />
            <Route path="room-board" element={<RoomBoardPageView />} />
            <Route path="timeline" element={<BookingTimelinePageView />} />
            <Route path="bookings" element={<BookingsListPageView />} />
            <Route path="customers" element={<CustomersListPageView />} />
            <Route path="dashboard" element={<DashboardPageView />} />
            <Route path="room-types" element={<RoomTypesPageView />} />
            <Route path="rooms" element={<RoomsManagePageView />} />
            <Route path="services" element={<ServicesManagePageView />} />
            <Route path="reports" element={<ReportsPageView />} />
            <Route path="users" element={<UsersPermissionsPageView />} />
            <Route path="settings" element={<SystemSettingsPageView />} />
            <Route path="logs" element={<AuditLogsPageView />} />
            <Route path="walk-in" element={<WalkInBookingPageView />} />
          </Route>

          {/* Fallback 404 */}
          <Route path="*" element={<NotFoundPageView />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
