import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const translations = {
  English: {
    appName: 'Aarogya Connect',
    tagline: 'Telugu-first AI symptom guidance for rural Andhra Pradesh',
    nav_chat: 'Chat',
    nav_history: 'History',
    nav_phcs: 'PHCs & Hospitals',
    nav_profile: 'Profile',
    nav_login: 'Log in',
    nav_register: 'Get started',
    nav_logout: 'Log out',
    nav_menu: 'Menu',
    nav_close: 'Close menu',

    // Emergency Helpline Bar
    emergency_title: 'Emergency 24x7 Helplines:',
    emergency_108: '108 (Ambulance)',
    emergency_104: '104 (Health Advice)',
    emergency_112: '112 (Emergency)',

    // Hero Section
    hero_eyebrow: 'AI Symptom Checker · Smart India Hackathon 2026',
    hero_title: 'Describe how you feel. Know your next medical step.',
    hero_body: "Aarogya Connect asks clinically relevant follow-up questions in Telugu and English, identifies critical red flags instantly, and directs you to the right Andhra Pradesh healthcare center.",
    hero_cta_primary: 'Start Symptom Check',
    hero_cta_secondary: 'Explore Features',
    hero_disclaimer: 'Guidance only · Not a medical diagnosis or prescription',
    demo_label: 'Interactive Bilingual Triage Demo',

    // Quick Symptom Chips
    quick_fever: 'Fever for 2 days',
    quick_cough: 'Dry cough & throat irritation',
    quick_stomach: 'Stomach pain & nausea',
    quick_headache: 'Severe headache & dizziness',
    quick_chest: 'Chest heaviness & breathing issue',

    // Features Section
    feature_eyebrow: 'Built for Rural Healthcare Access',
    feature_title: 'Empowering Citizens, ASHA Workers & PHCs',
    feature1_title: 'Native Telugu, Not Machine Jargon',
    feature1_body: 'Formulated in conversational, respectful Telugu so rural families can communicate symptoms naturally without medical barrier.',
    feature2_title: 'Clinical Triage & Red-Flag Safety',
    feature2_body: 'Rule-based safety nets detect acute conditions immediately and advise when home care, PHC visit, or emergency transport is required.',
    feature3_title: 'Portable Health Records',
    feature3_body: 'Assessment logs and referral histories travel with the patient, helping ASHA workers and PHC doctors quickly review symptom timeline.',

    // How It Works
    how_eyebrow: 'How It Works',
    how_title: 'From symptom to healthcare step in 3 simple steps',
    how1_title: '1. Tell Us How You Feel',
    how1_body: 'Type in Telugu or English — conversational format with zero complex medical forms.',
    how2_title: '2. Answer Clarifying Follow-ups',
    how2_body: 'The AI evaluates duration, severity, and critical red flags to determine clinical urgency.',
    how3_title: '3. Receive Actionable Guidance',
    how3_body: 'Get structured advice: home monitoring, nearest PHC consultation, or immediate 108 emergency escalation.',

    // FAQ Section
    faq_eyebrow: 'Frequently Asked Questions',
    faq_title: 'Everything you need to know about Aarogya Connect',
    faq1_q: 'Is Aarogya Connect a replacement for a doctor?',
    faq1_a: 'No. Aarogya Connect provides primary-level symptom triage and guidance. It does not prescribe medications or diagnose diseases. Always consult a qualified healthcare provider.',
    faq2_q: 'Can I use this completely in Telugu?',
    faq2_a: 'Yes! The entire application, AI chatbot, triage badges, and PHC directory operate natively in Telugu and English. You can switch anytime.',
    faq3_q: 'How does it help ASHA workers and PHCs?',
    faq3_a: 'ASHA workers can use the tool in the field to triage village households, record referrals, and locate regional Primary Health Centres with contact numbers.',
    faq4_q: 'What should I do in a medical emergency?',
    faq4_a: 'If red-flag symptoms like severe chest pain, breathlessness, or unconsciousness appear, call 108 immediately or visit the nearest emergency facility.',

    // CTA
    cta_title: 'Healthcare guidance within your reach',
    cta_body: 'Free to use for every family in Andhra Pradesh. Backed by state PHC records.',
    cta_button: 'Get Started Now',
    footer_note: 'A Smart India Hackathon 2026 Project · Problem Statement SITE-AP-014 (AI Symptom-Checker Chatbot in Telugu for Rural AP)',
    footer_quick_links: 'Quick Links',
    footer_ap_health: 'AP Health Dept Portal',
    footer_aarogyasri: 'Dr. YSR Aarogyasri Trust',

    // Auth
    login_title: 'Welcome Back',
    login_subtitle: 'Log in to continue your symptom checks',
    login_email: 'Email address',
    login_password: 'Password',
    login_submit: 'Log In',
    login_switch: "Don't have an account?",
    login_switch_link: 'Create an account',

    register_title: 'Create Your Account',
    register_subtitle: 'Quick and free access for your family',
    register_name: 'Full Name',
    register_email: 'Email address',
    register_phone: '10-digit Mobile Number',
    register_age: 'Age',
    register_gender: 'Gender',
    register_gender_male: 'Male',
    register_gender_female: 'Female',
    register_gender_other: 'Other',
    register_password: 'Create Password (min 6 characters)',
    register_language: 'Preferred Language',
    register_submit: 'Create Free Account',
    register_switch: 'Already have an account?',
    register_switch_link: 'Log in here',

    // Chat
    chat_title: 'AI Symptom Checker',
    chat_placeholder: 'Describe your symptoms (e.g. fever for 2 days, body pain)...',
    chat_send: 'Send',
    chat_new: 'New Conversation',
    chat_empty: 'Tell me what symptoms you or your family member are experiencing today.',
    chat_empty_sub: 'You can tap any common symptom chip below or type freely in Telugu / English.',
    chat_thinking: 'Evaluating symptoms and clinical triage…',
    chat_disclaimer: 'AI guidance only · In life-threatening emergencies, call 108 immediately.',
    chat_sessions: 'Conversations',
    chat_no_sessions: 'No previous conversations',
    chat_delete: 'Delete session',
    chat_delete_confirm: 'Are you sure you want to delete this conversation?',
    chat_copied: 'Message copied to clipboard',
    chat_copy: 'Copy text',
    chat_find_phc: 'Find Nearest PHC',

    // History
    history_title: 'Symptom Assessment History',
    history_subtitle: 'Chronological triage record of all your symptom assessments',
    history_empty: 'No symptom assessments yet. Start a check to build your medical history.',
    history_symptoms: 'Reported Symptoms',
    history_recommendation: 'Recommended Action',
    history_filter_all: 'All Levels',
    history_view_phc: 'Locate Recommended PHC',

    // PHCs
    phcs_title: 'PHC & Hospital Directory',
    phcs_subtitle: 'Explore government Primary Health Centres across 26 Andhra Pradesh districts',
    phcs_empty: 'No health centers found matching your filters.',
    phcs_district: 'District',
    phcs_mandal: 'Mandal Search',
    phcs_mandal_placeholder: 'Type mandal name...',
    phcs_all_districts: 'All 26 AP Districts',
    phcs_filter_all: 'All Facilities',
    phcs_filter_phc: 'PHC (Primary)',
    phcs_filter_chc: 'CHC (Community)',
    phcs_filter_dh: 'DH (District Hospital)',
    phcs_filter_ah: 'AH (Area Hospital)',
    phcs_search: 'Search',
    phcs_reset: 'Reset Filters',
    phcs_call: 'Call Center',

    // Profile
    profile_title: 'Member Profile',
    profile_subtitle: 'Your personal health account details',
    profile_summary_title: 'Healthcare Profile',
    profile_save: 'Save Profile Changes',
    profile_saved: 'Profile updated successfully',
    profile_member_since: 'Member Since',
    profile_total_checks: 'Symptom Checks Completed',

    // Triage Recommendations
    rec_home_monitor: 'Home Care & Hydration (Mild)',
    rec_monitor_phc: 'Monitor closely, visit PHC if not resolving in 2-3 days',
    rec_phc_soon: 'Consult Doctor at Primary Health Centre (PHC) soon',
    rec_emergency: 'Seek immediate Emergency Medical Care (Call 108)',

    // Common
    common_loading: 'Processing…',
    common_error: 'Something went wrong. Please check your connection and try again.',
    common_required: 'This field is required',
    common_back: 'Back to Home',
    common_cancel: 'Cancel',
    common_close: 'Close',
    common_success: 'Operation completed',
  },

  Telugu: {
    appName: 'ఆరోగ్య కనెక్ట్',
    tagline: 'గ్రామీణ ఆంధ్రప్రదేశ్ కోసం తెలుగులో AI లక్షణాల మార్గదర్శకం',
    nav_chat: 'చాట్',
    nav_history: 'చరిత్ర',
    nav_phcs: 'PHC & ఆసుపత్రులు',
    nav_profile: 'ప్రొఫైల్',
    nav_login: 'లాగిన్',
    nav_register: 'ప్రారంభించండి',
    nav_logout: 'లాగ్ అవుట్',
    nav_menu: 'మెనూ',
    nav_close: 'మెనూ మూసివేయి',

    // Emergency Helpline Bar
    emergency_title: '24x7 అత్యవసర హెల్ప్‌లైన్ నంబర్లు:',
    emergency_108: '108 (అత్యవసర అంబులెన్స్)',
    emergency_104: '104 (ఆరోగ్య సలహా సేవ)',
    emergency_112: '112 (జాతీయ అత్యవసరం)',

    // Hero Section
    hero_eyebrow: 'AI లక్షణ పరీక్ష · స్మార్ట్ ఇండియా హ్యాకథాన్ 2026',
    hero_title: 'మీకు ఎలా అనిపిస్తుందో చెప్పండి. సరైన వైద్య అడుగు తెలుసుకోండి.',
    hero_body: 'ఆరోగ్య కనెక్ట్ తెలుగు లేదా ఇంగ్లీష్‌లో సరైన ప్రశ్నలు అడుగుతుంది, అత్యవసర ప్రమాద సంకేతాలను వెంటనే గుర్తిస్తుంది, మరియు ఆంధ్రప్రదేశ్ ఆరోగ్య కేంద్రాలకు తగిన మార్గదర్శనం చేస్తుంది.',
    hero_cta_primary: 'లక్షణ పరీక్ష ప్రారంభించండి',
    hero_cta_secondary: 'వివరాలు చూడండి',
    hero_disclaimer: 'ప్రాథమిక మార్గదర్శకం మాత్రమే · వైద్య నిర్ధారణ లేదా మందుల చీటీ కాదు',
    demo_label: 'లైవ్ ద్విభాషా ట్రయాజ్ డెమో',

    // Quick Symptom Chips
    quick_fever: 'రెండు రోజులుగా జ్వరం & చలి',
    quick_cough: 'పొడి దగ్గు & గొంతు నొప్పి',
    quick_stomach: 'కడుపు నొప్పి & వికారం',
    quick_headache: 'తీవ్రమైన తలనొప్పి & నీరసం',
    quick_chest: 'ఛాతీలో నొప్పి & శ్వాస ఇబ్బంది',

    // Features Section
    feature_eyebrow: 'గ్రామీణ ఆరోగ్య సేవలకు అనుకూలం',
    feature_title: 'ప్రజలు, ఆశా కార్యకర్తలు మరియు PHCల కోసం రూపకల్పన',
    feature1_title: 'సహజమైన తెలుగు భాష',
    feature1_body: 'యంత్ర అనువాద వైద్య పరిభాష కాకుండా, గ్రామీణ ప్రజలు సులభంగా అర్థం చేసుకునే సహజమైన, గౌరవప్రదమైన తెలుగులో ఉంటుంది.',
    feature2_title: 'క్లినికల్ ట్రయాజ్ & ప్రమాద హెచ్చరికలు',
    feature2_body: 'తీవ్రమైన ప్రమాద లక్షణాలను వెంటనే గుర్తించి: ఇంట్లో పర్యవేక్షణ, PHC సందర్శన లేదా 108 అత్యవసర సంరక్షణ అవసరమో స్పష్టంగా చెబుతుంది.',
    feature3_title: 'మీతో ఉండే ఆరోగ్య రికార్డు',
    feature3_body: 'ప్రతి అంచనా భద్రపరచబడుతుంది, తద్వారా ఆశా కార్యకర్తలు మరియు PHC వైద్యులు మీ సమస్యల చరిత్రను సులభంగా పరిశీలించగలరు.',

    // How It Works
    how_eyebrow: 'ఇది ఎలా పనిచేస్తుంది',
    how_title: '3 సులభమైన దశల్లో సరైన వైద్య మార్గదర్శనం',
    how1_title: '1. మీ లక్షణాలను వివరించండి',
    how1_body: 'తెలుగు లేదా ఇంగ్లీష్‌లో సాధారణ మాటల్లో టైప్ చేయండి — క్లిష్టమైన ఫారాలు నింపాల్సిన పనిలేదు.',
    how2_title: '2. కొన్ని ప్రశ్నలకు సమాధానం ఇవ్వండి',
    how2_body: 'సమస్య తీవ్రత మరియు వ్యవధిని అర్థం చేసుకుని AI క్లినికల్ స్థితిని అంచనా వేస్తుంది.',
    how3_title: '3. స్పష్టమైన తదుపరి అడుగు పొందండి',
    how3_body: 'ఇంట్లో జాగ్రత్తలు, సమీప PHC సందర్శన లేదా అత్యవసర పరిస్థితిలో 108 అంబులెన్స్ పిలుపు వంటి స్పష్టమైన సలహా లభిస్తుంది.',

    // FAQ Section
    faq_eyebrow: 'తరచుగా అడిగే ప్రశ్నలు (FAQ)',
    faq_title: 'ఆరోగ్య కనెక్ట్ గురించి ముఖ్యమైన విషయాలు',
    faq1_q: 'ఆరోగ్య కనెక్ట్ డాక్టర్ స్థానాన్ని భర్తీ చేస్తుందా?',
    faq1_a: 'లేదు. ఆరోగ్య కనెక్ట్ ప్రాథమిక లక్షణాల తీవ్రతను అంచనా వేసి సరైన మార్గదర్శకం మాత్రమే ఇస్తుంది. ఇది మందులను సిఫార్సు చేయదు. ఎల్లప్పుడూ వైద్యుడిని సంప్రదించండి.',
    faq2_q: 'దీనిని పూర్తిగా తెలుగులోనే ఉపయోగించవచ్చా?',
    faq2_a: 'అవును! చాట్‌బాట్, సమాధానాలు, ఆరోగ్య కేంద్రాల వివరాలు అన్నీ తెలుగు మరియు ఇంగ్లీష్‌లో ఉంటాయి. మీరు ఎప్పుడైనా భాష మార్చుకోవచ్చు.',
    faq3_q: 'ఆశా కార్యకర్తలకు ఇది ఎలా ఉపయోగపడుతుంది?',
    faq3_a: 'గ్రామాల్లో పర్యటించే సమయంలో కుటుంబాల లక్షణాలను వెంటనే అంచనా వేసి, సమీప PHC కి రిఫరల్ చేయడానికి ఆశా కార్యకర్తలకు ఎంతో తోడ్పడుతుంది.',
    faq4_q: 'అత్యవసర పరిస్థితిలో ఏం చేయాలి?',
    faq4_a: 'తీవ్రమైన గుండె నొప్పి, ఊపిరి ఆడకపోవడం లేదా అపస్మారక స్థితి వంటి లక్షణాలు ఉంటే వెంటనే 108 కి కాల్ చేయండి లేదా దగ్గరలోని అత్యవసర ఆసుపత్రికి వెళ్ళండి.',

    // CTA
    cta_title: 'మీ ఆరోగ్య రక్షణ, ఒక సంభాషణ దూరంలో',
    cta_body: 'ఆంధ్రప్రదేశ్‌లోని ప్రతి కుటుంబానికి ఉచిత సేవ. రాష్ట్ర PHC అధికారిక రికార్డులతో అనుసంధానం.',
    cta_button: 'ఉచితంగా ప్రారంభించండి',
    footer_note: 'స్మార్ట్ ఇండియా హ్యాకథాన్ 2026 ప్రాజెక్ట్ · సమస్య ప్రకటన SITE-AP-014 (గ్రామీణ AP కోసం తెలుగు AI సింప్టమ్ చెకర్)',
    footer_quick_links: 'ముఖ్యమైన లింకులు',
    footer_ap_health: 'ఆంధ్రప్రదేశ్ వైద్య ఆరోగ్య శాఖ',
    footer_aarogyasri: 'డా. వైఎస్సార్ ఆరోగ్యశ్రీ ట్రస్ట్',

    // Auth
    login_title: 'తిరిగి స్వాగతం',
    login_subtitle: 'మీ లక్షణ పరీక్షలను కొనసాగించడానికి లాగిన్ అవ్వండి',
    login_email: 'ఇమెయిల్ చిరునామా',
    login_password: 'పాస్‌వర్డ్',
    login_submit: 'లాగిన్ అవ్వండి',
    login_switch: 'ఇంకా ఖాతా లేదా?',
    login_switch_link: 'కొత్త ఖాతా సృష్టించండి',

    register_title: 'మీ ఖాతాను సృష్టించండి',
    register_subtitle: 'మీ కుటుంబం కోసం సులభమైన ఉచిత నమోదు',
    register_name: 'పూర్తి పేరు',
    register_email: 'ఇమెయిల్ చిరునామా',
    register_phone: '10 అంకెల మొబైల్ నంబర్',
    register_age: 'వయస్సు',
    register_gender: 'లింగం',
    register_gender_male: 'పురుషుడు',
    register_gender_female: 'స్త్రీ',
    register_gender_other: 'ఇతర',
    register_password: 'పాస్‌వర్డ్ (కనీసం 6 అక్షరాలు)',
    register_language: 'ఇష్టమైన భాష',
    register_submit: 'ఉచిత ఖాతా సృష్టించండి',
    register_switch: 'ఇప్పటికే ఖాతా ఉందా?',
    register_switch_link: 'ఇక్కడ లాగిన్ అవ్వండి',

    // Chat
    chat_title: 'AI లక్షణ పరీక్ష',
    chat_placeholder: 'మీ లక్షణాలను ఇక్కడ రాయండి (ఉదా: 2 రోజులుగా జ్వరం, ఒళ్ళు నొప్పులు)...',
    chat_send: 'పంపండి',
    chat_new: 'కొత్త సంభాషణ',
    chat_empty: 'ఈ రోజు మీకు లేదా మీ కుటుంబ సభ్యులకు ఉన్న లక్షణాలను చెప్పండి.',
    chat_empty_sub: 'క్రింద ఉన్న సూచన బటన్లపై నొక్కవచ్చు లేదా తెలుగు/ఇంగ్లీష్‌లో టైప్ చేయవచ్చు.',
    chat_thinking: 'లక్షణాలను పరిశీలిస్తోంది…',
    chat_disclaimer: 'AI ప్రాథమిక సలహా మాత్రమే · ప్రాణాపాయ అత్యవసర పరిస్థితుల్లో వెంటనే 108 కి కాల్ చేయండి.',
    chat_sessions: 'గత సంభాషణలు',
    chat_no_sessions: 'ఇంకా సంభాషణలు లేవు',
    chat_delete: 'సంభాషణ తొలగించు',
    chat_delete_confirm: 'ఈ సంభాషణను నిజంగానే తొలగించాలనుకుంటున్నారా?',
    chat_copied: 'సందేశం కాపీ చేయబడింది',
    chat_copy: 'కాపీ చేయండి',
    chat_find_phc: 'సమీప PHC కనుగొనండి',

    // History
    history_title: 'లక్షణ అంచనా చరిత్ర',
    history_subtitle: 'మీరు నిర్వహించిన లక్షణ పరీక్షల పూర్తి రికార్డు',
    history_empty: 'ఇంకా ఎటువంటి అంచనాలు లేవు. పరీక్షను ప్రారంభించి మీ ఆరోగ్య చరిత్రను చూడండి.',
    history_symptoms: 'తెలిపిన లక్షణాలు',
    history_recommendation: 'సిఫార్సు చేయబడిన చర్య',
    history_filter_all: 'అన్ని స్థాయిలు',
    history_view_phc: 'సిఫార్సు చేసిన PHC ని కనుగొనండి',

    // PHCs
    phcs_title: 'PHC & ఆసుపత్రుల డైరెక్టరీ',
    phcs_subtitle: 'ఆంధ్రప్రదేశ్‌లోని 26 జిల్లాల ప్రభుత్వ ప్రాథమిక ఆరోగ్య కేంద్రాల వివరాలు',
    phcs_empty: 'మీ శోధనకు సరిపోయే ఆరోగ్య కేంద్రాలు కనుగొనలేకపోయాయి.',
    phcs_district: 'జిల్లా ఎంపిక',
    phcs_mandal: 'మండలం శోధన',
    phcs_mandal_placeholder: 'మండలం పేరు టైప్ చేయండి...',
    phcs_all_districts: 'ఆంధ్రప్రదేశ్ 26 జిల్లాలు',
    phcs_filter_all: 'అన్ని కేంద్రాలు',
    phcs_filter_phc: 'PHC (ప్రాథమిక ఆరోగ్య కేంద్రం)',
    phcs_filter_chc: 'CHC (కమ్యూనిటీ హెల్త్ సెంటర్)',
    phcs_filter_dh: 'DH (జిల్లా ఆసుపత్రి)',
    phcs_filter_ah: 'AH (ఏరియా ఆసుపత్రి)',
    phcs_search: 'శోధించండి',
    phcs_reset: 'రీసెట్ చేయండి',
    phcs_call: 'కాల్ చేయండి',

    // Profile
    profile_title: 'సభ్యుడి ప్రొఫైల్',
    profile_subtitle: 'మీ వ్యక్తిగత ఆరోగ్య ఖాతా వివరాలు',
    profile_summary_title: 'ఆరోగ్య ఖాతా సారాంశం',
    profile_save: 'మార్పులను సేవ్ చేయండి',
    profile_saved: 'ప్రొఫైల్ వివరాలు నవీకరించబడ్డాయి',
    profile_member_since: 'చేరిన తేదీ',
    profile_total_checks: 'పూర్తి చేసిన లక్షణ పరీక్షలు',

    // Triage Recommendations
    rec_home_monitor: 'ఇంట్లో విశ్రాంతి & తగినంత నీరు (తేలికపాటిది)',
    rec_monitor_phc: 'జాగ్రత్తగా గమనించండి, 2-3 రోజుల్లో తగ్గకపోతే PHC సందర్శించండి',
    rec_phc_soon: 'త్వరలో ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) లో వైద్యుడిని సంప్రదించండి',
    rec_emergency: 'వెంటనే అత్యవసర వైద్య సంరక్షణ పొందండి (108 కి కాల్ చేయండి)',

    // Common
    common_loading: 'లోడ్ అవుతోంది…',
    common_error: 'ఏదో తప్పు జరిగింది. దయచేసి ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేసి మళ్లీ ప్రయత్నించండి.',
    common_required: 'ఈ ఫీల్డ్ తప్పనిసరి',
    common_back: 'హోమ్‌కి తిరిగి వెళ్ళండి',
    common_cancel: 'రద్దు చేయండి',
    common_close: 'మూసివేయి',
    common_success: 'విజయవంతంగా పూర్తయింది',
  }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('aarogya_lang') || 'Telugu');

  useEffect(() => {
    localStorage.setItem('aarogya_lang', language);
    document.documentElement.lang = language === 'Telugu' ? 'te' : 'en';
  }, [language]);

  const t = useMemo(() => {
    const dict = translations[language] || translations.English;
    return (key) => dict[key] ?? translations.English[key] ?? key;
  }, [language]);

  const toggleLanguage = () => setLanguage(prev => (prev === 'Telugu' ? 'English' : 'Telugu'));

  const value = { language, setLanguage, toggleLanguage, t };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
