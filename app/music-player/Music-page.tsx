'use client'

import React from 'react';
import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipForward, SkipBack, Music, Mic2, Clock, Volume2 } from 'lucide-react'
import Image from 'next/image'
import { motion } from 'framer-motion'

type TrackData = {
  id: string
  name: string
  artist: string
  album: string
  duration: number
  audio: string
  image: string
}

type APIResponse = {
  results: Array<{
    id: string
    name: string
    artist_name: string
    album_name: string
    duration: number
    audio: string
    image: string
  }>
}

export default function MusicPlayer() {
  const [tracks, setTracks] = useState<TrackData[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetchTracks()
  }, [])

  useEffect(() => {
    if (tracks.length > 0) {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = new Audio(tracks[currentTrackIndex].audio)
      audioRef.current.volume = volume
      audioRef.current.play()
      setIsPlaying(false)
    }
  }, [currentTrackIndex, tracks])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume]);

  const fetchTracks = async () => {
    try {
      const API = process.env.NEXT_PUBLIC_MUSIC_TRACK;

      if (!API) {
        throw new Error("API URL is undefined. Please check your environment variables.");
      }

      const response = await fetch(API)
      const data: APIResponse = await response.json()

      if (data.results && data.results.length > 0) {
        const fetchedTracks = data.results.map((result) => ({
          id: result.id,
          name: result.name,
          artist: result.artist_name,
          album: result.album_name,
          duration: result.duration,
          audio: result.audio,
          image: result.image
        }))
        setTracks(fetchedTracks)
      }
    } catch (error) {
      console.error('Error fetching tracks:', error)
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const playNextTrack = () => {
    const randomIndex = Math.floor(Math.random() * tracks.length) 
    setCurrentTrackIndex(randomIndex)
  }

  const playPreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1)
    } else {
      setCurrentTrackIndex(tracks.length - 1)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const currentTrack = tracks[currentTrackIndex]

  return (
    <div className="min-h-screen bg-[url('/dashboardbg.png')] bg-no-repeat bg-cover bg-center">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'linear' }}
        className="w-full"
      >
        <div className="max-w-5xl mx-auto p-4">
          <h1 className="text-4xl font-bold text-center text-white my-8">CloudCast <br className="block sm:hidden" />Music Player</h1>
          {currentTrack ? (
            <div className="bg-blue-200 text-black dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-3xl font-semibold dark:text-white">{currentTrack.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">{currentTrack.artist}</p>
                </div>
                <div className="flex items-center">
                  <Image
                    src={currentTrack.image}
                    alt={`${currentTrack.name} album cover`}
                    className="w-16 h-16 rounded-lg"
                    width={64}
                    height={64}
                  />
                </div>
              </div>

              <div className="mb-6 h-64 rounded-lg overflow-hidden bg-purple-300 dark:bg-gray-700 flex items-center justify-center">
                <Image
                  src={currentTrack.image}
                  alt={`${currentTrack.name} album cover`}
                  className="w-full h-full object-cover"
                  width={300}
                  height={300}
                />
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={playPreviousTrack}
                  className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  aria-label="Previous track"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
                <button
                  onClick={playNextTrack}
                  className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  aria-label="Next track"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-100 dark:bg-purple-900 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Track Info</h3>
                  <div className="flex items-center dark:text-gray-200">
                    <Music className="h-6 w-6 text-purple-500 dark:text-purple-400 mr-2" />
                    <span>Album: {currentTrack.album}</span>
                  </div>
                  <div className="flex items-center mt-2 dark:text-gray-200">
                    <Clock className="h-6 w-6 text-purple-500 dark:text-purple-400 mr-2" />
                    <span>Duration: {formatDuration(currentTrack.duration)}</span>
                  </div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Artist</h3>
                  <div className="flex items-center dark:text-gray-200">
                    <Mic2 className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-2" />
                    <span>{currentTrack.artist}</span>
                  </div>
                </div>
                <div className="bg-green-100 dark:bg-green-900 rounded-lg p-4 shadow">
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Volume</h3>
                  <div className="flex items-center dark:text-gray-200">
                    <Volume2 className="h-6 w-6 text-green-500 dark:text-green-400 mr-2" />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-full"
                      aria-label="Volume control"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Playlist ({tracks.length} tracks)</h3>
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden max-h-96 overflow-y-auto">
                  {tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer ${
                        index === currentTrackIndex ? 'bg-gray-200 dark:bg-gray-500' : ''
                      }`}
                      onClick={() => setCurrentTrackIndex(index)}
                    >
                      <div className="flex items-center">
                        <Image
                          src={track.image}
                          alt={`${track.name} album cover`}
                          className="w-10 h-10 rounded mr-2"
                          width={40}
                          height={40}
                        />
                        <div className="flex-grow">
                          <p className="font-medium dark:text-white truncate">{track.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300 truncate">{track.artist}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDuration(track.duration)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full mx-auto">
              <p className="text-center text-gray-600 dark:text-gray-400">Loading tracks...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}