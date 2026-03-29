/* COMPONENTE LEGADO - Reemplazado por shadcn Sidebar (sidebar-left.jsx) */
// import { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAutenticacion } from "../../contextos/ContextoAutenticacion";
// import { Menu, Home, LayoutDashboard, Car, Wrench, Users } from "lucide-react";
// import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import "./BarraNavAdmin.scss";
//
// const BarraNavegacaoAdmin = () => {
//   const [estaAberto, setEstaAberto] = useState(false);
//   const { user: usuario, tieneRol: temPermissao } = useAutenticacion();
//   const localizacao = useLocation();
//
//   const itensMenuAdmin = [
//     {
//       titulo: "Panel",
//       caminho: "/panel",
//       icone: <LayoutDashboard size={20} />,
//       papelNecessario: "empleado",
//     },
//     {
//       titulo: "Veículos",
//       caminho: "/panel/vehiculos",
//       icone: <Car size={20} />,
//       papelNecessario: "empleado",
//     },
//     {
//       titulo: "Serviços",
//       caminho: "/panel/servicios",
//       icone: <Wrench size={20} />,
//       papelNecessario: "empleado",
//     },
//     {
//       titulo: "Usuários",
//       caminho: "/panel/usuarios",
//       icone: <Users size={20} />,
//       papelNecessario: "admin",
//     },
//   ];
//
//   const itensFiltrados = itensMenuAdmin.filter((item) =>
//     temPermissao(item.papelNecessario),
//   );
//
//   const linkEstaAtivo = (caminho) => {
//     return (
//       localizacao.pathname === caminho || localizacao.pathname.startsWith(caminho + "/")
//     );
//   };
//
//   // Solo mostrar en rutas de administración (/panel/*)
//   const esRutaAdmin = localizacao.pathname.startsWith("/panel");
//   if (!usuario || !esRutaAdmin) return null;
//
//   return (
//     <div className="admin-navbar">
//       <Sheet open={estaAberto} onOpenChange={setEstaAberto}>
//         <SheetTrigger asChild>
//           <Button
//             variant="default"
//             size="icon"
//             className="w-[50px] h-[50px] rounded-full shadow-[0_4px_20px_rgba(255,61,36,0.3)] bg-gradient-to-br from-[#ff3d24] to-[#e02912] hover:scale-105 hover:shadow-[0_6px_25px_rgba(255,61,36,0.4)] transition-all border-none"
//             aria-label="Abrir Menu Administrativo"
//           >
//             <Menu className="w-6 h-6 text-white" />
//           </Button>
//         </SheetTrigger>
//
//         <SheetContent side="right" className="w-[300px] sm:w-[340px] bg-[#1a1a1a]/98 backdrop-blur-xl border-l border-white/10 text-white flex flex-col p-0 shadow-2xl">
//           <SheetHeader className="p-6 border-b border-white/10 bg-gradient-to-br from-red-600/10 to-red-600/5 text-left">
//             <SheetTitle className="sr-only">Menu de Administração</SheetTitle>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff3d24] to-[#e02912] flex items-center justify-center text-white font-bold uppercase text-base">
//                 {usuario.nombre?.charAt(0) || "A"}
//               </div>
//               <div className="flex flex-col gap-0.5">
//                 <span className="text-sm font-semibold text-white leading-tight">{usuario.nombre || "Admin"}</span>
//                 <span className="text-xs text-white/60 uppercase tracking-wider">
//                   {usuario.rol === "admin" ? "Administrador" : "Funcionário"}
//                 </span>
//               </div>
//             </div>
//           </SheetHeader>
//
//           <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
//             {itensFiltrados.map((item) => (
//               <Link
//                 key={item.caminho}
//                 to={item.caminho}
//                 className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${linkEstaAtivo(item.caminho)
//                     ? "text-[#ff3d24] bg-[#ff3d24]/10"
//                     : "text-white/80 hover:text-white hover:bg-white/5"
//                   }`}
//                 onClick={() => setEstaAberto(false)}
//               >
//                 {linkEstaAtivo(item.caminho) && (
//                   <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#ff3d24] rounded-r-md"></span>
//                 )}
//                 <span className={`transition-transform duration-200 ${linkEstaAtivo(item.caminho) ? 'scale-110' : 'group-hover:scale-110'}`}>
//                   {item.icone}
//                 </span>
//                 {item.titulo}
//               </Link>
//             ))}
//           </nav>
//
//           <div className="p-4 border-t border-white/10 mt-auto">
//             <Link
//               to="/"
//               className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-green-500 transition-colors group"
//               onClick={() => setEstaAberto(false)}
//             >
//               <span className="transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110">
//                 <Home size={20} />
//               </span>
//               Voltar ao Site
//             </Link>
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// };

export default function BarraNavegacaoAdmin() { return null; }
