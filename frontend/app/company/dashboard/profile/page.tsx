'use client';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/dashboard.module.css';
import { useRouter } from 'next/navigation';

interface Company {
    name: string;
    email: string;
    description: string;
}

export default function CompanyProfile() {
    const [company, setCompany] = useState<Company>(({ name: '', email: '', description: '' }));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchCompany() {
            try {
                const token = localStorage.getItem('token')
                if(!token) {
                    setError('No authentication token found');
                    return;
                }

                const response = await fetch('/api/company/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCompany(data);
                } else {
                    setError('Failed to load company data');
                }
            } catch (error) {
                setError('Error fetching company data');
            } finally {
                setLoading(false);
            }
        }
        fetchCompany();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCompany(prevCompany => ({ ...prevCompany, [e.target.name]: e.target.value }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('auth_token');  // トークンをローカルストレージから取得
            if (!token) {
                setError('No authentication token found');
                return;
            }

            const response = await fetch('/api/company/me', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                 },
                body: JSON.stringify(company),
            });
            
            if(response.ok) {
                router.push('/company/dashboard');
            } else {
                setError('Failed to updare company profile');
            }
        } catch (error) {
            setError('Error updatig company profile');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Edit Company Profile</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>Company Name</label>
                <input 
                    type="text" 
                    name="name" 
                    value={company.name} 
                    onChange={handleChange} 
                    className={styles.input} 
                    required 
                />
                <label className={styles.label}>Email</label>
                <input 
                    type="email" 
                    name="email" 
                    value={company.email} 
                    onChange={handleChange} 
                    className={styles.input} 
                    required 
                />
                <label className={styles.label}>Description</label>
                <textarea
                    name="description"
                    value={company.description}
                    onChange={handleChange}
                    className={styles.textarea}
                    required
                />
                <button type="submit" className={styles.button}>Save Changes</button>
            </form>
        </main>
    );
}