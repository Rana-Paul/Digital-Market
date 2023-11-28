import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { buildConfig } from "payload/config";

export default buildConfig({
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
    collections: [],
    routes: {
        admin: '/sell',
    },
    admin: {
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