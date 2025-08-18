import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Skeleton from '../pages/Card/Skeleton'

const BASE_URL = import.meta.env.VITE_BASE_URL
const URL = `${BASE_URL}/user/signup`

const Signup = () => {
  const [data, setData] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")
    try {
      const response = await axios.post(URL, data)
      setMessage("Signup successful!")
      setData({ name: "", email: "", password: "" })

      // ✅ Save token and user info
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user || data))

      // ✅ Redirect to signin or dashboard
      navigate("/signin")
    } catch (err) {
      console.error("Signup failed:", err)
      setError(err.response?.data?.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) return <Skeleton />

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Register now</h1>

        {message && <p className="text-green-600 font-semibold mb-4 text-center">{message}</p>}
        {error && <p className="text-red-600 font-semibold mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium text-sm md:text-base">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={data.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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

          <div className="flex justify-center gap-10">
            <button
              type="submit"
              className="px-7 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold transition-colors"
            >
              Signup
            </button>
            <p
              onClick={() => navigate("/signin")}
              className="inline-block px-4 py-2 text-blue-300 font-semibold bg-transparent border border-blue-300 rounded-lg hover:bg-blue-700 hover:text-white transition-colors duration-300 cursor-pointer text-center"
            >
              Go to Signin
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup

