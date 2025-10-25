import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'

const icons = Object.values(fas).concat(Object.values(fab))

const getIcon = (type) => {
  const icon = icons.find(({ iconName }) => iconName === type)

  if (icon) {
    return `${icon.prefix} fa-${icon.iconName}`
  }

  return 'fas fa-link'
}

export { getIcon }
