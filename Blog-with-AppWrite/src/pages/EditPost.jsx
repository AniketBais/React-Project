import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, PostForm} from '../components/index'
import appwriteService from '../appwrite/config'

function EditPost() {
    const [post, setPosts] =useState(null)
    const {id} = useParams()
    const navigate = useNavigate()
    useEffect(()=>{
        if(id){
            appwriteService.getPost(id)
            .then((post)=>{
                if(post){
                    setPosts(post)
                }
            })
            console.log(id)
        }else{
                navigate('/')
            }
    },[id, navigate])
  if (!post) return <div className='p-10'>Loading...</div> 
  return post? (
    <div className='py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
  ): null;
}

export default EditPost