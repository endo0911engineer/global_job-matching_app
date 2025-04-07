'use client';

import { useEffect, useState } from "react";
import styles from '../style/engineerprofile.module.css';

type Profile = {
    skills: string[];
    experience: string;
    expected_salary: number;
    english_level: string;
    portfolio_url: string; 
};

export default function EngineerProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Profile>({
        skills: [],
        experience: '',
        expected_salary: 0,
        english_level: 'beginner',
        portfolio_url: '',
    });

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const res = await fetch('api/engineer-profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();
            setProfile(data);
            setFormData(data);
        } catch(error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement |  HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'expected_salary' ? Number(value) : value,
        }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            skills: e.target.value.split(',').map(skill => skill.trim()),
        }));
    };

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/engineer-profile/', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });
            const updated = await res.json();
            setProfile(updated);
            setIsEditing(false);
        } catch (error) {
            console.error('Update error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>
    if (!profile) return <p>プロフィールが存在しません。</p>

    return (
        <div>
            <h1 className={styles.title}>Engineer Profile</h1>
            {isEditing ? (
                <div className={styles.form}>
                    <label>
                        Skills (comma-separated):
                        <input name="skills" value={formData.skills.join(',')} onChange={handleSkillsChange} />
                    </label>
                    <label>
                        Experience:
                        <textarea name="experience" value={formData.experience} onChange={handleChange} />
                    </label>
                    <label>
                        Expected Salary:
                        <input name="expected_salary" type="number" value={formData.expected_salary} onChange={handleChange} />
                    </label>
                    <label>
                        English Level:
                        <select name="english_level" value={formData.english_level} onChange={handleChange}>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </label>
                    <label>
                        Portfolio URL:
                        <input name="portfolio_url" type="url" value={formData.portfolio_url} onChange={handleChange} />
                    </label>
                    <button onClick={handleSubmit} className={styles.saveButton}>Save</button>
                </div>
                ) : (
                <div className={styles.profile}>
                    <p><strong>Skills:</strong> {profile?.skills.join(', ')}</p>
                    <p><strong>Experience:</strong> {profile?.experience}</p>
                    <p><strong>Expected Salary:</strong> ${profile?.expected_salary}</p>
                    <p><strong>English Level:</strong> {profile?.english_level}</p>
                    <p><strong>Portfolio URL:</strong> <a href={profile?.portfolio_url} target="_blank">{profile?.portfolio_url}</a></p>
                    <button onClick={() => setIsEditing(true)} className={styles.editButton}>Edit</button>
                </div>
            )}
        </div>
    )
}