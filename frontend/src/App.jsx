import React from "react";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";


// =====================================================
// CUSTOMER COMPONENTS
// =====================================================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


// =====================================================
// CUSTOMER PAGES
// =====================================================

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";

import Checkout from "./pages/Checkout";
import Address from "./pages/Address";


// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "./admin/AdminDashboard";

import AdminProducts from "./admin/AdminProducts";

import AddProduct from "./admin/AddProduct";

import AdminOrders from "./admin/AdminOrders";

import AdminManagement from "./admin/AdminManagement";

import AdminStore from "./admin/AdminStore";


// =====================================================
// CONTEXT
// =====================================================

import {
    AppProvider
} from "./context/AppContext";

import {
    StoreProvider
} from "./context/StoreContext";


// =====================================================
// GLOBAL CSS
// =====================================================

import "./css/global.css";
import CustomerSettings from "./pages/CustomerSettings";
import AdminLayout from "./admin/AdminLayout";
import AdminSettings from "./pages/AdminSettings";
import Orders from "./pages/Orders";


// =====================================================
// CUSTOMER LAYOUT
// =====================================================

const CustomerLayout = ({
    children
}) => {

    return (

        <>

            <Navbar />

            <main>
                {children}
            </main>

            <Footer />

        </>

    );

};


// =====================================================
// APP
// =====================================================

const App = () => {

    return (

        <BrowserRouter>

            <StoreProvider>

            <AppProvider>

                <Routes>


                    {/* =================================================
                        CUSTOMER PAGES
                    ================================================= */}

                    <Route
                        path="/"
                        element={
                            <CustomerLayout>
                                <Home />
                            </CustomerLayout>
                        }
                    />


                    <Route
                        path="/products"
                        element={
                            <CustomerLayout>
                                <Products />
                            </CustomerLayout>
                        }
                    />


                    <Route
                        path="/products/:id"
                        element={
                            <CustomerLayout>
                                <ProductDetails />
                            </CustomerLayout>
                        }
                    />


                    <Route
                        path="/login"
                        element={
                            <CustomerLayout>
                                <Login />
                            </CustomerLayout>
                        }
                    />


                    <Route
                        path="/register"
                        element={
                            <CustomerLayout>
                                <Register />
                            </CustomerLayout>
                        }
                    />


                    <Route
                        path="/profile"
                        element={
                            <CustomerLayout>
                                <Profile />
                            </CustomerLayout>
                        }
                    />


                    <Route
                        path="/address"
                        element={
                            <CustomerLayout>
                                <Address />
                            </CustomerLayout>
                        }
                    />


                    <Route
                        path="/wishlist"
                        element={
                            <CustomerLayout>
                                <Wishlist />
                            </CustomerLayout>
                        }
                    />


                    <Route
                        path="/cart"
                        element={
                            <CustomerLayout>
                                <Cart />
                            </CustomerLayout>
                        }
                    />


                    <Route
                        path="/checkout"
                        element={
                            <CustomerLayout>
                                <Checkout />
                            </CustomerLayout>
                        }
                    />

                    <Route
                        path="/orders"
                        element={<Orders />}
                    />

                    <Route
                        path="/addresses"
                        element={<Address />}
                    />

                    <Route
                        path="/account/settings"
                        element={
                            <CustomerLayout>
                                <CustomerSettings />
                            </CustomerLayout>
                        }
                    />


                    {/* =================================================
                        ADMIN PAGES
                        
                        IMPORTANT:
                        These pages contain their own AdminLayout.
                        
                        Therefore we DO NOT put Navbar/Footer around
                        these routes.
                    ================================================= */}


                    <Route
                        path="/admin/dashboard"
                        element={
                            <AdminDashboard />
                        }
                    />


                    <Route
                        path="/admin/products"
                        element={
                            <AdminProducts />
                        }
                    />


                    <Route
                        path="/admin/products/add"
                        element={
                            <AddProduct />
                        }
                    />


                    <Route
                        path="/admin/products/edit/:id"
                        element={
                            <AddProduct />
                        }
                    />


                    <Route
                        path="/admin/orders"
                        element={
                            <AdminOrders />
                        }
                    />


                    <Route
                        path="/admin/admin-management"
                        element={
                            <AdminManagement />
                        }
                    />

                    <Route
                        path="/admin/settings"
                        element={
                            <AdminLayout>
                                <AdminSettings />
                            </AdminLayout>
                        }
                    />


                    {/* =================================================
                        FULL ADMIN STORE
                    ================================================= */}

                    <Route
                        path="/admin/store"
                        element={
                            <AdminStore />
                        }
                    />


                    {/* =================================================
                        FALLBACK
                    ================================================= */}

                    <Route
                        path="*"
                        element={
                            <CustomerLayout>
                                <Home />
                            </CustomerLayout>
                        }
                    />

                </Routes>

            </AppProvider>

            </StoreProvider>

        </BrowserRouter>

    );

};


export default App;
