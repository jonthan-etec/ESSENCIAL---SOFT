import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  OrdersSidebar 
} from './components/OrdersSidebar';
import { 
  OrderHeaderCard 
} from './components/OrderHeaderCard';
import { 
  VehicleCard 
} from './components/VehicleCard';
import { 
  EquipmentTable 
} from './components/EquipmentTable';
import { 
  EquipmentCatalogModal 
} from './components/EquipmentCatalogModal';
import { 
  TruckBedVisualizer 
} from './components/TruckBedVisualizer';
import { 
  ChecklistSection 
} from './components/ChecklistSection';
import { 
  TechnicalGuidelines 
} from './components/TechnicalGuidelines';
import { 
  SignaturesCard 
} from './components/SignaturesCard';
import { 
  ShareModal 
} from './components/ShareModal';
import { 
  PrintDocument 
} from './components/PrintDocument';
import { 
  PrintPreviewModal 
} from './components/PrintPreviewModal';
import { 
  OfflineIndicator 
} from './components/OfflineIndicator';
import { 
  ConfirmModal 
} from './components/ConfirmModal';
import { 
  PendriveModal 
} from './components/PendriveModal';

import { 
  LoadingOrder, 
  EquipmentItem, 
  VehicleConfig, 
  ChecklistItem, 
  Signatures, 
  PresetEquipment, 
  BedZone 
} from './types';
import { 
  SAMPLE_INITIAL_ORDER, 
  VEHICLE_PRESETS, 
  DEFAULT_CHECKLIST, 
  DEFAULT_TECHNICAL_INSTRUCTIONS, 
  DEFAULT_SAFETY_OBSERVATIONS 
} from './data/presets';
import { 
  obterOrdensSalvas, 
  salvarOrdemIndividual, 
  excluirOrdem, 
  salvarOrdens,
  obterCatalogoEquipamentos,
  verificarConexaoPendriveApi,
  salvarNoPendriveApi
} from './utils/storage';
import { 
  calcularMetricasCarga 
} from './utils/calculations';
import { 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  FileCheck, 
  Save, 
  Printer, 
  RotateCcw,
  Trash2,
  Copy,
  PlusCircle,
  FileText,
  HardDrive
} from 'lucide-react';

export default function App() {
  const [ordens, setOrdens] = useState<LoadingOrder[]>([]);
  const [ordemAtual, setOrdemAtual] = useState<LoadingOrder>(SAMPLE_INITIAL_ORDER);
  const [temAlteracoesNaoSalvas, setTemAlteracoesNaoSalvas] = useState<boolean>(false);
  
  // Modais e gavetas
  const [sidebarAberta, setSidebarAberta] = useState<boolean>(false);
  const [catalogoAberto, setCatalogoAberto] = useState<boolean>(false);
  const [shareModalAberto, setShareModalAberto] = useState<boolean>(false);
  const [previewModalAberto, setPreviewModalAberto] = useState<boolean>(false);
  const [autoImprimirModal, setAutoImprimirModal] = useState<boolean>(false);
  const [confirmarExcluirOrdemAtual, setConfirmarExcluirOrdemAtual] = useState<boolean>(false);
  const [pendriveModalAberto, setPendriveModalAberto] = useState<boolean>(false);
  const [conectadoAoServidorPendrive, setConectadoAoServidorPendrive] = useState<boolean>(false);
  
  // Toast de feedback
  const [toast, setToast] = useState<{ mensagem: string; tipo: 'sucesso' | 'erro' | 'aviso' } | null>(null);

  // Inicializar ordens salvas do localStorage e verificar se há servidor de pendrive ativo
  useEffect(() => {
    const carregadas = obterOrdensSalvas();
    setOrdens(carregadas);
    if (carregadas.length > 0) {
      setOrdemAtual(carregadas[0]);
    }

    // Verificar se a aplicação está rodando pelo inicializador do pendrive
    verificarConexaoPendriveApi().then(res => {
      if (res.conectado) {
        setConectadoAoServidorPendrive(true);
        if (res.ordens && res.ordens.length > 0) {
          setOrdens(res.ordens);
          setOrdemAtual(res.ordens[0]);
        }
      }
    });
  }, []);

  const exibirToast = (mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' = 'sucesso') => {
    setToast({ mensagem, tipo });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Cálculos reativos de engenharia e carga
  const metricas = useMemo(() => {
    return calcularMetricasCarga(ordemAtual.equipamentos, ordemAtual.veiculo);
  }, [ordemAtual.equipamentos, ordemAtual.veiculo]);

  // Modificadores de estado da Ordem Atual
  const handleAtualizarCampoOrdem = (campo: keyof LoadingOrder, valor: any) => {
    setOrdemAtual(prev => ({
      ...prev,
      [campo]: valor
    }));
    setTemAlteracoesNaoSalvas(true);
  };

  const handleAtualizarVeiculo = (campo: keyof VehicleConfig, valor: any) => {
    setOrdemAtual(prev => ({
      ...prev,
      veiculo: {
        ...prev.veiculo,
        [campo]: valor
      }
    }));
    setTemAlteracoesNaoSalvas(true);
  };

  const handleCarregarPresetVeiculo = (index: number) => {
    const preset = VEHICLE_PRESETS[index];
    if (!preset) return;

    setOrdemAtual(prev => ({
      ...prev,
      veiculo: {
        ...prev.veiculo,
        modelo: preset.nome,
        tipoCarroceria: preset.tipoCarroceria,
        comprimento: preset.comprimento,
        largura: preset.largura,
        alturaGuarda: preset.alturaGuarda,
        pbtLimite: preset.pbtLimite,
        tara: preset.tara
      }
    }));
    setTemAlteracoesNaoSalvas(true);
    exibirToast(`Veículo configurado: ${preset.nome}`);
  };

  // Gerenciamento de Equipamentos
  const handleNovoItemVazio = () => {
    const novoId = 'item_' + Date.now();
    const novoItem: EquipmentItem = {
      id: novoId,
      nome: 'Novo Equipamento / Carga',
      categoria: 'Outros',
      qtd: 1,
      comp: '1.0',
      larg: '1.0',
      alt: '1.0',
      pesoUn: 200,
      posicao: 'Centro',
      amarracao: '2x Cinta Catraca 3T',
      calco: true
    };

    setOrdemAtual(prev => ({
      ...prev,
      equipamentos: [...prev.equipamentos, novoItem]
    }));
    setTemAlteracoesNaoSalvas(true);
  };

  const handleAdicionarItemDoCatalogo = (preset: PresetEquipment) => {
    const novoId = 'item_' + Date.now();
    const novoItem: EquipmentItem = {
      id: novoId,
      nome: preset.nome,
      categoria: preset.categoria,
      qtd: 1,
      comp: preset.comp,
      larg: preset.larg,
      alt: preset.alt,
      pesoUn: preset.pesoUn,
      posicao: preset.posicaoSugerida,
      amarracao: preset.amarracaoSugerida,
      calco: true,
      observacoes: preset.descricao
    };

    setOrdemAtual(prev => ({
      ...prev,
      equipamentos: [...prev.equipamentos, novoItem]
    }));
    setTemAlteracoesNaoSalvas(true);
    exibirToast(`Adicionado: ${preset.nome}`);
  };

  const handleRemoverItem = (id: string) => {
    const itemRemovido = ordemAtual.equipamentos.find(e => e.id === id);
    setOrdemAtual(prev => ({
      ...prev,
      equipamentos: prev.equipamentos.filter(e => e.id !== id)
    }));
    setTemAlteracoesNaoSalvas(true);
    exibirToast(`Equipamento "${itemRemovido?.nome || 'Item'}" removido da ordem.`);
  };

  const handleLimparTodosEquipamentos = () => {
    setOrdemAtual(prev => ({
      ...prev,
      equipamentos: []
    }));
    setTemAlteracoesNaoSalvas(true);
    exibirToast('Todos os equipamentos foram removidos da ordem.');
  };

  const handleDuplicarItem = (item: EquipmentItem) => {
    const duplicado: EquipmentItem = {
      ...item,
      id: 'item_' + Date.now(),
      nome: `${item.nome} (Cópia)`
    };

    setOrdemAtual(prev => ({
      ...prev,
      equipamentos: [...prev.equipamentos, duplicado]
    }));
    setTemAlteracoesNaoSalvas(true);
    exibirToast('Item duplicado na tabela.');
  };

  const handleAtualizarItem = (id: string, campo: keyof EquipmentItem, valor: any) => {
    setOrdemAtual(prev => ({
      ...prev,
      equipamentos: prev.equipamentos.map(item => {
        if (item.id === id) {
          return { ...item, [campo]: valor };
        }
        return item;
      })
    }));
    setTemAlteracoesNaoSalvas(true);
  };

  const handleMoverItemZona = (id: string, novaPosicao: BedZone) => {
    setOrdemAtual(prev => ({
      ...prev,
      equipamentos: prev.equipamentos.map(item => {
        if (item.id === id) {
          return { ...item, posicao: novaPosicao };
        }
        return item;
      })
    }));
    setTemAlteracoesNaoSalvas(true);
  };

  // Checklist Handlers
  const handleToggleChecklist = (id: string) => {
    setOrdemAtual(prev => ({
      ...prev,
      checklist: prev.checklist.map(chk => {
        if (chk.id === id) {
          return { ...chk, marcado: !chk.marcado };
        }
        return chk;
      })
    }));
    setTemAlteracoesNaoSalvas(true);
  };

  const handleAdicionarChecklistItem = (categoria: ChecklistItem['categoria'], descricao: string) => {
    const novoItem: ChecklistItem = {
      id: 'chk_' + Date.now(),
      categoria,
      descricao,
      marcado: true
    };

    setOrdemAtual(prev => ({
      ...prev,
      checklist: [...prev.checklist, novoItem]
    }));
    setTemAlteracoesNaoSalvas(true);
    exibirToast('Item adicionado ao checklist.');
  };

  const handleRemoverChecklistItem = (id: string) => {
    setOrdemAtual(prev => ({
      ...prev,
      checklist: prev.checklist.filter(chk => chk.id !== id)
    }));
    setTemAlteracoesNaoSalvas(true);
  };

  const handleMarcarTodosChecklist = (marcar: boolean) => {
    setOrdemAtual(prev => ({
      ...prev,
      checklist: prev.checklist.map(c => ({ ...c, marcado: marcar }))
    }));
    setTemAlteracoesNaoSalvas(true);
  };

  const handleRestaurarChecklistPadrao = () => {
    setOrdemAtual(prev => ({
      ...prev,
      checklist: DEFAULT_CHECKLIST
    }));
    setTemAlteracoesNaoSalvas(true);
    exibirToast('Checklist restaurado com itens padrão.');
  };

  // Signatures Handlers
  const handleAtualizarAssinaturas = (campo: keyof Signatures, valor: any) => {
    setOrdemAtual(prev => ({
      ...prev,
      assinaturas: {
        ...prev.assinaturas,
        [campo]: valor
      }
    }));
    setTemAlteracoesNaoSalvas(true);
  };

  // CRUD Actions
  const handleSalvar = () => {
    const atualizadas = salvarOrdemIndividual(ordemAtual);
    setOrdens(atualizadas);
    setTemAlteracoesNaoSalvas(false);
    
    if (conectadoAoServidorPendrive) {
      salvarNoPendriveApi(atualizadas, obterCatalogoEquipamentos());
      exibirToast(`Ordem ${ordemAtual.ocNum} salva e sincronizada no Pendrive!`);
    } else {
      exibirToast(`Ordem de Carregamento ${ordemAtual.ocNum} salva com sucesso!`);
    }
  };

  const handleNovaOrdem = () => {
    const proxNum = (ordens.length + 1).toString().padStart(4, '0') + '/' + new Date().getFullYear();
    const hoje = new Date().toISOString().split('T')[0];

    const nova: LoadingOrder = {
      id: 'oc_' + Date.now(),
      ocNum: proxNum,
      data: hoje,
      horaPrevista: '08:00',
      status: 'Rascunho',
      prioridade: 'Normal',
      cliente: '',
      obraProjeto: '',
      destino: '',
      cidadeUf: '',
      contatoLocal: '',
      telefoneLocal: '',
      veiculo: {
        modelo: 'IVECO Toco 4x2 (Médio)',
        placa: '',
        tipoCarroceria: 'CARROCERIA ABERTA',
        comprimento: 7.5,
        largura: 2.45,
        alturaGuarda: 0.60,
        pbtLimite: 16000,
        tara: 5800,
        motoristaNome: '',
        motoristaCnh: '',
        motoristaTelefone: '',
        transportadora: 'Essencial Frota Própria'
      },
      equipamentos: [
        {
          id: 'item_' + Date.now(),
          nome: 'Gerador Cabinado GXX573 (500 kVA)',
          categoria: 'Gerador',
          qtd: 1,
          comp: '4.0',
          larg: '1.4',
          alt: '2.2',
          pesoUn: 4200,
          posicao: 'Dianteira',
          amarracao: '4x Cinta Catraca 5T',
          calco: true
        }
      ],
      detalhesPosicionamento: DEFAULT_TECHNICAL_INSTRUCTIONS,
      obsSeguranca: DEFAULT_SAFETY_OBSERVATIONS,
      checklist: DEFAULT_CHECKLIST,
      assinaturas: {
        responsavelCarregamento: 'Coordenador de Logística',
        cargoResponsavel: 'Pátio Central',
        dataHoraLiberacao: `${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}`,
        motoristaConferente: '',
        termoAceite: true
      },
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    const atualizadas = salvarOrdemIndividual(nova);
    setOrdens(atualizadas);
    setOrdemAtual(nova);
    setTemAlteracoesNaoSalvas(false);
    exibirToast(`Nova Ordem ${nova.ocNum} criada e salva.`);
  };

  const handleSelecionarOrdem = (id: string) => {
    const encontrada = ordens.find(o => o.id === id);
    if (encontrada) {
      setOrdemAtual(encontrada);
      setTemAlteracoesNaoSalvas(false);
      exibirToast(`O.C. ${encontrada.ocNum} carregada.`);
    }
  };

  const handleDuplicarOrdem = (ordem: LoadingOrder) => {
    const proxNum = (ordens.length + 1).toString().padStart(4, '0') + '/' + new Date().getFullYear();
    const duplicada: LoadingOrder = {
      ...JSON.parse(JSON.stringify(ordem)),
      id: 'oc_' + Date.now(),
      ocNum: proxNum,
      status: 'Rascunho',
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };

    const atualizadas = [duplicada, ...ordens];
    salvarOrdens(atualizadas);
    setOrdens(atualizadas);
    setOrdemAtual(duplicada);
    setTemAlteracoesNaoSalvas(false);
    exibirToast(`Ordem clonada com novo número: ${duplicada.ocNum}`);
  };

  const handleExcluirOrdem = (id: string) => {
    const atualizadas = excluirOrdem(id);
    
    if (atualizadas.length === 0) {
      // Quando for a única ordem, exclui e cria imediatamente uma ordem em branco
      const hoje = new Date().toISOString().split('T')[0];
      const nova: LoadingOrder = {
        id: 'oc_' + Date.now(),
        ocNum: '0001/' + new Date().getFullYear(),
        data: hoje,
        horaPrevista: '08:00',
        status: 'Rascunho',
        prioridade: 'Normal',
        cliente: '',
        obraProjeto: '',
        destino: '',
        cidadeUf: '',
        contatoLocal: '',
        telefoneLocal: '',
        veiculo: {
          modelo: 'IVECO Toco 4x2 (Médio)',
          placa: '',
          tipoCarroceria: 'CARROCERIA ABERTA',
          comprimento: 7.5,
          largura: 2.45,
          alturaGuarda: 0.60,
          pbtLimite: 16000,
          tara: 5800,
          motoristaNome: '',
          motoristaCnh: '',
          motoristaTelefone: '',
          transportadora: 'Essencial Frota Própria'
        },
        equipamentos: [],
        detalhesPosicionamento: DEFAULT_TECHNICAL_INSTRUCTIONS,
        obsSeguranca: DEFAULT_SAFETY_OBSERVATIONS,
        checklist: DEFAULT_CHECKLIST,
        assinaturas: {
          responsavelCarregamento: 'Coordenador de Logística',
          cargoResponsavel: 'Pátio Central',
          dataHoraLiberacao: `${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
          motoristaConferente: '',
          termoAceite: true
        },
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      };

      salvarOrdens([nova]);
      setOrdens([nova]);
      setOrdemAtual(nova);
      setTemAlteracoesNaoSalvas(false);
      exibirToast('Ordem excluída. Uma nova ordem em branco foi criada com sucesso.');
    } else {
      setOrdens(atualizadas);
      if (ordemAtual.id === id) {
        setOrdemAtual(atualizadas[0]);
      }
      setTemAlteracoesNaoSalvas(false);
      exibirToast('Ordem de Carregamento excluída com sucesso.');
    }
  };

  const handleImportarJson = (dados: LoadingOrder | LoadingOrder[]) => {
    if (Array.isArray(dados)) {
      salvarOrdens(dados);
      setOrdens(dados);
      if (dados.length > 0) setOrdemAtual(dados[0]);
      exibirToast(`${dados.length} ordens importadas com sucesso!`);
    } else if (dados && dados.id) {
      const atualizadas = salvarOrdemIndividual(dados);
      setOrdens(atualizadas);
      setOrdemAtual(dados);
      exibirToast(`O.C. ${dados.ocNum} importada com sucesso!`);
    }
  };

  // Atalho de teclado para carregar a impressora (Ctrl+P / Cmd+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleExecutarImpressao();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExecutarImpressao = () => {
    // Fecha outros painéis auxiliares
    setSidebarAberta(false);
    setShareModalAberto(false);
    setCatalogoAberto(false);

    // Ativa a Central de Impressão imediatamente
    setAutoImprimirModal(true);
    setPreviewModalAberto(true);
    exibirToast('Central de Impressão ativada! Documento pronto para emitir.', 'sucesso');
  };

  const handleAbrirVisualizacaoPdf = () => {
    setAutoImprimirModal(false);
    setPreviewModalAberto(true);
  };

  const handleImprimirOrdemEspecifica = (ordem: LoadingOrder) => {
    setOrdemAtual(ordem);
    setSidebarAberta(false);
    setAutoImprimirModal(true);
    setPreviewModalAberto(true);
    exibirToast(`Ordem O.C. ${ordem.ocNum} pronta para impressão!`, 'sucesso');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 text-slate-800 flex flex-col font-sans">
      
      {/* Toast Notification Container */}
      {toast && (
        <div 
          className={`fixed top-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 transition-all transform animate-in fade-in slide-in-from-top-3 ${
            toast.tipo === 'sucesso'
              ? 'bg-slate-900 text-white border-orange-500'
              : toast.tipo === 'erro'
              ? 'bg-red-900 text-white border-red-500'
              : 'bg-amber-900 text-white border-amber-500'
          }`}
        >
          {toast.tipo === 'sucesso' ? (
            <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <span className="text-xs font-semibold leading-snug break-words flex-1">{toast.mensagem}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white ml-auto shrink-0 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <Header
        ordem={ordemAtual}
        temAlteracoesNaoSalvas={temAlteracoesNaoSalvas}
        onNovaOrdem={handleNovaOrdem}
        onSalvar={handleSalvar}
        onAbrirSidebar={() => setSidebarAberta(true)}
        onAbrirCompartilhar={() => setShareModalAberto(true)}
        onImprimir={handleExecutarImpressao}
        onVisualizarPdf={handleAbrirVisualizacaoPdf}
        onAbrirPendriveModal={() => setPendriveModalAberto(true)}
        conectadoAoServidorPendrive={conectadoAoServidorPendrive}
        totalSalvas={ordens.length}
      />

      {/* Documento Oficial para Impressão Direta (Ativado via Ctrl+P ou window.print()) */}
      <div className="print-standalone-container">
        <PrintDocument
          ordem={ordemAtual}
          metricas={metricas}
        />
      </div>

      {/* Main Interactive Workspace (Oculto na impressão) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 no-print min-w-0">
        
        {/* Banner de Status Operacional e Alertas de Balança */}
        {metricas.isSobrepeso || metricas.isPbtExcedido ? (
          <div className="bg-red-600 text-white p-3.5 sm:p-4 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs w-full min-w-0">
            <div className="flex items-center gap-2 font-bold leading-snug min-w-0">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span className="break-words">
                ATENÇÃO: A carga atual ({metricas.pesoTotalCarga.toLocaleString('pt-BR')} kg) excede a capacidade útil máxima do veículo ({metricas.capacidadeUtil.toLocaleString('pt-BR')} kg) em {(metricas.pesoTotalCarga - metricas.capacidadeUtil).toLocaleString('pt-BR')} kg!
              </span>
            </div>
            <span className="bg-white/20 px-2.5 py-1 rounded font-mono font-bold uppercase text-[11px] whitespace-nowrap self-start sm:self-auto shrink-0">
              Risco de Multa ANTT
            </span>
          </div>
        ) : null}

        {/* 1. Metadados Gerais da Ordem de Carregamento */}
        <OrderHeaderCard
          ordem={ordemAtual}
          onChange={handleAtualizarCampoOrdem}
        />

        {/* 2. Especificações do Veículo de Transporte & Carga Útil */}
        <VehicleCard
          veiculo={ordemAtual.veiculo}
          metricas={metricas}
          onChange={handleAtualizarVeiculo}
          onCarregarPreset={handleCarregarPresetVeiculo}
        />

        {/* 3. Tabela Dinâmica de Equipamentos e Cargas */}
        <EquipmentTable
          equipamentos={ordemAtual.equipamentos}
          onAdicionarItem={handleNovoItemVazio}
          onAbrirCatalogo={() => setCatalogoAberto(true)}
          onRemoverItem={handleRemoverItem}
          onDuplicarItem={handleDuplicarItem}
          onAtualizarItem={handleAtualizarItem}
          onLimparTodos={handleLimparTodosEquipamentos}
        />

        {/* 4. Planta Técnica 2D da Carroceria com Balanço de Eixos e CG */}
        <TruckBedVisualizer
          equipamentos={ordemAtual.equipamentos}
          veiculo={ordemAtual.veiculo}
          metricas={metricas}
          onMoverItem={handleMoverItemZona}
        />

        {/* 5. Orientações Técnicas e Diretrizes de Segurança */}
        <TechnicalGuidelines
          detalhesPosicionamento={ordemAtual.detalhesPosicionamento}
          obsSeguranca={ordemAtual.obsSeguranca}
          onChangePosicionamento={val => handleAtualizarCampoOrdem('detalhesPosicionamento', val)}
          onChangeSeguranca={val => handleAtualizarCampoOrdem('obsSeguranca', val)}
        />

        {/* 6. Check-list de Inspeção e Liberação da Carga */}
        <ChecklistSection
          checklist={ordemAtual.checklist}
          onToggleItem={handleToggleChecklist}
          onAdicionarItem={handleAdicionarChecklistItem}
          onRemoverItem={handleRemoverChecklistItem}
          onMarcarTodos={handleMarcarTodosChecklist}
          onRestaurarPadrao={handleRestaurarChecklistPadrao}
        />

        {/* 7. Liberação Operacional, Assinaturas e Termo de Responsabilidade */}
        <SignaturesCard
          assinaturas={ordemAtual.assinaturas}
          motoristaNomeVeiculo={ordemAtual.veiculo.motoristaNome}
          onChange={handleAtualizarAssinaturas}
        />

        {/* Barra de Ações Inferior Estruturada e Otimizada */}
        <div className="pt-5 border-t border-slate-200 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 w-full min-w-0">
          <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap min-w-0">
            <span>Última alteração: <strong className="font-mono text-slate-700">{ordemAtual.atualizadoEm ? new Date(ordemAtual.atualizadoEm).toLocaleTimeString('pt-BR') : '-'}</strong></span>
            {temAlteracoesNaoSalvas ? (
              <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Alterações pendentes de salvamento
              </span>
            ) : (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1.5 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Todas as alterações salvas
              </span>
            )}
          </div>

          <div className="w-full xl:w-auto flex flex-wrap items-center justify-start xl:justify-end gap-2">
            {/* Excluir Ordem Atual com Confirmação Segura */}
            <button
              type="button"
              onClick={() => setConfirmarExcluirOrdemAtual(true)}
              className="h-9 px-3 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
              title="Excluir permanentemente esta Ordem de Carregamento"
            >
              <Trash2 className="w-3.5 h-3.5 shrink-0" />
              <span>Excluir</span>
            </button>

            {/* Clonar / Duplicar Ordem Atual */}
            <button
              type="button"
              onClick={() => handleDuplicarOrdem(ordemAtual)}
              className="h-9 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              title="Criar cópia desta ordem com novo número"
            >
              <Copy className="w-3.5 h-3.5 shrink-0" />
              <span>Clonar</span>
            </button>

            {/* Criar Nova Ordem */}
            <button
              type="button"
              onClick={handleNovaOrdem}
              className="h-9 px-3 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              title="Criar nova ordem de carregamento em branco"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Nova O.C.</span>
            </button>

            {/* Central do Modo Pendrive */}
            <button
              type="button"
              onClick={() => setPendriveModalAberto(true)}
              className="h-9 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer border border-slate-700 whitespace-nowrap shrink-0"
              title="Central do Modo Pendrive: Rodar em qualquer computador"
            >
              <HardDrive className={`w-3.5 h-3.5 shrink-0 ${conectadoAoServidorPendrive ? 'text-emerald-400' : 'text-cyan-400'}`} />
              <span>Pendrive</span>
              {conectadoAoServidorPendrive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>

            {/* Visualizar / Baixar PDF ou TXT */}
            <button
              type="button"
              onClick={handleAbrirVisualizacaoPdf}
              className="h-9 px-3 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer border border-slate-700 whitespace-nowrap shrink-0"
              title="Pré-visualizar folha oficial, baixar em PDF ou TXT A4"
            >
              <FileText className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>PDF / TXT</span>
            </button>

            {/* Imprimir - Carrega a Impressora Imediatamente */}
            <button
              type="button"
              onClick={handleExecutarImpressao}
              className="h-9 px-3.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              title="Carregar a impressora do sistema imediatamente (Ctrl+P)"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>Imprimir</span>
            </button>

            {/* Salvar Ordem */}
            <button
              type="button"
              onClick={handleSalvar}
              className="h-9 px-4 sm:px-5 text-xs font-bold rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
              title="Salvar alterações no armazenamento local e pendrive"
            >
              <Save className="w-3.5 h-3.5 shrink-0" />
              <span>Salvar Ordem</span>
            </button>
          </div>
        </div>

        {/* Rodapé Oficial da Ordem de Carregamento na Interface */}
        <footer className="pt-4 pb-2 border-t border-slate-200 text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-slate-800 uppercase">ESSENCIAL ENERGIA</span>
            <span>·</span>
            <span>Ordem O.C. <strong className="font-mono text-slate-900">{ordemAtual.ocNum}</strong></span>
            <span>·</span>
            <span className="font-mono font-bold bg-slate-200 text-slate-900 px-2 py-0.5 rounded border border-slate-300">
              REV 001/2026
            </span>
          </div>
          <div className="flex items-center gap-2 text-right">
            <span className="text-slate-700 font-semibold">versão desenvolvida por Jonthan Oliveira</span>
            <span>·</span>
            <span>Revisão: <strong className="font-mono text-slate-900 font-bold">REV 001/2026</strong></span>
          </div>
        </footer>

      </main>

      {/* Modais e Drawers */}
      <OrdersSidebar
        aberto={sidebarAberta}
        onFechar={() => setSidebarAberta(false)}
        ordens={ordens}
        ordemAtualId={ordemAtual.id}
        onSelecionarOrdem={handleSelecionarOrdem}
        onNovaOrdem={handleNovaOrdem}
        onDuplicarOrdem={handleDuplicarOrdem}
        onExcluirOrdem={handleExcluirOrdem}
        onImprimirOrdem={handleImprimirOrdemEspecifica}
      />

      <EquipmentCatalogModal
        aberto={catalogoAberto}
        onFechar={() => setCatalogoAberto(false)}
        onAdicionarItem={handleAdicionarItemDoCatalogo}
      />

      <ShareModal
        aberto={shareModalAberto}
        onFechar={() => setShareModalAberto(false)}
        ordem={ordemAtual}
        metricas={metricas}
        onImportarJson={handleImportarJson}
      />

      <PrintPreviewModal
        aberto={previewModalAberto}
        onFechar={() => {
          setPreviewModalAberto(false);
          setAutoImprimirModal(false);
        }}
        ordem={ordemAtual}
        metricas={metricas}
        autoImprimir={autoImprimirModal}
      />

      {/* Indicador de Status Offline do Aplicativo Windows */}
      <OfflineIndicator />

      {/* Confirmação de Exclusão da Ordem Atual */}
      <ConfirmModal
        aberto={confirmarExcluirOrdemAtual}
        onFechar={() => setConfirmarExcluirOrdemAtual(false)}
        onConfirmar={() => handleExcluirOrdem(ordemAtual.id)}
        titulo="Excluir Ordem de Carregamento?"
        mensagem={
          <div className="space-y-1">
            <p>
              Tem certeza que deseja excluir permanentemente a <strong>O.C. {ordemAtual.ocNum}</strong>?
            </p>
            <p className="text-slate-500 text-[11px]">
              Cliente: {ordemAtual.cliente || 'Não informado'} · Destino: {ordemAtual.destino || 'Não informado'}
            </p>
          </div>
        }
        textoConfirmar="Sim, Excluir O.C."
        tipo="perigo"
      />

      {/* Central do Modo Pendrive (Uso Portátil Plug & Play) */}
      <PendriveModal
        aberto={pendriveModalAberto}
        onFechar={() => setPendriveModalAberto(false)}
        ordens={ordens}
        catalogo={obterCatalogoEquipamentos()}
        conectadoAoServidorPendrive={conectadoAoServidorPendrive}
        onRecarregarDados={(novasOrdens) => {
          if (novasOrdens && novasOrdens.length > 0) {
            setOrdens(novasOrdens);
            setOrdemAtual(novasOrdens[0]);
            setTemAlteracoesNaoSalvas(false);
          }
        }}
        onNotificar={(msg) => exibirToast(msg)}
      />

    </div>
  );
}
