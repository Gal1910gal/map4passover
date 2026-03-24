const KEY_CLIENTS = "passover_clients";
const KEY_LAST    = "passover_last";

export interface SavedClient {
  id: string;
  firstName: string;
  lastName: string;
  day: string;
  month: string;
  year: string;
  gender: "female" | "male";
  personalYear: number;
  months: Array<{ monthName: string; personalMonth: number }>;
  savedAt: number;
}

export type LastInput = Pick<SavedClient, "firstName"|"lastName"|"day"|"month"|"year"|"gender">;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}

export function getClients(): SavedClient[] {
  return read<SavedClient[]>(KEY_CLIENTS, []);
}

export function saveClient(client: Omit<SavedClient, "id" | "savedAt">): void {
  const clients = getClients();
  const idx = clients.findIndex(c =>
    c.firstName === client.firstName &&
    c.lastName  === client.lastName  &&
    c.day       === client.day       &&
    c.month     === client.month     &&
    c.year      === client.year
  );
  const entry: SavedClient = { ...client, id: idx >= 0 ? clients[idx].id : Date.now().toString(), savedAt: Date.now() };
  if (idx >= 0) clients[idx] = entry;
  else clients.unshift(entry);
  localStorage.setItem(KEY_CLIENTS, JSON.stringify(clients.slice(0, 100)));
}

export function deleteClient(id: string): void {
  localStorage.setItem(KEY_CLIENTS, JSON.stringify(getClients().filter(c => c.id !== id)));
}

export function getLastInput(): LastInput | null {
  return read<LastInput | null>(KEY_LAST, null);
}

export function saveLastInput(data: LastInput): void {
  localStorage.setItem(KEY_LAST, JSON.stringify(data));
}
