import React from 'react'

export default function SearchBar({ term, setTerm, onSearch, onRefresh, loading, mode, setMode }){
  return (
    <div className="searchBar">
      <input 
        type="text" 
        value={term} 
        onChange={(e)=>setTerm(e.target.value)} 
        placeholder="输入歌手或歌曲名称..." 
        onKeyDown={(e)=>{ if(e.key==='Enter') onSearch(term) }} 
      />
      <button onClick={()=>onSearch(term)} disabled={loading}>{loading?'搜索中...':'搜索'}</button>
      <button onClick={onRefresh}>🔄</button>
      <div className="modeSelect">
        <label>
          <input type="radio" checked={mode==='both'} onChange={()=>setMode('both')} />歌手+歌曲
        </label>
        <label>
          <input type="radio" checked={mode==='artist'} onChange={()=>setMode('artist')} />仅歌手
        </label>
        <label>
          <input type="radio" checked={mode==='song'} onChange={()=>setMode('song')} />仅歌曲
        </label>
      </div>
    </div>
  )
}
