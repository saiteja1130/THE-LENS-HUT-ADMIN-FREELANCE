import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Printer,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
} from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { OrderStatusSelect } from "../../components/orders/OrderStatusSelect";
import { OrderStatusBadge } from "../../components/orders/OrderStatusBadge";
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

  const order = orderId ? getOrder(orderId) : undefined;

  if (loading) {
    return <Loader message="Loading order details..." fullPage />;
  }

  if (!order) {
    return (
      <PageContainer>
        <ErrorMessage
          title="Order Not Found"
          message={`Order with identifier "${orderId}" could not be located.`}
          onRetry={() => navigate("/orders")}
        />
      </PageContainer>
    );
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

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed on ${formatDate(order.orderDate)}`}
        backUrl="/orders"
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsInvoiceOpen(true)}
              icon={<Printer className="h-4 w-4" />}
              className="shadow-2xs"
            >
              Print Invoice
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status:
              </span>
              <OrderStatusSelect
                currentStatus={order.orderStatus}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        }
      />

      {/* Quick Order Overview Bar */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="p-2">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Order Date
          </span>
          <span className="mt-1 block text-xs sm:text-sm font-semibold text-slate-900">
            {formatDate(order.orderDate)}
          </span>
        </div>

        <div className="p-2 border-l border-slate-100">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Fulfillment Status
          </span>
          <div className="mt-1">
            <OrderStatusBadge status={order.orderStatus} size="sm" />
          </div>
        </div>

        <div className="p-2 border-l border-slate-100">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Payment Status
          </span>
          <span
            className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
              order.paymentStatus === "Paid"
                ? "border-emerald-200/70 bg-emerald-50 text-emerald-700"
                : "border-amber-200/70 bg-amber-50 text-amber-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                order.paymentStatus === "Paid" ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {order.paymentStatus}
          </span>
        </div>

        <div className="p-2 border-l border-slate-100">
          <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total Payable
          </span>
          <span className="mt-1 block text-sm sm:text-base font-extrabold text-[#E4232C] tabular-nums">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Main Content Area (8 Cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Ordered Line Items */}
          <OrderItems
            items={order.items}
            subtotal={order.subtotal}
            discountAmount={order.discountAmount}
            couponCode={order.couponCode}
            shippingFee={order.shippingFee}
            totalAmount={order.totalAmount}
          />

          {/* Optical Prescription Parameters */}
          <PrescriptionDetails
            prescription={order.prescription}
            items={order.items}
          />

          {/* Courier Tracking Details */}
          <TrackingForm
            tracking={order.tracking}
            onSaveTracking={handleSaveTracking}
          />
        </div>

        {/* Sidebar Info (4 Cols) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Customer Profile Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all sm:p-6 space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
              <User className="h-4 w-4 text-[#E4232C]" />
              Customer Details
            </h2>

            <div className="space-y-2.5 text-xs">
              <p className="text-sm font-bold text-slate-900">
                {order.customer?.name ||
                  order.shippingAddress?.fullName ||
                  "Customer"}
              </p>

              <div className="flex items-center gap-2.5 text-slate-600">
                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="truncate">
                  {order.customer?.email ||
                    order.shippingAddress?.email ||
                    "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-600">
                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>
                  {order.customer?.phone ||
                    order.shippingAddress?.phone ||
                    "N/A"}
                </span>
              </div>
            </div>

            {order.customer?.id && (
              <div className="border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => navigate(`/customers/${order.customer.id}`)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#14232E] hover:text-[#E4232C] transition-colors cursor-pointer"
                >
                  <span>View Customer History</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Shipping Address Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all sm:p-6 space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
              <MapPin className="h-4 w-4 text-[#E4232C]" />
              Shipping Destination
            </h2>

            <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
              <p className="text-sm font-semibold text-slate-900">
                {order.shippingAddress?.fullName ||
                  order.customer?.name ||
                  "Recipient"}
              </p>
              <p>
                {order.shippingAddress?.addressLine1 ||
                  order.shippingAddress?.street ||
                  "Address Line"}
              </p>
              {(order.shippingAddress?.addressLine2 ||
                order.shippingAddress?.locality) && (
                <p>
                  {order.shippingAddress?.addressLine2 ||
                    order.shippingAddress?.locality}
                </p>
              )}
              <p>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.postalCode ||
                  order.shippingAddress?.pincode}
              </p>
              {order.shippingAddress?.country && (
                <p className="text-slate-400 font-medium">
                  {order.shippingAddress.country}
                </p>
              )}
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all sm:p-6 space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
              <CreditCard className="h-4 w-4 text-[#E4232C]" />
              Payment Details
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Method</span>
                <span className="font-semibold text-slate-800 rounded bg-slate-100 px-2 py-0.5">
                  {order.paymentMethod || "Online"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payment Status</span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                    order.paymentStatus === "Paid"
                      ? "border-emerald-200/70 bg-emerald-50 text-emerald-700"
                      : "border-amber-200/70 bg-amber-50 text-amber-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-100 pt-2.5 font-bold text-sm text-slate-900">
                <span>Total Amount</span>
                <span className="font-extrabold text-[#E4232C] tabular-nums text-base">
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal for Printing */}
      <InvoicePreview
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </PageContainer>
  );
};

export default OrderDetails;
export { OrderDetails };
