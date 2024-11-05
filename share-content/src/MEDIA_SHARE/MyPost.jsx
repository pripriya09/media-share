import axios from 'axios';
import { useEffect, useState } from 'react';

const MyPostsComponent = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8006/myPosts');
        setPosts(response.data);
      } catch (err) {
        setError(err.response ? err.response.data : 'Error fetching posts');
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className='my-posts'>
      <h1>My Posts</h1>
      {error && <p>{error}</p>}
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            <img src={post.image} alt={post.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPostsComponent;

















// "http://192.168.0.38:8006/postOnFB" //"http://192.168.0.38:8006/postOnIG"