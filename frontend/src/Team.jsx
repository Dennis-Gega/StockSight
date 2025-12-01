const members = [
  // add/change later
  { name: "Noah Steinberg", role: "Frontend / Integration", img: "/team/noah.jpg" },
  { name: "Member 2", role: "Backend (C++)", img: "/team/member2.jpg" },
  { name: "Member 3", role: "Data / Indicators", img: "/team/member3.jpg" },
];

export default function Team() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-extrabold">Our Team</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((m) => (
          <article key={m.name} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 shadow-soft overflow-hidden">
            <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800">
              <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{m.name}</h3>
              <p className="text-sm text-slate-500">{m.role}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm text-slate-500">Put images in <code>/public/team/</code> (optional).</p>
    </section>
  );
}
