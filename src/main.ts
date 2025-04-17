type Person = {
  readonly id: number,
  readonly name: string,
  birth_year: number,
  death_year?: number,
  biography: string,
  image: string
}

type ActressNationality =
  | "American"
  | "British"
  | "Australian"
  | "Israeli-American"
  | "South African"
  | "French"
  | "Indian"
  | "Israeli"
  | "Spanish"
  | "South Korean"
  | "Chinese"

type ActorNationality =
  | ActressNationality
  | "Scottish"
  | "New Zealand"
  | "Hong Kong"
  | "German"
  | "Canadian"
  | "Irish"

const actressNationalities = ["American", "British", "Australian", "Israeli-American", "South African", "French", "Indian", "Israeli", "Spanish", "South Korean", "Chinese"]
const actorNationalities = [...actressNationalities, "Scottish", "New Zealand", "Hong Kong", "German", "Canadian", "Irish"]

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: ActressNationality
}

type Actor = Person & {
  known_for: [string, string, string],
  awards: [string] | [string, string],
  nationality: ActorNationality
}


function isPerson(data: unknown): data is Person {
  return (
    typeof data === "object" && data !== null &&
    "id" in data && typeof data.id === "number" &&
    "name" in data && typeof data.name === "string" &&
    "birth_year" in data && typeof data.birth_year === "number" &&
    "death_year" in data && typeof data.death_year === "number" &&
    "biography" in data && typeof data.biography === "string" &&
    "image" in data && typeof data.image === "string"
  )
}

function isActress(data: unknown): data is Actress {
  return (
    isPerson(data) &&
    "most_famous_movies" in data &&
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every(m => typeof m === "string") &&
    "awards" in data && typeof data.awards === "string" &&
    "nationality" in data &&
    typeof data.nationality === "string" &&
    actressNationalities.includes(data.nationality)
  )
}

function isActor(data: unknown): data is Actor {
  return (
    isPerson(data) &&
    "known_for" in data &&
    data.known_for instanceof Array &&
    data.known_for.length === 3 &&
    data.known_for.every(m => typeof m === "string") &&
    "awards" in data &&
    data.awards instanceof Array &&
    (data.awards.length === 1 || data.awards.length === 2) &&
    data.awards.every(m => typeof m === "string") &&
    "nationality" in data &&
    typeof data.nationality === "string" &&
    actorNationalities.includes(data.nationality)
  )
}


async function getActress(id: number): Promise<Actress | null> {
  try {
    const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actresses/${id}`)
    const data: unknown = await response.json()
    if (!isActress(data)) {
      throw new Error("Formato dei dati non valido")
    }
    console.log(data)
    return data
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero dell'attrice", err)
    } else {
      console.error("Errore sconosciuto", err)
    }
    return null
  }
}

getActress(6)

async function getActor(id: number): Promise<Actor | null> {
  try {
    const response = await fetch(`https://boolean-spec-frontend.vercel.app/freetestapi/actors/${id}`)
    const data: unknown = await response.json()
    if (!isActor(data)) {
      throw new Error("Formato dei dati non valido")
    }
    console.log(data)
    return data
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero dell'attore", err)
    } else {
      console.error("Errore sconosciuto", err)
    }
    return null
  }
}

getActor(5)


async function getAllActresses(): Promise<Actress[]> {
  try {
    const response = await fetch("https://boolean-spec-frontend.vercel.app/freetestapi/actresses")
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`)
    }
    const data: unknown = await response.json()
    if (!(data instanceof Array)) {
      throw new Error("Formato dei dati non valido")
    }
    const validActress: Actress[] = data.filter(a => isActress(a))
    console.log(data)
    return validActress
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero delle attrici", err)
    } else {
      console.error("Errore sconosciuto", err)
    }
    return []
  }
}

getAllActresses()

async function getAllActors(): Promise<Actor[]> {
  try {
    const response = await fetch("https://boolean-spec-frontend.vercel.app/freetestapi/actors")
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}: ${response.statusText}`)
    }
    const data: unknown = await response.json()
    if (!(data instanceof Array)) {
      throw new Error("Formato dei dati non valido")
    }
    const validActor: Actor[] = data.filter(isActor)
    console.log(data)
    return validActor
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero degli attori", err)
    } else {
      console.error("Errore sconosciuto", err)
    }
    return []
  }
}

getAllActors()


async function getActresses(ids: number[]): Promise<(Actress | null)[]> {
  try {
    const promises = ids.map(id => getActress(id))
    return await Promise.all(promises)
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero delle attrici", err)
    } else {
      console.error("Errore sconosciuto", err)
    }
    return []
  }
}

async function getActors(ids: number[]): Promise<(Actor | null)[]> {
  try {
    const promises = ids.map(id => getActor(id))
    return await Promise.all(promises)
  } catch (err) {
    if (err instanceof Error) {
      console.error("Errore nel recupero degli attori", err)
    } else {
      console.error("Errore sconosciuto", err)
    }
    return []
  }
}


function createActress(data: Omit<Actress, "id">): Actress {
  return {
    ...data,
    id: Math.floor(Math.random() * 10000)
  }
}

function updateActress(actress: Actress, updates: Partial<Omit<Actress, "id" | "name">>): Actress {
  return {
    ...actress,
    ...updates,
  }
}

function createActor(data: Omit<Actor, "id">): Actor {
  return {
    ...data,
    id: Math.floor(Math.random() * 10000)
  }
}

function updateActor(actor: Actor, updates: Partial<Omit<Actor, "id" | "name">>): Actor {
  return {
    ...actor,
    ...updates,
  }
}