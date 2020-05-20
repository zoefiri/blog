import React, { useState, useEffect } from 'react';
import './App.css';
const fetch = require('node-fetch');
const ReactMarkdown = require('react-markdown');

function postMenuToggle(menuVis, setMenuVis){
   setMenuVis(menuVis === 'hidden' ? 'shown' : 'hidden');
}

function setResults(query, setSearchResults){
   return(new Promise((resolve, reject) => { 
      if(query === ""){
         fetch("http://localhost:3001/postqt/10")
            .then(res => res.json())
            .then(posts => {
               if(posts === []){
                  setSearchResults(posts)
                  reject(posts);
               }
               else{
                  setSearchResults(posts)
                  resolve(posts);
               }
            });
      }
      else{
         query = query.replace(' ', '_');
         fetch("http://localhost:3001/postq/"+query)
            .then(res => res.json())
            .then(posts => {
               if(posts === []){
                  setSearchResults(posts)
                  reject(posts);
               }
               else{
                  setSearchResults(posts)
                  resolve(posts);
               }
            });
      }
   }));
}

function SearchResults( { searchResults, setCurrentPost } ){
   return(
      <div>
         {searchResults.map((result) => {
            return(<div class="postResult" onClick={e => setCurrentPost(result.item)}>
               <div class="postResultTitle">{result.item.title}</div>
               <div class="postResultPrev">{result.item.content.slice(0,80)}</div>
            </div>)
         })}
      </div>
   );
}

function PostSearch( { setCurrentPost } ){
   const [searchText, setSearchText] = useState('');
   const [searchResults, setSearchResults] = useState([]);
   useEffect(() => setResults("", setSearchResults), []);

   return(
      <div>
         <div id="searchBox" class="panel">
            <input type="text" id="searchBoxText" value={searchText.toString()} onChange={e => {
               setSearchText(e.target.value)
               setResults(e.target.value, setSearchResults)
            }}>
            </input>
            <img src="/navicons/search.png" alt="search icon" id="search-indicator"/>
         </div>
         <SearchResults searchResults={searchResults} setCurrentPost={setCurrentPost}/>
      </div>
   );
}

function PostMenu( { menuVis, setMenuVis, setCurrentPost } ){
   return(
      <div id="postmenu" class={menuVis}>
         <div id="postTitle">Posts<div id="postExit" onClick={e => postMenuToggle(menuVis, setMenuVis)}>X</div></div>
         <PostSearch setCurrentPost={setCurrentPost}/>
      </div>
   );
}

function Navbar( { setCurrentPost } ) {
   const [menuVis, setMenuVis] = useState('hidden');

   return(
      <div id="navcontainer">
         <a href="https://github.com/zoefiri"><img src="/navicons/github.png" alt="github" class="navimg"/></a><br/>
         <img src="/navicons/search.png" alt="search icon" class="navimg" onClick={e => postMenuToggle(menuVis, setMenuVis)}/>
         <PostMenu menuVis={menuVis} setMenuVis={setMenuVis} setCurrentPost={setCurrentPost}/><br/>
         <a onClick={ e => {
            fetch("http://localhost:3001/posts/about")
               .then(res => res.json())
               .then(post => {
                  setCurrentPost(post);
               })}}><img src="/pfp.png"  alt="my setup" class="navimg" id="nav-profile"/></a><br/>
      </div>
   );
}

function App() {
   const [currentPost, setCurrentPost] = useState(0);
   useEffect(()=> {
      fetch("http://localhost:3001/postqt/1")
         .then(res => res.json())
         .then(post => {
            setCurrentPost(post[0].item);
         });
   }, []);

   return (
      <div className="App">
         <div id="bkg"></div>
         <div id="wrapper">
            <div id="pseudoSidebar"></div>
            <div id="sidebar">
               <div id="title" className="panel"> ZOEFIRI
                  <img src="/pfp.png" id="pfp" alt="pfp"/>
               </div>
               <div id="nav" className="panel"><Navbar setCurrentPost={setCurrentPost}/></div>
               <div id="animbox" className="panel">
                  <video id="shadervid" src="shadervids/shader.webm" autoplay="true" loop="true" muted="true"/> 
               </div>
            </div>
            <div id="post">
               <div id="postTitle" className="panel">
                  <div id="postTitleName">{currentPost["title"]}</div>
                  <div id="postTitleDate">{currentPost["date"]}</div>
               </div>
               <div id="postContent" className="panel"><ReactMarkdown source={currentPost["content"]} /></div>
            </div>
         </div>
      </div>
   );
}

export default App;
