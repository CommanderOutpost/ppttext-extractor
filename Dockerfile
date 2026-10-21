FROM node:20-bookworm-slim

# python-pptx parses the uploads; Node serves them.
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY requirements.txt ./
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt

COPY . .

ENV NODE_ENV=production
ENV PORT=4001
EXPOSE 4001

CMD ["node", "server.js"]
