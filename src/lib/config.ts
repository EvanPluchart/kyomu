import fs from "fs";
import path from "path";

export type Config = {
  comicsPath: string;
  scanIntervalMinutes: number;
  databasePath: string;
  kapowarrUrl: string;
  kapowarrApiKey: string;
  kapowarrInternalUrl: string;
  mylar3Url: string;
  mylar3ApiKey: string;
  mylar3InternalUrl: string;
  comicVineApiKey: string;
};

export const config: Config = {
  comicsPath: process.env.COMICS_PATH ?? "/mnt/media/comics",
  scanIntervalMinutes: process.env.SCAN_INTERVAL_MINUTES
    ? parseInt(process.env.SCAN_INTERVAL_MINUTES, 10)
    : 60,
  databasePath: process.env.DATABASE_PATH ?? "./data/kyomu.db",
  kapowarrUrl: process.env.KAPOWARR_URL ?? "",
  kapowarrApiKey: process.env.KAPOWARR_API_KEY ?? "",
  kapowarrInternalUrl: process.env.KAPOWARR_INTERNAL_URL ?? "http://localhost:5656",
  mylar3Url: process.env.MYLAR3_URL ?? "",
  mylar3ApiKey: process.env.MYLAR3_API_KEY ?? "",
  mylar3InternalUrl: process.env.MYLAR3_INTERNAL_URL ?? "http://localhost:8090",
  comicVineApiKey: process.env.COMICVINE_API_KEY ?? "",
};

export function validateConfig(): void {
  try {
    fs.accessSync(config.comicsPath, fs.constants.R_OK);
  } catch {
    console.warn(
      `[config] Le dossier comicsPath "${config.comicsPath}" n'existe pas ou n'est pas lisible. Il peut être monté ultérieurement (Docker).`
    );
  }

  if (!Number.isFinite(config.scanIntervalMinutes) || config.scanIntervalMinutes <= 0) {
    console.warn(
      `[config] scanIntervalMinutes doit être un nombre positif, valeur actuelle : ${config.scanIntervalMinutes}`
    );
  }

  const dbDir = path.dirname(path.resolve(config.databasePath));
  try {
    fs.accessSync(dbDir, fs.constants.F_OK);
  } catch {
    console.warn(
      `[config] Le dossier parent de databasePath "${dbDir}" n'existe pas.`
    );
  }
}
