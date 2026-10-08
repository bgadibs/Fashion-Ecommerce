
import React from "react";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiInstagram,
    FiFacebook,
    FiTwitter,
} from "react-icons/fi";

import { useApp } from "../context/AppContext";

import "../css/info-pages.css";

const Contact = () => {
    const { storeSettings, loading } = useApp();

    if (loading) {
        return (
            <main className="info-page">
                <div className="info-container">
                    <div className="info-loading">
                        Loading contact information...
                    </div>
                </div>
            </main>
        );
    }

    const settings = storeSettings || {};

    const storeName =
        settings.store_name || "Fashion Store";

    const description =
        settings.contact_description ||
        settings.store_tagline ||
        "";

    const email =
        settings.store_email || "";

    const phone =
        settings.store_phone || "";

    const address =
        settings.store_address || "";

    const instagram =
        settings.instagram_url || "";

    const facebook =
        settings.facebook_url || "";

    const twitter =
        settings.twitter_url || "";

    return (
        <main className="info-page">

            {/* PAGE HERO */}
            <section className="info-hero">
                <div className="info-container">

                    <span className="info-eyebrow">
                        GET IN TOUCH
                    </span>

                    <h1>
                        Contact Us
                    </h1>

                    {description && (
                        <p>
                            {description}
                        </p>
                    )}

                </div>
            </section>


            {/* CONTACT CONTENT */}
            <section className="info-section">
                <div className="info-container">

                    <div className="contact-layout">

                        {/* LEFT SIDE */}
                        <div className="contact-intro">

                            <span className="info-section-eyebrow">
                                WE ARE HERE TO HELP
                            </span>

                            <h2>
                                We'd love to hear from you.
                            </h2>

                            {description && (
                                <p>
                                    {description}
                                </p>
                            )}

                            <p>
                                If you have questions about products,
                                orders, delivery, returns, or anything
                                else, feel free to contact us.
                            </p>

                            {(instagram ||
                                facebook ||
                                twitter) && (
                                <div className="contact-socials">

                                    {instagram && (
                                        <a
                                            href={instagram}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Instagram"
                                        >
                                            <FiInstagram />
                                        </a>
                                    )}

                                    {facebook && (
                                        <a
                                            href={facebook}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Facebook"
                                        >
                                            <FiFacebook />
                                        </a>
                                    )}

                                    {twitter && (
                                        <a
                                            href={twitter}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Twitter"
                                        >
                                            <FiTwitter />
                                        </a>
                                    )}

                                </div>
                            )}

                        </div>


                        {/* RIGHT SIDE */}
                        <div className="contact-cards">

                            {/* STORE */}
                            <div className="contact-card">

                                <div className="contact-card-icon">
                                    <FiMapPin />
                                </div>

                                <div>
                                    <span>
                                        Store
                                    </span>

                                    <h3>
                                        {storeName}
                                    </h3>

                                    {address && (
                                        <p>
                                            {address}
                                        </p>
                                    )}
                                </div>

                            </div>


                            {/* EMAIL */}
                            {email && (
                                <div className="contact-card">

                                    <div className="contact-card-icon">
                                        <FiMail />
                                    </div>

                                    <div>
                                        <span>
                                            Email
                                        </span>

                                        <h3>
                                            {email}
                                        </h3>

                                        <a
                                            href={`mailto:${email}`}
                                        >
                                            Send us an email
                                        </a>
                                    </div>

                                </div>
                            )}


                            {/* PHONE */}
                            {phone && (
                                <div className="contact-card">

                                    <div className="contact-card-icon">
                                        <FiPhone />
                                    </div>

                                    <div>
                                        <span>
                                            Phone
                                        </span>

                                        <h3>
                                            {phone}
                                        </h3>

                                        <a
                                            href={`tel:${phone}`}
                                        >
                                            Call us
                                        </a>
                                    </div>

                                </div>
                            )}

                        </div>

                    </div>

                </div>
            </section>


            {/* STORE INFORMATION */}
            <section className="info-section info-section-muted">

                <div className="info-container">

                    <div className="info-centered">

                        <span className="info-section-eyebrow">
                            {storeName}
                        </span>

                        <h2>
                            Your style matters to us.
                        </h2>

                        <p>
                            We are always happy to assist you with
                            your shopping experience.
                        </p>

                    </div>

                </div>

            </section>

        </main>
    );
};

export default Contact;

