"use client"; // Isso diz ao Next.js que esta página terá interatividade no navegador

import { useState } from "react";
import { Building2, Search, Plus, Edit, Trash2, X, MapPin, Phone, UserCircle } from "lucide-react";

// Tipagem da nossa Unidade (UBS)
type Unidade = {
  id: number;
  nome: string;
  endereco: string;
  responsavel: string;
  telefone: string;
  status: string;
};

// Dados iniciais
const dadosIniciais: Unidade[] = [
  { id: 1, nome: "UBS Centro", endereco: "Rua das Flores, 123 - Centro", responsavel: "Enf. Maria Auxiliadora", telefone: "(11) 3333-0001", status: "Ativa" },
  { id: 2, nome: "USF Vila Nova", endereco: "Av. Principal, 890 - Vila Nova", responsavel: "Dr. Roberto Gomes", telefone: "(11) 3333-0002", status: "Ativa" },
  { id: 3, nome: "UBS Jardim das Oliveiras", endereco: "Rua dos Pinheiros, 45 - Jd. Oliveiras", responsavel: "Farm. Letícia Costa", telefone: "(11) 3333-0003", status: "Inativa" }
];

export default function UnidadesPage() {
  // Estados que controlam a tela
  const [unidades, setUnidades] = useState<Unidade[]>(dadosIniciais);
  const [busca, setBusca] = useState("");
  
  // Estados do Modal (Formulário)
  const [modalAberto, setModalAberto] = useState(false);
  const [unidadeAtual, setUnidadeAtual] = useState<Partial<Unidade>>({});

  // FUNÇÃO: Filtrar
  const unidadesFiltradas = unidades.filter(ubs => 
    ubs.nome.toLowerCase().includes(busca.toLowerCase()) || 
    ubs.endereco.toLowerCase().includes(busca.toLowerCase()) ||
    ubs.responsavel.toLowerCase().includes(busca.toLowerCase())
  );

  // FUNÇÃO: Apagar
  const deletarUnidade = (id: number) => {
    if(confirm("Tem certeza que deseja excluir esta Unidade de Saúde?")) {
      setUnidades(unidades.filter(ubs => ubs.id !== id));
    }
  };

  // FUNÇÃO: Abrir Modal para Novo ou Editar
  const abrirModal = (ubs?: Unidade) => {
    if (ubs) {
      setUnidadeAtual(ubs); // Se passou uma ubs, é Edição
    } else {
      setUnidadeAtual({ status: "Ativa" }); // Se não, é Novo
    }
    setModalAberto(true);
  };

  // FUNÇÃO: Salvar (Novo ou Edição)
  const salvarUnidade = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (unidadeAtual.id) {
      // É uma edição
      setUnidades(unidades.map(ubs => ubs.id === unidadeAtual.id ? unidadeAtual as Unidade : ubs));
    } else {
      // É um novo cadastro (gera um ID falso baseado no tamanho do array)
      const novoId = unidades.length > 0 ? Math.max(...unidades.map(u => u.id)) + 1 : 1;
      setUnidades([...unidades, { ...unidadeAtual, id: novoId } as Unidade]);
    }
    
    setModalAberto(false); // Fecha o modal após salvar
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-blue-600" />
            Unidades (UBS)
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie os postos de atendimento, responsáveis e contatos.</p>
        </div>
        <button 
          onClick={() => abrirModal()} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" /> Nova Unidade
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
            placeholder="Buscar por nome da UBS, endereço ou responsável..." 
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
                <th className="px-6 py-4 font-semibold">Nome da Unidade</th>
                <th className="px-6 py-4 font-semibold">Contato / Responsável</th>
                <th className="px-6 py-4 font-semibold">Endereço</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {unidadesFiltradas.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Nenhuma unidade encontrada.</td></tr>
              )}
              {unidadesFiltradas.map((ubs) => (
                <tr key={ubs.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-800">{ubs.nome}</p>
                    <p className="text-xs text-gray-500">ID: {ubs.id.toString().padStart(3, '0')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-800 mb-1">
                      <UserCircle className="w-4 h-4 mr-1.5 text-gray-400" />
                      {ubs.responsavel}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                      {ubs.telefone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start text-sm text-gray-700 max-w-xs">
                      <MapPin className="w-4 h-4 mr-1.5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="truncate" title={ubs.endereco}>{ubs.endereco}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-medium ${
                      ubs.status === 'Ativa' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'
                    }`}>
                      {ubs.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-2">
                    <button onClick={() => abrirModal(ubs)} className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Editar Unidade">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deletarUnidade(ubs.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Excluir Unidade">
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
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {unidadeAtual.id ? "Editar Unidade" : "Nova Unidade"}
              </h2>
              <button onClick={() => setModalAberto(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={salvarUnidade} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da UBS / Unidade</label>
                <input required type="text" value={unidadeAtual.nome || ""} onChange={e => setUnidadeAtual({...unidadeAtual, nome: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: UBS Centro" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                <input required type="text" value={unidadeAtual.endereco || ""} onChange={e => setUnidadeAtual({...unidadeAtual, endereco: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ex: Rua das Flores, 123" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsável (Enf/Farm)</label>
                  <input required type="text" value={unidadeAtual.responsavel || ""} onChange={e => setUnidadeAtual({...unidadeAtual, responsavel: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nome do Responsável" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone de Contato</label>
                  <input required type="text" value={unidadeAtual.telefone || ""} onChange={e => setUnidadeAtual({...unidadeAtual, telefone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="(11) 99999-9999" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status de Operação</label>
                <select 
                  value={unidadeAtual.status || "Ativa"} 
                  onChange={e => setUnidadeAtual({...unidadeAtual, status: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Ativa">Ativa</option>
                  <option value="Inativa">Inativa</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setModalAberto(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium">Salvar Unidade</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}