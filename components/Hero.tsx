'use client';

import Link from 'next/link';

interface Plan {
  title: string;
  price: string;
  features: string[];
  buttonText: string;
  route: string;
  border: string;
  badge?: string;
}


export default function Hero() {
  const plans: Plan[] = [
    {
      title: 'Beginner',
      price: 'Free',
      features: ['Basic training plan', 'Bot Guidance', 'Community access', 'Chat Support'],
      buttonText: 'Get Started',
      route: '/plans/beginner',
      border: 'border-gray-300',
    },
    {
      title: 'Intermediate',
      price: '$15/month',
      features: ['Custom training plan', 'Nutrition guidance', 'Prioritized response', 'Chat Support'],
      buttonText: 'Get Started',
      route: '/plans/intermediate',
      badge: 'Popular',
      border: 'border-yellow-500',
    },
    {
      title: 'Advanced',
      price: '$30/month',
      features: ['1-on-1 coaching', 'Advanced analytics', 'Prioritized response', 'Chat support'],
      buttonText: 'Get Started',
      route: '/plans/advanced',
      border: 'border-blue-500',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-center lg:text-left lg:max-w-xl w-full order-2 lg:order-1 mt-8 lg:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-400 leading-tight mb-4 sm:mb-6">
            Train Smarter <br className="sm:hidden" /><span className="text-green-700">Grow Stronger</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 break-words">
          "Transform your fitness journey with personalized plans, expert coaching, and unwavering support."
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <button className="border border-green-600 text-green-600 hover:bg-blue-50 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-lg transition duration-300 cursor-pointer">
              Learn More
            </button>
          </div>
        </div>

        <div className="order-1 lg:order-2 w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:mx-0">
          <img
            src="https://cdn.vectorstock.com/i/750p/58/88/weightlifter-lifting-barbell-retro-vector-2295888.avif"
            alt="Hero Illustration"
            className="w-full rounded-lg shadow-xl"
            loading="lazy"
          />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-center my-8 sm:my-12 text-gray-400 px-4">
        Choose Your Path to Progress
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 pb-12 sm:pb-24">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`border ${plan.border} bg-gradient-to-r from-black via-emerald-800 to-green-500 rounded-xl p-4 sm:p-6 shadow-md hover:shadow-lg transition duration-300 flex flex-col`}
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2 text-gray-400">{plan.title}</h3>
              {plan.badge && (
                <span className="inline-block text-sm bg-yellow-500 text-black px-2 py-1 rounded-full mb-2">
                  {plan.badge}
                </span>
              )}
              <p className="text-2xl font-bold text-gray-300">{plan.price}</p>
            </div>

            <ul className="flex-1 space-y-2 mb-6 text-m text-gray-300">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> {feature}
                </li>
              ))}
            </ul>

            <Link href={`/auth?redirect=${plan.route}`} passHref>
              <button className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-700 to-green-500 hover:from-emerald-800 hover:to-green-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                {plan.buttonText}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}