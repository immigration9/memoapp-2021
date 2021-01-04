import { useQuery, gql } from '@apollo/client';

const GET_LABELS = gql`
  {
    getLabels {
      id
      title
    }
  }
`;
const TestComponent = () => {
  const { loading, error, data } = useQuery(GET_LABELS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.getLabels.map((label: any) => (
    <div>
      {label.id} / {label.title}
    </div>
  ));
};

export default TestComponent;
