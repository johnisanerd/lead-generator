import React, { useState } from 'react';
import ConfigPanel from './components/ConfigPanel';
import LeadsTable from './components/LeadsTable';
import { apifyService, SCRAPER_PRESETS } from './services/apify';
import { 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  MapPin, 
  Search,
  Zap,
  Layout,
  Layers,
  Info
} from 'lucide-react';

const App = () => {
  const [config, setConfig] = useState({
    token: '',
    niche: '',
    location: '',
    maxResults: 50,
    countryCode: 'US',
    tierFilter: 'all',
    skipAIFirstLines: false,
    dryRun: false,
    actorId: SCRAPER_PRESETS[0].id
  });
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGenerate = async () => {
    if (!config.token || !config.niche) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setStatus('Initializing Apify run...');
    
    try {
      const query = `${config.niche} in ${config.location}`.trim();
      const activePreset = SCRAPER_PRESETS.find(p => p.id === config.actorId);
      
      const input = {
        ...activePreset?.defaultInput,
        searchTerms: [query],
        [(activePreset?.limitKey || 'maxResults')]: config.maxResults,
      };

      // Add additional fields
      if (config.dryRun) input.dryRun = true;

      const runResponse = await apifyService.startRun(config.token, config.actorId, input);
      const runId = runResponse.data.id;
      
      setStatus(`Scraping leads for ${config.niche}...`);
      const results = await apifyService.waitForResults(
        config.token, 
        runId, 
        (runStatus) => setStatus(`Status: ${runStatus}...`)
      );

      setLeads(results);
      setSuccess(true);
      setStatus('Successfully generated leads!');
      setTimeout(() => setStatus(''), 5000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!leads || leads.length === 0) return;

    const escapeCSV = (val) => {
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['Name', 'Rating', 'Phone', 'Website', 'Category', 'Address', 'URL'];
    const csvRows = [
      headers.join(','),
      ...leads.map(lead => [
        escapeCSV(lead.title || lead.name),
        escapeCSV(lead.stars || lead.totalScore || 'N/A'),
        escapeCSV(lead.phone),
        escapeCSV(lead.website),
        escapeCSV(lead.categoryName),
        escapeCSV(lead.address),
        escapeCSV(lead.url)
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `prospct_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation & Config */}
      <ConfigPanel 
        config={config} 
        setConfig={setConfig} 
        onGenerate={handleGenerate}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="main-content">
        <header className="main-header animate-fade-in">
          <div className="header-info">
            <h1 className="header-title">Lead Generator</h1>
            <p className="header-subtitle">Configure & fire the Apify pipeline</p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            {leads.length > 0 && (
              <button onClick={handleExport} className="secondary-button" style={{ padding: '8px 16px' }}>
                <Download size={16} /> Export CSV
              </button>
            )}
          </div>
        </header>

        {(status || error) && (
          <div className={`status-card ${error ? 'error' : (success ? 'success' : 'loading')}`} style={{ marginBottom: '24px' }}>
            {isLoading ? <div className="spinner" /> : (error ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />)}
            <span>{error || status}</span>
          </div>
        )}

        {leads.length > 0 ? (
          <LeadsTable leads={leads} onExport={handleExport} />
        ) : (!isLoading && !error) && (
          <div className="ready-state animate-fade-in">
            <div className="ready-icon-container">
              <div className="ready-icon">
                <MapPin size={18} />
              </div>
            </div>
            <h2 className="ready-title">Ready to find leads</h2>
            <p className="ready-text">
              Configure your search on the left and hit <strong>Generate Leads</strong> to start the Apify scraper pipeline.
            </p>
            
            <div className="step-list">
              <div className="step-item">
                <span className="step-number">1</span>
                <span>Enter your Apify API token</span>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <span>Set your niche & location</span>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <span>Click Generate Leads</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
