'use client';
import React from 'react';
import { FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Contact() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full px-6 py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-300 leading-tight mb-6 text-center">
          Contact Us
        </h1>

        <ul className="text-lg text-gray-400 mb-8 space-y-2 text-center">
          <li>Email: <a href="mailto:tarunsharma08.com@gmail.com" className="text-emerald-400 hover:underline">tarunsharma08.com@gmail.com</a></li>
          <li>Phone: <a href="tel:+919368394188" className="text-emerald-400 hover:underline">+91 93683 94188</a></li>
        </ul>

        <div className="flex justify-center space-x-6 mt-6 text-2xl">
          <a href="https://www.linkedin.com/in/tarun-sharma-a0a5552b4" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition">
            <FaLinkedin />
          </a>
          <a href="https://www.instagram.com/_txrun_sh?igsh=YnFtdzkyazdjcTI4" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition">
            <FaInstagram />
          </a>
          <a href="https://x.com/TarunSharm202?s=09" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-400 transition">
            <FaTwitter />
          </a>
        </div>
      </div>
    </section>
  );
}
