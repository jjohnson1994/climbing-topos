import CreateCrag from './pageContent';
import AuthenticatedRoute from '@/app/components/AuthenticatedRoute';
import { post } from '@/app/data/actions/crags/post';

function CreateCragWrapper() {
  return (
    <AuthenticatedRoute>
      <CreateCrag post={post} />
    </AuthenticatedRoute>
  );
}

export default CreateCragWrapper;
