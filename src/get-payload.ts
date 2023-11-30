import dotenv from "dotenv"
import path from "path"
import payload from "payload"
import { InitOptions } from "payload/config"
import nodemailer from 'nodemailer'


dotenv.config({
    path: path.resolve(__dirname, "../.env"),
})

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: 'ranapaul741223@gmail.com',
      pass: 'BR0FZa4tdnOT8572',
    },
  })

let cached = (global as any).payload

if(!cached) {
    cached = (global as any).payload = {
        client: null,
        promise: null
    }
}

interface Args {
    initOptions?: Partial<InitOptions>
}

export const getPayloadClient = async ({initOptions}: Args = {}) => {
    if(!process.env.PAYLOAD_SECRET) {
        throw new Error("Missing PAYLOAD_SECRET")
    }

    if(cached.client){
        return cached.client
    }

    if(!cached.client){
        cached.promise = payload.init({
            email: {
                transport: transporter,
                fromAddress: 'ranapaul741223@gmail.com',
                fromName: 'Digital Market',
              },
            secret: process.env.PAYLOAD_SECRET,
            local: initOptions?.express ? false : true,
            ...(initOptions || {})
        })
    }

    try {
        cached.client = await cached.promise
    } catch (error: unknown) {
        cached.promise = null
        throw error
        
    }
     return cached.client
}