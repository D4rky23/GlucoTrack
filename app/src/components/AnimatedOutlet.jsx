import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import PageTransition from './PageTransition';

export default function AnimatedOutlet() {
  const location = useLocation();
  return (
    <PageTransition keyProp={location.pathname}>
      <Outlet />
    </PageTransition>
  );
}
