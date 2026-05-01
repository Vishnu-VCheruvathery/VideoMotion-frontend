
import { useEffect, useRef, useState } from "react";
import Comment from "./Comment";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";



type User = {
  id: number;
  firstname: string;
  lastname: string;
  profile: string
}

interface CommentType{
  id: number;
  text: string;
  replies: CommentType[];
  user: User
}


const CommentSection = ({id}: {id: number}) => {

    const auth = useSelector((state: RootState) => state.auth);

    const [showAdd, setShowAdd] = useState(false)
    const inputRef = useRef<HTMLDivElement | null>(null);
    const [comments, setComments] = useState<CommentType[]>([])
    const [newComment , setNewComment] = useState('')

    const getComments = async() => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_AP_URL}/videos/comment?id=${id}`)
        console.log('the comments: ', response.data)
        if(response.status == 200){
          setComments(response.data)
        }
      } catch (error) {
        console.log(error);
      }
    }

   const addComment = async ({ comment, parentId }: { comment: string; parentId?: number }) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_AP_URL}/videos/comment/create`,
      {
        text: comment,
        userId: auth.user?.id,
        contentId: id,
        parentId
      }
    );

    if (response.status === 200) {
      const newComment = response.data;

      setComments((prev) => {
        // ✅ case 1: top-level comment
        if (!parentId) {
          return [newComment, ...prev];
        }

        // ✅ case 2: reply → insert into correct parent
        const addReply = (comments: CommentType[]): CommentType[] => {
          return comments.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [newComment, ...(c.replies || [])]
              };
            }

            // 🔥 handle nested replies (important)
            if (c.replies && c.replies.length > 0) {
              return {
                ...c,
                replies: addReply(c.replies)
              };
            }

            return c;
          });
        };

        return addReply(prev);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

   useEffect(() => {
     getComments()
   }, [])

    const handleAddClick = () => {
        setShowAdd(!showAdd)

        setTimeout(() => {
            inputRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }, 100)
    }

  return (
    <div className="w-full flex flex-col items-center">

      <div className="w-4/5 p-5">
        <p className="text-2xl text-white">Comments:</p>
      </div>

      <div className="w-4/5 flex flex-col gap-6 p-5">
        {
        comments.length > 0 ? 
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} contentId ={id} addComment={addComment}/>
        )) : <p className="text-white text-2xl">No Comments</p>}
      </div>
     
      {showAdd ? <div 
      ref={inputRef}
      className="w-4/5 flex items-start gap-4">
          <div className="avatar">
          <div className="w-12 rounded-full">
            <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
          </div>
        </div>
         <div className="flex flex-col gap-1">
            <p className="text-white font-semibold">{auth.user?.firstname + " " + auth.user?.lastname}</p>
             <input
              className="bg-black border border-white text-white p-2 mt-2 rounded-sm"
              placeholder="Write a comment..."
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="btn bg-black text-white" onClick={() => addComment({comment :newComment})}>ADD</button>
         </div>

      </div>: null} 

      <div className="w-full flex justify-center items-center m-5"> 
        <button className="btn bg-black text-white" onClick={handleAddClick}>ADD COMMENT</button> 
        </div>

    </div>
  );
};

export default CommentSection