import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getPublicSettings,
    getCategories,
} from "../services/api";

/* =====================================================
   DEFAULT SETTINGS
===================================================== */

const defaultSettings = {
    store_name: "BgadiFashion",
    store_email: "",
    store_phone: "",
    store_address: "",
    currency: "INR",
    shipping_threshold: "",
};


/* =====================================================
   CONTEXT
===================================================== */

const StoreContext = createContext(null);


/* =====================================================
   PROVIDER
===================================================== */

export const StoreProvider = ({ children }) => {

    const [settings, setSettings] = useState(defaultSettings);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);


    /* =================================================
       STORE NAME
    ================================================= */

    const storeName =
        settings.store_name ||
        defaultSettings.store_name;


    /* =================================================
       STORE NAME PARTS

       Examples:

       BgadiFashion
       → Bgadi / Fashion

       My Cool Store
       → My / Cool Store
    ================================================= */

    const storeNameParts = (() => {

        const camelParts = storeName.match(
            /^([A-Z][a-z]+)([A-Z][a-z]+.*)$/
        );

        if (camelParts) {

            return {
                first: camelParts[1],
                second: camelParts[2],
            };

        }


        const spaceIndex =
            storeName.indexOf(" ");


        if (spaceIndex > 0) {

            return {
                first: storeName.slice(
                    0,
                    spaceIndex
                ),

                second: storeName.slice(
                    spaceIndex + 1
                ),
            };

        }


        return {
            first: storeName,
            second: "",
        };

    })();


    /* =================================================
       BRAND INITIAL
    ================================================= */

    const brandInitial =
        storeName.charAt(0).toUpperCase();


    /* =================================================
       MAIN CATEGORIES

       Supports:

       parent_id = null
       parent_id = 0
       parent_id = "0"
       parent_id = ""
    ================================================= */

    const mainCategories = categories.filter(
        (category) =>
            category.parent_id === null ||
            category.parent_id === undefined ||
            category.parent_id === 0 ||
            category.parent_id === "0" ||
            category.parent_id === ""
    );


    /* =================================================
       LOAD STORE DATA
    ================================================= */

    useEffect(() => {

        let mounted = true;


        const loadStoreData = async () => {

            try {

                const [
                    settingsResult,
                    categoriesResult,
                ] = await Promise.allSettled([

                    getPublicSettings(),

                    getCategories(),

                ]);


                /* =====================================
                   STORE SETTINGS
                ===================================== */

                if (
                    mounted &&
                    settingsResult.status === "fulfilled"
                ) {

                    const response =
                        settingsResult.value;

                    if (response?.data?.success) {

                        setSettings((previous) => ({

                            ...previous,

                            ...(
                                response.data.settings ||
                                {}
                            ),

                        }));

                    }

                }


                /* =====================================
                   CATEGORIES
                ===================================== */

                if (
                    mounted &&
                    categoriesResult.status === "fulfilled"
                ) {

                    const response =
                        categoriesResult.value;

                    const categoryData =
                        response?.data?.categories;


                    if (Array.isArray(categoryData)) {

                        setCategories(categoryData);

                    } else if (
                        Array.isArray(response?.data)
                    ) {

                        /*
                           Supports APIs returning:

                           [
                             {...},
                             {...}
                           ]

                           instead of:

                           {
                             categories: [...]
                           }
                        */

                        setCategories(response.data);

                    } else {

                        setCategories([]);

                    }

                }

            } catch (error) {

                console.error(
                    "Failed to load store data:",
                    error
                );

            } finally {

                if (mounted) {

                    setLoading(false);

                }

            }

        };


        loadStoreData();


        return () => {

            mounted = false;

        };

    }, []);


    /* =================================================
       UPDATE DOCUMENT TITLE
    ================================================= */

    useEffect(() => {

        if (!loading && storeName) {

            document.title = storeName;

        }

    }, [
        loading,
        storeName,
    ]);


    /* =================================================
       CONTEXT VALUE
    ================================================= */

    const value = {

        settings,

        storeName,

        storeNameParts,

        brandInitial,

        categories,

        mainCategories,

        loading,

    };


    return (

        <StoreContext.Provider value={value}>

            {children}

        </StoreContext.Provider>

    );

};


/* =====================================================
   CUSTOM HOOK
===================================================== */

export const useStore = () => {

    const context = useContext(StoreContext);


    if (!context) {

        throw new Error(
            "useStore must be used inside StoreProvider"
        );

    }


    return context;

};