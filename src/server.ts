import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import bodyParser from "body-parser";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";
import { IncomingMessage } from "http";
import { stripeWebhookHandler } from "./webhooks";
import nextBuild from 'next/dist/build'
import path from "path";
import { PayloadRequest } from "payload/types";
import { parse } from "url";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});

export type ExpressContext = inferAsyncReturnType<typeof createContext>;

export type WebhookRequest = IncomingMessage & { rawBody: Buffer };

const start = async () => {
  const webhookMiddlewaer = bodyParser.json({
    verify: (req: WebhookRequest, _, buffer) => {
      req.rawBody = buffer;
    },
  });

  app.post("/api/webhook/stripe", webhookMiddlewaer, stripeWebhookHandler);

  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      onInit: async (cms) => {
        cms.logger.info(`Admin URL ${cms.getAdminURL()}`);
      },
    },
  });

  const cartRouter = express.Router();

  cartRouter.use(payload.authenticate)

  cartRouter.get("/", async (req, res) => {
    const request = req as PayloadRequest

    if(!request.user) return res.redirect('/sign-in?origin=cart')

    const parseUrl = parse(request.url, true)

    return nextApp.render(req, res, '/cart', parseUrl.query);
  })

  app.use("/cart", cartRouter);

  if(process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(
        `Nextjs building for production`
      );
      
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'));

      process.exit()
    })
    return
  }

  

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  //forword requests to nextjs
  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info(`Nextjs Started...`);

    app.listen(PORT, async () => {
      payload.logger.info(
        `Nextjs app URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
