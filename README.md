# Translate AI

Translator between English and Chinese, built on top of OpenAI. Full-stack web app including both frontend and backend. Allows selection of tone (i.e. "formal", "casual", "sassy").

## Quick Start

```sh
# Install dependencies
yarn

# Run a Next.js server at localhost:3000
yarn --cwd packages/web build
yarn start-web

# Run an Express API at localhost:8000 (in another terminal if you ran "yarn start-web")
yarn --cwd packages/server build
yarn start-server
```
