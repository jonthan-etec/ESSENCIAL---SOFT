import { PresetEquipment, VehiclePreset, ChecklistItem, EquipmentItem, VehicleConfig, LoadingOrder } from '../types';

export const VEHICLE_PRESETS: VehiclePreset[] = [
  {
    nome: 'IVECO Toco 4x2 (Médio)',
    tipoCarroceria: 'CARROCERIA ABERTA',
    comprimento: 7.5,
    largura: 2.45,
    alturaGuarda: 0.60,
    pbtLimite: 16000,
    tara: 5800,
    capacidadeUtil: 10200,
    descricao: '2 eixos. Ideal para geradores médios até 500 kVA ou cargas fracionadas em rotas urbanas/regionais.'
  },
  {
    nome: 'Mercedes-Benz Atego Truck 6x2 (Pesado)',
    tipoCarroceria: 'CARROCERIA ABERTA',
    comprimento: 8.5,
    largura: 2.50,
    alturaGuarda: 0.60,
    pbtLimite: 23000,
    tara: 8200,
    capacidadeUtil: 14800,
    descricao: '3 eixos. Capacidade para gerador de 500kVA/750kVA mais tanque e banco de carga.'
  },
  {
    nome: 'Volvo VM Bitruck 8x2 (4 Eixos)',
    tipoCarroceria: 'CARROCERIA ABERTA',
    comprimento: 9.8,
    largura: 2.55,
    alturaGuarda: 0.60,
    pbtLimite: 29000,
    tara: 9800,
    capacidadeUtil: 19200,
    descricao: '4 eixos com 2 direcionais. Excelente estabilidade e distribuição para conjuntos duplos.'
  },
  {
    nome: 'Scania R450 + Carreta 3 Eixos (Semirreboque)',
    tipoCarroceria: 'CARROCERIA ABERTA',
    comprimento: 13.8,
    largura: 2.60,
    alturaGuarda: 0.60,
    pbtLimite: 45000,
    tara: 15500,
    capacidadeUtil: 29500,
    descricao: 'Cavalo mecânico + carreta 3 eixos. Usado para usinas modulares, múltiplos geradores ou container 20ft.'
  },
  {
    nome: 'VW Delivery VUC / 3/4 (Urbano)',
    tipoCarroceria: 'CARROCERIA ABERTA',
    comprimento: 5.2,
    largura: 2.20,
    alturaGuarda: 0.45,
    pbtLimite: 8500,
    tara: 3400,
    capacidadeUtil: 5100,
    descricao: 'Veículo Urbano de Carga para acesso restrito, QTAs e geradores compactos até 150 kVA.'
  },
  {
    nome: 'Prancha Baixa / Rebaixada Especial',
    tipoCarroceria: 'PRANCHA REBAIXADA',
    comprimento: 13.5,
    largura: 3.00,
    alturaGuarda: 0.00,
    pbtLimite: 48000,
    tara: 17500,
    capacidadeUtil: 30500,
    descricao: 'Para geradores de grande porte (1000kVA+ ou subestações móveis com altura livre crítica).'
  }
];

export const EQUIPMENT_CATALOG: PresetEquipment[] = [
  {
    nome: 'Gerador Cabinado GXX573 (500 kVA)',
    categoria: 'Gerador',
    comp: '4.0',
    larg: '1.4',
    alt: '2.2',
    pesoUn: 4200,
    amarracaoSugerida: '4x Cinta Catraca 5T nos olhais + Calço frontal',
    posicaoSugerida: 'Dianteira',
    descricao: 'Gerador a diesel silencioso 500 kVA trifásico com carenagem acústica e bacia interna.'
  },
  {
    nome: 'Gerador Cabinado 260 kVA',
    categoria: 'Gerador',
    comp: '3.4',
    larg: '1.25',
    alt: '1.85',
    pesoUn: 2650,
    amarracaoSugerida: '4x Cinta Catraca 3T nos olhais + Calço de borracha',
    posicaoSugerida: 'Centro-Dianteiro',
    descricao: 'Gerador diesel carenado 260 kVA ideal para eventos ou redundância hospitalar.'
  },
  {
    nome: 'Gerador Cabinado 750 kVA',
    categoria: 'Gerador',
    comp: '5.2',
    larg: '1.6',
    alt: '2.45',
    pesoUn: 6100,
    amarracaoSugerida: '4x Corrente Grau 8 com Esticador + 2x Cinta 5T',
    posicaoSugerida: 'Centro-Dianteiro',
    descricao: 'Gerador de alta potência para plantas industriais e centros de distribuição.'
  },
  {
    nome: 'Gerador 1000 kVA (Container 20ft)',
    categoria: 'Gerador',
    comp: '6.06',
    larg: '2.44',
    alt: '2.59',
    pesoUn: 11800,
    amarracaoSugerida: 'Castanhas Twist-lock / Correntes Grau 8 de 10mm',
    posicaoSugerida: 'Centro',
    descricao: 'Grupo gerador usina pesada montado em container naval marítimo customizado.'
  },
  {
    nome: 'Pallet com 4 QTAs 630A',
    categoria: 'QTA',
    comp: '1.2',
    larg: '1.0',
    alt: '0.8',
    pesoUn: 480,
    amarracaoSugerida: '2x Cinta Catraca 3T com cantoneiras de proteção',
    posicaoSugerida: 'Centro',
    descricao: 'Quatro Quadros de Transferência Automática 630A paletizados e envelopados.'
  },
  {
    nome: 'QTA Industrial 1600A com Barramento',
    categoria: 'QTA',
    comp: '1.4',
    larg: '1.0',
    alt: '1.2',
    pesoUn: 580,
    amarracaoSugerida: '2x Cinta Catraca 3T com cantoneiras + Calço de madeira',
    posicaoSugerida: 'Centro-Traseiro',
    descricao: 'Painel de transferência de alta corrente com disjuntores motorizados.'
  },
  {
    nome: 'Tanque 1.000 L com Bacia de Contenção (Cheio)',
    categoria: 'Tanque',
    comp: '1.6',
    larg: '1.2',
    alt: '1.2',
    pesoUn: 1000,
    amarracaoSugerida: '2x Cinta Catraca 3T + 4x Calços nas bases',
    posicaoSugerida: 'Traseira',
    descricao: 'Tanque prismático metálico para diesel S10 com bacia de contenção 110% de capacidade.'
  },
  {
    nome: 'Tanque 2.000 L com Bacia de Contenção (Cheio)',
    categoria: 'Tanque',
    comp: '2.2',
    larg: '1.4',
    alt: '1.5',
    pesoUn: 2100,
    amarracaoSugerida: '4x Cinta Catraca 5T + Travas de piso aparafusadas',
    posicaoSugerida: 'Centro-Traseiro',
    descricao: 'Tanque de autonomia estendida com bomba de transferência elétrica acoplada.'
  },
  {
    nome: 'Rack com 4 Lances de Cabo Cobre 240mm² (100m cada)',
    categoria: 'Cabos',
    comp: '1.2',
    larg: '1.2',
    alt: '0.9',
    pesoUn: 680,
    amarracaoSugerida: '2x Cinta Catraca 3T cruzadas',
    posicaoSugerida: 'Centro',
    descricao: 'Conjunto de cabos unipolares 240mm² EPR 0,6/1kV com conectores engate rápido tipo cam-lock.'
  },
  {
    nome: 'Banco de Carga Resistivo 500 kW',
    categoria: 'Banco de Carga',
    comp: '2.2',
    larg: '1.3',
    alt: '1.7',
    pesoUn: 1450,
    amarracaoSugerida: '2x Cinta Catraca 3T + Calço de borracha de alta densidade',
    posicaoSugerida: 'Centro-Traseiro',
    descricao: 'Equipamento para teste de carga e comissionamento com exaustor forçado.'
  },
  {
    nome: 'Caixa de Acessórios & Protetores de Cabo (Passa-cabos)',
    categoria: 'Acessórios',
    comp: '1.2',
    larg: '0.8',
    alt: '0.6',
    pesoUn: 180,
    amarracaoSugerida: '1x Cinta Catraca 1.5T',
    posicaoSugerida: 'Traseira',
    descricao: '20 metros de passa-cabos modulares de poliuretano e acessórios de aterramento.'
  }
];

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  {
    id: 'chk_1',
    categoria: 'Veículo & Documentos',
    descricao: 'CNH do motorista válida com categoria compatível e exame toxicológico em dia',
    marcado: true,
    obrigatorio: true
  },
  {
    id: 'chk_2',
    categoria: 'Veículo & Documentos',
    descricao: 'Condições dos pneus, freios, iluminação e estepe do veículo inspecionadas',
    marcado: true,
    obrigatorio: true
  },
  {
    id: 'chk_3',
    categoria: 'Amarração & Distribuição',
    descricao: 'Carga posicionada conforme ordem técnica (pesos maiores encostados no para-cabine ou eixos)',
    marcado: true,
    obrigatorio: true
  },
  {
    id: 'chk_4',
    categoria: 'Amarração & Distribuição',
    descricao: 'Cintas de poliéster com catraca sem desfiamentos ou cortes (norma CONTRAN 552/2015)',
    marcado: true,
    obrigatorio: true
  },
  {
    id: 'chk_5',
    categoria: 'Amarração & Distribuição',
    descricao: 'Calços de madeira/borracha e travas de deslocamento longitudinal e lateral aplicados',
    marcado: true,
    obrigatorio: true
  },
  {
    id: 'chk_6',
    categoria: 'Amarração & Distribuição',
    descricao: 'Dimensões da carga respeitando a largura e altura máxima regulamentar da carroceria',
    marcado: true,
    obrigatorio: true
  },
  {
    id: 'chk_7',
    categoria: 'Fluidos & Meio Ambiente',
    descricao: 'Válvulas, respiros e registros de combustível e óleo inspecionados sem vazamentos',
    marcado: true,
    obrigatorio: true
  },
  {
    id: 'chk_8',
    categoria: 'Fluidos & Meio Ambiente',
    descricao: 'Bateria do gerador com chave geral desligada durante o transporte rodoviário',
    marcado: true,
    obrigatorio: true
  }
];

export const INITIAL_EQUIPMENTS: EquipmentItem[] = [
  {
    id: 'item_1',
    nome: 'Gerador Cabinado GXX573 (500 kVA)',
    categoria: 'Gerador',
    qtd: 1,
    comp: '4.0',
    larg: '1.4',
    alt: '2.2',
    pesoUn: 4200,
    posicao: 'Dianteira',
    amarracao: '4x Cinta Catraca 5T',
    calco: true,
    observacoes: 'Encostado no para-cabine com tapete de borracha antiderrapante'
  },
  {
    id: 'item_2',
    nome: 'Pallet com 4 QTAs 630A',
    categoria: 'QTA',
    qtd: 1,
    comp: '1.2',
    larg: '1.0',
    alt: '0.8',
    pesoUn: 480,
    posicao: 'Centro',
    amarracao: '2x Cinta Catraca 3T',
    calco: true,
    observacoes: 'Cantoneiras de cantos aplicadas'
  },
  {
    id: 'item_3',
    nome: 'Tanque 1.000 L com Bacia (Cheio)',
    categoria: 'Tanque',
    qtd: 1,
    comp: '1.6',
    larg: '1.2',
    alt: '1.2',
    pesoUn: 1000,
    posicao: 'Traseira',
    amarracao: '2x Cinta Catraca 3T + Calços',
    calco: true,
    observacoes: 'Válvula de dreno lacrada com abraçadeira inviolável'
  }
];

export const DEFAULT_TECHNICAL_INSTRUCTIONS = `1. Cargas pesadas (geradores e usinas) devem obrigatoriamente ser assentadas sobre calços de borracha de alta densidade ou madeira tratada encostadas no para-cabine ou sobre o centro do conjunto de eixos traseiros.
2. É expressamente proibido o uso de cordas para fixação das cargas (obrigatório uso de cintas têxteis de poliéster com catraca ou correntes, conforme Resolução CONTRAN 552/2015).
3. Cada equipamento deve possuir fixação independente, assegurando que o afrouxamento eventual de uma cinta não comprometa os demais itens.
4. Manter espaço mínimo operacional de 20cm entre as máquinas para inspeção visual e passagem de amarras.
5. Em dias de chuva, proteger painéis de comando e alternadores mesmo em equipamentos com cabine acústica.`;

export const DEFAULT_SAFETY_OBSERVATIONS = `• Velocidade máxima recomendada para conjunto carregado: 80 km/h em pista dupla e 60 km/h em pista simples.
• Parada obrigatória de conferência de tensionamento das catracas e amarrações após os primeiros 10 km ou 15 minutos de viagem.
• Transporte de combustível em tanque externo exige documentação fiscal correspondente e kit de mitigação para derramamento (MOPP).
• Em caso de intercorrência, pane ou desvio de rota, acionar imediatamente o CCO da Essencial Energia: (11) 98765-4321.`;

export const SAMPLE_INITIAL_ORDER: LoadingOrder = {
  id: 'oc_sample_0002_2026',
  ocNum: '0002/2026',
  data: '2026-10-07',
  horaPrevista: '08:30',
  notaFiscal: '14.892',
  quantidadeVolumes: 3,
  status: 'Aprovado',
  prioridade: 'Urgente',
  cliente: 'MERCADO LIVRE (MELI)',
  obraProjeto: 'Centro de Distribuição Resende - Galpão Logístico Expansão',
  destino: 'MELI RESENDE - SRJ 16 (Rod. Pres. Dutra, km 302)',
  cidadeUf: 'Resende / RJ',
  contatoLocal: 'Eng. Marcelo Prado / Operações MELI',
  telefoneLocal: '(24) 99876-1122',
  
  veiculo: {
    modelo: 'IVECO Toco 4x2 Eurocargo 160E28',
    placa: 'BRA-4E26',
    tipoCarroceria: 'CARROCERIA ABERTA',
    comprimento: 7.5,
    largura: 2.45,
    alturaGuarda: 0.60,
    pbtLimite: 16000,
    tara: 5800,
    motoristaNome: 'Carlos Eduardo Silveira',
    motoristaCnh: '04598231499 - Cat. D',
    motoristaTelefone: '(11) 97123-4567',
    transportadora: 'Essencial Frota Própria'
  },
  
  equipamentos: INITIAL_EQUIPMENTS,
  detalhesPosicionamento: DEFAULT_TECHNICAL_INSTRUCTIONS,
  obsSeguranca: DEFAULT_SAFETY_OBSERVATIONS,
  checklist: DEFAULT_CHECKLIST,
  
  assinaturas: {
    responsavelCarregamento: 'Roberto Mendes - Coordenador de Logística',
    cargoResponsavel: 'Logística & Pátio Central',
    dataHoraLiberacao: '07/10/2026 às 08:15',
    motoristaConferente: 'Carlos Eduardo Silveira',
    termoAceite: true
  },
  
  criadoEm: '2026-10-07T08:00:00Z',
  atualizadoEm: '2026-10-07T08:15:00Z'
};
