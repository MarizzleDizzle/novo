"use client";
import React, { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from "../../lib/auth";

interface LoginFormData {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const styles = {
        container: { maxWidth: '500px', margin: '0 auto', padding: '0 16px' },
        card: { borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '32px', marginTop: '48px' },
        header: { textAlign: 'center', marginBottom: '24px' },
        title: { fontSize: '24px', fontWeight: 'bold' },
        formGroup: { marginBottom: '16px' },
        label: { display: 'block', marginBottom: '8px', fontWeight: 500 },
        input: { width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' },
        button: { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' },
        buttonDisabled: { backgroundColor: '#93c5fd', cursor: 'not-allowed' },
        alertError: { backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '16px', borderRadius: '4px', marginBottom: '16px' },
        textCenter: { textAlign: 'center' },
        linkPrimary: { color: '#2563eb', textDecoration: 'none' },
        smallText: { fontSize: '14px', color: '#6B7280' },
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formRef.current?.checkValidity()) {
            formRef.current?.classList.add('was-validated');
            return;
        }

        setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            router.push('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Login</h2>
                </div>

                {error && (
                    <div style={styles.alertError}>
                        <strong>Fehler:</strong> {error}
                    </div>
                )}

                <form ref={formRef} noValidate onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label htmlFor="email" style={styles.label}>
                            E-Mail-Adresse<span>*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            style={styles.input}
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label htmlFor="password" style={styles.label}>
                            Passwort<span>*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            style={styles.input}
                            value={formData.password}
                            onChange={handleInputChange}
                            minLength={8}
                            required
                        />
                        <div style={styles.smallText}>Mindestens 8 Zeichen</div>
                    </div>

                    <div style={styles.textCenter}>
                        <button
                            type="submit"
                            style={{ ...styles.button, ...(isLoading ? styles.buttonDisabled : {}) }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Login läuft…' : 'Einloggen'}
                        </button>
                    </div>

                    <p style={{ marginTop: '16px', textAlign: 'center' }}>
                        Noch kein Konto? <Link href="/register" style={styles.linkPrimary}>Registrieren</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;