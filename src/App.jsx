import React, { useEffect, useRef, useState } from 'react'
import SearchBar from './components/SearchBar'
import SongList from './components/SongList'
import PlaylistModal from './components/PlaylistModal'
import ArtistResults from './components/ArtistResults'
import BottomBar from './components/BottomBar'

const famous = [
  "周杰伦","王菲","张学友","林俊杰","陈奕迅","李荣浩","梁静茹","蔡依林","张国荣","陈慧娴",
  "王力宏","五月天","邓紫棋","林宥嘉","刘若英","孙燕姿","张惠妹","赵传","那英","黄莺莺",
  "陈奕希","林志炫","李宗盛","胡彦斌","萧敬腾","许志安","谭咏麟","费翔","周华健","杜丽莎",
  "李玖哲","莫文蔚","郑中基","王杰","苏打绿","李玟","梁咏琪","许茹芸","张韶涵","邓丽君",
  "Taylor Swift","Ed Sheeran","Adele","Beyoncé","Coldplay","Drake","Rihanna","Bruno Mars","Katy Perry","Lady Gaga"
]

export default function App(){
  const [songs, setSongs] = useState([])
  const [artistsFound, setArtistsFound] = useState([])
  const [playlist, setPlaylist] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [notice, setNotice] = useState('')
  const [homeArtists, setHomeArtists] = useState([])
  const [page, setPage] = useState(1)
  const [mode, setMode] = useState('both')
  const [modalOpen, setModalOpen] = useState(false)
  const touchStartX = useRef(null)
  const touchStartY = useRef(null)

  useEffect(()=>{
    const saved = localStorage.getItem('musiclist_v5_1_playlist')
    if(saved){ try{ setPlaylist(JSON.parse(saved)) }catch{} }
    const shuffled = [...famous].sort(()=>0.5 - Math.random()).slice(0,50)
    setHomeArtists(shuffled)
    const params = new URLSearchParams(window.location.search)
    const listParam = params.get('list')
    if(listParam){
      const ids = listParam.split(',').filter(Boolean)
      if(ids.length) fetchSongsByIds(ids)
    }
  },[])

  useEffect(()=>{ localStorage.setItem('musiclist_v5_1_playlist', JSON.stringify(playlist)) },[playlist])

  async function fetchSongsByIds(ids){
    setLoading(true)
    const out = []
    for(const id of ids){
      try{ const res = await fetch('https://itunes.apple.com/lookup?id='+id); const j = await res.json(); if(j.results && j.results.length) out.push(j.results[0]) }catch(e){}
    }
    setPlaylist(out)
    setLoading(false)
  }

  async function doSearch(term){
    if(!term) return
    setLoading(true)
    setNotice('')
    setSongs([])
    setArtistsFound([])
    const limit = 50
    const maxPages = 4
    let all = []
    if(mode === 'artist'){
      try{
        const resA = await fetch('https://itunes.apple.com/search?term='+encodeURIComponent(term)+'&entity=musicArtist&limit=50')
        const ja = await resA.json()
        if(ja.results && ja.results.length){
          setArtistsFound(ja.results)
          for(const a of ja.results.slice(0,8)){
            try{ const r2 = await fetch('https://itunes.apple.com/search?term='+encodeURIComponent(a.artistName)+'&entity=song&limit=5'); const j2 = await r2.json(); if(j2.results && j2.results.length) all = all.concat(j2.results) }catch(e){}
          }
        } else {
          setNotice('未找到歌手。')
        }
      }catch(e){ setNotice('歌手搜索出错。') }
    } else {
      for(let i=0;i<maxPages;i++){
        try{ const offset = i*limit; const res = await fetch('https://itunes.apple.com/search?term='+encodeURIComponent(term)+'&entity=song&limit='+limit+'&offset='+offset); const j = await res.json(); if(j.results && j.results.length){ all = all.concat(j.results); if(j.results.length < limit) break } else break }catch(e){ break }
      }
      if(mode === 'both'){
        try{
          const resA = await fetch('https://itunes.apple.com/search?term='+encodeURIComponent(term)+'&entity=musicArtist&limit=8')
          const ja = await resA.json()
          if(ja.results && ja.results.length){
            for(const a of ja.results.slice(0,6)){
              try{ const r2 = await fetch('https://itunes.apple.com/search?term='+encodeURIComponent(a.artistName)+'&entity=song&limit=4'); const j2 = await r2.json(); if(j2.results && j2.results.length) all = all.concat(j2.results) }catch(e){}
            }
          }
        }catch(e){}
      }
    }
    if(all.length > 200){ all = all.slice(0,200); setNotice('结果超过 200 首，只显示前 200 首。') }
    if(all.length === 0 && artistsFound.length===0) setNotice('未找到相关歌曲或歌手。')
    setSongs(all)
    setLoading(false)
    setPage(1)
  }

  function refreshHome(){
    setSongs([])
    setSearchTerm('')
    setNotice('')
    setArtistsFound([])
    const shuffled = [...famous].sort(()=>0.5 - Math.random()).slice(0,50)
    setHomeArtists(shuffled)
  }

  function addToPlaylist(track){
    if(playlist.find(p=>p.trackId===track.trackId)){ alert('这首歌已在你的歌单中！'); return }
    setPlaylist(p=>[...p, track])
  }

  function removeFromPlaylist(trackId){
    setPlaylist(p=>p.filter(x=>x.trackId!==trackId))
  }

  function move(index, dir){
    setPlaylist(p=>{
      const copy = [...p]
      const to = index+dir
      if(to<0||to>=copy.length) return copy
      const [it] = copy.splice(index,1)
      copy.splice(to,0,it)
      return copy
    })
  }

  function onTouchStart(e){
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  function onTouchEnd(e, item){
    if(touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    const absX = Math.abs(dx)
    const absY = Math.abs(dy)
    if(absX > 60 && absX > absY){
      if(dx < 0){ if(confirm('从歌单中删除这首歌？')) removeFromPlaylist(item.trackId) } else { if(playlist.length){ const ids = playlist.map(s=>s.trackId).join(','); const url = window.location.origin+window.location.pathname+'?list='+ids; navigator.clipboard.writeText(url).then(()=>alert('分享链接已复制')) } }
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <div className="wrap">
      <header className="topbar">
        <div className="logoWrap"><div className="logoCircle">🎵</div><div className="title">蓝白 · 你的专属歌单中心</div></div>
      </header>

  <div className="content">
    <main className="left">
      <SearchBar term={searchTerm} setTerm={setSearchTerm} onSearch={doSearch} onRefresh={refreshHome} loading={loading} mode={mode} setMode={setMode} />
      {artistsFound && artistsFound.length>0 && <ArtistResults artists={artistsFound} onPick={(a)=>{ setSearchTerm(a); doSearch(a); }} />}
      {homeArtists && homeArtists.length>0 && songs.length===0 && artistsFound.length===0 && (
        <div className="artistGrid">
          {homeArtists.map((a,idx)=>(
            <button key={idx} className="artistBtn" onClick={()=>{ setSearchTerm(a); doSearch(a); }}>{a}</button>
          ))}
        </div>
      )}
      <div className="results">
        {notice && <div className="notice">{notice}</div>}
        <SongList songs={songs} onAdd={addToPlaylist} />
      </div>
    </main>

    <aside className="right">
      <div className="playlistHeader">
        <h3>🎵 我的歌单</h3>
        <div className="topActions">
          <button onClick={()=>{ if(!playlist.length){ alert('歌单为空'); return } const ids = playlist.map(s=>s.trackId).join(','); const url = window.location.origin+window.location.pathname+'?list='+ids; navigator.clipboard.writeText(url).then(()=>alert('分享链接已复制')) }}>🔗 分享</button>
          <button onClick={()=>{ if(confirm('确认清空歌单？')){ setPlaylist([]); localStorage.removeItem('musiclist_v5_1_playlist') } }}>清空</button>
        </div>
      </div>
      <div className="count">共 {playlist.length} 首</div>
      <div className="playlistList">
        {playlist.slice(0,10).map((p,i)=>(
          <div className="plItem" key={p.trackId} onTouchStart={onTouchStart} onTouchEnd={(e)=>onTouchEnd(e,p)}>
            <div className="plLeft">
              <div className="idx">{i+1}.</div>
              <img src={p.artworkUrl100} alt="" />
              <div className="plInfo">
                <div className="t">{p.trackName}</div>
                <div className="a">{p.artistName}</div>
              </div>
            </div>
            <div className="plBtns">
              <button onClick={()=>move(i,-1)}>↑</button>
              <button onClick={()=>move(i,1)}>↓</button>
              <button onClick={()=>removeFromPlaylist(p.trackId)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  </div>

  <BottomBar count={playlist.length} onOpenPlaylist={()=>setModalOpen(true)} onTop={()=>window.scrollTo({top:0,behavior:'smooth'})} onRefresh={refreshHome} />
  <PlaylistModal open={modalOpen} onClose={()=>setModalOpen(false)} playlist={playlist} onRemove={removeFromPlaylist} onMove={move} page={page} setPage={setPage} />
</div>
  )
}
