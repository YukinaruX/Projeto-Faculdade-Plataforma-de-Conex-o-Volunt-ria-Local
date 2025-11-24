import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { opportunityService } from '../services/mockDatabase';
import { ArrowLeft, Briefcase, MapPin, Clock, List } from 'lucide-react';

interface CreateOpportunityProps {
  user: User;
}

const CreateOpportunity: React.FC<CreateOpportunityProps> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: '',
    location: user.location || '',
    schedule: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await opportunityService.create({
        organization_id: user.id,
        title: formData.title,
        description: formData.description,
        required_skills: formData.required_skills.split(',').map(s => s.trim()).filter(Boolean),
        location: formData.location,
        schedule: formData.schedule
      }, user.name);
      
      navigate('/dashboard');
    } catch (err: any) {
      alert('Erro ao criar vaga: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="flex items-center text-gray-500 hover:text-primary-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar ao Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
          <div className="bg-primary-100 p-3 rounded-lg">
            <Briefcase className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Oportunidade</h1>
            <p className="text-gray-500 text-sm">Cadastre uma vaga para encontrar voluntários.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título da Vaga</label>
            <input
              type="text"
              required
              placeholder="Ex: Professor de Matemática Voluntário"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              required
              rows={4}
              placeholder="Descreva as atividades e o impacto esperado..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> Localização</div>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: São Paulo, SP ou Remoto"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                 <div className="flex items-center"><Clock className="w-4 h-4 mr-1"/> Horário/Frequência</div>
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Sábados, 9h-12h"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.schedule}
                onChange={e => setFormData({...formData, schedule: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center"><List className="w-4 h-4 mr-1"/> Habilidades Necessárias</div>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Ensino, Matemática, Paciência (separados por vírgula)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              value={formData.required_skills}
              onChange={e => setFormData({...formData, required_skills: e.target.value})}
            />
            <p className="text-xs text-gray-500 mt-1">Essas tags serão usadas pelo nosso algoritmo de match.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition shadow-md flex justify-center items-center"
            >
              {loading ? 'Criando...' : 'Publicar Vaga'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunity;