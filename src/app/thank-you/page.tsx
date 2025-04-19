import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <div className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-3 text-2xl font-bold text-gray-900">Details Fetched Successfully!</h2>
        <p className="mt-2 text-gray-600">
          Thank you for reaching out! We will contact you soon.. Keep an eye on your mailbox.!
        </p>
        <div className="mt-6">
          <Link href="/profile" passHref>
            
          </Link>
        </div>
        <div className="mt-4">
          <Link href="/dashboard" className="text-sm text-blue-600 hover:text-blue-500">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}