/**
 * ============================================================================
 * TÊN FILE: StateViews.tsx
 * VỊ TRÍ: src/components/common/StateViews.tsx
 * PHÂN HỆ: Thành phần Giao diện Dùng chung (Common UI - State Views: Loading, Empty, Error)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Tập hợp các thành phần trực quan hóa trạng thái giao diện người dùng:
 *     + Skeleton: Khung xương tải trang mờ với hiệu ứng nhấp nháy (`animate-pulse`).
 *     + EmptyState: Trạng thái danh sách rỗng (không tìm thấy phòng, chưa có đơn đặt phòng nào).
 *     + ErrorState: Trạng thái xảy ra lỗi kèm nút bấm "Thử lại" (Retry Action).
 *     + LoadingOverlay: Lớp phủ mờ toàn màn hình khi đang xử lý thanh toán hoặc lưu dữ liệu.
 * ============================================================================
 */

import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}> = ({
  title,
  description,
  actionText,
  onAction,
  icon = <Inbox className="w-12 h-12 text-slate-300" />,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-[#E2E8F0] ${className}`}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-[#0F172A] mb-1">
        {title || t('common.empty')}
      </h3>
      {description && (
        <p className="text-sm text-[#475569] max-w-sm mb-4">{description}</p>
      )}
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title,
  description,
  onRetry,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-rose-50/50 rounded-xl border border-rose-200 ${className}`}
    >
      <AlertCircle className="w-10 h-10 text-rose-500 mb-3" />
      <h3 className="text-base font-semibold text-rose-900 mb-1">
        {title || t('common.error')}
      </h3>
      <p className="text-xs sm:text-sm text-rose-700 max-w-sm mb-4">
        {description || 'Không thể tải dữ liệu từ máy chủ. Vui lòng kiểm tra lại kết nối.'}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          icon={<RefreshCw className="w-4 h-4" />}
          className="border-rose-300 text-rose-800 hover:bg-rose-100"
        >
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
};
