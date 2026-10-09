export type BedZone = 'Dianteira' | 'Centro-Dianteiro' | 'Centro' | 'Centro-Traseiro' | 'Traseira';

export type BodyType = 'CARROCERIA ABERTA' | 'SIDER' | 'BAÚ' | 'PRANCHA REBAIXADA' | 'GRADE BAIXA';

export type OrderStatus = 'Rascunho' | 'Em Análise' | 'Aprovado' | 'Carregando' | 'Em Trânsito' | 'Concluído';

export type PriorityLevel = 'Normal' | 'Urgente' | 'Emergencial (Blackout)';

export interface EquipmentItem {
  id: string;
  nome: string;
  categoria?: 'Gerador' | 'QTA' | 'Tanque' | 'Cabos' | 'Banco de Carga' | 'Acessórios' | 'Outros';
  qtd: number;
  comp: string; // m
  larg: string; // m
  alt: string;  // m
  pesoUn: number; // kg
  posicao: BedZone;
  amarracao: string;
  calco: boolean;
  observacoes?: string;
}

export interface VehicleConfig {
  modelo: string;
  placa: string;
  placaCarreta?: string;
  tipoCarroceria: BodyType;
  comprimento: number; // m
  largura: number; // m
  alturaGuarda: number; // m
  pbtLimite: number; // kg
  tara: number; // kg (peso vazio)
  motoristaNome: string;
  motoristaCnh: string;
  motoristaTelefone: string;
  transportadora: string;
}

export interface ChecklistItem {
  id: string;
  categoria: 'Veículo & Documentos' | 'Amarração & Distribuição' | 'Fluidos & Meio Ambiente';
  descricao: string;
  marcado: boolean;
  obrigatorio?: boolean;
}

export interface Signatures {
  responsavelCarregamento: string;
  cargoResponsavel: string;
  dataHoraLiberacao: string;
  motoristaConferente: string;
  termoAceite: boolean;
}

export interface LoadingOrder {
  id: string;
  ocNum: string;
  data: string;
  horaPrevista?: string;
  notaFiscal?: string;
  quantidadeVolumes?: number | string;
  status: OrderStatus;
  prioridade: PriorityLevel;
  cliente: string;
  obraProjeto?: string;
  destino: string;
  cidadeUf?: string;
  contatoLocal?: string;
  telefoneLocal?: string;
  
  veiculo: VehicleConfig;
  equipamentos: EquipmentItem[];
  
  detalhesPosicionamento: string;
  obsSeguranca: string;
  checklist: ChecklistItem[];
  assinaturas: Signatures;
  
  criadoEm: string;
  atualizadoEm: string;
}

export interface PresetEquipment {
  id?: string;
  nome: string;
  categoria: 'Gerador' | 'QTA' | 'Tanque' | 'Cabos' | 'Banco de Carga' | 'Acessórios' | 'Outros';
  comp: string;
  larg: string;
  alt: string;
  pesoUn: number;
  amarracaoSugerida: string;
  posicaoSugerida: BedZone;
  descricao: string;
  isCustom?: boolean;
}

export interface VehiclePreset {
  nome: string;
  tipoCarroceria: BodyType;
  comprimento: number;
  largura: number;
  alturaGuarda: number;
  pbtLimite: number;
  tara: number;
  capacidadeUtil: number;
  descricao: string;
}
