import type { HasFullname } from '@/shared/types'

export interface Doctor extends HasFullname {
  id: number
  spec_id: string
  chief: boolean
}
