import { Lead } from './types';

const now = Date.now();

export const initialLeads: Lead[] = [
  {
    id: 'c1', name: 'Beatriz', phone: '(11) 98765-4321', email: 'marina.silva@email.com',
    cpf: '123.456.789-00', birthDate: '15/03/1988',
    property: 'Apartamento', propertyAddress: 'Rua Fictícia, 123 - Pinheiros', propertyRef: 'REF-1029',
    propertyValue: 850000, broker: 'Marcos Corretor',
    department: 'concierge', tag: 'Proposta Site', timeInQueue: '2h', kanbanStage: 'Novo Lead',
    triggerReason: 'Lead fez proposta direta no site e corretor não atendeu', notes: 'Ligar urgente.',
    operator: 'Ana (Concierge)', origin: 'Site', temperature: 'Quente', score: 50,
    lastInteraction: now - 1000 * 60 * 5,
    budget: 850000, downPayment: 200000, preApproved: 'Sim', bank: 'Banco Itaú', urgency: 'Imediata (0-30 dias)',
    propertyType: 'Apartamento', bedrooms: 3, bathrooms: '2+', parkingSpaces: 2, minArea: '80m²',
    location: 'Zona Sul', neighborhoods: 'Moema, Vila Olímpia', amenities: 'Academia, Piscina',
    bant: { minPrice: 0, maxPrice: 0, financing: '', decisionMaker: '', buyReason: '' },
    leadNotes: [],
    unread: true,
    messages: [
      { id: 'm1', sender: 'lead', text: 'Olá, tenho interesse no apto de Pinheiros. Aceitam proposta?', time: '10:00', timestamp: now - 1000 * 60 * 10 },
      { id: 'm2', sender: 'user', text: 'Olá Beatriz! Sou a Ana da Newcore. Recebemos sua proposta. O corretor Marcos já vai falar com você.', time: '10:05', timestamp: now - 1000 * 60 * 5 }
    ]
  },
  {
    id: 'c2', name: 'Maria Oliveira', phone: '(11) 91234-5678', email: 'maria@email.com',
    property: 'Casa Térrea', propertyAddress: 'Rua das Flores, 45 - Mooca', propertyRef: 'REF-2044',
    propertyValue: 1200000, broker: 'Fernanda Imóveis',
    department: 'concierge', tag: 'Sem Movimentação', timeInQueue: '5d', kanbanStage: 'Visita Agendada',
    triggerReason: 'Lead parado há 5 dias na etapa de visita', notes: 'Verificar se a visita ocorreu.',
    operator: 'Ana (Concierge)', origin: 'Portal', temperature: 'Morno', score: 30,
    lastInteraction: now - 1000 * 60 * 60 * 24 * 5,
    leadNotes: [],
    unread: false,
    messages: [
      { id: 'm1', sender: 'user', text: 'Oi Maria, tudo bem? A visita com a Fernanda aconteceu?', time: '09:00', timestamp: now - 1000 * 60 * 60 * 24 * 5 }
    ]
  },
  {
    id: 'co1', name: 'Lucas Lima', phone: '(11) 95555-4444', email: 'lucas@email.com',
    property: 'Apto 3 dorms', propertyAddress: 'Av. Celso Garcia, 1000 - Tatuapé', propertyRef: 'REF-3011',
    propertyValue: 750000, broker: 'João Vendas',
    department: 'comercial', tag: 'Proposta', timeInQueue: '1d', kanbanStage: 'Proposta Enviada',
    triggerReason: 'Proposta enviada ao proprietário', notes: 'Aguardando aceite.',
    operator: 'Beto (Comercial)', origin: 'Indicação', temperature: 'Quente', score: 80,
    lastInteraction: now - 1000 * 60 * 60 * 24,
    leadNotes: [],
    unread: true,
    messages: [
      { id: 'm1', sender: 'user', text: 'Lucas, enviamos sua proposta de 700k para o proprietário.', time: 'Ontem', timestamp: now - 1000 * 60 * 60 * 25 },
      { id: 'm2', sender: 'lead', text: 'Perfeito, fico no aguardo.', time: 'Ontem', timestamp: now - 1000 * 60 * 60 * 24 }
    ]
  },
  {
    id: 'f1', name: 'Empresa XYZ', phone: '(11) 91111-0000', email: 'contato@xyz.com',
    property: 'Galpão', propertyAddress: 'Rodovia Dutra, km 200 - Guarulhos', propertyRef: 'REF-9099',
    propertyValue: 5000000, broker: 'Roberto Vendas',
    department: 'financeiro', tag: 'Pendente Emissão Boleto', timeInQueue: '4h', kanbanStage: 'Faturamento',
    triggerReason: 'Contrato assinado, emitir comissão', notes: 'Emitir NF e boleto.',
    operator: 'Carla (Financeiro)', origin: 'Site', temperature: 'Quente', score: 100,
    lastInteraction: now - 1000 * 60 * 60 * 4,
    leadNotes: [],
    messages: [
      { id: 'm1', sender: 'user', text: 'Olá, precisamos dos dados de faturamento da empresa.', time: '11:00', timestamp: now - 1000 * 60 * 60 * 4 }
    ]
  }
];
