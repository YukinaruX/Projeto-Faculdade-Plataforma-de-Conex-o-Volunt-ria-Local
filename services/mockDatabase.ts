import { User, Organization, Opportunity, Application, MatchResult } from '../types';

// Initial Seed Data
const MOCK_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Ana Silva',
    email: 'ana@example.com',
    role: 'volunteer',
    skills: ['Ensino', 'Matemática', 'Inglês', 'Artes'],
    location: 'São Paulo, SP',
    availability: 'Finais de semana'
  },
  {
    id: 'org-user-1',
    name: 'João Ong',
    email: 'joao@ong.org',
    role: 'organization',
    skills: [],
    location: 'São Paulo, SP',
    availability: 'Comercial'
  }
];

const MOCK_ORGS: Organization[] = [
  {
    id: 'org-1',
    owner_id: 'org-user-1',
    name: 'Educando o Futuro',
    description: 'ONG dedicada a reforço escolar para crianças carentes.',
    address: 'Rua das Flores, 123',
    phone: '1199999999'
  }
];

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    organization_id: 'org-1',
    organization_name: 'Educando o Futuro',
    title: 'Professor de Matemática Voluntário',
    description: 'Buscamos voluntários para ensinar matemática básica para crianças de 10-12 anos.',
    required_skills: ['Matemática', 'Ensino', 'Paciência'],
    location: 'São Paulo, SP',
    schedule: 'Sábados, 9h-12h',
    created_at: new Date().toISOString()
  },
  {
    id: 'opp-2',
    organization_id: 'org-1',
    organization_name: 'Educando o Futuro',
    title: 'Monitor de Recreação',
    description: 'Auxiliar nas atividades recreativas e artísticas.',
    required_skills: ['Artes', 'Recreação'],
    location: 'São Paulo, SP',
    schedule: 'Domingos, 14h-17h',
    created_at: new Date().toISOString()
  },
  {
    id: 'opp-3',
    organization_id: 'org-1',
    organization_name: 'Educando o Futuro',
    title: 'Desenvolvedor Web (Site Institucional)',
    description: 'Precisamos de ajuda para atualizar nosso site institucional.',
    required_skills: ['React', 'Web Design', 'HTML'],
    location: 'Remoto',
    schedule: 'Flexível',
    created_at: new Date().toISOString()
  }
];

const MOCK_APPLICATIONS: Application[] = [];

// Simulation of LocalStorage persistence
const load = <T>(key: string, defaults: T): T => {
  const stored = localStorage.getItem(`connect_causa_${key}`);
  return stored ? JSON.parse(stored) : defaults;
};

const save = (key: string, data: any) => {
  localStorage.setItem(`connect_causa_${key}`, JSON.stringify(data));
};

// Simulated Service Methods
export const authService = {
  login: async (email: string) => {
    const users = load('users', MOCK_USERS);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  },
  register: async (user: Omit<User, 'id'>) => {
    const users = load('users', MOCK_USERS);
    if (users.find(u => u.email === user.email)) throw new Error('Email já existe');
    const newUser = { ...user, id: `user-${Date.now()}` };
    users.push(newUser);
    save('users', users);
    return newUser;
  },
  me: (id: string) => {
    const users = load('users', MOCK_USERS);
    return users.find(u => u.id === id);
  }
};

export const opportunityService = {
  list: async () => {
    return load('opportunities', MOCK_OPPORTUNITIES);
  },
  create: async (opp: Omit<Opportunity, 'id' | 'created_at' | 'organization_name'>, orgName: string) => {
    const opps = load('opportunities', MOCK_OPPORTUNITIES);
    const newOpp = {
      ...opp,
      id: `opp-${Date.now()}`,
      created_at: new Date().toISOString(),
      organization_name: orgName
    };
    opps.push(newOpp);
    save('opportunities', opps);
    return newOpp;
  },
  apply: async (userId: string, opportunityId: string) => {
    const apps = load('applications', MOCK_APPLICATIONS);
    if (apps.find(a => a.user_id === userId && a.opportunity_id === opportunityId)) {
      throw new Error('Você já se candidatou a esta vaga');
    }
    const newApp: Application = {
      id: `app-${Date.now()}`,
      user_id: userId,
      opportunity_id: opportunityId,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    apps.push(newApp);
    save('applications', apps);
    return newApp;
  },
  getMatchmaking: async (user: User): Promise<MatchResult[]> => {
    const opps = load('opportunities', MOCK_OPPORTUNITIES);
    
    // Simulate the Python/Node matching logic
    return opps.map(opp => {
      const userSkills = new Set(user.skills.map(s => s.toLowerCase()));
      const reqSkills = opp.required_skills.map(s => s.toLowerCase());
      
      let matchCount = 0;
      const reasons: string[] = [];

      reqSkills.forEach(req => {
        if (userSkills.has(req)) {
          matchCount++;
          reasons.push(`Habilidade compatível: ${req}`);
        }
      });

      // Simple score calculation
      let score = (matchCount / (reqSkills.length || 1)) * 100;
      
      // Location boost
      if (opp.location === user.location || opp.location === 'Remoto') {
        score += 20;
        reasons.push(`Localização favorável: ${opp.location}`);
      }

      return {
        ...opp,
        matchScore: Math.min(Math.round(score), 100),
        matchReasons: reasons
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  },
  getMyApplications: async (userId: string) => {
    const apps = load('applications', MOCK_APPLICATIONS);
    const opps = load('opportunities', MOCK_OPPORTUNITIES);
    
    return apps
      .filter(a => a.user_id === userId)
      .map(app => ({
        ...app,
        opportunity_title: opps.find(o => o.id === app.opportunity_id)?.title || 'Vaga removida'
      }));
  }
};