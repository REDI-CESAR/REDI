import { axiosClient } from '@/infra/gateways/axios-client'
import { LocalFile } from '@/core/models'
import { promptGpt } from '@/utils/chat-gpt-prompt'

export type CompletionOptions = {
  sendImage: boolean
}

export class OpenAiService {
  private model = 'gpt-4o'

  async startCompletions(file: LocalFile) {
    try {
      const base64Text = `data:${file.mimeType};base64,${file.base64}`

      const userMessageContent = [
        { type: 'image_url', image_url: { url: base64Text } }
      ]

      const response = await axiosClient.post('/chat/completions', {
        model: this.model,
        response_format: { type: 'json_object' },
        max_tokens: 4095,
        temperature: 1,
        top_p: 1,
        messages: [
          { role: 'system', content: promptGpt },
          { role: 'user', content: userMessageContent }
        ]
      })

      return JSON.parse(response.data.choices[0].message.content)
    } catch (error: any) {
      console.error('Error calling OpenAI API:', error.response.data)
      return null
    }
  }
}
