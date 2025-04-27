"use client"

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { StarIcon, ArrowLeftIcon, MapPinIcon, WifiIcon, HomeIcon, TvIcon, ParkingCircleIcon } from 'lucide-react'

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

export default function ApartmentDetails() {
    const [nights, setNights] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const params = useParams()
    const router = useRouter()
    const [apartment, setApartment] = useState<Apartment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeImage, setActiveImage] = useState(0)
    const [checkInDate, setCheckInDate] = useState('')
    const [checkOutDate, setCheckOutDate] = useState('')
    const [guests, setGuests] = useState(1)

    const apartmentId = Array.isArray(params.id) ? params.id[0] : params.id
    useEffect(() => {
        if (apartment && checkInDate && checkOutDate) {
            const start = new Date(checkInDate)
            const end = new Date(checkOutDate)
            const timeDiff = end.getTime() - start.getTime()
            const calculatedNights = Math.ceil(timeDiff / (1000 * 3600 * 24))

            setNights(calculatedNights)
            setTotalPrice(calculatedNights * apartment.price * guests)
        }
    }, [checkInDate, checkOutDate, apartment?.price])

    useEffect(() => {
        if (!apartmentId) {
            setError("Keine Unterkunfts-ID angegeben")
            setLoading(false)
            return
        }

        const fetchApartment = async () => {
            try {
                setLoading(true)
                const response = await fetch(`http://localhost:5022/api/apartments/${apartmentId}`)

                if (!response.ok) {
                    throw new Error(`Unterkunft nicht gefunden: ${response.status}`)
                }

                const data = await response.json()
                setApartment(data)
                setLoading(false)
            } catch (err) {
                console.error('Fehler beim Laden der Unterkunft:', err)
                setError(err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten')
                setLoading(false)
            }
        }

        fetchApartment()
    }, [apartmentId])

    const parseJSON = (jsonString: string) => {
        try {
            return JSON.parse(jsonString)
        } catch (e) {
            return null
        }
    }

    const getImageUrl = (path: string) => {
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://deine-domain.de'
            : 'http://localhost:5022'
        return `${baseUrl}/${path}`
    }

    const handleBookNow = () => {
        // Validierung der Daten
        if (!apartment) {
            alert('Unterkunftsdaten werden noch geladen.')
            return
        }
        if (guests > apartment.guests) {
            alert(`Diese Unterkunft fasst maximal ${apartment.guests} Gäste`);
            return;
        }
        if (!checkInDate || !checkOutDate) {
            alert('Bitte wählen Sie sowohl Anreise- als auch Abreisedatum aus.');
            return;
        }

        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Validierungen
        if (endDate <= startDate) {
            alert('Das Abreisedatum muss nach dem Anreisedatum liegen.');
            return;
        }

        if (startDate < today) {
            alert('Das Anreisedatum darf nicht in der Vergangenheit liegen.');
            return;
        }

        // Berechnung der Nächte
        const timeDiff = endDate.getTime() - startDate.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (apartment.minStay && nights < apartment.minStay) {
            alert(`Diese Unterkunft hat einen Mindestaufenthalt von ${apartment.minStay} Nächten.`);
            return;
        }

        // Preisberechnung
        const totalPrice = nights * apartment.price * guests;

        // Weiterleitung mit Query-Parametern
        router.push(
            `/confirmation/${apartmentId}?` +
            `checkIn=${encodeURIComponent(checkInDate)}` +
            `&checkOut=${encodeURIComponent(checkOutDate)}` +
            `&guests=${guests}` +
            `&total=${totalPrice}` +
            `&nights=${nights}` +
            `&pricePerGuest=${apartment.price}`
        );
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Lade Unterkunftsdaten...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-content">
                    <div className="error-icon">
                        <svg viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3>Fehler beim Laden</h3>
                    <p>{error}</p>
                    <Link href="/" className="back-button">
                        Zurück zur Startseite
                    </Link>
                </div>
            </div>
        )
    }

    if (!apartment) {
        return (
            <div className="not-found-container">
                <div className="not-found-content">
                    <div className="not-found-icon">
                        <svg viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3>Unterkunft nicht gefunden</h3>
                    <p>Die angeforderte Unterkunft konnte nicht gefunden werden.</p>
                    <Link href="/" className="back-button">
                        Zurück zur Startseite
                    </Link>
                </div>
            </div>
        )
    }

    const images = parseJSON(apartment.images) || []
    const amenities = parseJSON(apartment.amenities) || {}

    return (
        <div className="page-container">
            <Head>
                <title>{apartment.title} | Movo</title>
                <meta name="description" content={apartment.description} />
            </Head>

            <div className="content-wrapper">
                {/* Header */}
                <header className="page-header">
                    <button
                        onClick={() => router.back()}
                        className="back-button"
                    >
                        <ArrowLeftIcon className="icon" />
                        Zurück zur Suche
                    </button>
                </header>

                {/* Main content */}
                <main className="main-content">
                    {/* Title and location */}
                    <div className="title-section">
                        <h1>{apartment.title}</h1>
                        <div className="location">
                            <MapPinIcon className="icon" />
                            <span>{apartment.city}, {apartment.country}</span>
                        </div>
                    </div>

                    {/* Image gallery */}
                    <div className="gallery-section">
                        {images.length > 0 ? (
                            <div className="gallery-container">
                                {/* Main image */}
                                <div className="main-image-container">
                                    <img
                                        src={getImageUrl(images[activeImage])}
                                        alt={`${apartment.title} Hauptbild`}
                                        className="main-image"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg'
                                        }}
                                    />
                                </div>

                                {/* Thumbnail gallery */}
                                {images.length > 1 && (
                                    <div className="thumbnail-grid">
                                        {images.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setActiveImage(index)}
                                                className={`thumbnail-button ${activeImage === index ? 'active' : ''}`}
                                            >
                                                <img
                                                    src={getImageUrl(image)}
                                                    alt={`${apartment.title} Bild ${index + 1}`}
                                                    className="thumbnail-image"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/placeholder-image.jpg'
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-images-placeholder">
                                Keine Bilder verfügbar
                            </div>
                        )}
                    </div>

                    {/* Main grid */}
                    <div className="details-grid">
                        {/* Left column */}
                        <div className="details-content">
                            {/* Highlights */}
                            <div className="highlights-grid">
                                <div className="highlight-item">
                                    <div className="highlight-value">{apartment.guests}</div>
                                    <div className="highlight-label">Gäste</div>
                                </div>
                                <div className="highlight-item">
                                    <div className="highlight-value">{apartment.bedrooms}</div>
                                    <div className="highlight-label">Schlafzimmer</div>
                                </div>
                                <div className="highlight-item">
                                    <div className="highlight-value">{apartment.beds}</div>
                                    <div className="highlight-label">Betten</div>
                                </div>
                                <div className="highlight-item">
                                    <div className="highlight-value">{apartment.bathrooms}</div>
                                    <div className="highlight-label">Badezimmer</div>
                                </div>
                            </div>

                            {/* Description */}
                            <section className="description-section">
                                <h2>Beschreibung</h2>
                                <p>{apartment.description}</p>
                            </section>

                            {/* Amenities */}
                            <section className="amenities-section">
                                <h2>Ausstattung</h2>
                                <div className="amenities-grid">
                                    {amenities.wifi && (
                                        <div className="amenity-item">
                                            <div className="amenity-icon">
                                                <WifiIcon className="icon" />
                                            </div>
                                            <span>WLAN</span>
                                        </div>
                                    )}
                                    {amenities.kitchen && (
                                        <div className="amenity-item">
                                            <div className="amenity-icon">
                                                <HomeIcon className="icon" />
                                            </div>
                                            <span>Küche</span>
                                        </div>
                                    )}
                                    {amenities.parking && (
                                        <div className="amenity-item">
                                            <div className="amenity-icon">
                                                <ParkingCircleIcon className="icon" />
                                            </div>
                                            <span>Parkplatz</span>
                                        </div>
                                    )}
                                    {amenities.tv && (
                                        <div className="amenity-item">
                                            <div className="amenity-icon">
                                                <TvIcon className="icon" />
                                            </div>
                                            <span>TV</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right column - Booking card */}
                        <div className="booking-card">
                            <div className="booking-content">
                                <div className="price-section">
                                    <div className="price">
                                        €{apartment.price.toLocaleString('de-DE')}
                                        <span className="price-per-night"> / Gast/Nacht</span>
                                    </div>
                                </div>

                                <div className="booking-form">
                                    <div className="date-grid">
                                        <div className="date-input">
                                            <label>Anreise</label>
                                            <input
                                                type="date"
                                                value={checkInDate}
                                                onChange={(e) => setCheckInDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="date-input">
                                            <label>Abreise</label>
                                            <input
                                                type="date"
                                                value={checkOutDate}
                                                onChange={(e) => setCheckOutDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="guests-input">
                                        <label>Gäste</label>
                                        <select
                                            value={guests}
                                            onChange={(e) => setGuests(Number(e.target.value))}
                                        >
                                            {Array.from({ length: apartment.guests }, (_, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {i + 1} {i === 0 ? 'Gast' : 'Gäste'}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBookNow}
                                    className="book-button"
                                >
                                    Jetzt buchen
                                </button>

                                <div className="price-breakdown">
                                    <div className="price-row">
                                        <span>€{apartment.price} x {nights} Nächte x {guests} Gäste</span>
                                        <span>€{(apartment.price * nights * guests).toLocaleString('de-DE')}</span>
                                    </div>
                                    <div className="total-price">
                                        <span>Gesamt</span>
                                        <span>€{totalPrice.toLocaleString('de-DE')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Global styles */}
            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                body {
                    margin: 0;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    color: #111827;
                    line-height: 1.5;
                }
                * {
                    box-sizing: border-box;
                }
                .icon {
                    width: 20px;
                    height: 20px;
                }
            `}</style>

            {/* Component styles */}
            <style jsx>{`
                .page-container {
                    background-color: white;
                }
                
                .content-wrapper {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 16px;
                }
                
                /* Loading state */
                .loading-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #F9FAFB;
                }
                
                .loading-content {
                    text-align: center;
                    padding: 40px;
                }
                
                .loading-spinner {
                    border: 4px solid #E5E7EB;
                    border-top: 4px solid #2563EB;
                    border-radius: 50%;
                    width: 48px;
                    height: 48px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 16px;
                }
                
                .loading-text {
                    color: #4B5563;
                    font-size: 18px;
                }
                
                /* Error state */
                .error-container, .not-found-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #F9FAFB;
                }
                
                .error-content, .not-found-content {
                    text-align: center;
                    padding: 40px;
                }
                
                .error-icon {
                    background-color: #FEE2E2;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                }
                
                .error-icon svg, .not-found-icon svg {
                    width: 32px;
                    height: 32px;
                    color: #DC2626;
                }
                
                .not-found-icon {
                    background-color: #E5E7EB;
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px;
                }
                
                .not-found-icon svg {
                    color: #6B7280;
                }
                
                .error-content h3, .not-found-content h3 {
                    font-size: 20px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 8px;
                }
                
                .error-content p, .not-found-content p {
                    color: #6B7280;
                    margin-bottom: 24px;
                }
                
                .back-button {
                    display: inline-flex;
                    align-items: center;
                    padding: 12px 24px;
                    background-color: #2563EB;
                    color: white;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }
                
                .back-button:hover {
                    background-color: #1D4ED8;
                }
                
                /* Header */
                .page-header {
                    padding: 24px 0;
                }
                
                .back-button {
                    display: flex;
                    align-items: center;
                    color: #2563EB;
                    font-weight: 500;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 8px 0;
                }
                
                /* Title section */
                .title-section {
                    margin-bottom: 32px;
                }
                
                .title-section h1 {
                    font-size: 36px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 8px;
                    line-height: 1.2;
                }
                
                .location {
                    display: flex;
                    align-items: center;
                    color: #6B7280;
                    font-size: 18px;
                }
                
                .location .icon {
                    margin-right: 8px;
                }
                
                /* Gallery section */
                .gallery-section {
                    margin-bottom: 48px;
                }
                
                .gallery-container {
                    width: 100%;
                }

                .main-image-container {
                    width: 100%;
                    height: auto; /* Höhe automatisch anpassen */
                    min-height: 300px; /* Mindesthöhe falls nötig */
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 16px;
                    background-color: #F3F4F6;
                    position: relative;
                    display: flex; /* Flex-Layout für Zentrierung */
                    align-items: center;
                    justify-content: center;
                }

                .main-image-container {
                    width: 100%;
                    height: auto;
                    min-height: 300px;
                    border-radius: 12px;
                    overflow: hidden;
                    margin-bottom: 16px;
                    background-color: #F3F4F6;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    aspect-ratio: 16/9; /* Default für Landschaftsbilder */
                }

                .main-image {
                    width: 100%;
                    height: auto;
                    max-width: 100%;
                    object-fit: contain;
                    object-position: center;
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                }

                @media (max-width: 768px) {
                    .main-image-container {
                        aspect-ratio: unset; /* Mobile: Natürliches Seitenverhältnis */
                    }

                    .main-image {
                        max-height: 60vh;
                    }
                }
                
                .thumbnail-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 16px;
                }
                
                .thumbnail-button {
                    border: 1px solid #E5E7EB;
                    border-radius: 8px;
                    overflow: hidden;
                    padding: 0;
                    background: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .thumbnail-button.active {
                    border: 2px solid #2563EB;
                    transform: scale(0.98);
                }
                
                .thumbnail-button:hover {
                    border-color: #2563EB;
                }
                
                .thumbnail-image {
                    width: 100%;
                    height: 80px;
                    object-fit: cover;
                    object-position: center;
                }
                
                .no-images-placeholder {
                    width: 100%;
                    height: 400px;
                    background-color: #F3F4F6;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6B7280;
                    font-size: 18px;
                }
                
                /* Details grid */
                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 32px;
                    padding-bottom: 48px;
                }
                
                @media (min-width: 1024px) {
                    .details-grid {
                        grid-template-columns: 2fr 1fr;
                    }
                }
                
                /* Highlights */
                .highlights-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 24px;
                    background-color: #F9FAFB;
                    padding: 24px;
                    border-radius: 12px;
                    margin-bottom: 32px;
                }
                
                .highlight-item {
                    text-align: center;
                }
                
                .highlight-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #2563EB;
                }
                
                .highlight-label {
                    color: #6B7280;
                }
                
                /* Description */
                .description-section {
                    margin-bottom: 48px;
                }
                
                .description-section h2 {
                    font-size: 24px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 16px;
                }
                
                .description-section p {
                    color: #4B5563;
                    line-height: 1.6;
                    font-size: 16px;
                }
                
                /* Amenities */
                .amenities-section {
                    margin-bottom: 48px;
                }
                
                .amenities-section h2 {
                    font-size: 24px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 16px;
                }
                
                .amenities-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                }
                
                .amenity-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 0;
                }
                
                .amenity-icon {
                    background-color: #EFF6FF;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                }
                
                .amenity-icon .icon {
                    color: #2563EB;
                }
                
                /* Booking card */
                .booking-card {
                    position: relative;
                }
                
                .booking-content {
                    background-color: white;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border: 1px solid #E5E7EB;
                    position: sticky;
                    top: 24px;
                }
                
                @media (min-width: 1024px) {
                    .booking-content {
                        top: 100px;
                    }
                }
                
                .price-section {
                    margin-bottom: 24px;
                }
                
                .price {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 8px;
                }
                
                .price-per-night {
                    font-size: 16px;
                    font-weight: 400;
                    color: #6B7280;
                }
                
                /* Booking form */
                .booking-form {
                    margin-bottom: 24px;
                }
                
                .date-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 16px;
                }
                
                .date-input, .guests-input {
                    width: 100%;
                }
                
                label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 8px;
                }
                
                input, select {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid #D1D5DB;
                    font-size: 14px;
                    background-color: white;
                    transition: border-color 0.2s;
                }
                
                input:focus, select:focus {
                    outline: none;
                    border-color: #2563EB;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }
                
                /* Book button */
                .book-button {
                    width: 100%;
                    padding: 16px;
                    background-color: #2563EB;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-bottom: 16px;
                    transition: background-color 0.2s;
                }
                
                .book-button:hover {
                    background-color: #1D4ED8;
                }
                
                /* Price breakdown */
                .price-breakdown {
                    border-top: 1px solid #E5E7EB;
                    padding-top: 24px;
                }
                
                .price-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    color: #6B7280;
                }
                
                .total-price {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #E5E7EB;
                    font-weight: 600;
                    font-size: 18px;
                    color: #111827;
                }
            `}</style>
        </div>
    )
}