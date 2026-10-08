
import React, { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import { getPublicFaqs } from "../services/api";

import "../css/info-pages.css";

const FAQ = () => {

    const [faqs, setFaqs] = useState([]);
    const [openFaq, setOpenFaq] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadFaqs();
    }, []);

    const loadFaqs = async () => {
        try {

            setLoading(true);
            setError("");

            const response =
                await getPublicFaqs();

            const data =
                response?.data?.faqs || [];

            setFaqs(data);

        } catch (err) {

            console.error(
                "GET FAQ ERROR:",
                err
            );

            setError(
                "Unable to load frequently asked questions."
            );

        } finally {

            setLoading(false);

        }
    };


    const toggleFaq = (id) => {

        setOpenFaq(
            openFaq === id
                ? null
                : id
        );

    };


    return (
        <main className="info-page">

            {/* PAGE HERO */}
            <section className="info-hero">

                <div className="info-container">

                    <span className="info-eyebrow">
                        HELP CENTER
                    </span>

                    <h1>
                        Frequently Asked Questions
                    </h1>

                    <p>
                        Find answers to common questions
                        about our store, products, orders,
                        and services.
                    </p>

                </div>

            </section>


            {/* FAQ CONTENT */}
            <section className="info-section">

                <div className="info-container">

                    <div className="faq-wrapper">

                        {loading && (
                            <div className="info-loading">
                                Loading FAQs...
                            </div>
                        )}


                        {!loading && error && (
                            <div className="info-error">
                                {error}

                                <button
                                    type="button"
                                    onClick={loadFaqs}
                                >
                                    Try Again
                                </button>
                            </div>
                        )}


                        {!loading &&
                            !error &&
                            faqs.length === 0 && (
                                <div className="info-empty">

                                    <h3>
                                        No FAQs available
                                    </h3>

                                    <p>
                                        Frequently asked questions
                                        will appear here once they
                                        are added by the administrator.
                                    </p>

                                </div>
                            )}


                        {!loading &&
                            !error &&
                            faqs.length > 0 && (

                                <div className="faq-list">

                                    {faqs.map((faq) => {

                                        const isOpen =
                                            openFaq === faq.id;

                                        return (
                                            <div
                                                className={`faq-item ${
                                                    isOpen
                                                        ? "active"
                                                        : ""
                                                }`}
                                                key={faq.id}
                                            >

                                                <button
                                                    type="button"
                                                    className="faq-question"
                                                    onClick={() =>
                                                        toggleFaq(
                                                            faq.id
                                                        )
                                                    }
                                                    aria-expanded={
                                                        isOpen
                                                    }
                                                >

                                                    <span>
                                                        {faq.question}
                                                    </span>

                                                    <FiChevronDown
                                                        className="faq-icon"
                                                    />

                                                </button>


                                                {isOpen && (
                                                    <div className="faq-answer">

                                                        <p>
                                                            {faq.answer}
                                                        </p>

                                                    </div>
                                                )}

                                            </div>
                                        );

                                    })}

                                </div>

                            )}

                    </div>

                </div>

            </section>

        </main>
    );
};

export default FAQ;

