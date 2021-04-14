import React from 'react'
import AppLogo from './AppLogo';
import AppHeader from './AppHeader';
import AppContent from './AppContent';

const AppLayout = () => {
  return (
    <div>
      <AppLogo />
      <AppHeader />
      <AppContent />
    </div>
  )
}

export default AppLayout
