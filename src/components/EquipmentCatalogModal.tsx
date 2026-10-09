import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Boxes, 
  Check, 
  Zap,
  Fuel,
  Cpu,
  Cable,
  Trash2,
  PlusCircle,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { PresetEquipment, BedZone } from '../types';
import { 
  obterCatalogoEquipamentos, 
  adicionarEquipamentoAoCatalogo, 
  excluirEquipamentoDoCatalogo, 
  restaurarCatalogoPadrao 
} from '../utils/storage';
import { ConfirmModal } from './ConfirmModal';

interface EquipmentCatalogModalProps {
  aberto: boolean;
  onFechar: () => void;
  onAdicionarItem: (item: PresetEquipment) => void;
}

const POSICOES_DISPONIVEIS: BedZone[] = [
  'Dianteira',
  'Centro-Dianteiro',
  'Centro',
  'Centro-Traseiro',
  'Traseira'
];

export const EquipmentCatalogModal: React.FC<EquipmentCatalogModalProps> = ({
  aberto,
  onFechar,
  onAdicionarItem
}) => {
  const [catalogo, setCatalogo] = useState<PresetEquipment[]>([]);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('Todas');
  const [adicionadoId, setAdicionadoId] = useState<string | null>(null);
  
  // Modo de criação de novo equipamento
  const [modoCriacao, setModoCriacao] = useState<boolean>(false);
  const [novoNome, setNovoNome] = useState('');
  const [novaCategoria, setNovaCategoria] = useState<PresetEquipment['categoria']>('Gerador');
  const [novoComp, setNovoComp] = useState('3.0');
  const [novoLarg, setNovoLarg] = useState('1.2');
  const [novoAlt, setNovoAlt] = useState('1.8');
  const [novoPeso, setNovoPeso] = useState<number | ''>(2500);
  const [novaPosicao, setNovaPosicao] = useState<BedZone>('Centro-Dianteiro');
  const [novaAmarracao, setNovaAmarracao] = useState('4x Cinta Catraca 5T nos olhais');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [erroForm, setErroForm] = useState<string | null>(null);

  // Confirmação de exclusão de equipamento do catálogo
  const [itemParaExcluir, setItemParaExcluir] = useState<PresetEquipment | null>(null);
  const [confirmarRestaurar, setConfirmarRestaurar] = useState<boolean>(false);

  // Carregar catálogo ao abrir o modal
  useEffect(() => {
    if (aberto) {
      setCatalogo(obterCatalogoEquipamentos());
      setModoCriacao(false);
      setErroForm(null);
    }
  }, [aberto]);

  if (!aberto) return null;

  const categorias = ['Todas', 'Gerador', 'QTA', 'Tanque', 'Cabos', 'Banco de Carga', 'Acessórios', 'Outros'];

  const itensFiltrados = catalogo.filter(item => {
    const termo = busca.toLowerCase();
    const matchTermo = 
      item.nome.toLowerCase().includes(termo) ||
      item.descricao.toLowerCase().includes(termo) ||
      item.categoria.toLowerCase().includes(termo);

    if (!matchTermo) return false;
    if (categoriaAtiva === 'Todas') return true;
    return item.categoria === categoriaAtiva;
  });

  const handleAdicionarNaOrdem = (item: PresetEquipment) => {
    onAdicionarItem(item);
    setAdicionadoId(item.nome);
    setTimeout(() => {
      setAdicionadoId(null);
    }, 1500);
  };

  const handleSalvarNovoEquipamento = (inserirNaOrdemAgora: boolean = false) => {
    if (!novoNome.trim()) {
      setErroForm('Por favor, informe o nome ou modelo do equipamento.');
      return;
    }

    const pesoNum = Number(novoPeso);
    if (!pesoNum || pesoNum <= 0) {
      setErroForm('Por favor, informe um peso unitário válido em kg.');
      return;
    }

    const novoEquipamento: PresetEquipment = {
      id: 'custom_eq_' + Date.now(),
      nome: novoNome.trim(),
      categoria: novaCategoria,
      comp: novoComp.trim() || '1.0',
      larg: novoLarg.trim() || '1.0',
      alt: novoAlt.trim() || '1.0',
      pesoUn: pesoNum,
      posicaoSugerida: novaPosicao,
      amarracaoSugerida: novaAmarracao.trim() || '2x Cinta Catraca 3T',
      descricao: novaDescricao.trim() || `Equipamento ${novoNome.trim()} cadastrado no catálogo Essencial Energia.`,
      isCustom: true
    };

    const atualizado = adicionarEquipamentoAoCatalogo(novoEquipamento);
    setCatalogo(atualizado);

    if (inserirNaOrdemAgora) {
      handleAdicionarNaOrdem(novoEquipamento);
    }

    // Resetar formulário
    setModoCriacao(false);
    setNovoNome('');
    setNovaDescricao('');
    setErroForm(null);
  };

  const handleConfirmarExclusaoItem = () => {
    if (!itemParaExcluir) return;
    const atualizado = excluirEquipamentoDoCatalogo(itemParaExcluir.id || itemParaExcluir.nome);
    setCatalogo(atualizado);
    setItemParaExcluir(null);
  };

  const handleRestaurarPadrao = () => {
    const padrao = restaurarCatalogoPadrao();
    setCatalogo(padrao);
    setConfirmarRestaurar(false);
  };

  const getCategoriaIcon = (cat: string) => {
    switch (cat) {
      case 'Gerador': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Tanque': return <Fuel className="w-4 h-4 text-orange-500" />;
      case 'QTA': return <Cpu className="w-4 h-4 text-blue-500" />;
      case 'Cabos': return <Cable className="w-4 h-4 text-emerald-500" />;
      default: return <Boxes className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 no-print animate-in fade-in duration-150">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onFechar}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden z-10">
        
        {/* Header Principal */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500 rounded-lg text-white shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">Catálogo de Equipamentos</h2>
                <span className="text-[10px] font-semibold bg-slate-800 text-orange-400 border border-slate-700 px-2 py-0.5 rounded-full">
                  {catalogo.length} disponíveis
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Selecione geradores, tanques e quadros ou cadastre novos equipamentos para a frota.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* BOTÃO PARA CRIAR EQUIPAMENTO (Requisito Explícito) */}
            <button
              type="button"
              onClick={() => {
                setModoCriacao(!modoCriacao);
                setErroForm(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                modoCriacao
                  ? 'bg-slate-800 text-orange-300 border border-orange-500/40'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
              title="Cadastrar um novo equipamento no catálogo"
            >
              <Plus className="w-4 h-4" />
              <span>{modoCriacao ? 'Fechar Cadastro' : 'Criar Equipamento'}</span>
            </button>

            <button
              type="button"
              onClick={onFechar}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PAINEL DE CRIAÇÃO DE NOVO EQUIPAMENTO */}
        {modoCriacao && (
          <div className="bg-orange-50/70 border-b border-orange-200 p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-500 text-white rounded-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Cadastrar Novo Equipamento no Catálogo
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    O equipamento será salvo permanentemente no catálogo e ficará disponível para todas as ordens.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModoCriacao(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Cancelar
              </button>
            </div>

            {erroForm && (
              <div className="p-2.5 bg-red-100 border border-red-300 text-red-800 rounded-lg text-xs font-medium">
                {erroForm}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {/* Nome */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Nome / Modelo do Equipamento *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Gerador Cummins 350 kVA Silenciado"
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-semibold"
                  autoFocus
                />
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Categoria
                </label>
                <select
                  value={novaCategoria}
                  onChange={e => setNovaCategoria(e.target.value as PresetEquipment['categoria'])}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-medium"
                >
                  <option value="Gerador">Gerador</option>
                  <option value="QTA">QTA</option>
                  <option value="Tanque">Tanque</option>
                  <option value="Cabos">Cabos</option>
                  <option value="Banco de Carga">Banco de Carga</option>
                  <option value="Acessórios">Acessórios</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {/* Peso Unitário */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Peso Unitário (kg) *
                </label>
                <input
                  type="number"
                  placeholder="Ex: 3200"
                  value={novoPeso}
                  onChange={e => setNovoPeso(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-mono font-bold"
                />
              </div>

              {/* Dimensões C x L x A */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Dimensões (Comprimento × Largura × Altura em metros)
                </label>
                <div className="flex items-center gap-1.5 font-mono">
                  <input
                    type="text"
                    placeholder="Comp. (m)"
                    value={novoComp}
                    onChange={e => setNovoComp(e.target.value)}
                    className="w-full text-center bg-white border border-slate-300 rounded-lg py-1.5 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  />
                  <span className="text-slate-400">×</span>
                  <input
                    type="text"
                    placeholder="Larg. (m)"
                    value={novoLarg}
                    onChange={e => setNovoLarg(e.target.value)}
                    className="w-full text-center bg-white border border-slate-300 rounded-lg py-1.5 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  />
                  <span className="text-slate-400">×</span>
                  <input
                    type="text"
                    placeholder="Alt. (m)"
                    value={novoAlt}
                    onChange={e => setNovoAlt(e.target.value)}
                    className="w-full text-center bg-white border border-slate-300 rounded-lg py-1.5 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                  />
                </div>
              </div>

              {/* Posição Recomendada */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Posição Recomendada
                </label>
                <select
                  value={novaPosicao}
                  onChange={e => setNovaPosicao(e.target.value as BedZone)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-medium"
                >
                  {POSICOES_DISPONIVEIS.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>

              {/* Amarração Sugerida */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Amarração Sugerida
                </label>
                <input
                  type="text"
                  placeholder="Ex: 4x Cinta Catraca 5T"
                  value={novaAmarracao}
                  onChange={e => setNovaAmarracao(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 font-medium"
                />
              </div>

              {/* Descrição */}
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Descrição Técnica / Aplicação
                </label>
                <input
                  type="text"
                  placeholder="Ex: Grupo gerador a diesel para regime contínuo/standby com bacia de contenção."
                  value={novaDescricao}
                  onChange={e => setNovaDescricao(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-orange-500 text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-orange-200/80">
              <button
                type="button"
                onClick={() => setModoCriacao(false)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleSalvarNovoEquipamento(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Salvar no Catálogo</span>
              </button>
              <button
                type="button"
                onClick={() => handleSalvarNovoEquipamento(true)}
                className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Salvar e Inserir na O.C.</span>
              </button>
            </div>
          </div>
        )}

        {/* Barra de Pesquisa, Filtro de Categorias e Ações */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Pesquisar por modelo, potência (ex: 500 kVA, 260 kVA, QTA, Tanque, Cabos)..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                autoFocus={!modoCriacao}
              />
            </div>

            {/* Atalho rápido para criar equipamento se não estiver no modo criação */}
            {!modoCriacao && (
              <button
                type="button"
                onClick={() => setModoCriacao(true)}
                className="shrink-0 text-xs font-bold px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-orange-600" />
                <span>+ Novo Equipamento</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
            <div className="flex items-center gap-1.5">
              {categorias.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoriaAtiva(cat)}
                  className={`px-3 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    categoriaAtiva === cat
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Opção para restaurar padrão se modificado */}
            <button
              type="button"
              onClick={() => setConfirmarRestaurar(true)}
              className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 shrink-0"
              title="Restaurar catálogo original de fábrica"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restaurar Padrão</span>
            </button>
          </div>
        </div>

        {/* Lista de Equipamentos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {itensFiltrados.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs space-y-2">
              <Boxes className="w-8 h-8 mx-auto text-slate-300" />
              <p className="font-semibold text-slate-700">Nenhum equipamento correspondente</p>
              <p className="text-slate-500">Tente buscar por termos mais genéricos ou cadastre um novo equipamento.</p>
              <button
                type="button"
                onClick={() => setModoCriacao(true)}
                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Criar Equipamento Agora</span>
              </button>
            </div>
          ) : (
            itensFiltrados.map((item, idx) => {
              const foiAdicionado = adicionadoId === item.nome;
              return (
                <div
                  key={item.id || item.nome + idx}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white ${
                    item.isCustom
                      ? 'border-orange-200 hover:border-orange-400 bg-orange-50/20'
                      : 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/20'
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getCategoriaIcon(item.categoria)}
                      <span className="font-bold text-xs text-slate-900">{item.nome}</span>
                      
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.categoria}
                      </span>

                      {item.isCustom && (
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2 py-0.5 rounded-full">
                          Personalizado
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2">{item.descricao}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 pt-1">
                      <span>Dimensões: <strong>{item.comp} × {item.larg} × {item.alt} m</strong></span>
                      <span>·</span>
                      <span>Posição recomendada: <strong>{item.posicaoSugerida}</strong></span>
                      <span>·</span>
                      <span className="text-orange-700 font-medium">Fixação: {item.amarracaoSugerida}</span>
                    </div>
                  </div>

                  <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                    <div className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                      {item.pesoUn.toLocaleString('pt-BR')} kg
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Botão de Excluir do Catálogo (com confirmação segura) */}
                      <button
                        type="button"
                        onClick={() => setItemParaExcluir(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Excluir este equipamento do catálogo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Botão Inserir na O.C. */}
                      <button
                        type="button"
                        onClick={() => handleAdicionarNaOrdem(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-xs ${
                          foiAdicionado
                            ? 'bg-emerald-600 text-white'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        {foiAdicionado ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Inserido!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Inserir na O.C.</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Itens inseridos na O.C. podem ter quantidades e dimensões ajustadas individualmente.</span>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition-colors"
          >
            Concluir
          </button>
        </div>

      </div>

      {/* Confirmação de Exclusão de Equipamento do Catálogo */}
      <ConfirmModal
        aberto={Boolean(itemParaExcluir)}
        onFechar={() => setItemParaExcluir(null)}
        onConfirmar={handleConfirmarExclusaoItem}
        titulo="Excluir Equipamento do Catálogo?"
        mensagem={
          itemParaExcluir ? (
            <p>
              Tem certeza que deseja remover <strong>"{itemParaExcluir.nome}"</strong> ({itemParaExcluir.pesoUn.toLocaleString('pt-BR')} kg) do catálogo de equipamentos?
            </p>
          ) : ''
        }
        textoConfirmar="Sim, Excluir do Catálogo"
        tipo="perigo"
      />

      {/* Confirmação de Restauração do Catálogo Padrão */}
      <ConfirmModal
        aberto={confirmarRestaurar}
        onFechar={() => setConfirmarRestaurar(false)}
        onConfirmar={handleRestaurarPadrao}
        titulo="Restaurar Catálogo Padrão?"
        mensagem="Esta ação restaurará a lista original de equipamentos padrão da Essencial Energia."
        textoConfirmar="Restaurar Catálogo"
        tipo="aviso"
      />

    </div>
  );
};
