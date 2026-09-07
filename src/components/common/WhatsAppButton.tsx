import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/data/site';

/** Acceso flotante a WhatsApp. Punto de integración con la API de WhatsApp Business. */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-olive-500/95 p-3 text-ivory shadow-lift backdrop-blur-sm transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-olive-600 sm:bottom-6 sm:left-6 sm:pr-4 sm:pl-3"
      aria-label="Escríbenos por WhatsApp"
    >
      <MessageCircle className="size-5 shrink-0" aria-hidden="true" strokeWidth={1.8} />
      <span className="hidden max-w-0 overflow-hidden text-[0.7rem] font-medium tracking-[0.12em] whitespace-nowrap uppercase transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:max-w-40 group-focus-visible:max-w-40 sm:inline-block">
        Escríbenos
      </span>
    </a>
  );
}
