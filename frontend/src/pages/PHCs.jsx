import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { phcService } from '../services/phcService';
import { 
  IconHospital, 
  IconPhone, 
  IconMapPin, 
  IconSearch, 
  IconClose 
} from '../components/Icons';
import './ListPage.css';

export const PHC_DATASET = [
  { name: "Paderu Area Hospital", district: "Alluri Sitharama Raju", mandal: "Paderu", type: "AH", phone: "" },
  { name: "Chintapalli PHC", district: "Alluri Sitharama Raju", mandal: "Chintapalli", type: "PHC", phone: "" },
  { name: "Rampachodavaram PHC", district: "Alluri Sitharama Raju", mandal: "Rampachodavaram", type: "PHC", phone: "" },
  { name: "Anakapalli District Hospital", district: "Anakapalli", mandal: "Anakapalli", type: "DH", phone: "" },
  { name: "Narsipatnam PHC", district: "Anakapalli", mandal: "Narsipatnam", type: "PHC", phone: "" },
  { name: "Payakaraopeta PHC", district: "Anakapalli", mandal: "Payakaraopeta", type: "PHC", phone: "" },
  { name: "Anantapur District Hospital", district: "Ananthapuramu", mandal: "Anantapur", type: "DH", phone: "" },
  { name: "Guntakal PHC", district: "Ananthapuramu", mandal: "Guntakal", type: "PHC", phone: "" },
  { name: "Hindupur PHC", district: "Ananthapuramu", mandal: "Hindupur", type: "PHC", phone: "" },
  { name: "Kadiri PHC", district: "Ananthapuramu", mandal: "Kadiri", type: "PHC", phone: "" },
  { name: "Rayachoti District Hospital", district: "Annamayya", mandal: "Rayachoti", type: "DH", phone: "" },
  { name: "Madanapalle PHC", district: "Annamayya", mandal: "Madanapalle", type: "PHC", phone: "" },
  { name: "Rajampeta PHC", district: "Annamayya", mandal: "Rajampeta", type: "PHC", phone: "" },
  { name: "Bapatla District Hospital", district: "Bapatla", mandal: "Bapatla", type: "DH", phone: "" },
  { name: "Chirala PHC", district: "Bapatla", mandal: "Chirala", type: "PHC", phone: "" },
  { name: "Repalle PHC", district: "Bapatla", mandal: "Repalle", type: "PHC", phone: "" },
  { name: "Chittoor District Hospital", district: "Chittoor", mandal: "Chittoor", type: "DH", phone: "" },
  { name: "Tirupati PHC", district: "Chittoor", mandal: "Tirupati", type: "PHC", phone: "" },
  { name: "Palamaner PHC", district: "Chittoor", mandal: "Palamaner", type: "PHC", phone: "" },
  { name: "Punganur PHC", district: "Chittoor", mandal: "Punganur", type: "PHC", phone: "" },
  { name: "Amalapuram District Hospital", district: "Dr. B. R. Ambedkar Konaseema", mandal: "Amalapuram", type: "DH", phone: "" },
  { name: "Razole PHC", district: "Dr. B. R. Ambedkar Konaseema", mandal: "Razole", type: "PHC", phone: "" },
  { name: "Kothapeta PHC", district: "Dr. B. R. Ambedkar Konaseema", mandal: "Kothapeta", type: "PHC", phone: "" },
  { name: "Rajahmundry District Hospital", district: "East Godavari", mandal: "Rajahmundry", type: "DH", phone: "" },
  { name: "Kakinada PHC", district: "East Godavari", mandal: "Kakinada", type: "PHC", phone: "" },
  { name: "Peddapuram PHC", district: "East Godavari", mandal: "Peddapuram", type: "PHC", phone: "" },
  { name: "Tuni PHC", district: "East Godavari", mandal: "Tuni", type: "PHC", phone: "" },
  { name: "Eluru District Hospital", district: "Eluru", mandal: "Eluru", type: "DH", phone: "" },
  { name: "Nuzvid PHC", district: "Eluru", mandal: "Nuzvid", type: "PHC", phone: "" },
  { name: "Jangareddigudem PHC", district: "Eluru", mandal: "Jangareddigudem", type: "PHC", phone: "" },
  { name: "Guntur District Hospital", district: "Guntur", mandal: "Guntur", type: "DH", phone: "" },
  { name: "Tenali PHC", district: "Guntur", mandal: "Tenali", type: "PHC", phone: "" },
  { name: "Mangalagiri PHC", district: "Guntur", mandal: "Mangalagiri", type: "PHC", phone: "" },
  { name: "Sattenapalle PHC", district: "Guntur", mandal: "Sattenapalle", type: "PHC", phone: "" },
  { name: "Kakinada District Hospital", district: "Kakinada", mandal: "Kakinada", type: "DH", phone: "" },
  { name: "Peddapuram PHC", district: "Kakinada", mandal: "Peddapuram", type: "PHC", phone: "" },
  { name: "Samalkota PHC", district: "Kakinada", mandal: "Samalkota", type: "PHC", phone: "" },
  { name: "Machilipatnam District Hospital", district: "Krishna", mandal: "Machilipatnam", type: "DH", phone: "" },
  { name: "Gudivada PHC", district: "Krishna", mandal: "Gudivada", type: "PHC", phone: "" },
  { name: "Vijayawada PHC", district: "Krishna", mandal: "Vijayawada", type: "PHC", phone: "" },
  { name: "Nandigama PHC", district: "Krishna", mandal: "Nandigama", type: "PHC", phone: "" },
  { name: "Kurnool District Hospital", district: "Kurnool", mandal: "Kurnool", type: "DH", phone: "" },
  { name: "Adoni PHC", district: "Kurnool", mandal: "Adoni", type: "PHC", phone: "" },
  { name: "Nandyal PHC", district: "Kurnool", mandal: "Nandyal", type: "PHC", phone: "" },
  { name: "Dhone PHC", district: "Kurnool", mandal: "Dhone", type: "PHC", phone: "" },
  { name: "Nandyal District Hospital", district: "Nandyal", mandal: "Nandyal", type: "DH", phone: "" },
  { name: "Atmakur PHC", district: "Nandyal", mandal: "Atmakur", type: "PHC", phone: "" },
  { name: "Allagadda PHC", district: "Nandyal", mandal: "Allagadda", type: "PHC", phone: "" },
  { name: "Banaganapalle PHC", district: "Nandyal", mandal: "Banaganapalle", type: "PHC", phone: "" },
  { name: "Vijayawada District Hospital", district: "NTR", mandal: "Vijayawada", type: "DH", phone: "" },
  { name: "Nandigama PHC", district: "NTR", mandal: "Nandigama", type: "PHC", phone: "" },
  { name: "Tiruvuru PHC", district: "NTR", mandal: "Tiruvuru", type: "PHC", phone: "" },
  { name: "Gannavaram PHC", district: "NTR", mandal: "Gannavaram", type: "PHC", phone: "" },
  { name: "Narasaraopet District Hospital", district: "Palnadu", mandal: "Narasaraopet", type: "DH", phone: "" },
  { name: "Sattenapalle PHC", district: "Palnadu", mandal: "Sattenapalle", type: "PHC", phone: "" },
  { name: "Gurazala PHC", district: "Palnadu", mandal: "Gurazala", type: "PHC", phone: "" },
  { name: "Vinukonda PHC", district: "Palnadu", mandal: "Vinukonda", type: "PHC", phone: "" },
  { name: "Parvathipuram District Hospital", district: "Parvathipuram Manyam", mandal: "Parvathipuram", type: "DH", phone: "" },
  { name: "Palakonda PHC", district: "Parvathipuram Manyam", mandal: "Palakonda", type: "PHC", phone: "" },
  { name: "Salur PHC", district: "Parvathipuram Manyam", mandal: "Salur", type: "PHC", phone: "" },
  { name: "Ongole District Hospital", district: "Prakasam", mandal: "Ongole", type: "DH", phone: "" },
  { name: "Markapur PHC", district: "Prakasam", mandal: "Markapur", type: "PHC", phone: "" },
  { name: "Kanigiri PHC", district: "Prakasam", mandal: "Kanigiri", type: "PHC", phone: "" },
  { name: "Chirala PHC", district: "Prakasam", mandal: "Chirala", type: "PHC", phone: "" },
  { name: "Srikakulam District Hospital", district: "Srikakulam", mandal: "Srikakulam", type: "DH", phone: "" },
  { name: "Palasa PHC", district: "Srikakulam", mandal: "Palasa", type: "PHC", phone: "" },
  { name: "Tekkali PHC", district: "Srikakulam", mandal: "Tekkali", type: "PHC", phone: "" },
  { name: "Ichapuram PHC", district: "Srikakulam", mandal: "Ichapuram", type: "PHC", phone: "" },
  { name: "Nellore District Hospital", district: "Sri Potti Sriramulu Nellore", mandal: "Nellore", type: "DH", phone: "" },
  { name: "Kavali PHC", district: "Sri Potti Sriramulu Nellore", mandal: "Kavali", type: "PHC", phone: "" },
  { name: "Gudur PHC", district: "Sri Potti Sriramulu Nellore", mandal: "Gudur", type: "PHC", phone: "" },
  { name: "Sullurpet PHC", district: "Sri Potti Sriramulu Nellore", mandal: "Sullurpet", type: "PHC", phone: "" },
  { name: "Puttaparthi District Hospital", district: "Sri Sathya Sai", mandal: "Puttaparthi", type: "DH", phone: "" },
  { name: "Dharmavaram PHC", district: "Sri Sathya Sai", mandal: "Dharmavaram", type: "PHC", phone: "" },
  { name: "Penukonda PHC", district: "Sri Sathya Sai", mandal: "Penukonda", type: "PHC", phone: "" },
  { name: "Kadiri PHC", district: "Sri Sathya Sai", mandal: "Kadiri", type: "PHC", phone: "" },
  { name: "Tirupati District Hospital", district: "Tirupati", mandal: "Tirupati", type: "DH", phone: "" },
  { name: "Srikalahasti PHC", district: "Tirupati", mandal: "Srikalahasti", type: "PHC", phone: "" },
  { name: "Puttur PHC", district: "Tirupati", mandal: "Puttur", type: "PHC", phone: "" },
  { name: "Nagari PHC", district: "Tirupati", mandal: "Nagari", type: "PHC", phone: "" },
  { name: "Visakhapatnam District Hospital", district: "Visakhapatnam", mandal: "Visakhapatnam", type: "DH", phone: "" },
  { name: "Bheemunipatnam PHC", district: "Visakhapatnam", mandal: "Bheemunipatnam", type: "PHC", phone: "" },
  { name: "Anakapalli PHC", district: "Visakhapatnam", mandal: "Anakapalli", type: "PHC", phone: "" },
  { name: "Vizianagaram District Hospital", district: "Vizianagaram", mandal: "Vizianagaram", type: "DH", phone: "" },
  { name: "Bobbili PHC", district: "Vizianagaram", mandal: "Bobbili", type: "PHC", phone: "" },
  { name: "Salur PHC", district: "Vizianagaram", mandal: "Salur", type: "PHC", phone: "" },
  { name: "Bhimavaram District Hospital", district: "West Godavari", mandal: "Bhimavaram", type: "DH", phone: "" },
  { name: "Narasapuram PHC", district: "West Godavari", mandal: "Narasapuram", type: "PHC", phone: "" },
  { name: "Tadepalligudem PHC", district: "West Godavari", mandal: "Tadepalligudem", type: "PHC", phone: "" },
  { name: "Kovvur PHC", district: "West Godavari", mandal: "Kovvur", type: "PHC", phone: "" },
  { name: "Kadapa District Hospital", district: "YSR Kadapa", mandal: "Kadapa", type: "DH", phone: "" },
  { name: "Pulivendula PHC", district: "YSR Kadapa", mandal: "Pulivendula", type: "PHC", phone: "" },
  { name: "Badvel PHC", district: "YSR Kadapa", mandal: "Badvel", type: "PHC", phone: "" },
  { name: "Jammalamadugu PHC", district: "YSR Kadapa", mandal: "Jammalamadugu", type: "PHC", phone: "" }
];

const TYPE_LABELS = {
  PHC: 'Primary Health Centre (PHC)',
  DH: 'District Hospital (DH)',
  CHC: 'Community Health Centre (CHC)',
  AH: 'Area Hospital (AH)',
  OTHER: 'Health Center'
};

export default function PHCs() {
  const { t } = useLanguage();

  const [phcs, setPhcs] = useState(PHC_DATASET);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  useEffect(() => {
    phcService.list(district ? { district } : {})
      .then(data => {
        if (data.data && data.data.length > 0) {
          setPhcs(data.data);
        } else {
          setPhcs(PHC_DATASET);
        }
      })
      .catch(() => {
        setPhcs(PHC_DATASET);
      });
  }, [district]);

  // Extract sorted unique districts
  const districts = useMemo(() => {
    const fromDataset = PHC_DATASET.map(p => p.district);
    return [...new Set(fromDataset)].sort();
  }, []);

  // Filtered PHC List based on district, search query, and facility type
  const filteredPhcs = useMemo(() => {
    return phcs.filter(p => {
      const matchDistrict = !district || p.district.toLowerCase() === district.toLowerCase();
      const matchType = selectedType === 'ALL' || p.type === selectedType;
      const matchSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.district.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchDistrict && matchType && matchSearch;
    });
  }, [phcs, district, selectedType, searchQuery]);

  const resetFilters = () => {
    setDistrict('');
    setSearchQuery('');
    setSelectedType('ALL');
  };

  return (
    <div className="list-page container">
      <div className="list-page-header">
        <div>
          <h1 className="list-title">{t('phcs_title')}</h1>
          <p className="list-subtitle">{t('phcs_subtitle')}</p>
        </div>
        <span className="phc-count-badge">
          {filteredPhcs.length} {filteredPhcs.length === 1 ? 'Center' : 'Centers'}
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="phc-controls card">
        <div className="phc-filters-two-col">
          {/* District Dropdown */}
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="district-select">{t('phcs_district')}</label>
            <select
              id="district-select"
              name="district"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">{t('phcs_all_districts')}</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Center Search Input */}
          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="phc-search-input">Search Center Name</label>
            <div className="phc-search-input-wrap">
              <input
                id="phc-search-input"
                name="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Tirupati, Kakinada, Area Hospital..."
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="phc-clear-btn" 
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <IconClose size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Facility Type Filter Pills */}
        <div className="facility-type-pills" role="radiogroup" aria-label="Filter by facility type">
          {[
            { id: 'ALL', label: t('phcs_filter_all') },
            { id: 'PHC', label: t('phcs_filter_phc') },
            { id: 'CHC', label: t('phcs_filter_chc') },
            { id: 'DH', label: t('phcs_filter_dh') },
            { id: 'AH', label: t('phcs_filter_ah') },
          ].map(type => (
            <button
              key={type.id}
              type="button"
              className={`pill-btn ${selectedType === type.id ? 'active' : ''}`}
              onClick={() => setSelectedType(type.id)}
              role="radio"
              aria-checked={selectedType === type.id}
            >
              {type.label}
            </button>
          ))}

          {(district || searchQuery || selectedType !== 'ALL') && (
            <button 
              type="button" 
              className="btn btn-ghost btn-sm" 
              onClick={resetFilters}
              style={{ marginLeft: 'auto' }}
            >
              {t('phcs_reset')}
            </button>
          )}
        </div>
      </div>

      {/* Centers Listing */}
      {loading ? (
        <div className="empty-state">
          <div className="spinner" />
          <p>{t('common_loading')}</p>
        </div>
      ) : filteredPhcs.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">
            <IconHospital size={28} />
          </div>
          <h3>{t('phcs_empty')}</h3>
          <p>Try choosing another district or resetting your filters.</p>
          <button type="button" className="btn btn-outline btn-sm" onClick={resetFilters}>
            {t('phcs_reset')}
          </button>
        </div>
      ) : (
        <div className="phc-grid">
          {filteredPhcs.map((phc, idx) => (
            <div key={idx} className="card phc-card card-elevated">
              <div className="phc-card-header">
                <div>
                  <h3 className="phc-name">{phc.name}</h3>
                  <p className="phc-location">
                    <IconMapPin size={15} />
                    <span>{phc.district}</span>
                  </p>
                </div>
                <span className={`phc-type-badge phc-badge-${phc.type || 'PHC'}`}>
                  {phc.type || 'PHC'}
                </span>
              </div>

              <div className="phc-card-details">
                <span className="phc-facility-title">
                  {TYPE_LABELS[phc.type] || phc.type}
                </span>
                {phc.phone ? (
                  <a href={`tel:${phc.phone}`} className="phc-phone-link">
                    <IconPhone size={15} />
                    <span>{phc.phone}</span>
                  </a>
                ) : (
                  <span className="phc-phone-note">
                    <IconPhone size={14} />
                    <span>Contact via 104 AP Health Line</span>
                  </span>
                )}
              </div>

              <div className="phc-card-actions">
                {phc.phone ? (
                  <a href={`tel:${phc.phone}`} className="btn btn-primary btn-sm btn-block">
                    <IconPhone size={15} />
                    <span>{t('phcs_call')}</span>
                  </a>
                ) : (
                  <a href="tel:104" className="btn btn-outline btn-sm btn-block">
                    <IconPhone size={15} />
                    <span>104 Health Helpline</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
