
import { useState } from "react";


type User = {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
}

interface CommentType{
  id: number;
  text: string;
  replies: CommentType[];
  user: User
}

interface CommentProps{
  comment: CommentType,
  contentId: number,
  addComment: (data: { comment: string; parentId?: number }) => void
}

const Comment = ({comment, contentId, addComment} : CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [newComment, setNewComment] = useState('')




  return (
    <div className="flex flex-col gap-3">

      {/* Main Comment */}
      <div className="flex items-start gap-4">
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img src={comment.user.profile ?? '/default.jpg'} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-white font-semibold">{comment.user.firstname + " " + comment.user.lastname} </p>
          <p className="text-gray-300 text-sm">{comment.text}</p>

          <div className="flex gap-3 mt-1">
            <button
              className="text-xs text-gray-500"
              onClick={() => setShowInput(!showInput)}
            >
              REPLY
            </button>

            {comment.replies && comment.replies.length > 0 && (
              <button
                className="text-xs text-blue-400"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies ? "HIDE REPLIES" : "SHOW REPLIES"}
              </button>
            )}
          </div>

          {/* Reply Input */}
          {showInput && (
            <>
              <input
              className="bg-black border border-white text-white p-2 mt-2 rounded-sm"
              placeholder="Write a reply..."
              onChange={(e) => setNewComment(e.target.value)}
            />
             <button className="btn bg-black text-white" onClick={() => addComment({comment: newComment, parentId: comment.id})}>ADD</button>
            </>
          
          )}
        </div>
      </div>

      {/* Replies (Recursive Rendering) */}
      {showReplies && comment.replies.length > 0 && (
        <div className="ml-12 border-l border-gray-700 pl-4 flex flex-col gap-4">
          {comment.replies.map((reply) => (
            <Comment key={reply.id} comment={reply} contentId={contentId} addComment={addComment}/>
          ))}
        </div>
      )}

     

    </div>
  );
};

export default Comment