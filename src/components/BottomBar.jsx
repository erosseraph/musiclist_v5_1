import React from 'react'

export default function BottomBar({ count, onOpenPlaylist, onTop, onRefresh }){
  return (
    <div className="bottomBar">
      <button onClick={onOpenPlaylist}>🎵 歌单 ({count})</button>
      <button onClick={onTop}>⬆️ 回顶部</button>
      <button onClick={onRefresh}>🔄 刷新</button>
    </div>
  )
}
