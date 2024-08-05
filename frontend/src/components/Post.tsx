import { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { GET_POSTS, REORDER_POST, POST_REORDERED_SUBSCRIPTION } from '../queries';
import { CircularProgress, Typography, List, ListItem, ListItemText, Box, ListItemIcon } from '@mui/material';
import { DragDropContext, Draggable, DraggableStateSnapshot, Droppable, DropResult } from '@hello-pangea/dnd';
import { GetPostsData, ReorderPostVariables, Post } from '../types';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import InfiniteScroll from 'react-infinite-scroll-component';

const PostList: React.FC = () => {
    const { data: postData, loading, error, fetchMore } = useQuery<GetPostsData>(GET_POSTS,
    { variables: { offset: 0, limit: 20 },
        notifyOnNetworkStatusChange: true,
    });
    const { data: subscriptionData } = useSubscription(POST_REORDERED_SUBSCRIPTION);
    const [reorderPost] = useMutation<void, ReorderPostVariables>(REORDER_POST);
    const [posts, setPosts] = useState<Post[]>([]);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (postData?.posts) {
            setPosts(postData.posts);
        }
    }, [postData]);

    useEffect(() => {
        if (subscriptionData?.postReordered) {
            const { id, index } = subscriptionData.postReordered;

            setPosts((prevPosts) => {
                // Find the post to reorder
                const sourceIndex = prevPosts.findIndex(post => post.id === id);

                if (sourceIndex === -1) return prevPosts; // Post not found, return unchanged

                const newPosts = Array.from(prevPosts);
                const [removed] = newPosts.splice(sourceIndex, 1);
                newPosts.splice(index, 0, removed);

                return newPosts;
            });
        }
    }, [subscriptionData]);

    const fetchMorePosts = async () => {
        if (!hasMore) return;

        try {
            const { data: moreData } = await fetchMore({
                variables: {
                    offset: posts.length,
                    limit: 20,
                },
            });

            if (moreData?.posts?.length === 0) {
                setHasMore(false);
            }

            const updatedPosts = [...posts, ...moreData.posts];

            setPosts(updatedPosts);
        } catch (error) {
            console.error("Error fetching more posts", error);
        }
    };

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
                    index: destination.index,
                },
            });

            // TODO: This shouldn't be necessary.
            setPosts(newPosts);
        } catch (error) {
            console.error("Error reordering post", error);
        }
    };

    if (loading && !posts.length) return <CircularProgress />;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={fetchMorePosts}
            hasMore={hasMore}
            loader={<CircularProgress />}
            style={{ overflow: 'hidden' }}
        >
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
                                                <ListItemText primary={post.title} secondary={`ID: ${post.id}`} />
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
        </InfiniteScroll>
    );
};

export default PostList;
