"use client";
import React, { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RegisterFormData {
  role: 'customer' | 'provider';
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<RegisterFormData>({
    role: 'customer',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const styles = {
    container: { maxWidth: '500px', margin: '0 auto', padding: '0 16px' },
    card: { borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '32px', marginTop: '48px' },
    header: { textAlign: 'center', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: 'bold' },
    formGroup: { marginBottom: '16px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 500 },
    input: { width: '100%', padding: '12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '16px' },
    radioGroup: { display: 'flex', gap: '16px' },
    radioLabel: { flex: 1, display: 'block', padding: '16px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center', cursor: 'pointer' },
    radioChecked: { borderColor: '#2563eb', backgroundColor: '#f0f8ff' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    button: { width: '100%', padding: '12px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' },
    buttonDisabled: { backgroundColor: '#93c5fd', cursor: 'not-allowed' },
    alertError: { backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', padding: '16px', borderRadius: '4px', marginBottom: '16px' },
    alertSuccess: { backgroundColor: '#d1fae5', border: '1px solid #a7f3d0', color: '#047857', padding: '16px', borderRadius: '4px', marginBottom: '16px' },
    textCenter: { textAlign: 'center' },
    linkPrimary: { color: '#2563eb', textDecoration: 'none' },
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, role: e.target.value as 'customer' | 'provider' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formRef.current?.checkValidity()) {
      formRef.current?.classList.add('was-validated');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein!');
      return;
    }
    if (!formData.agreeTerms) {
      setError('Sie müssen den AGB und Datenschutzbestimmungen zustimmen.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5022/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      // Handle non-JSON or error responses gracefully
      if (!response.ok) {
        let errorMessage = 'Fehler bei der Registrierung';
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccess('Registrierung erfolgreich! Eine Bestätigungs-E-Mail wurde gesendet.');
      setTimeout(() => router.push('/login'), 1500);
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
          <h2 style={styles.title}>Konto erstellen</h2>
        </div>
        {error && <div style={styles.alertError}><strong>Fehler:</strong> {error}</div>}
        {success && <div style={styles.alertSuccess}><strong>Erfolg:</strong> {success}</div>}
        <form ref={formRef} noValidate onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Ich möchte mich registrieren als:</label>
            <div style={styles.radioGroup}>
              <label style={{...styles.radioLabel, ...(formData.role==='customer'?styles.radioChecked:{})}}>
                <input type="radio" name="role" value="customer" checked={formData.role==='customer'} onChange={handleRoleChange} style={{ display: 'none' }}/>
                <div>Gast<br/><small>Ferienwohnungen mieten</small></div>
              </label>
              <label style={{...styles.radioLabel, ...(formData.role==='provider'?styles.radioChecked:{})}}>
                <input type="radio" name="role" value="provider" checked={formData.role==='provider'} onChange={handleRoleChange} style={{ display: 'none' }}/>
                <div>Anbieter<br/><small>Wohnungen vermieten</small></div>
              </label>
            </div>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Name<span>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              style={styles.input}
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>E-Mail-Adresse<span>*</span></label>
            <input type="email" id="email" name="email" style={styles.input} value={formData.email} onChange={handleInputChange} required/>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Passwort<span>*</span></label>
            <input type="password" id="password" name="password" style={styles.input} value={formData.password} onChange={handleInputChange} minLength={8} required/>
            <small>Mindestens 8 Zeichen</small>
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Passwort bestätigen<span>*</span></label>
            <input type="password" id="confirmPassword" name="confirmPassword" style={styles.input} value={formData.confirmPassword} onChange={handleInputChange} required/>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange}/>
              <span>Ich akzeptiere die <Link href="/agb" style={styles.linkPrimary}>AGB</Link> und die <Link href="/datenschutz" style={styles.linkPrimary}>Datenschutzbestimmungen</Link><span>*</span></span>
            </label>
          </div>
          <div style={styles.textCenter}>
            <button type="submit" style={{...styles.button, ...(isLoading?styles.buttonDisabled:{})}} disabled={isLoading}>
              {isLoading ? 'Registriere...' : 'Registrieren'}
            </button>
          </div>
          <p style={{ marginTop: '16px', textAlign: 'center' }}>
            Bereits registriert? <Link href="/login" style={styles.linkPrimary}>Anmelden</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
