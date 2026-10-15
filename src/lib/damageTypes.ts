import deathIcon from '@/assets/damage-icons/death.gif'
import earthIcon from '@/assets/damage-icons/earth.gif'
import energyIcon from '@/assets/damage-icons/energy.gif'
import fireIcon from '@/assets/damage-icons/fire.gif'
import holyIcon from '@/assets/damage-icons/holy.gif'
import iceIcon from '@/assets/damage-icons/ice.gif'
import physicalIcon from '@/assets/damage-icons/physical.gif'
import type { DamageType } from '@/types'

export const DAMAGE_TYPE_LABEL: Record<DamageType, string> = {
  physical: 'Physical',
  earth: 'Earth',
  fire: 'Fire',
  death: 'Death',
  energy: 'Energy',
  holy: 'Holy',
  ice: 'Ice',
}

export const DAMAGE_TYPE_ICON_URL: Record<DamageType, string> = {
  physical: physicalIcon,
  earth: earthIcon,
  fire: fireIcon,
  death: deathIcon,
  energy: energyIcon,
  holy: holyIcon,
  ice: iceIcon,
}
