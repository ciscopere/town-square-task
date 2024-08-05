import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useApolloClient } from '@apollo/client';
import { GET_POSTS, REORDER_POST } from '../queries';
import { CircularProgress, Typography, List, ListItem, ListItemText, Box, ListItemIcon } from '@mui/material';
import {
    DragDropContext,
    Draggable, DraggableStateSnapshot,
    Droppable,
    DropResult
} from '@hello-pangea/dnd';
import { GetPostsData, ReorderPostVariables, Post } from '../types';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

const PostList: React.FC = () => {
    const { data, loading, error } = useQuery<GetPostsData>(GET_POSTS);
    const [reorderPost] = useMutation<void, ReorderPostVariables>(REORDER_POST);
    const client = useApolloClient(); // Access the Apollo Client instance
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        if (data?.posts) {
            setPosts(data.posts);
        }
    }, [data]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        const newPosts = Array.from(posts);
        const [removed] = newPosts.splice(source.index, 1);
        newPosts.splice(destination.index, 0, removed);

        setPosts(newPosts);

        const prevPost = newPosts[destination.index - 1] || null;
        const nextPost = newPosts[destination.index + 1] || null;

        try {
            await reorderPost({
                variables: {
                    id: removed.id,
                    prevId: prevPost ? prevPost.id : null,
                    nextId: nextPost ? nextPost.id : null,
                }
            });

            // Update local cache
            updateCache(newPosts);
        } catch (error) {
            console.error("Error reordering post", error);
        }
    };

    const updateCache = (newPosts: Post[]) => {
        // Update the Apollo cache directly
        const existingPosts = client.readQuery<GetPostsData>({ query: GET_POSTS });
        if (existingPosts) {
            client.writeQuery({
                query: GET_POSTS,
                data: { posts: newPosts }
            });
        }
    };

    return (
        <Box>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="posts">
                    {(provided) => (
                        <List {...provided.droppableProps} ref={provided.innerRef}>
                            {posts.map((post: Post, index: number) => (
                                <Draggable key={post.id.toString()} draggableId={post.id.toString()} index={index}>
                                    {(provided, snapshot: DraggableStateSnapshot) => (
                                        <Box
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`draggable-item ${snapshot.isDragging ? 'dragging' : ''}`}
                                        >
                                            <ListItem>
                                                <ListItemIcon>
                                                    <DragIndicatorIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={post.title} secondary={`ID: ${post.id}`}/>
                                            </ListItem>
                                        </Box>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </List>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    );
};

export default PostList;
