import React from 'react'
import Post from './Post'
const Feed = ({posts}) => {
  // if (!Array.isArray(posts)) {
  //   return <p>No posts available</p>; // Handle the case where posts is not an array
  // }
  return (
    <>
        {posts.map(post=>(
            <Post key={post.id} post={post} />

        ))}
    </>
  )
}

export default Feed