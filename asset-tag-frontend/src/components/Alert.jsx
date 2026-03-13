import React, { useEffect } from "react";
import "./Alert.css";

const Alert = ({ type = "info", message, onClose, autoDismiss = 5000 }) => {

    // Auto-dismiss logic
    useEffect(() => {
        if (!autoDismiss) return;
        const timer = setTimeout(onClose, autoDismiss);
        return () => clearTimeout(timer);
    }, [autoDismiss, onClose]);

    return (
        <section className={`alert alert--${type}`} role="alert" aria-live="assertive">
            <div className="alert__content">
                <span className="alert__icon" aria-hidden="true">
                    {type === "success" && "✅"}
                    {type === "error" && "⚠️"}
                    {type === "warning" && "⚠️"}
                    {type === "info" && "ℹ️"}
                </span>

                <p className="alert__message">{message}</p>
            </div>

            <button
                className="alert__close-btn"
                aria-label="Close alert"
                onClick={onClose}
            >
                ×
            </button>
        </section>
    );
};

export default Alert;