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

const nationalities = ["American", "British", "Australian", "Israeli-American", "South African", "French", "Indian", "Israeli", "Spanish", "South Korean", "Chinese"]

type Actress = Person & {
  most_famous_movies: [string, string, string],
  awards: string,
  nationality: ActressNationality
}

function isActress(data: unknown): data is Actress {
  return (
    typeof data === "object" && data !== null &&
    "id" in data && typeof data.id === "number" &&
    "name" in data && typeof data.name === "string" &&
    "birth_year" in data && typeof data.birth_year === "number" &&
    "death_year" in data && typeof data.death_year === "number" &&
    "biography" in data && typeof data.biography === "string" &&
    "image" in data && typeof data.image === "string" &&
    "most_famous_movies" in data &&
    data.most_famous_movies instanceof Array &&
    data.most_famous_movies.length === 3 &&
    data.most_famous_movies.every(m => typeof m === "string") &&
    "awards" in data && typeof data.awards === "string" &&
    "nationality" in data &&
    typeof data.nationality === "string" &&
    nationalities.includes(data.nationality)
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