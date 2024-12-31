import About from "./About";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Missing from "./Missing";
import Nav from "./Nav";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import Post from "./Post";
import { Routes,Route ,Link, useSubmit, useNavigate  } from "react-router-dom";
import PostLayout from "./PostLayout";
import {useState,useEffect} from 'react'
import {format} from "date-fns"
import api from "./api/posts"
import EditPost from "./EditPost"
import useWindowSize from "./hooks/useWindowSize";
import useAxiosFetch  from "./hooks/useAxiosFetch";
function App() {

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
  return (
    <div className="App">  
   
      <Header title="solical Media" width={width}/>
      <Nav 
        search={search}
        setSearch={setSearch}
      />
      <Routes>
        <Route path="/" element={
          <Home 
            posts={searchResult} 
            fetchError={fetchError}
            isLoading={isLoading}
          />}>
        </Route>
        <Route path="post" >
            <Route index element={<NewPost 
            handleSubmit={handleSubmit}
            postTitle={postTitle}
            setPostTitle={setPostTitle}
            postBody={postBody}
            setPostBody={setPostBody}
          />}></Route>
         
          <Route path=":id" element={<PostPage posts={posts} handleDelete={handleDelete}/>}></Route>
        </Route>
        <Route  path="/edit/:id" element={<EditPost 
           posts={posts}
            handleEdit={handleEdit}
            editBody={editBody}
            setEditBody={setEditBody}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
          
          />}></Route>     
        <Route path="about" element={<About />}> </Route>
        <Route path="*" element={<Missing />}></Route>
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;
