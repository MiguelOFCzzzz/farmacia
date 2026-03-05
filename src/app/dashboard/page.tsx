"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Package, 
  TrendingUp, 
  Users, 
  Activity,
  Download,
  Calendar,
  Filter
} from "lucide-react";

export default function DashboardPage() {
  // Estado para controlar o filtro de tempo
  const [periodo, setPeriodo] = useState("mes");
  const [exportando, setExportando] = useState(false);

  // Função simulando a exportação de relatório
  const exportarRelatorio = () => {
    setExportando(true);
    setTimeout(() => {
      alert("Relatório gerencial exportado com sucesso (PDF/Excel)!");
      setExportando(false);
    }, 1500);
  };

  // MOCK DE DADOS BASEADOS NO PERÍODO SELECIONADO
  const dados = {
    semana: {
      metricas: [
        { titulo: "Total em Estoque", valor: "15.430", icone: <Package className="w-6 h-6 text-blue-600" />, cor: "bg-blue-100" },
        { titulo: "Atendimentos (Semana)", valor: "312", icone: <Users className="w-6 h-6 text-green-600" />, cor: "bg-green-100" },
        { titulo: "Estoque Baixo", valor: "15", icone: <AlertTriangle className="w-6 h-6 text-red-600" />, cor: "bg-red-100" },
        { titulo: "Lotes Vencendo (30d)", valor: "3", icone: <Activity className="w-6 h-6 text-orange-600" />, cor: "bg-orange-100" },
      ],
      maisEntregues: [
        { nome: "Dipirona 500mg", saídas: "180 un.", tendencia: "+5%" },
        { nome: "Losartana 50mg", saídas: "120 un.", tendencia: "-2%" },
        { nome: "Paracetamol 750mg", saídas: "95 un.", tendencia: "+12%" },
      ],
      topMedicos: [
        { nome: "Dr. Carlos Mendes", ubs: "UBS Centro", receitas: 45 },
        { nome: "Dra. Ana Costa", ubs: "UBS Zona Sul", receitas: 32 },
        { nome: "Dr. Roberto Silva", ubs: "UBS Norte", receitas: 28 },
      ]
    },
    mes: {
      metricas: [
        { titulo: "Total em Estoque", valor: "15.430", icone: <Package className="w-6 h-6 text-blue-600" />, cor: "bg-blue-100" },
        { titulo: "Atendimentos (Mês)", valor: "1.284", icone: <Users className="w-6 h-6 text-green-600" />, cor: "bg-green-100" },
        { titulo: "Estoque Baixo", valor: "12", icone: <AlertTriangle className="w-6 h-6 text-red-600" />, cor: "bg-red-100" },
        { titulo: "Lotes Vencendo (30d)", valor: "3", icone: <Activity className="w-6 h-6 text-orange-600" />, cor: "bg-orange-100" },
      ],
      maisEntregues: [
        { nome: "Dipirona 500mg", saídas: "840 un.", tendencia: "+15%" },
        { nome: "Losartana 50mg", saídas: "620 un.", tendencia: "+8%" },
        { nome: "Paracetamol 750mg", saídas: "590 un.", tendencia: "-4%" },
      ],
      topMedicos: [
        { nome: "Dr. Carlos Mendes", ubs: "UBS Centro", receitas: 145 },
        { nome: "Dra. Ana Costa", ubs: "UBS Zona Sul", receitas: 112 },
        { nome: "Dr. Roberto Silva", ubs: "UBS Norte", receitas: 98 },
      ]
    }
  };

  // Dados que não mudam de acordo com o período passado (visão atual)
  const estoqueBaixo = [
    { nome: "Amoxicilina 500mg", quantidade: "15 cx", status: "Crítico", aviso: "Abaixo da margem de segurança" },
    { nome: "Ibuprofeno 400mg", quantidade: "22 cx", status: "Crítico", aviso: "Estoque para 3 dias" },
    { nome: "Losartana 50mg", quantidade: "40 cx", status: "Atenção", aviso: "Reposição recomendada" },
  ];

  // Seleciona os dados baseados no estado 'periodo' (tipagem segura para chave do objeto)
  const dadosAtuais = dados[periodo as keyof typeof dados];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <LayoutDashboard className="w-6 h-6 mr-2 text-blue-600" />
            Dashboard Gerencial
          </h1>
          <p className="text-gray-500 text-sm mt-1">Visão geral do sistema, entregas e alertas de estoque.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filtro de Período */}
          <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
            <div className="px-3 text-gray-400 border-r border-gray-200 bg-gray-50 flex items-center">
              <Calendar className="w-4 h-4" />
            </div>
            <select 
              value={periodo} 
              onChange={(e) => setPeriodo(e.target.value)}
              className="px-4 py-2 text-sm font-medium text-gray-700 outline-none cursor-pointer bg-white"
            >
              <option value="semana">Últimos 7 Dias</option>
              <option value="mes">Este Mês</option>
            </select>
          </div>

          {/* Botão Exportar */}
          <button 
            onClick={exportarRelatorio}
            disabled={exportando}
            className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm ${
              exportando ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-600"
            }`}
          >
            <Download className={`w-4 h-4 mr-2 ${exportando ? "animate-pulse" : ""}`} />
            {exportando ? "Gerando PDF..." : "Exportar Relatório"}
          </button>
        </div>
      </div>

      {/* Cards de Métricas (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dadosAtuais.metricas.map((metrica, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center transform transition-transform hover:scale-[1.02]">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-4 shadow-inner ${metrica.cor}`}>
              {metrica.icone}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{metrica.titulo}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{metrica.valor}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Informações Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Alertas de Estoque Baixo */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
            <h2 className="text-base font-semibold text-gray-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              Atenção: Estoque Baixo
            </h2>
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">{estoqueBaixo.length} alertas</span>
          </div>
          <div className="p-5 space-y-4 flex-1">
            {estoqueBaixo.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:border-red-200 transition-colors">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{item.nome}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.aviso}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md block mb-1 ${item.status === 'Crítico' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                    {item.status}
                  </span>
                  <p className="text-sm font-bold text-gray-700">{item.quantidade}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
          
          </div>
        </div>

        {/* Medicamentos Mais Entregues */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              Top Saídas ({periodo === 'mes' ? 'Mensal' : 'Semanal'})
            </h2>
          </div>
          <div className="p-5 space-y-4 flex-1">
            {dadosAtuais.maisEntregues.map((item, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-200 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-800' : 'bg-blue-50 text-blue-600'}`}>
                    {i + 1}
                  </span>
                  <p className="font-semibold text-gray-800 text-sm">{item.nome}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className="text-sm font-bold text-gray-700">{item.saídas}</p>
                  <span className={`text-xs font-medium ${item.tendencia.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                    {item.tendencia}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Médicos que Mais Receitaram */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-base font-semibold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-500" />
              Top Médicos Prescritores
            </h2>
          </div>
          <div className="p-5 space-y-4 flex-1">
            {dadosAtuais.topMedicos.map((medico, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{medico.nome}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{medico.ubs}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800 bg-green-50 text-green-700 px-2 py-1 rounded-md">{medico.receitas}</p>
                  <p className="text-[10px] text-gray-400 uppercase mt-1">Receitas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}