import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Users, Briefcase, DollarSign, MessageCircle, Send, ArrowLeft,
  CheckCircle, Clock, AlertCircle, User, Phone, Mail, Home, FileText, Tag,
  ChevronRight, Building, Shield, Search, Filter, MapPin, Hash, Globe, ArrowDownUp,
  Paperclip, Mic, Archive, Calendar, RefreshCw, BarChart2, MessageSquare, X, Flame, Plus,
  Menu, Download, LayoutGrid, List, ChevronDown, Star, Info, Snowflake, ExternalLink, Zap
} from 'lucide-react';
import { Department, Role, Message, Lead } from './types';
import { initialLeads } from './mockData';

// --- Helpers ---
const getTagColor = (tag: string) => {
  if (tag.includes('Redistribuído')) return 'bg-orange-100 text-orange-800 border-orange-200';
  if (tag.includes('Parado a')) return 'bg-red-100 text-red-800 border-red-200';
  if (tag.includes('quente')) return 'bg-red-100 text-red-800 border-red-200';
  if (tag.includes('frio')) return 'bg-blue-100 text-blue-800 border-blue-200';
  
  switch (tag) {
    case 'Problema jurídico': return 'bg-gray-200 text-gray-800 border-gray-300';
    case 'Experiência negativa': return 'bg-red-100 text-red-800 border-red-200';
    case 'Proposta Site': return 'bg-red-100 text-red-800 border-red-200';
    case 'Sem Movimentação': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Lead Removido': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Auditoria': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Cobrança': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Proposta': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Aguardando Contrato': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Contrato Assinado': return 'bg-green-100 text-green-800 border-green-200';
    case 'Pendente Emissão Boleto': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Boleto Emitido': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Boleto Vencido': return 'bg-red-100 text-red-800 border-red-200';
    case 'Jurídico': return 'bg-gray-200 text-gray-800 border-gray-300';
    case 'Cobrança Jurídica': return 'bg-red-900 text-white border-red-950';
    case 'Aguardando Protesto': return 'bg-black text-white border-gray-800';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const exactKanbanData = {
  totalLeads: 81528,
  totalValue: "103.020.398,00",
  columns: [
    {
      id: 'em-qualificacao',
      title: 'Em qualificação',
      count: 3670,
      value: '23.111.010,00',
      color: 'bg-blue-500',
      cards: [
        { id: 'n1', name: 'Emerson', value: '419.000,00', location: 'Heliópolis', broker: 'Alessandra Rodrigues', time: '0min', points: '0 pts', temp: 'Quente', diasParado: 2, redistribuicoes: 1, origem: 'Imovelweb', imoveisInteresse: ['COD123 - Rua das Flores, 100'], hasDocs: true, hasNotes: true, lastInteraction: 'Hoje, 10:30', creationDate: '20/03/2026', tags: ['Lead quente (BANT)'] },
        { id: 'n2', name: 'Milsa de Oliveira Gonzaga', value: '350.000,00', location: 'São João Batista', broker: 'Alessandra Rodrigues', time: '0min', points: '0 pts', temp: 'Quente', diasParado: 0, redistribuicoes: 0, origem: 'Zap Imóveis', imoveisInteresse: ['COD456 - Av. Paulista, 1000'], hasDocs: false, hasNotes: true, lastInteraction: 'Hoje, 09:15', creationDate: '25/03/2026', tags: [] },
      ]
    },
    {
      id: 'em-atendimento',
      title: 'Em atendimento',
      count: 71204,
      value: '24.193.799,00',
      color: 'bg-indigo-500',
      cards: [
        { id: 'q1', name: 'Vinicius Faria', value: '350.000,00', location: 'Vila Cardia', broker: 'Rafael Gomes', time: '0min', points: '0 pts', temp: 'Quente', diasParado: 5, redistribuicoes: 2, origem: 'Site Próprio', imoveisInteresse: ['COD789 - Rua Augusta, 500'], hasDocs: true, hasNotes: true, lastInteraction: 'Ontem, 14:20', creationDate: '15/03/2026', tags: ['Parado a 5 dias', 'Redistribuído 2x'] },
        { id: 'q2', name: 'Matheus R. Salomao', value: '420.000,00', location: 'Res. Parque Santa Rosa II', broker: 'Rodrigo Patricio', time: '1min', points: '0 pts', temp: 'Quente', diasParado: 1, redistribuicoes: 0, origem: 'Indicação', imoveisInteresse: ['COD101 - Rua Bela Cintra, 200'], hasDocs: false, hasNotes: false, lastInteraction: 'Hoje, 11:00', creationDate: '22/03/2026', tags: ['Lead quente (BANT)'] },
      ]
    },
    {
      id: 'em-visita',
      title: 'Em visita',
      count: 4190,
      value: '24.148.900,00',
      color: 'bg-orange-500',
      cards: [
        { id: 'v1', name: 'Elaine', value: '219.000,00', location: 'Não especificado', broker: 'Alessandra Rodrigues', time: '4min', points: '0 pts', temp: 'Quente', status: 'Agendada', diasParado: 0, redistribuicoes: 0, origem: 'Imovelweb', imoveisInteresse: ['COD202 - Alameda Santos, 150'], hasDocs: true, hasNotes: true, lastInteraction: 'Hoje, 08:00', creationDate: '10/03/2026', tags: [] },
      ]
    },
    {
      id: 'em-proposta',
      title: 'Em proposta',
      count: 40,
      value: '17.061.800,00',
      color: 'bg-purple-500',
      cards: [
        { id: 'p1', name: 'Marcelo Jesus', value: '270.000,00', location: 'Veloso', broker: 'Walter Santos', time: '21h', points: '0 pts', temp: 'Quente', status: 'Enviada', diasParado: 1, redistribuicoes: 0, origem: 'Zap Imóveis', imoveisInteresse: ['COD303 - Rua Oscar Freire, 800'], hasDocs: true, hasNotes: true, lastInteraction: 'Ontem, 16:45', creationDate: '01/03/2026', tags: ['Lead quente (BANT)'] },
      ]
    },
    {
      id: 'contrato-assinado',
      title: 'Contrato assinado',
      count: 2424,
      value: '14.504.889,00',
      color: 'bg-teal-500',
      cards: [
        { id: 'c1', name: 'Rony', value: '550.000,00', location: 'Guarau', broker: 'Marcos Germano', time: '7min', points: '0 pts', temp: 'Quente', status: 'Contrato em andamento', diasParado: 0, redistribuicoes: 0, origem: 'Site Próprio', imoveisInteresse: ['COD404 - Av. Brigadeiro Faria Lima, 3000'], hasDocs: true, hasNotes: true, lastInteraction: 'Hoje, 12:30', creationDate: '15/02/2026', tags: [] },
      ]
    },
    {
      id: 'comissao-recebida',
      title: 'Comissão recebida',
      count: 150,
      value: '1.500.000,00',
      color: 'bg-green-500',
      cards: [
        { id: 'cr1', name: 'Carlos Silva', value: '300.000,00', location: 'Centro', broker: 'Ana Oliveira', time: '1d', points: '0 pts', temp: 'Quente', status: 'Pago', diasParado: 0, redistribuicoes: 0, origem: 'Indicação', imoveisInteresse: ['COD505 - Praça da Sé, 10'], hasDocs: true, hasNotes: true, lastInteraction: 'Ontem, 09:00', creationDate: '10/01/2026', tags: [] },
      ]
    },
    {
      id: 'venda-perdida',
      title: 'Venda perdida',
      count: 300,
      value: '0,00',
      color: 'bg-red-500',
      cards: [
        { id: 'vp1', name: 'João Paulo', value: '450.000,00', location: 'Zona Sul', broker: 'Roberto Santos', time: '2d', points: '0 pts', temp: 'Frio', status: 'Perdida', diasParado: 10, redistribuicoes: 1, origem: 'Imovelweb', imoveisInteresse: ['COD606 - Av. Ibirapuera, 2000'], hasDocs: false, hasNotes: true, lastInteraction: 'Há 10 dias', creationDate: '05/02/2026', tags: ['Problema jurídico', 'Parado a 10 dias'] },
      ]
    },
    {
      id: 'leads-perdidos',
      title: 'Leads perdidos',
      count: 1200,
      value: '0,00',
      color: 'bg-gray-500',
      cards: [
        { id: 'lp1', name: 'Maria Fernanda', value: '250.000,00', location: 'Zona Norte', broker: 'Mariana Costa', time: '5d', points: '0 pts', temp: 'Frio', status: 'Perdido', diasParado: 30, redistribuicoes: 3, origem: 'Zap Imóveis', imoveisInteresse: ['COD707 - Av. Braz Leme, 1000'], hasDocs: false, hasNotes: true, lastInteraction: 'Há 30 dias', creationDate: '20/01/2026', tags: ['Experiência negativa', 'Redistribuído 3x'] },
      ]
    }
  ]
};

// Mock Data for Charts
const leadsPorEtapaData = exactKanbanData.columns.map(col => ({
  name: col.title,
  leads: col.count
}));

const conversaoEtapaData = [
  { name: 'Em qualificação', conversao: 100 },
  { name: 'Em atendimento', conversao: 45 },
  { name: 'Em visita', conversao: 20 },
  { name: 'Em proposta', conversao: 8 },
  { name: 'Contrato assinado', conversao: 3 },
  { name: 'Comissão recebida', conversao: 2.5 },
];

const origemLeadsData = [
  { name: 'Imovelweb', value: 45, color: '#3b82f6' },
  { name: 'Zap Imóveis', value: 30, color: '#60a5fa' },
  { name: 'Site Próprio', value: 15, color: '#93c5fd' },
  { name: 'Indicação', value: 10, color: '#bfdbfe' },
];

const leadsPorDistritoData = [
  { name: 'Centro', leads: 1250 },
  { name: 'Zona Sul', leads: 980 },
  { name: 'Zona Norte', leads: 850 },
  { name: 'Zona Leste', leads: 620 },
  { name: 'Zona Oeste', leads: 450 },
];

const tempoPorEtapaData = [
  { name: 'Em qualificação', dias: 1.5 },
  { name: 'Em atendimento', dias: 3.2 },
  { name: 'Em visita', dias: 5.8 },
  { name: 'Em proposta', dias: 12.4 },
  { name: 'Contrato assinado', dias: 25.1 },
];

const leadsNovosPorMesData = [
  { name: 'Jan', leads: 400 },
  { name: 'Fev', leads: 300 },
  { name: 'Mar', leads: 550 },
  { name: 'Abr', leads: 480 },
  { name: 'Mai', leads: 600 },
  { name: 'Jun', leads: 750 },
];

const leadsPorQualificacaoData = [
  { name: 'Quente', value: 45, color: '#ef4444' },
  { name: 'Morno', value: 35, color: '#f59e0b' },
  { name: 'Frio', value: 20, color: '#3b82f6' },
];

const mensagensPorDiaData = [
  { name: 'Seg', disparadas: 1200, respondidas: 850 },
  { name: 'Ter', disparadas: 1350, respondidas: 920 },
  { name: 'Qua', disparadas: 1100, respondidas: 780 },
  { name: 'Qui', disparadas: 1400, respondidas: 1050 },
  { name: 'Sex', disparadas: 1600, respondidas: 1200 },
  { name: 'Sáb', disparadas: 800, respondidas: 450 },
  { name: 'Dom', disparadas: 600, respondidas: 300 },
];

const mensagensPorMesData = [
  { name: 'Jan', disparadas: 25000, respondidas: 18000 },
  { name: 'Fev', disparadas: 22000, respondidas: 16500 },
  { name: 'Mar', disparadas: 28000, respondidas: 21000 },
  { name: 'Abr', disparadas: 26000, respondidas: 19500 },
  { name: 'Mai', disparadas: 30000, respondidas: 23000 },
  { name: 'Jun', disparadas: 32000, respondidas: 25000 },
];

const respostasPorTagData = [
  { name: 'Dúvida', respostas: 4500 },
  { name: 'Agendamento', respostas: 3200 },
  { name: 'Proposta', respostas: 1800 },
  { name: 'Reclamação', respostas: 500 },
  { name: 'Outros', respostas: 1200 },
];

// --- Main Component ---
export default function App() {
  const [activeMenu, setActiveMenu] = useState<'fluxo' | 'gestao'>('gestao');
  const [activeView, setActiveView] = useState<'fluxo-dashboard' | 'fluxo-atendimento' | 'fluxo-comercial' | 'fluxo-financeiro' | 'gestao-dashboard' | 'gestao-kanban'>('gestao-kanban');
  const [role, setRole] = useState<Role>('operador');
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [filterUnread, setFilterUnread] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Modal States
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [showReclassifyModal, setShowReclassifyModal] = useState(false);
  const [reclassifyTag, setReclassifyTag] = useState('');
  const [reclassifyStatus, setReclassifyStatus] = useState('');
  const [reclassifyNote, setReclassifyNote] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [showRedistributeModal, setShowRedistributeModal] = useState(false);
  const [redistributeOperator, setRedistributeOperator] = useState('');
  const [leadToRedistribute, setLeadToRedistribute] = useState<string | null>(null);
  const [selectedLeadsForBulk, setSelectedLeadsForBulk] = useState<string[]>([]);
  const [distributionRule, setDistributionRule] = useState('round-robin');
  const [showFullDataModal, setShowFullDataModal] = useState(false);
  const [fullDataActiveTab, setFullDataActiveTab] = useState('resumo');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [selectedOperatorFilter, setSelectedOperatorFilter] = useState<string>('all');
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '', phone: '', email: '', property: '', propertyValue: 0,
    broker: '', operator: 'Ana (Concierge)', tag: 'Novo Lead', kanbanStage: 'Novo Lead', origin: 'Manual'
  });

  const [showQuickActionsModal, setShowQuickActionsModal] = useState(false);
  const [quickActionLeadId, setQuickActionLeadId] = useState<string | null>(null);
  const [quickActionStage, setQuickActionStage] = useState('');
  const [quickActionNote, setQuickActionNote] = useState('');

  const [showAdvancedFiltersModal, setShowAdvancedFiltersModal] = useState(false);

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [tagsLeadId, setTagsLeadId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState('');
  const [selectedExistingTag, setSelectedExistingTag] = useState('');
  const [isCreatingNewTag, setIsCreatingNewTag] = useState(false);
  
  const [showSendToFlowModal, setShowSendToFlowModal] = useState(false);
  const [selectedFlowItem, setSelectedFlowItem] = useState('');

  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Kanban State
  const [kanbanData, setKanbanData] = useState(exactKanbanData);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [draggedOverColumnId, setDraggedOverColumnId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to allow the drag image to be generated before hiding the original
    setTimeout(() => {
      const el = document.getElementById(`card-${cardId}`);
      if (el) el.classList.add('opacity-50');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (draggedCardId) {
      const el = document.getElementById(`card-${draggedCardId}`);
      if (el) el.classList.remove('opacity-50');
    }
    setDraggedCardId(null);
    setDraggedOverColumnId(null);
  };

  const handleAddTag = () => {
    const tagToAdd = isCreatingNewTag ? newTagInput.trim() : selectedExistingTag;
    if (!tagToAdd || !tagsLeadId) return;
    
    setKanbanData(prev => {
      const newColumns = prev.columns.map(col => ({
        ...col,
        cards: col.cards.map(card => {
          if (card.id === tagsLeadId) {
            const currentTags = card.tags || [];
            if (!currentTags.includes(tagToAdd)) {
              return { ...card, tags: [...currentTags, tagToAdd] };
            }
          }
          return card;
        })
      }));
      return { ...prev, columns: newColumns };
    });
    
    if (isCreatingNewTag) {
      setNewTagInput('');
      setIsCreatingNewTag(false);
    }
    setSelectedExistingTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!tagsLeadId) return;
    
    setKanbanData(prev => {
      const newColumns = prev.columns.map(col => ({
        ...col,
        cards: col.cards.map(card => {
          if (card.id === tagsLeadId) {
            return { ...card, tags: (card.tags || []).filter(t => t !== tagToRemove) };
          }
          return card;
        })
      }));
      return { ...prev, columns: newColumns };
    });
  };

  const handleQuickActionSave = () => {
    if (!quickActionLeadId) return;

    setKanbanData(prev => {
      let cardToMove: any = null;
      let sourceColumnId = '';

      // Find the card and its current column
      for (const col of prev.columns) {
        const card = col.cards.find(c => c.id === quickActionLeadId);
        if (card) {
          cardToMove = { ...card };
          sourceColumnId = col.id;
          break;
        }
      }

      if (!cardToMove || sourceColumnId === quickActionStage) {
        // Just add note if stage didn't change
        if (quickActionNote.trim()) {
           return {
             ...prev,
             columns: prev.columns.map(col => ({
               ...col,
               cards: col.cards.map(c => c.id === quickActionLeadId ? { ...c, hasNotes: true } : c)
             }))
           };
        }
        return prev;
      }

      // Move card and add note
      if (quickActionNote.trim()) {
        cardToMove.hasNotes = true;
      }

      const newColumns = prev.columns.map(col => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            count: col.count - 1,
            cards: col.cards.filter(c => c.id !== quickActionLeadId)
          };
        }
        if (col.id === quickActionStage) {
          return {
            ...col,
            count: col.count + 1,
            cards: [cardToMove, ...col.cards]
          };
        }
        return col;
      });

      return { ...prev, columns: newColumns };
    });

    setShowQuickActionsModal(false);
    setQuickActionNote('');
    setQuickActionLeadId(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverColumnId !== columnId) {
      setDraggedOverColumnId(columnId);
    }
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedCardId) return;

    let sourceColumnId = '';
    let cardToMove: any = null;

    // Find the source column and the card
    kanbanData.columns.forEach(col => {
      const card = col.cards.find(c => c.id === draggedCardId);
      if (card) {
        sourceColumnId = col.id;
        cardToMove = card;
      }
    });

    if (sourceColumnId && cardToMove && sourceColumnId !== targetColumnId) {
      setKanbanData(prev => {
        const newColumns = prev.columns.map(col => {
          if (col.id === sourceColumnId) {
            return {
              ...col,
              cards: col.cards.filter(c => c.id !== draggedCardId),
              count: col.count - 1
            };
          }
          if (col.id === targetColumnId) {
            return {
              ...col,
              cards: [cardToMove, ...col.cards],
              count: col.count + 1
            };
          }
          return col;
        });
        return { ...prev, columns: newColumns };
      });
    }
    
    setDraggedCardId(null);
    setDraggedOverColumnId(null);
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // Mark as read when selected
    if (selectedLeadId) {
      setLeads(prev => prev.map(l => l.id === selectedLeadId ? { ...l, unread: false } : l));
    }
  }, [selectedLeadId, leads.length]); // Only trigger on lead selection or new messages

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const activeDept = useMemo(() => {
    if (activeView === 'fluxo-atendimento') return 'concierge';
    if (activeView === 'fluxo-comercial') return 'comercial';
    if (activeView === 'fluxo-financeiro') return 'financeiro';
    return 'dashboard';
  }, [activeView]);

  // Derived state
  const currentOperator = useMemo(() => {
    if (activeDept === 'concierge') return 'Ana (Concierge)';
    if (activeDept === 'comercial') return 'Beto (Comercial)';
    return 'Carla (Financeiro)';
  }, [activeDept]);

  // Get unique tags for the current department
  const availableTags = useMemo(() => {
    const deptLeads = leads.filter(l => l.department === activeDept && !l.archived);
    const tags = new Set(deptLeads.map(l => l.tag));
    return Array.from(tags);
  }, [leads, activeDept]);

  const filteredLeads = useMemo(() => {
    let result = leads.filter(lead => {
      if (lead.archived) return false;
      if (lead.department !== activeDept) return false;
      if (role === 'operador' && lead.operator !== currentOperator) return false;
      if (selectedTag !== 'all' && lead.tag !== selectedTag) return false;
      if (selectedOperatorFilter !== 'all' && lead.operator !== selectedOperatorFilter) return false;
      if (filterUnread && !lead.unread) return false;
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          lead.name.toLowerCase().includes(query) ||
          lead.phone.includes(query) ||
          (lead.propertyRef && lead.propertyRef.toLowerCase().includes(query)) ||
          (lead.propertyAddress && lead.propertyAddress.toLowerCase().includes(query))
        );
      }
      
      return true;
    });

    // Sort by lastInteraction
    result.sort((a, b) => {
      if (sortOrder === 'newest') return b.lastInteraction - a.lastInteraction;
      return a.lastInteraction - b.lastInteraction;
    });

    return result;
  }, [leads, activeDept, role, currentOperator, searchQuery, selectedTag, selectedOperatorFilter, filterUnread, sortOrder]);

  const selectedLead = useMemo(() => {
    return leads.find(l => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Actions
  const handleAddLead = () => {
    const lead: Lead = {
      id: Date.now().toString(),
      name: newLead.name || 'Novo Lead',
      phone: newLead.phone || '',
      email: newLead.email || '',
      property: newLead.property || '',
      propertyValue: newLead.propertyValue || 0,
      broker: newLead.broker || 'Não atribuído',
      operator: newLead.operator || 'Não atribuído',
      tag: newLead.tag || 'Novo Lead',
      kanbanStage: newLead.kanbanStage || 'Novo Lead',
      origin: newLead.origin || 'Manual',
      timeInQueue: '0m',
      unread: true,
      archived: false,
      department: activeDept === 'dashboard' ? 'concierge' : activeDept,
      lastInteraction: Date.now(),
      messages: [],
      triggerReason: 'Adicionado Manualmente',
      notes: ''
    };
    setLeads([lead, ...leads]);
    setShowAddLeadModal(false);
    setNewLead({
      name: '', phone: '', email: '', property: '', propertyValue: 0,
      broker: '', operator: 'Ana (Concierge)', tag: 'Novo Lead', kanbanStage: 'Novo Lead', origin: 'Manual'
    });
  };

  const handleAction = (leadId: string, actionType: string, newDept?: Department, newTag?: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        if (actionType === 'resolve') {
          return { ...lead, department: 'resolved' as any }; // Removes from queue
        }
        return {
          ...lead,
          department: newDept || lead.department,
          tag: newTag || lead.tag
        };
      }
      return lead;
    }));
    setSelectedLeadId(null);
  };

  const handleRedistribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!redistributeOperator.trim()) return;
    
    const targetLeads = selectedLeadsForBulk.length > 0 
      ? selectedLeadsForBulk 
      : (leadToRedistribute ? [leadToRedistribute] : (selectedLeadId ? [selectedLeadId] : []));

    if (targetLeads.length === 0) return;

    setLeads(prev => prev.map(lead => 
      targetLeads.includes(lead.id)
        ? { ...lead, operator: redistributeOperator, tag: 'Redistribuído' }
        : lead
    ));
    setShowRedistributeModal(false);
    setRedistributeOperator('');
    setLeadToRedistribute(null);
    setSelectedLeadsForBulk([]);
    if (targetLeads.includes(selectedLeadId || '')) {
      setSelectedLeadId(null);
    }
  };

  const handleArchive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !archiveReason.trim()) return;
    
    setLeads(prev => prev.map(lead => 
      lead.id === selectedLeadId 
        ? { ...lead, archived: true, archivedReason: archiveReason }
        : lead
    ));
    setShowArchiveModal(false);
    setArchiveReason('');
    setSelectedLeadId(null);
  };

  const handleReclassify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;
    
    setLeads(prev => prev.map(lead => {
      if (lead.id === selectedLeadId) {
        const newNotes = reclassifyNote.trim() 
          ? lead.notes + '\n\n[Reclassificação]: ' + reclassifyNote 
          : lead.notes;
          
        return { 
          ...lead, 
          tag: reclassifyTag || lead.tag,
          kanbanStage: reclassifyStatus || lead.kanbanStage,
          notes: newNotes
        };
      }
      return lead;
    }));
    setShowReclassifyModal(false);
    setReclassifyTag('');
    setReclassifyStatus('');
    setReclassifyNote('');
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !scheduleDate) return;
    
    setLeads(prev => prev.map(lead => 
      lead.id === selectedLeadId 
        ? { ...lead, scheduledDate: scheduleDate, tag: 'Retorno Agendado' }
        : lead
    ));
    setShowScheduleModal(false);
    setScheduleDate('');
    setSelectedLeadId(null);
  };

  const sendMessage = (e?: React.FormEvent, type: 'text' | 'audio' | 'file' = 'text', fileData?: { name: string, size: string }) => {
    if (e) e.preventDefault();
    if (!selectedLeadId) return;
    if (type === 'text' && !chatInput.trim()) return;

    const now = Date.now();
    let messageText = chatInput;
    
    if (type === 'audio') {
      messageText = `🎵 Áudio (${formatTime(recordingTime)})`;
    } else if (type === 'file' && fileData) {
      messageText = `📎 Arquivo: ${fileData.name} (${fileData.size})`;
    }

    const newMessage: Message = {
      id: now.toString(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: now,
      type: type
    };

    setLeads(prev => prev.map(lead => 
      lead.id === selectedLeadId 
        ? { ...lead, messages: [...lead.messages, newMessage], lastInteraction: now }
        : lead
    ));
    setChatInput('');
    setIsRecording(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock file sending
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(1)} KB`;
      
      sendMessage(undefined, 'file', { name: file.name, size: sizeStr });
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop and send
      sendMessage(undefined, 'audio');
    } else {
      // Start
      setIsRecording(true);
    }
  };

  // Big Numbers Calculation
  const bigNumbers = useMemo(() => {
    if (activeDept === 'dashboard') return [];
    
    const deptLeads = leads.filter(l => l.department === activeDept && !l.archived);
    
    if (activeDept === 'concierge') {
      return [
        { label: 'Total na Fila', value: deptLeads.length },
        { label: 'Atendidos Hoje', value: 12 }, // Mocked static
        { label: 'Aguardando Contato', value: deptLeads.filter(l => l.messages.length <= 1).length },
        { label: 'Propostas Site', value: deptLeads.filter(l => l.tag === 'Proposta Site').length },
      ];
    }
    if (activeDept === 'comercial') {
      return [
        { label: 'Negociações Ativas', value: deptLeads.length },
        { label: 'Propostas em Aberto', value: deptLeads.filter(l => l.tag === 'Proposta').length },
        { label: 'Aguardando Assinatura', value: deptLeads.filter(l => l.tag === 'Aguardando Contrato').length },
        { label: 'Assinados Hoje', value: deptLeads.filter(l => l.tag === 'Contrato Assinado').length },
      ];
    }
    // Financeiro
    return [
      { label: 'Total Pendências', value: deptLeads.length },
      { label: 'Boletos Emitidos', value: deptLeads.filter(l => l.tag === 'Boleto Emitido').length },
      { label: 'Boletos Vencidos', value: deptLeads.filter(l => l.tag === 'Boleto Vencido').length },
      { label: 'Valor em Cobrança', value: formatCurrency(deptLeads.reduce((acc, l) => acc + l.propertyValue * 0.06, 0)) }, // Mock 6% commission
    ];
  }, [leads, activeDept]);

  const kanbanColumns = useMemo(() => {
    if (activeDept === 'dashboard') return [];
    const deptLeads = leads.filter(l => l.department === activeDept && !l.archived);
    const stages = Array.from(new Set(deptLeads.map(l => l.kanbanStage)));
    return stages.map(stage => ({
      name: stage,
      leads: deptLeads.filter(l => l.kanbanStage === stage)
    }));
  }, [leads, activeDept]);

  return (
    <div className="h-screen bg-[#f4f6f8] flex font-sans text-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-y-auto shadow-sm z-20">
        <div className="h-16 flex items-center px-4 border-b border-gray-200 shrink-0 gap-3">
          <Menu className="w-6 h-6 text-gray-600 cursor-pointer" />
          <div className="flex items-center gap-2 text-red-600 font-bold text-xl tracking-tighter">
            <Building className="w-6 h-6" />
            <span>NEWCORE</span>
          </div>
        </div>
        
        <div className="py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Menu de Navegação
          </div>
          
          <nav className="space-y-0.5">
            {/* Fluxo Operacional */}
            <div>
              <button 
                onClick={() => setActiveMenu(activeMenu === 'fluxo' ? 'gestao' : 'fluxo')}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium ${activeMenu === 'fluxo' ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className={`w-4 h-4 ${activeMenu === 'fluxo' ? 'text-blue-600' : 'text-gray-500'}`} />
                  Fluxo Operacional
                </div>
                {activeMenu === 'fluxo' ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>
              {activeMenu === 'fluxo' && (
                <div className="bg-gray-50 py-1">
                  <button 
                    onClick={() => setActiveView('fluxo-dashboard')}
                    className={`w-full flex items-center pl-11 pr-4 py-2 text-sm font-medium ${activeView === 'fluxo-dashboard' ? 'text-blue-700 bg-blue-50 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => setActiveView('fluxo-atendimento')}
                    className={`w-full flex items-center pl-11 pr-4 py-2 text-sm font-medium ${activeView === 'fluxo-atendimento' ? 'text-blue-700 bg-blue-50 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Atendimento
                  </button>
                  <button 
                    onClick={() => setActiveView('fluxo-comercial')}
                    className={`w-full flex items-center pl-11 pr-4 py-2 text-sm font-medium ${activeView === 'fluxo-comercial' ? 'text-blue-700 bg-blue-50 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Comercial
                  </button>
                  <button 
                    onClick={() => setActiveView('fluxo-financeiro')}
                    className={`w-full flex items-center pl-11 pr-4 py-2 text-sm font-medium ${activeView === 'fluxo-financeiro' ? 'text-blue-700 bg-blue-50 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Financeiro
                  </button>
                </div>
              )}
            </div>

            {/* Gestão de Leads */}
            <div>
              <button 
                onClick={() => setActiveMenu(activeMenu === 'gestao' ? 'fluxo' : 'gestao')}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium ${activeMenu === 'gestao' ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 ${activeMenu === 'gestao' ? 'text-blue-600' : 'text-gray-500'}`} />
                  Gestão de Leads
                </div>
                {activeMenu === 'gestao' ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
              </button>
              {activeMenu === 'gestao' && (
                <div className="bg-gray-50 py-1">
                  <button 
                    onClick={() => setActiveView('gestao-dashboard')}
                    className={`w-full flex items-center pl-11 pr-4 py-2 text-sm font-medium ${activeView === 'gestao-dashboard' ? 'text-blue-700 bg-blue-50 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => setActiveView('gestao-kanban')}
                    className={`w-full flex items-center pl-11 pr-4 py-2 text-sm font-medium ${activeView === 'gestao-kanban' ? 'text-blue-700 bg-blue-50 border-r-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Kanban
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f4f6f8]">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
            <img 
              src="https://i.pravatar.cc/150?u=olavo" 
              alt="User Avatar" 
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <span className="text-sm font-medium text-gray-700">Olavo Junior</span>
          </div>
        </header>

        {/* WORKSPACE */}
        <main className="flex-1 overflow-auto p-6 flex flex-col">
        
        {activeView === 'gestao-kanban' ? (
          <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Kanban Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    Todos os Leads
                    <span className="bg-gray-700 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                      {kanbanData.columns.reduce((acc, col) => acc + col.count, 0)} leads
                    </span>
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Valor total: {formatCurrency(kanbanData.columns.reduce((acc, col) => acc + col.cards.reduce((sum, card) => sum + parseFloat(card.value.replace(/\./g, '').replace(',', '.')), 0), 0))}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                  <Plus className="w-4 h-4" /> Novo Lead
                </button>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-2xl">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Buscar leads, imóveis, corretores..." 
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Todos os Corretores</option>
                      <option value="olavo">Olavo Junior</option>
                      <option value="joao">João Silva</option>
                      <option value="maria">Maria Santos</option>
                    </select>
                    
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Qualificação (BANT)</option>
                      <option value="quente">Quente</option>
                      <option value="morno">Morno</option>
                      <option value="frio">Frio</option>
                    </select>
                    
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Origem</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="site">Site</option>
                      <option value="instagram">Instagram</option>
                      <option value="indicacao">Indicação</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => setShowAdvancedFiltersModal(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 ml-auto"
                  >
                    <Filter className="w-4 h-4" /> Mais Filtros
                  </button>
                  
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden shrink-0">
                    <button 
                      onClick={() => setViewMode('kanban')}
                      className={`p-2 ${viewMode === 'kanban' ? 'bg-gray-100 text-gray-700' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 border-l border-gray-300 ${viewMode === 'list' ? 'bg-gray-100 text-gray-700' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-4 bg-blue-500 rounded-full relative cursor-pointer transition-colors">
                      <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                    </div>
                    Atualização automática
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedCards.length > 0 && (
                      <button 
                        onClick={() => setShowSendToFlowModal(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors mr-2"
                      >
                        <Send className="w-4 h-4" /> Enviar para Fluxo ({selectedCards.length})
                      </button>
                    )}
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      <RefreshCw className="w-4 h-4" /> Atualizar
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" /> Exportar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Board / List View */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 bg-gray-50/50">
              {viewMode === 'kanban' ? (
                <div className="flex gap-4 h-full items-start min-w-max">
                  {kanbanData.columns.map(col => (
                    <div 
                      key={col.id} 
                      className={`w-[340px] flex flex-col h-full rounded-xl transition-colors ${draggedOverColumnId === col.id ? 'bg-blue-50/50 ring-2 ring-blue-400 ring-inset' : ''}`}
                      onDragOver={(e) => handleDragOver(e, col.id)}
                      onDrop={(e) => handleDrop(e, col.id)}
                    >
                    {/* Column Header */}
                    <div className="bg-white border border-gray-200 rounded-t-xl p-3 mb-2 shadow-sm">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-gray-800">{col.title}</h3>
                        <span className={`${col.color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                          {col.count}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{formatCurrency(col.cards.reduce((sum, card) => sum + parseFloat(card.value.replace(/\./g, '').replace(',', '.')), 0))}</p>
                    </div>
                    
                    {/* Column Cards */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4">
                      {col.cards.map(card => (
                        <div 
                          key={card.id} 
                          id={`card-${card.id}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, card.id)}
                          onDragEnd={handleDragEnd}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                        >
                          {/* Left Border Color */}
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${card.temp === 'Quente' ? 'bg-red-500' : card.temp === 'Morno' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                          
                          <div className="p-3 pl-4">
                            {/* Header: Name, Temp, Tags */}
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <input 
                                    type="checkbox" 
                                    className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    checked={selectedCards.includes(card.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCards([...selectedCards, card.id]);
                                      } else {
                                        setSelectedCards(selectedCards.filter(id => id !== card.id));
                                      }
                                    }}
                                  />
                                  {card.temp === 'Frio' ? (
                                    <Snowflake className="w-3.5 h-3.5 text-blue-500" />
                                  ) : (
                                    <Flame className={`w-3.5 h-3.5 ${card.temp === 'Quente' ? 'text-red-500' : 'text-yellow-500'}`} />
                                  )}
                                  <h4 className="font-bold text-gray-900 text-sm truncate max-w-[140px]" title={card.name}>{card.name}</h4>
                                </div>
                                <span className="text-[10px] text-gray-500 mt-0.5 ml-5">{card.creationDate} • {card.origem}</span>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                  card.temp === 'Quente' ? 'bg-red-50 text-red-600 border-red-100' : 
                                  card.temp === 'Morno' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                                  'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                  {card.temp.toUpperCase()}
                                </span>
                                <div className="flex gap-1">
                                  {card.diasParado > 0 && (
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 text-red-600 text-[9px] font-bold" title={`Parado há ${card.diasParado} dias`}>
                                      {card.diasParado}d
                                    </span>
                                  )}
                                  {card.redistribuicoes > 0 && (
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[9px] font-bold" title={`Redistribuído ${card.redistribuicoes}x`}>
                                      {card.redistribuicoes}x
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            {/* Value and Location */}
                            <div className="flex justify-between items-center mb-2">
                              <div className="font-bold text-[#00b288] text-sm">
                                R$ {card.value}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-gray-500 truncate max-w-[120px]" title={card.location}>
                                <MapPin className="w-3 h-3 shrink-0" />
                                <span className="truncate">{card.location || 'Não especificado'}</span>
                              </div>
                            </div>

                            {/* Imóveis de Interesse */}
                            {card.imoveisInteresse && card.imoveisInteresse.length > 0 && (
                              <div className="mb-2">
                                <div className="text-[10px] text-gray-500 mb-1">Interesse:</div>
                                <div className="flex flex-wrap gap-1">
                                  {card.imoveisInteresse.map((imovel, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded truncate max-w-full" title={imovel}>
                                      {imovel}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Broker and Last Interaction */}
                            <div className="flex justify-between items-center mb-3 bg-gray-50 p-1.5 rounded border border-gray-100">
                              <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium truncate">
                                <User className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                                <span className="truncate">{card.broker || 'Não atribuído'}</span>
                                <button className="text-gray-400 hover:text-blue-500 transition-colors shrink-0 ml-1" title="Informações do Corretor">
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-gray-500 shrink-0" title="Última interação">
                                <Clock className="w-3 h-3" /> {card.lastInteraction}
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-1.5 mb-3">
                              <button 
                                onClick={() => {
                                  setQuickActionLeadId(card.id);
                                  setQuickActionStage(col.id);
                                  setShowQuickActionsModal(true);
                                }}
                                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Zap className="w-3 h-3" /> AÇÕES RÁPIDAS
                              </button>
                              <button 
                                onClick={() => {
                                  setTagsLeadId(card.id);
                                  setShowTagsModal(true);
                                }}
                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-[10px] font-bold py-1.5 rounded uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Tag className="w-3 h-3" /> INSERIR TAGS
                              </button>
                            </div>
                            
                            {/* Footer: Status and Icons */}
                            <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 truncate max-w-[180px]" title={card.status}>
                                <Info className="w-3 h-3 text-blue-500 shrink-0" /> 
                                <span className="truncate">{card.status || 'Sem status'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button className="text-gray-400 hover:text-green-500 transition-colors" title="WhatsApp">
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>
                                {card.hasDocs && (
                                  <button className="text-gray-400 hover:text-blue-500 transition-colors" title="Documentos">
                                    <Paperclip className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {card.hasNotes && (
                                  <button className="text-gray-400 hover:text-yellow-500 transition-colors" title="Notas">
                                    <FileText className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Tags */}
                            {card.tags && card.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {card.tags.map((tag, idx) => (
                                  <span key={idx} className={`text-[9px] px-1.5 py-0.5 rounded ${getTagColor(tag)}`}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="h-full overflow-auto bg-white rounded-xl shadow-sm border border-gray-200">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={selectedCards.length > 0 && selectedCards.length === kanbanData.columns.reduce((sum, col) => sum + col.cards.length, 0)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const allIds = kanbanData.columns.flatMap(col => col.cards.map(c => c.id));
                                setSelectedCards(allIds);
                              } else {
                                setSelectedCards([]);
                              }
                            }}
                          />
                        </th>
                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lead</th>
                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Etapa</th>
                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Corretor</th>
                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Origem</th>
                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Última Interação</th>
                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
                        <th className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {kanbanData.columns.flatMap(col => col.cards.map(card => (
                        <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 text-center">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              checked={selectedCards.includes(card.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCards([...selectedCards, card.id]);
                                } else {
                                  setSelectedCards(selectedCards.filter(id => id !== card.id));
                                }
                              }}
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {card.temp === 'Frio' ? (
                                <Snowflake className="w-4 h-4 text-blue-500" />
                              ) : (
                                <Flame className={`w-4 h-4 ${card.temp === 'Quente' ? 'text-red-500' : 'text-yellow-500'}`} />
                              )}
                              <div>
                                <div className="font-medium text-gray-900">{card.name}</div>
                                <div className="text-xs text-gray-500">{card.creationDate}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                              {col.title}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-[#00b288]">R$ {card.value}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                              <User className="w-4 h-4 text-gray-400" />
                              {card.broker || 'Não atribuído'}
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-600">{card.origem}</td>
                          <td className="p-3 text-sm text-gray-600">{card.lastInteraction}</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {card.tags && card.tags.slice(0, 2).map((tag, idx) => (
                                <span key={idx} className={`text-[10px] px-1.5 py-0.5 rounded ${getTagColor(tag)}`}>
                                  {tag}
                                </span>
                              ))}
                              {card.tags && card.tags.length > 2 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                                  +{card.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setQuickActionLeadId(card.id);
                                  setQuickActionStage(col.id);
                                  setShowQuickActionsModal(true);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Ações Rápidas"
                              >
                                <Zap className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  setTagsLeadId(card.id);
                                  setShowTagsModal(true);
                                }}
                                className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                title="Inserir Tags"
                              >
                                <Tag className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : activeView === 'fluxo-dashboard' ? (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-blue-600" />
              Dashboard de Desempenho - Fluxo Operacional
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Mensagens por Dia */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Mensagens por Dia</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mensagensPorDiaData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="disparadas" name="Disparadas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="respondidas" name="Respondidas" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Mensagens por Mês */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Mensagens por Mês</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mensagensPorMesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="disparadas" name="Disparadas" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="respondidas" name="Respondidas" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Respostas por Tag */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Respostas por Tag (Classificação)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={respostasPorTagData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="respostas"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {respostasPorTagData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tempo de Resposta (Mantido do original) */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tempo Médio de Resposta</h3>
                <div className="space-y-6 mt-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Ana (Concierge)</span>
                      <span className="text-green-600 font-bold">2m 15s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">Carlos (Outro)</span>
                      <span className="text-yellow-600 font-bold">5m 30s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gestão de Fila e Distribuição */}
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-blue-600" />
                Gestão de Fila e Distribuição
              </h2>
              
              <div className="grid grid-cols-3 gap-6">
                {/* Regras de Distribuição */}
                <div className="col-span-1 bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Regra de Distribuição</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                      <input type="radio" name="dist-rule" value="round-robin" checked={distributionRule === 'round-robin'} onChange={(e) => setDistributionRule(e.target.value)} className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Round Robin</p>
                        <p className="text-xs text-gray-500">Distribui igualmente um a um</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                      <input type="radio" name="dist-rule" value="load-balancing" checked={distributionRule === 'load-balancing'} onChange={(e) => setDistributionRule(e.target.value)} className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Balanceamento de Carga</p>
                        <p className="text-xs text-gray-500">Prioriza quem tem menos leads ativos</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300">
                      <input type="radio" name="dist-rule" value="manual" checked={distributionRule === 'manual'} onChange={(e) => setDistributionRule(e.target.value)} className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">Manual</p>
                        <p className="text-xs text-gray-500">Sem distribuição automática</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Redistribuição em Massa */}
                <div className="col-span-2 bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col max-h-80">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Redistribuição em Massa</h3>
                    {selectedLeadsForBulk.length > 0 && (
                      <button 
                        onClick={() => setShowRedistributeModal(true)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Redistribuir ({selectedLeadsForBulk.length})
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto bg-white border border-gray-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-200 sticky top-0">
                        <tr>
                          <th className="p-3 w-10">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              checked={selectedLeadsForBulk.length === leads.filter(l => !l.archived).length && leads.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLeadsForBulk(leads.filter(l => !l.archived).map(l => l.id));
                                } else {
                                  setSelectedLeadsForBulk([]);
                                }
                              }}
                            />
                          </th>
                          <th className="p-3 font-medium">Lead</th>
                          <th className="p-3 font-medium">Operador Atual</th>
                          <th className="p-3 font-medium">Tempo na Fila</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.filter(l => !l.archived).map(lead => (
                          <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3">
                              <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                checked={selectedLeadsForBulk.includes(lead.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedLeadsForBulk(prev => [...prev, lead.id]);
                                  } else {
                                    setSelectedLeadsForBulk(prev => prev.filter(id => id !== lead.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="p-3 font-medium text-gray-900">{lead.name}</td>
                            <td className="p-3 text-gray-600">{lead.operator}</td>
                            <td className="p-3 text-gray-600">{lead.timeInQueue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Concierges Online */}
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                Concierges Online
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { name: 'Ana (Concierge)', status: 'online', leads: 12 },
                  { name: 'João (Concierge)', status: 'online', leads: 8 },
                  { name: 'Maria (Concierge)', status: 'busy', leads: 15 },
                  { name: 'Pedro (Concierge)', status: 'offline', leads: 0 },
                ].map(concierge => (
                  <div key={concierge.name} className="p-4 border border-gray-200 rounded-xl flex items-center gap-4 bg-gray-50">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                        {concierge.name.charAt(0)}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        concierge.status === 'online' ? 'bg-green-500' :
                        concierge.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{concierge.name}</p>
                      <p className="text-xs text-gray-500">{concierge.leads} leads ativos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeView === 'gestao-dashboard' ? (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-blue-600" />
              Dashboard de Leads (Kanban)
            </h2>
            
            <div className="grid grid-cols-5 gap-6 mb-6">
              {kanbanData.columns.map((col, idx) => {
                return (
                  <div key={col.title} className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{col.title}</h3>
                    <div className="text-3xl font-bold text-gray-800 mb-1">{col.count}</div>
                    <div className="text-sm text-gray-500">Leads</div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500 mb-1">Valor Total</div>
                      <div className="text-lg font-semibold text-green-600">{formatCurrency(col.cards.reduce((sum, card) => sum + parseFloat(card.value.replace(/\./g, '').replace(',', '.')), 0))}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Quantidade de leads por etapa */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quantidade de Leads por Etapa</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={kanbanData.columns.map(col => ({ name: col.title, leads: col.count }))} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="leads" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversão de leads por etapa */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Conversão de Leads por Etapa (%)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversaoEtapaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Bar dataKey="conversao" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Origem dos Leads */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Origem dos Leads</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={origemLeadsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {origemLeadsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quantidade de leads por Qualificação */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Leads por Qualificação</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leadsPorQualificacaoData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {leadsPorQualificacaoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Leads novos por mês */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Leads Novos por Mês</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={leadsNovosPorMesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="leads" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Tempo do lead por etapa */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Tempo Médio do Lead por Etapa (Dias)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tempoPorEtapaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value} dias`} />
                      <Bar dataKey="dias" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Desempenho de leads por distrito (ranking) */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Desempenho por Distrito (Ranking)</h3>
                <div className="space-y-4">
                  {leadsPorDistritoData.map((distrito, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{distrito.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-indigo-600">{distrito.leads} leads</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desempenho de Corretores (Top 5) */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Desempenho de Corretores (Top 5)</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Carlos Silva', leads: 12, value: 4500000 },
                    { name: 'Ana Oliveira', leads: 9, value: 3200000 },
                    { name: 'Roberto Santos', leads: 7, value: 2800000 },
                    { name: 'Mariana Costa', leads: 5, value: 1900000 },
                    { name: 'Fernando Lima', leads: 4, value: 1500000 },
                  ].map((broker, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{broker.name}</p>
                          <p className="text-xs text-gray-500">{broker.leads} leads ativos</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">{formatCurrency(broker.value)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-6 h-full w-full">
            {/* LEFT PANEL: Queue or Lead Details */}
        <div className="w-4/12 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          
          {!selectedLeadId ? (
            // QUEUE VIEW
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    Fila de Trabalho - <span className="capitalize">{activeDept}</span>
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {filteredLeads.length} leads
                    </span>
                    <button 
                      onClick={() => setShowAddLeadModal(true)} 
                      className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      title="Adicionar Novo Lead"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Search and Filters */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Buscar por nome, telefone, ref..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select 
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                      >
                        <option value="all">Todas as Tags</option>
                        {availableTags.map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative flex-1">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select 
                        value={selectedOperatorFilter}
                        onChange={(e) => setSelectedOperatorFilter(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                      >
                        <option value="all">Todos os Concierges</option>
                        {Array.from(new Set(leads.map(l => l.operator))).map(op => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex bg-gray-200 p-0.5 rounded-lg">
                      <button 
                        onClick={() => setFilterUnread(false)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${!filterUnread ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Todos
                      </button>
                      <button 
                        onClick={() => setFilterUnread(true)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${filterUnread ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        Não Lidas
                        {leads.filter(l => l.department === activeDept && l.unread && !l.archived).length > 0 && (
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        )}
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                      className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-2 py-1 rounded-md"
                    >
                      <ArrowDownUp className="w-3 h-3" />
                      {sortOrder === 'newest' ? 'Mais Recentes' : 'Mais Antigos'}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2">
                {filteredLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <CheckCircle className="w-12 h-12 mb-2" />
                    <p>Fila vazia. Bom trabalho!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredLeads.map(lead => (
                      <div 
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="p-4 rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white group flex flex-col gap-2"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                            {lead.name}
                            {lead.unread && <span className="w-2.5 h-2.5 bg-green-500 rounded-full" title="Nova mensagem"></span>}
                          </h3>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getTagColor(lead.tag)}`}>
                            {lead.tag}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs text-gray-600">
                          <span className="flex items-center gap-1 truncate" title={lead.phone}><Phone className="w-3 h-3 shrink-0" /> {lead.phone}</span>
                          <span className="flex items-center gap-1 truncate" title={lead.origin || 'Não informado'}><Globe className="w-3 h-3 shrink-0" /> {lead.origin || 'N/A'}</span>
                          <span className="flex items-center gap-1 truncate col-span-2" title={lead.propertyRef ? `${lead.propertyRef} - ${lead.propertyAddress}` : lead.propertyAddress}>
                            <Hash className="w-3 h-3 shrink-0" /> 
                            {lead.propertyRef && <span className="font-medium">{lead.propertyRef}</span>}
                            {lead.propertyRef && lead.propertyAddress && ' - '}
                            {lead.propertyAddress || lead.property}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 pt-2 border-t border-gray-50">
                          <span className="flex items-center gap-1" title="Tempo na fila"><Clock className="w-3 h-3" /> {lead.timeInQueue}</span>
                          <span className="flex items-center gap-1" title="Corretor"><User className="w-3 h-3" /> {lead.broker}</span>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setLeadToRedistribute(lead.id);
                              setShowRedistributeModal(true);
                            }}
                            className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded ml-auto transition-colors" 
                            title="Alterar Concierge/Operador"
                          >
                            <Shield className="w-3 h-3" /> {lead.operator} <RefreshCw className="w-3 h-3 ml-1" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // LEAD DETAILS VIEW
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button 
                    onClick={() => setSelectedLeadId(null)}
                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-600 shrink-0 mt-0.5"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 leading-tight">{selectedLead?.name}</h2>
                    <div className="mt-1.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getTagColor(selectedLead?.tag || '')}`}>
                        {selectedLead?.tag}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowFullDataModal(true)} 
                  className="px-2.5 py-1.5 bg-white text-blue-600 border border-blue-200 rounded-lg text-xs font-medium hover:bg-blue-50 flex flex-col items-center justify-center gap-0.5 transition-colors shadow-sm shrink-0"
                  title="Dados Completos"
                >
                  <FileText className="w-4 h-4" />
                  <span className="text-[10px] leading-tight text-center">Dados<br/>Completos</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Info Cards */}
                <div className="flex flex-col gap-6">
                  {/* Row 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block leading-tight h-8">Contato</label>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate" title={selectedLead?.phone}>{selectedLead?.phone}</span></div>
                        <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate" title={selectedLead?.email}>{selectedLead?.email}</span></div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block leading-tight h-8">Corretor<br/>Responsável</label>
                      <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate" title={selectedLead?.broker}>{selectedLead?.broker}</span></div>
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block leading-tight h-8">Imóvel de<br/>Interesse</label>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm"><Home className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate" title={selectedLead?.property}>{selectedLead?.property}</span></div>
                        <div className="flex items-center gap-2 text-sm font-medium text-green-600"><DollarSign className="w-4 h-4 shrink-0" /> <span className="truncate">{formatCurrency(selectedLead?.propertyValue || 0)}</span></div>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block leading-tight h-8">Status<br/>Kanban</label>
                      <div className="flex items-center gap-2 text-sm"><FileText className="w-4 h-4 text-gray-400 shrink-0" /> <span className="truncate" title={selectedLead?.kanbanStage}>{selectedLead?.kanbanStage}</span></div>
                    </div>
                  </div>
                </div>

                {/* Trigger Reason */}
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-orange-800">Motivo do Gatilho</h4>
                      <p className="text-sm text-orange-700 mt-1">{selectedLead?.triggerReason}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Observações Internas</label>
                  <textarea 
                    className="mt-2 w-full p-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    rows={3}
                    defaultValue={selectedLead?.notes}
                    placeholder="Adicione observações sobre o atendimento..."
                  />
                </div>
              </div>

              {/* ACTION AREA */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ações Finais</h4>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setShowRedistributeModal(true)} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Redistribuir
                  </button>
                  
                  <button 
                    onClick={() => setShowArchiveModal(true)} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-red-600 flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" /> Arquivar
                  </button>
                  
                  <button 
                    onClick={() => {
                      setReclassifyTag(selectedLead!.tag);
                      setReclassifyStatus(selectedLead!.kanbanStage);
                      setShowReclassifyModal(true);
                    }} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Tag className="w-4 h-4" /> Reclassificar
                  </button>
                  
                  <button 
                    onClick={() => setShowScheduleModal(true)} 
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" /> Agendar Retorno
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: WhatsApp */}
        <div className="w-8/12 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
          {/* WhatsApp Header */}
          <div className="bg-[#075e54] text-white p-4 flex items-center gap-3 z-10 shadow-md">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{selectedLead ? selectedLead.name : 'Selecione um lead'}</h3>
              <p className="text-xs text-white/80">{selectedLead ? selectedLead.phone : 'WhatsApp Integrado'}</p>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-[#e5ddd5] p-4 overflow-y-auto" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'cover', opacity: selectedLead ? 1 : 0.5 }}>
            {!selectedLead ? (
              <div className="h-full flex items-center justify-center">
                <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-600 shadow-sm">
                  Selecione um lead na fila para ver a conversa
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <span className="bg-[#e1f3fb] text-gray-600 text-xs px-3 py-1 rounded-lg shadow-sm">Hoje</span>
                </div>
                {selectedLead.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 shadow-sm relative ${msg.sender === 'user' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                      <p className="text-sm text-gray-800">{msg.text}</p>
                      <span className="text-[10px] text-gray-500 float-right mt-1 ml-3">{msg.time}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-[#f0f0f0] p-3 flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx"
              onChange={handleFileChange}
            />
            <button 
              disabled={!selectedLead || isRecording}
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              title="Anexar arquivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>
            <form onSubmit={(e) => sendMessage(e, 'text')} className="flex-1 flex gap-2">
              {isRecording ? (
                <div className="flex-1 py-3 px-4 rounded-full bg-red-50 border border-red-200 flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-medium text-sm">Gravando áudio... {formatTime(recordingTime)}</span>
                  <button 
                    type="button"
                    onClick={() => setIsRecording(false)}
                    className="ml-auto text-gray-500 hover:text-red-500 text-sm font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={!selectedLead}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 py-3 px-4 rounded-full border-none focus:ring-0 outline-none text-sm shadow-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
                />
              )}
              
              {chatInput.trim() && !isRecording ? (
                <button 
                  type="submit"
                  disabled={!selectedLead}
                  className="w-12 h-12 bg-[#075e54] rounded-full flex items-center justify-center text-white hover:bg-[#128c7e] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm shrink-0"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button 
                  type="button"
                  disabled={!selectedLead}
                  onClick={toggleRecording}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm shrink-0 ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-[#075e54] hover:bg-[#128c7e]'}`}
                  title={isRecording ? "Enviar áudio" : "Gravar áudio"}
                >
                  {isRecording ? <Send className="w-5 h-5 ml-1" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      )}
    </main>

      {/* MODALS */}
      {showArchiveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Archive className="w-5 h-5 text-red-500" /> Arquivar Lead
              </h3>
              <button onClick={() => setShowArchiveModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleArchive}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo do arquivamento</label>
                <textarea 
                  required
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  rows={4}
                  placeholder="Ex: Cliente comprou com outra imobiliária, desistiu da compra, etc."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowArchiveModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Confirmar Arquivamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReclassifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-500" /> Reclassificar Lead
              </h3>
              <button onClick={() => setShowReclassifyModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReclassify}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nova Tag</label>
                  <select 
                    value={reclassifyTag}
                    onChange={(e) => setReclassifyTag(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Manter atual</option>
                    {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                    <option value="Nova Tag Personalizada">Nova Tag Personalizada...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Novo Status (Kanban)</label>
                  <select 
                    value={reclassifyStatus}
                    onChange={(e) => setReclassifyStatus(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Manter atual</option>
                    <option value="Novo Lead">Novo Lead</option>
                    <option value="Qualificação">Qualificação</option>
                    <option value="Visita Agendada">Visita Agendada</option>
                    <option value="Proposta">Proposta</option>
                    <option value="Negociação">Negociação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observação da Reclassificação</label>
                  <textarea 
                    value={reclassifyNote}
                    onChange={(e) => setReclassifyNote(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    rows={2}
                    placeholder="Opcional: motivo da mudança..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowReclassifyModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Salvar Alterações</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-500" /> Agendar Retorno
              </h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSchedule}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora do Retorno</label>
                <input 
                  type="datetime-local" 
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-2">O lead voltará para a fila de trabalho na data selecionada.</p>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowScheduleModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Agendar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRedistributeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-blue-500" /> Redistribuir Lead
              </h3>
              <button onClick={() => setShowRedistributeModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRedistribute}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Novo Operador/Concierge</label>
                <select 
                  required
                  value={redistributeOperator}
                  onChange={(e) => setRedistributeOperator(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">Selecione um operador...</option>
                  <option value="Ana (Concierge)">Ana (Concierge)</option>
                  <option value="João (Concierge)">João (Concierge)</option>
                  <option value="Maria (Concierge)">Maria (Concierge)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowRedistributeModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Redistribuir</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showFullDataModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-gray-900 capitalize">{selectedLead.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium border bg-red-50 text-red-600 border-red-200">
                    <Flame className="w-3.5 h-3.5" /> Quente
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium border bg-gray-100 text-gray-600 border-gray-200">
                    Score: 0
                  </span>
                </div>
              </div>
              <button onClick={() => setShowFullDataModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 bg-gray-50 border-r border-gray-200 flex flex-col py-4 shrink-0">
                {[
                  { id: 'resumo', label: 'Resumo', icon: User },
                  { id: 'bant', label: 'BANT', icon: BarChart2 },
                  { id: 'imoveis', label: 'Imóveis', icon: Home },
                  { id: 'timeline', label: 'Timeline', icon: Clock },
                  { id: 'notas', label: 'Notas', icon: FileText },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFullDataActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                      fullDataActiveTab === tab.id 
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' 
                        : 'text-gray-600 hover:bg-gray-100 border-l-4 border-transparent'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-8 bg-white">
                {fullDataActiveTab === 'resumo' && (
                  <div className="space-y-8 max-w-3xl">
                    {/* Dados Pessoais */}
                    <section>
                      <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Dados Pessoais</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Email:</span>
                          <span className="text-gray-900 font-medium">{selectedLead.email || 'marina.silva@email.com'}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Telefone:</span>
                          <span className="text-gray-900 font-medium">{selectedLead.phone}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">CPF:</span>
                          <span className="text-gray-900 font-medium">123.456.789-00</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Data de Nascimento:</span>
                          <span className="text-gray-900 font-medium">15/03/1988</span>
                        </div>
                      </div>
                    </section>

                    {/* Qualificação */}
                    <section>
                      <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Qualificação</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Orçamento:</span>
                          <span className="text-gray-900 font-medium">{formatCurrency(selectedLead.propertyValue || 850000)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Entrada disponível:</span>
                          <span className="text-gray-900 font-medium">{formatCurrency(200000)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Pré-aprovado:</span>
                          <span className="text-gray-900 font-medium">Sim</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Banco:</span>
                          <span className="text-gray-900 font-medium">Banco Itaú</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Urgência:</span>
                          <span className="text-gray-900 font-medium">Imediata (0-30 dias)</span>
                        </div>
                      </div>
                    </section>

                    {/* Preferências */}
                    <section>
                      <h4 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Preferências</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Tipo:</span>
                          <span className="text-gray-900 font-medium">Apartamento</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Quartos:</span>
                          <span className="text-gray-900 font-medium">3</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Banheiros:</span>
                          <span className="text-gray-900 font-medium">2+</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Vagas:</span>
                          <span className="text-gray-900 font-medium">2</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Área mínima:</span>
                          <span className="text-gray-900 font-medium">80m²</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Localização:</span>
                          <span className="text-gray-900 font-medium">Zona Sul</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Bairros:</span>
                          <span className="text-gray-900 font-medium">Moema, Vila Olímpia</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Comodidades:</span>
                          <span className="text-gray-900 font-medium">Academia, Piscina</span>
                        </div>
                      </div>
                    </section>
                  </div>
                )}
                {fullDataActiveTab !== 'resumo' && (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Conteúdo da aba {fullDataActiveTab} em desenvolvimento...
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 bg-white flex justify-end gap-3 shrink-0">
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Ficha da FAC
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Adicionar Novo Lead
              </h3>
              <button 
                onClick={() => setShowAddLeadModal(false)}
                className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input 
                  type="text" 
                  value={newLead.name}
                  onChange={e => setNewLead({...newLead, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Nome do lead"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
                  <input 
                    type="text" 
                    value={newLead.phone}
                    onChange={e => setNewLead({...newLead, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={newLead.email}
                    onChange={e => setNewLead({...newLead, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imóvel de Interesse</label>
                <input 
                  type="text" 
                  value={newLead.property}
                  onChange={e => setNewLead({...newLead, property: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Apartamento 3 quartos..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Imóvel</label>
                  <input 
                    type="number" 
                    value={newLead.propertyValue || ''}
                    onChange={e => setNewLead({...newLead, propertyValue: Number(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="R$ 0,00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                  <select 
                    value={newLead.origin}
                    onChange={e => setNewLead({...newLead, origin: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Manual">Manual</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Site">Site</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tag Inicial</label>
                  <select 
                    value={newLead.tag}
                    onChange={e => setNewLead({...newLead, tag: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Novo Lead">Novo Lead</option>
                    <option value="Proposta Site">Proposta Site</option>
                    <option value="Agendamento">Agendamento</option>
                    <option value="Dúvida">Dúvida</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status Kanban</label>
                  <select 
                    value={newLead.kanbanStage}
                    onChange={e => setNewLead({...newLead, kanbanStage: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Novo Lead">Novo Lead</option>
                    <option value="Em Atendimento">Em Atendimento</option>
                    <option value="Aguardando Resposta">Aguardando Resposta</option>
                    <option value="Visita Agendada">Visita Agendada</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Concierge Responsável</label>
                <select 
                  value={newLead.operator}
                  onChange={e => setNewLead({...newLead, operator: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="Ana (Concierge)">Ana (Concierge)</option>
                  <option value="João (Concierge)">João (Concierge)</option>
                  <option value="Maria (Concierge)">Maria (Concierge)</option>
                </select>
              </div>

            </div>
            
            <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={() => setShowAddLeadModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAddLead}
                disabled={!newLead.name || !newLead.phone}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Adicionar Lead
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Quick Actions Modal */}
      {showQuickActionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Ações Rápidas
              </h3>
              <button onClick={() => setShowQuickActionsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mover para Etapa</label>
                <select 
                  value={quickActionStage}
                  onChange={e => setQuickActionStage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  {kanbanData.columns.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registro de Atendimento</label>
                <textarea 
                  value={quickActionNote}
                  onChange={e => setQuickActionNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] resize-none"
                  placeholder="Descreva o que foi conversado, próximos passos, etc..."
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setShowQuickActionsModal(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleQuickActionSave}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tags Modal */}
      {showTagsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                Inserir Tags
              </h3>
              <button onClick={() => {
                setShowTagsModal(false);
                setIsCreatingNewTag(false);
                setSelectedExistingTag('');
                setNewTagInput('');
              }} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adicionar Tag</label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={isCreatingNewTag ? 'new' : selectedExistingTag}
                    onChange={(e) => {
                      if (e.target.value === 'new') {
                        setIsCreatingNewTag(true);
                        setSelectedExistingTag('');
                      } else {
                        setIsCreatingNewTag(false);
                        setSelectedExistingTag(e.target.value);
                      }
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="" disabled>Selecione uma tag...</option>
                    {Array.from(new Set(kanbanData.columns.flatMap(col => col.cards).flatMap(card => card.tags || []))).map(tag => (
                      <option key={tag} value={tag}>{tag}</option>
                    ))}
                    <option value="new">+ Criar nova tag</option>
                  </select>
                  
                  {!isCreatingNewTag && (
                    <button 
                      onClick={handleAddTag}
                      disabled={!selectedExistingTag}
                      className={`px-4 py-2 font-medium rounded-lg transition-colors ${selectedExistingTag ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Adicionar
                    </button>
                  )}
                </div>
                
                {isCreatingNewTag && (
                  <div className="flex gap-2 mt-2">
                    <input 
                      type="text"
                      value={newTagInput}
                      onChange={e => setNewTagInput(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Nome da nova tag..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddTag();
                      }}
                      autoFocus
                    />
                    <button 
                      onClick={handleAddTag}
                      disabled={!newTagInput.trim()}
                      className={`px-4 py-2 font-medium rounded-lg transition-colors ${newTagInput.trim() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                      Criar
                    </button>
                    <button 
                      onClick={() => {
                        setIsCreatingNewTag(false);
                        setNewTagInput('');
                      }}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags Atuais</label>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const lead = kanbanData.columns.flatMap(col => col.cards).find(c => c.id === tagsLeadId);
                    if (!lead || !lead.tags || lead.tags.length === 0) {
                      return <span className="text-sm text-gray-500">Nenhuma tag adicionada.</span>;
                    }
                    return lead.tags.map((tag, idx) => (
                      <span key={idx} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-medium border ${getTagColor(tag)}`}>
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:opacity-70 ml-1"><X className="w-3 h-3" /></button>
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => {
                  setShowTagsModal(false);
                  setIsCreatingNewTag(false);
                  setSelectedExistingTag('');
                  setNewTagInput('');
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send to Flow Modal */}
      {showSendToFlowModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Enviar para Fluxo Operacional
              </h3>
              <button onClick={() => setShowSendToFlowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
                Você selecionou <strong>{selectedCards.length}</strong> lead(s) para enviar ao fluxo operacional.
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Fluxo</label>
                <select 
                  value={selectedFlowItem}
                  onChange={e => setSelectedFlowItem(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Selecione...</option>
                  <option value="visita">Agendamento de Visita</option>
                  <option value="proposta">Análise de Proposta</option>
                  <option value="contrato">Emissão de Contrato</option>
                  <option value="financiamento">Análise de Financiamento</option>
                  <option value="pos_venda">Pós-venda</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observações (Opcional)</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
                  placeholder="Instruções para a equipe operacional..."
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setShowSendToFlowModal(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  // Here we would send the selected cards to the flow
                  setShowSendToFlowModal(false);
                  setSelectedCards([]);
                  setSelectedFlowItem('');
                }}
                disabled={!selectedFlowItem}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  selectedFlowItem 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Modal */}
      {showAdvancedFiltersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Filtros Avançados
              </h3>
              <button onClick={() => setShowAdvancedFiltersModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Column 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tempo sem interação</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Qualquer tempo</option>
                      <option value="24h">Mais de 24 horas</option>
                      <option value="48h">Mais de 48 horas</option>
                      <option value="7d">Mais de 7 dias</option>
                      <option value="15d">Mais de 15 dias</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Corretor</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Todos os corretores</option>
                      <option value="olavo">Olavo Junior</option>
                      <option value="joao">João Silva</option>
                      <option value="maria">Maria Santos</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Embaixador</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Todos os embaixadores</option>
                      <option value="emb1">Embaixador 1</option>
                      <option value="emb2">Embaixador 2</option>
                    </select>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Todos os status</option>
                      <option value="agendada">Visita Agendada</option>
                      <option value="enviada">Proposta Enviada</option>
                      <option value="contrato">Contrato em andamento</option>
                      <option value="pago">Pago</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Todas as tags</option>
                      <option value="quente">Lead quente (BANT)</option>
                      <option value="problema">Problema jurídico</option>
                      <option value="cobranca">Cobrança</option>
                      <option value="negativa">Experiência negativa</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Origem</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                      <option value="">Todas as origens</option>
                      <option value="imovelweb">Imovelweb</option>
                      <option value="zap">Zap Imóveis</option>
                      <option value="site">Site Próprio</option>
                      <option value="indicacao">Indicação</option>
                    </select>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Datas</label>
                    <div className="space-y-2">
                      <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm">
                        <option value="criacao">Data de Criação</option>
                        <option value="interacao">Última Interação</option>
                        <option value="visita">Data de Visita</option>
                        <option value="proposta">Data de Proposta</option>
                        <option value="assinatura">Data de Assinatura</option>
                        <option value="pagamento">Data de Pagamento</option>
                      </select>
                      <div className="flex gap-2">
                        <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        <span className="text-gray-500 self-center">até</span>
                        <input type="date" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Imóvel</label>
                    <div className="space-y-2">
                      <input type="text" placeholder="Endereço ou Código" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      <div className="flex gap-2">
                        <input type="text" placeholder="Cidade" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input type="text" placeholder="Distrito" className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="flex gap-2">
                        <input type="number" placeholder="Preço Mín." className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input type="number" placeholder="Preço Máx." className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
              <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">
                Limpar Filtros
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAdvancedFiltersModal(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => setShowAdvancedFiltersModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Aplicar Filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}