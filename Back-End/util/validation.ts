import { User } from "../domain/model/User";

export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateMacAddress = (mac: string) =>
  /^[0-9a-f]{12}$/i.test(mac.replace(/[^a-fA-F0-9]/g, ''));

export const validateUser = (user: User): {
  macAddress?: string;
  email?: string;
  uid?: string;
  expiredAt?: string;
  groupName?: string;
} => {
  const errors: {
    macAddress?: string;
    email?: string;
    uid?: string;
    expiredAt?: string;
    groupName?: string;
  } = {};

  if (!user.macAddress || typeof user.macAddress !== 'string') {
    errors.macAddress = 'MAC address is required and must be a string';
  } else if (!validateMacAddress(user.macAddress)) {
    errors.macAddress = 'Invalid MAC address format';
  }

  if (user.uid !== undefined && user.uid !== null) {
    if (typeof user.uid !== 'string' || user.uid.trim() === '') {
      errors.uid = 'UID must be a non-empty string if provided';
    }
  }

  if (user.email !== undefined && user.email !== null) {
    if (typeof user.email !== 'string' || !validateEmail(user.email)) {
      errors.email = 'Invalid email format';
    }
  }

  if (user.expiredAt !== undefined && user.expiredAt !== null) {
    const date = new Date(user.expiredAt);
    if (isNaN(date.getTime())) {
      errors.expiredAt = 'Invalid expiration date';
    } else if (date < new Date()) {
      errors.expiredAt = 'Expiration date cannot be in the past';
    }
  }

  if (user.groupName !== undefined && user.groupName !== null) {
    if (typeof user.groupName !== 'string' || user.groupName.trim() === '') {
      errors.groupName = 'Group name must be a non-empty string if provided';
    }
  }

  return errors;
};

export const validateGroup = (group: { groupName: string }) => {
  if (typeof group.groupName !== 'string' || group.groupName.trim() === '') {
    throw new Error('Group name must be a non-empty string if provided');
  }
};
