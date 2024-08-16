<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Auth Microservice

### Description

Microservice that handles user authentication, uses MongoDB as a database.

1. Clone the repository
2. Install dependencies
3. Create an `.env` based on the `.env.template`
4. Execute prisma migration `npx prisma migrate dev`
5. Execute `npm run start:dev`

## Prod

1. Clone the repository
2. Create an `.env` based on the `.env.template`
3. Execute command `docker build -f dockerfile.prod -t "name" .`

## Stay in touch

- LinkedIn - [Catriel Escobar](https://www.linkedin.com/in/catrielescobar/)
