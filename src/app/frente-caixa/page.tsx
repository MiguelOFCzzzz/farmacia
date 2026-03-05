"use client";

import { useState } from "react";
import { Search, Plus, Trash2, CheckCircle2, ShoppingCart, UserCircle, AlertCircle } from "lucide-react";

// Tipagens
type ItemCarrinho = {
  id: number;
  nome: string;
  quantidade: number;
};

// Dados Simulados (Mocks)
const medicosDb = [
  { id: 1, nome: "Dr. Carlos Mendes", crm: "12345" },
  { id: 2, nome: "Dra. Ana Costa", crm: "67890" }
];

const ubsDb = [
  { id: 1, nome: "UBS Centro" },
  { id: 2, nome: "USF Vila Nova" }
];

const estoqueDb = [
  { id: 1, nome: "Dipirona 500mg", estoque: 85, lotes: 3 },
  { id: 2, nome: "Amoxicilina 500mg", estoque: 30, lotes: 1 },
  { id: 3, nome: "Ibuprofeno 400mg", estoque: 120, lotes: 4 },
  { id: 4, nome: "Buscopan", estoque: 0, lotes: 0 }, // Indisponível
];

export default function FrenteDeCaixa() {
  // Estados do Formulário da Receita
  const [paciente, setPaciente] = useState("");
  const [medicoId, setMedicoId] = useState("");
  const [ubsId, setUbsId] = useState("");

  // Estados da Busca e Carrinho
  const [busca, setBusca] = useState("");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);

  // Filtra os medicamentos baseado no que o usuário digita
  const medicamentosFiltrados = busca.length > 0 
    ? estoqueDb.filter(m => m.nome.toLowerCase().includes(busca.toLowerCase()) && m.estoque > 0)
    : [];

  // Função para adicionar medicamento ao resumo
  const adicionarAoCarrinho = (med: typeof estoqueDb[0]) => {
    if (quantidade <= 0) {
      alert("A quantidade deve ser maior que zero.");
      return;
    }
    if (quantidade > med.estoque) {
      alert(`Quantidade indisponível. Estoque atual: ${med.estoque}`);
      return;
    }

    // Verifica se já está no carrinho
    const itemExistente = carrinho.find(item => item.id === med.id);
    if (itemExistente) {
      setCarrinho(carrinho.map(item => 
        item.id === med.id 
          ? { ...item, quantidade: item.quantidade + quantidade } 
          : item
      ));
    } else {
      setCarrinho([...carrinho, { id: med.id, nome: med.nome, quantidade: quantidade }]);
    }

    // Limpa os campos de busca após adicionar
    setBusca("");
    setQuantidade(1);
  };

  // Função para remover do carrinho
  const removerDoCarrinho = (id: number) => {
    setCarrinho(carrinho.filter(item => item.id !== id));
  };

  // Função para finalizar o atendimento
  const finalizarAtendimento = () => {
    if (!paciente || !medicoId || !ubsId) {
      alert("Por favor, preencha todos os dados da receita (Paciente, Médico e UBS).");
      return;
    }
    if (carrinho.length === 0) {
      alert("Adicione ao menos um medicamento no resumo da dispensa.");
      return;
    }

    // Aqui no futuro entrará a lógica de API para salvar no banco
    alert(`✅ Atendimento de ${paciente} finalizado com sucesso!\n\nBaixa no estoque (FIFO) e geração de receita realizados.`);
    
    // Reseta a tela para o próximo atendimento
    setPaciente("");
    setMedicoId("");
    setUbsId("");
    setCarrinho([]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Frente de Caixa</h1>
        <p className="text-gray-500 text-sm mt-1">Novo atendimento e dispensa de medicamentos (FIFO automático).</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LADO ESQUERDO: Formulários */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dados do Paciente e Receita */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <UserCircle className="w-5 h-5 mr-2 text-blue-600" />
              Dados da Receita
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Paciente</label>
                <input 
                  type="text" 
                  value={paciente}
                  onChange={(e) => setPaciente(e.target.value)}
                  placeholder="Ex: Maria da Silva" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Médico Prescritor</label>
                <select 
                  value={medicoId}
                  onChange={(e) => setMedicoId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="" disabled>Selecione o Médico...</option>
                  {medicosDb.map(med => (
                    <option key={med.id} value={med.id}>{med.nome} (CRM {med.crm})</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade (UBS)</label>
                <select 
                  value={ubsId}
                  onChange={(e) => setUbsId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="" disabled>Selecione a Unidade...</option>
                  {ubsDb.map(ubs => (
                    <option key={ubs.id} value={ubs.id}>{ubs.nome}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Busca de Medicamentos */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Medicamentos</h2>
            
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar medicamento por nome..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={quantidade}
                  onChange={(e) => setQuantidade(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                  min={1} 
                />
              </div>
            </div>
            
            {/* Resultados da Busca */}
            {busca.length > 0 && (
              <div className="mt-4 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                {medicamentosFiltrados.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-orange-500"/>
                    Nenhum medicamento com estoque disponível encontrado.
                  </p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {medicamentosFiltrados.map((med) => (
                      <li key={med.id} className="p-3 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{med.nome}</p>
                          <p className="text-xs text-green-600 font-medium">Estoque: {med.estoque} un. ({med.lotes} lotes)</p>
                        </div>
                        <button 
                          onClick={() => adicionarAoCarrinho(med)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1.5 rounded-md flex items-center font-medium transition-colors text-sm"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            
            {!busca && (
              <p className="text-sm text-gray-400 italic">Digite o nome do medicamento para buscar no estoque.</p>
            )}
          </div>
        </div>

        {/* LADO DIREITO: Resumo / "Carrinho" */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" /> 
            Resumo da Dispensa
          </h2>
          
          <div className="space-y-3 mb-6 min-h-[200px] max-h-[400px] overflow-y-auto pr-2">
            {carrinho.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                <ShoppingCart className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Nenhum medicamento adicionado.</p>
              </div>
            ) : (
              carrinho.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{item.nome}</p>
                    <p className="text-xs text-gray-500 font-medium bg-gray-100 inline-block px-2 py-0.5 rounded mt-1">
                      {item.quantidade} un.
                    </p>
                  </div>
                  <button 
                    onClick={() => removerDoCarrinho(item.id)}
                    className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <button 
            onClick={finalizarAtendimento}
            disabled={carrinho.length === 0}
            className={`w-full py-3 rounded-lg flex items-center justify-center font-semibold text-lg transition-colors shadow-sm ${
              carrinho.length === 0 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            <CheckCircle2 className="w-6 h-6 mr-2" /> Finalizar Atendimento
          </button>
          <p className="text-xs text-center text-gray-400 mt-3 flex items-center justify-center">
            <AlertCircle className="w-3 h-3 mr-1"/> A baixa no estoque é feita via sistema FIFO.
          </p>
        </div>

      </div>
    </div>
  );
}