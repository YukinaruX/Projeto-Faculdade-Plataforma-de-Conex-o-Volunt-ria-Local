import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/mockDatabase';
import { User } from '../types';

interface AuthProps {
  mode: 'login' | 'register';
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ mode, onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'volunteer' as 'volunteer' | 'organization',
    skills: '',
    location: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let user;
      if (mode === 'login') {
        user = await authService.login(formData.email);
      } else {
        user = await authService.register({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          skills: formData.skills.split(',').map(s => s.trim()),
          location: formData.location,
          availability: 'Flexível' // Default for simplified form
        });
      }
      onLogin(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>

        {mode === 'register' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Conta</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as any})}
              >
                <option value="volunteer">Voluntário</option>
                <option value="organization">Organização (ONG)</option>
              </select>
            </div>
            
            {formData.role === 'volunteer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Habilidades (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: Ensino, React, Design"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.skills}
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade/Estado</label>
              <input
                type="text"
                placeholder="Ex: São Paulo, SP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700 transition shadow-sm mt-6"
        >
          {mode === 'login' ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

export default Auth;