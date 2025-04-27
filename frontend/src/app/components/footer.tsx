import Link from 'next/link';

const styles = {
    footer: {
        backgroundColor: '#111827',
        color: 'white',
        padding: '48px 0',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 16px',
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
};

export default function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.footerGrid}>
                    <div>
                        <h3 style={styles.footerHeading}>Movo</h3>
                        <p style={{ color: '#9CA3AF' }}>
                            Die Plattform für einzigartige Ferienwohnungen und unvergessliche Reiseerlebnisse.
                        </p>
                    </div>
                    <div>
                        <h3 style={styles.footerHeading}>Entdecken</h3>
                        <Link href="/apartments" style={styles.footerLink}>Ferienwohnungen</Link>
                        <Link href="/cities" style={styles.footerLink}>Städte</Link>
                        <Link href="/experiences" style={styles.footerLink}>Erlebnisse</Link>
                    </div>
                    <div>
                        <h3 style={styles.footerHeading}>Gastgeber</h3>
                        <Link href="/become-host" style={styles.footerLink}>Anbieter werden</Link>
                        <Link href="/host-resources" style={styles.footerLink}>Ressourcen</Link>
                        <Link href="/host-community" style={styles.footerLink}>Community</Link>
                    </div>
                    <div>
                        <h3 style={styles.footerHeading}>Hilfe</h3>
                        <Link href="/help-center" style={styles.footerLink}>Hilfezentrum</Link>
                        <Link href="/faq" style={styles.footerLink}>FAQ</Link>
                        <Link href="/contact" style={styles.footerLink}>Kontakt</Link>
                    </div>
                </div>
                <div style={styles.footerBottom}>
                    <p>© 2025 Movo. Alle Rechte vorbehalten.</p>
                </div>
            </div>
        </footer>
    );
}