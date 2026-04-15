import {
  asyncPopulateUsersAndThreads,
  fetchThreads,
  createThread,
  upVoteThread,
  downVoteThread,
} from '../../redux/thunks/threadThunks';
import {
  setThreadList,
  addThread,
  toggleUpVote,
  toggleDownVote,
} from '../../redux/slices/threadSlice';
import { setUsers } from '../../redux/slices/userSlice';
import { setLoading } from '../../redux/slices/uiSlice';

jest.mock('../../api/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

import apiClient from '../../api/apiClient';

describe('threadThunks', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = jest.fn();
    getState = jest.fn();
    jest.clearAllMocks();
  });

  describe('asyncPopulateUsersAndThreads', () => {
    it('should fetch threads and users successfully', async () => {
      const mockThreadsResponse = {
        data: {
          data: {
            threads: [
              { id: '1', title: 'Thread 1' },
              { id: '2', title: 'Thread 2' },
            ],
          },
        },
      };
      const mockUsersResponse = {
        data: {
          data: {
            users: [
              { id: 'user-1', name: 'User 1' },
              { id: 'user-2', name: 'User 2' },
            ],
          },
        },
      };

      apiClient.get
        .mockResolvedValueOnce(mockThreadsResponse)
        .mockResolvedValueOnce(mockUsersResponse);

      const result = await asyncPopulateUsersAndThreads()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(setLoading({ status: true, text: 'Loading data...' }));
      expect(dispatch).toHaveBeenCalledWith(setThreadList([{ id: '1', title: 'Thread 1' }, { id: '2', title: 'Thread 2' }]));
      expect(dispatch).toHaveBeenCalledWith(setUsers([{ id: 'user-1', name: 'User 1' }, { id: 'user-2', name: 'User 2' }]));
      expect(dispatch).toHaveBeenCalledWith(setLoading({ status: false }));
      expect(result.type).toBe('shared/asyncPopulateUsersAndThreads/fulfilled');
      expect(result.payload).toEqual({
        threads: [{ id: '1', title: 'Thread 1' }, { id: '2', title: 'Thread 2' }],
        users: [{ id: 'user-1', name: 'User 1' }, { id: 'user-2', name: 'User 2' }],
      });
    });

    it('should reject with error on failed fetch', async () => {
      const error = {
        response: {
          data: {
            message: 'Network error',
          },
        },
      };
      apiClient.get.mockRejectedValue(error);

      const result = await asyncPopulateUsersAndThreads()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(setLoading({ status: false }));
      expect(result.type).toBe('shared/asyncPopulateUsersAndThreads/rejected');
      expect(result.payload).toBe('Network error');
    });
  });

  describe('fetchThreads', () => {
    it('should fetch threads successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            threads: [{ id: '1', title: 'Thread 1' }],
          },
        },
      };
      apiClient.get.mockResolvedValueOnce(mockResponse);

      const result = await fetchThreads()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(setLoading({ status: true, text: 'Loading threads...' }));
      expect(dispatch).toHaveBeenCalledWith(setThreadList([{ id: '1', title: 'Thread 1' }]));
      expect(dispatch).toHaveBeenCalledWith(setLoading({ status: false }));
      expect(result.type).toBe('threads/fetchThreads/fulfilled');
      expect(result.payload).toEqual([{ id: '1', title: 'Thread 1' }]);
    });
  });

  describe('createThread', () => {
    it('should create thread successfully', async () => {
      const mockResponse = {
        data: {
          data: {
            thread: { id: 'new-1', title: 'New Thread', body: 'Body', category: 'tech' },
          },
        },
      };
      apiClient.post.mockResolvedValueOnce(mockResponse);

      const result = await createThread({ title: 'New Thread', body: 'Body', category: 'tech' })(
        dispatch,
        getState
      );

      expect(apiClient.post).toHaveBeenCalledWith('/threads', {
        title: 'New Thread',
        body: 'Body',
        category: 'tech',
      });
      expect(dispatch).toHaveBeenCalledWith(addThread({ id: 'new-1', title: 'New Thread', body: 'Body', category: 'tech' }));
      expect(dispatch).toHaveBeenCalledWith(setLoading({ status: false }));
      expect(result.type).toBe('threads/createThread/fulfilled');
      expect(result.payload).toEqual({ id: 'new-1', title: 'New Thread', body: 'Body', category: 'tech' });
    });

    it('should use default category when not provided', async () => {
      const mockResponse = {
        data: {
          data: {
            thread: { id: 'new-1', title: 'New Thread', body: 'Body', category: '' },
          },
        },
      };
      apiClient.post.mockResolvedValueOnce(mockResponse);

      await createThread({ title: 'New Thread', body: 'Body' })(dispatch, getState);

      expect(apiClient.post).toHaveBeenCalledWith('/threads', {
        title: 'New Thread',
        body: 'Body',
        category: '',
      });
    });
  });

  describe('upVoteThread', () => {
    it('should upvote successfully and call API', async () => {
      getState.mockReturnValue({
        auth: { user: { id: 'user-1' } },
        threads: { list: [], detailMap: {} },
      });
      apiClient.post.mockResolvedValueOnce({});

      const result = await upVoteThread('thread-1')(dispatch, getState, (val) => ({ type: 'rejected', payload: val }));

      expect(dispatch).toHaveBeenCalledWith(toggleUpVote({ threadId: 'thread-1', userId: 'user-1' }));
      expect(apiClient.post).toHaveBeenCalledWith('/threads/thread-1/up-vote');
      expect(result.type).toBe('threads/upVoteThread/fulfilled');
    });

    it('should rollback on API failure', async () => {
      getState.mockReturnValue({
        auth: { user: { id: 'user-1' } },
        threads: { list: [], detailMap: {} },
      });
      const error = { response: { data: { message: 'Failed' } } };
      apiClient.post.mockRejectedValueOnce(error);

      await upVoteThread('thread-1')(dispatch, getState, (val) => ({ type: 'rejected', payload: val }));

      expect(dispatch).toHaveBeenCalledWith(toggleUpVote({ threadId: 'thread-1', userId: 'user-1' }));
    });
  });

  describe('downVoteThread', () => {
    it('should downvote successfully and call API', async () => {
      getState.mockReturnValue({
        auth: { user: { id: 'user-1' } },
        threads: { list: [], detailMap: {} },
      });
      apiClient.post.mockResolvedValueOnce({});

      const result = await downVoteThread('thread-1')(dispatch, getState, (val) => ({ type: 'rejected', payload: val }));

      expect(dispatch).toHaveBeenCalledWith(toggleDownVote({ threadId: 'thread-1', userId: 'user-1' }));
      expect(apiClient.post).toHaveBeenCalledWith('/threads/thread-1/down-vote');
      expect(result.type).toBe('threads/downVoteThread/fulfilled');
    });

    it('should rollback on API failure', async () => {
      getState.mockReturnValue({
        auth: { user: { id: 'user-1' } },
        threads: { list: [], detailMap: {} },
      });
      const error = { response: { data: { message: 'Failed' } } };
      apiClient.post.mockRejectedValueOnce(error);

      await downVoteThread('thread-1')(dispatch, getState, (val) => ({ type: 'rejected', payload: val }));

      expect(dispatch).toHaveBeenCalledWith(toggleDownVote({ threadId: 'thread-1', userId: 'user-1' }));
    });
  });
});