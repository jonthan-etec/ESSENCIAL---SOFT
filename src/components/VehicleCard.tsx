import React from 'react';
import { 
  Truck, 
  User, 
  Scale, 
  Ruler, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';
import { VehicleConfig, BodyType } from '../types';
import { VEHICLE_PRESETS } from '../data/presets';
import { CalculationResults, formatarKg } from '../utils/calculations';

interface VehicleCardProps {
  veiculo: VehicleConfig;
  metricas: CalculationResults;
  onChange: (campo: keyof VehicleConfig, valor: any) => void;
  onCarregarPreset: (index: number) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  veiculo,
  metricas,
  onChange,
  onCarregarPreset
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 lg:p-6 space-y-4 w-full min-w-0">
      {/* Header com Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 bg-slate-900 rounded-lg text-orange-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
              Especificações do Veículo & Motorista
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 truncate">
              Capacidade máxima de tração, PBT rodoviário e tara de transporte
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2 text-xs shrink-0">
          <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-500 font-medium">Predefinição:</span>
          <select
            onChange={e => {
              if (e.target.value !== '') {
                onCarregarPreset(Number(e.target.value));
              }
            }}
            defaultValue=""
            className="h-9 bg-slate-50 border border-slate-300 rounded-lg px-2.5 font-medium text-xs text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors cursor-pointer"
          >
            <option value="" disabled>Carregar Modelo de Frota...</option>
            {VEHICLE_PRESETS.map((preset, idx) => (
              <option key={preset.nome} value={idx}>
                {preset.nome} (PBT {preset.pbtLimite.toLocaleString('pt-BR')} kg)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Dados do Veículo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5 text-xs">
        <div className="sm:col-span-2 lg:col-span-2 min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Modelo / Tipo do Veículo *
          </label>
          <input
            type="text"
            value={veiculo.modelo}
            onChange={e => onChange('modelo', e.target.value)}
            placeholder="Ex: IVECO Toco 4x2"
            className="w-full h-9 font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Placa Cavalo / Chassi
          </label>
          <input
            type="text"
            value={veiculo.placa}
            onChange={e => onChange('placa', e.target.value.toUpperCase())}
            placeholder="Ex: ABC-1234"
            className="w-full h-9 font-mono font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 uppercase transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Placa Carreta (se houver)
          </label>
          <input
            type="text"
            value={veiculo.placaCarreta || ''}
            onChange={e => onChange('placaCarreta', e.target.value.toUpperCase())}
            placeholder="Ex: XYZ-9876"
            className="w-full h-9 font-mono bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 uppercase transition-colors"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-2 min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Tipo de Carroceria *
          </label>
          <select
            value={veiculo.tipoCarroceria}
            onChange={e => onChange('tipoCarroceria', e.target.value as BodyType)}
            className="w-full h-9 font-medium bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-900 transition-colors cursor-pointer"
          >
            <option value="CARROCERIA ABERTA">CARROCERIA ABERTA (Graneleira / Toco)</option>
            <option value="SIDER">SIDER (Lona lateral retrátil)</option>
            <option value="BAÚ">BAÚ FECHADO (Alumínio)</option>
            <option value="PRANCHA REBAIXADA">PRANCHA REBAIXADA (Pesados / Içamento)</option>
            <option value="GRADE BAIXA">GRADE BAIXA</option>
          </select>
        </div>
      </div>

      {/* Dimensões e Pesos Regulamentares */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 text-xs pt-0.5">
        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate" title="Comprimento da Carroceria">
            Comprimento (m)
          </label>
          <input
            type="number"
            step="0.1"
            value={veiculo.comprimento}
            onChange={e => onChange('comprimento', parseFloat(e.target.value) || 0)}
            className="w-full h-9 font-mono font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate" title="Largura Útil">
            Largura (m)
          </label>
          <input
            type="number"
            step="0.05"
            value={veiculo.largura}
            onChange={e => onChange('largura', parseFloat(e.target.value) || 0)}
            className="w-full h-9 font-mono font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate" title="Altura da Guarda">
            Altura Guarda (m)
          </label>
          <input
            type="number"
            step="0.05"
            value={veiculo.alturaGuarda}
            onChange={e => onChange('alturaGuarda', parseFloat(e.target.value) || 0)}
            className="w-full h-9 font-mono bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate" title="Tara do Veículo">
            Tara (Vazio kg)
          </label>
          <input
            type="number"
            step="100"
            value={veiculo.tara}
            onChange={e => onChange('tara', parseFloat(e.target.value) || 0)}
            className="w-full h-9 font-mono font-semibold bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate" title="PBT Regulamentar ANTT">
            PBT Máx (kg) *
          </label>
          <input
            type="number"
            step="500"
            value={veiculo.pbtLimite}
            onChange={e => onChange('pbtLimite', parseFloat(e.target.value) || 0)}
            className="w-full h-9 font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-500 mb-1 truncate" title="Carga Útil Líquida Disponível">
            Carga Útil Líquida
          </label>
          <div className="w-full h-9 font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 flex items-center tabular-nums text-xs">
            {formatarKg(metricas.capacidadeUtil)}
          </div>
        </div>
      </div>

      {/* Dados do Motorista / Transportadora */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs pt-1 border-t border-slate-100">
        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Nome do Motorista
          </label>
          <input
            type="text"
            value={veiculo.motoristaNome}
            onChange={e => onChange('motoristaNome', e.target.value)}
            placeholder="Ex: Carlos Eduardo Silveira"
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            CNH / Categoria
          </label>
          <input
            type="text"
            value={veiculo.motoristaCnh}
            onChange={e => onChange('motoristaCnh', e.target.value)}
            placeholder="Ex: 04598231499 - Cat. D"
            className="w-full h-9 font-mono bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Telefone / WhatsApp Motorista
          </label>
          <input
            type="text"
            value={veiculo.motoristaTelefone}
            onChange={e => onChange('motoristaTelefone', e.target.value)}
            placeholder="Ex: (11) 97123-4567"
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>

        <div className="min-w-0">
          <label className="block font-semibold text-slate-700 mb-1 truncate">
            Transportadora / Frota
          </label>
          <input
            type="text"
            value={veiculo.transportadora}
            onChange={e => onChange('transportadora', e.target.value)}
            placeholder="Ex: Essencial Frota Própria"
            className="w-full h-9 bg-white border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Indicadores de Peso e Capacidade */}
      <div className={`p-4 sm:p-5 rounded-xl border text-xs transition-all ${
        metricas.isSobrepeso || metricas.isPbtExcedido
          ? 'bg-red-50 border-red-300 text-red-900'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {metricas.isSobrepeso || metricas.isPbtExcedido ? (
              <span className="flex items-center gap-1.5 font-bold text-red-700 bg-red-100/90 px-2.5 py-1 rounded-md text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                SOBREPESO CRÍTICO: Carga excede capacidade do veículo!
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-md text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                Peso dentro dos limites regulamentares CONTRAN/ANTT
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono tabular-nums text-xs font-semibold shrink-0">
            <span>Carga: <strong className="text-slate-900">{formatarKg(metricas.pesoTotalCarga)}</strong></span>
            <span className="text-slate-300">/</span>
            <span>Lotação: <strong className="text-slate-900">{formatarKg(metricas.capacidadeUtil)}</strong></span>
            <span className="text-slate-300">/</span>
            <span>
              Saldo:{' '}
              <strong className={metricas.saldoCapacidade < 0 ? 'text-red-700' : 'text-emerald-700'}>
                {metricas.saldoCapacidade < 0 ? '-' : '+'}
                {formatarKg(Math.abs(metricas.saldoCapacidade))}
              </strong>
            </span>
          </div>
        </div>

        {/* Barra de Progresso da Carga Útil */}
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden border border-slate-300/80">
          <div
            className={`h-full transition-all duration-300 ${
              metricas.percentualCargaUtil > 100
                ? 'bg-red-600'
                : metricas.percentualCargaUtil > 85
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(metricas.percentualCargaUtil, 100)}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-slate-500 mt-2 font-mono gap-1">
          <span>0 kg (Vazio)</span>
          <span className="font-semibold text-slate-700">{metricas.percentualCargaUtil.toFixed(1)}% da capacidade ocupada</span>
          <span>PBT Máx: {formatarKg(veiculo.pbtLimite)}</span>
        </div>
      </div>

    </div>
  );
};
