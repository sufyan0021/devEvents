import React from 'react';

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <h1>CommonLayout</h1>
      {children}
    </div>
  );
};

export default CommonLayout;
