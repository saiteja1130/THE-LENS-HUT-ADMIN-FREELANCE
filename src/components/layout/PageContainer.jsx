const PageContainer = ({ children, className = "" }) => {
  return <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full ${className}`}>
      {children}
    </div>;
};
export {
  PageContainer
};
