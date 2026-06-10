import { ProfileRepository } from "./profile.repository";
import { BadRequestError, NotFoundError } from "../../errors/AppError";

export class ProfileService {
  private profileRepo: ProfileRepository;

  constructor() {
    this.profileRepo = new ProfileRepository();
  }

  async getProfile(userId: number) {
    let profile = await this.profileRepo.getProfileByUserId(userId);
    if (!profile) {
      profile = await this.profileRepo.createProfile(userId, {});
    }
    const addresses = await this.profileRepo.getAddresses(userId);
    const defaultAddress = await this.profileRepo.getDefaultAddress(userId);
    return { profile, addresses, defaultAddress };
  }

  async updateProfile(userId: number, data: { phone?: string; dateOfBirth?: Date; gender?: string; profilePic?: string }) {
    if (data.phone && data.phone.length < 10) {
      throw new BadRequestError("Invalid phone number");
    }
    return this.profileRepo.updateProfile(userId, data);
  }

  async getAddresses(userId: number) {
    return this.profileRepo.getAddresses(userId);
  }

  async createAddress(userId: number, data: {
    label?: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }) {
    if (!data.fullName || !data.phone || !data.addressLine1 || !data.city || !data.state || !data.postalCode || !data.country) {
      throw new BadRequestError("All required fields must be filled");
    }
    return this.profileRepo.createAddress(userId, data);
  }

  async updateAddress(userId: number, addressId: number, data: Partial<{
    label: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }>) {
    const addresses = await this.profileRepo.getAddresses(userId);
    const addr = addresses.find(a => a.id === addressId);
    if (!addr) {
      throw new NotFoundError("Address not found");
    }
    return this.profileRepo.updateAddress(addressId, userId, data);
  }

  async deleteAddress(userId: number, addressId: number) {
    const addresses = await this.profileRepo.getAddresses(userId);
    const addr = addresses.find(a => a.id === addressId);
    if (!addr) {
      throw new NotFoundError("Address not found");
    }
    return this.profileRepo.deleteAddress(addressId, userId);
  }

  async setDefaultAddress(userId: number, addressId: number) {
    return this.profileRepo.setDefaultAddress(addressId, userId);
  }
}
