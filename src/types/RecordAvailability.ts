import { Condition } from "./Condition";

export interface RecordAvailability {
  storeId: string;
  condition: Condition;
  price: number;
}
