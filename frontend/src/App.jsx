import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProductListing from './pages/ProductListing'
import Dashboard from './pages/Dashboard'
import Cart from './components/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import AddProduct from './pages/AddProduct'
import Profile from './pages/profile'
import EditProduct from './pages/EditProduct'
import Shipping from './pages/Shipping'
import Payment from './pages/Payment'
import PlaceOrder from './pages/PlaceOrder'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ProductListing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/placeorder" element={<PlaceOrder />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App