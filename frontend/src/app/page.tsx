"use client"
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

export default function Home() {
  const [searchDestination, setSearchDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch apartments on component mount
  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5022/api/apartments', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch apartments: ${response.status}`);
        }

        const data = await response.json();
        setApartments(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching apartments:', err);
        // @ts-ignore
        setError(err.message);
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

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
    hero: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '64px 0',
      textAlign: 'center',
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
    searchBox: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: '0 auto',
    },
    formGroup: {
      marginBottom: '16px',
    },
    inputLabel: {
      display: 'block',
      marginBottom: '8px',
      textAlign: 'left',
      fontWeight: '500',
      color: '#374151', // gray-700
    },
    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #D1D5DB', // gray-300
      fontSize: '16px',
    },
    section: {
      padding: '64px 0',
    },
    sectionLight: {
      padding: '64px 0',
      backgroundColor: '#F9FAFB', // gray-50
    },
    sectionHeading: {
      fontSize: '30px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '48px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '32px',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    cardImage: {
      height: '200px',
      backgroundColor: '#E5E7EB', // gray-200
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    cardBody: {
      padding: '24px',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    cardLocation: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      color: '#6B7280', // gray-500
    },
    feature: {
      textAlign: 'center',
      padding: '16px',
    },
    featureIcon: {
      width: '64px',
      height: '64px',
      borderRadius: '50%',
      backgroundColor: '#DBEAFE', // blue-100
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      color: '#2563eb', // blue-600
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px',
    },
    centeredContent: {
      textAlign: 'center',
      marginTop: '32px',
    },
    footer: {
      backgroundColor: '#111827', // gray-900
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
      color: '#9CA3AF', // gray-400
      textDecoration: 'none',
      marginBottom: '8px',
    },
    footerBottom: {
      borderTop: '1px solid #374151', // gray-700
      marginTop: '32px',
      paddingTop: '24px',
      textAlign: 'center',
      color: '#9CA3AF', // gray-400
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      gap: '16px',
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    loading: {
      textAlign: 'center',
      padding: '20px',
      fontSize: '18px',
      color: '#6B7280',
    },
    errorMessage: {
      textAlign: 'center',
      padding: '20px',
      fontSize: '18px',
      color: '#DC2626',
    },
  };

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


  return (
      <div>
        <Head>
          <title>Movo – Move and Go</title>
          <meta name="description" content="Die Plattform für einzigartige Ferienwohnungen und unvergessliche Reiseerlebnisse." />
        </Head>



        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.container}>
            <h1 style={styles.heading}>Move and Go – Entdecke dein nächstes Urlaubszuhause</h1>
            <p style={styles.subheading}>Finde perfekte Ferienwohnungen für deinen nächsten Trip</p>

            <div style={styles.searchBox}>
              <form style={styles.flexColumn}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div style={styles.formGroup}>
                    <label htmlFor="destination" style={styles.inputLabel}>Reiseziel</label>
                    <input
                        id="destination"
                        type="text"
                        value={searchDestination}
                        onChange={(e) => setSearchDestination(e.target.value)}
                        style={styles.input}
                        placeholder="Wohin möchtest du reisen?"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="check-in" style={styles.inputLabel}>Anreise</label>
                    <input
                        id="check-in"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label htmlFor="check-out" style={styles.inputLabel}>Abreise</label>
                    <input
                        id="check-out"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        style={styles.input}
                    />
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <button type="submit" style={styles.button}>
                    Suchen
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Featured Apartments */}
        <section style={styles.sectionLight}>
          <div style={styles.container}>
            <h2 style={styles.sectionHeading}>Beliebte Ferienwohnungen</h2>

            {loading && (
                <div style={styles.loading}>
                  Lade Ferienwohnungen...
                </div>
            )}

            {error && (
                <div style={styles.errorMessage}>
                  Fehler beim Laden der Ferienwohnungen: {error}
                </div>
            )}

            {!loading && !error && (
                <div style={styles.grid}>
                  {apartments.length > 0 ? (
                      apartments.slice(0, 6).map((apartment) => {
                        const images = parseJSON(apartment.images) || [];
                        console.log(images);
                        const firstImage = images.length > 0 ? images[0] : null;
                        const amenities = parseJSON(apartment.amenities) || {};

                        return (
                            <div key={apartment.id} style={styles.card}>
                              <Link href={`/details/${apartment.id}`} style={{ textDecoration: 'none' }}>
                                <div
                                    style={{
                                      ...styles.cardImage,
                                      backgroundImage: firstImage ? `url(${getImageUrl(firstImage)})` : 'none'
                                    }}
                                >
                                  {!firstImage && <span>Keine Bilder verfügbar</span>}
                                </div>
                                <div style={styles.cardBody}>
                                  <h3 style={styles.cardTitle}>{apartment.title}</h3>
                                  <div style={styles.cardLocation}>
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                    <span style={{ marginLeft: '8px' }}>{apartment.city}, {apartment.country}</span>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                                      €{apartment.price} <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6B7280' }}>/ Nacht</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                      <div style={{ display: 'flex', gap: '4px' }}>
                                        {amenities.wifi && (
                                            <span title="WLAN">📶</span>
                                        )}
                                        {amenities.kitchen && (
                                            <span title="Küche">🍳</span>
                                        )}
                                        {amenities.parking && (
                                            <span title="Parkplatz">🅿️</span>
                                        )}
                                        {amenities.tv && (
                                            <span title="TV">📺</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                        );
                      })
                  ) : (
                      <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                        Keine Ferienwohnungen gefunden.
                      </div>
                  )}
                </div>
            )}

          </div>
        </section>

        {/* How it works */}
        <section style={styles.section}>
          <div style={styles.container}>
            <h2 style={styles.sectionHeading}>So funktioniert's</h2>

            <div style={styles.grid}>
              {[
                {
                  icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
                  title: '1. Finden',
                  description: 'Entdecke die perfekte Ferienwohnung für deine Bedürfnisse.'
                },
                {
                  icon: 'M5 13l4 4L19 7',
                  title: '2. Buchen',
                  description: 'Sichere dir deine Wunschtermine mit wenigen Klicks.'
                },
                {
                  icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
                  title: '3. Genießen',
                  description: 'Erlebe einen unvergesslichen Urlaub in deinem neuen Zuhause.'
                }
              ].map((step, index) => (
                  <div key={index} style={styles.feature}>
                    <div style={styles.featureIcon}>
                      <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={step.icon}></path>
                      </svg>
                    </div>
                    <h3 style={styles.featureTitle}>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ ...styles.hero, paddingTop: '48px', paddingBottom: '48px' }}>
          <div style={styles.container}>
            <h2 style={{ ...styles.heading, marginBottom: '16px' }}>Bereit für dein nächstes Abenteuer?</h2>
            <p style={{ ...styles.subheading, marginBottom: '24px' }}>Registriere dich jetzt und erhalte exklusive Angebote für deine nächste Reise.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/register" style={{ ...styles.whiteButton, textDecoration: 'none' }}>
                Jetzt registrieren
              </Link>
            </div>
          </div>
        </section>
      </div>
  );
}