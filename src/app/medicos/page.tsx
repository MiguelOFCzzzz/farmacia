"use client";

import { useState, FormEvent } from "react";
import { Stethoscope, Search, Plus, Edit, Trash2, X, Building2, UserCircle } from "lucide-react";

// Tipagem rigorosa do Médico
type Medico = {
  id: number;
  nome: string;
  crm: string;
  ubs: string;
  status: "Ativo" | "Inativo";
};

// Dados Iniciais (Mock)
const dadosIniciais: Medico[] = [
  {
    id: 1,
    nome: "Dr. Carlos Mendes",
    crm: "SP-123456",
    ubs: "UBS Centro",
    status: "Ativo"
  },
  {
    id: 2,
    nome: "Dra. Ana Costa",
    crm: "SP-654321",
    ubs: "USF Vila Nova",
    status: "Ativo"
  },
  {
    id: 3,
    nome: "Dr. Roberto Silva",
    crm: "SP-987654",
    ubs: "UBS Jardim das Oliveiras",
    status: "Inativo"
  }
];

// Lista de UBS disponíveis para o Select (simulando o banco de dados)
const ubsDisponiveis = [
  "UBS Centro",
  "USF Vila Nova",
  "UBS Jardim das Oliveiras",
  "UBS Zona Sul"
];

// Objeto vazio para inicializar o formulário sem erros
const medicoVazio: Medico = {
  id: 0,
  nome: "",
  crm: "",
  ubs: "",
  status: "Ativo"
};

export default function MedicosPage() {
  const [medicos, setMedicos] = useState<Medico[]>(dadosIniciais);
  const [busca, setBusca] = useState("");
  
  const [modalAberto, setModalAberto] = useState(false);
  const [medicoAtual, setMedicoAtual] = useState<Medico>(medicoVazio);

  // Filtro de busca
  const medicosFiltrados = medicos.filter(med => 
    med.nome.toLowerCase().includes(busca.toLowerCase()) ||
    med.crm.toLowerCase().includes(busca.toLowerCase()) ||
    med.ubs.toLowerCase().includes(busca.toLowerCase())
  );

  const deletarMedico = (id: number) => {
    if(window.confirm("Tem certeza que deseja excluir este Médico?")) {
      setMedicos(medicos.filter(m => m.id !== id));
    }
  };

  const abrirModal = (medico?: Medico) => {
    if (medico) {
      setMedicoAtual(JSON.parse(JSON.stringify(medico))); // Cópia segura
    } else {
      setMedicoAtual({ ...medicoVazio, ubs: ubsDisponiveis[0] }); // Pré-seleciona a primeira UBS
    }
    setModalAberto(true);
  };

  const salvarMedico = (e: FormEvent) => {
    e.preventDefault();
    
    if (medicoAtual.id !== 0) {
      // Edição
      setMedicos(medicos.map(m => m.id === medicoAtual.id ? medicoAtual : m));
    } else {
      // Novo cadastro
      const novoId = medicos.length > 0 ? Math.max(...medicos.map(m => m.id)) + 1 : 1;
      setMedicos([...medicos, { ...medicoAtual, id: novoId }]);
    }
    setModalAberto(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Stethoscope className="w-6 h-6 mr-2 text-blue-600" />
            Gestão de Médicos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Cadastre e gerencie os médicos e seus vínculos com as UBS.</p>
        </div>
        <button onClick={() => abrirModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors shadow-sm whitespace-nowrap">
          <Plus className="w-5 h-5 mr-2" /> Novo Médico
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
            placeholder="Buscar por nome do médico, CRM ou UBS..." 
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
                <th className="px-6 py-4 font-semibold">Nome do Médico</th>
                <th className="px-6 py-4 font-semibold">CRM</th>
                <th className="px-6 py-4 font-semibold">UBS Vinculada</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicosFiltrados.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nenhum médico encontrado.</td></tr>
              )}
              {medicosFiltrados.map((medico) => (
                <tr key={medico.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-bold text-xs">
                        {medico.nome.charAt(0)}
                      </div>
                      <p className="font-semibold text-gray-800">{medico.nome}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {medico.crm}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <Building2 className="w-4 h-4 mr-1.5 text-gray-400" />
                      {medico.ubs}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium ${
                      medico.status === 'Ativo' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {medico.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button onClick={() => abrirModal(medico)} className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Editar Médico">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deletarMedico(medico.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Excluir Médico">
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl z-10">
              <h2 className="text-xl font-semibold text-gray-800">
                {medicoAtual.id !== 0 ? "Editar Médico" : "Novo Médico"}
              </h2>
              <button type="button" onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={salvarMedico} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  <input required type="text" value={medicoAtual.nome} onChange={e => setMedicoAtual({...medicoAtual, nome: e.target.value})} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Dr. Carlos Mendes" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CRM</label>
                <input required type="text" value={medicoAtual.crm} onChange={e => setMedicoAtual({...medicoAtual, crm: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: SP-123456" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UBS Vinculada</label>
                <select 
                  required
                  value={medicoAtual.ubs} 
                  onChange={e => setMedicoAtual({...medicoAtual, ubs: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="" disabled>Selecione uma UBS...</option>
                  {ubsDisponiveis.map(ubs => (
                    <option key={ubs} value={ubs}>{ubs}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={medicoAtual.status} 
                  onChange={e => setMedicoAtual({...medicoAtual, status: e.target.value as "Ativo" | "Inativo"})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              {/* Botões do Rodapé */}
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Salvar Médico</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}