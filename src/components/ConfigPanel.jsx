import React, { useState } from 'react';
import { 
  Key, 
  Search, 
  Settings2, 
  Play, 
  MapPin, 
  Hash, 
  Globe, 
  Eye, 
  EyeOff, 
  Zap,
  Info
} from 'lucide-react';

const ConfigPanel = ({ config, setConfig, onGenerate, isLoading }) => {
  const [showToken, setShowToken] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'maxResults' ? parseInt(value) || 0 : value)
    }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="brand-icon">
            <MapPin size={14} />
          </div>
          <span className="brand-name">Prospct</span>
          <span className="brand-badge">Lead Gen</span>
        </div>
        <div className="status-indicator">
          <div className="dot"></div>
          <span>Ready</span>
        </div>
      </div>

      <div className="sidebar-content">
        {/* API Credentials */}
        <section className="config-section">
          <div className="section-label">
            <Key size={14} />
            <span>API Credentials</span>
          </div>
          
          <div className="field-group">
            <label className="field-label">Apify API Token</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showToken ? 'text' : 'password'}
                name="token"
                value={config.token}
                onChange={handleChange}
                placeholder="apify_api_xxxxxxxx..."
                className="field-input"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  padding: '4px'
                }}
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <a href="https://console.apify.com" target="_blank" rel="noopener noreferrer" className="field-hint">
              Get yours at console.apify.com
            </a>
          </div>
        </section>

        {/* Search Parameters */}
        <section className="config-section">
          <div className="section-label">
            <Search size={14} />
            <span>Search Parameters</span>
          </div>

          <div className="field-group">
            <label className="field-label">Business Type / Niche</label>
            <input
              type="text"
              name="niche"
              value={config.niche}
              onChange={handleChange}
              placeholder="dentists, HVAC contractors, yoga..."
              className="field-input"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Location</label>
            <input
              type="text"
              name="location"
              value={config.location}
              onChange={handleChange}
              placeholder="Austin, TX, USA"
              className="field-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="field-group">
              <label className="field-label">Max Results</label>
              <input
                type="number"
                name="maxResults"
                value={config.maxResults}
                onChange={handleChange}
                className="field-input"
              />
            </div>
            <div className="field-group">
              <label className="field-label">Country Code</label>
              <input
                type="text"
                name="countryCode"
                value={config.countryCode}
                onChange={handleChange}
                placeholder="US"
                className="field-input"
              />
            </div>
          </div>
        </section>

      </div>

        <button 
          className="btn-generate"
          onClick={onGenerate}
          disabled={isLoading || !config.token || (!config.niche && !config.queries)}
        >
          {isLoading ? (
            <>Processing...</>
          ) : (
            <>
              <Zap size={16} fill="white" />
              Generate Leads
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default ConfigPanel;
