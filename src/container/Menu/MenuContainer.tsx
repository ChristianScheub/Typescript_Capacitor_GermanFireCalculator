import { useState } from 'react';
import { Menu } from '../../views/MenuView';
import { deleteDataService } from '../../services/deleteData';
import { exportDataService } from '../../services/exportData';
import type { ModalInfo } from '../../types/menu/ModalInfo';

export function MenuContainer() {
  const [openModal, setOpenModal] = useState<ModalInfo | null>(null);

  const handleDeleteAllData = () => setOpenModal('deleteConfirm');

  const handleConfirmDelete = async () => {
    await deleteDataService.deleteAllData();
    setOpenModal('deleteSuccess');
  };

  const handleDeleteSuccessClose = () => {
    setOpenModal(null);
    window.location.reload();
  };

  const handleExportAllData = () => exportDataService.exportFireState();

  return (
    <Menu
      openModal={openModal}
      onOpenModal={setOpenModal}
      onDeleteAllData={handleDeleteAllData}
      onExportAllData={handleExportAllData}
      onConfirmDelete={handleConfirmDelete}
      onDeleteSuccessClose={handleDeleteSuccessClose}
    />
  );
}
