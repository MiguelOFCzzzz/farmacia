import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Activity, LayoutDashboard, Pill, Package, FileText, Building2, Stethoscope, ShoppingCart } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema UBS | Gestão de Farmácia",
  description: "Sistema de gestão de estoque e frente de caixa para UBS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 text-gray-900 flex h-screen overflow-hidden`}>
        
        {/* Sidebar (Menu Lateral) */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
          <div className="h-16 flex items-center px-6 border-b border-gray-200">
            <Activity className="w-6 h-6 text-blue-600 mr-2" />
            <span className="font-bold text-lg text-gray-800">FarmaUBS</span>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Atendimento</p>
            <NavItem href="/frente-caixa" icon={<ShoppingCart size={20} />} label="Frente de Caixa" />
            
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Estoque</p>
            <NavItem href="/medicamentos" icon={<Pill size={20} />} label="Medicamentos" />
            <NavItem href="/lotes" icon={<Package size={20} />} label="Lotes" />
            
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Administração</p>
            <NavItem href="/receitas" icon={<FileText size={20} />} label="Receitas" />
            <NavItem href="/ubs" icon={<Building2 size={20} />} label="Unidades (UBS)" />
            <NavItem href="/medicos" icon={<Stethoscope size={20} />} label="Médicos" />
            
            <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Gerencial</p>
            <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          </nav>

          {/* User Profile Mock */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                F
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">João Silva</p>
                <p className="text-xs text-gray-500">Farmacêutico</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Área Principal */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header Mobile Omitido por brevidade */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
            {children}
          </div>
        </main>

      </body>
    </html>
  );
}

// Componente auxiliar para os botões do menu
function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center px-3 py-2 text-gray-600 rounded-md hover:bg-blue-50 hover:text-blue-700 transition-colors">
      <span className="mr-3">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}