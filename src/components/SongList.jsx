import React from 'react'

export default function SongList({ songs, onAdd }){
  if(!songs || songs.length===0) return null
  return (
    <div className="songList">
      {songs.map(song=>(
        <div className="songItem" key={song.trackId}>
          <img src={song.artworkUrl100} alt={song.trackName} />
          <div className="songInfo">
            <div className="songTitle">{song.trackName}</div>
            <div className="songArtist">{song.artistName}</div>
          </div>
          <button onClick={()=>onAdd(song)}>＋添加</button>
        </div>
      ))}
    </div>
  )
}
