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
  { name: "Area Hospital, Paderu", district: "Alluri Sitharama Raju", mandal: "Paderu", type: "AH", phone: "089732 242222", category: "GOVERNMENT" },
  { name: "KIMS-Icon Hospital", district: "Alluri Sitharama Raju", mandal: "Paderu", type: "OTHER", phone: "0891 660 9999", category: "PRIVATE", note: "Serving the region via Vizag hub." },

  { name: "Area Hospital, Anakapalli", district: "Anakapalli", mandal: "Anakapalli", type: "AH", phone: "089242 222343", category: "GOVERNMENT" },
  { name: "NTR Trust Hospital / Sunshine Hospital", district: "Anakapalli", mandal: "Anakapalli", type: "OTHER", phone: "08924 223 555", category: "PRIVATE" },

  { name: "Government General Hospital, Anantapur", district: "Anantapur", mandal: "Anantapur", type: "DH", phone: "085542 750434", category: "GOVERNMENT" },
  { name: "KIMS Saveera Hospital", district: "Anantapur", mandal: "Anantapur", type: "OTHER", phone: "08554 273 701", category: "PRIVATE" },

  { name: "Government Area Hospital, Rayachoty", district: "Annamayya", mandal: "Rayachoti", type: "AH", phone: "085612 256225", category: "GOVERNMENT" },
  { name: "Spandana Super Speciality Hospital", district: "Annamayya", mandal: "Rayachoti", type: "OTHER", phone: "08561 224 455", category: "PRIVATE" },

  { name: "Area Hospital, Bapatla", district: "Bapatla", mandal: "Bapatla", type: "AH", phone: "084382 210456", category: "GOVERNMENT" },
  { name: "Srinivasa Super Speciality Hospital", district: "Bapatla", mandal: "Bapatla", type: "OTHER", phone: "08643 224 455", category: "PRIVATE" },

  { name: "Government District Hospital, Chittoor", district: "Chittoor", mandal: "Chittoor", type: "DH", phone: "085722 352327", category: "GOVERNMENT" },
  { name: "Apollo Khiladi Hospital", district: "Chittoor", mandal: "Chittoor", type: "OTHER", phone: "08572 227 800", category: "PRIVATE" },

  { name: "Government Area Hospital, Amalapuram", district: "Dr. B.R. Ambedkar Konaseema", mandal: "Amalapuram", type: "AH", phone: "088562 342218", category: "GOVERNMENT" },
  { name: "Amalapuram KIMS Hospital", district: "Dr. B.R. Ambedkar Konaseema", mandal: "Amalapuram", type: "OTHER", phone: "08856 226 600", category: "PRIVATE" },

  { name: "Government Hospital, Rajahmundry", district: "East Godavari", mandal: "Rajahmundry", type: "DH", phone: "088324 222029", category: "GOVERNMENT" },
  { name: "Swami Vaidyalaya SuperSpeciality Hospital", district: "East Godavari", mandal: "Rajahmundry", type: "OTHER", phone: "099665 91177", category: "PRIVATE" },

  { name: "District Government Hospital, Eluru", district: "Eluru", mandal: "Eluru", type: "DH", phone: "088122 301231", category: "GOVERNMENT" },
  { name: "Asram Eluru Medical College & Hospital", district: "Eluru", mandal: "Eluru", type: "OTHER", phone: "08812 288 000", category: "PRIVATE" },

  { name: "Government General Hospital, Guntur", district: "Guntur", mandal: "Guntur", type: "DH", phone: "086322 222111", category: "GOVERNMENT" },
  { name: "Aster Ramesh Hospital", district: "Guntur", mandal: "Guntur", type: "OTHER", phone: "0863 237 7777", category: "PRIVATE" },

  { name: "Government General Hospital, Kakinada", district: "Kakinada", mandal: "Kakinada", type: "DH", phone: "088423 633331", category: "GOVERNMENT" },
  { name: "Medicover Hospitals - Kakinada", district: "Kakinada", mandal: "Kakinada", type: "OTHER", phone: "040 6833 4455", category: "PRIVATE" },

  { name: "District Headquarters Hospital, Machilipatnam", district: "Krishna", mandal: "Machilipatnam", type: "DH", phone: "086722 522441", category: "GOVERNMENT" },
  { name: "Andhra Hospitals", district: "Krishna", mandal: "Machilipatnam", type: "OTHER", phone: "08672 223 344", category: "PRIVATE" },

  { name: "Government General Hospital, Kurnool", district: "Kurnool", mandal: "Kurnool", type: "DH", phone: "085182 755881", category: "GOVERNMENT" },
  { name: "KIMS Hospital Kurnool", district: "Kurnool", mandal: "Kurnool", type: "OTHER", phone: "08518 244 444", category: "PRIVATE" },

  { name: "Government Hospital, Nandyal", district: "Nandyal", mandal: "Nandyal", type: "DH", phone: "085142 221221", category: "GOVERNMENT" },
  { name: "Suraksha Super Speciality Hospital", district: "Nandyal", mandal: "Nandyal", type: "OTHER", phone: "08514 246 810", category: "PRIVATE" },

  { name: "Government General Hospital, Vijayawada", district: "NTR District", mandal: "Vijayawada", type: "DH", phone: "086625 74757", category: "GOVERNMENT" },
  { name: "Manipal Hospital Vijayawada", district: "NTR District", mandal: "Vijayawada", type: "OTHER", phone: "0866 228 9100", category: "PRIVATE" },

  { name: "Government Area Hospital, Narasaraopet", district: "Palnadu", mandal: "Narasaraopet", type: "AH", phone: "086472 220331", category: "GOVERNMENT" },
  { name: "Lalitha Super Speciality Hospital", district: "Palnadu", mandal: "Narasaraopet", type: "OTHER", phone: "08647 234 567", category: "PRIVATE" },

  { name: "Area Hospital, Parvathipuram", district: "Parvathipuram Manyam", mandal: "Parvathipuram", type: "AH", phone: "089632 220441", category: "GOVERNMENT" },
  { name: "Prajwala Hospital", district: "Parvathipuram Manyam", mandal: "Parvathipuram", type: "OTHER", phone: "08963 221 100", category: "PRIVATE" },

  { name: "Government General Hospital, Ongole", district: "Prakasam", mandal: "Ongole", type: "DH", phone: "085922 803331", category: "GOVERNMENT" },
  { name: "KIMS Ongole Hospital", district: "Prakasam", mandal: "Ongole", type: "OTHER", phone: "08592 663 333", category: "PRIVATE" },

  { name: "Dodla Subbareddy Government General Hospital, Nellore", district: "Sri Potti Sriramulu Nellore", mandal: "Nellore", type: "DH", phone: "086123 23282", category: "GOVERNMENT" },
  { name: "Medicover Hospitals - Nellore", district: "Sri Potti Sriramulu Nellore", mandal: "Nellore", type: "OTHER", phone: "040 6833 4455", category: "PRIVATE" },

  { name: "Government General Hospital, Puttaparthi", district: "Sri Sathya Sai", mandal: "Puttaparthi", type: "DH", phone: "085552 87222", category: "GOVERNMENT" },
  { name: "Sri Sathya Sai Institute of Higher Medical Sciences", district: "Sri Sathya Sai", mandal: "Puttaparthi", type: "OTHER", phone: "08555 287 388", category: "PRIVATE" },

  { name: "Government General Hospital, Srikakulam", district: "Srikakulam", mandal: "Srikakulam", type: "DH", phone: "089422 22333", category: "GOVERNMENT" },
  { name: "Medicover Hospitals Srikakulam", district: "Srikakulam", mandal: "Srikakulam", type: "OTHER", phone: "040 6833 4455", category: "PRIVATE" },

  { name: "SVRR Government General Hospital, Tirupati", district: "Tirupati", mandal: "Tirupati", type: "DH", phone: "087722 55655", category: "GOVERNMENT" },
  { name: "Amara Hospital", district: "Tirupati", mandal: "Tirupati", type: "OTHER", phone: "079939 33777", category: "PRIVATE" },

  { name: "King George Hospital (KGH), Visakhapatnam", district: "Visakhapatnam", mandal: "Visakhapatnam", type: "DH", phone: "089125 64891", category: "GOVERNMENT" },
  { name: "Apollo Hospitals, Visakhapatnam", district: "Visakhapatnam", mandal: "Visakhapatnam", type: "OTHER", phone: "0891 272 7272", category: "PRIVATE" },

  { name: "District Hospital, Vizianagaram", district: "Vizianagaram", mandal: "Vizianagaram", type: "DH", phone: "089222 73222", category: "GOVERNMENT" },
  { name: "Medicover Hospitals - Vizianagaram", district: "Vizianagaram", mandal: "Vizianagaram", type: "OTHER", phone: "040 6833 4455", category: "PRIVATE" },

  { name: "Government Area Hospital, Bhimavaram", district: "West Godavari", mandal: "Bhimavaram", type: "AH", phone: "081622 22411", category: "GOVERNMENT" },
  { name: "Apple Hospitals Tanuku", district: "West Godavari", mandal: "Bhimavaram", type: "OTHER", phone: "087904 99777", category: "PRIVATE" },

  { name: "Government RIMS Hospital, Kadapa", district: "YSR Kadapa", mandal: "Kadapa", type: "DH", phone: "085622 60233", category: "GOVERNMENT" },
  { name: "KIMS Sunrise Hospital Kadapa", district: "YSR Kadapa", mandal: "Kadapa", type: "OTHER", phone: "08562 258 500", category: "PRIVATE" }
];

const TYPE_LABELS = {
  PHC: 'Primary Health Centre (PHC)',
  DH: 'District Hospital (DH)',
  CHC: 'Community Health Centre (CHC)',
  AH: 'Area Hospital (AH)',
  OTHER: 'Hospital'
};

export default function PHCs() {
  const { t } = useLanguage();

  const [phcs, setPhcs] = useState(PHC_DATASET);
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

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

  const districts = useMemo(() => {
    const fromDataset = PHC_DATASET.map(p => p.district);
    return [...new Set(fromDataset)].sort();
  }, []);

  const filteredPhcs = useMemo(() => {
    return phcs.filter(p => {
      const matchDistrict = !district || p.district.toLowerCase() === district.toLowerCase();
      const matchType = selectedType === 'ALL' || p.type === selectedType;
      const matchCategory = selectedCategory === 'ALL' || (p.category || 'GOVERNMENT') === selectedCategory;
      const matchSearch = !searchQuery.trim() || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.district.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchDistrict && matchType && matchCategory && matchSearch;
    });
  }, [phcs, district, selectedType, selectedCategory, searchQuery]);

  const governmentHospitals = useMemo(() => filteredPhcs.filter(p => (p.category || 'GOVERNMENT') === 'GOVERNMENT'), [filteredPhcs]);
  const privateHospitals = useMemo(() => filteredPhcs.filter(p => (p.category || 'GOVERNMENT') === 'PRIVATE'), [filteredPhcs]);

  const resetFilters = () => {
    setDistrict('');
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedCategory('ALL');
  };

  return (
    <div className="list-page container">
      <div className="list-page-header">
        <div>
          <h1 className="list-title">{t('phcs_title')}</h1>
          <p className="list-subtitle">{t('phcs_subtitle')}</p>
        </div>
        <span className="phc-count-badge">
          {filteredPhcs.length} {filteredPhcs.length === 1 ? 'Hospital' : 'Hospitals'}
        </span>
      </div>

      <div className="phc-controls card">
        <div className="phc-filters-two-col">
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

          <div className="field" style={{ margin: 0 }}>
            <label htmlFor="phc-search-input">Search Hospital Name</label>
            <div className="phc-search-input-wrap">
              <input
                id="phc-search-input"
                name="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. KIMS, Apollo, Area Hospital..."
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

          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'GOVERNMENT', label: 'Government' },
            { id: 'PRIVATE', label: 'Private' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              role="radio"
              aria-checked={selectedCategory === cat.id}
            >
              {cat.label}
            </button>
          ))}

          {(district || searchQuery || selectedType !== 'ALL' || selectedCategory !== 'ALL') && (
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
        <div className="hospital-directory">
          {selectedCategory === 'PRIVATE' ? (
            <div className="hospital-section">
              <h2 className="hospital-section-title hospital-section-title--private">Private Hospitals</h2>
              <div className="phc-grid">
                {privateHospitals.map((phc, idx) => (
                  <div key={idx} className="card phc-card card-elevated">
                    <div className="phc-card-header">
                      <div>
                        <h3 className="phc-name">{phc.name}</h3>
                        <p className="phc-location">
                          <IconMapPin size={15} />
                          <span>{phc.district}</span>
                        </p>
                      </div>
                      <span className={`phc-type-badge phc-badge-${phc.type || 'OTHER'}`}>
                        {phc.type || 'OTHER'}
                      </span>
                    </div>

                    <div className="phc-card-details">
                      <span className="phc-facility-title">Private Hospital</span>
                      {phc.phone ? (
                        <a href={`tel:${phc.phone.replace(/\s+/g, '')}`} className="phc-phone-link">
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
                        <a href={`tel:${phc.phone.replace(/\s+/g, '')}`} className="btn btn-primary btn-sm btn-block">
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
            </div>
          ) : selectedCategory === 'GOVERNMENT' ? (
            <div className="hospital-section">
              <h2 className="hospital-section-title hospital-section-title--government">Government Hospitals</h2>
              <div className="phc-grid">
                {governmentHospitals.map((phc, idx) => (
                  <div key={idx} className="card phc-card card-elevated">
                    <div className="phc-card-header">
                      <div>
                        <h3 className="phc-name">{phc.name}</h3>
                        <p className="phc-location">
                          <IconMapPin size={15} />
                          <span>{phc.district}</span>
                        </p>
                      </div>
                      <span className={`phc-type-badge phc-badge-${phc.type || 'OTHER'}`}>
                        {phc.type || 'OTHER'}
                      </span>
                    </div>

                    <div className="phc-card-details">
                      <span className="phc-facility-title">Government Hospital</span>
                      {phc.phone ? (
                        <a href={`tel:${phc.phone.replace(/\s+/g, '')}`} className="phc-phone-link">
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
                        <a href={`tel:${phc.phone.replace(/\s+/g, '')}`} className="btn btn-primary btn-sm btn-block">
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
            </div>
          ) : (
            <div className="hospital-directory-split">
              {governmentHospitals.length > 0 && (
                <div className="hospital-section">
                  <h2 className="hospital-section-title hospital-section-title--government">Government Hospitals</h2>
                  <div className="phc-grid">
                    {governmentHospitals.map((phc, idx) => (
                      <div key={idx} className="card phc-card card-elevated">
                        <div className="phc-card-header">
                          <div>
                            <h3 className="phc-name">{phc.name}</h3>
                            <p className="phc-location">
                              <IconMapPin size={15} />
                              <span>{phc.district}</span>
                            </p>
                          </div>
                          <span className={`phc-type-badge phc-badge-${phc.type || 'OTHER'}`}>
                            {phc.type || 'OTHER'}
                          </span>
                        </div>

                        <div className="phc-card-details">
                          <span className="phc-facility-title">Government Hospital</span>
                          {phc.phone ? (
                            <a href={`tel:${phc.phone.replace(/\s+/g, '')}`} className="phc-phone-link">
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
                            <a href={`tel:${phc.phone.replace(/\s+/g, '')}`} className="btn btn-primary btn-sm btn-block">
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
                </div>
              )}

              {privateHospitals.length > 0 && (
                <div className="hospital-section">
                  <h2 className="hospital-section-title hospital-section-title--private">Private Hospitals</h2>
                  <div className="phc-grid">
                    {privateHospitals.map((phc, idx) => (
                      <div key={idx} className="card phc-card card-elevated">
                        <div className="phc-card-header">
                          <div>
                            <h3 className="phc-name">{phc.name}</h3>
                            <p className="phc-location">
                              <IconMapPin size={15} />
                              <span>{phc.district}</span>
                            </p>
                          </div>
                          <span className={`phc-type-badge phc-badge-${phc.type || 'OTHER'}`}>
                            {phc.type || 'OTHER'}
                          </span>
                        </div>

                        <div className="phc-card-details">
                          <span className="phc-facility-title">Private Hospital</span>
                          {phc.phone ? (
                            <a href={`tel:${phc.phone.replace(/\s+/g, '')}`} className="phc-phone-link">
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
                            <a href={`tel:${phc.phone.replace(/\s+/g, '')}`} className="btn btn-primary btn-sm btn-block">
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
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
