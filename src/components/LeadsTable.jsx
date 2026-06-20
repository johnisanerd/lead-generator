import React from 'react';
import { ExternalLink, Database, Download, Star, Phone, Globe, MapPin, Tag } from 'lucide-react';

const LeadsTable = ({ leads, onExport }) => {
  if (!leads || leads.length === 0) return null;

  return (
    <div className="table-card animate-fade-in">
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: 'var(--primary)' }}>
            <Database size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Extracted Lead Results</h2>
            <p style={{ margin: 0, color: 'var(--text-dim)', fontSize: '0.75rem' }}>Viewing {leads.length} business records</p>
          </div>
        </div>
      </div>

      <div className="table-container" style={{ borderRadius: 0, border: 'none' }}>
        <table>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Rating</th>
              <th>Contact</th>
              <th>Website</th>
              <th>Category</th>
              <th>Location</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: 'white' }}>{lead.title || lead.name}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{lead.stars || lead.totalScore || 'N/A'}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>{lead.phone || 'N/A'}</td>
                <td>
                  {lead.website ? (
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" style={{ 
                      color: 'var(--primary)', 
                      textDecoration: 'none',
                      fontSize: '0.8125rem',
                      fontWeight: 500
                    }}>
                      Visit Site
                    </a>
                  ) : <span style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>N/A</span>}
                </td>
                <td>
                  <span className="badge" style={{ fontSize: '0.6875rem' }}>
                    {lead.categoryName || 'General'}
                  </span>
                </td>
                <td style={{ maxWidth: '200px' }}>
                  <div style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    color: 'var(--text-dim)',
                    fontSize: '0.8125rem'
                  }}>
                    {lead.address || 'N/A'}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <a 
                      href={lead.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="icon-link"
                      title="View on Maps"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <MapPin size={14} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;
