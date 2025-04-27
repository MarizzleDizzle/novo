"use client"

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { useAuth } from '@/app/lib/auth';

type Apartment = {
    id: number;
    title: string;
    price: number;
    guests: number;
    images: string[];
};

export default function BookingPage() {
    const params = useParams()
    const [showSuccess, setShowSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const searchParams = useSearchParams()
    const router = useRouter()
    const [apartment, setApartment] = useState<Apartment | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [checkInDate, setCheckInDate] = useState('')
    const { user } = useAuth();
    const [checkOutDate, setCheckOutDate] = useState('')
    const [guests, setGuests] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState('credit')
    const total = searchParams.get('total')
    const pricePerGuest = searchParams.get('pricePerGuest')
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    })

    const apartmentId = Array.isArray(params.id) ? params.id[0] : params.id

    useEffect(() => {
        // Daten aus den Query-Parametern lesen
        const checkIn = searchParams.get('checkIn')
        const checkOut = searchParams.get('checkOut')
        const guestsParam = searchParams.get('guests')

        if (checkIn) setCheckInDate(checkIn)
        if (checkOut) setCheckOutDate(checkOut)
        if (guestsParam) setGuests(Number(guestsParam))

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
    }, [apartmentId, searchParams])

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
    const popupStyles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        content: {
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '12px',
            maxWidth: '500px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        },
        successHeader: {
            fontSize: '24px',
            marginBottom: '16px',
            color: '#2563EB'
        },
        errorHeader: {
            fontSize: '24px',
            marginBottom: '16px',
            color: '#DC2626'
        },
        text: {
            margin: '8px 0',
            color: '#4B5563'
        },
        button: {
            marginTop: '24px',
            padding: '12px 24px',
            backgroundColor: '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500
        }
    };


    const handlePayment = async () => {
        if (!user) {
            setErrorMessage("Bitte einloggen um zu buchen");
            return;
        }

        try {
            const response = await fetch('http://localhost:5022/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apartmentId: apartmentId,
                    userId: user.userID,
                    startDate: checkInDate,
                    endDate: checkOutDate,
                    guests: guests
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Buchungsfehler");
            }

            setShowSuccess(true);

        } catch (error) {
            setErrorMessage(
                error.message || "Fehler bei der Buchung. Bitte erneut versuchen."
            );
        }
    };

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
                    <Link href="/frontend/public" className="back-button">
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
                    <Link href="/frontend/public" className="back-button">
                        Zurück zur Startseite
                    </Link>
                </div>
            </div>
        )
    }

    const images = parseJSON(apartment.images) || []
    const firstImage = images.length > 0 ? images[0] : null

    // Berechne die Anzahl der Nächte
    const calculateNights = () => {
        if (!checkInDate || !checkOutDate) return 0
        const start = new Date(checkInDate)
        const end = new Date(checkOutDate)
        const timeDiff = end.getTime() - start.getTime()
        return Math.ceil(timeDiff / (1000 * 3600 * 24))
    }

    const nights = calculateNights()

    return (
        <div className="page-container">
            <Head>
                <title>Buchung | {apartment.title} | Movo</title>
            </Head>

            <div className="content-wrapper">
                {/* Header */}
                <header className="page-header">
                    <button
                        onClick={() => router.back()}
                        className="back-button"
                    >
                        <ArrowLeftIcon className="icon" />
                        Zurück
                    </button>
                    <h1>Buchung abschließen</h1>
                </header>

                {/* Main content */}
                <main className="main-content">
                    <div className="booking-grid">
                        {/* Left column - Booking details */}
                        <div className="booking-details">
                            <section className="section">
                                <h2>Ihre Reisedaten</h2>
                                <div className="dates-grid">
                                    <div className="date-display">
                                        <label>Anreise</label>
                                        <div className="date-value">{checkInDate}</div>
                                    </div>
                                    <div className="date-display">
                                        <label>Abreise</label>
                                        <div className="date-value">{checkOutDate}</div>
                                    </div>
                                </div>
                                <div className="guests-display">
                                    <label>Gäste</label>
                                    <div className="guests-value">{guests} {guests === 1 ? 'Gast' : 'Gäste'}</div>
                                </div>
                            </section>

                            <section className="section">
                                <h2>Zahlungsmethode</h2>
                                <div className="payment-methods">
                                    <div className="payment-method">
                                        <input
                                            type="radio"
                                            id="credit"
                                            name="paymentMethod"
                                            value="credit"
                                            checked={paymentMethod === 'credit'}
                                            onChange={() => setPaymentMethod('credit')}
                                        />
                                        <label htmlFor="credit">Kreditkarte</label>
                                    </div>
                                    <div className="payment-method">
                                        <input
                                            type="radio"
                                            id="paypal"
                                            name="paymentMethod"
                                            value="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={() => setPaymentMethod('paypal')}
                                        />
                                        <label htmlFor="paypal">PayPal</label>
                                    </div>
                                </div>

                                {paymentMethod === 'credit' && (
                                    <div className="card-details">
                                        <div className="form-group">
                                            <label>Kartennummer</label>
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardDetails.number}
                                                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Name auf der Karte</label>
                                            <input
                                                type="text"
                                                placeholder="Max Mustermann"
                                                value={cardDetails.name}
                                                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="card-grid">
                                            <div className="form-group">
                                                <label>Ablaufdatum</label>
                                                <input
                                                    type="text"
                                                    placeholder="MM/JJ"
                                                    value={cardDetails.expiry}
                                                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>CVC</label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    value={cardDetails.cvc}
                                                    onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>
                        </div>

                        {/* Right column - Summary */}
                        <div className="booking-summary">
                            <div className="summary-card">
                                <h2>Zusammenfassung</h2>

                                <div className="apartment-info">
                                    {firstImage && (
                                        <div className="apartment-image">
                                            <img
                                                src={getImageUrl(firstImage)}
                                                alt={apartment.title}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg'
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div className="apartment-details">
                                        <h3>{apartment.title}</h3>
                                        <div className="price">
                                            €{apartment.price} <span>/ Nacht</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="price-breakdown">
                                    <div className="price-row">
                                        <span>€{pricePerGuest} x {nights} Nächte x {guests} Gäste</span>
                                        <span>€{(Number(pricePerGuest) * Number(nights) * Number(guests)).toLocaleString('de-DE')}</span>
                                    </div>
                                    <div className="total-price">
                                        <span>Gesamt</span>
                                        <span>€{total.toLocaleString('de-DE')}</span>
                                    </div>
                                </div>


                                <button
                                    onClick={handlePayment}
                                    className="pay-button"
                                >
                                    Jetzt bezahlen
                                </button>

                                <p className="notice">
                                    Mit der Buchung bestätigen Sie, dass Sie unsere AGB und Datenschutzbestimmungen gelesen und akzeptiert haben.
                                </p>
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

                /* Header */
                .page-header {
                    padding: 24px 0;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .page-header h1 {
                    font-size: 24px;
                    font-weight: 600;
                    margin: 0;
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

                /* Main grid */
                .booking-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 32px;
                    padding-bottom: 48px;
                }

                @media (min-width: 1024px) {
                    .booking-grid {
                        grid-template-columns: 2fr 1fr;
                    }
                }

                /* Booking details */
                .booking-details {
                    padding: 24px 0;
                }

                .section {
                    margin-bottom: 32px;
                }

                .section h2 {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .dates-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 16px;
                }

                .date-display, .guests-display {
                    width: 100%;
                }

                label {
                    display: block;
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 8px;
                }

                .date-value, .guests-value {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    border: 1px solid #D1D5DB;
                    font-size: 14px;
                    background-color: #f8f9fa;
                    color: #495057;
                }

                /* Payment methods */
                .payment-methods {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 16px;
                }

                .payment-method {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Card details */
                .card-details {
                    background-color: #F9FAFB;
                    padding: 16px;
                    border-radius: 8px;
                }

                .form-group {
                    margin-bottom: 16px;
                }

                .card-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                /* Summary card */
                .booking-summary {
                    position: relative;
                }

                .summary-card {
                    background-color: white;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border: 1px solid #E5E7EB;
                    position: sticky;
                    top: 24px;
                }

                @media (min-width: 1024px) {
                    .summary-card {
                        top: 100px;
                    }
                }

                .summary-card h2 {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 24px;
                }

                /* Apartment info */
                .apartment-info {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .apartment-image {
                    width: 100px;
                    height: 80px;
                    border-radius: 8px;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .apartment-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .apartment-details {
                    flex-grow: 1;
                }

                .apartment-details h3 {
                    font-size: 16px;
                    font-weight: 500;
                    margin: 0 0 8px 0;
                }

                .apartment-details .price {
                    font-size: 16px;
                    color: #6B7280;
                }

                .apartment-details .price span {
                    font-size: 14px;
                }

                /* Price breakdown */
                .price-breakdown {
                    border-top: 1px solid #E5E7EB;
                    padding-top: 16px;
                    margin-bottom: 24px;
                }

                .price-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    color: #6B7280;
                    font-size: 14px;
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

                /* Pay button */
                .pay-button {
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

                .pay-button:hover {
                    background-color: #1D4ED8;
                }

                .notice {
                    font-size: 12px;
                    color: #6B7280;
                    text-align: center;
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
            `}</style>
            {showSuccess && (
                <div style={popupStyles.overlay}>
                    <div style={popupStyles.content}>
                        <h3 style={popupStyles.successHeader}>Buchung erfolgreich! 🎉</h3>
                        <p style={popupStyles.text}>Ihre Buchung für "{apartment.title}" wurde bestätigt.</p>
                        <button
                            onClick={() => {
                                setShowSuccess(false);
                                router.push('/');
                            }}
                            style={popupStyles.button}
                        >
                            Zur Startseite
                        </button>
                    </div>
                </div>
            )}

            {errorMessage && (
                <div style={popupStyles.overlay}>
                    <div style={popupStyles.content}>
                        <h3 style={popupStyles.errorHeader}>Fehler bei der Buchung</h3>
                        <p style={popupStyles.text}>{errorMessage}</p>
                        <button
                            onClick={() => setErrorMessage(null)}
                            style={popupStyles.button}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}