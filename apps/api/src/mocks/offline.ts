import { createMockContext, createMockEvent } from "@repo/mock-data/event";
import { json } from "body-parser";
import express, { Request, Response } from "express";
import { handler } from "../main";

const offline = express();

offline.use(json());

const mockConcertId = "001";
const concertsRoute = "/concerts";

const cb = () => null
const jsonContent = { "Content-Type": "application/json" }

offline.all("/{*route}", async (req: Request, res: Response) => {
  try {
    console.log("REQ", req)
    const mockEvent = createMockEvent({
      method: 'GET',
      route: `${concertsRoute}/{id}`,
      path: concertsRoute,
      pathParameters: { id: mockConcertId },
    })

    const response = await handler(mockEvent, createMockContext(), cb)

    if (!response) {
      res.send()
      return
    }

    if (typeof response === "string") {
      res.send(response)
      return
    }

    if ("body" in response && typeof response.body === "string") {
      res.writeHead(200, jsonContent).end(response.body)
      return
    }

    res.send()
  } catch (err) {
    console.log(err)
    res.status(500).send({ message: "internal server error" })
  }
})

export { offline };

