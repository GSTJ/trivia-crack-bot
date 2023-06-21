# TriviaCrack Bot

This project is a bot for Trivia Crack, a popular mobile game. The bot was created a long time ago, and is provided as-is after years with no working guarantee.

# Introduction

Trivia Crack is a mobile game where players answer questions from a variety of categories to win. This bot automates that process, answering questions automatically and participating in games on behalf of a user.

# Features

Automated question answering: The bot can automatically answer questions in the game.
Game participation: The bot is capable of participating in games on its own.
Error handling: The bot handles a variety of potential errors to ensure smooth operation.

# How it Works

The bot uses the axios library to make HTTP requests to the Trivia Crack API. It logs into the game using a Facebook access token, then it begins participating in games. It uses pre-defined answers to respond to questions. If it encounters an error, such as a token expiration, it handles it gracefully.

# Usage

You can use this bot by running the main function in the main.ts file. You will be prompted to input your Facebook access token. The bot will then log in and begin participating in games.

# Requirements

To run this bot, you will need:

- Node.js and npm installed on your machine
- A Facebook access token

# Installation

- Clone this repository to your local machine.
- Run npm install to install dependencies.
- Run npm run start to start the bot.
- Remember to input your Facebook access token when prompted.

# Disclaimer

Please use this bot responsibly. The bot is intended for educational purposes and should not be used to gain an unfair advantage in Trivia Crack. Please respect the game's Terms of Service.

# License

This project is licensed under the MIT License.
