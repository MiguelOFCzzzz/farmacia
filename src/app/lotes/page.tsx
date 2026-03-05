"use client";

import { useState, FormEvent } from "react";
import { Package, Search, Plus, Edit, Trash2, X, Info } from "lucide-react";

// Tipagens rigorosas para evitar erros do TypeScript
type ItemLote = {
  medicamentoId: number;
  medicamentoNome: string;
  quantidade: number;
};

type Lote = {
  id: number;
  nome: string;
  dataValidade: string;
  dataEntrada: string;
  itens: ItemLote[];
};

// Mock de medicamentos disponíveis
const medicamentosDisponiveis = [
  { id: 1, nome: "Dipirona Monoidratada 500mg" },
  { id: 2, nome: "Amoxicilina 500mg" },
  { id: 3, nome: "Xarope de Guaco 120ml" },
  { id: 4, nome: "Losartana Potássica 50mg" }
];

// Dados Iniciais (Mock)
const dadosIniciais: Lote[] = [
  {
    id: 1,
    nome: "Lote A-2026",
    dataValidade: "2026-12-31",
    dataEntrada: "2026-02-15",
    itens: [
      { medicamentoId: 1, medicamentoNome: "Dipirona Monoidratada 500mg", quantidade: 100 },
      { medicamentoId: 2, medicamentoNome: "Amoxicilina 500mg", quantidade: 50 }
    ]
  },
  {
    id: 2,
    nome: "Lote B-Urgência",
    dataValidade: "2026-03-10",
    dataEntrada: "2026-01-10",
    itens: [
      { medicamentoId: 4, medicamentoNome: "Losartana Potássica 50mg", quantidade: 20 }
    ]
  }
];

// Objeto base para evitar undefined no formulário
const loteVazio: Lote = {
  id: 0,
  nome: "",
  dataValidade: "",
  dataEntrada: "",
  itens: []
};

export default function LotesPage() {
  const [lotes, setLotes] = useState<Lote[]>(dadosIniciais);
  const [busca, setBusca] = useState("");
  
  const [modalAberto, setModalAberto] = useState(false);
  const [loteAtual, setLoteAtual] = useState<Lote>(loteVazio);
  
  const [itemSelecionado, setItemSelecionado] = useState("");
  const [qtdSelecionada, setQtdSelecionada] = useState("");

  const obterStatusLote = (lote: Lote) => {
    const hoje = new Date().toISOString().split('T')[0];
    const totalQtd = lote.itens.reduce((acc, item) => acc + item.quantidade, 0);
    
    if (lote.dataValidade < hoje) return { texto: "Vencido", cor: "bg-red-100 text-red-800" };
    if (totalQtd === 0) return { texto: "Esgotado", cor: "bg-gray-100 text-gray-800" };
    
    const dataVal = new Date(lote.dataValidade);
    const dataHoje = new Date();
    const diffTempo = Math.abs(dataVal.getTime() - dataHoje.getTime());
    const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24)); 
    
    if (diffDias <= 30) return { texto: "Vence em breve", cor: "bg-orange-100 text-orange-800" };
    
    return { texto: "Ativo", cor: "bg-green-100 text-green-800" };
  };

  const lotesFiltrados = lotes.filter(lote => 
    lote.nome.toLowerCase().includes(busca.toLowerCase()) ||
    lote.itens.some(item => item.medicamentoNome.toLowerCase().includes(busca.toLowerCase()))
  );

  const deletarLote = (id: number) => {
    if(window.confirm("Tem certeza que deseja excluir este Lote? Isso removerá as quantidades do estoque!")) {
      setLotes(lotes.filter(l => l.id !== id));
    }
  };

  const abrirModal = (lote?: Lote) => {
    if (lote) {
      // Clona o objeto para não editar a tabela acidentalmente
      setLoteAtual(JSON.parse(JSON.stringify(lote)));
    } else {
      const hoje = new Date().toISOString().split('T')[0];
      setLoteAtual({ ...loteVazio, dataEntrada: hoje });
    }
    setItemSelecionado("");
    setQtdSelecionada("");
    setModalAberto(true);
  };

  const adicionarItemAoLote = () => {
    if (!itemSelecionado || !qtdSelecionada || Number(qtdSelecionada) <= 0) return;
    
    const med = medicamentosDisponiveis.find(m => m.id.toString() === itemSelecionado);
    if (!med) return;

    const itensAtuais = loteAtual.itens;
    const indexExistente = itensAtuais.findIndex(i => i.medicamentoId === med.id);

    if (indexExistente >= 0) {
      const novosItens = [...itensAtuais];
      novosItens[indexExistente].quantidade += Number(qtdSelecionada);
      setLoteAtual({ ...loteAtual, itens: novosItens });
    } else {
      setLoteAtual({ 
        ...loteAtual, 
        itens: [...itensAtuais, { medicamentoId: med.id, medicamentoNome: med.nome, quantidade: Number(qtdSelecionada) }] 
      });
    }

    setItemSelecionado("");
    setQtdSelecionada("");
  };

  const removerItemDoLote = (medicamentoId: number) => {
    const novosItens = loteAtual.itens.filter(i => i.medicamentoId !== medicamentoId);
    setLoteAtual({ ...loteAtual, itens: novosItens });
  };

  const salvarLote = (e: FormEvent) => {
    e.preventDefault();
    if (loteAtual.itens.length === 0) {
      window.alert("O lote precisa ter pelo menos um medicamento.");
      return;
    }
    
    if (loteAtual.id !== 0) {
      // Edição
      setLotes(lotes.map(l => l.id === loteAtual.id ? loteAtual : l));
    } else {
      // Novo
      const novoId = lotes.length > 0 ? Math.max(...lotes.map(l => l.id)) + 1 : 1;
      setLotes([...lotes, { ...loteAtual, id: novoId }]);
    }
    setModalAberto(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Package className="w-6 h-6 mr-2 text-blue-600" />
            Gestão de Lotes
          </h1>
          <p className="text-gray-500 text-sm mt-1">Controle de entrada, validades e quantidades em estoque.</p>
        </div>
        <button onClick={() => abrirModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors shadow-sm whitespace-nowrap">
          <Plus className="w-5 h-5 mr-2" /> Cadastrar Lote
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome do lote ou medicamento..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Identificação do Lote</th>
                <th className="px-6 py-4 font-semibold">Conteúdo (Medicamentos)</th>
                <th className="px-6 py-4 font-semibold">Validade</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {lotesFiltrados.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nenhum lote encontrado.</td></tr>
              )}
              {lotesFiltrados.map((lote) => {
                const status = obterStatusLote(lote);
                const totalQtd = lote.itens.reduce((acc, item) => acc + item.quantidade, 0);

                return (
                  <tr key={lote.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{lote.nome}</p>
                      <p className="text-xs text-gray-500">Entrada: {new Date(lote.dataEntrada).toLocaleDateString('pt-BR')}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="space-y-1">
                        {lote.itens.map(item => (
                          <p key={item.medicamentoId} className="flex justify-between w-48">
                            <span className="truncate pr-2">{item.medicamentoNome}</span>
                            <span className="font-semibold text-gray-900">{item.quantidade} un.</span>
                          </p>
                        ))}
                      </div>
                      <p className="text-xs font-semibold text-blue-600 mt-2 pt-1 border-t border-gray-100">Total: {totalQtd} unidades</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(lote.dataValidade).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.cor}`}>
                        {status.texto}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-2">
                      <button onClick={() => abrirModal(lote)} className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Editar Lote">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => deletarLote(lote.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Excluir Lote">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {loteAtual.id !== 0 ? "Editar Lote" : "Novo Lote"}
              </h2>
              <button type="button" onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={salvarLote} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Lote</label>
                  <input required type="text" value={loteAtual.nome} onChange={e => setLoteAtual({...loteAtual, nome: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Lote A23" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Entrada</label>
                  <input required type="date" value={loteAtual.dataEntrada} onChange={e => setLoteAtual({...loteAtual, dataEntrada: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
                  <input required type="date" value={loteAtual.dataValidade} onChange={e => setLoteAtual({...loteAtual, dataValidade: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-blue-500" />
                  Medicamentos contidos neste Lote
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <select 
                    value={itemSelecionado} 
                    onChange={e => setItemSelecionado(e.target.value)} 
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Selecione um medicamento...</option>
                    {medicamentosDisponiveis.map(med => (
                      <option key={med.id} value={med.id.toString()}>{med.nome}</option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    placeholder="Qtd" 
                    min="1"
                    value={qtdSelecionada}
                    onChange={e => setQtdSelecionada(e.target.value)}
                    className="w-full sm:w-24 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="button" 
                    onClick={adicionarItemAoLote}
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Adicionar
                  </button>
                </div>

                <div className="space-y-2">
                  {loteAtual.itens.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-2 italic">Nenhum medicamento adicionado ainda.</p>
                  )}
                  {loteAtual.itens.map(item => (
                    <div key={item.medicamentoId} className="flex justify-between items-center bg-white border border-gray-200 p-2 rounded-lg shadow-sm">
                      <span className="text-sm text-gray-800 font-medium">{item.medicamentoNome}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">{item.quantidade} un.</span>
                        <button type="button" onClick={() => removerItemDoLote(item.medicamentoId)} className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Salvar Lote</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}