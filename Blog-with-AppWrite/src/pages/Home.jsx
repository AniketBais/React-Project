import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import { Container, PostCard} from '../components/index'
import { useSelector } from "react-redux";   // ⭐ ADDED

function Home() {
    const [posts, setPosts] = useState([])
    const userData = useSelector(state => state.auth.userData); // ⭐ ADDED

    // ⭐ LOAD ONLY USER POSTS
    useEffect(() => {
        if (!userData) return;

        appwriteService.getPosts(userData.$id).then((posts) => {
            if (posts) {
                setPosts(posts.documents);
            }
        });

    }, [userData]);

    if (posts.length === 0) {
        return (
            <div className="w-full h-[40vh] py-8 mt-4 text-center">
                <Container>
                    <h1 className="text-2xl font-bold">
                        You have no posts yet
                    </h1>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home