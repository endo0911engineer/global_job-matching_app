'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '../../styles/dashboard.module.css';

interface Company {
    name: string;
    email: string;
    description: string;
}

interface Job {
    id: number;
    title: string;
    companye: string;
    description: string;
    required_skills: string;
    salary: number;
    location: string;
}

export default function CompanyDashboard() {
    const [company, setCompany] = useState<Company | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const companyId = localStorage.getItem('comany_id');
                if(!companyId) return;

                const companyRes = await fetch(`http://127.0.0.1:8000/api/company/me`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });

                const jobsRes = await fetch(`http://127.0.0.1:8000/api/jobs?company=${companyId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                if (companyRes.ok) {
                    setCompany(await companyRes.json());
                }
                if (jobsRes.ok) {
                    setJobs(await jobsRes.json());
                }
            } catch(error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [])


    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Company Dashboard</h1>
            <section className={styles.section}>
                <h2>Company Profile</h2>
                {company ? (
                    <div>
                        <p><strong>Name:</strong> {company.name}</p>
                        <p><strong>Email:</strong> {company.email}</p>
                        <Link href="/company/dashboard/profile">
                            <button className={styles.button}>Edit Profile</button>
                        </Link>
                    </div>
                ) : (
                    <p>Loading company info...</p>
                )}
            </section>

            <section className={styles.section}>
                <h2>Job Listings</h2>
                <Link href="/company/dashboard/jobs/create">
                    <button className={styles.button}>Create Job</button>
                </Link>
                <ul>
                    {jobs.length > 0 ? (
                        jobs.map(job => (
                            <li key={job.id} className={styles.jobItem}>
                                <h3>{job.title}</h3>
                                <p>{job.description}</p>
                                <Link href={`/company/dashboard/jobs/${job.id}`}>
                                    <button className={styles.button}>Edit</button>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <p>No jobs available.</p>
                    )}
                </ul>
            </section>
        </main>
    )
}