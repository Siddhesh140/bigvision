/**
 * Validation utilities for form inputs
 */

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone) => {
    // Accepts various phone formats: +91 1234567890, 1234567890, etc.
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
};

export const validateName = (name) => {
    return name && name.trim().length >= 2;
};

export const validateCompany = (company) => {
    return company && company.trim().length >= 2;
};

export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    // Remove potential XSS vectors
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .substring(0, 200); // Limit length
};

export const getValidationErrors = (formData) => {
    const errors = {};

    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const company = formData.get('company');

    if (!validateName(name)) {
        errors.name = 'Name must be at least 2 characters';
    }

    if (!validateEmail(email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!validatePhone(phone)) {
        errors.phone = 'Please enter a valid phone number';
    }

    if (!validateCompany(company)) {
        errors.company = 'Company name must be at least 2 characters';
    }

    return errors;
};
