const milestones = [
  {
    age: "8 años",
    text: "Entregué mi vida a Jesucristo. Pocos días después, en medio de la noche, fui despertado por una voz poderosa, como un trueno, que llamaba mi nombre. Corrí hacia mi familia buscando explicación, pero ellos insistían en que nadie me había llamado. Sin embargo, mientras más intentaba ignorarla, más fuerte se hacía aquella voz que resonaba en mi interior.",
  },
  {
    age: "El llamado",
    text: "Desde ese momento, comenzaron a manifestarse experiencias sobrenaturales en mi vida. Empecé a percibir acontecimientos relacionados con mi familia, mi ciudad y mi iglesia antes de que ocurrieran. Al reconocer el llamado de Dios sobre mi vida, el pastor de mi congregación me ungió como profeta y comenzó mi proceso de formación y entrenamiento ministerial.",
  },
  {
    age: "La juventud",
    text: "Crecí bajo la cobertura y enseñanza de la iglesia Gran Campaña de Fe en Dios en Mérida, dentro de la denominación Asambleas de Dios. A los 17 años inicié mi ministerio como predicador de jóvenes, impactando a mi ciudad mediante la predicación y el ministerio profético.",
  },
  {
    age: "25 años",
    text: "Me casé con Astrid Orellana y fui entrenado proféticamente por las enseñanzas de Uebert Angel y Passion Java. Dios me movió a Ecuador donde comencé mi ministerio, fundé la primera iglesia y participé en la formación de nuevos creyentes y líderes.",
  },
  {
    age: "2019",
    text: "Dios me dirigió a España, donde fundamos una segunda iglesia, continuando la misión de extender el Evangelio, formar discípulos y levantar una nueva generación de líderes comprometidos con el Reino de Dios.",
  },
  {
    age: "Hoy",
    text: "He dedicado mi vida a predicar el Evangelio, entrenar líderes, desarrollar el ministerio profético y ayudar a las personas a descubrir y caminar en el propósito que Dios tiene para sus vidas.",
  },
];

export default function Biography() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="orb orb-purple w-[400px] h-[400px] top-0 right-0 opacity-10 absolute" />
      <div className="orb orb-blue w-[350px] h-[350px] bottom-0 left-0 opacity-10 absolute" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.3em] uppercase mb-4">
            Su historia
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Conociendo más sobre{" "}
            <span className="text-[#c9a84c]">Kissingers Araque</span>
          </h2>
          <div className="divider-gold max-w-xs mx-auto mt-8" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#c9a84c]/30 to-transparent" />

          <div className="space-y-10">
            {milestones.map((m, i) => (
              <div
                key={i}
                className={`relative flex gap-6 sm:gap-0 ${
                  i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                {/* Content — takes half width on desktop */}
                <div className={`sm:w-[calc(50%-28px)] ${i % 2 === 0 ? "sm:pr-10 sm:text-right" : "sm:pl-10 sm:text-left"} pl-10 sm:pl-0`}>
                  <div className="card-dark rounded-2xl p-6 card-hover">
                    <span className="inline-block text-[#c9a84c] text-xs font-bold tracking-[0.2em] uppercase mb-3 border border-[#c9a84c]/30 bg-[#c9a84c]/10 rounded-full px-3 py-1">
                      {m.age}
                    </span>
                    <p className="text-[#b8a888] text-sm leading-relaxed">{m.text}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="absolute left-[10px] sm:left-1/2 sm:-translate-x-1/2 top-6 w-4 h-4 rounded-full bg-[#c9a84c] border-2 border-[#050510] shadow-[0_0_12px_rgba(201,168,76,0.5)] shrink-0 z-10" />

                {/* Empty half on desktop */}
                <div className="hidden sm:block sm:w-[calc(50%-28px)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
