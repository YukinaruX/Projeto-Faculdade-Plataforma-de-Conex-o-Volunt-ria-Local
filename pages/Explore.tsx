import React, { useEffect, useState } from 'react';
import { User, MatchResult } from '../types';
import { opportunityService } from '../services/mockDatabase';
import { generateMatchExplanation } from '../services/geminiService';
import { MapPin, Clock, Star, BrainCircuit, Sparkles, CheckCircle } from 'lucide-react';

interface ExploreProps {
  user: User;
}

const Explore: React.FC<ExploreProps> = ({ user }) => {
  const [opportunities, setOpportunities] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState<Record<string, string>>({});
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Carrega oportunidades e candidaturas do usuário simultaneamente
        const [opps, myApps] = await Promise.all([
          opportunityService.getMatchmaking(user),
          opportunityService.getMyApplications(user.id)
        ]);
        
        setOpportunities(opps);
        setAppliedIds(new Set(myApps.map(app => app.opportunity_id)));
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleApply = async (oppId: string) => {
    try {
      await opportunityService.apply(user.id, oppId);
      
      // Atualiza estado local imediatamente para feedback visual
      setAppliedIds(prev => new Set(prev).add(oppId));
      
      alert('Candidatura enviada com sucesso!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAiAnalysis = async (opp: MatchResult) => {
    setAnalyzingId(opp.id);
    const explanation = await generateMatchExplanation(
      user.name, 
      user.skills, 
      opp.title, 
      opp.required_skills
    );
    setAiAnalysis(prev => ({ ...prev, [opp.id]: explanation }));
    setAnalyzingId(null);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Vagas Recomendadas</h1>
        <p className="text-primary-100">
          Nosso algoritmo encontrou {opportunities.length} oportunidades baseadas no seu perfil e localização.
        </p>
      </div>

      <div className="grid gap-6">
        {opportunities.map((opp) => {
          const isApplied = appliedIds.has(opp.id);

          return (
            <div key={opp.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">{opp.organization_name}</span>
                      {opp.matchScore > 70 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          <Star className="w-3 h-3 mr-1 fill-current" /> {opp.matchScore}% Match
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{opp.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {opp.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> {opp.schedule}
                      </div>
                    </div>

                    <p className="mt-4 text-gray-600 line-clamp-2">{opp.description}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {opp.required_skills.map(skill => (
                        <span key={skill} className={`px-2 py-1 rounded text-xs font-medium border ${user.skills.includes(skill) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {skill}
                        </span>
                      ))}
                    </div>

                    {opp.matchReasons.length > 0 && (
                      <div className="mt-3 text-sm text-gray-500">
                        <span className="font-medium text-gray-700">Por que combina: </span>
                        {opp.matchReasons.join(' • ')}
                      </div>
                    )}
                  </div>

                  <div className="ml-6 flex flex-col space-y-3 min-w-[160px]">
                    <button 
                      onClick={() => handleApply(opp.id)}
                      disabled={isApplied}
                      className={`w-full px-4 py-2 rounded-lg font-medium transition shadow-sm flex items-center justify-center ${
                        isApplied 
                          ? "bg-green-50 text-green-700 border border-green-200 cursor-not-allowed" 
                          : "bg-primary-600 text-white hover:bg-primary-700"
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Inscrito
                        </>
                      ) : (
                        "Candidatar-se"
                      )}
                    </button>
                    
                    <button 
                      onClick={() => handleAiAnalysis(opp)}
                      disabled={analyzingId === opp.id}
                      className="w-full bg-white text-purple-600 border border-purple-200 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition flex items-center justify-center text-sm"
                    >
                      {analyzingId === opp.id ? (
                        <div className="animate-spin h-4 w-4 border-2 border-purple-600 rounded-full border-t-transparent"></div>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Análise IA
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Analysis Result */}
                {aiAnalysis[opp.id] && (
                  <div className="mt-6 bg-purple-50 border border-purple-100 rounded-lg p-4 animate-fade-in">
                    <div className="flex items-start">
                      <BrainCircuit className="w-5 h-5 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-purple-800 mb-1">Análise de Compatibilidade Gemini</h4>
                        <p className="text-sm text-purple-700 leading-relaxed italic">
                          "{aiAnalysis[opp.id]}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;