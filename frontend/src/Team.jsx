// src/Team.jsx

// Top Row: Noah and Dennis
const leaders = [
  {
    name: "Noah Steinberg",
    role: "Backend (C++)",
    image: "/team/noah.jpg",
  },
  {
    name: "Dennis Gega",
    role: "Data & API",
    image: "/team/dennis.jpg",
  },
];

// Bottom Row: Parth, Abraham, and Aaron
const members = [
  {
    name: "Parth Sachdev",
    role: "Frontend / Integration",
    image: "/team/parth.jpg",
  },
  {
    name: "Abraham Ruiz",
    role: "Frontend / Integration",
    image: "/team/abraham.jpg",
  },
  {
    name: "Aaron Ngo",
    role: "Frontend / Integration",
    image: "/team/aaron.jpg",
  },
];

// Reusable Card Component
function TeamCard({ member }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/80 shadow-soft h-full">
      {/* UPDATED IMAGE AREA:
         1. Changed h-64 to h-80 (makes it taller so it doesn't crop as much)
         2. Changed object-top to object-center (centers the face)
      */}
      <div className="relative h-80 bg-slate-50">
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Name + role */}
      <div className="border-t border-slate-200/70 bg-white/90 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{member.name}</h2>
        <p className="text-sm text-slate-500">{member.role}</p>
      </div>
    </article>
  );
}

export default function Team() {
  return (
    <section className="space-y-12 pb-16">
      {/* Page heading */}
      <header className="space-y-2 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight">Our Team</h1>
      </header>

      <div className="flex flex-col gap-8">
        {/* TOP ROW: Centered (Noah & Dennis) */}
        <div className="grid w-full gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
          {leaders.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>

        {/* BOTTOM ROW: Standard 3-column grid (Parth, Abraham, Aaron) */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}