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
function App() {

  const [posts,setPosts]=useState(
    [
          {
            id:1,
            title:"My first post",
            datetime:"July 01, 2021 11:17:36 AM",
            body:"Made a video for learn React"
    
          },
          {
            id:2,
            title:"My 2 post",
            datatime:"July 01, 2021 11:17:36 AM",
            body:"Made a video for learn Node"
    
          },
          {
            id:3,
            title:"My 3 post",
            datatime:"July 01, 2021 11:17:36 AM",
            body:"Made a video for learn Mongo"
    
          }
        ]
  );
  const [search,setSearch]=useState('');
  const [searchResult,setSearchResult]=useState([]);
  const [postTitle,setPostTitle]=useState('');
  const [postBody,setPostBody]=useState('');
  const navigate=useNavigate()
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
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    const allPosts = [...posts,newPost];
    setPosts(allPosts);
    setPostTitle('');
     setPostBody('');
    // try {
    //     const response = await api.post('/posts', newPost);
    //     const allPosts = [...posts, response.data];
    //     setPosts(allPosts);
    //     setPostTitle('');
    //     setPostBody('');
    //     history.push('/');
    // } catch (err) {
    //     console.log(`Error: ${err.message}`);
    // }
}
const handleDelete =(id) =>{
  const postsList=posts.filter(post =>post.id!==id);
  setPosts(postsList);
  navigate('/')
}
  return (
    <div className="App">  
      <Header title="solical Media"/>
      <Nav 
        search={search}
        setSearch={setSearch}
      />
      <Routes>
        <Route path="/" element={<Home posts={searchResult} />}></Route>
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

        <Route path="about" element={<About />}> </Route>
        <Route path="*" element={<Missing />}></Route>
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;
