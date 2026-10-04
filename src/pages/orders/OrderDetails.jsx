import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Printer, MapPin, User, Mail, Phone, CreditCard } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { OrderStatusSelect } from "../../components/orders/OrderStatusSelect";
import { OrderItems } from "../../components/orders/OrderItems";
import { PrescriptionDetails } from "../../components/orders/PrescriptionDetails";
import { TrackingForm } from "../../components/orders/TrackingForm";
import { InvoicePreview } from "../../components/orders/InvoicePreview";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrderStatus, updateTracking, loading } = useOrders();
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const order = orderId ? getOrder(orderId) : void 0;
  if (loading) {
    return <Loader message="Loading order details..." fullPage />;
  }
  if (!order) {
    return <PageContainer>
        <ErrorMessage
      title="Order Not Found"
      message={`Order with identifier "${orderId}" could not be located.`}
      onRetry={() => navigate("/orders")}
    />
      </PageContainer>;
  }
  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update order status");
    }
  };
  const handleSaveTracking = async (courierName, trackingId) => {
    try {
      await updateTracking(order.id, courierName, trackingId);
      toast.success("Tracking details saved");
    } catch {
      toast.error("Failed to update courier tracking");
    }
  };
  return <PageContainer>
      <PageHeader
    title={`Order ${order.orderNumber}`}
    description={`Placed on ${formatDate(order.orderDate)}`}
    backUrl="/orders"
    actions={<div className="flex items-center gap-3">
            <Button
      variant="outline"
      size="sm"
      onClick={() => setIsInvoiceOpen(true)}
      icon={<Printer className="w-4 h-4" />}
    >
              Print Invoice
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Status:</span>
              <OrderStatusSelect
      currentStatus={order.orderStatus}
      onStatusChange={handleStatusChange}
    />
            </div>
          </div>}
  />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {
    /* Main Content Area (8 Cols) */
  }
        <div className="lg:col-span-8 space-y-6">
          {
    /* Ordered Line Items */
  }
          <OrderItems
    items={order.items}
    subtotal={order.subtotal}
    discountAmount={order.discountAmount}
    couponCode={order.couponCode}
    shippingFee={order.shippingFee}
    totalAmount={order.totalAmount}
  />

          {
    /* Optical Prescription Parameters */
  }
          <PrescriptionDetails prescription={order.prescription} />

          {
    /* Courier Tracking Details */
  }
          <TrackingForm
    tracking={order.tracking}
    onSaveTracking={handleSaveTracking}
  />
        </div>

        {
    /* Sidebar Info (4 Cols) */
  }
        <div className="lg:col-span-4 space-y-6">
          {
    /* Customer Profile Card */
  }
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Customer Details
            </h2>

            <div className="space-y-2 text-xs">
              <p className="text-sm font-bold text-slate-900">{order.customer.name}</p>

              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{order.customer.email}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{order.customer.phone}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
    type="button"
    onClick={() => navigate(`/customers/${order.customer.id}`)}
    className="text-xs font-semibold text-[#b58d24] hover:text-[#967417] transition-colors cursor-pointer"
  >
                View Customer History &rarr;
              </button>
            </div>
          </div>

          {
    /* Shipping Address Card */
  }
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              Shipping Destination
            </h2>

            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p className="text-slate-400">{order.shippingAddress.country}</p>
            </div>
          </div>

          {
    /* Payment Summary Card */
  }
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              Payment Details
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold text-slate-800">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span
    className={`font-semibold px-2 py-0.5 rounded-full text-[11px] ${order.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
  >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-sm text-slate-900">
                <span>Amount</span>
                <span className="text-[#E4232C] font-extrabold">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Invoice Modal for Printing */
  }
      <InvoicePreview
    order={order}
    isOpen={isInvoiceOpen}
    onClose={() => setIsInvoiceOpen(false)}
  />
    </PageContainer>;
};
var stdin_default = OrderDetails;
export {
  OrderDetails,
  stdin_default as default
};
