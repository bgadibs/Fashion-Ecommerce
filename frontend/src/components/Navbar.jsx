
import {
    Link,
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    FiShoppingBag,
    FiHeart,
    FiUser,
    FiSearch,
    FiMenu,
    FiX,
} from "react-icons/fi";

import {
    useState,
    useEffect,
    useRef,
} from "react";

import {
    useApp,
} from "../context/AppContext";

import {
    useStore,
} from "../context/StoreContext";

import {
    getCart,
    getWishlist,
    getCategories,
} from "../services/api";

import "../css/navbar.css";


const Navbar = () => {

    const {
        user: contextUser,
        logout,
    } = useApp();

    const {
        storeNameParts,
        brandInitial,
    } = useStore();

    const navigate = useNavigate();


    /* =====================================================
       STATES
    ===================================================== */

    const [user, setUser] = useState(() => {

        return JSON.parse(
            localStorage.getItem("user") || "null"
        );

    });


    const [categories, setCategories] =
        useState([]);


    const [menuOpen, setMenuOpen] =
        useState(false);


    const [search, setSearch] =
        useState("");


    const [userMenuOpen, setUserMenuOpen] =
        useState(false);


    const [cartCount, setCartCount] =
        useState(0);


    const [wishlistCount, setWishlistCount] =
        useState(0);


    const userMenuRef =
        useRef(null);


    /* =====================================================
       LOAD CATEGORIES
    ===================================================== */

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response =
                    await getCategories();

                const data =
                    response.data?.categories || [];

                setCategories(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load navbar categories:",
                    error
                );

                setCategories([]);

            }

        };


        loadCategories();

    }, []);


    /* =====================================================
       MAIN CATEGORIES ONLY
       
       Only categories where parent_id is NULL
       
       Example:
       Women
       Men
       Kids

       Subcategories such as:
       Dresses
       Tops
       Shirts
       T-Shirts
       Boys
       Girls

       will NOT appear in the navbar.
    ===================================================== */

    const mainCategories =
        categories.filter(
            (category) =>
                category.parent_id === null ||
                category.parent_id === undefined
        );


    /* =====================================================
       UPDATE USER AFTER LOGIN / LOGOUT
    ===================================================== */

    useEffect(() => {

        const handleUserUpdated = () => {

            const savedUser = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            setUser(savedUser);

            setUserMenuOpen(false);

        };


        window.addEventListener(
            "userUpdated",
            handleUserUpdated
        );


        return () => {

            window.removeEventListener(
                "userUpdated",
                handleUserUpdated
            );

        };

    }, []);


    /* =====================================================
       SYNC WITH APP CONTEXT
    ===================================================== */

    useEffect(() => {

        if (contextUser) {

            setUser(contextUser);

        } else {

            const savedUser = JSON.parse(
                localStorage.getItem("user") || "null"
            );

            setUser(savedUser);

        }

    }, [contextUser]);


    /* =====================================================
       LOAD CART COUNT
    ===================================================== */

    const loadCartCount = async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            setCartCount(0);

            return;

        }


        try {

            const response =
                await getCart();

            const items =
                response.data?.items || [];

            const count =
                items.reduce(
                    (total, item) =>
                        total +
                        Number(
                            item.quantity || 0
                        ),
                    0
                );

            setCartCount(count);

        } catch (error) {

            console.error(
                "Failed to load cart count:",
                error
            );

            setCartCount(0);

        }

    };


    /* =====================================================
       LOAD WISHLIST COUNT
    ===================================================== */

    const loadWishlistCount = async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {

            setWishlistCount(0);

            return;

        }


        try {

            const response =
                await getWishlist();

            const wishlist =
                response.data?.wishlist ||
                response.data?.items ||
                [];

            setWishlistCount(
                wishlist.length
            );

        } catch (error) {

            console.error(
                "Failed to load wishlist count:",
                error
            );

            setWishlistCount(0);

        }

    };


    /* =====================================================
       LOAD COUNTS WHEN USER CHANGES
    ===================================================== */

    useEffect(() => {

        if (user) {

            loadCartCount();
            loadWishlistCount();

        } else {

            setCartCount(0);
            setWishlistCount(0);

        }

    }, [user]);


    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    useEffect(() => {

        const handleCartUpdated = () => {

            loadCartCount();

        };


        window.addEventListener(
            "cartUpdated",
            handleCartUpdated
        );


        return () => {

            window.removeEventListener(
                "cartUpdated",
                handleCartUpdated
            );

        };

    }, []);


    /* =====================================================
       UPDATE WISHLIST COUNT
    ===================================================== */

    useEffect(() => {

        const handleWishlistUpdated = () => {

            loadWishlistCount();

        };


        window.addEventListener(
            "wishlistUpdated",
            handleWishlistUpdated
        );


        return () => {

            window.removeEventListener(
                "wishlistUpdated",
                handleWishlistUpdated
            );

        };

    }, []);


    /* =====================================================
       CLOSE USER DROPDOWN
    ===================================================== */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(
                    event.target
                )
            ) {

                setUserMenuOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    /* =====================================================
       SEARCH
    ===================================================== */

    const handleSearch = (e) => {

        e.preventDefault();


        if (search.trim()) {

            navigate(
                `/products?search=${encodeURIComponent(
                    search.trim()
                )}`
            );

            setSearch("");

            setMenuOpen(false);

        }

    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        setUserMenuOpen(false);

        logout();

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        setUser(null);

        setCartCount(0);
        setWishlistCount(0);

        window.dispatchEvent(
            new Event("userUpdated")
        );

        navigate("/");

    };


    /* =====================================================
       PROFILE
    ===================================================== */

    const handleProfileClick = () => {

        setUserMenuOpen(false);

        navigate("/profile");

    };


    /* =====================================================
       ORDERS
    ===================================================== */

    const handleOrdersClick = () => {

        setUserMenuOpen(false);

        navigate("/orders");

    };


    /* =====================================================
       CLOSE MOBILE MENU
    ===================================================== */

    const closeMenu = () => {

        setMenuOpen(false);

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <header className="navbar-wrapper">


            {/* =================================================
                TOP STRIP
            ================================================= */}

            <div className="top-strip">

                <p>
                    ✨ Free shipping on orders above ₹999
                </p>

                <span>
                    New styles. New you. 💕
                </span>

            </div>


            {/* =================================================
                MAIN NAVBAR
            ================================================= */}

            <nav className="main-navbar">


                {/* =================================================
                    LOGO
                ================================================= */}

                <Link
                    to="/"
                    className="brand-logo"
                    onClick={closeMenu}
                >

                    <span className="brand-icon">
                        {brandInitial}
                    </span>

                    <span className="brand-text">

                        {storeNameParts.first}

                        {storeNameParts.second && (

                            <span>
                                {storeNameParts.second}
                            </span>

                        )}

                    </span>

                </Link>


                {/* =================================================
                    MOBILE MENU BUTTON
                ================================================= */}

                <button
                    className="mobile-menu-button"
                    type="button"
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                    aria-label="Toggle navigation menu"
                >

                    {menuOpen ? (
                        <FiX />
                    ) : (
                        <FiMenu />
                    )}

                </button>


                {/* =================================================
                    NAVIGATION

                    NO DROPDOWN
                    NO SUBMENU
                    NO ARROW
                ================================================= */}

                <div
                    className={`nav-center ${
                        menuOpen
                            ? "show-menu"
                            : ""
                    }`}
                >


                    {/* HOME */}

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>


                    {/* =================================================
                        MAIN CATEGORIES

                        Women -> /products?category=women
                        Men   -> /products?category=men
                        Kids  -> /products?category=kids
                    ================================================= */}

                    {mainCategories.map((cat) => (

                        <NavLink
                            key={cat.id}
                            to={`/products?category=${encodeURIComponent(
                                cat.slug
                            )}`}
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            onClick={closeMenu}
                        >
                            {cat.name}
                        </NavLink>

                    ))}


                    {/* NEW ARRIVALS */}

                    <NavLink
                        to="/products?featured=true"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                        onClick={closeMenu}
                    >
                        New Arrivals
                    </NavLink>

                </div>


                {/* =================================================
                    SEARCH
                ================================================= */}

                <form
                    className="search-box"
                    onSubmit={handleSearch}
                >

                    <FiSearch />

                    <input
                        type="text"
                        placeholder="Search fashion..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </form>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="nav-actions">


                    {/* =================================================
                        WISHLIST
                    ================================================= */}

                    <Link
                        to="/wishlist"
                        className="nav-action"
                        onClick={closeMenu}
                    >

                        <div className="wishlist-icon-wrapper">

                            <FiHeart />

                            {wishlistCount > 0 && (

                                <span className="wishlist-count">

                                    {wishlistCount > 99
                                        ? "99+"
                                        : wishlistCount}

                                </span>

                            )}

                        </div>

                        <span>
                            Wishlist
                        </span>

                    </Link>


                    {/* =================================================
                        CART / BAG
                    ================================================= */}

                    <Link
                        to="/cart"
                        className="nav-action cart-action"
                        onClick={closeMenu}
                    >

                        <div className="cart-icon-wrapper">

                            <FiShoppingBag />

                            {cartCount > 0 && (

                                <span className="cart-count">

                                    {cartCount > 99
                                        ? "99+"
                                        : cartCount}

                                </span>

                            )}

                        </div>

                        <span>
                            Bag
                        </span>

                    </Link>


                    {/* =================================================
                        USER
                    ================================================= */}

                    {user ? (

                        <div
                            className="user-menu"
                            ref={userMenuRef}
                        >

                            <button
                                className="user-button"
                                type="button"
                                onClick={() =>
                                    setUserMenuOpen(
                                        !userMenuOpen
                                    )
                                }
                            >

                                <FiUser />

                                <span>
                                    {user.name}
                                </span>

                            </button>


                            {userMenuOpen && (

                                <div className="user-dropdown">

                                    <button
                                        type="button"
                                        onClick={
                                            handleProfileClick
                                        }
                                    >
                                        My Profile
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            handleOrdersClick
                                        }
                                    >
                                        My Orders
                                    </button>


                                    <button
                                        type="button"
                                        onClick={
                                            handleLogout
                                        }
                                    >
                                        Logout
                                    </button>

                                </div>

                            )}

                        </div>

                    ) : (

                        <div className="auth-actions">

                            <Link
                                to="/login"
                                className="login-button"
                                onClick={closeMenu}
                            >

                                <FiUser />

                                Login

                            </Link>

                        </div>

                    )}

                </div>

            </nav>

        </header>

    );

};


export default Navbar;

