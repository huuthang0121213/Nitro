/**
 * ============================================================================
 * TÊN FILE: ConflictModal.tsx
 * VỊ TRÍ: src/components/common/ConflictModal.tsx
 * PHÂN HỆ: Thành phần Giao diện Dùng chung (Common UI - Conflict Modal)
 * ----------------------------------------------------------------------------
 * TỔNG QUAN VÀ NGUYÊN LÝ HOẠT ĐỘNG:
 * - Hộp thoại cảnh báo xung đột đặt phòng (Room Conflict & Double Booking Alert).
 * - Kích hoạt khi phòng mà khách hàng đang chọn vừa được khách khác thanh toán thành công
 *   hoặc trong lúc nhân viên lễ tân đang kiểm thử kịch bản tranh chấp phòng.
 * - Cung cấp ngay các gợi ý phòng thay thế có cùng phân khúc/tiện ích nhằm giữ chân khách hàng.
 * ============================================================================
 */

import React from 'react';
import { AlertTriangle, ArrowRight, BedDouble, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Button } from './Button';
import { Modal } from './Modal';

export const ConflictModal: React.FC = () => {
  const { showConflictModal, setShowConflictModal } = useApp();
  const navigate = useNavigate();

  const handleSelectAlternative = (roomId: string) => {
    setShowConflictModal(false);
    navigate(`/rooms/${roomId}`);
  };

  return (
    <Modal
      isOpen={showConflictModal}
      onClose={() => setShowConflictModal(false)}
      title={
        <div className="flex items-center gap-2 text-rose-600">
          <AlertTriangle className="w-5 h-5" />
          <span>Phòng vừa được người khác đặt!</span>
        </div>
      }
      footer={
        <div className="flex justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowConflictModal(false);
              navigate('/rooms');
            }}
          >
            Quay lại danh sách phòng
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowConflictModal(false)}
          >
            Đã hiểu
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-[#475569]">
          Rất tiếc! Trong lúc bạn đang thao tác, một khách hàng khác đã hoàn tất
          thanh toán và đặt phòng này trước. Để tránh trùng lịch (overbooking), hệ thống
          đã tự động giải phóng vị trí.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
          <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
            Gợi ý phòng tương tự còn trống ngay lúc này:
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-200 hover:border-[#1F5AA6] transition cursor-pointer"
                 onClick={() => handleSelectAlternative('rt-dlx')}>
              <div className="flex items-center gap-2.5">
                <BedDouble className="w-4 h-4 text-[#1F5AA6]" />
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">Deluxe City View (Tầng 4)</div>
                  <div className="text-[11px] text-[#475569]">1.450.000 ₫ / đêm • Chỉ còn 2 phòng</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="h-7 text-xs">
                Chọn phòng này
              </Button>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-200 hover:border-[#1F5AA6] transition cursor-pointer"
                 onClick={() => handleSelectAlternative('rt-sup')}>
              <div className="flex items-center gap-2.5">
                <BedDouble className="w-4 h-4 text-[#1F5AA6]" />
                <div>
                  <div className="text-xs font-bold text-[#0F172A]">Superior Twin (Tầng 2)</div>
                  <div className="text-[11px] text-[#475569]">1.050.000 ₫ / đêm • Còn 4 phòng</div>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="h-7 text-xs">
                Chọn phòng này
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
