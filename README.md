# TEP App

Main repository for the TEP (The Event Planner) Application

## Setup

### Installation

In order to work with this repository, you need to install proto, a pluggable version manager and toolchain,
as well as docker. You can install proto by following its installation guide [here](https://moonrepo.dev/docs/proto/install).

After installing proto, run `proto install` from the root directory to install the project's toolchain, including
[moon](https://moonrepo.dev/docs), the monorepo management tool, [bun](https://bun.sh/), the frontend runtime,
and [rust](https://rust-lang.org/).

You should now be able to run commands via _moon_. You can test the installation by running `moon --version`.

### Frontend Setup

In order to work with the frontend, run `bun install` from the workspace root which installs the third party
dependencies in all workspace packages and apps.

> Remember however that when install new dependencies, you need
> to run the install command (`bun add <dep>`) from the package directory.

### Backend Setup

To install all cargo crates for the rust backend, you can simply run `moon tep-server:build` to install all
dependencies and compile the tep server.

### Docker

Run `docker compose up -d` from the root directory to start all the necessary container services needed to run
the development environment. If you only need to work on frontend code, you can run the docker compose command
from before with the backend profile to also start the backend service in a container:

```sh
docker compose --profile backend up -d
```

The current available profiles that start specific containers in addition to the default enabled are the following:

- **backend**: enables the TEP rust backend service
- **frontend**: enables the TEP web application service
- **full**: enables all configured services

To start all containers (the entire application) via docker containers, you can run the following:

```sh
docker compose --profile full up -d
```
