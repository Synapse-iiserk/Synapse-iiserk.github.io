/**
 * The site is static: there is no endpoint behind its forms. Rather than show
 * a "received" message for data that went nowhere, a form hands its contents
 * to the visitor's own mail client as a pre-filled draft, and the UI says so.
 */
export function mailtoHref(to: string, subject: string, body: string): string {
    const query = `subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return `mailto:${to}?${query}`;
}

export function openDraft(to: string, subject: string, body: string): void {
    window.location.href = mailtoHref(to, subject, body);
}
