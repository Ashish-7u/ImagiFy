import React, { useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AppContext } from '../context/AppContext' // adjust path
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const { token } = useParams()            // get token from URL
  const navigate = useNavigate()
  const { backendUrl } = useContext(AppContext)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast.error('Please fill in both password fields')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/reset-password/${token}`, { password })

      if (data.success) {
        toast.success('Password reset successful! Please log in.')
        navigate('/')  
      } else {
        toast.error(data.message || 'Unable to reset password')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Server error')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium" htmlFor="password">New Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Enter new password"
          className="w-full px-3 py-2 border rounded mb-4"
          disabled={loading}
        />

        <label className="block mb-2 font-medium" htmlFor="confirmPassword">Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm new password"
          className="w-full px-3 py-2 border rounded mb-4"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
