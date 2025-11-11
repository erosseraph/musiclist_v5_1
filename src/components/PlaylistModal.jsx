import React from 'react'

export default function PlaylistModal({ open, onClose, playlist, onRemove, onMove, page, setPage }){
  if(!open) return null
  const perPage = 10
  const totalPages = Math.ceil(playlist.length/perPage)
  const start = (page-1)*perPage
  const current = playlist.slice(start,start+perPage)

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={e=>e.stopPropagation()}>
        <h2>🎵 我的歌单</h2>
        <div className="plPageList">
          {current.map((p,i)=>(
            <div key={p.trackId} className="plItemModal">
              <div className="plLeft">
                <img src={p.artworkUrl100} alt={p.trackName}/>
                <div className="plInfo">
                  <div className="t">{p.trackName}</div>
                  <div className="a">{p.artistName}</div>
                </div>
              </div>
              <div className="plBtns">
                <button onClick={()=>onMove(i+start,-1)}>↑</button>
                <button onClick={()=>onMove(i+start,1)}>↓</button>
                <button onClick={()=>onRemove(p.trackId)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
        {totalPages>1 && (
          <div className="pagination">
            <button disabled={page===1} onClick={()=>setPage(page-1)}>上一页</button>
            <span>{page}/{totalPages}</span>
            <button disabled={page===totalPages} onClick={()=>setPage(page+1)}>下一页</button>
          </div>
        )}
        <button className="closeBtn" onClick={onClose}>关闭</button>
      </div>
    </div>
  )
}
