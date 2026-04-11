import { useTranslation } from 'react-i18next';
import { Icon } from '../ui/icons';
import { Modal } from '../ui/modal/Modal';
import { type IconName } from '../types/ui/icons/iconPaths';
import type { NavIconVariant } from '../types/ui/variants';
import Datenschutz from '../legal/datenschutz';
import Impressum from '../legal/impressum';
import UsedLibsListContainer from '../legal/usedLibs/container_usedLibList';
import WithdrawalRules from '../legal/withdrawalRules';
import FireInfoContent from './FireInfoView';
import type { ModalInfo } from '../types/menu/ModalInfo';
import './MenuView.css';

interface NavItem {
  icon: IconName;
  iconVariant: NavIconVariant;
  label: string;
  isExternal?: boolean;
  onClick?: () => void;
}

interface MenuProps {
  openModal: ModalInfo | null;
  onOpenModal: (modal: ModalInfo | null) => void;
  onDeleteAllData: () => void;
  onExportAllData: () => void;
}

function NavList({ items }: { items: NavItem[] }) {
  const { t } = useTranslation();
  return (
    <div className="nav-list">
      {items.map((item, i) => (
        <button key={i} className="nav-list__item" onClick={item.onClick}>
          <span className={`nav-list__icon-box nav-list__icon-box--${item.iconVariant}`}>
            <Icon name={item.icon} size="sm" />
          </span>
          <span className="nav-list__label">{t(item.label)}</span>
          <Icon
            name={item.isExternal ? 'external_link' : 'chevron'}
            size="sm"
            className="nav-list__chevron"
          />
        </button>
      ))}
    </div>
  );
}

export function Menu({ openModal, onOpenModal, onDeleteAllData, onExportAllData }: MenuProps) {
  const { t } = useTranslation();

  const DATA_ITEMS: NavItem[] = [
    { icon: 'trash',  iconVariant: 'red',  label: 'info.deleteAllData', onClick: onDeleteAllData },
    { icon: 'upload', iconVariant: 'gray', label: 'info.exportAllData', onClick: onExportAllData },
  ];

  const KNOWLEDGE_ITEMS: NavItem[] = [
    { icon: 'book',     iconVariant: 'green', label: 'info.fireInformation', onClick: () => onOpenModal('fireInfo') },
    { icon: 'trending', iconVariant: 'green', label: 'info.withdrawalInfo', onClick: () => onOpenModal('withdrawalInfo') },
    { icon: 'sigma',    iconVariant: 'green', label: 'info.calculationInfo' },
    { icon: 'layers',   iconVariant: 'green', label: 'info.usedLibraries', onClick: () => onOpenModal('libraries') },
  ];

  const LEGAL_ITEMS: NavItem[] = [
    { icon: 'shield',    iconVariant: 'green',   label: 'info.privacyPolicy', onClick: () => onOpenModal('privacy') },
    { icon: 'link_icon', iconVariant: 'green',   label: 'info.imprint',       onClick: () => onOpenModal('imprint') },
    { icon: 'code',      iconVariant: 'primary', label: 'info.githubRepo',    isExternal: true, onClick: () => window.open('https://github.com/ChristianScheub/Typescript_Capacitor_GermanFireCalculator', '_blank') },
  ];

  return (
    <div className="screen">
      <div className="screen__content">
        <section className="page-title-section">
          <h1 className="page-heading page-heading--menu">{t('info.pageTitle')}</h1>
        </section>

        <div className="info-warning">
          <div className="info-warning__header">
            <Icon name="warning" size="sm" />
            {t('info.warningTitle')}
          </div>
          <p className="info-warning__text">
            {t('info.warningText')}{' '}
            <strong className="info-warning__bold">{t('info.warningTextBold')}</strong>{' '}
            {t('info.warningText2')}
          </p>
        </div>

        <p className="section-label">{t('info.sectionData')}</p>
        <NavList items={DATA_ITEMS} />

        <p className="section-label section-label--mt">{t('info.sectionKnowledge')}</p>
        <NavList items={KNOWLEDGE_ITEMS} />

        <p className="section-label section-label--mt">{t('info.sectionLegal')}</p>
        <NavList items={LEGAL_ITEMS} />

        <footer className="info-footer">
          <p className="info-footer__tagline">{t('info.footerTagline')}</p>
        </footer>
      </div>

      <Modal
        isOpen={openModal === 'privacy'}
        title={t('info.privacyPolicy')}
        onClose={() => onOpenModal(null)}
      >
        <Datenschutz />
      </Modal>

      <Modal
        isOpen={openModal === 'imprint'}
        title={t('info.imprint')}
        onClose={() => onOpenModal(null)}
      >
        <Impressum />
      </Modal>

      <Modal
        isOpen={openModal === 'libraries'}
        title={t('info.usedLibraries')}
        onClose={() => onOpenModal(null)}
      >
        <UsedLibsListContainer />
      </Modal>

      <Modal
        isOpen={openModal === 'withdrawalInfo'}
        title={t('info.withdrawalInfo')}
        onClose={() => onOpenModal(null)}
      >
        <WithdrawalRules />
      </Modal>

      <Modal
        isOpen={openModal === 'fireInfo'}
        title={t('info.fireInformation')}
        onClose={() => onOpenModal(null)}
      >
        <FireInfoContent />
      </Modal>
    </div>
  );
}
