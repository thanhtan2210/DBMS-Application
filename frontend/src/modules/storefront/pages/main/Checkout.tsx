import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Edit3, MapPin, Minus, Plus, PlusCircle, Save, Tag, Trash2, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCart } from "@lib/CartContext";
import { LoadingOverlay } from "@ui/LoadingStates";
import { createOrder } from "@/modules/admin/services/order-service";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerAddresses,
  updateCustomerAddress,
  AddressDTO,
} from "@/modules/admin/services/address-service";
import { applyPromotion } from "@/modules/admin/services/promotion-service";

type AddressFormState = {
  receiverName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
};

const createEmptyAddressForm = (): AddressFormState => ({
  receiverName: "",
  phone: "",
  street: "",
  ward: "",
  district: "",
  city: "",
  country: "Vietnam",
  postalCode: "",
  isDefault: false,
});

export function Checkout() {
  const { user } = useAuthStore();
  const { cart, removeFromCart, updateQuantity, selectItem, refreshCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address state
  const [addresses, setAddresses] = useState<AddressDTO[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormState>(createEmptyAddressForm());
  const [addressError, setAddressError] = useState<string | null>(null);

  // Promotion state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  const subtotal = Array.isArray(cart) ? cart.reduce((acc, item) => item.selectedFlag ? acc + item.unitPrice * item.quantity : acc, 0) : 0;
  const total = Math.max(0, subtotal - discount);

  const customerIdMap: Record<string, number> = {
    'alice@email.com': 2,
    'bob@email.com': 3,
    'carol@email.com': 4
  };
  const customerId = user ? (customerIdMap[user.email] || 2) : 2;

  const refreshAddresses = async (preferredAddressId?: number) => {
    setAddressLoading(true);
    try {
      const data = await getCustomerAddresses(customerId);
      setAddresses(data);

      if (data.length === 0) {
        setSelectedAddressId(null);
        return;
      }

      const preferredAddress = preferredAddressId ? data.find(address => address.addressId === preferredAddressId) : null;
      const currentSelectedAddress = selectedAddressId ? data.find(address => address.addressId === selectedAddressId) : null;
      const defaultAddress = data.find(address => address.isDefault);

      setSelectedAddressId(
        preferredAddress?.addressId ||
        currentSelectedAddress?.addressId ||
        defaultAddress?.addressId ||
        data[0].addressId
      );
    } catch (err) {
      console.error(err);
    } finally {
      setAddressLoading(false);
    }
  };

  const openCreateAddressModal = () => {
    setEditingAddressId(null);
    setAddressError(null);
    setAddressForm(createEmptyAddressForm());
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (address: AddressDTO) => {
    setEditingAddressId(address.addressId);
    setAddressError(null);
    setAddressForm({
      receiverName: address.receiverName || "",
      phone: address.phone || "",
      street: address.street || "",
      ward: address.ward || "",
      district: address.district || "",
      city: address.city || "",
      country: address.country || "Vietnam",
      postalCode: address.postalCode || "",
      isDefault: address.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
    setAddressError(null);
    setAddressForm(createEmptyAddressForm());
  };

  useEffect(() => {
    if (user) {
      refreshAddresses().catch(console.error);
    }
  }, [user, customerId]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoError(null);
    try {
      const response: any = await applyPromotion(promoCode, subtotal);
      // The API returns the discount amount in data.data or similar, depends on interceptor.
      const discountAmount = response.data || response;
      setDiscount(discountAmount);
      setAppliedPromo(promoCode);
      setPromoCode("");
    } catch (err: any) {
      console.error(err);
      setPromoError(err?.response?.data?.message || "Invalid or expired promotion code.");
      setDiscount(0);
      setAppliedPromo(null);
    }
  };

  const handleSaveAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddressSubmitting(true);
    setAddressError(null);

    try {
      const payload = {
        ...addressForm,
        country: addressForm.country.trim() || "Vietnam",
      };

      const savedAddress = editingAddressId
        ? await updateCustomerAddress(customerId, editingAddressId, payload)
        : await createCustomerAddress(customerId, payload);

      await refreshAddresses(savedAddress.addressId);
      closeAddressModal();
    } catch (err: any) {
      console.error(err);
      setAddressError(err?.response?.data?.message || err?.message || "Không thể lưu địa chỉ.");
    } finally {
      setAddressSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: number) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa địa chỉ này không?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteCustomerAddress(customerId, addressId);
      await refreshAddresses(selectedAddressId ?? undefined);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || err?.message || "Không thể xóa địa chỉ.");
    }
  };

  const handleCompleteOrder = async () => {
    console.log("Cart Items:", cart);
    const selectedItems = Array.isArray(cart) ? cart.filter(item => item.selectedFlag) : [];
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm trong giỏ hàng.");
      return;
    }
    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const payload: any = {
        customerId: customerId,
        shippingAddressId: selectedAddressId,
        selectedCartItemIds: selectedItems.map(item => item.cartItemId),
        paymentMethod: "COD"
      };

      if (appliedPromo) {
        payload.promotionCodes = [appliedPromo];
      }

      const placedOrder: any = await createOrder(payload);

      alert("Đặt hàng thành công! Chuyển sang bước thanh toán.");
      refreshCart();
      navigate(`/payment/${placedOrder.orderId}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || err?.message || "Đặt hàng thất bại.");
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="container-custom py-40 flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold mb-6">Identity Required</h1>
        <Link to="/login" className="bg-postpurchase-accent text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-xs">
          Sign In to Checkout
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-24">
      {processing && <LoadingOverlay />}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-16">
          <div>
            <h1 className="text-4xl font-bold mb-12">Your Cart</h1>
            <div className="space-y-12">
              {Array.isArray(cart) && cart.length > 0 ? cart.map(item => (
                <div key={item.cartItemId} className="flex gap-8 group items-center">
                  <input
                    type="checkbox"
                    checked={item.selectedFlag}
                    onChange={(e) => selectItem(item.cartItemId, e.target.checked)}
                  />
                  <img
                    src={item.variant.imageUrl}
                    alt={item.variant.variantName}
                    className="w-20 h-20 object-cover rounded-2xl bg-postpurchase-card"
                  />
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{item.variant.product?.productName || item.variant.variantName}</h3>
                        {item.variant.product && <p className="text-xs text-postpurchase-muted">{item.variant.variantName}</p>}
                      </div>
                      <span className="font-bold">${(item.unitPrice * item.quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}><Minus className="w-4 h-4" /></button>
                      <span className="text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}><Plus className="w-4 h-4" /></button>
                      <button onClick={() => removeFromCart(item.cartItemId)}><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-postpurchase-muted">Giỏ hàng của bạn đang trống.</p>
              )}
            </div>
          </div>

          {/* Addresses Section */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2"><MapPin className="w-6 h-6" /> Shipping Address</h2>
              <button
                type="button"
                onClick={openCreateAddressModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-postpurchase-accent text-white hover:opacity-90 transition-opacity"
              >
                <PlusCircle className="w-4 h-4" /> New Address
              </button>
            </div>
            {addressLoading ? (
              <p className="text-postpurchase-muted italic">Đang tải địa chỉ...</p>
            ) : addresses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map(addr => (
                  <div
                    key={addr.addressId}
                    onClick={() => setSelectedAddressId(addr.addressId)}
                    className={`p-6 border rounded-2xl cursor-pointer transition-all ${selectedAddressId === addr.addressId ? 'border-postpurchase-accent shadow-md bg-postpurchase-accent/5' : 'border-postpurchase-border hover:border-postpurchase-muted'}`}
                  >
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <div>
                        <h4 className="font-bold">{addr.receiverName}</h4>
                        {addr.isDefault && <span className="inline-flex mt-2 text-[10px] bg-postpurchase-card px-2 py-1 rounded font-bold uppercase text-postpurchase-muted">Default</span>}
                      </div>
                      <div className="flex items-center gap-1" onClick={(event) => event.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => openEditAddressModal(addr)}
                          className="p-2 rounded-full text-postpurchase-muted hover:text-postpurchase-accent hover:bg-white/70 transition-colors"
                          aria-label="Edit address"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.addressId)}
                          className="p-2 rounded-full text-postpurchase-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-postpurchase-muted mb-1">{addr.phone}</p>
                    <p className="text-sm text-postpurchase-muted line-clamp-2">{addr.street}{addr.ward ? `, ${addr.ward}` : ""}{addr.district ? `, ${addr.district}` : ""}, {addr.city}, {addr.country}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-postpurchase-border bg-white/60 p-8 text-center">
                <p className="text-postpurchase-muted italic mb-4">Không tìm thấy địa chỉ giao hàng.</p>
                <button
                  type="button"
                  onClick={openCreateAddressModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-postpurchase-card text-postpurchase-accent hover:bg-postpurchase-border transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Add your first address
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm sticky top-32 border border-postpurchase-border/50">
            <h3 className="text-2xl font-bold mb-8">Order Summary</h3>

            {/* Promo Code Input */}
            <div className="mb-8">
              <label className="text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2 flex items-center gap-1"><Tag className="w-3 h-3" /> Promotion Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="w-full border border-postpurchase-border rounded-lg px-4 text-sm uppercase"
                  disabled={appliedPromo !== null}
                />
                {appliedPromo ? (
                  <button onClick={() => { setAppliedPromo(null); setDiscount(0); }} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold hover:bg-red-200">Remove</button>
                ) : (
                  <button onClick={handleApplyPromo} className="px-4 py-2 bg-postpurchase-card text-postpurchase-accent rounded-lg text-sm font-bold hover:bg-postpurchase-border">Apply</button>
                )}
              </div>
              {promoError && <p className="text-red-500 text-[10px] mt-2">{promoError}</p>}
              {appliedPromo && <p className="text-emerald-500 text-[10px] mt-2 font-bold">Promo '{appliedPromo}' applied! (-${discount.toLocaleString()})</p>}
            </div>

            <div className="space-y-4 mb-8 pt-6 border-t border-postpurchase-border">
              <div className="flex justify-between text-sm">
                <span className="text-postpurchase-muted">Subtotal</span>
                <span className="font-bold">${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-emerald-500 font-bold">
                  <span>Discount</span>
                  <span>-${discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xl pt-4 border-t border-postpurchase-border">
                <span className="font-bold">Total</span>
                <span className="font-bold">${total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                console.log("Nút Complete Order đã được nhấn!");
                handleCompleteOrder();
              }}
              className="w-full bg-postpurchase-accent text-white py-5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {processing ? "Processing..." : "Complete Order"}
            </button>
            {error && <p className="text-red-500 mt-4 text-xs text-center">{error}</p>}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAddressModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
            onClick={closeAddressModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl border border-postpurchase-border"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-postpurchase-muted mb-2">
                    {editingAddressId ? "Update address" : "Create address"}
                  </p>
                  <h3 className="text-2xl font-bold">{editingAddressId ? "Sửa địa chỉ giao hàng" : "Thêm địa chỉ giao hàng mới"}</h3>
                </div>
                <button
                  type="button"
                  onClick={closeAddressModal}
                  className="p-2 rounded-full text-postpurchase-muted hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Close address dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSaveAddress}>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2">Receiver Name</label>
                  <input
                    type="text"
                    value={addressForm.receiverName}
                    onChange={(event) => setAddressForm({ ...addressForm, receiverName: event.target.value })}
                    className="w-full rounded-2xl border border-postpurchase-border px-4 py-3 outline-none focus:border-postpurchase-accent"
                    placeholder="Nguyen Van A"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2">Phone</label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })}
                    className="w-full rounded-2xl border border-postpurchase-border px-4 py-3 outline-none focus:border-postpurchase-accent"
                    placeholder="+84 912 345 678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2">Street</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(event) => setAddressForm({ ...addressForm, street: event.target.value })}
                    className="w-full rounded-2xl border border-postpurchase-border px-4 py-3 outline-none focus:border-postpurchase-accent"
                    placeholder="123 Nguyen Hue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2">Ward</label>
                  <input
                    type="text"
                    value={addressForm.ward}
                    onChange={(event) => setAddressForm({ ...addressForm, ward: event.target.value })}
                    className="w-full rounded-2xl border border-postpurchase-border px-4 py-3 outline-none focus:border-postpurchase-accent"
                    placeholder="Ben Nghe"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2">District</label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(event) => setAddressForm({ ...addressForm, district: event.target.value })}
                    className="w-full rounded-2xl border border-postpurchase-border px-4 py-3 outline-none focus:border-postpurchase-accent"
                    placeholder="District 1"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2">City</label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })}
                    className="w-full rounded-2xl border border-postpurchase-border px-4 py-3 outline-none focus:border-postpurchase-accent"
                    placeholder="Ho Chi Minh City"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2">Country</label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(event) => setAddressForm({ ...addressForm, country: event.target.value })}
                    className="w-full rounded-2xl border border-postpurchase-border px-4 py-3 outline-none focus:border-postpurchase-accent"
                    placeholder="Vietnam"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-postpurchase-muted mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(event) => setAddressForm({ ...addressForm, postalCode: event.target.value })}
                    className="w-full rounded-2xl border border-postpurchase-border px-4 py-3 outline-none focus:border-postpurchase-accent"
                    placeholder="700000"
                  />
                </div>

                <label className="md:col-span-2 inline-flex items-center gap-3 text-sm text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(event) => setAddressForm({ ...addressForm, isDefault: event.target.checked })}
                    className="w-4 h-4 rounded border-postpurchase-border text-postpurchase-accent focus:ring-postpurchase-accent"
                  />
                  Set as default address
                </label>

                {addressError && <p className="md:col-span-2 text-sm text-red-500">{addressError}</p>}

                <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeAddressModal}
                    className="px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest border border-postpurchase-border text-postpurchase-muted hover:text-slate-900 hover:border-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addressSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-postpurchase-accent text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {addressSubmitting ? "Saving..." : editingAddressId ? "Save Changes" : "Create Address"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
