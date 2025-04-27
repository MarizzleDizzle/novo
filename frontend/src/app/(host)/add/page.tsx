 "use client"
import React, { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ApartmentFormData {
    title: string;
    description: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    guests: number | null;
    bedrooms: number | null;
    beds: number | null;
    bathrooms: number | null;
    size: number | null;
    price: number | null;
    minStay: number | null;
    availableNow: boolean;
    availableFromDate: string;
    wifi: boolean;
    kitchen: boolean;
    parking: boolean;
    tv: boolean;
}

const AddApartment: React.FC = () => {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [availableLater, setAvailableLater] = useState<boolean>(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [formData, setFormData] = useState<ApartmentFormData>({
        title: '',
        description: '',
        address: '',
        city: '',
        zip: '',
        country: 'DE',
        guests: null,
        bedrooms: null,
        beds: null,
        bathrooms: null,
        size: null,
        price: null,
        minStay: null,
        availableNow: true,
        availableFromDate: '',
        wifi: false,
        kitchen: false,
        parking: false,
        tv: false
    });

    // Styles
    const styles = {
        // Layout
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 16px',
        },
        header: {
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '16px 0',
        },
        nav: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        logo: {
            fontSize: '24px',
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'white',
        },
        menu: {
            display: 'flex',
            gap: '32px',
        },
        menuItem: {
            textDecoration: 'none',
            color: 'white',
        },
        pageHeader: {
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '48px 0',
            textAlign: 'center',
            marginBottom: '32px',
        },
        pageHeading: {
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '16px',
        },
        pageSubheading: {
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto',
        },

        // Form
        formContainer: {
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            marginBottom: '64px',
        },
        formTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#1e3a8a',
        },
        formSection: {
            marginBottom: '32px',
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            paddingBottom: '8px',
            borderBottom: '1px solid #E5E7EB',
            color: '#1e3a8a',
        },
        formGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
        },
        formGridThree: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px',
        },
        formGridFour: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
        },
        fullWidth: {
            gridColumn: '1 / -1',
        },
        formGroup: {
            marginBottom: '8px',
        },
        inputLabel: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151',
        },
        inputRequired: {
            color: '#EF4444',
            marginLeft: '4px',
        },
        input: {
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB',
            fontSize: '16px',
            transition: 'border-color 0.15s ease-in-out',
        },
        checkbox: {
            marginRight: '8px',
            width: '16px',
            height: '16px',
        },
        checkboxLabel: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            cursor: 'pointer',
        },
        checkboxContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginTop: '8px',
        },
        submitButton: {
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '14px 28px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease',
        },
        buttonHover: {
            backgroundColor: '#1e40af',
        },
        buttonDisabled: {
            backgroundColor: '#93c5fd',
            cursor: 'not-allowed',
        },

        // Alert styles
        alert: {
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
        },
        alertError: {
            backgroundColor: '#FEE2E2',
            border: '1px solid #FECACA',
            color: '#B91C1C',
        },
        alertSuccess: {
            backgroundColor: '#D1FAE5',
            border: '1px solid #A7F3D0',
            color: '#047857',
        },

        // Footer
        footer: {
            backgroundColor: '#111827',
            color: 'white',
            padding: '48px 0',
        },
        footerGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '32px',
        },
        footerHeading: {
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '16px',
        },
        footerLink: {
            display: 'block',
            color: '#9CA3AF',
            textDecoration: 'none',
            marginBottom: '8px',
        },
        footerBottom: {
            borderTop: '1px solid #374151',
            marginTop: '32px',
            paddingTop: '24px',
            textAlign: 'center',
            color: '#9CA3AF',
        },

        // Utilities
        flexRow: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
        },
        textCenter: {
            textAlign: 'center',
        },
        spinner: {
            display: 'inline-block',
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255,255,255,0.2)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
        },
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value === '' ? null : Number(value) }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        // Special handling for availability checkbox
        if (name === 'availableLater') {
            setAvailableLater(checked);
            return;
        }

        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(e.target.files);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formRef.current?.checkValidity()) {
            formRef.current?.classList.add('was-validated');
            return;
        }

        // Validate minimum requirements
        if (!selectedFiles || selectedFiles.length === 0) {
            setError('Bitte mindestens ein Bild hochladen.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Create FormData object to send files and form data together
            const submitFormData = new FormData();

            // Add all form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    submitFormData.append(key, String(value));
                }
            });

            // Add available from date if needed
            if (availableLater) {
                submitFormData.append('availableNow', 'false');
            } else {
                submitFormData.append('availableFrom', '');
            }

            // Add all images
            for (let i = 0; i < selectedFiles.length; i++) {
                submitFormData.append('images', selectedFiles[i]);
            }

            // Send request to API
            const response = await fetch('http://localhost:5022/api/apartments', {
                method: 'POST',
                body: submitFormData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Fehler beim Speichern der Wohnung');
            }

            const result = await response.json();
            setSuccess(result.message || 'Wohnung erfolgreich hinzugefügt!');

            // Optional: Clear form or redirect to a success page
            // router.push('/success-page');

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten');
            console.error('Fehler beim Speichern:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.container}>
                    <nav style={styles.nav}>
                        <Link href="/" style={styles.logo}>
                            Movo_
                        </Link>
                        <div style={styles.menu}>
                            <Link href="/" style={styles.menuItem}>
                                Start
                            </Link>
                            <Link href="/apartments" style={styles.menuItem}>
                                Ferienwohnungen
                            </Link>
                            <Link href="/become-host" style={styles.menuItem}>
                                Anbieter werden
                            </Link>
                        </div>
                        <div style={styles.flexRow}>
                            <Link href="/login" style={styles.menuItem}>
                                Login
                            </Link>
                            <Link href="/register" style={{
                                backgroundColor: 'white',
                                color: '#2563eb',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                                fontWeight: '500',
                                textDecoration: 'none'
                            }}>
                                Registrieren
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.container}>
                    <h1 style={styles.pageHeading}>Neue Ferienwohnung anbieten</h1>
                    <p style={styles.pageSubheading}>
                        Teile deine Wohnung mit Reisenden aus aller Welt und verdiene zusätzliches Einkommen
                    </p>
                </div>
            </div>

            <div style={styles.container}>
                <div style={styles.formContainer}>
                    {error && (
                        <div style={{...styles.alert, ...styles.alertError}}>
                            <strong>Fehler: </strong>{error}
                        </div>
                    )}

                    {success && (
                        <div style={{...styles.alert, ...styles.alertSuccess}}>
                            <strong>Erfolg! </strong>{success}
                        </div>
                    )}

                    <form
                        ref={formRef}
                        id="addApartmentForm"
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        {/* Grundinformationen */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Grundinformationen</h3>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label htmlFor="title" style={styles.inputLabel}>
                                        Titel<span style={styles.inputRequired}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="z.B. Gemütliche Altbauwohnung im Zentrum"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label htmlFor="price" style={styles.inputLabel}>
                                        Preis pro Nacht (€)<span style={styles.inputRequired}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        style={styles.input}
                                        id="price"
                                        name="price"
                                        value={formData.price === null ? '' : formData.price}
                                        onChange={handleNumberInputChange}
                                        required
                                        min="1"
                                        placeholder="z.B. 85"
                                    />
                                </div>

                                <div style={{...styles.formGroup, ...styles.fullWidth}}>
                                    <label htmlFor="description" style={styles.inputLabel}>
                                        Beschreibung<span style={styles.inputRequired}>*</span>
                                    </label>
                                    <textarea
                                        style={{...styles.input, height: '120px'}}
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Beschreibe deine Wohnung und was sie besonders macht..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Adresse */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Adresse</h3>
                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label htmlFor="address" style={styles.inputLabel}>
                                        Straße & Hausnummer<span style={styles.inputRequired}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label htmlFor="city" style={styles.inputLabel}>
                                        Stadt<span style={styles.inputRequired}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label htmlFor="zip" style={styles.inputLabel}>
                                        PLZ<span style={styles.inputRequired}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        style={styles.input}
                                        id="zip"
                                        name="zip"
                                        value={formData.zip}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label htmlFor="country" style={styles.inputLabel}>
                                        Land<span style={styles.inputRequired}>*</span>
                                    </label>
                                    <select
                                        style={styles.input}
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="DE">Deutschland</option>
                                        <option value="AT">Österreich</option>
                                        <option value="CH">Schweiz</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Details & Merkmale */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Details & Merkmale</h3>
                            <div style={styles.formGridFour}>
                                <div style={styles.formGroup}>
                                    <label htmlFor="guests" style={styles.inputLabel}>
                                        Gäste<span style={styles.inputRequired}>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        style={styles.input}
                                        id="guests"
                                        name="guests"
                                        value={formData.guests === null ? '' : formData.guests}
                                        onChange={handleNumberInputChange}
                                        required
                                        min="1"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label htmlFor="bedrooms" style={styles.inputLabel}>
                                        Schlafzimmer
                                    </label>
                                    <input
                                        type="number"
                                        style={styles.input}
                                        id="bedrooms"
                                        name="bedrooms"
                                        value={formData.bedrooms === null ? '' : formData.bedrooms}
                                        onChange={handleNumberInputChange}
                                        min="0"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label htmlFor="beds" style={styles.inputLabel}>
                                        Betten
                                    </label>
                                    <input
                                        type="number"
                                        style={styles.input}
                                        id="beds"
                                        name="beds"
                                        value={formData.beds === null ? '' : formData.beds}
                                        onChange={handleNumberInputChange}
                                        min="0"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label htmlFor="bathrooms" style={styles.inputLabel}>
                                        Badezimmer
                                    </label>
                                    <input
                                        type="number"
                                        style={styles.input}
                                        id="bathrooms"
                                        name="bathrooms"
                                        value={formData.bathrooms === null ? '' : formData.bathrooms}
                                        onChange={handleNumberInputChange}
                                        min="0"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label htmlFor="size" style={styles.inputLabel}>
                                        Größe (m²)
                                    </label>
                                    <input
                                        type="number"
                                        style={styles.input}
                                        id="size"
                                        name="size"
                                        value={formData.size === null ? '' : formData.size}
                                        onChange={handleNumberInputChange}
                                        min="0"
                                    />
                                </div>

                                <div style={styles.formGroup}>
                                    <label htmlFor="minStay" style={styles.inputLabel}>
                                        Mindestaufenthalt (Nächte)
                                    </label>
                                    <input
                                        type="number"
                                        style={styles.input}
                                        id="minStay"
                                        name="minStay"
                                        value={formData.minStay === null ? '' : formData.minStay}
                                        onChange={handleNumberInputChange}
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Verfügbarkeit */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Verfügbarkeit</h3>
                            <div>
                                <label style={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkbox}
                                        id="availableNow"
                                        name="availableNow"
                                        checked={formData.availableNow}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span>Sofort verfügbar</span>
                                </label>

                                <label style={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkbox}
                                        id="availableLater"
                                        name="availableLater"
                                        checked={availableLater}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span>Verfügbar ab einem bestimmten Datum</span>
                                </label>

                                {availableLater && (
                                    <div style={{ marginTop: '12px', maxWidth: '300px' }}>
                                        <input
                                            type="date"
                                            style={styles.input}
                                            id="availableFromDate"
                                            name="availableFromDate"
                                            value={formData.availableFromDate}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ausstattung */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Ausstattung</h3>
                            <div style={styles.checkboxContainer}>
                                <label style={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkbox}
                                        id="wifi"
                                        name="wifi"
                                        checked={formData.wifi}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span>WLAN</span>
                                </label>

                                <label style={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkbox}
                                        id="kitchen"
                                        name="kitchen"
                                        checked={formData.kitchen}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span>Küche</span>
                                </label>

                                <label style={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkbox}
                                        id="parking"
                                        name="parking"
                                        checked={formData.parking}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span>Parkplatz</span>
                                </label>

                                <label style={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        style={styles.checkbox}
                                        id="tv"
                                        name="tv"
                                        checked={formData.tv}
                                        onChange={handleCheckboxChange}
                                    />
                                    <span>TV</span>
                                </label>
                            </div>
                        </div>

                        {/* Bilder Upload */}
                        <div style={styles.formSection}>
                            <h3 style={styles.sectionTitle}>Bilder</h3>
                            <div>
                                <label htmlFor="images" style={styles.inputLabel}>
                                    Bilder hochladen<span style={styles.inputRequired}>*</span>
                                </label>
                                <input
                                    style={{...styles.input, padding: '10px'}}
                                    type="file"
                                    id="images"
                                    name="images"
                                    onChange={handleFileChange}
                                    multiple
                                    accept="image/*"
                                    required
                                />
                                {selectedFiles && selectedFiles.length > 0 && (
                                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#4B5563' }}>
                                        {selectedFiles.length} {selectedFiles.length === 1 ? 'Datei' : 'Dateien'} ausgewählt
                                    </div>
                                )}
                                <div style={{ marginTop: '8px', fontSize: '14px', color: '#4B5563' }}>
                                    Tipp: Füge hochwertige Bilder hinzu, um deine Wohnung bestmöglich zu präsentieren.
                                </div>
                            </div>
                        </div>

                        <div style={{...styles.textCenter, marginTop: '32px'}}>
                            <button
                                type="submit"
                                style={{
                                    ...styles.submitButton,
                                    ...(isLoading ? styles.buttonDisabled : {})
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span style={styles.spinner}></span>
                                        Wird gespeichert...
                                    </>
                                ) : 'Wohnung veröffentlichen'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Footer */}


            {/* Add a style for the spinner animation */}
            <style jsx global>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AddApartment;