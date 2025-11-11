import React from 'react'

export default function ArtistResults({ artists, onPick }){
  if(!artists || artists.length===0) return null
  return (
    <div className="artistResults">
      {artists.map(a=>(
        <button key={a.artistId} className="artistBtn" onClick={()=>onPick(a.artistName)}>
          {a.artistName}
        </button>
      ))}
    </div>
  )
}
