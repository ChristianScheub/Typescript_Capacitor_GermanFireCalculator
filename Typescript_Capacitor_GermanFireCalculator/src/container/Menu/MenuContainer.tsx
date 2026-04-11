import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from '../../views/MenuView';
import { deleteDataService } from '../../services/deleteData';
import { exportDataService } from '../../services/exportData';
import type { ModalInfo } from '../../types/menu/ModalInfo';

export function MenuContainer() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<ModalInfo | null>(null);

  const handleDeleteAllData = async () => {
    if (!confirm(t('info.deleteAllDataConfirm'))) return;
    await deleteDataService.deleteAllData();
    alert(t('info.deleteAllDataSuccess'));
    window.location.reload();
  };

  const handleExportAllData = () => exportDataService.exportFireState();

  return (
    <Menu
      openModal={openModal}
      onOpenModal={setOpenModal}
      onDeleteAllData={handleDeleteAllData}
      onExportAllData={handleExportAllData}
    />
  );
}
