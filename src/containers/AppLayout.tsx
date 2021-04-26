import React from 'react'
import AppHeader from './AppHeader';
import AppContent from './AppContent';
import TheAppBar from '../components/TheAppBar';

const AppLayout = () => {
  return (
    <div>
      <TheAppBar />
      <AppHeader />
      <AppContent />
    </div>
  )
}

export default AppLayout
