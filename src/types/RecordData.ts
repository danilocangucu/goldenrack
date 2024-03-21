import { Genre } from "./Genre";
import { RecordAvailability } from "./RecordAvailability";

export interface RecordData {
  id: string;
  genre: Genre;
  title: string;
  artist: string;
  description: string;
  year: number;
  recordAvailability: RecordAvailability[];
}
