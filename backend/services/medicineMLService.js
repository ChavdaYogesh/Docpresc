// Fallback medicine database (rule-based)
const medicineDatabase = {
    'headache': [
        { name: 'Paracetamol', genericName: 'Acetaminophen', category: 'Analgesic', dosage: '500-1000mg every 4-6 hours', sideEffects: 'Nausea, stomach upset, liver problems in high doses', precautions: 'Do not exceed 4g per day, avoid alcohol', confidence: 85 },
        { name: 'Ibuprofen', genericName: 'Ibuprofen', category: 'NSAID', dosage: '200-400mg every 4-6 hours', sideEffects: 'Stomach irritation, increased bleeding risk', precautions: 'Take with food, avoid if you have stomach ulcers', confidence: 80 },
        { name: 'Aspirin', genericName: 'Acetylsalicylic acid', category: 'NSAID', dosage: '325-650mg every 4-6 hours', sideEffects: 'Stomach irritation, bleeding risk', precautions: 'Avoid in children under 16, take with food', confidence: 75 }
    ],
    'fever': [
        { name: 'Paracetamol', genericName: 'Acetaminophen', category: 'Antipyretic', dosage: '500-1000mg every 4-6 hours', sideEffects: 'Nausea, stomach upset, liver problems in high doses', precautions: 'Do not exceed 4g per day, avoid alcohol', confidence: 90 },
        { name: 'Ibuprofen', genericName: 'Ibuprofen', category: 'NSAID', dosage: '200-400mg every 4-6 hours', sideEffects: 'Stomach irritation, increased bleeding risk', precautions: 'Take with food, avoid if you have stomach ulcers', confidence: 85 }
    ],
    'cough': [
        { name: 'Dextromethorphan', genericName: 'Dextromethorphan', category: 'Antitussive', dosage: '15-30mg every 4-6 hours', sideEffects: 'Drowsiness, dizziness, nausea', precautions: 'Avoid alcohol, do not drive while taking', confidence: 80 },
        { name: 'Guaifenesin', genericName: 'Guaifenesin', category: 'Expectorant', dosage: '200-400mg every 4 hours', sideEffects: 'Nausea, vomiting, headache', precautions: 'Drink plenty of fluids', confidence: 75 }
    ],
    'stomach pain': [
        { name: 'Antacids', genericName: 'Aluminum hydroxide/Magnesium hydroxide', category: 'Antacid', dosage: 'As needed, 1-2 tablets', sideEffects: 'Diarrhea, constipation', precautions: 'Take 1-2 hours after other medications', confidence: 70 },
        { name: 'Omeprazole', genericName: 'Omeprazole', category: 'Proton pump inhibitor', dosage: '20mg once daily', sideEffects: 'Headache, diarrhea, stomach pain', precautions: 'Take on empty stomach, avoid long-term use', confidence: 65 }
    ],
    'allergy': [
        { name: 'Cetirizine', genericName: 'Cetirizine', category: 'Antihistamine', dosage: '10mg once daily', sideEffects: 'Drowsiness, dry mouth, headache', precautions: 'Avoid alcohol, may cause drowsiness', confidence: 85 },
        { name: 'Loratadine', genericName: 'Loratadine', category: 'Antihistamine', dosage: '10mg once daily', sideEffects: 'Headache, fatigue, dry mouth', precautions: 'Non-drowsy formula, safe for daily use', confidence: 80 }
    ]
}

const symptomMapping = {
    'headache': ['headache', 'head pain', 'migraine', 'tension'],
    'fever': ['fever', 'high temperature', 'hot', 'chills'],
    'cough': ['cough', 'coughing', 'dry cough', 'wet cough'],
    'stomach pain': ['stomach pain', 'abdominal pain', 'belly ache', 'indigestion', 'upset stomach'],
    'allergy': ['allergy', 'allergic', 'sneezing', 'runny nose', 'itchy eyes']
}

const extractSymptoms = (symptomsText) => {
    const symptoms = (symptomsText || '').toLowerCase().split(/[\s,]+/)
    const matchedSymptoms = []
    for (const symptom of symptoms) {
        for (const [category, keywords] of Object.entries(symptomMapping)) {
            if (keywords.some(keyword => symptom.includes(keyword) || keyword.includes(symptom))) {
                matchedSymptoms.push(category)
                break
            }
        }
    }
    return matchedSymptoms
}

const ruleBasedRecommendations = (symptoms, age, gender, medicalHistory) => {
    const extracted = extractSymptoms(symptoms)
    const recs = []
    for (const s of extracted) {
        if (medicineDatabase[s]) recs.push(...medicineDatabase[s])
    }
    if (recs.length === 0) {
        recs.push({ name: 'Paracetamol', genericName: 'Acetaminophen', category: 'General Pain Relief', dosage: '500-1000mg every 4-6 hours', sideEffects: 'Nausea, stomach upset, liver risk', precautions: 'Max 4g/day; avoid alcohol', confidence: 60 })
    }
    return recs.slice(0, 3)
}

const callMlService = async (payload) => {
    const url = process.env.ML_SERVICE_URL || 'http://localhost:8000/predict'
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error(`ML service error ${res.status}`)
    const data = await res.json()
    if (!data.success) throw new Error('ML service returned failure')
    return data.recommendations
}

const getRecommendations = async (symptoms, age, gender, medicalHistory) => {
    const payload = { symptoms, age, gender, medicalHistory }
    try {
        const mlRecs = await callMlService(payload)
        return mlRecs
    } catch (err) {
        console.log('ML service unavailable, using fallback. Reason:', err.message)
        return ruleBasedRecommendations(symptoms, age, gender, medicalHistory)
    }
}

export { getRecommendations, extractSymptoms }
