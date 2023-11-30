import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { buildConfig } from "payload/config";
import Users from "./collections/Users";
import dotenv from 'dotenv'


dotenv.config({
    path: path.resolve(__dirname, '../.env'),
  })

export default buildConfig({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    collections: [Users],
    routes: {
        admin: '/sell',
    },
    admin: {
        user: 'users',
        bundler: webpackBundler(),
        meta: {
            titleSuffix: ' - DigitalMarket',
            favicon: '/logo.png',
            ogImage: '/logo.png',
        }
    },
    rateLimit: {
        max: 2000,
    },
    editor: slateEditor({}),
    db: mongooseAdapter({
        url: process.env.MONGODB_URI!,
    }),
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    }
})