import React, { useEffect, useState } from 'react';
import { User, Application } from '../types';
import { opportunityService } from '../services/mockDatabase';
import { Calendar, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await opportunityService.getMyApplications(user.id);
        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user.id]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'accepted': 
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Aceito</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Recusado</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pendente</span>;
    }
  };

  if (loading) return <div className="text-center py-20">Carregando informações...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Olá, {user.name}!</h1>
          <p className="text-gray-600 mt-1">Aqui está o resumo das suas atividades de impacto.</p>
        </div>
        {user.role === 'volunteer' && (
          <Link to="/explore" className="btn bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
            Buscar Novas Vagas <ArrowRight className="ml-2 w-4 h-4"/>
          </Link>
        )}
        {user.role === 'organization' && (
          <Link to="/create-opportunity" className="btn bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center">
            Criar Vaga <ArrowRight className="ml-2 w-4 h-4"/>
          </Link>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Candidaturas Ativas</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{applications.filter(a => a.status === 'pending').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Vagas Aceitas</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{applications.filter(a => a.status === 'accepted').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Perfil Completo</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">85%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Minhas Candidaturas</h2>
        </div>
        {applications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Você ainda não se candidatou a nenhuma vaga.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {applications.map((app) => (
              <li key={app.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{app.opportunity_title}</h4>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      Candidatou-se em {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;