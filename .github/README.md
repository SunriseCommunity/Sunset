# 🌇 Sunset - frontend for osu!sunrise

<p align="center">
  <img src="./readme.png" alt="We don't own the rights to this image. If you are the owner and want it removed, please contact us." />
</p>

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/SunriseCommunity/Sunset.svg?style=social&label=Star)](https://github.com/SunriseCommunity/Sunset)

## Description

Sunset is a frontend for the osu! private server called Sunrise. It is a part of the Sunrise project, which aims to create a fully functional osu! private server with all the features that the official server has. This project is made with TypeScript and Next.js.

## Installation (with docker) 🐳
1. Clone the repository
2. Create copy of `.env.local.example` file as `.env.local` and fill all required fields
3. Run the following command:
```bash
docker compose -f docker-compose.yml up -d # Creates the container with app and all dependencies
```
4. The site should be available at: http://localhost:3090/

## Installation 📩

1. Clone the repository
2. Install the required dependencies: `npm install`
3. Create copy of `.env.local.example` file as `.env.local` and fill all required fields
4. Start the application: `npm run build` and `npm run start`

> [!NOTE]
> If you are hosting [Sunrise](https://github.com/SunriseCommunity/Sunrise) **locally** (without domain system), add:
> ```bash
> NODE_TLS_REJECT_UNAUTHORIZED=0
> ```
> to you `.env.local` file. 


## Contributing 💖

If you want to contribute to the project, feel free to fork the repository and submit a pull request. We are open to any
suggestions and improvements.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for more details.
