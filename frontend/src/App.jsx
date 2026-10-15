import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import InfoPage from "./pages/InfoPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import OrderSuccess from "./pages/OrderSuccess";
import { CartProvider } from "./context/CartContext";
import { getProfile } from "./services/api";
import "./index.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout = ({ user, setUser, children }) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <>
      <ScrollToTop />
      <Navbar user={user} setUser={setUser} />
      <main className={isHome ? "main-full" : "main-page"}>{children}</main>
      <Footer user={user} />
    </>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const data = await getProfile();
        if (isMounted && data) {
          setUser(data);
        }
      } catch (err) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div className="app-loading">SHOPKART.</div>;
  }

  return (
    <Router>
      <CartProvider user={user}>
        <Layout user={user} setUser={setUser}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route
                path="/profile"
                element={<Profile user={user} setUser={setUser} />}
              />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route
                path="/cart"
                element={user ? <Cart /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/checkout"
                element={user ? <Checkout /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/orders"
                element={user ? <Orders /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/orders/:id"
                element={
                  user ? <OrderDetails /> : <Navigate to="/login" replace />
                }
              />
              <Route
                path="/order-success/:id"
                element={
                  user ? <OrderSuccess /> : <Navigate to="/login" replace />
                }
              />
              <Route path="/info/:slug" element={<InfoPage />} />
              <Route path="/" element={<Landing />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
      </CartProvider>
    </Router>
  );
}

export default App;
