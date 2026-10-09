import { LoadingOrder } from '../types';
import { CalculationResults, formatarKg, formatarM3 } from './calculations';

/**
 * Gera um documento de texto (.txt) estritamente formatado para o padrão A4
 * Utiliza largura de 80 colunas (padrão universal para folhas A4 em fontes monoespaçadas)
 * e caracteres de diagramação técnica industrial.
 */
export function gerarDocumentoTxtA4(ordem: LoadingOrder, metricas: CalculationResults): string {
  const LARGURA = 80;
  const linhaDupla = '═'.repeat(LARGURA);
  const linhaSimples = '─'.repeat(LARGURA);
  const linhaDivisoria = '─'.repeat(LARGURA - 4);

  const pad = (str: string, tam: number, alinhamento: 'left' | 'right' | 'center' = 'left') => {
    const texto = (str || '').substring(0, tam);
    if (alinhamento === 'right') return texto.padStart(tam, ' ');
    if (alinhamento === 'center') {
      const sobra = tam - texto.length;
      const esq = Math.floor(sobra / 2);
      const dir = sobra - esq;
      return ' '.repeat(esq) + texto + ' '.repeat(dir);
    }
    return texto.padEnd(tam, ' ');
  };

  const dataFmt = ordem.data ? ordem.data.split('-').reverse().join('/') : '-';
  const linhas: string[] = [];

  // CABEÇALHO DO DOCUMENTO
  linhas.push(linhaDupla);
  linhas.push(`  ESSENCIAL ENERGIA${' '.repeat(38)}REVISÃO: REV 001/2026`);
  linhas.push('  ORDEM DE CARREGAMENTO (O.C.) - GUIA TÉCNICA DE TRANSPORTE');
  linhas.push(linhaDupla);
  linhas.push('');

  // BLOCO 1: CONTROLE E METADADOS
  linhas.push(`┌─ [DADOS DE CONTROLE DA ORDEM] ` + '─'.repeat(48) + '┐');
  linhas.push(`│ O.C. NÚMERO : ${pad(ordem.ocNum, 18)} REVISÃO    : ${pad('REV 001/2026', 24)} │`);
  linhas.push(`│ DATA EMISSÃO: ${pad(`${dataFmt} ${ordem.horaPrevista ? `às ${ordem.horaPrevista}` : ''}`, 18)} STATUS     : ${pad(ordem.status.toUpperCase(), 24)} │`);
  linhas.push(`│ NOTA FISCAL : ${pad(ordem.notaFiscal || 'A emitir / S/N', 18)} PRIORIDADE : ${pad(ordem.prioridade.toUpperCase(), 24)} │`);
  linhas.push(`│ QTD VOLUMES : ${pad(String(ordem.quantidadeVolumes || '-'), 57)} │`);
  linhas.push(`│ CLIENTE     : ${pad(ordem.cliente || '-', 57)} │`);
  linhas.push(`│ PROJETO/OBRA: ${pad(ordem.obraProjeto || '-', 57)} │`);
  linhas.push(`│ DESTINO     : ${pad(ordem.destino || '-', 57)} │`);
  linhas.push(`│ CIDADE / UF : ${pad(ordem.cidadeUf || '-', 57)} │`);
  linhas.push(`│ CONTATO LOC.: ${pad(`${ordem.contatoLocal || '-'} ${ordem.telefoneLocal ? `(${ordem.telefoneLocal})` : ''}`, 57)} │`);
  linhas.push(`└` + linhaDivisoria + `┘`);
  linhas.push('');

  // BLOCO 2: VEÍCULO E MOTORISTA
  linhas.push(`┌─ [VEÍCULO DE TRANSPORTE & CONDUTOR (CONTRAN 552/2015)] ` + '─'.repeat(23) + '┐');
  linhas.push(`│ MODELO/TIPO : ${pad(ordem.veiculo.modelo, 28)} CARROCERIA : ${pad(ordem.veiculo.tipoCarroceria, 16)} │`);
  linhas.push(`│ PLACA CAVALO: ${pad(ordem.veiculo.placa || '-', 12)} PLACA CARRETA: ${pad(ordem.veiculo.placaCarreta || '-', 12)} DIMENSÕES  : ${pad(`${ordem.veiculo.comprimento}m x ${ordem.veiculo.largura}m`, 11)} │`);
  linhas.push(`│ TARA (VAZIO): ${pad(formatarKg(ordem.veiculo.tara), 12)} PBT MÁXIMO    : ${pad(formatarKg(ordem.veiculo.pbtLimite), 12)} LOTAÇÃO ÚTIL: ${pad(formatarKg(metricas.capacidadeUtil), 11)} │`);
  linhas.push(`│ MOTORISTA   : ${pad(ordem.veiculo.motoristaNome || '-', 28)} CNH / CAT  : ${pad(ordem.veiculo.motoristaCnh || '-', 16)} │`);
  linhas.push(`│ CONTATO COND: ${pad(ordem.veiculo.motoristaTelefone || '-', 28)} TRANSPORTE : ${pad(ordem.veiculo.transportadora || '-', 16)} │`);
  linhas.push(`└` + linhaDivisoria + `┘`);
  linhas.push('');

  // BLOCO 3: TABELA DE EQUIPAMENTOS
  linhas.push(`┌─ [RELAÇÃO DE EQUIPAMENTOS E CARGAS CARREGADAS] ` + '─'.repeat(30) + '┐');
  linhas.push(`│ #  DESCRIÇÃO DO EQUIPAMENTO    QTD  DIMENSÕES   PESO UN.   PESO TOTAL  POSIÇÃO │`);
  linhas.push(`├──` + '─'.repeat(28) + `─` + '─'.repeat(4) + `─` + '─'.repeat(11) + `─` + '─'.repeat(10) + `─` + '─'.repeat(11) + `─` + '─'.repeat(8) + `┤`);

  ordem.equipamentos.forEach((item, idx) => {
    const subtotal = (Number(item.qtd) || 0) * (Number(item.pesoUn) || 0);
    const num = pad((idx + 1).toString(), 2, 'right');
    const desc = pad(item.nome, 26);
    const qtd = pad(item.qtd.toString(), 4, 'center');
    const dim = pad(`${item.comp}x${item.larg}x${item.alt}m`, 11, 'center');
    const pUn = pad(item.pesoUn.toLocaleString('pt-BR'), 8, 'right') + 'k';
    const pTot = pad(subtotal.toLocaleString('pt-BR'), 9, 'right') + 'k';
    const pos = pad(item.posicao.substring(0, 7), 7);

    linhas.push(`│ ${num} ${desc} ${qtd} ${dim} ${pUn} ${pTot} ${pos}│`);
    if (item.amarracao) {
      const amarr = pad(`↳ Fixação: ${item.amarracao} ${item.calco ? '[Com Calço]' : ''}`, 74);
      linhas.push(`│    ${amarr}│`);
    }
  });

  linhas.push(`└` + linhaDivisoria + `┘`);
  linhas.push('');

  // BLOCO 4: ENGENHARIA DE DISTRIBUIÇÃO E PESOS
  linhas.push(`┌─ [RESUMO TÉCNICO DE PESOS & DISTRIBUIÇÃO NOS EIXOS] ` + '─'.repeat(25) + '┐');
  linhas.push(`│ PESO TOTAL CARGA: ${pad(formatarKg(metricas.pesoTotalCarga), 14)} │ CAPACIDADE ÚTIL: ${pad(formatarKg(metricas.capacidadeUtil), 14)} │ SALDO: ${pad(formatarKg(metricas.saldoCapacidade), 10)} │`);
  linhas.push(`│ EIXO DIANTEIRO  : ${pad(`${formatarKg(metricas.estimativaEixoDianteiroKg)} (${metricas.percentualEixoDianteiro.toFixed(0)}%)`, 14)} │ EIXO(S) TRASEIRO: ${pad(`${formatarKg(metricas.estimativaEixoTraseiroKg)} (${metricas.percentualEixoTraseiro.toFixed(0)}%)`, 14)} │ CG   : ${pad(metricas.statusEquilibrio, 10)} │`);
  linhas.push(`│ VOLUME ESTIMADO : ${pad(formatarM3(metricas.volumeTotalM3), 14)} │ ÁREA OCUPADA   : ${pad(`${metricas.areaPisoM2.toFixed(1)} m² (${metricas.taxaOcupacaoArea.toFixed(0)}%)`, 14)} │ PBT  : ${pad(formatarKg(metricas.pbtEfetivo), 10)} │`);
  linhas.push(`└` + linhaDivisoria + `┘`);
  linhas.push('');

  // BLOCO 5: CROQUI DAS 5 ZONAS
  linhas.push(`[ESQUEMA DA CARROCERIA - 5 ZONAS LONGITUDINAIS]`);
  linhas.push(` [FRENTE/CABINE] ═════════════════════════════════════════════════ [TRASEIRA]`);
  const z1 = pad(`1.Diant:${metricas.pesosPorZona['Dianteira']}k`, 14);
  const z2 = pad(`2.C-Dia:${metricas.pesosPorZona['Centro-Dianteiro']}k`, 14);
  const z3 = pad(`3.Centr:${metricas.pesosPorZona['Centro']}k`, 14);
  const z4 = pad(`4.C-Tra:${metricas.pesosPorZona['Centro-Traseiro']}k`, 14);
  const z5 = pad(`5.Trase:${metricas.pesosPorZona['Traseira']}k`, 14);
  linhas.push(` │ ${z1}│ ${z2}│ ${z3}│ ${z4}│ ${z5}│`);
  linhas.push(` └─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘`);
  linhas.push('');

  // BLOCO 6: CHECK-LIST DE INSPEÇÃO
  linhas.push(`┌─ [CHECK-LIST DE LIBERAÇÃO OPERACIONAL NO PÁTIO] ` + '─'.repeat(29) + '┐');
  ordem.checklist.forEach(chk => {
    const status = chk.marcado ? '[X]' : '[ ]';
    const desc = pad(`${chk.categoria}: ${chk.descricao}`, 70);
    linhas.push(`│  ${status} ${desc} │`);
  });
  linhas.push(`└` + linhaDivisoria + `┘`);
  linhas.push('');

  // BLOCO 7: DIRETRIZES CONTRAN & OBSERVAÇÕES
  linhas.push(`┌─ [DIRETRIZES DE SEGURANÇA E ROTA] ` + '─'.repeat(43) + '┐');
  linhas.push(`│ • Cintas de poliéster com catracas obrigatórias (CONTRAN 552/2015).             │`);
  linhas.push(`│ • Re-aperto obrigatório das amarras nos primeiros 10km percorridos.            │`);
  linhas.push(`│ • Velocidade máxima recomendada: 80 km/h (pista dupla) / 60 km/h (simples).   │`);
  linhas.push(`│ • Central de Operações Essencial Energia (CCO): (11) 98765-4321               │`);
  linhas.push(`└` + linhaDivisoria + `┘`);
  linhas.push('');

  // BLOCO 8: ASSINATURAS E LIBERAÇÃO
  linhas.push(linhaSimples);
  linhas.push('                       DECLARAÇÃO DE CONFORMIDADE E ACEITE');
  linhas.push(' Declaramos para os devidos fins que a carga vistoriada encontra-se devidamente');
  linhas.push(' amarrada, com centro de gravidade alinhado e peso dentro dos limites legais.');
  linhas.push('');
  linhas.push('   ______________________________________      ______________________________________');
  linhas.push(`   ${pad(ordem.assinaturas.responsavelCarregamento || 'Responsável Técnico - Pátio', 38, 'center')}      ${pad(ordem.veiculo.motoristaNome || 'Motorista / Transportador', 38, 'center')}`);
  linhas.push(`   ${pad(ordem.assinaturas.cargoResponsavel || 'Essencial Energia Logística', 38, 'center')}      ${pad(`CNH: ${ordem.veiculo.motoristaCnh || '-'}`, 38, 'center')}`);
  linhas.push('');
  linhas.push(linhaDupla);
  linhas.push(`  ESSENCIAL ENERGIA · REV 001/2026 · versão desenvolvida por Jonthan Oliveira`);
  linhas.push(`  EMISSÃO: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')} · REVISÃO: REV 001/2026 · FOLHA 1/1 (A4)`);
  linhas.push(linhaDupla);

  return linhas.join('\r\n');
}

/**
 * Função utilitária para fazer o download do arquivo de texto formatado
 */
export function baixarArquivoTxtA4(
  ordem: LoadingOrder,
  metricas: CalculationResults,
  nomeArquivo?: string
): void {
  const conteudo = gerarDocumentoTxtA4(ordem, metricas);
  const nome = nomeArquivo || `Ordem_Carregamento_OC_${ordem.ocNum.replace(/[\/\\]/g, '-')}_A4.txt`;

  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome.endsWith('.txt') ? nome : `${nome}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
