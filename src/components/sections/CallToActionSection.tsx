
import React from "react";

const CallTOActionSection: React.FC = () => (
  <section className="relative isolate overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600" />

    <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:justify-between">
      {/* left – Call To Action */}
      <div className="max-w-lg text-white">
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          Ready to take your learning to the next level?
        </h2>

        <p className="mt-4 text-sm sm:text-base text-white/90">
          Sign up now and experience how our improved Flashcards can elevate your learning.
        </p>

        {/* email + button */}
        <form
          className="mt-6 flex max-w-xs overflow-hidden rounded-md bg-white shadow text-gray-900"
        >
          <input
            type="email"
            required
            placeholder="E-Mail"
            className="w-full flex-1 px-3 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="whitespace-nowrap bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* right – user review */}
      <blockquote className="mx-auto w-full max-w-md rounded-lg border border-white/20 bg-white/10 p-6 text-center text-white backdrop-blur-sm">
        <p className="text-sm font-semibold">Our users say:</p>

        <p className="mt-2 text-xs italic leading-relaxed text-white/90">
          "REDE"
        </p>

        <footer className="mt-3 text-xs font-semibold">— Unknown Vibe Coder</footer>
      </blockquote>
    </div>
  </section>
);

export default CallTOActionSection;
