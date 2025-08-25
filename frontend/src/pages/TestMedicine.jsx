import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const TestMedicine = () => {
  const { token, backendUrl } = useContext(AppContext)
  const [testResult, setTestResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(backendUrl + '/test-medicine')
      setTestResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setTestResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testMedicineSearch = async () => {
    setLoading(true)
    try {
      const searchData = {
        symptoms: 'headache',
        age: 25,
        gender: 'Male',
        medicalHistory: ''
      }

      const { data } = await axios.post(backendUrl + '/api/user/medicine-search', searchData, {
        headers: { token }
      })
      
      setTestResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setTestResult(`Error: ${error.message}\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Medicine Search Test</h1>
      
      <div className='space-y-4'>
        <div>
          <p><strong>Backend URL:</strong> {backendUrl}</p>
          <p><strong>Token:</strong> {token ? 'Present' : 'Missing'}</p>
        </div>

        <div className='space-x-4'>
          <button 
            onClick={testConnection}
            disabled={loading}
            className='bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50'
          >
            Test Connection
          </button>
          
          <button 
            onClick={testMedicineSearch}
            disabled={loading}
            className='bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50'
          >
            Test Medicine Search
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {testResult && (
          <div className='bg-gray-100 p-4 rounded'>
            <h3 className='font-bold mb-2'>Result:</h3>
            <pre className='text-sm overflow-auto'>{testResult}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestMedicine
