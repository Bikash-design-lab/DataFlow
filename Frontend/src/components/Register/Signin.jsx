import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_BASE_URL
const URL = `${BASE_URL}/user/signin`

const Signin = () => {
  const [data, setData] = useState({ email: "User@driftal.com", password: "user@123" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate()

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")
    try {
      const response = await axios.post(URL, data)
      setMessage("Signin successful!")
      setData({ email: "", password: "" })

      // Save token
      localStorage.setItem("token", response.data.token)
      setIsLoggedIn(true)
      navigate("/dashboard")
    } catch (err) {
      console.error("Signin failed:", err)
      setError(err.response?.data?.message || "Signin failed. Please check credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setMessage("Logged out successfully.")
    navigate("/signin")
  }

  if (loading) return <h1 className='text-3xl font-bold justify-center'>Loading...</h1>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Welcome back</h1>

        {message && <p className="text-green-600 font-semibold mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium text-sm md:text-base">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={data.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium text-sm md:text-base">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={data.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className='flex justify-center gap-10'>
            <button
              type="submit"
              className="px-7 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold transition-colors"
            >
              Signin
            </button>

            {/* Conditionally render Signup or Logout */}
            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-7 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 font-semibold transition-colors"
              >
                Logout
              </button>
            ) : (
              <p
                onClick={() => navigate("/signup")}
                className="inline-block px-4 py-2 text-blue-300 font-semibold bg-transparent border border-blue-300 rounded-lg hover:bg-blue-700 hover:text-white transition-colors duration-300 cursor-pointer text-center"
              >
                Go to Signup
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signin

