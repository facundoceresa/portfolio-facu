const fallbackEmail = "hola@ceresa.dev";
const fallbackGithub = "https://github.com/facundoceresa";

export type PublicContact = {
  email: string;
  mailHref: string;
  githubHref: string;
  linkedinHref: string | null;
  location: string;
};

export function getPublicContact(settings: Record<string, string>): PublicContact {
  const configuredEmail = settings.public_email?.trim();
  const email = configuredEmail && !configuredEmail.endsWith(".local") ? configuredEmail : fallbackEmail;
  return {
    email,
    mailHref: `mailto:${email}`,
    githubHref: normalizePublicUrl(settings.github_url) ?? fallbackGithub,
    linkedinHref: normalizePublicUrl(settings.linkedin_url),
    location: settings.location?.trim() || "Montevideo · Uruguay",
  };
}

function normalizePublicUrl(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "#") {
    return null;
  }
  return trimmed.startsWith("https://") ? trimmed : null;
}
