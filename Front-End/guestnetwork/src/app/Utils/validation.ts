import { Group, User } from "../Types";

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateMacAddress = (mac: string) =>
  /^[0-9a-f]{12}$/i.test(mac.replace(/[^a-fA-F0-9]/g, ''));

export const validateUser = (user: User) => {
  if (!user.macAddress || typeof user.macAddress !== 'string') {
    throw new Error('MAC address is required and must be a string');
  }

  if (!validateMacAddress(user.macAddress)) {
    throw new Error('Invalid MAC address format');
  }

  if (user.uid !== undefined && user.uid !== null) {
    if (typeof user.uid !== 'string' || user.uid.trim() === '') {
      throw new Error('UID must be a non-empty string if provided');
    }
  }

  if (user.email !== undefined && user.email !== null) {
    if (typeof user.email !== 'string' || !validateEmail(user.email)) {
      throw new Error('Invalid email format');
    }
  }

  if (user.expiredAt !== undefined && user.expiredAt !== null) {
    const date = new Date(user.expiredAt);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid expiration date');
    }
    if (date < new Date()) {
      throw new Error('Expiration date cannot be in the past')
    }
  }

  if (user.active !== undefined && typeof user.active !== 'number') {
    throw new Error('Active must be a number if provided');
  }

  if (user.groupName !== undefined && user.groupName !== null) {
    if (typeof user.groupName !== 'string' || user.groupName.trim() === '') {
      throw new Error('Group name must be a non-empty string if provided');
    }
  }

  if (user.vlan !== undefined && user.vlan !== null) {
    if (typeof user.vlan !== 'number' || user.vlan < 1 || user.vlan > 4094) {
      throw new Error('VLAN must be a number between 1 and 4094');
    }
  }
};

export const validateGroup = (group: Group) => {
  if (typeof group.groupName !== 'string' || group.groupName.trim() === '') {
    throw new Error('Group name must be a non-empty string if provided');
  }

  if (group.vlan !== undefined && group.vlan !== null) {
    if (typeof group.vlan !== 'number' || group.vlan < 1 || group.vlan > 4094) {
      throw new Error('VLAN must be a number between 1 and 4094');
    }
  }
}
