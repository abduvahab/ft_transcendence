# ft_transcendence_42
## About Projext 
  the Pong Contest website! This project is all about bringing the classic game of Pong to a modern, multiplayer online platform. Users can play Pong with others in real-time, connect with friends, create chat rooms, and enjoy a variety of features, all built using the latest web technologies.
## Table of Contents

- [Introduction](#introduction)
- [Screenshots](#screenshots)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)

## Introduction

The Pong Contest website allows users to play Pong with others in real-time. It provides a feature-rich user interface with integrated chat, authentication through the OAuth system of 42 intranet, two-factor authentication, friend management, and more. The backend is built with NestJS, the frontend with react, and the database is PostgreSQL (all in TypeScript).

## Screenshots
```
Login page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/login.png)

```
Sign up page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/sign%20up.png)

```
Home page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/home%20page.png)
```
change Profile page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/change%20profile.png)
```
Manage friend page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/friend%20manage%20page.png)
```
Private chat page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/private%20chat.png)
```
create room page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/create%20room%20protected.png)
```
group chat page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/group%20chat.png)
```
game page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/game%20page.png)
```
waiting page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/waiting%20chanllenger.png)
```
playing game page
```
![alt text](https://github.com/abduvahab/ft_transcendence/blob/main/images/playing%20game.png)

## Features

Here are some of the key features of the Pong Contest website:

- Real-time multiplayer Pong games.
- User-friendly interface.
- Integrated chat system.
- OAuth login via the 42 intranet.
- Two-factor authentication for added security.
- Friend management to connect with other users.
- Creation of public, private, or password-protected chat rooms (channels).
- Direct messaging between users.
- Matchmaking system for automatic game pairing.
- inviting for pong game
- setting for game
- block others


## Technologies Used

The Pong Contest website is built using the following technologies:

- **Backend**: NestJS
- **Frontend**: vitejs + reactjs+ redux
- **Database**: PostgreSQL
- **Authentication**: OAuth system of 42 intranet
- **Real-time Communication**: WebSockets


## Getting Started

To run the Pong Contest website locally, follow these steps:

### first : to run the project you'll need to add a .env File with this values : 
```
1. .env file for docker compose 
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_PORT=
POSTGRES_HOST=

2. .env file in server
  
#postgres

POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_PORT=
# POSTGRES_HOST=
POSTGRES_HOST=
PORT1 = 
PORT2 = 
PORT_client = 
#42 autherization
F_UID=
F_SECRET=s
F_CALLBACK=
#jwt 

T_SECRET=hjfdjdhs736JDHS%$*NDJJH
#adrress of nestjs 
N_URL=
#adrress of client || reat address
C_URL=
```
3. .env file in client
VITE_LOCAL1=
VITE_LOCAL2=


### second  : 
```
docker-compose up --build || docker compose up --build
```
























