// pages/landlord/apartments.js (oder .tsx)
"use client";
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Apartment = {
    id: number;
    title: string;
    description: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    size: number;
    price: number;
    minStay: number;
    availableNow: boolean;
    availableFrom: string;
    amenities: {
        wifi: boolean;
        kitchen: boolean;
        parking: boolean;
        tv: boolean;
    };
    images: string[];
};

export default function LandlordApartments() {
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Apartment>>({});

    // Fetch apartments that belong to the landlord
    useEffect(() => {
        const fetchLandlordApartments = async () => {
            try {
                setLoading(true);
                // Note: This endpoint would need to be implemented in your backend
                // It should return only apartments belonging to the logged in landlord
                const response = await fetch('http://localhost:5022/api/landlord/apartments', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming JWT auth
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch apartments: ${response.status}`);
                }

                const data = await response.json();
                setApartments(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching landlord apartments:', err);
                // @ts-ignore
                setError(err.message);
                setLoading(false);
            }
        };

        fetchLandlordApartments();
    }, []);

    // Helper function to parse JSON strings
    const parseJSON = (jsonString) => {
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return null;
        }
    };

    // Helper function to get full image URL
    const getImageUrl = (path: string) => {
        const baseUrl = process.env.NODE_ENV === 'production' ? 'https://deine-domain.de' : 'http://localhost:5022';
        return `${baseUrl}/${path}`;
    };

    // Function to start editing an apartment
    const startEditing = (apartment: Apartment) => {
        setEditingId(apartment.id);
        setEditForm({
            ...apartment,
            amenities: parseJSON(apartment.amenities) || apartment.amenities,
            images: parseJSON(apartment.images) || apartment.images,
        });
    };

    // Function to cancel editing
    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({});
    };

    // Function to handle form changes
    const handleFormChange = (field: string, value: any) => {
        setEditForm({
            ...editForm,
            [field]: value
        });
    };

    // Function to handle amenity changes
    const handleAmenityChange = (amenity: string, value: boolean) => {
        setEditForm({
            ...editForm,
            amenities: {
                ...editForm.amenities,
                [amenity]: value
            }
        });
    };

    // Function to save apartment changes
    const saveApartment = async (id: number) => {
        try {
            // Prepare the data for the API
            const apartmentData = {
                ...editForm,
                amenities: typeof editForm.amenities === 'object' ? JSON.stringify(editForm.amenities) : editForm.amenities,
                images: Array.isArray(editForm.images) ? JSON.stringify(editForm.images) : editForm.images
            };

            const response = await fetch(`http://localhost:5022/api/apartments/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(apartmentData)
            });

            if (!response.ok) {
                throw new Error(`Failed to update apartment: ${response.status}`);
            }

            // Update the local state
            const updatedApartment = await response.json();
            setApartments(apartments.map(apt => apt.id === id ? updatedApartment : apt));

            // Exit edit mode
            setEditingId(null);
            setEditForm({});
        } catch (err) {
            console.error('Error updating apartment:', err);
            alert('Fehler beim Aktualisieren der Wohnung.');
        }
    };

    // Function to delete apartment
    const deleteApartment = async (id: number) => {
        if (!confirm('Möchtest du diese Wohnung wirklich löschen?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:5022/api/apartments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete apartment: ${response.status}`);
            }

            // Remove the apartment from local state
            setApartments(apartments.filter(apt => apt.id !== id));
        } catch (err) {
            console.error('Error deleting apartment:', err);
            alert('Fehler beim Löschen der Wohnung.');
        }
    };

    // Styles
    const styles = {
        header: {
            backgroundColor: '#2563eb', // blue-600
            color: 'white',
            padding: '16px 0',
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 16px',
        },
        pageHeader: {
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '32px 0',
            textAlign: 'center' as const,
        },
        heading: {
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '16px',
        },
        subheading: {
            fontSize: '20px',
            marginBottom: '32px',
        },
        button: {
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
        },
        whiteButton: {
            backgroundColor: 'white',
            color: '#2563eb',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
        },
        redButton: {
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
        },
        cancelButton: {
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
        },
        saveButton: {
            backgroundColor: '#10b981',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
        },
        section: {
            padding: '64px 0',
        },
        sectionLight: {
            padding: '64px 0',
            backgroundColor: '#F9FAFB', // gray-50
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '32px',
        },
        apartmentCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        apartmentImage: {
            height: '200px',
            backgroundColor: '#E5E7EB', // gray-200
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        },
        apartmentBody: {
            padding: '24px',
        },
        apartmentTitle: {
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '8px',
        },
        apartmentLocation: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
            color: '#6B7280', // gray-500
        },
        formGroup: {
            marginBottom: '16px',
        },
        input: {
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB', // gray-300
            fontSize: '16px',
        },
        label: {
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500',
            color: '#374151', // gray-700
        },
        checkboxGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '16px',
        },
        checkbox: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        buttonGroup: {
            display: 'flex',
            gap: '8px',
            marginTop: '16px',
        },
        editCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
        textarea: {
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #D1D5DB', // gray-300
            fontSize: '16px',
            minHeight: '100px',
            resize: 'vertical',
        },
        loading: {
            textAlign: 'center' as const,
            padding: '20px',
            fontSize: '18px',
            color: '#6B7280',
        },
        errorMessage: {
            textAlign: 'center' as const,
            padding: '20px',
            fontSize: '18px',
            color: '#DC2626',
        },
        addNewButton: {
            display: 'block',
            width: '100%',
            padding: '24px',
            borderRadius: '8px',
            border: '2px dashed #D1D5DB',
            backgroundColor: 'white',
            textAlign: 'center' as const,
            fontSize: '18px',
            color: '#6B7280',
            cursor: 'pointer',
            margin: '32px 0',
        },
        apartmentStats: {
            display: 'flex',
            gap: '16px',
            marginBottom: '16px',
        },
        statItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#6B7280',
        },
        twoColGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
        },
        switch: {
            position: 'relative' as const,
            display: 'inline-block',
            width: '60px',
            height: '34px',
        },
        slider: {
            position: 'absolute' as const,
            cursor: 'pointer',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: '#ccc',
            transition: '.4s',
            borderRadius: '34px',
        },
        sliderBefore: {
            position: 'absolute' as const,
            content: '',
            height: '26px',
            width: '26px',
            left: '4px',
            bottom: '4px',
            backgroundColor: 'white',
            transition: '.4s',
            borderRadius: '50%',
        },
        switchInput: {
            opacity: 0,
            width: 0,
            height: 0,
        },
        imgPreview: {
            width: '100px',
            height: '100px',
            objectFit: 'cover' as const,
            borderRadius: '4px',
            marginRight: '8px',
            marginBottom: '8px',
        },
        imagePreviewContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: '16px',
        },
    };

    return (
        <div>
            <Head>
                <title>Meine Apartments - Movo</title>
                <meta name="description" content="Verwalte deine Ferienwohnungen auf Movo" />
            </Head>

            {/* Page Header */}
            <div style={styles.pageHeader}>
                <div style={styles.container}>
                    <h1 style={styles.heading}>Meine Apartments</h1>
                    <p style={styles.subheading}>Verwalte deine Ferienwohnungen auf Movo</p>
                </div>
            </div>

            {/* Main Content */}
            <div style={styles.sectionLight}>
                <div style={styles.container}>
                    {/* Add New Apartment Button */}
                    <Link href="/landlord/apartments/new" style={{ textDecoration: 'none' }}>
                        <div style={styles.addNewButton}>
                            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline-block', marginRight: '8px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            Neues Apartment hinzufügen
                        </div>
                    </Link>

                    {loading && (
                        <div style={styles.loading}>
                            Lade Apartments...
                        </div>
                    )}

                    {error && (
                        <div style={styles.errorMessage}>
                            Fehler beim Laden der Apartments: {error}
                        </div>
                    )}

                    {!loading && !error && (
                        <>
                            {apartments.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px' }}>
                                    <h3 style={{ marginBottom: '16px' }}>Du hast noch keine Apartments eingestellt</h3>
                                    <p>Beginne damit, deine erste Ferienwohnung hinzuzufügen und verdiene Geld mit Movo.</p>
                                </div>
                            ) : (
                                <div style={styles.grid}>
                                    {apartments.map((apartment) => {
                                        const isEditing = editingId === apartment.id;
                                        const images = parseJSON(apartment.images) || [];
                                        const firstImage = images.length > 0 ? images[0] : null;
                                        const amenities = parseJSON(apartment.amenities) || apartment.amenities;

                                        if (isEditing) {
                                            // Edit Mode
                                            return (
                                                <div key={apartment.id} style={styles.editCard}>
                                                    <h3 style={{ marginBottom: '24px' }}>Apartment bearbeiten</h3>

                                                    <div style={styles.formGroup}>
                                                        <label htmlFor="title" style={styles.label}>Titel</label>
                                                        <input
                                                            id="title"
                                                            type="text"
                                                            value={editForm.title || ''}
                                                            onChange={(e) => handleFormChange('title', e.target.value)}
                                                            style={styles.input}
                                                        />
                                                    </div>

                                                    <div style={styles.formGroup}>
                                                        <label htmlFor="description" style={styles.label}>Beschreibung</label>
                                                        <textarea
                                                            id="description"
                                                            value={editForm.description || ''}
                                                            onChange={(e) => handleFormChange('description', e.target.value)}
                                                            style={styles.textarea}
                                                        />
                                                    </div>

                                                    <div style={styles.twoColGrid}>
                                                        <div style={styles.formGroup}>
                                                            <label htmlFor="city" style={styles.label}>Stadt</label>
                                                            <input
                                                                id="city"
                                                                type="text"
                                                                value={editForm.city || ''}
                                                                onChange={(e) => handleFormChange('city', e.target.value)}
                                                                style={styles.input}
                                                            />
                                                        </div>

                                                        <div style={styles.formGroup}>
                                                            <label htmlFor="country" style={styles.label}>Land</label>
                                                            <input
                                                                id="country"
                                                                type="text"
                                                                value={editForm.country || ''}
                                                                onChange={(e) => handleFormChange('country', e.target.value)}
                                                                style={styles.input}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={styles.formGroup}>
                                                        <label htmlFor="address" style={styles.label}>Adresse</label>
                                                        <input
                                                            id="address"
                                                            type="text"
                                                            value={editForm.address || ''}
                                                            onChange={(e) => handleFormChange('address', e.target.value)}
                                                            style={styles.input}
                                                        />
                                                    </div>

                                                    <div style={styles.twoColGrid}>
                                                        <div style={styles.formGroup}>
                                                            <label htmlFor="zip" style={styles.label}>PLZ</label>
                                                            <input
                                                                id="zip"
                                                                type="text"
                                                                value={editForm.zip || ''}
                                                                onChange={(e) => handleFormChange('zip', e.target.value)}
                                                                style={styles.input}
                                                            />
                                                        </div>

                                                        <div style={styles.formGroup}>
                                                            <label htmlFor="price" style={styles.label}>Preis pro Nacht (€)</label>
                                                            <input
                                                                id="price"
                                                                type="number"
                                                                value={editForm.price || 0}
                                                                onChange={(e) => handleFormChange('price', parseFloat(e.target.value))}
                                                                style={styles.input}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ ...styles.twoColGrid, marginBottom: '16px' }}>
                                                        <div style={styles.formGroup}>
                                                            <label htmlFor="guests" style={styles.label}>Gäste</label>
                                                            <input
                                                                id="guests"
                                                                type="number"
                                                                value={editForm.guests || 0}
                                                                onChange={(e) => handleFormChange('guests', parseInt(e.target.value))}
                                                                style={styles.input}
                                                            />
                                                        </div>

                                                        <div style={styles.formGroup}>
                                                            <label htmlFor="bedrooms" style={styles.label}>Schlafzimmer</label>
                                                            <input
                                                                id="bedrooms"
                                                                type="number"
                                                                value={editForm.bedrooms || 0}
                                                                onChange={(e) => handleFormChange('bedrooms', parseInt(e.target.value))}
                                                                style={styles.input}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ ...styles.twoColGrid, marginBottom: '16px' }}>
                                                        <div style={styles.formGroup}>
                                                            <label htmlFor="bathrooms" style={styles.label}>Badezimmer</label>
                                                            <input
                                                                id="bathrooms"
                                                                type="number"
                                                                value={editForm.bathrooms || 0}
                                                                onChange={(e) => handleFormChange('bathrooms', parseInt(e.target.value))}
                                                                style={styles.input}
                                                            />
                                                        </div>

                                                        <div style={styles.formGroup}>
                                                            <label htmlFor="size" style={styles.label}>Größe (m²)</label>
                                                            <input
                                                                id="size"
                                                                type="number"
                                                                value={editForm.size || 0}
                                                                onChange={(e) => handleFormChange('size', parseInt(e.target.value))}
                                                                style={styles.input}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={styles.formGroup}>
                                                        <label style={styles.label}>Ausstattung</label>
                                                        <div style={styles.checkboxGroup}>
                                                            <div style={styles.checkbox}>
                                                                <input
                                                                    id="wifi"
                                                                    type="checkbox"
                                                                    checked={editForm.amenities?.wifi || false}
                                                                    onChange={(e) => handleAmenityChange('wifi', e.target.checked)}
                                                                />
                                                                <label htmlFor="wifi">WLAN</label>
                                                            </div>

                                                            <div style={styles.checkbox}>
                                                                <input
                                                                    id="kitchen"
                                                                    type="checkbox"
                                                                    checked={editForm.amenities?.kitchen || false}
                                                                    onChange={(e) => handleAmenityChange('kitchen', e.target.checked)}
                                                                />
                                                                <label htmlFor="kitchen">Küche</label>
                                                            </div>

                                                            <div style={styles.checkbox}>
                                                                <input
                                                                    id="parking"
                                                                    type="checkbox"
                                                                    checked={editForm.amenities?.parking || false}
                                                                    onChange={(e) => handleAmenityChange('parking', e.target.checked)}
                                                                />
                                                                <label htmlFor="parking">Parkplatz</label>
                                                            </div>

                                                            <div style={styles.checkbox}>
                                                                <input
                                                                    id="tv"
                                                                    type="checkbox"
                                                                    checked={editForm.amenities?.tv || false}
                                                                    onChange={(e) => handleAmenityChange('tv', e.target.checked)}
                                                                />
                                                                <label htmlFor="tv">TV</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={styles.formGroup}>
                                                        <label style={styles.label}>Verfügbarkeit</label>
                                                        <div style={styles.checkbox}>
                                                            <input
                                                                id="availableNow"
                                                                type="checkbox"
                                                                checked={editForm.availableNow || false}
                                                                onChange={(e) => handleFormChange('availableNow', e.target.checked)}
                                                            />
                                                            <label htmlFor="availableNow">Sofort verfügbar</label>
                                                        </div>
                                                    </div>

                                                    {!editForm.availableNow && (
                                                        <div style={styles.formGroup}>
                                                            <label htmlFor="availableFrom" style={styles.label}>Verfügbar ab</label>
                                                            <input
                                                                id="availableFrom"
                                                                type="date"
                                                                value={editForm.availableFrom || ''}
                                                                onChange={(e) => handleFormChange('availableFrom', e.target.value)}
                                                                style={styles.input}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Images Preview */}
                                                    <div style={styles.formGroup}>
                                                        <label style={styles.label}>Bilder</label>
                                                        <div style={styles.imagePreviewContainer}>
                                                            {Array.isArray(editForm.images) && editForm.images.map((image, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={getImageUrl(image)}
                                                                    alt={`Apartment Bild ${index + 1}`}
                                                                    style={styles.imgPreview}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '8px' }}>
                                                            Um Bilder zu ändern, nutze bitte die Detailansicht.
                                                        </p>
                                                    </div>

                                                    <div style={styles.buttonGroup}>
                                                        <button
                                                            style={styles.saveButton}
                                                            onClick={() => saveApartment(apartment.id)}
                                                        >
                                                            Speichern
                                                        </button>
                                                        <button
                                                            style={styles.cancelButton}
                                                            onClick={cancelEditing}
                                                        >
                                                            Abbrechen
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        } else {
                                            // View Mode
                                            return (
                                                <div key={apartment.id} style={styles.apartmentCard}>
                                                    <div
                                                        style={{
                                                            ...styles.apartmentImage,
                                                            backgroundImage: firstImage ? `url(${getImageUrl(firstImage)})` : 'none'
                                                        }}
                                                    >
                                                        {!firstImage && <span>Keine Bilder verfügbar</span>}
                                                    </div>
                                                    <div style={styles.apartmentBody}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                                            <h3 style={styles.apartmentTitle}>{apartment.title}</h3>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button
                                                                    onClick={() => startEditing(apartment)}
                                                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                                >
                                                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => deleteApartment(apartment.id)}
                                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626' }}
                                                                >
                                                                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div style={styles.apartmentLocation}>
                                                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                            </svg>
                                                            <span style={{ marginLeft: '8px' }}>{apartment.city}, {apartment.country}</span>
                                                        </div>
                                                        <div style={styles.apartmentStats}>
                                                            <div style={styles.statItem}>
                                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                                                </svg>
                                                                <span>{apartment.guests}</span>
                                                            </div>
                                                            <div style={styles.statItem}>
                                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                                                </svg>
                                                                <span>{apartment.bedrooms} Schlafzimmer</span>
                                                            </div>
                                                            <div style={styles.statItem}>
                                                                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10V6a5 5 0 0110 0v4M5 20h14a2 2 0 002-2v-5a2 2 0 00-2-2H5a2 2 0 00-2 2v5a2 2 0 002 2z"></path>
                                                                </svg>
                                                                <span>{apartment.bathrooms} Badezimmer</span>
                                                            </div>
                                                        </div> {/* End apartmentStats */}
                                                        <p style={{ marginTop: '12px', fontWeight: 500 }}>{apartment.price} € / Nacht</p>
                                                    </div> {/* End apartmentBody */}
                                                </div> {/* End apartmentCard */}
                                        );
                                    })}
                                  </div> {/* End grid */}
                                )}
                        </>
                    )}
                </div> {/* End container */}
            </div> {/* End sectionLight */}
        </div> {/* End page */}