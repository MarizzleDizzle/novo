"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import Link from "next/link";

const DashboardPage = () => {
    const { user } = useAuth();
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [bookings, setBookings] = useState(null);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || ""
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Styles
    const styles = {
        bookingCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.2s',
            ':hover': {
                transform: 'translateY(-2px)'
            }
        },
        pageContainer: {
            minHeight: '100vh',
            backgroundColor: '#F9FAFB', // gray-50
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '32px 16px',
        },
        header: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            padding: '32px',
            marginBottom: '32px',
        },
        headerTitle: {
            fontSize: '30px',
            fontWeight: 'bold',
            color: '#1F2937', // gray-800
        },
        headerHighlight: {
            color: '#2563EB', // blue-600
        },
        headerSubtitle: {
            color: '#6B7280', // gray-500
            marginTop: '8px',
        },
        notification: {
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
        },
        errorNotification: {
            backgroundColor: '#FEF2F2', // red-50
            borderLeft: '4px solid #EF4444', // red-500
        },
        successNotification: {
            backgroundColor: '#F0FDF4', // green-50
            borderLeft: '4px solid #10B981', // green-500
        },
        notificationIcon: {
            width: '20px',
            height: '20px',
            flexShrink: 0,
            marginRight: '12px',
        },
        notificationText: {
            fontSize: '14px',
        },
        errorText: {
            color: '#B91C1C', // red-700
        },
        successText: {
            color: '#047857', // green-700
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)',
            gap: '32px',
            '@media (min-width: 1024px)': {
                gridTemplateColumns: '1fr 2fr',
            }
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden',
        },
        cardHeader: {
            background: 'linear-gradient(to right, #2563EB, #60A5FA)',
            padding: '16px 24px',
        },
        cardTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: 'white',
        },
        cardBody: {
            padding: '24px',
        },
        menuButton: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#F9FAFB', // gray-50
            borderRadius: '8px',
            marginBottom: '12px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            ':hover': {
                backgroundColor: '#F3F4F6', // gray-100
            },
        },
        menuText: {
            fontWeight: '500',
            color: '#4B5563', // gray-600
        },
        specialButton: {
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: '#EBF5FF', // blue-50
            color: '#2563EB', // blue-600
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            ':hover': {
                backgroundColor: '#DBEAFE', // blue-100
            },
        },
        formGroup: {
            marginBottom: '16px',
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '500',
            color: '#4B5563', // gray-600
            marginBottom: '8px',
        },
        input: {
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB', // gray-300
            fontSize: '16px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            ':focus': {
                outline: 'none',
                borderColor: '#2563EB', // blue-600
                boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
            },
        },
        buttonGroup: {
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
        },
        primaryButton: {
            backgroundColor: '#2563EB', // blue-600
            color: 'white',
            fontWeight: '500',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            ':hover': {
                backgroundColor: '#1D4ED8', // blue-700
            },
            ':disabled': {
                backgroundColor: '#9CA3AF', // gray-400
                cursor: 'not-allowed',
            },
        },
        secondaryButton: {
            backgroundColor: '#F3F4F6', // gray-100
            color: '#4B5563', // gray-600
            fontWeight: '500',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            ':hover': {
                backgroundColor: '#E5E7EB', // gray-200
            },
        },
        spinnerContainer: {
            display: 'flex',
            alignItems: 'center',
        },
        spinner: {
            marginRight: '8px',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
                from: { transform: 'rotate(0deg)' },
                to: { transform: 'rotate(360deg)' },
            },
        },
        infoBox: {
            backgroundColor: '#F9FAFB', // gray-50
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px',
            color: '#6B7280', // gray-500
            fontSize: '14px',
        },
        actionLink: {
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: '#2563EB', // blue-600
            color: 'white',
            fontWeight: '500',
            padding: '8px 16px',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background-color 0.2s',
            ':hover': {
                backgroundColor: '#1D4ED8', // blue-700
            },
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '500',
            color: '#1F2937', // gray-800
            marginBottom: '16px',
        }
    };

    const handleInputChange = (e, formType) => {
        const { name, value } = e.target;
        if (formType === "profile") {
            setProfileData((prev) => ({ ...prev, [name]: value }));
        } else if (formType === "password") {
            setPasswordData((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        if (user?.userID) {
            fetch(`http://localhost:5022/api/bookings/user/${user.userID}`)
                .then(response => {
                    if (!response.ok) throw new Error('Fehler beim Laden der Buchungen');
                    return response.json();
                })
                .then(data => {
                    setBookings(data);
                    setLoadingBookings(false);
                })
                .catch(error => {
                    console.error(error);
                    setError('Fehler beim Laden der Buchungen');
                    setLoadingBookings(false);
                });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:5022/api/users/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user?.userID, ...profileData }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || "Fehler beim Aktualisieren");
            }

            setSuccess("Profildaten erfolgreich aktualisiert!");
            setShowProfileForm(false);
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            console.error(err);
            setError(err.message || "Fehler beim Aktualisieren der Profildaten");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("Die Passwörter stimmen nicht überein");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5022/api/users/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user?.userID,
                    oldPassword: passwordData.oldPassword,
                    newPassword: passwordData.newPassword
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || "Fehler beim Passwort ändern");
            }

            setSuccess("Passwort erfolgreich geändert!");
            setShowPasswordForm(false);
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            console.error(err);
            setError(err.message || "Fehler beim Ändern des Passworts");
        } finally {
            setLoading(false);
        }
    };

    const becomeProvider = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:5022/api/users/become-provider", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user?.userID }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || "Fehler beim Aktualisieren der Rolle");
            }

            setSuccess("Sie sind jetzt ein Anbieter!");
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            console.error(error);
            setError(error.message || "Fehler beim Anbieterwechsel");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F9FAFB'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '32px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#1F2937',
                        marginBottom: '24px'
                    }}>
                        Bitte einloggen
                    </h2>
                    <p style={{
                        color: '#6B7280',
                        marginBottom: '24px'
                    }}>
                        Sie müssen eingeloggt sein, um auf das Dashboard zugreifen zu können.
                    </p>
                    <Link href="/login" style={{
                        display: 'inline-block',
                        backgroundColor: '#2563EB',
                        color: 'white',
                        fontWeight: '600',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s'
                    }}>
                        Zum Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.pageContainer}>
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.headerTitle}>
                        Willkommen, <span style={styles.headerHighlight}>{user.name}</span>!
                    </h1>
                    <p style={styles.headerSubtitle}>Verwalten Sie Ihr Konto und Ihre Buchungen</p>
                </div>

                {/* Notifications */}
                {error && (
                    <div style={{...styles.notification, ...styles.errorNotification}}>
                        <svg style={{...styles.notificationIcon, color: '#EF4444'}} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <p style={{...styles.notificationText, ...styles.errorText}}>{error}</p>
                    </div>
                )}

                {success && (
                    <div style={{...styles.notification, ...styles.successNotification}}>
                        <svg style={{...styles.notificationIcon, color: '#10B981'}} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p style={{...styles.notificationText, ...styles.successText}}>{success}</p>
                    </div>
                )}

                {/* Main content */}
                <div style={styles.grid}>
                    {/* Account section */}
                    <div>
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.cardTitle}>Kontoeinstellungen</h2>
                            </div>
                            <div style={styles.cardBody}>
                                <button
                                    onClick={() => {
                                        setShowProfileForm(!showProfileForm);
                                        setShowPasswordForm(false);
                                        setError("");
                                        setSuccess("");
                                    }}
                                    style={styles.menuButton}
                                >
                                    <span style={styles.menuText}>Profildaten ändern</span>
                                    <svg style={{ width: '20px', height: '20px', color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => {
                                        setShowPasswordForm(!showPasswordForm);
                                        setShowProfileForm(false);
                                        setError("");
                                        setSuccess("");
                                    }}
                                    style={styles.menuButton}
                                >
                                    <span style={styles.menuText}>Passwort ändern</span>
                                    <svg style={{ width: '20px', height: '20px', color: '#9CA3AF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {user.role !== "provider" && (
                                    <button
                                        onClick={becomeProvider}
                                        disabled={loading}
                                        style={styles.specialButton}
                                    >
                                        <span style={{ fontWeight: '500' }}>Anbieter werden</span>
                                        {loading ? (
                                            <svg style={{
                                                width: '20px',
                                                height: '20px',
                                                color: '#2563EB',
                                                animation: 'spin 1s linear infinite'
                                            }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle style={{ opacity: '0.25' }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path style={{ opacity: '0.75' }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg style={{ width: '20px', height: '20px', color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Forms and main content */}
                    <div>
                        {showProfileForm && (
                            <div style={{...styles.card, marginBottom: '32px'}}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.cardTitle}>Profildaten bearbeiten</h3>
                                </div>
                                <div style={styles.cardBody}>
                                    <form onSubmit={handleUpdateProfile}>
                                        <div style={styles.formGroup}>
                                            <label htmlFor="name" style={styles.label}>Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={profileData.name}
                                                onChange={(e) => handleInputChange(e, "profile")}
                                                required
                                                style={styles.input}
                                            />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label htmlFor="email" style={styles.label}>E-Mail</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={(e) => handleInputChange(e, "profile")}
                                                required
                                                style={styles.input}
                                            />
                                        </div>
                                        <div style={styles.buttonGroup}>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                style={styles.primaryButton}
                                            >
                                                {loading ? (
                                                    <span style={styles.spinnerContainer}>
                            <svg style={styles.spinner} width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle style={{ opacity: '0.25' }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path style={{ opacity: '0.75' }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Wird aktualisiert...
                          </span>
                                                ) : (
                                                    "Speichern"
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowProfileForm(false)}
                                                style={styles.secondaryButton}
                                            >
                                                Abbrechen
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {showPasswordForm && (
                            <div style={{...styles.card, marginBottom: '32px'}}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.cardTitle}>Passwort ändern</h3>
                                </div>
                                <div style={styles.cardBody}>
                                    <form onSubmit={handleChangePassword}>
                                        <div style={styles.formGroup}>
                                            <label htmlFor="oldPassword" style={styles.label}>Altes Passwort</label>
                                            <input
                                                type="password"
                                                id="oldPassword"
                                                name="oldPassword"
                                                value={passwordData.oldPassword}
                                                onChange={(e) => handleInputChange(e, "password")}
                                                required
                                                style={styles.input}
                                            />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label htmlFor="newPassword" style={styles.label}>Neues Passwort</label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={(e) => handleInputChange(e, "password")}
                                                required
                                                style={styles.input}
                                            />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label htmlFor="confirmPassword" style={styles.label}>Passwort bestätigen</label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => handleInputChange(e, "password")}
                                                required
                                                style={styles.input}
                                            />
                                        </div>
                                        <div style={styles.buttonGroup}>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                style={styles.primaryButton}
                                            >
                                                {loading ? (
                                                    <span style={styles.spinnerContainer}>
                            <svg style={styles.spinner} width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle style={{ opacity: '0.25' }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path style={{ opacity: '0.75' }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Wird aktualisiert...
                          </span>
                                                ) : (
                                                    "Passwort ändern"
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordForm(false)}
                                                style={styles.secondaryButton}
                                            >
                                                Abbrechen
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Provider or User specific content */}
                        <div style={styles.card}>
                            <div style={styles.cardHeader}>
                                <h2 style={styles.cardTitle}>
                                    {user.role === "provider" ? "Anbieterübersicht" : "Buchungen"}
                                </h2>
                            </div>
                            <div style={styles.cardBody}>
                                {user.role === "provider" ? (
                                    <div>
                                        <h3 style={styles.sectionTitle}>Ihre Unterkünfte</h3>
                                        <Link
                                            href="/add"
                                            style={{...styles.actionLink, marginBottom: '16px', display: 'inline-flex'}}
                                        >
                                            <svg style={{ width: '20px', height: '20px', marginRight: '8px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Neue Unterkunft erstellen
                                        </Link>
                                        <div style={styles.infoBox}>
                                            Noch keine Unterkünfte vorhanden. Erstellen Sie Ihre erste Unterkunft!
                                        </div>

                                        <h3 style={{...styles.sectionTitle, marginTop: '24px'}}>Buchungsübersicht</h3>
                                        <div style={styles.infoBox}>
                                            Keine aktuellen Buchungen vorhanden.
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 style={styles.sectionTitle}>Ihre Buchungen</h3>
                                        <div style={styles.infoBox}>
                                            Keine aktuellen Buchungen vorhanden.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;