import React from '@/react';
import { Link } from '@/react/router/link';

export function About(): React.JSX.Element {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Fun Chat</h2>
        <p className="text-gray-700 mb-6 text-justify max-w-[600px]">
          Fun Chat is an engaging messaging application designed to bring joy
          and creativity to your conversations. With a vibrant interface and a
          variety of interactive features, Fun Chat allows users to connect with
          friends and family in a playful and entertaining way. Whether you're
          sharing jokes, memes, or fun stickers, Fun Chat makes every chat a
          delightful experience.
        </p>
        <Link to="/chat">Return</Link>
      </div>
    </section>
  );
}
