import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// layout
import MainLayout from './layouts/MainLayout'
import UserLayout from './layouts/UserLayout'

// lazy loading
const Home = lazy(() => import('./components/dashboard/home'))
const Login = lazy(() => import('./components/dashboard/login'))
const Signup = lazy(() => import('./components/dashboard/signup'))
const NotFound = lazy(() => import('./components/dashboard/notfound'))

// user dashboard components
const Deals = lazy(() => import('./components/user/deals'))
// const Documents = lazy(() => import('./components/user/documents'))
const Settings = lazy(() => import('./components/user/settings'))
const Messages = lazy(() => import('./components/user/chats'))
const Landing = lazy(() => import('./components/user/landing'))


// Error boundary component
import ErrorBoundary from './components/common/ErrorBoundaries'


function App() {
  return (
    <>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                {/* <Route path="/about" element={<About />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* Protected routes */}
              <Route path="/dashboard" element={<UserLayout />}>
                <Route index element={<Landing />} />
                <Route path="deals" element={<Deals />} />
                <Route path="messages" element={<Messages />} />
                <Route path="settings" element={<Settings />} />
                {/* <Route path="documents" element={<Documents />} /> */}
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  )
}

// Protected route component
// function ProtectedRoute({ children }) {
//   const { isAuthenticated } = useAuth();

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

export default App