export interface PartyDetails {
  name: string;
  address: string;
  gstin: string;
  stateName: string;
  stateCode: string;
}

export interface SellerDetails extends PartyDetails {
  email: string;
}

export interface ShippingDetails {
  buyersOrderNo: string;
  orderDated: string;
  dispatchDocNo: string;
  deliveryNoteDate: string;
  dispatchedThrough: string;
  destination: string;
  termsOfDelivery: string;
}

export interface InvoiceMetadata {
  invoiceNumber: string;
  date: string;
  deliveryNote: string;
  paymentMode: string;
  referenceNo: string;
  otherReferences: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsnSac: string;
  quantity: string;
  rate: number;
  per: string;
  amount: number;
}

export interface TaxConfig {
  cgstPercent: number;
  sgstPercent: number;
  igstPercent: number;
}

export interface InvoiceData {
  seller: SellerDetails;
  consignee: PartyDetails;
  buyer: PartyDetails;
  invoice: InvoiceMetadata;
  shipping: ShippingDetails;
  items: InvoiceItem[];
  tax: TaxConfig;
}
