import {
  Twitch,
  Youtube,
  Instagram,
  Music,
  Twitter,
  Sparkles,
  Zap,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BionNavbar } from "@/components/bion-navbar";
import { BentoGrid, BentoCard } from "@/components/magic-ui/bento-grid";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full relative text-zinc-100">
      {/* Dark Horizon Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <BionNavbar />

        {/* HERO SECTION */}
        <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          </div>

          <div className="mx-auto w-full max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-medium tracking-tighter text-zinc-100 sm:text-6xl lg:text-7xl">
              Tu identidad digital.
              <br />
              <span className="text-zinc-400">Sin disenos mediocres.</span>
            </h1>

            <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
              El unico Link in Bio disenado para creadores que valoran la estetica.
              Unifica tus redes, cobra por tu trabajo y destaca del resto en menos de 2 minutos.
            </p>

            <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="group h-14 rounded-full bg-cyan-400 px-8 text-base font-medium text-zinc-950 shadow-[0_0_24px_-8px_rgba(34,211,238,0.35)] transition-all hover:bg-cyan-300 hover:shadow-[0_0_30px_-8px_rgba(34,211,238,0.45)]"
              >
                Reclama tu Bion gratis
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <div className="flex h-14 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 backdrop-blur-md transition-all hover:border-white/20">
                <span className="text-sm text-zinc-500">bion.to/</span>
                <input
                  type="text"
                  placeholder="tu-nombre"
                  className="h-auto w-32 border-0 bg-transparent p-0 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              className="rounded-full border border-white/10 bg-white/[0.02] px-5 text-sm text-zinc-300 hover:bg-white/[0.05] hover:text-zinc-100"
            >
              Ver un perfil de ejemplo
            </Button>
          </div>
        </section>

        {/* LOGOS SECTION */}
        <section className="border-t border-white/5 bg-zinc-950/50 py-12 backdrop-blur-sm">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="mb-8 text-center text-sm font-medium text-zinc-500">
              Construido para dominar en
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              <Twitch className="h-6 w-6 text-zinc-600 transition-colors hover:text-zinc-400" />
              <Youtube className="h-6 w-6 text-zinc-600 transition-colors hover:text-zinc-400" />
              <Instagram className="h-6 w-6 text-zinc-600 transition-colors hover:text-zinc-400" />
              <Music className="h-6 w-6 text-zinc-600 transition-colors hover:text-zinc-400" />
              <Twitter className="h-6 w-6 text-zinc-600 transition-colors hover:text-zinc-400" />
            </div>
          </div>
        </section>

        {/* BENTO GRID SECTION */}
        <section
          id="showcase"
          className="border-t border-white/5 bg-zinc-950/80 py-24 sm:py-32 backdrop-blur-sm"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-16 text-center text-3xl font-medium tracking-tight text-zinc-100 sm:text-4xl">
              Velocidad y estetica, sin escribir codigo.
            </h2>

            <BentoGrid>
              <BentoCard
                className="md:col-span-2"
                icon={<Sparkles className="h-5 w-5 text-cyan-400" />}
                name="Personalizacion con Alma."
                description="Iconos vectoriales, fondos inmersivos y tipografias premium. Olvidate de los botones grises aburridos."
                delay={0}
              />
              <BentoCard
                className="md:col-span-1"
                icon={<Zap className="h-5 w-5 text-cyan-400" />}
                name="Carga en milisegundos."
                description="Arquitectura Next.js optimizada para que tu audiencia no se vaya esperando."
                delay={0.1}
              />
              <BentoCard
                className="md:col-span-1"
                icon={<BarChart3 className="h-5 w-5 text-cyan-400" />}
                name="Analiticas que importan."
                description="Descubri que links te generan mas ingresos en tiempo real."
                delay={0.2}
              />
            </BentoGrid>
          </div>
        </section>

        {/* FINAL CTA SECTION / PRICING ANCHOR */}
        <section
          id="pricing"
          className="relative border-t border-white/5 bg-zinc-950 py-24 sm:py-32"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[140px]" />
          </div>

          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-6 text-4xl font-medium tracking-tight text-zinc-100 sm:text-5xl">
              No dejes que una web fea arruine tu contenido.
            </h2>

            <Button
              size="lg"
              className="group mt-8 h-16 rounded-full bg-cyan-400 px-10 text-lg font-medium text-zinc-950 shadow-[0_0_32px_-10px_rgba(34,211,238,0.4)] transition-all hover:bg-cyan-300 hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]"
            >
              Crear mi perfil ahora
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </section>

        {/* FOOTER / CONTACTO */}
        <footer
          id="contact"
          className="border-t border-white/5 bg-zinc-950/90 py-8 backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-center sm:text-left">
              Hecho con <span className="text-zinc-400">Bion</span> · El Steam de los creadores
            </p>
            <a
              href="mailto:hola@bion.to"
              className="text-xs text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
            >
              hola@bion.to
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
