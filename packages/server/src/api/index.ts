import cors from 'cors'
import express from 'express'
require('express-async-errors')

import dotenv from 'dotenv'
dotenv.config()

import leadRouter from './lead'

const api = express()

api.use(cors())
api.use(express.json())
api.use(express.urlencoded({ extended: false }))

export class AppError extends Error {
  public code: number

  constructor({ code = 500 }: { code?: number }) {
    super()
    this.code = code
  }
}

const errorMiddleware = (
  err: AppError,
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  if (err) {
    console.error(err)
    res.status(err.code || 500).send({ message: err.message })
  } else {
    next()
  }
}

api.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello world!')
})

api.use('/lead', leadRouter)

api.use(errorMiddleware)

api.post('/translation', async (req, res) => {
  const { input, translateToLng, tone } = req.body as {
    input: string
    translateToLng: string
    tone: string
  }

  const data = await createTranslation({ input, translateToLng, tone })

  res.send({
    data,
    translation: data?.choices[0]?.text,
    metadata: { input, translateToLng, tone },
  })
})

import { Configuration, OpenAIApi } from 'openai'

const createTranslation = async ({
  input,
  translateToLng,
  tone,
}: {
  input: string
  translateToLng: string
  tone: string
}) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  const openai = new OpenAIApi(configuration)

  const prompt = `Translate this to ${translateToLng} in a ${tone} tone:\n\n"${input}"`

  console.log('using prompt', prompt)

  const { data } = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.3,
    max_tokens: 500,
    top_p: 1,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  })

  return data
}

// */
// 'id': string;
// /**
//  *
//  * @type {string}
//  * @memberof CreateEditResponse
//  */
// 'object': string;
// /**
//  *
//  * @type {number}
//  * @memberof CreateEditResponse
//  */
// 'created': number;
// /**
//  *
//  * @type {string}
//  * @memberof CreateEditResponse
//  */
// 'model': string;
// /**
//  *
//  * @type {Array<CreateCompletionResponseChoicesInner>}
//  * @memberof CreateEditResponse
//  */
// 'choices': Array<CreateCompletionResponseChoicesInner>;
//
// *
// * @type {string}
// * @memberof CreateCompletionResponseChoicesInner
// */
// 'text'?: string;
// /**
// *
// * @type {number}
// * @memberof CreateCompletionResponseChoicesInner
// */
// 'index'?: number;
// /**
// *
// * @type {CreateCompletionResponseChoicesInnerLogprobs}
// * @memberof CreateCompletionResponseChoicesInner
// */
// 'logprobs'?: CreateCompletionResponseChoicesInnerLogprobs | null;
// /**
// *
// * @type {string}
// * @memberof CreateCompletionResponseChoicesInner
// */
// 'finish_reason'?: string;
// /**
//  *
//  * @type {CreateCompletionResponseUsage}
//  * @memberof CreateEditResponse
//  */
// 'usage': CreateCompletionResponseUsage;

export default api
