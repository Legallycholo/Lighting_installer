/** Normalize a US phone number without preserving formatting in CRM payloads. */
export function normalizePhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  const national =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  return national.length === 10 && /^[2-9]\d{2}[2-9]\d{6}$/.test(national)
    ? `+1${national}`
    : null;
}
