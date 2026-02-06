export const isAdvisorEmail = (email: string | null | undefined): boolean => {
    if (!email) return false;
    const lowerEmail = email.toLowerCase();

    // Check if it matches any advisor domain
    const isDomainMatch = ['@kredyt.pl', '@admin.pl', '@blachlinski.pl'].some(d => lowerEmail.endsWith(d));
    if (!isDomainMatch) return false;

    // Special check for auto-generated phone emails (e.g. 500123456@kredyt.pl or 500123456_1738... @kredyt.pl)
    // If the part before @ starts with numbers or contains an underscore (dummy format), it's a CLIENT.
    const localPart = lowerEmail.split('@')[0];
    if (/^\d+/.test(localPart) || localPart.includes('_')) {
        return false;
    }

    return true;
};

export const normalizePhone = (phone: string | null | undefined): string => {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
};
