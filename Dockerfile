# command to build the container
# from kioshi folder: docker build -f Docker/Dockerfile . -t kioshi:1.0.0

# Download node 8 container
FROM node:8-jessie

# copy the server folder into root directory
ADD server server

WORKDIR /server
# install npm dependency
RUN npm install

# set the working dirctory where app will run

EXPOSE 3000

CMD ["npm", "start"]