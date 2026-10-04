import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, Phone, Calendar } from "lucide-react";
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
  const { getCustomer, getCustomerOrders, loading: customersLoading } = useCustomers();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const customer = customerId ? getCustomer(customerId) : void 0;
  useEffect(() => {
    let isMounted = true;
    if (customerId) {
      setOrdersLoading(true);
      getCustomerOrders(customerId).then((data) => {
        if (isMounted) setOrders(data);
      }).catch(() => {
        if (isMounted) setOrders([]);
      }).finally(() => {
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
    return <PageContainer>
        <ErrorMessage
      title="Customer Not Found"
      message="Could not locate this customer account."
      onRetry={() => navigate("/customers")}
    />
      </PageContainer>;
  }
  return <PageContainer>
      <PageHeader
    title={customer.name}
    description={`Customer ID: ${customer.id} \u2022 Registered ${formatDate(customer.dateJoined)}`}
    backUrl="/customers"
  />

      <div className="space-y-8">
        {
    /* Customer Profile Banner Card */
  }
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {customer.avatarUrl ? <img
    src={customer.avatarUrl}
    alt={customer.name}
    className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-xs"
  /> : <div className="w-16 h-16 rounded-full bg-[#14232E] text-[#E4232C] font-bold text-xl flex items-center justify-center">
                  {customer.name.charAt(0)}
                </div>}
              <div>
                <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {customer.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {customer.phone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Joined {formatDate(customer.dateJoined)}
                  </span>
                </div>
              </div>
            </div>

            {
    /* Quick Metrics */
  }
            <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">
                  Total Orders
                </span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">
                  {orders.length}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">
                  Lifetime Value
                </span>
                <span className="text-xl font-bold text-[#E4232C] mt-0.5 block">
                  {formatCurrency(
    orders.reduce((sum, o) => sum + o.totalAmount, 0) || customer.totalSpent
  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {
    /* Order History */
  }
        <CustomerOrderHistory orders={orders} isLoading={ordersLoading} />
      </div>
    </PageContainer>;
};
var stdin_default = CustomerDetails;
export {
  CustomerDetails,
  stdin_default as default
};
