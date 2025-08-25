import React, { useContext, useState, useEffect, useRef } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MedicineSearch = () => {
  const { token, backendUrl, userData } = useContext(AppContext)
  const [symptoms, setSymptoms] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('')
  const [medicalHistory, setMedicalHistory] = useState('')
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [selectedHistory, setSelectedHistory] = useState(null)
  const recommendationsRef = useRef(null)

  // Calculate age from user's DOB
  useEffect(() => {
    if (userData && userData.dob) {
      const birthDate = new Date(userData.dob)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setAge(age - 1)
      } else {
        setAge(age)
      }
    }
    if (userData && userData.gender) {
      setGender(userData.gender)
    }
  }, [userData])

  // Load search history
  useEffect(() => {
    if (token) {
      loadSearchHistory()
    }
  }, [token])

  const loadSearchHistory = async () => {
    try {
      console.log('Loading search history...')
      console.log('Backend URL:', backendUrl)
      console.log('Token:', token ? 'Present' : 'Missing')
      
      const { data } = await axios.get(backendUrl + '/api/user/search-history', {
        headers: { token }
      })
      
      console.log('Search history response:', data)
      
      if (data.success) {
        setSearchHistory(data.history)
        console.log('Search history loaded:', data.history.length, 'items')
      } else {
        console.log('Failed to load search history:', data.message)
      }
    } catch (error) {
      console.log('Error loading search history:', error)
      console.log('Error response:', error.response?.data)
    }
  }

  const clearSearchHistory = async () => {
    try {
      console.log('Attempting to clear search history...')
      console.log('Backend URL:', backendUrl)
      console.log('Token:', token ? 'Present' : 'Missing')
      
      const { data } = await axios.post(backendUrl + '/api/user/clear-search-history', {}, {
        headers: { token }
      })
      
      console.log('Clear history response:', data)
      
      if (data.success) {
        setSearchHistory([])
        setSelectedHistory(null)
        setRecommendations([])
        toast.success('Search history cleared successfully!')
        console.log('Search history cleared from frontend state')
      } else {
        console.log('Failed to clear search history:', data.message)
        toast.error(data.message || 'Failed to clear search history')
      }
    } catch (error) {
      console.log('Error clearing search history:', error)
      console.log('Error response:', error.response?.data)
      console.log('Error status:', error.response?.status)
      toast.error('An error occurred while clearing search history')
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    
    console.log('Form submitted with:', { symptoms, age, gender, medicalHistory })
    
    if (!symptoms.trim()) {
      toast.error('Please enter your symptoms')
      return
    }

    if (!age || age < 0 || age > 120) {
      toast.error('Please enter a valid age')
      return
    }

    if (!gender) {
      toast.error('Please select your gender')
      return
    }

    setLoading(true)
    try {
      const searchData = {
        symptoms: symptoms.trim(),
        age: parseInt(age),
        gender,
        medicalHistory: medicalHistory.trim(),
        timestamp: new Date().toISOString()
      }

      console.log('Sending search data:', searchData)
      console.log('Backend URL:', backendUrl)
      console.log('Token:', token ? 'Present' : 'Missing')

      const { data } = await axios.post(backendUrl + '/api/user/medicine-search', searchData, {
        headers: { token }
      })

      console.log('Response received:', data)

      if (data.success) {
        setRecommendations(data.recommendations)
        setSelectedHistory(null) // Clear selected history when new search is made
        toast.success('Medicine recommendations generated successfully!')
        loadSearchHistory() // Refresh history
        
        // Scroll to recommendations after a short delay
        setTimeout(() => {
          if (recommendationsRef.current) {
            recommendationsRef.current.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            })
          }
        }, 500)
      } else {
        toast.error(data.message || 'Failed to get recommendations')
      }
    } catch (error) {
      console.log('Error in handleSearch:', error)
      console.log('Error response:', error.response?.data)
      toast.error('An error occurred while searching for medicines')
    } finally {
      setLoading(false)
    }
  }

  const handleHistoryClick = (historyItem) => {
    setSelectedHistory(historyItem)
    setRecommendations(historyItem.recommendations || [])
    
    // Scroll to recommendations if they exist
    if (historyItem.recommendations && historyItem.recommendations.length > 0) {
      setTimeout(() => {
        if (recommendationsRef.current) {
          recommendationsRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          })
        }
      }, 100)
    }
    
    toast.info(`Showing medicines for: ${historyItem.symptoms}`)
  }

  const clearForm = () => {
    setSymptoms('')
    setMedicalHistory('')
    setRecommendations([])
    setSelectedHistory(null)
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Medicine Prescription Search</h1>
        <p className='text-gray-600'>Get AI-powered medicine recommendations based on your symptoms</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Search Form */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Enter Your Symptoms
              {selectedHistory && (
                <span className='ml-2 text-sm text-green-600 font-normal'>
                  (Viewing previous search)
                </span>
              )}
            </h2>
            
            <form onSubmit={handleSearch} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Symptoms * <span className='text-xs text-gray-500'>(Be specific about your symptoms)</span>
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., headache, fever, cough, stomach pain, etc."
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none'
                  rows={4}
                  required
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Age *</label>
                  <input
                    type='number'
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder='Enter your age'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    min='0'
                    max='120'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent'
                    required
                  >
                    <option value=''>Select Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Medical History <span className='text-xs text-gray-500'>(Optional - any existing conditions, allergies, current medications)</span>
                </label>
                <textarea
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="e.g., diabetes, hypertension, allergies to penicillin, etc."
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none'
                  rows={3}
                />
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? (
                    <span className='flex items-center justify-center'>
                      <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Get Recommendations'
                  )}
                </button>
                <button
                  type='button'
                  onClick={clearForm}
                  className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-300'
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search History */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>Search History</h2>
            {searchHistory.length === 0 ? (
              <p className='text-gray-500 text-sm'>No previous searches</p>
            ) : (
              <div className='space-y-3'>
                {searchHistory.slice(0, 5).map((search, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                      selectedHistory && selectedHistory._id === search._id 
                        ? 'border-green-500 bg-green-50 shadow-md' 
                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                    onClick={() => handleHistoryClick(search)}
                  >
                    <p className='text-sm font-medium text-gray-800 mb-1'>{search.symptoms}</p>
                    <p className='text-xs text-gray-500'>
                      {new Date(search.timestamp).toLocaleDateString()} - {new Date(search.timestamp).toLocaleTimeString()}
                    </p>
                    <p className='text-xs text-gray-500'>
                      Age: {search.age} | Gender: {search.gender}
                    </p>
                    {search.recommendations && search.recommendations.length > 0 && (
                      <p className='text-xs text-green-600 mt-1'>
                        ✓ {search.recommendations.length} medicine(s) recommended
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={clearSearchHistory}
              className='mt-4 w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={searchHistory.length === 0}
            >
              Clear History
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations - Full Width at Bottom */}
      {recommendations.length > 0 && (
        <div ref={recommendationsRef} className='mt-8'>
          <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-100'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              Recommended Medicines
              {selectedHistory && (
                <span className='ml-2 text-sm text-gray-500 font-normal'>
                  (from {new Date(selectedHistory.timestamp).toLocaleDateString()})
                </span>
              )}
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {recommendations.map((medicine, index) => (
                <div key={index} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300'>
                  <div className='flex items-start justify-between mb-3'>
                    <h3 className='text-lg font-semibold text-gray-800'>{medicine.name}</h3>
                    <span className='inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium'>
                      {medicine.confidence}% Match
                    </span>
                  </div>
                  <div className='space-y-2 text-sm text-gray-600'>
                    <p><strong>Generic Name:</strong> {medicine.genericName}</p>
                    <p><strong>Category:</strong> {medicine.category}</p>
                    <p><strong>Dosage:</strong> {medicine.dosage}</p>
                    <p><strong>Side Effects:</strong> {medicine.sideEffects}</p>
                    <p><strong>Precautions:</strong> {medicine.precautions}</p>
                  </div>
                  <div className='mt-4 pt-3 border-t border-gray-100'>
                    <p className='text-xs text-gray-500'>
                      <strong>Disclaimer:</strong> This is an AI recommendation. Please consult with a healthcare professional before taking any medication.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MedicineSearch
