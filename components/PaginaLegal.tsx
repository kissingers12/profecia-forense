import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

/** Envoltorio común de las páginas legales, con el aspecto del resto de la web */
export default function PaginaLegal({
  titulo,
  actualizado,
  children,
}: {
  titulo: string;
  actualizado: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen gradient-hero">
      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#8a7a6a] hover:text-[#c9a84c] text-sm mb-10 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full overflow-hidden border border-[#c9a84c]/40 shrink-0">
            <Image src="/logo.jpg" alt="100x100Cristianos" width={44} height={44} className="object-cover" />
          </div>
          <span className="text-white font-bold">
            100x100 <span className="text-[#c9a84c]">Cristianos</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">{titulo}</h1>
        <p className="text-[#6a5a4a] text-sm mb-10">Última actualización: {actualizado}</p>

        <div className="space-y-8 text-[#b8a888] text-sm leading-relaxed [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-lg [&_h2]:mb-3 [&_strong]:text-[#e8dcc8] [&_ul]:space-y-2 [&_li]:pl-1">
          {children}
        </div>

        <div className="mt-14 pt-8 border-t border-[#c9a84c]/15">
          <p className="text-[#6a5a4a] text-xs">
            ¿Dudas sobre este documento?{" "}
            <Link href="/#contacto" className="text-[#c9a84c] hover:underline">
              Escríbenos desde el formulario de contacto
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
