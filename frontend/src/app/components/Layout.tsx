import { ReactNode, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import ImpressumModal from './ImpressumModal';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [showImpressum, setShowImpressum] = useState(false);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
                />
            </Head>

            {/* Navigation */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <div className="container">
                    <Link href="/" className="navbar-brand fw-bold">
                        Movo
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link href="/" className="nav-link">
                                    Start
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/apartments" className="nav-link">
                                    Ferienwohnungen
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/host" className="nav-link">
                                    Anbieter werden
                                </Link>
                            </li>
                        </ul>
                        <div className="d-flex">
                            <Link href="/login" className="btn btn-outline-light me-2">
                                Login
                            </Link>
                            <Link href="/register" className="btn btn-accent">
                                Registrieren
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-dark text-white py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <h5>Movo – Move and Go</h5>
                            <p>Die Plattform für einzigartige Ferienwohnungen und unvergessliche Reiseerlebnisse.</p>
                        </div>
                        <div className="col-md-2 mb-4">
                            <h5>Navigation</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <Link href="/" className="text-white">
                                        Start
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/apartments" className="text-white">
                                        Wohnungen
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/host" className="text-white">
                                        Anbieter
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/login" className="text-white">
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-3 mb-4">
                            <h5>Rechtliches</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <a
                                        href="#"
                                        className="text-white"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowImpressum(true);
                                        }}
                                    >
                                        Impressum
                                    </a>
                                </li>
                                <li>
                                    <Link href="/datenschutz" className="text-white">
                                        Datenschutz
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/agb" className="text-white">
                                        AGB
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-3 mb-4">
                            <h5>Kontakt</h5>
                            <ul className="list-unstyled">
                                <li>
                                    <i className="fas fa-envelope me-2"></i> info@movo.de
                                </li>
                                <li>
                                    <i className="fas fa-phone me-2"></i> +49 123 456789
                                </li>
                                <li>
                                    <i className="fas fa-map-marker-alt me-2"></i> Musterstraße 1, 12345 Berlin
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-4 bg-light" />
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">&copy; 2025 Movo – Move and Go. Alle Rechte vorbehalten.</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <a href="#" className="text-white me-3">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" className="text-white me-3">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="#" className="text-white me-3">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="text-white">
                                <i className="fab fa-pinterest"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            <ImpressumModal show={showImpressum} onHide={() => setShowImpressum(false)} />

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </>
    );
}