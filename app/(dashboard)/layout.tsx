import React from 'react';

const DashboardNav = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h1>DashboardNav</h1>
      {children}
    </div>
  );
};

export default DashboardNav;
