import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardCards from './components/pages/DashboardCards'
import PageNotFound from './components/common/PageNotFound'
import Signin from './components/Register/Signin'
import Signup from './components/Register/Signup'
import Home from './components/pages/Home'
import Navbar from './components/common/Navbar'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardCards />
          </ProtectedRoute>
        } />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}
export default App
