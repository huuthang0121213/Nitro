/**
 * ============================================================================
 * TÊN FILE: HoldCountdown.tsx
 * VỊ TRÍ: src/components/common/HoldCountdown.tsx
 * PHÂN HỆ: Thành phần Giao diện Dùng chung (Common UI - Hold Countdown Timer)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Đồng hồ đếm ngược thời gian giữ phòng tạm thời trong tiến trình đặt phòng (Checkout).
 * - Hiển thị phút:giây còn lại (mặc định khởi tạo 10:00).
 * - Tự động đổi màu sang viền đỏ cảnh báo và hiệu ứng nhấp nháy (`animate-pulse`)
 *   khi thời gian còn dưới 2 phút nhằm thúc đẩy khách hàng hoàn tất bước thanh toán.
 * ============================================================================
 */

import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../context/AppContext';

interface HoldCountdownProps {
  className?: string;
  onExpired?: () => void;
}

export const HoldCountdown: React.FC<HoldCountdownProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const { holdCountdown, isHoldExpired } = useApp();

  const minutes = Math.floor(holdCountdown / 60);
  const seconds = holdCountdown % 60;
  const isUrgent = holdCountdown < 120; // less than 2 minutes

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
        isUrgent
          ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      } ${className}`}
      role="timer"
      aria-live="polite"
    >
      {isUrgent ? (
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
      ) : (
        <Clock className="w-4 h-4 text-amber-600 shrink-0" />
      )}
      <span className="text-xs sm:text-sm font-medium">
        {t('booking.holdTitle')}{' '}
        <span className="font-bold tabular-nums text-sm sm:text-base">
          {isHoldExpired ? '00:00' : formattedTime}
        </span>
      </span>
    </div>
  );
};
