import { createBrowserRouter, Link, RouterProvider } from "react-router-dom"
import Home from "./pages/home"
import Login from "./pages/login"
import QrcodeScaner from "./pages/qrcode-scaner"
import QrcodeScanList from "./pages/qrcode-scan-list"
import './css/base.css'
import QrcodeHistory from "./pages/qrcode-history"


function App() {
  const router = createBrowserRouter(
    [{
      path: '/',
      element: <Home />
    },
    {
      path:'/login',
      element:<Login/>
    },
    {
      path:'/scaner',
      element:<QrcodeScaner/>,

    },
    {
      path:'/qrcode-history',
      element:<QrcodeHistory/>
    },
    {
      path:'/scaner/list',
      element:<QrcodeScanList/>,

    },
    ])
  return (
    
      <RouterProvider  router={router}/>
    
  )
}

export default App
