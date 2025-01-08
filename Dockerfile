FROM node:20.18.1
WORKDIR /agents-playground
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm","run","dev"]