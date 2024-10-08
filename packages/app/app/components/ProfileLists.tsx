import { List } from "@climbingtopos/types";
import { useEffect, useState } from "react";
import Link from "next/link";
import { lists } from "@/app/api";
import { useGradeHelpers } from "@/app/api/grades";
import useUser from "@/app/api/user";
import { popupError } from "@/app/helpers/alerts";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";

function ProfileLists() {
  const { isAuthenticating, isAuthenticated } = useUser();
  const [userLists, setUserLists] = useState<List[]>([]);
  const [activeList, setActiveList] = useState<List>();
  const [loadingListView, setLoadingListView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listViewModalVisible, setListViewModalVisible] = useState(false);
  const [viewingListSlug, setViewingListSlug] = useState("");
  const { convertGradeValueToGradeLabel } = useGradeHelpers();

  useEffect(() => {
    const getProfileDate = async () => {
      try {
        setLoading(true);
        const newUserLists = await lists.getLists();
        setUserLists(newUserLists);
      } catch (error) {
        console.error("Error loading user profile", error);
        popupError(
          "Something has gone wrong, your profile couldn't be loaded. sorry"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticating === false && isAuthenticated === true) {
      getProfileDate();
    }
  }, [isAuthenticating, isAuthenticated]);

  const btnListRouteOnClick = async (listSlug: string) => {
    try {
      setViewingListSlug(listSlug);
      setLoadingListView(true);
      setListViewModalVisible(true);

      const newActiveList = await lists.getList(listSlug);

      setActiveList(newActiveList);
    } catch (error) {
    } finally {
      setLoadingListView(false);
    }
  };

  const modalTitle = () => {
    return userLists.find(({ slug }) => slug === viewingListSlug)?.title;
  };

  return (
    <>
      <Modal
        title={`${modalTitle()}`}
        visible={listViewModalVisible}
        btnConfirmOnClick={() => setListViewModalVisible(false)}
        btnCancelOnClick={() => setListViewModalVisible(false)}
        hasConfirmButton={false}
        btnCancelText="Close"
      >
        <>
          {loadingListView ? (
            <LoadingSpinner />
          ) : (
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
                        to={`/crags/${route.cragSlug}/areas/${route.areaSlug}/topos/${route.topoSlug}/routes/${route.routeSlug}`}
                      >
                        {route.title}
                      </Link>
                    </td>
                    <td>{route.cragTitle}</td>
                    <td>{route.routeType}</td>
                    <td>
                      {convertGradeValueToGradeLabel(
                        route.gradeModal,
                        route.gradingSystem
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      </Modal>
      {loading && <LoadingSpinner />}
      {!loading && !userLists.length ? (
        <div className="block box">
          <p>It looks like you haven't created any lists yet</p>
        </div>
      ) : (
        ""
      )}
      {!loading &&
        userLists.map((list) => (
          <div
            key={list.slug}
            className="box block"
            onClick={() => btnListRouteOnClick(list.slug)}
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
