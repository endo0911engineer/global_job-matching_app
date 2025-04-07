'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from '../style/signup.module.css';
import Link from "next/link";

interface CompanySignupFormData {
    companyName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface Errors {
    companyName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export default function CompanySignupPage() {
    const [formData, setFormData] = useState<CompanySignupFormData>({
        companyName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Errors>({});
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validateFields = () => {
        const newErrors: Errors = {};

        if (!formData.companyName) {
            newErrors.companyName = 'Company name is required.';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password.';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateFields()) {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        companyName: formData.companyName,
                        email: formData.email,
                        password: formData.password,
                        role: 'company', // 企業として登録
                    })
                });

                const data = await response.json();

                if(response.ok) {
                    setFormData({
                        companyName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    });

                    router.push('/company/dashboard'); // 企業用のダッシュボードへ遷移
                } else {
                    setErrors({ general: data.error || 'Registration failed. Please try again.' });
                }
            } catch(err) {
                setErrors({ general: 'An error occurred. Please try again.' });
            }
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Company Sign Up</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="companyName" className={styles.label}>Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.companyName ? styles.inputError : ''}`}
                            required
                        />
                        {errors.companyName && <p className={styles.error}>{errors.companyName}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                            required
                        />
                        {errors.email && <p className={styles.error}>{errors.email}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                            required
                        />
                        {errors.password && <p className={styles.error}>{errors.password}</p>}
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                            required
                        />
                        {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
                    </div>
                    {errors.general && <p className={styles.error}>{errors.general}</p>}
                    <button type="submit" className={styles.button}>Register</button>
                </form>
                <div className={styles.redirect}>
                    <p>Already have an account? <Link href="/company_login" className={styles.link}>Log In</Link></p>
                </div>
            </div>
        </main>
    );
}