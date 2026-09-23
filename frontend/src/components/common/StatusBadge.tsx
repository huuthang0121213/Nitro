/**
 * ============================================================================
 * TÊN FILE: StatusBadge.tsx
 * VỊ TRÍ: src/components/common/StatusBadge.tsx
 * PHÂN HỆ: Thành phần Giao diện Dùng chung (Common UI - Status Badge Component)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Huy hiệu trực quan hóa trạng thái với biểu tượng nhỏ và màu sắc phân biệt:
 *     + type='booking': Trạng thái đặt phòng (Chờ xác nhận, Đã xác nhận, Đang ở, Đã trả phòng, Đã hủy).
 *     + type='room': Trạng thái buồng phòng (Sẵn sàng, Đã đặt, Đang ở, Đang dọn, Bảo trì).
 *     + type='source': Kênh phân phối đặt phòng (Website, Mobile App, Tại quầy, Đại lý OTA).
 * - Tự động cập nhật ngôn ngữ nhãn (VI/EN) theo ngôn ngữ đang chọn trong AppContext.
 * ============================================================================
 */

import React from 'react';
import {
  CheckCircle2,
  Clock,
  Globe,
  Key,
  LogOut,
  Smartphone,
  Store,
  TimerOff,
  UserX,
  Wrench,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingSource, BookingStatus, RoomStatus } from '../../types';
import {
  BOOKING_SOURCE_MAP,
  BOOKING_STATUS_MAP,
  ROOM_STATUS_MAP,
} from '../../utils/format';

interface StatusBadgeProps {
  type: 'booking' | 'room' | 'source';
  status: BookingStatus | RoomStatus | BookingSource;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  status,
  size = 'md',
  className = '',
}) => {
  const { language } = useApp();
  const isEn = language === 'en';

  if (type === 'booking') {
    const s = status as BookingStatus;
    const config = BOOKING_STATUS_MAP[s] || BOOKING_STATUS_MAP.PENDING;

    const renderIcon = () => {
      const iconProps = { className: size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5' };
      switch (s) {
        case 'PENDING':
          return <Clock {...iconProps} />;
        case 'CONFIRMED':
          return <CheckCircle2 {...iconProps} />;
        case 'CHECKED_IN':
          return <Key {...iconProps} />;
        case 'CHECKED_OUT':
          return <LogOut {...iconProps} />;
        case 'CANCELLED':
          return <XCircle {...iconProps} />;
        case 'EXPIRED':
          return <TimerOff {...iconProps} />;
        case 'NO_SHOW':
          return <UserX {...iconProps} />;
        default:
          return <Clock {...iconProps} />;
      }
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border px-2.5 py-0.5 select-none ${
          size === 'sm' ? 'text-xs' : 'text-xs md:text-sm'
        } ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
      >
        {renderIcon()}
        <span>{isEn ? config.labelEn : config.labelVi}</span>
      </span>
    );
  }

  if (type === 'room') {
    const s = status as RoomStatus;
    const config = ROOM_STATUS_MAP[s] || ROOM_STATUS_MAP.AVAILABLE;

    const renderRoomIcon = () => {
      const iconProps = { className: size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5' };
      switch (s) {
        case 'AVAILABLE':
          return <CheckCircle2 {...iconProps} />;
        case 'RESERVED':
          return <Clock {...iconProps} />;
        case 'OCCUPIED':
          return <Key {...iconProps} />;
        case 'CLEANING':
          return <Clock {...iconProps} />;
        case 'MAINTENANCE':
          return <Wrench {...iconProps} />;
        default:
          return null;
      }
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border px-2.5 py-0.5 select-none ${
          size === 'sm' ? 'text-xs' : 'text-xs md:text-sm'
        } ${config.bgColor} ${config.textColor} ${config.borderColor} ${className}`}
      >
        {renderRoomIcon()}
        <span>{isEn ? config.labelEn : config.labelVi}</span>
      </span>
    );
  }

  if (type === 'source') {
    const s = status as BookingSource;
    const config = BOOKING_SOURCE_MAP[s] || BOOKING_SOURCE_MAP.WEB;

    const renderSourceIcon = () => {
      const iconProps = { className: 'w-3.5 h-3.5' };
      switch (s) {
        case 'WEB':
          return <Globe {...iconProps} />;
        case 'MOBILE':
          return <Smartphone {...iconProps} />;
        case 'COUNTER':
          return <Store {...iconProps} />;
      }
    };

    return (
      <span
        className={`inline-flex items-center gap-1 font-medium rounded-full border px-2.5 py-0.5 text-xs select-none ${config.bgColor} ${className}`}
      >
        {renderSourceIcon()}
        <span>{isEn ? config.labelEn : config.labelVi}</span>
      </span>
    );
  }

  return null;
};
