import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Phone, Calendar, MapPin, ShoppingBag, CreditCard } from "lucide-react";
import { useCustomers } from "../../hooks/useCustomers";
import { PageContainer } from "../../components/layout/PageContainer";
import { PageHeader } from "../../components/common/PageHeader";
import { CustomerOrderHistory } from "../../components/customers/CustomerOrderHistory";
import { Loader } from "../../components/common/Loader";
import { ErrorMessage } from "../../components/common/ErrorMessage";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

const CustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { getCustomer, getCustomerOrders, loading: customersLoading } =
    useCustomers();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const customer = customerId ? getCustomer(customerId) : undefined;

  useEffect(() => {
    let isMounted = true;
    if (customerId) {
      setOrdersLoading(true);
      getCustomerOrders(customerId)
        .then((data) => {
          if (isMounted) setOrders(data);
        })
        .catch(() => {
          if (isMounted) setOrders([]);
        })
        .finally(() => {
          if (isMounted) setOrdersLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [customerId, getCustomerOrders]);

  if (customersLoading) {
    return <Loader message="Loading customer profile..." fullPage />;
  }

  if (!customer) {
    return (
      <PageContainer>
        <ErrorMessage
          title="Customer Not Found"
          message="Could not locate this customer account."
          onRetry={() => navigate("/customers")}
        />
      </PageContainer>
    );
  }

  const lifetimeValue =
    orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) ||
    customer.totalSpent ||
    0;

  return (
    <PageContainer>
      <PageHeader
        title={customer.name}
        description={`Customer ID: ${customer.id} • Registered ${formatDate(
          customer.dateJoined
        )}`}
        backUrl="/customers"
      />

      <div className="space-y-6 sm:space-y-8">
        {/* Customer Profile Banner Card */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4 sm:items-center">
              {customer.avatarUrl ? (
                <img
                  src={customer.avatarUrl}
                  alt={customer.name}
                  className="h-16 w-16 shrink-0 rounded-full border-2 border-slate-200/80 object-cover shadow-2xs"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#1E3545] bg-[#14232E] text-xl font-bold text-white shadow-2xs">
                  {customer.name?.charAt(0) || "C"}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {customer.name}
                </h2>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{customer.email}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{customer.phone}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Joined {formatDate(customer.dateJoined)}</span>
                  </span>
                  {customer.address && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>
                        {customer.address.city}, {customer.address.state}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-6 border-t border-slate-100 pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Total Orders
                </span>
                <span className="mt-0.5 block text-xl font-bold text-slate-900 tabular-nums sm:text-2xl">
                  {orders.length}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Lifetime Value
                </span>
                <span className="mt-0.5 block text-xl font-bold text-[#E4232C] tabular-nums sm:text-2xl">
                  {formatCurrency(lifetimeValue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Order History */}
        <CustomerOrderHistory orders={orders} isLoading={ordersLoading} />
      </div>
    </PageContainer>
  );
};

export default CustomerDetails;
export { CustomerDetails };
