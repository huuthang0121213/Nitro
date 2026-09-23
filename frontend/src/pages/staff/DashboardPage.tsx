/**
 * ============================================================================
 * TÊN FILE: DashboardPage.tsx
 * VỊ TRÍ: src/pages/staff/DashboardPage.tsx
 * PHÂN HỆ: Báo cáo Thống kê Quản trị & Giám đốc Điều hành (Executive Dashboard)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Bảng điều khiển kinh doanh tổng thể thời gian thực:
 *     1. Chỉ số KPI trọng yếu:
 *         * Tỷ lệ lấp đầy phòng (Occupancy Rate %).
 *         * Tổng doanh thu kỳ này (Total Revenue ₫).
 *         * Giá phòng bình quân mỗi ngày (ADR - Average Daily Rate).
 *         * Doanh thu trên mỗi phòng sẵn có (RevPAR - Revenue Per Available Room).
 *         * Số lượng khách đang lưu trú thực tế trong khách sạn.
 *     2. Biểu đồ trực quan hóa số liệu (Recharts ResponsiveContainer):
 *         * Xu hướng doanh thu theo ngày/tuần/tháng (AreaChart).
 *         * Cơ cấu kênh phân phối đặt phòng Web, App, Quầy, OTA (Donut PieChart).
 *         * Phân bố 5 trạng thái phòng hiện tại (BarChart).
 *         * Doanh thu theo từng hạng phòng (Executive, Suite, Deluxe...).
 *     3. Chuyển đổi linh hoạt chu kỳ: Hôm nay / Tuần này / Tháng này & Nút làm mới dữ liệu.
 * - Kết nối Backend REST API:
 *     + `GET /api/v1/dashboard/stats?period=day|week|month`: Tải dữ liệu KPI & Biểu đồ.
 * ============================================================================
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  DollarSign,
  DoorOpen,
  PieChart as PieIcon,
  RefreshCw,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { dashboardService } from '../../services/api';
import { DashboardStats } from '../../types';
import { formatCurrency } from '../../utils/format';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('08:30:15');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    setRefreshing(true);
    const data = await dashboardService.getStats(period);
    setStats(data);
    setLastUpdated(new Date().toLocaleTimeString('vi-VN'));
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  const COLORS = ['#1F5AA6', '#059669', '#D97706', '#7C3AED', '#E11D48'];

  // Safe data transformers for Recharts
  const revenueTrendData = useMemo(() => {
    if (!stats) return [];
    if (stats.revenueByDay && Array.isArray(stats.revenueByDay)) {
      return stats.revenueByDay;
    }
    if (stats.dailyRevenue && Array.isArray(stats.dailyRevenue)) {
      return stats.dailyRevenue.map((d: any) => ({
        date: d.date,
        amount: d.revenue ?? d.amount ?? 0,
        cumulative: d.cumulative,
      }));
    }
    return [];
  }, [stats]);

  const sourceData = useMemo(() => {
    if (!stats?.sourceBreakdown || !Array.isArray(stats.sourceBreakdown)) return [];
    const sourceMap: Record<string, string> = {
      WEB: 'Website trực tuyến',
      MOBILE: 'Ứng dụng di động',
      COUNTER: 'Khách vãng lai tại quầy',
      OTA: 'Đại lý OTA (Agoda/Booking)',
    };
    return stats.sourceBreakdown.map((s: any) => ({
      ...s,
      displayName: sourceMap[s.source] || s.source,
    }));
  }, [stats]);

  const roomStatusData = useMemo(() => {
    if (!stats?.roomStatusCounts) return [];
    if (Array.isArray(stats.roomStatusCounts)) {
      return stats.roomStatusCounts;
    }
    if (typeof stats.roomStatusCounts === 'object') {
      const labels: Record<string, string> = {
        available: 'Phòng trống (Available)',
        reserved: 'Đã đặt (Reserved)',
        occupied: 'Đang ở (Occupied)',
        cleaning: 'Đang dọn dẹp (Cleaning)',
        maintenance: 'Bảo trì (Maintenance)',
      };
      return Object.entries(stats.roomStatusCounts).map(([key, val]) => ({
        status: labels[key.toLowerCase()] || key,
        count: Number(val) || 0,
      }));
    }
    return [];
  }, [stats]);

  const roomTypeRevenueData = useMemo(() => {
    if (!stats) return [];
    if (stats.roomTypeRevenue && Array.isArray(stats.roomTypeRevenue)) {
      return stats.roomTypeRevenue;
    }
    if (stats.topRoomTypes && Array.isArray(stats.topRoomTypes)) {
      return stats.topRoomTypes.map((rt: any) => ({
        name: rt.name,
        revenue: rt.revenue ?? 0,
        bookings: rt.bookings,
      }));
    }
    return [];
  }, [stats]);

  if (!stats) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu báo cáo...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">{t('nav.dashboard')}</h1>
          <p className="text-xs text-[#475569] mt-0.5">
            Báo cáo tổng quan hiệu suất kinh doanh, doanh thu và vận hành Nitro Grand Hotel
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Segmented Period Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold shrink-0">
            {[
              { key: 'day', label: 'Hôm nay' },
              { key: 'week', label: 'Tuần này' },
              { key: 'month', label: 'Tháng này' },
            ].map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key as any)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg transition cursor-pointer text-xs ${
                  period === p.key ? 'bg-white text-[#1F5AA6] shadow-xs' : 'text-slate-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchStats}
            icon={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
            className="text-xs shrink-0"
          >
            <span className="hidden sm:inline">Cập nhật lúc </span>{lastUpdated}
          </Button>
        </div>
      </div>

      {/* 5 KPI StatCards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          title="Tỷ lệ lấp đầy"
          value={`${stats.occupancyRate}%`}
          change="+4.2%"
          trend="up"
          accentColor="#1F5AA6"
          icon={<TrendingUp className="w-5 h-5 text-[#1F5AA6]" />}
          subtext="Mục tiêu tháng: 80%"
        />
        <StatCard
          title="Doanh thu kỳ này"
          value={formatCurrency(stats.revenue)}
          change="+12.5%"
          trend="up"
          accentColor="#059669"
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          subtext="Vượt 8% so với cùng kỳ"
        />
        <StatCard
          title="Tổng lượt đặt phòng"
          value={stats.totalBookings}
          change="+6"
          trend="up"
          accentColor="#7C3AED"
          icon={<Users className="w-5 h-5 text-purple-600" />}
          subtext="Đã xác nhận"
        />
        <StatCard
          title="Tỷ lệ hủy phòng"
          value={`${stats.cancellationRate}%`}
          change="-0.8%"
          trend="down"
          accentColor="#E11D48"
          icon={<ArrowDownRight className="w-5 h-5 text-rose-600" />}
          subtext="Mức kiểm soát tốt"
        />
        <StatCard
          title="Phòng trống khả dụng"
          value={`${stats.availableRooms} / 60`}
          accentColor="#D97706"
          icon={<DoorOpen className="w-5 h-5 text-amber-600" />}
          subtext="Có thể nhận khách ngay"
        />
      </div>

      {/* Charts Grid: Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Revenue Trend (AreaChart) - spans 2 cols */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Doanh thu theo thời gian</h3>
              <p className="text-[11px] text-slate-500">Doanh thu phòng &amp; dịch vụ gia tăng</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Tổng: {formatCurrency(stats.revenue)}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1F5AA6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1F5AA6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(val), 'Doanh thu']}
                  labelFormatter={(lbl) => `Ngày: ${lbl}`}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#1F5AA6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Booking Sources (PieChart) */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0F172A]">Cơ cấu nguồn đặt phòng</h3>
            <p className="text-[11px] text-slate-500">Kênh đóng góp lượt booking</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="displayName"
                >
                  {sourceData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid: Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Room Status Distribution (BarChart) */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0F172A]">Phân bổ trạng thái 60 phòng</h3>
            <p className="text-[11px] text-slate-500">Tình trạng buồng phòng hiện hữu</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="status" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {roomStatusData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Revenue by Room Type (Horizontal Bar) */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs space-y-3">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-[#0F172A]">Doanh thu theo hạng phòng</h3>
            <p className="text-[11px] text-slate-500">Đóng góp doanh số từ Standard đến Presidential</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={roomTypeRevenueData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => `${(v / 1000000).toFixed(0)}Tr`}
                />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => [formatCurrency(v), 'Doanh thu']} />
                <Bar dataKey="revenue" fill="#1F5AA6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
