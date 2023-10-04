import './ActivityComments.css';
import React, {useContext, useEffect, useState} from "react";
import {format} from 'date-fns';
import {Context} from "../../App";


function ActivityComments({currentActivityID}) {
    const [activityComments, setActivityComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editedMessage, setEditedMessage] = useState("");

    const isUserLogged = useContext(Context).isUserLogged;
    const userData = useContext(Context).userData;
    const loggedUserId = localStorage.getItem("userId");


    const currentDate = new Date();
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    const formattedTime = currentDate.toLocaleTimeString();


    const fetchActivityComments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/comments/${currentActivityID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const comments = await response.json();
            const sortedComments = comments.sort(chronologicalSort)
            setActivityComments(sortedComments);
        } catch (error) {
            console.error('Error fetching activity data:', error);
        }
    };

    function chronologicalSort(a, b) {
        const aDateTime = new Date(`${a.date} ${a.time}`);
        const bDateTime = new Date(`${b.date} ${b.time}`);
        return aDateTime - bDateTime;
    }

    useEffect(() => {
        fetchActivityComments();
    }, []);


    const handleCommentSubmit = async () => {
        if (newComment.trim() === "") {
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/comments', {
                method: 'POST',
                headers: {
                    "Authorization": localStorage.getItem("jwt"),
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    activityId: currentActivityID,
                    user: {userId: loggedUserId},
                    message: newComment,
                    date: formattedDate,
                    time: formattedTime

                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            fetchActivityComments();
            setNewComment("");
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    };

    const handleDeleteComment = async (comment) => {
        try {
            const response = await fetch(`http://localhost:8080/comments/delete/${comment.commentId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": localStorage.getItem("jwt"),
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            fetchActivityComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment);
        setEditedMessage(comment.message);
    };

    const handleCancelEdit = () => {
        setEditingComment(null);
        setEditedMessage("");
    };

    const handleSaveEdit = async () => {
        try {
            const updatedComment = {
                ...editingComment,
                message: editedMessage
            };

            const response = await fetch(`http://localhost:8080/comments/update/${editingComment.commentId}`, {
                method: 'PATCH',
                headers: {
                    "Authorization": localStorage.getItem("jwt"),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: editedMessage})

            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            fetchActivityComments();
            setEditingComment(null);
            setEditedMessage("");
        } catch (error) {
            console.error('Error editing comment:', error);
        }
    };

    return (
        <div className="comments">
            {activityComments.map((comment) => (
                <div key={comment.commentId}>
                    <div
                        className={comment.user.userId === userData.userId ? "singleComment-right" : "singleComment-left"}
                    >
                        <div className="comment-username">{comment.user.username}</div>
                        {editingComment === comment ?
                            <>

                                <textarea
                                    className="editTextarea"
                                    value={editedMessage}
                                    onChange={(e) => setEditedMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSaveEdit();
                                        }
                                    }}
                                />

                                <div className="buttons">
                                    <span className="blueButton" onClick={handleSaveEdit}>Save </span>
                                    <span className="redButton" onClick={handleCancelEdit}>Cancel</span>
                                </div>
                            </>
                            :
                            <>
                                <div className="message">{comment.message}</div>
                                {comment.user.userId === loggedUserId && (
                                    <div className="buttons">
                                        <span className="blueButton"
                                              onClick={() => handleEditComment(comment)}>Edit </span>
                                        <span className="redButton"
                                              onClick={() => handleDeleteComment(comment)}>Delete</span>
                                    </div>
                                )}
                            </>
                        }
                    </div>
                    <div
                        className={comment.user.userId === userData.userId ? "datetime-right" : "datetime-left"}>{comment.date} {comment.time.substring(0, 5)}</div>
                </div>
            ))}

            {isUserLogged ? (
                <div className="addCommentSection">
                        <textarea
                            className="newCommentTextarea"
                            placeholder="Add a new comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleCommentSubmit();
                                }
                            }}
                            rows={3}
                        />
                    <button className="addButton" onClick={() => handleCommentSubmit()}>Add comment</button>
                </div>
            ) : <></>
            }
        </div>
    );
}

export default ActivityComments;
