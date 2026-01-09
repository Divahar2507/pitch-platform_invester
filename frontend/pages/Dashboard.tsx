
import * as React from 'react';
import { DollarSign, Briefcase, Activity, TrendingUp, Search, Bell, Download, Plus, Sparkles, Loader2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import { api } from '../services/api';
import { aiService } from '../services/aiService';
import { Startup } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [startups, setStartups] = React.useState<Startup[]>([]);
  const [investments, setInvestments] = React.useState<any[]>([]);
  const [user, setUser] = React.useState<any>(null);
  const [insight, setInsight] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingInsight, setLoadingInsight] = React.useState(false);

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [userData, pitchesData, investmentsData] = await Promise.all([
        api.getMe(),
        api.getPitchFeed(),
        api.getInvestments()
      ]);

      setUser(userData);

      const mappedStartups: Startup[] = pitchesData.map((pitch: any) => ({
        id: pitch.id.toString(),
        name: pitch.company_name || 'Unknown',
        sector: pitch.industry || 'Unknown',
        stage: pitch.stage || 'Seed',
        location: 'Remote',
        matchScore: pitch.match_score || 0,
        description: pitch.description || '',
        fundingAsk: pitch.raising_amount || 'N/A',
        valuation: 'TBD',
        tags: [],
        logo: (pitch.company_name || 'S').charAt(0),
        status: 'New'
      }));
      setStartups(mappedStartups);
      setInvestments(investmentsData);

    } catch (e) {
      console.error('Failed to fetch dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  const generateInsight = async () => {
    setLoadingInsight(true);
    try {
      // Use actual investments for insight if available, otherwise fetched startups
      const portfolioForInsight = investments.length > 0 ? investments : startups;
      // Need to map investments to Startup type if using that, but aiService might be flexible or we map on the fly
      // For now, let's just pass startups as a proxy for "market check" if portfolio is empty,
      // or map investments to minimal Startup objects.

      // Let's stick to using the 'startups' (Feed) for market insight as "Emerging Trends"
      const res = await aiService.getMarketInsight(startups);
      setInsight(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingInsight(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  // Calculate Stats
  const totalInvestments = investments.length;
  // Mock logic for active deals (maybe matching pitches?)
  const activeDeals = startups.filter(s => s.matchScore > 80).length;
  const deployableCapital = "$2.4M"; // Hardcoded for now until backend keeps track of fund
  const portfolioRoi = "+18%"; // Hardcoded

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user?.email?.split('@')[0] || 'Investor'}</h1>
          <p className="text-slate-500 mt-1">Here is your investment overview for {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={generateInsight}
            disabled={loadingInsight}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-sm font-semibold text-indigo-700 hover:bg-indigo-100 shadow-sm transition-all"
          >
            {loadingInsight ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            AI Market Insight
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search startups..."
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 shadow-sm"
            />
          </div>
          <Link to="/log-investment" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all active:scale-95">
            <Plus size={18} />
            Log Investment
          </Link>
        </div>
      </div>

      {insight && (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-indigo-200" />
              <h2 className="font-bold text-lg">AI Strategic Insight</h2>
            </div>
            <p className="text-indigo-50 leading-relaxed text-sm whitespace-pre-line">{insight}</p>
            <button onClick={() => setInsight(null)} className="mt-4 text-xs font-bold text-indigo-200 hover:text-white uppercase tracking-widest">Dismiss</button>
          </div>
          <Sparkles className="absolute -bottom-8 -right-8 text-white/10 w-48 h-48 group-hover:scale-110 transition-transform" />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Investments" value={totalInvestments.toString()} trend="+2 this quarter" isPositive={true} icon={<Briefcase size={22} />} />
        <StatCard label="High Match Pitches" value={activeDeals.toString()} trend="Need review" icon={<Activity size={22} />} />
        <StatCard label="Deployable Capital" value={deployableCapital} trend="Of $5M fund" icon={<DollarSign size={22} />} />
        <StatCard label="Portfolio ROI" value={portfolioRoi} trend="+3.2% vs last year" isPositive={true} icon={<TrendingUp size={22} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">New Pitches to Review</h2>
            <Link to="/browse" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {startups.slice(0, 2).map((startup) => (
              <div key={startup.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 relative">
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-blue-700">
                    {startup.matchScore}% Match
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-600 uppercase">
                      {startup.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{startup.name}</h3>
                      <p className="text-xs text-slate-500 uppercase font-semibold">{startup.sector} • {startup.stage}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {startup.description}
                  </p>
                  <Link to={`/pitch/${startup.id}`} className="block w-full text-center py-2.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors">
                    Review Deck
                  </Link>
                </div>
              </div>
            ))}
            {startups.length === 0 && (
              <div className="col-span-2 text-center py-10 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No new pitches available.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h2>
            <div className="space-y-6">
              {[
                { user: 'TechNova', action: 'updated Q3 financials', time: '2 hours ago' },
                { user: 'GreenEnergy', action: 'replied to your comment', time: '5 hours ago' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-600 leading-tight">
                      <span className="font-bold text-slate-900">{item.user}</span> {item.action}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
