import { useState } from 'react';
import { Menu } from '../../views/MenuView';
import { deleteDataService } from '../../services/deleteData';
import { exportDataService } from '../../services/exportData';
import { useFireContext } from '../../context/FireContext';
import type { ModalInfo } from '../../types/menu/ModalInfo';

export function MenuContainer() {
  const [openModal, setOpenModal] = useState<ModalInfo | null>(null);
  const { state, updateField } = useFireContext();

  const handleDeleteAllData = () => setOpenModal('deleteConfirm');

  const handleConfirmDelete = async () => {
    await deleteDataService.deleteAllData();
    setOpenModal('deleteSuccess');
  };

  const handleDeleteSuccessClose = () => {
    setOpenModal(null);
    globalThis.location.reload();
  };

  const handleExportAllData = () => exportDataService.exportFireState();

  const handleToggleAbsoluteNumbers = () =>
    updateField('showAbsoluteNumbers', !state.showAbsoluteNumbers);

  return (
    <Menu
      openModal={openModal}
      onOpenModal={setOpenModal}
      onDeleteAllData={handleDeleteAllData}
      onExportAllData={handleExportAllData}
      onConfirmDelete={handleConfirmDelete}
      onDeleteSuccessClose={handleDeleteSuccessClose}
      showAbsoluteNumbers={state.showAbsoluteNumbers}
      onToggleAbsoluteNumbers={handleToggleAbsoluteNumbers}
    />
  );
}
