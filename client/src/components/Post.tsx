import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_POSTS, REORDER_POST } from '../queries';
import { CircularProgress, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import {DragDropContext, Draggable, Droppable, DropResult} from '@hello-pangea/dnd';
import { GetPostsData, ReorderPostVariables, Post } from '../types';

const PostList: React.FC = () => {
    const { data, loading, error } = useQuery<GetPostsData>(GET_POSTS);
    const [reorderPost] = useMutation<void, ReorderPostVariables>(REORDER_POST);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        const posts = Array.from(data?.posts || []);
        const [removed] = posts.splice(source.index, 1);
        posts.splice(destination.index, 0, removed);

        const prevPost = posts[destination.index - 1] || null;
        const nextPost = posts[destination.index + 1] || null;

        await reorderPost({
            variables: {
                id: removed.id,
                prevId: prevPost ? prevPost.id : null,
                nextId: nextPost ? nextPost.id : null,
            },
            refetchQueries: [{ query: GET_POSTS }],
        });
    };

    return (
        <Box sx={{ width: '300px', margin: '0 auto' }}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="posts">
                    {(provided) => (
                        <List {...provided.droppableProps} ref={provided.innerRef}>
                            {data?.posts.map((post: Post, index: number) => (
                                <Draggable key={post.id.toString()} draggableId={post.id.toString()} index={index}>
                                    {(provided) => (
                                        <ListItem
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <ListItemText primary={post.title} />
                                        </ListItem>
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
