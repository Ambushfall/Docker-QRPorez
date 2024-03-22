## Getting Started

First, run the development server:

```bash
docker build ./ -t <username>/<reponame>
```

docker run

```bash
docker build -t <username>/<reponame> . && docker run -p <yourPort>:3000 <username>/<reponame>
```

docker-compose.yml

```yml
ports:
      - 3000:3000
    image: <username>/<reponame> # Change this to accomodate your image name and tag
```

```bash
docker compose up -d
```

# Info

This is a POC showcasing automation and assistance in generating QR Codes to pay your local taxes.
(It is either to be hosted locally or on a dedicated server environment for now.)

- Tech
  - Nextjs
  - Puppeteer
  - Typescript
  - tailwind
  - v0.dev

## Usage

Make it a docker image and test it, or host it yourself by running

```sh
pnpm i && pnpm build && pnpm start
```
