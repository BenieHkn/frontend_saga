/**
 * utils/formatters.js
 * Utilitaires de formatage pour l'application SecureShare
 */

/**
 * Formate une taille de fichier en octets vers une unité lisible
 * @param {number} bytes - Taille en octets
 * @param {number} decimals - Nombre de décimales (défaut: 2)
 * @returns {Object} - { size: number, unit: string }
 */
export function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return { size: 0, unit: 'Bytes' }

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return {
    size: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    unit: sizes[i]
  }
}

/**
 * Génère les initiales à partir d'un nom complet
 * @param {string} name - Nom complet
 * @returns {string} - Initiales en majuscules
 */
export function getInitials(name) {
  if (!name) return '??'
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Formate une date en format lisible
 * @param {string|Date} date - Date à formater
 * @returns {string} - Date formatée
 */
export function formatDate(date) {
  if (!date) return ''
  
  const d = new Date(date)
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return d.toLocaleDateString('fr-FR', options)
}

export function formatDateFR(dateStr) {
  if (!dateStr) return '';

  const date = new Date(dateStr);

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Obtient l'icône appropriée pour un type de fichier
 * @param {string} type - Type de fichier (PDF, ZIP, DOC, IMG, etc.)
 * @returns {string} - Nom de l'icône Heroicons
 */
export function getFileIcon(type) {
  const icons = {
    PDF: 'heroicons:document-text',
    ZIP: 'heroicons:archive-box',
    DOC: 'heroicons:document',
    DOCX: 'heroicons:document',
    XLS: 'heroicons:table-cells',
    XLSX: 'heroicons:table-cells',
    PPT: 'heroicons:presentation-chart-bar',
    PPTX: 'heroicons:presentation-chart-bar',
    IMG: 'heroicons:photo',
    PNG: 'heroicons:photo',
    JPG: 'heroicons:photo',
    JPEG: 'heroicons:photo',
    GIF: 'heroicons:photo',
    SVG: 'heroicons:photo',
    VIDEO: 'heroicons:film',
    MP4: 'heroicons:film',
    AVI: 'heroicons:film',
    AUDIO: 'heroicons:musical-note',
    MP3: 'heroicons:musical-note',
    WAV: 'heroicons:musical-note',
    CODE: 'heroicons:code-bracket',
    JS: 'heroicons:code-bracket',
    TS: 'heroicons:code-bracket',
    PY: 'heroicons:code-bracket',
    HTML: 'heroicons:code-bracket',
    CSS: 'heroicons:code-bracket',
  }
  
  return icons[type?.toUpperCase()] || 'heroicons:document'
}

/**
 * Obtient la classe CSS appropriée pour un badge de type de fichier
 * @param {string} type - Type de fichier
 * @returns {string} - Classes Tailwind CSS
 */
export function getTypeBadgeClass(type) {
  const classes = {
    PDF: 'bg-blue-100 text-blue-700',
    ZIP: 'bg-amber-100 text-amber-700',
    DOC: 'bg-indigo-100 text-indigo-700',
    DOCX: 'bg-indigo-100 text-indigo-700',
    XLS: 'bg-emerald-100 text-emerald-700',
    XLSX: 'bg-emerald-100 text-emerald-700',
    PPT: 'bg-rose-100 text-rose-700',
    PPTX: 'bg-rose-100 text-rose-700',
    IMG: 'bg-purple-100 text-purple-700',
    PNG: 'bg-purple-100 text-purple-700',
    JPG: 'bg-purple-100 text-purple-700',
    JPEG: 'bg-purple-100 text-purple-700',
    VIDEO: 'bg-pink-100 text-pink-700',
    AUDIO: 'bg-cyan-100 text-cyan-700',
    CODE: 'bg-slate-100 text-slate-700',
  }
  
  return classes[type?.toUpperCase()] || 'bg-slate-100 text-slate-700'
}

/**
 * Détermine le type de fichier à partir de son extension
 * @param {string} filename - Nom du fichier
 * @returns {string} - Type de fichier en majuscules
 */
export function getFileTypeFromName(filename) {
  if (!filename) return 'UNKNOWN'
  
  const extension = filename.split('.').pop()?.toUpperCase()
  
  const typeMap = {
    PDF: 'PDF',
    ZIP: 'ZIP', RAR: 'ZIP', '7Z': 'ZIP',
    DOC: 'DOC', DOCX: 'DOCX',
    XLS: 'XLS', XLSX: 'XLSX',
    PPT: 'PPT', PPTX: 'PPTX',
    PNG: 'IMG', JPG: 'IMG', JPEG: 'IMG', GIF: 'IMG', SVG: 'IMG', WEBP: 'IMG',
    MP4: 'VIDEO', AVI: 'VIDEO', MOV: 'VIDEO', WMV: 'VIDEO',
    MP3: 'AUDIO', WAV: 'AUDIO', OGG: 'AUDIO',
    JS: 'CODE', TS: 'CODE', PY: 'CODE', HTML: 'CODE', CSS: 'CODE', VUE: 'CODE',
  }
  
  return typeMap[extension] || extension || 'UNKNOWN'
}

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean} - true si valide
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Tronque un texte avec des ellipses
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} - Texte tronqué
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Génère une couleur d'avatar basée sur une chaîne
 * @param {string} str - Chaîne source (nom, email, etc.)
 * @returns {string} - Classe Tailwind CSS pour le gradient
 */
export function getAvatarColorFromString(str) {
  if (!str) return 'bg-gradient-to-br from-slate-400 to-slate-500'
  
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-rose-500 to-rose-600',
    'bg-gradient-to-br from-amber-500 to-amber-600',
    'bg-gradient-to-br from-cyan-500 to-cyan-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
  ]
  
  const hash = str.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Copie du texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} - true si copié avec succès
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback pour les anciens navigateurs
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

/**
 * Débounce une fonction
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Délai en ms
 * @returns {Function} - Fonction debouncée
 */
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}