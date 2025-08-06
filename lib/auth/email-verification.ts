
/**
 * Validates if an email matches the given domain
 * 
 * @param email The email address to validate
 * @param domain The domain to check against (e.g., "da-tech.ma")
 * @returns boolean indicating if the email matches the domain
 */
export function isEmailFromDomain(email: string, domain: string): boolean {
  if (!email) return false;
  
  try {
    // Get the part after @ symbol
    const emailDomain = email.split('@')[1].toLowerCase();
    return emailDomain === domain.toLowerCase();
  } catch (error) {
    return false;
  }
}

/**
 * Gets the domain part from an email address
 * 
 * @param email The email address
 * @returns The domain part or null if invalid
 */
export function getEmailDomain(email: string): string | null {
  if (!email || !email.includes('@')) return null;
  
  try {
    return email.split('@')[1].toLowerCase();
  } catch (error) {
    return null;
  }
}

/**
 * Checks if an email is from a trusted organization domain
 * 
 * @param email The email to check
 * @param trustedDomains Array of trusted domains
 * @returns boolean indicating if the email is from a trusted domain
 */
export function isFromTrustedDomain(email: string, trustedDomains: string[] = ['da-tech.ma']): boolean {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  
  return trustedDomains.some(trustedDomain => 
    domain === trustedDomain.toLowerCase()
  );
}

/**
 * Extracts company name from the email domain
 * Useful for identifying the organization from the email
 * 
 * @param email The email address
 * @returns The company name based on the domain
 */
export function getCompanyFromEmail(email: string): string | null {
  const domain = getEmailDomain(email);
  if (!domain) return null;
  
  // Split the domain by dots and take the parts before the TLD
  const parts = domain.split('.');
  if (parts.length < 2) return null;
  
  // For domains like "company.com" or "company.co.uk"
  // We want to return "company"
  return parts[0];
}
