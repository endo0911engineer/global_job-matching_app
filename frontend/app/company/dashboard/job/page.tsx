
import { useEffect, useState } from 'react';
import styles from '../../styles/dashboard.module.css';
import { useParams, useRouter } from 'next/navigation';

interface Job {
    id: number;
    title: string;
    description: string;
    location: string;
    required_skills: string;
    salary: string;
}

export default function CompanyJobs() {
    const [job, setJob] = useState<Job | null>(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateError, setUpdateError] = useState('');
    const router = useRouter();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;

        async function fetchJob() {
            try {
                const token = localStorage.getItem('token');
                if(!token) {
                    setError('No authentication token found');
                    return;
                }
                
                const response = await fetch(`/api/jobs/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setJob(data);
                } else {
                    setError('Failed to load job');
                }
            } catch (error) {
                setError('Error fetching job');
            } finally {
                setLoading(false);
            }
        }
        fetchJob();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (job) {
            setJob({ ...job, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!job) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(job),
            });

            if(response.ok) {
                router.push('/company/dashboard');
            } else {
                setUpdateError('Failded to update job');
            }
        } catch (error) {
            setUpdateError('Error updating job');
        }
    };

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if(!job) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if(response.ok) {
                router.push('/company/dashboard');
            } else {
                setUpdateError('Failded to delete job');
            }
        } catch (error) {
            setUpdateError('Error deleting job');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Edit Job</h1>
            {updateError && <p className={styles.error}>{updateError}</p>}
            {job && (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>Job Title</label>
                    <input
                        type="text"
                        name="title"
                        value={job.title}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <label className={styles.label}>Description</label>
                    <textarea
                        name="description"
                        value={job.description}
                        onChange={handleChange}
                        className={styles.textarea}
                        required
                    />
                    <label className={styles.label}>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={job.location}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <label className={styles.label}>Required Skills</label>
                    <input
                        type="text"
                        name="required_skills"
                        value={job.required_skills}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <label className={styles.label}>Salary</label>
                    <input
                        type="text"
                        name="salary"
                        value={job.salary}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className={styles.button}>Save Changes</button>
                </form>
            )}
            <button onClick={handleDelete} className={styles.button}>Delete Job</button>
        </main>
    );
}