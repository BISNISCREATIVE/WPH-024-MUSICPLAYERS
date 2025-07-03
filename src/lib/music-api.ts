// Mock music API - replace with your actual music service
export const mockTracks = [
  {
    id: "1",
    title: "Indonesia Raya",
    artist: "W.R. Supratman",
    duration: 95, // contoh durasi
    url: "/music/Indonesia_Raya.mp3",
    albumArt: "/images/album-art.png",
  },
  {
    id: "2",
    title: "Ibu Pertiwi",
    artist: "Ismail Marzuki",
    duration: 180, // contoh durasi
    url: "/music/Ibu_Pertiwi.mp3",
    albumArt: "/images/music-icon.png",
  },
  {
    id: "3",
    title: "Garuda Pancasila",
    artist: "Sudharnoto",
    duration: 120, // contoh durasi
    url: "/music/Garuda_Pancasila.mp3",
    albumArt: "/images/album-art.png",
  },
]

// Function to fetch tracks from your music API
export async function fetchTracks() {
  // Ambil daftar file dari endpoint API custom
  const res = await fetch('/api/music-files')
  const files = await res.json() as string[]

  // Generate track list otomatis
  return files.map((filename, idx) => {
    // Hilangkan ekstensi dan ganti _/spasi dengan spasi untuk judul
    const title = filename.replace(/_/g, ' ').replace(/\.mp3$/i, '')
    return {
      id: String(idx + 1),
      title,
      artist: 'Unknown',
      duration: 0, // Akan diisi saat audio load
      url: `/music/${filename}`,
      albumArt: '/images/album-art.png',
    }
  })
}

// Function to search tracks
export async function searchTracks(query: string) {
  // Replace with your actual search API
  return mockTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase()),
  )
}
