import type { HasFullname } from '@/shared/types'

export interface Nurse extends HasFullname {
  id: number
  spec_id: string
}
