import { useState } from 'react';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { img } from '@/data/images';
import { SITE, whatsappLink } from '@/data/site';
import { useSeo } from '@/hooks/useSeo';
import { useToast } from '@/context/ToastContext';
import { formatPhone } from '@/lib/validation';
import { Container } from '@/components/ui/Container';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { FaqSection } from '@/components/home/FaqSection';

const SUBJECTS = [
  'Estado de mi pedido',
  'Pedido corporativo o evento',
  'Cambio o devolución',
  'Asesoría para elegir un regalo',
  'Otro tema',
];

const CHANNELS = [
  { icon: MessageCircle, label: 'WhatsApp', value: SITE.contact.phone, href: whatsappLink(), note: 'Respuesta en minutos' },
  { icon: Mail, label: 'Correo', value: SITE.contact.email, href: `mailto:${SITE.contact.email}`, note: 'Respuesta en 24 horas' },
  {
    icon: Phone,
    label: 'Teléfono',
    value: SITE.contact.phone,
    href: `tel:${SITE.contact.phone.replace(/\s/g, '')}`,
    note: 'Lunes a sábado',
  },
];

export function ContactPage() {
  const { notify } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });

  useSeo({
    title: 'Contacto',
    description: 'Escríbenos por WhatsApp, correo o teléfono. Atendemos pedidos, eventos y regalos corporativos.',
    path: '/contacto',
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Punto de integración: POST /api/contact o webhook a CRM.
    notify({
      variant: 'success',
      title: 'Mensaje enviado',
      description: 'Te respondemos en horario del taller.',
    });
    setForm({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
  };

  return (
    <>
      <Container className="pt-8 pb-16 lg:pt-10 lg:pb-24">
        <Breadcrumbs items={[{ label: 'Inicio', to: '/' }, { label: 'Contacto' }]} className="mb-8" />

        <div className="flex max-w-2xl flex-col gap-4">
          <span className="eyebrow">Hablemos</span>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem]">Contacto</h1>
          <p className="text-[0.95rem] leading-relaxed text-ink-muted sm:text-base">
            Para pedidos urgentes, WhatsApp es el camino más rápido. Para eventos y regalos corporativos, cuéntanos
            fecha y cantidad y te enviamos una propuesta.
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="flex flex-col gap-8">
            <ul className="flex flex-col gap-3">
              {CHANNELS.map((channel) => (
                <li key={channel.label}>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith('http') ? '_blank' : undefined}
                    rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 rounded-xl border border-line p-4 transition-all duration-300 hover:border-clay hover:bg-cream/50"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-cream text-olive-500">
                      <channel.icon className="size-4" aria-hidden="true" strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.68rem] tracking-[0.12em] text-ink-muted uppercase">
                        {channel.label}
                      </span>
                      <span className="block truncate text-sm font-medium">{channel.value}</span>
                    </span>
                    <span className="ml-auto shrink-0 text-[0.65rem] text-ink-muted">{channel.note}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 rounded-xl bg-cream/50 p-6">
              <h2 className="font-serif text-xl">El atelier</h2>
              <p className="flex items-start gap-2.5 text-sm text-ink-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-clay" aria-hidden="true" />
                {SITE.atelier.street}, {SITE.atelier.neighborhood}
                <br />
                {SITE.atelier.city}, Colombia
              </p>
              <p className="flex items-start gap-2.5 text-sm text-ink-muted">
                <Clock className="mt-0.5 size-4 shrink-0 text-clay" aria-hidden="true" />
                {SITE.atelier.hours}
              </p>
              <div className="grain mt-2 overflow-hidden rounded-lg bg-cream">
                <img
                  src={img('contacto-atelier')}
                  alt="Floristería Flora del Atlántico en Malambo"
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="aspect-16/9 w-full object-cover"
                />
              </div>
              <ButtonLink href={SITE.social.instagram} variant="secondary" size="sm" className="self-start">
                Ver en Instagram
              </ButtonLink>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-line p-6 lg:p-8">
            <h2 className="font-serif text-2xl">Escríbenos</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="contact-name" label="Nombre" required>
                <Input
                  id="contact-name"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </Field>

              <Field id="contact-phone" label="Celular">
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="300 000 0000"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: formatPhone(event.target.value) })}
                />
              </Field>
            </div>

            <Field id="contact-email" label="Correo electrónico" required>
              <Input
                id="contact-email"
                type="email"
                required
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </Field>

            <Field id="contact-subject" label="Motivo">
              <Select
                id="contact-subject"
                value={form.subject}
                onChange={(event) => setForm({ ...form, subject: event.target.value })}
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </Select>
            </Field>

            <Field id="contact-message" label="Mensaje" required>
              <Textarea
                id="contact-message"
                required
                rows={5}
                placeholder="Cuéntanos qué necesitas, para qué fecha y en qué ciudad."
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
              />
            </Field>

            <Button type="submit" size="lg" fullWidth>
              Enviar mensaje
            </Button>
            <p className="text-center text-xs text-ink-muted">
              Formulario de demostración: el mensaje no se envía a ningún servidor.
            </p>
          </form>
        </div>
      </Container>

      <FaqSection className="border-t border-line bg-cream/40 py-16 lg:py-24" />
    </>
  );
}
