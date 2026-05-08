import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Banknote, CreditCard, Loader2, ShieldCheck, Smartphone } from 'lucide-react';
import { getOrderById } from '@/modules/admin/services/order-service';
import { getPaymentByOrderId, initiatePayment, type PaymentInitiationResponse, type PaymentMethodChoice } from '@/modules/storefront/services/payment-service';

type OrderSummary = {
  orderId: number;
  orderCode: string;
  paymentStatus: string;
  totalAmount: number;
  subtotalAmount: number;
  createdAt: string;
  shippingAddress?: {
    receiverName?: string;
    phone?: string;
    fullAddress?: string;
  };
  items?: Array<{
    productName: string;
    variantName: string;
    quantity: number;
    lineTotal: number;
  }>;
};

const paymentOptions: Array<{
  value: PaymentMethodChoice;
  title: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'COD',
    title: 'Thanh toán khi nhận hàng',
    description: 'Đơn hàng sẽ được ghi nhận và bạn quay lại trang chủ ngay sau khi xác nhận.',
    icon: <Banknote className="w-5 h-5" />,
  },
  {
    value: 'MOMO',
    title: 'Ví MoMo',
    description: 'Mở cổng thanh toán MoMo sandbox để hoàn tất giao dịch như người dùng thật.',
    icon: <CreditCard className="w-5 h-5" />,
  },
];

export function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const parsedOrderId = Number(orderId);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [payment, setPayment] = useState<PaymentInitiationResponse['payment'] | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodChoice>('MOMO');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!parsedOrderId) {
        setError('Thiếu mã đơn hàng.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const orderData = await getOrderById(parsedOrderId);
        setOrder(orderData);

        try {
          const existingPayment = await getPaymentByOrderId(parsedOrderId);
          setPayment(existingPayment);
          setSelectedMethod(existingPayment.paymentMethod === 'COD' ? 'COD' : 'MOMO');

          if (existingPayment.paymentStatus === 'SUCCESS') {
            setMessage('Thanh toán đã hoàn tất. Bạn sẽ được chuyển về trang chủ để tiếp tục mua sắm.');
          } else {
            setMessage('Đơn hàng đã có thông tin thanh toán. Bạn có thể tiếp tục thanh toán với MoMo.');
          }
        } catch {
          setPayment(null);
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || err?.message || 'Không tải được thông tin đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    load().catch(console.error);
  }, [parsedOrderId]);

  const handleStartPayment = async () => {
    if (!parsedOrderId) {
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await initiatePayment({
        orderId: parsedOrderId,
        paymentMethod: selectedMethod,
        paymentProvider: selectedMethod === 'MOMO' ? 'MOMO_SANDBOX' : 'COD',
      });

      setPayment(response.payment);

      if (selectedMethod === 'COD') {
        setMessage('Đơn hàng đã được ghi nhận. Bạn sẽ được chuyển về trang chủ ngay bây giờ.');
        navigate('/');
        return;
      }

      if (response.payUrl) {
        window.location.assign(response.payUrl);
        return;
      }

      setError('MoMo chưa trả về đường dẫn thanh toán. Vui lòng thử lại.');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || 'Không thể mở cổng thanh toán MoMo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-postpurchase-muted">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading payment details...
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="container-custom py-24">
        <div className="max-w-2xl mx-auto rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-red-700 font-medium mb-4">{error}</p>
          <Link to="/checkout" className="inline-flex items-center gap-2 rounded-full bg-postpurchase-accent px-6 py-3 text-white font-bold uppercase tracking-widest text-[10px]">
            <ArrowLeft className="w-4 h-4" /> Back to checkout
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-24">
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] bg-white border border-postpurchase-border p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <Link to="/checkout" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-postpurchase-muted hover:text-postpurchase-accent transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to checkout
              </Link>
              <h1 className="text-4xl font-bold tracking-tight">Payment</h1>
              <p className="text-postpurchase-muted mt-2">Chọn phương thức thanh toán cho đơn {order?.orderCode || parsedOrderId}.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-600">
              <ShieldCheck className="w-4 h-4" /> MoMo sandbox
            </div>
          </div>

          <div className="grid gap-4">
            {paymentOptions.map((option) => {
              const active = selectedMethod === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedMethod(option.value)}
                  className={`text-left rounded-[1.5rem] border p-5 transition-all ${active ? 'border-postpurchase-accent bg-postpurchase-accent/5 shadow-sm' : 'border-postpurchase-border hover:border-postpurchase-muted bg-white'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 flex h-10 w-10 items-center justify-center rounded-full ${active ? 'bg-postpurchase-accent text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-bold">{option.title}</h2>
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${active ? 'bg-postpurchase-accent text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {option.value}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-postpurchase-muted">{option.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStartPayment}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-postpurchase-accent px-6 py-3 text-white font-bold uppercase tracking-widest text-[10px] disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
              {selectedMethod === 'MOMO' ? 'Mở MoMo để thanh toán' : 'Xác nhận và quay về trang chủ'}
            </button>
          </div>

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-6 rounded-[2rem] bg-[#10182a] p-8 text-white shadow-xl">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/60">Order summary</p>
            <h2 className="mt-3 text-2xl font-bold">{order?.orderCode || 'Order details'}</h2>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-5 border border-white/10">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>Total amount</span>
              <span>Trạng thái</span>
            </div>
            <div className="mt-2 flex items-end justify-between gap-4">
              <p className="text-3xl font-bold">${Number(order?.totalAmount || 0).toLocaleString()}</p>
              <p className="text-sm font-bold uppercase tracking-widest text-white">{payment?.paymentStatus || order?.paymentStatus || 'PENDING'}</p>
            </div>
          </div>

          <div className="grid gap-4 text-sm text-white/80">
            <div className="rounded-2xl bg-white/8 p-4 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Shipping address</p>
              <p className="font-medium">{order?.shippingAddress?.receiverName || '-'}</p>
              <p>{order?.shippingAddress?.phone || '-'}</p>
              <p className="mt-1">{order?.shippingAddress?.fullAddress || '-'}</p>
            </div>

            <div className="rounded-2xl bg-white/8 p-4 border border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Payment record</p>
              <p>Phương thức: {payment?.paymentMethod || selectedMethod}</p>
              <p>Kênh thanh toán: {payment?.paymentProvider || selectedMethod}</p>
              <p>Mã giao dịch: {payment?.transactionRef || 'Sẽ được tạo khi bạn mở MoMo'}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-500/10 p-4 border border-blue-400/20 text-sm text-blue-100">
            {selectedMethod === 'COD'
              ? 'Bạn đã chọn thanh toán khi nhận hàng. Đơn hàng sẽ được ghi nhận và quay về trang chủ.'
              : 'Bạn đã chọn MoMo Sandbox. Hệ thống sẽ mở cổng thanh toán thật để hoàn tất giao dịch.'}
          </div>
        </div>
      </div>
    </div>
  );
}
