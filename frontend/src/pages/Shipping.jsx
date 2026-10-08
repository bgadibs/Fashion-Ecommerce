

import React from "react";
import {
    FiTruck,
    FiPackage,
    FiClock,
    FiMapPin,
} from "react-icons/fi";

import { useApp } from "../context/AppContext";

import "../css/info-pages.css";

const Shipping = () => {

    const {
        storeSettings,
        loading,
    } = useApp();


    if (loading) {
        return (
            <main className="info-page">

                <div className="info-container">

                    <div className="info-loading">
                        Loading shipping information...
                    </div>

                </div>

            </main>
        );
    }


    const settings =
        storeSettings || {};


    const storeName =
        settings.store_name ||
        "Fashion Store";


    const shippingTitle =
        settings.shipping_title ||
        "Shipping Information";


    const shippingDescription =
        settings.shipping_description ||
        "";


    const processingInformation =
        settings.processing_information ||
        "";


    const deliveryInformation =
        settings.delivery_information ||
        "";


    const shippingPolicy =
        settings.shipping_policy ||
        "";


    const shippingThreshold =
        settings.shipping_threshold;


    const currency =
        settings.currency ||
        "INR";


    const shippingActive =
        settings.shipping_active !== false &&
        settings.shipping_active !== 0 &&
        settings.shipping_active !== "0";


    if (!shippingActive) {

        return (
            <main className="info-page">

                <section className="info-hero">

                    <div className="info-container">

                        <span className="info-eyebrow">
                            SHIPPING
                        </span>

                        <h1>
                            {shippingTitle}
                        </h1>

                    </div>

                </section>


                <section className="info-section">

                    <div className="info-container">

                        <div className="info-empty">

                            <FiTruck className="info-empty-icon" />

                            <h3>
                                Shipping information is
                                currently unavailable
                            </h3>

                            <p>
                                Please check back later for
                                updated shipping information.
                            </p>

                        </div>

                    </div>

                </section>

            </main>
        );
    }


    return (
        <main className="info-page">

            {/* HERO */}
            <section className="info-hero">

                <div className="info-container">

                    <span className="info-eyebrow">
                        DELIVERY & SHIPPING
                    </span>

                    <h1>
                        {shippingTitle}
                    </h1>

                    {shippingDescription && (
                        <p>
                            {shippingDescription}
                        </p>
                    )}

                </div>

            </section>


            {/* SHIPPING CARDS */}
            <section className="info-section">

                <div className="info-container">

                    <div className="shipping-grid">

                        {/* PROCESSING */}
                        {processingInformation && (
                            <div className="shipping-card">

                                <div className="shipping-icon">
                                    <FiPackage />
                                </div>

                                <span>
                                    ORDER PROCESSING
                                </span>

                                <h3>
                                    Preparing your order
                                </h3>

                                <p>
                                    {processingInformation}
                                </p>

                            </div>
                        )}


                        {/* DELIVERY */}
                        {deliveryInformation && (
                            <div className="shipping-card">

                                <div className="shipping-icon">
                                    <FiTruck />
                                </div>

                                <span>
                                    DELIVERY
                                </span>

                                <h3>
                                    Delivery information
                                </h3>

                                <p>
                                    {deliveryInformation}
                                </p>

                            </div>
                        )}


                        {/* POLICY */}
                        {shippingPolicy && (
                            <div className="shipping-card">

                                <div className="shipping-icon">
                                    <FiMapPin />
                                </div>

                                <span>
                                    SHIPPING POLICY
                                </span>

                                <h3>
                                    Our shipping policy
                                </h3>

                                <p>
                                    {shippingPolicy}
                                </p>

                            </div>
                        )}

                    </div>


                    {/* FREE SHIPPING */}
                    {shippingThreshold !==
                        undefined &&
                        shippingThreshold !==
                            null &&
                        shippingThreshold !== "" && (

                        <div className="free-shipping-banner">

                            <div className="free-shipping-icon">
                                <FiTruck />
                            </div>

                            <div>

                                <span>
                                    FREE SHIPPING
                                </span>

                                <h3>
                                    Enjoy free shipping
                                    on eligible orders
                                </h3>

                                <p>
                                    Free shipping is available
                                    when your order reaches{" "}
                                    <strong>
                                        {currency}{" "}
                                        {Number(
                                            shippingThreshold
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>{" "}
                                    or more.
                                </p>

                            </div>

                        </div>
                    )}


                    {/* STORE */}
                    <div className="shipping-footer">

                        <FiClock />

                        <p>
                            Shipping information provided by{" "}
                            <strong>
                                {storeName}
                            </strong>
                            .
                        </p>

                    </div>

                </div>

            </section>

        </main>
    );
};


export default Shipping;



