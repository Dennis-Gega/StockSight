// src/Team.jsx

const teamMembers = [
  {
    name: "Noah Steinberg",
    role: "Backend (C++)",
    image: "/team/noah.jpg",
  },
  {
    name: "Parth Sachdev",
    role: "Frontend / Integration",
    image: "/team/parth.jpg",
  },
  {
    name: "Dennis Gega",
    role: "Data & API",
    image: "/team/dennis.jpg",
  },
  {
    name: "Aaron Ngo",
    role: "Frontend / Integration",
    image: "/team/aaron.jpg",
  },
  {
    name: "Abraham Ruiz",
    role: "Frontend / Integration",
    image: "/team/abraham.jpg",
  },
];

export default function Team() {
  return (
    <section className="space-y-8 pb-16">
      {/* Page heading */}
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Our Team</h1>
      </header>

      {/* Team grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <article
            key={member.name}
            className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/80 shadow-soft"
          >
            {/* Image area */}
            <div className="relative h-64 bg-slate-100">
              {/* If you don’t have images yet, this will just show the gray box */}
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  // hide broken image icon if file doesn't exist yet
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>

            {/* Name + role */}
            <div className="border-t border-slate-200/70 bg-white/90 px-6 py-4">
              <h2 className="text-lg font-semibold text-slate-900">
                {member.name}
              </h2>
              <p className="text-sm text-slate-500">{member.role}</p>
            </div>
          </article>
        ))}
      </div>

      <p className="text-xs text-slate-500">
        Put images in <code>/public/team/</code> (optional), e.g.{" "}
        <code>/public/team/noah.jpg</code>.
      </p>
    </section>
  );
}
