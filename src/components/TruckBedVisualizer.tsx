import React from 'react';
import { 
  Ruler, 
  Layers, 
  ArrowLeft, 
  ArrowRight, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Maximize2,
  Box
} from 'lucide-react';
import { EquipmentItem, VehicleConfig, BedZone } from '../types';
import { CalculationResults, formatarKg, formatarM3 } from '../utils/calculations';

interface TruckBedVisualizerProps {
  equipamentos: EquipmentItem[];
  veiculo: VehicleConfig;
  metricas: CalculationResults;
  onMoverItem: (id: string, novaPosicao: BedZone) => void;
}

const ZONAS_ORDENADAS: { key: BedZone; label: string; sublabel: string }[] = [
  { key: 'Dianteira', label: '1. Dianteira', sublabel: 'Para-cabine' },
  { key: 'Centro-Dianteiro', label: '2. C-Dianteiro', sublabel: 'Eixo Dianteiro' },
  { key: 'Centro', label: '3. Centro', sublabel: 'Vão Central' },
  { key: 'Centro-Traseiro', label: '4. C-Traseiro', sublabel: 'Bogie / Tração' },
  { key: 'Traseira', label: '5. Traseira', sublabel: 'Balanço Traseiro' }
];

export const TruckBedVisualizer: React.FC<TruckBedVisualizerProps> = ({
  equipamentos,
  veiculo,
  metricas,
  onMoverItem
}) => {

  const getProximaZona = (atual: BedZone, direcao: 'esq' | 'dir'): BedZone | null => {
    const idx = ZONAS_ORDENADAS.findIndex(z => z.key === atual);
    if (idx === -1) return null;
    if (direcao === 'esq' && idx > 0) return ZONAS_ORDENADAS[idx - 1].key;
    if (direcao === 'dir' && idx < ZONAS_ORDENADAS.length - 1) return ZONAS_ORDENADAS[idx + 1].key;
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 lg:p-6 space-y-4 w-full min-w-0 print-break-inside-avoid">
      {/* Header do Visualizador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
            <Ruler className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
              Disposição Gráfica da Carga (Planta Técnica da Carroceria)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Esquema longitudinal top-down com balanço de eixos e centro de gravidade (CG)
            </p>
          </div>
        </div>

        {/* Resumo Rápido de Dimensões e Cubagem */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono tabular-nums text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          <div>
            Área: <strong>{metricas.areaPisoM2.toFixed(1)} m²</strong> / {metricas.areaCarroceriaM2.toFixed(1)} m²
            <span className="text-[10px] text-slate-500 ml-1">({metricas.taxaOcupacaoArea.toFixed(0)}% piso)</span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            Volume: <strong>{formatarM3(metricas.volumeTotalM3)}</strong>
          </div>
        </div>
      </div>

      {/* RECORTE GRÁFICO DO CAMINHÃO (TOP-DOWN) */}
      <div className="bg-slate-900 rounded-2xl p-3.5 sm:p-5 shadow-inner border border-slate-800 space-y-4 w-full min-w-0">
        
        {/* Marcador Superior de Orientação de Sentido */}
        <div className="flex justify-between items-center text-white text-xs font-bold border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
            <span className="uppercase tracking-wider text-[11px]">Frente / Sentido de Rodagem</span>
          </div>
          <div className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[280px]">
            {veiculo.modelo} ({veiculo.comprimento}m × {veiculo.largura}m)
          </div>
          <div className="text-[11px] text-slate-400 uppercase tracking-wider shrink-0">
            Traseira / Rampa
          </div>
        </div>

        {/* ESTRUTURA VISUAL DO CAMINHÃO */}
        <div className="relative w-full min-w-0">
          
          {/* Cabine do Veículo (Representação superior) */}
          <div className="mb-2.5 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 rounded-xl p-3 border-2 border-slate-600 shadow-md flex flex-wrap items-center justify-between text-white text-xs gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Retrovisor Esquerdo */}
              <div className="w-2 h-6 bg-slate-600 rounded-xs border border-slate-500 shrink-0" title="Retrovisor Esquerdo" />
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-orange-400 text-xs tracking-wider uppercase leading-none truncate">
                  CABINE DO MOTORISTA
                </span>
                <span className="text-[10px] text-slate-300 mt-0.5 truncate max-w-[180px] sm:max-w-none">
                  {veiculo.motoristaNome ? `Condutor: ${veiculo.motoristaNome}` : 'Cabine & Painel'}
                </span>
              </div>
            </div>

            {/* Para-brisa estilizado */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/70 px-3 py-1 rounded border border-slate-600 text-[10px] text-slate-300 shrink-0">
              <span>Para-brisa</span>
              <span>·</span>
              <span className="font-mono text-white font-bold">{veiculo.placa || 'PLACA S/N'}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-600 text-slate-300 whitespace-nowrap">
                Para-cabine de Aço
              </span>
              {/* Retrovisor Direito */}
              <div className="w-2 h-6 bg-slate-600 rounded-xs border border-slate-500 shrink-0" title="Retrovisor Direito" />
            </div>
          </div>

          {/* CARROCERIA - AS 5 ZONAS ESTRATÉGICAS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 truck-bed-grid p-3 sm:p-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-950/70 min-h-[220px] w-full min-w-0">
            {ZONAS_ORDENADAS.map((zona) => {
              const itensNaZona = equipamentos.filter(e => e.posicao === zona.key);
              const pesoZona = metricas.pesosPorZona[zona.key] || 0;
              const pctZona = metricas.percentuaisPorZona[zona.key] || 0;

              return (
                <div
                  key={zona.key}
                  className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 flex flex-col justify-between min-h-[170px] shadow-sm hover:border-slate-600 transition-colors min-w-0"
                >
                  {/* Cabeçalho da Zona */}
                  <div className="border-b border-slate-800 pb-1.5 mb-2">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-[11px] text-slate-200 truncate">
                        {zona.label}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">
                        {zona.sublabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                      <span className="text-orange-400 font-bold tabular-nums">
                        {pesoZona.toLocaleString('pt-BR')} kg
                      </span>
                      <span className="text-slate-400">
                        {pctZona.toFixed(0)}% carga
                      </span>
                    </div>

                    {/* Mini barra de carga da zona */}
                    <div className="w-full bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                      <div
                        className="bg-orange-500 h-full transition-all duration-300"
                        style={{ width: `${Math.min(pctZona, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Conteúdo / Itens da Zona */}
                  <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[190px] pr-0.5">
                    {itensNaZona.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center p-2 min-h-[70px]">
                        <span className="text-[10px] text-slate-600 italic">
                          Zona desocupada
                        </span>
                      </div>
                    ) : (
                      itensNaZona.map(item => {
                        const subtotal = (Number(item.qtd) || 0) * (Number(item.pesoUn) || 0);
                        const podeMoverEsq = getProximaZona(item.posicao, 'esq') !== null;
                        const podeMoverDir = getProximaZona(item.posicao, 'dir') !== null;

                        return (
                          <div
                            key={item.id}
                            className="bg-slate-800/95 border border-slate-700 hover:border-orange-500/60 p-2 rounded-lg text-left shadow-xs transition-all group min-w-0"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-orange-300 text-[11px] truncate leading-tight" title={item.nome}>
                                {item.qtd}x {item.nome}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 mt-1">
                              <span>{item.comp}×{item.larg}m</span>
                              <span className="font-bold text-white bg-orange-950/80 px-1 rounded border border-orange-800/50 tabular-nums">
                                {subtotal.toLocaleString('pt-BR')} kg
                              </span>
                            </div>

                            {item.amarracao && (
                              <div className="text-[9px] text-slate-400 mt-1 truncate" title={item.amarracao}>
                                ⚓ {item.amarracao}
                              </div>
                            )}

                            {/* Botões de Ação para Reposicionar rapidamente a carga */}
                            <div className="mt-1.5 pt-1 border-t border-slate-700/60 flex items-center justify-between no-print">
                              <button
                                type="button"
                                disabled={!podeMoverEsq}
                                onClick={() => {
                                  const prox = getProximaZona(item.posicao, 'esq');
                                  if (prox) onMoverItem(item.id, prox);
                                }}
                                className="h-5 px-1.5 rounded text-[9px] text-slate-300 bg-slate-700/60 hover:bg-slate-700 hover:text-white disabled:opacity-20 flex items-center gap-0.5 cursor-pointer disabled:cursor-not-allowed transition-colors"
                                title="Mover para zona anterior (frente)"
                              >
                                <ArrowLeft className="w-2.5 h-2.5" /> Frente
                              </button>

                              <button
                                type="button"
                                disabled={!podeMoverDir}
                                onClick={() => {
                                  const prox = getProximaZona(item.posicao, 'dir');
                                  if (prox) onMoverItem(item.id, prox);
                                }}
                                className="h-5 px-1.5 rounded text-[9px] text-slate-300 bg-slate-700/60 hover:bg-slate-700 hover:text-white disabled:opacity-20 flex items-center gap-0.5 cursor-pointer disabled:cursor-not-allowed transition-colors"
                                title="Mover para próxima zona (traseira)"
                              >
                                Trás <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Marcadores Inferiores de Eixos e Pára-choque */}
          <div className="mt-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500 inline-block shrink-0" />
              <span className="text-[11px]">Eixo Direcional Dianteiro (Zonas 1-2)</span>
            </div>

            {/* Faixa Zebrada / Pára-choque Traseiro */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-28 sm:w-32 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_10px,#0f172a_10px,#0f172a_20px)] rounded border border-amber-600 shadow-xs shrink-0" title="Faixa Refletiva Zebrada CONTRAN" />
              <span className="text-[11px]">Pára-choque Homologado</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500 inline-block shrink-0" />
              <span className="text-[11px]">Eixo(s) Traseiro(s) de Tração (Zonas 4-5)</span>
            </div>
          </div>

        </div>

      </div>

      {/* PAINEL DE ENGENHARIA DE DISTRIBUIÇÃO & CENTRO DE GRAVIDADE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
        
        {/* Medidor Longitudinal de Centro de Gravidade (CG) */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 min-w-0 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                <Scale className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Centro de Gravidade Longitudinal (CG)</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                metricas.statusEquilibrio === 'Equilibrado'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {metricas.statusEquilibrio}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Índice de alinhamento entre o centro geométrico da carroceria e o ponto médio de massa da carga.
            </p>
          </div>

          <div className="space-y-1.5 pt-2">
            {/* Régua visual do CG */}
            <div className="relative pt-2 pb-1">
              <div className="w-full h-3 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400 relative border border-slate-300">
                {/* Linha central zero */}
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-900 z-0" />
              </div>

              {/* Marcador móvel do CG */}
              <div
                className="absolute top-0 transform -translate-x-1/2 transition-all duration-300 z-10"
                style={{
                  left: `${Math.min(Math.max(50 + (metricas.indiceCentroGravidade / 2), 5), 95)}%`
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 bg-slate-900 border-2 border-white rounded-full shadow-md" />
                  <span className="text-[9px] font-mono font-bold text-slate-800 mt-0.5 bg-white px-1 rounded shadow-2xs border">
                    CG
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
              <span>◀ Frente (Direcional)</span>
              <span>Centro Ideal (0%)</span>
              <span>Traseira (Tração) ▶</span>
            </div>
          </div>
        </div>

        {/* Estimativa de Peso por Conjunto de Eixos */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Estimativa Técnica por Conjunto de Eixos</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                Tolerância Balança
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200 min-w-0">
                <div className="text-[11px] font-medium text-slate-500 truncate">Eixo Dianteiro (Direcional)</div>
                <div className="font-mono font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                  {metricas.estimativaEixoDianteiroKg.toLocaleString('pt-BR')} kg
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                  ~{metricas.percentualEixoDianteiro.toFixed(0)}% da carga
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200 min-w-0">
                <div className="text-[11px] font-medium text-slate-500 truncate">Eixos Traseiros (Tração)</div>
                <div className="font-mono font-bold text-slate-900 text-sm mt-0.5 tabular-nums">
                  {metricas.estimativaEixoTraseiroKg.toLocaleString('pt-BR')} kg
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
                  ~{metricas.percentualEixoTraseiro.toFixed(0)}% da carga
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-1 leading-snug">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Distribuição adequada evita perda de dirigibilidade dianteira e desgaste de suspensão.</span>
          </div>
        </div>

      </div>

    </div>
  );
};
