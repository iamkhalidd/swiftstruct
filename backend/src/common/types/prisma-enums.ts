export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

export enum ListingType {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum PropertyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  RENTED = 'RENTED',
  ARCHIVED = 'ARCHIVED',
}

export enum ProjectStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum EnquiryType {
  PROPERTY = 'PROPERTY',
  PROJECT_BRIEF = 'PROJECT_BRIEF',
  CONSULTANCY = 'CONSULTANCY',
  GENERAL = 'GENERAL',
}

export enum EnquiryStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}
