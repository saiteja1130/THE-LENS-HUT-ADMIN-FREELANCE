import { createContext, useState, useEffect, useCallback } from "react";
import { customerService } from "../services/customerService";
const CustomerContext = createContext(void 0);
const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch {
      setError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);
  const getCustomer = (id) => {
    return customers.find((c) => c.id === id);
  };
  const getCustomerOrders = async (customerId) => {
    return customerService.getCustomerOrders(customerId);
  };
  return <CustomerContext.Provider
    value={{
      customers,
      loading,
      error,
      getCustomer,
      getCustomerOrders,
      refreshCustomers: fetchCustomers
    }}
  >
      {children}
    </CustomerContext.Provider>;
};
export {
  CustomerContext,
  CustomerProvider
};
