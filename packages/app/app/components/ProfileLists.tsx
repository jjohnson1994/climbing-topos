'use client';

import { List } from '@climbingtopos/types';
import Link from 'next/link';
import { get as getLists } from '@/app/data/actions/lists/get';
import { useGradeHelpers } from '@/app/api/grades';
import { popupError } from '@/app/helpers/alerts';
import Modal from '@/app/components/Modal';
import { useEffect, useState } from 'react';

function ProfileLists() {
  const [userLists, setUserLists] = useState<List[]>([]);
  const [activeList, setActiveList] = useState<List | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const newUserLists = await getLists();
        setUserLists(newUserLists);
      } catch (error) {
        console.error('Error loading user profile', error);
        popupError(
          "Something has gone wrong, your profile couldn't be loaded. sorry",
        );
      }
    };

    fetchLists();
  }, []);

  const handleOpenList = async (listSlug: string) => {
    try {
      const list = await getLists(listSlug);
      setActiveList(list);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading list', error);
      popupError(
        "Something has gone wrong, the list couldn't be loaded. sorry",
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveList(undefined);
  };

  return (
    <>
      <Modal
        title={activeList?.title || ''}
        visible={isModalOpen}
        btnConfirmOnClick={handleCloseModal}
        btnCancelOnClick={handleCloseModal}
        hasConfirmButton={false}
        btnCancelText="Close"
      >
        <>
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
              {activeList?.routes?.map((route) => (
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
        <div
          key={list.slug}
          className="box block"
          onClick={() => handleOpenList(list.slug)}
          style={{ cursor: 'pointer' }}
        >
          <p>
            <b>{list.title}</b>
          </p>
          <span className="tag">Routes {list.routeCount}</span>
        </div>
      ))}
    </>
  );
}

export default ProfileLists;
