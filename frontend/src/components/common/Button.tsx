/**
 * ============================================================================
 * TÊN FILE: Button.tsx
 * VỊ TRÍ: src/components/common/Button.tsx
 * PHÂN HỆ: Thành phần Giao diện Dùng chung (Common UI - Button Component)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Thành phần nút bấm cơ sở tiêu chuẩn của hệ thống thiết kế Nitro Grand Hotel.
 * - Hỗ trợ đa dạng biến thể màu sắc thương hiệu:
 *     + primary: Xanh dương hoàng gia (#1F5AA6)
 *     + secondary: Xanh nhạt tinh tế (#EAF2FB)
 *     + outline: Viền mỏng thanh lịch nền trắng
 *     + ghost: Nút trong suốt chỉ hiện nền khi hover
 *     + danger: Đỏ cảnh báo (#DC2626) cho thao tác hủy/xóa
 *     + gold: Vàng ánh kim (#C9A227) cho các gói phòng hoặc ưu đãi VIP
 * - Tích hợp sẵn trạng thái đang tải (`loading` spinner), vô hiệu hóa (`disabled`)
 *   và tự động đảm bảo kích thước chạm tối thiểu (Touch Target 40px+).
 * ============================================================================
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none whitespace-nowrap min-h-[40px]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2 h-10 gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3 h-12 gap-2.5 min-h-[48px]',
  };

  const variantStyles = {
    primary:
      'bg-[#1F5AA6] hover:bg-[#184A8A] active:bg-[#13396D] text-white focus:ring-[#1F5AA6] shadow-sm',
    secondary:
      'bg-[#EAF2FB] hover:bg-[#D5E5F7] text-[#1F5AA6] focus:ring-[#1F5AA6]',
    outline:
      'border border-[#E2E8F0] hover:bg-slate-50 text-[#0F172A] focus:ring-[#1F5AA6] bg-white',
    ghost:
      'hover:bg-slate-100 text-[#475569] hover:text-[#0F172A] focus:ring-slate-300',
    danger:
      'bg-[#DC2626] hover:bg-red-700 text-white focus:ring-[#DC2626] shadow-sm',
    gold:
      'bg-[#C9A227] hover:bg-[#A8861D] text-white font-semibold focus:ring-[#C9A227] shadow-sm',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
