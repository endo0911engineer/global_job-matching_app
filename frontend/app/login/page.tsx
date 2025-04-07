'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from '../style/login.module.css';
import Link from "next/link";

interface LoginFormData {
    email: string;
    password: string;
}

interface Errors {
    email?: string;
    password?: string;
    general?: string;
}

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
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

        if (!formData.email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid.';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateFields()) {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/accounts/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    setFormData({
                        email: '',
                        password: '',
                    });
                    router.push('/dashboard'); // ログイン後のリダイレクト先を指定
                } else {
                    setErrors({ general: data.error || 'Login failed. Please try again.' });
                }
            } catch (err) {
                setErrors({ general: 'An error occurred. Please try again.' });
            }
        }
    };

    return (
        <main className={styles.container}>
            <div className={styles.formContainer}>
                <h1 className={styles.title}>Login</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
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
                    {errors.general && <p className={styles.error}>{errors.general}</p>}
                    <button type="submit" className={styles.button}>Login</button>
                </form>
                <div className={styles.redirect}>
                    <p>Don't have an account? <Link href="/signup" className={styles.link}>Sign Up</Link></p>
                </div>
            </div>
        </main>
    );
}
