'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';

export default function BeginnerFormPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    goals: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const serviceID = 'service_c63eyjd';
    const templateID = 'template_d0216v6';
    const publicKey = '0QyFOh_tRKtylHwH5';

    try {
      await emailjs.send(serviceID, templateID, formData, publicKey);
      console.log('Email sent successfully!');
      router.push('/thank-you'); 
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 px-4">
      <form onSubmit={handleSubmit} className="bg-black shadow-md rounded-lg p-8 w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Tell Us About You</h2>

        <input
          type="text"
          name="name"
          placeholder="Your fitness Goals"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="height"
          placeholder="Height (in cm)"
          value={formData.height}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="text"
          name="weight"
          placeholder="Weight (in kg)"
          value={formData.weight}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="goals"
          placeholder="Your Name"
          value={formData.goals}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-900 to-green-500 hover:from-emerald-900 hover:to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
          Submit
        </button>
      </form>
    </div>
  );
}
