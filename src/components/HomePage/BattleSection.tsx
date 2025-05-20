import React from "react";
import TeamCard from "../Cosmetics/TeamCard";

const BattleSection: React.FC = () => (
  <section className="relative isolate overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700" />

    <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 md:flex-row md:items-center md:justify-between">
      {/* left – TeamCards, hidden on mobile */}
      <div className="flex-col md:flex-row items-center justify-center gap-8 md:w-1/2 hidden md:flex">
        {/* Team Alpha */}
        <TeamCard
          teamName="Team Alpha"
          headerBgClass="bg-purple-600"
          question="What is the capital of France?"
          points={120}
          statusText="Correct!"
          statusTextClass="text-green-500"
        />

        {/* Team Beta */}
        <TeamCard
          teamName="Team Beta"
          headerBgClass="bg-blue-600"
          question="Who wrote „Faust“?"
          points={95}
          statusText="Time's up!"
          statusTextClass="text-red-500"
        />
      </div>

      {/* Description and Step by Step */}
      <div className="max-w-lg text-white">
        <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          Battle with your friends
        </h2>

        <p className="mt-4 text-2xl text-white">
          With our unique battle-mode, you can test your knowledge in a direct
          competition. Create a team, challenge your friends and increase your
          learning success through friendly competition.
          <br />
        </p>

        <p className="mt-4 flex items-center gap-3 text-xl font-medium text-white">
          <span
            className="
              flex items-center justify-center
              w-6 h-6 md:w-7 md:h-7
              rounded-full bg-white text-purple-600
              font-bold text-sm md:text-base
            "
          >
            1
          </span>
          Choose a deck and create a team
        </p>

        <p className="mt-4 flex items-center gap-3 text-xl font-medium text-white">
          <span
            className="
              flex items-center justify-center
              w-6 h-6 md:w-7 md:h-7
              rounded-full bg-white text-purple-600
              font-bold text-sm md:text-base
            "
          >
            2
          </span>
          Duel other teams
        </p>

        <p className="mt-4 flex items-center gap-3 text-xl font-medium text-white">
          <span
            className="
              flex items-center justify-center
              w-6 h-6 md:w-7 md:h-7
              rounded-full bg-white text-purple-600
              font-bold text-sm md:text-base
            "
          >
            3
          </span>
          Collect points and climb the leaderboard
        </p>

        {/* button */}
        <button className="mt-5 px-6 py-3 bg-white text-purple-600 font-semibold border border-purple-600 rounded-xl hover:bg-purple-100 transition">
          Start battle
        </button>
      </div>
    </div>
  </section>
);

export default BattleSection;
