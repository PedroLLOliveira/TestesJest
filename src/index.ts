import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";
import NodeCache from "node-cache";
import { AddressInfo } from "net";
import { log } from "console";

const app = express();
const URL_API = "https://mqjnto3qw2.execute-api.us-east-1.amazonaws.com/default";
const cache = 300;
const meu_cache = new NodeCache({ stdTTL: cache, checkperiod: 60 });

app.use(express.json());
app.use(cors());

// Endpoint para obter uma playlist por ID com cache
app.get("/playlist/:id", async (req: Request, res: Response) => {
  try {
    // const playlistId = req.params.id;
    // const playlistKey = `playlist-${playlistId}`;
    // let playlist = meu_cache.get(playlistKey);

    // if (!playlist) {
    //   const token = await getToken();
    //   playlist = await getPlaylistById(playlistId, token);
    //   meu_cache.set(playlistKey, playlist, cache);
    // }
    const playlistId = req.params.id;
    const token = await getToken();
    const playlist = await getPlaylistByIdCached(playlistId, token);
    console.log(playlist);
    
    res.send(playlist);
  } catch (error: any) {
    res.status(500).send(error.message || "Internal server error");
  }
});

// Endpoint para obter uma música por ID com cache
app.get("/song/:id", async (req: Request, res: Response) => {
  try {
    const songId = req.params.id;
    const token = await getToken();
    const song = await getSongByIdCached(songId, token);
    res.send(song);
  } catch (error: any) {
    res.status(500).send(error.message || "Internal server error");
  }
});

async function getToken(): Promise<string> {
  const tokenKey = "auth-token";
  let token: string | undefined = meu_cache.get(tokenKey) as string | undefined;

  if (!token) {
    const response = await axios.post(`${URL_API}/user/login`, {
      email: process.env.USER_EMAIL,
      password: process.env.USER_PASSWORD,
    });
    token = response.data.token;
    meu_cache.set(tokenKey, token, cache);
  }

  return token as string;
}

async function getPlaylistByIdCached(id: string, token: string) {
  const playlistKey = `playlist-${id}`
  let playlist = meu_cache.get(playlistKey) as any
  console.log(playlistKey);
  

  if(!playlist) {
    const response = await axios.get(`${URL_API}/playlist/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    
    playlist =  response.data.playlist;
    playlist._songs = await Promise.all(playlist._songs.map(async (song_id: string) => {
      const songs: any = await getSongByIdCached(song_id, token)
      return songs.song
    }))
    meu_cache.set(playlistKey, playlist, cache)
  }

  return playlist

}

async function getSongByIdCached(id: string, token: string) {
  const songKey = `song-${id}`;
  let song = meu_cache.get(songKey);

  if (!song) {
    const response = await axios.get(`${URL_API}/song/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    song = response.data;
    meu_cache.set(songKey, song, cache);
  }

  return song;
}

const server = app.listen(process.env.PORT || 3003, () => {
  const address = server.address() as AddressInfo;
  console.log(`Server is running in http://localhost:${address.port}`);
});
