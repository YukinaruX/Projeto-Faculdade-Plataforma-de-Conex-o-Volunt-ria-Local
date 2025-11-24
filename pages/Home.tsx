import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Users, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
          <Heart className="w-4 h-4 mr-2 fill-current" /> Junte-se a mais de 5.000 voluntários
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
          Encontre a causa que <br />
          <span className="text-primary-600">combina com você</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Utilizamos tecnologia inteligente para conectar suas habilidades com organizações que precisam exatamente do que você sabe fazer.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <button 
            onClick={() => navigate('/register')} 
            className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Quero ser Voluntário
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition"
          >
            Sou uma Organização
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Match Inteligente</h3>
          <p className="text-gray-600">Nosso algoritmo analisa suas habilidades e disponibilidade para sugerir as vagas perfeitas.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Impacto Real</h3>
          <p className="text-gray-600">Conecte-se diretamente com ONGs sérias e acompanhe o impacto das suas ações.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
            <Heart className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidade Ativa</h3>
          <p className="text-gray-600">Faça parte de uma rede de pessoas engajadas em transformar o mundo.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-600 rounded-3xl p-12 text-white text-center">
        <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-primary-500">
          <div>
            <div className="text-4xl font-bold mb-1">1.200+</div>
            <div className="text-primary-100">Vagas Abertas</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">450+</div>
            <div className="text-primary-100">ONGs Parceiras</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">15k+</div>
            <div className="text-primary-100">Horas Doadas</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;