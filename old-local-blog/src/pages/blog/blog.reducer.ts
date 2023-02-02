import { createAction, createReducer, current, nanoid } from '@reduxjs/toolkit'
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

export const addPost = createAction('blog/addPost', function (post: Omit<Post, 'id'>) {
  return {
    payload: {
      ...post,
      id: nanoid()
    }
  }
})
export const deletePost = createAction<string>('blog/deletePost')
export const startEditingPost = createAction<string>('blog/startEditingPost')
export const cancelEditingPost = createAction('blog/cancelEditingPost')
export const finishEditingPost = createAction<Post>('blog/finishEditingPost')

const blogReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      state.postList.push(action.payload)
    })
    .addCase(deletePost, (state, action) => {
      const postIndex = state.postList.findIndex((post) => post.id === action.payload)
      if (postIndex !== -1) {
        state.postList.splice(postIndex, 1)
      }
      if (state.editingPost) {
        state.editingPost = null
      }
    })
    .addCase(startEditingPost, (state, action) => {
      const post = state.postList.find((post) => post.id === action.payload)
      state.editingPost = post || null
    })
    .addCase(cancelEditingPost, (state) => {
      state.editingPost = null
    })
    .addCase(finishEditingPost, (state, action) => {
      state.postList.some((post, index) => {
        if (post.id === action.payload.id) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
      state.editingPost = null
    })
    .addMatcher(
      (action) => action.type.includes('cancel'),
      (state, action) => {
        console.log(current(state))
        console.log(action)
      }
    )
})

export default blogReducer
