import { useEffect, useState } from "react";
import { Plus, FileText, BookOpen, Sparkles, TrendingUp, Headphones, Bell, ArrowRight, Zap, Target, Award } from "lucide-react";
import { useLocation } from "wouter";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { useDashboardStats, useDashboardChartData, useRecentActivities } from "@/hooks/use-reports";
import { useTutorial } from "@/contexts/TutorialContext";
import { AtendimentoClienteModal } from "@/components/atendimento-modal";
import { useNotifications, useMarkNotificationAsRead } from "@/hooks/use-notifications";
import { PlanExpirationNotification } from "@/components/dashboard/plan-expiration-notification";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";

export type RevenuePeriod = 'daily' | 'weekly' | 'monthly';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { activeStep, completeTutorialStep } = useTutorial();
  const [revenuePeriod, setRevenuePeriod] = useState<RevenuePeriod>('monthly');
  const [atendimentoModalOpen, setAtendimentoModalOpen] = useState(false);
  const { data: stats, isLoading } = useDashboardStats(revenuePeriod);
  const { data: chartData, isLoading: isLoadingChart } = useDashboardChartData();
  const { data: activities, isLoading: isLoadingActivities } = useRecentActivities();
  const { data: notifications = [] } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (activeStep === 'dashboard') {
      const timer = setTimeout(() => {
        completeTutorialStep('dashboard');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeStep, completeTutorialStep]);

  const defaultStats = {
    totalClients: 0,
    activeDestinations: 0,
    monthlyRevenue: 0,
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50/50 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                  Painel Principal
                </span>
                <span className="text-xs text-slate-400">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Dashboard
              </h1>
              <p className="text-slate-500 mt-1">
                Visão geral e métricas do seu negócio.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Notification Button */}
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    data-testid="button-notifications"
                    className="relative p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-full transition-all text-slate-600 hover:text-emerald-600 shadow-sm hover:shadow"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center pointer-events-none ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 rounded-2xl border-slate-200 shadow-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-sm">Notificações</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <p className="text-slate-500 text-xs text-center py-6">Nenhuma notificação nova</p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead.mutate(notification.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-all mb-1 last:mb-0 ${notification.read
                            ? "hover:bg-slate-50"
                            : "bg-emerald-50/50 border border-emerald-100"
                            }`}
                        >
                          <p className={`text-sm ${notification.read ? 'font-medium' : 'font-semibold text-emerald-900'}`}>{notification.title}</p>
                          <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <button
                onClick={() => setAtendimentoModalOpen(true)}
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95"
              >
                <Headphones className="h-4 w-4" />
                <span>Suporte</span>
              </button>
            </div>
          </motion.header>

          <PlanExpirationNotification />

          {/* Stats Cards */}
          <section className="mb-8">
            <StatsCards
              stats={stats || defaultStats}
              isLoading={isLoading}
              revenuePeriod={revenuePeriod}
              onPeriodChange={setRevenuePeriod}
            />
          </section>

          {/* Charts & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2 h-full">
              <DashboardChart
                data={chartData?.clientsPerMonth}
                isLoading={isLoadingChart}
              />
            </div>
            <div className="lg:col-span-1 h-full">
              <RecentActivity
                activities={activities}
                isLoading={isLoadingActivities}
              />
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Ações Rápidas
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Plus,
                  label: "Novo Passageiro",
                  desc: "Cadastrar cliente",
                  path: "/passageiros",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                  border: "hover:border-emerald-200",
                  shadow: "hover:shadow-emerald-500/10"
                },
                {
                  icon: FileText,
                  label: "Nova Reserva",
                  desc: "Criar contrato",
                  path: "/contratos",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  border: "hover:border-blue-200",
                  shadow: "hover:shadow-blue-500/10"
                },
                {
                  icon: BookOpen,
                  label: "Novo Destino",
                  desc: "Adicionar viagem",
                  path: "/destinos",
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                  border: "hover:border-violet-200",
                  shadow: "hover:shadow-violet-500/10"
                },
                {
                  icon: Target,
                  label: "Relatórios",
                  desc: "Ver métricas",
                  path: "/relatorios",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                  border: "hover:border-amber-200",
                  shadow: "hover:shadow-amber-500/10"
                },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  <div
                    onClick={() => setLocation(action.path)}
                    className={`group cursor-pointer bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden ${action.border} ${action.shadow}`}
                    data-testid={`quick-action-${index}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {action.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Footer with System Info */}
          <footer className="mt-12 py-6 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sistema Operacional v2.4.0</span>
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-emerald-600 transition-colors">Documentação</a>
                <a href="#" className="hover:text-emerald-600 transition-colors">Suporte</a>
                <span>© 2024 Roda Bem Turismo</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <AtendimentoClienteModal
        open={atendimentoModalOpen}
        onOpenChange={setAtendimentoModalOpen}
      />
    </>
  );
}

