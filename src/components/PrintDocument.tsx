import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';
import { LoadingOrder } from '../types';
import { CalculationResults, formatarKg, formatarM3 } from '../utils/calculations';

interface PrintDocumentProps {
  ordem: LoadingOrder;
  metricas: CalculationResults;
  isModalPreview?: boolean;
}

export const PrintDocument: React.FC<PrintDocumentProps> = ({
  ordem,
  metricas,
  isModalPreview = false
}) => {
  const dataFmt = ordem.data ? ordem.data.split('-').reverse().join('/') : '-';

  return (
    <div
      id="documento-impressao"
      className={`print-document-container bg-white text-slate-900 font-sans ${
        isModalPreview
          ? 'p-6 max-w-[800px] mx-auto shadow-lg border border-slate-300 rounded-lg text-[11px] leading-snug space-y-3.5'
          : 'p-3 text-[9.5px] leading-tight space-y-2.5 print-document-card'
      }`}
    >
      {/* CABEÇALHO DA EMPRESA */}
      <div className="border-b-2 border-slate-900 pb-2.5 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-orange-500 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
            <Zap className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight uppercase leading-none text-slate-900">
              ESSENCIAL ENERGIA
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-500">Documento Oficial</span>
              <span className="text-[8px] font-black font-mono bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded border border-slate-300">
                REV 001/2026
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xs font-black uppercase tracking-wider bg-slate-900 text-white px-3.5 py-1 rounded inline-block shadow-xs">
            ORDEM DE CARREGAMENTO (O.C.)
          </div>
          <p className="text-[8px] text-slate-500 mt-0.5">Documento Operacional de Liberação Rodoviária</p>
          <p className="text-[8px] font-bold text-slate-700 mt-0.5 font-mono">REVISÃO: REV 001/2026</p>
        </div>

        <div className="text-right border border-slate-300 rounded p-1.5 bg-slate-50 min-w-[160px] text-[9.5px]">
          <div className="flex justify-between items-center pb-0.5 mb-1 border-b border-slate-200 text-[8.5px]">
            <span className="text-slate-500 uppercase font-semibold">Revisão:</span>
            <strong className="font-mono text-slate-900 font-bold">REV 001/2026</strong>
          </div>
          <div>O.C. Nº: <strong className="font-mono text-xs text-slate-900">{ordem.ocNum}</strong></div>
          <div>Data: <strong>{dataFmt} {ordem.horaPrevista ? `às ${ordem.horaPrevista}` : ''}</strong></div>
          {ordem.notaFiscal && <div>NF-e Nº: <strong className="font-mono text-slate-900">{ordem.notaFiscal}</strong></div>}
          {ordem.quantidadeVolumes && <div>Volumes: <strong className="font-mono text-slate-900">{ordem.quantidadeVolumes}</strong></div>}
          <div>Status: <strong className="uppercase text-slate-800">{ordem.status}</strong></div>
        </div>
      </div>

      {/* METADADOS DO CLIENTE & DESTINO */}
      <div className="grid grid-cols-2 gap-2 border border-slate-300 rounded-md p-2 bg-slate-50/70 text-[9.5px]">
        <div className="space-y-0.5">
          <div><strong className="text-slate-700">Cliente / Contratante:</strong> <span className="font-semibold text-slate-900">{ordem.cliente || '-'}</span></div>
          <div><strong className="text-slate-700">Obra / Projeto:</strong> {ordem.obraProjeto || '-'}</div>
          <div><strong className="text-slate-700">Contato no Local:</strong> {ordem.contatoLocal || '-'} {ordem.telefoneLocal ? `(${ordem.telefoneLocal})` : ''}</div>
          <div><strong className="text-slate-700">Nota Fiscal (NF-e):</strong> <span className="font-mono font-bold text-slate-900">{ordem.notaFiscal || 'A emitir / S/N'}</span></div>
        </div>
        <div className="space-y-0.5">
          <div><strong className="text-slate-700">Destino / Endereço:</strong> <span className="font-semibold text-slate-900">{ordem.destino || '-'}</span></div>
          <div><strong className="text-slate-700">Cidade / UF:</strong> {ordem.cidadeUf || '-'}</div>
          <div><strong className="text-slate-700">Qtd. de Volumes:</strong> <span className="font-mono font-bold text-slate-900">{ordem.quantidadeVolumes || '-'}</span></div>
          <div><strong className="text-slate-700">Prioridade:</strong> <span className="font-bold uppercase text-slate-900">{ordem.prioridade}</span></div>
        </div>
      </div>

      {/* DADOS DO VEÍCULO E MOTORISTA */}
      <div className="border border-slate-300 rounded-md p-2">
        <div className="font-bold text-[9px] uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-1.5 flex justify-between">
          <span>Especificações do Veículo de Transporte</span>
          <span className="font-mono text-slate-500">Resolução CONTRAN 552/2015</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-[9px]">
          <div>
            <div><strong>Veículo:</strong> {ordem.veiculo.modelo}</div>
            <div><strong>Carroceria:</strong> {ordem.veiculo.tipoCarroceria}</div>
          </div>
          <div>
            <div><strong>Placa Cavalo:</strong> <span className="font-mono font-bold text-slate-900">{ordem.veiculo.placa || '-'}</span></div>
            <div><strong>Placa Carreta:</strong> <span className="font-mono text-slate-900">{ordem.veiculo.placaCarreta || '-'}</span></div>
          </div>
          <div>
            <div><strong>Dimensões:</strong> {ordem.veiculo.comprimento}m × {ordem.veiculo.largura}m (Guarda: {ordem.veiculo.alturaGuarda}m)</div>
            <div><strong>Tara:</strong> {formatarKg(ordem.veiculo.tara)} | <strong>PBT:</strong> {formatarKg(ordem.veiculo.pbtLimite)}</div>
          </div>
          <div>
            <div><strong>Motorista:</strong> {ordem.veiculo.motoristaNome || '-'}</div>
            <div><strong>CNH:</strong> {ordem.veiculo.motoristaCnh || '-'} | <strong>Tel:</strong> {ordem.veiculo.motoristaTelefone || '-'}</div>
          </div>
        </div>
      </div>

      {/* TABELA DE EQUIPAMENTOS */}
      <div className="border border-slate-300 rounded-md overflow-hidden">
        <div className="bg-slate-900 text-white font-bold text-[9px] px-2.5 py-1 uppercase tracking-wider flex justify-between items-center">
          <span>Itens e Cargas Carregadas ({ordem.equipamentos.length} itens)</span>
          <span className="font-mono font-normal text-[8.5px] text-slate-300">Total: {formatarKg(metricas.pesoTotalCarga)}</span>
        </div>
        <table className="w-full text-left text-[9px] border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
              <th className="p-1 pl-2 w-6 text-center">#</th>
              <th className="p-1">Equipamento / Descrição Técnica</th>
              <th className="p-1 w-10 text-center">Qtd</th>
              <th className="p-1 w-24 text-center">Dimensões (CxLxA)</th>
              <th className="p-1 w-18 text-right">Peso Un.</th>
              <th className="p-1 w-20 text-right">Subtotal</th>
              <th className="p-1 w-24">Posição Carroceria</th>
              <th className="p-1 w-32">Amarração & Travamento</th>
              <th className="p-1 w-12 text-center">Calço</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {ordem.equipamentos.map((item, idx) => {
              const subtotal = (Number(item.qtd) || 0) * (Number(item.pesoUn) || 0);
              return (
                <tr key={item.id} className="leading-snug">
                  <td className="p-1 pl-2 font-mono text-center text-slate-500">{idx + 1}</td>
                  <td className="p-1 font-semibold text-slate-900">{item.nome}</td>
                  <td className="p-1 text-center font-mono font-bold">{item.qtd}</td>
                  <td className="p-1 text-center font-mono text-slate-600">{item.comp}×{item.larg}×{item.alt}m</td>
                  <td className="p-1 text-right font-mono">{formatarKg(item.pesoUn)}</td>
                  <td className="p-1 text-right font-mono font-bold text-slate-900">{formatarKg(subtotal)}</td>
                  <td className="p-1 font-medium">{item.posicao}</td>
                  <td className="p-1 text-slate-700">{item.amarracao}</td>
                  <td className="p-1 text-center font-bold">{item.calco ? 'SIM' : 'NÃO'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* RESUMO TÉCNICO DE PESOS & ENGENHARIA */}
      <div className="grid grid-cols-4 gap-2 p-2 border border-slate-300 rounded-md bg-slate-50 text-[9px]">
        <div>
          <div className="text-slate-500">Peso Total da Carga:</div>
          <div className="font-mono font-bold text-xs text-slate-900">{formatarKg(metricas.pesoTotalCarga)}</div>
        </div>
        <div>
          <div className="text-slate-500">Capacidade Útil (Lotação):</div>
          <div className="font-mono font-bold text-xs text-slate-900">{formatarKg(metricas.capacidadeUtil)}</div>
        </div>
        <div>
          <div className="text-slate-500">Estimativa Eixo Dianteiro:</div>
          <div className="font-mono font-bold text-xs text-slate-900">
            {formatarKg(metricas.estimativaEixoDianteiroKg)} ({metricas.percentualEixoDianteiro.toFixed(0)}%)
          </div>
        </div>
        <div>
          <div className="text-slate-500">Estimativa Eixo(s) Traseiro(s):</div>
          <div className="font-mono font-bold text-xs text-slate-900">
            {formatarKg(metricas.estimativaEixoTraseiroKg)} ({metricas.percentualEixoTraseiro.toFixed(0)}%)
          </div>
        </div>
      </div>

      {/* ESQUEMA GRÁFICO RESUMIDO DAS 5 ZONAS NA CARROCERIA */}
      <div className="border border-slate-300 rounded-md p-2">
        <div className="flex justify-between items-center text-[8.5px] font-bold uppercase mb-1 text-slate-700">
          <span>▲ FRENTE / PARA-CABINE</span>
          <span>DISPOSIÇÃO ESQUEMÁTICA NA CARROCERIA</span>
          <span>TRASEIRA ▼</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5 text-[8px]">
          {(['Dianteira', 'Centro-Dianteiro', 'Centro', 'Centro-Traseiro', 'Traseira'] as const).map((zona, zIdx) => {
            const itens = ordem.equipamentos.filter(i => i.posicao === zona);
            const peso = metricas.pesosPorZona[zona] || 0;
            return (
              <div key={zona} className="border border-slate-300 rounded p-1.5 bg-white min-h-[52px] flex flex-col justify-between">
                <div className="font-bold border-b border-slate-200 pb-0.5 text-center bg-slate-100 rounded-xs text-[7.5px]">
                  {zIdx + 1}. {zona}
                </div>
                <div className="text-[7.5px] space-y-0.5 my-1">
                  {itens.length === 0 ? (
                    <span className="text-slate-400 italic block text-center">Vazio</span>
                  ) : (
                    itens.map(i => (
                      <div key={i.id} className="truncate text-slate-800 leading-tight">
                        • {i.qtd}x {i.nome}
                      </div>
                    ))
                  )}
                </div>
                <div className="font-mono font-bold text-right text-[7.5px] pt-0.5 border-t border-slate-200 text-slate-900">
                  {formatarKg(peso)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHECKLIST DE VISTORIA */}
      <div className="border border-slate-300 rounded-md p-2">
        <div className="font-bold text-[9px] uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-1">
          Check-list de Inspeção & Liberação Técnica no Pátio
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[8px]">
          {ordem.checklist.map(chk => (
            <div key={chk.id} className="flex items-center gap-1.5 leading-snug">
              <span className="font-bold font-mono text-slate-900">[{chk.marcado ? '✓' : ' '}]</span>
              <span className={chk.marcado ? 'text-slate-800' : 'text-slate-400'}>{chk.descricao}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ORIENTAÇÕES E TERMO DE SEGURANÇA */}
      <div className="border border-slate-300 rounded-md p-2 space-y-1.5">
        <p className="text-[8px] text-slate-600 leading-tight">
          <strong>Diretrizes Operacionais:</strong> Cintas têxteis de poliéster com catraca aplicadas em todos os equipamentos pesados. Proibido uso de cordas. Re-aperto obrigatório das amarras nos primeiros 10km percorridos. Velocidade máxima permitida: 80 km/h. Em caso de pane ou desvio: CCO Essencial Energia (11) 98765-4321.
        </p>

        {/* ASSINATURAS FORMAIS */}
        <div className="grid grid-cols-2 gap-8 pt-3 text-center text-[9px]">
          <div className="border-t border-slate-400 pt-1">
            <strong className="text-slate-900 block">{ordem.assinaturas.responsavelCarregamento || 'Responsável Técnico - Pátio'}</strong>
            <div className="text-[8px] text-slate-500">{ordem.assinaturas.cargoResponsavel || 'Essencial Energia Logística'}</div>
          </div>
          <div className="border-t border-slate-400 pt-1">
            <strong className="text-slate-900 block">{ordem.veiculo.motoristaNome || 'Motorista / Transportador'}</strong>
            <div className="text-[8px] text-slate-500">CNH: {ordem.veiculo.motoristaCnh || '-'}</div>
          </div>
        </div>
      </div>

      {/* RODAPÉ DO DOCUMENTO */}
      <div className="border-t border-slate-300 pt-1 text-[8px] text-slate-500 space-y-0.5">
        <div className="flex justify-between items-center font-medium">
          <div className="flex items-center gap-1.5">
            <span>ESSENCIAL ENERGIA</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-300">
              REV 001/2026
            </span>
          </div>
          <span className="text-slate-800 font-bold">versão desenvolvida por Jonthan Oliveira</span>
          <div className="flex items-center gap-1.5">
            <span>Revisão: <strong className="font-mono font-bold text-slate-900">REV 001/2026</strong></span>
            <span className="text-slate-400">•</span>
            <span>Emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
