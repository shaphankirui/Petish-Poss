import { DatabaseItemInterface } from "./database-item.interface";

export interface OrganizationInterface extends DatabaseItemInterface {
  organizationId: string,
  orgCode: string,
  shortName: string,
  fullName: string,
  phoneNumber: string,
  email: string,
  description: string,
  imageURL: string,
  daysLeft: number,
  status: string,
}
