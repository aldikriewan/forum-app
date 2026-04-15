import threadReducer, {
  setLoading,
  setError,
  setThreadList,
  setThreadDetail,
  addThread,
  setFilterCategory,
  updateThreadVote,
  toggleUpVote,
  toggleDownVote,
  toggleNeutralVote,
  toggleCommentUpVote,
  toggleCommentDownVote,
  toggleCommentNeutralVote,
} from '../../redux/slices/threadSlice';

describe('threadSlice reducer', () => {
  const initialState = {
    list: [],
    detailMap: {},
    loading: false,
    error: null,
    selectedThreadId: null,
    filterCategory: null,
  };

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const newState = threadReducer(initialState, setLoading(true));
      expect(newState.loading).toBe(true);
    });

    it('should set loading to false', () => {
      const stateWithLoading = { ...initialState, loading: true };
      const newState = threadReducer(stateWithLoading, setLoading(false));
      expect(newState.loading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const newState = threadReducer(initialState, setError('Failed to load'));
      expect(newState.error).toBe('Failed to load');
    });
  });

  describe('setThreadList', () => {
    it('should set thread list and clear loading/error', () => {
      const threads = [
        { id: '1', title: 'Thread 1', body: 'Body 1' },
        { id: '2', title: 'Thread 2', body: 'Body 2' },
      ];
      const newState = threadReducer(initialState, setThreadList(threads));

      expect(newState.list).toEqual(threads);
      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
    });
  });

  describe('setThreadDetail', () => {
    it('should set thread detail in detailMap', () => {
      const threadDetail = {
        id: '1',
        title: 'Thread 1',
        body: 'Body 1',
        owner: { id: 'user-1', name: 'Owner' },
        comments: [],
      };
      const newState = threadReducer(initialState, setThreadDetail(threadDetail));

      expect(newState.detailMap['1']).toEqual(threadDetail);
      expect(newState.selectedThreadId).toBe('1');
    });

    it('should update owner in list if thread exists', () => {
      const stateWithList = {
        ...initialState,
        list: [
          { id: '1', title: 'Thread 1', owner: null },
          { id: '2', title: 'Thread 2' },
        ],
      };
      const threadDetail = {
        id: '1',
        title: 'Thread 1',
        owner: { id: 'user-1', name: 'Owner' },
      };
      const newState = threadReducer(stateWithList, setThreadDetail(threadDetail));

      expect(newState.list[0].owner).toEqual({ id: 'user-1', name: 'Owner' });
    });
  });

  describe('addThread', () => {
    it('should add thread to the beginning of the list', () => {
      const existingThread = { id: '1', title: 'Existing' };
      const stateWithList = { ...initialState, list: [existingThread] };
      const newThread = { id: '2', title: 'New Thread' };

      const newState = threadReducer(stateWithList, addThread(newThread));

      expect(newState.list[0]).toEqual(newThread);
      expect(newState.list[1]).toEqual(existingThread);
    });
  });

  describe('setFilterCategory', () => {
    it('should set filter category', () => {
      const newState = threadReducer(initialState, setFilterCategory('tech'));
      expect(newState.filterCategory).toBe('tech');
    });

    it('should clear filter when set to null', () => {
      const stateWithFilter = { ...initialState, filterCategory: 'tech' };
      const newState = threadReducer(stateWithFilter, setFilterCategory(null));
      expect(newState.filterCategory).toBeNull();
    });
  });

  describe('updateThreadVote', () => {
    it('should update vote counts in list', () => {
      const stateWithList = {
        ...initialState,
        list: [
          { id: '1', title: 'Thread', upVotesBy: [], downVotesBy: [] },
        ],
      };
      const newState = threadReducer(
        stateWithList,
        updateThreadVote({ threadId: '1', upVotesBy: ['user-1'], downVotesBy: ['user-2'] })
      );

      expect(newState.list[0].upVotesBy).toEqual(['user-1']);
      expect(newState.list[0].downVotesBy).toEqual(['user-2']);
    });

    it('should update vote in detailMap', () => {
      const stateWithDetail = {
        ...initialState,
        detailMap: {
          '1': { id: '1', title: 'Thread', upVotesBy: [], downVotesBy: [] },
        },
      };
      const newState = threadReducer(
        stateWithDetail,
        updateThreadVote({ threadId: '1', upVotesBy: ['user-1'], downVotesBy: [] })
      );

      expect(newState.detailMap['1'].upVotesBy).toEqual(['user-1']);
    });
  });

  describe('toggleUpVote', () => {
    it('should add user to upVotesBy when not present', () => {
      const stateWithThread = {
        ...initialState,
        list: [
          { id: '1', title: 'Thread', upVotesBy: [], downVotesBy: [] },
        ],
      };
      const newState = threadReducer(
        stateWithThread,
        toggleUpVote({ threadId: '1', userId: 'user-1' })
      );

      expect(newState.list[0].upVotesBy).toContain('user-1');
      expect(newState.list[0].downVotesBy).toEqual([]);
    });

    it('should remove user from upVotesBy when already present', () => {
      const stateWithThread = {
        ...initialState,
        list: [
          { id: '1', title: 'Thread', upVotesBy: ['user-1'], downVotesBy: [] },
        ],
      };
      const newState = threadReducer(
        stateWithThread,
        toggleUpVote({ threadId: '1', userId: 'user-1' })
      );

      expect(newState.list[0].upVotesBy).not.toContain('user-1');
    });

    it('should remove from downVotesBy when adding to upVotesBy', () => {
      const stateWithThread = {
        ...initialState,
        list: [
          { id: '1', title: 'Thread', upVotesBy: [], downVotesBy: ['user-1'] },
        ],
      };
      const newState = threadReducer(
        stateWithThread,
        toggleUpVote({ threadId: '1', userId: 'user-1' })
      );

      expect(newState.list[0].upVotesBy).toContain('user-1');
      expect(newState.list[0].downVotesBy).not.toContain('user-1');
    });
  });

  describe('toggleDownVote', () => {
    it('should add user to downVotesBy when not present', () => {
      const stateWithThread = {
        ...initialState,
        list: [
          { id: '1', title: 'Thread', upVotesBy: [], downVotesBy: [] },
        ],
      };
      const newState = threadReducer(
        stateWithThread,
        toggleDownVote({ threadId: '1', userId: 'user-1' })
      );

      expect(newState.list[0].downVotesBy).toContain('user-1');
    });

    it('should remove user from downVotesBy when already present', () => {
      const stateWithThread = {
        ...initialState,
        list: [
          { id: '1', title: 'Thread', upVotesBy: [], downVotesBy: ['user-1'] },
        ],
      };
      const newState = threadReducer(
        stateWithThread,
        toggleDownVote({ threadId: '1', userId: 'user-1' })
      );

      expect(newState.list[0].downVotesBy).not.toContain('user-1');
    });
  });

  describe('toggleNeutralVote', () => {
    it('should remove user from both upVotesBy and downVotesBy', () => {
      const stateWithThread = {
        ...initialState,
        list: [
          { id: '1', title: 'Thread', upVotesBy: ['user-1'], downVotesBy: ['user-2'] },
        ],
      };
      const newState = threadReducer(
        stateWithThread,
        toggleNeutralVote({ threadId: '1', userId: 'user-1' })
      );

      expect(newState.list[0].upVotesBy).not.toContain('user-1');
      expect(newState.list[0].downVotesBy).toEqual(['user-2']);
    });
  });

  describe('toggleCommentUpVote', () => {
    it('should toggle comment up vote', () => {
      const stateWithThread = {
        ...initialState,
        detailMap: {
          '1': {
            id: '1',
            title: 'Thread',
            comments: [
              { id: 'comment-1', upVotesBy: [], downVotesBy: [] },
            ],
          },
        },
      };
      const newState = threadReducer(
        stateWithThread,
        toggleCommentUpVote({ threadId: '1', commentId: 'comment-1', userId: 'user-1' })
      );

      expect(newState.detailMap['1'].comments[0].upVotesBy).toContain('user-1');
    });
  });

  describe('toggleCommentDownVote', () => {
    it('should toggle comment down vote', () => {
      const stateWithThread = {
        ...initialState,
        detailMap: {
          '1': {
            id: '1',
            title: 'Thread',
            comments: [
              { id: 'comment-1', upVotesBy: [], downVotesBy: [] },
            ],
          },
        },
      };
      const newState = threadReducer(
        stateWithThread,
        toggleCommentDownVote({ threadId: '1', commentId: 'comment-1', userId: 'user-1' })
      );

      expect(newState.detailMap['1'].comments[0].downVotesBy).toContain('user-1');
    });
  });

  describe('toggleCommentNeutralVote', () => {
    it('should remove user from both votes', () => {
      const stateWithThread = {
        ...initialState,
        detailMap: {
          '1': {
            id: '1',
            title: 'Thread',
            comments: [
              { id: 'comment-1', upVotesBy: ['user-1'], downVotesBy: ['user-2'] },
            ],
          },
        },
      };
      const newState = threadReducer(
        stateWithThread,
        toggleCommentNeutralVote({ threadId: '1', commentId: 'comment-1', userId: 'user-1' })
      );

      expect(newState.detailMap['1'].comments[0].upVotesBy).not.toContain('user-1');
    });
  });
});