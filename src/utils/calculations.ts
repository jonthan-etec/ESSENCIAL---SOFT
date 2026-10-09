import { EquipmentItem, VehicleConfig, BedZone } from '../types';

export interface CalculationResults {
  pesoTotalCarga: number;
  capacidadeUtil: number;
  pbtEfetivo: number;
  saldoCapacidade: number;
  percentualPbt: number;
  percentualCargaUtil: number;
  isSobrepeso: boolean;
  isPbtExcedido: boolean;
  
  volumeTotalM3: number;
  areaPisoM2: number;
  areaCarroceriaM2: number;
  taxaOcupacaoArea: number;
  
  pesosPorZona: Record<BedZone, number>;
  percentuaisPorZona: Record<BedZone, number>;
  
  estimativaEixoDianteiroKg: number;
  estimativaEixoTraseiroKg: number;
  percentualEixoDianteiro: number;
  percentualEixoTraseiro: number;
  
  indiceCentroGravidade: number; // -100 (muito à frente) a +100 (muito atrás), 0 ideal
  statusEquilibrio: 'Equilibrado' | 'Carga Frontal Excessiva' | 'Carga Traseira Excessiva' | 'Vazio';
}

export function calcularMetricasCarga(
  equipamentos: EquipmentItem[],
  veiculo: VehicleConfig
): CalculationResults {
  // 1. Pesos Totais
  const pesoTotalCarga = equipamentos.reduce((acc, item) => {
    const qtd = Number(item.qtd) || 0;
    const pesoUn = Number(item.pesoUn) || 0;
    return acc + (qtd * pesoUn);
  }, 0);

  const pbtLimite = Number(veiculo.pbtLimite) || 0;
  const tara = Number(veiculo.tara) || 0;
  const capacidadeUtil = Math.max(0, pbtLimite - tara);
  const pbtEfetivo = tara + pesoTotalCarga;
  const saldoCapacidade = capacidadeUtil - pesoTotalCarga;

  const percentualPbt = pbtLimite > 0 ? (pbtEfetivo / pbtLimite) * 100 : 0;
  const percentualCargaUtil = capacidadeUtil > 0 ? (pesoTotalCarga / capacidadeUtil) * 100 : 0;
  const isSobrepeso = pesoTotalCarga > capacidadeUtil && capacidadeUtil > 0;
  const isPbtExcedido = pbtEfetivo > pbtLimite && pbtLimite > 0;

  // 2. Volumes e Área
  let volumeTotalM3 = 0;
  let areaPisoM2 = 0;

  equipamentos.forEach(item => {
    const qtd = Number(item.qtd) || 0;
    const c = parseFloat(item.comp) || 0;
    const l = parseFloat(item.larg) || 0;
    const a = parseFloat(item.alt) || 0;

    volumeTotalM3 += qtd * (c * l * a);
    areaPisoM2 += qtd * (c * l);
  });

  const areaCarroceriaM2 = (Number(veiculo.comprimento) || 0) * (Number(veiculo.largura) || 0);
  const taxaOcupacaoArea = areaCarroceriaM2 > 0 ? (areaPisoM2 / areaCarroceriaM2) * 100 : 0;

  // 3. Distribuição por Zona
  const pesosPorZona: Record<BedZone, number> = {
    'Dianteira': 0,
    'Centro-Dianteiro': 0,
    'Centro': 0,
    'Centro-Traseiro': 0,
    'Traseira': 0
  };

  equipamentos.forEach(item => {
    const subtotal = (Number(item.qtd) || 0) * (Number(item.pesoUn) || 0);
    if (pesosPorZona[item.posicao] !== undefined) {
      pesosPorZona[item.posicao] += subtotal;
    } else {
      pesosPorZona['Centro'] += subtotal;
    }
  });

  const percentuaisPorZona: Record<BedZone, number> = {
    'Dianteira': pesoTotalCarga > 0 ? (pesosPorZona['Dianteira'] / pesoTotalCarga) * 100 : 0,
    'Centro-Dianteiro': pesoTotalCarga > 0 ? (pesosPorZona['Centro-Dianteiro'] / pesoTotalCarga) * 100 : 0,
    'Centro': pesoTotalCarga > 0 ? (pesosPorZona['Centro'] / pesoTotalCarga) * 100 : 0,
    'Centro-Traseiro': pesoTotalCarga > 0 ? (pesosPorZona['Centro-Traseiro'] / pesoTotalCarga) * 100 : 0,
    'Traseira': pesoTotalCarga > 0 ? (pesosPorZona['Traseira'] / pesoTotalCarga) * 100 : 0
  };

  // 4. Estimativa Técnica de Carga nos Eixos
  // Dianteira concentra 85% no eixo direcional, Centro-Dianteiro 60%, Centro 35%, Centro-Traseiro 15%, Traseira 5%
  const estimativaEixoDianteiroKg = Math.round(
    pesosPorZona['Dianteira'] * 0.85 +
    pesosPorZona['Centro-Dianteiro'] * 0.60 +
    pesosPorZona['Centro'] * 0.35 +
    pesosPorZona['Centro-Traseiro'] * 0.15 +
    pesosPorZona['Traseira'] * 0.05
  );

  const estimativaEixoTraseiroKg = Math.max(0, pesoTotalCarga - estimativaEixoDianteiroKg);

  const percentualEixoDianteiro = pesoTotalCarga > 0 ? (estimativaEixoDianteiroKg / pesoTotalCarga) * 100 : 0;
  const percentualEixoTraseiro = pesoTotalCarga > 0 ? (estimativaEixoTraseiroKg / pesoTotalCarga) * 100 : 0;

  // 5. Índice de Centro de Gravidade Longitudinal (-100 a +100)
  // Pesos ponderados: Dianteira: -100, C-Dianteiro: -50, Centro: 0, C-Traseiro: +50, Traseira: +100
  let indiceCentroGravidade = 0;
  let statusEquilibrio: CalculationResults['statusEquilibrio'] = 'Vazio';

  if (pesoTotalCarga > 0) {
    const somaPonderada =
      (pesosPorZona['Dianteira'] * -100) +
      (pesosPorZona['Centro-Dianteiro'] * -50) +
      (pesosPorZona['Centro'] * 0) +
      (pesosPorZona['Centro-Traseiro'] * 50) +
      (pesosPorZona['Traseira'] * 100);

    indiceCentroGravidade = Math.round(somaPonderada / pesoTotalCarga);

    if (indiceCentroGravidade < -40) {
      statusEquilibrio = 'Carga Frontal Excessiva';
    } else if (indiceCentroGravidade > 40) {
      statusEquilibrio = 'Carga Traseira Excessiva';
    } else {
      statusEquilibrio = 'Equilibrado';
    }
  }

  return {
    pesoTotalCarga,
    capacidadeUtil,
    pbtEfetivo,
    saldoCapacidade,
    percentualPbt,
    percentualCargaUtil,
    isSobrepeso,
    isPbtExcedido,
    volumeTotalM3,
    areaPisoM2,
    areaCarroceriaM2,
    taxaOcupacaoArea,
    pesosPorZona,
    percentuaisPorZona,
    estimativaEixoDianteiroKg,
    estimativaEixoTraseiroKg,
    percentualEixoDianteiro,
    percentualEixoTraseiro,
    indiceCentroGravidade,
    statusEquilibrio
  };
}

export function formatarKg(val: number): string {
  return val.toLocaleString('pt-BR') + ' kg';
}

export function formatarM3(val: number): string {
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' m³';
}
