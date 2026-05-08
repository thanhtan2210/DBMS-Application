import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, TriangleAlert } from 'lucide-react';
import { confirmPayment } from '@/modules/storefront/services/payment-service';

export function MomoReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState<string>('');

  const payload = useMemo(() => Object.fromEntries(searchParams.entries()), [searchParams]);

  useEffect(() => {
    const finalize = async () => {
      const transactionRef = payload.orderId || payload.requestId;
      const resultCode = payload.resultCode;

      if (!transactionRef) {
        setStatus('failed');
        setMessage('Không tìm thấy mã giao dịch từ MoMo.');
        return;
      }

      try {
        await confirmPayment({
          transactionRef,
          status: resultCode === '0' ? 'SUCCESS' : 'FAILED',
          rawPayload: JSON.stringify(payload),
        });

        if (resultCode === '0') {
          setStatus('success');
          setMessage('Thanh toán MoMo đã hoàn tất. Bạn sẽ được chuyển về trang chủ ngay bây giờ.');
          navigate('/', { replace: true });
        } else {
          setStatus('failed');
          setMessage(payload.message || 'Giao dịch chưa được hoàn tất. Bạn có thể thử lại từ trang thanh toán.');
        }
      } catch (error: any) {
        console.error(error);
        setStatus('failed');
        setMessage(error?.response?.data?.message || error?.message || 'Không thể xác nhận thanh toán MoMo.');
      }
    };

    finalize().catch(console.error);
  }, [navigate, payload]);

  return (
    <div className="container-custom py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-xl w-full rounded-[2rem] bg-white border border-postpurchase-border shadow-sm p-8 text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 mx-auto animate-spin text-postpurchase-accent" />
            <h1 className="mt-6 text-3xl font-bold">Đang xác nhận thanh toán</h1>
            <p className="mt-3 text-postpurchase-muted">Vui lòng chờ trong giây lát, chúng tôi đang kiểm tra kết quả từ MoMo.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-600" />
            <h1 className="mt-6 text-3xl font-bold">Thanh toán thành công</h1>
            <p className="mt-3 text-postpurchase-muted">{message}</p>
            <p className="mt-4 text-sm text-postpurchase-muted">Đang chuyển về trang chủ...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <TriangleAlert className="w-12 h-12 mx-auto text-amber-600" />
            <h1 className="mt-6 text-3xl font-bold">Thanh toán chưa hoàn tất</h1>
            <p className="mt-3 text-postpurchase-muted">{message}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link to="/checkout" className="rounded-full bg-postpurchase-accent px-6 py-3 text-white font-bold uppercase tracking-widest text-[10px]">
                Quay lại thanh toán
              </Link>
              <Link to="/" className="rounded-full border border-postpurchase-border px-6 py-3 font-bold uppercase tracking-widest text-[10px] text-postpurchase-muted">
                Về trang chủ
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}