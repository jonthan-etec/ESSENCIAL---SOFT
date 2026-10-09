import { LoadingOrder, PresetEquipment } from '../types';
import { SAMPLE_INITIAL_ORDER, EQUIPMENT_CATALOG } from '../data/presets';
import { calcularMetricasCarga } from './calculations';

const STORAGE_KEY = 'essencial_ordens_carregamento_v4';
const CATALOGO_STORAGE_KEY = 'essencial_catalogo_equipamentos_v1';

export function obterOrdensSalvas(): LoadingOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Inicializar com exemplo inicial
      const iniciais = [SAMPLE_INITIAL_ORDER];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(iniciais));
      return iniciais;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [SAMPLE_INITIAL_ORDER];
  } catch (err) {
    console.error('Falha ao obter ordens do localStorage', err);
    return [SAMPLE_INITIAL_ORDER];
  }
}

export function salvarOrdens(ordens: LoadingOrder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ordens));
  } catch (err) {
    console.error('Falha ao salvar ordens no localStorage', err);
  }
}

export function salvarOrdemIndividual(ordem: LoadingOrder): LoadingOrder[] {
  const ordens = obterOrdensSalvas();
  const index = ordens.findIndex(o => o.id === ordem.id);
  const atualizada = {
    ...ordem,
    atualizadoEm: new Date().toISOString()
  };

  let novaLista: LoadingOrder[];
  if (index >= 0) {
    novaLista = [...ordens];
    novaLista[index] = atualizada;
  } else {
    novaLista = [atualizada, ...ordens];
  }

  salvarOrdens(novaLista);
  return novaLista;
}

export function excluirOrdem(id: string): LoadingOrder[] {
  const ordens = obterOrdensSalvas();
  const filtradas = ordens.filter(o => o.id !== id);
  salvarOrdens(filtradas);
  return filtradas;
}

// ==========================================
// CATÁLOGO DE EQUIPAMENTOS (PERSISTÊNCIA)
// ==========================================

export function obterCatalogoEquipamentos(): PresetEquipment[] {
  try {
    const raw = localStorage.getItem(CATALOGO_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CATALOGO_STORAGE_KEY, JSON.stringify(EQUIPMENT_CATALOG));
      return EQUIPMENT_CATALOG;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : EQUIPMENT_CATALOG;
  } catch (err) {
    console.error('Falha ao obter catálogo do localStorage', err);
    return EQUIPMENT_CATALOG;
  }
}

export function salvarCatalogoEquipamentos(catalogo: PresetEquipment[]): void {
  try {
    localStorage.setItem(CATALOGO_STORAGE_KEY, JSON.stringify(catalogo));
  } catch (err) {
    console.error('Falha ao salvar catálogo no localStorage', err);
  }
}

export function adicionarEquipamentoAoCatalogo(item: PresetEquipment): PresetEquipment[] {
  const catalogoAtual = obterCatalogoEquipamentos();
  // Evitar duplicatas exatas pelo nome
  const filtrado = catalogoAtual.filter(eq => eq.nome.toLowerCase() !== item.nome.toLowerCase());
  const novoCatalogo = [{ ...item, isCustom: true }, ...filtrado];
  salvarCatalogoEquipamentos(novoCatalogo);
  return novoCatalogo;
}

export function excluirEquipamentoDoCatalogo(nomeOuId: string): PresetEquipment[] {
  const catalogoAtual = obterCatalogoEquipamentos();
  const novoCatalogo = catalogoAtual.filter(eq => (eq.id ? eq.id !== nomeOuId : eq.nome !== nomeOuId));
  salvarCatalogoEquipamentos(novoCatalogo);
  return novoCatalogo;
}

export function restaurarCatalogoPadrao(): PresetEquipment[] {
  salvarCatalogoEquipamentos(EQUIPMENT_CATALOG);
  return EQUIPMENT_CATALOG;
}

export function exportarOrdensParaJson(ordem?: LoadingOrder): void {
  const dados = ordem ? ordem : obterOrdensSalvas();
  const filename = ordem 
    ? `OC_${ordem.ocNum.replace(/[\/\\]/g, '-')}_Essencial_Energia.json`
    : `Backup_Ordens_Essencial_Energia_${new Date().toISOString().split('T')[0]}.json`;

  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==========================================
// MODO PENDRIVE / SINCRONIZAÇÃO PORTÁTIL
// ==========================================

export interface PendrivePayload {
  versao: string;
  desenvolvedor: string;
  atualizadoEm: string;
  ordens: LoadingOrder[];
  catalogo: PresetEquipment[];
}

export function exportarBackupCompletoPendrive(ordens?: LoadingOrder[], catalogo?: PresetEquipment[]): void {
  const ordensAtuais = ordens || obterOrdensSalvas();
  const catalogoAtual = catalogo || obterCatalogoEquipamentos();

  const payload: PendrivePayload = {
    versao: 'REV 001/2026',
    desenvolvedor: 'Jonthan Oliveira',
    atualizadoEm: new Date().toISOString(),
    ordens: ordensAtuais,
    catalogo: catalogoAtual
  };

  const filename = `dados_pendrive.json`;
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importarBackupCompletoPendrive(jsonStr: string): { 
  success: boolean; 
  ordensCount: number; 
  catalogoCount: number; 
  ordens?: LoadingOrder[];
  catalogo?: PresetEquipment[];
  mensagem: string 
} {
  try {
    const parsed = JSON.parse(jsonStr);

    let ordensImportadas: LoadingOrder[] = [];
    let catalogoImportado: PresetEquipment[] = [];

    // Se o arquivo contiver o formato completo do Pendrive
    if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.ordens)) {
        ordensImportadas = parsed.ordens;
      }
      if (Array.isArray(parsed.catalogo)) {
        catalogoImportado = parsed.catalogo;
      }

      // Se for apenas array de ordens (legado)
      if (Array.isArray(parsed) && parsed.length > 0) {
        if ('ocNum' in parsed[0]) {
          ordensImportadas = parsed;
        } else if ('pesoKg' in parsed[0] || 'potencia' in parsed[0]) {
          catalogoImportado = parsed;
        }
      }

      // Se for uma única ordem
      if ('ocNum' in parsed && !Array.isArray(parsed)) {
        ordensImportadas = [parsed as LoadingOrder];
      }
    }

    if (ordensImportadas.length > 0) {
      salvarOrdens(ordensImportadas);
    }
    if (catalogoImportado.length > 0) {
      salvarCatalogoEquipamentos(catalogoImportado);
    }

    if (ordensImportadas.length === 0 && catalogoImportado.length === 0) {
      return {
        success: false,
        ordensCount: 0,
        catalogoCount: 0,
        mensagem: 'O arquivo selecionado não contém ordens ou equipamentos válidos.'
      };
    }

    return {
      success: true,
      ordensCount: ordensImportadas.length,
      catalogoCount: catalogoImportado.length,
      ordens: ordensImportadas.length > 0 ? ordensImportadas : undefined,
      catalogo: catalogoImportado.length > 0 ? catalogoImportado : undefined,
      mensagem: `Importação realizada com sucesso! (${ordensImportadas.length} ordens e ${catalogoImportado.length} equipamentos carregados)`
    };
  } catch (err) {
    console.error('Erro ao importar backup do pendrive:', err);
    return {
      success: false,
      ordensCount: 0,
      catalogoCount: 0,
      mensagem: 'Formato de arquivo JSON inválido.'
    };
  }
}

export async function verificarConexaoPendriveApi(): Promise<{
  conectado: boolean;
  ordens?: LoadingOrder[];
  catalogo?: PresetEquipment[];
  atualizadoEm?: string;
}> {
  try {
    const res = await fetch('/api/pendrive-data', { cache: 'no-cache' });
    if (!res.ok) return { conectado: false };
    const data = await res.json();
    if (data && (Array.isArray(data.ordens) || Array.isArray(data.catalogo))) {
      return {
        conectado: true,
        ordens: Array.isArray(data.ordens) ? data.ordens : undefined,
        catalogo: Array.isArray(data.catalogo) ? data.catalogo : undefined,
        atualizadoEm: data.atualizadoEm || data.ultimoSalvamento
      };
    }
    return { conectado: true };
  } catch {
    return { conectado: false };
  }
}

export async function salvarNoPendriveApi(ordens: LoadingOrder[], catalogo: PresetEquipment[]): Promise<boolean> {
  try {
    const payload: PendrivePayload = {
      versao: 'REV 001/2026',
      desenvolvedor: 'Jonthan Oliveira',
      atualizadoEm: new Date().toISOString(),
      ordens,
      catalogo
    };
    const res = await fetch('/api/pendrive-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function exportarOrdemParaCsv(ordem: LoadingOrder): void {
  const linhas: string[] = [];
  linhas.push(`ORDEM DE CARREGAMENTO;${ordem.ocNum}`);
  linhas.push(`NOTA FISCAL;${ordem.notaFiscal || 'S/N'}`);
  linhas.push(`QUANTIDADE DE VOLUMES;${ordem.quantidadeVolumes || '-'}`);
  linhas.push(`CLIENTE;${ordem.cliente}`);
  linhas.push(`DESTINO;${ordem.destino}`);
  linhas.push(`DATA;${ordem.data}`);
  linhas.push(`VEICULO;${ordem.veiculo.modelo};PLACA;${ordem.veiculo.placa}`);
  linhas.push(`MOTORISTA;${ordem.veiculo.motoristaNome};TELEFONE;${ordem.veiculo.motoristaTelefone}`);
  linhas.push('');
  linhas.push('ITEM;DESCRICAO;CATEGORIA;QTD;DIMENSOES (CxLxA);PESO UNIT (kg);PESO TOTAL (kg);POSICAO;AMARRACAO;CALCO');

  ordem.equipamentos.forEach((eq, idx) => {
    const pesoTot = (eq.qtd || 0) * (eq.pesoUn || 0);
    linhas.push([
      idx + 1,
      `"${eq.nome}"`,
      `"${eq.categoria || 'Geral'}"`,
      eq.qtd,
      `"${eq.comp} x ${eq.larg} x ${eq.alt} m"`,
      eq.pesoUn,
      pesoTot,
      `"${eq.posicao}"`,
      `"${eq.amarracao}"`,
      eq.calco ? 'SIM' : 'NÃO'
    ].join(';'));
  });

  const metricas = calcularMetricasCarga(ordem.equipamentos, ordem.veiculo);
  linhas.push('');
  linhas.push(`PESO TOTAL DA CARGA;${metricas.pesoTotalCarga} kg`);
  linhas.push(`CAPACIDADE UTIL DO VEICULO;${metricas.capacidadeUtil} kg`);
  linhas.push(`PBT LIMITE;${ordem.veiculo.pbtLimite} kg`);
  linhas.push(`VOLUME ESTIMADO;${metricas.volumeTotalM3.toFixed(2)} m³`);

  const csvContent = '\uFEFF' + linhas.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Carga_OC_${ordem.ocNum.replace(/[\/\\]/g, '-')}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function gerarResumoTextoWhatsApp(ordem: LoadingOrder): string {
  const metricas = calcularMetricasCarga(ordem.equipamentos, ordem.veiculo);
  const dataFmt = ordem.data ? ordem.data.split('-').reverse().join('/') : 'Não informada';

  let txt = `⚡ *ESSENCIAL ENERGIA - ORDEM DE CARREGAMENTO*\n`;
  txt += `📋 *O.C. Nº:* ${ordem.ocNum} | *Status:* ${ordem.status.toUpperCase()}\n`;
  txt += `📑 *NF-e:* ${ordem.notaFiscal || 'A emitir / S/N'} | *Volumes:* ${ordem.quantidadeVolumes || '-'}\n`;
  txt += `📅 *Data:* ${dataFmt} ${ordem.horaPrevista ? `às ${ordem.horaPrevista}` : ''}\n`;
  txt += `🏢 *Cliente:* ${ordem.cliente}\n`;
  txt += `📍 *Destino:* ${ordem.destino} (${ordem.cidadeUf || 'Brasil'})\n\n`;

  txt += `🚛 *DADOS DO TRANSPORTE*\n`;
  txt += `• *Veículo:* ${ordem.veiculo.modelo} | Placa: ${ordem.veiculo.placa || 'A definir'}\n`;
  txt += `• *Motorista:* ${ordem.veiculo.motoristaNome || 'A definir'} | Contato: ${ordem.veiculo.motoristaTelefone || '-'}\n`;
  txt += `• *Carga Total:* ${metricas.pesoTotalCarga.toLocaleString('pt-BR')} kg / Capacidade Útil: ${metricas.capacidadeUtil.toLocaleString('pt-BR')} kg\n\n`;

  txt += `📦 *ITENS CARREGADOS (${ordem.equipamentos.length})*\n`;
  ordem.equipamentos.forEach((item, i) => {
    const tot = (item.qtd || 0) * (item.pesoUn || 0);
    txt += `${i + 1}. [${item.posicao}] ${item.qtd}x ${item.nome} (${tot.toLocaleString('pt-BR')} kg)\n   ↳ Fixação: ${item.amarracao}\n`;
  });

  txt += `\n⚠️ *Orientações:* Re-apertar catracas após os primeiros 10km. CCO: (11) 98765-4321.\n\n_versão desenvolvida por Jonthan Oliveira_`;
  return txt;
}
