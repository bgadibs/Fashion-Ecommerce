import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiCheck,
    FiImage,
    FiPlus,
    FiSave,
    FiTrash2,
    FiUpload,
    FiX
} from "react-icons/fi";

import AdminLayout from "./AdminLayout";

import {
    createAdminProduct,
    getCategories
} from "../services/api";

import "../css/add-Product.css";


const MAX_IMAGES = 8;
const MAX_FILE_SIZE = 5 * 1024 * 1024;


const emptyVariant = {
    size: "",
    color: "",
    sku: "",
    price_override: "",
    stock_quantity: 0
};


const AddProduct = () => {

    const navigate = useNavigate();


    /* =====================================================
       PRODUCT FORM
    ===================================================== */

    const [form, setForm] = useState({
        name: "",
        description: "",
        category_id: "",
        subcategory_id: "",
        brand: "",
        sku: "",
        base_price: "",
        sale_price: "",
        featured: false,
        status: "draft"
    });


    /* =====================================================
       CATEGORIES
    ===================================================== */

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);


    /* =====================================================
       VARIANTS
    ===================================================== */

    const [variants, setVariants] = useState([
        { ...emptyVariant }
    ]);


    /* =====================================================
       IMAGES
    ===================================================== */

    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const [imageUrl, setImageUrl] = useState("");
    const [imageUrls, setImageUrls] = useState([]);


    /* =====================================================
       UI STATE
    ===================================================== */

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    /* =====================================================
       LOAD CATEGORIES
    ===================================================== */

    useEffect(() => {

        const loadCategories = async () => {

            try {

                setLoadingCategories(true);

                const response = await getCategories();

                const data = response?.data;

                const categoryList =
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data?.categories)
                            ? data.categories
                            : [];

                setCategories(categoryList);

            } catch (err) {

                console.error(
                    "Failed to load categories:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load categories."
                );

            } finally {

                setLoadingCategories(false);

            }

        };

        loadCategories();

    }, []);


    /* =====================================================
       MAIN CATEGORIES
    ===================================================== */

    const mainCategories = useMemo(() => {

        return categories.filter(
            (category) =>
                category.parent_id === null ||
                category.parent_id === undefined ||
                Number(category.parent_id) === 0
        );

    }, [categories]);


    /* =====================================================
       SUBCATEGORIES
    ===================================================== */

    const subCategories = useMemo(() => {

        if (!form.category_id) {
            return [];
        }

        return categories.filter(
            (category) =>
                Number(category.parent_id) ===
                Number(form.category_id)
        );

    }, [categories, form.category_id]);


    /* =====================================================
       FORM CHANGE
    ===================================================== */

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked
        } = event.target;

        setForm((previous) => {

            const updated = {
                ...previous,
                [name]:
                    type === "checkbox"
                        ? checked
                        : value
            };

            if (name === "category_id") {
                updated.subcategory_id = "";
            }

            return updated;

        });

        setError("");
        setSuccess("");

    };


    /* =====================================================
       VARIANT CHANGE
    ===================================================== */

    const handleVariantChange = (
        index,
        field,
        value
    ) => {

        setVariants((previous) => {

            const updated = [...previous];

            updated[index] = {
                ...updated[index],
                [field]: value
            };

            return updated;

        });

        setError("");

    };


    /* =====================================================
       ADD VARIANT
    ===================================================== */

    const addVariant = () => {

        setVariants((previous) => [
            ...previous,
            { ...emptyVariant }
        ]);

    };


    /* =====================================================
       REMOVE VARIANT
    ===================================================== */

    const removeVariant = (index) => {

        if (variants.length === 1) {

            setVariants([
                { ...emptyVariant }
            ]);

            return;
        }

        setVariants((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );

    };


    /* =====================================================
       IMAGE FILE VALIDATION
    ===================================================== */

    const validateImageFile = (file) => {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            return "Only JPG, JPEG, PNG and WEBP images are allowed.";

        }

        if (file.size > MAX_FILE_SIZE) {

            return "Each image must be smaller than 5MB.";

        }

        return null;

    };


    /* =====================================================
       IMAGE FILE CHANGE
    ===================================================== */

    const handleImageChange = (event) => {

        const selectedFiles =
            Array.from(event.target.files || []);

        if (!selectedFiles.length) {
            return;
        }

        const currentTotal =
            images.length +
            imageUrls.length;

        if (
            currentTotal + selectedFiles.length >
            MAX_IMAGES
        ) {

            setError(
                `You can add a maximum of ${MAX_IMAGES} images in total.`
            );

            event.target.value = "";

            return;
        }

        const validFiles = [];

        for (const file of selectedFiles) {

            const validationError =
                validateImageFile(file);

            if (validationError) {

                setError(validationError);

                continue;

            }

            validFiles.push(file);

        }

        if (!validFiles.length) {

            event.target.value = "";

            return;

        }

        setImages((previous) => [
            ...previous,
            ...validFiles
        ]);

        const newPreviews =
            validFiles.map((file) => ({
                file,
                url: URL.createObjectURL(file)
            }));

        setImagePreviews((previous) => [
            ...previous,
            ...newPreviews
        ]);

        setError("");

        event.target.value = "";

    };


    /* =====================================================
       REMOVE UPLOADED IMAGE
    ===================================================== */

    const removeUploadedImage = (index) => {

        const imageToRemove =
            imagePreviews[index];

        if (imageToRemove?.url) {

            URL.revokeObjectURL(
                imageToRemove.url
            );

        }

        setImagePreviews((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );

        setImages((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );

    };


    /* =====================================================
       ADD IMAGE URL
    ===================================================== */

    const handleAddImageUrl = () => {

        const url =
            imageUrl.trim();

        if (!url) {

            setError(
                "Please enter an image URL."
            );

            return;
        }

        try {

            const parsedUrl =
                new URL(url);

            if (
                parsedUrl.protocol !== "http:" &&
                parsedUrl.protocol !== "https:"
            ) {

                throw new Error(
                    "Invalid protocol"
                );

            }

        } catch {

            setError(
                "Please enter a valid image URL starting with http:// or https://."
            );

            return;

        }

        const totalImages =
            images.length +
            imageUrls.length;

        if (totalImages >= MAX_IMAGES) {

            setError(
                `You can add a maximum of ${MAX_IMAGES} images.`
            );

            return;
        }

        if (
            imageUrls.some(
                (existingUrl) =>
                    existingUrl === url
            )
        ) {

            setError(
                "This image URL has already been added."
            );

            return;
        }

        setImageUrls((previous) => [
            ...previous,
            url
        ]);

        setImageUrl("");

        setError("");

    };


    /* =====================================================
       IMAGE URL ENTER
    ===================================================== */

    const handleImageUrlKeyDown = (event) => {

        if (event.key === "Enter") {

            event.preventDefault();

            handleAddImageUrl();

        }

    };


    /* =====================================================
       REMOVE IMAGE URL
    ===================================================== */

    const removeImageUrl = (index) => {

        setImageUrls((previous) =>
            previous.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );

    };


    /* =====================================================
       CLEAN PREVIEW URLS
    ===================================================== */

    useEffect(() => {

        return () => {

            imagePreviews.forEach(
                (preview) => {

                    if (preview.url) {

                        URL.revokeObjectURL(
                            preview.url
                        );

                    }

                }
            );

        };

    }, [imagePreviews]);


    /* =====================================================
       TOTAL IMAGE COUNT
    ===================================================== */

    const totalImages =
        images.length +
        imageUrls.length;


    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {

        if (!form.name.trim()) {

            return "Product name is required.";

        }

        if (!form.category_id) {

            return "Please select a category.";

        }

        if (
            !form.base_price ||
            Number(form.base_price) < 0
        ) {

            return "Please enter a valid base price.";

        }

        if (
            form.sale_price !== "" &&
            Number(form.sale_price) < 0
        ) {

            return "Sale price cannot be negative.";

        }

        if (
            form.sale_price !== "" &&
            Number(form.sale_price) >
            Number(form.base_price)
        ) {

            return "Sale price cannot be greater than base price.";

        }

        if (totalImages === 0) {

            return "Please add at least one product image or image URL.";

        }

        if (totalImages > MAX_IMAGES) {

            return `You can add a maximum of ${MAX_IMAGES} images.`;

        }


        /* Validate variants */

        for (
            let index = 0;
            index < variants.length;
            index++
        ) {

            const variant =
                variants[index];

            if (
                !String(
                    variant.size || ""
                ).trim() &&
                !String(
                    variant.color || ""
                ).trim()
            ) {

                return `Variant ${index + 1} must have a size or color.`;

            }

            if (
                variant.stock_quantity === "" ||
                Number(
                    variant.stock_quantity
                ) < 0
            ) {

                return `Variant ${index + 1} has an invalid stock quantity.`;

            }

            if (
                variant.price_override !== "" &&
                Number(
                    variant.price_override
                ) < 0
            ) {

                return `Variant ${index + 1} has an invalid price override.`;

            }

        }

        return null;

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        const validationError =
            validateForm();

        if (validationError) {

            setError(validationError);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;
        }

        try {

            setLoading(true);

            const formData =
                new FormData();


            /* PRODUCT */

            formData.append(
                "name",
                form.name.trim()
            );

            formData.append(
                "description",
                form.description.trim()
            );


            /* CATEGORY */

            const finalCategoryId =
                form.subcategory_id ||
                form.category_id;

            formData.append(
                "category_id",
                finalCategoryId
            );


            /* OTHER PRODUCT FIELDS */

            formData.append(
                "brand",
                form.brand.trim()
            );

            formData.append(
                "sku",
                form.sku.trim()
            );

            formData.append(
                "base_price",
                Number(form.base_price)
            );

            if (form.sale_price !== "") {

                formData.append(
                    "sale_price",
                    Number(form.sale_price)
                );

            }

            formData.append(
                "featured",
                form.featured
                    ? "1"
                    : "0"
            );

            formData.append(
                "status",
                form.status
            );


            /* =================================================
               VARIANTS
            ================================================= */

            const cleanVariants =
                variants.map(
                    (variant) => ({

                        size:
                            String(
                                variant.size || ""
                            ).trim(),

                        color:
                            String(
                                variant.color || ""
                            ).trim(),

                        sku:
                            String(
                                variant.sku || ""
                            ).trim(),

                        price_override:
                            variant.price_override === ""
                                ? null
                                : Number(
                                    variant.price_override
                                ),

                        stock_quantity:
                            Number(
                                variant.stock_quantity || 0
                            )

                    })
                );


            formData.append(
                "variants",
                JSON.stringify(
                    cleanVariants
                )
            );


            /* =================================================
               UPLOADED IMAGES
            ================================================= */

            images.forEach(
                (file) => {

                    formData.append(
                        "images",
                        file
                    );

                }
            );


            /* =================================================
               IMAGE URLS
            ================================================= */

            formData.append(
                "image_urls",
                JSON.stringify(
                    imageUrls
                )
            );


            /* =================================================
               CREATE PRODUCT
            ================================================= */

            await createAdminProduct(
                formData
            );


            setSuccess(
                "Product created successfully."
            );


            setTimeout(() => {

                navigate(
                    "/admin/products"
                );

            }, 900);

        } catch (err) {

            console.error(
                "Create product error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to create product. Please try again."
            );

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       RESET
    ===================================================== */

    const handleReset = () => {

        imagePreviews.forEach(
            (preview) => {

                if (preview.url) {

                    URL.revokeObjectURL(
                        preview.url
                    );

                }

            }
        );

        setForm({
            name: "",
            description: "",
            category_id: "",
            subcategory_id: "",
            brand: "",
            sku: "",
            base_price: "",
            sale_price: "",
            featured: false,
            status: "draft"
        });

        setVariants([
            { ...emptyVariant }
        ]);

        setImages([]);
        setImagePreviews([]);
        setImageUrls([]);
        setImageUrl("");

        setError("");
        setSuccess("");

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <AdminLayout>

            <div className="add-product-page">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="add-product-header">

                    <div>

                        <button
                            type="button"
                            className="back-button"
                            onClick={() =>
                                navigate(
                                    "/admin/products"
                                )
                            }
                        >
                            <FiArrowLeft />
                            Back to Products
                        </button>

                        <h1>
                            Add Product
                        </h1>

                        <p>
                            Create a new product for your store.
                        </p>

                    </div>


                    <div className="header-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            <FiX />
                            Reset
                        </button>

                        <button
                            type="submit"
                            form="add-product-form"
                            className="primary-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="button-spinner"></span>
                                    Saving...
                                </>

                            ) : (

                                <>
                                    <FiSave />
                                    Save Product
                                </>

                            )}

                        </button>

                    </div>

                </div>


                {/* =================================================
                   ALERTS
                ================================================= */}

                {error && (

                    <div className="form-alert error-alert">

                        <FiX />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {success && (

                    <div className="form-alert success-alert">

                        <FiCheck />

                        <span>
                            {success}
                        </span>

                    </div>

                )}


                <form
                    id="add-product-form"
                    onSubmit={handleSubmit}
                >

                    <div className="add-product-layout">


                        {/* =================================================
                           MAIN
                        ================================================= */}

                        <div className="add-product-main">


                            {/* BASIC INFORMATION */}

                            <section className="product-card">

                                <div className="card-heading">

                                    <div className="heading-icon">
                                        <FiCheck />
                                    </div>

                                    <div>

                                        <h2>
                                            Basic Information
                                        </h2>

                                        <p>
                                            Enter the main product details.
                                        </p>

                                    </div>

                                </div>


                                <div className="form-grid">

                                    <div className="form-group full-width">

                                        <label>
                                            Product Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Example: Women's Floral Summer Dress"
                                            maxLength="200"
                                        />

                                    </div>


                                    <div className="form-group full-width">

                                        <label>
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Describe the product..."
                                            rows="6"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Brand
                                        </label>

                                        <input
                                            type="text"
                                            name="brand"
                                            value={form.brand}
                                            onChange={handleChange}
                                            placeholder="Example: BgadiFashion"
                                            maxLength="120"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Product SKU
                                        </label>

                                        <input
                                            type="text"
                                            name="sku"
                                            value={form.sku}
                                            onChange={handleChange}
                                            placeholder="Example: DRESS-001"
                                            maxLength="80"
                                        />

                                    </div>

                                </div>

                            </section>


                            {/* CATEGORY */}

                            <section className="product-card">

                                <div className="card-heading">

                                    <div className="heading-icon">
                                        <FiCheck />
                                    </div>

                                    <div>

                                        <h2>
                                            Category
                                        </h2>

                                        <p>
                                            Select the product category.
                                        </p>

                                    </div>

                                </div>


                                <div className="form-grid">

                                    <div className="form-group">

                                        <label>
                                            Main Category
                                            <span>*</span>
                                        </label>

                                        <select
                                            name="category_id"
                                            value={form.category_id}
                                            onChange={handleChange}
                                            disabled={loadingCategories}
                                        >

                                            <option value="">
                                                {loadingCategories
                                                    ? "Loading categories..."
                                                    : "Select category"}
                                            </option>

                                            {mainCategories.map(
                                                (category) => (

                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Subcategory
                                        </label>

                                        <select
                                            name="subcategory_id"
                                            value={form.subcategory_id}
                                            onChange={handleChange}
                                            disabled={
                                                !form.category_id ||
                                                subCategories.length === 0
                                            }
                                        >

                                            <option value="">
                                                {subCategories.length
                                                    ? "Select subcategory"
                                                    : "No subcategories"}
                                            </option>

                                            {subCategories.map(
                                                (category) => (

                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>

                            </section>


                            {/* PRICING */}

                            <section className="product-card">

                                <div className="card-heading">

                                    <div className="heading-icon">
                                        ₹
                                    </div>

                                    <div>

                                        <h2>
                                            Pricing
                                        </h2>

                                        <p>
                                            Set the product selling price.
                                        </p>

                                    </div>

                                </div>


                                <div className="form-grid">

                                    <div className="form-group">

                                        <label>
                                            Base Price
                                            <span>*</span>
                                        </label>

                                        <div className="price-input">

                                            <span>
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                name="base_price"
                                                value={form.base_price}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                            />

                                        </div>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Sale Price
                                        </label>

                                        <div className="price-input">

                                            <span>
                                                ₹
                                            </span>

                                            <input
                                                type="number"
                                                name="sale_price"
                                                value={form.sale_price}
                                                onChange={handleChange}
                                                placeholder="Optional"
                                                min="0"
                                                step="0.01"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* =================================================
                               PRODUCT VARIANTS
                            ================================================= */}

                            <section className="product-card">

                                <div className="card-heading variant-heading">

                                    <div>

                                        <h2>
                                            Product Variants
                                        </h2>

                                        <p>
                                            Add sizes, colors, SKU, price and stock quantities.
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className="small-primary-button"
                                        onClick={addVariant}
                                    >
                                        <FiPlus />
                                        Add Variant
                                    </button>

                                </div>


                                <div className="variant-list">

                                    {variants.map(
                                        (variant, index) => (

                                            <div
                                                className="variant-row"
                                                key={index}
                                            >


                                                {/* NUMBER */}

                                                <div className="variant-number">
                                                    {index + 1}
                                                </div>


                                                {/* SIZE */}

                                                <div className="variant-field">

                                                    <label>
                                                        Size
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={variant.size}
                                                        onChange={(event) =>
                                                            handleVariantChange(
                                                                index,
                                                                "size",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="S / M / L / XL"
                                                    />

                                                </div>


                                                {/* COLOR */}

                                                <div className="variant-field">

                                                    <label>
                                                        Color
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={variant.color}
                                                        onChange={(event) =>
                                                            handleVariantChange(
                                                                index,
                                                                "color",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="Black"
                                                    />

                                                </div>


                                                {/* SKU */}

                                                <div className="variant-field">

                                                    <label>
                                                        SKU
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={variant.sku}
                                                        onChange={(event) =>
                                                            handleVariantChange(
                                                                index,
                                                                "sku",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="SKU"
                                                    />

                                                </div>


                                                {/* PRICE OVERRIDE */}

                                                <div className="variant-field">

                                                    <label>
                                                        Price Override
                                                    </label>

                                                    <input
                                                        type="number"
                                                        value={
                                                            variant.price_override
                                                        }
                                                        onChange={(event) =>
                                                            handleVariantChange(
                                                                index,
                                                                "price_override",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="Optional"
                                                        min="0"
                                                        step="0.01"
                                                    />

                                                </div>


                                                {/* STOCK QUANTITY */}

                                                <div className="variant-field variant-stock-field">

                                                    <label>
                                                        Stock Quantity
                                                    </label>

                                                    <input
                                                        type="number"
                                                        value={
                                                            variant.stock_quantity
                                                        }
                                                        onChange={(event) =>
                                                            handleVariantChange(
                                                                index,
                                                                "stock_quantity",
                                                                event.target.value
                                                            )
                                                        }
                                                        placeholder="0"
                                                        min="0"
                                                        step="1"
                                                    />

                                                </div>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    className="remove-variant-button"
                                                    onClick={() =>
                                                        removeVariant(index)
                                                    }
                                                    title="Remove variant"
                                                >
                                                    <FiTrash2 />
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </section>


                            {/* =================================================
                               PRODUCT IMAGES
                            ================================================= */}

                            <section className="product-card">

                                <div className="card-heading">

                                    <div className="heading-icon">
                                        <FiImage />
                                    </div>

                                    <div>

                                        <h2>
                                            Product Images
                                        </h2>

                                        <p>
                                            Upload images or add image URLs.
                                            Maximum {MAX_IMAGES} images.
                                        </p>

                                    </div>

                                </div>


                                {/* UPLOAD */}

                                <label
                                    htmlFor="product-images"
                                    className="image-upload-area"
                                >

                                    <div className="upload-icon">
                                        <FiUpload />
                                    </div>

                                    <h3>
                                        Upload Product Images
                                    </h3>

                                    <p>
                                        Click to browse images from your computer
                                    </p>

                                    <span>
                                        JPG, JPEG, PNG or WEBP • Max 5MB each
                                    </span>

                                    <input
                                        id="product-images"
                                        type="file"
                                        accept="image/jpeg,image/jpg,image/png,image/webp"
                                        multiple
                                        onChange={handleImageChange}
                                        disabled={
                                            totalImages >= MAX_IMAGES
                                        }
                                    />

                                </label>


                                {/* URL */}

                                <div className="image-url-section">

                                    <div className="image-url-title">

                                        <FiImage />

                                        <span>
                                            Or add image using URL
                                        </span>

                                    </div>


                                    <div className="image-url-input-row">

                                        <input
                                            type="url"
                                            value={imageUrl}
                                            onChange={(event) =>
                                                setImageUrl(
                                                    event.target.value
                                                )
                                            }
                                            onKeyDown={
                                                handleImageUrlKeyDown
                                            }
                                            placeholder="https://example.com/product-image.jpg"
                                            disabled={
                                                totalImages >= MAX_IMAGES
                                            }
                                        />


                                        <button
                                            type="button"
                                            className="add-url-button"
                                            onClick={
                                                handleAddImageUrl
                                            }
                                            disabled={
                                                totalImages >= MAX_IMAGES
                                            }
                                        >
                                            <FiPlus />
                                            Add URL
                                        </button>

                                    </div>


                                    <p className="image-url-help">
                                        Paste a publicly accessible image URL.
                                        The URL will be stored directly in the database.
                                    </p>

                                </div>


                                {/* COUNTER */}

                                <div className="image-counter">

                                    <strong>
                                        {totalImages}
                                    </strong>

                                    <span>
                                        / {MAX_IMAGES} images added
                                    </span>

                                </div>


                                {/* PREVIEWS */}

                                {totalImages > 0 && (

                                    <div className="image-preview-grid">

                                        {imagePreviews.map(
                                            (preview, index) => (

                                                <div
                                                    className="image-preview-card"
                                                    key={`file-${index}`}
                                                >

                                                    <div className="preview-image-wrapper">

                                                        <img
                                                            src={preview.url}
                                                            alt={`Product ${index + 1}`}
                                                        />

                                                        {index === 0 && (

                                                            <span className="primary-image-badge">
                                                                Primary
                                                            </span>

                                                        )}

                                                        <button
                                                            type="button"
                                                            className="remove-image-button"
                                                            onClick={() =>
                                                                removeUploadedImage(
                                                                    index
                                                                )
                                                            }
                                                            title="Remove image"
                                                        >
                                                            <FiX />
                                                        </button>

                                                    </div>


                                                    <div className="preview-info">

                                                        <strong>
                                                            Uploaded Image
                                                        </strong>

                                                        <span>
                                                            {preview.file.name}
                                                        </span>

                                                    </div>

                                                </div>

                                            )
                                        )}


                                        {imageUrls.map(
                                            (url, index) => {

                                                const primary =
                                                    images.length === 0 &&
                                                    index === 0;

                                                return (

                                                    <div
                                                        className="image-preview-card"
                                                        key={`url-${index}`}
                                                    >

                                                        <div className="preview-image-wrapper">

                                                            <img
                                                                src={url}
                                                                alt={`Product URL ${index + 1}`}
                                                                onError={(event) => {

                                                                    event.currentTarget.classList.add(
                                                                        "broken-image"
                                                                    );

                                                                }}
                                                            />


                                                            {primary && (

                                                                <span className="primary-image-badge">
                                                                    Primary
                                                                </span>

                                                            )}


                                                            <button
                                                                type="button"
                                                                className="remove-image-button"
                                                                onClick={() =>
                                                                    removeImageUrl(
                                                                        index
                                                                    )
                                                                }
                                                                title="Remove image"
                                                            >
                                                                <FiX />
                                                            </button>

                                                        </div>


                                                        <div className="preview-info">

                                                            <strong>
                                                                Image URL
                                                            </strong>

                                                            <span title={url}>
                                                                {url}
                                                            </span>

                                                        </div>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                )}


                                {totalImages > 0 && (

                                    <div className="primary-image-note">

                                        <FiCheck />

                                        <span>
                                            The first image will automatically
                                            be used as the primary product image.
                                        </span>

                                    </div>

                                )}

                            </section>

                        </div>


                        {/* =================================================
                           SIDEBAR
                        ================================================= */}

                        <aside className="add-product-sidebar">


                            {/* PUBLISH */}

                            <section className="product-card sidebar-card">

                                <div className="card-heading">

                                    <div>

                                        <h2>
                                            Publish
                                        </h2>

                                        <p>
                                            Control product visibility.
                                        </p>

                                    </div>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={form.status}
                                        onChange={handleChange}
                                    >

                                        <option value="draft">
                                            Draft
                                        </option>

                                        <option value="active">
                                            Active
                                        </option>

                                        <option value="archived">
                                            Archived
                                        </option>

                                    </select>

                                </div>


                                <label className="featured-toggle">

                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={form.featured}
                                        onChange={handleChange}
                                    />

                                    <span className="toggle-slider"></span>

                                    <div>

                                        <strong>
                                            Featured Product
                                        </strong>

                                        <small>
                                            Show this product in featured sections.
                                        </small>

                                    </div>

                                </label>


                                <button
                                    type="submit"
                                    className="sidebar-save-button"
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>
                                            <span className="button-spinner"></span>
                                            Saving Product...
                                        </>

                                    ) : (

                                        <>
                                            <FiSave />
                                            Save Product
                                        </>

                                    )}

                                </button>

                            </section>


                            {/* SUMMARY */}

                            <section className="product-card sidebar-card">

                                <div className="card-heading">

                                    <div>

                                        <h2>
                                            Product Summary
                                        </h2>

                                    </div>

                                </div>


                                <div className="summary-list">

                                    <div>

                                        <span>
                                            Images
                                        </span>

                                        <strong>
                                            {totalImages}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Variants
                                        </span>

                                        <strong>
                                            {variants.length}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Status
                                        </span>

                                        <strong className="summary-status">
                                            {form.status}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Featured
                                        </span>

                                        <strong>
                                            {form.featured
                                                ? "Yes"
                                                : "No"}
                                        </strong>

                                    </div>

                                </div>

                            </section>


                            {/* HELP */}

                            <section className="product-card sidebar-card help-card">

                                <div className="help-icon">
                                    <FiCheck />
                                </div>

                                <h3>
                                    Product Image Tip
                                </h3>

                                <p>
                                    You can use uploaded images from your
                                    computer or paste publicly accessible
                                    image URLs. The first image will
                                    automatically become the primary image.
                                </p>

                            </section>

                        </aside>

                    </div>

                </form>

            </div>

        </AdminLayout>

    );

};


export default AddProduct;