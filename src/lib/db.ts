import { supabase } from './supabase'

export function camelToSnake(str: string) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase()
}

export function snakeToCamel(str: string) {
  return str.replace(/_([a-z])/g, (_, l) => l.toUpperCase())
}

export function mapKeys<T>(obj: T, fn: (s: string) => string): T {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map((o) => mapKeys(o, fn)) as unknown as T
  if (typeof obj !== 'object') return obj
  const result: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    result[fn(k)] = v
  }
  return result as T
}

export async function fetchAll<T>(table: string, order?: string): Promise<T[]> {
  let query = supabase.from(table).select('*')
  if (order) query = query.order(order, { ascending: false })
  const { data } = await query
  return (mapKeys(data, snakeToCamel) as T[]) || []
}

export async function insertOne<T>(table: string, item: T): Promise<void> {
  const dbItem = mapKeys(item, camelToSnake)
  await supabase.from(table).insert(dbItem as never)
}

export async function updateOne<T>(table: string, id: string, item: Partial<T>): Promise<void> {
  const dbItem = mapKeys(item, camelToSnake)
  await supabase.from(table).update(dbItem as never).eq('id', id)
}

export async function deleteOne(table: string, id: string): Promise<void> {
  await supabase.from(table).delete().eq('id', id)
}

export async function fetchOne<T>(table: string, id: string): Promise<T | null> {
  const { data } = await supabase.from(table).select('*').eq('id', id).single()
  return (mapKeys(data, snakeToCamel) as T) || null
}
