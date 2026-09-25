/**
 * ============================================================================
 * TÊN FILE: StatCard.tsx
 * VỊ TRÍ: src/components/common/StatCard.tsx
 * PHÂN HỆ: Thành phần Giao diện Dùng chung (Common UI - Metric Card Component)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Thẻ hiển thị chỉ số thống kê & KPI tổng quan trên Dashboard và Trang Báo cáo:
 *     + Doanh thu (Revenue), Công suất phòng (Occupancy Rate)
 *     + Doanh thu trên mỗi phòng sẵn có (RevPAR), Giá phòng trung bình (ADR)
 *     + Tỷ lệ hủy phòng (Cancellation Rate - hỗ trợ xu hướng đảo ngược `isInverseTrend`)
 * - Trình bày con số dạng `tabular-nums`, biểu tượng tăng/giảm phần trăm so với kỳ trước.
 * ============================================================================
 */

import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  diff?: number; // e.g. +5.1 or -1.4
  diffLabel?: string;
  change?: string | number;
  trend?: 'up' | 'down';
  accentColor?: string;
  subtext?: string;
  icon?: React.ReactNode;
  subtitle?: string;
  isInverseTrend?: boolean; // e.g. cancellation rate where down is positive
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  diff,
  diffLabel = 'so với kỳ trước',
  change,
  trend,
  accentColor,
  subtext,
  icon,
  subtitle,
  isInverseTrend = false,
  className = '',
}) => {
  const displayDiff = change !== undefined ? String(change) : diff !== undefined ? `${diff > 0 ? '+' : ''}${diff}%` : null;
  const isPositive = trend ? trend === 'up' : diff !== undefined ? diff >= 0 : true;
  const isGood = isInverseTrend ? !isPositive : isPositive;

  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs sm:text-sm font-semibold text-[#475569] truncate">{title}</span>
        {icon && (
          <div
            className="p-2 rounded-xl bg-[#EAF2FB] text-[#1F5AA6] shrink-0"
            style={accentColor ? { color: accentColor, backgroundColor: `${accentColor}15` } : {}}
          >
            {icon}
          </div>
        )}
      </div>

      <div>
        <div className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tabular-nums tracking-tight">
          {value}
        </div>

        {displayDiff && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span
              className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded ${
                isGood
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-rose-700 bg-rose-50'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {displayDiff}
            </span>
            <span className="text-[11px] text-[#475569]">{diffLabel}</span>
          </div>
        )}

        {(subtext || subtitle) && (
          <div className="text-[11px] text-[#475569] mt-1.5 truncate">
            {subtext || subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
