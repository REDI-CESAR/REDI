import axios from 'axios'

const apiKey = process.env.OPENAI_API_KEY

export const axiosClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'OpenAI-Beta': 'assistants=v2'
  }
})
