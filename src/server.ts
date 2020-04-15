
//import dotenv from 'dotenv';
const dotenv = require('dotenv');

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser'
const hyperquest = require('hyperquest');
const through = require('through2');
const pump = require('pump');

dotenv.config()

const PORT = process.env.PORT || 80
const app: Application = express()

app.set('views', 'views')
app.set('view engine', 'pug')

app.use(bodyParser.json())

app.use(compression())

app.use(cors())

app.get('*', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  res.write(`<!DOCTYPE html>
      <html>
        <head>
          <title>Client</title>
        </head>
        <body><div id="root">`)

  const write = (row: any, enc: any, next: any) => {
    try {
      const data = JSON.parse(String(row))
      console.log('coming data ---- ', data);
      data.html && res.write(data.html)
      if (data.script) {
        res.write(`</div>`)
        res.write(`
          <script crossorigin="crossorigin" src="https://unpkg.com/react@16/umd/react.development.js"></script>
      <script crossorigin="crossorigin" src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
      <script crossorigin="crossorigin" src="https://unpkg.com/react-router/umd/react-router.min.js"></script>
      <script crossorigin="crossorigin" src="https://unpkg.com/react-router-dom/umd/react-router-dom.min.js"></script>
      <script src="http://localhost:8081/${data.script}"></script></body></html>`)
      }
    } catch (error) {
      console.error(error)
    }

    next()
  }

  const fragment = [
    hyperquest(`http://localhost:8081${req.url}`),
    through(write),
    () => {
      res.end()
    }
  ]

  pump(...fragment)
})

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
})

export default app;