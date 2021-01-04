import { gql, IResolvers, ResolveType } from 'apollo-server-express';

import { pickExisting } from '../utils/object';
import api from '../utils/apiInstance';

const createSuccessResponse = (message: string) => ({ message });

export const typeDefs = gql`
  type SuccessResponse {
    message: String
  }

  type Label {
    id: String
    title: String
    updatedAt: String
    createdAt: String
    memos: [Memo!]
  }

  type Memo {
    id: String
    title: String
    content: String
    updatedAt: String
    createdAt: String
    labels: [Label!]
  }
  type Query {
    getMemos: [Memo]
    getLabels: [Label]
    memo(id: String!): Memo
    label(id: String!): Label
  }

  type Mutation {
    addMemo(title: String!, content: String, labelId: String): Memo
    addLabel(title: String): Label
    updateMemo(id: String!, title: String, content: String): Memo
    updateLabel(id: String!, title: String): Label
    deleteMemo(id: String!): SuccessResponse
    deleteLabel(id: String!): SuccessResponse
    linkMemosToLabel(labelId: String!, memoIds: [String!]!): SuccessResponse
    delinkMemosFromLabel(labelId: String!, memoIds: [String!]!): SuccessResponse
  }
`;

export const resolvers: IResolvers = {
  Query: {
    async getMemos() {
      const { data } = await api.get('/memos');
      return data;
    },
    async getLabels() {
      const { data } = await api.get('/labels');
      return data;
    },
    async memo(parent, args) {
      const { data } = await api.get(`/memos/${args.id}`);
      return data;
    },
    async label(parent, args) {
      const { data } = await api.get(`/labels/${args.id}`);
      return data;
    },
  },
  /**
   * Resolver Chain 항목 참조
   * https://www.apollographql.com/docs/apollo-server/data/resolvers/#resolver-chains
   */
  Label: {
    async memos(parent) {
      const { data } = await api.get(`/labels/${parent.id}/memos`);
      return data;
    },
  },
  Memo: {
    async labels(parent) {
      const { data } = await api.get(`/memos/${parent.id}/labels`);
      return data;
    },
  },
  Mutation: {
    async addMemo(parent, { title, content, labelId }) {
      const { data: memo } = await api.post(`/memos`, { title, content });
      if (labelId) {
        const { data: label } = await api.post(`/labels/${labelId}/memos`, {
          memoIds: [memo.id],
        });
      }
      return memo;
    },
    async addLabel(parent, { title }) {
      const { data } = await api.post(`/labels`, { title });
      return data;
    },
    async updateMemo(parent, { id, title, content }) {
      const { data } = await api.put(
        `/memos/${id}`,
        pickExisting({ title, content })
      );
      return data;
    },
    async updateLabel(parent, { id, title }) {
      const { data } = await api.put(`/labels/${id}`, pickExisting({ title }));
      return data;
    },
    async deleteMemo(parent, { id }) {
      const { data } = await api.delete(`/memos/${id}`);

      return createSuccessResponse('Remove Complete');
    },
    async deleteLabel(parent, { id }) {
      const { data } = await api.delete(`/labels/${id}`);
      return createSuccessResponse('Remove Complete');
    },
    async linkMemosToLabel(parent, { labelId, memoIds }) {
      const { data } = await api.post(`/labels/${labelId}/memos`, { memoIds });
      return createSuccessResponse('Linking Complete');
    },
    async delinkMemosFromLabel(parent, { labelId, memoIds }) {
      const { data } = await api.post(`/labels/${labelId}/memos/delete`, {
        memoIds,
      });
      return createSuccessResponse('De-Linking Complete');
    },
  },
};
