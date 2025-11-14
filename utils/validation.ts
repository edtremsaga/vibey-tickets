/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate event name
 */
export const validateEventName = (eventName: string): string | null => {
  if (!eventName || eventName.trim().length === 0) {
    return 'Event name is required';
  }
  if (eventName.trim().length < 3) {
    return 'Event name must be at least 3 characters';
  }
  if (eventName.length > 200) {
    return 'Event name must be less than 200 characters';
  }
  return null;
};

/**
 * Validate venue name
 */
export const validateVenueName = (venueName: string): string | null => {
  if (!venueName || venueName.trim().length === 0) {
    return 'Venue name is required';
  }
  if (venueName.trim().length < 2) {
    return 'Venue name must be at least 2 characters';
  }
  return null;
};

/**
 * Validate venue location
 */
export const validateVenueLocation = (venueLocation: string): string | null => {
  if (!venueLocation || venueLocation.trim().length === 0) {
    return 'Venue location is required';
  }
  if (venueLocation.trim().length < 2) {
    return 'Venue location must be at least 2 characters';
  }
  return null;
};

/**
 * Validate date - must be in the future
 */
export const validateDate = (date: string): string | null => {
  if (!date) {
    return 'Date is required';
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(selectedDate.getTime())) {
    return 'Invalid date format';
  }
  
  if (selectedDate < today) {
    return 'Date must be in the future';
  }
  
  // Check if date is too far in the future (e.g., more than 5 years)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 5);
  if (selectedDate > maxDate) {
    return 'Date must be within the next 5 years';
  }
  
  return null;
};

/**
 * Validate target price
 */
export const validateTargetPrice = (targetPrice: string): string | null => {
  if (!targetPrice || targetPrice.trim().length === 0) {
    return 'Target price is required';
  }
  const price = parseFloat(targetPrice);
  if (isNaN(price)) {
    return 'Target price must be a valid number';
  }
  if (price <= 0) {
    return 'Target price must be greater than 0';
  }
  if (price > 100000) {
    return 'Target price seems unreasonably high. Please enter a value less than $100,000';
  }
  return null;
};

/**
 * Validate number of tickets
 */
export const validateNumTickets = (numTickets: string): string | null => {
  if (!numTickets || numTickets.trim().length === 0) {
    return 'Number of tickets is required';
  }
  const num = parseInt(numTickets, 10);
  if (isNaN(num)) {
    return 'Number of tickets must be a valid number';
  }
  if (num < 1) {
    return 'Number of tickets must be at least 1';
  }
  if (num > 50) {
    return 'Number of tickets cannot exceed 50';
  }
  return null;
};

/**
 * Validate all watch form fields
 */
export const validateWatchForm = (formData: {
  eventName: string;
  venueName: string;
  venueLocation: string;
  date: string;
  targetPrice: string;
  numTickets: string;
}): ValidationResult => {
  const errors: string[] = [];
  
  const eventNameError = validateEventName(formData.eventName);
  if (eventNameError) errors.push(eventNameError);
  
  const venueNameError = validateVenueName(formData.venueName);
  if (venueNameError) errors.push(venueNameError);
  
  const venueLocationError = validateVenueLocation(formData.venueLocation);
  if (venueLocationError) errors.push(venueLocationError);
  
  const dateError = validateDate(formData.date);
  if (dateError) errors.push(dateError);
  
  const targetPriceError = validateTargetPrice(formData.targetPrice);
  if (targetPriceError) errors.push(targetPriceError);
  
  const numTicketsError = validateNumTickets(formData.numTickets);
  if (numTicketsError) errors.push(numTicketsError);
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

