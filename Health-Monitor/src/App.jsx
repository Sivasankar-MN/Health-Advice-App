import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [symptoms, setSymptoms] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [symptomSuggestions, setSymptomSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [language, setLanguage] = useState('en');

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const savedLanguage = localStorage.getItem('language') || 'en';
    
    setDarkMode(savedDarkMode);
    setSearchHistory(savedHistory);
    setLanguage(savedLanguage);
    
    // Apply dark mode if saved
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Change language and save preference
  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  // Expanded comprehensive symptom database
  const symptomDatabase = {
    // Respiratory system
    'cough': 'Stay hydrated and rest. Try honey (if over 1 year old) or lozenges to soothe throat. Use a humidifier. Seek medical attention if cough is severe, produces blood or thick green/yellow mucus, or if you have difficulty breathing.',
    'shortness of breath': 'SEEK IMMEDIATE MEDICAL ATTENTION, especially if sudden or severe. This could indicate a serious condition requiring urgent care.',
    'wheezing': 'Try to remain calm and sit upright. Use prescribed inhalers if available. Seek medical attention if severe or if you have a history of asthma or COPD.',
    'sore throat': 'Gargle with warm salt water. Drink warm liquids. Use throat lozenges. Seek medical attention if severe, lasts more than a week, or is accompanied by difficulty swallowing or breathing.',
    'runny nose': 'Rest and stay hydrated. Use saline nasal sprays. Over-the-counter decongestants may help. Consult a doctor if symptoms last more than 10 days or are accompanied by high fever.',
    'congestion': 'Use a humidifier, take steamy showers, and try saline nasal sprays. Stay hydrated. Rest with your head elevated. Seek medical help if symptoms worsen or persist beyond 10 days.',
    
    // Digestive system
    'nausea': 'Eat bland foods. Stay hydrated with small sips of clear fluids. Avoid strong odors, fatty or spicy foods. Seek medical attention if severe, persistent, or accompanied by severe abdominal pain.',
    'vomiting': 'Stay hydrated with small sips of clear fluids. Try bland foods when feeling better. Seek medical attention if severe, persistent, contains blood, or if you can\'t keep fluids down for 24 hours.',
    'diarrhea': 'Stay well-hydrated with water, clear broths, and electrolyte solutions. Eat bland, easy-to-digest foods. Seek medical attention if severe, contains blood, lasts more than 2 days, or is accompanied by high fever.',
    'constipation': 'Increase fiber and water intake. Exercise regularly. Consider over-the-counter stool softeners. Consult a doctor if severe or lasting more than a week.',
    'abdominal pain': 'Rest, apply heat, and avoid foods that might irritate the stomach. Seek immediate medical attention if pain is severe, persistent, or accompanied by fever, vomiting, or blood in stool.',
    'bloating': 'Eat smaller meals slowly. Avoid gas-producing foods. Stay hydrated. Try gentle exercise. Consult a doctor if severe or accompanied by significant pain.',
    'heartburn': 'Avoid large meals, especially before bedtime. Limit spicy, fatty foods and alcohol. Try over-the-counter antacids. Seek medical advice if frequent or severe.',
    'loss of appetite': 'Try eating smaller, more frequent meals. Choose nutrient-dense foods. Consult a healthcare provider if persistent, accompanied by weight loss, or other concerning symptoms.',
    
    // Neurological
    'headache': 'Rest in a quiet, dark room. Stay hydrated. Try over-the-counter pain relievers if needed. See a doctor if severe, sudden, or accompanied by other symptoms like fever, neck stiffness, confusion, or visual changes.',
    'migraine': 'Rest in a dark, quiet room. Apply cold compresses. Try over-the-counter pain medications. Consult a doctor for recurring migraines to discuss preventive treatments.',
    'dizziness': 'Sit or lie down immediately. Stay hydrated. Avoid sudden movements. Seek immediate medical attention if accompanied by chest pain, severe headache, difficulty speaking, or numbness.',
    'vertigo': 'Sit or lie down immediately. Avoid sudden head movements. Seek medical attention, especially if severe or recurring.',
    'confusion': 'SEEK IMMEDIATE MEDICAL ATTENTION. This could indicate a serious condition like stroke, infection, or metabolic problem requiring urgent care.',
    'memory problems': 'Keep a regular routine, use memory aids, stay mentally active, and maintain social connections. Consult a healthcare provider for persistent or worsening memory issues.',
    'tingling': 'Change position if tingling might be from pressure on nerves. Seek medical attention if persistent, painful, or spreading, as it could indicate nerve damage or other serious conditions.',
    'seizure': 'If witnessing someone having a seizure: Keep them safe, turn them on their side, don\'t restrain them, don\'t put anything in their mouth. Call emergency services if the seizure lasts more than 5 minutes or if the person doesn\'t regain consciousness.',
    
    // Cardiovascular
    'chest pain': 'SEEK IMMEDIATE MEDICAL ATTENTION by calling emergency services (911). This could indicate a heart attack or other serious condition requiring urgent care.',
    'palpitations': 'Rest and practice deep breathing. Avoid caffeine, alcohol, and nicotine. Seek medical attention if palpitations are accompanied by chest pain, shortness of breath, dizziness, or fainting.',
    'high blood pressure': 'Maintain a healthy diet low in salt, exercise regularly, manage stress, and take prescribed medications. Regular monitoring is important. Consult your healthcare provider for guidance.',
    'swollen legs': 'Elevate your legs when resting. Reduce salt intake. Stay active. Seek medical attention if swelling is sudden, painful, or accompanied by difficulty breathing.',
    
    // Skin conditions
    'rash': 'Avoid scratching. Try cool compresses or oatmeal baths. Use fragrance-free moisturizers. Seek medical attention if rapidly spreading, painful, accompanied by fever, or if it forms blisters.',
    'itching': 'Avoid scratching. Use fragrance-free moisturizers, cool compresses, or oatmeal baths. Try over-the-counter antihistamines. Consult a doctor if severe or persistent.',
    'hives': 'Take over-the-counter antihistamines. Apply cool compresses. Avoid triggers. Seek emergency care if accompanied by difficulty breathing or swelling of face, lips, or tongue.',
    'dry skin': 'Use moisturizers regularly, especially after bathing. Use gentle, fragrance-free cleansers. Consider using a humidifier. Consult a dermatologist if severe or not improving with self-care.',
    'excessive sweating': 'Use antiperspirants, wear moisture-wicking clothing, and practice good hygiene. Consult a doctor if excessive sweating interferes with daily activities or started suddenly.',
    
    // Musculoskeletal
    'joint pain': 'Rest the affected joint. Apply ice for acute pain or heat for chronic pain. Use over-the-counter pain relievers if needed. Consult a doctor if severe, persistent, or accompanied by swelling or redness.',
    'back pain': 'Maintain good posture, use proper lifting techniques, stay active, and strengthen core muscles. Try over-the-counter pain relievers and heat/ice therapy. Consult a doctor if severe, persistent, or if you have neurological symptoms.',
    'muscle aches': 'Rest, apply ice or heat, and try over-the-counter pain relievers. Stay hydrated and consider gentle stretching. Seek medical attention if severe, persistent, or if you also have a rash or fever.',
    'neck pain': 'Apply heat or ice, practice good posture, and try gentle stretches. Seek medical attention if severe, persistent, or accompanied by numbness or weakness in arms or hands.',
    'leg cramps': 'Gently stretch and massage the affected muscle. Stay hydrated and consider adding potassium-rich foods to your diet. Consult a doctor if frequent or severe.',
    
    // General symptoms
    'fever': 'Rest and stay hydrated. Take acetaminophen or ibuprofen to reduce fever. Seek medical attention if fever is very high (>103°F/39.4°C), lasts more than 3 days, or is accompanied by severe symptoms.',
    'fatigue': 'Ensure adequate rest and sleep. Stay hydrated and maintain a balanced diet. Consider stress reduction techniques. Consult a doctor if persistent or significantly impacts daily activities.',
    'weakness': 'Rest and maintain good nutrition. Seek medical attention if sudden, severe, or accompanied by other symptoms like fever or difficulty speaking.',
    'weight loss': 'Consult a healthcare provider for unexplained weight loss as this could indicate various medical conditions requiring proper evaluation.',
    'weight gain': 'Focus on balanced nutrition and regular physical activity. Consult a healthcare provider if weight gain is rapid, unexpected, or accompanied by other symptoms.',
    'night sweats': 'Keep your bedroom cool, use moisture-wicking bedding, and avoid alcohol before bed. Consult a doctor if persistent or accompanied by fever, weight loss, or other concerning symptoms.',
    'insomnia': 'Maintain a regular sleep schedule, create a restful environment, limit screen time before bed, and avoid caffeine late in the day. Consult a doctor if persistent or significantly impacts daily functioning.',
    
    // Eye symptoms
    'red eye': 'Rest your eyes. Use lubricating eye drops. Avoid touching or rubbing your eyes. Seek medical attention if painful, affects vision, or doesn\'t improve within a day or two.',
    'eye pain': 'SEEK PROMPT MEDICAL ATTENTION. Eye pain can indicate serious conditions requiring professional evaluation.',
    'blurred vision': 'SEEK MEDICAL ATTENTION. Sudden or persistent blurred vision can indicate serious conditions requiring prompt evaluation.',
    'double vision': 'SEEK IMMEDIATE MEDICAL ATTENTION. This could indicate a serious neurological condition.',
    
    // Ear symptoms
    'ear pain': 'Apply a warm compress. Try over-the-counter pain relievers. Keep the ear dry. Consult a doctor if severe, persistent, or accompanied by fever, discharge, or hearing loss.',
    'hearing loss': 'Seek medical evaluation. Avoid inserting anything into the ear. Protect ears from loud noises. This requires professional assessment.',
    'ringing in ears': 'Avoid loud noises. Try white noise or relaxation techniques. Consult a doctor for persistent or bothersome tinnitus.',
    
    // Urinary & reproductive
    'painful urination': 'Drink plenty of water. Avoid alcohol and caffeine. Seek medical attention as this often indicates infection requiring treatment.',
    'frequent urination': 'Limit fluid intake before bedtime. Avoid caffeine and alcohol. Consult a doctor as this could indicate diabetes, infection, or other conditions.',
    'blood in urine': 'SEEK PROMPT MEDICAL ATTENTION. This can indicate infection, kidney stones, or more serious conditions requiring evaluation.',
    'menstrual pain': 'Apply heat to the lower abdomen. Try over-the-counter pain relievers. Rest as needed. Consult a doctor if severe or significantly interferes with daily activities.',
    'irregular periods': 'Track your cycle. Maintain a healthy lifestyle. Consult a healthcare provider as irregular periods can indicate hormonal imbalances or other conditions requiring evaluation.',
    
    // Mental health
    'anxiety': 'Practice deep breathing and mindfulness techniques. Maintain physical activity and adequate sleep. Consider professional help for ongoing anxiety management.',
    'depression': 'Maintain social connections, physical activity, and regular sleep patterns. Seek professional help for ongoing depression management.',
    'stress': 'Practice relaxation techniques like deep breathing or meditation. Maintain physical activity and adequate sleep. Seek support from friends, family, or professionals if needed.',
    'mood swings': 'Maintain regular sleep patterns, physical activity, and balanced nutrition. Track triggers and symptoms. Consider professional help for significant mood disturbances.',
    'panic attack': 'Focus on slow, deep breathing. Remind yourself it will pass. Move to a quiet place if possible. Seek professional help for recurring panic attacks.',
    
    // Emergency symptoms
    'stroke symptoms': 'CALL 911 IMMEDIATELY. Look for Face drooping, Arm weakness, Speech difficulties, Time to call emergency services.',
    'heart attack symptoms': 'CALL 911 IMMEDIATELY. Symptoms include chest pain/pressure, pain in arms/back/neck/jaw, shortness of breath, cold sweat, nausea, lightheadedness.',
    'difficulty breathing': 'SEEK IMMEDIATE MEDICAL ATTENTION by calling emergency services (911). This is a serious symptom requiring urgent care.',
    'severe bleeding': 'Apply direct pressure with a clean cloth. If possible, elevate the injured area. CALL 911 FOR SEVERE OR UNCONTROLLED BLEEDING.',
    'loss of consciousness': 'CALL 911 IMMEDIATELY. Check breathing and pulse. If trained, begin CPR if needed. Do not move the person unless necessary for safety.',
    'poisoning': 'CALL POISON CONTROL (1-800-222-1222) or 911 IMMEDIATELY. Do not induce vomiting unless directed by medical professionals.'
  };

  // Symptom categories for better pattern matching
  const symptomCategories = {
    respiratory: ['breathing', 'breath', 'cough', 'wheeze', 'sneezing', 'sneeze', 'phlegm', 'mucus', 'throat', 'nasal', 'nose', 'sinus', 'congestion', 'congested'],
    digestive: ['stomach', 'nausea', 'vomit', 'diarrhea', 'constipation', 'bowel', 'intestinal', 'digestion', 'appetite', 'abdomen', 'abdominal', 'bloating', 'bloated', 'gas', 'heartburn', 'indigestion', 'acid reflux'],
    cardiovascular: ['heart', 'chest', 'pulse', 'palpitation', 'blood pressure', 'hypertension', 'circulation', 'swelling', 'swollen', 'edema'],
    neurological: ['head', 'headache', 'migraine', 'dizzy', 'dizziness', 'balance', 'vertigo', 'faint', 'fainting', 'confusion', 'memory', 'concentration', 'tingling', 'numbness', 'seizure', 'tremor'],
    musculoskeletal: ['muscle', 'joint', 'bone', 'back', 'neck', 'shoulder', 'arm', 'leg', 'knee', 'ankle', 'wrist', 'sprain', 'strain', 'cramp', 'stiffness', 'pain'],
    skin: ['rash', 'itch', 'hives', 'dry skin', 'sweat', 'sweating', 'blister', 'sore', 'wound', 'bruise', 'acne', 'eczema', 'psoriasis'],
    general: ['fever', 'temperature', 'chills', 'fatigue', 'tired', 'tiredness', 'exhaustion', 'weakness', 'weight loss', 'weight gain', 'night sweat', 'sleep', 'insomnia'],
    urinary: ['urination', 'urinate', 'pee', 'bladder', 'kidney', 'urine'],
    reproductive: ['menstrual', 'period', 'menstruation', 'vaginal', 'penile', 'testicular', 'erectile', 'libido'],
    mental: ['anxiety', 'anxious', 'worry', 'depression', 'depressed', 'mood', 'stress', 'stressed', 'mental', 'panic', 'emotion', 'emotional'],
    emergency: ['emergency', 'severe', 'extreme', 'unbearable', 'worst', 'collapsed', 'unconscious', 'consciousness', 'stroke', 'heart attack', 'poisoning', 'overdose', 'suicide', 'dying']
  };

  // List of emergency conditions that always trigger emergency advice
  const emergencyConditions = [
    'chest pain', 'severe bleeding', 'difficulty breathing', 'shortness of breath', 
    'stroke', 'heart attack', 'unconscious', 'loss of consciousness', 
    'seizure', 'severe head injury', 'poisoning', 'overdose', 'suicidal',
    'anaphylaxis', 'allergic reaction', 'drowning', 'choking', 'not breathing',
    'severe burn', 'gunshot', 'stab wound', 'electric shock', 'broken bone',
    'eye injury', 'severe abdominal pain'
  ];
  // Simple translations for UI elements (expanded with Tamil)
  const translations = {
    en: {
      title: 'Advanced Health Symptom Checker',
      subtitle: 'Get comprehensive information about your symptoms',
      inputLabel: 'What symptoms are you experiencing?',
      inputPlaceholder: 'Describe your symptoms...',
      checkButton: 'Check Symptoms',
      analyzing: 'Analyzing Symptoms...',
      resultsTitle: 'Health Information:',
      disclaimer: 'This tool provides general information only and should not replace professional medical advice. Always consult a healthcare provider for medical concerns. In case of emergency, call 911 or your local emergency number immediately.',
      historyTitle: 'Search History',
      clearHistory: 'Clear History',
      darkMode: 'Dark Mode',
      symptomHistory: 'Symptom History'
    },
    ta: {
      title: 'மேம்பட்ட உடல்நல அறிகுறி சரிபார்ப்பி',
      subtitle: 'உங்கள் அறிகுறிகள் பற்றிய விரிவான தகவல்களைப் பெறுங்கள்',
      inputLabel: 'நீங்கள் எந்த அறிகுறிகளை அனுபவிக்கிறீர்கள்?',
      inputPlaceholder: 'உங்கள் அறிகுறிகளை விவரிக்கவும்...',
      checkButton: 'அறிகுறிகளை சரிபார்க்கவும்',
      analyzing: 'அறிகுறிகளை ஆய்வு செய்கிறது...',
      resultsTitle: 'சுகாதார தகவல்:',
      disclaimer: 'இந்த கருவி பொதுவான தகவல்களை மட்டுமே வழங்குகிறது, மற்றும் தொழில்முறை மருத்துவ ஆலோசனையை மாற்றக்கூடாது. மருத்துவ கவலைகளுக்கு எப்போதும் ஒரு சுகாதார வழங்குநரை ஆலோசிக்கவும். அவசர நிலையில், உடனடியாக 911 அல்லது உங்கள் உள்ளூர் அவசர எண்ணை அழைக்கவும்.',
      historyTitle: 'தேடல் வரலாறு',
      clearHistory: 'வரலாற்றை அழிக்க',
      darkMode: 'இருள் பயன்முறை',
      symptomHistory: 'அறிகுறி வரலாறு'
    }
  };

  // Get text based on current language
  const getText = (key) => {
    return translations[language]?.[key] || translations.en[key];
  };

  // Create a list of all symptoms for autocomplete
  const allSymptoms = Object.keys(symptomDatabase);

  // Symptom categories for better pattern matching


  // Handle suggestions as user types
  const handleSymptomInput = (e) => {
    const input = e.target.value;
    setSymptoms(input);
    
    if (input.trim().length > 2) {
      const filtered = allSymptoms.filter(symptom => 
        symptom.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      
      setSymptomSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Add a suggestion to the input
  const addSuggestion = (suggestion) => {
    setSymptoms(suggestion);
    setShowSuggestions(false);
  };

  const checkSymptoms = () => {
    if (!symptoms.trim()) {
      setAdvice('Please enter your symptoms.');
      return;
    }

    setLoading(true);
    
    // Add to search history
    const timestamp = new Date().toLocaleString();
    const newHistoryItem = { symptoms, timestamp, id: Date.now() };
    const updatedHistory = [newHistoryItem, ...searchHistory].slice(0, 10); // Keep only 10 most recent
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    
    // Simulate API call delay (you could replace this with an actual API call)
    setTimeout(() => {
      const userSymptoms = symptoms.toLowerCase();
      let foundAdvice = false;
      let adviceText = '';
      let matchedSymptoms = new Set();

      // Check for emergency conditions first
      for (const emergency of emergencyConditions) {
        if (userSymptoms.includes(emergency)) {
          adviceText = '⚠️ EMERGENCY: This appears to be a medical emergency. Please call emergency services (911) immediately. ⚠️';
          foundAdvice = true;
          break;
        }
      }

      // If not an emergency, try direct symptom matching
      if (!foundAdvice) {
        // First, try exact matching from the database
        for (const [symptom, advice] of Object.entries(symptomDatabase)) {
          if (userSymptoms.includes(symptom)) {
            matchedSymptoms.add(symptom);
          }
        }
        
        // If no exact matches, try category-based fuzzy matching
        if (matchedSymptoms.size === 0) {
          for (const [category, keywords] of Object.entries(symptomCategories)) {
            for (const keyword of keywords) {
              if (userSymptoms.includes(keyword)) {
                // Find a representative symptom from this category
                for (const symptom of Object.keys(symptomDatabase)) {
                  if (symptomDatabase[symptom].toLowerCase().includes(keyword)) {
                    matchedSymptoms.add(symptom);
                    break;
                  }
                }
              }
            }
          }
        }
        
        // Add advice for all matched symptoms
        if (matchedSymptoms.size > 0) {
          foundAdvice = true;
          
          // Check if any of the matched symptoms is an emergency
          const emergencyMatched = [...matchedSymptoms].some(symptom => 
            symptomDatabase[symptom].includes("EMERGENCY") || 
            symptomDatabase[symptom].includes("IMMEDIATE")
          );
          
          if (emergencyMatched) {
            adviceText = '⚠️ EMERGENCY: Based on the symptoms described, this could be a medical emergency. Please call emergency services (911) immediately. ⚠️\n\n';
          }
          
          // Add specific advice for each matched symptom
          [...matchedSymptoms].forEach(symptom => {
            if (adviceText) adviceText += '\n\n';
            adviceText += `For ${symptom}: ${symptomDatabase[symptom]}`;
          });
        }
      }

      // General advice if no specific matches
      if (!foundAdvice) {
        adviceText = 'I couldn\'t identify specific advice for your symptoms. Based on what you\'ve described, it would be best to consult with a healthcare professional for proper diagnosis and treatment.';
      }

      // Add disclaimer
      adviceText += '\n\n⚠️ IMPORTANT: This is basic general information only and not a substitute for professional medical advice. Always consult with a qualified healthcare provider for proper diagnosis and treatment.';
      
      setAdvice(adviceText);
      setLoading(false);
    }, 1000);
  };
  
  // For better handling of complex or combined symptoms
  const handleSymptomAnalysis = () => {
    setSymptoms(symptoms.trim());
    checkSymptoms();
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Load previous search
  const loadSearch = (historyItem) => {
    setSymptoms(historyItem.symptoms);
  };

  // Export search history as CSV
  const exportHistory = () => {
    const headers = 'Date,Symptoms\n';
    const csvContent = headers + searchHistory
      .map(item => `"${item.timestamp}","${item.symptoms.replace(/"/g, '""')}"`)
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'symptom_history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="settings-bar">
        <button className="icon-button" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'} {getText('darkMode')}
        </button>
        <div className="language-selector">
          <button className={language === 'en' ? 'active' : ''} onClick={() => changeLanguage('en')}>EN</button>
          <button className={language === 'ta' ? 'active' : ''} onClick={() => changeLanguage('ta')}>TA</button>
        </div>
        <button className="icon-button" onClick={() => setShowHistory(!showHistory)}>
          📋 {getText('symptomHistory')}
        </button>
      </div>
      
      <div className="symptom-checker">
        <div className="header">
          <div className="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="title-container">
            <h1>{getText('title')}</h1>
            <p>{getText('subtitle')}</p>
          </div>
        </div>
        
        {showHistory && (
          <div className="history-panel">
            <div className="history-header">
              <h2>{getText('historyTitle')}</h2>
              <div className="history-actions">
                <button onClick={exportHistory}>📥 Export</button>
                <button onClick={clearHistory}>{getText('clearHistory')}</button>
              </div>
            </div>
            <div className="history-list">
              {searchHistory.length > 0 ? (
                searchHistory.map(item => (
                  <div key={item.id} className="history-item" onClick={() => loadSearch(item)}>
                    <div className="history-item-content">
                      <p className="history-symptoms">{item.symptoms}</p>
                      <p className="history-date">{item.timestamp}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No search history available.</p>
              )}
            </div>
          </div>
        )}
        
        <div className="input-section">
          <label htmlFor="symptoms">
            {getText('inputLabel')}
          </label>
          <div className="input-container">
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={handleSymptomInput}
              onFocus={() => symptoms.trim().length > 2 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={getText('inputPlaceholder')}
            />
            {showSuggestions && (
              <div className="suggestions">
                {symptomSuggestions.map(suggestion => (
                  <div 
                    key={suggestion} 
                    className="suggestion-item"
                    onClick={() => addSuggestion(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="button-container">
          <button
            onClick={handleSymptomAnalysis}
            disabled={loading}
            className={loading ? 'loading' : ''}
          >
            {loading ? (
              <span className="loading-text">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {getText('analyzing')}
              </span>
            ) : getText('checkButton')}
          </button>
          
          <button 
            className="voice-input-btn"
            onClick={() => {
              if ('webkitSpeechRecognition' in window) {
                // Speech recognition implementation would go here
                alert('Voice input is available in full implementation');
              } else {
                alert('Voice recognition not supported in your browser');
              }
            }}
          >
            🎤
          </button>
        </div>
        
        {advice && (
          <div className="results">
            <h2>{getText('resultsTitle')}</h2>
            <div className={`advice-text ${advice.includes('EMERGENCY') ? 'emergency' : ''}`}>
              {advice.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="actions-panel">
              <button onClick={() => {
                const text = advice;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'health_advice.txt';
                a.click();
                URL.revokeObjectURL(url);
              }}>
                📥 Save as Text
              </button>
              
              <button onClick={() => {
                if ('share' in navigator) {
                  navigator.share({
                    title: 'Health Symptom Advice',
                    text: advice
                  }).catch(err => {
                    console.error('Share failed:', err);
                  });
                } else {
                  alert('Web Share API not supported in your browser');
                }
              }}>
                📤 Share
              </button>
              
              <button onClick={() => {
                if ('speechSynthesis' in window) {
                  const speech = new SpeechSynthesisUtterance(advice);
                  window.speechSynthesis.speak(speech);
                } else {
                  alert('Text-to-speech not supported in your browser');
                }
              }}>
                🔊 Read Aloud
              </button>
            </div>
          </div>
        )}
        
        <div className="disclaimer">
          <p className="disclaimer-title">Important Disclaimer</p>
          <p>{getText('disclaimer')}</p>
        </div>
      </div>
    </div>
  );
}

export default App;