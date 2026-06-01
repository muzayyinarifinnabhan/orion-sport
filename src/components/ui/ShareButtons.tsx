import { Share2, MessageCircle, Facebook, Twitter, Link } from 'lucide-react'
import { useToast } from './Toast'

interface ShareButtonsProps {
  judul: string
  konten?: string
}

function getShareUrl() {
  if (typeof window === 'undefined') return ''
  return window.location.href
}

function getShareText(judul: string) {
  return `${judul} - Orion Sports Center`
}

export default function ShareButtons({ judul, konten }: ShareButtonsProps) {
  const { showToast } = useToast()
  const url = getShareUrl()
  const text = getShareText(judul)
  const fullText = konten ? `${text}\n\n${konten.slice(0, 100)}...` : text

  const shareWhatsApp = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(fullText + '\n' + url)}`, '_blank')
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
  const copyLink = () => {
    navigator.clipboard.writeText(url)
    showToast('Link berhasil disalin!', 'success')
  }

  const buttons = [
    { icon: MessageCircle, label: 'WhatsApp', onClick: shareWhatsApp, color: 'hover:bg-green-50 hover:text-green-600 border-green-200' },
    { icon: Facebook, label: 'Facebook', onClick: shareFacebook, color: 'hover:bg-blue-50 hover:text-blue-600 border-blue-200' },
    { icon: Twitter, label: 'Twitter', onClick: shareTwitter, color: 'hover:bg-sky-50 hover:text-sky-600 border-sky-200' },
    { icon: Link, label: 'Salin Link', onClick: copyLink, color: 'hover:bg-gray-50 hover:text-gray-600 border-gray-200' },
  ]

  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
      <Share2 size={14} className="text-gray-400" />
      {buttons.map((btn) => {
        const Icon = btn.icon
        return (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className={`p-2 rounded-lg border bg-white text-gray-500 transition-all ${btn.color}`}
            title={btn.label}
          >
            <Icon size={14} />
          </button>
        )
      })}
    </div>
  )
}
