/**
 * Apify API Service for lead generation
 */

const APIFY_BASE_URL = '/api/apify/v2';

export const SCRAPER_PRESETS = [
  {
    id: 'johnvc~google-maps-places-api',
    name: 'Google Maps Places',
    description: 'Google Maps places search for leads.',
    limitKey: 'maxResultsPerSearch',
    defaultInput: {
      language: 'en',
    }
  }
];

export const apifyService = {
  /**
   * Starts a run for a given actor
   * @param {string} token - Apify API Token
   * @param {string} actorId - Actor ID (e.g. johnvc/google-maps-places-api)
   * @param {object} input - Actor input configuration
   * @returns {Promise<object>} - Run object
   */
  async startRun(token, actorId, input) {
    const url = `${APIFY_BASE_URL}/acts/${actorId}/runs?token=${token}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.error?.message || errorData.message || 'Failed to start Apify run');
      }

      return await response.json();
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        throw new Error('Network error: "Failed to fetch". This usually happens due to CORS restrictions or an invalid token. Please verify your token and network.');
      }
      throw err;
    }
  },

  /**
   * Status of a run
   * @param {string} token 
   * @param {string} runId 
   */
  async getRunStatus(token, runId) {
    const url = `${APIFY_BASE_URL}/runs/${runId}?token=${token}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Status check failed: ${response.status}`);
      return await response.json();
    } catch (err) {
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        throw new Error('Network error while polling status. Check your connection.');
      }
      throw err;
    }
  },

  /**
   * Fetches results from a dataset
   * @param {string} token 
   * @param {string} datasetId 
   */
  async getDatasetItems(token, datasetId) {
    const url = `${APIFY_BASE_URL}/datasets/${datasetId}/items?token=${token}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch dataset items');
    return await response.json();
  },

  /**
   * Helper to wait for a run to finish and get results
   */
  async waitForResults(token, runId, onStatusUpdate) {
    let run;
    while (true) {
      const response = await this.getRunStatus(token, runId);
      run = response.data;
      
      if (onStatusUpdate) onStatusUpdate(run.status);

      if (['SUCCEEDED', 'FAILED', 'ABORTED', 'TIMED-OUT'].includes(run.status)) {
        break;
      }
      
      // Wait 3 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (run.status !== 'SUCCEEDED') {
      throw new Error(`Run ended with status: ${run.status}`);
    }

    const items = await this.getDatasetItems(token, run.defaultDatasetId);

    // Map the Actor's fields to the names the table and CSV export read
    return items
      .filter(item => !item.error_message)
      .map(item => ({
        title: item.title,
        name: item.title,
        stars: item.rating,
        totalScore: item.rating,
        phone: item.phoneNumber,
        website: item.website,
        categoryName: item.type,
        address: item.address,
        url: item.cid ? `https://maps.google.com/?cid=${item.cid}` : undefined,
      }));
  },

  /**
   * Returns mock data for demo purposes
   */
  getDemoData() {
    return [
      {
        title: "Zenith Architecture",
        name: "Zenith Architecture",
        stars: 4.8,
        totalScore: 4.8,
        phone: "+1 555-0123",
        website: "https://zenith-arch.example.com",
        categoryName: "Architectural Firm",
        address: "742 Evergreen Terrace, Springfield",
        url: "https://maps.google.com/?cid=123"
      },
      {
        title: "Blue Sky Dentists",
        name: "Blue Sky Dentists",
        stars: 4.5,
        totalScore: 4.5,
        phone: "+44 20 7946 0000",
        website: "https://bluesky-dental.co.uk",
        categoryName: "Dentist",
        address: "10 Downing St, London SW1A 2AA",
        url: "https://maps.google.com/?cid=456"
      },
      {
        title: "Summit Coffee Roasters",
        name: "Summit Coffee Roasters",
        stars: 4.9,
        totalScore: 4.9,
        phone: "+61 2 9385 1000",
        website: "https://summitcoffee.com.au",
        categoryName: "Coffee Shop",
        address: "George St, Sydney NSW 2000",
        url: "https://maps.google.com/?cid=789"
      },
      {
        title: "Quantum Tech Solutions",
        name: "Quantum Tech Solutions",
        stars: 4.2,
        totalScore: 4.2,
        phone: "+49 30 123456",
        website: "https://quantum-tech.de",
        categoryName: "IT Services",
        address: "Alexanderplatz, 10178 Berlin",
        url: "https://maps.google.com/?cid=101"
      }
    ];
  }
};
