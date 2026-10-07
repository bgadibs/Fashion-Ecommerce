
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
   DEFAULTS
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

const StoreContext = createContext();


/* =====================================================
   PROVIDER
   ===================================================== */

export const StoreProvider = ({ children }) => {

    const [settings, setSettings] =
        useState(defaultSettings);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    /* -------------------------------------------------
       PARSE STORE NAME INTO PARTS
       "BgadiFashion" → { first: "Bgadi", second: "Fashion" }
       "My Cool Store" → { first: "My Cool Store", second: "" }
    ------------------------------------------------- */

    const storeName = settings.store_name || defaultSettings.store_name;

    const storeNameParts = (() => {

        // Try to split camelCase like "BgadiFashion"
        const camelParts =
            storeName.match(/^([A-Z][a-z]+)([A-Z][a-z]+.*)$/);

        if (camelParts) {
            return {
                first: camelParts[1],
                second: camelParts[2],
            };
        }

        // Try space-separated: take first word + rest
        const spaceIndex =
            storeName.indexOf(" ");

        if (spaceIndex > 0) {
            return {
                first: storeName.slice(0, spaceIndex),
                second: storeName.slice(spaceIndex + 1),
            };
        }

        return {
            first: storeName,
            second: "",
        };

    })();


    const brandInitial =
        storeName.charAt(0).toUpperCase();


    /* -------------------------------------------------
       MAIN CATEGORIES (parent_id === null)
    ------------------------------------------------- */

    const mainCategories = categories.filter(
        (cat) => cat.parent_id === null
    );


    /* -------------------------------------------------
       LOAD STORE DATA
    ------------------------------------------------- */

    useEffect(() => {

        const loadStoreData = async () => {

            try {

                const [settingsRes, categoriesRes] =
                    await Promise.allSettled([
                        getPublicSettings(),
                        getCategories(),
                    ]);


                if (
                    settingsRes.status === "fulfilled" &&
                    settingsRes.value.data?.success
                ) {
                    setSettings((prev) => ({
                        ...prev,
                        ...settingsRes.value.data.settings,
                    }));
                }


                if (
                    categoriesRes.status === "fulfilled"
                ) {
                    setCategories(
                        categoriesRes.value.data?.categories || []
                    );
                }

            } catch (error) {

                console.error(
                    "Failed to load store data:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };


        loadStoreData();

    }, []);


    /* -------------------------------------------------
       UPDATE DOCUMENT TITLE
    ------------------------------------------------- */

    useEffect(() => {

        if (!loading && storeName) {
            document.title = storeName;
        }

    }, [loading, storeName]);


    /* -------------------------------------------------
       CONTEXT VALUE
    ------------------------------------------------- */

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
   HOOK
   ===================================================== */

export const useStore = () =>
    useContext(StoreContext);
