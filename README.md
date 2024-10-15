# Self-Healing Telegram Bot

This is a **Self-Healing Telegram Bot** designed to uplift users' spirits by sending motivational, peaceful, and strength-filled messages. It also supports daily scheduled messages, user feedback collection, and category-based random message generation using inline buttons.

## Features

- **Personalized Welcome Message:** Users are greeted differently based on whether they are new or returning.
- **Message Categories:** Users can select from categories such as Strength, Motivation, and Peace to receive uplifting messages.
- **Daily Scheduled Messages:** Users can schedule daily messages at their preferred time.
- **User Feedback:** Users can provide feedback on the bot's messages.
- **Persistent Data:** MongoDB is used to store user data and feedback.

## Usage

### Commands

- **/start**: Starts the bot and sends a personalized greeting.
- **/set_daily**: Allows the user to schedule a daily inspirational message at a fixed time.
- **/stop_daily**: Stops daily messages from being sent.
- **/feedback**: Prompts the user to provide feedback on the bot's messages.

### Inline Buttons

Users can interact with inline buttons to choose a message category:

- **Strength 💪**
- **Motivation ✨**
- **Peace ☮️**
- **Give Feedback**

### Scheduling Daily Messages

After running the `/set_daily` command, the bot will ask the user to provide a time in HH:MM format. Once set, the bot will send a random inspirational message from a selected category at the scheduled time every day.

### Feedback

Users can provide feedback via text after interacting with the "Give Feedback" button or running the `/feedback` command.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/telegram_bot.git
   cd telegram_bot
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of your project and add the following environment variables:

   ```env
   TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   MONGODB_URI=your-mongodb-uri
   ```

4. Start the bot locally:

   ```bash
   node index.js
   ```

## Deployment on Heroku

1. Install the Heroku CLI if you haven't already.

2. Log in to your Heroku account:

   ```bash
   heroku login
   ```

3. Create a new Heroku app:

   ```bash
   heroku create your-app-name
   ```

4. Set the environment variables in Heroku:

   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=your-telegram-bot-token
   heroku config:set MONGODB_URI=your-mongodb-uri
   ```

5. Push the code to Heroku:

   ```bash
   git push heroku main
   ```

6. After deployment, you can view the logs for any issues:

   ```bash
   heroku logs --tail
   ```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.