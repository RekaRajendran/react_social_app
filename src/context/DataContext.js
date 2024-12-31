import { createContext,useState,useEffect } from "react";
import Post from "../Post";
import { Routes,Route ,Link, useSubmit, useNavigate  } from "react-router-dom";
import PostLayout from "../PostLayout";

import {format} from "date-fns"
import api from "../api/posts"
import EditPost from "../EditPost"
import useWindowSize from "../hooks/useWindowSize";
import useAxiosFetch  from "../hooks/useAxiosFetch";

const DataContext = createContext({});
export const DataProvider =({children})=>{
    const [posts,setPosts]=useState([]);
    const [search,setSearch]=useState('');
    const [searchResult,setSearchResult]=useState([]);
    const [postTitle,setPostTitle]=useState('');
    const [postBody,setPostBody]=useState('');
    const [editTitle,setEditTitle]=useState('');
    const [editBody,setEditBody]=useState('');
    const navigate=useNavigate()
    const {width}=useWindowSize();
    const{data,fetchError,isLoading}=useAxiosFetch("http://localhost:3500/posts");
  
    useEffect(()=>{
      setPosts(data);
    },[data])
   
  
    useEffect(() => {
      console.log(posts);
      console.log('First');
      const filteredResults = posts.filter((post) => 
          (post.body?.toLowerCase().includes(search.toLowerCase())) || 
          (post.title?.toLowerCase().includes(search.toLowerCase()))
      );
      
      console.log(filteredResults);
      setSearchResult(filteredResults.reverse())
  }, [posts, search]);
    // useEffect(()=>{
    //   const filteredResults=posts.filter((post)=>((post.boby).toLowerCase()).includes(search) 
    //   ||((post.title).toLowerCase()).includes(search)
    //   // const filteredResults=posts.filter((post)=>((post.boby).toLowerCase()).includes(search.toLowerCase()) 
    //   // ||((post.title).toLowerCase()).includes(search.toLowerCase()) )
    //  )
    // },[posts,search])
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("inside a handle submit --posts");
      console.log(posts);
      const id =(posts.length ? Number(posts[posts.length - 1].id) + 1 : 1).toString();
      const datetime = format(new Date(), 'MMMM dd, yyyy pp');
      const newPost = { id, title: postTitle, datetime, body: postBody };
      // const allPosts = [...posts,newPost];
      // setPosts(allPosts);
      // setPostTitle('');
      //  setPostBody('');
      try {
          const response = await api.post('/posts', newPost);
          const allPosts = [...posts, response.data];
          setPosts(allPosts);
          setPostTitle('');
          setPostBody('');
          navigate('/');
      } catch(err){
        if(err.response){
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.header);
        }else{
          console.log(`Error : ${err.message}`);
        }
      }
  }
  const handleEdit =async (id)=>{
      const datetime = format(new Date(), 'MMMM dd, yyyy pp');
      const updatedPost = { id, title: editTitle, datetime, body: editBody };
      
      try{
        const response =await api.put(`/posts/${id}`,updatedPost)
        setPosts(posts.map(post=>
          post.id===id?{...response.data}:post
        ));
        setEditTitle('');
        setEditBody('');
        navigate('/');
      }catch (err) {
        console.log(`Edit Error : ${err.message}`);
      }
  }
  const handleDelete = async (id) =>{
    try{
      await api.delete(`posts/${id}`);
      const postsList=posts.filter(post =>post.id!==id);
      setPosts(postsList);
      navigate('/')
    }catch(err){
      if(err.response){
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.header);
      }else{
        console.log(`Error : ${err.message}`);
      }
    }
    
  }
    return(
        <DataContext.Provider value={{
            width,search,setSearch,searchResult,fetchError,isLoading,
            handleSubmit,postTitle,setPostTitle,postBody,setPostBody,
            posts,handleEdit,editBody,setEditBody,editTitle,setEditTitle,
            handleDelete
        }}>
            {children}
        </DataContext.Provider>
    )
}
export default DataContext;