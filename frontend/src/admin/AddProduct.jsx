
import React, {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import AdminLayout from "./AdminLayout";

import {
    getCategories,
    createAdminProduct
} from "../services/api";

import "../css/add-product.css";


const AddProduct = () => {

    const navigate = useNavigate();


    // =====================================================
    // STATES
    // =====================================================

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // IMAGE STATES
    // =====================================================

    const [imageFile, setImageFile] =
        useState(null);

    const [imagePreview, setImagePreview] =
        useState("");


    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState({

        name: "",

        description: "",

        category_id: "",

        brand: "",

        sku: "",

        base_price: "",

        sale_price: "",

        featured: false,

        status: "active",

        image: ""

    });


    // =====================================================
    // VARIANTS
    // =====================================================

    const [variants, setVariants] =
        useState([

            {
                size: "",
                color: "",
                sku: "",
                price_override: "",
                stock_quantity: ""
            }

        ]);


    // =====================================================
    // LOAD CATEGORIES
    // =====================================================

    useEffect(() => {

        const loadCategories =
            async () => {

                try {

                    const response =
                        await getCategories();


                    if (
                        response.data.success
                    ) {

                        setCategories(
                            response.data.categories || []
                        );

                    }

                } catch (error) {

                    console.error(
                        "Category error:",
                        error
                    );

                }

            };


        loadCategories();

    }, []);


    // =====================================================
    // CLEAN IMAGE PREVIEW
    // =====================================================

    useEffect(() => {

        return () => {

            if (imagePreview) {

                URL.revokeObjectURL(
                    imagePreview
                );

            }

        };

    }, [imagePreview]);


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;


        setForm((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value

        }));


        // -------------------------------------------------
        // IMAGE URL
        // -------------------------------------------------

        if (name === "image") {

            setImageFile(null);

            setImagePreview(
                value || ""
            );

        }

    };


    // =====================================================
    // IMAGE UPLOAD
    // =====================================================

    const handleImageUpload = (e) => {

        const file =
            e.target.files[0];


        if (!file) {

            return;

        }


        // -------------------------------------------------
        // CHECK IMAGE TYPE
        // -------------------------------------------------

        if (!file.type.startsWith("image/")) {

            alert(
                "Please select a valid image file."
            );

            e.target.value = "";

            return;

        }


        // -------------------------------------------------
        // CHECK IMAGE SIZE
        // Maximum 5MB
        // -------------------------------------------------

        if (
            file.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Image size must be less than 5MB."
            );

            e.target.value = "";

            return;

        }


        // -------------------------------------------------
        // STORE FILE
        // -------------------------------------------------

        setImageFile(file);


        // Clear URL when local image is selected

        setForm((prev) => ({

            ...prev,

            image: ""

        }));


        // -------------------------------------------------
        // PREVIEW
        // -------------------------------------------------

        const previewUrl =
            URL.createObjectURL(file);


        setImagePreview(
            previewUrl
        );

    };


    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const removeImage = () => {

        setImageFile(null);

        setImagePreview("");


        setForm((prev) => ({

            ...prev,

            image: ""

        }));

    };


    // =====================================================
    // VARIANT CHANGE
    // =====================================================

    const handleVariantChange = (
        index,
        field,
        value
    ) => {

        const updatedVariants =
            [...variants];


        updatedVariants[index] = {

            ...updatedVariants[index],

            [field]: value

        };


        setVariants(
            updatedVariants
        );

    };


    // =====================================================
    // ADD VARIANT
    // =====================================================

    const addVariant = () => {

        setVariants([

            ...variants,

            {
                size: "",
                color: "",
                sku: "",
                price_override: "",
                stock_quantity: ""
            }

        ]);

    };


    // =====================================================
    // REMOVE VARIANT
    // =====================================================

    const removeVariant = (index) => {

        if (variants.length === 1) {

            return;

        }


        setVariants(

            variants.filter(
                (_, i) => i !== index
            )

        );

    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // -------------------------------------------------
        // BASIC VALIDATION
        // -------------------------------------------------

        if (
            !form.name.trim() ||
            !form.category_id ||
            !form.base_price
        ) {

            alert(
                "Please fill Product Name, Category and Base Price."
            );

            return;

        }


        // -------------------------------------------------
        // IMAGE VALIDATION
        // -------------------------------------------------

        if (
            !form.image &&
            !imageFile
        ) {

            alert(
                "Please provide an Image URL or upload an image."
            );

            return;

        }


        try {

            setLoading(true);


            // -------------------------------------------------
            // PRODUCT DATA
            // -------------------------------------------------

            const productData = {

                ...form,

                category_id:
                    Number(
                        form.category_id
                    ),

                base_price:
                    Number(
                        form.base_price
                    ),

                sale_price:
                    form.sale_price
                        ? Number(
                            form.sale_price
                        )
                        : null,


                variants:

                    variants.map(
                        (variant) => ({

                            ...variant,

                            price_override:
                                variant.price_override
                                    ? Number(
                                        variant.price_override
                                    )
                                    : null,

                            stock_quantity:
                                Number(
                                    variant.stock_quantity || 0
                                )

                        })
                    ),


                // -------------------------------------------------
                // IMPORTANT
                // Pass the actual selected File
                // to the API service.
                // -------------------------------------------------

                imageFile: imageFile

            };


            // -------------------------------------------------
            // CREATE PRODUCT
            // -------------------------------------------------

            const response =
                await createAdminProduct(
                    productData
                );


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            if (
                response.data.success
            ) {

                alert(
                    "Product added successfully!"
                );


                navigate(
                    "/admin/products"
                );

            }

        } catch (error) {

            console.error(
                "Add product error:",
                error
            );


            alert(

                error.response?.data?.message ||

                "Failed to add product"

            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <AdminLayout>

            <div className="add-product-page">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="add-product-header">

                    <div>

                        <h1>
                            Add Product
                        </h1>

                        <p>
                            Add a new fashion product
                        </p>

                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="product-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        BASIC INFORMATION
                    ================================================= */}

                    <div className="form-section">

                        <h2>
                            Basic Information
                        </h2>


                        <div className="form-grid">


                            {/* PRODUCT NAME */}

                            <div className="form-group full-width">

                                <label>
                                    Product Name *
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Floral Summer Dress"
                                    required
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group full-width">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="5"
                                    placeholder="Describe your product..."
                                />

                            </div>


                            {/* CATEGORY */}

                            <div className="form-group">

                                <label>
                                    Category *
                                </label>

                                <select
                                    name="category_id"
                                    value={
                                        form.category_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>


                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.id
                                                }
                                            >

                                                {
                                                    category.name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* BRAND */}

                            <div className="form-group">

                                <label>
                                    Brand
                                </label>

                                <input
                                    type="text"
                                    name="brand"
                                    value={
                                        form.brand
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Brand name"
                                />

                            </div>


                            {/* SKU */}

                            <div className="form-group">

                                <label>
                                    SKU
                                </label>

                                <input
                                    type="text"
                                    name="sku"
                                    value={
                                        form.sku
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Product SKU"
                                />

                            </div>


                            {/* =================================================
                                IMAGE URL OR UPLOAD
                            ================================================= */}

                            <div className="form-group full-width">

                                <label>
                                    Product Image
                                </label>


                                <div className="image-option-box">


                                    {/* IMAGE URL */}

                                    <div className="image-option">

                                        <label>
                                            Image URL
                                        </label>

                                        <input
                                            type="url"
                                            name="image"
                                            value={
                                                form.image
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="https://example.com/image.jpg"
                                        />

                                        <small>
                                            Paste an image URL
                                        </small>

                                    </div>


                                    {/* OR */}

                                    <div className="image-or">

                                        OR

                                    </div>


                                    {/* IMAGE UPLOAD */}

                                    <div className="image-option">

                                        <label>
                                            Upload Image
                                        </label>

                                        <input
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                            onChange={
                                                handleImageUpload
                                            }
                                        />

                                        <small>
                                            JPG, PNG or WEBP — Max 5MB
                                        </small>

                                    </div>

                                </div>


                                {/* IMAGE PREVIEW */}

                                {imagePreview && (

                                    <div className="image-preview">

                                        <div className="image-preview-header">

                                            <strong>
                                                Image Preview
                                            </strong>

                                            <button
                                                type="button"
                                                onClick={
                                                    removeImage
                                                }
                                                className="remove-image-btn"
                                            >
                                                Remove
                                            </button>

                                        </div>


                                        <img
                                            src={
                                                imagePreview
                                            }
                                            alt="Product preview"
                                        />

                                    </div>

                                )}

                            </div>


                        </div>

                    </div>


                    {/* =================================================
                        PRICE
                    ================================================= */}

                    <div className="form-section">

                        <h2>
                            Pricing
                        </h2>


                        <div className="form-grid">


                            {/* BASE PRICE */}

                            <div className="form-group">

                                <label>
                                    Base Price *
                                </label>

                                <input
                                    type="number"
                                    name="base_price"
                                    value={
                                        form.base_price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="1999"
                                    required
                                />

                            </div>


                            {/* SALE PRICE */}

                            <div className="form-group">

                                <label>
                                    Sale Price
                                </label>

                                <input
                                    type="number"
                                    name="sale_price"
                                    value={
                                        form.sale_price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="1499"
                                />

                            </div>


                        </div>

                    </div>


                    {/* =================================================
                        VARIANTS
                    ================================================= */}

                    <div className="form-section">


                        <div className="variant-header">

                            <h2>
                                Product Variants
                            </h2>


                            <button
                                type="button"
                                className="add-variant-btn"
                                onClick={
                                    addVariant
                                }
                            >
                                + Add Variant
                            </button>

                        </div>


                        {variants.map(
                            (variant, index) => (

                                <div
                                    className="variant-box"
                                    key={index}
                                >


                                    <div className="variant-title">

                                        <strong>
                                            Variant {index + 1}
                                        </strong>


                                        {variants.length > 1 && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeVariant(
                                                        index
                                                    )
                                                }
                                                className="remove-variant"
                                            >
                                                Remove
                                            </button>

                                        )}

                                    </div>


                                    <div className="form-grid">


                                        {/* SIZE */}

                                        <div className="form-group">

                                            <label>
                                                Size
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    variant.size
                                                }
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "size",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="S / M / L / XL"
                                            />

                                        </div>


                                        {/* COLOR */}

                                        <div className="form-group">

                                            <label>
                                                Color
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    variant.color
                                                }
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "color",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Pink"
                                            />

                                        </div>


                                        {/* VARIANT SKU */}

                                        <div className="form-group">

                                            <label>
                                                Variant SKU
                                            </label>

                                            <input
                                                type="text"
                                                value={
                                                    variant.sku
                                                }
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "sku",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="DRESS-PINK-M"
                                            />

                                        </div>


                                        {/* PRICE OVERRIDE */}

                                        <div className="form-group">

                                            <label>
                                                Price Override
                                            </label>

                                            <input
                                                type="number"
                                                value={
                                                    variant.price_override
                                                }
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "price_override",
                                                        e.target.value
                                                    )
                                                }
                                                min="0"
                                                step="0.01"
                                                placeholder="Optional"
                                            />

                                        </div>


                                        {/* STOCK */}

                                        <div className="form-group">

                                            <label>
                                                Stock Quantity
                                            </label>

                                            <input
                                                type="number"
                                                value={
                                                    variant.stock_quantity
                                                }
                                                onChange={(e) =>
                                                    handleVariantChange(
                                                        index,
                                                        "stock_quantity",
                                                        e.target.value
                                                    )
                                                }
                                                min="0"
                                                placeholder="10"
                                            />

                                        </div>


                                    </div>

                                </div>

                            )
                        )}

                    </div>


                    {/* =================================================
                        SETTINGS
                    ================================================= */}

                    <div className="form-section">

                        <h2>
                            Product Settings
                        </h2>


                        <div className="form-grid">


                            {/* STATUS */}

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        form.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="draft">
                                        Draft
                                    </option>

                                    <option value="archived">
                                        Archived
                                    </option>

                                </select>

                            </div>


                            {/* FEATURED */}

                            <div className="featured-checkbox">

                                <label>

                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={
                                            form.featured
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                    Featured Product

                                </label>

                            </div>


                        </div>

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="form-actions">


                        <button
                            type="button"
                            className="cancel-product-btn"
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="save-product-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : "Save Product"}

                        </button>


                    </div>


                </form>

            </div>

        </AdminLayout>

    );

};


export default AddProduct;

