import { Inputs } from '@/components/Input';
import React, { useState } from 'react';
import axios from 'axios';  
import { useRouter } from 'next/router';

export default function ForgetPassword() {
    const [payload, setPayload] = useState({
        email: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPayload(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/api/auth/forget-password', payload);
            console.log('API Response:', response.data);
            router.push('/auth/forget-password/success');
        } catch (err) {
            console.error("Submit Error:", err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="lg:grid block h-screen lg:grid-cols-2">
            <div className="bg hidden lg:block" />
            <section className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full wrapper max-w-md p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Forget Password</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Inputs
                            type="email"
                            name="email"
                            onChange={handleChange}
                            value={payload.email}
                            placeholder="Enter your email"
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </section>
        </section>
    );
}
