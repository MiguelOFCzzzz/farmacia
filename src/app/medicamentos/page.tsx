"use client"; // Isso diz ao Next.js que esta página terá interatividade no navegador

import { useState } from "react";
import { Pill, Search, Plus, Filter, Edit, Trash2, Eye, X } from "lucide-react";

// Tipagem do nosso medicamento
type Medicamento = {
  id: number;
  nome: string;
  fabricante: string;
  composicao: string;
  unidadeMedida: string;
  quantidadeUnidade: string;
  status: string;
};

// Dados iniciais
const dadosIniciais: Medicamento[] = [
  { id: 1, nome: "Dipirona Monoidratada", fabricante: "Medley", composicao: "Dipirona 500mg", unidadeMedida: "Comprimido", quantidadeUnidade: "500mg", status: "Ativo" },
  { id: 2, nome: "Amoxicilina", fabricante: "Eurofarma", composicao: "Amoxicilina Tri-hidratada", unidadeMedida: "Cápsula", quantidadeUnidade: "500mg", status: "Ativo" },
];

export default function MedicamentosPage() {
  // Estados que controlam a tela
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>(dadosIniciais);
  const [busca, setBusca] = useState("");
  
  // Estados do Modal (Formulário)
  const [modalAberto, setModalAberto] = useState(false);
  const [medicamentoAtual, setMedicamentoAtual] = useState<Partial<Medicamento>>({});

  // FUNÇÃO: Filtrar
  const medicamentosFiltrados = medicamentos.filter(med => 
    med.nome.toLowerCase().includes(busca.toLowerCase()) || 
    med.composicao.toLowerCase().includes(busca.toLowerCase()) ||
    med.fabricante.toLowerCase().includes(busca.toLowerCase())
  );

  // FUNÇÃO: Apagar
  const deletarMedicamento = (id: number) => {
    if(confirm("Tem certeza que deseja excluir este medicamento?")) {
      setMedicamentos(medicamentos.filter(med => med.id !== id));
    }
  };

  // FUNÇÃO: Abrir Modal para Novo ou Editar
  const abrirModal = (med?: Medicamento) => {
    if (med) {
      setMedicamentoAtual(med); // Se passou um med, é Edição
    } else {
      setMedicamentoAtual({ status: "Ativo" }); // Se não, é Novo
    }
    setModalAberto(true);
  };

  // FUNÇÃO: Salvar (Novo ou Edição)
  const salvarMedicamento = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (medicamentoAtual.id) {
      // É uma edição
      setMedicamentos(medicamentos.map(med => med.id === medicamentoAtual.id ? medicamentoAtual as Medicamento : med));
    } else {
      // É um novo cadastro (gera um ID falso baseado no tamanho do array)
      const novoId = medicamentos.length > 0 ? Math.max(...medicamentos.map(m => m.id)) + 1 : 1;
      setMedicamentos([...medicamentos, { ...medicamentoAtual, id: novoId } as Medicamento]);
    }
    
    setModalAberto(false); // Fecha o modal após salvar
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Pill className="w-6 h-6 mr-2 text-blue-600" />
            Medicamentos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie o catálogo base de medicamentos do sistema.</p>
        </div>
        <button 
          onClick={() => abrirModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" /> Novo Medicamento
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, composição ou fabricante..." 
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
                <th className="px-6 py-4 font-semibold">Medicamento / Composição</th>
                <th className="px-6 py-4 font-semibold">Fabricante</th>
                <th className="px-6 py-4 font-semibold">Apresentação</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {medicamentosFiltrados.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nenhum medicamento encontrado.</td></tr>
              )}
              {medicamentosFiltrados.map((med) => (
                <tr key={med.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{med.nome}</p>
                    <p className="text-xs text-gray-500">{med.composicao}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{med.fabricante}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{med.unidadeMedida}</p>
                    <p className="text-xs text-gray-500">{med.quantidadeUnidade}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      med.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {med.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button onClick={() => abrirModal(med)} className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Editar">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deletarMedicamento(med.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {medicamentoAtual.id ? "Editar Medicamento" : "Novo Medicamento"}
              </h2>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={salvarMedicamento} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input required type="text" value={medicamentoAtual.nome || ""} onChange={e => setMedicamentoAtual({...medicamentoAtual, nome: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Dipirona" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Composição</label>
                <input required type="text" value={medicamentoAtual.composicao || ""} onChange={e => setMedicamentoAtual({...medicamentoAtual, composicao: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fabricante</label>
                <input required type="text" value={medicamentoAtual.fabricante || ""} onChange={e => setMedicamentoAtual({...medicamentoAtual, fabricante: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apresentação</label>
                  <input required type="text" value={medicamentoAtual.unidadeMedida || ""} onChange={e => setMedicamentoAtual({...medicamentoAtual, unidadeMedida: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Comprimido" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dose/Qtd</label>
                  <input required type="text" value={medicamentoAtual.quantidadeUnidade || ""} onChange={e => setMedicamentoAtual({...medicamentoAtual, quantidadeUnidade: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: 500mg" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}