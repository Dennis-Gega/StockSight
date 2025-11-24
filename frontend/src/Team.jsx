// src/Team.jsx

const teamMembersTop = [
  { name: "Noah Steinberg", role: "Backend (C++)", image: "/team/noah.jpg" },
  { name: "Dennis Gega", role: "Data & API", image: "/team/dennis.jpg" }
];

const teamMembersBottom = [
  { name: "Parth Sachdev", role: "Data Pipeline & Daily Updates/ UX", image: "/team/parth.jpg" },
  { name: "Aaron Ngo", role: "Frontend / Integration", image: "/team/aaron.jpg" },
  { name: "Abraham Ruiz", role: "Frontend / Integration", image: "/team/abraham.jpg" }
];

export default function Team() {
  const renderMember = (member) => (
    <article
      key={member.name}
      className="overflow-hidden rounded-[1.75rem] border border-slate-200/70 bg-white/80 shadow-soft"
    >
      <div className="relative h-64 bg-slate-80">
        <img
          src={member.image}
          alt={member.name}
          className="h-full w-full object-cover object-center"
          loading="lazy"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>

      <div className="border-t border-slate-200/70 bg-white/90 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{member.name}</h2>
        <p className="text-sm text-slate-500">{member.role}</p>
      </div>
    </article>
  );

  return (
    <section className="space-y-8 pb-16">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Our Team</h1>
      </header>

      <div className="flex flex-col gap-8 items-center">
        <div className="grid gap-8 grid-cols-2">{teamMembersTop.map(renderMember)}</div>
        <div className="grid gap-8 grid-cols-3">{teamMembersBottom.map(renderMember)}</div>
      </div>
    </section>
  );
}
