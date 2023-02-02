import { createSlice, current, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { initialPostList } from 'constants/blog'
import { Post } from 'types/post.type'

interface BlogState {
  postList: Post[]
  editingPost: Post | null
}

const initialState: BlogState = {
  postList: initialPostList,
  editingPost: null
}

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    addPost: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.postList.push(action.payload)
      },
      prepare: (post: Omit<Post, 'id'>) => ({
        payload: {
          ...post,
          id: nanoid()
        }
      })
    },
    deletePost: (state, action: PayloadAction<string>) => {
      const postIndex = state.postList.findIndex((post) => post.id === action.payload)
      if (postIndex !== -1) {
        state.postList.splice(postIndex, 1)
      }
      if (state.editingPost) {
        state.editingPost = null
      }
    },
    startEditingPost: (state, action: PayloadAction<string>) => {
      const post = state.postList.find((post) => post.id === action.payload)
      state.editingPost = post || null
    },
    cancelEditingPost: (state) => {
      state.editingPost = null
    },
    finishEditingPost: (state, action: PayloadAction<Post>) => {
      state.postList.some((post, index) => {
        if (post.id === action.payload.id) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
      state.editingPost = null
    }
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        (action) => action.type.includes('cancel'),
        (state, action) => {
          console.log(current(state))
          console.log(action)
        }
      )
      .addDefaultCase((state, action) => {
        console.log(current(state))
        console.log(action)
      })
  }
})

export const { addPost, deletePost, startEditingPost, cancelEditingPost, finishEditingPost } = blogSlice.actions

const blogReducer = blogSlice.reducer
export default blogReducer
