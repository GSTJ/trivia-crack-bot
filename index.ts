import axios, { AxiosInstance, AxiosResponse } from "axios";

enum ErrorCode {
  LivesEnded = 2013,
  TokenExpired = 190,
  InvalidToken = 2500,
  GenericToken = 607,
}

interface GraphResponse {
  id: string;
  email: string;
  error?: {
    code: ErrorCode;
  };
}

interface GameResponse {
  code?: ErrorCode;
  id: string;
  session: {
    session: string;
  };
  facebook_name: string;
}

interface Question {
  id: string;
  category: string;
  correct_answer: string;
}

interface DuelResponse {
  code?: ErrorCode;
  game: {
    questions: Question[];
  };
  countdown: number;
}

interface Player {
  id: string;
  correct_answers: number;
  finish_time: number;
}

interface AnswersPayload {
  answers: {
    id: string;
    category: string;
    answer: string;
  }[];
  finish_time: number;
}

let game: GameResponse; // declare game here to be available in the whole file

const api: AxiosInstance = axios.create({
  baseURL: "https://api.preguntados.com/api",
});

async function login(accessToken: string): Promise<void> {
  try {
    const graphResponse: AxiosResponse<GraphResponse> = await api.get(
      `/v2.11/me?access_token=${accessToken}&fields=id,email`
    );
    const graph: GraphResponse = graphResponse.data;

    const gameResponse: AxiosResponse<GameResponse> = await api.post(
      "/social-login",
      {
        network: "facebook",
        id: graph.id,
        access_token: accessToken,
        email: graph.email,
        site: "fbk",
      }
    );
    game = gameResponse.data; // assign the response to the game variable

    if (graph.error) {
      handleError(graph.error.code);
    }
    if (game.code) {
      handleError(game.code);
    }

    api.defaults.headers.common[
      "Cookie"
    ] = `ap_session=${game.session.session}`;
  } catch (error) {
    handleRequestError(error, "Error during login");
  }
}

function handleError(error: ErrorCode): void {
  switch (error) {
    case ErrorCode.LivesEnded:
      console.log("Suas vidas acabaram.");
      break;
    case ErrorCode.TokenExpired:
      console.log("Seu token expirou!");
      break;
    case ErrorCode.InvalidToken:
      console.log("Token inválido.");
      break;
    case ErrorCode.GenericToken:
      console.log("Token genérico.");
      break;
    default:
      console.log("Algo deu errado. Erro: " + error);
      break;
  }
  process.exit();
}

async function duel(): Promise<void> {
  try {
    const options = {
      game_mode: 2,
      game_type: 1,
      language: "PT",
    };

    const roomResponse: AxiosResponse<{ id: string }> = await api.post(
      `/users/${game.id}/rooms`,
      options
    );
    const room: { id: string } = roomResponse.data;

    console.log("O bot se juntou a um duelo aleatório");

    let duel: DuelResponse | undefined;
    while (!duel || !duel.game) {
      const duelResponse: AxiosResponse<DuelResponse> = await api.get(
        `/users/${game.id}/rooms/${room.id}`
      );
      duel = duelResponse.data;
      await sleep(duel.countdown * 100);

      if (duel.code) {
        await sleep(25000);
        handleError(duel.code);
      }
      console.log("Aguardando duelo começar...");
    }

    const answers = duel.game.questions.map((question) => ({
      id: question.id,
      category: question.category,
      answer: question.correct_answer,
    }));

    const result: AnswersPayload = {
      answers,
      finish_time: Math.floor(Math.random() * 20000) + 40001,
    };

    const response: AxiosResponse<{ players: Player[] }> = await api.post(
      `/users/${game.id}/games/${room.id}/answers`,
      result
    );

    for (const player of response.data.players) {
      if (player.id === game.id) {
        if (player.correct_answers === 12) {
          console.log(
            "Gabaritou o duelo em " + player.finish_time / 1000 + " segundos."
          );
        } else {
          console.log(
            "Alguma coisa deu errado! Você acertou " +
              player.correct_answers +
              " questões."
          );
        }
      }
    }
  } catch (error) {
    handleRequestError(error, "Error during duel");
  }
}

async function main(): Promise<void> {
  try {
    const accessToken = await promptAccessToken();
    await login(accessToken);
    console.log("Bem vindo " + game.facebook_name);

    while (true) {
      await duel();
    }
  } catch (error) {
    console.error("Error in main:", error);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function handleRequestError(error: any, message: string): void {
  if (error.response) {
    console.error(
      `${message}: ${error.response.status} - ${error.response.data}`
    );
  } else if (error.request) {
    console.error(`${message}: No response received`);
  } else {
    console.error(`${message}: ${error.message}`);
  }
  process.exit();
}

function promptAccessToken(): Promise<string> {
  return new Promise((resolve) => {
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Please enter your access token: ", (accessToken: string) => {
      rl.close();
      resolve(accessToken);
    });
  });
}

main();
