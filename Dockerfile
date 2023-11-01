# Use the development stage to build your project
FROM nikolaik/python-nodejs:latest as development
WORKDIR /usr/src/app
RUN pip install python-pptx
COPY **/package.json **/package-lock.json ./
RUN yarn
RUN yarn install
COPY ./ ./
RUN yarn build

# Use the production stage
FROM nikolaik/python-nodejs:latest as production
RUN pip install --upgrade pip
RUN pip install python-pptx
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --from=development /usr/src/app ./
EXPOSE 4000
CMD ["node", "dist/main"]
