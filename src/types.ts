export type Department = 'concierge' | 'comercial' | 'financeiro';
export type Role = 'operador' | 'lideranca';

export interface Message {
  id: string;
  sender: 'user' | 'lead';
  text: string;
  time: string;
  timestamp: number;
  type?: 'text' | 'audio' | 'file';
}

export interface Note {
  id: string;
  text: string;
  date: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf?: string;
  birthDate?: string;
  property: string;
  propertyAddress?: string;
  propertyRef?: string;
  propertyValue: number;
  broker: string;
  department: Department;
  tag: string;
  timeInQueue: string;
  kanbanStage: string;
  triggerReason: string;
  notes: string;
  operator: string;
  messages: Message[];
  origin?: string;
  temperature?: 'Quente' | 'Morno' | 'Frio';
  score?: number;
  lastInteraction: number;
  
  // Resumo / BANT data
  budget?: number;
  downPayment?: number;
  preApproved?: string;
  bank?: string;
  urgency?: string;
  propertyType?: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  parkingSpaces?: number | string;
  minArea?: string;
  location?: string;
  neighborhoods?: string;
  amenities?: string;
  
  bant?: {
    minPrice?: number;
    maxPrice?: number;
    financing?: string;
    decisionMaker?: string;
    buyReason?: string;
  };

  leadNotes?: Note[];
  unread?: boolean;
  archived?: boolean;
  archivedReason?: string;
  scheduledDate?: string;
}
