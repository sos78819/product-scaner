import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { useSelector } from "react-redux"
import Home from "./pages/home"
import Login from "./pages/login"
import QrcodeScaner from "./pages/qrcode-scaner"
import QrcodeScanList from "./pages/qrcode-scan-list"
import QrcodeInput from "./pages/qrcodr-input"
import './css/base.css'
import QrcodeHistory from "./pages/qrcode-history"


function App() {
  const { isLogin, user } = useSelector(state => state.auth);
  console.log(isLogin)
  const router = createBrowserRouter(
    [{
      path: '/',
      element: isLogin ? <Home /> : <Navigate to='/login' />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/scaner',
      element: isLogin ? <QrcodeScaner /> : <Navigate to='/login' />,

    },
    {
      path: '/qrcode-history',
      element: isLogin ? <QrcodeHistory /> : <Navigate to='/login' />,

    },
    {
      path: '/scaner/list',
      element: isLogin ? <QrcodeScanList /> : <Navigate to='/login' />,

    },
    {
      path:'/qrcode-input',
      element:isLogin ?<QrcodeInput/>:<Navigate to='/login' />
    }
    ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
