'use server';

import { List } from '@climbingtopos/types';
import Link from 'next/link';
import { get as getLists } from '@/app/data/actions/lists/get';
import { useGradeHelpers } from '@/app/api/grades';
import { popupError } from '@/app/helpers/alerts';
import Modal from '@/app/components/Modal';
import { auth } from '../actions';

async function ProfileLists({
  searchParams,
}: {
  searchParams: { openList?: string };
}) {
  const user = await auth();

  let userLists: List[] = [];
  let activeList: List;

  const viewingListSlug = searchParams?.openList;
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  if (viewingListSlug) {
    try {
      const newActiveList = await getLists(viewingListSlug);

      setActiveList(newActiveList);
    } catch (error) {
      console.error('Error loading list', error);
      popupError(
        "Something has gone wrong, the list couldn't be loaded. sorry",
      );
    }
  }

  try {
    const newUserLists = await getLists();
    userLists = newUserLists;
  } catch (error) {
    console.error('Error loading user profile', error);
    popupError(
      "Something has gone wrong, your profile couldn't be loaded. sorry",
    );
  } finally {
  }

  const modalTitle = () => {
    return userLists.find(({ slug }) => slug === viewingListSlug)?.title;
  };

  return (
    <>
      <Modal
        title={`${modalTitle()}`}
        visible={viewingListSlug}
        btnConfirmOnClick="/"
        btnCancelOnClick="/"
        hasConfirmButton={false}
        btnCancelText="Close"
      >
        <>
          {
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Crag</th>
                  <th>Type</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {activeList?.routes.map((route) => (
                  <tr key={route.slug}>
                    <td>
                      <Link
                        href={`/crags/${route.cragSlug}/areas/${route.areaSlug}/topos/${route.topoSlug}/routes/${route.routeSlug}`}
                      >
                        {route.title}
                      </Link>
                    </td>
                    <td>{route.cragTitle}</td>
                    <td>{route.routeType}</td>
                    <td>
                      {convertGradeValueToGradeLabel(
                        route.gradeModal,
                        route.gradingSystem,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </>
      </Modal>
      {!userLists.length ? (
        <div className="block box">
          <p>It looks like you haven't created any lists yet</p>
        </div>
      ) : (
        ''
      )}
      {userLists.map((list) => (
        <Link href={`?tab=lists&openList=${list.slug}`}>
          <div key={list.slug} className="box block">
            <p>
              <b>{list.title}</b>
            </p>
            <span className="tag">Routes {list.routeCount}</span>
          </div>
        </Link>
      ))}
    </>
  );
}

export default ProfileLists;
