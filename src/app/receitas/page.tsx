"use client";

import { useState, FormEvent } from "react";
import { FileText, Search, Plus, Edit, Trash2, X, Info, CheckCircle, Clock } from "lucide-react";

// Tipagens Rigorosas
type ItemReceita = {
  medicamentoId: number;
  medicamentoNome: string;
  quantidade: number;
  posologia: string;
};

type TipoReceita = "Branca Comum" | "Controle Especial" | "Azul (B1/B2)" | "Amarela (A)";
type StatusReceita = "Pendente" | "Dispensada" | "Vencida";

type Receita = {
  id: number;
  pacienteNome: string;
  medicoNome: string;
  crm: string;
  dataEmissao: string;
  tipo: TipoReceita;
  status: StatusReceita;
  itens: ItemReceita[];
};

// Mock de medicamentos disponíveis (Simulando o Banco)
const medicamentosDisponiveis = [
  { id: 1, nome: "Dipirona Monoidratada 500mg" },
  { id: 2, nome: "Amoxicilina 500mg" },
  { id: 3, nome: "Xarope de Guaco 120ml" },
  { id: 4, nome: "Losartana Potássica 50mg" },
  { id: 5, nome: "Clonazepam 2mg (Controlado)" }
];

// Dados Iniciais (Mock)
const dadosIniciais: Receita[] = [
  {
    id: 1,
    pacienteNome: "João da Silva",
    medicoNome: "Dr. Carlos Mendes",
    crm: "SP-123456",
    dataEmissao: "2026-02-25",
    tipo: "Branca Comum",
    status: "Pendente",
    itens: [
      { medicamentoId: 1, medicamentoNome: "Dipirona Monoidratada 500mg", quantidade: 10, posologia: "1 comp. de 8/8h" },
      { medicamentoId: 2, medicamentoNome: "Amoxicilina 500mg", quantidade: 21, posologia: "1 comp. de 8/8h por 7 dias" }
    ]
  },
  {
    id: 2,
    pacienteNome: "Maria Oliveira",
    medicoNome: "Dra. Ana Costa",
    crm: "SP-654321",
    dataEmissao: "2026-02-20",
    tipo: "Azul (B1/B2)",
    status: "Dispensada",
    itens: [
      { medicamentoId: 5, medicamentoNome: "Clonazepam 2mg (Controlado)", quantidade: 30, posologia: "1 comp. ao deitar" }
    ]
  }
];

const receitaVazia: Receita = {
  id: 0,
  pacienteNome: "",
  medicoNome: "",
  crm: "",
  dataEmissao: "",
  tipo: "Branca Comum",
  status: "Pendente",
  itens: []
};

export default function ReceitasPage() {
  const [receitas, setReceitas] = useState<Receita[]>(dadosIniciais);
  const [busca, setBusca] = useState("");
  
  const [modalAberto, setModalAberto] = useState(false);
  const [receitaAtual, setReceitaAtual] = useState<Receita>(receitaVazia);
  
  // Estados temporários para adicionar itens no modal
  const [itemSelecionado, setItemSelecionado] = useState("");
  const [qtdSelecionada, setQtdSelecionada] = useState("");
  const [posologiaSelecionada, setPosologiaSelecionada] = useState("");

  const receitasFiltradas = receitas.filter(rec => 
    rec.pacienteNome.toLowerCase().includes(busca.toLowerCase()) ||
    rec.medicoNome.toLowerCase().includes(busca.toLowerCase()) ||
    rec.id.toString().includes(busca)
  );

  const deletarReceita = (id: number) => {
    if(window.confirm("Tem certeza que deseja excluir este registro de receita?")) {
      setReceitas(receitas.filter(r => r.id !== id));
    }
  };

  const abrirModal = (receita?: Receita) => {
    if (receita) {
      setReceitaAtual(JSON.parse(JSON.stringify(receita)));
    } else {
      const hoje = new Date().toISOString().split('T')[0];
      setReceitaAtual({ ...receitaVazia, dataEmissao: hoje });
    }
    setItemSelecionado("");
    setQtdSelecionada("");
    setPosologiaSelecionada("");
    setModalAberto(true);
  };

  const adicionarItemNaReceita = () => {
    if (!itemSelecionado || !qtdSelecionada || Number(qtdSelecionada) <= 0) return;
    
    const med = medicamentosDisponiveis.find(m => m.id.toString() === itemSelecionado);
    if (!med) return;

    const itensAtuais = receitaAtual.itens;
    const indexExistente = itensAtuais.findIndex(i => i.medicamentoId === med.id);

    if (indexExistente >= 0) {
      const novosItens = [...itensAtuais];
      novosItens[indexExistente].quantidade += Number(qtdSelecionada);
      // Se já existe, apenas atualiza a quantidade, mantendo a posologia anterior
      setReceitaAtual({ ...receitaAtual, itens: novosItens });
    } else {
      setReceitaAtual({ 
        ...receitaAtual, 
        itens: [...itensAtuais, { 
          medicamentoId: med.id, 
          medicamentoNome: med.nome, 
          quantidade: Number(qtdSelecionada),
          posologia: posologiaSelecionada || "Uso conforme orientação médica"
        }] 
      });
    }

    setItemSelecionado("");
    setQtdSelecionada("");
    setPosologiaSelecionada("");
  };

  const removerItemDaReceita = (medicamentoId: number) => {
    const novosItens = receitaAtual.itens.filter(i => i.medicamentoId !== medicamentoId);
    setReceitaAtual({ ...receitaAtual, itens: novosItens });
  };

  const salvarReceita = (e: FormEvent) => {
    e.preventDefault();
    if (receitaAtual.itens.length === 0) {
      window.alert("A receita precisa ter pelo menos um medicamento prescrito.");
      return;
    }
    
    if (receitaAtual.id !== 0) {
      setReceitas(receitas.map(r => r.id === receitaAtual.id ? receitaAtual : r));
    } else {
      const novoId = receitas.length > 0 ? Math.max(...receitas.map(r => r.id)) + 1 : 1;
      setReceitas([...receitas, { ...receitaAtual, id: novoId }]);
    }
    setModalAberto(false);
  };

  const alternarStatus = (id: number, statusAtual: StatusReceita) => {
    const novoStatus = statusAtual === "Pendente" ? "Dispensada" : "Pendente";
    setReceitas(receitas.map(r => r.id === id ? { ...r, status: novoStatus } : r));
  };

  // Função auxiliar para cores de status e tipos
  const getStatusColor = (status: string) => {
    if (status === "Dispensada") return "bg-green-100 text-green-800 border-green-200";
    if (status === "Vencida") return "bg-red-100 text-red-800 border-red-200";
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  };

  const getTipoColor = (tipo: string) => {
    if (tipo.includes("Azul")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (tipo.includes("Amarela")) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (tipo.includes("Controle")) return "bg-gray-100 text-gray-800 border-gray-300";
    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Gestão de Receitas
          </h1>
          <p className="text-gray-500 text-sm mt-1">Controle de prescrições médicas, dispensação e retenção.</p>
        </div>
        <button onClick={() => abrirModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors shadow-sm whitespace-nowrap">
          <Plus className="w-5 h-5 mr-2" /> Nova Receita
        </button>
      </div>

      {/* Busca */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por paciente, médico ou nº da receita..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Nº / Data</th>
                <th className="px-6 py-4 font-semibold">Paciente / Médico</th>
                <th className="px-6 py-4 font-semibold">Tipo de Receita</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {receitasFiltradas.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nenhuma receita encontrada.</td></tr>
              )}
              {receitasFiltradas.map((receita) => (
                <tr key={receita.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">#{receita.id.toString().padStart(4, '0')}</p>
                    <p className="text-xs text-gray-500">{new Date(receita.dataEmissao).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{receita.pacienteNome}</p>
                    <p className="text-xs text-gray-500">{receita.medicoNome} (CRM: {receita.crm})</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium ${getTipoColor(receita.tipo)}`}>
                      {receita.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(receita.status)}`}>
                      {receita.status === "Pendente" ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle className="w-3 h-3 mr-1" />}
                      {receita.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    {/* Botão para mudar o status rapidamente */}
                    <button 
                      onClick={() => alternarStatus(receita.id, receita.status)} 
                      className={`p-2 rounded-lg transition-colors ${receita.status === 'Pendente' ? 'text-green-600 hover:bg-green-50' : 'text-yellow-600 hover:bg-yellow-50'}`} 
                      title={receita.status === 'Pendente' ? 'Marcar como Dispensada' : 'Voltar para Pendente'}
                    >
                      {receita.status === 'Pendente' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </button>
                    <button onClick={() => abrirModal(receita)} className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Editar Receita">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deletarReceita(receita.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Excluir Receita">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Cadastro / Edição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {receitaAtual.id !== 0 ? `Editar Receita #${receitaAtual.id.toString().padStart(4, '0')}` : "Nova Receita"}
              </h2>
              <button type="button" onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={salvarReceita} className="p-6 space-y-6">
              
              {/* Informações Principais */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                  <input required type="text" value={receitaAtual.pacienteNome} onChange={e => setReceitaAtual({...receitaAtual, pacienteNome: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: João da Silva" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Emissão</label>
                  <input required type="date" value={receitaAtual.dataEmissao} onChange={e => setReceitaAtual({...receitaAtual, dataEmissao: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Médico Prescritor</label>
                  <input required type="text" value={receitaAtual.medicoNome} onChange={e => setReceitaAtual({...receitaAtual, medicoNome: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Dr. Carlos Mendes" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CRM</label>
                    <input required type="text" value={receitaAtual.crm} onChange={e => setReceitaAtual({...receitaAtual, crm: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="SP-123456" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo da Receita</label>
                    <select value={receitaAtual.tipo} onChange={e => setReceitaAtual({...receitaAtual, tipo: e.target.value as TipoReceita})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="Branca Comum">Branca Comum</option>
                      <option value="Controle Especial">Controle Especial (2 Vias)</option>
                      <option value="Azul (B1/B2)">Azul (B1/B2)</option>
                      <option value="Amarela (A)">Amarela (A)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Medicamentos Prescritos */}
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Info className="w-4 h-4 mr-2 text-blue-500" />
                  Prescrição (Medicamentos e Posologia)
                </h3>
                
                {/* Form de Adicionar Item */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select 
                      value={itemSelecionado} 
                      onChange={e => setItemSelecionado(e.target.value)} 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Selecione o medicamento...</option>
                      {medicamentosDisponiveis.map(med => (
                        <option key={med.id} value={med.id.toString()}>{med.nome}</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      placeholder="Qtd (Cx/Frasco)" 
                      min="1"
                      value={qtdSelecionada}
                      onChange={e => setQtdSelecionada(e.target.value)}
                      className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="text" 
                      placeholder="Posologia (Ex: Tomar 1 comp. de 8/8h)" 
                      value={posologiaSelecionada}
                      onChange={e => setPosologiaSelecionada(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      type="button" 
                      onClick={adicionarItemNaReceita}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>

                {/* Lista de Medicamentos */}
                <div className="space-y-2">
                  {receitaAtual.itens.length === 0 && (
                    <p className="text-xs text-gray-500 text-center py-4 italic bg-white rounded border border-dashed border-gray-300">Nenhum medicamento prescrito ainda.</p>
                  )}
                  {receitaAtual.itens.map(item => (
                    <div key={item.medicamentoId} className="flex flex-col sm:flex-row justify-between sm:items-center bg-white border border-gray-200 p-3 rounded-lg shadow-sm gap-2">
                      <div className="flex-1">
                        <span className="text-sm text-gray-800 font-bold">{item.medicamentoNome}</span>
                        <p className="text-xs text-gray-600 mt-0.5">Uso: {item.posologia}</p>
                      </div>
                      <div className="flex items-center gap-3 justify-end">
                        <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">{item.quantidade} un.</span>
                        <button type="button" onClick={() => removerItemDaReceita(item.medicamentoId)} className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botões do Rodapé */}
              <div className="pt-4 flex justify-between items-center border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Status Atual:</span>
                  <select 
                    value={receitaAtual.status} 
                    onChange={e => setReceitaAtual({...receitaAtual, status: e.target.value as StatusReceita})}
                    className="text-sm border border-gray-300 rounded px-2 py-1 outline-none bg-white"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Dispensada">Dispensada</option>
                    <option value="Vencida">Vencida</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Salvar Receita</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}