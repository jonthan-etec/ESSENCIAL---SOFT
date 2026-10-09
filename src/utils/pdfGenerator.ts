import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LoadingOrder } from '../types';
import { CalculationResults, formatarKg } from './calculations';

export function gerarPdfNativo(
  ordem: LoadingOrder,
  metricas: CalculationResults,
  nomeArquivo: string
): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const contentWidth = pageWidth - (margin * 2);

    let currentY = margin;

    // 1. CABEÇALHO DA EMPRESA
    // Barra superior colorida
    doc.setFillColor(249, 115, 22); // Orange 500
    doc.rect(margin, currentY, 12, 12, 'F');

    // Símbolo / Letra no quadrado laranja
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('E', margin + 3.8, currentY + 8.5);

    // Nome da Empresa
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('ESSENCIAL ENERGIA', margin + 15, currentY + 6.5);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('REVISÃO: REV 001/2026', margin + 15, currentY + 10.5);

    // Título Central / Selo da O.C.
    doc.setFillColor(15, 23, 42); // Slate 900
    doc.roundedRect(pageWidth - margin - 72, currentY, 72, 12, 1.5, 1.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`ORDEM DE CARREGAMENTO`, pageWidth - margin - 36, currentY + 4.8, { align: 'center' });
    
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`O.C. Nº: ${ordem.ocNum || 'S/N'}  |  REV 001/2026  |  ${ordem.status.toUpperCase()}`, pageWidth - margin - 36, currentY + 9.5, { align: 'center' });

    currentY += 16;

    // Linha divisória
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.setLineWidth(0.4);
    doc.line(margin, currentY, pageWidth - margin, currentY);
    currentY += 4;

    // 2. QUADRO DE METADADOS: CLIENTE, DESTINO E OPERAÇÃO
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.roundedRect(margin, currentY, contentWidth, 21.5, 1.5, 1.5, 'FD');

    doc.setFontSize(7.2);
    const col1X = margin + 3;
    const col2X = margin + (contentWidth / 2) + 2;

    const dataEmissao = ordem.data ? ordem.data.split('-').reverse().join('/') : '-';

    // Linha 1
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.text('Cliente / Contratante:', col1X, currentY + 4.2);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.setFont('helvetica', 'bold');
    doc.text(ordem.cliente || '-', col1X + 30, currentY + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Destino:', col2X, currentY + 4.2);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(ordem.destino || '-', col2X + 24, currentY + 4.2);

    // Linha 2
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Obra / Projeto:', col1X, currentY + 8.4);
    doc.setTextColor(15, 23, 42);
    doc.text(ordem.obraProjeto || '-', col1X + 30, currentY + 8.4);

    doc.setTextColor(71, 85, 105);
    doc.text('Cidade / UF:', col2X, currentY + 8.4);
    doc.setTextColor(15, 23, 42);
    doc.text(ordem.cidadeUf || '-', col2X + 24, currentY + 8.4);

    // Linha 3
    doc.setTextColor(71, 85, 105);
    doc.text('Nota Fiscal (NF-e):', col1X, currentY + 12.6);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(ordem.notaFiscal || 'A emitir / S/N', col1X + 30, currentY + 12.6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Qtd. de Volumes:', col2X, currentY + 12.6);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(String(ordem.quantidadeVolumes ?? '-'), col2X + 24, currentY + 12.6);

    // Linha 4
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Contato no Local:', col1X, currentY + 16.8);
    doc.setTextColor(15, 23, 42);
    doc.text(`${ordem.contatoLocal || '-'} ${ordem.telefoneLocal ? `(${ordem.telefoneLocal})` : ''}`, col1X + 30, currentY + 16.8);

    doc.setTextColor(71, 85, 105);
    doc.text('Data / Saída:', col2X, currentY + 16.8);
    doc.setTextColor(15, 23, 42);
    doc.text(`${dataEmissao} ${ordem.horaPrevista ? `às ${ordem.horaPrevista}` : ''}  |  Prioridade: ${ordem.prioridade.toUpperCase()}`, col2X + 24, currentY + 16.8);

    currentY += 23.5;

    // 3. ESPECIFICAÇÕES DO VEÍCULO E MOTORISTA
    doc.setFillColor(241, 245, 249); // Slate 100
    doc.rect(margin, currentY, contentWidth, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('ESPECIFICAÇÕES DO VEÍCULO DE TRANSPORTE & CONDUTOR', margin + 3, currentY + 3.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('Resolução CONTRAN 552/2015', pageWidth - margin - 3, currentY + 3.5, { align: 'right' });

    currentY += 5;

    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, currentY, contentWidth, 14, 'S');

    doc.setFontSize(7.2);
    const colW = contentWidth / 4;
    
    // Sub-coluna 1
    doc.setTextColor(71, 85, 105);
    doc.text('Veículo:', margin + 2, currentY + 4);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(ordem.veiculo.modelo, margin + 2, currentY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Carroceria: ${ordem.veiculo.tipoCarroceria}`, margin + 2, currentY + 12);

    // Sub-coluna 2
    doc.setTextColor(71, 85, 105);
    doc.text('Placa Cavalo:', margin + colW + 2, currentY + 4);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(ordem.veiculo.placa || '-', margin + colW + 2, currentY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Carreta: ${ordem.veiculo.placaCarreta || '-'}`, margin + colW + 2, currentY + 12);

    // Sub-coluna 3
    doc.setTextColor(71, 85, 105);
    doc.text('Dimensões / Pesos:', margin + (colW * 2) + 2, currentY + 4);
    doc.setTextColor(15, 23, 42);
    doc.text(`${ordem.veiculo.comprimento}m × ${ordem.veiculo.largura}m (Guarda: ${ordem.veiculo.alturaGuarda}m)`, margin + (colW * 2) + 2, currentY + 8);
    doc.text(`Tara: ${formatarKg(ordem.veiculo.tara)} | PBT: ${formatarKg(ordem.veiculo.pbtLimite)}`, margin + (colW * 2) + 2, currentY + 12);

    // Sub-coluna 4
    doc.setTextColor(71, 85, 105);
    doc.text('Motorista:', margin + (colW * 3) + 2, currentY + 4);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(ordem.veiculo.motoristaNome || '-', margin + (colW * 3) + 2, currentY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(`CNH: ${ordem.veiculo.motoristaCnh || '-'}  |  Tel: ${ordem.veiculo.motoristaTelefone || '-'}`, margin + (colW * 3) + 2, currentY + 12);

    currentY += 17;

    // 4. TABELA DE EQUIPAMENTOS (Via jspdf-autotable)
    const tabelaLinhas = ordem.equipamentos.map((item, idx) => {
      const subtotal = (Number(item.qtd) || 0) * (Number(item.pesoUn) || 0);
      return [
        idx + 1,
        item.nome,
        item.qtd,
        `${item.comp} × ${item.larg} × ${item.alt} m`,
        formatarKg(item.pesoUn),
        formatarKg(subtotal),
        item.posicao,
        item.amarracao,
        item.calco ? 'SIM' : 'NÃO'
      ];
    });

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [['#', 'Equipamento / Descrição Técnica', 'Qtd', 'Dimensões (CxLxA)', 'Peso Un.', 'Peso Total', 'Posição', 'Amarração & Travamento', 'Calço']],
      body: tabelaLinhas,
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 7.2,
        fontStyle: 'bold',
        halign: 'left'
      },
      styles: {
        fontSize: 7,
        cellPadding: 1.5,
        textColor: [15, 23, 42],
        valign: 'middle'
      },
      columnStyles: {
        0: { cellWidth: 7, halign: 'center' },
        1: { cellWidth: 50 },
        2: { cellWidth: 10, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 26, halign: 'center' },
        4: { cellWidth: 18, halign: 'right' },
        5: { cellWidth: 20, halign: 'right', fontStyle: 'bold' },
        6: { cellWidth: 22 },
        7: { cellWidth: 28 },
        8: { cellWidth: 9, halign: 'center', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    });

    // Posição Y após tabela
    const finalTableY = (doc as any).lastAutoTable?.finalY || (currentY + 30);
    currentY = finalTableY + 3;

    // 5. RESUMO TÉCNICO DE PESOS & ENGENHARIA DE DISTRIBUIÇÃO
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, currentY, contentWidth, 11, 1.5, 1.5, 'FD');

    const boxW = contentWidth / 4;
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);

    // Box 1
    doc.text('Peso Total da Carga:', margin + 2, currentY + 3.5);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatarKg(metricas.pesoTotalCarga), margin + 2, currentY + 8.5);

    // Box 2
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Capacidade Útil (Lotação):', margin + boxW + 2, currentY + 3.5);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(formatarKg(metricas.capacidadeUtil), margin + boxW + 2, currentY + 8.5);

    // Box 3
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Estimativa Eixo Dianteiro:', margin + (boxW * 2) + 2, currentY + 3.5);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${formatarKg(metricas.estimativaEixoDianteiroKg)} (${metricas.percentualEixoDianteiro.toFixed(0)}%)`, margin + (boxW * 2) + 2, currentY + 8.5);

    // Box 4
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Estimativa Eixo(s) Traseiro(s):', margin + (boxW * 3) + 2, currentY + 3.5);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${formatarKg(metricas.estimativaEixoTraseiroKg)} (${metricas.percentualEixoTraseiro.toFixed(0)}%)`, margin + (boxW * 3) + 2, currentY + 8.5);

    currentY += 14;

    // 6. CROQUI DAS 5 ZONAS NA CARROCERIA
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, currentY, contentWidth, 4.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text('▲ FRENTE / PARA-CABINE', margin + 2, currentY + 3.2);
    doc.text('DISPOSIÇÃO ESQUEMÁTICA NA CARROCERIA', margin + (contentWidth / 2), currentY + 3.2, { align: 'center' });
    doc.text('TRASEIRA ▼', pageWidth - margin - 2, currentY + 3.2, { align: 'right' });

    currentY += 4.5;

    const zonaW = contentWidth / 5;
    const ZONAS = ['Dianteira', 'Centro-Dianteiro', 'Centro', 'Centro-Traseiro', 'Traseira'] as const;

    ZONAS.forEach((zona, zIdx) => {
      const zX = margin + (zIdx * zonaW);
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(255, 255, 255);
      doc.rect(zX, currentY, zonaW, 14, 'FD');

      // Título da Zona
      doc.setFillColor(241, 245, 249);
      doc.rect(zX, currentY, zonaW, 3.5, 'F');
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${zIdx + 1}. ${zona}`, zX + (zonaW / 2), currentY + 2.5, { align: 'center' });

      // Itens na zona
      const itensZona = ordem.equipamentos.filter(e => e.posicao === zona);
      const pesoZona = metricas.pesosPorZona[zona] || 0;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(71, 85, 105);

      if (itensZona.length === 0) {
        doc.text('Desocupado', zX + (zonaW / 2), currentY + 7.5, { align: 'center' });
      } else {
        const itemResumo = itensZona[0];
        doc.text(`${itemResumo.qtd}x ${itemResumo.nome.substring(0, 16)}`, zX + 1.5, currentY + 6.5);
        if (itensZona.length > 1) {
          doc.text(`+ ${itensZona.length - 1} item(ns)`, zX + 1.5, currentY + 9.5);
        }
      }

      // Peso da Zona
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(15, 23, 42);
      doc.text(formatarKg(pesoZona), zX + zonaW - 1.5, currentY + 12.5, { align: 'right' });
    });

    currentY += 17;

    // 7. CHECK-LIST DE VISTORIA (Grade compacta de 2 colunas)
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, currentY, contentWidth, 4.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text('CHECK-LIST DE INSPEÇÃO & LIBERAÇÃO TÉCNICA NO PÁTIO', margin + 2, currentY + 3.2);

    currentY += 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);

    const checkColW = contentWidth / 2;
    ordem.checklist.slice(0, 8).forEach((chk, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const chkX = margin + (col * checkColW) + 2;
      const chkY = currentY + (row * 3.8);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(chk.marcado ? 22 : 148, chk.marcado ? 101 : 163, chk.marcado ? 52 : 184);
      doc.text(chk.marcado ? '[X]' : '[  ]', chkX, chkY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(chk.descricao.substring(0, 65), chkX + 6, chkY);
    });

    currentY += (Math.ceil(Math.min(ordem.checklist.length, 8) / 2) * 3.8) + 2;

    // 8. TERMO DE RESPONSABILIDADE & DIRETRIZES CONTRAN
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, currentY, contentWidth, 8, 'S');
    doc.setFontSize(5.8);
    doc.setTextColor(71, 85, 105);
    const termoTxt = 'Declaração: O condutor e o responsável técnico declaram que o veículo foi carregado respeitando os limites da Resolução CONTRAN 552/2015, com amarrações íntegras e peso balanceado nos eixos. Re-aperto de catracas obrigatório após os primeiros 10km percorridos. Contato de Emergência / CCO Essencial Energia: (11) 98765-4321.';
    doc.text(doc.splitTextToSize(termoTxt, contentWidth - 4), margin + 2, currentY + 3);

    currentY += 12;

    // 9. ASSINATURAS FORMAIS
    const assW = contentWidth / 2;

    // Assinatura Responsável
    doc.setDrawColor(15, 23, 42);
    doc.line(margin + 10, currentY + 6, margin + assW - 10, currentY + 6);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(ordem.assinaturas.responsavelCarregamento || 'Responsável Técnico - Pátio', margin + (assW / 2), currentY + 9.5, { align: 'center' });
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(ordem.assinaturas.cargoResponsavel || 'Essencial Energia Logística', margin + (assW / 2), currentY + 12.5, { align: 'center' });

    // Assinatura Motorista
    doc.line(margin + assW + 10, currentY + 6, pageWidth - margin - 10, currentY + 6);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(ordem.veiculo.motoristaNome || 'Motorista / Transportador', margin + assW + (assW / 2), currentY + 9.5, { align: 'center' });
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`CNH: ${ordem.veiculo.motoristaCnh || '-'}`, margin + assW + (assW / 2), currentY + 12.5, { align: 'center' });

    currentY += 16;

    // 10. RODAPÉ
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, currentY - 2, pageWidth - margin, currentY - 2);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('ESSENCIAL ENERGIA  |  REV 001/2026', margin, currentY + 2);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text('versão desenvolvida por Jonthan Oliveira', margin + (contentWidth / 2), currentY + 2, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`REV 001/2026  |  Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`, pageWidth - margin, currentY + 2, { align: 'right' });

    // SALVAR ARQUIVO PDF
    doc.save(nomeArquivo.endsWith('.pdf') ? nomeArquivo : `${nomeArquivo}.pdf`);
    return true;
  } catch (err) {
    console.error('Erro na geração nativa do PDF:', err);
    return false;
  }
}
