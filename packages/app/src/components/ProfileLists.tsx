

import { List, ListRoute } from '@climbingtopos/types';
import { Link } from '@tanstack/react-router';
import { getFn as getLists } from '@/data/actions/lists/get';
import { useGradeHelpers } from '@/api/grades';
import Modal from '@/components/Modal';
import { useEffect, useState } from 'react';
import Button, { Color, Size } from '../elements/Button';
import { deleteRouteFromListFn as deleteRouteFromList } from '@/data/actions/lists/delete';
import { popupError, toastSuccess } from '@/helpers/alerts';

function ProfileLists() {
  const [userLists, setUserLists] = useState<List[]>([]);
  const [activeList, setActiveList] = useState<List | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const newUserLists = await getLists();
        setUserLists(newUserLists as List[]);
      } catch (error) {
        popupError(
          "Something has gone wrong, your profile couldn't be loaded. sorry",
        );
      }
    };

    fetchLists();
  }, []);

  const handleOpenList = async (listSlug: string) => {
    try {
      const list = await getLists({ data: { slug: listSlug } });
      setActiveList(list as List);
      setIsModalOpen(true);
    } catch (error) {
      popupError(
        "Something has gone wrong, the list couldn't be loaded. sorry",
      );
    }
  };

  const handleRemoveFromList = async (route: ListRoute) => {
    setActiveList({
      ...activeList!,
      routes: activeList?.routes.filter(
        (listRoute) => listRoute.slug !== route.slug,
      ) ?? [],
    });

    try {
      const result = await deleteRouteFromList({
        data: {
          listSlug: activeList!.slug,
          cragSlug: route.cragSlug,
          areaSlug: route.areaSlug,
          topoSlug: route.topoSlug,
          routeSlug: route.slug,
        },
      });

      if (result.success) {
        toastSuccess('Route removed from list');
      } else {
        popupError(result.error || 'Failed to remove route from list');
      }
    } catch (error) {
      popupError('An error occurred while removing the route from the list');
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {activeList?.routes?.map((route) => (
                <tr key={route.slug}>
                  <td>
                    <Link
                      to="/crags/$cragSlug/areas/$areaSlug/topos/$topoSlug/routes/$routeSlug"
                      params={{
                        cragSlug: route.cragSlug,
                        areaSlug: route.areaSlug,
                        topoSlug: route.topoSlug,
                        routeSlug: route.routeSlug,
                      }}
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
                  <td className="has-text-right">
                    <Button
                      color={Color.isDanger}
                      size={Size.isSmall}
                      icon="fas fa-trash"
                      onClick={() => handleRemoveFromList(route)}
                    ></Button>
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
