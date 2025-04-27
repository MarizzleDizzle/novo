import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Apartment {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
}

export default function FeaturedApartments() {
  const [apartments, setApartments] = useState<Apartment[]>([]);

  useEffect(() => {
    const featuredApartments: Apartment[] = [
      {
        id: 1,
        title: "Gemütliche Wohnung im Zentrum",
        location: "Berlin, Deutschland",
        price: 85,
        rating: 4.8,
        image: "/images/apartment1.jpg",
      },
      {
        id: 2,
        title: "Modernes Apartment mit Meerblick",
        location: "Barcelona, Spanien",
        price: 110,
        rating: 4.6,
        image: "/images/apartment2.jpg",
      },
      {
        id: 3,
        title: "Ruhige Villa mit Pool",
        location: "Toskana, Italien",
        price: 175,
        rating: 4.9,
        image: "/images/apartment3.jpg",
      }
    ];
    setApartments(featuredApartments);
  }, []);

  return (
    <div className="row">
      {apartments.map((apartment) => (
        <div key={apartment.id} className="col-md-4 mb-4">
          <div className="card h-100">
            <div style={{ position: 'relative', height: '200px' }}>
              <Image
                src={apartment.image}
                alt={apartment.title}
                layout="fill"
                objectFit="cover"
                className="card-img-top"
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">{apartment.title}</h5>
              <p className="card-text mb-1">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                {apartment.location}
              </p>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  <span className="fw-bold text-primary">{apartment.price} €</span> / Nacht
                </div>
                <div className="rating">
                  <i className="fas fa-star"></i> {apartment.rating}
                </div>
              </div>
              <Link href={`/apartments/${apartment.id}`} className="btn btn-primary mt-3 w-100">
                Details anzeigen
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}