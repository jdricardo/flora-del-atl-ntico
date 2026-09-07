import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { FOOTER_NAV, PAYMENT_LOGOS } from '@/data/navigation';
import { SITE, whatsappLink } from '@/data/site';
import { useToast } from '@/context/ToastContext';
import { Container } from '@/components/ui/Container';
import { Logo } from './Logo';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: SITE.social.instagram },
  { label: 'Facebook', href: SITE.social.facebook },
  { label: 'Pinterest', href: SITE.social.pinterest },
  { label: 'YouTube', href: SITE.social.youtube },
];

function Newsletter() {
  const [email, setEmail] = useState('');
  const { notify } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Punto de integración: POST /api/newsletter
    notify({
      variant: 'success',
      title: 'Listo, quedaste suscrito',
      description: 'Te escribiremos cuando salga una colección nueva.',
    });
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="newsletter-email" className="eyebrow">
        Cartas del taller
      </label>
      <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
        Una vez al mes: colecciones nuevas, cuidados de temporada y acceso anticipado a ediciones limitadas.
      </p>
      <div className="mt-1 flex max-w-sm items-center gap-2 border-b border-clay pb-2 focus-within:border-ink">
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@correo.com"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink-muted/60"
        />
        <button
          type="submit"
          aria-label="Suscribirme al boletín"
          className="grid size-8 shrink-0 place-items-center rounded-full text-ink transition-all hover:bg-ink hover:text-ivory"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-cream/50">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div className="flex flex-col gap-8">
            <Logo />
            <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
              Taller de diseño floral en Barranquilla desde {SITE.founded}. Trabajamos con cultivos de la Costa Caribe y
              talleres artesanales colombianos.
            </p>
            <Newsletter />
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {FOOTER_NAV.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h3 className="eyebrow mb-4">{group.title}</h3>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={`${group.title}-${item.label}`}>
                      <Link to={item.to} className="text-sm text-ink-muted transition-colors hover:text-ink">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-line pt-10 lg:grid-cols-3">
          <div className="flex flex-col gap-3 text-sm text-ink-muted">
            <h3 className="eyebrow">Atelier</h3>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {SITE.atelier.street}, {SITE.atelier.neighborhood}
                <br />
                {SITE.atelier.city} · {SITE.atelier.hours}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-ink-muted">
            <h3 className="eyebrow">Contacto</h3>
            <a href={`mailto:${SITE.contact.email}`} className="flex items-center gap-2 transition-colors hover:text-ink">
              <Mail className="size-4" aria-hidden="true" />
              {SITE.contact.email}
            </a>
            <a href={`tel:${SITE.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 transition-colors hover:text-ink">
              <Phone className="size-4" aria-hidden="true" />
              {SITE.contact.phone}
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium text-olive-600 transition-colors hover:text-olive-700"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Escríbenos por WhatsApp
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="eyebrow">Síguenos</h3>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {SOCIAL_LINKS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline relative text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} {SITE.name}. Todos los derechos reservados. Contenido de demostración.
          </p>
          <ul className="flex flex-wrap items-center gap-2" aria-label="Medios de pago aceptados">
            {PAYMENT_LOGOS.map((method) => (
              <li
                key={method}
                className="rounded border border-line bg-ivory px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.1em] text-ink-muted uppercase"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
