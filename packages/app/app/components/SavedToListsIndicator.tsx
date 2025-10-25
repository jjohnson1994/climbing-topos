'use client';

import { useState } from 'react';
import Modal from './Modal';
import { deleteRouteFromList } from '@/app/data/actions/lists/delete';
import { popupError, toastSuccess } from '@/app/helpers/alerts';
import Button, { Color, Size } from '../elements/Button';

interface Props {
  lists: { listSlug: string; listTitle: string }[];
  cragSlug: string;
  areaSlug: string;
  topoSlug: string;
  routeSlug: string;
}

function SavedToListsIndicator({
  lists,
  cragSlug,
  areaSlug,
  topoSlug,
  routeSlug,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedLists, setSavedLists] = useState(lists);
  const [removingListSlug, setRemovingListSlug] = useState<string | null>(null);

  const handleRemoveFromList = async (listSlug: string) => {
    setRemovingListSlug(listSlug);

    try {
      const result = await deleteRouteFromList(
        listSlug,
        cragSlug,
        areaSlug,
        topoSlug,
        routeSlug,
      );

      if (result.success) {
        setSavedLists(savedLists.filter((list) => list.listSlug !== listSlug));
        toastSuccess('Route removed from list');
      } else {
        popupError(result.error || 'Failed to remove route from list');
      }
    } catch (error) {
      console.error('Error removing route from list', error);
      popupError('An error occurred while removing the route from the list');
    } finally {
      setRemovingListSlug(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (savedLists.length === 0) {
    return null;
  }

  return (
    <>
      <span
        className="tag is-success"
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <i className="fas fa-bookmark mr-1"></i>
        Saved to {savedLists.length} list{savedLists.length > 1 ? 's' : ''}
      </span>

      <Modal
        title="Saved to Lists"
        visible={isModalOpen}
        btnConfirmOnClick={handleCloseModal}
        btnCancelOnClick={handleCloseModal}
        hasConfirmButton={false}
        btnCancelText="Close"
      >
        <div>
          {savedLists.length === 0 ? (
            <p>Route has been removed from all lists</p>
          ) : (
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {savedLists.map((list) => (
                  <tr key={list.listSlug}>
                    <td>{list.listTitle}</td>
                    <td className="has-text-right">
                      <Button
                        color={Color.isDanger}
                        size={Size.isSmall}
                        icon="fas fa-trash"
                        onClick={() => handleRemoveFromList(list.listSlug)}
                        disabled={removingListSlug === list.listSlug}
                      >
                        {removingListSlug === list.listSlug ? (
                          <span>Removing...</span>
                        ) : (
                          <span>Remove</span>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Modal>
    </>
  );
}

export default SavedToListsIndicator;
