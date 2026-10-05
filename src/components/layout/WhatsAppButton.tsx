"use client";

import { whatsappUrl } from "@/lib/site";
import { useI18n } from "@/lib/i18n/client";

export function WhatsAppButton({ message }: { message?: string }) {
  const { t } = useI18n();
  const text = message ? message : t.whatsapp.general;

  return (
    <a
      href={whatsappUrl(text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="group fixed bottom-5 z-50 flex items-center gap-2 rounded-full bg-[#128C7E] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_-18px_rgba(18,140,126,0.9)] transition-all duration-300 hover:bg-[#0f7a6d] hover:shadow-[0_22px_48px_-18px_rgba(18,140,126,0.95)] ltr:right-5 rtl:left-5"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.88-.15-.3-.02-.46.13-.61.15-.15.32-.37.47-.56.15-.19.2-.32.3-.52.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.19-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46 0 1.45 1.06 2.85 1.2 3.05.15.2 2.05 3.2 5.02 4.36 2.47.97 2.97.78 3.51.73.54-.05 1.74-.71 1.99-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35zM12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.42 1.32 4.9L2 22l5.4-1.42a9.83 9.83 0 004.64 1.18h.01c5.43 0 9.84-4.4 9.84-9.84C21.89 6.4 17.47 2 12.04 2zm0 17.96h-.01a8.2 8.2 0 01-4.16-1.14l-.3-.18-3.08.81.82-3-.19-.31a8.14 8.14 0 01-1.25-4.3c0-4.5 3.67-8.16 8.18-8.16 2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 012.39 5.78c0 4.5-3.67 8.16-8.17 8.16z" />
      </svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
