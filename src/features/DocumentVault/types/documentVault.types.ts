export interface VaultDocumentType {
  id: number;
  docName: string;
  slug: string;
}

export interface VaultDocument {
  id: number;
  userType: string;
  userId: number;
  documentTypeId: number;
  documentUrl: string;
  status: number;
  isDeleted: number;
  originalFilename: string | null;
  mimeType: string | null;
  fileSize: number | null;
  createdAt: string;
  updatedAt: string;
  documentType?: VaultDocumentType;
}

export interface VaultDocumentShare {
  id: number;
  ownerUserType: string;
  ownerUserId: number;
  targetUserType: string;
  targetUserId: number;
  userDocumentId: number;
  permission: string;
  status: number;
  isDeleted: number;
  createdAt: string;
  updatedAt: string;
  ownerName?: string | null;
  targetName?: string | null;
  userDocument?: VaultDocument;
}

export interface VaultDocumentSharesResult {
  sent: VaultDocumentShare[];
  received: VaultDocumentShare[];
}

export interface VaultShareTargetUser {
  userType: 'user';
  id: number;
  name: string | null;
  mobile: string | null;
}

export interface VaultShareTargetConsultant {
  userType: 'consultant';
  id: number;
  name: string | null;
  industryNames: string[];
}

export type VaultShareTarget = VaultShareTargetUser | VaultShareTargetConsultant;

export interface VaultDocumentGroup {
  typeName: string;
  documents: VaultDocument[];
}
